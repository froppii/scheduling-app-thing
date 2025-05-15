import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ParsedQs } from 'qs'; // Import ParsedQs

const router = express.Router();

const users: { email: string; password: string }[] = [];

const secretKey = process.env.JWT_SECRET || 'default-secret-key';

interface AuthRequestBody {
  email: string;
  password: string;
}

router.post('/signup', async (req: Request<{}, {}, AuthRequestBody, ParsedQs>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ email, password: hashedPassword });

  return res.status(201).json({ message: 'User created!' });
});

router.post('/login', async (req: Request<{}, {}, AuthRequestBody, ParsedQs>, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

  return res.status(200).json({ message: 'Login successful', token });
});

export default router;
