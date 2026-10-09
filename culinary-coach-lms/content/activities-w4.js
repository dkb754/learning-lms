/* Week 4 activities (w4d1, w4d2, w4d3, w4d4, w4lab). Schema: see activities-engine.js and tools/check-activities.mjs. No PART headings: everything is under `end`. */

/* ---------- Week 4 · Monday: Virginia permits, licensing and the regulatory landscape ---------- */
ACTIVITIES.w4d1 = {
  end: [
    {
      type: 'match', title: 'Who or what covers which part of the rules?',
      intro: 'Today you research the permits for your own business format. First, match each agency, law or requirement to what it is about.',
      options: ['The health department permit process', 'Cottage food law', 'VDACS requirements by product category', 'Commissary kitchen requirements', 'Your Concept Brief business format'],
      rows: [
        { label: 'Where a business using TCS (time and temperature control for safety) food production does its production work', ans: 3 },
        { label: 'The set of rules for making certain foods at home to sell, instead of in a licensed kitchen', ans: 1 },
        { label: 'Requirements that change depending on the category of product you sell', ans: 2 },
        { label: 'The process you work through to be permitted to operate and be inspected', ans: 0 },
        { label: 'The starting point that decides which permits you need to research', ans: 4 },
      ],
      why: 'Your format (booth, pop-up, cottage food, catering or truck) decides which rules apply. The health department permit process, cottage food law, VDACS requirements by product category and commissary requirements for TCS food production are the pieces you research for it.',
    },
    {
      type: 'choice', title: 'Which route fits this business?',
      intro: 'Read each situation and choose the best next step. Always confirm the details with the agency itself.',
      items: [
        { q: 'Maria wants to sell jars of jam and baked goods from her home kitchen at a weekend market. Which part of the regulatory landscape should she research first?', opts: ['Commissary kitchens only, because all food needs one', 'Cottage food law, then the VDACS requirements for her product categories', 'Nothing yet, because small sellers have no rules', 'Only the ServSafe exam'], ans: 1, why: 'Cottage food law covers certain foods made at home, and VDACS requirements vary by product category, so those are her first two stops.' },
        { q: 'Dev plans a catering business built on cooked chicken and rice dishes, which are TCS foods. What does the lesson point him toward?', opts: ['Skipping permits until he has ten customers', 'Treating his home kitchen as fine because the portions are small', 'Cottage food law alone, because he cooks from home', 'The health department permit process and commissary kitchen requirements for TCS food production'], ans: 3, why: 'TCS food production brings commissary kitchen requirements, and the health department permit process applies to a food business that serves the public.' },
        { q: 'A classmate says, "I read one blog post, so I know exactly what permits I need." What is the best response?', opts: ['Check the requirements with the health department and VDACS for her specific format and products', 'That is enough research for any food business', 'Ask a friend with a different business to copy their permits', 'Wait until the first inspection and find out then'], ans: 0, why: 'Requirements depend on format and product category and can change. Confirm with the agencies that issue and enforce them.' },
        { q: 'You are choosing between a booth, a pop-up, cottage food, catering or a truck. Why does it matter to decide before you research permits?', opts: ['It does not matter, the permits are the same', 'The choice only affects your logo', 'Each format can lead to different permits and requirements', 'Permits are only needed for trucks'], ans: 2, why: 'Format drives the permit list. Research for the wrong format wastes time and can leave a gap.' },
      ],
    },
    {
      type: 'reflect', title: 'Research my permits',
      intro: 'Use the health department and VDACS information to research the permits your own Concept Brief business format would need. Write one permit or requirement per line, with a short note on what it covers or what you still need to find out. If you are unsure, write the question you will ask the agency.',
      prompts: [
        { key: 'format', label: 'My business format and main products', help: 'Booth, pop-up, cottage food, catering or truck, and what you will sell.', items: 1, minWords: 12, rows: 3,
          keywords: [{ match: 'booth|pop-?up|cottage|cater|truck', tip: 'name your format' }, { match: 'sell|make|bake|cook|serve', tip: 'what you will make or sell' }] },
        { key: 'permits', label: 'Permits and requirements I need to research', help: 'One per line: what it is, who issues it, and what it covers or what you still need to find out.', items: 3, minWords: 6, rows: 6,
          placeholder: 'One per line. Example: Health department permit for my pop-up, to ask what inspection comes first',
          keywords: [{ match: 'health', tip: 'the health department permit process' }, { match: 'VDACS|cottage', tip: 'VDACS or cottage food rules for your products' }, { match: 'commissary|kitchen', tip: 'whether you need a commissary kitchen for TCS food' }, { match: 'ask|call|contact|confirm|question', tip: 'the question you will ask the agency' }] },
      ],
      model: 'FORMAT: I plan a weekend pop-up selling baked goods and a few cooked sandwiches made with chicken salad.\n\nPERMITS AND REQUIREMENTS TO RESEARCH\n- Health department permit process for a pop-up: I need to find out what application and inspection come first\n- Cottage food law: does it cover my baked goods if I make them at home, and which items are excluded\n- VDACS requirements for my product categories: the chicken salad is a different category from bread\n- Commissary kitchen: chicken salad is TCS food, so I must ask whether it has to be made in a commissary kitchen\n- Questions to call in on: what changes if I move from a pop-up to a booth later',
    },
  ],
};

