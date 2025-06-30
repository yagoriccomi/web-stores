import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

console.log('[DEBUG] Tentando inicializar o Firebase com o arquivo local...');

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://web-stores-697d6-default-rtdb.firebaseio.com`
    });
    console.log("✔️ Firebase Admin SDK inicializado com sucesso a partir do arquivo local.");
  }
} catch (error) {
  console.error("❌ ERRO FATAL ao inicializar o Firebase Admin SDK do arquivo local:", error);
  process.exit(1);
}

export const adminAuth = admin.auth();
export const adminDb = admin.database();
export const adminFirestore = admin.firestore();

// ADICIONE ESTA LINHA PARA QUE O CONTROLLER POSSA IMPORTAR O 'admin'
export { admin }; 