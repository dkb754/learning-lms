/* Level I quiz bank — DRAFT for instructor review.
 *
 * Written from standard food-safety, costing and culinary knowledge (FDA Food Code / ServSafe Food Handler basics).
 * NOTHING here is shown to students until you publish it: Admin → Quiz Review → Publish.
 * `todo` lines mark questions only YOU can write (your CST specifications, the 25-ingredient library, class-specific
 * standards). They appear in Quiz Review so nothing is invented about proprietary content.
 *
 * To edit a question: change the Q(...) line.   Q(question, correct answer, [three wrong answers], feedback shown after submit)
 * Option order is shuffled deterministically from the question text, so the right answer is not always in the same slot.
 */
function qHash(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function Q(q, right, wrong, feedback) {
  const pos = qHash(q) % (wrong.length + 1);
  const opts = wrong.slice(); opts.splice(pos, 0, right);
  return { q, opts, ans: pos, feedback };
}

const QUIZ_BANK = {
  // ---------------- WEEK 1 · CST Module 1 ----------------
  w1d1: {
    title: 'Quiz 1 · Mise en Place', passPct: 70,
    todo: ['Add 2–3 questions on the CST philosophy and workstation anatomy exactly as you teach them.'],
    questions: [
      Q('"Mise en place" means:', 'Everything in its place: preparing and organizing before you cook', ['Cook everything fast and clean up later', 'A French sauce made from stock', 'The menu of the day'], 'Mise en place is French for "putting in place": the preparation and organization that happens before cooking starts.'),
      Q('The biggest benefit of good mise en place during service is that you can:', 'Work efficiently without stopping to hunt for ingredients or tools', ['Skip tasting your food', 'Cook without a recipe', 'Buy ingredients for less'], 'Everything you need is prepped and within reach, so you keep moving instead of searching.'),
      Q('Before you start any prep, the first step is to:', 'Read the whole recipe or prep list and gather what you need', ['Start cutting the first item you see', 'Turn on every burner', 'Wait for a coworker to tell you what to do'], 'Reading the full list first shows you what you need and in what order to work.'),
      Q('How should you arrange your workstation?', 'Keep the tools and ingredients you use most within easy reach', ['Put everything at the far end of the kitchen', 'Store your knives in the sink', 'Put raw chicken and vegetables on the same board'], 'A station set up around how you actually work saves steps and prevents mistakes.'),
      Q('Why is an organized, clean station part of mise en place?', 'It reduces mistakes and cross-contamination and shows you what is missing', ['It makes the food taste sweeter', 'It is only for inspections', 'It lets you work without handwashing'], 'Order at your station protects food safety and quality and makes gaps obvious.'),
      Q('Which best describes arriving "ready" for a shift?', 'On time, in a clean uniform, hair restrained, with your tools, ready to start', ['On time, then getting dressed after the shift begins', 'A few minutes late with your knife roll left at home', 'Early, but waiting to be asked to set up'], 'Being ready means the work can start the moment the shift does.'),
      Q('What is a damp towel under a cutting board for?', 'To keep the board from sliding while you cut', ['To keep the knife sharp', 'To cool the food', 'To dry your hands'], 'A board that slides is a cut waiting to happen. A damp towel or non-slip mat holds it still.'),
      Q('At the end of a shift, a professional cook:', 'Breaks down and cleans the station, labels and stores product, and restocks for the next person', ['Leaves the station for the next shift to deal with', 'Leaves food out to cool overnight on the counter', 'Cleans only the parts a customer can see'], 'Leaving the station ready for the next cook is part of the job.'),
      Q('Which action shows a professional mindset?', 'Checking the prep list and starting the next task without being told', ['Waiting until someone gives you instructions', 'Skipping labeling because it takes time', 'Arguing about a task in front of the team'], 'Taking initiative and following systems is what chefs look for.'),
      Q('Which item belongs at your station BEFORE you begin cooking?', 'Prepped ingredients, clean tools, labeled containers and a sanitizer bucket', ['Ingredients you plan to prep later', 'Dirty pans from the last shift', 'Personal items such as your phone and bag'], 'Everything you need to cook is prepped and in place before you start.'),
    ],
  },

  w1d2: {
    title: 'Quiz 2 · Knife Skills & Ingredients', passPct: 70,
    todo: ['Add questions on your CST cut specifications (dimensions) and the 25-ingredient library as taught in class.'],
    questions: [
      Q('The safest way to carry a knife is:', 'Point down, blade facing back, held close to your side', ['Point up so people can see it', 'Held out in front of you while you walk', 'In your apron pocket'], 'Carry it low and close, tip down, and call out when you walk through a busy kitchen.'),
      Q('A sharp knife is safer than a dull one because it:', 'Needs less force, so it is less likely to slip', ['Cuts through bone more easily', 'Never needs honing', 'Is lighter to hold'], 'Dull knives need pressure, and pressure is what makes a blade slip.'),
      Q('In the "claw" grip, your guide hand:', 'Curls the fingertips under, with the knuckles guiding the side of the blade', ['Lies flat on top of the food', 'Holds the blade by the spine', 'Stays behind your back'], 'Tucked fingertips keep your fingers out of the blade path.'),
      Q('If a knife starts to fall off the counter, you should:', 'Step back and let it fall', ['Try to catch it', 'Grab it by the blade', 'Kick it away'], 'Never try to catch a falling knife. Step back, then pick it up safely.'),
      Q('What does honing a knife do?', 'Realigns the edge to keep it cutting well between sharpenings', ['Removes a lot of metal to make a new edge', 'Cleans and sanitizes the blade', 'Makes the handle grip better'], 'Honing straightens the edge. Sharpening is what actually removes metal.'),
      Q('Why cut food into uniform pieces?', 'So it cooks evenly and looks consistent', ['So it takes longer to cook', 'So you use more product', 'So you can skip seasoning'], 'Pieces of the same size finish cooking at the same time.'),
      Q('Which of these is the SMALLEST cut?', 'Small dice', ['Large dice', 'Medium dice', 'Rough chop'], 'Large, medium and small dice step down in size; small dice is the finest of the three.'),
      Q('A julienne is:', 'A long, thin matchstick cut', ['A rough chop', 'A thin ribbon cut from rolled leafy herbs', 'A cube cut'], 'Julienne cuts are long thin sticks. Ribbons from rolled leaves are a chiffonade.'),
      Q('A chiffonade is best used for:', 'Leafy herbs and greens, such as basil', ['Hard root vegetables', 'Raw chicken', 'Whole potatoes'], 'Stack and roll the leaves, then slice across the roll into thin ribbons.'),
      Q('How do you steady a round vegetable like an onion or potato before slicing?', 'Cut a thin slice off one side to make a flat, stable base', ['Hold it in the air while you cut', 'Press it against the blade with your thumb', 'Cut it while it rolls'], 'A flat base keeps the food from rolling under the knife.'),
      Q('Why use color-coded cutting boards?', 'To keep raw proteins separate from ready-to-eat foods and prevent cross-contamination', ['To make the kitchen look nicer', 'To tell which knife is sharpest', 'To keep the boards from warping'], 'Separate boards for raw meat, poultry, fish and produce stop pathogens spreading.'),
      Q('After using a knife on raw chicken, you should:', 'Wash, rinse and sanitize it before using it on anything else', ['Wipe it on your apron', 'Rinse it with cold water only', 'Set it aside and use it on vegetables'], 'Any tool that touched a raw protein must be cleaned and sanitized before the next task.'),
      Q('Which of these is a root vegetable?', 'Carrot', ['Celery', 'Bell pepper', 'Cilantro'], 'Carrots grow underground. Celery is a stalk, bell peppers are fruits and cilantro is an herb.'),
      Q('Which of these is in the allium family?', 'Onion', ['Carrot', 'Celery', 'Bell pepper'], 'Onions, garlic, leeks and shallots are alliums.'),
      Q('A classic mirepoix is made from onion, carrot and celery in roughly what proportion?', '2 parts onion : 1 part carrot : 1 part celery', ['1 part onion : 2 parts carrot : 2 parts celery', 'Equal parts of all three plus garlic', '4 parts celery : 1 part onion'], 'The traditional mirepoix ratio is 2:1:1 onion to carrot to celery.'),
    ],
  },

  w1d3: {
    title: 'Quiz 3 · Recipe Execution & Storage', passPct: 70,
    todo: ['Add questions on your CST recipe card format and labeling standard exactly as taught.'],
    questions: [
      Q('A standardized recipe should always list:', 'Yield, portion size, exact ingredient amounts and the method', ['Only the ingredient names', 'The name of the customer', 'The cook\'s favorite music'], 'Standardized recipes produce the same result no matter who cooks them.'),
      Q('A recipe makes 10 portions and you need 30. By what number do you multiply every ingredient?', '3', ['10', '30', '20'], 'Needed yield ÷ recipe yield: 30 ÷ 10 = 3.'),
      Q('How many ounces are in one pound?', '16', ['8', '12', '10'], '1 pound = 16 ounces.'),
      Q('How many quarts are in one gallon?', '4', ['2', '8', '3'], '1 gallon = 4 quarts.'),
      Q('How many teaspoons are in one tablespoon?', '3', ['2', '4', '6'], '1 tablespoon = 3 teaspoons.'),
      Q('FIFO means:', 'First in, first out: use the older product first', ['Fast in, fast out', 'Freeze it first, then organize', 'Fill the fridge with the oldest product at the back'], 'Rotating stock so the oldest product is used first reduces waste and risk.'),
      Q('Ready-to-eat, time/temperature-controlled food kept in the cooler for more than 24 hours should be:', 'Date-marked, and discarded by day 7 at the latest', ['Kept without a date as long as it smells fine', 'Moved to the freezer without labeling', 'Used within a month'], 'Day of preparation counts as day 1. Date marks are how a team knows what is safe to use.'),
      Q('In a cooler, where should raw chicken be stored?', 'On the bottom shelf, below ready-to-eat foods', ['On the top shelf, above ready-to-eat foods', 'Next to the salad bar items', 'Uncovered on the middle shelf'], 'Raw poultry goes lowest so its juices cannot drip onto food that will not be cooked again.'),
      Q('Stored food should be kept at least how far off the floor?', '6 inches', ['1 inch', '2 inches', 'It does not matter if the box is sealed'], 'Six inches lets you clean underneath and keeps product away from floor contamination.'),
      Q('Cold food in the cooler must be held at:', '41°F or lower', ['50°F or lower', '55°F or lower', '65°F or lower'], '41°F or below slows bacterial growth.'),
    ],
  },

  w1d4: {
    title: 'Quiz 4 · Production & Team Communication', passPct: 70,
    todo: ['Add questions on the CST kitchen call list and acknowledgment standard exactly as taught.'],
    questions: [
      Q('A prep list is:', 'A list of the items and quantities to prepare before service', ['A list of customers who ordered', 'A list of coworkers who are late', 'A record of last week\'s sales'], 'It tells you what to prep, how much, and in what order.'),
      Q('When a chef gives you an instruction, a good response is to:', 'Acknowledge it out loud so the caller knows you heard it', ['Nod silently and hope they saw you', 'Say nothing and start working', 'Ask them to repeat it later'], 'A clear acknowledgment closes the loop and prevents mix-ups.'),
      Q('When you walk close behind a coworker who is working, you should say:', '"Behind!"', ['Nothing, so you do not distract them', '"Hurry up!"', '"Move!"'], 'A short, clear warning stops collisions, especially when someone is holding a knife or a hot pan.'),
      Q('You are carrying a hot pan through a busy kitchen. You should:', 'Call "Hot!" so people give you room', ['Walk fast and say nothing', 'Cover your face and run', 'Hand it to the nearest person'], 'Calling it out protects everyone from burns and spills.'),
      Q('Approaching a blind corner with a full tray, you should:', 'Call "Corner!" before you turn', ['Speed up to get through quickly', 'Close your eyes', 'Wait for someone to bump into you'], 'Calling "Corner" warns people you cannot see.'),
      Q('To plan a production timeline, you should:', 'Work backward from service time and start the longest tasks first', ['Start with the easiest tasks', 'Do everything at the last minute', 'Wait to see how busy it gets'], 'Items that take the longest to cook or chill must start first so everything is ready on time.'),
      Q('Which should usually be started first?', 'Something that needs a long cook or chill time, like a braise or a stock', ['Slicing a garnish', 'Wiping down the pass', 'Portioning bread'], 'Long-lead items protect the whole timeline.'),
      Q('If you realize you will not finish a task on time, you should:', 'Tell the chef or team early so the plan can change', ['Say nothing and hope no one notices', 'Rush and skip safety steps', 'Leave it for the next shift without telling them'], 'Early communication lets the team fix a problem before it reaches the customer.'),
      Q('When a chef gives you feedback during service, a professional:', 'Listens, responds respectfully and saves questions for after service', ['Argues until they agree', 'Ignores it', 'Walks away from the station'], 'Service is not the time for debate; ask your questions after.'),
      Q('"Clean as you go" means:', 'Wiping up, putting tools away and disposing of trim while you work', ['Waiting until the end of the shift to clean everything', 'Cleaning only for inspections', 'Having someone else clean after you'], 'A clean station is safer, faster and professional.'),
    ],
  },

  // ---------------- WEEK 2 · ServSafe Food Handler ----------------
  w2d1: {
    title: 'Quiz 5 · Foodborne Illness & Contamination', passPct: 70, todo: [],
    questions: [
      Q('A foodborne illness is:', 'An illness caused by eating contaminated food', ['A cooking technique', 'Another word for a food allergy', 'Something that only happens in restaurants'], 'Foodborne illness happens when people eat food contaminated with pathogens, toxins or chemicals.'),
      Q('What does FAT TOM stand for?', 'Food, Acidity, Time, Temperature, Oxygen, Moisture', ['Fat, Alcohol, Time, Taste, Oil, Mixing', 'Food, Air, Temperature, Texture, Odor, Moisture', 'Fresh, Aged, Tender, Tough, Oily, Moist'], 'These six conditions let bacteria grow, and controlling them stops them.'),
      Q('Which of these is a TCS food (needs time and temperature control)?', 'Cooked rice', ['Dry spaghetti', 'Hard candy', 'Table salt'], 'Cooked starches, dairy, eggs, meat, poultry, fish and cut melons need temperature control.'),
      Q('What are the three categories of food safety hazards?', 'Biological, chemical and physical', ['Hot, cold and wet', 'Raw, cooked and frozen', 'Fresh, canned and dried'], 'Every contamination fits one of these three.'),
      Q('Which is a PHYSICAL hazard?', 'A piece of broken glass in a salad', ['Norovirus on a hand', 'Sanitizer left in a container', 'Salmonella in raw eggs'], 'Glass, metal shavings, bone fragments and similar objects are physical hazards.'),
      Q('Which is a CHEMICAL hazard?', 'Cleaning product left on a prep surface', ['A bone chip in a fish fillet', 'A fingernail in a dish', 'Listeria in deli meat'], 'Cleaners, sanitizers, pesticides and polish are chemical hazards when they reach food.'),
      Q('Which is a virus commonly spread by food handlers\' contaminated hands?', 'Norovirus', ['Salmonella', 'Anisakis', 'Mold'], 'Norovirus is highly contagious and spread by contaminated hands, food and surfaces. Salmonella is a bacterium, Anisakis a parasite and mold a fungus.'),
      Q('Which group is considered high-risk for foodborne illness?', 'Young children and older adults', ['Healthy adults who just ate', 'Only restaurant staff', 'Only people who dine out often'], 'Young children, older adults, pregnant women and people with weakened immune systems are at higher risk.'),
      Q('Bacteria grow fastest in which temperature range?', '41°F to 135°F', ['0°F to 32°F', '150°F to 200°F', 'Below 0°F'], 'This is the temperature danger zone.'),
      Q('Which is NOT one of the major food allergens?', 'Lettuce', ['Peanuts', 'Soybeans', 'Sesame'], 'The nine major allergens are milk, eggs, fish, crustacean shellfish, tree nuts, peanuts, wheat, soybeans and sesame.'),
    ],
  },

  w2d2: {
    title: 'Quiz 6 · Personal Hygiene & Handwashing', passPct: 70, todo: [],
    questions: [
      Q('How long should the whole handwashing process take?', 'About 20 seconds', ['5 seconds', '1 second', '2 minutes'], 'Scrub for 10 to 15 seconds as part of a process that takes about 20 seconds in total.'),
      Q('Handwashing water must be at least:', '100°F', ['60°F', '40°F', 'Cold is best'], 'Warm running water (at least 100°F) with soap removes germs more effectively.'),
      Q('The best way to dry your hands after washing is:', 'A single-use paper towel or an air dryer', ['Your apron', 'A shared cloth towel', 'Letting them drip on the floor'], 'Aprons and shared towels recontaminate clean hands.'),
      Q('You must wash your hands after:', 'Touching raw chicken', ['Reading the schedule', 'Tying your apron strings', 'Walking from one end of the kitchen to the other'], 'Wash after handling raw food, using the restroom, touching your hair or face, sneezing, taking out trash and eating.'),
      Q('Before you put on single-use gloves, you must:', 'Wash your hands', ['Rinse the gloves with water', 'Tape them closed', 'Put on two pairs'], 'Gloves do not replace handwashing. Clean hands go in first.'),
      Q('You should change gloves:', 'When they tear or become contaminated, and between tasks', ['Once a week', 'Only at the end of a shift', 'Never, if they still fit'], 'Gloves are single use. Change them whenever they are torn, contaminated or you switch tasks.'),
      Q('Bare-hand contact with ready-to-eat food is:', 'Not allowed: use tongs, deli paper or gloves', ['Fine if your hands look clean', 'Fine with hand sanitizer alone', 'Required for sandwiches'], 'Ready-to-eat food gets no further cooking, so any contamination goes straight to the customer.'),
      Q('Which symptom must you report to your manager before working?', 'Vomiting or diarrhea', ['A mild headache', 'A new haircut', 'A sore foot'], 'Vomiting, diarrhea, jaundice and sore throat with fever must be reported.'),
      Q('When you have vomiting or diarrhea, you should stay out of food work until you have been symptom-free for:', 'At least 24 hours', ['2 hours', '30 minutes', 'Until your next shift'], 'Staying out until you have been symptom-free for 24 hours protects coworkers and customers.'),
      Q('You cut your finger at work. You should:', 'Treat it, cover it with a bandage and then a glove or finger cot', ['Keep working without covering it', 'Cover it only with a bandage', 'Wash it and ignore it'], 'A bandage alone can fall off. A glove or finger cot over it keeps blood and germs out of food.'),
    ],
  },

  w2d3: {
    title: 'Quiz 7 · Time-Temperature Control & Receiving', passPct: 70, todo: [],
    questions: [
      Q('The temperature danger zone is:', '41°F to 135°F', ['0°F to 41°F', '135°F to 212°F', '70°F to 100°F'], 'Keep cold food at 41°F or below and hot food at 135°F or above.'),
      Q('The minimum internal cooking temperature for poultry is:', '165°F', ['145°F', '135°F', '155°F'], 'Poultry must reach 165°F.'),
      Q('The minimum internal cooking temperature for ground beef is:', '155°F', ['165°F', '135°F', '145°F'], 'Ground meat reaches 155°F because grinding mixes surface bacteria throughout.'),
      Q('The minimum internal cooking temperature for fish and whole cuts of beef or pork is:', '145°F', ['165°F', '135°F', '120°F'], 'Whole-muscle meats and fish reach 145°F.'),
      Q('Hot food must be held at:', '135°F or higher', ['100°F or higher', '120°F or higher', '41°F or higher'], 'Hot holding keeps food above the danger zone.'),
      Q('When cooling hot food, it must go from 135°F to 70°F within:', '2 hours', ['30 minutes', '4 hours', '6 hours'], 'Stage one is 135°F to 70°F in 2 hours, then 70°F to 41°F in another 4 hours.'),
      Q('The total time allowed to cool food from 135°F to 41°F is:', '6 hours', ['2 hours', '4 hours', '12 hours'], 'Two hours for the first stage plus four hours for the second.'),
      Q('Food that is reheated for hot holding must reach:', '165°F within 2 hours', ['135°F within 4 hours', '145°F within 6 hours', '120°F within 1 hour'], 'Reheat quickly so food spends as little time as possible in the danger zone.'),
      Q('Where do you place a thermometer probe to check food temperature?', 'In the thickest part of the food', ['On the surface', 'Against the pan', 'In the thinnest corner'], 'The thickest part heats slowest, so it shows whether the whole item is safe.'),
      Q('Which delivery should you reject?', 'Frozen fish with ice crystals and a puddle of liquid in the box', ['Frozen fish that is solid with no ice crystals', 'Chilled chicken at 38°F in sealed packaging', 'Intact, in-date cartons of eggs'], 'Ice crystals and liquid suggest the food thawed and was refrozen. Also reject damaged packaging, expired dates and signs of pests.'),
    ],
  },

  w2d4: {
    title: 'Quiz 8 · Cleaning, Sanitizing & Facilities', passPct: 70, todo: [],
    questions: [
      Q('Cleaning and sanitizing are different. Sanitizing:', 'Reduces pathogens on a clean surface to safe levels', ['Removes visible dirt', 'Is the same as rinsing', 'Is only needed once a week'], 'Cleaning removes food and dirt. Sanitizing reduces pathogens.'),
      Q('The correct order for a surface is:', 'Clean first, then sanitize', ['Sanitize first, then clean', 'Sanitize only', 'Rinse only'], 'Sanitizer works on clean surfaces, not on dirt.'),
      Q('In a three-compartment sink, the order is:', 'Wash, rinse, sanitize', ['Sanitize, wash, rinse', 'Rinse, sanitize, wash', 'Wash, sanitize, rinse'], 'Then let items air-dry.'),
      Q('After sanitizing, dishes and tools should be:', 'Left to air-dry', ['Dried with a dish towel', 'Dried with your apron', 'Stacked wet right away'], 'Towels can recontaminate sanitized items.'),
      Q('How do you check that your sanitizer is at the right strength?', 'Use test strips', ['Smell it', 'Taste it', 'Look at the color'], 'Test strips measure concentration. Too weak will not sanitize and too strong can be a chemical hazard.'),
      Q('Wiping cloths used on food surfaces between wipes should be stored:', 'In a bucket of sanitizer at the correct strength', ['On the counter', 'In the sink', 'On your shoulder'], 'Keeping cloths in sanitizer prevents spreading germs from surface to surface.'),
      Q('Cleaning chemicals should be stored:', 'Away from and below food and food-contact items', ['Above the food', 'Next to the spices', 'On the prep table'], 'Storing chemicals below and away from food prevents accidental contamination.'),
      Q('To prevent pests, you should:', 'Deny them access, food and shelter', ['Leave food out overnight', 'Leave back doors propped open', 'Keep trash uncovered'], 'Keep trash covered, seal gaps, store food off the floor and clean spills fast.'),
      Q('The handwashing sink should be:', 'Used only for handwashing, and kept stocked with soap, paper towels and warm water', ['Used for dumping mop water', 'Used to wash vegetables', 'Blocked so no one can reach it'], 'It must always be accessible and supplied.'),
      Q('Floors, walls and ceilings in a food area should be:', 'Smooth, durable, non-absorbent and easy to clean', ['Rough and porous', 'Carpeted', 'Painted with a flaky finish'], 'Surfaces that cannot be cleaned hold dirt and pests.'),
    ],
  },

  // ---------------- WEEK 3 · Costing, Menu, Formats, Sourcing ----------------
  w3d1: {
    title: 'Quiz 9 · Costing & Pricing Basics', passPct: 70, todo: [],
    questions: [
      Q('The food cost percentage formula is:', '(Cost of ingredients ÷ Selling price) × 100', ['(Selling price ÷ Cost) × 100', 'Cost + Selling price', '(Selling price − Labor) × 100'], 'Food cost % tells you how much of each sales dollar goes to ingredients.'),
      Q('A plate costs $3.00 to make and sells for $12.00. The food cost percentage is:', '25%', ['30%', '36%', '40%'], '$3.00 ÷ $12.00 = 0.25, or 25%.'),
      Q('"AP" and "EP" stand for:', 'As purchased and edible portion', ['Average price and extra portion', 'Added product and exact price', 'Approved plate and edible price'], 'AP is what you buy. EP is what is left after trimming and cooking.'),
      Q('You buy 10 lb of produce (AP) and 8 lb are usable (EP). The yield percentage is:', '80%', ['8%', '125%', '20%'], 'EP ÷ AP × 100 = 8 ÷ 10 × 100 = 80%.'),
      Q('A product costs $2.00 per AP pound and has an 80% yield. The cost per EP pound is:', '$2.50', ['$1.60', '$2.00', '$3.20'], '$2.00 ÷ 0.80 = $2.50.'),
      Q('Plate cost is:', 'The total cost of every ingredient in one portion', ['Only the main protein', 'The selling price of the plate', 'The cost of the whole batch'], 'Add up everything on the plate, including oil, garnish and spices.'),
      Q('A plate costs $3.00 and you want a 30% food cost. The selling price should be about:', '$10.00', ['$6.00', '$9.00', '$12.00'], '$3.00 ÷ 0.30 = $10.00.'),
      Q('Why include small items like oil, salt and garnish in your plate cost?', 'They add up, and leaving them out understates your true cost', ['They are free', 'They never change', 'Only the main ingredient matters'], 'Small costs left out of every plate become real losses.'),
      Q('The break-even point is where:', 'Total sales equal total costs', ['You earn your highest profit', 'You stop selling', 'Costs are zero'], 'Below it you lose money; above it you earn profit.'),
      Q('Which of these is a FIXED cost?', 'Monthly rent', ['Ingredients for one plate', 'Takeout containers', 'Per-order card fees'], 'Fixed costs stay the same however much you sell. Variable costs rise and fall with sales.'),
    ],
  },

  w3d2: {
    title: 'Quiz 10 · Menu Fundamentals', passPct: 70, todo: [],
    questions: [
      Q('Menu engineering looks at each item\'s:', 'Popularity and profitability', ['Color and shape', 'Cook\'s favorite flavors', 'Number of ingredients'], 'It compares how often an item sells with how much it earns.'),
      Q('A "star" menu item is:', 'High profit and high popularity', ['Low profit and low popularity', 'High profit and low popularity', 'Low profit and high popularity'], 'Stars are your best items: promote and protect them.'),
      Q('A "plowhorse" is:', 'Popular but low profit', ['Unpopular but high profit', 'Unpopular and low profit', 'The most expensive item'], 'Plowhorses sell well but earn little. Consider a small price increase or a cheaper recipe.'),
      Q('A "puzzle" is:', 'High profit but low popularity', ['High profit and high popularity', 'Low profit and high popularity', 'Low profit and low popularity'], 'Puzzles earn well when they sell. Try better names, placement or descriptions.'),
      Q('What is usually done with a "dog" (low profit, low popularity)?', 'Rework, reprice or remove it', ['Promote it heavily', 'Double its portion', 'Put it at the top of the menu'], 'It is taking space, prep time and inventory without earning anything.'),
      Q('Why does consistency matter on a menu?', 'Customers expect the same quality and portion every time', ['It lets you charge more', 'It avoids writing recipes', 'It reduces the need to taste food'], 'Standardized recipes and portions build trust.'),
      Q('Your menu should match your:', 'Equipment, staff skill and space', ['Favorite dishes only', 'Neighbor\'s menu', 'Social media followers'], 'A menu you cannot produce well hurts quality and speed.'),
      Q('A smaller, focused menu usually:', 'Reduces waste and prep complexity', ['Increases waste', 'Requires more equipment', 'Confuses staff'], 'Fewer items means fewer ingredients to buy, store and prep.'),
      Q('A good starting point for pricing a menu item is:', 'Your plate cost, what competitors charge and what customers will pay', ['Whatever you feel like', 'Double the lowest price on the menu', 'The price of the cheapest ingredient'], 'Costs set your floor; the market sets your ceiling.'),
      Q('Your best-selling item is not always your most profitable because:', 'Popularity and profit are different measures', ['Customers never buy profitable items', 'Profit does not matter', 'Best sellers never cost anything'], 'An item can sell a lot and still earn little per plate.'),
    ],
  },

  w3d3: {
    title: 'Quiz 11 · Food Business Formats', passPct: 70, todo: [],
    questions: [
      Q('"Cottage food" in Virginia generally allows you to:', 'Sell certain low-risk foods made in your home kitchen, under exemption rules', ['Sell any food made at home', 'Operate without any rules at all', 'Sell nationwide online without limits'], 'The exemption has limits on which foods you can make and how you can sell them.'),
      Q('Which format usually needs the largest startup investment?', 'A food truck (vehicle, build-out, equipment)', ['A market booth', 'A cottage food business', 'A pop-up using a rented kitchen'], 'A vehicle and the equipment inside it make trucks one of the most expensive options.'),
      Q('A pop-up is best described as:', 'A temporary, event-based sales setup that lets you test your concept', ['A permanent restaurant', 'A delivery-only app', 'A franchise'], 'Pop-ups let you test the food, the price and the customers before committing.'),
      Q('A key challenge of a market booth is:', 'Setting up, transporting and breaking down every time', ['You never meet customers', 'You cannot sell food', 'It needs a permanent building'], 'You carry everything in and out, so planning and packing matter.'),
      Q('Catering usually works from:', 'Orders placed in advance, so you can plan production and reduce waste', ['Walk-in customers only', 'Random guessing', 'Vending machines'], 'Advance orders mean you prep what you actually need.'),
      Q('A shared (commissary) kitchen is:', 'A licensed commercial kitchen you can rent time in', ['A kitchen only for restaurants', 'A home kitchen', 'A food truck'], 'It lets you cook in a licensed space without building your own.'),
      Q('The biggest limit of the cottage food format is:', 'Restrictions on what you can make and how you can sell it', ['No way to make a profit', 'It needs a commercial lease', 'It always needs a truck'], 'Low overhead comes with rules about foods, labeling and sales channels.'),
      Q('A common challenge for a food truck is:', 'Vehicle upkeep, permits and parking rules', ['No equipment is needed', 'There are no customers', 'It cannot move'], 'Trucks must follow rules for where they park and operate, and keep the vehicle running.'),
      Q('The best way to choose a format is to:', 'Match it to your product, customers, money and time', ['Pick whatever is popular', 'Choose the cheapest regardless', 'Copy another business exactly'], 'The right format fits your food, your market and your resources.'),
      Q('"Capital requirement" means:', 'The money needed to start the business', ['The city where you open', 'The number of staff you need', 'The date you open'], 'Capital covers equipment, inventory, permits and early operating costs.'),
    ],
  },

  w3d4: {
    title: 'Quiz 12 · Sourcing, Vendors & Customers', passPct: 70, todo: [],
    questions: [
      Q('Food used in a food business must come from:', 'Approved, regulated sources', ['Any source that is cheap', 'Unlabeled home kitchens', 'Anywhere, as long as it looks fresh'], 'Approved sources are inspected and accountable, which protects your customers.'),
      Q('When comparing suppliers, you should look at:', 'Price, quality, reliability, delivery and minimum order', ['Price only', 'The color of their truck', 'How many emails they send'], 'The cheapest supplier is not the best if they are late or inconsistent.'),
      Q('A "minimum order" is:', 'The smallest amount a supplier will sell or deliver', ['The most you can buy', 'A discount', 'A late fee'], 'A minimum can make a supplier too large for a small business, so ask early.'),
      Q('Which habit helps you negotiate better pricing over time?', 'Order consistently, pay on time and ask about volume discounts', ['Pay late', 'Switch suppliers every week', 'Never ask questions'], 'Suppliers reward reliable customers.'),
      Q('When a delivery arrives, you should:', 'Check it against your order and the invoice', ['Sign without looking', 'Put it away unchecked', 'Open only the top box'], 'Checking quantities, quality and temperatures at the door protects your money and your food safety.'),
      Q('Identifying your customer means:', 'Defining who buys, where they are and what they need', ['Guessing everyone is your customer', 'Copying your competitor\'s customers', 'Only selling to friends'], 'A specific customer makes your menu, price and marketing clearer.'),
      Q('A low-cost way to read demand before you commit is to:', 'Test small batches, take pre-orders or sell at a market', ['Rent a large building first', 'Buy equipment first', 'Assume people will come'], 'Test first, then invest.'),
      Q('Looking at what competitors offer and charge helps you:', 'See where you can be different and price realistically', ['Copy everything exactly', 'Avoid pricing entirely', 'Guarantee sales'], 'Competitor research shows gaps and price ranges.'),
      Q('Buying from local producers can help because:', 'It can mean fresher product and a story customers like, though it may cost more', ['It is always cheaper', 'It never requires checking quality', 'It removes the need for invoices'], 'Local sourcing has benefits and tradeoffs.'),
      Q('Why have a backup supplier?', 'So one late or out-of-stock order does not stop your business', ['To pay twice for everything', 'To confuse your vendors', 'It is not useful'], 'A second source keeps you running when the first one fails.'),
    ],
  },

  // ---------------- WEEK 4 · Permits and exam prep ----------------
  w4d1: {
    title: 'Quiz 13 · Permits & Licensing Intro', passPct: 70,
    todo: ['The brief lists a "Virginia food handler permit". Add or confirm any questions about the permit/card requirements you teach.'],
    questions: [
      Q('Which Virginia agency permits and inspects most restaurants and other retail food establishments?', 'The Virginia Department of Health (through local health departments)', ['The Department of Motor Vehicles', 'The Virginia Lottery', 'The State Fire Marshal only'], 'Local health districts of the Virginia Department of Health handle plan review, permits and inspections.'),
      Q('Which Virginia agency is mainly responsible for home food processing exemptions and food manufacturers?', 'The Virginia Department of Agriculture and Consumer Services (VDACS)', ['The Virginia Department of Health', 'The IRS', 'The Department of Education'], 'VDACS administers the home kitchen exemptions and regulates food manufacturers.'),
      Q('Before opening a new food establishment, you generally need to:', 'Submit plans for review and get your permit before you open', ['Open first and apply later', 'Skip permits if the food is good', 'Wait for an inspector to find you'], 'Plan review before construction and a permit before opening are part of the process.'),
      Q('Health department routine inspections are usually:', 'Unannounced', ['Always announced a month ahead', 'Never done', 'Only done after a complaint'], 'Operators should be ready at all times.'),
      Q('If an inspector finds a serious (priority) violation, you should:', 'Correct it right away, and follow up as required', ['Argue and refuse to fix it', 'Ignore it until the next inspection', 'Close for a year'], 'Serious violations must be corrected immediately or within the time the inspector sets.'),
      Q('Foods sold under the Virginia home kitchen exemption must be labeled:', 'With required information, including a statement that the food was not made in an inspected kitchen', ['With a smiley face', 'Only with a price', 'Not at all'], 'Labels tell customers who made the food and that it was processed without state inspection.'),
      Q('An EIN (Employer Identification Number) is obtained from:', 'The IRS, free of charge', ['The Virginia Lottery', 'A private company for a fee only', 'The health department'], 'Beware of websites that charge for an EIN; the IRS issues them for free.'),
      Q('Permits and licenses:', 'Can expire, so track renewal dates', ['Last forever', 'Never need renewal', 'Are optional once you are open'], 'Missing a renewal can force you to stop operating.'),
      Q('Besides health permits, a business also usually needs:', 'Local business licenses and zoning approval from your city or county', ['Nothing else', 'A pilot\'s license', 'A fishing license'], 'Local rules decide where and how you can operate.'),
      Q('The ServSafe Food Handler certificate shows that you:', 'Completed food safety training and passed the assessment', ['Hold a business license', 'Are a licensed restaurant', 'Own a food truck'], 'It is a training credential. It is not a business permit.'),
    ],
  },

  w4d2: {
    title: 'Quiz 14 · Final Review (ServSafe Food Handler)', passPct: 70, todo: [],
    questions: [
      Q('The temperature danger zone is:', '41°F to 135°F', ['0°F to 41°F', '135°F to 212°F', '70°F to 100°F'], 'Keep cold food at 41°F or below and hot food at 135°F or above.'),
      Q('The minimum internal cooking temperature for poultry is:', '165°F', ['145°F', '135°F', '155°F'], 'Poultry must reach 165°F.'),
      Q('The minimum internal cooking temperature for ground beef is:', '155°F', ['165°F', '135°F', '145°F'], 'Ground meat reaches 155°F.'),
      Q('A complete handwashing takes about:', '20 seconds', ['5 seconds', '1 second', '2 minutes'], 'Scrub 10 to 15 seconds as part of the 20-second process.'),
      Q('Water for handwashing must be at least:', '100°F', ['60°F', '40°F', 'Cold is best'], 'Warm water and soap remove germs best.'),
      Q('Hot food is cooled from 135°F to 70°F within:', '2 hours', ['30 minutes', '4 hours', '6 hours'], 'Then from 70°F to 41°F within 4 more hours.'),
      Q('The total time to cool food from 135°F to 41°F is:', '6 hours', ['2 hours', '4 hours', '12 hours'], 'Two hours plus four hours.'),
      Q('Hot food must be held at:', '135°F or higher', ['100°F or higher', '120°F or higher', '41°F or higher'], 'Hot holding stays above the danger zone.'),
      Q('Cold food must be held at:', '41°F or lower', ['50°F or lower', '55°F or lower', '65°F or lower'], '41°F or below slows bacterial growth.'),
      Q('FAT TOM describes:', 'The six conditions bacteria need to grow', ['A kitchen safety rule for knives', 'A cooking temperature chart', 'A cleaning schedule'], 'Food, Acidity, Time, Temperature, Oxygen, Moisture.'),
      Q('Which food needs time and temperature control?', 'Cooked rice', ['Dry spaghetti', 'Hard candy', 'Table salt'], 'Cooked starches, dairy, eggs, meat, poultry and fish are TCS foods.'),
      Q('The best way to prevent cross-contamination is to:', 'Keep raw foods separate from ready-to-eat foods and clean and sanitize between tasks', ['Use the same board for everything', 'Rinse tools in cold water', 'Wear one pair of gloves all shift'], 'Separate equipment and cleaning between tasks stop pathogens spreading.'),
      Q('In a cooler, which should be stored on the lowest shelf?', 'Raw poultry', ['Ready-to-eat salads', 'Cooked leftovers', 'Fresh fruit'], 'Raw poultry goes lowest so juices cannot drip onto other foods.'),
      Q('Sanitizing:', 'Reduces pathogens on a surface that is already clean', ['Removes visible dirt', 'Is the same as rinsing', 'Is optional'], 'Always clean first, then sanitize.'),
      Q('How do you check sanitizer strength?', 'With test strips', ['By smell', 'By taste', 'By color'], 'Test strips show whether the concentration is right.'),
      Q('You have vomiting or diarrhea. You should:', 'Tell your manager and stay out of food work until symptom-free for 24 hours', ['Work but avoid raw food', 'Wear gloves and keep working', 'Take a short break and return'], 'Reporting and staying away protects everyone.'),
      Q('Single-use gloves should be changed:', 'When torn or contaminated, and between tasks', ['Once a week', 'Only at the end of a shift', 'Never'], 'Wash your hands before you put on a new pair.'),
      Q('Bare-hand contact with ready-to-eat food is:', 'Not allowed: use tongs, deli paper or gloves', ['Fine if your hands look clean', 'Fine with hand sanitizer alone', 'Required for sandwiches'], 'Ready-to-eat food gets no further cooking.'),
      Q('You should reject a delivery that:', 'Shows signs of thawing and refreezing, damaged packaging, pests or expired dates', ['Is cold and in good packaging', 'Arrives early', 'Comes on a clean truck'], 'Check every delivery before you accept and store it.'),
      Q('To prevent pests, you should:', 'Deny them access, food and shelter', ['Leave food out overnight', 'Keep trash uncovered', 'Prop the back door open'], 'Keep the kitchen clean, closed and dry.'),
    ],
  },
};
