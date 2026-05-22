# Turm — Site Institucional

Site da Turm, agência de Growth com IA. HTML/CSS/JS estático.

## Stack

- HTML5 semântico
- CSS3 (design tokens, sem build step)
- Vanilla JS + GSAP/ScrollTrigger + Lenis (smooth scroll) + three.js (globo de partículas)

## Estrutura

```
.
├── index.html
├── robots.txt
├── sitemap.xml
├── css/styles.css
├── js/
│   ├── app.js          # interações, scroll, formulário, LGPD
│   ├── globe.js        # globo de partículas (three.js)
│   └── vendor/three.min.js
└── assets/
    ├── img/            # logo PNG e SVG
    └── video/          # logo animado WebM
```

## Deploy

Hospedado via [Vercel](https://vercel.com) integrado a este repositório.
Domínio: <https://turm.com.br>

Não há build step — qualquer push em `main` dispara deploy automático.

## Desenvolvimento local

Abra `index.html` em qualquer servidor estático local:

```bash
python -m http.server 8080
# ou
npx serve .
```

Acesse <http://localhost:8080>.
