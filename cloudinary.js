import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g., mediaflows_6fc8...
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'AI_Resume_Pro/user_content', // Your App Folder
      resource_type: 'auto',                // This handles pdf + docx
      allowed_formats: ['pdf', 'docx', "png", "jpg", "svg", "xml", "svg+xml, WEBP"],
      public_id: `file_${Date.now()}`,      // Unique name
    };
  },
});

export { cloudinary, storage };