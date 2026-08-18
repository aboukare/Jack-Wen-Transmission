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
