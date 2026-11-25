// Generates the conversion pages from one place so nav/footer/head never drift.
// Run:  node tools/build.mjs        (writes into ../public)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const SITE = 'https://chatcartpro.com';
const WA = '971547378597';
const WA_URL = `https://wa.me/${WA}?text=` + encodeURIComponent("Hi ChatCart Pro, I'd like to see a demo for my store/restaurant.");
const GA = 'G-W50ECXZCXE';
const CSS_V = '20261125';

const THEME_JS = `(function(){try{var s=localStorage.getItem('cc_theme'),t;if(s==='light'||s==='dark'){t=s}else{var h=new Date().getHours();t=(h>=19||h<7)?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function page({ path, title, desc, h1Html, body, schema = [], lang = 'en', dir = 'ltr', needsForm = false, extraHead = '' }) {
  const url = SITE + path;
  const ld = schema.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>${THEME_JS}</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/logo/logo.png">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/logo/logo.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ChatCart Pro">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/css/main.css?v=${CSS_V}">
<link rel="stylesheet" href="/css/site.css?v=${CSS_V}">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}');</script>
${extraHead}
${ld}
</head>
<body>
<header>
  <nav class="wrap">
    <a href="/" class="logo"><span class="logo-mark"><img src="/logo/logo.png" alt="" width="32" height="32"></span> <span class="logo-text">ChatCart Pro</span></a>
    <div class="nav-links" id="navLinks">
      <a href="/#how">How it works</a>
      <a href="/#features">Features</a>
      <a href="/whatsapp-ai-for-grocery-stores/">Supermarkets</a>
      <a href="/whatsapp-ai-for-restaurants/">Restaurants</a>
      <a href="/whatsapp-ordering-for-grocery-chains/">Chains</a>
      <a href="/pricing/">Pricing</a>
      <a href="/#faq">FAQ</a>
      <div class="nav-links-mobile-extra"><a href="#demo" class="btn btn-primary" data-demo-cta data-loc="nav-mobile">Book a free demo</a></div>
    </div>
    <div class="nav-cta">
      <a href="${path === '/' ? '' : '/'}#demo" class="btn btn-primary" data-demo-cta data-loc="nav">Book a free demo</a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false" aria-controls="navLinks">&#9776;</button>
    </div>
  </nav>
</header>
<main id="top">
${body}
</main>
<footer>
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-col">
        <div class="flogo"><span class="logo-mark" style="width:26px;height:26px;"><img src="/logo/logo.png" alt="" width="26" height="26" loading="lazy"></span> ChatCart Pro</div>
        <p>AI ordering on your own WhatsApp number and phone line, for supermarkets, mini marts and restaurants in the UAE and India.</p>
        <p style="margin-top:12px">Built in Dubai by Nexsofture Tech FZ LLC.<br>Licence no. [trade licence number]<br>[Registered address, Dubai, UAE]</p>
      </div>
      <div class="footer-col">
        <h5>Who it's for</h5>
        <ul>
          <li><a href="/whatsapp-ai-for-grocery-stores/">Supermarkets &amp; mini marts</a></li>
          <li><a href="/whatsapp-ai-for-restaurants/">Restaurants &amp; cafeterias</a></li>
          <li><a href="/whatsapp-ordering-for-grocery-chains/">Multi-branch chains</a></li>
          <li><a href="/pricing/">Pricing</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Talk to us</h5>
        <ul>
          <li><a href="${WA_URL}" target="_blank" rel="noopener">WhatsApp +971 54 737 8597</a></li>
          <li><a href="mailto:chatcartpro@gmail.com">chatcartpro@gmail.com</a></li>
          <li><a href="/#demo">Book a free demo</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Legal</h5>
        <ul>
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/terms-and-conditions/">Terms &amp; Conditions</a></li>
        </ul>
        <p style="margin-top:12px;font-size:12.5px">Customers who message or call a business using ChatCart Pro are speaking with an AI ordering assistant.</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Nexsofture Tech FZ LLC. All rights reserved.</p>
      <p class="powered-by">WhatsApp is a trademark of Meta. ChatCart Pro uses the WhatsApp Business Platform.</p>
    </div>
  </div>
</footer>
${needsForm ? '<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js" defer></script>' : ''}
<script src="/js/main.js?v=${CSS_V}" defer></script>
<script src="/js/pricing-config.js?v=${CSS_V}"></script>
<script src="/js/site.js?v=${CSS_V}" defer></script>
</body>
</html>
`;
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ChatCart Pro',
  legalName: 'Nexsofture Tech FZ LLC',
  url: SITE,
  logo: SITE + '/logo/logo.png',
  address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', telephone: '+971547378597', availableLanguage: ['English', 'Tamil', 'Hindi', 'Malayalam', 'Telugu'] }],
};
const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })),
});
const crumb = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + p })),
});

const faqHtml = (items) => `<div class="faq-list">${items.map(([q, a]) => `
  <div class="faq-item"><button class="faq-q" type="button">${q}<span class="chev">&#9660;</span></button><div class="faq-a"><p>${a}</p></div></div>`).join('')}
