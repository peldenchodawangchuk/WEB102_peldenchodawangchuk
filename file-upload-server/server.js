const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

//Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

//Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(morgan('dev')); // HTTP request logging

//Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        //Create unique filename
        const timestamp = Date.now();
        const originalName = file.originalname;
        cb(null, `${originalName}`);
    }
});

//Configure file filter
const fileFilter = (req, file, cb) => {
    //Accept only specific file types (e.g., images and PDFs)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

//Initialize multer with storage and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    },
    fileFilter: fileFilter
});

//Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

//File upload route
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        //Check if file exists
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('File received:', req.file.originalname);
        console.log('File path:', req.file.mimetype);

        //Success response with fiel details
        return res.status(200).json({
            message: 'File uploaded successfully',
            filename: req.file.originalname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: '/uploads/' + req.file.filename
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//Error handling for multer errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size exceeds the limit of 5MB' });
        }
        return res.status(400).json({ error: err.message });
    }

    //For any other errors
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

//basic route
app.get('/', (req, res) => {
    res.send('File Upload Server is running');
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

