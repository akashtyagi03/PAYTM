// here we defined zod validation/schema?
import { z } from 'zod';
 
export const signup = z.object({
  firstname: z.string(),
  lastname: z.string(),
  username: z.string().email(),
  password: z.string().max(6).min(3),
});
 
export const signin = z.object({
  username: z.string().email(),
  password: z.string().min(3).max(6),
});

export const updateuser = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  password: z.string().max(6).min(3).optional()
});