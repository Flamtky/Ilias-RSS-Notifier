import fs from 'fs';
import { DATA_PATH } from './MessageUtils';

export const LOGFILE_NAME = "latest.log";
const LOGFILE_PATH = DATA_PATH + LOGFILE_NAME;

// Logging
// Rename log.txt to {createdDate}.log
if (fs.existsSync(LOGFILE_PATH)) {
	const fileCreatedDate = fs.statSync(LOGFILE_PATH).birthtime;
	// YYYY-MM-DD_HH-mm-ss
	let newFileName = fileCreatedDate.toLocaleString('sv', { timeZoneName: 'short' })
		.replace(/:/g, '-')
		.replace(/ /g, '_')
		.replace(/_(?!.*_.*).*$/, '');
	newFileName += '.log';
	fs.renameSync(LOGFILE_PATH, DATA_PATH + newFileName);
}

const logFile = fs.createWriteStream(LOGFILE_PATH, { flags: 'a' });
const logStdout = process.stdout;
const errorStdout = process.stderr;

console.warn = (...args: any[]) => {
	logFile.write(new Date().toISOString() + ' [WARN] ' + args.join(' ') + ' ' + new Error().stack);
	logStdout.write(new Date().toISOString() + ' [WARN] ' + args.join(' ') + '	' + new Error().stack);
};
console.error = (...args: any[]) => {
	logFile.write(new Date().toISOString() + ' [ERROR] ' + args.join(' ') + ' ' + new Error().stack);
	errorStdout.write(new Date().toISOString() + ' [ERROR] ' + args.join(' ') + '	' + new Error().stack);
};