/* ---------- Week 4 · Tuesday: ServSafe exam preparation ---------- */
ACTIVITIES.w4d2 = {
  end: [
    {
      type: 'choice', title: 'Domain review: Foodborne illness',
      intro: 'Review the domains where your Lab 2 practice exam score was lowest first. Start here: the Big 6, FAT TOM and high-risk populations.',
      items: [
        { q: 'Which list is the FDA "Big 6" group of pathogens?', opts: ['Listeria, botulism, E. coli, rice, flour and eggs', 'Norovirus, Hepatitis A, Shigella, Salmonella Typhi, nontyphoidal Salmonella and Shiga toxin-producing E. coli (STEC)', 'Any bacteria that smells bad', 'Only pathogens found in raw meat'], ans: 1, why: 'The Big 6 are Norovirus, Hepatitis A, Shigella, Salmonella Typhi, nontyphoidal Salmonella and STEC. Food handlers who are ill with these must be kept from handling food.' },
        { q: 'A tray of cooked rice sits out for hours on a counter in a warm room. Which FAT TOM factors are working for bacteria?', opts: ['Only oxygen', 'Acidity and oxygen', 'Food, moisture and time, plus a warm temperature', 'None, because cooked food is safe'], ans: 2, why: 'FAT TOM is Food, Acidity, Temperature, Time, Oxygen and Moisture. Cooked rice is food with moisture, and hours at a warm temperature give bacteria the time they need.' },
        { q: 'Which customer group is the most at risk if they get a foodborne illness?', opts: ['Healthy teenagers', 'Adult athletes', 'Young children, older adults and people with weakened immune systems', 'Only people who skip meals'], ans: 2, why: 'Young children, older adults, pregnant women and people with weakened immune systems are high-risk populations.' },
        { q: 'You prepare lunch for a daycare center. What is the best change to your process?', opts: ['Use the same menu and hope for the best', 'Avoid undercooked and high-risk items and follow cooking temperatures exactly', 'Add more spices', 'Prepare the food a day early to save time'], ans: 1, why: 'Serving a high-risk population means no shortcuts: follow safe cooking temperatures and avoid undercooked foods.' },
      ],
    },
    {
      type: 'match', title: 'Domain review: Temperature control',
      intro: 'Match each situation to the temperature or time you must meet. Use quick-reference figures if you need them.',
      options: ['41°F to 135°F', '165°F', '155°F', '145°F', '135°F'],
      rows: [
        { label: 'The temperature danger zone', ans: 0 },
        { label: 'Minimum cooking temperature for poultry and reheated TCS food', ans: 1 },
        { label: 'Minimum cooking temperature for ground beef', ans: 2 },
        { label: 'Minimum cooking temperature for steaks and fish (whole cuts)', ans: 3 },
        { label: 'Hot holding: keep hot foods at or above', ans: 4 },
      ],
      why: 'Danger zone 41°F to 135°F. Poultry and reheated food 165°F. Ground meat 155°F. Whole cuts of beef, pork and fish 145°F. Hot hold at 135°F or higher. Cool from 135°F to 70°F within 2 hours, then to 41°F within 4 more hours.',
    },
    { type: 'diagram', svg: 'thermometer', title: 'Quick reference: where to place the thermometer', caption: 'Check the thickest part of the food, away from bone and the pan. Clean and sanitize the probe between foods.' },
    {
      type: 'fill', title: 'Domain review: Temperature numbers',
      intro: 'Fill in the numbers from the temperature control rules.',
      rows: [
        { label: 'Lowest temperature of the danger zone (°F)', unit: '°F', ans: 41, tol: 0.5 },
        { label: 'Highest temperature of the danger zone (°F)', unit: '°F', ans: 135, tol: 0.5 },
        { label: 'Reheat leftover soup to what temperature before serving (°F)', unit: '°F', ans: 165, tol: 0.5 },
        { label: 'First stage of cooling: 135°F down to 70°F within how many hours', unit: 'hours', ans: 2, tol: 0.01 },
      ],
      why: 'The danger zone is 41°F to 135°F. Reheat to 165°F. Cooling is two stages: 135°F to 70°F in 2 hours, then 70°F to 41°F in the next 4 hours.',
    },
    {
      type: 'order', title: 'Domain review: Personal hygiene, washing hands',
      intro: 'Put the handwashing steps in order, first step at the top.',
      steps: ['Wet hands with running water', 'Apply soap', 'Scrub hands and arms for at least 10 to 15 seconds', 'Rinse under running water', 'Dry with a single-use towel or hand dryer', 'Turn off the tap with the paper towel'],
      why: 'Wet, soap, scrub 10 to 15 seconds (the whole process takes about 20 seconds), rinse, dry with a single-use towel or dryer, then use the towel to turn off the tap so clean hands are not recontaminated.',
    },
    { type: 'diagram', svg: 'handwash', title: 'Quick reference: handwashing', caption: 'Handwashing takes about 20 seconds from start to finish. Wash before work, after the restroom, after handling raw food and after touching your face or hair.' },
    {
      type: 'choice', title: 'Domain review: Personal hygiene decisions',
      items: [
        { q: 'A prep cook has vomiting and diarrhea. What should happen?', opts: ['Work the dish station only', 'Wear gloves and keep working', 'Report it to the manager and stay out of the kitchen', 'Take medicine and finish the shift'], ans: 2, why: 'Report vomiting, diarrhea, jaundice, or a sore throat with fever. A worker with vomiting or diarrhea is excluded from the operation, and returns only when symptoms have stopped for at least 24 hours or a medical provider clears them.' },
        { q: 'You are building sandwiches with sliced bread and cooked turkey, both ready to eat. What is correct?', opts: ['Handle them with bare hands if they are washed', 'Use gloves or deli tissue, tongs or utensils; no bare-hand contact', 'Bare hands are fine if the customer cannot see', 'Wear gloves once and keep them all day'], ans: 1, why: 'Ready-to-eat food must never be touched with bare hands. Use gloves, tongs, deli paper or utensils, and change gloves between tasks.' },
        { q: 'You cough into your hand while portioning salad. What should you do next?', opts: ['Keep working', 'Wipe your hand on your apron', 'Wash your hands before touching food again', 'Put on gloves over the same hand'], ans: 2, why: 'Coughing, sneezing, touching your face or hair all contaminate hands. Wash again before touching food.' },
      ],
    },
    {
      type: 'order', title: 'Domain review: Cleaning and sanitizing sequence',
      intro: 'Put the five steps for cleaning and sanitizing a prep surface in order.',
      steps: ['Scrape or remove food debris', 'Wash the surface with soap and water', 'Rinse with clean water', 'Apply sanitizer at the correct concentration', 'Let it air-dry'],
      why: 'Clean first (scrape, wash, rinse), then sanitize, then air-dry. Sanitizer only works on a clean surface and does not need to be wiped off with a cloth.',
    },
    { type: 'diagram', svg: 'sanitize', title: 'Quick reference: clean, then sanitize', caption: 'Cleaning removes food and dirt. Sanitizing reduces pathogens to a safe level. Never skip the first step. Test the sanitizer strength with test strips.' },
    {
      type: 'match', title: 'Domain review: Sanitizer and cloths',
      intro: 'Match each item to the correct practice.',
      options: ['Store in a sanitizer solution between uses', 'Test with a test kit or strips', 'Follow the manufacturer’s directions', 'Replace with fresh solution when it gets dirty or weak', 'Chlorine (bleach) solution at 50 to 99 ppm'],
      rows: [
        { label: 'Wiping cloths used on prep surfaces during service', ans: 0 },
        { label: 'How to know your sanitizer bucket is strong enough', ans: 1 },
        { label: 'Quat (quaternary ammonium) sanitizer concentration', ans: 2 },
        { label: 'What to do when the sanitizer bucket looks cloudy or dirty', ans: 3 },
        { label: 'A common sanitizer concentration for food-contact surfaces', ans: 4 },
      ],
      why: 'Keep wiping cloths in sanitizer between uses, test the solution with strips, follow the label for quats, change it when dirty, and remember chlorine is used at 50 to 99 ppm.',
    },
    {
      type: 'choice', title: 'Domain review: Facilities',
      intro: 'Handwashing sinks, pest prevention and storage order.',
      items: [
        { q: 'Which is a correct requirement for a handwashing sink?', opts: ['It can also be used to rinse produce when it is convenient', 'It is used for handwashing only, with hot and cold running water, soap and towels, and kept accessible', 'It can be blocked by a rack when not in use', 'It does not need soap'], ans: 1, why: 'A handwashing sink is for handwashing only. It needs hot and cold running water, soap, a way to dry hands and a clear path to it.' },
        { q: 'In the walk-in, where should raw chicken go?', opts: ['On the top shelf above produce', 'Next to the ready-to-eat desserts', 'On the bottom shelf, below ready-to-eat and other raw foods', 'Anywhere that is cold'], ans: 2, why: 'Store by required cooking temperature, from top to bottom: ready-to-eat food, seafood, whole cuts of beef and pork, ground meat, then poultry on the bottom, so juices cannot drip onto foods that will not be cooked.' },
        { q: 'You see signs of mice. Which is the best long-term pest prevention approach?', opts: ['Leave out food so they stay away from the dry storage', 'Keep doors propped open for ventilation', 'Deny pests access, food, water and shelter, and work with a licensed pest control operator', 'Spray before every shift'], ans: 2, why: 'Pest prevention means keeping them out, removing their food, water and hiding places, and using a licensed pest control operator for treatment.' },
      ],
    },
    { type: 'diagram', svg: 'cooler', title: 'Quick reference: storage order in the cooler', caption: 'Top to bottom: ready-to-eat food, seafood, whole cuts of beef and pork, ground meat, poultry. Keep everything covered, labeled and off the floor.' },
    {
      type: 'reflect', title: 'My study plan for the Lab 4 exam',
      intro: 'Look back at your Lab 2 practice exam score by domain. Write a short plan for the days before Lab 4.',
      prompts: [
        { key: 'weak', label: 'My two lowest domains and why I think they were hard', help: 'Foodborne illness, temperature control, personal hygiene, cleaning and sanitizing, or facilities.', items: 1, minWords: 15, rows: 4,
          keywords: [{ match: 'foodborne|temperature|hygiene|clean|sanitiz|facilit', tip: 'name the domains' }, { match: 'because|hard|confus|forgot|mix', tip: 'why they were hard' }] },
        { key: 'plan', label: 'What I will do to study, and when', help: 'Be specific: what, how long, which day.', items: 1, minWords: 20, rows: 5,
          keywords: [{ match: 'minute|hour|day|night|morning|week|tonight|tomorrow', tip: 'when you will study' }, { match: 'flash|quiz|practice|review|re-?read|chart|write', tip: 'how you will study' }] },
        { key: 'ready', label: 'What I need for exam day', help: 'Think about your account and your coursework.', items: 1, minWords: 12, rows: 3,
          keywords: [{ match: 'account|log ?in|password', tip: 'your active exam account' }, { match: 'course|complete|finish', tip: 'completed coursework' }] },
      ],
      model: 'My two lowest domains were temperature control and cleaning and sanitizing. I mix up the cooling times and I forget the order of the steps. I will make flash cards for the temperatures and the two cooling stages and review them for 15 minutes every morning. On Thursday night I will retake the practice questions for those two domains and write the correct answers I missed. Before Saturday I will log in to my exam account to make sure it is active and finish any coursework I have left.',
    },
  ],
};

