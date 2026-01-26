import multer from 'multer';
import cloudinaryStoragePkg from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const { CloudinaryStorage } = cloudinaryStoragePkg;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'quicktask/uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  },
});

const upload = multer({ storage });
export default upload;