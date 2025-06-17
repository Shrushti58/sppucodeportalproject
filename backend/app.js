require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/mongoose-connection');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require('cors');

// Explicitly add your deployed frontend domain here
const allowedOrigins = [
  'http://localhost:5173',
  'https://sppucodeportal.netlify.app', // ✅ Add this
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));


// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/github', require('./routes/githubRoutes'));
app.use('/api/practicals', require('./routes/practicals'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/submissions', require('./routes/submissions'));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
