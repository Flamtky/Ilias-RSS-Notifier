/**
 * The hashCode function takes a string and returns a number(hash).
 * @copyright https://stackoverflow.com/questions/194846/is-there-hash-code-function-accepting-any-object-type
 * @param {string} str - The string/message to be hashed
 * @returns A hash code.
 */
export const hashCode = (str: string) => {
	var hash = 0, i, chr;
	if (str.length === 0)
		return hash;
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};
