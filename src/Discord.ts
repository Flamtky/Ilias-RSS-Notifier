import axios from 'axios';

/**
 * It takes a string, formats it, and sends it to Discord
 * @param {string} msg - The message you want to send to Discord.
 */
export const sendToDiscord = (msg: string, link: string, timestamp: string) => {
	msg = prepareDiscordMsg(msg, link, timestamp);
	axios.post(process.env.WEBHOOK_URL ?? '', msg, {
		headers: {
			'Content-Type': 'application/json'
		}
	}).catch((err) => {
		console.debug(err.response.status + ' ' + err.response.statusText);
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

	const message = JSON.stringify({
		"embeds": [
		  {
			"title": match?.[1],
			"description": match?.[3].replace('Die Datei', match?.[2]),
			"url": link,
			"color": parseInt(process.env.MESSAGE_COLOR?.replace('#', "0x") ?? '0x003c65'),
			"author": {
				"name": process.env.AUTHOR,
				"url": process.env.AUTHOR_URL,
				"icon_url": process.env.AUTHOR_ICON
			},
			"timestamp": timestamp,
			"thumbnail": {
				"url": process.env.THUMBNAIL
			}
		  }
		]
	});
	return message;
}