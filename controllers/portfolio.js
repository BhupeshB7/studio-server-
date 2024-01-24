// // controllers/postController.js

// const cloudinary = require('cloudinary').v2;
// const Post = require('../models/portfolio');
// const streamifier = require('streamifier');

// cloudinary.config({
//   cloud_name: 'devltqjpd',
//   api_key: '116257978745671',
//   api_secret: 'TAb5EU1RynzDUIWIVslHPpuSBa0',
// });

// const portfolioController = {
//   createPost: async (req, res) => {
//     try {
//       const { title, details, content } = req.body;
//       let images = [];

//       // Check if coverImage and images are provided
//       if (!req.files || !req.files.coverImage || !req.files.images) {
//         return res.status(400).json({ success: false, error: 'Both cover image and post images are required' });
//       }

//       // Check coverImage size before uploading
//       if (req.files.coverImage.size > 500 * 1024) {
//         return res.status(400).json({ success: false, error: 'Cover image size should be less than 500KB' });
//       }

//       const coverImageResult = await uploadToCloudinary(req.files.coverImage.data, 'cover-images');

//       console.log('Cover Image Result:', coverImageResult);

//       // Ensure req.files.images is an array before attempting to iterate
//       if (!Array.isArray(req.files.images)) {
//         req.files.images = [req.files.images];
//       }

//       // Upload post images to Cloudinary
//       for (const file of req.files.images) {
//         if (file.size > 500 * 1024) {
//           return res.status(400).json({ success: false, error: 'Image size should be less than 500KB' });
//         }

//         const result = await uploadToCloudinary(file.data, 'post-images');
//         images.push(result.secure_url);
//       }

//       // Create a new post
//       const newPost = new Post({
//         coverImage: coverImageResult.secure_url,
//         title,
//         details,
//         content,
//         images: images.slice(0, 5), // Limit the number of images to 5
//       });

//       // Save the post to the database
//       await newPost.save();

//       res.json({ success: true, message: 'Post created successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
//   },
// };

// const uploadToCloudinary = (buffer, folder) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
//       if (error) reject(error);
//       else resolve(result);
//     });

//     streamifier.createReadStream(buffer).pipe(stream);
//   });

// //   

// };

// module.exports = portfolioController;








// controllers/postController.js

const cloudinary = require('cloudinary').v2;
const Post = require('../models/portfolio');
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: 'devltqjpd',
  api_key: '116257978745671',
  api_secret: 'TAb5EU1RynzDUIWIVslHPpuSBa0',
});

const portfolioController = {
  createPost: async (req, res) => {
    try {
      const { title, details, content } = req.body;
      let images = [];

      // Check if coverImage and images are provided
      if (!req.files || !req.files.coverImage || !req.files.images) {
        return res.status(400).json({ success: false, error: 'Both cover image and post images are required' });
      }

      // Check coverImage size before uploading
      if (req.files.coverImage.size > 500 * 1024) {
        return res.status(400).json({ success: false, error: 'Cover image size should be less than 500KB' });
      }

      const coverImageResult = await uploadToCloudinary(req.files.coverImage.data, 'cover-images');

      console.log('Cover Image Result:', coverImageResult);

      // Ensure req.files.images is an array before attempting to iterate
      if (!Array.isArray(req.files.images)) {
        req.files.images = [req.files.images];
      }

      // Upload post images to Cloudinary
      for (const file of req.files.images) {
        if (file.size > 500 * 1024) {
          return res.status(400).json({ success: false, error: 'Image size should be less than 500KB' });
        }

        const result = await uploadToCloudinary(file.data, 'post-images');
        images.push(result.secure_url);
      }

      // Create a new post
      const newPost = new Post({
        coverImage: coverImageResult.secure_url,
        title,
        details,
        content,
        images: images.slice(0, 5), // Limit the number of images to 5
      });

      // Save the post to the database
      await newPost.save();

      res.json({ success: true, message: 'Post created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find();
      res.json({ success: true, data: posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  },
  getSinglePost: async (req, res) => {
    const postId = req.params.id;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }

      res.json({ success: true, data: post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  },

  deletePost: async (req, res) => {
    const postId = req.params.id;

    try {
      // Find the post by ID
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }

      // Delete images from Cloudinary
      await deleteFromCloudinary(post.coverImage, 'cover-images');
      for (const imageUrl of post.images) {
        await deleteFromCloudinary(imageUrl, 'post-images');
      }

      // Delete the post from the database
      await Post.findByIdAndDelete(postId);

      res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  },
};

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const deleteFromCloudinary = (imageUrl, folder) => {
  const publicId = imageUrl.match(/\/([^/]+)$/)[1]; // Extract public ID from the Cloudinary URL
  return cloudinary.uploader.destroy(publicId, { folder });
};

module.exports = portfolioController;

