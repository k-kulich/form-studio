export const SITE = {
  name: 'FORM',
  address: 'Санкт-Петербург, Петроградская сторона, ул. Профессора Попова, 12',
  phone: '+7 (812) 123-45-67',
  phoneHref: 'tel:+78121234567',
  email: 'hello@form-studio.ru',
  hours: 'Ежедневно с 8:00 до 22:00',
  socials: [
    { label: 'Telegram', href: '#' },
    { label: 'VK',       href: '#' },
    { label: 'Instagram',href: '#' },
  ],
};

export const HERO_PHOTO = '/images/studio/hero.png';

export const ROOMS = [
  {
    slug: 'gold', name: 'Gold', size_m2: 60, capacity: 20,
    description: 'Зеркала в пол, станки, профессиональный звук. Для High Heels, Strip, репетиций и съёмок.',
    features: ['Зеркала в пол', 'Станки', 'Звук', 'Софиты'],
    photos: [
      '/images/rooms/gold-1.png',
      '/images/rooms/gold-2.png',
    ],
    shortPhoto: '/images/rooms/gold-thumb.png',
  },
  {
    slug: 'black', name: 'Black', size_m2: 45, capacity: 15,
    description: 'Тёмный зал с софитами и проектором. Для Strip и вечерних репетиций.',
    features: ['Софиты', 'Проектор', 'Звук', 'Тёмный фон'],
    photos: ['/images/rooms/black-1.png', '/images/rooms/black-2.png'],
    shortPhoto: '/images/rooms/black-thumb.png',
  },
  {
    slug: 'light', name: 'Light', size_m2: 40, capacity: 12,
    description: 'Светлый зал с панорамными окнами. Для стретчинга, йоги и мягких практик.',
    features: ['Панорамные окна', 'Дневной свет', 'Тишина'],
    photos: ['/images/rooms/light-1.png', '/images/rooms/light-2.png'],
    shortPhoto: '/images/rooms/light-thumb.png',
  },
  {
    slug: 'studio', name: 'Studio', size_m2: 35, capacity: 10,
    description: 'Универсальный зал с мобильными зеркалами. Для небольших групп и съёмок.',
    features: ['Мобильные зеркала', 'Универсальный свет'],
    photos: ['/images/rooms/studio-1.png', '/images/rooms/studio-2.png'],
    shortPhoto: '/images/rooms/studio-thumb.png',
  },
] as const;

export const INSTRUCTORS = [
  {
    name: 'Анна Верейская',
    direction: 'High Heels',
    bio: 'Учит двигаться уверенно и чисто, без лишнего пафоса; помогает разобрать технику с нуля.',
    longBio:
      '8 лет в танце, 4 года преподавания. Работала с постановками для шоу и видеоклипов. ' +
      'Ведёт группы с нуля и продолжающих, следит за техникой и безопасностью колена и стопы.',
    photo: '/images/instructors/anna-portrait.png',
    // actionPhoto: '/images/instructors/anna-action.png',
  },
  {
    name: 'Мария Соколова',
    direction: 'Strip Plastic',
    bio: 'Ведёт группы любого уровня, внимательна к деталям и атмосфере в зале.',
    longBio:
      'Хореограф, преподаватель Strip Plastic и Contemporary. Опыт преподавания — 6 лет. ' +
      'Работает над пластикой и раскрепощённостью, но без потери контроля над телом.',
    photo: '/images/instructors/maria-portrait.png',
    // actionPhoto: '/images/instructors/maria-action.png',
  },
  {
    name: 'Елена Крылова',
    direction: 'Стретчинг',
    bio: 'Работает с осанкой и гибкостью мягко, без насилия над телом.',
    longBio:
      'Сертифицированный тренер по стретчингу и йоге. Работает со спиной, плечами и тазобедренными ' +
      'суставами. Подходит людям с сидячей работой и тем, кто восстанавливается после травм.',
    photo: '/images/instructors/elena-portrait.png',
    // actionPhoto: '/images/instructors/elena-action.png',
  },
];

