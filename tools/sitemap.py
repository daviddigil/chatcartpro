"""Regenerate public/sitemap.xml from the indexable pages on disk.
Run from repo root:  python tools/sitemap.py
Excludes pages marked noindex, /demo-dashboard/ and /investors/."""
import glob, os, re, subprocess

PUB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
os.chdir(PUB)
BS = chr(92)  # backslash

prev = subprocess.run(['git', 'show', 'HEAD:public/sitemap.xml'], capture_output=True, text=True, encoding='utf-8').stdout
lm = dict(re.findall(r'<loc>https://chatcartpro.com(/[^<]*)</loc>\s*<lastmod>([^<]*)</lastmod>', prev))

NEW = ['/', '/pricing/', '/whatsapp-ai-for-grocery-stores/', '/whatsapp-ai-for-restaurants/',
       '/whatsapp-ordering-for-grocery-chains/', '/privacy-policy/', '/terms-and-conditions/']
urls = []
for f in sorted(glob.glob('**/index.html', recursive=True)):
    f = f.replace(BS, '/')
    p = '/' + f[:-len('index.html')] if f != 'index.html' else '/'
    h = open(f, encoding='utf-8').read()
    if 'noindex' in h[:6000] or p.startswith('/demo-dashboard') or p.startswith('/investors'):
        continue
    urls.append(p)
urls.sort(key=lambda u: (0, NEW.index(u)) if u in NEW else (1, u))

out = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for u in urls:
    d = '2026-11-25' if u in NEW else lm.get(u, '2026-08-07')
    pr = '1.0' if u == '/' else '0.9' if u in NEW[1:5] else '0.6'
    out += f'  <url>\n    <loc>https://chatcartpro.com{u}</loc>\n    <lastmod>{d}</lastmod>\n    <priority>{pr}</priority>\n  </url>\n'
out += '</urlset>\n'
open('sitemap.xml', 'w', encoding='utf-8', newline='\n').write(out)
print(len(urls), 'urls')