</div>`;

const FAQ = [
  ['Do my customers need to download an app?', 'No. Customers order in WhatsApp, or by calling your normal phone number. There is no app and no web menu link.'],
  ['Can I keep my current number?', 'Yes. ChatCart Pro runs on your own business WhatsApp number and your own phone line, so customers keep using the number they already know. During setup we explain exactly what changes on your staff phones.'],
  ['Which POS or billing systems work?', 'We connect to your shop\'s system so stock is checked live. GOFRUGAL is supported. Using something else? Tell us in the demo form and we will confirm whether we can connect to it. <span class="ph">[add confirmed list of other supported systems]</span>'],
  ['Which languages does it understand?', 'Tamil, Hindi, Malayalam, Telugu and English, on WhatsApp chat and on phone calls. Customers can mix languages in one message.'],
  ['What if the AI cannot answer? Can my staff take over?', 'Yes. If a request is unclear or the customer asks for a person, the order is flagged on your dashboard and your staff can take over the conversation. The AI tells the customer it is passing them to your team.'],
  ['How long does setup take?', '<span class="ph">[X days – confirm]</span>. We handle the connection to your WhatsApp number, phone line and shop system, and train your staff on the dashboard.'],
  ['Are there per-order fees or commission?', 'No. We take no commission on any order and charge no per-order fee. You pay a flat monthly price plus a one-time setup fee. WhatsApp (Meta) message charges are billed at cost, with no markup. <a href="/pricing/">See pricing</a>.'],
  ['Do customers know they are talking to an AI?', 'Yes. The assistant introduces itself as an AI ordering assistant for your business, and callers hear a short notice. It never pretends to be a person.'],
  ['Is my customers\' data secure?', 'We only use your customers\' data to run your orders, and we never sell it. Chats and call recordings are kept for your business only, and recorded calls start with a notice. Details are in our <a href="/privacy-policy/">Privacy Policy</a>, which covers UAE data protection law (PDPL). <span class="ph">[confirm hosting region and retention period]</span>'],
];

/* ------------------------------------------------------------------ HOME */
const phone = `
<div class="phone-wrap"><div>
  <div class="phone"><div class="chat-card">
    <div class="chat-head"><div class="avatar">GM</div><div><div class="name">Green Mart Supermarket <span class="ai-pill">AI assistant</span></div><div class="status">online</div></div></div>
    <div class="chat-body">
      <div class="bubble in">வணக்கம் 🙏 அரிசி 5 கிலோ, பால் 2 லிட்டர், முட்டை 1 டஜன் வேணும்<small>10:14 AM</small></div>
      <div class="bubble out">வணக்கம்! I'm the AI ordering assistant for Green Mart. Here is your order:
✅ Ponni rice 5 kg – in stock
✅ Milk 2 L – in stock
⚠️ Eggs 1 dozen – brown eggs only today
Total AED 41.50 · delivery about 45 min. Confirm?<small>10:14 AM ✓✓</small></div>
      <div class="bubble in">ஆம், brown eggs ok. Confirm<small>10:15 AM</small></div>
      <div class="bubble out">Order #1042 confirmed ✅ Sent to the store now. We will message you when the rider leaves.<small>10:15 AM ✓✓</small></div>
    </div>
  </div></div>
  <p class="sample-tag">Sample conversation. Business, items and prices are illustrative.</p>
</div></div>`;

const home = page({
  path: '/',
  title: 'WhatsApp Ordering System UAE | ChatCart Pro',
  desc: 'AI WhatsApp and phone ordering for UAE supermarkets, mini marts and restaurants. Orders in Tamil, Hindi, Malayalam, Telugu, English. Zero commission.',
  needsForm: true,
  schema: [orgSchema, { '@context': 'https://schema.org', '@type': 'WebSite', name: 'ChatCart Pro', url: SITE }, faqSchema(FAQ)],
  body: `
<section class="hero hero-new"><div class="wrap">
  <span class="eyebrow">AI ordering for UAE supermarkets, mini marts &amp; restaurants</span>
  <h1>Never miss a WhatsApp or phone order again.</h1>
  <p class="sub">ChatCart Pro is an AI ordering assistant on your own WhatsApp number and phone line. It takes orders in 5 languages, checks your live stock, and sends them to your store or kitchen.</p>
  <div class="hero-ctas">
    <a href="#demo" class="btn btn-primary" data-demo-cta data-loc="hero">Book a free demo</a>
    <a href="${WA_URL}" class="btn btn-wa" target="_blank" rel="noopener" data-loc="hero">Chat with us on WhatsApp</a>
  </div>
  <p class="trust-line"><span>No app for customers</span><span>Zero commission</span><span>Flat monthly price</span></p>
  ${phone}
</div></section>

<div class="contrast-band"><div class="wrap"><p>Other tools get you leads. <span class="hl">ChatCart Pro runs your orders.</span></p></div></div>

