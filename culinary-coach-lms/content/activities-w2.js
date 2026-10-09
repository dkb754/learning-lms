/* Week 2 (w2d1 to w2lab): Food Safety Fundamentals for the ServSafe Food Handler exam. */
ACTIVITIES.w2d1 = {
  p1: [
    { type: 'diagram', svg: 'fattom', title: 'FAT TOM: how bacteria grow', caption: 'Food, Acidity, Temperature, Time, Oxygen, Moisture. Take away any one condition and growth slows or stops. Temperature and time are the two you control most on the line.' },
    {
      type: 'match', title: 'Match each FAT TOM letter to its detail',
      intro: 'Choose the detail from the lesson that goes with each condition.',
      options: ['pH 4.6 to 7.5', '41 to 135°F', '4 hours added together', 'Most pathogens need it', 'Water activity above 0.85'],
      rows: [{ label: 'A: Acidity', ans: 0 }, { label: 'T: Temperature', ans: 1 }, { label: 'T: Time', ans: 2 }, { label: 'O: Oxygen', ans: 3 }, { label: 'M: Moisture', ans: 4 }],
      why: 'Acidity is pH 4.6 to 7.5, temperature is 41 to 135°F, time is 4 hours added together, most pathogens need oxygen, and moisture means water activity above 0.85.',
    },
    {
      type: 'fill', title: 'Know your numbers',
      intro: 'Type the number from the lesson.',
      rows: [{ label: 'Lowest temperature of the danger zone', unit: '°F', ans: 41 }, { label: 'Highest temperature of the danger zone', unit: '°F', ans: 135 }, { label: 'Most hours the danger zone time can add up to', unit: 'hours', ans: 4 }, { label: 'Water activity must be above', unit: '', ans: 0.85, tol: 0.001 }],
      why: 'The danger zone is 41 to 135°F. Four hours is the most it can add up to. Bacteria need water activity above 0.85 to grow.',
    },
    {
      type: 'choice', title: 'Apply the ideas',
      items: [
        { q: 'A pan of cooked rice sits on the counter at room temperature for the whole afternoon. Which FAT TOM conditions are helping bacteria grow?', opts: ['Temperature and time, plus the food and moisture already in the rice', 'Only oxygen', 'None, because the rice is cooked', 'Only acidity'], ans: 0, why: 'Cooked rice is food with moisture. Room temperature is inside 41 to 135°F, and hours go by. That combination lets bacteria grow.' },
        { q: 'A nursing home kitchen and a college cafeteria serve the same dish. Why does the nursing home need extra care?', opts: ['Hot food cools faster there', 'Older adults face higher risk of severe illness or death from the same exposure', 'Older adults eat more food', 'The rules are different for older people'], ans: 1, why: 'The elderly, the immunocompromised, pregnant women, infants and young children are high-risk populations. The same exposure can hurt them more.' },
        { q: 'Which list is the set of must-know pathogens for ServSafe?', opts: ['Salmonella Typhi, Shigella, Shiga toxin-producing E. coli, Hepatitis A, Norovirus, Nontyphoidal Salmonella', 'Only Salmonella and E. coli', 'Rust, mold and yeast', 'Chlorine, iodine and quat'], ans: 0, why: 'These are the Big 6 pathogens. Learn all six by name.' },
      ],
    },
  ],
  p2: [
    {
      type: 'match', title: 'Match the contamination type to the example',
      options: ['Biological', 'Chemical', 'Physical', 'Cross-contamination'],
      rows: [{ label: 'Norovirus on a cook’s hands', ans: 0 }, { label: 'Sanitizer stored above the clean plates and dripping', ans: 1 }, { label: 'A bandage falls into the soup', ans: 2 }, { label: 'Raw chicken juice on the board, then lettuce cut on it', ans: 3 }, { label: 'A piece of glass in the ice bin', ans: 2 }],
      why: 'Biological means bacteria, viruses, parasites and fungi. Chemical means cleaners and sanitizers. Physical means objects like glass, bone and bandages. Cross-contamination moves pathogens from one food or surface to another.',
    },
    {
      type: 'choice', title: 'Prevent contamination',
      items: [
        { q: 'Where should chemicals be stored?', opts: ['Above the food so they are easy to reach', 'Below food, away from it', 'Next to the spices', 'Anywhere, if the lids are on'], ans: 1, why: 'Storing chemicals below food means a spill or drip can never land on food.' },
        { q: 'What is the most common pathway for cross-contamination?', opts: ['Raw proteins to ready-to-eat foods through hands, boards or utensils', 'Cooked food to raw food in the oven', 'Sauce to a clean plate', 'Ice to water'], ans: 0, why: 'Ready-to-eat food gets no cook step afterward, so any pathogens it picks up from raw proteins stay on it.' },
        { q: 'A cook wears a ring with stones and a watch while prepping. Which kind of contamination does this risk?', opts: ['Chemical', 'Physical, and jewelry also harbors bacteria', 'None', 'Only biological'], ans: 1, why: 'A stone can fall out and become a physical hazard. Prevention is process-based: no jewelry, covered wounds, equipment inspection.' },
        { q: 'You find a metal shaving in a batch of food from a damaged mixer. What is the best prevention in the future?', opts: ['Hope it does not happen again', 'Inspect equipment before use', 'Add more salt', 'Use more sanitizer'], ans: 1, why: 'Physical contamination is prevented by inspecting equipment before use and keeping it in good repair.' },
      ],
    },
  ],
  p3: [
    {
      type: 'choice', title: 'ServSafe readiness',
      items: [
        { q: 'When should you activate your NRAEF account?', opts: ['The night before the exam', 'This week, if you have not already', 'After the exam', 'Only if you fail'], ans: 1, why: 'An active account lets you use the practice quizzes and track your progress. The practice exam in Lab 2 needs it.' },
        { q: 'You log in to NRAEF and cannot find the practice quiz. What is the best next step?', opts: ['Give up on practicing', 'Use the platform orientation to find it, and ask your instructor if you are still stuck', 'Wait until Lab 4', 'Make a new account every day'], ans: 1, why: 'The orientation shows how to move through modules and quizzes. Asking early keeps you on track.' },
      ],
    },
    {
      type: 'reflect', title: 'Spot your early-warning signals',
      intro: 'Studying for an exam while working can add stress. Noticing it early helps you stay in the program.',
      prompts: [
        { key: 'signals', label: 'Name three early-warning signs that stress is building for you, and one thing you will do about each.', help: 'Think about sleep, mood, focus, and skipping class or study.', items: 1, minWords: 20, rows: 5,
          keywords: [{ match: 'sleep|tired|energy', tip: 'sleep or energy changes' }, { match: 'skip|late|miss|avoid|put off', tip: 'avoiding class or study' }, { match: 'talk|ask|call|plan|schedule|break', tip: 'a specific action you will take' }] },
      ],
      model: 'My early signs are sleeping badly, getting short with my family, and putting off my study time. When I sleep badly I will stop studying by 9 and go to bed. When I get short with people I will take a ten minute walk. When I put off studying I will text my instructor or a classmate and set a time.',
    },
  ],
};

