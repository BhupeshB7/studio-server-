const Video = require('../models/Video');

exports.uploadVideo = async (req, res) => {
    try {
        const { title, videoLink } = req.body;
        const newVideo = new Video({ title, videoLink });
        await newVideo.save();
        res.json({ success: true, message: 'Video uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.json({ success: true, videos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
exports.deleteVideos = async (req, res) => {
    try {
        // Assuming `Video` is your Mongoose model
        await Video.deleteMany({}); // Delete all videos
        
        res.json({ success: true, message: 'All videos deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
exports.deleteVideosById = async(req,res)=>{
    const videoId = req.params.id;
    try {
        const video = await Video.findById(videoId);
        if(!video){
            return res.status(404).json({success: false, error: 'Video not found'});
        }
        await Video.findByIdAndDelete(video);
        res.status(200).json({success: true, message: 'Video deleted successfully',video});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Internal Server Error'});
    }
}