<section id="problem"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Sound familiar?</span><h2>Rush hour is where orders get lost</h2></div>
  <div class="card-grid">
    <div class="pain"><span class="ico">📵</span><h3>Messages go unanswered</h3><p>Fifty chats at 7 pm and two staff on the till. Customers wait, then order from someone else.</p></div>
    <div class="pain"><span class="ico">📝</span><h3>Wrong or missing items</h3><p>Orders taken by voice note or a quick call get written down wrong. You pay for the mistake.</p></div>
    <div class="pain"><span class="ico">⏱️</span><h3>Late orders, no updates</h3><p>The customer keeps asking "where is my order?" and your team has no time to reply.</p></div>
    <div class="pain"><span class="ico">📦</span><h3>Stock out of sync</h3><p>You sell what is not on the shelf, then call to apologise. Or you say no to something you have.</p></div>
  </div>
</div></section>

<section id="how" class="section-pastel section-pastel-mint"><div class="wrap">
  <div class="section-head"><span class="eyebrow">How it works</span><h2>From "I want rice and milk" to a packed order</h2></div>
  <div class="steps">
    <div class="step"><h3>Customer messages or calls</h3><p>On your own WhatsApp number or phone line. In Tamil, Hindi, Malayalam, Telugu or English.</p></div>
    <div class="step"><h3>The AI takes the order</h3><p>It understands the list, checks live stock in your shop's system, and suggests alternatives.</p></div>
    <div class="step"><h3>Customer confirms</h3><p>They see items and total in the chat and say yes. No app, no link, no sign-up.</p></div>
    <div class="step"><h3>It reaches your team</h3><p>The order appears on your store dashboard or kitchen display. A rider is assigned if it is a delivery.</p></div>
  </div>
</div></section>

<section id="features"><div class="wrap">
  <div class="section-head"><span class="eyebrow">What you get</span><h2>Everything an order needs, in one place</h2><p>Grouped by what it does for your shop, not by technology.</p></div>
  <div class="card-grid c3">
    <div class="feat"><span class="tagline">Take every WhatsApp order</span><h3>WhatsApp AI ordering</h3><p>Customers chat as they normally do. It runs on the official WhatsApp Business Platform (Cloud API) from Meta, on your own number.</p></div>
    <div class="feat"><span class="tagline">Answer every call</span><h3>Voice ordering in 5 languages</h3><p>When customers call your shop, the AI answers, takes the order and confirms it. Tamil, Hindi, Malayalam, Telugu and English. Inbound calls only.</p></div>
    <div class="feat"><span class="tagline">Sell only what you have</span><h3>Shop system &amp; stock sync</h3><p>Connects to your shop's system, for example GOFRUGAL. Out-of-stock items are never confirmed.</p></div>
    <div class="feat"><span class="tagline">See every order live</span><h3>Order dashboard &amp; kitchen display</h3><p>New orders appear on a live screen for the counter or the kitchen. Staff can take over any chat.</p></div>
    <div class="feat"><span class="tagline">Get orders delivered</span><h3>Delivery rider management</h3><p>Assign riders, track each delivery, and keep customers updated without extra calls.</p></div>
    <div class="feat"><span class="tagline">Settle "I never said that"</span><h3>Call recordings &amp; transcripts</h3><p>Every phone order is saved with a written transcript, so you can check what was asked. Callers are told the call is recorded.</p></div>
    <div class="feat"><span class="tagline">Bring customers back</span><h3>Broadcasts &amp; offers</h3><p>Send offers to customers who agreed to receive them, following WhatsApp's rules.</p></div>
  </div>
</div></section>

<section id="industries" class="section-pastel section-pastel-blue"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Who it's for</span><h2>Built for how your shop actually runs</h2></div>
  <div class="card-grid c3">
    <div class="ind-card"><h3>Supermarkets &amp; mini marts</h3><p>Long grocery lists, substitutions and home delivery, matched to what is on your shelf.</p><a class="more" href="/whatsapp-ai-for-grocery-stores/">See how it works &rarr;</a></div>
    <div class="ind-card"><h3>Restaurants &amp; cafeterias</h3><p>Takeaway and delivery orders straight to the kitchen screen. No commission to delivery apps.</p><a class="more" href="/whatsapp-ai-for-restaurants/">See how it works &rarr;</a></div>
    <div class="ind-card"><h3>Multi-branch chains</h3><p>One number or one per branch, every branch's stock and orders in one view.</p><a class="more" href="/whatsapp-ordering-for-grocery-chains/">See how it works &rarr;</a></div>
  </div>
</div></section>

<section id="pricing-teaser"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Pricing</span><h2>One flat monthly price. No commission.</h2><p>Single store from <strong data-price="single"></strong> a month, plus a one-time setup fee. You keep 100% of every order.</p></div>
  <div class="hero-ctas" style="justify-content:center"><a href="/pricing/" class="btn btn-primary">See pricing</a></div>
  <p class="form-note" style="text-align:center;margin-top:12px" data-price-note></p>
</div></section>

<section id="trust" class="section-pastel section-pastel-yellow"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Trust</span><h2>Built in Dubai, run on official WhatsApp</h2></div>
  <div class="card-grid c3">
    <div class="trust-card"><h3>Pilot story</h3>
      <div class="ph-block"><span class="ph">[Customer logo]</span><br><br><span class="ph">[Short quote from the owner]</span><br><br><span class="ph">[Real result, e.g. orders handled or time saved]</span><br><br>Add only figures you can show.</div></div>
    <div class="trust-card"><h3>Built in Dubai</h3><p>ChatCart Pro is built by Nexsofture Tech FZ LLC, Dubai, UAE. <span class="ph">[trade licence no.]</span> <span class="ph">[registered address]</span></p></div>
    <div class="trust-card"><h3>Official WhatsApp</h3><p>We use the WhatsApp Business Platform (Cloud API) from Meta, on your own business number, and follow Meta's messaging policy. Broadcasts go only to customers who opted in.</p></div>
  </div>
