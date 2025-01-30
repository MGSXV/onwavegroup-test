import express, { Request, Response } from 'express';
import fs from 'fs';
import upload from './utils/multer_config';
import path from 'path';

const DESTINATION = './upload_images/';

const app = express();
const port = 3000;

if (!fs.existsSync(DESTINATION)) {
	fs.mkdirSync(DESTINATION);
}

app.get('/', (req: Request, res: Response) => {
	res.send('I am working fine!');
});

app.post('/upload', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
	console.log('req.file -------------->');
	if (!req.file) {
		return res.status(400).send('No file uploaded.');
	}
	res.json({
		message: 'File uploaded successfully!',
		file: req.file,
		fileUrl: `http://localhost:${port}/uploads/${req.file.filename}`,
	});
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});