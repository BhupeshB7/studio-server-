// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const expressFileUpload = require('express-fileupload');
const portfolioController = require('../controllers/portfolio');

// Enable file uploads with express-fileupload middleware
router.use(expressFileUpload());

// Your route definition
router.post('/create', portfolioController.createPost);
router.get('/posts', portfolioController.getAllPosts);
router.get('/posts/:id', portfolioController.getSinglePost); 
router.delete('/posts/:id', portfolioController.deletePost);
module.exports = router;
