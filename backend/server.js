// backend/server.js
import dotenv from 'dotenv';
const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  console.error('Erro ao carregar o arquivo .env:', dotenvResult.error);
}

// Logs para verificar variáveis (mantenha para este teste)
console.log('--- Variáveis de Ambiente em server.js (após dotenv.config) ---');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Presente' : 'Ausente ou vazia');
console.log('-------------------------------------------------------------');

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import cloudinary from './config/cloudinary.js'; // Importe a instância não configurada

// CONFIGURE O CLOUDINARY AQUI:
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('Cloudinary configurado em server.js.');
} else {
  console.error('!!! Variáveis do Cloudinary não estão definidas. Cloudinary NÃO foi configurado. !!!');
}

// Conectar ao MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/', (req, res) => {
  res.send('API Nossa Tenda está rodando...');
});

app.use('/api/products', productRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});