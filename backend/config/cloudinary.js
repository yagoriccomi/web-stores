// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

// NÃO configure aqui
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

export default cloudinary; // Exporte a instância não configurada