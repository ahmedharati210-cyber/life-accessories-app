import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'default-secret-change-me';

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  loginTime: number;
}

export function createAdminSession(username: string): string {
  const sessionData: AdminSession = {
    isAuthenticated: true,
    username,
    loginTime: Date.now(),
  };
  
  const sessionString = JSON.stringify(sessionData);
  const key = crypto.scryptSync(ADMIN_SESSION_SECRET, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(sessionString, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Combine IV + encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

export function verifyAdminSession(sessionToken: string): AdminSession | null {
  try {
    const parts = sessionToken.split(':');
    if (parts.length !== 2) {
      return null;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const key = crypto.scryptSync(ADMIN_SESSION_SECRET, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    const sessionData: AdminSession = JSON.parse(decrypted);
    
    // Check if session is expired (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (Date.now() - sessionData.loginTime > maxAge) {
      return null;
    }
    
    return sessionData;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin-session')?.value;
  
  if (!sessionToken) {
    return null;
  }
  
  return verifyAdminSession(sessionToken);
}

export async function requireAdminAuth(): Promise<AdminSession> {
  const session = await getAdminSession();
  
  if (!session || !session.isAuthenticated) {
    redirect('/harati/login');
  }
  
  return session;
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + ADMIN_SESSION_SECRET).digest('hex');
}