</div></section>

<section id="faq"><div class="wrap">
  <div class="section-head"><span class="eyebrow">FAQ</span><h2>Questions shop owners ask</h2></div>
  ${faqHtml(FAQ)}
</div></section>

<section id="demo" class="section-pastel section-pastel-mint"><div class="wrap">
  <div class="lead-box">
    <div id="leadFormWrap">
      <h2>Book your free demo</h2>
      <p class="sub">Tell us about your shop. We'll show you ChatCart Pro with your own kind of order. We reply on WhatsApp within one working day.</p>
      <form id="leadForm">
        <div class="field"><label for="lname">Your name</label><input id="lname" required autocomplete="name"></div>
        <div class="field"><label for="lbusiness">Business name</label><input id="lbusiness" required autocomplete="organization"></div>
        <div class="field"><label for="lstores">Number of stores</label><select id="lstores" required><option value="" disabled selected>Select</option><option>1</option><option>2-3</option><option>4-10</option><option>10+</option></select></div>
        <div class="field"><label for="lwhatsapp">WhatsApp number</label><input id="lwhatsapp" type="tel" required inputmode="tel" autocomplete="tel" placeholder="+971 5X XXX XXXX"></div>
        <div class="field"><label for="lpos">POS / billing system you use</label><input id="lpos" placeholder="e.g. GOFRUGAL, or not sure"></div>
        <div class="field"><label for="lemail">Email (optional)</label><input id="lemail" type="email" autocomplete="email"></div>
        <div class="field full lead-actions">
          <button type="submit" class="btn btn-primary" id="leadBtn">Book my free demo</button>
          <a href="${WA_URL}" class="btn btn-wa" target="_blank" rel="noopener" data-loc="form">Or chat on WhatsApp</a>
        </div>
        <p class="form-note full" id="leadErr" style="display:none;color:#b00020">Something went wrong. Please message us on WhatsApp instead: +971 54 737 8597.</p>
        <p class="form-note full">We use these details only to contact you about your demo. See our <a href="/privacy-policy/">Privacy Policy</a>.</p>
      </form>
    </div>
    <div class="lead-ok" id="leadOk"><h3>Thanks, we got your request.</h3><p>We'll message you on WhatsApp within one working day to set up your demo.</p></div>
  </div>
</div></section>`,
});

/* --------------------------------------------------------------- PRICING */
const PFAQ = [
  ['Is there a commission on orders?', 'No. We take no commission on any order and charge no per-order fee. Delivery apps typically take a percentage of every order; ChatCart Pro is a flat monthly price.'],
  ['What are WhatsApp (Meta) message fees?', 'Meta charges for some WhatsApp conversations. We pass these on at cost with no markup, and show them as a separate line on your invoice. <span class="ph">[confirm billing method and typical range]</span>'],
  ['What does the setup fee cover?', 'Connecting your WhatsApp number, phone line and shop system, setting up your menu or product list, and training your staff. It is paid once.'],
  ['Can I start with one store and add branches later?', 'Yes. Start on the single-store plan and add branches when you are ready. Multi-branch pricing is per additional branch.'],
  ['Is there a contract?', '<span class="ph">[confirm minimum term / cancellation terms]</span>'],
];
const pricing = page({
  path: '/pricing/',
  title: 'Pricing | Flat Monthly Price, Zero Commission | ChatCart Pro',
  desc: 'Simple pricing for WhatsApp and phone ordering in the UAE: flat monthly price per store, one-time setup, WhatsApp fees at cost, no order commission.',
  needsForm: true,
  schema: [orgSchema, crumb([['Home', '/'], ['Pricing', '/pricing/']]), faqSchema(PFAQ)],
  body: `
<section class="page-hero"><div class="wrap">
  <div class="breadcrumb"><a href="/">Home</a> / Pricing</div>
  <h1>One flat monthly price. No commission on any order.</h1>
  <p>Pay a simple monthly fee per store. Keep 100% of every order, unlike delivery apps that take a cut.</p>
  <div class="badge-row"><span class="badge">No commission</span><span class="badge">One-time setup fee</span><span class="badge">WhatsApp fees at cost</span></div>
</div></section>

