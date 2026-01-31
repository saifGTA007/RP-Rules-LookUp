export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /android|blackberry|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i;
  
  // Checks if the user agent is mobile OR if it's a touch device with a small-ish screen
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 1024; 

  return mobileRegex.test(userAgent) || (isTouch && isSmallScreen);
};