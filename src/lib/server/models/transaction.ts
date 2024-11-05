import { db } from '../db';
import type { Transaction } from '$lib/types/transaction';
import { transactionSchema } from '$lib/types/transaction';

export class TransactionModel {
  static getAll(): Transaction[] {
    const rows = db.prepare(`
      SELECT * FROM transactions 
      ORDER BY date DESC, created_at DESC
    `).all();

    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      attachments: row.attachments ? JSON.parse(row.attachments) : [],
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }

  static getById(id: string): Transaction | null {
    const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    if (!row) return null;

    return {
      ...row,
      date: new Date(row.date),
      attachments: row.attachments ? JSON.parse(row.attachments) : [],
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  static create(transaction: Transaction): Transaction {
    const validated = transactionSchema.parse(transaction);
    
    db.prepare(`
      INSERT INTO transactions (
        id, type, amount, currency, category, subcategory, date,
        description, payment_method, attachments, tags, notes,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?
      )
    `).run(
      validated.id,
      validated.type,
      validated.amount,
      validated.currency,
      validated.category,
      validated.subcategory || null,
      validated.date.toISOString(),
      validated.description,
      validated.paymentMethod,
      validated.attachments ? JSON.stringify(validated.attachments) : null,
      validated.tags ? JSON.stringify(validated.tags) : null,
      validated.notes || null,
      validated.createdAt.toISOString(),
      validated.updatedAt.toISOString()
    );

    return validated;
  }

  static update(id: string, transaction: Partial<Transaction>): Transaction {
    const current = this.getById(id);
    if (!current) throw new Error('Transaction not found');

    const updated = {
      ...current,
      ...transaction,
      updatedAt: new Date()
    };

    const validated = transactionSchema.parse(updated);

    db.prepare(`
      UPDATE transactions SET
        type = ?,
        amount = ?,
        currency = ?,
        category = ?,
        subcategory = ?,
        date = ?,
        description = ?,
        payment_method = ?,
        attachments = ?,
        tags = ?,
        notes = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      validated.type,
      validated.amount,
      validated.currency,
      validated.category,
      validated.subcategory || null,
      validated.date.toISOString(),
      validated.description,
      validated.paymentMethod,
      validated.attachments ? JSON.stringify(validated.attachments) : null,
      validated.tags ? JSON.stringify(validated.tags) : null,
      validated.notes || null,
      validated.updatedAt.toISOString(),
      id
    );

    return validated;
  }

  static delete(id: string): void {
    db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
  }

  static getByDateRange(startDate: Date, endDate: Date): Transaction[] {
    const rows = db.prepare(`
      SELECT * FROM transactions 
      WHERE date BETWEEN ? AND ?
      ORDER BY date DESC, created_at DESC
    `).all(startDate.toISOString(), endDate.toISOString());

    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      attachments: row.attachments ? JSON.parse(row.attachments) : [],
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }

  static getByCategory(category: string): Transaction[] {
    const rows = db.prepare(`
      SELECT * FROM transactions 
      WHERE category = ?
      ORDER BY date DESC, created_at DESC
    `).all(category);

    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      attachments: row.attachments ? JSON.parse(row.attachments) : [],
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }
}