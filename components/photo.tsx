import Image from 'next/image';

type Props = {
  src?: string;
  alt: string;
  className?: string;      // внешний контейнер
  ratio?: string;          // например 'aspect-[4/3]'
  label?: string;          // подпись на плейсхолдере
  priority?: boolean;
};

export function Photo({ src, alt, className = '', ratio = 'aspect-[4/3]', label, priority }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/5 bg-surface-2 ${ratio} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={priority}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="px-4 text-center text-xs text-muted">
            {label ?? alt}
            <br />
            <span className="text-[10px] opacity-60">(фото добавим позже)</span>
          </span>
        </div>
      )}
    </div>
  );
}