import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BudgetModel } from '$lib/server/models/budget';

export const GET: RequestHandler = async ({ url }) => {
  const active = url.searchParams.get('active');
  
  const budgets = active ? BudgetModel.getActive() : BudgetModel.getAll();
  return json(budgets);
};

export const POST: RequestHandler = async ({ request }) => {
  const budget = await request.json();
  const created = BudgetModel.create(budget);
  return json(created);
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, ...budget } = await request.json();
  const updated = BudgetModel.update(id, budget);
  return json(updated);
};

export const DELETE: RequestHandler = async ({ request }) => {
  const { id } = await request.json();
  BudgetModel.delete(id);
  return json({ success: true });
};