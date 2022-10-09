import Parser from "rss-parser";
import { sendToDiscord } from "./Discord";
import { isSended, addSendedMsg, removeSendedMsg } from "./MessageUtils";
import { hashCode } from "./Utils";

export const sendedMsgs:number[] = [];

export type IliasFeed = {
	title: string;
	link: string;
	description: string;
	items: {
		title: string;
		link: string;
		pubDate: string;
		content: string;
		contentSnippet: string;
		guid: string;
		isoDate: string;
		hash: number;
	}[];
};

/**
 * It gets the feed from the ILIAS server, sorts it by date, checks if the message is already sent, if
 * not, it sends it to Discord and adds it to the list of sent messages
 * @param feedParser - Parser<IliasFeed> - The parser used to get the feed
 */
export const getFeed = (feedParser: Parser<IliasFeed>) => {
	feedParser.parseURL(`https://${process.env.USER}:${process.env.PASS}@${process.env.URL}`)
	.then((feed) => {
		const sortedFeed = feed.items.sort((a, b) => {
			return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
		});

		const debugDir = new Map<number, string>();
		// if not sended, send message
		sortedFeed.forEach((item) => {
			item.hash = hashCode(item.guid);
			if (!isSended(item.hash)) {
				debugDir.set(item.hash, item.title);
				sendToDiscord(item.title, item.link, item.isoDate);
				addSendedMsg(item.hash);
			}
		});

		// remove old sended messages
		sendedMsgs.forEach((hashMsg) => {
			if (!sortedFeed.some((item) => item.hash === hashMsg)) {
				removeSendedMsg(hashMsg);
			}
		});

		console.table(debugDir);
	})

}