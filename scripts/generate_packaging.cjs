const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/assets/products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function drawPouch(ctx, x, y, width, height, fruit) {
  ctx.save();
  
  // Pouch shadow
  ctx.shadowColor = 'rgba(25, 45, 30, 0.22)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 14;

  // Kraft pouch body background with subtle gradient
  const grad = ctx.createLinearGradient(x, y, x + width, y + height);
  grad.addColorStop(0, '#E9DEC7');
  grad.addColorStop(0.5, '#E2D3B7');
  grad.addColorStop(1, '#D8C5A2');

  ctx.fillStyle = grad;
  ctx.beginPath();
  // Standup pouch shape with tapered top and sealed edges
  const r = 10;
  ctx.moveTo(x + 12, y);
  ctx.lineTo(x + width - 12, y);
  ctx.quadraticCurveTo(x + width - 4, y + 40, x + width - 2, y + height - r);
  ctx.quadraticCurveTo(x + width - 2, y + height, x + width - r - 6, y + height);
  ctx.lineTo(x + r + 6, y + height);
  ctx.quadraticCurveTo(x + 2, y + height, x + 2, y + height - r);
  ctx.quadraticCurveTo(x + 4, y + 40, x + 12, y);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // Pouch top heat seal line
  ctx.strokeStyle = '#BCA985';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 18);
  ctx.lineTo(x + width - 12, y + 18);
  ctx.stroke();

  // Subtle vertical kraft texture lines
  ctx.fillStyle = 'rgba(180, 150, 110, 0.08)';
  for (let i = x + 15; i < x + width - 15; i += 8) {
    ctx.fillRect(i, y + 25, 2, height - 35);
  }

  // Brand header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1A3626'; // Dark forest green
  ctx.font = 'bold 22px serif';
  ctx.fillText('ZESTORA', x + width / 2, y + 55);

  ctx.font = '500 9px sans-serif';
  ctx.fillStyle = '#C5A869';
  ctx.letterSpacing = '2px';
  ctx.fillText("NATURE'S CRUNCH", x + width / 2, y + 70);

  // Divider line
  ctx.strokeStyle = '#D1C0A0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 40, y + 80);
  ctx.lineTo(x + width - 40, y + 80);
  ctx.stroke();

  // Product Name
  ctx.fillStyle = '#1A3626';
  ctx.font = 'bold 16px serif';
  ctx.fillText(fruit.name.toUpperCase(), x + width / 2, y + 105);

  // Subtitle
  ctx.font = 'italic 11px serif';
  ctx.fillStyle = '#6E5D42';
  ctx.fillText(fruit.tagline, x + width / 2, y + 122);

  // Fruit Illustration / Badge Window
  ctx.save();
  const winY = y + 140;
  const winW = width - 70;
  const winH = 95;
  ctx.fillStyle = fruit.windowBg || '#FFF8EB';
  ctx.strokeStyle = '#D9C8A8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x + 35, winY, winW, winH, 8);
  ctx.fill();
  ctx.stroke();

  // Draw fruit motif inside window
  fruit.drawMotif(ctx, x + width / 2, winY + winH / 2);
  ctx.restore();

  // 3 Circular benefit badges near bottom
  const badgeY = y + 265;
  const badges = fruit.badges || ['100% NATURAL', 'RICH IN FIBER', 'NO ADDED SUGAR'];
  const badgeSpacing = (width - 40) / 3;
  badges.forEach((b, idx) => {
    const bx = x + 20 + badgeSpacing * idx + badgeSpacing / 2;
    ctx.beginPath();
    ctx.arc(bx, badgeY, 13, 0, Math.PI * 2);
    ctx.strokeStyle = '#1A3626';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Check or leaf icon
    ctx.fillStyle = '#1A3626';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('✓', bx, badgeY + 3);

    ctx.font = 'bold 6.5px sans-serif';
    ctx.fillStyle = '#443826';
    const words = b.split(' ');
    if (words.length >= 2) {
      ctx.fillText(words[0], bx, badgeY + 22);
      ctx.fillText(words.slice(1).join(' '), bx, badgeY + 30);
    } else {
      ctx.fillText(b, bx, badgeY + 24);
    }
  });

  // Net Weight
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = '#1A3626';
  ctx.fillText('NET WT. 40g', x + width / 2, y + height - 20);

  // Veg Symbol on top right
  const vegX = x + width - 35;
  const vegY = y + 38;
  ctx.strokeStyle = '#1E7E34';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(vegX, vegY, 13, 13);
  ctx.fillStyle = '#1E7E34';
  ctx.beginPath();
  ctx.arc(vegX + 6.5, vegY + 6.5, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Generate the 4 primary product compositions
const fruits = [
  {
    slug: 'dried-mango',
    name: 'Dried Mango',
    tagline: 'A Taste of Sunshine.',
    accent: '#E69A38',
    windowBg: '#FEF6E4',
    badges: ['100% NATURAL', 'VITAMIN A', 'NO ADDED SUGAR'],
    drawMotif: (ctx, cx, cy) => {
      // Golden mango slices
      ctx.fillStyle = '#FF9D1C';
      ctx.beginPath();
      ctx.ellipse(cx - 15, cy, 32, 14, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFAE3D';
      ctx.beginPath();
      ctx.ellipse(cx + 10, cy + 4, 30, 13, 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E67E00';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 8, 25, 10, -0.1, 0, Math.PI * 2);
      ctx.fill();
    },
    drawSurroundings: (ctx, w, h) => {
      // Slices around pouch on table
      ctx.fillStyle = '#E89218';
      ctx.beginPath();
      ctx.ellipse(w * 0.2, h * 0.88, 55, 18, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F5A623';
      ctx.beginPath();
      ctx.ellipse(w * 0.25, h * 0.85, 45, 15, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E88B12';
      ctx.beginPath();
      ctx.ellipse(w * 0.8, h * 0.88, 50, 16, 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F59E18';
      ctx.beginPath();
      ctx.ellipse(w * 0.74, h * 0.84, 40, 14, -0.15, 0, Math.PI * 2);
      ctx.fill();
      // Fresh mango half on left
      ctx.fillStyle = '#FFB830';
      ctx.beginPath();
      ctx.ellipse(w * 0.12, h * 0.82, 38, 26, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#D96E14';
      ctx.beginPath();
      ctx.ellipse(w * 0.12, h * 0.82, 34, 22, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    slug: 'dried-pineapple',
    name: 'Dried Pineapple',
    tagline: 'Tropical Goodness.',
    accent: '#E2B338',
    windowBg: '#FEF8E6',
    badges: ['100% NATURAL', 'RICH IN FIBER', 'NO SULPHUR'],
    drawMotif: (ctx, cx, cy) => {
      // Golden pineapple ring
      ctx.fillStyle = '#E2B338';
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FEF8E6';
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.fill();
    },
    drawSurroundings: (ctx, w, h) => {
      // Pineapple rings on table
      ctx.fillStyle = '#DBA828';
      ctx.beginPath();
      ctx.arc(w * 0.22, h * 0.86, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F5EBE1';
      ctx.beginPath();
      ctx.arc(w * 0.22, h * 0.86, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#E6B836';
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.87, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F5EBE1';
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.87, 17, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    slug: 'dried-guava',
    name: 'Dried Guava',
    tagline: 'Tangy. Crunchy. Naturally Yours.',
    accent: '#D26466',
    windowBg: '#FDF0EE',
    badges: ['100% NATURAL', 'PINK GUAVA', 'SALTED CRUNCH'],
    drawMotif: (ctx, cx, cy) => {
      // Pink guava slice
      ctx.fillStyle = '#3F7A44'; // Green rind
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = '#E86F7A'; // Pink flesh
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI);
      ctx.fill();
    },
    drawSurroundings: (ctx, w, h) => {
      // Pink guava wedges
      ctx.fillStyle = '#E86F7A';
      ctx.beginPath();
      ctx.ellipse(w * 0.22, h * 0.86, 48, 20, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3A7040';
      ctx.beginPath();
      ctx.ellipse(w * 0.16, h * 0.83, 36, 16, 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#E86F7A';
      ctx.beginPath();
      ctx.ellipse(w * 0.78, h * 0.86, 46, 18, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    slug: 'dried-banana',
    name: 'Dried Banana Chips',
    tagline: 'Naturally Sweet. Always a Classic.',
    accent: '#DFB448',
    windowBg: '#FEF8EA',
    badges: ['100% NATURAL', 'NON FRIED', 'POTASSIUM'],
    drawMotif: (ctx, cx, cy) => {
      // Golden round chips
      for (let i = -1; i <= 1; i++) {
        ctx.fillStyle = '#E5B840';
        ctx.beginPath();
        ctx.arc(cx + i * 20, cy + i * 4, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FAF0D2';
        ctx.beginPath();
        ctx.arc(cx + i * 20, cy + i * 4, 15, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    drawSurroundings: (ctx, w, h) => {
      // Crisp chips
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = '#DEAC32';
        ctx.beginPath();
        ctx.arc(w * 0.16 + i * 16, h * 0.86 + (i % 2) * 8, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#DEAC32';
        ctx.beginPath();
        ctx.arc(w * 0.72 + i * 14, h * 0.86 - (i % 2) * 6, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
];

// Generate 800x800 product photo compositions for each fruit
fruits.forEach((fruit) => {
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext('2d');

  // Background: Warm off-white studio tabletop
  const bgGrad = ctx.createRadialGradient(400, 350, 80, 400, 400, 500);
  bgGrad.addColorStop(0, '#FFFFFF');
  bgGrad.addColorStop(0.6, '#F8F3EA');
  bgGrad.addColorStop(1, '#EDE2CE');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 800);

  // Soft wooden tabletop line in lower third
  const tableGrad = ctx.createLinearGradient(0, 540, 0, 800);
  tableGrad.addColorStop(0, '#EFE5D3');
  tableGrad.addColorStop(0.1, '#E5D6BF');
  tableGrad.addColorStop(1, '#D9C7AC');
  ctx.fillStyle = tableGrad;
  ctx.fillRect(0, 540, 800, 260);

  // Table shadow edge
  ctx.strokeStyle = 'rgba(180, 150, 110, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 540);
  ctx.lineTo(800, 540);
  ctx.stroke();

  // Draw real fruit surroundings
  fruit.drawSurroundings(ctx, 800, 800);

  // Draw Pouch standing center
  drawPouch(ctx, 275, 110, 250, 520, fruit);

  // Save to public/assets/products/[slug].png
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outDir, `${fruit.slug}.png`), buffer);
  console.log(`Generated: ${fruit.slug}.png`);
});

// Generate Hero Banner background for each fruit
fruits.forEach((f) => {
  const heroCanvas = createCanvas(1400, 750);
  const hctx = heroCanvas.getContext('2d');
  
  // Dark moody rustic background with warm ambient light
  const hGrad = hctx.createLinearGradient(0, 0, 1400, 750);
  hGrad.addColorStop(0, '#121F17');
  hGrad.addColorStop(0.4, '#1A2F23');
  hGrad.addColorStop(0.7, '#243D2E');
  hGrad.addColorStop(1, '#15251C');
  hctx.fillStyle = hGrad;
  hctx.fillRect(0, 0, 1400, 750);

  // Warm light glow on right where product sits
  const glow = hctx.createRadialGradient(1050, 380, 50, 1050, 380, 500);
  glow.addColorStop(0, 'rgba(230, 160, 60, 0.28)');
  glow.addColorStop(0.5, 'rgba(180, 120, 40, 0.12)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  hctx.fillStyle = glow;
  hctx.fillRect(500, 0, 900, 750);

  // Wooden surface at bottom of hero
  const hTable = hctx.createLinearGradient(0, 520, 0, 750);
  hTable.addColorStop(0, '#2D2115');
  hTable.addColorStop(1, '#1A120B');
  hctx.fillStyle = hTable;
  hctx.fillRect(0, 520, 1400, 230);

  // Standup pouch on hero right side
  f.drawSurroundings(hctx, 1400, 750);
  drawPouch(hctx, 920, 110, 260, 530, f);

  fs.writeFileSync(path.join(outDir, `hero-${f.slug}.png`), heroCanvas.toBuffer('image/png'));
  console.log(`Generated: hero-${f.slug}.png`);
});

