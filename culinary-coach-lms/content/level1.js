/* Culinary Entrepreneurship I — Level I curriculum (Oct 12 – Nov 7, 2026)
 * Source: "Level I Curriculum Map & Dual-Level Platform Architecture" brief. This file is DATA ONLY: edit text here,
 * not in index.html. Real calendar weekdays are used (the brief's Week 3 Saturday and Week 4 dates were each a day off).
 *
 *   id        w{week}d{day} for Mon–Thu modules, w{week}lab for Saturday labs. The server (lms-api-v2) knows the same ids.
 *   topics    the brief's "Online content" column — an OUTLINE. Add the full lesson text in `lesson` (HTML string) when ready.
 *   quiz      id of the quiz in QUIZ_BANK (level1-quizzes.js), or null
 *   file      a student upload: { label, blurb, due }  (server: FILE_ASSIGNMENTS)
 *   resources outside links shown on the day (verified by CI: tools/check-links.py)
 */
const YT = id => 'https://www.youtube.com/watch?v=' + id;

const LEVEL1 = {
  title: 'Culinary Entrepreneurship I',
  cohort: 'Level I · Fall 2026',
  dates: 'Oct 12 – Nov 7, 2026',
  weeks: [
    {
      n: 1, title: 'Kitchen Readiness & Systems', side: 'Kitchen Readiness & Systems',
      sub: 'CST Module 1 + Food Safety Foundation', dates: 'Oct 12–18', long: 'October 12–18, 2026',
      note: 'Mon–Thu online (about 3 hours a day) · Saturday Lab 1 in person · Lab 1 attendance unlocks Weeks 2–4',
    },
    {
      n: 2, title: 'Food Safety & ServSafe Food Handler', side: 'Food Safety & ServSafe',
      sub: 'ServSafe Food Handler preparation', dates: 'Oct 19–25', long: 'October 19–25, 2026',
      note: 'Mon–Thu online · Saturday Lab 2: ServSafe practice exam + kitchen safety',
    },
    {
      n: 3, title: 'Costing, Pricing, Menu & Business Formats', side: 'Costing, Menu & Formats',
      sub: 'The numbers and the shape of a food business', dates: 'Oct 26 – Nov 1', long: 'October 26 – November 1, 2026',
      note: 'Mon–Thu online · Saturday Lab 3: production and costing in action (Oct 31)',
    },
    {
      n: 4, title: 'Permits, Licensing & Capstone', side: 'Permits & Capstone',
      sub: 'Licensing, exam prep and your Concept Brief', dates: 'Nov 2–7', long: 'November 2–7, 2026',
      note: 'Mon–Thu online · Saturday Lab 4: ServSafe exam, Concept Brief presentations, certificates (Nov 7)',
    },
  ],

  days: [
    // ---------------- WEEK 1 ----------------
    {
      id: 'w1d1', week: 1, dow: 'Monday', date: 'October 12', short: 'Oct 12', module: 'CST M1: Mise en Place',
      layer: 'KRP Phase 1 · Week 1 — Honest Map', hours: '~3 hours',
      topics: ['What mise en place means', 'Workstation anatomy', 'The CST philosophy', 'Professional mindset'],
      resources: [
        { t: 'video', title: 'What Is Mise en Place and Why It Matters', meta: 'YouTube', url: YT('Hf4okUst6Cw') },
      ],
      quiz: 'w1d1',
    },
    {
      id: 'w1d2', week: 1, dow: 'Tuesday', date: 'October 13', short: 'Oct 13', module: 'CST M1: Knife Skills & Ingredients',
      layer: 'KRP — industry reality framing', hours: '~3 hours',
      topics: ['Knife safety and grip', 'Classic cuts: large, medium and small dice, julienne, chiffonade', 'The 25-ingredient library'],
      resources: [
        { t: 'video', title: 'Basic Knife Skills and Cuts', meta: 'YouTube', url: YT('VJNA4vrdWec') },
        { t: 'video', title: 'The Claw Grip', meta: 'YouTube', url: YT('Uv7td6UxBXQ') },
      ],
      quiz: 'w1d2',
    },
    {
      id: 'w1d3', week: 1, dow: 'Wednesday', date: 'October 14', short: 'Oct 14', module: 'CST M1: Recipe Execution & Storage',
      layer: 'KRP — cognitive load reduction', hours: '~3 hours',
      topics: ['Standardized recipe format', 'Unit conversion and yield', 'FIFO, labeling and temperature control', 'Cross-contamination'],
      resources: [
        { t: 'video', title: 'First-In First-Out Rotation and Labeling', meta: 'YouTube', url: YT('mMN5QKiqZf4') },
        { t: 'video', title: '5 Tips for Storing Food in a Walk-In Cooler', meta: 'YouTube', url: YT('ejh_G6-_pSM') },
      ],
      quiz: 'w1d3',
    },
    {
      id: 'w1d4', week: 1, dow: 'Thursday', date: 'October 15', short: 'Oct 15', module: 'CST M1: Production & Team Communication',
      layer: 'KRP — professional identity', hours: '~3 hours',
      topics: ['Prep lists', 'Production timelines', 'Kitchen calls and acknowledgments', 'Line communication standards'],
      resources: [
        { t: 'video', title: '10 Phrases Used in Every Kitchen', meta: 'YouTube', url: YT('8lrZdejfe58') },
        { t: 'video', title: 'Why Chefs Say "Heard"', meta: 'YouTube', url: YT('vZGXDqrfsdA') },
      ],
      quiz: 'w1d4',
      file: {
        label: 'Honest Map', due: 'Thursday, Oct 15', krp: 'KRP Deliverable 1',
        blurb: 'Your Honest Map: an accurate picture of what working in food really involves and where you stand today. Follow the template your instructor gives you.',
      },
    },
    {
      id: 'w1lab', lab: 'lab1', week: 1, dow: 'Saturday', date: 'October 17', short: 'Oct 17', module: 'LAB 1 — CST Assessment',
      layer: 'KRP — real conditions exposure',
      activities: ['Mise en place setup', 'Knife cuts assessed against the rubric', 'Storage and labeling check', 'Prep list execution', 'Team debrief'],
      assessment: 'CST Rubric (100 points): Arrival/Setup, Knife Skills, Storage, Production',
      unlocks: 'Your instructor confirms your attendance at the lab. That unlocks Weeks 2–4.',
    },

    // ---------------- WEEK 2 ----------------
    {
      id: 'w2d1', week: 2, dow: 'Monday', date: 'October 19', short: 'Oct 19', module: 'ServSafe: Foodborne Illness & Contamination',
      layer: 'KRP Phase 1 · Week 2 — Identity Statement', hours: '~3 hours',
      topics: ['Causes of foodborne illness', 'FAT TOM', 'Biological, chemical and physical hazards', 'High-risk populations'],
      resources: [
        { t: 'video', title: 'What Is FAT TOM?', meta: 'YouTube', url: YT('fdLeMQ0HqbM') },
        { t: 'video', title: 'Why Food Hygiene and Safety Matter', meta: 'YouTube', url: YT('DbXN_KMr0-A') },
      ],
      quiz: 'w2d1',
    },
    {
      id: 'w2d2', week: 2, dow: 'Tuesday', date: 'October 20', short: 'Oct 20', module: 'ServSafe: Personal Hygiene & Handwashing',
      layer: '', hours: '~3 hours',
      topics: ['Handwashing steps and when to wash', 'Gloves', 'Illness reporting', 'Bare-hand contact policy'],
      resources: [
        { t: 'video', title: 'Handwashing for Food Safety Explained', meta: 'YouTube', url: YT('sSl2BkpG-vk') },
        { t: 'video', title: 'Proper Hygiene for Food Handlers', meta: 'YouTube', url: YT('toT5NBLrfJ4') },
      ],
      quiz: 'w2d2',
    },
    {
      id: 'w2d3', week: 2, dow: 'Wednesday', date: 'October 21', short: 'Oct 21', module: 'ServSafe: Time-Temperature Control & Receiving',
      layer: '', hours: '~3 hours',
      topics: ['The danger zone (41–135°F)', 'Safe cooking temperatures', 'Cooling and reheating', 'Receiving inspections and rejection criteria'],
      resources: [
        { t: 'video', title: 'The Temperature Danger Zone', meta: 'YouTube', url: YT('_dxfPSdf8NE') },
        { t: 'video', title: 'Cooling Foods Quickly and Safely', meta: 'YouTube', url: YT('LTOBcoPJMxs') },
      ],
      quiz: 'w2d3',
      file: {
        label: 'Professional Identity Statement', due: 'Wednesday, Oct 21', krp: 'KRP Deliverable 2',
        blurb: 'Your Professional Identity Statement: who you are as a food professional and what you are building toward. Follow the template your instructor gives you.',
      },
    },
    {
      id: 'w2d4', week: 2, dow: 'Thursday', date: 'October 22', short: 'Oct 22', module: 'ServSafe: Cleaning, Sanitizing & Facilities',
      layer: '', hours: '~3 hours',
      topics: ['Cleaning vs sanitizing', 'Chemical concentrations', 'Cloth storage and dishwashing', 'Pest prevention', 'Facilities requirements'],
      resources: [
        { t: 'video', title: 'Washing and Sanitizing with a 3-Compartment Sink', meta: 'YouTube', url: YT('LfRME4l-vas') },
        { t: 'video', title: 'How to Use Sanitizer Test Strips', meta: 'YouTube', url: YT('tRutVebb54M') },
      ],
      quiz: 'w2d4',
    },
    {
      id: 'w2lab', lab: 'lab2', week: 2, dow: 'Saturday', date: 'October 24', short: 'Oct 24', module: 'LAB 2 — ServSafe Practice + Kitchen Safety',
      layer: '',
      activities: ['ServSafe practice exam (proctored, on the ServSafe platform)', 'Temperature checks', 'Sanitation stations', 'Debrief'],
      assessment: 'Practice exam score reviewed · ServSafe account confirmed active',
    },

    // ---------------- WEEK 3 ----------------
    {
      id: 'w3d1', week: 3, dow: 'Monday', date: 'October 26', short: 'Oct 26', module: 'Costing & Pricing Basics',
      layer: 'KRP Phase 2 · Week 3 — Stress Recognition', hours: '~3 hours',
      topics: ['Food cost percentage', 'Recipe costing', 'EP vs AP', 'Plate cost', 'Pricing for profit', 'Break-even intro'],
      resources: [
        { t: 'read', title: 'Calculating Food Cost Percentage', meta: 'RestaurantOwner.com', url: 'https://www.restaurantowner.com/public/4753.cfm' },
        { t: 'video', title: 'How to Price Menu Items', meta: 'YouTube', url: YT('EmOziopNT0w') },
      ],
      menuExample: true,
      quiz: 'w3d1',
    },
    {
      id: 'w3d2', week: 3, dow: 'Tuesday', date: 'October 27', short: 'Oct 27', module: 'Menu Fundamentals',
      layer: '', hours: '~3 hours',
      topics: ['Menu engineering basics', 'Consistency and production capacity', 'Pricing strategy', 'What sells vs what costs'],
      resources: [
        { t: 'video', title: 'Menu Psychology and Profitability', meta: 'YouTube', url: YT('Hb35UVBddOI') },
      ],
      quiz: 'w3d2',
    },
    {
      id: 'w3d3', week: 3, dow: 'Wednesday', date: 'October 28', short: 'Oct 28', module: 'Food Business Formats',
      layer: 'KRP — Cognitive Reframing', hours: '~3 hours',
      topics: ['Booth, pop-up, cottage food, catering and food truck: what each one takes', 'Pros and cons', 'Capital requirements'],
      resources: [
        { t: 'video', title: 'Starting a Cottage Food Business from Home', meta: 'YouTube', url: YT('c2aXLbaWeGg') },
        { t: 'video', title: 'Selling at Farmers Markets and Pop-Ups', meta: 'YouTube', url: YT('K432TTp7LqM') },
        { t: 'read', title: 'Virginia Home Kitchen (Cottage Food) Exemptions FAQ', meta: 'VDACS (PDF)', url: 'https://www.vdacs.virginia.gov/pdf/kitchenbillfaq.pdf' },
        { t: 'link', title: 'Find a Shared Commercial Kitchen', meta: 'The Kitchen Door', url: 'https://www.thekitchendoor.com/' },
      ],
      quiz: 'w3d3',
    },
    {
      id: 'w3d4', week: 3, dow: 'Thursday', date: 'October 29', short: 'Oct 29', module: 'Sourcing, Vendors & Customers',
      layer: '', hours: '~3 hours',
      topics: ['Where product comes from', 'Supplier relationships', 'Cost negotiation basics', 'Customer identification', 'Reading demand'],
      resources: [
        { t: 'video', title: 'Negotiating Best Vendor Pricing', meta: 'YouTube', url: YT('9KYzVWwOZFo') },
        { t: 'video', title: 'How to Find Your Target Customer', meta: 'YouTube', url: YT('6RXnRSm0xJY') },
        { t: 'link', title: 'USDA Local Food Directories', meta: 'USDA.gov', url: 'https://www.ams.usda.gov/services/local-regional/food-directories' },
        { t: 'read', title: 'Market Research and Competitive Analysis', meta: 'SBA.gov', url: 'https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis' },
      ],
      quiz: 'w3d4',
      file: {
        label: 'Recipe Cost Sheet', due: 'Thursday, Oct 29',
        blurb: 'Cost one of your recipes. Use the food-cost formula from this week: (Cost of Ingredients ÷ Sale Price) × 100.',
      },
    },
    {
      id: 'w3lab', lab: 'lab3', week: 3, dow: 'Saturday', date: 'October 31', short: 'Oct 31', module: 'LAB 3 — Production & Costing in Action',
      layer: '',
      activities: ['Execute a recipe from a standardized card', 'Cost your production', 'Plate and present', 'Peer critique'],
      assessment: 'Production rubric · costed recipe card submitted',
      file: {
        label: 'Costed Recipe Card', due: 'After Lab 3',
        blurb: 'Upload the costed recipe card from your Lab 3 production.',
      },
    },

    // ---------------- WEEK 4 ----------------
    {
      id: 'w4d1', week: 4, dow: 'Monday', date: 'November 2', short: 'Nov 2', module: 'Permits & Licensing — Intro',
      layer: 'KRP Phase 2 · Week 4 — Social Support', hours: '~3 hours',
      topics: ['Virginia food handler permit', 'Home-based and cottage food law', 'Health department inspection basics', 'VDACS requirements'],
      resources: [
        { t: 'read', title: 'Applying for a Food Permit (Virginia Department of Health)', meta: 'VDH', url: 'https://www.vdh.virginia.gov/environmental-health/food-safety-in-virginia/foodapplication/' },
        { t: 'read', title: 'Applying for Licenses and Permits', meta: 'SBA.gov', url: 'https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits' },
        { t: 'video', title: 'Food Establishment Inspection', meta: 'YouTube', url: YT('02aZKqvn8tE') },
      ],
      quiz: 'w4d1',
    },
    {
      id: 'w4d2', week: 4, dow: 'Tuesday', date: 'November 3', short: 'Nov 3', module: 'ServSafe Food Handler Exam Prep',
      layer: '', hours: '~3 hours',
      topics: ['Full practice exam review', 'Domain focus: contamination, temperatures, hygiene, facilities', 'Test-taking strategy'],
      resources: [
        { t: 'video', title: 'ServSafe Food Handler Practice Test', meta: 'YouTube', url: YT('-6TvLFNQyZw') },
        { t: 'link', title: 'ServSafe Food Handler: Get Certified', meta: 'ServSafe.com', url: 'https://www.servsafe.com/ServSafe-Food-Handler/Get-Certified' },
      ],
      quiz: 'w4d2',
    },
    {
      id: 'w4d3', week: 4, dow: 'Wednesday', date: 'November 4', short: 'Nov 4', module: 'Capstone Prep — Concept Brief',
      layer: 'KRP — KRP Portfolio Review', hours: '~3 hours',
      topics: ['Concept Brief template walkthrough', 'Business name, product or service, format, customer, pricing and next step'],
      resources: [],
      quiz: null, assessment: 'Instructor review and feedback',
      file: {
        label: 'Concept Brief Draft', due: 'Wednesday, Nov 4',
        blurb: 'A draft of your Concept Brief: business name, product or service, format, customer, pricing and your next step.',
      },
    },
    {
      id: 'w4d4', week: 4, dow: 'Thursday', date: 'November 5', short: 'Nov 5', module: 'KRP Portfolio & 90-Day Plan',
      layer: 'KRP Phase 3 — Post-Placement Prep', hours: '~3 hours',
      topics: ['What the first 30–90 days actually look like', 'KRP toolkit review', '90-day check-in intro'],
      resources: [],
      quiz: null,
      file: {
        label: 'KRP Portfolio', due: 'Thursday, Nov 5', krp: 'Complete portfolio',
        blurb: 'Your complete KRP Portfolio: every KRP deliverable together (Honest Map, Professional Identity Statement and your finished work).',
      },
    },
    {
      id: 'w4lab', lab: 'lab4', week: 4, dow: 'Saturday', date: 'November 7', short: 'Nov 7', module: 'LAB 4 — ServSafe Exam + Capstone Presentations',
      layer: '',
      activities: ['ServSafe Food Handler exam (proctored)', 'Concept Brief presented to the cohort and instructor', 'Certificate ceremony'],
      assessment: 'ServSafe result · Concept Brief rubric',
      file: {
        label: 'Concept Brief', due: 'Lab 4',
        blurb: 'Upload the final Concept Brief you present at Lab 4.',
      },
    },
  ],

  // KRP skill clusters (Phase 2) — embedded in the weekly modules and labs
  krp: {
    phases: [
      { n: 1, name: 'Conceptualization', weeks: 'Weeks 1–2', focus: 'Build accurate expectations and a professional identity.', out: 'Honest Map (Week 1) · Professional Identity Statement (Week 2)' },
      { n: 2, name: 'Skill Acquisition', weeks: 'Weeks 3–4', focus: 'Four psychological skill clusters taught through CST framing.', out: 'Stress Recognition (Oct 26) · Cognitive Reframing (Oct 28) · Social Support (Nov 2) · Recovery (embedded in labs)' },
      { n: 3, name: 'Application', weeks: 'Week 4 + after the course', focus: 'Your 90-day plan and first-shift preparation.', out: 'KRP Portfolio · a 90-day check-in email after Lab 4' },
    ],
    items: [
      { key: 'honest_map', label: 'Honest Map', day: 'w1d4', due: 'Oct 15' },
      { key: 'identity_statement', label: 'Professional Identity Statement', day: 'w2d3', due: 'Oct 21' },
      { key: 'portfolio', label: 'KRP Portfolio', day: 'w4d4', due: 'Nov 5' },
    ],
  },
};

