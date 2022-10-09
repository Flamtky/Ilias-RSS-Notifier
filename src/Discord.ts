import axios from 'axios';

/**
 * It takes a string, formats it, and sends it to Discord
 * @param {string} embededMsg - The message you want to send to Discord.
 * @param {string} link - The link to change.
 * @param {string} timestamp - The timestamp of the message.
 * @returns {Promise<void>} A promise that resolves when the message is sent. It rejects if the message could not be sent.
 */
export const sendToDiscord = (msg: string, link: string, timestamp: string, _depth = 1) => {
	const embededMsg = prepareDiscordMsg(msg, link, timestamp);
	return new Promise<void>((resolve, reject) => {
		axios.post(process.env.WEBHOOK_URL ?? '', embededMsg, {
			headers: {
				'Content-Type': 'application/json'
			}
		}).catch((err) => {
			if (err.response.status === 429 && _depth < 6) { // 429 = Too Many Requests | 5 retries
				const timeout = (err.response.headers['retry-after'] ?? 1) * _depth;
				console.warn(`Got 429 from Discord. Retrying in ${timeout}ms`);
				setTimeout(() => {
					sendToDiscord(msg, link, timestamp, _depth + 1).then(() => {
						resolve();
					}).catch((err) => {
						reject(err);
					});
				}, timeout);
			}
			reject(err);
		}).then((res) => {
			resolve();
		});
	});
};

/**
 * It takes a string, checks if it matches a certain regex, and if it does, it returns a JSON string
 * with the matched groups as values.
 * @param {string} msg - The message that is being sent to Discord.
 * @returns {string} A stringified JSON object.
 */
const prepareDiscordMsg = (msg: string, link: string, timestamp: string):string => {
	const regex = /^\[(.+?)\] (.+): (.+)$/gm;

	const match = regex.exec(msg);
	if (!match)
		return JSON.stringify({
			content: msg
		});
	const date = new Date(timestamp);
	const message = JSON.stringify({
		"embeds": [
		  {
			"title": match?.[1],
			"description": match?.[3].replace('Die Datei', match?.[2]),
			"url": link,
			"color": parseInt(process.env.MESSAGE_COLOR?.replace('#', "0x") ?? '0x003c65'),
			"author": {
				"name": process.env.MESSAGE_AUTHOR,
				"url": process.env.MESSAGE_AUTHOR_URL,
				"icon_url": process.env.MESSAGE_AUTHOR_ICON
			},
			"timestamp": timestamp,
			"footer": {
				"text": (process.env.MESSAGE_FOOTER ?? '#time').replace('#time', date.toLocaleTimeString(undefined, { hour12: false })),
			},
			"thumbnail": {
				"url": process.env.MESSAGE_THUMBNAIL
			}
		  }
		]
	});
	return message;
}