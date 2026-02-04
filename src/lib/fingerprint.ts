const getFingerprint = async () => {
  if (typeof window === 'undefined') return "ssr-fallback";

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  let renderer = "unknown";
  
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "standard-gl";
  }
  
  // ONLY INTERNAL HARDWARE
  // No screen, no ratio, no dimensions.
  const hardwareData = {
    gpu: renderer,
    cores: navigator.hardwareConcurrency || 0,
    platform: navigator.platform,
    touchPoints: navigator.maxTouchPoints || 0
  };
  
  // Generate the hash
  const rawString = JSON.stringify(hardwareData);
  const msgUint8 = new TextEncoder().encode(rawString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};