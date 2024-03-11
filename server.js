// app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const postRoutes = require('./routes/portfolio');
const videoRoutes = require('./routes/videoRoutes');
const contactFormRoutes = require('./routes/contatcForm');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // useFindAndModify: false, 
// });

// const db = mongoose.connection;

// db.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });

// db.once('open', () => {
//   console.log('MongoDB connected successfully');
// });
// Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(error));
app.use(cors(
 { origin:"https://eye-studio-bhupeshb7s-projects.vercel.app/"}
));
app.use(express.json());

app.use('/api/portfolio', postRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/contactForm', contactFormRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
