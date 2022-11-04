import Parser from "rss-parser";
import { sendToDiscord } from "./Discord";
import { isSended, addSendedMsg, removeSendedMsg } from "./MessageUtils";
import { hashCode } from "./Utils";

export const sendedMsgs:number[] = [];

export type IliasFeed = {
	title: string;
	link: string;
	description: string;
	items: IliasFeedItem[];
};

export type IliasFeedItem = {
	title: string;
	link: string;
	pubDate: string;
	content: string;
	contentSnippet: string;
	guid: string;
	isoDate: string;
	hash: number;
};


/**
 * It gets the feed from the ILIAS server, sorts it by date, checks if the message is already sent, if
 * not, it sends it to Discord and adds it to the list of sent messages
 * @param feedParser - Parser<IliasFeed> - The parser used to get the feed
 * @returns {Promise<void>} - A promise that resolves when the feed is parsed
 */
export const getFeed = (feedParser: Parser<IliasFeed>):Promise<void> => {
	return new Promise<void>((resolve, _) => {
		feedParser.parseURL(`https://${process.env.USER}:${process.env.PASS}@${process.env.URL}`)
		.then(async (feed) => {
			const sortedFeed = feed.items.sort((b, a) => {
				return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
			});

			const debugDir = new Map<number, string>();
			// if not sended, send message
			for (const item of sortedFeed) {
				item.hash = hashCode(item.guid);
				if (!isSended(item.hash)) {
					debugDir.set(item.hash, item.title);
					try {
						await sendToDiscord(item);
						addSendedMsg(item.hash);
					} catch(err: any) {
						console.warn(`Could not send message to Discord: ${err.response.status + ' ' + err.response.statusText}`);
					}
				}
			};

			// remove old sended messages
			sendedMsgs.forEach((hashMsg) => {
				if (!sortedFeed.some((item) => item.hash === hashMsg)) {
					removeSendedMsg(hashMsg);
				}
			});

			console.table(debugDir.size > 0 ? debugDir : 'No new messages');
			resolve();
		})
		.catch((err: Error) => {
			if (err.message === 'Status code 401') {
				throw new Error('Wrong username or password');
			}
			throw err;
		});
	});
}
