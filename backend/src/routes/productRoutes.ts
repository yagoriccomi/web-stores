// backend/routes/productRoutes.js
import express from 'express';
import admin from 'firebase-admin'; // Importa o Firebase Admin SDK
import upload from '../middleware/multer.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Função auxiliar para obter a referência do banco de dados Firestore
const getDb = () => admin.firestore();

// @desc    Criar um novo produto no Firestore
// @route   POST /api/products
// @access  Privado (implementar autenticação depois)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }

    // Faz upload da imagem para o Cloudinary (isso continua igual)
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "nossa-tenda-produtos" },
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

    // Cria o objeto do novo produto para salvar no Firestore
    const newProduct = {
      name,
      description,
      price: parseFloat(price), // Salva o preço como número
      category: category || 'Geral',
      stock: parseInt(stock) || 0,
      imageUrl: result.secure_url,
      cloudinaryImageId: result.public_id,
      createdAt: admin.firestore.FieldValue.serverTimestamp() // Adiciona data de criação
    };

    // Adiciona o novo produto à coleção 'products' no Firestore
    const db = getDb();
    const docRef = await db.collection('products').add(newProduct);

    console.log(`Produto "${name}" criado com ID: ${docRef.id}`);

    // Retorna o produto criado com seu novo ID do Firestore
    res.status(201).json({ id: docRef.id, ...newProduct });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro no servidor ao criar produto.', error: error.message });
  }
});

// @desc    Listar todos os produtos do Firestore
// @route   GET /api/products
// @access  Público
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const productsRef = db.collection('products');
    const snapshot = await productsRef.orderBy('createdAt', 'desc').get(); // Ordena pelos mais recentes

    if (snapshot.empty) {
      return res.status(200).json([]); // Retorna array vazio se não houver produtos
    }

    // Mapeia os documentos para o formato que o frontend espera
    const products = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id, // ID do documento no Firestore
            name: data.name,
            description: data.description,
            // Formata o preço de volta para o formato de moeda brasileira
            price: `R$ ${data.price.toFixed(2).replace('.', ',')}`,
            imageUrl: data.imageUrl,
            category: data.category,
            stock: data.stock,
        }
    });

    res.status(200).json(products);

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar produtos.' });
  }
});

export default router;
