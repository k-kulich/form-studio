'use client';

import { useRef } from 'react';
import { REVIEWS } from '@/lib/constants';

function Star({ filled }: { filled: boolean }) {
  return (
    <svg className={`h-4 w-4 ${filled ? 'text-gold' : 'text-white/10'}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export function ReviewsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Прокручиваем на ширину одной карточки с учетом отступа (gap)
      const scrollAmount = direction === 'left' ? -380 : 380;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-10 relative">
      {/* Стрелочки (только для десктопа) */}
      <div className="absolute -top-16 right-0 hidden gap-2 md:flex">
        <button
          onClick={() => scroll('left')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface text-muted transition hover:border-gold hover:text-gold"
          aria-label="Предыдущий отзыв"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface text-muted transition hover:border-gold hover:text-gold"
          aria-label="Следующий отзыв"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Контейнер с отзывами */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {REVIEWS.map((r) => (
          <div
            key={r.author}
            className="card w-[85vw] shrink-0 snap-start md:w-[350px]"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} filled={star <= (r.rating || 5)} />
              ))}
            </div>
            <p className="mt-4 text-sm text-foreground/90">«{r.text}»</p>
            <div className="mt-6 text-sm text-muted">— {r.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}