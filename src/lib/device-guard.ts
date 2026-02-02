export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  // 1. Get PHYSICAL screen dimensions (Does not change when you resize the window)
  const screenW = window.screen.width;
  const screenH = window.screen.height;
  const userAgent = navigator.userAgent.toLowerCase();

  // 2. Check Physical Aspect Ratio
  // If the physical monitor is taller than it is wide, it's a mobile device/tablet.
  // On your Nitro laptop, this will ALWAYS be false (Landscape).
  const isPhysicalPortrait = screenH > screenW;

  // 3. Check for Touch + UserAgent
  const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);


  // 4. The "Windows" Passport
  // If the OS is Windows, it is a PC. Period.
  if (userAgent.includes('windows')) return false;

  // 5. The "Fine Pointer" Check
  // If the user has a mouse/trackpad, it's likely a PC.
  const isMouseUser = window.matchMedia('(pointer: fine)').matches;

  // Final Logic: 
  // It's a mobile only if it's a mobile UserAgent OR (it's physically portrait AND touch-enabled)
  // AND it must NOT have a mouse.
  return (isMobileUA || (isPhysicalPortrait)) && !isMouseUser;
};