import dotenv from 'dotenv';
import Parser from 'rss-parser';
import fs from 'fs';
import { getFeed, IliasFeed, sendedMsgs } from './src/IliasFeed';

dotenv.config();

const POLLING_INTERVAL = parseInt(process.env.POLL_INTERVAL || '300') * 1000; // default 5 minutes
if (isNaN(POLLING_INTERVAL) || POLLING_INTERVAL < (30 * 1000)) // Minimum 30 seconds, prevent spam
	throw new Error('POLL_INTERVAL must be greater than 30 seconds');

// load sendedMsgs.txt
if (fs.existsSync('sendedMsgs.txt')) {
	const sendedMsgsString = fs.readFileSync('sendedMsgs.txt', 'utf8');
	sendedMsgsString.split(' ').forEach((hash) => {
		sendedMsgs.push(parseInt(hash));
	});
} else {
	fs.writeFileSync('sendedMsgs.txt', '');
}

const parser: Parser<IliasFeed> = new Parser();

getFeed(parser);
setInterval(()=> {
	getFeed(parser);
}, POLLING_INTERVAL);
