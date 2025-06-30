// web-stores/backend/src/routes/authRoutes.ts

import { Router } from 'express';
// CORREÇÃO: Adicione 'emailPasswordSignUp' à lista de importação
import { googleSignIn, emailPasswordSignIn, logout, getProtectedData, emailPasswordSignUp } from '../controllers/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Rotas de login/registro
router.post('/google-signin', googleSignIn);
router.post('/email-password-signin', emailPasswordSignIn);
router.post('/email-password-signup', emailPasswordSignUp); // Esta linha agora funcionará

// Rota de logout (simples, apenas confirmação)
router.post('/logout', logout);

// Exemplo de Rota Protegida
router.get('/protected', authenticateToken, authorizeRoles(['admin']), getProtectedData);

export default router;