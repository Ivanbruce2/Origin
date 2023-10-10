// server.js
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const app = express();
const PORT = 3000;

// Use dotenv to load environment variables
require('dotenv').config();

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION  // Updated line
});

const s3 = new AWS.S3();

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

// Handle file uploads
app.post('/upload', upload.single('banner'), (req, res) => {
    if(req.file) {
        // Parameters for S3 upload
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,  // Updated line
            Key: req.file.originalname,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };

        // Upload to S3
        s3.upload(params, function(err, data) {
            if (err) {
                console.error('Error uploading file: ', err);
                res.status(500).send('Internal server error');
            } else {
                console.log('Successfully uploaded file to S3', data.Location);
                res.send(`File uploaded! <a href="${data.Location}">View file</a>`);
            }
        });
    } else {
        res.status(400).send('File upload failed.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
