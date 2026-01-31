export const setLanguageCookie = (lang: string) => {
  document.cookie = `preferred_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
};

export const getLanguageCookie = () => {
  if (typeof document === 'undefined') return 'ar';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; preferred_lang=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || 'ar';
  return 'ar';
};