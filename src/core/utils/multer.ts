import multer, { StorageEngine } from "multer";
import { Request } from "express";

const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/core/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const fileSize = {
    limits: { fileSize: 1024 * 1024 * 10 }
};

const upload = multer({
    storage,
    fileFilter,
    limits: fileSize.limits,
});


export default upload;
