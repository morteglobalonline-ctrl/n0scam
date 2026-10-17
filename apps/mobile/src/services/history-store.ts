import type { SQLiteDatabase } from 'expo-sqlite';
import { historyLabel, type HistoryKind, type HistoryRecord } from '@/domain/history';
import type { LocalAssessment } from '@/domain/risk';

type HistoryRow = {
  id: number;
  kind: HistoryKind;
  verdict: LocalAssessment['verdict'];
  severity: LocalAssessment['severity'];
  label: string;
  evidence_count: number;
  created_at: number;
};

export async function initializeHistoryStore(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS analysis_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kind TEXT NOT NULL CHECK (kind IN ('LINK', 'QR', 'MESSAGE', 'EMAIL')),
      verdict TEXT NOT NULL CHECK (verdict IN ('WARN', 'BLOCK', 'UNKNOWN')),
      severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
      label TEXT NOT NULL CHECK (length(label) BETWEEN 1 AND 160),
      evidence_count INTEGER NOT NULL CHECK (evidence_count >= 0),
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS analysis_history_created_at ON analysis_history(created_at DESC);
  `);
}

export async function saveHistoryRecord(db: SQLiteDatabase, assessment: LocalAssessment, kind: HistoryKind, rawValue: string) {
  const label = historyLabel(kind, rawValue);
  await db.withExclusiveTransactionAsync(async (transaction) => {
    await transaction.runAsync(
      'INSERT INTO analysis_history (kind, verdict, severity, label, evidence_count, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      kind,
      assessment.verdict,
      assessment.severity,
      label,
      assessment.evidence.length,
      Date.now(),
    );
    await transaction.runAsync('DELETE FROM analysis_history WHERE id NOT IN (SELECT id FROM analysis_history ORDER BY created_at DESC, id DESC LIMIT 200)');
  });
}

export async function listHistoryRecords(db: SQLiteDatabase, kind?: HistoryKind) {
  const rows = kind
    ? await db.getAllAsync<HistoryRow>('SELECT * FROM analysis_history WHERE kind = ? ORDER BY created_at DESC, id DESC LIMIT 200', kind)
    : await db.getAllAsync<HistoryRow>('SELECT * FROM analysis_history ORDER BY created_at DESC, id DESC LIMIT 200');

  return rows.map<HistoryRecord>((row) => ({
    id: row.id,
    kind: row.kind,
    verdict: row.verdict,
    severity: row.severity,
    label: row.label,
    evidenceCount: row.evidence_count,
    createdAt: row.created_at,
  }));
}

export async function deleteHistoryRecord(db: SQLiteDatabase, id: number) {
  if (!Number.isSafeInteger(id) || id <= 0) return;
  await db.runAsync('DELETE FROM analysis_history WHERE id = ?', id);
}

export async function clearHistoryRecords(db: SQLiteDatabase) {
  await db.runAsync('DELETE FROM analysis_history');
}
