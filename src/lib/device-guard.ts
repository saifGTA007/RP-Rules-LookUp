export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  const { innerWidth, innerHeight } = window;
  const userAgent = navigator.userAgent.toLowerCase();

  // 1. Check Aspect Ratio (Width vs Height)
  // A standard PC is 1.77 (16:9). A vertical phone is 0.5 (9:16).
  const isPortrait = innerHeight > innerWidth;

  // 2. Check for Touch + Aspect Ratio 
  // Most laptops with touchscreens are still used in Landscape.
  // Phones and tablets are the only ones used in Portrait.
  const isMobileLayout = isPortrait && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // 3. The "Windows" Immunity
  // If it's running Windows, we don't care about the ratio (it's a PC).
  if (userAgent.includes('windows')) return false;

  // 4. Strict Mobile User Agent check
  const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

  const isMouseUser = window.matchMedia('(pointer: fine)').matches;

  return (isMobileUA || isMobileLayout) && !isMouseUser;
};