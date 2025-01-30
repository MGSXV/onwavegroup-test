import fs from 'fs';

const magicNumbers: { [key: string]: string } = {
	jpeg: 'FFD8FFEE',
	jpg: 'FFD8FFE0',
	png: '89504E47',
	gif: '47494638',
};

// Function to check the magic number of a file
export const checkMagicNumber = (filePath: string, expectedType: string): boolean => {
	const expectedMagicNumber = magicNumbers[expectedType];
	if (!expectedMagicNumber) {
		throw new Error(`Unsupported file type: ${expectedType}`);
	}
	const buffer = Buffer.alloc(expectedMagicNumber.length / 2);
	let fd: number | null = null;
	try {
		fd = fs.openSync(filePath, 'r');
		fs.readSync(fd, buffer, 0, buffer.length, 0);
	} catch (err) {
		console.error('Error reading file:', err);
		return false;
	} finally {
		if (fd !== null) {
		  fs.closeSync(fd);
		}
	}
	const fileMagicNumber = buffer.toString('hex').toUpperCase();
	return fileMagicNumber.startsWith(expectedMagicNumber);
};
