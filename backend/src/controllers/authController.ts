// server/src/controllers/authController.ts
import { Request, Response } from 'express';
import { admin } from '../config/firebaseAdminConfig.js';
import { generateSessionToken } from '../utils/jwt';

// Referência ao Realtime Database
const db = admin.database();
const usersRef = db.ref('users'); // Nó 'users' no seu Realtime Database

/// Função auxiliar para salvar/atualizar dados do usuário no Realtime Database
const saveOrUpdateUserData = async (uid: string, email: string, name: string | null) => {
  try {
    // Usamos `update` em vez de `set`. `update` cria os campos se não existirem
    // ou apenas atualiza os existentes, o que é perfeito para nosso caso.
    const userRef = usersRef.child(uid);
    await userRef.update({
      email: email,
      name: name,
      lastLoginAt: admin.database.ServerValue.TIMESTAMP,
    });

    // Garante que o usuário sempre tenha um papel e data de criação na primeira vez.
    // O `transaction` evita condições de corrida ao criar esses campos.
    await userRef.transaction((currentData) => {
      if (currentData === null) {
        return { 
            email: email, 
            name: name,
            lastLoginAt: admin.database.ServerValue.TIMESTAMP,
            createdAt: admin.database.ServerValue.TIMESTAMP, 
            roles: ['user'] 
        };
      }
      if (currentData.roles === undefined) {
        currentData.roles = ['user'];
      }
      if (currentData.createdAt === undefined) {
        currentData.createdAt = admin.database.ServerValue.TIMESTAMP;
      }
      return currentData; // Retorna os dados modificados ou os originais
    });

    console.log(`Dados do usuário ${email} (UID: ${uid}) foram sincronizados no RTDB.`);

  } catch (error) {
    console.error('Erro ao salvar/atualizar dados do usuário no Realtime Database:', error);
  }
};


export const googleSignIn = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'ID Token é necessário.' });
  }

  try {
    // 1. Verificar o ID Token do Firebase (segurança Firebase Auth)
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email || 'N/A';
    const name = decodedToken.name || null;

    // 2. Salvar/Atualizar dados do usuário no Realtime Database
    await saveOrUpdateUserData(uid, email, name);

    // 3. Gerar um token de sessão customizado do seu backend (JWT)
    // Busque os papéis do usuário no banco de dados para incluir no token
    const userSnapshot = await usersRef.child(uid).once('value');
    const userData = userSnapshot.val();
    let roles = ['user']; // Valor padrão
if (userData?.roles) {
  // Se for um objeto (como no seu print), converte para array. Se já for array, também funciona.
  roles = Array.isArray(userData.roles) ? userData.roles : Object.values(userData.roles);
}

    const sessionToken = generateSessionToken(uid, email, name, roles);

    // 4. Retornar o token de sessão para o cliente
    res.status(200).json({
      message: 'Login com Google bem-sucedido e sessão criada.',
      sessionToken: sessionToken,
      uid: uid,
      email: email,
      name: name,
      roles: roles,
    });
  } catch (error: any) {
    console.error('Erro ao verificar ID Token do Google:', error);
    res.status(401).json({ message: 'Não autorizado: ID Token inválido ou expirado.', error: error.message });
  }
};

export const emailPasswordSignIn = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'ID Token é necessário.' });
  }

  try {
    // 1. Verificar o ID Token do Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email || 'N/A';
    const name = decodedToken.name || null; // Nomes podem não vir do email/senha por padrão, dependendo de como você os cria

    // 2. Salvar/Atualizar dados do usuário no Realtime Database
    await saveOrUpdateUserData(uid, email, name);

    // 3. Gerar um token de sessão customizado do seu backend (JWT)
    const userSnapshot = await usersRef.child(uid).once('value');
    const userData = userSnapshot.val();
    const roles = userData?.roles || ['user'];

    const sessionToken = generateSessionToken(uid, email, name, roles);

    // 4. Retornar o token de sessão para o cliente
    res.status(200).json({
      message: 'Login com E-mail/Senha bem-sucedido e sessão criada.',
      sessionToken: sessionToken,
      uid: uid,
      email: email,
      name: name,
      roles: roles,
    });
  } catch (error: any) {
    console.error('Erro ao verificar ID Token de E-mail/Senha:', error);
    res.status(401).json({ message: 'Não autorizado: ID Token inválido ou expirado.', error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
    // Em um cenário de produção, você pode querer invalidar o token de sessão do lado do servidor
    // Por exemplo, mantendo uma lista de tokens invalidados ou forçando o cliente a descartar o token.
    // Para JWTs, a invalidação do lado do servidor é mais complexa, mas o client-side discard é comum.
    // Se você estiver usando cookies de sessão, o logout do Firebase já lidaria com isso.

    // Aqui, apenas confirmamos que o cliente deve descartar seu token.
    res.status(200).json({ message: 'Logout processado. Por favor, descarte seu token de sessão.' });
}


// Exemplo de rota protegida que requer autenticação e uma função específica
export const getProtectedData = async (req: Request, res: Response) => {
  // A requisição já passou pelo `authenticateToken` e `authorizeRoles`
  // então `req.user` estará disponível e teremos certeza de que o usuário é 'admin' ou 'editor'.
  const authenticatedReq = req as any; // Cast para acessar req.user
  res.status(200).json({
    message: 'Dados confidenciais acessados com sucesso!',
    data: {
      info: 'Informação secreta aqui.',
      user: authenticatedReq.user,
    },
  });
};

// Função nova para criar usuário
export const emailPasswordSignUp = async (req: Request, res: Response) => {
  const { email, senha, nome, sobrenome } = req.body;

  if (!email || !senha || !nome) {
    return res.status(400).json({ message: 'Email, senha e nome são obrigatórios.' });
  }

  try {
    // Cria o usuário no Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: senha,
      displayName: `${nome} ${sobrenome || ''}`.trim(),
    });

    // Salva os dados adicionais no Realtime Database (usando a função que você já tem)
    await saveOrUpdateUserData(userRecord.uid, userRecord.email!, userRecord.displayName!);

    res.status(201).json({ 
      message: 'Usuário criado com sucesso!', 
      uid: userRecord.uid 
    });

  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    // Retorna uma mensagem de erro mais amigável
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ message: 'Este email já está em uso.' });
    }
    res.status(500).json({ message: 'Erro interno ao criar usuário.', error: error.message });
  }
};