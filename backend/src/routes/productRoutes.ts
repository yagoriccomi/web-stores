// web-stores/backend/src/routes/productRoutes.ts
import express from 'express';
import { adminFirestore } from '../config/firebaseAdminConfig.js';
import upload from '../middleware/multer.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
const productsCollection = adminFirestore.collection('products');

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Admin
router.post(
  '/',
  authenticateToken,
  authorizeRoles(['admin']),
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, description, price, category, stock } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
      }
      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "nossa-tenda-produtos" },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        Readable.from(req.file.buffer).pipe(uploadStream);
      });
      if (!result || !result.secure_url) {
        return res.status(500).json({ message: 'Falha ao fazer upload da imagem.' });
      }
      const newProduct = {
        name,
        description,
        price: parseFloat(price),
        category: category || 'Geral',
        stock: parseInt(stock) || 0,
        imageUrl: result.secure_url,
        cloudinaryImageId: result.public_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await productsCollection.add(newProduct);
      res.status(201).json({ id: docRef.id, ...newProduct });
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ message: 'Erro no servidor ao criar produto.', error: error.message });
    }
  }
);

// @desc    Listar todos os produtos (agora do Firestore)
// @route   GET /api/products
// @access  Público
router.get('/', async (req, res) => {
  try {
    const snapshot = await productsCollection.orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return res.json([]);
    }
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: Number(data.price), // Enviando como número
        imageUrl: data.imageUrl,
        category: data.category,
        stock: data.stock,
      };
    });
    res.json(products);
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar produtos.', error: error.message });
  }
});

// @desc    Buscar um único produto por ID
// @route   GET /api/products/:id
// @access  Público
router.get('/:id', async (req, res) => {
  try {
    const doc = await productsCollection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    const data = doc.data()!;
    const product = {
      id: doc.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      imageUrl: data.imageUrl,
      category: data.category,
      stock: data.stock,
    };
    res.json(product);
  } catch (error: any) {
    console.error('Erro ao buscar produto por ID:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar produto.', error: error.message });
  }
});

export default router;