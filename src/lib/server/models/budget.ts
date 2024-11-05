import { db } from '../db';
import type { Budget } from '$lib/types/budget';
import { budgetSchema } from '$lib/types/budget';

export class BudgetModel {
  static getAll(): Budget[] {
    const rows = db.prepare(`
      SELECT * FROM budgets 
      ORDER BY start_date DESC, created_at DESC
    `).all();

    return rows.map(row => ({
      ...row,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }

  static getById(id: string): Budget | null {
    const row = db.prepare('SELECT * FROM budgets WHERE id = ?').get(id);
    if (!row) return null;

    return {
      ...row,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  static create(budget: Budget): Budget {
    const validated = budgetSchema.parse(budget);
    
    db.prepare(`
      INSERT INTO budgets (
        id, name, amount, spent, category, period,
        start_date, end_date, notifications, notification_threshold,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?
      )
    `).run(
      validated.id,
      validated.name,
      validated.amount,
      validated.spent,
      validated.category,
      validated.period,
      validated.startDate.toISOString(),
      validated.endDate.toISOString(),
      validated.notifications ? 1 : 0,
      validated.notificationThreshold,
      validated.createdAt.toISOString(),
      validated.updatedAt.toISOString()
    );

    return validated;
  }

  static update(id: string, budget: Partial<Budget>): Budget {
    const current = this.getById(id);
    if (!current) throw new Error('Budget not found');

    const updated = {
      ...current,
      ...budget,
      updatedAt: new Date()
    };

    const validated = budgetSchema.parse(updated);

    db.prepare(`
      UPDATE budgets SET
        name = ?,
        amount = ?,
        spent = ?,
        category = ?,
        period = ?,
        start_date = ?,
        end_date = ?,
        notifications = ?,
        notification_threshold = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      validated.name,
      validated.amount,
      validated.spent,
      validated.category,
      validated.period,
      validated.startDate.toISOString(),
      validated.endDate.toISOString(),
      validated.notifications ? 1 : 0,
      validated.notificationThreshold,
      validated.updatedAt.toISOString(),
      id
    );

    return validated;
  }

  static delete(id: string): void {
    db.prepare('DELETE FROM budgets WHERE id = ?').run(id);
  }

  static updateSpent(id: string, amount: number): Budget {
    const budget = this.getById(id);
    if (!budget) throw new Error('Budget not found');

    const updated = {
      ...budget,
      spent: budget.spent + amount,
      updatedAt: new Date()
    };

    return this.update(id, updated);
  }

  static getActive(): Budget[] {
    const now = new Date().toISOString();
    
    const rows = db.prepare(`
      SELECT * FROM budgets 
      WHERE start_date <= ? AND end_date >= ?
      ORDER BY start_date DESC
    `).all(now, now);

    return rows.map(row => ({
      ...row,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }
}