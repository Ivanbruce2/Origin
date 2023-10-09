// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000; // use process.env.PORT for production

// Setup Multer and define where to save the uploaded files
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Serve HTML form at root
app.use(express.static('public'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Handle file uploads
app.post('/upload', upload.single('banner'), (req, res) => {
    if(req.file) {
        res.send(`File uploaded! <a href="/uploads/${req.file.filename}">View file</a>`);
    } else {
        res.status(400).send('File upload failed.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