ACTIVITIES.w2d2 = {
  p1: [
    { type: 'diagram', svg: 'handwash', title: 'The handwashing procedure', caption: 'Six steps, at least 20 seconds in all. Scrub hands and arms for 10 to 15 seconds. Use the paper towel to turn off the faucet.' },
    {
      type: 'order', title: 'Put the handwashing steps in order',
      intro: 'First step at the top. Use the arrows.',
      steps: ['Wet hands and arms with warm running water', 'Apply soap', 'Scrub hands and arms vigorously for 10 to 15 seconds', 'Rinse thoroughly', 'Dry with a single-use paper towel', 'Use the towel to turn off the faucet'],
      why: 'Wet, soap, scrub, rinse, dry, then use the towel on the faucet so clean hands do not touch a dirty handle.',
    },
    {
      type: 'choice', title: 'When to wash',
      items: [
        { q: 'You just cut raw chicken and now need to slice tomatoes. What do you do?', opts: ['Wipe your hands on your apron', 'Use hand sanitizer only', 'Wash your hands, and use a clean board and knife', 'Put on gloves over the same hands'], ans: 2, why: 'Hands must be washed after touching raw meat, poultry or seafood. Sanitizer is a supplement, not a substitute.' },
        { q: 'Which is a time you must wash your hands?', opts: ['After touching your hair or face', 'Only at the start of a shift', 'Only when they look dirty', 'Only after using the restroom'], ans: 0, why: 'Also wash before touching food, after the restroom, after garbage, after chemicals and after bussing tables.' },
        { q: 'A coworker says, “I used sanitizer, so I do not need to wash.” What is the best reply?', opts: ['That is fine', 'Sanitizer does not replace washing; it can be used after washing as a supplement', 'Use twice as much sanitizer', 'Only wash on busy days'], ans: 1, why: 'Sanitizer does not remove soil or all pathogens the way soap, friction and water do.' },
      ],
    },
  ],
  p2: [
    {
      type: 'choice', title: 'Gloves, illness and bare hands',
      items: [
        { q: 'A cook has vomiting and diarrhea. What should the cook do?', opts: ['Work the dish pit instead', 'Report it to the manager', 'Wear gloves and keep working', 'Take medicine and stay quiet'], ans: 1, why: 'Employees must report symptoms such as vomiting, diarrhea, jaundice, sore throat with fever and infected wounds.' },
        { q: 'You are wearing gloves and finish handling raw chicken. What now?', opts: ['Keep the same gloves for the salad', 'Change gloves, and wash your hands', 'Rinse the gloves under the tap', 'Put a second pair on top'], ans: 1, why: 'Gloves are single-use. Change them when switching tasks and after raw proteins. Gloves do not remove the need to wash hands.' },
        { q: 'A cook wants to place sliced deli meat on a sandwich with bare hands. The kitchen has no policy on file. Is that allowed?', opts: ['Yes, if the hands look clean', 'No, bare-hand contact with ready-to-eat food is not allowed in most places without an approved policy', 'Yes, on slow days', 'Yes, with sanitizer'], ans: 1, why: 'Use tongs, deli paper or single-use gloves instead unless an approved bare-hand contact policy is on file.' },
        { q: 'You touch your face while wearing gloves. What should you do?', opts: ['Nothing, the gloves protect the food', 'Change the gloves after washing your hands', 'Turn the gloves inside out', 'Spray them with sanitizer'], ans: 1, why: 'Touching your face is a contamination event. Change gloves, and wash your hands.' },
      ],
    },
    {
      type: 'match', title: 'Match the diagnosis or symptom to the action',
      options: ['Report to the manager', 'Excluded from the facility', 'Cover and report'],
      rows: [{ label: 'Diagnosed with Norovirus', ans: 1 }, { label: 'Sore throat with fever', ans: 0 }, { label: 'Diagnosed with Hepatitis A', ans: 1 }, { label: 'Jaundice (yellow skin or eyes)', ans: 0 }, { label: 'An infected wound on the hand', ans: 2 }],
      why: 'Report any symptoms to your manager. Five diagnoses require exclusion: Salmonella Typhi, Shigella, Shiga toxin-producing E. coli, Hepatitis A and Norovirus. An infected wound must be reported and kept covered; your manager decides if you can work.',
    },
  ],
  p3: [
    {
      type: 'reflect', title: 'Spot the violations',
      intro: 'Read the scene, then list what is wrong. Scene: A cook comes in with loose shoulder-length hair and a hat on the counter. She wears a watch, two bracelets, dangling earrings and a chef coat with stains. She has long polished artificial nails. She wears strong perfume and sandals.',
      prompts: [
        { key: 'viol', label: 'List at least four hygiene violations and what the cook should do instead.', help: 'One per line.', items: 4, minWords: 5, rows: 6,
          keywords: [{ match: 'hair|hat|net|restraint', tip: 'hair restraint' }, { match: 'watch|bracelet|earring|jewelry|ring', tip: 'jewelry' }, { match: 'nail|polish|artificial', tip: 'fingernails' }, { match: 'perfume|cologne|shoes|sandal|coat|apron|uniform', tip: 'uniform, shoes or perfume' }] },
      ],
      model: 'Loose hair: tie it back and wear a hat or hair net.\nWatch and bracelets: remove them before food prep.\nDangling earrings: take them out, they can fall in food.\nLong polished artificial nails: keep nails short, clean, unpolished.\nPerfume and sandals: wear no perfume and non-slip closed-toe shoes.',
    },
    {
      type: 'choice', title: 'Hygiene standards check',
      items: [
        { q: 'Which jewelry is allowed during food prep?', opts: ['A watch', 'Dangling earrings', 'A plain band ring', 'Several bracelets'], ans: 2, why: 'Only a plain band is allowed. Other jewelry harbors bacteria and can fall into food.' },
        { q: 'A new hire asks why perfume is not allowed. What do you say?', opts: ['It could transfer to food', 'It is only for looks', 'It stains uniforms', 'It is only for managers'], ans: 0, why: 'Strong scents can transfer to food. A clean uniform, closed-toe non-slip shoes and no perfume are the standard.' },
        { q: 'Which hair covering meets the standard?', opts: ['Hair worn loose', 'A hair net, a hat or tightly secured hair', 'A scarf resting on the shoulder', 'None if it is short'], ans: 1, why: 'No loose hair in any food preparation area.' },
      ],
    },
  ],
};