// CST Module 1 rubric — 25 criteria x 4 points = 100. Scored 4 / 3 / 2 / 1. 80+ Pass · 70–79 Conditional · below 70 Remediation.
// Section 4 lists six criteria: three are named in the brief, three are proposed (edit the names here; the keys stay).
const CST_RUBRIC = {
  sections: [
    { id: 's1', title: 'Arrival, Uniform & Station Setup', note: 'Scored 4/3/2/1', criteria: ['Uniform', 'Knife roll', 'Workstation', 'Organization', 'Self-start'] },
    { id: 's2', title: 'Knife Skills & Cut Execution', note: 'Cuts measured against spec dimensions', criteria: ['Grip', 'Guide hand', 'Large dice', 'Medium dice', 'Small dice', 'Julienne', 'Chiffonade', 'Speed'] },
    { id: 's3', title: 'Food Storage, Labeling & Safety', note: 'Zero tolerance on cross-contamination', criteria: ['Labeling', 'Temperature', 'FIFO', 'Color-coded boards', 'Handwashing', 'Portioning'] },
    { id: 's4', title: 'Production & Communication', note: 'Line communication assessed in real time', criteria: ['Recipe execution', 'Prep list completion', 'Team calls and acknowledgments', 'Timeline management', 'Station cleanliness during production', 'Plating and presentation'] },
  ],
  band: total => (total >= 80 ? 'Pass' : total >= 70 ? 'Conditional' : 'Remediation required'),
};
