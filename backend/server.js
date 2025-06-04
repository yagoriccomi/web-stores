// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';

// Carregar variáveis de ambiente do arquivo .env na raiz da pasta backend
dotenv.config();

// Conectar ao MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Permite requisições do seu frontend
  credentials: true // Se você for usar cookies/sessões no futuro
}));
app.use(express.json()); // Para parsear JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulário URL-encoded

// Rotas
app.get('/', (req, res) => {
  res.send('API Nossa Tenda está rodando...');
});

app.use('/api/products', productRoutes);

// Middleware de tratamento de erros (exemplo básico)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});