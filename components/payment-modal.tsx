'use client';

import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  amount: number;
  slotLabel: string;
  onCancel: () => void;
  onPaid: () => void;
};

export function PaymentModal({ open, amount, slotLabel, onCancel, onPaid }: Props) {
  const [stage, setStage] = useState<'idle' | 'processing' | 'success'>('idle');

  useEffect(() => {
    if (!open) setStage('idle');
  }, [open]);

  if (!open) return null;

  function handlePay() {
    setStage('processing');
    setTimeout(() => setStage('success'), 1500);
    setTimeout(() => onPaid(), 2400);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={stage === 'idle' ? onCancel : undefined}>
      <div className="w-full max-w-md rounded-3xl border border-white/5 bg-surface p-6" onClick={(e) => e.stopPropagation()}>
        {stage === 'idle' && (
          <>
            <h3 className="font-display text-xl">Оплата брони</h3>
            <p className="mt-2 text-sm text-muted">{slotLabel}</p>
            <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-center">
              <div className="text-xs uppercase tracking-widest text-gold">К оплате</div>
              <div className="mt-1 font-display text-3xl text-foreground">{amount.toLocaleString('ru-RU')} ₽</div>
            </div>
            <p className="mt-4 text-xs text-muted">
              Это демо. Реальная оплата не списывается. В продакшене здесь будет ЮKassa / Tinkoff.
            </p>
            <div className="mt-6 flex gap-2">
              <button onClick={handlePay} className="btn-primary flex-1">Оплатить</button>
              <button onClick={onCancel} className="btn-outline">Отмена</button>
            </div>
          </>
        )}

        {stage === 'processing' && (
          <div className="flex flex-col items-center py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
            <p className="mt-6 text-sm text-muted">Обрабатываем платёж…</p>
          </div>
        )}

        {stage === 'success' && (
          <div className="flex flex-col items-center py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-2xl text-gold">✓</div>
            <p className="mt-4 text-sm text-gold">Оплачено</p>
          </div>
        )}
      </div>
    </div>
  );
}