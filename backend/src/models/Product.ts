import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  iconPlaceholder: string;
  imageUrl: string;
  cloudinaryImageId: string;
  stock: number;
}

const productSchema = new Schema(
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
    price: {
      type: Number,
      required: [true, 'Preço do produto é obrigatório'],
    },
    category: {
      type: String,
      default: 'Geral'
    },
    iconPlaceholder: {
      type: String,
      default: '🛍️'
    },
    imageUrl: {
      type: String,
      required: [true, 'URL da imagem do produto é obrigatória'],
    },
    cloudinaryImageId: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;