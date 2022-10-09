import fs from 'fs';
import { sendedMsgs } from './IliasFeed';

/**
 * It adds a number to an array, then writes the array to a file
 * @param {number} msg - number - The message Hash to add to the array
 */
export const addSendedMsg = (msg: number) => {
	if (isNaN(msg)) throw new Error('Given msg hash is not a number');
	sendedMsgs.push(msg);
	fs.writeFileSync('sendedMsgs.txt', sendedMsgs.join(' '));
};

/**
 * It returns true if the number passed to it is in the array of numbers called sendedMsgs
 * @param {number} msg - The message Hash to check
 * @returns {boolean} - true if the number is in the array, false if not
 */
export const isSended = (msg: number) => {
	if (isNaN(msg)) throw new Error('Given msg hash is not a number');
	return sendedMsgs.includes(msg);
};

/**
 * It removes a message from the sendedMsgs array and saves the array to a file
 * @param {number} msg - The message Hash to remove from the sendedMsgs array.
 */
export const removeSendedMsg = (msg: number) => {
	if (isNaN(msg)) throw new Error('Given msg hash is not a number');
	sendedMsgs.splice(sendedMsgs.indexOf(msg), 1);
	fs.writeFileSync('sendedMsgs.txt', sendedMsgs.join(' '));
};
