import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { get, run } from './db';

// Secret key for JWT signing
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

// User interface
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

// Registration data interface
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
}

// Login data interface
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Register a new user
 */
export async function registerUser(data: RegistrationData): Promise<User> {
  // Check if user already exists
  const existingUser = await get('SELECT * FROM users WHERE email = ?', [data.email]);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password
  const hashedPassword = await hashPassword(data.password);

  // Insert the user
  const result = await run(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [data.email, hashedPassword, data.name]
  ) as { lastID: number };

  // Get the created user (without password)
  const user = await get('SELECT id, email, name, created_at FROM users WHERE id = ?', [result.lastID]) as User;
  return user;
}

/**
 * Login a user
 */
export async function loginUser(data: LoginData): Promise<{ user: User; token: string }> {
  // Find the user
  const user = await get('SELECT * FROM users WHERE email = ?', [data.email]);
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }

  // Create JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Return user (without password) and token
  const { password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword as User,
    token
  };
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): { userId: number; email: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
  const user = await get('SELECT id, email, name, created_at FROM users WHERE id = ?', [id]) as User | null;
  return user;
}
