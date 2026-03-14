'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clapperboard,
  Search,
  User,
  Menu,
  X,
  Play,
  Ticket,
  Star,
  ChevronRight,
  Users,
  Download,
  Share2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Film,
  Instagram,
  Twitter,
  MessageCircle,
  Maximize,
  SkipBack,
  SkipForward,
  Pause,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Trash2,
  Edit,
  Save,
  Settings,
  Eye
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  videos?: { results: VideoResult[] };
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  // Player 1
  player1Url?: string;
  player1Quality?: string;
  // Player 2
  player2Url?: string;
  player2Quality?: string;
}

interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}



// ============================================
// IMAGE BASE URL (using placeholder images)
// ============================================
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

// ============================================
// GENRE MAPPING
// ============================================
const genreMap: Record<number, string> = {
  28: 'Боевик',
  12: 'Приключения',
  16: 'Мультфильм',
  35: 'Комедия',
  80: 'Криминал',
  99: 'Документальный',
  18: 'Драма',
  10751: 'Семейный',
  14: 'Фэнтези',
  36: 'История',
  27: 'Ужасы',
  10402: 'Музыка',
  9648: 'Детектив',
  10749: 'Мелодрама',
  878: 'Фантастика',
  10770: 'Телевизионный фильм',
  53: 'Триллер',
  10752: 'Военный',
  37: 'Вестерн'
};

