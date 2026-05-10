# Al-Mumtaz Quiz

"Al-Mumtaz fi al-Hiwarat al-Yawmiyyah" (1-daraja) kitobi asosidagi arabcha–o'zbekcha lug'at va quiz ilovasi.

## Imkoniyatlar

- 📖 Lug'atni ko'rib chiqish — har bir dars bo'yicha so'zlar ro'yxati
- 🎯 Flashcard va Multiple choice quiz rejimlari
- 🔊 Arabcha so'zlarni eshitish (browser TTS)
- ⚠️ Xato qilingan so'zlarni alohida mashq qilish
- 📊 To'g'ri/xato statistikasi (lokal saqlanadi)
- 🌙 Dark mode (avtomatik)
- 🔄 Auto-update (yangi versiya chiqsa darhol bildiradi)

## Texnologiyalar

- Vue 3 (Composition API, CDN)
- Vanilla CSS (Tailwind ishlatilmaydi)
- Plain HTML (build process yo'q)
- LocalStorage (progress va xatolar uchun)

## Fayllar tuzilishi

```
index.html       — Asosiy app (HTML+CSS+Vue)
lessons.json     — Lug'at ma'lumotlari
version.json     — Joriy versiya (auto-update uchun)
vercel.json      — Vercel cache sozlamalari
```

## Yangilanish chiqarish

1. `lessons.json` ni yangilash (yangi darslar qo'shish va h.k.)
2. `version.json` da `version` raqamini oshirish (masalan 1.0.0 → 1.1.0)
3. `changelog` ni yozish
4. `git push` qilish — Vercel avtomatik deploy qiladi
5. Foydalanuvchilarga 5 daqiqa ichida "yangilanish bor" bildirishi chiqadi

## Local'da ishga tushirish

```bash
# Python o'rnatilgan bo'lsa
python3 -m http.server 8000

# Yoki Node bo'lsa
npx serve .
```

Brauzerda `http://localhost:8000` ni oching.

> **Eslatma:** `lessons.json` ni `fetch` orqali olganligi sababli, `file://` orqali ochib bo'lmaydi. Local server kerak.

## Manba

[BISA Learning Centre](https://www.bisa.id) tomonidan tayyorlangan kitob asosida.
