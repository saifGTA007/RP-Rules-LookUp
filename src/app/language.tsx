'use client';
import { useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

export default function useLanguage() {
  // Set Arabic ('ar') as the default state
  const [lang, setLang] = useState('ar');
  const t = translations[lang];

  return { lang, setLang, t };
}