// ============================================
// MOCK MOVIE DATA - Free & No API Required
// ============================================
const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Дюна: Часть вторая',
    original_title: 'Dune: Part Two',
    overview: 'Пол Атрейдес объединяется с Чани и фрименами, чтобы отомстить заговорщикам, уничтожившим его семью. Столкнувшись с выбором между любовью всей своей жизни и судьбой вселенной, он должен предотвратить ужасное будущее, которое может постичь человечество.',
    poster_path: '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    release_date: '2024-02-27',
    vote_average: 8.3,
    vote_count: 4500,
    genre_ids: [878, 12],
    popularity: 100,
    runtime: 166,
    tagline: 'Судьба awaits',
    genres: [{ id: 878, name: 'Фантастика' }, { id: 12, name: 'Приключения' }],
    videos: { results: [{ id: '1', key: 'Way9MexJXCU', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 1, name: 'Тимоти Шаламе', character: 'Пол Атрейдес', profile_path: '/i6Kd4GxzJRLfsssSuZWm5YjD7LP.jpg' },
        { id: 2, name: 'Зендея', character: 'Чани', profile_path: '/jB9nDaBfPbY7bwoiKXClF0YJIMK.jpg' },
        { id: 3, name: 'Ребекка Фергюсон', character: 'Леди Джессика', profile_path: '/mHHPqCK2oDgbmUZYtY6FfHeO8Wj.jpg' },
        { id: 4, name: 'Джош Бролин', character: 'Гурни Халлек', profile_path: '/psMu6Wf2j0V7roOlPsY9mUfuwK.jpg' },
        { id: 5, name: 'Остин Батлер', character: 'Фейд-Раута', profile_path: '/hXzzmsGXSHG5ughD5wLtXcj4hxH.jpg' }
      ],
      crew: [{ id: 10, name: 'Дени Вильнёв', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 2,
    title: 'Оппенгеймер',
    original_title: 'Oppenheimer',
    overview: 'История американского учёного Роберта Оппенгеймера и его роли в разработке атомной бомбы во время Второй мировой войны. Фильм рассказывает о моральных дилеммах и последствиях создания оружия массового поражения.',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    release_date: '2023-07-19',
    vote_average: 8.5,
    vote_count: 7200,
    genre_ids: [18, 36],
    popularity: 95,
    runtime: 180,
    tagline: 'Мир навсегда изменится',
    genres: [{ id: 18, name: 'Драма' }, { id: 36, name: 'История' }],
    videos: { results: [{ id: '2', key: 'uYPbbksJxIg', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 6, name: 'Киллиан Мёрфи', character: 'Роберт Оппенгеймер', profile_path: '/3mF1HuL7z4KM5s5VMcWoeIi4Rql.jpg' },
        { id: 7, name: 'Эмили Блант', character: 'Китти Оппенгеймер', profile_path: '/9VblnPRJGmkFXkjMb9r8Msma5Kf.jpg' },
        { id: 8, name: 'Мэтт Деймон', character: 'Лесли Гровс', profile_path: '/eSaB0sYKFJhgaFaUjW1Cz0dmw0s.jpg' },
        { id: 9, name: 'Роберт Дауни-мл.', character: 'Льюис Штраусс', profile_path: '/im9SAqJPZKEbVZGmjXuLI4Q7cGN.jpg' },
        { id: 10, name: 'Флоренс Пью', character: 'Джин Тэтлок', profile_path: '/4jI6L1JY7kLR0GlUURhUg3WsxTt.jpg' }
      ],
      crew: [{ id: 20, name: 'Кристофер Нолан', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 3,
    title: 'Бедные-несчастные',
    original_title: 'Poor Things',
    overview: 'Белла Бакстер — молодая женщина, воскрешённая гениальным и неортодоксальным учёным доктором Годвином Бакстером. Под его защитой она жаждет познания и решает сбежать с деловым юристом Дунканом Уэддербёрном.',
    poster_path: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    backdrop_path: '/bQS43HSLZzMjZkcHJz4fGc7fNdz.jpg',
    release_date: '2023-12-08',
    vote_average: 8.0,
    vote_count: 3200,
    genre_ids: [35, 878, 10749],
    popularity: 88,
    runtime: 141,
    tagline: 'Рождена заново',
    genres: [{ id: 35, name: 'Комедия' }, { id: 878, name: 'Фантастика' }, { id: 10749, name: 'Мелодрама' }],
    videos: { results: [{ id: '3', key: 'RlbR5N6veqw', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 11, name: 'Эмма Стоун', character: 'Белла Бакстер', profile_path: '/2hwXbPW2ffnXUe1Um0WXHG0cTwb.jpg' },
        { id: 12, name: 'Марк Руффало', character: 'Дункан Уэддербёрн', profile_path: '/zLlTSMGqXgZtP3krt9PeRtd1mFH.jpg' },
        { id: 13, name: 'Уиллем Дефо', character: 'Годвин Бакстер', profile_path: '/uiAGQYjLhE8qMRJAkhqdY1sFvqr.jpg' },
        { id: 14, name: 'Рами Юсеф', character: 'Макс МакКэндлз', profile_path: '/aY7Bwp7PLMKuYaxTSz1XvYEbXrN.jpg' },
        { id: 15, name: 'Джеррод Кармайкл', character: 'Гарри Астор', profile_path: '/ffkEq2G8dVyVhmDPLqr2NaL8SnV.jpg' }
      ],
      crew: [{ id: 30, name: 'Йоргос Лантимос', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 4,
    title: 'Убийцы цветочной луны',
    original_title: 'Killers of the Flower Moon',
    overview: 'В 1920-х годах в Оклахоме члены индейского племени осейдж были убиты при загадочных обстоятельствах, что спровоцировало масштабное расследование ФБР. История основана на реальных событиях.',
    poster_path: '/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg',
    backdrop_path: '/AnMHDvKd6c8nxT8xNvYUzBwONNR.jpg',
    release_date: '2023-10-18',
    vote_average: 7.8,
    vote_count: 2800,
    genre_ids: [18, 80, 36],
    popularity: 82,
    runtime: 206,
    tagline: 'Преступление века',
    genres: [{ id: 18, name: 'Драма' }, { id: 80, name: 'Криминал' }, { id: 36, name: 'История' }],
    videos: { results: [{ id: '4', key: 'EP34Yoxs3FQ', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 16, name: 'Леонардо ДиКаприо', character: 'Эрнест Бёркхарт', profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
        { id: 17, name: 'Роберт Де Ниро', character: 'Уильям Хейл', profile_path: '/cT8thc3nVwTV2Dt1uBHZJVtMbN.jpg' },
        { id: 18, name: 'Лили Гладстоун', character: 'Молли Бёркхарт', profile_path: '/xW1O3KnU7VZQ8qqDkgZJKCR1yXg.jpg' },
        { id: 19, name: 'Джесси Племонс', character: 'Том Уайт', profile_path: '/pZFXyJamSVtFUK6DElYjEMI3jKj.jpg' },
        { id: 20, name: 'Брендан Фрейзер', character: 'У. С. Хэмилтон', profile_path: '/8R1fvKraMHj27kLqVj7hTxeJdao.jpg' }
      ],
      crew: [{ id: 40, name: 'Мартин Скорсезе', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 5,
    title: 'Мастер и Маргарита',
    original_title: 'Мастер и Маргарита',
    overview: 'Современная экранизация культового романа Михаила Булгакова. Дьявол и его свита появляются в Москве 1930-х годов, переплетая судьбы Мастера, Маргариты и множества других персонажей в сюрреалистической истории о любви, творчестве и искуплении.',
    poster_path: '/dY6I4I5QejRcHeGvZNE9VopFGfh.jpg',
    backdrop_path: '/9eK8BkmPzDNW5xRnGwKDCZzY6Fp.jpg',
    release_date: '2024-01-25',
    vote_average: 7.5,
    vote_count: 1800,
    genre_ids: [14, 18, 10749],
    popularity: 78,
    runtime: 157,
    tagline: 'Рукописи не горят',
    genres: [{ id: 14, name: 'Фэнтези' }, { id: 18, name: 'Драма' }, { id: 10749, name: 'Мелодрама' }],
    videos: { results: [{ id: '5', key: 'yHfMVEVgNPQ', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 21, name: 'Волков', character: 'Воланд', profile_path: null },
        { id: 22, name: 'Ян Цапник', character: 'Коровьев', profile_path: null },
        { id: 23, name: 'Евгений Цыганов', character: 'Мастер', profile_path: null },
        { id: 24, name: 'Юлия Снигирь', character: 'Маргарита', profile_path: null },
        { id: 25, name: 'Алексей Гуськов', character: 'Понтий Пилат', profile_path: null }
      ],
      crew: [{ id: 50, name: 'Михаил Локшин', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 6,
    title: 'Человек-паук: Паутина вселенных',
    original_title: 'Spider-Man: Across the Spider-Verse',
    overview: 'Майлз Моралес возвращается в следующем приключении эпической серии «Паутина вселенных». Он отправляется в путешествие по мультивселенной, где встречает команду Человеков-пауков, защищающих само её существование.',
    poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    release_date: '2023-05-31',
    vote_average: 8.7,
    vote_count: 6500,
    genre_ids: [16, 28, 12],
    popularity: 92,
    runtime: 140,
    tagline: 'Новый мир. Новая паутина',
    genres: [{ id: 16, name: 'Мультфильм' }, { id: 28, name: 'Боевик' }, { id: 12, name: 'Приключения' }],
    videos: { results: [{ id: '6', key: 'shW9i6k8cB0', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 26, name: 'Шамеик Мур', character: 'Майлз Моралес (голос)', profile_path: '/laNBfHkYvcvqFkdvVwjevJ0mVfB.jpg' },
        { id: 27, name: 'Хейли Стайнфелд', character: 'Гвен Стейси (голос)', profile_path: '/u5kQV6FPFhBcfBHR7D8CVKJXCXh.jpg' },
        { id: 28, name: 'Оскар Айзек', character: 'Мигель О\'Хара (голос)', profile_path: '/xnDO5T5bdAvqLDXqGXTRyAJH1Va.jpg' },
        { id: 29, name: 'Джейк Джонсон', character: 'Питер Б. Паркер (голос)', profile_path: '/5LmobFXQL0LdFvS4XgJQhENXB4d.jpg' },
        { id: 30, name: 'Джейми Фокс', character: 'Электро (голос)', profile_path: '/hT6gxAn7Hw4GvX3izJlXgEADhJ.jpg' }
      ],
      crew: [{ id: 60, name: 'Хоаким Дос Сантос', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 7,
    title: 'Барби',
    original_title: 'Barbie',
    overview: 'Барби и Кен наслаждаются идеальной жизнью в ярком и прекрасном мире Барбиленда. Однако, когда они получают шанс отправиться в реальный мир, они вскоре открывают для себя радости и опасности жизни среди людей.',
    poster_path: '/iuFNms8NX5qfoiCieDtoDqLLm4v.jpg',
    backdrop_path: '/nHf61UzkfFno5dHMNX5qMpfO3pS.jpg',
    release_date: '2023-07-19',
    vote_average: 7.2,
    vote_count: 8200,
    genre_ids: [35, 14, 10749],
    popularity: 98,
    runtime: 114,
    tagline: 'Она — всё. Он — просто Кен',
    genres: [{ id: 35, name: 'Комедия' }, { id: 14, name: 'Фэнтези' }, { id: 10749, name: 'Мелодрама' }],
    videos: { results: [{ id: '7', key: 'pBk4NYhWNMM', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 31, name: 'Марго Робби', character: 'Барби', profile_path: '/eTCB1FnVKwY1Y9o2xeC6s4pcJdN.jpg' },
        { id: 32, name: 'Райан Гослинг', character: 'Кен', profile_path: '/lyUyVARQKhGxaxy0FbPJCQRpiaW.jpg' },
        { id: 33, name: 'Америка Феррера', character: 'Глория', profile_path: '/noPLaHtVS8RHtY9FvCGUzbZS5mv.jpg' },
        { id: 34, name: 'Кейт МакКиннон', character: 'Странная Барби', profile_path: '/5ZcBWxkq9vAr6LOBqL6FntDfdeW.jpg' },
        { id: 35, name: 'Уилл Феррелл', character: 'CEO Mattel', profile_path: '/oXwJRoW1pI1rLqKI1WMD1E2P1y8.jpg' }
      ],
      crew: [{ id: 70, name: 'Грета Гервиг', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 8,
    title: 'Наполеон',
    original_title: 'Napoleon',
    overview: 'Эпическая сага о rise и падении французского императора Наполеона Бонапарта. Фильм показывает его военные кампании, сложные отношения с женой Жозефиной и путь к абсолютной власти.',
    poster_path: '/jE5o7y9K6pZtWNNMXw3EdpHaakR.jpg',
    backdrop_path: '/wLHeprSWB0HUW8hFC7mY6VPfdhV.jpg',
    release_date: '2023-11-22',
    vote_average: 6.6,
    vote_count: 2100,
    genre_ids: [18, 36, 10752],
    popularity: 75,
    runtime: 158,
    tagline: 'Император. Легенда. Человек',
    genres: [{ id: 18, name: 'Драма' }, { id: 36, name: 'История' }, { id: 10752, name: 'Военный' }],
    videos: { results: [{ id: '8', key: 'OAZWXUkrjPc', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 36, name: 'Хоакин Феникс', character: 'Наполеон Бонапарт', profile_path: '/w2phndz3CrYvSGg6pZrWheFVTDs.jpg' },
        { id: 37, name: 'Ванесса Кирби', character: 'Жозефина', profile_path: '/rLt7N9QRIoPvFPWkTc2NvI3VWSw.jpg' },
        { id: 38, name: 'Тахар Рахим', character: 'Поль Баррас', profile_path: '/pW3V4WgJvTs9dTmBKkegLrVXmLX.jpg' },
        { id: 39, name: 'Бен Миллер', character: 'Талейран', profile_path: '/aMmyy7auk8dQeJvDSAQJ07uLHJ6.jpg' },
        { id: 40, name: 'Рори Киннир', character: 'Горацио Нельсон', profile_path: '/hwJ9TX0qxzRkSJX3OouVf0APpFB.jpg' }
      ],
      crew: [{ id: 80, name: 'Ридли Скотт', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 9,
    title: 'Звёздные войны: Пробуждение силы',
    original_title: 'Star Wars: The Force Awakens',
    overview: 'Три десятилетия после поражения Галактической Империи возникает новая угроза в виде Первого Ордена. Рей, мусорщица с планеты Джакку, оказывается в центре конфликта и узнаёт о своём предназначении.',
    poster_path: '/wqnLdwOH2OOq0o5GelZ1VFw1oPD.jpg',
    backdrop_path: '/sYQcdOyw8frk6rLJCwFjX1Dw6Lv.jpg',
    release_date: '2015-12-15',
    vote_average: 7.4,
    vote_count: 15000,
    genre_ids: [878, 12, 28],
    popularity: 85,
    runtime: 138,
    tagline: 'Каждое поколение имеет свою легенду',
    genres: [{ id: 878, name: 'Фантастика' }, { id: 12, name: 'Приключения' }, { id: 28, name: 'Боевик' }],
    videos: { results: [{ id: '9', key: 'sGbxmsDFVnE', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 41, name: 'Дейзи Ридли', character: 'Рей', profile_path: '/dTBZ1VOVhNvQZXS4tCQV3vSFkks.jpg' },
        { id: 42, name: 'Джон Бойега', character: 'Финн', profile_path: '/egNqPmWboOrLs9k0H9sYH4iKoqD.jpg' },
        { id: 43, name: 'Оскар Айзек', character: 'По Дэмерон', profile_path: '/xnDO5T5bdAvqLDXqGXTRyAJH1Va.jpg' },
        { id: 44, name: 'Харрисон Форд', character: 'Хан Соло', profile_path: '/7Cg2sUeLQvEHSFp7KJA3x5FndvA.jpg' },
        { id: 45, name: 'Кэрри Фишер', character: 'Лея Органа', profile_path: '/9sP6NPh5WJz6rfrLFRMqQBpMEw4.jpg' }
      ],
      crew: [{ id: 90, name: 'Джей-Джей Абрамс', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 10,
    title: 'Интерстеллар',
    original_title: 'Interstellar',
    overview: 'Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, группа исследователей отправляется через червоточину в поисках нового дома для человечества.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    release_date: '2014-11-05',
    vote_average: 8.7,
    vote_count: 32000,
    genre_ids: [878, 12, 18],
    popularity: 90,
    runtime: 169,
    tagline: 'Человечество родилось на Земле. Но оно не предназначено, чтобы погибнуть здесь',
    genres: [{ id: 878, name: 'Фантастика' }, { id: 12, name: 'Приключения' }, { id: 18, name: 'Драма' }],
    videos: { results: [{ id: '10', key: 'zSWdZVtXT7E', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 46, name: 'Мэттью Макконахи', character: 'Купер', profile_path: '/wJiGedOCZhwMx9DezY8uwbNxmAY.jpg' },
        { id: 47, name: 'Энн Хэтэуэй', character: 'Брэнд', profile_path: '/vBclUgJYxGgbPvagddUjRXVvD5X.jpg' },
        { id: 48, name: 'Джессика Честейн', character: 'Мёрф (взрослая)', profile_path: '/mKJO6YgulRg6YVeT5yaAD1n2Uuk.jpg' },
        { id: 49, name: 'Майкл Кейн', character: 'Профессор Брэнд', profile_path: '/9IWg58hQmJWqPqk3YJz3mckXHll.jpg' },
        { id: 50, name: 'Маккензи Фой', character: 'Мёрф (юная)', profile_path: '/uBB3NuknJBbqxJd7EKSNvPxYYJF.jpg' }
      ],
      crew: [{ id: 100, name: 'Кристофер Нолан', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 11,
    title: 'Начало',
    original_title: 'Inception',
    overview: 'Кобб — талантливый вор, лучший в опасном искусстве извлечения: он крадёт ценные секреты из глубин подсознания во время сна. Его уникальные способности сделали его ценным игроком в мире корпоративного шпионажа.',
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    release_date: '2010-07-15',
    vote_average: 8.8,
    vote_count: 34000,
    genre_ids: [878, 28, 12],
    popularity: 88,
    runtime: 148,
    tagline: 'Твой разум — место преступления',
    genres: [{ id: 878, name: 'Фантастика' }, { id: 28, name: 'Боевик' }, { id: 12, name: 'Приключения' }],
    videos: { results: [{ id: '11', key: 'YoHD9XEInc0', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 51, name: 'Леонардо ДиКаприо', character: 'Кобб', profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
        { id: 52, name: 'Джозеф Гордон-Левитт', character: 'Артур', profile_path: '/zvpTRs6TKLwctjD0W5DADHBhJfl.jpg' },
        { id: 53, name: 'Эллен Пейдж', character: 'Ариадна', profile_path: '/yZfgMp7BaKy0BDeZb2ml8NP6YTS.jpg' },
        { id: 54, name: 'Том Харди', character: 'Имс', profile_path: '/dXVYjTdFwiSoQJCOx8Gf6P0P71y.jpg' },
        { id: 55, name: 'Марион Котийяр', character: 'Мол', profile_path: '/eAeWIY2FyHmWl3XJKjGPlFjQWvB.jpg' }
      ],
      crew: [{ id: 110, name: 'Кристофер Нолан', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 12,
    title: 'Матрица',
    original_title: 'The Matrix',
    overview: 'Хакер по прозвищу Нео узнаёт, что вся его жизнь была виртуальным сном. Мир захвачен компьютерами, которые подключили человечество к глобальной виртуальной реальности.',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: '/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
    release_date: '1999-03-31',
    vote_average: 8.7,
    vote_count: 24000,
    genre_ids: [878, 28],
    popularity: 82,
    runtime: 136,
    tagline: 'Добро пожаловать в пустыню реального',
    genres: [{ id: 878, name: 'Фантастика' }, { id: 28, name: 'Боевик' }],
    videos: { results: [{ id: '12', key: 'vKQi3bBA1y8', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 56, name: 'Киану Ривз', character: 'Нео', profile_path: '/rLeERYRnTw2p4KpepLzxJmF4pKb.jpg' },
        { id: 57, name: 'Лоуренс Фишбёрн', character: 'Морфеус', profile_path: '/iZCpC1JLhQyQr0zLMfHdA6LDne9.jpg' },
        { id: 58, name: 'Кэрри-Энн Мосс', character: 'Тринити', profile_path: '/vGQfeO3CLsqArjVWpxoVKMo7bUc.jpg' },
        { id: 59, name: 'Хьюго Уивинг', character: 'Агент Смит', profile_path: '/qkvM9Ajd8SK8qIvNXHsL1TQd Ways.jpg' },
        { id: 60, name: 'Джо Пантолиано', character: 'Сайфер', profile_path: '/zSLE6yLqDvBQz4R7QThUoVeZqaL.jpg' }
      ],
      crew: [{ id: 120, name: 'Вачовски', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 13,
    title: 'Побег из Шоушенка',
    original_title: 'The Shawshank Redemption',
    overview: 'Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью и беззаконием.',
    poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    release_date: '1994-09-23',
    vote_average: 9.3,
    vote_count: 25000,
    genre_ids: [18, 80],
    popularity: 80,
    runtime: 142,
    tagline: 'Страх заковывает в кандалы. Надежда освобождает',
    genres: [{ id: 18, name: 'Драма' }, { id: 80, name: 'Криминал' }],
    videos: { results: [{ id: '13', key: '6hB3S9bIcoU', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 61, name: 'Тим Роббинс', character: 'Энди Дюфрейн', profile_path: '/teOFJhga4VhOWsLhFcaFXkFXvNM.jpg' },
        { id: 62, name: 'Морган Фримен', character: 'Рэд', profile_path: '/oIciQWr8VwKoR8TmAw1owaiZFyb.jpg' },
        { id: 63, name: 'Боб Гантон', character: 'Надзиратель Нортон', profile_path: '/aKuFi3ZgG99L7t0yX5OBbMvF4rn.jpg' },
        { id: 64, name: 'Уильям Сэдлер', character: 'Хейвуд', profile_path: '/7JhFfVz1Vc1sLqYwNgJhFtKL5Bf.jpg' },
        { id: 65, name: 'Кланси Браун', character: 'Капитан Хэдли', profile_path: '/daJ83AU6T1XbGk0e3LsLeHFP0Vi.jpg' }
      ],
      crew: [{ id: 130, name: 'Фрэнк Дарабонт', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 14,
    title: 'Тёмный рыцарь',
    original_title: 'The Dark Knight',
    overview: 'Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он намерен очистить улицы Готэма от преступности. Но их союз оказывается неэффективным, когда в городе появляется Джокер.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    release_date: '2008-07-16',
    vote_average: 9.0,
    vote_count: 30000,
    genre_ids: [18, 28, 80],
    popularity: 92,
    runtime: 152,
    tagline: 'Добро пожаловать в мир хаоса',
    genres: [{ id: 18, name: 'Драма' }, { id: 28, name: 'Боевик' }, { id: 80, name: 'Криминал' }],
    videos: { results: [{ id: '14', key: 'EXeTwQWrcwY', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 66, name: 'Кристиан Бэйл', character: 'Брюс Уэйн / Бэтмен', profile_path: '/qCpZn2e3dimwbryLnqxZuI88PTi.jpg' },
        { id: 67, name: 'Хит Леджер', character: 'Джокер', profile_path: '/fDD8vfh2mxKZb2BlGmMRxjsyL0t.jpg' },
        { id: 68, name: 'Аарон Экхарт', character: 'Харви Дент', profile_path: '/7bX1kHkXd1y1RtLm2U9x1sY9u8z.jpg' },
        { id: 69, name: 'Майкл Кейн', character: 'Альфред', profile_path: '/9IWg58hQmJWqPqk3YJz3mckXHll.jpg' },
        { id: 70, name: 'Гэри Олдман', character: 'Джим Гордон', profile_path: '/2y9jZWic2Sv0zUb7DnvlSjNCXnx.jpg' }
      ],
      crew: [{ id: 140, name: 'Кристофер Нолан', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 15,
    title: 'Форрест Гамп',
    original_title: 'Forrest Gump',
    overview: 'От глупца до героя войны, от звезды футбола до миллионера — Форрест Гамп невольно оказывается в центре ключевых событий американской истории второй половины XX века.',
    poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    backdrop_path: '/3h1JZGDhZ8nzxdgvkxhaLqJs3C2.jpg',
    release_date: '1994-06-23',
    vote_average: 8.8,
    vote_count: 27000,
    genre_ids: [18, 35, 10749],
    popularity: 78,
    runtime: 142,
    tagline: 'Жизнь как коробка шоколадных конфет',
    genres: [{ id: 18, name: 'Драма' }, { id: 35, name: 'Комедия' }, { id: 10749, name: 'Мелодрама' }],
    videos: { results: [{ id: '15', key: 'bLvqoHBptjg', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 71, name: 'Том Хэнкс', character: 'Форрест Гамп', profile_path: '/xPGe6KM1xQFq7MxjFpbj9PLkEmq.jpg' },
        { id: 72, name: 'Робин Райт', character: 'Дженни', profile_path: '/3iW7ABD4Rq7FNbpfMPVCKSL5pLG.jpg' },
        { id: 73, name: 'Гари Синиз', character: 'Лейтенант Дэн', profile_path: '/4cSDvYTiQRvCJLbXqM8s7pUQDyk.jpg' },
        { id: 74, name: 'Салли Филд', character: 'Мама Гамп', profile_path: '/rJYGFJqitDPmOtWlpq3kqo62D5t.jpg' },
        { id: 75, name: 'Майкелти Уильямсон', character: 'Бабба', profile_path: '/fVQlrYb8bPZYbHbRJmBuwvHhMnF.jpg' }
      ],
      crew: [{ id: 150, name: 'Роберт Земекис', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 16,
    title: 'Властелин колец: Возвращение короля',
    original_title: 'The Lord of the Rings: The Return of the King',
    overview: 'Армии Саурона начали осаду Минас Тирита, столицы Гондора. Времена становятся всё мрачнее, и Фродо с Сэмом, ведомые Голлумом, продолжают свой путь к Роковой Горе.',
    poster_path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    backdrop_path: '/lXhgCODAbBXL5buk9yEmTpOoOgR.jpg',
    release_date: '2003-12-01',
    vote_average: 9.0,
    vote_count: 22000,
    genre_ids: [12, 14, 28],
    popularity: 85,
    runtime: 201,
    tagline: 'Нет ничего вечного',
    genres: [{ id: 12, name: 'Приключения' }, { id: 14, name: 'Фэнтези' }, { id: 28, name: 'Боевик' }],
    videos: { results: [{ id: '16', key: 'r5X-hFf6Bwo', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 76, name: 'Элайджа Вуд', character: 'Фродо', profile_path: '/7UKRbJBNG7mxOQWlXgpLPvGJawZ.jpg' },
        { id: 77, name: 'Вигго Мортенсен', character: 'Арагорн', profile_path: '/AaWR1RxLXhV3l3zmnJiGwJ3NNLV.jpg' },
        { id: 78, name: 'Иэн Маккеллен', character: 'Гэндальф', profile_path: '/c51mNnaH2pVJGwyfkEMHTMQC6dk.jpg' },
        { id: 79, name: 'Шон Остин', character: 'Сэм', profile_path: '/tIlWBD5QF3xCQf6iPFiZmfZl0Aa.jpg' },
        { id: 80, name: 'Орландо Блум', character: 'Леголас', profile_path: '/qoLP2sLJqVjIjsz4qWxLsJVN3KJ.jpg' }
      ],
      crew: [{ id: 160, name: 'Питер Джексон', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 17,
    title: 'Криминальное чтиво',
    original_title: 'Pulp Fiction',
    overview: 'Несколько криминальных историй переплетаются в этом культовом фильме Квентина Тарантино. Два наёмных убийцы, боксёр, жена гангстера и пара грабителей — их судьбы пересекутся самым неожиданным образом.',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    release_date: '1994-09-10',
    vote_average: 8.9,
    vote_count: 26000,
    genre_ids: [80, 53],
    popularity: 76,
    runtime: 154,
    tagline: 'Девочки вроде меня не делают приглашений',
    genres: [{ id: 80, name: 'Криминал' }, { id: 53, name: 'Триллер' }],
    videos: { results: [{ id: '17', key: 's7EdQ4FqbhY', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 81, name: 'Джон Траволта', character: 'Винсент Вега', profile_path: '/wLhbaJNrKLnLhVKaU6BGAkx1KUM.jpg' },
        { id: 82, name: 'Сэмюэл Л. Джексон', character: 'Джулс', profile_path: '/nCJJ3NVksYNxIzEHcyC1XziwPVj.jpg' },
        { id: 83, name: 'Ума Турман', character: 'Миа', profile_path: '/pbvCpbvJtAfE0HiLWMWMGTaifvZ.jpg' },
        { id: 84, name: 'Брюс Уиллис', character: 'Бутч', profile_path: '/A1XBu3CffBpSK8HEIJM8q7Mn4lz.jpg' },
        { id: 85, name: 'Харви Кейтель', character: 'Винстон Вульф', profile_path: '/hE6DKMvVTc9rTUC2t6twWdQ9sNz.jpg' }
      ],
      crew: [{ id: 170, name: 'Квентин Тарантино', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 18,
    title: 'Бойцовский клуб',
    original_title: 'Fight Club',
    overview: 'Сотрудник страховой компании страдает хронической бессонницей и отчаянно пытается вырваться из мучительно скучной жизни. Познакомившись с харизматичным Тайлером Дёрденом, он создаёт тайный бойцовский клуб.',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    release_date: '1999-10-15',
    vote_average: 8.7,
    vote_count: 28000,
    genre_ids: [18, 53],
    popularity: 82,
    runtime: 139,
    tagline: 'Ты не твои вещи',
    genres: [{ id: 18, name: 'Драма' }, { id: 53, name: 'Триллер' }],
    videos: { results: [{ id: '18', key: 'SUXWAEX2jbg', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 86, name: 'Брэд Питт', character: 'Тайлер Дёрден', profile_path: '/kc3M04QQAuZ9wUad3LDI0Du4heO.jpg' },
        { id: 87, name: 'Эдвард Нортон', character: 'Рассказчик', profile_path: '/5xb43kjI0bJHvK3I8RyqPyPzEj6.jpg' },
        { id: 88, name: 'Хелена Бонем Картер', character: 'Марла', profile_path: '/2fnYNCnAOqXoNhpGj0O0E6GhM9J.jpg' },
        { id: 89, name: 'Мит Лоаф', character: 'Боб', profile_path: '/8aB4QXokLVCFynmfp7GCUWjRsQi.jpg' },
        { id: 90, name: 'Джаред Лето', character: 'Энджел Фейс', profile_path: '/mWUeAIeMPYfJUtQWAG7pB5qw3Vs.jpg' }
      ],
      crew: [{ id: 180, name: 'Дэвид Финчер', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 19,
    title: 'Зелёная миля',
    original_title: 'The Green Mile',
    overview: 'Пол Эджкомб — начальник блока смертников в тюрьме «Холодная гора», каждый из узников которого однажды пройдёт по «зелёной миле» — не к своему освобождению, а к смерти. Но однажды появляется заключённый с невероятным даром.',
    poster_path: '/velWPhVMQeQKcxggNEU8YmIo52R.jpg',
    backdrop_path: '/RiLnF1cSYfVhN6SqB2FqcvN1pW.jpg',
    release_date: '1999-12-10',
    vote_average: 8.6,
    vote_count: 17000,
    genre_ids: [18, 14, 80],
    popularity: 74,
    runtime: 189,
    tagline: 'Питер Джексон приглашает вас в Средиземье',
    genres: [{ id: 18, name: 'Драма' }, { id: 14, name: 'Фэнтези' }, { id: 80, name: 'Криминал' }],
    videos: { results: [{ id: '19', key: 'Ki4haFrqUPA', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 91, name: 'Том Хэнкс', character: 'Пол Эджкомб', profile_path: '/xPGe6KM1xQFq7MxjFpbj9PLkEmq.jpg' },
        { id: 92, name: 'Майкл Кларк Дункан', character: 'Джон Кофи', profile_path: '/qvdE0VWzJqVpGjBxOb5JFivRtkb.jpg' },
        { id: 93, name: 'Дэвид Морс', character: 'Брутус', profile_path: '/8Bt8EqClgZxYNniPLHxqYDfPYi.jpg' },
        { id: 94, name: 'Бонни Хант', character: 'Джен', profile_path: '/tQQcYvXlMjLNwNzQIXPF0eLQEqF.jpg' },
        { id: 95, name: 'Даг Хатчисон', character: 'Перси', profile_path: '/uBq7tF4KLQYuaVfWnYjCqy4xZxQ.jpg' }
      ],
      crew: [{ id: 190, name: 'Фрэнк Дарабонт', job: 'Director', department: 'Directing' }]
    }
  },
  {
    id: 20,
    title: 'Список Шиндлера',
    original_title: "Schindler's List",
    overview: 'История немецкого бизнесмена Оскара Шиндлера, который спас более тысячи евреев от гибели в концентрационных лагерях во время Второй мировой войны, предоставив им работу на своих заводах.',
    poster_path: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    backdrop_path: '/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg',
    release_date: '1993-11-30',
    vote_average: 9.0,
    vote_count: 15000,
    genre_ids: [18, 36, 10752],
    popularity: 70,
    runtime: 195,
    tagline: 'Кто спасает одну жизнь — спасает весь мир',
    genres: [{ id: 18, name: 'Драма' }, { id: 36, name: 'История' }, { id: 10752, name: 'Военный' }],
    videos: { results: [{ id: '20', key: 'gG22XNhtmaY', name: 'Official Trailer', site: 'YouTube', type: 'Trailer' }] },
    credits: {
      cast: [
        { id: 96, name: 'Лиам Нисон', character: 'Оскар Шиндлер', profile_path: '/9QYleQDjL3cW8qsuxKzwbhYwQvW.jpg' },
        { id: 97, name: 'Бен Кингсли', character: 'Ицхак Штерн', profile_path: '/cUz4GdLd5Ng3rZbb9s5fHJcLP3.jpg' },
        { id: 98, name: 'Рэйф Файнс', character: 'Амон Гёт', profile_path: '/bDDI6S5tF0G7QYdKhCH8PbCXBah.jpg' },
        { id: 99, name: 'Кэролайн Гудолл', character: 'Эмили Шиндлер', profile_path: '/cXUfVdVjCnQvXjQjZQXfJZhKZr.jpg' },
        { id: 100, name: 'Джонатан Сагалл', character: 'Полдек Пфферберг', profile_path: null }
      ],
      crew: [{ id: 200, name: 'Стивен Спилберг', job: 'Director', department: 'Directing' }]
    }
  }
];

// Add fullMovieKey to movies - using official trailers that allow embedding
mockMovies[0].fullMovieKey = 'Way9MexJXCU'; // Dune 2 - Official Trailer
mockMovies[1].fullMovieKey = 'uYPbbksJxIg'; // Oppenheimer - Official Trailer
mockMovies[2].fullMovieKey = 'RlbR5N6veqw'; // Poor Things - Official Trailer
mockMovies[3].fullMovieKey = 'EP34Yoxs3FQ'; // Killers of the Flower Moon - Trailer
mockMovies[4].fullMovieKey = 'yHfMVEVgNPQ'; // Master i Margarita - Trailer
mockMovies[5].fullMovieKey = 'shW9i6k8cB0'; // Spider-Man Across the Spider-Verse
mockMovies[6].fullMovieKey = 'pBk4NYhWNMM'; // Barbie - Official Trailer
mockMovies[7].fullMovieKey = 'OAZWXUkrjPc'; // Napoleon - Official Trailer
mockMovies[8].fullMovieKey = 'sGbxmsDFVnE'; // Star Wars - Trailer
mockMovies[9].fullMovieKey = 'zSWdZVtXT7E'; // Interstellar - Trailer
mockMovies[10].fullMovieKey = 'YoHD9XEInc0'; // Inception - Trailer
mockMovies[11].fullMovieKey = 'vKQi3bBA1y8'; // Matrix - Trailer
mockMovies[12].fullMovieKey = '6hB3S9bIcoU'; // Shawshank - Trailer
mockMovies[13].fullMovieKey = 'EXeTwQWrcwY'; // Dark Knight - Trailer
mockMovies[14].fullMovieKey = 'bLvqoHBptjg'; // Forrest Gump - Trailer
mockMovies[15].fullMovieKey = 'r5X-hFf6Bwo'; // LOTR Return of the King - Trailer
mockMovies[16].fullMovieKey = 's7EdQ4FqbhY'; // Pulp Fiction - Trailer
mockMovies[17].fullMovieKey = 'SUXWAEX2jbg'; // Fight Club - Trailer
mockMovies[18].fullMovieKey = 'Ki4haFrqUPA'; // Green Mile - Trailer
mockMovies[19].fullMovieKey = 'gG22XNhtmaY'; // Schindler's List - Trailer

// Top rated subset
const topRatedMovies = [...mockMovies].sort((a, b) => b.vote_average - a.vote_average);

// ============================================
// UTILITY FUNCTIONS
// ============================================
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}ч ${mins}м`;
};

const getRatingColor = (rating: number): string => {
  if (rating >= 7) return 'text-green-400';
  if (rating >= 5) return 'text-yellow-400';
  return 'text-red-400';
};

const generateSessionId = (movieId: number): string => {
  return `${movieId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================
// QR CODE GENERATOR (Simple inline version)
// ============================================
const generateQRCode = (data: string, size: number = 60): JSX.Element => {
  const cells = Math.floor(size / 4);
  const pattern: boolean[][] = [];
  
  let seed = 0;
  for (let i = 0; i < data.length; i++) {
    seed += data.charCodeAt(i);
  }
  
  const random = (x: number, y: number): boolean => {
    const val = (seed * (x + 1) * (y + 1) * 9301 + 49297) % 233280;
    return val / 233280 > 0.5;
  };
  
  for (let y = 0; y < cells; y++) {
    pattern[y] = [];
    for (let x = 0; x < cells; x++) {
      const isCorner = (x < 2 && y < 2) || (x >= cells - 2 && y < 2) || (x < 2 && y >= cells - 2);
      pattern[y][x] = isCorner || random(x, y);
    }
  }
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`}>
      <rect width={cells} height={cells} fill="white" />
      {pattern.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#1a0533" />
          ) : null
        )
      )}
    </svg>
  );
};

// ============================================
// ANIMATION VARIANTS
// ============================================
const ease = [0.16, 1, 0.3, 1] as const;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease } }
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3, ease } }
};

// ============================================
// TOAST CONTEXT
// ============================================
const ToastContext = React.createContext<{
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}>({ showToast: () => {} });

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3, ease }}
              className={`liquid-glass-strong rounded-xl px-4 py-3 flex items-center gap-3 min-w-[280px] ${
                toast.type === 'success' ? 'border-l-4 border-l-green-500' :
                toast.type === 'error' ? 'border-l-4 border-l-red-500' :
                'border-l-4 border-l-violet-500'
              }`}
            >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-violet-400" />}
              <span className="text-sm text-white/90">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => React.useContext(ToastContext);

// ============================================
// NAVBAR COMPONENT
// ============================================
const Navbar: React.FC<{ currentPage: string; navigate: (page: string, id?: string) => void }> = ({ currentPage, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Главная', page: 'home' },
    { label: 'Фильмы', page: 'movies' },
    { label: 'Сериалы', page: 'series' },
    { label: 'Новинки', page: 'new' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'liquid-glass-strong' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 group relative"
            >
              {/* Modern Logo Icon */}
              <div className="relative w-9 h-9 md:w-10 md:h-10">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient id="logoGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#C084FC" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Film reel background */}
                  <circle cx="24" cy="24" r="20" fill="url(#logoGradient)" opacity="0.15" />
                  <circle cx="24" cy="24" r="16" fill="none" stroke="url(#logoGradient)" strokeWidth="2" />
                  {/* Film holes */}
                  <circle cx="24" cy="12" r="2.5" fill="url(#logoGradient2)" filter="url(#glow)" />
                  <circle cx="24" cy="36" r="2.5" fill="url(#logoGradient2)" filter="url(#glow)" />
                  <circle cx="12" cy="24" r="2.5" fill="url(#logoGradient2)" filter="url(#glow)" />
                  <circle cx="36" cy="24" r="2.5" fill="url(#logoGradient2)" filter="url(#glow)" />
                  {/* Play button */}
                  <path d="M20 16L34 24L20 32Z" fill="url(#logoGradient)" filter="url(#glow)" className="group-hover:scale-110 transition-transform origin-center" style={{transformOrigin: '24px 24px'}} />
                </svg>
                {/* Animated ring on hover */}
                <div className="absolute inset-0 rounded-full border-2 border-violet-500/0 group-hover:border-violet-500/50 group-hover:scale-110 transition-all duration-300" />
              </div>
              
              {/* Modern Typography */}
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg md:text-xl tracking-tight">
                  <span className="text-white">До</span>
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">ма</span>
                  <span className="text-white">кино</span>
                </span>
                <span className="text-[8px] md:text-[9px] text-violet-400/60 tracking-[0.2em] uppercase font-medium -mt-0.5">Online Cinema</span>
              </div>
            </motion.button>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map(link => (
                <motion.button
                  key={link.page}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(link.page)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === link.page
                      ? 'liquid-glass-violet text-white'
                      : 'liquid-glass text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('admin')}
                className={`liquid-glass w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentPage === 'admin' ? 'bg-violet-600 text-white' : 'text-white/70 hover:text-white'
                }`}
                title="Админ панель"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="liquid-glass-violet px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-white"
              >
                <User className="w-4 h-4" />
                Войти
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease }}
            className="fixed top-16 left-0 right-0 z-40 liquid-glass-strong md:hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.page}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    navigate(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-left font-medium transition-all ${
                    currentPage === link.page
                      ? 'liquid-glass-violet text-white'
                      : 'liquid-glass text-white/70'
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                onClick={() => {
                  navigate('admin');
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-xl text-left font-medium transition-all flex items-center gap-2 ${
                  currentPage === 'admin'
                    ? 'liquid-glass-violet text-white'
                    : 'liquid-glass text-white/70'
                }`}
              >
                <Settings className="w-4 h-4" />
                Админ панель
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.05 }}
                className="liquid-glass-violet px-4 py-3 rounded-xl flex items-center gap-2 font-medium text-white mt-2"
              >
                <User className="w-4 h-4" />
                Войти
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================
// MOVIE CARD COMPONENT
// ============================================
const MovieCard: React.FC<{
  movie: Movie;
  rank?: number;
  onClick: () => void;
  onPlayFull?: (movie: Movie, player?: 1 | 2) => void;
  onDelete?: (movie: Movie) => void;
  isAdminMovie?: boolean;
}> = ({ movie, rank, onClick, onPlayFull, onDelete, isAdminMovie }) => {
  const [imageError, setImageError] = useState(false);
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE}/w500${movie.poster_path}`
    : null;

  const hasVideo = !!movie.player1Url || !!movie.player2Url;
  const hasMultiplePlayers = !!movie.player1Url && !!movie.player2Url;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer relative aspect-[2/3] rounded-xl overflow-hidden liquid-glass"
    >
      {!imageError && posterUrl ? (
        <img
          src={posterUrl}
          alt={movie.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-violet-900/30 to-black flex items-center justify-center p-4">
          <span className="text-center text-sm text-white/60 font-medium line-clamp-3">{movie.title}</span>
        </div>
      )}

      {rank && (
        <div className="absolute top-2 left-2 liquid-glass-violet px-2 py-1 rounded-lg text-sm font-bold text-white z-10">
          #{rank}
        </div>
      )}

      {/* Video Available Badge */}
      {hasVideo && (
        <div className="absolute top-2 right-2 bg-green-500/90 px-2 py-1 rounded-lg text-xs font-semibold text-white z-10 flex items-center gap-1">
          <Play className="w-3 h-3 fill-current" />
          {hasMultiplePlayers ? '2 плеера' : 'HD'}
        </div>
      )}

      {/* Delete button for admin movies */}
      {isAdminMovie && onDelete && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(movie);
          }}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-12">
        <h3 className="font-medium text-sm text-white truncate">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-white/50">
            {movie.release_date?.split('-')[0] || 'TBA'}
          </span>
          <span className={`flex items-center gap-1 text-xs ${getRatingColor(movie.vote_average)}`}>
            <Star className="w-3 h-3 fill-current" />
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
        {hasVideo ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onPlayFull?.(movie, 1);
              }}
              className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded-full flex items-center gap-2 text-sm font-semibold text-white transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              Смотреть
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="liquid-glass px-6 py-2 rounded-full text-sm font-medium text-white/90"
            >
              Подробнее
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-violet-600 hover:bg-violet-500 px-6 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-white transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Трейлер
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="liquid-glass px-6 py-2 rounded-full text-sm font-medium text-white/90"
            >
              Подробнее
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// SKELETON CARD COMPONENT
// ============================================
const SkeletonCard: React.FC = () => (
  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-white/5 animate-pulse">
    <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
  </div>
);

// ============================================
// CUSTOM VIDEO PLAYER MODAL
// ============================================
const VideoPlayerModal: React.FC<{
  movie: Movie;
  onClose: () => void;
  initialPlayer?: 1 | 2;
  allMovies?: Movie[];
}> = ({ movie, onClose, initialPlayer = 1, allMovies = [] }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePlayer, setActivePlayer] = useState<1 | 2>(initialPlayer);
  const [showControls, setShowControls] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasPlayer1 = !!movie.player1Url;
  const hasPlayer2 = !!movie.player2Url;
  const hasMultiplePlayers = hasPlayer1 && hasPlayer2;

  // Get recommended movies (excluding current)
  const recommendedMovies = useMemo(() => {
    return allMovies
      .filter(m => m.id !== movie.id && (m.player1Url || m.player2Url))
      .slice(0, 10);
  }, [allMovies, movie.id]);

  // Parse video URL - supports YouTube, VK, and direct links
  const parseVideoUrl = (url: string): { type: 'youtube' | 'vk' | 'direct'; id: string } | null => {
    try {
      // YouTube patterns
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
      if (ytMatch) {
        return { type: 'youtube', id: ytMatch[1] };
      }
      // VK patterns
      const vkMatch = url.match(/video(-?\d+)_(\d+)/);
      if (vkMatch) {
        return { type: 'vk', id: `${vkMatch[1]}_${vkMatch[2]}` };
      }
      // Direct link
      if (url.includes('.mp4') || url.includes('.m3u8')) {
        return { type: 'direct', id: url };
      }
      return null;
    } catch {
      return null;
    }
  };

  const currentPlayerUrl = activePlayer === 1 ? movie.player1Url : movie.player2Url;
  const currentPlayerQuality = activePlayer === 1 ? movie.player1Quality : movie.player2Quality;
  const videoParams = currentPlayerUrl ? parseVideoUrl(currentPlayerUrl) : null;

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isFullscreen) {
        setShowControls(false);
      }
    }, 3000);
  }, [isFullscreen]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      const elem = containerRef.current;
      if (!document.fullscreenElement && !((document as any).webkitFullscreenElement)) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.log('Fullscreen not supported');
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Open video in new tab
  const openVideoDirect = () => {
    if (currentPlayerUrl) {
      window.open(currentPlayerUrl, '_blank');
    }
  };

  // Render video iframe
  const renderVideo = () => {
    if (!videoParams) {
      return (
        <div className="flex flex-col items-center justify-center text-white/60 h-full">
          <Film className="w-16 h-16 mb-4" />
          <p>Видео недоступно</p>
        </div>
      );
    }

    if (videoParams.type === 'youtube') {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoParams.id}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`}
          className="w-full h-full"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      );
    }

    if (videoParams.type === 'vk') {
      const [oid, vid] = videoParams.id.split('_');
      return (
        <iframe
          src={`https://vk.com/video_ext.php?oid=${oid}&id=${vid}&hd=2&autoplay=1`}
          className="w-full h-full"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      );
    }

    // Direct video link
    return (
      <video
        src={videoParams.id}
        className="w-full h-full"
        controls
        autoPlay
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
      ref={containerRef}
      onMouseMove={resetControlsTimeout}
    >
      {/* Video iframe */}
      <div className="absolute inset-0 flex items-center justify-center">
        {renderVideo()}
      </div>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6 pointer-events-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="liquid-glass w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quality badge */}
                  {currentPlayerQuality && (
                    <span className="liquid-glass-violet px-3 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      {currentPlayerQuality}
                    </span>
                  )}
                  
                  {/* Player switcher */}
                  {hasMultiplePlayers && (
                    <div className="flex items-center gap-1 liquid-glass rounded-full p-1">
                      <button
                        onClick={() => setActivePlayer(1)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          activePlayer === 1 ? 'bg-violet-500 text-white' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Плеер 1
                      </button>
                      <button
                        onClick={() => setActivePlayer(2)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          activePlayer === 2 ? 'bg-violet-500 text-white' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Плеер 2
                      </button>
                    </div>
                  )}

                  {/* Open direct link */}
                  {currentPlayerUrl && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openVideoDirect}
                      className="liquid-glass px-4 py-2 rounded-full text-xs font-medium text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Открыть
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullscreen}
                    className="liquid-glass w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white"
                  >
                    <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Bottom Section - Movie Info & Recommendations */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
              {/* Toggle Recommendations Button */}
              <div className="flex justify-center mb-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="liquid-glass px-4 py-2 rounded-full text-xs text-white/70 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Film className="w-4 h-4" />
                  {showRecommendations ? 'Скрыть рекомендации' : 'Показать рекомендации'}
                </motion.button>
              </div>

              {/* Current Movie Info */}
              <div className="bg-gradient-to-t from-black via-black/90 to-transparent px-4 sm:px-8 py-4 sm:py-6">
                <div className="max-w-7xl mx-auto">
                  {/* Movie Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg sm:text-2xl text-white">{movie.title}</h2>
                      <div className="flex items-center gap-3 mt-1 text-sm text-white/60">
                        <span>{movie.release_date?.split('-')[0]}</span>
                        {movie.runtime && (
                          <>
                            <span>•</span>
                            <span>{formatRuntime(movie.runtime)}</span>
                          </>
                        )}
                        <span className={`flex items-center gap-1 ${getRatingColor(movie.vote_average)}`}>
                          <Star className="w-4 h-4 fill-current" />
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <AnimatePresence>
                    {showRecommendations && recommendedMovies.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Film className="w-4 h-4 text-violet-400" />
                          <span className="text-sm text-white/60">Следующие фильмы</span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                          {recommendedMovies.map((recMovie) => (
                            <motion.button
                              key={recMovie.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                onClose();
                                setTimeout(() => {
                                  window.dispatchEvent(new CustomEvent('playMovie', { detail: recMovie }));
                                }, 100);
                              }}
                              className="shrink-0 w-24 sm:w-32 group"
                            >
                              <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 relative">
                                {recMovie.poster_path ? (
                                  <img
                                    src={`${IMAGE_BASE}/w342${recMovie.poster_path}`}
                                    alt={recMovie.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                    <Film className="w-8 h-8 text-white/20" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Play className="w-8 h-8 text-white fill-current" />
                                </div>
                              </div>
                              <p className="text-xs text-white/80 truncate text-left">{recMovie.title}</p>
                              <p className="text-xs text-white/40 text-left">{recMovie.release_date?.split('-')[0]}</p>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show controls hint when hidden */}
      {!showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/30 text-sm"
          >
            Двигайте мышкой для управления
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================
// FADE UP COMPONENT
// ============================================
const FadeUp: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0
}) => (
  <motion.div
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, margin: '-40px' }}
    variants={{
      initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
      animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease, delay } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// ============================================
// HOME PAGE
// ============================================
const HomePage: React.FC<{
  trendingMovies: Movie[];
  topRatedMovies: Movie[];
  loading: boolean;
  navigate: (page: string, id?: string) => void;
  onPlayMovie: (movie: Movie) => void;
  onDeleteMovie?: (movie: Movie) => void;
  adminMovieIds?: Set<number>;
}> = ({ trendingMovies, topRatedMovies, loading, navigate, onPlayMovie, onDeleteMovie, adminMovieIds }) => {
  const heroMovie = trendingMovies[0];

  return (
    <div className="min-h-screen">
      {heroMovie && (
        <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={`${IMAGE_BASE}/w1280${heroMovie.backdrop_path}`}
              alt={heroMovie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080F] via-[#07080F]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07080F] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full pt-20">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
                className="space-y-6"
              >
                <div className="liquid-glass-violet inline-flex px-4 py-1.5 rounded-full">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-violet-300">
                    Сейчас в тренде
                  </span>
                </div>

                <h1 className="font-heading italic text-4xl md:text-5xl lg:text-6xl text-white tracking-tight text-balance leading-tight">
                  {heroMovie.title}
                </h1>

                <p className="text-white/60 leading-relaxed max-w-xl text-sm md:text-base line-clamp-3">
                  {heroMovie.overview}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`flex items-center gap-1.5 liquid-glass px-3 py-1.5 rounded-lg ${getRatingColor(heroMovie.vote_average)}`}>
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{heroMovie.vote_average.toFixed(1)}</span>
                  </span>
                  {heroMovie.genre_ids?.slice(0, 3).map(genreId => (
                    <span key={genreId} className="liquid-glass px-3 py-1.5 rounded-lg text-xs text-white/70">
                      {genreMap[genreId] || 'Жанр'}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('movie', heroMovie.id.toString())}
                    className="bg-violet-600 hover:bg-violet-500 px-8 py-3 rounded-full flex items-center gap-2 font-medium text-white transition-colors active:scale-95"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Смотреть сейчас
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('movie', heroMovie.id.toString())}
                    className="liquid-glass px-8 py-3 rounded-full flex items-center gap-2 font-medium text-white/90 active:scale-95"
                  >
                    <Ticket className="w-5 h-5" />
                    Купить билет
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.2 }}
                className="hidden lg:flex justify-end"
              >
                <div className="relative animate-float">
                  <div className="liquid-glass-strong rounded-2xl p-2 max-w-[280px]">
                    <img
                      src={`${IMAGE_BASE}/w500${heroMovie.poster_path}`}
                      alt={heroMovie.title}
                      className="w-full rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150"><rect fill="%231a0533" width="100" height="150"/><text x="50" y="75" text-anchor="middle" fill="%23A78BFA" font-size="12">Постер</text></svg>';
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      <section className="relative py-12 md:py-16">
        <div className="absolute left-0 top-0 w-96 h-32 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="font-heading text-2xl md:text-3xl text-white mb-8 flex items-center gap-3">
              🔥 Топ 20 Недели
            </h2>
          </FadeUp>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          >
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
              : trendingMovies.slice(0, 20).map((movie, index) => (
                  <FadeUp key={movie.id} delay={index * 0.05}>
                    <MovieCard
                      movie={movie}
                      rank={index + 1}
                      onClick={() => navigate('movie', movie.id.toString())}
                      onPlayFull={() => onPlayMovie(movie)}
                      onDelete={onDeleteMovie}
                      isAdminMovie={adminMovieIds?.has(movie.id)}
                    />
                  </FadeUp>
                ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="font-heading text-2xl md:text-3xl text-white mb-8 flex items-center gap-3">
              ⭐ Лучшие Фильмы
            </h2>
          </FadeUp>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          >
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
              : topRatedMovies.slice(0, 10).map((movie, index) => (
                  <FadeUp key={movie.id} delay={index * 0.05}>
                    <MovieCard
                      movie={movie}
                      onClick={() => navigate('movie', movie.id.toString())}
                      onPlayFull={() => onPlayMovie(movie)}
                      onDelete={onDeleteMovie}
                      isAdminMovie={adminMovieIds?.has(movie.id)}
                    />
                  </FadeUp>
                ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// ============================================
// MOVIE DETAIL PAGE
// ============================================
const MovieDetailPage: React.FC<{
  movie: Movie | null;
  loading: boolean;
  navigate: (page: string, id?: string) => void;
  movieId: string;
  onPlayMovie?: (movie: Movie) => void;
}> = ({ movie, loading, navigate, movieId, onPlayMovie }) => {
  const { showToast } = useToast();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<number>(0);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Generate random taken seats using useMemo
  const takenSeats = useMemo(() => {
    const taken = new Set<string>();
    const rows = 'ABCDEFGH';
    for (let r = 0; r < 8; r++) {
      for (let s = 1; s <= 10; s++) {
        if (Math.random() < 0.3) {
          taken.add(`${rows[r]}${s}`);
        }
      }
    }
    return taken;
  }, [movieId]);

  // Generate next 7 days
  const dates = useMemo(() => {
    const result = [];
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      result.push({
        day: days[date.getDay()],
        date: date.getDate(),
        full: date
      });
    }
    return result;
  }, []);

  const timeSlots = ['13:00', '15:30', '19:00', '21:30'];

  const handleSeatClick = (seatId: string) => {
    if (takenSeats.has(seatId)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      }
      if (prev.length >= 2) {
        showToast('Максимум 2 места', 'info');
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const getSeatClass = (seatId: string): string => {
    if (takenSeats.has(seatId)) return 'seat seat-taken';
    if (selectedSeats.includes(seatId)) return 'seat seat-selected';
    return 'seat seat-available';
  };

  const getPrice = (): number => {
    let total = 0;
    selectedSeats.forEach(seat => {
      const row = seat[0];
      if (['A', 'B'].includes(row)) total += 4000;
      else if (['C', 'D', 'E', 'F'].includes(row)) total += 2500;
      else total += 1500;
    });
    return total;
  };

  const trailerKey = movie?.videos?.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  )?.key;

  const director = movie?.credits?.crew?.find(c => c.job === 'Director');
  const cast = movie?.credits?.cast?.slice(0, 5) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Фильм не найден</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {movie.backdrop_path && (
            <img
              src={`${IMAGE_BASE}/w1280${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080F] via-[#07080F]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07080F] via-[#07080F]/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="hidden md:block liquid-glass-strong rounded-xl p-2 w-[180px] shrink-0"
              >
                <img
                  src={`${IMAGE_BASE}/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150"><rect fill="%231a0533" width="100" height="150"/><text x="50" y="75" text-anchor="middle" fill="%23A78BFA" font-size="12">Постер</text></svg>';
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h1 className="font-heading italic text-3xl md:text-5xl lg:text-6xl text-white tracking-tight">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-white/40 italic text-lg">{movie.tagline}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                  <span>{movie.release_date?.split('-')[0]}</span>
                  <span>·</span>
                  {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
                  <span>·</span>
                  <span className={`flex items-center gap-1 ${getRatingColor(movie.vote_average)}`}>
                    <Star className="w-4 h-4 fill-current" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((genre, idx) => (
                    <span key={`genre-${idx}-${genre.name}`} className="liquid-glass px-3 py-1.5 rounded-lg text-xs text-white/70">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#07080F] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            <div className="lg:col-span-4 space-y-8">
              <FadeUp>
                <section className="space-y-6">
                  <h2 className="font-heading text-xl md:text-2xl text-white">О фильме</h2>
                  <p className="text-white/60 leading-relaxed">{movie.overview}</p>

                  {director && (
                    <div>
                      <span className="text-white/40 text-sm">Режиссёр</span>
                      <p className="text-white font-medium">{director.name}</p>
                    </div>
                  )}

                  {cast.length > 0 && (
                    <div>
                      <span className="text-white/40 text-sm block mb-3">В ролях</span>
                      <div className="flex flex-wrap gap-4">
                        {cast.map(actor => (
                          <div key={actor.id} className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden liquid-glass">
                              {actor.profile_path ? (
                                <img
                                  src={`${IMAGE_BASE}/w185${actor.profile_path}`}
                                  alt={actor.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                  <User className="w-5 h-5 text-white/30" />
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-white font-medium">{actor.name}</p>
                              <p className="text-xs text-white/40">{actor.character}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </FadeUp>

              {trailerKey && (
                <FadeUp delay={0.1}>
                  <section className="space-y-4">
                    <h2 className="font-heading text-xl md:text-2xl text-white">Трейлер</h2>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setShowTrailerModal(true)}
                      className="relative w-full aspect-video rounded-2xl overflow-hidden liquid-glass group"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${trailerKey}/maxresdefault.jpg`}
                        alt="Trailer thumbnail"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://img.youtube.com/vi/${trailerKey}/hqdefault.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white fill-current ml-1" />
                        </div>
                      </div>
                    </motion.button>
                  </section>
                </FadeUp>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <FadeUp delay={0.2}>
                  <div className="liquid-glass-strong rounded-3xl p-6 space-y-6">
                    {/* Watch Movie Section */}
                    {(movie.player1Url || movie.player2Url) ? (
                      <>
                        <h2 className="font-heading text-xl text-white flex items-center gap-2">
                          🎬 Смотреть Фильм
                        </h2>
                        
                        <div className="space-y-3">
                          {/* Player 1 */}
                          {movie.player1Url && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => onPlayMovie?.(movie)}
                              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-colors bg-green-500 hover:bg-green-400"
                            >
                              <Play className="w-6 h-6 fill-current" />
                              <span>Плеер 1</span>
                              {movie.player1Quality && (
                                <span className="text-white/70 text-sm">({movie.player1Quality})</span>
                              )}
                            </motion.button>
                          )}
                          
                          {/* Player 2 */}
                          {movie.player2Url && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => onPlayMovie?.(movie)}
                              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-colors liquid-glass hover:bg-white/10"
                            >
                              <Play className="w-6 h-6 fill-current" />
                              <span>Плеер 2</span>
                              {movie.player2Quality && (
                                <span className="text-white/70 text-sm">({movie.player2Quality})</span>
                              )}
                            </motion.button>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                            HD Качество
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-violet-400 rounded-full" />
                            Без рекламы
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Ticket Booking Section - only show if no video */}
                        <h2 className="font-heading text-xl text-white flex items-center gap-2">
                          🎟 Забронировать Место
                        </h2>

                        <div className="text-center">
                          <div className="w-3/4 mx-auto h-2 bg-white/15 rounded-full mb-2" style={{ borderRadius: '50%' }} />
                          <span className="text-xs text-white/40 uppercase tracking-widest">ЭКРАН</span>
                        </div>

                        <div className="overflow-x-auto hide-scrollbar">
                          <div className="min-w-[320px] space-y-2">
                            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
                              <div key={row} className="flex items-center gap-1">
                                <span className="w-5 text-xs text-white/40 text-center">{row}</span>
                                <div className="flex gap-1 flex-1 justify-center">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => {
                                    const seatId = `${row}${num}`;
                                    const isVip = ['A', 'B'].includes(row);
                                    const isEco = ['G', 'H'].includes(row);
                                    return (
                                      <motion.button
                                        key={seatId}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`${getSeatClass(seatId)} ${
                                          isVip ? 'w-7 h-7' : isEco ? 'w-6 h-6 text-[10px]' : ''
                                        }`}
                                        disabled={takenSeats.has(seatId)}
                                      />
                                    );
                                  })}
                                </div>
                                <span className="w-5" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-center gap-4 text-xs text-white/50">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-white/10" />
                            Свободно
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-violet-500" />
                            Выбрано
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-white/5 opacity-40" />
                            Занято
                          </div>
                        </div>

                        <AnimatePresence>
                          {selectedSeats.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-4"
                            >
                              <div>
                                <span className="text-xs text-white/40 mb-2 block">Дата</span>
                                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                                  {dates.map((d, idx) => (
                                    <motion.button
                                      key={idx}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => setSelectedDate(idx)}
                                      className={`shrink-0 px-4 py-2 rounded-xl flex flex-col items-center min-w-[60px] ${
                                        selectedDate === idx ? 'liquid-glass-violet' : 'liquid-glass'
                                      }`}
                                    >
                                      <span className="text-xs text-white/50">{d.day}</span>
                                      <span className="text-lg font-medium text-white">{d.date}</span>
                                    </motion.button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="text-xs text-white/40 mb-2 block">Время</span>
                                <div className="flex gap-2 flex-wrap">
                                  {timeSlots.map((time, idx) => (
                                    <motion.button
                                      key={time}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => setSelectedTime(idx)}
                                      className={`px-4 py-2 rounded-xl ${
                                        selectedTime === idx ? 'liquid-glass-violet' : 'liquid-glass'
                                      }`}
                                    >
                                      <span className="text-sm text-white">{time}</span>
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <AnimatePresence>
                          {selectedSeats.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              className="space-y-3"
                            >
                              <p className="text-sm text-white/60 text-center">
                                {selectedSeats.length} место(а) · Ряд {selectedSeats.map(s => s[0]).join(', ')} · {timeSlots[selectedTime]}
                              </p>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowTicketModal(true)}
                                className="w-full liquid-glass-violet rounded-full py-3 text-white font-medium flex items-center justify-center gap-2"
                              >
                                <Ticket className="w-5 h-5" />
                                Забронировать — {getPrice()}₸
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTrailerModal && trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowTrailerModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </motion.div>
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-4 right-4 liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTicketModal && (
          <TicketModal
            movie={movie}
            selectedSeats={selectedSeats}
            selectedDate={dates[selectedDate]}
            selectedTime={timeSlots[selectedTime]}
            price={getPrice()}
            onClose={() => setShowTicketModal(false)}
            navigate={navigate}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================
// TICKET MODAL COMPONENT
// ============================================
const TicketModal: React.FC<{
  movie: Movie;
  selectedSeats: string[];
  selectedDate: { day: string; date: number; full: Date };
  selectedTime: string;
  price: number;
  onClose: () => void;
  navigate: (page: string, id?: string) => void;
}> = ({ movie, selectedSeats, selectedDate, selectedTime, price, onClose, navigate }) => {
  const { showToast } = useToast();
  const [sessionId] = useState(() => generateSessionId(movie.id));

  const handleDownload = async () => {
    showToast('Скачивание началось...', 'info');
    setTimeout(() => {
      showToast('Билеты скачаны!', 'success');
    }, 1500);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?session=${sessionId}`;
    navigator.clipboard.writeText(shareUrl);
    showToast('Ссылка скопирована!', 'success');
  };

  const handleWatchTogether = () => {
    sessionStorage.setItem(`session_${sessionId}`, JSON.stringify({
      movieId: movie.id,
      seats: selectedSeats,
      time: selectedTime,
      date: selectedDate.full.toISOString()
    }));
    navigate('player', sessionId);
    onClose();
  };

  const formatDateStr = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-lg space-y-6 my-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl text-white flex items-center gap-2">
            🎉 Ваши Билеты
          </h2>
          <button
            onClick={onClose}
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {selectedSeats.map((seat, idx) => (
            <motion.div
              key={seat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ transform: `rotate(${idx === 0 ? -1 : 1}deg)` }}
              className="ticket-body rounded-2xl overflow-hidden"
            >
              <div className="flex h-40">
                <div className="w-2/5 relative">
                  <img
                    src={`${IMAGE_BASE}/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150"><rect fill="%231a0533" width="100" height="150"/><text x="50" y="75" text-anchor="middle" fill="%23A78BFA" font-size="12">Постер</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" />
                </div>

                <div className="w-3/5 p-4 relative flex flex-col justify-between">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-90">
                    <span className="text-[8px] text-white/30 tracking-[0.2em] uppercase">ADMIT ONE</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm truncate pr-2">{movie.title}</h3>
                    <p className="text-xs text-violet-300 mt-1">Домакино Online</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-white/60">
                      <span>Ряд / Место</span>
                      <span className="text-white">{seat[0]} / {seat.slice(1)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Дата / Время</span>
                      <span className="text-white">{formatDateStr(selectedDate.full)} / {selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Цена</span>
                      <span className="text-violet-400 font-medium">{seat[0] === 'A' || seat[0] === 'B' ? '4000' : seat[0] === 'G' || seat[0] === 'H' ? '1500' : '2500'}₸</span>
                    </div>
                  </div>

                  <div className="absolute right-3 bottom-3 flex flex-col items-center">
                    {generateQRCode(`${sessionId}-${seat}`, 50)}
                    <span className="text-[8px] text-white/40 mt-1">SCAN</span>
                  </div>
                </div>
              </div>

              <div className="ticket-perforation h-1" />
            </motion.div>
          ))}
        </div>

        <div className="liquid-glass-strong rounded-xl p-4 text-center">
          <p className="text-white/60 text-sm">Итого к оплате</p>
          <p className="text-2xl font-bold text-white">{price}₸</p>
        </div>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWatchTogether}
            className="w-full bg-violet-600 hover:bg-violet-500 rounded-full py-3 text-white font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-5 h-5" />
            Смотреть вместе
          </motion.button>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="flex-1 liquid-glass rounded-full py-3 text-white/80 font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Скачать
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              className="flex-1 liquid-glass rounded-full py-3 text-white/80 font-medium flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Поделиться
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// VOICE CHAT POPUP COMPONENT (Real WebRTC)
// ============================================
interface Peer {
  id: string;
  name: string;
  connection: RTCPeerConnection | null;
  stream: MediaStream | null;
  isMuted: boolean;
  audioLevel: number;
}

const VoiceChatPopup: React.FC<{
  sessionId: string;
  onClose: () => void;
}> = ({ sessionId, onClose }) => {
  const { showToast } = useToast();
  const [isMinimized, setIsMinimized] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [connectionCode, setConnectionCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio level visualization
  const startAudioVisualization = useCallback(() => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(average / 255);
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  }, []);

  const stopAudioVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Start microphone
  const startMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      localStreamRef.current = stream;
      setLocalStream(stream);
      
      // Setup audio analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      startAudioVisualization();
      setMicEnabled(true);
      showToast('Микрофон включён', 'success');
      
    } catch (error) {
      console.error('Microphone error:', error);
      showToast('Нет доступа к микрофону', 'error');
    }
  }, [showToast, startAudioVisualization]);

  // Stop microphone
  const stopMicrophone = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
    stopAudioVisualization();
    setMicEnabled(false);
    setAudioLevel(0);
  }, [stopAudioVisualization]);

  // Toggle microphone
  const toggleMic = useCallback(() => {
    if (micEnabled) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  }, [micEnabled, startMicrophone, stopMicrophone]);

  // Create WebRTC offer (host)
  const createOffer = useCallback(async () => {
    if (!localStreamRef.current) {
      await startMicrophone();
    }
    
    setIsConnecting(true);
    
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      });
      
      peerConnectionRef.current = pc;
      
      // Add local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }
      
      // Handle incoming tracks
      pc.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
        setIsConnected(true);
        setPeers([{
          id: 'remote',
          name: 'Друг',
          connection: pc,
          stream: event.streams[0],
          isMuted: false,
          audioLevel: 0
        }]);
        showToast('Пользователь подключился!', 'success');
      };
      
      // Collect ICE candidates
      const iceCandidates: RTCIceCandidate[] = [];
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          iceCandidates.push(event.candidate);
        }
      };
      
      // Wait for ICE gathering
      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === 'complete') {
          const offer = pc.localDescription;
          if (offer) {
            const code = btoa(JSON.stringify({
              type: 'offer',
              sdp: offer.sdp,
              ice: iceCandidates
            }));
            setConnectionCode(code);
            showToast('Код создан! Скопируйте и отправьте другу', 'info');
          }
        }
      };
      
      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
    } catch (error) {
      console.error('Create offer error:', error);
      showToast('Ошибка создания соединения', 'error');
    }
    
    setIsConnecting(false);
  }, [startMicrophone, showToast]);

  // Answer to WebRTC offer (joiner)
  const answerOffer = useCallback(async () => {
    if (!inputCode) {
      showToast('Введите код подключения', 'error');
      return;
    }
    
    if (!localStreamRef.current) {
      await startMicrophone();
    }
    
    setIsConnecting(true);
    
    try {
      const data = JSON.parse(atob(inputCode));
      
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      });
      
      peerConnectionRef.current = pc;
      
      // Add local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }
      
      // Handle incoming tracks
      pc.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
        setIsConnected(true);
        showToast('Подключено к голосовому чату!', 'success');
      };
      
      // Set remote description
      await pc.setRemoteDescription(new RTCSessionDescription({
        type: 'offer',
        sdp: data.sdp
      }));
      
      // Create answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      // Wait for ICE gathering and create answer code
      const iceCandidates: RTCIceCandidate[] = [];
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          iceCandidates.push(event.candidate);
        }
      };
      
      pc.onicegatheringstatechange = async () => {
        if (pc.iceGatheringState === 'complete') {
          const ans = pc.localDescription;
          if (ans) {
            const code = btoa(JSON.stringify({
              type: 'answer',
              sdp: ans.sdp,
              ice: iceCandidates
            }));
            setConnectionCode(code);
            showToast('Отправьте ответный код хосту', 'info');
          }
        }
      };
      
    } catch (error) {
      console.error('Answer error:', error);
      showToast('Неверный код', 'error');
    }
    
    setIsConnecting(false);
  }, [inputCode, startMicrophone, showToast]);

  // Accept answer (host)
  const acceptAnswer = useCallback(async () => {
    if (!inputCode || !peerConnectionRef.current) {
      showToast('Введите ответный код', 'error');
      return;
    }
    
    try {
      const data = JSON.parse(atob(inputCode));
      
      if (data.type !== 'answer') {
        showToast('Это не ответный код', 'error');
        return;
      }
      
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: data.sdp
      }));
      
      // Add ICE candidates
      if (data.ice) {
        for (const candidate of data.ice) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      }
      
      setIsConnected(true);
      showToast('Соединение установлено!', 'success');
      
    } catch (error) {
      console.error('Accept answer error:', error);
      showToast('Ошибка подключения', 'error');
    }
  }, [inputCode, showToast]);

  // Copy code to clipboard
  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(connectionCode);
    showToast('Код скопирован!', 'success');
  }, [connectionCode, showToast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [stopMicrophone]);

  // Audio level indicator
  const AudioLevelIndicator: React.FC<{ level: number; enabled: boolean }> = ({ level, enabled }) => (
    <div className="flex items-center gap-0.5 h-8">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={`w-1 rounded-full transition-all duration-75 ${
            enabled && level * 5 >= bar
              ? 'bg-green-400'
              : 'bg-white/20'
          }`}
          style={{ height: `${bar * 6}px` }}
        />
      ))}
    </div>
  );

  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 liquid-glass-violet w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
      >
        <Mic className="w-6 h-6 text-white" />
        {isConnected && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      className="fixed bottom-4 right-4 z-50 w-80 liquid-glass-strong rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-violet-600/20">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-violet-400" />
          <span className="font-medium text-white text-sm">Голосовой чат</span>
          {isConnected && (
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMinimized(true)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
          >
            <ChevronRight className="w-4 h-4 rotate-45" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Connection status */}
        {!isConnected ? (
          <div className="space-y-3">
            {/* Options */}
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createOffer}
                disabled={isConnecting}
                className="bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 rounded-xl py-2.5 text-white text-xs font-medium transition-colors"
              >
                {isConnecting ? 'Создание...' : 'Создать комнату'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCodeInput(true)}
                disabled={isConnecting}
                className="liquid-glass hover:bg-white/10 disabled:opacity-50 rounded-xl py-2.5 text-white/80 text-xs font-medium transition-colors"
              >
                Присоединиться
              </motion.button>
            </div>

            {/* Connection code */}
            {connectionCode && !showCodeInput && (
              <div className="space-y-2">
                <p className="text-xs text-white/60">Ваш код (отправьте другу):</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={connectionCode.slice(0, 20) + '...'}
                    readOnly
                    className="flex-1 liquid-glass rounded-lg px-3 py-2 text-xs text-white/80 bg-transparent"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={copyCode}
                    className="liquid-glass-violet px-3 rounded-lg text-xs text-white"
                  >
                    Копировать
                  </motion.button>
                </div>
                <p className="text-xs text-violet-400">Теперь введите ответный код от друга</p>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Вставьте ответный код..."
                  className="w-full liquid-glass rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 bg-transparent outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={acceptAnswer}
                  className="w-full bg-green-600 hover:bg-green-500 rounded-lg py-2 text-white text-xs font-medium"
                >
                  Подключить
                </motion.button>
              </div>
            )}

            {/* Join input */}
            {showCodeInput && (
              <div className="space-y-2">
                <p className="text-xs text-white/60">Введите код от хоста:</p>
                <textarea
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Вставьте код..."
                  className="w-full liquid-glass rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 bg-transparent outline-none h-16 resize-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={answerOffer}
                    className="bg-violet-600 hover:bg-violet-500 rounded-lg py-2 text-white text-xs font-medium"
                  >
                    Ответить
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCodeInput(false);
                      setInputCode('');
                    }}
                    className="liquid-glass rounded-lg py-2 text-white/60 text-xs"
                  >
                    Отмена
                  </motion.button>
                </div>
                {connectionCode && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-white/60">Ваш ответ (отправьте хосту):</p>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={connectionCode.slice(0, 20) + '...'}
                        readOnly
                        className="flex-1 liquid-glass rounded-lg px-3 py-2 text-xs text-white/80 bg-transparent"
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={copyCode}
                        className="liquid-glass-violet px-3 rounded-lg text-xs text-white"
                      >
                        Копировать
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Connected users */}
            <div className="flex justify-center gap-6">
              {/* Local user */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                    micEnabled ? 'bg-violet-600' : 'bg-white/10'
                  }`}>
                    Вы
                  </div>
                  {micEnabled && audioLevel > 0 && (
                    <div 
                      className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping"
                      style={{ animationDuration: '1s' }}
                    />
                  )}
                </div>
                <AudioLevelIndicator level={audioLevel} enabled={micEnabled} />
                <span className="text-xs text-white/60">{micEnabled ? 'Говорит' : 'Без звука'}</span>
              </div>

              {/* Remote user */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-green-600/50 flex items-center justify-center text-white font-medium">
                    Др
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full" />
                  </span>
                </div>
                <AudioLevelIndicator level={0.3} enabled={speakerEnabled} />
                <span className="text-xs text-white/60">Друг</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMic}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  micEnabled ? 'bg-violet-600 text-white' : 'bg-red-600/80 text-white'
                }`}
              >
                {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSpeakerEnabled(!speakerEnabled)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  speakerEnabled ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/60'
                }`}
              >
                {speakerEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </motion.button>
            </div>

            <p className="text-xs text-green-400 text-center flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Подключено
            </p>
          </div>
        )}
      </div>

      {/* Hidden audio elements */}
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </motion.div>
  );
};

// ============================================
// PLAYER PAGE
// ============================================
const PlayerPage: React.FC<{
  sessionId: string;
  navigate: (page: string, id?: string) => void;
}> = ({ sessionId, navigate }) => {
  const { showToast } = useToast();
  const [videoUrl, setVideoUrl] = useState('');
  const [loadedVideo, setLoadedVideo] = useState<{ type: 'youtube' | 'vk'; id: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const videoData = sessionStorage.getItem(`video_${sessionId}`);
      if (videoData) {
        return JSON.parse(videoData);
      }
    }
    return null;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('guest') === 'true';
    }
    return false;
  });
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  const handleLoadVideo = () => {
    if (!videoUrl.trim()) {
      showToast('Введите ссылку на видео', 'error');
      return;
    }

    const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      const videoData = { type: 'youtube' as const, id: youtubeMatch[1] };
      setLoadedVideo(videoData);
      sessionStorage.setItem(`video_${sessionId}`, JSON.stringify(videoData));
      showToast('Видео загружено!', 'success');
      return;
    }

    const vkMatch = videoUrl.match(/vk\.com\/video(-?\d+)_(\d+)/);
    if (vkMatch) {
      const videoData = { type: 'vk' as const, id: `${vkMatch[1]}_${vkMatch[2]}` };
      setLoadedVideo(videoData);
      sessionStorage.setItem(`video_${sessionId}`, JSON.stringify(videoData));
      showToast('Видео загружено!', 'success');
      return;
    }

    showToast('Неподдерживаемый формат ссылки', 'error');
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#07080F] pt-16"
    >
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="liquid-glass-strong p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('home')}
              className="liquid-glass w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <h2 className="font-medium text-white text-sm">Совместный просмотр</h2>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="liquid-glass-violet px-2 py-0.5 rounded">Сеанс: {sessionId.slice(0, 8)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Voice Chat Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVoiceChat(!showVoiceChat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                showVoiceChat 
                  ? 'bg-violet-600 text-white' 
                  : 'liquid-glass text-white/70 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Голосовой чат</span>
            </motion.button>
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Синхронизировано
            </span>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-black overflow-auto">
          {!loadedVideo ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
              <div className="liquid-glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-lg w-full space-y-4 sm:space-y-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-violet-600/20 rounded-full flex items-center justify-center">
                  <Film className="w-6 h-6 sm:w-8 sm:h-8 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Вставьте ссылку на видео</h3>
                  <p className="text-xs sm:text-sm text-white/50">Поддерживается YouTube и ВКонтакте</p>
                </div>
                <div className="space-y-3">
                  <input
                    type="url"
                    inputMode="url"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="video-input-mobile w-full rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 text-sm sm:text-base outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLoadVideo}
                    className="w-full bg-violet-600 hover:bg-violet-500 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-white font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    Загрузить видео
                  </motion.button>
                </div>
                <p className="text-xs text-white/30 pt-2">
                  Вставьте ссылку на YouTube или ВК видео
                </p>
              </div>
            </div>
          ) : (
            <>
              {loadedVideo.type === 'youtube' ? (
                <iframe
                  src={`https://www.youtube.com/embed/${loadedVideo.id}?autoplay=1&enablejsapi=1`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={`https://vk.com/video_ext.php?oid=${loadedVideo.id.split('_')[0]}&id=${loadedVideo.id.split('_')[1]}&hd=2`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {!isGuest ? (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white"
                        >
                          <SkipBack className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white"
                        >
                          <SkipForward className="w-5 h-5" />
                        </motion.button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-white/40">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">Только ведущий управляет воспроизведением</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white"
                    >
                      <Maximize className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Voice Chat Popup */}
      <AnimatePresence>
        {showVoiceChat && (
          <VoiceChatPopup
            sessionId={sessionId}
            onClose={() => setShowVoiceChat(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================
// ADMIN PANEL COMPONENT WITH TMDB SEARCH
// ============================================
interface AdminMovie {
  id: string;
  tmdbId?: number;
  title: string;
  originalTitle: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  year: string;
  duration: string;
  rating: number;
  genres: string[];
  // Player 1
  player1Url: string;
  player1Quality: string;
  // Player 2
  player2Url: string;
  player2Quality: string;
  createdAt: Date;
}

// Video quality options
const QUALITY_OPTIONS = [
  { value: '360p', label: '360p' },
  { value: '480p', label: '480p' },
  { value: '720p', label: '720p HD' },
  { value: '1080p', label: '1080p Full HD' },
  { value: '4K', label: '4K Ultra HD' },
];

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
}

// TMDB API - бесплатный публичный ключ
const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// TMDB Genre mapping
const tmdbGenreMap: Record<number, string> = {
  28: 'Боевик',
  12: 'Приключения',
  16: 'Мультфильм',
  35: 'Комедия',
  80: 'Криминал',
  99: 'Документальный',
  18: 'Драма',
  10751: 'Семейный',
  14: 'Фэнтези',
  36: 'История',
  27: 'Ужасы',
  10402: 'Музыка',
  9648: 'Детектив',
  10749: 'Мелодрама',
  878: 'Фантастика',
  10770: 'Телевизионный фильм',
  53: 'Триллер',
  10752: 'Военный',
  37: 'Вестерн'
};

const AdminPanel: React.FC<{
  navigate: (page: string) => void;
}> = ({ navigate }) => {
  const { showToast } = useToast();
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [tmdbQuery, setTmdbQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState<TMDBMovie[]>([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [selectedTmdbMovie, setSelectedTmdbMovie] = useState<TMDBMovie | null>(null);
  const [movieListSearch, setMovieListSearch] = useState('');
  const [version, setVersion] = useState(1);
  
  const [formData, setFormData] = useState<Partial<AdminMovie>>({
    title: '',
    originalTitle: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    year: new Date().getFullYear().toString(),
    duration: '120',
    rating: 7.0,
    genres: [],
    player1Url: '',
    player1Quality: '720p',
    player2Url: '',
    player2Quality: '720p'
  });
  
  const [genreInput, setGenreInput] = useState('');

  // Load movies and version from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('adminMovies');
    if (saved) {
      setMovies(JSON.parse(saved));
    }
    const savedVersion = localStorage.getItem('adminVersion');
    if (savedVersion) {
      setVersion(parseInt(savedVersion) || 1);
    }
  }, []);

  // Save movies to localStorage and increment version
  const saveMovies = useCallback((newMovies: AdminMovie[]) => {
    const newVersion = version + 1;
    setMovies(newMovies);
    setVersion(newVersion);
    localStorage.setItem('adminMovies', JSON.stringify(newMovies));
    localStorage.setItem('adminVersion', newVersion.toString());
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('adminMoviesUpdated', { detail: newMovies }));
  }, [version]);

  // Generate unique ID
  const generateId = () => `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Search TMDB
  const searchTMDB = useCallback(async () => {
    if (!tmdbQuery.trim()) {
      setTmdbResults([]);
      return;
    }
    
    setTmdbLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(tmdbQuery)}&language=ru-RU&page=1`
      );
      const data = await response.json();
      setTmdbResults(data.results || []);
    } catch (error) {
      console.error('TMDB search error:', error);
      showToast('Ошибка поиска TMDB', 'error');
    }
    setTmdbLoading(false);
  }, [tmdbQuery, showToast]);

  // Debounced TMDB search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tmdbQuery.trim().length >= 2) {
        searchTMDB();
      } else {
        setTmdbResults([]);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [tmdbQuery, searchTMDB]);

  // Get movie details from TMDB
  const getTMDBDetails = useCallback(async (tmdbId: number) => {
    try {
      const [movieRes, creditsRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=ru-RU`),
        fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}`)
      ]);
      
      const movieData = await movieRes.json();
      const creditsData = await creditsRes.json();
      
      return { ...movieData, credits: creditsData };
    } catch (error) {
      console.error('TMDB details error:', error);
      return null;
    }
  }, []);

  // Select TMDB movie and fill form
  const selectTMDBMovie = useCallback(async (movie: TMDBMovie) => {
    setTmdbLoading(true);
    const details = await getTMDBDetails(movie.id);
    setTmdbLoading(false);
    
    const genres = movie.genre_ids
      .map(id => tmdbGenreMap[id] || '')
      .filter(Boolean);
    
    setFormData({
      tmdbId: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      description: movie.overview || details?.overview || '',
      posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}` : '',
      backdropUrl: movie.backdrop_path ? `${TMDB_IMAGE_BASE}/w1280${movie.backdrop_path}` : '',
      year: movie.release_date?.split('-')[0] || '',
      duration: details?.runtime?.toString() || '120',
      rating: movie.vote_average || 7.0,
      genres: genres,
      player1Url: '',
      player1Quality: '720p',
      player2Url: '',
      player2Quality: '720p'
    });
    
    setSelectedTmdbMovie(movie);
    setShowForm(true);
    setTmdbResults([]);
    setTmdbQuery('');
    showToast('Данные загружены из TMDB!', 'success');
  }, [getTMDBDetails, showToast]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      originalTitle: '',
      description: '',
      posterUrl: '',
      backdropUrl: '',
      year: new Date().getFullYear().toString(),
      duration: '120',
      rating: 7.0,
      genres: [],
      player1Url: '',
      player1Quality: '720p',
      player2Url: '',
      player2Quality: '720p'
    });
    setGenreInput('');
    setIsEditing(null);
    setSelectedTmdbMovie(null);
    setShowForm(false);
  }, []);

  // Add/Update movie
  const handleSave = useCallback(() => {
    if (!formData.title?.trim()) {
      showToast('Введите название фильма', 'error');
      return;
    }

    if (isEditing) {
      const updated = movies.map(m => 
        m.id === isEditing 
          ? { ...m, ...formData } as AdminMovie
          : m
      );
      saveMovies(updated);
      showToast('Фильм обновлён!', 'success');
    } else {
      const newMovie: AdminMovie = {
        id: generateId(),
        tmdbId: formData.tmdbId,
        title: formData.title || '',
        originalTitle: formData.originalTitle || '',
        description: formData.description || '',
        posterUrl: formData.posterUrl || '',
        backdropUrl: formData.backdropUrl || '',
        year: formData.year || new Date().getFullYear().toString(),
        duration: formData.duration || '120',
        rating: formData.rating || 7.0,
        genres: formData.genres || [],
        player1Url: formData.player1Url || '',
        player1Quality: formData.player1Quality || '720p',
        player2Url: formData.player2Url || '',
        player2Quality: formData.player2Quality || '720p',
        createdAt: new Date()
      };
      saveMovies([...movies, newMovie]);
      showToast('Фильм добавлен!', 'success');
    }
    
    resetForm();
  }, [formData, isEditing, movies, saveMovies, showToast, resetForm]);

  // Edit movie
  const handleEdit = useCallback((movie: AdminMovie) => {
    setFormData({
      tmdbId: movie.tmdbId,
      title: movie.title,
      originalTitle: movie.originalTitle,
      description: movie.description,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      year: movie.year,
      duration: movie.duration,
      rating: movie.rating,
      genres: movie.genres,
      player1Url: movie.player1Url,
      player1Quality: movie.player1Quality,
      player2Url: movie.player2Url,
      player2Quality: movie.player2Quality
    });
    setIsEditing(movie.id);
    setShowForm(true);
  }, []);

  // Delete movie
  const handleDelete = useCallback((id: string) => {
    if (confirm('Удалить этот фильм?')) {
      const filtered = movies.filter(m => m.id !== id);
      saveMovies(filtered);
      showToast('Фильм удалён', 'info');
    }
  }, [movies, saveMovies, showToast]);

  // Add genre
  const addGenre = useCallback(() => {
    if (genreInput.trim() && !formData.genres?.includes(genreInput.trim())) {
      setFormData(prev => ({
        ...prev,
        genres: [...(prev.genres || []), genreInput.trim()]
      }));
      setGenreInput('');
    }
  }, [genreInput, formData.genres]);

  // Remove genre
  const removeGenre = useCallback((genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres?.filter(g => g !== genre) || []
    }));
  }, []);

  // Filter movies by search
  const filteredMovies = useMemo(() => {
    if (!movieListSearch.trim()) return movies;
    const query = movieListSearch.toLowerCase();
    return movies.filter(m => 
      m.title.toLowerCase().includes(query) ||
      m.originalTitle.toLowerCase().includes(query)
    );
  }, [movies, movieListSearch]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#07080F] pt-24 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-violet-400" />
              Админ панель
              <span className="text-sm font-mono bg-white/10 px-2 py-1 rounded-lg text-violet-300">
                v{version}
              </span>
            </h1>
            <p className="text-white/60 mt-1">Поиск TMDB и управление фильмами</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-violet-600 hover:bg-violet-500 px-6 py-3 rounded-xl flex items-center gap-2 font-medium text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
            Добавить вручную
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="liquid-glass-strong rounded-xl p-4">
            <div className="text-3xl font-bold text-white">{movies.length}</div>
            <div className="text-sm text-white/60">Всего фильмов</div>
          </div>
          <div className="liquid-glass-strong rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400">
              {movies.filter(m => m.player1Url || m.player2Url).length}
            </div>
            <div className="text-sm text-white/60">С видео</div>
          </div>
          <div className="liquid-glass-strong rounded-xl p-4">
            <div className="text-3xl font-bold text-violet-400">
              {movies.filter(m => m.player1Url).length}
            </div>
            <div className="text-sm text-white/60">Плеер 1</div>
          </div>
          <div className="liquid-glass-strong rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-400">
              {movies.filter(m => m.player2Url).length}
            </div>
            <div className="text-sm text-white/60">Плеер 2</div>
          </div>
        </div>

        {/* TMDB Search Section */}
        <div className="liquid-glass-strong rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-violet-400" />
            Поиск в TMDB
          </h2>
          
          <div className="relative">
            <input
              type="text"
              value={tmdbQuery}
              onChange={(e) => setTmdbQuery(e.target.value)}
              placeholder="Введите название фильма для поиска..."
              className="w-full liquid-glass rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-violet-500 text-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            {tmdbLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          {/* TMDB Results */}
          <AnimatePresence>
            {tmdbResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto"
              >
                {tmdbResults.map((movie) => (
                  <motion.button
                    key={movie.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => selectTMDBMovie(movie)}
                    className="liquid-glass rounded-xl overflow-hidden text-left group"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden">
                      {movie.poster_path ? (
                        <img
                          src={`${TMDB_IMAGE_BASE}/w342${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <Film className="w-8 h-8 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-violet-400">+ Добавить</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <h3 className="text-xs font-medium text-white truncate">{movie.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-white/40">
                          {movie.release_date?.split('-')[0] || 'N/A'}
                        </span>
                        <span className="text-xs text-yellow-400 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {tmdbQuery.trim().length >= 2 && !tmdbLoading && tmdbResults.length === 0 && (
            <p className="text-center text-white/40 mt-4 py-8">
              Фильмы не найдены
            </p>
          )}
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="liquid-glass-strong rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    {selectedTmdbMovie && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {isEditing ? 'Редактировать фильм' : selectedTmdbMovie ? 'Фильм из TMDB' : 'Новый фильм'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Selected TMDB Movie Preview */}
                {selectedTmdbMovie && (
                  <div className="mb-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center gap-3">
                      {selectedTmdbMovie.poster_path && (
                        <img
                          src={`${TMDB_IMAGE_BASE}/w92${selectedTmdbMovie.poster_path}`}
                          alt={selectedTmdbMovie.title}
                          className="w-12 h-18 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="text-sm text-green-400">Данные загружены из TMDB</p>
                        <p className="text-white font-medium">{selectedTmdbMovie.title}</p>
                        <p className="text-xs text-white/40">
                          {selectedTmdbMovie.release_date?.split('-')[0]} • 
                          Рейтинг: {selectedTmdbMovie.vote_average.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Название *</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Название на русском"
                        className="w-full liquid-glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Оригинальное название</label>
                      <input
                        type="text"
                        value={formData.originalTitle || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, originalTitle: e.target.value }))}
                        placeholder="Original Title"
                        className="w-full liquid-glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Описание</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Описание фильма..."
                        rows={4}
                        className="w-full liquid-glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Год</label>
                        <input
                          type="text"
                          value={formData.year || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                          placeholder="2024"
                          className="w-full liquid-glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Длительность</label>
                        <input
                          type="text"
                          value={formData.duration || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="120 мин"
                          className="w-full liquid-glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Рейтинг</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.rating || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                          placeholder="7.0"
                          className="w-full liquid-glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1">URL постера</label>
                      <input
                        type="url"
                        value={formData.posterUrl || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, posterUrl: e.target.value }))}
                        placeholder="https://..."
                        className="w-full liquid-glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      {formData.posterUrl && (
                        <img 
                          src={formData.posterUrl} 
                          alt="Preview" 
                          className="mt-2 w-20 h-28 object-cover rounded-lg"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm text-white/60 mb-1">URL фона</label>
                      <input
                        type="url"
                        value={formData.backdropUrl || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, backdropUrl: e.target.value }))}
                        placeholder="https://..."
                        className="w-full liquid-glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>

                    {/* Player 1 */}
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <label className="block text-sm text-green-400 mb-2 font-medium flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Плеер 1
                      </label>
                      <div className="space-y-3">
                        <input
                          type="url"
                          value={formData.player1Url || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, player1Url: e.target.value }))}
                          placeholder="Ссылка на видео (YouTube, VK, прямая ссылка)"
                          className="w-full liquid-glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <div className="flex gap-2">
                          <label className="text-xs text-white/40 self-center">Качество:</label>
                          <select
                            value={formData.player1Quality || '720p'}
                            onChange={(e) => setFormData(prev => ({ ...prev, player1Quality: e.target.value }))}
                            className="flex-1 liquid-glass rounded-xl px-4 py-2 text-white outline-none focus:ring-2 focus:ring-green-500 bg-transparent"
                          >
                            {QUALITY_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value} className="bg-[#1a0533]">{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Player 2 */}
                    <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                      <label className="block text-sm text-violet-400 mb-2 font-medium flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Плеер 2 (резервный)
                      </label>
                      <div className="space-y-3">
                        <input
                          type="url"
                          value={formData.player2Url || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, player2Url: e.target.value }))}
                          placeholder="Ссылка на видео (YouTube, VK, прямая ссылка)"
                          className="w-full liquid-glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <div className="flex gap-2">
                          <label className="text-xs text-white/40 self-center">Качество:</label>
                          <select
                            value={formData.player2Quality || '720p'}
                            onChange={(e) => setFormData(prev => ({ ...prev, player2Quality: e.target.value }))}
                            className="flex-1 liquid-glass rounded-xl px-4 py-2 text-white outline-none focus:ring-2 focus:ring-violet-500 bg-transparent"
                          >
                            {QUALITY_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value} className="bg-[#1a0533]">{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Genres */}
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Жанры</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={genreInput}
                          onChange={(e) => setGenreInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                          placeholder="Добавить жанр..."
                          className="flex-1 liquid-glass rounded-xl px-4 py-2 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={addGenre}
                          className="liquid-glass-violet px-4 rounded-xl text-white"
                        >
                          <Plus className="w-5 h-5" />
                        </motion.button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.genres?.map((genre, idx) => (
                          <span
                            key={idx}
                            className="liquid-glass-violet px-3 py-1 rounded-full text-sm text-white flex items-center gap-1"
                          >
                            {genre}
                            <button
                              onClick={() => removeGenre(genre)}
                              className="hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetForm}
                    className="liquid-glass px-6 py-3 rounded-xl text-white/70 hover:text-white transition-colors"
                  >
                    Отмена
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="bg-violet-600 hover:bg-violet-500 px-6 py-3 rounded-xl flex items-center gap-2 font-medium text-white transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    {isEditing ? 'Сохранить изменения' : 'Добавить фильм'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Movies List */}
        <div className="liquid-glass-strong rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-medium text-white">Мои фильмы ({filteredMovies.length})</h2>
            <div className="relative">
              <input
                type="text"
                value={movieListSearch}
                onChange={(e) => setMovieListSearch(e.target.value)}
                placeholder="Поиск..."
                className="liquid-glass rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-white/40 outline-none w-40"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            </div>
          </div>
          
          {filteredMovies.length === 0 ? (
            <div className="p-12 text-center">
              <Film className="w-16 h-16 mx-auto text-white/20 mb-4" />
              <p className="text-white/60">
                {movieListSearch ? 'Фильмы не найдены' : 'Нет добавленных фильмов'}
              </p>
              <p className="text-sm text-white/40 mt-2">
                Используйте поиск TMDB выше для добавления фильмов
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
              {filteredMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Poster */}
                    <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden bg-white/5">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 96"><rect fill="%231a0533" width="64" height="96"/><text x="32" y="48" text-anchor="middle" fill="%23A78BFA" font-size="8">Нет</text></svg>'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-6 h-6 text-white/20" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-white truncate">{movie.title}</h3>
                          {movie.originalTitle && (
                            <p className="text-sm text-white/40">{movie.originalTitle}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white">{movie.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span>{movie.duration} мин</span>
                        {movie.genres.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{movie.genres.slice(0, 3).join(', ')}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Video badges */}
                      <div className="flex items-center gap-2 mt-2">
                        {movie.player1Url && (
                          <span className="bg-green-600/20 text-green-400 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                            <span>▶</span> Плеер 1 {movie.player1Quality && `(${movie.player1Quality})`}
                          </span>
                        )}
                        {movie.player2Url && (
                          <span className="bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                            <span>▶</span> Плеер 2 {movie.player2Quality && `(${movie.player2Quality})`}
                          </span>
                        )}
                        {!movie.player1Url && !movie.player2Url && (
                          <span className="text-white/30 text-xs">Без видео</span>
                        )}
                        {movie.tmdbId && (
                          <span className="text-violet-400 text-xs">TMDB</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {movie.player1Url && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => window.open(movie.player1Url, '_blank')}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          title="Открыть Плеер 1"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(movie)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(movie.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// FOOTER COMPONENT
// ============================================
const Footer: React.FC<{ navigate: (page: string) => void }> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = () => {
    if (email.trim()) {
      showToast('Подписка оформлена!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#07080F] border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              {/* Modern Logo Icon */}
              <div className="relative w-8 h-8">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  <defs>
                    <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient id="footerLogoGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#C084FC" />
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="20" fill="url(#footerLogoGradient)" opacity="0.15" />
                  <circle cx="24" cy="24" r="16" fill="none" stroke="url(#footerLogoGradient)" strokeWidth="2" />
                  <circle cx="24" cy="12" r="2.5" fill="url(#footerLogoGradient2)" />
                  <circle cx="24" cy="36" r="2.5" fill="url(#footerLogoGradient2)" />
                  <circle cx="12" cy="24" r="2.5" fill="url(#footerLogoGradient2)" />
                  <circle cx="36" cy="24" r="2.5" fill="url(#footerLogoGradient2)" />
                  <path d="M20 16L34 24L20 32Z" fill="url(#footerLogoGradient)" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg tracking-tight">
                  <span className="text-white">До</span>
                  <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">ма</span>
                  <span className="text-white">кино</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-white/50">Кино дома. Вместе.</p>
            <div className="flex gap-3">
              {[Instagram, Twitter, MessageCircle].map((Icon, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="liquid-glass w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Фильмы</h4>
            <ul className="space-y-2">
              {['Топ недели', 'Новинки', 'По жанрам', 'Сериалы'].map(link => (
                <li key={link}>
                  <button
                    onClick={() => navigate('home')}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Сервис</h4>
            <ul className="space-y-2">
              {['Как это работает', 'FAQ', 'Тарифы', 'Поддержка'].map(link => (
                <li key={link}>
                  <button className="text-sm text-white/50 hover:text-white transition-colors">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Новинки на почту</h4>
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ваш email"
                className="w-full liquid-glass rounded-xl px-4 py-2 text-white placeholder-white/30 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubscribe}
                className="w-full liquid-glass-violet rounded-xl py-2 text-sm font-medium text-white"
              >
                Подписаться
              </motion.button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">
            © 2026 Домакино · Политика конфиденциальности · Условия использования
          </p>
          <p className="text-sm text-white/40 flex items-center gap-2">
            Данные предоставлены
            <span className="text-violet-400 font-medium">TMDB</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const DomokinoApp: React.FC = () => {
  // Initialize state from URL params if available
  const getInitialPageState = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const session = params.get('session');
      if (session) {
        return { page: 'player', sessionId: session };
      }
    }
    return { page: 'home', sessionId: '' };
  };

  const initialState = useMemo(() => getInitialPageState(), []);
  
  const [currentPage, setCurrentPage] = useState<string>(initialState.page);
  const [currentMovieId, setCurrentMovieId] = useState<string>('');
  const [currentSessionId, setCurrentSessionId] = useState<string>(initialState.sessionId);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [movieLoading, setMovieLoading] = useState(false);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [adminMovies, setAdminMovies] = useState<AdminMovie[]>([]);

  // Load admin movies from localStorage
  useEffect(() => {
    const loadAdminMovies = () => {
      const saved = localStorage.getItem('adminMovies');
      if (saved) {
        setAdminMovies(JSON.parse(saved));
      }
    };
    
    loadAdminMovies();
    
    // Listen for updates from admin panel
    const handleUpdate = (e: CustomEvent) => {
      setAdminMovies(e.detail || []);
    };
    
    window.addEventListener('adminMoviesUpdated', handleUpdate as EventListener);
    return () => window.removeEventListener('adminMoviesUpdated', handleUpdate as EventListener);
  }, []);

  // Combine mock movies with admin movies (no duplicates)
  const allMovies = useMemo(() => {
    // Get mock movie IDs for deduplication
    const mockMovieIds = new Set(mockMovies.map(m => m.id));
    const mockMovieTitles = new Set(mockMovies.map(m => m.title.toLowerCase()));
    
    // Convert admin movies and filter out duplicates
    const converted = adminMovies
      .filter(am => {
        // Check if this movie already exists in mockMovies
        const adminId = parseInt(am.id.replace('admin-', '').split('-')[0]);
        const titleLower = am.title.toLowerCase();
        // Keep only if not in mockMovies
        return !mockMovieIds.has(adminId) && !mockMovieTitles.has(titleLower);
      })
      .map(am => ({
        id: parseInt(am.id.replace('admin-', '').split('-')[0]) || Math.floor(Math.random() * 100000),
        title: am.title,
        original_title: am.originalTitle,
        overview: am.description,
        poster_path: am.posterUrl.replace('https://image.tmdb.org/t/p/w500', '').replace('https://image.tmdb.org/t/p/w342', ''),
        backdrop_path: am.backdropUrl?.replace('https://image.tmdb.org/t/p/w1280', '') || '',
        release_date: `${am.year}-01-01`,
        vote_average: am.rating,
        vote_count: 1000,
        genre_ids: [],
        popularity: 80,
        runtime: parseInt(am.duration) || 120,
        genres: am.genres.map(g => ({ id: 0, name: g })),
        videos: { results: [] },
        credits: { cast: [], crew: [] },
        player1Url: am.player1Url || undefined,
        player1Quality: am.player1Quality || '720p',
        player2Url: am.player2Url || undefined,
        player2Quality: am.player2Quality || '720p'
      })) as Movie[];
    
    return [...converted, ...mockMovies];
  }, [adminMovies]);

  // Set of admin movie IDs for checking
  const adminMovieIds = useMemo(() => {
    return new Set(adminMovies.map(am => parseInt(am.id.replace('admin-', '').split('-')[0]) || 0));
  }, [adminMovies]);

  // Delete movie from main screen
  const handleDeleteMovie = useCallback((movie: Movie) => {
    const updatedMovies = adminMovies.filter(am => {
      const adminId = parseInt(am.id.replace('admin-', '').split('-')[0]) || 0;
      return adminId !== movie.id;
    });
    setAdminMovies(updatedMovies);
    localStorage.setItem('adminMovies', JSON.stringify(updatedMovies));
    // Dispatch event to update admin panel
    window.dispatchEvent(new CustomEvent('adminMoviesUpdated', { detail: updatedMovies }));
  }, [adminMovies]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Navigate function
  const navigate = useCallback((page: string, id?: string) => {
    setCurrentPage(page);
    if (page === 'movie' && id) {
      setCurrentMovieId(id);
      setMovieLoading(true);
      // Find movie from all movies
      const movie = allMovies.find(m => m.id === parseInt(id));
      setTimeout(() => {
        setCurrentMovie(movie || null);
        setMovieLoading(false);
      }, 300);
    }
    if (page === 'player' && id) {
      setCurrentSessionId(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [allMovies]);

  // Play movie handler
  const handlePlayMovie = useCallback((movie: Movie) => {
    setPlayingMovie(movie);
  }, []);

  const handleClosePlayer = useCallback(() => {
    setPlayingMovie(null);
  }, []);

  // Listen for playMovie event from recommendations
  useEffect(() => {
    const handlePlayMovieEvent = (e: CustomEvent) => {
      setPlayingMovie(e.detail);
    };
    window.addEventListener('playMovie', handlePlayMovieEvent as EventListener);
    return () => window.removeEventListener('playMovie', handlePlayMovieEvent as EventListener);
  }, []);

  // Sort all movies by rating for top rated
  const allTopRated = useMemo(() => [...allMovies].sort((a, b) => b.vote_average - a.vote_average), [allMovies]);

  return (
    <div className="min-h-screen bg-[#07080F] flex flex-col">
      <Navbar currentPage={currentPage} navigate={navigate} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <HomePage
              key="home"
              trendingMovies={allMovies}
              topRatedMovies={allTopRated}
              loading={loading}
              navigate={navigate}
              onPlayMovie={handlePlayMovie}
              onDeleteMovie={handleDeleteMovie}
              adminMovieIds={adminMovieIds}
            />
          )}

          {currentPage === 'movie' && (
            <MovieDetailPage
              key={`movie-${currentMovieId}`}
              movie={currentMovie}
              loading={movieLoading}
              navigate={navigate}
              movieId={currentMovieId}
              onPlayMovie={handlePlayMovie}
            />
          )}

          {currentPage === 'player' && (
            <PlayerPage
              key={`player-${currentSessionId}`}
              sessionId={currentSessionId}
              navigate={navigate}
            />
          )}

          {currentPage === 'admin' && (
            <AdminPanel
              key="admin"
              navigate={navigate}
            />
          )}

          {(currentPage === 'movies' || currentPage === 'series' || currentPage === 'new') && (
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-screen pt-24"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-heading text-3xl text-white mb-8">
                  {currentPage === 'movies' && '🎬 Фильмы'}
                  {currentPage === 'series' && '📺 Сериалы'}
                  {currentPage === 'new' && '✨ Новинки'}
                </h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {allMovies.map((movie, index) => (
                    <FadeUp key={movie.id} delay={index * 0.05}>
                      <MovieCard 
                        movie={movie} 
                        onClick={() => navigate('movie', movie.id.toString())}
                        onPlayFull={() => handlePlayMovie(movie)}
                        onDelete={handleDeleteMovie}
                        isAdminMovie={adminMovieIds.has(movie.id)}
                      />
                    </FadeUp>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {currentPage !== 'player' && <Footer navigate={navigate} />}

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingMovie && (
          <VideoPlayerModal
            movie={playingMovie}
            onClose={handleClosePlayer}
            allMovies={allMovies}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// EXPORT
// ============================================
export default function App() {
  return (
    <ToastProvider>
      <DomokinoApp />
    </ToastProvider>
  );
}
