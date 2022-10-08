/**
 * The hashCode function takes a string and returns a number(hash).
 * @param {string} m - The message to be hashed
 * @returns A hash code.
 */
export const hashCode = (m: string) => {
	var hash = 0, i, chr;
	if (m.length === 0)
		return hash;
	for (i = 0; i < m.length; i++) {
		chr = m.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};
