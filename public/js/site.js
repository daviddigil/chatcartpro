/* ChatCart Pro – shared site script (every page):
   floating WhatsApp button, GA4 + Meta Pixel events, location-based pricing,
   demo-request form. No third-party geo lookup: location comes from the
   visitor's device time zone/language, so nothing is sent anywhere. */
(function(){
  var WA = '971547378597';
  var WA_TEXT = "Hi ChatCart Pro, I'd like to see a demo for my store/restaurant.";
  var WA_URL = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(WA_TEXT);

  /* ---------- tracking ---------- */
  var pid = window.CC_META_PIXEL_ID;
  if(pid && !window.fbq){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', pid); fbq('track', 'PageView');
  }
  function track(ga, fb, params){
    try{ if(typeof gtag==='function') gtag('event', ga, params||{}); }catch(e){}
    try{ if(window.fbq) fbq('track', fb, params||{}); }catch(e){}
  }
  window.ccTrack = track;

  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a');
    if(!a) return;
    var h = a.getAttribute('href') || '';
    if(h.indexOf('wa.me/') > -1){
      track('whatsapp_click', 'Contact', {link_location: a.getAttribute('data-loc') || (a.classList.contains('wa-float') ? 'floating' : 'page')});
    } else if(a.hasAttribute('data-demo-cta')){
      track('demo_cta_click', 'ViewContent', {link_location: a.getAttribute('data-loc') || 'page'});
    }
  });

  /* ---------- floating WhatsApp button ---------- */
  function addFloat(){
    if(document.querySelector('.wa-float')) return;
    var a = document.createElement('a');
    a.className = 'wa-float'; a.href = WA_URL; a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label', 'Chat with ChatCart Pro on WhatsApp');
    a.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
    document.body.appendChild(a);
    if(document.getElementById('ccChatBubble')) document.body.classList.add('has-cc-chat');
  }

  /* ---------- location-based pricing ---------- */
  function region(){
    var tz = '', lang = '';
    try{ tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }catch(e){}
    lang = navigator.language || '';
    if(/Kolkata|Calcutta/i.test(tz) || /-IN$/i.test(lang)) return 'IN';
    if(/Dubai|Muscat/i.test(tz) || /-AE$/i.test(lang)) return 'AE';
    return tz ? 'OTHER' : 'AE';
  }
  var CUR = {AE:'AED', IN:'INR', OTHER:'USD'};
  var SYM = {AED:'AED ', INR:'₹', USD:'$'};
  function fmt(cur, n){
    if(n == null) return '<span class="ph">' + SYM[cur].trim() + ' [price]</span>';
    return SYM[cur] + Number(n).toLocaleString(cur === 'INR' ? 'en-IN' : 'en-US');
  }
  function pricing(){
    var els = document.querySelectorAll('[data-price]');
    var note = document.querySelector('[data-price-note]');
    var cur = CUR[region()];
    var table = (window.CC_PRICES || {})[cur] || {};
    els.forEach(function(el){ el.innerHTML = fmt(cur, table[el.getAttribute('data-price')]); });
    if(note){
      var msg = {AED:'Prices shown in UAE dirhams (AED). VAT: <span class="ph">[included / extra – confirm]</span>.',
                 INR:'Prices shown in Indian rupees (INR) for businesses in India. GST extra where applicable.',
                 USD:'Prices shown in US dollars (USD). Based in the UAE or India? Prices are in AED / INR – ask us on WhatsApp.'};
      note.innerHTML = msg[cur];
    }
  }

  /* ---------- demo request form ---------- */
  function lead(){
    var form = document.getElementById('leadForm');
    if(!form) return;
    var EJ = {key:'NRu8tw60wiU7jY3pD', svc:'service_9cpjres', notify:'template_4pu5t3l', reply:'template_8bvo8id'};
    var btn = document.getElementById('leadBtn'), err = document.getElementById('leadErr');
    function v(id){ var n = document.getElementById(id); return n ? n.value.trim() : ''; }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(err) err.style.display = 'none';
      btn.disabled = true; var label = btn.textContent; btn.textContent = 'Sending…';
      var email = v('lemail');
      var params = {
        from_name: v('lname'), business_name: v('lbusiness'),
        industry: 'Stores: ' + v('lstores') + ' | POS: ' + (v('lpos') || 'not sure'),
        whatsapp: v('lwhatsapp'), from_email: email || 'not provided'
      };
      if(!window.emailjs){ fail(); return; }
      emailjs.init({publicKey: EJ.key});
      var jobs = [emailjs.send(EJ.svc, EJ.notify, params)];
      if(email) jobs.push(emailjs.send(EJ.svc, EJ.reply, params));
      Promise.all(jobs).then(function(){
        form.style.display = 'none';
        document.getElementById('leadOk').style.display = 'block';
        track('generate_lead', 'Lead', {event_category: 'demo_form', stores: v('lstores'), pos: v('lpos')});
      }).catch(fail);
      function fail(){
        btn.disabled = false; btn.textContent = label;
        if(err) err.style.display = 'block';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){ addFloat(); pricing(); lead(); });
})();
