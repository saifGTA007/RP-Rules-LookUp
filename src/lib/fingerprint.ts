// src/lib/fingerprint.ts
export const getFingerprint = async () => {
  if (typeof window === 'undefined') return "";

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) return "fallback-id";

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "unknown-renderer";
  
  // USE STATIC HARDWARE INFO ONLY (Avoid window.innerWidth/Height as they change)
  const hardwareInfo = [
    renderer,
    navigator.hardwareConcurrency || '8',
    navigator.deviceMemory || '8',
    screen.colorDepth,
    // We use screen.width (the monitor size) NOT window.innerWidth (the browser size)
    screen.width,
    screen.height
  ].join('|');

  // Convert to SHA-256 for a clean, consistent hex string
  const msgUint8 = new TextEncoder().encode(hardwareInfo);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};