ACTIVITIES.w2d3 = {
  p1: [
    { type: 'diagram', svg: 'thermometer', title: 'Safe cooking temperatures', caption: 'Poultry 165°F. Ground meat 155°F. Seafood, whole beef and pork, and eggs 145°F. Hot holding 135°F or above. Cold holding 41°F or below.' },
    {
      type: 'match', title: 'Match the food to its minimum internal temperature',
      options: ['165°F', '155°F', '145°F', '135°F'],
      rows: [{ label: 'Roast chicken', ans: 0 }, { label: 'Ground beef for burgers', ans: 1 }, { label: 'Salmon fillet', ans: 2 }, { label: 'Steamed vegetables held hot', ans: 3 }, { label: 'Pork chops (whole cut)', ans: 2 }],
      why: 'Poultry 165°F for 1 second; ground meat 155°F for 15 seconds; seafood, whole cuts of beef and pork, and eggs 145°F for 15 seconds; fruits, vegetables, grains and legumes for hot holding 135°F.',
    },
    {
      type: 'fill', title: 'Cooling and reheating numbers',
      rows: [{ label: 'Cool from 135°F down to 70°F within', unit: 'hours', ans: 2 }, { label: 'Then cool from 70°F to 41°F within another', unit: 'hours', ans: 4 }, { label: 'Reheat food for hot holding to', unit: '°F', ans: 165 }, { label: 'Reheat within', unit: 'hours', ans: 2 }],
      why: 'Two hours to 70°F, then four more to 41°F. Reheated food must reach 165°F within 2 hours.',
    },
    {
      type: 'choice', title: 'Time and temperature scenarios',
      items: [
        { q: 'A pot of soup has been in the danger zone for a total of 5 hours across the shift. What happens?', opts: ['Reheat it and serve', 'Discard it', 'Chill it and keep it for tomorrow', 'Serve it only to staff'], ans: 1, why: 'Four hours is the most time the danger zone can add up to. After that, discard the food.' },
        { q: 'A cook plans to reheat yesterday’s chili in the steam table. Is that right?', opts: ['Yes, steam tables heat quickly', 'No, a steam table only holds temperature; reheat on a stove or oven to 165°F within 2 hours', 'Yes, if the lid is on', 'Yes, to 135°F'], ans: 1, why: 'A steam table cannot raise temperature fast enough. Reheat properly, then hot hold.' },
        { q: 'You need to cool a big pot of stock fast. Which choice helps most?', opts: ['Put the lid on and leave it on the stove', 'Divide it into smaller portions and use an ice-water bath', 'Put the full hot pot in the walk-in', 'Leave it overnight'], ans: 1, why: 'Smaller portions, ice-water baths, ice paddles and blast chillers cool food within the time limits.' },
        { q: 'A chicken breast reads 158°F. What do you do?', opts: ['Serve it', 'Keep cooking to 165°F', 'Cook it to 145°F', 'Rest it and serve'], ans: 1, why: 'All poultry must reach 165°F for 1 second.' },
      ],
    },
  ],
  p2: [
    {
      type: 'order', title: 'Receiving inspection order',
      intro: 'Put the steps of checking a delivery in a sensible order.',
      steps: ['Inspect the delivery before it enters the facility', 'Check temperatures: cold 41°F or below, frozen 0°F or below, hot 135°F or above', 'Check packaging for tears, dents, rust or pests', 'Check frozen goods for large ice crystals, discoloration or off odors', 'Reject anything that fails, and document the rejection in writing', 'Store accepted food right away in the right place'],
      why: 'Inspect before it comes in, check temperature and packaging, look for signs of thawing and refreezing, reject and document, then store.',
    },
    {
      type: 'choice', title: 'Accept or reject?',
      items: [
        { q: 'A delivery of chicken arrives at 48°F. What do you do?', opts: ['Accept it and cook it today', 'Reject it', 'Accept it if it smells fine', 'Freeze it at once'], ans: 1, why: 'Refrigerated food must be 41°F or below. 48°F is wrong temperature, so reject it and document.' },
        { q: 'A case of canned tomatoes has swollen ends on several cans. What do you do?', opts: ['Accept; the contents are sealed', 'Reject those cans', 'Open one to see', 'Use them in sauces'], ans: 1, why: 'Swollen ends, severe dents on seams and leaks are reasons to reject canned goods.' },
        { q: 'Frozen shrimp are at 0°F but have large ice crystals and a faint odor. What does that suggest?', opts: ['They were thawed and refrozen; reject', 'They are fresh', 'This is normal', 'They are ready to cook'], ans: 0, why: 'Large ice crystals, discoloration and off odors are signs of thawing and refreezing.' },
        { q: 'The driver says, “Just sign, I am in a hurry.” Why should you still inspect?', opts: ['You do not need to', 'A delivery accepted without inspection makes your business responsible for what is wrong with it', 'It saves money', 'It is rude not to'], ans: 1, why: 'Once you accept it, the problem is yours.' },
      ],
    },
    {
      type: 'match', title: 'Match each delivery to a decision',
      options: ['Accept', 'Reject'],
      rows: [{ label: 'Milk at 40°F', ans: 0 }, { label: 'Frozen fish at 10°F', ans: 1 }, { label: 'Hot rotisserie chicken at 140°F', ans: 0 }, { label: 'Box with droppings inside', ans: 1 }, { label: 'Eggs past the use-by date', ans: 1 }],
      why: 'Cold must be 41°F or below, frozen 0°F or below, hot TCS food 135°F or above. Pests, and food past the use-by date, are rejected.',
    },
  ],
};

