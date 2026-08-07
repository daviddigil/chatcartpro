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

});
