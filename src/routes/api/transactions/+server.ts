import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { TransactionModel } from '$lib/server/models/transaction';

export const GET: RequestHandler = async ({ url }) => {
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  const category = url.searchParams.get('category');

  let transactions;

  if (startDate && endDate) {
    transactions = TransactionModel.getByDateRange(new Date(startDate), new Date(endDate));
  } else if (category) {
    transactions = TransactionModel.getByCategory(category);
  } else {
    transactions = TransactionModel.getAll();
  }

  return json(transactions);
};

export const POST: RequestHandler = async ({ request }) => {
  const transaction = await request.json();
  const created = TransactionModel.create(transaction);
  return json(created);
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, ...transaction } = await request.json();
  const updated = TransactionModel.update(id, transaction);
  return json(updated);
};

export const DELETE: RequestHandler = async ({ request }) => {
  const { id } = await request.json();
  TransactionModel.delete(id);
  return json({ success: true });
};