ACTIVITIES.w2d4 = {
  p1: [
    { type: 'diagram', svg: 'sanitize', title: 'Clean first, then sanitize', caption: 'Scrape, wash, rinse, sanitize, air dry. A dirty surface cannot be sanitized because food and dirt block the chemical.' },
    {
      type: 'order', title: 'Put the cleaning sequence in order',
      steps: ['Scrape food off the surface', 'Wash with detergent and hot water', 'Rinse with clean water', 'Sanitize at the correct concentration', 'Air dry'],
      why: 'Scrape, wash, rinse, sanitize, air dry. Never dry with a cloth after sanitizing because that re-contaminates the surface.',
    },
    {
      type: 'match', title: 'Match the sanitizer to its concentration',
      options: ['50 to 100 ppm', '200 to 400 ppm', '12.5 to 25 ppm'],
      rows: [{ label: 'Chlorine', ans: 0 }, { label: 'Quaternary ammonium (quat)', ans: 1 }, { label: 'Iodine', ans: 2 }],
      why: 'Chlorine is 50 to 100 ppm, quat is 200 to 400 ppm and iodine is 12.5 to 25 ppm. Test with strips at the start of each service.',
    },
    {
      type: 'choice', title: 'Cleaning and sanitizing scenarios',
      items: [
        { q: 'A cook sprays sanitizer on a board still covered with raw chicken bits. Why does that fail?', opts: ['Sanitizer expires fast', 'Organic material blocks chemical sanitizers', 'The spray is too cold', 'It works fine'], ans: 1, why: 'Clean first. Sanitizing a dirty surface does not work.' },
        { q: 'At the three-compartment sink, what is the minimum wash temperature?', opts: ['90°F', '100°F', '110°F', '135°F'], ans: 2, why: 'Wash with detergent at 110°F minimum, rinse in clean water, then sanitize. Air dry only.' },
        { q: 'Where should a sanitizing cloth be kept between uses?', opts: ['Dry on the counter', 'In sanitizer solution', 'Over your shoulder', 'In your pocket'], ans: 1, why: 'Cloths stay in sanitizer solution that is tested and changed regularly.' },
        { q: 'When should sanitizer strength be tested?', opts: ['Once a week', 'At the start of each service', 'Only after an inspection', 'Never, if it smells strong'], ans: 1, why: 'Too weak does not kill pathogens. Test with strips at the start of each service.' },
      ],
    },
  ],
  p2: [
    {
      type: 'choice', title: 'Facilities and pests',
      items: [
        { q: 'A cook rinses a bucket of produce in the handwashing sink because the prep sink is full. What is wrong?', opts: ['Nothing', 'Handwashing sinks are used only for handwashing', 'The water is too cold', 'The bucket is too big'], ans: 1, why: 'Handwashing sinks must be accessible, stocked with soap and single-use towels, and used only for handwashing.' },
        { q: 'Which storage is correct for dry goods?', opts: ['On the floor in the corner', '6 inches off the floor', 'Against the back door', 'In open boxes'], ans: 1, why: 'Keep food 6 inches off the floor. It helps cleaning and pest prevention.' },
        { q: 'What sets garbage storage apart from correct practice?', opts: ['Covered, leak-proof, pest-resistant containers emptied often', 'An open bin by the back door', 'Bags stacked beside the prep table', 'A full bin emptied weekly'], ans: 0, why: 'Remove garbage often enough to prevent odors and overflow, and clean the storage area regularly.' },
        { q: 'Which is a sign of pest activity?', opts: ['Droppings and gnaw marks', 'A clean floor', 'A new door sweep', 'A full soap dispenser'], ans: 0, why: 'Also nests, grease marks along walls, and dead insects or rodents.' },
      ],
    },
    {
      type: 'reflect', title: 'Walk the kitchen',
      intro: 'Scene: Boxes of flour sit on the floor by the back door, which has a gap underneath. A mop bucket blocks the handwashing sink and the soap dispenser is empty. The garbage bin is open and overflowing. There are small dark droppings near the wall.',
      prompts: [
        { key: 'fix', label: 'List at least four problems and the fix for each.', help: 'One per line.', items: 4, minWords: 5, rows: 6,
          keywords: [{ match: 'floor|6 inch|shelf', tip: 'food stored off the floor' }, { match: 'sweep|gap|seal|door', tip: 'sealing the door gap' }, { match: 'sink|soap|blocked|towel', tip: 'the handwashing sink' }, { match: 'garbage|bin|cover|lid|empty', tip: 'garbage' }, { match: 'dropping|pest|manager', tip: 'droppings and pest report' }] },
      ],
      model: 'Flour on the floor: store it 6 inches off the floor on a shelf.\nGap under the back door: install a door sweep.\nMop bucket blocking the handwashing sink and no soap: move the bucket and restock soap and towels.\nOverflowing open garbage: use a covered bin and empty it more often.\nDroppings: document it and notify management.',
    },
  ],
  p3: [
    {
      type: 'order', title: 'Respond to a pest sighting',
      intro: 'You see a mouse near the dry storage. Put the response in order.',
      steps: ['Document what you saw and where', 'Notify management', 'Management contacts a licensed pest control operator', 'Do not try to handle it yourself'],
      why: 'Document it, notify management, and contact a licensed pest control operator. Do not attempt DIY pest control in a licensed food facility. IPM puts non-chemical prevention first.',
    },
    {
      type: 'choice', title: 'IPM and inspections',
      items: [
        { q: 'Which approach does Integrated Pest Management put first?', opts: ['Non-chemical methods', 'Spraying every week', 'Traps on the dining room floor', 'Ignoring small sightings'], ans: 0, why: 'IPM is a step-by-step approach that uses non-chemical prevention first, such as sealing gaps and good drainage.' },
        { q: 'A coworker wants to spray bug killer near the prep area. What is the best reply?', opts: ['Go ahead', 'Do not; report it and let management call a licensed pest control operator', 'Spray only at night', 'Spray under the sink only'], ans: 1, why: 'DIY pest control is not allowed in a licensed food facility. Chemicals near food also create a contamination risk.' },
        { q: 'Which is something a health inspector checks?', opts: ['Temperatures, storage order, labeling and handwashing sinks that meet the rules', 'The menu prices', 'The color of the walls', 'Staff hair color'], ans: 0, why: 'Inspectors also check equipment sanitation and pest evidence.' },
        { q: 'What can a failed inspection lead to?', opts: ['Nothing', 'A fine, closure or loss of license', 'A new menu', 'A bonus'], ans: 1, why: 'The stakes are real, so work to standard every shift, not just on inspection day.' },
      ],
    },
  ],
};

