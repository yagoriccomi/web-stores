// backend/config/db.js
import mongoose from 'mongoose';
// import dotenv from 'dotenv'; // Removido
// dotenv.config({ path: '../.env' }); // Removido

const connectDB = async () => {
  try {
    // process.env.MONGO_URI já estará disponível
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser e useUnifiedTopology são obsoletos e podem ser removidos
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;