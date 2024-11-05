import { z } from 'zod';

export const BudgetPeriod = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
} as const;

export const budgetSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  amount: z.number().positive(),
  spent: z.number().default(0),
  category: z.string(),
  period: z.enum([BudgetPeriod.MONTHLY, BudgetPeriod.QUARTERLY, BudgetPeriod.YEARLY]),
  startDate: z.date(),
  endDate: z.date(),
  notifications: z.boolean().default(true),
  notificationThreshold: z.number().min(0).max(100).default(80),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Budget = z.infer<typeof budgetSchema>;