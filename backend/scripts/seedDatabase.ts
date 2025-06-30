// web-stores/backend/scripts/seedDatabase.ts
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminFirestore } from '../src/config/firebaseAdminConfig.js';

// Helper para obter o caminho correto quando se usa Módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para converter o preço de string (ex: "R$ 3.999,90") para número (ex: 3999.90)
function parsePrice(priceString: string): number {
    if (!priceString) return 0;
    const cleanedString = priceString
        .replace('R$', '')    // Remove o "R$"
        .replace(/\./g, '')   // Remove o separador de milhares
        .replace(',', '.')    // Troca a vírgula do decimal por ponto
        .trim();
    return parseFloat(cleanedString);
}

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando o script de seeding...');

        // Carregar o arquivo JSON
        const jsonPath = path.resolve(__dirname, '../../clustered-population.json');
        const fileContent = await fs.readFile(jsonPath, 'utf-8');
        const productsToSeed = JSON.parse(fileContent);

        if (!Array.isArray(productsToSeed)) {
            throw new Error('O arquivo JSON não contém um array de produtos.');
        }

        console.log(`🔎 Encontrados ${productsToSeed.length} produtos no arquivo JSON.`);

        const productsCollection = adminFirestore.collection('products');
        const batch = adminFirestore.batch();

        for (const product of productsToSeed) {
            // Mapeia e transforma os dados do JSON para o formato do Firestore
            const transformedProduct = {
                name: product.produto,
                description: product.descricao,
                price: parsePrice(product.preco), // Converte o preço
                category: product.categoria || 'Geral',
                stock: product.estoque || 0,
                // Usa a primeira imagem como a principal
                imageUrl: product.imagens && product.imagens.length > 0 ? product.imagens[0] : 'https://placehold.co/600x400/cccccc/ffffff?text=Sem+Imagem',
                // O JSON não tem um ID do Cloudinary, então usamos um placeholder
                cloudinaryImageId: `seed-data-${product.id}`,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Adiciona a operação de criação ao lote
            const docRef = productsCollection.doc(); // Cria uma referência com ID automático
            batch.set(docRef, transformedProduct);
        }

        // Executa todas as operações de escrita de uma vez (muito mais rápido)
        await batch.commit();

        console.log(`✅ Sucesso! ${productsToSeed.length} produtos foram adicionados ao Firestore.`);

    } catch (error) {
        console.error('❌ Erro durante o processo de seeding:', error);
        process.exit(1); // Encerra o script com erro
    }
}

// Executa a função
seedDatabase();