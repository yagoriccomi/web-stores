// backend/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome do produto é obrigatório'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Descrição do produto é obrigatória'],
    },
    price: { // Armazenaremos como Number para cálculos, formataremos no frontend se necessário
      type: Number,
      required: [true, 'Preço do produto é obrigatório'],
    },
    category: { // Adicionando categoria como exemplo
        type: String,
        default: 'Geral'
    },
    iconPlaceholder: { // Mantendo para compatibilidade inicial ou fallback
        type: String,
        default: '🛍️'
    },
    imageUrl: {
      type: String,
      required: [true, 'URL da imagem do produto é obrigatória'],
    },
    cloudinaryImageId: { // Para poder deletar a imagem do Cloudinary no futuro
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    // Adicione outros campos conforme necessário (ex: marca, tamanhos, cores)
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

// Método para formatar o preço para a string "R$ XX,YY" se necessário no backend
// Ou, preferencialmente, envie o número e formate no frontend
// productSchema.virtual('formattedPrice').get(function() {
//   return `R$ ${this.price.toFixed(2).replace('.', ',')}`;
// });

const Product = mongoose.model('Product', productSchema);

export default Product;