/* ---------- Week 4 · Wednesday: Capstone Concept Brief ---------- */
ACTIVITIES.w4d3 = {
  end: [
    {
      type: 'reflect', title: 'Concept Brief template',
      intro: 'Use this template to draft your Concept Brief, one prompt for each required element. Work in full sentences. When you are happy with a first draft, download it, improve it in your own file, and upload that file as your Concept Brief draft deliverable. The deadline is the end of the day, and your instructor will review it and return feedback before Lab 4. The pricing element comes in the next activity.',
      prompts: [
        { key: 'name', label: 'Business name and tagline', help: 'The name, plus one line that tells people what you are about.', items: 1, minWords: 12, rows: 3,
          keywords: [{ match: 'tagline|"|“|—|-', tip: 'a tagline after the name' }, { match: 'fresh|local|family|homemade|simple|handmade|made', tip: 'a word that shows what you are about' }] },
        { key: 'product', label: 'Product or service description', help: 'What you make, how it is made, and what makes it distinctive.', items: 1, minWords: 25, rows: 6,
          keywords: [{ match: 'make|bake|cook|prepare|serve|sell', tip: 'what you make' }, { match: 'how|using|from|recipe|batch|daily|scratch', tip: 'how it is made' }, { match: 'different|unique|only|distinct|special|family', tip: 'what makes it distinctive' }] },
        { key: 'format', label: 'Business format', help: 'Booth, pop-up, cottage food, catering or truck, and why that format fits you.', items: 1, minWords: 15, rows: 4,
          keywords: [{ match: 'booth|pop-?up|cottage|cater|truck', tip: 'name one of the five formats' }, { match: 'because|since|so that|fits', tip: 'why it fits you' }] },
        { key: 'customer', label: 'Target customer', help: 'Who they are and where you reach them.', items: 1, minWords: 20, rows: 5,
          keywords: [{ match: 'customer|people|families|workers|students|neighbors|office|parents', tip: 'who they are' }, { match: 'market|online|instagram|facebook|social|school|church|event|street|where|reach', tip: 'where you will reach them' }] },
        { key: 'next', label: 'Next step in the next 30 days', help: 'One specific action that moves you toward launch, with a date.', items: 1, minWords: 15, rows: 4,
          keywords: [{ match: 'will|by|before|within', tip: 'a clear commitment' }, { match: 'day|week|month|date|monday|friday|november|december|january', tip: 'a deadline' }, { match: 'call|apply|permit|test|menu|taste|sign|book|reserve|visit|ask', tip: 'a specific action' }] },
      ],
      model: 'NAME AND TAGLINE\nGrandma’s Table Kitchen: "Sunday dinner, any day of the week."\n\nPRODUCT OR SERVICE\nI make small-batch family-style meals such as chicken and dumplings, collard greens and cornbread. Everything is cooked from scratch the day before each event from my grandmother’s recipes, with local produce when it is in season. What makes it distinctive is that each meal comes with a card telling the story of the recipe.\n\nBUSINESS FORMAT\nI will start as a weekend pop-up because I can test demand before buying a truck and I can keep my costs low.\n\nTARGET CUSTOMER\nBusy families and older neighbors in my part of Richmond who want a home-cooked dinner without the work. I will reach them through church bulletins, the community Facebook group and a table at the neighborhood market.\n\nNEXT STEP\nBy the 15th of next month I will call the health department to ask which permit a weekend pop-up needs and write down the answers and the fees.',
      download: { label: 'Concept Brief draft', title: 'My Concept Brief (draft)', filename: 'concept-brief-draft' },
    },
    {
      type: 'fill', title: 'Pricing: plate cost, price and food cost percentage',
      intro: 'Your Concept Brief needs two to three products with plate cost, sale price and food cost percentage. Practice with these made-up numbers. Selling price = plate cost ÷ target food cost %. Round to the nearest cent.',
      rows: [
        { label: 'Product A: plate cost $2.40, target food cost 30%. Selling price?', unit: '$', ans: 8, tol: 0.01 },
        { label: 'Product B: plate cost $1.80, target food cost 25%. Selling price?', unit: '$', ans: 7.2, tol: 0.01 },
        { label: 'Product C: plate cost $1.50, sold at $6.00. Food cost percentage?', unit: '%', ans: 25, tol: 0.1 },
      ],
      why: 'A: 2.40 ÷ 0.30 = $8.00. B: 1.80 ÷ 0.25 = $7.20. C: 1.50 ÷ 6.00 = 0.25, or 25%. Use the same method with your own plate costs in your Concept Brief.',
    },
  ],
};

