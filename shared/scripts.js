(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* NAV background on scroll */
  var nav = document.getElementById('siteNav');
  var railFill = document.getElementById('railFill');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function closeNav(){
    if(!navLinks || !navToggle) return;
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if(navToggle && navLinks){
    navToggle.addEventListener('click', function(){
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', closeNav);
    });
    window.addEventListener('resize', function(){
      if(window.innerWidth > 860) closeNav();
    });
  }

  /* Anatomy exploded-diagram refs (index.html only) */
  var scroller = document.getElementById('anatomyScroller');
  var scanCursor = document.getElementById('scanCursor');
  var parts = {
    motor: document.getElementById('p-motor'),
    filter: document.getElementById('p-filter'),
    cyclone: document.getElementById('p-cyclone'),
    tube: document.getElementById('p-tube'),
    nozzle: document.getElementById('p-nozzle')
  };
  var deltas = { motor:-60, filter:-20, cyclone:0, tube:50, nozzle:120 };
  var labels = Array.prototype.slice.call(document.querySelectorAll('.a-label'));

  function updateAnatomy(p){
    for (var key in parts){
      if(parts[key]) parts[key].style.transform = 'translateY(' + (deltas[key] * p) + 'px)';
    }
    if(scanCursor) scanCursor.style.top = (p * 100) + '%';
    labels.forEach(function(el){
      var th = parseFloat(el.getAttribute('data-th')) || 0;
      var v = Math.min(Math.max((p - th) / 0.22, 0), 1);
      el.style.opacity = v;
      el.style.transform = 'translateY(' + (6 - v*6) + 'px)';
    });
  }

  function onScroll(){
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    if(railFill){
      railFill.style.height = (Math.min(Math.max(scrollY/docH,0),1) * 100) + '%';
    }

    if(nav){
      if(scrollY > 40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    }

    if(scroller){
      var rect = scroller.getBoundingClientRect();
      var total = scroller.offsetHeight - window.innerHeight;
      var scrolled = -rect.top;
      var p = total > 0 ? Math.min(Math.max(scrolled/total,0),1) : 0;
      updateAnatomy(p);
    }
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* Reveal-on-scroll for generic elements */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  if(reduceMotion){
    updateAnatomy(0);
  }
})();

