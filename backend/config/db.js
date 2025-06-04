// backend/config/db.js
import mongoose from 'mongoose';
// import dotenv from 'dotenv'; // <--- REMOVA ou comente esta linha
// dotenv.config({ path: '../.env' }); // <--- REMOVA ou comente esta linha

const connectDB = async () => {
  try {
    // Adicione logs aqui também para depuração, se necessário
    // console.log('MONGO_URI (em db.js):', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;