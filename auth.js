import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { db } from './db.js';

const scryptAsync = promisify(scrypt);
const COOKIE = 'sessao';
const DURACAO_MS = 7 * 24 * 60 * 60 * 1000;

export async function gerarHash(senha) {
  const sal = randomBytes(16);
  const chave = await scryptAsync(senha, sal, 64);
  return `${sal.toString('hex')}:${chave.toString('hex')}`;
}

export async function conferirSenha(senha, hash) {
  const [salHex, chaveHex] = String(hash).split(':');
  if (!salHex || !chaveHex) return false;
  const chave = await scryptAsync(senha, Buffer.from(salHex, 'hex'), 64);
  return timingSafeEqual(chave, Buffer.from(chaveHex, 'hex'));
}

function lerCookie(req, nome) {
  for (const parte of (req.headers.cookie || '').split(';')) {
    const [k, ...v] = parte.trim().split('=');
    if (k === nome) return decodeURIComponent(v.join('='));
  }
  return null;
}

export function criarSessao(res, usuarioId) {
  const token = randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessoes (token, usuario_id, expira_em) VALUES (?, ?, ?)')
    .run(token, usuarioId, Date.now() + DURACAO_MS);
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: DURACAO_MS,
    path: '/',
  });
}

export function encerrarSessao(req, res) {
  const token = lerCookie(req, COOKIE);
  if (token) db.prepare('DELETE FROM sessoes WHERE token = ?').run(token);
  res.clearCookie(COOKIE, { path: '/' });
}

// Popula req.usuario quando ha sessao valida.
export function carregarUsuario(req, _res, next) {
  const token = lerCookie(req, COOKIE);
  req.usuario = null;
  if (token) {
    const u = db.prepare(`
      SELECT u.id, u.nome, u.email, u.creditos, u.criado_em
      FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
      WHERE s.token = ? AND s.expira_em > ?`).get(token, Date.now());
    if (u) req.usuario = { ...u };
  }
  next();
}

export function exigirLogin(req, res, next) {
  if (!req.usuario) return res.status(401).json({ erro: 'Entre na sua conta para continuar.' });
  next();
}
