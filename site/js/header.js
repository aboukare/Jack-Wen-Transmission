  // Hide header on scroll down, reveal on scroll up
  const header = document.querySelector('header');
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll(){
    const y = window.scrollY;
    if(y > lastY && y > 80){
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if(!ticking){
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, {passive:true});

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('nav.navlinks');
  if(menuToggle && navLinks){
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
