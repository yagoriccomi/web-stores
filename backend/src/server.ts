import app from './app.js';
import path from 'path';
import fs from 'fs';
import admin from 'firebase-admin'; // Importe o 'admin' completo

// Função para iniciar o servidor
const startServer = async () => {
    try {
        console.log('Iniciando o servidor...');

        // --- LÓGICA DE INICIALIZAÇÃO DO FIREBASE CORRIGIDA ---
        
        // Verifica se já existe um app do Firebase inicializado
        if (admin.apps.length === 0) {
            console.log('Nenhum app do Firebase encontrado. Inicializando...');

            const isProduction = process.env.RENDER === 'true';
            let serviceAccount;

            if (isProduction) {
                // Em produção (Render)
                const secretFilePath = '/etc/secrets/serviceAccountKey.json';
                console.log(`Ambiente de produção detectado. Lendo secret file de: ${secretFilePath}`);
                if (fs.existsSync(secretFilePath)) {
                    const rawData = fs.readFileSync(secretFilePath, 'utf-8');
                    serviceAccount = JSON.parse(rawData);
                } else {
                    throw new Error('Secret File "serviceAccountKey.json" não foi encontrado no ambiente da Render.');
                }
            } else {
                // Em desenvolvimento (local)
                const dotenv = await import('dotenv');
                dotenv.config();
                
                const localPath = path.resolve('src/config/serviceAccountKey.json');
                console.log(`Ambiente de desenvolvimento detectado. Lendo arquivo de: ${localPath}`);
                if (fs.existsSync(localPath)) {
                    const rawData = fs.readFileSync(localPath, 'utf-8');
                    serviceAccount = JSON.parse(rawData);
                } else {
                    throw new Error(`Arquivo de credenciais local não encontrado em: ${localPath}`);
                }
            }

            // Inicializa o app do Firebase com as credenciais
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });

            console.log('✅ Firebase Admin SDK inicializado com sucesso.');

        } else {
            console.log('✔️ App do Firebase já estava inicializado. Pulando a inicialização.');
        }
        
        // --- FIM DA LÓGICA DO FIREBASE ---

        const PORT = process.env.PORT || 5001;

        app.listen(PORT, () => {
            console.log(`🚀 Servidor pronto e rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Falha crítica ao iniciar o servidor:", error);
        process.exit(1);
    }
};

// Inicia o servidor
startServer();