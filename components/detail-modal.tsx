'use client';

import { useEffect } from 'react';
import { Photo } from './photo';

export type DetailModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  photos: string[];
  photoRatio?: string; // <--- Добавили пропс для пропорций
  description: string;
  meta?: { label: string; value: string }[];
  cta?: { label: string; href: string };
};

export function DetailModal({
  open, onClose, title, subtitle, photos, photoRatio = 'aspect-[4/3]', description, meta, cta,
}: DetailModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/5 bg-surface p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted hover:border-white/20 hover:text-foreground"
          >
            Закрыть
          </button>
        </div>

        {/* Передаем photoRatio в компонент Photo */}
        <div className={`grid gap-3 ${photos.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {photos.map((p, i) => (
            <Photo key={i} src={p} alt={`${title} — фото ${i + 1}`} ratio={photoRatio} />
          ))}
        </div>

        <p className="mt-6 whitespace-pre-line text-sm text-foreground/90">{description}</p>

        {meta && meta.length > 0 && (
          <dl className="mt-6 grid gap-2 text-sm md:grid-cols-2">
            {meta.map((m) => (
              <div key={m.label} className="flex gap-2">
                <dt className="text-muted">{m.label}:</dt>
                <dd className="text-foreground/90">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {cta && (
          <a href={cta.href} className="btn-primary mt-8">
            {cta.label}
          </a>
        )}
      </div>
    </div>
  );
}