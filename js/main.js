/* ==========================================================================
   ChatCart Pro AI — central marketing site script
   Extracted from index.html (source of truth) and deduplicated across the
   marketing pages that used to carry an identical copy of this logic in
   their own inline <script> blocks.

   Contains, in order:
   1. Mobile nav toggle (hamburger menu open/close)
   2. FAQ accordion
   3. Demo form submit via EmailJS (guarded: no-op if #demoForm is absent)
   4. Floating AI chat widget (guarded: no-op if #ccChatBubble is absent)
   5. Auto light/dark theme periodic re-check (the initial pre-paint theme
      is set synchronously in a small inline <script> in each page's <head>,
      to avoid a flash of the wrong theme; this section just re-evaluates
      it every few minutes for tabs left open across the 7am/7pm boundary)
   6. GSAP scroll-triggered reveal animations (guarded: no-op if GSAP/
      ScrollTrigger didn't load, and skipped entirely under
      prefers-reduced-motion)

   Each section is defensive about missing DOM elements so this file is
   safe to include on every page, even ones that only use a subset of the
   above (e.g. privacy-policy/ only has the chat widget; pricing/ has no
   demo form or FAQ).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function(){

  /* ---------- 1. Mobile nav toggle ---------- */
  (function(){
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    if(!navToggle || !navLinks) return;
    var navWrap = navToggle.closest('nav.wrap') || document.querySelector('nav.wrap');

    function closeMobileNav(){
      navLinks.classList.remove('open');
      if(navWrap) navWrap.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '&#9776;';
    }

    navToggle.addEventListener('click', function(){
      var isOpen = navLinks.classList.toggle('open');
      if(navWrap) navWrap.classList.toggle('menu-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
    });
    navLinks.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', closeMobileNav);
    });
    window.addEventListener('resize', function(){
      if(window.innerWidth > 860 && navLinks.classList.contains('open')){
        closeMobileNav();
      }
    });
  })();

  /* ---------- 2. FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if(!q || !a) return;
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){
        i.classList.remove('open');
        var ia = i.querySelector('.faq-a');
        if(ia) ia.style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- 3. Demo form submit (EmailJS) ---------- */
  (function(){
    var demoForm = document.getElementById('demoForm');
    if(!demoForm) return;

    var EMAILJS_PUBLIC_KEY = 'NRu8tw60wiU7jY3pD';
    var EMAILJS_SERVICE_ID = 'service_9cpjres';
    var EMAILJS_TEMPLATE_NOTIFY = 'template_4pu5t3l';
    var EMAILJS_TEMPLATE_AUTOREPLY = 'template_8bvo8id';

    /* Optional per-page override for the on-failure error message,
       e.g. ar/index.html sets window.CHATCART_FORM_ERROR_TEXT and
       window.CHATCART_FORM_ERROR_SUFFIX to the Arabic strings before this
       script loads. Defaults to English. */
    var ERROR_TEXT = window.CHATCART_FORM_ERROR_TEXT || 'Something went wrong sending your request';
    var ERROR_SUFFIX = window.CHATCART_FORM_ERROR_SUFFIX || '. Please try again, or reach us directly.';

    if(window.emailjs){
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    var submitBtn = document.getElementById('demoSubmitBtn');
    var errorEl = document.getElementById('demoFormError');

    demoForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(errorEl) errorEl.style.display = 'none';
      if(submitBtn) submitBtn.disabled = true;
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if(submitBtn) submitBtn.textContent = '...';

      var params = {
        from_name: document.getElementById('fname').value,
        business_name: document.getElementById('fbusiness').value,
        industry: document.getElementById('findustry').value,
        whatsapp: document.getElementById('fwhatsapp').value,
        from_email: document.getElementById('femail').value
      };

      var sendNotify = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_NOTIFY, params);
      var sendAutoReply = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_AUTOREPLY, params);

      Promise.all([sendNotify, sendAutoReply]).then(function(){
        var wrap = document.getElementById('demoFormWrap');
        var success = document.getElementById('demoSuccess');
        if(wrap) wrap.style.display = 'none';
        if(success) success.style.display = 'block';
        if(typeof gtag === 'function'){
          gtag('event', 'generate_lead', {
            event_category: 'demo_form',
            event_label: params.industry
          });
        }
      }).catch(function(err){
        console.error('EmailJS send failed:', err);
        var detail = (err && (err.text || err.message)) ? (' (' + (err.status || '') + ' ' + (err.text || err.message) + ')') : '';
        if(errorEl){
          errorEl.textContent = ERROR_TEXT + detail + ERROR_SUFFIX;
          errorEl.style.display = 'block';
        }
        if(submitBtn){
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      });
    });
  })();

  /* ---------- 4. Floating AI chat widget ---------- */
  (function(){
    "use strict";

    var bubble = document.getElementById('ccChatBubble');
    var panel = document.getElementById('ccChatPanel');
    if(!bubble || !panel) return;

    /* Point this at your own backend proxy that holds the OpenRouter key
       server-side. Never call OpenRouter directly from this static page. */
    var CHAT_API_ENDPOINT = "https://chatcartpro-aiagent.onrender.com/api/chat";

    var body = document.getElementById('ccChatBody');
    var form = document.getElementById('ccChatForm');
    var input = document.getElementById('ccChatInput');
    var sendBtn = form.querySelector('button');

    var history = [];
    var greeted = false;

    function addBubble(text, who){
      var el = document.createElement('div');
      el.className = 'cc-bubble ' + who;
      el.textContent = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      return el;
    }

    function addDemoCta(){
      var wrap = document.createElement('div');
      wrap.className = 'cc-bubble bot cc-cta-wrap';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cc-cta-btn';
      btn.textContent = 'Book a Demo';
      btn.addEventListener('click', function(){
        var demoSection = document.getElementById('demo');
        if(demoSection){
          closePanel();
          demoSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = '/#demo';
        }
      });
      wrap.appendChild(btn);
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    }

    function openPanel(){
      panel.classList.add('open');
      bubble.classList.add('open');
      bubble.setAttribute('aria-expanded', 'true');
      if(teaser) teaser.classList.remove('show');
      if(!greeted){
        greeted = true;
        addBubble("Hi! I'm the ChatCart Pro AI assistant. Ask me anything about pricing, features, or how it works for your business.", 'bot');
      }
      input.focus();
    }
    function closePanel(){
      panel.classList.remove('open');
      bubble.classList.remove('open');
      bubble.setAttribute('aria-expanded', 'false');
    }

    bubble.addEventListener('click', function(){
      panel.classList.contains('open') ? closePanel() : openPanel();
    });

    /* Proactive teaser: shows once per session after 10s of inactivity,
       unless the visitor already opened the chat or dismissed the teaser. */
    var teaser = document.getElementById('ccTeaser');
    var teaserCloseBtn = teaser ? teaser.querySelector('.cc-teaser-close') : null;

    function hideTeaser(){
      if(teaser) teaser.classList.remove('show');
    }

    if(teaser && !sessionStorage.getItem('ccTeaserShown')){
      setTimeout(function(){
        if(panel.classList.contains('open')) return;
        sessionStorage.setItem('ccTeaserShown', '1');
        teaser.classList.add('show');
        setTimeout(hideTeaser, 12000);
      }, 10000);
    }

    if(teaser){
      teaser.addEventListener('click', function(){
        hideTeaser();
        openPanel();
      });
      teaser.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          hideTeaser();
          openPanel();
        }
      });
    }
    if(teaserCloseBtn){
      teaserCloseBtn.addEventListener('click', function(e){
        e.stopPropagation();
        hideTeaser();
      });
    }

    function sleep(ms){
      return new Promise(function(resolve){ setTimeout(resolve, ms); });
    }

    function sendChatMessage(msg, attempt){
      attempt = attempt || 1;
      var maxAttempts = 3;
      return fetch(CHAT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: history })
      }).then(function(res){
        if(!res.ok) throw new Error('Request failed with status ' + res.status);
        return res.json();
      }).catch(function(err){
        if(attempt < maxAttempts){
          return sleep(attempt * 1500).then(function(){
            return sendChatMessage(msg, attempt + 1);
          });
        }
        throw err;
      });
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var msg = input.value.trim();
      if(!msg) return;

      addBubble(msg, 'user');
      history.push({ role: 'user', content: msg });
      input.value = '';
      input.disabled = true;
      sendBtn.disabled = true;

      var typingEl = addBubble('Typing...', 'bot typing');
      var slowNoticeTimer = setTimeout(function(){
        typingEl.textContent = 'Still connecting, one moment...';
      }, 4000);

      sendChatMessage(msg)
        .then(function(data){
          clearTimeout(slowNoticeTimer);
          typingEl.remove();
          var reply = (data && data.reply) ? data.reply : "Sorry, I didn't catch that. Could you rephrase?";
          var showDemo = /\[SHOW_DEMO_FORM\]/.test(reply);
          reply = reply.replace(/\[SHOW_DEMO_FORM\]/g, '').trim();
          addBubble(reply, 'bot');
          history.push({ role: 'assistant', content: reply });
          if(showDemo) addDemoCta();
        })
        .catch(function(){
          clearTimeout(slowNoticeTimer);
          typingEl.remove();
          addBubble("Something went wrong reaching the assistant. Please try again, or book a demo and we'll help directly.", 'bot');
        })
        .finally(function(){
          input.disabled = false;
          sendBtn.disabled = false;
          input.focus();
        });
    });

    window.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });
  })();

  /* ---------- 5. Auto theme periodic re-check ---------- */
  (function(){
    function computeAutoTheme(){
      var hour = new Date().getHours();
      return (hour >= 19 || hour < 7) ? 'dark' : 'light';
    }
    function applyTheme(theme){
      document.documentElement.setAttribute('data-theme', theme);
    }
    setInterval(function(){
      try{
        var saved = localStorage.getItem('cc_theme');
        if(saved === 'light' || saved === 'dark') return; // manual override wins
        applyTheme(computeAutoTheme());
      }catch(e){}
    }, 5 * 60 * 1000);
  })();

  /* ---------- 6. GSAP scroll-triggered reveal animations ---------- */
  (function(){
    if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // Section headers: fade + rise as they enter the viewport.
    gsap.utils.toArray('.section-head').forEach(function(el){
      gsap.from(el, {
        opacity: 0, y: 28, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    // Card grids: stagger children in as a group so a whole row animates
    // together rather than each card triggering independently.
    var cardGroupSelectors = [
      '.benefits-grid', '.mode-grid-3', '.industry-groups', '.steps-grid',
      '.tier-grid', '.testi-grid', '.why-grid', '.ask-grid', '.stage-strip'
    ];
    cardGroupSelectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(group){
        var items = group.children;
        if(!items.length) return;
        gsap.from(items, {
          opacity: 0, y: 24, duration: 0.6, ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: 'top 88%' }
        });
      });
    });

    // Industry/mode chip lists: a lighter, faster stagger since these lists
    // can be long and a full 0.6s-per-card stagger would feel sluggish.
    document.querySelectorAll('.industry-strip, .industry-list').forEach(function(list){
      var chips = list.children;
      if(!chips.length) return;
      gsap.from(chips, {
        opacity: 0, y: 12, duration: 0.4, ease: 'power1.out',
        stagger: 0.04,
        scrollTrigger: { trigger: list, start: 'top 90%' }
      });
    });

    // Stat numbers (".big"): count up from 0 to the printed value for
    // purely numeric labels (92%, 3.2x, 140+, 3B+); left untouched for
    // non-numeric labels (24x7, "All Verticals") since there's nothing to
    // count up to.
    document.querySelectorAll('.big').forEach(function(el){
      var raw = el.textContent.trim();
      var match = raw.match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
      if(!match) return;

      var target = parseFloat(match[1]);
      var suffix = match[2];
      var decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
      var counter = { val: 0 };

      gsap.to(counter, {
        val: target, duration: 1.3, ease: 'power1.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: function(){
          el.textContent = counter.val.toFixed(decimals) + suffix;
        },
        onComplete: function(){
          el.textContent = target.toFixed(decimals) + suffix;
        }
      });
    });

    // Hero: a light entrance for the eyebrow/heading/sub/CTAs on load,
    // since these are above the fold and won't get a scroll trigger.
    var heroTimeline = gsap.timeline({ defaults: { duration: 0.6, ease: 'power2.out' } });
    var heroEls = [
      document.querySelector('.hero .eyebrow, .alt-hero .vs-badge'),
      document.querySelector('.hero h1, .alt-hero h1'),
      document.querySelector('.hero .sub, .alt-hero p'),
      document.querySelector('.hero .hero-ctas, .alt-hero .hero-ctas')
    ].filter(Boolean);
    if(heroEls.length){
      heroTimeline.from(heroEls, { opacity: 0, y: 20, stagger: 0.12 });
    }
  })();

});
