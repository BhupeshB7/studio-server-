const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/upload', videoController.uploadVideo);
router.get('/get', videoController.getVideos);
router.delete('/delete', videoController.deleteVideos);
router.delete('/deleteById/:id', videoController.deleteVideosById);

module.exports = router;
