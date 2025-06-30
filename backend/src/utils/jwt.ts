import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("ERRO FATAL: A variável de ambiente JWT_SECRET não está definida.");
  process.exit(1);
}

export const generateSessionToken = (uid: string, email: string, name: string | null, roles: string[] = ['user']) => {
  return jwt.sign(
    { uid, email, name, roles },
    JWT_SECRET,
    { expiresIn: '1h' } // Token expira em 1 hora.
  );
};

export const verifySessionToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Token inválido ou expirado
  }
};