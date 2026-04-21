// ── CANVAS BACKGROUND: animated star-chart / data-points ──
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes, lines;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function init() {
    resize();
    nodes = Array.from({length: 70}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: randBetween(-.15, .15),
      vy: randBetween(-.1, .1),
      r: randBetween(1, 2.5),
      opacity: randBetween(.3, .9),
      color: Math.random() > .7 ? '#1fe0c4' : Math.random() > .5 ? '#38b6e8' : '#f0a832'
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(56,182,232,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 80) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Draw connecting lines between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.strokeStyle = `rgba(31,224,196,${(1 - dist / 160) * 0.12})`;
          ctx.lineWidth = .7;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color.replace(')', `,${n.opacity})`).replace('rgb', 'rgba').replace('#', 'rgba(').replace('rgba(1fe0c4', 'rgba(31,224,196').replace('rgba(38b6e8', 'rgba(56,182,232').replace('rgba(f0a832', 'rgba(240,168,50');
      
      // simpler approach
      const hex = n.color;
      let r2 = 31, g = 224, b = 196;
      if (hex === '#38b6e8') { r2 = 56; g = 182; b = 232; }
      if (hex === '#f0a832') { r2 = 240; g = 168; b = 50; }
      ctx.fillStyle = `rgba(${r2},${g},${b},${n.opacity})`;
      ctx.fill();

      // Move node
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();

// ── SCROLL REVEAL ──
(function() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i * 0.06) + 's';
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

// ── TESTIMONIAL ROTATOR ──
(function() {
  const testimonials = [
    { text: '"Datanautics transformed how we think about data. They didn\'t just build a dashboard — they helped us build a data culture."', author: '— Head of Analytics, Leading South African Retailer' },
    { text: '"The team\'s ability to translate complex data concepts into clear business value made all the difference for our executive team."', author: '— CFO, JSE-Listed Financial Services Group' },
    { text: '"From strategy to delivery, Datanautics were true partners. Their Africa-first perspective set them apart from global consultancies."', author: '— Chief Data Officer, Telecoms Provider' },
  ];
  const textEl = document.getElementById('testimonial-text');
  const authorEl = document.getElementById('testimonial-author');
  const dots = document.querySelectorAll('.t-dot');
  let current = 0;

  function setTestimonial(idx) {
    textEl.style.opacity = '0';
    authorEl.style.opacity = '0';
    setTimeout(() => {
      textEl.textContent = testimonials[idx].text;
      authorEl.textContent = testimonials[idx].author;
      textEl.style.opacity = '1';
      authorEl.style.opacity = '1';
    }, 300);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    current = idx;
  }

  textEl.style.transition = authorEl.style.transition = 'opacity .3s ease';

  dots.forEach(dot => dot.addEventListener('click', () => setTestimonial(+dot.dataset.idx)));

  setInterval(() => setTestimonial((current + 1) % testimonials.length), 5000);
})();

// ── NAV SCROLL EFFECT ──
window.addEventListener('scroll', () => {
  document.querySelector('nav').style.background = 
    window.scrollY > 50 ? 'rgba(6,13,24,.95)' : 'rgba(6,13,24,.72)';
});
