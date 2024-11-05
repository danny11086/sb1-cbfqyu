import { z } from 'zod';

export const TransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer'
} as const;

export const transactionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE, TransactionType.TRANSFER]),
  amount: z.number().positive(),
  currency: z.string(),
  category: z.string(),
  subcategory: z.string().optional(),
  date: z.date(),
  description: z.string(),
  paymentMethod: z.string(),
  attachments: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Transaction = z.infer<typeof transactionSchema>;