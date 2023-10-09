// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Setup Multer and define where to save the uploaded files
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));

// Handle file uploads
app.post('/upload', upload.single('banner'), (req, res) => {
    if(req.file) {
        res.json({ 
            success: true, 
            link: `http://yourdomain.com/${req.file.path}`
        });
    } else {
        res.json({ success: false });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
