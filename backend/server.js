import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './app/routes/authRoutes.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

const app = express();

// ✅ Enable cookie parser
app.use(cookieParser());

// ✅ CORS config
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB connection
const MONGO_URI = 'mongodb+srv://nihallegaldoc:Nihal%402020@cluster0.wizo9.mongodb.net/Legaldoc';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ✅ Base route
app.get('/', (req, res) => {
  res.send('🚀 Backend server is running!');
});

// ✅ Auth routes
app.use('/api/auth', authRoutes);

// ✅ File upload config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploaded_files');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// ✅ Upload endpoint
app.post('/api/summarize/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype
    };

    res.json({
      message: 'File uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// ✅ Summarization mock endpoint
app.post('/api/summarize/process', async (req, res) => {
  try {
    const { fileId } = req.body;
    res.json({
      summary: "This is a sample summary of the document.",
      status: "success"
    });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Summarization failed' });
  }
});

// ✅ Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