<section class="tight"><div class="wrap">
  <div class="price-cards">
    <div class="plan featured">
      <h3>Single store</h3>
      <p style="margin:0;color:var(--navy-soft)">One supermarket, mini mart or restaurant.</p>
      <div class="amount"><span data-price="single"></span> <small>/ month</small></div>
      <ul>
        <li>AI ordering on WhatsApp</li>
        <li>Inbound voice ordering in 5 languages</li>
        <li>Live stock check with your shop system</li>
        <li>Order dashboard &amp; kitchen display</li>
        <li>Delivery rider management</li>
        <li>Call recordings &amp; transcripts</li>
        <li>Broadcasts to opted-in customers</li>
      </ul>
      <div class="setup">One-time setup: <strong data-price="setup"></strong></div>
      <a href="/#demo" class="btn btn-primary" data-demo-cta data-loc="pricing-single">Book a free demo</a>
    </div>
    <div class="plan">
      <h3>Multi-branch</h3>
      <p style="margin:0;color:var(--navy-soft)">Two or more branches under one business.</p>
      <div class="amount"><span data-price="branch"></span> <small>/ month per additional branch</small></div>
      <ul>
        <li>Everything in Single store</li>
        <li>All branches' orders and stock in one view</li>
        <li>One number or one per branch</li>
        <li>Chain-wide offers and reports</li>
      </ul>
      <div class="setup">Setup is quoted per branch group. <a href="${WA_URL}" target="_blank" rel="noopener" data-loc="pricing-chain">Ask us on WhatsApp</a>.</div>
      <a href="/#demo" class="btn btn-outline" data-demo-cta data-loc="pricing-chain">Talk to us about chains</a>
    </div>
  </div>
  <div class="price-notes">
    <p data-price-note></p>
    <p><strong>No commission on any order.</strong> You pay no per-order fee to us.</p>
    <p><strong>WhatsApp (Meta) message fees</strong> are billed at cost, with no markup.</p>
    <p><strong>Setup</strong> is a one-time fee. It covers connecting your number, phone line and shop system, and training your staff.</p>
    <p class="ph-block" style="font-size:13px"><span class="ph">[Included features and limits per plan: confirm before publishing.]</span> Prices are set in <code>public/js/pricing-config.js</code>.</p>
  </div>
</div></section>

<section id="faq" class="section-pastel section-pastel-mint"><div class="wrap">
  <div class="section-head"><h2>Pricing questions</h2></div>
  ${faqHtml(PFAQ)}
</div></section>

<section id="demo"><div class="wrap">
  <div class="lead-box">
    <div id="leadFormWrap">
      <h2>See it with your own orders</h2>
      <p class="sub">Book a free demo. We reply on WhatsApp within one working day.</p>
      <form id="leadForm">
        <div class="field"><label for="lname">Your name</label><input id="lname" required autocomplete="name"></div>
        <div class="field"><label for="lbusiness">Business name</label><input id="lbusiness" required autocomplete="organization"></div>
        <div class="field"><label for="lstores">Number of stores</label><select id="lstores" required><option value="" disabled selected>Select</option><option>1</option><option>2-3</option><option>4-10</option><option>10+</option></select></div>
        <div class="field"><label for="lwhatsapp">WhatsApp number</label><input id="lwhatsapp" type="tel" required inputmode="tel" autocomplete="tel" placeholder="+971 5X XXX XXXX"></div>
        <div class="field"><label for="lpos">POS / billing system you use</label><input id="lpos" placeholder="e.g. GOFRUGAL, or not sure"></div>
        <div class="field"><label for="lemail">Email (optional)</label><input id="lemail" type="email" autocomplete="email"></div>
        <div class="field full lead-actions"><button type="submit" class="btn btn-primary" id="leadBtn">Book my free demo</button><a href="${WA_URL}" class="btn btn-wa" target="_blank" rel="noopener" data-loc="pricing-form">Or chat on WhatsApp</a></div>
        <p class="form-note full" id="leadErr" style="display:none;color:#b00020">Something went wrong. Please message us on WhatsApp instead: +971 54 737 8597.</p>
        <p class="form-note full">We use these details only to contact you about your demo. See our <a href="/privacy-policy/">Privacy Policy</a>.</p>
      </form>
    </div>
    <div class="lead-ok" id="leadOk"><h3>Thanks, we got your request.</h3><p>We'll message you on WhatsApp within one working day.</p></div>
  </div>
</div></section>`,
});

/* ------------------------------------------------------- INDUSTRY PAGES */
function industry({ path, name, title, desc, h1, lead, pains, how, extra, faq }) {
  return page({
    path, title, desc, needsForm: false,
    schema: [orgSchema, crumb([['Home', '/'], [name, path]]), faqSchema(faq)],
    body: `
<section class="page-hero"><div class="wrap">
  <div class="breadcrumb"><a href="/">Home</a> / ${name}</div>
  <h1>${h1}</h1>
  <p>${lead}</p>
  <div class="hero-ctas" style="justify-content:center"><a href="/#demo" class="btn btn-primary" data-demo-cta data-loc="${path}">Book a free demo</a><a href="${WA_URL}" class="btn btn-wa" target="_blank" rel="noopener" data-loc="${path}">Chat with us on WhatsApp</a></div>
  <p class="trust-line" style="margin-top:14px"><span>No app for customers</span><span>Zero commission</span><span>Flat monthly price</span></p>
