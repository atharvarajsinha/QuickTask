import multer from 'multer';
import pkg from 'multer-storage-cloudinary';
const { CloudinaryStorage } = pkg; // Manually extracting the constructor
import cloudinary from './cloudinary.js';

const StorageClass = CloudinaryStorage || CloudinaryStorage.CloudinaryStorage;

const storage = new StorageClass({
  cloudinary: cloudinary,
  params: {
    folder: 'quicktask/uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  },
});

const upload = multer({ storage });
export default upload;