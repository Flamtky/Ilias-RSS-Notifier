import dotenv from 'dotenv';
import Parser from 'rss-parser';
import fs from 'fs';
import { getFeed, IliasFeed, sendedMsgs } from './src/IliasFeed';

dotenv.config();

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
}, 1000 * 60 * 5);
