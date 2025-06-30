// server/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifySessionToken } from '../utils/jwt';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    name: string | null;
    roles: string[];
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Token de autenticação ausente.' });
  }

  const decoded = verifySessionToken(token);

  if (!decoded) {
    return res.status(403).json({ message: 'Token de autenticação inválido ou expirado.' });
  }

  // Anexa os dados do usuário à requisição
  req.user = decoded as AuthenticatedRequest['user'];
  next();
};

// Exemplo de middleware para Role-Based Access Control (RBAC)
export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: 'Acesso negado: informações de papel ausentes.' });
    }

    const hasPermission = req.user.roles.some(role => allowedRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({ message: 'Acesso negado: você não tem as permissões necessárias.' });
    }

    next();
  };
};