/* ---------- Week 4 · Thursday: KRP Portfolio and 90-Day Plan ---------- */
ACTIVITIES.w4d4 = {
  end: [
    {
      type: 'choice', title: 'Is my KRP Portfolio complete?',
      intro: 'Today you compile and review your KRP Portfolio. Check what belongs in it. The optional 90-day check-in email can be turned on from the KRP Portfolio page.',
      items: [
        { q: 'Which set matches what the KRP Portfolio contains?', opts: ['Only the Concept Brief and your quiz scores', 'Your resume, a headshot and three references', 'Honest Map (Week 1), Professional Identity Statement (Week 2) and reflections on the four KRP skills from Weeks 3 and 4', 'The ServSafe certificate and a menu'], ans: 2, why: 'The portfolio collects the Honest Map from Week 1, the Professional Identity Statement from Week 2 and the reflections on the four KRP skills from Weeks 3 and 4.' },
        { q: 'A learner has the Honest Map and the Professional Identity Statement but has not written any reflections on the four KRP skills. What should she do?', opts: ['Skip it because two of three is enough', 'Complete the reflections on the four KRP skills so the portfolio is whole', 'Rewrite the Honest Map instead', 'Wait for the 90-day email'], ans: 1, why: 'The KRP Final needs all deliverables collected. A missing piece means the portfolio is not complete.' },
        { q: 'You finish your portfolio and want a reminder to check in on how things are going 90 days from now. What can you do?', opts: ['Turn on the optional 90-day check-in email from the KRP Portfolio page', 'Nothing, it is automatic for everyone', 'Email yourself on the last day of class', 'It is not possible'], ans: 0, why: 'The 90-day check-in is optional: you opt in on the KRP Portfolio page, and then an email with a short survey arrives about 90 days after Lab 4.' },
        { q: 'Why does the program include a Phase 3 on the first 30 to 90 days after you start?', opts: ['To grade you after the program ends', 'To prepare you for what will be hard and what only feels like failure, and to use your KRP tools in real conditions', 'To replace the ServSafe exam', 'To add more paperwork'], ans: 1, why: 'Phase 3 is about application: knowing what to expect in the first 30 to 90 days and using the KRP toolkit when it counts.' },
      ],
    },
    {
      type: 'reflect', title: 'My 90-Day Plan',
      intro: 'Think about your first 30 to 90 days in a food business or culinary job. Be honest and specific. Download your plan when you are done and keep it.',
      prompts: [
        { key: 'hard', label: 'What will be hard in my first 30 to 90 days', help: 'One per line. Use your Honest Map to help.', items: 3, minWords: 5, rows: 5,
          placeholder: 'One per line. Example: Staying on my feet through a long Saturday market',
          keywords: [{ match: 'tired|stand|hours|physical|exhaust', tip: 'physical demands' }, { match: 'money|pay|cost|price|income', tip: 'money' }, { match: 'customer|critic|feedback|rude|chef|team', tip: 'people and feedback' }, { match: 'time|schedule|balance|family', tip: 'time and balance' }] },
        { key: 'failure', label: 'What will feel like failure and is not', help: 'One per line: something normal that you might take too hard.', items: 2, minWords: 6, rows: 4,
          placeholder: 'One per line. Example: A slow first market day with few sales',
          keywords: [{ match: 'slow|few|mistake|sold out|wrong|late', tip: 'a normal slow or messy moment' }, { match: 'learn|normal|first|part of', tip: 'why it is normal' }] },
        { key: 'tool', label: 'Which KRP tool I will use, and when', help: 'Honest Map, Professional Identity Statement, reflections on the four KRP skills or the check-in.', items: 1, minWords: 20, rows: 5,
          keywords: [{ match: 'honest map|identity|reflection|check-?in|portfolio', tip: 'name the KRP tool' }, { match: 'when|after|before|every|weekly|sunday|friday|day|shift', tip: 'when you will use it' }, { match: 'because|so that|help', tip: 'why it will help' }] },
      ],
      model: 'WHAT WILL BE HARD\n- Standing on my feet for a full day at the market\n- Not knowing if I will make enough money in the first month\n- Hearing criticism of my food from a customer I do not know\n\nWHAT WILL FEEL LIKE FAILURE AND IS NOT\n- A slow first market day with few sales, because every new business has to find its customers\n- Getting a recipe wrong at a bigger scale, because scaling up takes practice\n\nWHICH KRP TOOL AND WHEN\nI will reread my Honest Map every Sunday night during the first month so I can notice which stress I am carrying and plan for it. After every bad day I will write one line in my reflections on the four KRP skills about what I learned, because that helps me see progress instead of only the bad moment. I will also turn on the optional 90-day check-in email.',
      download: { label: '90-day plan', title: 'My 90-Day Plan', filename: '90-day-plan' },
    },
  ],
};

