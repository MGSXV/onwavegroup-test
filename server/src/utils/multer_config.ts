import { Request } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { checkMagicNumber } from "./file_validator";

const DESTINATION = './upload_images/';
const UPLOAD_LIMIT = 20 * 1024 * 1024; // 20MB

const storage = multer.diskStorage({
	destination: DESTINATION,
	filename: (req: Request, file, callback) => {
		callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	}
})

// const storage = multer.memoryStorage();

const file_filter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
	const allowed_types = ['jpeg', 'jpg', 'png', 'gif'];
	if (file.fieldname !== 'image') {
		return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
	}

	

	const file_ext = path.extname(file.originalname).toLowerCase().replace('.', '');
	if (!allowed_types.includes(file_ext))
		return callback(new Error('Only JPEG, JPG, PNG, and GIF files are allowed!'));

	// const is_valid = checkMagicNumber(file.buffer, file_ext);
	// if (!is_valid)
	// 	return callback(new Error('Invalid file type!'));
	else
		return callback(null, true);
};


const upload = multer({
	storage,
	limits: { fileSize: UPLOAD_LIMIT },
	fileFilter: file_filter
});

export default upload;