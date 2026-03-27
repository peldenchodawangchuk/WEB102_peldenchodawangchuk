const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const e = require('express');
require('dotenv').config();

//initialize express app
const app = express();
const PORT = process.env.PORT || 8000;

//CORS
app.use(cors({
    origin: process.env.FRONTEND_ULR || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

//Middleware
app.use(express.json());
app.use(morgan('dev')); //HTTP request logging

//Create uploads directory if it doesnt exist
const uploadDir = path.join(__dirname, 'uploads');
if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
}

//Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

//Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename:function (req, file, cb) {
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\s+/g, '-');
        cb(null, '${originalName}');
    }
});

//configure file filter
const fileFilter = (req, file, cb) => {
    //Accept only specific mime types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }   else {
        cb (new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'), false);
    }
};

//Multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //%MB in bytes
    },
    fileFilter: fileFilter
});

//Basic route for testing
app.get('/', (req, res) => {
    res.send('File Upload Server is running');
});

//Upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        //Check if file exists
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded'});
        }

        console.log('File received:', req.file.originalname);
        console.log('File type:', req.file.mimetype);

        //Success response with file details
        return res.status(200).json({
            message: 'File Uploaded successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: '/uploads/${req.file.filename}'
        });
    }   catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({error:error.message});
    }
});

//Error handling for multer errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        //A Multer error ocurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
            return ResizeObserver.status(413).json({ error: 'File too large. Maximum size is 5MB.'});
        }
        return res.status(400).json({ error: err.message});
    }

    //For any other errors
    console.error(err);
    res.status(500).json({ error: 'Server error'});
});

//Start the server
app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});

