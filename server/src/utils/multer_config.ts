import { Request } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { checkMagicNumber } from "./file_validator";

const DESTINATION = './upload_images/';
const UPLOAD_LIMIT = 20 * 1024 * 1024; // 20MB

// const storage = multer.diskStorage({
// 	destination: DESTINATION,
// 	filename: (req: Request, file, callback) => {
// 		callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
// 	}
// })

const storage = multer.memoryStorage();

const file_filter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
	const allowed_types = ['jpeg', 'jpg', 'png', 'gif'];
	console.log('11111111111111')
	if (file.fieldname !== 'image') {
		return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
	}
	console.log('2222222222222222')
	const file_ext = path.extname(file.originalname).toLowerCase().replace('.', '');
	console.log('3333333333333333')
	if (!allowed_types.includes(file_ext))
		return callback(new Error('Only JPEG, JPG, PNG, and GIF files are allowed!'));
	console.log('4444444444444444')
	const tmp_file = path.join('./uploads', `temp-${Date.now()}-${file.originalname}`);
	console.log('5555555555555555')
	fs.copyFileSync(file.path, tmp_file);
	fs.writeFileSync(tmp_file, file.buffer);
	console.log('6666666666666666')
	const is_valid = checkMagicNumber(tmp_file, file_ext);
	fs.unlinkSync(tmp_file); 
	if (!is_valid)
		return callback(new Error('Invalid file type!'));
	else
		return callback(null, true);
}

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: UPLOAD_LIMIT },
	fileFilter: file_filter
});

export default upload;