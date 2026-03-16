import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

// Ensure upload directories exist
const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const UPLOAD_BASE = process.env.UPLOAD_DIR || './uploads';

// Allowed file types
const ALLOWED_RFQ_TYPES = ['.pdf', '.dwg', '.dxf', '.jpg', '.jpeg', '.png', '.docx', '.doc', '.xlsx', '.xls'];
const ALLOWED_RESUME_TYPES = ['.pdf', '.doc', '.docx'];
const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Storage: RFQ attachments
const rfqStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(UPLOAD_BASE, 'rfq');
        ensureDir(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `rfq-${uniqueSuffix}${ext}`);
    },
});

// Storage: Resumes
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(UPLOAD_BASE, 'resumes');
        ensureDir(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `resume-${uniqueSuffix}${ext}`);
    },
});

// Storage: Documents
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(UPLOAD_BASE, 'documents');
        ensureDir(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `doc-${uniqueSuffix}${ext}`);
    },
});

// File filter factory
const makeFileFilter = (allowedTypes: string[]) => (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new AppError(400, `File type "${ext}" is not allowed. Allowed: ${allowedTypes.join(', ')}`));
    }
};

// RFQ file upload (up to 10 files, 10MB each)
export const uploadRFQFiles = multer({
    storage: rfqStorage,
    fileFilter: makeFileFilter(ALLOWED_RFQ_TYPES),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10,
    },
}).array('attachments', 10);

// Resume upload (single file, 5MB)
export const uploadResume = multer({
    storage: resumeStorage,
    fileFilter: makeFileFilter(ALLOWED_RESUME_TYPES),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1,
    },
}).single('resume');

// Document upload (single file, 50MB)
export const uploadDocument = multer({
    storage: documentStorage,
    fileFilter: makeFileFilter([...ALLOWED_RFQ_TYPES, ...ALLOWED_IMAGE_TYPES]),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 1,
    },
}).single('file');

/**
 * Middleware to handle multer errors gracefully
 */
export const handleUploadError = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError(400, 'File too large. Maximum size exceeded.'));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return next(new AppError(400, 'Too many files. Maximum file count exceeded.'));
        }
        return next(new AppError(400, `Upload error: ${err.message}`));
    }
    next(err);
};

/**
 * Map uploaded files to response format
 */
export const mapUploadedFiles = (files: Express.Multer.File[]) => {
    return files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
    }));
};
