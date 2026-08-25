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
      dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
    });
    if(prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); restartAutoplay(); });
    if(nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); restartAutoplay(); });
  }

  // ---- Autoplay: advance every 4s; pauses on hover, on a hidden tab, and
  // for prefers-reduced-motion; restarts (rather than stacks) on manual nav ----
  const AUTOPLAY_MS = 4000;
  const heroSection = document.querySelector('.hero');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let autoplayTimer = null;

  function stopAutoplay(){
    if(autoplayTimer){ clearInterval(autoplayTimer); autoplayTimer = null; }
  }
  function startAutoplay(){
    stopAutoplay();
    if(total <= 1 || reduceMotionQuery.matches || document.hidden) return;
    autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }
  function restartAutoplay(){ startAutoplay(); }

  if(total > 1){
    startAutoplay();
    if(heroSection){
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);
    }
    document.addEventListener('visibilitychange', () => {
      if(document.hidden) stopAutoplay(); else startAutoplay();
    });
    reduceMotionQuery.addEventListener?.('change', () => {
      if(reduceMotionQuery.matches) stopAutoplay(); else startAutoplay();
    });
  }

  // ---- Hero background video ---------------------------------------------
  const heroVideo = document.getElementById('heroVideo');

  if(heroVideo){
    // Some mobile browsers ignore the declarative autoplay attribute — force it,
    // with a fallback that kicks in on the first tap/scroll if that's blocked too.
    const tryPlay = () => heroVideo.play().catch(() => {});
    heroVideo.muted = true;
    tryPlay();
    ['pointerdown', 'touchstart', 'scroll'].forEach((evt) => {
      document.addEventListener(evt, tryPlay, { once: true, passive: true });
    });

    // The <source media> attributes already picked the right file on first load,
    // so a phone never downloads the desktop asset. Browsers don't re-run that
    // selection on resize or rotation though, so swap manually — and only when
    // the breakpoint actually flips, to avoid re-fetching what's already playing.
    const mobileQuery = window.matchMedia('(max-width: 900px) and (orientation: portrait)');
    const VARIANTS = {
      true:  { src: 'videos/jackwen-hero-mobile.mp4',  poster: 'assets/hero/jackwen-hero-mobile-poster.jpg' },
      false: { src: 'videos/jackwen-hero-desktop.mp4', poster: 'assets/hero/jackwen-hero-desktop-poster.jpg' }
    };
    let isMobile = mobileQuery.matches;

    function syncSource(){
      if(mobileQuery.matches === isMobile) return;
      isMobile = mobileQuery.matches;
      const variant = VARIANTS[isMobile];
      heroVideo.poster = variant.poster;
      heroVideo.src = variant.src; // a direct src wins over the <source> children
      heroVideo.load();
      tryPlay();
    }

    if(mobileQuery.addEventListener){
      mobileQuery.addEventListener('change', syncSource);
    } else {
      mobileQuery.addListener(syncSource); // Safari < 14
    }
  }
