import fs from 'fs';

const magicNumbers: { [key: string]: string } = {
	jpeg: 'FFD8FFEE',
	jpg: 'FFD8FFE0',
	png: '89504E47',
	gif: '47494638',
};

export const checkMagicNumber = (buffer: Buffer, expectedType: string): boolean => {
	const expectedMagicNumber = magicNumbers[expectedType];
	if (!expectedMagicNumber) {
		throw new Error(`Unsupported file type: ${expectedType}`);
	}
	const fileMagicNumber = buffer.toString('hex').toUpperCase();
	return fileMagicNumber.startsWith(expectedMagicNumber);
};
