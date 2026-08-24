  // Fade + slide up cards, headers, and images as they scroll into view
  (function(){
    var selector = [
      '.service-card', '.value-card', '.specialty-card', '.review-card',
      '.why-highlights > div', '.stats-grid > div', '.faq-item',
      '.services-head', '.faq-head', '.reviews-head',
      '.about-grid > *', '.why-grid > *',
      '.appt-form', '.contact-card',
      '.warranty-hero-copy', '.warranty-hero-media',
      '.warranty-figure-card', '.warranty-extended-grid > *',
      '.warranty-card', '.process-step', '.trust-band-inner'
    ].join(', ');

    var els = document.querySelectorAll(selector);
    if(!els.length) return;

    var counts = new WeakMap();
    els.forEach(function(el){
      el.classList.add('reveal');
      var parent = el.parentElement;
      var idx = counts.get(parent) || 0;
      el.style.transitionDelay = (Math.min(idx, 5) * 0.08) + 's';
      counts.set(parent, idx + 1);
    });

    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){ el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.15, rootMargin: '0px 0px -60px 0px'});

    els.forEach(function(el){ observer.observe(el); });
  })();
