/* Inline SVG diagrams used by `diagram` activities (ACTIVITIES.<day>.<part> = [{ type: 'diagram', svg: '<key>', title, caption }]).
 * Each has a <title> and <desc> for screen readers. Colors come from the site's CSS variables. */
const DIAGRAMS = (() => {
  const G = 'var(--green-dark,#1a3a2a)', M = 'var(--green-mid,#2d5a3d)', GO = 'var(--gold,#d4a843)', OR = 'var(--orange,#c4522a)', GR = 'var(--gray-200,#e8e5de)', TX = 'var(--gray-800,#2c2820)', SUB = 'var(--gray-600,#6b6558)';
  const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 13}" font-weight="${o.w || 400}" fill="${o.c || TX}" text-anchor="${o.a || 'middle'}" font-family="DM Sans,sans-serif">${e(s)}</text>`;
  const r = (x, y, w, h, fill, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${fill}" stroke="${o.stroke || 'none'}" stroke-width="${o.sw || 1.5}"/>`;
  const svg = (vb, title, desc, inner) => `<svg viewBox="${vb}" role="img" aria-labelledby="t d" xmlns="http://www.w3.org/2000/svg"><title id="t">${e(title)}</title><desc id="d">${e(desc)}</desc>${inner}</svg>`;

  const workstation = svg('0 0 640 380', 'Professional workstation, seen from above',
    'A counter with the cutting board centered in front of the cook, a waste bowl at the top right of the board, a damp towel on the left, labeled mise en place containers staged in order of use, a closed knife roll and a sanitizer bucket.',
    r(10, 10, 620, 360, '#f7f7f5', { stroke: GR, rx: 14 }) +
    r(215, 110, 210, 150, '#ffffff', { stroke: G, sw: 2.5 }) + t(320, 190, 'CUTTING BOARD', { w: 700, c: G }) + t(320, 208, 'centered, squared to the edge', { s: 11, c: SUB }) +
    `<circle cx="480" cy="150" r="34" fill="${GR}" stroke="${M}" stroke-width="2"/>` + t(480, 146, 'Waste', { s: 12, w: 600 }) + t(480, 162, 'bowl', { s: 12, w: 600 }) + t(480, 198, 'top right of board', { s: 10.5, c: SUB }) +
    r(70, 120, 100, 130, '#dfe9f3', { stroke: M }) + t(120, 180, 'Damp towel', { w: 600 }) + t(120, 198, 'LEFT side', { s: 11, c: SUB }) + t(120, 214, 'never shared', { s: 11, c: SUB }) +
    [0, 1, 2, 3].map(i => r(150 + i * 82, 28, 70, 44, '#ffffff', { stroke: GO, sw: 2 }) + t(185 + i * 82, 48, String(i + 1), { w: 700, c: G }) + t(185 + i * 82, 63, 'name·date·use-by', { s: 8.5, c: SUB })).join('') +
    t(300, 92, 'Containers staged in order of use (not alphabetical)', { s: 11, c: SUB }) +
    r(470, 225, 120, 52, '#ecdcc2', { stroke: M }) + t(530, 248, 'Knife roll', { w: 600 }) + t(530, 265, 'closed, off the floor', { s: 10.5, c: SUB }) +
    r(470, 290, 120, 56, '#eef4ea', { stroke: M }) + t(530, 314, 'Sanitizer bucket', { w: 600 }) + t(530, 332, 'tested with strips', { s: 10.5, c: SUB }) +
    `<path d="M320 350 l-18 -16 h36 z" fill="${G}"/>` + t(320, 368, 'YOU', { w: 700, c: G }));

  const swatch = (x, c, name, use, dark = false) => r(x, 40, 112, 70, c, { stroke: GR }) + t(x + 56, 80, name, { w: 700, c: dark ? '#fff' : TX }) + t(x + 56, 134, use, { s: 11.5 });
  const boards = svg('0 0 620 170', 'Color-coded cutting boards',
    'Red is raw proteins, yellow is poultry, green is produce, white is ready-to-eat foods, and blue is seafood.',
    swatch(10, '#c0392b', 'RED', 'raw proteins', true) + swatch(131, '#f1c40f', 'YELLOW', 'poultry') + swatch(252, '#4c9a5b', 'GREEN', 'produce', true) + swatch(373, '#ffffff', 'WHITE', 'ready-to-eat') + swatch(494, '#2e6da4', 'BLUE', 'seafood', true) +
    t(310, 160, 'One color per job keeps raw food away from ready-to-eat food. Sanitize between tasks, not just between proteins.', { s: 11, c: SUB }));

  const S = 80; // px per inch
  const cuts = svg('0 0 640 250', 'Classic knife cuts to scale',
    'Squares drawn to scale: large dice three quarters of an inch, medium dice half an inch, small dice a quarter inch, fine brunoise an eighth of an inch. A julienne is an eighth of an inch by an eighth by two to two and a half inches.',
    [['Large dice', '¾ in', 0.75, 30], ['Medium dice', '½ in', 0.5, 150], ['Small dice', '¼ in', 0.25, 250], ['Fine brunoise', '⅛ in', 0.125, 330]].map(([n, d, inch, x]) => r(x, 130 - inch * S, inch * S, inch * S, GO, { stroke: G, rx: 2, sw: 1.5 }) + t(x + inch * S / 2, 150, n, { s: 11.5, w: 600 }) + t(x + inch * S / 2, 166, d + ' cube', { s: 11, c: SUB })).join('') +
    r(420, 126, 190, 3, G, { rx: 1 }) + r(420, 123, 190, 10, GO, { rx: 2, stroke: G }) + t(515, 150, 'Julienne', { s: 11.5, w: 600 }) + t(515, 166, '⅛ × ⅛ × 2–2½ in', { s: 11, c: SUB }) +
    t(320, 205, 'Chiffonade: roll leaves and slice into thin ribbons.   Oblique: angled, irregular pieces with equal surface area.', { s: 11, c: SUB }) + t(320, 228, 'Uniform size means even cooking and a consistent plate.', { s: 11, c: SUB }));

  const shelf = (y, n, w, temp, c, dark) => r(30, y, w, 44, c, { stroke: GR }) + t(30 + w / 2, y + 27, n, { w: 700, c: dark ? '#fff' : TX, s: 13 }) + t(520, y + 27, temp, { s: 12, c: SUB });
  const cooler = svg('0 0 620 312', 'Walk-in cooler storage order',
    'From top to bottom: ready-to-eat foods, whole fish, whole beef and pork, ground meat and ground fish, and whole and ground poultry. Minimum cooking temperatures increase going down the shelves.',
    r(10, 22, 600, 232, '#f7f7f5', { stroke: M, sw: 2.5, rx: 12 }) +
    shelf(32, '1 TOP  Ready-to-eat foods', 400, 'no cooking needed', '#d9ecd6') + shelf(78, '2  Whole fish', 400, 'cook to 145°F', '#e5eef6') + shelf(124, '3  Whole beef and pork', 400, 'cook to 145°F', '#f0d9d3') + shelf(170, '4  Ground meat and ground fish', 400, 'cook to 155°F', '#e8c4bb') + shelf(216, '5 BOTTOM  Whole and ground poultry', 400, 'cook to 165°F', '#c0392b', true) +
    t(525, 16, 'min. cook temp', { s: 10.5, c: SUB }) + t(310, 284, 'Lowest cook temperature on top: raw juices never drip', { s: 11, c: SUB }) + t(310, 299, 'onto food that will not be cooked again.', { s: 11, c: SUB }));

  const thermometer = svg('0 0 640 380', 'Temperature danger zone',
    'A thermometer scale. Cold holding is 41 degrees Fahrenheit or lower. Between 41 and 135 degrees is the danger zone where bacteria multiply quickly. Hot holding is 135 or higher. Poultry and reheating must reach 165.',
    r(250, 20, 56, 340, '#ffffff', { stroke: G, sw: 2.5, rx: 28 }) + r(252, 20, 52, 90, '#f4b6a8', { rx: 26 }) + r(252, 110, 52, 130, OR, { rx: 0 }) + r(252, 240, 52, 118, '#a9d2e8', { rx: 26 }) +
    [[165, 'Poultry · reheat for hot holding', 40, OR], [155, 'Ground meat and ground seafood', 70, TX], [145, 'Whole beef/pork, seafood, eggs', 90, TX], [135, 'HOT HOLDING at or above', 112, G], [41, 'COLD HOLDING at or below', 240, G], [0, 'Frozen foods at or below', 340, SUB]].map(([deg, label, y, c]) => `<line x1="306" y1="${y}" x2="330" y2="${y}" stroke="${c}" stroke-width="2"/>` + t(336, y + 4, `${deg}°F  ${label}`, { a: 'start', s: 12.5, w: deg === 135 || deg === 41 ? 700 : 500, c })).join('') +
    t(200, 175, 'DANGER ZONE', { w: 800, c: OR, s: 15, a: 'end' }) + t(200, 193, '41°F to 135°F', { s: 12.5, c: OR, a: 'end' }) + t(200, 211, 'bacteria multiply fast', { s: 11, c: SUB, a: 'end' }) + t(200, 227, '4 hours added together, then discard', { s: 11, c: SUB, a: 'end' }) +
    t(336, 282, 'Cooling: 135°F → 70°F within 2 hours,', { a: 'start', s: 11.5, c: M }) + t(336, 299, 'then 70°F → 41°F within 4 more hours', { a: 'start', s: 11.5, c: M }));

  const flow = (steps, y, w, gap, fill) => steps.map((s, i) => r(10 + i * (w + gap), y, w, 78, fill[i % fill.length], { stroke: M }) + t(10 + i * (w + gap) + w / 2, y + 28, `${i + 1}`, { w: 800, c: G, s: 17 }) + t(10 + i * (w + gap) + w / 2, y + 50, s[0], { w: 700, s: 12.5 }) + t(10 + i * (w + gap) + w / 2, y + 67, s[1], { s: 10, c: SUB }) +
    (i < steps.length - 1 ? `<path d="M${10 + i * (w + gap) + w + 2} ${y + 39} l${gap - 4} 0" stroke="${G}" stroke-width="2" marker-end="url(#ar)"/>` : '')).join('');
  const defs = `<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${G}"/></marker></defs>`;
  const sanitize = svg('0 0 640 190', 'Cleaning and sanitizing sequence',
    'Five steps in order: scrape, wash with detergent in hot water, rinse, sanitize, then air dry. Never dry with a cloth after sanitizing.',
    defs + flow([['Scrape', 'remove food'], ['Wash', 'detergent, 110°F+'], ['Rinse', 'clean water'], ['Sanitize', 'right strength'], ['Air dry', 'no cloth']], 20, 108, 20, ['#eef4ea', '#e5eef6']) +
    t(320, 135, 'Sanitizing a dirty surface does not work: food and dirt block the chemical.', { s: 12 }) + t(320, 156, 'Chlorine 50–100 ppm · quaternary ammonium 200–400 ppm · iodine 12.5–25 ppm. Check with test strips.', { s: 11, c: SUB }));

  const handwash = svg('0 0 640 190', 'Six-step handwashing procedure',
    'Wet hands and arms with warm running water, apply soap, scrub vigorously for 10 to 15 seconds, rinse, dry with a single-use paper towel, and use the towel to turn off the faucet. The whole process takes at least 20 seconds.',
    defs + flow([['Wet', 'warm water'], ['Soap', 'hands + arms'], ['Scrub', '10–15 sec'], ['Rinse', 'thoroughly'], ['Dry', 'paper towel'], ['Turn off', 'with the towel']], 20, 92, 16, ['#e5eef6', '#eef4ea']) +
    t(320, 135, 'The whole procedure takes at least 20 seconds.', { w: 700, s: 13 }) + t(320, 156, 'Sanitizer is a supplement, never a substitute for handwashing.', { s: 11.5, c: SUB }));

  const fat = [['F', 'Food', 'protein-rich|moist food'], ['A', 'Acidity', 'pH 4.6 – 7.5'], ['T', 'Temperature', '41°F – 135°F'], ['T', 'Time', '4 hours|added together'], ['O', 'Oxygen', 'most pathogens|need it'], ['M', 'Moisture', 'water activity|above 0.85']];
  const fattom = svg('0 0 640 230', 'FAT TOM: six conditions bacteria need to grow',
    'Food, Acidity (pH 4.6 to 7.5), Temperature (41 to 135 degrees), Time (4 hours added together), Oxygen, and Moisture (water activity above 0.85).',
    fat.map(([l, n, d], i) => r(10 + i * 104, 20, 98, 130, i % 2 ? '#eef4ea' : '#f6efd9', { stroke: M }) + t(59 + i * 104, 66, l, { s: 38, w: 800, c: G }) + t(59 + i * 104, 96, n, { w: 700, s: 12.5 }) + d.split('|').map((ln, k) => t(59 + i * 104, 116 + k * 13, ln, { s: 9.5, c: SUB })).join('')).join('') +
    t(320, 182, 'Take away any one condition and bacteria cannot grow.', { s: 12, c: SUB }) + t(320, 202, 'Control time and temperature first: you control them every shift.', { s: 12, c: SUB }));

  const quad = (x, y, name, a, b, c) => r(x, y, 200, 90, c, { stroke: M }) + t(x + 100, y + 32, name, { w: 800, s: 16, c: G }) + t(x + 100, y + 54, a, { s: 11.5 }) + t(x + 100, y + 72, b, { s: 11.5, w: 700, c: M });
  const menuquad = svg('0 0 520 280', 'Menu engineering matrix',
    'Stars are high profit and high popularity: keep and promote. Plowhorses are low profit but popular: reprice or cut cost. Puzzles are high profit but unpopular: promote or reposition. Dogs are low profit and unpopular: remove.',
    t(260, 14, 'POPULARITY', { s: 11, w: 700, c: SUB }) +
    quad(40, 24, 'PUZZLES', 'high profit · low popularity', 'promote or reposition', '#f6efd9') + quad(260, 24, 'STARS', 'high profit · high popularity', 'keep and promote', '#d9ecd6') +
    quad(40, 124, 'DOGS', 'low profit · low popularity', 'candidate to remove', '#f0d9d3') + quad(260, 124, 'PLOWHORSES', 'low profit · high popularity', 'reprice or cut cost', '#e5eef6') +
    t(260, 238, 'low  ←  popularity  →  high', { s: 11, c: SUB }) + t(18, 130, 'profit', { s: 11, c: SUB, a: 'middle' }) + t(260, 262, 'Popularity and profit are different measures: your best seller is not always your best earner.', { s: 11, c: SUB }));

  const cost = svg('0 0 640 200', 'From ingredient cost to selling price',
    'Ingredient cost using edible portion weight gives the plate cost. Divide the plate cost by the target food cost percentage to get the selling price. Example: 4 dollars divided by 0.30 is 13 dollars and 33 cents.',
    defs + [['Ingredient cost', 'at EP weight'], ['Plate cost', 'cost of one portion'], ['÷ Target food cost %', 'e.g. 30% = 0.30'], ['Selling price', 'check the market']].map(([a, b], i) => r(10 + i * 158, 24, 140, 78, i === 3 ? '#d9ecd6' : '#f6efd9', { stroke: M }) + t(80 + i * 158, 58, a, { w: 700, s: 12.5 }) + t(80 + i * 158, 78, b, { s: 10.5, c: SUB }) + (i < 3 ? `<path d="M${152 + i * 158} 63 l14 0" stroke="${G}" stroke-width="2" marker-end="url(#ar)"/>` : '')).join('') +
    t(320, 140, 'Example: $4.00 plate cost ÷ 0.30 = $13.33 minimum selling price', { w: 700, s: 13.5, c: G }) + t(320, 164, 'Food cost % = (ingredient cost ÷ selling price) × 100.  EP vs AP: yield % = EP weight ÷ AP weight.', { s: 11.5, c: SUB }));

  // inline SVGs share one page, so every id (title, desc, arrowhead) must be unique per diagram
  const all = { workstation, boards, cuts, cooler, thermometer, sanitize, handwash, fattom, menuquad, cost };
  Object.keys(all).forEach(k => { all[k] = all[k].replace(/aria-labelledby="t d"/, `aria-labelledby="t-${k} d-${k}"`).replace(/<title id="t">/, `<title id="t-${k}">`).replace(/<desc id="d">/, `<desc id="d-${k}">`).replace(/id="ar"/g, `id="ar-${k}"`).replace(/url\(#ar\)/g, `url(#ar-${k})`); });
  return all;
})();
