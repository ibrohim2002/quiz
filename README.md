# Al-Mumtaz Quiz

"Al-Mumtaz fi al-Hiwarat al-Yawmiyyah" (1-daraja) kitobi asosidagi arabcha–o'zbekcha lug'at va quiz ilovasi.

## Stack

- **Vite** — build tool
- **Vue 3** — Composition API + `<script setup>`
- **TypeScript** — strict mode
- **Tailwind CSS v4** — utility-first styling

## Loyiha tuzilishi

```
src/
├── App.vue                   — Root component, routing
├── main.ts                   — Entry point
├── style.css                 — Tailwind + global styles
├── components/
│   ├── AppHeader.vue
│   ├── UpdateBanner.vue
│   ├── LoadingScreen.vue
│   ├── ErrorScreen.vue
│   ├── HomeScreen.vue
│   ├── BrowseScreen.vue
│   ├── BrowseLessonScreen.vue
│   ├── SetupScreen.vue
│   ├── QuizScreen.vue
│   ├── FlashcardView.vue
│   ├── MultipleChoiceView.vue
│   └── EndScreen.vue
├── composables/
│   ├── useVocab.ts           — Lessons data loader, version checking
│   ├── useQuiz.ts            — Quiz session logic
│   ├── useStorage.ts         — Reactive localStorage
│   └── useSpeech.ts          — Web Speech API
└── types/
    └── vocab.ts              — TypeScript types

public/
├── lessons.json              — Lug'at ma'lumotlari
└── version.json              — Joriy versiya

vercel.json                   — Vercel cache headers
```

## Ishga tushirish

```bash
# Bog'liqliklarni o'rnatish
npm install

# Development server
npm run dev

# Type check
npm run type-check

# Production build
npm run build

# Preview build
npm run preview
```

Development server `http://localhost:5173` da ochiladi.

## Imkoniyatlar

- 📖 Lug'atni dars bo'yicha ko'rib chiqish
- 🎯 Flashcard va Multiple choice rejimlari (aralash yoki alohida)
- 🔊 Arabcha so'zlarni Web Speech API orqali eshitish
- ⚠️ Xato qilingan so'zlarni alohida mashq qilish
- 📊 Persistent statistika (localStorage)
- 🌙 Dark mode (avtomatik, OS sozlamasi bo'yicha)
- 🔄 Auto-update — yangi versiya chiqsa, banner orqali bildiriladi

## Yangilanish chiqarish

1. `public/lessons.json` ni yangilash
2. `public/version.json` da `version` raqamini oshirish (masalan `2.0.0` → `2.1.0`)
3. `changelog` ni yozish
4. `git push` qilish — Vercel avtomatik build va deploy qiladi
5. Foydalanuvchilarga 5 daqiqada "yangilanish bor" banneri chiqadi

## Deploy

Vercel:

```bash
# GitHub repo'ga push qiling, Vercel'da Import qiling
# Vercel avtomatik aniqlaydi: Framework = Vite, Build = npm run build
```

## Manba

[BISA Learning Centre](https://www.bisa.id) tomonidan tayyorlangan kitob asosida.