export const STUDIO_PHOTOS = [
  { src: '/images/studio/reception.png', label: 'Ресепшен' },
  { src: '/images/studio/locker.png',    label: 'Раздевалка' },
  { src: '/images/studio/shower.png',    label: 'Душ' },
  { src: '/images/studio/waiting.png',   label: 'Зона ожидания' },
];

export const CLASSES = [
  {
    slug: 'high-heels', name: 'High Heels',
    level: 'С нуля и продолжающие',
    gives: 'Уверенность в движениях, осанку, умение носить каблук.',
    duration: '55 минут',
    price: '1 100 ₽ разовое · абонемент 4/8/12 — 3 600 / 6 400 / 8 400 ₽',
    instructor: 'Анна Верейская',
    how: 'Разминка, техника, связка. В конце проходим связку под музыку.',
    photo: '/images/classes/high-heels.png',
  },
  {
    slug: 'strip-plastic', name: 'Strip Plastic',
    level: 'С нуля и продолжающие',
    gives: 'Пластику, координацию, раскрепощённость в движении.',
    duration: '55 минут',
    price: '1 100 ₽ разовое · абонемент 4/8/12 — 3 600 / 6 400 / 8 400 ₽',
    instructor: 'Мария Соколова',
    how: 'Разминка, элементы у станка и в партере, связка.',
    photo: '/images/classes/strip.png',
  },
  {
    slug: 'stretching', name: 'Стретчинг',
    level: 'Любой, включая начинающих',
    gives: 'Гибкость, осанку, снятие напряжения в спине и плечах.',
    duration: '55 минут',
    price: '900 ₽ разовое · абонемент 4/8/12 — 3 600 / 6 400 / 8 400 ₽',
    instructor: 'Елена Крылова',
    how: 'Мягкая разминка, растяжка, дыхание. Без резких движений.',
    photo: '/images/classes/stretching.png',
  },
];

export const REVIEWS = [
  { author: 'Ксения, ученица',  text: 'Хожу на High Heels второй месяц. Нравится, что не нужно звонить — записалась в приложении и пришла. В зале Gold отличный звук и зеркала, всё видно.' },
  { author: 'Дарья, ученица',   text: 'Пробовала стретчинг у Елены. Спокойный темп, никакой гонки. После занятия спина чувствует себя иначе. Удобно, что есть утренние группы.' },
  { author: 'Игорь, фотограф',  text: 'Арендую зал Studio под съёмки. Календарь показывает свободные часы сразу, оплата на месте. Ни разу не было накладок, залы всегда готовы.' },
];

export const RENT_PRICES = [
  { room: 'Studio (35 м²)', weekdayDay: '900 ₽/час',   weekdayEvening: '1 400 ₽/час', weekend: '1 500 ₽/час' },
  { room: 'Light (40 м²)',  weekdayDay: '1 000 ₽/час', weekdayEvening: '1 500 ₽/час', weekend: '1 600 ₽/час' },
  { room: 'Black (45 м²)',  weekdayDay: '1 100 ₽/час', weekdayEvening: '1 700 ₽/час', weekend: '1 800 ₽/час' },
  { room: 'Gold (60 м²)',   weekdayDay: '1 300 ₽/час', weekdayEvening: '2 000 ₽/час', weekend: '2 200 ₽/час' },
];

export const RENT_BENEFITS = [
  { title: 'Мгновенное бронирование', text: 'Выбираете слот — он сразу закрепляется за вами.' },
  { title: 'Видно всё',               text: 'Календарь показывает и занятия студии, и аренду одновременно.' },
  { title: 'Удобная оплата',          text: 'Предоплата онлайн — 100% или 50%. Остаток на месте.' },
  { title: 'Отмена за 24 часа',       text: 'Планы меняются — мы понимаем.' },
];