</div></section>
<section class="tight"><div class="wrap">
  <div class="section-head"><h2>What goes wrong today</h2></div>
  <div class="card-grid">${pains.map(([i, t, d]) => `<div class="pain"><span class="ico">${i}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
</div></section>
<section class="tight section-pastel section-pastel-mint"><div class="wrap">
  <div class="section-head"><h2>How ChatCart Pro handles it</h2></div>
  <div class="steps">${how.map(([t, d]) => `<div class="step"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
</div></section>
<section class="tight"><div class="wrap">
  <div class="section-head"><h2>${extra.title}</h2></div>
  <div class="card-grid c3">${extra.items.map(([t, d]) => `<div class="feat"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
</div></section>
<section class="tight"><div class="wrap"><div class="section-head"><h2>Questions</h2></div>${faqHtml(faq)}</div></section>
<section class="tight"><div class="wrap"><div class="cta-band"><h2>Never miss an order again</h2><p>Book a free demo and see it with your own kind of order.</p><a href="/#demo" class="btn btn-primary" data-demo-cta data-loc="${path}-band">Book a free demo</a></div></div></section>`,
  });
}

const groceryFaq = [
  ['Can customers send a long grocery list?', 'Yes. They can type it, send a voice note, or call. The AI reads the list, matches each item to your catalogue and asks about anything unclear, like brand or size.'],
  ['What if an item is out of stock?', 'The AI checks live stock in your shop\'s system. If something is out, it offers alternatives and the customer chooses. It never confirms an item you cannot supply.'],
  ['Does it work for Tamil and Malayalam customers?', 'Yes. Tamil, Hindi, Malayalam, Telugu and English, in chat and on calls.'],
];
const restFaq = [
  ['Does it replace delivery apps?', 'It gives your regular customers a direct way to order from you with no commission. You can keep delivery apps for new customers and send repeat customers to your own WhatsApp.'],
  ['Do orders go to my kitchen?', 'Yes. Confirmed orders appear on a kitchen display or the order dashboard, with items, notes and delivery or pickup details.'],
  ['Can it take orders by phone call?', 'Yes. It answers inbound calls to your restaurant number, takes the order and confirms it. It only answers calls customers make to you.'],
];
const chainFaq = [
  ['Can each branch have its own number?', 'Yes. You can use one number for the whole chain or one per branch. Orders go to the right branch.'],
  ['Do branches share stock?', 'Each branch\'s stock is checked from that branch\'s shop system, so the AI only confirms what that branch has.'],
  ['How is pricing for chains?', 'A per-branch monthly price after the first store, plus setup. See the <a href="/pricing/">pricing page</a>.'],
];

const industries = [
  industry({
    path: '/whatsapp-ai-for-grocery-stores/', name: 'Supermarkets & mini marts',
    title: 'AI WhatsApp Ordering for Supermarkets Dubai | ChatCart Pro',
    desc: 'Take grocery orders on WhatsApp and phone in Tamil, Hindi, Malayalam, Telugu and English. Live stock check, rider management, zero commission. Built in Dubai.',
    h1: 'WhatsApp ordering for supermarkets and mini marts',
    lead: 'Customers send their list in their own language. ChatCart Pro checks your stock, confirms the order, and sends it to your packing team.',
    pains: [['📵', 'Unanswered chats at rush hour', 'Lists pile up on the shop phone while staff serve the counter.'], ['📝', 'Items written down wrong', 'Voice notes and calls get mis-heard. Wrong brand, wrong size, missing items.'], ['📦', 'Selling what you do not have', 'Customers order items that sold out an hour ago.'], ['🛵', 'No delivery updates', 'Customers call to ask where their order is.']],
    how: [['List arrives', 'By chat, voice note or phone call, in Tamil, Hindi, Malayalam, Telugu or English.'], ['AI checks stock', 'It matches items to your catalogue and offers substitutes.'], ['Customer confirms', 'Items and total shown in the chat.'], ['Store packs and delivers', 'Order lands on your dashboard. Assign a rider and update the customer.']],
    extra: { title: 'Made for grocery', items: [['Substitutions', 'Out of Ponni rice? The customer picks another brand in the chat.'], ['Repeat orders', 'Regular customers reorder with a short message.'], ['Offers to opted-in customers', 'Send weekly offers only to people who agreed to receive them.']] },
    faq: groceryFaq,
  }),
  industry({
    path: '/whatsapp-ai-for-restaurants/', name: 'Restaurants & cafeterias',
    title: 'Restaurant WhatsApp Order Bot UAE | ChatCart Pro',
    desc: 'AI takes restaurant orders on WhatsApp and phone calls in Tamil, Hindi, Malayalam, Telugu and English and sends them to your kitchen. No delivery-app commission.',
    h1: 'WhatsApp and phone orders, straight to your kitchen',
    lead: 'Your regular customers order from you directly. ChatCart Pro takes the order, confirms it, and shows it on your kitchen screen.',
    pains: [['📵', 'Phone rings off the hook', 'Lunch rush means missed calls and lost orders.'], ['📝', 'Orders written wrong', 'Spice level, no-onion, extra gravy: details get lost.'], ['💸', 'Delivery app commission', 'Every app order costs you a slice of the bill.'], ['⏱️', 'Slow updates', 'Customers keep calling for status.']],
    how: [['Customer orders', 'By WhatsApp chat or phone, in their own language.'], ['AI takes the order', 'Items, notes and delivery or pickup, read back for confirmation.'], ['Kitchen sees it', 'Order shows on the kitchen display straight away.'], ['Delivery tracked', 'Assign a rider and keep the customer updated.']],
    extra: { title: 'Made for restaurants', items: [['Menu with notes', 'Handles "less spicy", "no onion" and combos.'], ['Voice ordering', 'Answers inbound calls to your restaurant number.'], ['No commission', 'Flat monthly price, you keep every dirham of each order.']] },
    faq: restFaq,
  }),
  industry({
    path: '/whatsapp-ordering-for-grocery-chains/', name: 'Multi-branch chains',
    title: 'WhatsApp Ordering for Multi-Branch Stores UAE | ChatCart Pro',
    desc: 'One ordering system for every branch: WhatsApp and phone orders, live stock per branch, one dashboard. Flat price per branch, zero commission.',
    h1: 'One ordering system for every branch',
    lead: 'Run WhatsApp and phone ordering for all your stores from one place, with each branch\'s own stock and kitchen or packing screen.',
    pains: [['🏬', 'Every branch does it differently', 'Some use WhatsApp, some phone, some nothing. No single view.'], ['📦', 'Stock differs by branch', 'Customers are promised items a branch does not have.'], ['📊', 'No overview', 'Owners cannot see orders, missed chats or delivery times across branches.'], ['👥', 'Hard to train staff', 'Each branch has its own habits.']],
    how: [['Pick numbers', 'One number for the chain or one per branch.'], ['Connect each branch', 'Each branch\'s shop system is linked for live stock.'], ['Orders route correctly', 'Each order goes to the right branch\'s screen.'], ['Owner sees everything', 'One dashboard across all branches.']],
    extra: { title: 'Made for chains', items: [['Per-branch pricing', 'A flat monthly price for each additional branch.'], ['Chain-wide offers', 'Send offers to opted-in customers across branches.'], ['Same setup everywhere', 'One onboarding, one way of working.']] },
    faq: chainFaq,
  }),
];

/* ----------------------------------------------------------------- LEGAL */
const legalWrap = (path, title, desc, inner) => page({
  path, title, desc, needsForm: false,
  schema: [crumb([['Home', '/'], [title.split(' |')[0], path]])],
  body: `<section class="page-hero"><div class="wrap"><h1>${title.split(' |')[0]}</h1><p>Last updated: 25 November 2026</p></div></section>
<section class="legal"><div class="wrap-narrow">
<p class="notice"><strong>Draft for legal review.</strong> Text in <span class="ph">[yellow brackets]</span> must be completed by Nexsofture Tech FZ LLC, and a UAE lawyer should review this page before launch.</p>
${inner}
</div></section>`,
});

const privacy = legalWrap('/privacy-policy/', 'Privacy Policy | ChatCart Pro', 'How ChatCart Pro handles WhatsApp and phone data, call recordings and personal data under UAE data protection law (PDPL).', `
<h2>1. Who we are</h2>
<p>ChatCart Pro is operated by Nexsofture Tech FZ LLC, Dubai, UAE (<span class="ph">[trade licence no.]</span>, <span class="ph">[address]</span>). Contact: chatcartpro@gmail.com, WhatsApp +971 54 737 8597.</p>
<h2>2. Two roles: your customers' data and your own</h2>
<p><strong>Business customers (shops and restaurants).</strong> For the personal data of your own customers that passes through ChatCart Pro (names, phone numbers, order contents, chat messages, call audio), you decide why it is collected. We process it on your behalf to run your ordering, as your processor, under your instructions.</p>
<p><strong>Website visitors and prospects.</strong> For data you give us on this website (demo form, WhatsApp messages to us), we are the controller.</p>
<h2>3. What we collect</h2>
<div class="tbl"><table><tr><th>Data</th><th>Why</th></tr>
<tr><td>Demo form: name, business name, number of stores, WhatsApp number, POS used, email (optional)</td><td>To contact you and prepare your demo</td></tr>
<tr><td>WhatsApp messages and phone number of people who message a business using ChatCart Pro</td><td>To take and confirm orders for that business</td></tr>
<tr><td>Call audio and transcripts of calls to a business using ChatCart Pro</td><td>To take orders, and so the business can check what was ordered</td></tr>
<tr><td>Order details, delivery address, rider and delivery status</td><td>To fulfil and deliver the order</td></tr>
<tr><td>Website analytics (Google Analytics 4, Meta Pixel)</td><td>To measure visits, WhatsApp clicks and demo requests</td></tr></table></div>
<h2>4. AI assistant and notice</h2>
<p>Customers speaking to a ChatCart Pro-powered business are talking to an AI ordering assistant. It introduces itself as an AI. Staff can take over a conversation at any time.</p>
<h2>5. Call recordings</h2>
<p>Calls to a business using ChatCart Pro voice ordering are recorded and transcribed. Callers hear a notice at the start of the call. Businesses must not disable this notice. Recordings are kept for <span class="ph">[retention period]</span> and then deleted unless the business asks us to keep them longer.</p>
<h2>6. WhatsApp and broadcasts</h2>
<p>We use the WhatsApp Business Platform (Cloud API) provided by Meta. Messages pass through Meta's systems under Meta's own terms. Broadcast and offer messages are sent only to people who opted in, and they can opt out at any time by replying STOP. We follow the WhatsApp Business Messaging Policy.</p>
<h2>7. UAE data protection (PDPL) and other laws</h2>
<p>We handle personal data in line with the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL). Where a business serves customers in India, we also respect applicable Indian data protection law. We process data only for the purposes above, keep it only as long as needed, and do not sell it.</p>
<h2>8. Your rights</h2>
<p>You can ask to access, correct, delete or restrict your personal data, or object to its processing, subject to law. If you are a customer of a business using ChatCart Pro, please contact that business first; we will help them respond. Contact us at chatcartpro@gmail.com.</p>
<h2>9. Who else sees data (sub-processors)</h2>
<p>Meta (WhatsApp Business Platform), <span class="ph">[cloud hosting provider and region]</span>, <span class="ph">[telephony provider]</span>, <span class="ph">[AI model provider]</span>, EmailJS (demo form notifications), Google (Analytics), Meta (Pixel). Data may be transferred outside the UAE with appropriate safeguards.</p>
<h2>10. Security</h2>
<p>We use encryption in transit, access controls and logging. <span class="ph">[Confirm encryption at rest, backups, access policy.]</span> No system is perfectly secure; we will tell affected businesses without undue delay if there is a breach.</p>
<h2>11. Cookies and analytics</h2>
<p>We use Google Analytics 4 and (when enabled) Meta Pixel to count visits, WhatsApp clicks and demo requests. <span class="ph">[Add a cookie consent banner before enabling the Meta Pixel.]</span></p>
<h2>12. Changes</h2>
<p>We will post changes here and update the date above.</p>`);

const terms = legalWrap('/terms-and-conditions/', 'Terms & Conditions | ChatCart Pro', 'Terms for using ChatCart Pro: AI ordering on WhatsApp and phone, fees, customer responsibilities and WhatsApp messaging rules.', `
<h2>1. The service</h2>
<p>ChatCart Pro, provided by Nexsofture Tech FZ LLC, is an AI ordering assistant that takes orders from your customers on your WhatsApp number and phone line, checks stock in your shop system, and sends orders to your dashboard or kitchen display, with delivery rider management.</p>
<h2>2. AI assistant</h2>
<p>The assistant is an AI. It can make mistakes, so order summaries are shown to the customer for confirmation. You must not present it as a human, and you must not remove its AI introduction or the call-recording notice. Your staff remain responsible for fulfilling orders correctly.</p>
<h2>3. Inbound only</h2>
<p>Voice ordering is for inbound calls that customers make to you. You must not use ChatCart Pro for unsolicited outbound sales or cold calls.</p>
<h2>4. Fees</h2>
<ul><li>Flat monthly fee per store, and a one-time setup fee, as shown on the pricing page or in your quote.</li><li>No commission and no per-order fee from us.</li><li>WhatsApp (Meta) message charges are billed at cost, with no markup.</li><li><span class="ph">[Invoicing, payment terms, VAT, minimum term and cancellation.]</span></li></ul>
<h2>5. Your responsibilities</h2>
<ul><li>You own your WhatsApp Business account and phone number, and must comply with Meta's WhatsApp Business Terms and Messaging Policy.</li><li>Send broadcasts and offers only to customers who opted in, and honour opt-outs.</li><li>Tell callers that calls are recorded, and keep the notice on.</li><li>Keep your catalogue, prices and stock data accurate, and use the service lawfully.</li></ul>
<h2>6. Data</h2>
<p>You keep ownership of your customer and order data. We process it for you as described in our <a href="/privacy-policy/">Privacy Policy</a>, including under UAE PDPL.</p>
<h2>7. Availability</h2>
<p>We work to keep the service available but do not promise uninterrupted service. It depends on Meta, telephony and your shop system. <span class="ph">[Add any uptime commitment and support hours.]</span></p>
<h2>8. Ending the service</h2>
<p>Either party may end the service as set out in your agreement. <span class="ph">[Notice period and data export on exit.]</span></p>
<h2>9. Liability</h2>
<p>To the extent allowed by law, we are not liable for indirect or lost-profit losses, and our total liability is limited to the fees you paid in the previous <span class="ph">[3 / 12]</span> months. <span class="ph">[Counsel to confirm.]</span></p>
<h2>10. Governing law</h2>
<p><span class="ph">[Governing law and courts – e.g. UAE / Dubai – to be confirmed by counsel.]</span></p>
<h2>11. Contact</h2>
<p>chatcartpro@gmail.com, WhatsApp +971 54 737 8597.</p>`);

/* ----------------------------------------------------------------- WRITE */
const files = { '/': home, '/pricing/': pricing, '/privacy-policy/': privacy, '/terms-and-conditions/': terms };
for (const i of industries) files[i.match(/<link rel="canonical" href="https:\/\/chatcartpro\.com([^"]+)"/)[1]] = i;
for (const [p, html] of Object.entries(files)) {
  const f = join(OUT, p === '/' ? 'index.html' : p.slice(1) + 'index.html');
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, html);
  console.log('wrote', p, html.length);
}
