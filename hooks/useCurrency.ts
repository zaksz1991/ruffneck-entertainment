'use client';

import { useState, useEffect, useCallback } from 'react';

export type Currency = 'NGN' | 'USD';

// Adjust this rate as needed (or fetch from an API later)
const EXCHANGE_RATE = 1600; // 1 USD = 1600 NGN

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>('NGN');

  useEffect(() => {
    const saved = localStorage.getItem('ruffneck_currency') as Currency | null;
    if (saved === 'NGN' || saved === 'USD') {
      setCurrency(saved);
    }
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => {
      const next = prev === 'NGN' ? 'USD' : 'NGN';
      localStorage.setItem('ruffneck_currency', next);
      return next;
    });
  }, []);

  const setCurrencyValue = useCallback((value: Currency) => {
    setCurrency(value);
    localStorage.setItem('ruffneck_currency', value);
  }, []);

  /** Convert a NGN price to the currently selected currency */
  const formatPrice = useCallback(
    (amountInNGN: number) => {
      if (currency === 'USD') {
        const usd = amountInNGN / EXCHANGE_RATE;
        return {
          value: usd,
          formatted: `$${usd.toFixed(2)}`,
          currency: 'USD' as const,
        };
      }
      return {
        value: amountInNGN,
        formatted: `₦${amountInNGN.toLocaleString()}`,
        currency: 'NGN' as const,
      };
    },
    [currency]
  );

  return {
    currency,
    toggleCurrency,
    setCurrencyValue,
    formatPrice,
    exchangeRate: EXCHANGE_RATE,
  };
}
