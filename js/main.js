/* =====================================================
   Ramesh Baral — Portfolio JS
   Organised into: Mobile Nav, Accessibility Toolbar,
   Work Filters, Reveal-on-scroll, Lightbox Modal, Contact Form
   All sections guard against missing elements, since not
   every page has every feature (e.g. filters only exist
   on experience.html, the form only on contact.html).
===================================================== */
(function(){
  "use strict";

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');
  if(navToggle && primaryNav){
    navToggle.addEventListener('click', function(){
      var open = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    primaryNav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        primaryNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Accessibility toolbar ---------- */
  var a11yToggle = document.getElementById('a11yToggle');
  var a11yPanel = document.getElementById('a11yPanel');
  if(a11yToggle && a11yPanel){
    a11yToggle.addEventListener('click', function(){
      var isHidden = a11yPanel.hasAttribute('hidden');
      if(isHidden){
        a11yPanel.removeAttribute('hidden');
        a11yToggle.setAttribute('aria-expanded','true');
      } else {
        a11yPanel.setAttribute('hidden','');
        a11yToggle.setAttribute('aria-expanded','false');
      }
    });
  }

  /* Font size control (in-memory only, 90%-130%). Resets on page
     navigation by design — browser-storage APIs are intentionally
     avoided here; see README if you want this to persist. */
  var fsLevel = 0;
  function applyFontScale(){
    document.documentElement.style.fontSize = (100 + fsLevel * 10) + '%';
  }
  var fontInc = document.getElementById('fontInc');
  var fontDec = document.getElementById('fontDec');
  var fontReset = document.getElementById('fontReset');
  if(fontInc) fontInc.addEventListener('click', function(){
    fsLevel = Math.min(fsLevel + 1, 3);
    applyFontScale();
  });
  if(fontDec) fontDec.addEventListener('click', function(){
    fsLevel = Math.max(fsLevel - 1, -2);
    applyFontScale();
  });
  if(fontReset) fontReset.addEventListener('click', function(){
    fsLevel = 0;
    applyFontScale();
  });

  /* High contrast toggle */
  var contrastSwitch = document.getElementById('contrastSwitch');
  if(contrastSwitch){
    contrastSwitch.addEventListener('click', function(){
      var on = document.body.classList.toggle('high-contrast');
      contrastSwitch.setAttribute('aria-pressed', on ? 'true' : 'false');
      contrastSwitch.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  /* Reduce motion toggle, plus respect the OS-level preference */
  var motionSwitch = document.getElementById('motionSwitch');
  if(motionSwitch){
    motionSwitch.addEventListener('click', function(){
      var on = document.body.classList.toggle('reduce-motion');
      motionSwitch.setAttribute('aria-pressed', on ? 'true' : 'false');
      motionSwitch.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      document.body.classList.add('reduce-motion');
      motionSwitch.setAttribute('aria-pressed','true');
      motionSwitch.setAttribute('aria-checked','true');
    }
  }

  /* ---------- Work / engagement filters (experience.html) ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var frames = document.querySelectorAll('.frame');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
      btn.setAttribute('aria-pressed','true');
      var filter = btn.getAttribute('data-filter');
      frames.forEach(function(frame){
        var match = (filter === 'all' || frame.getAttribute('data-medium') === filter);
        frame.style.display = match ? '' : 'none';
      });
    });
  });

  var galleryItems = document.querySelectorAll('.frame, .photo-card');

  /* ---------- Reveal cards on scroll ---------- */
  if(galleryItems.length){
    if('IntersectionObserver' in window){
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      galleryItems.forEach(function(f){ observer.observe(f); });
    } else {
      galleryItems.forEach(function(f){ f.classList.add('in-view'); });
    }
  }

  /* ---------- Lightbox modal with focus trap ---------- */
  var overlay = document.getElementById('modalOverlay');
  var dialog = document.getElementById('modalDialog');
  var closeBtn = document.getElementById('modalClose');
  var modalImage = document.getElementById('modalImage');
  var lastFocused = null;

  function openModal(item){
    lastFocused = item;
    document.getElementById('modalMedium').textContent = (item.getAttribute('data-medium') || '').toUpperCase();
    document.getElementById('modalTitle').textContent = item.getAttribute('data-title');
    document.getElementById('modalYear').textContent = item.getAttribute('data-year');
    document.getElementById('modalTools').textContent = item.getAttribute('data-tools');
    document.getElementById('modalDesc').textContent = item.getAttribute('data-desc');
    var imgSrc = item.getAttribute('data-image');
    if(modalImage){
      if(imgSrc){
        modalImage.src = imgSrc;
        modalImage.alt = item.getAttribute('data-title') || '';
        modalImage.removeAttribute('hidden');
      } else {
        modalImage.setAttribute('hidden','');
        modalImage.removeAttribute('src');
      }
    }
    overlay.removeAttribute('hidden');
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal(){
    overlay.setAttribute('hidden','');
    document.removeEventListener('keydown', onKeydown);
    if(lastFocused){ lastFocused.focus(); }
  }

  function onKeydown(e){
    if(e.key === 'Escape'){
      closeModal();
      return;
    }
    if(e.key === 'Tab'){
      var focusable = dialog.querySelectorAll('button, a[href]');
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if(e.shiftKey && document.activeElement === first){
        e.preventDefault(); last.focus();
      } else if(!e.shiftKey && document.activeElement === last){
        e.preventDefault(); first.focus();
      }
    }
  }

  if(overlay && dialog && closeBtn){
    galleryItems.forEach(function(item){
      item.addEventListener('click', function(){ openModal(item); });
    });
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e){
      if(e.target === overlay){ closeModal(); }
    });
  }

  /* ---------- Contact form (contact.html) — demo only ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if(form && status){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      status.textContent = 'This form is a working demo — connect it to your email service (e.g. Formspree) to receive messages.';
    });
  }

})();
