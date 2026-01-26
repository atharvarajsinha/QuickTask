import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import pkg from 'multer-storage-cloudinary';

const { CloudinaryStorage } = pkg;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'quicktask/uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 300, height: 300, crop: 'fill' }
    ],
  },
});

const upload = multer({ storage });

export default upload;