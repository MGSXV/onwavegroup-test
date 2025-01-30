import express, { Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors';
import upload from './utils/multer_config';
import path from 'path';
import pool from './utils/db';

const DESTINATION = './upload_images/';

const app = express();
const port = 3000;

if (!fs.existsSync(DESTINATION)) {
	fs.mkdirSync(DESTINATION);
}

app.use(cors());

app.get('/', (req: Request, res: Response) => {
	res.send('I am working fine!');
});

app.post('/upload', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
	if (!req.file) {
		return res.status(400).send('No file uploaded.');
	}
	res.json({
		message: 'File uploaded successfully!',
		file: req.file,
		fileUrl: `http://localhost:${port}/uploads/${req.file.filename}`,
	});
});

app.get('/uploads', (req: Request, res: Response) => {
	const directoryPath = path.join(__dirname, '../upload_images');
	fs.readdir(directoryPath, (err, files) => {
		if (err) {
		  return res.status(500).json({ message: 'Unable to scan files', error: err });
		}
		const imageUrls = files.map(file => `http://localhost:${port}/uploads/${file}`);
		res.json({ images: imageUrls });
	  });
});

app.use('/uploads/:filename', (req: Request, res: Response) => {
	const filename = req.params.filename;
	const filePath = path.join(__dirname, '../upload_images', filename);
	if (fs.existsSync(filePath)) {
		res.status(200).sendFile(filePath);
	} else {
		console.log('File not found');
	}
})

app.post('/add-user', async (_: Request, res: Response) => {
	try {
		const [rows] = await pool.query(`CALL addUser('${generateRandomEmail()}', '${generateRandomPassword()}', 'admin', 1)`);
		res.status(200).send('User added successfully');
	} catch (error) {
		console.error(error);
        res.status(500).send('Error adding user');
	}
});

app.get('/users', async (_: Request, res: Response) => {
	try {
		const [rows] = await pool.query('SELECT * FROM users');
		res.status(200).json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).send('Error getting users');
	}
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

// generate ranodm email
function generateRandomEmail() {
	const randomString = Math.random().toString(36).substring(2, 15);
	return `${randomString}@mail.com`
}

// generate random password
function generateRandomPassword() {
	return Math.random().toString(36).substring(2, 15);
}