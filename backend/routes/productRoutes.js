// backend/routes/productRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import upload from '../middleware/multer.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Privado (implementar autenticação/autorização depois)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock, iconPlaceholder } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }

    // Fazer upload da imagem para o Cloudinary
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "nossa-tenda-produtos" }, // Opcional: pasta no Cloudinary
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            }
        );
        uploadStream.end(req.file.buffer);
    });


    if (!result || !result.secure_url) {
        return res.status(500).json({ message: 'Falha ao fazer upload da imagem para o Cloudinary.' });
    }

    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price), // Converter para número
      category,
      stock: parseInt(stock) || 0,
      iconPlaceholder: iconPlaceholder || '🛍️',
      imageUrl: result.secure_url,
      cloudinaryImageId: result.public_id,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    // Tratamento de erro de validação do Mongoose
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Erro no servidor ao criar produto.', error: error.message });
  }
});

// @desc    Listar todos os produtos
// @route   GET /api/products
// @access  Público
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    // Mapear para o formato esperado pelo frontend, especialmente o preço
    const formattedProducts = products.map(p => ({
        id: p._id, // Mongoose usa _id
        name: p.name,
        description: p.description,
        price: `R$ ${p.price.toFixed(2).replace('.', ',')}`, // Formatando preço
        iconPlaceholder: p.iconPlaceholder,
        imageUrl: p.imageUrl,
        category: p.category,
        stock: p.stock,
        // Adicione outros campos se necessário
    }));
    res.json(formattedProducts);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar produtos.' });
  }
});

// TODO: Adicionar rotas para GET /:id, PUT /:id, DELETE /:id

export default router;