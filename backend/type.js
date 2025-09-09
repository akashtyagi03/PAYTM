// here we defined zod validation/schema?
import { z } from 'zod';
 
export const signup = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  password: z.string().min(3).max(12),
});
 
export const signin = z.object({
  email: z.string(),
  password: z.string().min(3).max(12),
});

export const updateuser = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  password: z.string().min(3).max(12).optional()
});