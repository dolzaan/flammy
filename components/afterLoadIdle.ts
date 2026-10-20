// Runs decorative work only after the page has loaded and the browser has a quiet moment,
// so WebGL setup never competes with the first render or the first taps and clicks.
export function afterLoadIdle(callback: () => void, timeout = 2500) {
  let cancelled = false, idle = 0;
  let fallback: ReturnType<typeof setTimeout> | undefined;
  const run = () => { if (!cancelled) callback(); };
  const schedule = () => {
    if (cancelled) return;
    if ('requestIdleCallback' in window) idle = window.requestIdleCallback(run, { timeout });
    else fallback = setTimeout(run, 300);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener('load', schedule);
    if (idle) window.cancelIdleCallback(idle);
    clearTimeout(fallback);
  };
}
