'use client';

import { useCurrency } from '../hooks/useCurrency';

export default function CurrencySwitcher() {
  const { currency, setCurrencyValue, exchangeRate } = useCurrency();

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="inline-flex rounded-full bg-slate-800 border border-slate-700 p-1">
        <button
          onClick={() => setCurrencyValue('NGN')}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
            currency === 'NGN'
              ? 'bg-cyan-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ₦ NGN
        </button>
        <button
          onClick={() => setCurrencyValue('USD')}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
            currency === 'USD'
              ? 'bg-cyan-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          $ USD
        </button>
      </div>
      <p className="text-xs text-slate-500">
        1 USD ≈ ₦{exchangeRate.toLocaleString()}
      </p>
    </div>
  );
}
