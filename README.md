# RuffNeck Entertainment — Improvement Files (Ready to Deploy)

These files implement the fixes and upgrades we discussed:

1. **Language Switcher** (add to Homepage + make global)
2. **Working Search** (Blog + Store)
3. **Working Category Filters** (with counts)
4. **Currency Switcher** (₦ NGN ↔ $ USD with conversion)
5. **UI/UX polish** (hover states, buttons, spacing, mobile)

---

## Folder Structure

```
ruffneck-improvements/
├── components/
│   ├── LanguageSwitcher.tsx
│   ├── CurrencySwitcher.tsx
│   ├── SearchBar.tsx
│   └── CategoryFilter.tsx
├── hooks/
│   └── useCurrency.ts
├── styles/
│   └── ui-improvements.css
├── examples/
│   ├── BlogPageExample.tsx
│   └── StorePageExample.tsx
└── README.md
```

---

## How to Deploy

### Step 1 — Copy the files into your project

Copy the folders into your existing Next.js project (usually under `/src` or `/app`):

```
your-project/
├── components/          ← put LanguageSwitcher, CurrencySwitcher, SearchBar, CategoryFilter here
├── hooks/               ← put useCurrency.ts here
└── styles/ or app/      ← import ui-improvements.css in your global CSS
```

### Step 2 — Add LanguageSwitcher to the global layout / header

In your main layout or header component (the one used by Homepage, Blog, Store):

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Inside the header JSX:
<div className="flex items-center gap-4">
  <LanguageSwitcher />
  {/* other header items */}
</div>
```

This automatically adds it to the **Homepage** and every other page.

### Step 3 — Add Search + Category Filters

See the example files:

- `examples/BlogPageExample.tsx`
- `examples/StorePageExample.tsx`

Copy the pattern into your real Blog and Store pages.  
You only need to replace `ALL_POSTS` / `ALL_PRODUCTS` with your real data (from Supabase or props).

### Step 4 — Currency Switcher on Store

```tsx
import CurrencySwitcher from '@/components/CurrencySwitcher';
import { useCurrency } from '@/hooks/useCurrency';

// In your product cards:
const { formatPrice } = useCurrency();
const price = formatPrice(product.priceNGN); // always pass NGN base price
// then display: price.formatted
```

Also place `<CurrencySwitcher />` in the Store header.

**Important for Flutterwave:**  
When starting checkout, pass the correct currency:

```js
FlutterwaveCheckout({
  // ...
  currency: currency, // 'NGN' or 'USD'
  amount: formatPrice(selectedTier.priceNGN).value,
  // ...
});
```

### Step 5 — UI Improvements CSS

In your global CSS file (`globals.css` or `app/globals.css`):

```css
@import './ui-improvements.css';
/* or copy the contents directly */
```

Then add the class names where useful:

- `product-card` / `article-card` on your cards
- `btn-primary` / `btn-secondary` on buttons
- `filter-scroll` on mobile filter containers

### Step 6 — Adjust Exchange Rate

Open `hooks/useCurrency.ts` and change this line:

```ts
const EXCHANGE_RATE = 1600; // change to your preferred rate
```

---

## Notes

- All components are `'use client'` (client components).
- Language and currency preferences are saved in `localStorage`.
- Search is client-side (fast). For very large lists you can later move it to the server.
- The examples are complete working pages so you can see exactly how everything connects.

---

## Need help?

If any file does not match your current project structure (App Router vs Pages Router, Tailwind version, data source, etc.), tell me the structure and I will adjust the code for you.
