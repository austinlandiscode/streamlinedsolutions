(function(){
  "use strict";
  var header = document.getElementById('siteHeader');
  var nav = document.getElementById('siteNav');
  var toggle = document.getElementById('menuToggle');
  var navLinks = nav ? nav.querySelectorAll('a') : [];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  // Header shadow on scroll
  function onScroll(){
    if(window.scrollY > 8){ header.classList.add('is-scrolled'); }
    else{ header.classList.remove('is-scrolled'); }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // Mobile menu
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scrollspy
  var sections = ['gap','services','process','why','contact'].map(function(id){
    return document.getElementById(id);
  }).filter(Boolean);

  if('IntersectionObserver' in window && sections.length){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = entry.target.id;
          navLinks.forEach(function(a){
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, {rootMargin:'-45% 0px -50% 0px'});
    sections.forEach(function(s){ spy.observe(s); });
  }

  // Process step highlight
  var steps = document.querySelectorAll('.process-item');
  if('IntersectionObserver' in window && steps.length){
    var po = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, {threshold:0.5});
    steps.forEach(function(s){ po.observe(s); });
  }

  // Stat count-up — stats sit in the hero (first thing anyone sees), so animate
  // on load rather than gating on scroll.
  var statEls = document.querySelectorAll('.stat-num');
  function animateCount(el){
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if(reduceMotion){ el.textContent = target; return; }
    var start = null;
    var duration = 1100;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if(progress < 1){ requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }
  statEls.forEach(function(el){ animateCount(el); });
})();