ACTIVITIES.w2lab = {
  end: [
    {
      type: 'order', title: 'Practice exam readiness',
      intro: 'Put the Lab 2 day in order, from before you arrive to what you do after.',
      steps: ['Make sure your NRAEF account is active', 'Arrive at Parsley’s Kitchen by 10:00 AM', 'Take the proctored practice exam', 'Review your score individually with the instructor', 'Use the domain breakdown to target your study time', 'Rotate through the kitchen safety stations'],
      why: 'Have an active account before you arrive, be on time, take the practice exam, review your score, then use the domain breakdown to focus study before the Lab 4 exam.',
    },
    {
      type: 'fill', title: 'Temperature check drill',
      intro: 'Type the temperature in °F.',
      rows: [{ label: 'Cook poultry to', unit: '°F', ans: 165 }, { label: 'Cook ground beef to', unit: '°F', ans: 155 }, { label: 'Cook eggs and whole cuts of pork to', unit: '°F', ans: 145 }, { label: 'Cold food must arrive at or below', unit: '°F', ans: 41 }, { label: 'Frozen food must arrive at or below', unit: '°F', ans: 0 }],
      why: 'Poultry 165, ground meat 155, eggs and whole cuts of pork 145, cold 41 or below, frozen 0 or below.',
    },
    {
      type: 'match', title: 'Sanitizer station: match the concentration',
      options: ['50 to 100 ppm', '200 to 400 ppm', '12.5 to 25 ppm'],
      rows: [{ label: 'Chlorine', ans: 0 }, { label: 'Quat', ans: 1 }, { label: 'Iodine', ans: 2 }, { label: 'Test strips are used at the start of each service for chlorine', ans: 0 }],
      why: 'Chlorine 50 to 100 ppm, quat 200 to 400 ppm, iodine 12.5 to 25 ppm. Always test before service.',
    },
    {
      type: 'choice', title: 'Cross-contamination walk-throughs',
      items: [
        { q: 'You cut raw salmon on the blue board, then a cook uses the same knife on a fruit salad. What went wrong?', opts: ['Nothing', 'Cross-contamination from a raw protein to a ready-to-eat food; wash, rinse, sanitize first', 'The board color', 'The fruit was too cold'], ans: 1, why: 'Tools must be cleaned and sanitized between tasks, especially between raw proteins and ready-to-eat foods.' },
        { q: 'In the walk-in, which storage order is safest from top to bottom?', opts: ['Raw chicken on top, ready-to-eat on bottom', 'Ready-to-eat on top, then seafood, whole cuts, ground meat, poultry on the bottom', 'Any order if covered', 'Produce on the floor'], ans: 1, why: 'Store by the cooking temperature needed: ready-to-eat on top, poultry on the bottom, so raw juices never drip on food that gets no more cooking.' },
        { q: 'A cook handles raw ground beef, then picks up buns with the same gloves. What should happen?', opts: ['Continue', 'Change gloves after washing hands', 'Wipe the gloves', 'Add sanitizer to the buns'], ans: 1, why: 'Gloves must be changed after raw proteins, and hands washed.' },
        { q: 'You wipe a counter with a dry cloth that has been lying on the counter all shift. What is the problem?', opts: ['None', 'Cloths should be kept in tested sanitizer solution', 'The cloth is too big', 'The counter is wet'], ans: 1, why: 'A dry cloth on the counter spreads pathogens. Keep cloths in sanitizer solution that is tested and changed.' },
      ],
    },
    {
      type: 'reflect', title: 'My weakest domain and my plan',
      intro: 'After your practice exam and the domain breakdown, write your plan for the Lab 4 exam. If you are not sure yet, pick the topic you find hardest.',
      prompts: [
        { key: 'plan', label: 'Name your weakest domain, why it is hard for you, and exactly how you will improve it before the Lab 4 exam.', help: 'Include what you will study, when, and how you will check your progress.', items: 1, minWords: 30, rows: 7,
          keywords: [{ match: 'weak|hard|struggle|missed|low', tip: 'which domain and why it is hard' }, { match: 'quiz|practice|flash|review|read|study', tip: 'what you will study or practice' }, { match: 'week|day|night|morning|schedule|minutes|hour', tip: 'when you will do it' }] },
      ],
      model: 'My weakest domain was time and temperature control. I mixed up the cooking temperatures for ground meat and whole cuts. Before the Lab 4 exam I will make flash cards for every temperature and cooling time and review them for 15 minutes each morning. I will redo the NRAEF practice quiz on that domain every Sunday and ask my instructor about anything I still miss.',
    },
  ],
};
