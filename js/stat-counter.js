  // Animate stat numbers counting up when they scroll into view
  const statEls = document.querySelectorAll('.stat-num[data-count-to]');

  function formatNum(n){
    return Math.round(n).toLocaleString('en-US');
  }

  function animateStat(el){
    const target = parseFloat(el.getAttribute('data-count-to'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNum(target * eased) + suffix;
      if(progress < 1){
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }

  if(statEls.length){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.4});

    statEls.forEach(el => observer.observe(el));
  }
