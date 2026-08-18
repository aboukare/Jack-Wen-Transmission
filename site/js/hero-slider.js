  // Manual hero carousel — advances only on user interaction
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-arrow.prev');
  const nextBtn = document.querySelector('.hero-arrow.next');
  const total = slides.length;
  let current = 0;

  function goTo(i){
    if(i === current) return;
    const from = current;
    const to = (i + total) % total;
    const dir = (to > from || (from === total - 1 && to === 0)) ? 'next' : 'prev';

    slides[from].classList.remove('active');
    slides[from].classList.add(dir === 'next' ? 'leave-left' : 'leave-right');
    dots[from].classList.remove('active');

    current = to;

    slides[to].classList.add(dir === 'next' ? 'enter-right' : 'enter-left');
    setTimeout(() => {
      slides[to].classList.add('active');
      slides[to].classList.remove('enter-right', 'enter-left');
    }, 20);
    dots[to].classList.add('active');

    setTimeout(() => {
      slides[from].classList.remove('leave-left', 'leave-right');
    }, 700);
  }

  if(total > 1){
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });
    if(prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if(nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  }

  // Some mobile browsers ignore the declarative autoplay attribute — force it,
  // with a fallback that kicks in on the first tap/scroll if that's blocked too.
  document.querySelectorAll('.trans-video').forEach((video) => {
    video.muted = true;
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    ['pointerdown', 'touchstart', 'scroll'].forEach((evt) => {
      document.addEventListener(evt, tryPlay, { once: true, passive: true });
    });
  });

  // The banner video is shot on black with a vignette baked into the footage.
  // CSS mix-blend-mode doesn't apply to <video> in Safari/WebKit, so instead
  // draw each frame onto a canvas and key out the near-black pixels to real
  // alpha transparency, letting the actual page background show through.
  document.querySelectorAll('.trans-video').forEach((video) => {
    const canvas = document.createElement('canvas');
    canvas.className = 'trans-video-canvas';
    video.insertAdjacentElement('afterend', canvas);

    const W = 640, H = 428;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const LOW = 30, HIGH = 85, RANGE = HIGH - LOW;
    let started = false, skip = 0;

    function drawRect(vw, vh, cw, ch){
      const vr = vw / vh, cr = cw / ch;
      let dw, dh;
      if(vr > cr){ dw = cw; dh = cw / vr; } else { dh = ch; dw = ch * vr; }
      return [(cw - dw) / 2, (ch - dh) / 2, dw, dh];
    }

    function tick(){
      requestAnimationFrame(tick);
      // Decorative background loop — every 3rd frame (~20fps at 60Hz) is plenty
      // smooth and keeps the per-pixel keying cheap on mobile.
      skip = (skip + 1) % 3;
      if(skip !== 0) return;
      if(video.readyState >= 2 && video.videoWidth){
        const [dx, dy, dw, dh] = drawRect(video.videoWidth, video.videoHeight, W, H);
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(video, dx, dy, dw, dh);
        const frame = ctx.getImageData(0, 0, W, H);
        const d = frame.data;
        for(let i = 0; i < d.length; i += 4){
          // cheap brightness proxy (max channel) instead of a weighted-luminance formula
          const v = d[i] > d[i + 1] ? (d[i] > d[i + 2] ? d[i] : d[i + 2]) : (d[i + 1] > d[i + 2] ? d[i + 1] : d[i + 2]);
          d[i + 3] = v <= LOW ? 0 : v >= HIGH ? 255 : ((v - LOW) * 255 / RANGE) | 0;
        }
        ctx.putImageData(frame, 0, 0);
        if(!started){ started = true; video.style.opacity = '0'; }
      }
    }
    requestAnimationFrame(tick);
  });
