import fs from 'fs';
import { DATA_PATH } from './MessageUtils';

export const LOGFILE_NAME = "latest.log";
const LOGFILE_PATH = DATA_PATH + LOGFILE_NAME;

// Logging
// Rename log.txt to {createdDate}.log
let logFile:any = null;
const createLogFile = () => {
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
	logFile = fs.createWriteStream(LOGFILE_PATH, { flags: 'a' });
}

const logStdout = process.stdout;
const errorStdout = process.stderr;

console.warn = (...args: any[]) => {
	if (logFile === null) createLogFile();
	let str = new Date().toISOString() + ' [WARN] ' + args.join(' ') + '\n ' + new Error().stack + '\n '
	logFile.write(str);
	logStdout.write(str);
};
console.error = (...args: any[]) => {
	if (logFile === null) createLogFile();
	let str = new Date().toISOString() + ' [ERROR] ' + args.join(' ') + '\n ' + new Error().stack + '\n '
	logFile.write(str);
	errorStdout.write(str);
};