/* ---------- Saturday Lab 4: ServSafe exam, capstone presentations, certificates ---------- */
ACTIVITIES.w4lab = {
  end: [
    {
      type: 'order', title: 'The order of the day',
      intro: 'Put Lab 4 in the order it happens, first at the top.',
      steps: ['Arrive at the kitchen by 10:00 AM', 'ServSafe Food Handler Certification Exam (10:00 to 11:30)', 'Capstone Concept Brief presentations (11:30 to 12:30)', 'Certificate ceremony and individual review of ServSafe results (12:30 to 1:00)'],
      why: 'Arrive by 10:00, take the proctored exam first, present your brief to the cohort and instructor, then celebrate with the certificate ceremony and see your ServSafe results individually.',
    },
    {
      type: 'choice', title: 'Exam day readiness check',
      items: [
        { q: 'It is Friday evening. What must be true before you walk into the ServSafe exam on Saturday?', opts: ['You have an active exam account and have completed your coursework', 'You have only watched the first week of videos', 'You have an account you plan to create at 10:00 AM', 'You have a printed copy of the practice exam'], ans: 0, why: 'The exam is proctored online, and you must have an active account and completed coursework before you sit for it.' },
        { q: 'Your ride is running late and will get you there at 10:25. What is the best plan?', opts: ['Say nothing and walk in during the exam', 'Leave earlier so you arrive by 10:00, or contact your instructor right away', 'Skip the exam and just come to the presentations', 'Arrive at noon for the ceremony'], ans: 1, why: 'The exam begins at 10:00 AM and arriving by then matters. Plan extra travel time, and tell your instructor immediately if something goes wrong.' },
        { q: 'You cannot remember your login to the exam account. When should you fix it?', opts: ['During the exam', 'After the exam', 'Before Saturday, by checking the account and getting help in time', 'It does not matter, the proctor will handle it'], ans: 2, why: 'An active account is a requirement. Test it before exam day so a password problem does not cost you your seat.' },
      ],
    },
    {
      type: 'reflect', title: 'My presentation outline',
      intro: 'You will present your Concept Brief for 5 to 7 minutes, followed by questions. Write a short outline for each part of your pitch.',
      prompts: [
        { key: 'open', label: 'Opening', help: 'How will you start in the first 30 seconds?', items: 1, minWords: 12, rows: 3,
          keywords: [{ match: 'name|I am|my business|welcome|story', tip: 'say who you are and your business name' }] },
        { key: 'make', label: 'What I make', help: 'Products or service, and what makes them distinctive.', items: 1, minWords: 15, rows: 3,
          keywords: [{ match: 'make|bake|cook|serve|sell', tip: 'what you make' }, { match: 'different|unique|only|special|distinct', tip: 'what makes it distinctive' }] },
        { key: 'who', label: 'Who it is for', help: 'Your target customer and where you reach them.', items: 1, minWords: 12, rows: 3,
          keywords: [{ match: 'customer|people|families|workers|students|neighbors', tip: 'who they are' }, { match: 'market|online|social|school|church|event|reach', tip: 'where you reach them' }] },
        { key: 'price', label: 'My price and why', help: 'A price, plate cost and food cost percentage, in a sentence or two.', items: 1, minWords: 15, rows: 3,
          keywords: [{ match: '\\$|dollar|price', tip: 'a price' }, { match: 'cost|percent|%|margin', tip: 'cost or food cost percentage' }, { match: 'because|so|since', tip: 'why the price makes sense' }] },
        { key: 'step', label: 'My next step', help: 'The one action you will take in the next 30 days.', items: 1, minWords: 12, rows: 3,
          keywords: [{ match: 'will|by|within|next', tip: 'a clear commitment' }, { match: 'call|apply|permit|test|menu|book|visit|ask|sign', tip: 'a specific action' }] },
      ],
      model: 'OPENING\nHello, I am Dana and my business is Grandma’s Table Kitchen. Sunday dinner, any day of the week, and I want to tell you how I will get it to your table.\n\nWHAT I MAKE\nI make small-batch family-style meals like chicken and dumplings, collard greens and cornbread from scratch, with a recipe story card in every bag.\n\nWHO IT IS FOR\nBusy families and older neighbors in Richmond who want a home-cooked dinner. I reach them through church bulletins, a community Facebook group and a neighborhood market table.\n\nMY PRICE AND WHY\nMy family dinner is $8.00 because my plate cost is $2.40, which is a 30 percent food cost, and that leaves room for labor and the rest of my costs.\n\nMY NEXT STEP\nBy the 15th of next month I will call the health department and ask which permit a weekend pop-up needs, and write down the answer and the cost.',
    },
  ],
};
