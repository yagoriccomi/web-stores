// web-stores/backend/src/routes/productRoutes.ts
import express from 'express';
import { adminFirestore } from '../config/firebaseAdminConfig.js'; // Usando Firestore
import upload from '../middleware/multer.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js'; // <-- ADICIONADO

const router = express.Router();
const productsCollection = adminFirestore.collection('products');

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Admin
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
        // CORRIGIDO: Envie o preço como um número.
        price: Number(data.price), 
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

export default router;