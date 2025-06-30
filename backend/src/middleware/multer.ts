import multer from 'multer';
import { Request } from 'express';

// Configuração para armazenar em memória (Cloudinary fará o resto)
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Aceitar apenas imagens
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado! Apenas imagens são permitidas.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limite de 5MB por imagem
  },
  fileFilter: fileFilter,
});

export default upload;