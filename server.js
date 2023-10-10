// Import necessary AWS v3 modules
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');
const express = require('express');
const app = express();
const PORT = 3000;

// Configuring AWS S3 Client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Multer configuration for storing file in memory
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

app.use(express.static('public'));

// Handling file uploads
app.post('/upload', upload.single('banner'), async (req, res) => {
    if(req.file) {
        // Parameters for S3 upload
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: req.file.originalname,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };

        // Upload to S3
        try {
            const command = new PutObjectCommand(params);
            const data = await s3.send(command);
            console.log('Successfully uploaded file to S3');
            res.send(`File uploaded! <a href="https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}" target="_blank">View file</a>`);
        } catch (err) {
            console.error('Error uploading file: ', err);
            res.status(500).send('Internal server error');
        }
    } else {
        res.status(400).send('File upload failed.');
    }
});

// Starting server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
