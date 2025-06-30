// Não é mais necessário importar ou configurar o dotenv aqui

import app from './app.js';
import connectDB from './config/db.js';

const startServer = async () => {
    try {
        console.log('Iniciando o servidor...');

        // Conectar ao MongoDB
        await connectDB();

        // Inicializar o Firebase Admin
        console.log('Inicializando o Firebase Admin SDK...');
        await import('./config/firebaseAdminConfig.js');

        const PORT = process.env.PORT || 5001;

        app.listen(PORT, () => {
            console.log(`🚀 Servidor pronto e rodando em http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Falha crítica ao iniciar o servidor:", error);
        process.exit(1);
    }
};

startServer();