import axios from "axios";
import {IliasFeedItem} from "./IliasFeed";

/**
 * It takes a string, formats it, and sends it to Discord
 * @param {item} item - IliasFeedItem
 */
export const sendToDiscord = (item: IliasFeedItem, _depth = 1) => {
	const embededMsg = prepareDiscordMsg(item);
	return new Promise<void>((resolve, reject) => {
		axios.post(process.env.WEBHOOK_URL ?? '', embededMsg, {
			headers: {
				"Content-Type": "application/json",
			}
		}).catch((err) => {
			if (err.response.status === 429 && _depth < 6) { // 429 = Too Many Requests | 5 retries
				const timeout = (err.response.headers['retry-after'] ?? 1) * _depth;
				console.warn(`Got 429 from Discord. Retrying in ${timeout}ms`);
				setTimeout(() => {
					sendToDiscord(item).then(() => {
						resolve();
					}).catch((err) => {
						reject(err);
					});
				}, timeout);
			} else {
				reject(err);
			}
		}).then((res) => {
			resolve();
		});
    });
};

const prepareEmbededMsg = (title: string, text: string, link: string, color: number | string, timestamp: string,type: string) => {
	const msgColor = 
			typeof color === "number"
			? color
			: parseInt(color.replace("#", "0x") ?? "0x003c65");
	const date = new Date(timestamp);
	return JSON.stringify({
		embeds: [
			{
				title: title,
				description: text,
				url: link,
				color: msgColor,
				author: {
					name: process.env.MESSAGE_AUTHOR,
					url: process.env.MESSAGE_AUTHOR_URL,
					icon_url: process.env.MESSAGE_AUTHOR_ICON,
				},
				timestamp: timestamp,
				footer: {
					text: (process.env.MESSAGE_FOOTER ?? "#time").replace(
						"#time",
						date.toLocaleTimeString(undefined, {hour12: false})
					),
				},
				thumbnail: {
					url:
						type === "newFile"
							? process.env.MESSAGE_THUMBNAIL_NEWFILE
							: process.env.MESSAGE_THUMBNAIL_FORUM
							?? process.env.MESSAGE_THUMBNAIL,
				},
			},
		],
	});
};

/**
 * Prepares a message for a new file.
 * @param {RegExpExecArray} match - The regex match
 * @param {string} link - The link to the file
 * @param {string} timestamp - The timestamp of the message.
 * @param {Date} date - Date - The date of the message
 * @returns A JSON string.
 */
const prepareMsgNewFile = (match: RegExpExecArray, item: IliasFeedItem) => {
	const link = item.link;
	const timestamp = item.isoDate;
	return prepareEmbededMsg(
		match?.[1],
		match?.[3].replace("Die Datei", match?.[2]),
		link,
		parseInt(
			process.env.MESSAGE_COLOR_NEWFILE?.replace("#", "0x") ?? "0x003c65"
		),
		timestamp,
		"newFile"
	);
};

/**
 * It takes an item from the RSS feed and returns a Discord embed message
 * @param {IliasFeedItem} item - IliasFeedItem
 * @returns A Discord embeded message
 */
const prepareMsgForum = (item: IliasFeedItem) => {
	const link = item.link;
	const timestamp = item.isoDate;
	let content = item.content.replace(/<[^>]*>?/gm, ''); // remove html tags
	content = content.replaceAll('\n', ''); // remove newlines
	content = content.replaceAll('\r', ''); // remove carriage returns
	return prepareEmbededMsg(
		item.title,
		content,
		link,
		parseInt(process.env.MESSAGE_COLOR_FORUM?.replace("#", "0x") ?? "0x003c65"),
		timestamp,
		"forum"
	);
};

/**
 * It takes a string, checks if it matches a certain regex, and if it does, it returns a JSON string
 * with the matched groups as values.
 * @param {IliasFeedItem} item - IliasFeedItem
 * @returns {string} A stringified JSON object.
 */
const prepareDiscordMsg = (item: IliasFeedItem): string => {
	const msgTypes = ["newFile", "forum"];

	const regexNewFile = /^\[(.+?)\] (.+): (.+)$/gm; // New File Posted [Course Name] [File Name]: [File Description]
	const matchNewFile = regexNewFile.exec(item.title);

	const currType = matchNewFile
		? msgTypes[0]
		: item.contentSnippet.length > 0
		? msgTypes[1]
		: null; // check if new file -> check if message available -> else null

	switch (currType) {
		case msgTypes[0]:
			if (matchNewFile) {
				return prepareMsgNewFile(matchNewFile, item);
			}
		case msgTypes[1]:
			return prepareMsgForum(item);
	}

	return JSON.stringify({
		content: item.title,
	});
};
