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
    todo: ["Add 2–3 questions on the CST philosophy exactly as you teach it (the lesson text is now in; your own wording may differ)."],
    questions: [
      Q('"Mise en place" means:', 'Everything in its place: preparing and organizing before you cook', ['Cook everything fast and clean up later', 'A French sauce made from stock', 'The menu of the day'], 'Mise en place is French for "putting in place": the preparation and organization that happens before cooking starts.'),
      Q('The biggest benefit of good mise en place during service is that you can:', 'Work efficiently without stopping to hunt for ingredients or tools', ['Skip tasting your food', 'Cook without a recipe', 'Buy ingredients for less'], 'Everything you need is prepped and within reach, so you keep moving instead of searching.'),
      Q('Before you start any prep, the first step is to:', 'Read the whole recipe or prep list and gather what you need', ['Start cutting the first item you see', 'Turn on every burner', 'Wait for a coworker to tell you what to do'], 'Reading the full list first shows you what you need and in what order to work.'),
      Q('How should you arrange your workstation?', 'Keep the tools and ingredients you use most within easy reach', ['Put everything at the far end of the kitchen', 'Store your knives in the sink', 'Put raw chicken and vegetables on the same board'], 'A station set up around how you actually work saves steps and prevents mistakes.'),
      Q('Why is an organized, clean station part of mise en place?', 'It reduces mistakes and cross-contamination and shows you what is missing', ['It makes the food taste sweeter', 'It is only for inspections', 'It lets you work without handwashing'], 'Order at your station protects food safety and quality and makes gaps obvious.'),
      Q("What must a mise en place container be labeled with?", "Ingredient name, date prepped, use-by date and your initials", ["Only the ingredient name", "The price you paid for it", "Nothing: you will remember what is in it"], "Every prepped container carries its name, prep date, use-by date and initials so anyone can read it at a glance."),
      Q("How should the towel at your station be used?", "Kept damp on your left side, used to wipe the board between cuts, never to dry your hands", ["Kept dry and shared with the person next to you", "Used to dry your hands and the board", "Left on the floor within reach"], "A damp, personal towel wipes the board between cuts. It is never shared, never on the floor and not for drying hands."),
      Q('At the end of a shift, a professional cook:', 'Breaks down and cleans the station, labels and stores product, and restocks for the next person', ['Leaves the station for the next shift to deal with', 'Leaves food out to cool overnight on the counter', 'Cleans only the parts a customer can see'], 'Leaving the station ready for the next cook is part of the job.'),
      Q("Where does the waste bowl go?", "At the top right of the cutting board", ["Under the cutting board", "Across the kitchen by the sink", "On the stove next to your pan"], "A waste bowl at the top right of the board keeps trim moving off the board without cross-contamination."),
      Q("Which cutting board color is for raw poultry?", "Yellow", ["Green", "White", "Blue"], "Red = raw proteins, green = produce, yellow = poultry, white = ready-to-eat, blue = seafood. Color-coding keeps raw food away from ready-to-eat food."),
    ],
  },

  w1d2: {
    title: 'Quiz 2 · Knife Skills & Ingredients', passPct: 70,
    todo: ["Check the questions against how you teach the 25-ingredient library (storage temperatures, shelf life)."],
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
      Q("What are the dimensions of a julienne?", "About 1/8 inch × 1/8 inch × 2 to 2½ inches", ["3/4 inch cubes", "Thin ribbons rolled and sliced", "Angled, irregular pieces"], "Julienne is a matchstick cut: 1/8\" × 1/8\" × 2–2½\". Stir-fry and salad prep use it."),
      Q('Why use color-coded cutting boards?', 'To keep raw proteins separate from ready-to-eat foods and prevent cross-contamination', ['To make the kitchen look nicer', 'To tell which knife is sharpest', 'To keep the boards from warping'], 'Separate boards for raw meat, poultry, fish and produce stop pathogens spreading.'),
      Q('After using a knife on raw chicken, you should:', 'Wash, rinse and sanitize it before using it on anything else', ['Wipe it on your apron', 'Rinse it with cold water only', 'Set it aside and use it on vegetables'], 'Any tool that touched a raw protein must be cleaned and sanitized before the next task.'),
      Q("What are the dimensions of a large dice?", "3/4 inch × 3/4 inch × 3/4 inch", ["1/2 inch cubes", "1/4 inch cubes", "1/8 inch cubes"], "Large dice is 3/4\", medium 1/2\", small dice (brunoise) 1/4\" and fine brunoise 1/8\"."),
      Q('Which of these is in the allium family?', 'Onion', ['Carrot', 'Celery', 'Bell pepper'], 'Onions, garlic, leeks and shallots are alliums.'),
      Q("Which grip does the lesson call non-negotiable for the knife hand?", "The pinch grip: index finger and thumb pinch the blade at the bolster", ["Holding only the end of the handle", "Gripping the spine with your thumb on top", "Any grip that feels comfortable"], "The pinch grip is the only safe grip at production speed."),
    ],
  },

  w1d3: {
    title: 'Quiz 3 · Recipe Execution & Prep Lists', passPct: 70,
    todo: ["Add questions on your CST recipe card format exactly as taught (the lesson lists the standard components)."],
    questions: [
      Q('A standardized recipe should always list:', 'Yield, portion size, exact ingredient amounts and the method', ['Only the ingredient names', 'The name of the customer', 'The cook\'s favorite music'], 'Standardized recipes produce the same result no matter who cooks them.'),
      Q('A recipe makes 10 portions and you need 30. By what number do you multiply every ingredient?', '3', ['10', '30', '20'], 'Needed yield ÷ recipe yield: 30 ÷ 10 = 3.'),
      Q('How many ounces are in one pound?', '16', ['8', '12', '10'], '1 pound = 16 ounces.'),
      Q('How many quarts are in one gallon?', '4', ['2', '8', '3'], '1 gallon = 4 quarts.'),
      Q('How many teaspoons are in one tablespoon?', '3', ['2', '4', '6'], '1 tablespoon = 3 teaspoons.'),
      Q("Which of these is one of the Big 9 allergens?", "Sesame", ["Celery", "Corn", "Garlic"], "The Big 9 are milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soy and sesame."),
      Q("Allergen flags in a standardized recipe are:", "Mandatory: every recipe identifies the Big 9 allergens it contains", ["Optional, added only when a customer asks", "Only needed for desserts", "Only needed for catering"], "Every standardized recipe must flag the Big 9 allergens it contains."),
      Q("1 lb of onion (as purchased) does not give you 1 lb of usable onion because of:", "Trimming loss: you must account for yield in food cost", ["Rounding errors in the scale", "Water the onion absorbs", "Nothing: they weigh the same"], "Peeling and trimming reduce the edible portion. Yield percentage must be built into food cost."),
      Q("When building a prep list, which items go at the TOP?", "Time-sensitive items, such as long cooks or extended marinades", ["Items that must be prepped right before service", "The easiest items", "Items grouped alphabetically"], "Time-sensitive items first, temperature-sensitive items last, and group the prep by station."),
      Q("A prep list should be organized so that:", "Tasks are grouped by station and every container is labeled", ["Tasks are scattered in the order you think of them", "Only the chef sees it", "Labels are added later if there is time"], "Group by station and label everything you produce."),
    ],
  },

  w1d4: {
    title: 'Quiz 4 · Storage, Safety & Kitchen Calls', passPct: 70,
    todo: ["Add questions on any additional CST calls or acknowledgment standards you teach beyond the seven in the lesson."],
    questions: [
      Q("The temperature danger zone is:", "41°F to 135°F", ["0°F to 41°F", "135°F to 212°F", "70°F to 100°F"], "Bacteria multiply rapidly between 41°F and 135°F, and time spent in the zone adds up."),
      Q("Safe holding temperatures are:", "Cold foods at or below 41°F, hot foods at or above 135°F", ["Cold at 50°F, hot at 100°F", "Cold at or below 60°F, hot at or above 120°F", "Any temperature if the food is covered"], "Hold cold at 41°F or below and hot at 135°F or above."),
      Q("FIFO means:", "First in, first out: older product moves to the front and is used first", ["Fresh ingredients first on the menu", "Fish in, fish out", "Freeze it and forget it"], "Older product to the front, newer to the back, and label everything."),
      Q("In a walk-in cooler, which food is stored on the LOWEST shelf?", "Whole and ground poultry", ["Ready-to-eat foods", "Whole fish", "Whole beef and pork"], "From top to bottom: ready-to-eat, whole fish, whole beef and pork, ground meat and fish, whole and ground poultry."),
      Q("In a walk-in cooler, which food is stored on the TOP shelf?", "Ready-to-eat foods", ["Raw poultry", "Ground beef", "Whole fish"], "Ready-to-eat foods go on top so raw juices cannot drip onto them."),
      Q("Which practice prevents cross-contamination?", "Color-coded boards, handwashing between tasks and no bare-hand contact with ready-to-eat foods", ["Using one board for everything and wiping it at the end of the day", "Wearing the same gloves all shift", "Rinsing the board with cold water between tasks"], "Dedicated boards, handwashing, correct glove use and no bare-hand contact with ready-to-eat food."),
      Q("Every prepped item must carry:", "A preparation date, a use-by date and your initials", ["Only your initials", "Only the price", "Nothing if it will be used today"], "Date labeling lets anyone tell how old a product is."),
      Q("You are moving behind another cook. You say:", "\"Behind!\"", ["Nothing: they can hear you", "\"Fire!\"", "\"86!\""], "Announce your movement behind another cook every time, without exception."),
      Q("You are carrying a knife through a shared space. You say:", "\"Sharp!\"", ["\"Heard!\"", "\"All day!\"", "Nothing if the blade points down"], "Call \"sharp\" any time a knife or sharp object moves through a shared space."),
      Q("Approaching a blind corner with a full tray, you should:", "Call \"Corner!\" before you turn", ["Speed up to clear it fast", "Say nothing and keep to the wall", "Call \"Fire!\""], "Announce before turning a blind corner while carrying anything."),
      Q("The chef gives you a direction. The correct response is:", "\"Heard!\"", ["A nod without speaking", "\"Behind!\"", "Wait and ask someone else to repeat it"], "\"Heard\" confirms the message was received."),
      Q("The call \"86\" means:", "An item has run out and is no longer available for service", ["Start cooking a dish now", "The total count of a dish on order", "Table 86 needs service"], "86 = the item is out and cannot be served."),
      Q("\"All day\" refers to:", "The total count of a dish currently on order across all open tickets", ["The kitchen stays open all day", "A dish that takes all day to cook", "The end of service"], "\"Three all day\" = three of that dish across every open ticket."),
      Q("The call \"Fire\" means:", "Begin cooking a dish now", ["An emergency: leave the building", "The dish is ready to plate", "Turn off the grill"], "\"Fire\" tells the station to start cooking the dish."),
      Q("If you realize you will not finish a task on time, you should:", "Tell the chef or team early so the plan can change", ["Hope nobody notices", "Rush and skip safety steps", "Wait until service starts"], "Early communication lets the team adjust the plan."),
    ],
  },

  // ---------------- WEEK 2 · ServSafe Food Handler ----------------
  w2d1: {
    title: 'Quiz 5 · Foodborne Illness & Contamination', passPct: 70, todo: [],
    questions: [
      Q('A foodborne illness is:', 'An illness caused by eating contaminated food', ['A cooking technique', 'Another word for a food allergy', 'Something that only happens in restaurants'], 'Foodborne illness happens when people eat food contaminated with pathogens, toxins or chemicals.'),
      Q('What does FAT TOM stand for?', 'Food, Acidity, Time, Temperature, Oxygen, Moisture', ['Fat, Alcohol, Time, Taste, Oil, Mixing', 'Food, Air, Temperature, Texture, Odor, Moisture', 'Fresh, Aged, Tender, Tough, Oily, Moist'], 'These six conditions let bacteria grow, and controlling them stops them.'),
      Q("Which of these is one of the Big 6 pathogens?", "Shigella", ["Listeria monocytogenes", "Clostridium botulinum", "Bacillus cereus"], "The Big 6: Salmonella Typhi, nontyphoidal Salmonella, Shigella, Shiga toxin-producing E. coli, Hepatitis A and Norovirus."),
      Q('What are the three categories of food safety hazards?', 'Biological, chemical and physical', ['Hot, cold and wet', 'Raw, cooked and frozen', 'Fresh, canned and dried'], 'Every contamination fits one of these three.'),
      Q('Which is a PHYSICAL hazard?', 'A piece of broken glass in a salad', ['Norovirus on a hand', 'Sanitizer left in a container', 'Salmonella in raw eggs'], 'Glass, metal shavings, bone fragments and similar objects are physical hazards.'),
      Q('Which is a CHEMICAL hazard?', 'Cleaning product left on a prep surface', ['A bone chip in a fish fillet', 'A fingernail in a dish', 'Listeria in deli meat'], 'Cleaners, sanitizers, pesticides and polish are chemical hazards when they reach food.'),
      Q('Which is a virus commonly spread by food handlers\' contaminated hands?', 'Norovirus', ['Salmonella', 'Anisakis', 'Mold'], 'Norovirus is highly contagious and spread by contaminated hands, food and surfaces. Salmonella is a bacterium, Anisakis a parasite and mold a fungus.'),
      Q('Which group is considered high-risk for foodborne illness?', 'Young children and older adults', ['Healthy adults who just ate', 'Only restaurant staff', 'Only people who dine out often'], 'Young children, older adults, pregnant women and people with weakened immune systems are at higher risk.'),
      Q('Bacteria grow fastest in which temperature range?', '41°F to 135°F', ['0°F to 32°F', '150°F to 200°F', 'Below 0°F'], 'This is the temperature danger zone.'),
      Q("What is the most common pathway for cross-contamination?", "Raw proteins to ready-to-eat foods via hands, boards or utensils", ["Cooked food to raw food by steam", "Sanitizer to food", "Cold air in the walk-in"], "Hands, boards and utensils carry pathogens from raw proteins to ready-to-eat food."),
    ],
  },

  w2d2: {
    title: 'Quiz 6 · Personal Hygiene & Handwashing', passPct: 70, todo: [],
    questions: [
      Q('How long should the whole handwashing process take?', 'About 20 seconds', ['5 seconds', '1 second', '2 minutes'], 'Scrub for 10 to 15 seconds as part of a process that takes about 20 seconds in total.'),
      Q("Hand sanitizer:", "Is a supplement to handwashing, not a substitute", ["Replaces handwashing when you are busy", "Is required instead of soap", "Works on visibly dirty hands"], "Sanitizer never replaces handwashing."),
      Q('The best way to dry your hands after washing is:', 'A single-use paper towel or an air dryer', ['Your apron', 'A shared cloth towel', 'Letting them drip on the floor'], 'Aprons and shared towels recontaminate clean hands.'),
      Q('You must wash your hands after:', 'Touching raw chicken', ['Reading the schedule', 'Tying your apron strings', 'Walking from one end of the kitchen to the other'], 'Wash after handling raw food, using the restroom, touching your hair or face, sneezing, taking out trash and eating.'),
      Q('Before you put on single-use gloves, you must:', 'Wash your hands', ['Rinse the gloves with water', 'Tape them closed', 'Put on two pairs'], 'Gloves do not replace handwashing. Clean hands go in first.'),
      Q('You should change gloves:', 'When they tear or become contaminated, and between tasks', ['Once a week', 'Only at the end of a shift', 'Never, if they still fit'], 'Gloves are single use. Change them whenever they are torn, contaminated or you switch tasks.'),
      Q('Bare-hand contact with ready-to-eat food is:', 'Not allowed: use tongs, deli paper or gloves', ['Fine if your hands look clean', 'Fine with hand sanitizer alone', 'Required for sandwiches'], 'Ready-to-eat food gets no further cooking, so any contamination goes straight to the customer.'),
      Q('Which symptom must you report to your manager before working?', 'Vomiting or diarrhea', ['A mild headache', 'A new haircut', 'A sore foot'], 'Vomiting, diarrhea, jaundice and sore throat with fever must be reported.'),
      Q("Which of these diagnoses requires you to be excluded from the facility?", "Hepatitis A", ["A common cold", "Seasonal allergies", "A sprained wrist"], "Five diagnoses require exclusion: Salmonella Typhi, Shigella, Shiga toxin-producing E. coli, Hepatitis A and Norovirus."),
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
      Q("The correct chlorine sanitizer concentration range is:", "50 to 100 ppm", ["500 to 1000 ppm", "5 to 10 ppm", "1000 to 2000 ppm"], "Chlorine 50–100 ppm, quaternary ammonium 200–400 ppm, iodine 12.5–25 ppm. Test with strips at the start of each service."),
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
    title: 'Quiz 11 · Food Business Formats & Sourcing', passPct: 70, todo: [],
    questions: [
      Q("Virginia cottage food law generally allows you to sell:", "Non-TCS foods made at home directly to consumers", ["Any food, including TCS foods, made at home", "Only food made in a commissary", "Only packaged food bought wholesale"], "TCS (time/temperature-controlled) foods require a licensed commissary kitchen."),
      Q("Which format usually needs the largest startup investment?", "A food truck", ["A farmers market booth", "A pop-up", "Cottage food sales"], "A built truck costs roughly $50,000–$150,000 before ongoing costs."),
      Q("A pop-up food operation requires:", "A temporary food establishment permit from the local health department", ["No permit if it lasts one day", "A cottage food label only", "A mobile retail license"], "Pop-ups need a temporary food establishment permit."),
      Q("Catering requires:", "A licensed kitchen and food handler permits for all staff", ["Only a home kitchen", "Only a business license", "Nothing if events are small"], "Higher revenue per event, but higher production complexity and licensing."),
      Q("Which license does Virginia require for a food truck?", "A Mobile Retail Food Establishment license", ["A cottage food exemption", "A farmers market vendor card", "No license if parked on private land"], "Vehicle maintenance, fuel and commissary costs are ongoing on top of the license."),
      Q("TCS foods made for sale must be produced in:", "A licensed commissary kitchen", ["A home kitchen", "Any kitchen with a sink", "A rented storage unit"], "Cottage food law covers non-TCS foods only."),
      Q("Compared with local farms, wholesale suppliers such as Restaurant Depot or Sysco usually offer:", "Lower per-unit costs but require volume", ["Higher cost and better storytelling", "No minimums", "Free delivery on any order"], "Local farms and specialty vendors cost more but bring quality and storytelling value."),
      Q("Which habit helps you get better pricing from a vendor over time?", "Pay on time, share your volume needs in advance and give feedback", ["Pay late to keep cash on hand", "Switch vendors every order", "Never ask about case pricing"], "Good vendor relationships create price flexibility. Ask about case pricing and keep multiple vendors."),
      Q("A farmers market booth is described as:", "A low-capital entry point with direct customer feedback, often under $1,000 to start", ["The most expensive format", "A format that needs a built truck", "A format with no customer contact"], "Tent, tables, display, signage, packaging and market fees can total under $1,000."),
      Q("The best way to choose a format is to:", "Match it to your product, customers, money and time", ["Copy the most popular format", "Choose the cheapest regardless of product", "Choose the format with the most paperwork"], "Product, customer, capital and time decide the format."),
    ],
  },

  w3d4: {
    title: 'Quiz 12 · Customers, Market & Permits', passPct: 70, todo: [],
    questions: [
      Q("Identifying your customer means:", "Defining age range, income, geography, values and where they currently buy what you sell", ["Deciding that everyone is your customer", "Choosing the price first", "Asking only family and friends"], "Define the customer specifically before you commit to a product."),
      Q("The best way to read demand before you commit is to:", "Attend the market where you plan to sell and observe what sells out and what sits", ["Build the product first and then look for a customer", "Guess based on what you like", "Copy a menu from another city"], "Do not build a product and then look for a customer."),
      Q("A customer at a $5 farmers market expects:", "About $5 items: price must align with the customer and setting", ["$14 items", "Items priced by the chef's preference", "Free samples only"], "Same product, different customer and setting, different price point and margin."),
      Q("At a curated food festival customers will typically expect:", "Higher price points, around $14 items", ["$2 items", "No pricing", "Only free items"], "Pricing must match the customer and setting."),
      Q("Business registration in Virginia is done through:", "The Virginia State Corporation Commission", ["The IRS only", "The county fair board", "The farmers market manager"], "Register your business name with the SCC."),
      Q("An LLC provides:", "Liability protection (filing fee about $100)", ["A guarantee of profit", "Exemption from health inspection", "Free permits"], "An LLC protects your personal assets from business liabilities."),
      Q("Any food business operating from a commercial kitchen or selling non-cottage products must:", "Pass a health department inspection before opening", ["Open first and call the inspector later", "Skip inspection if it is a pop-up", "Wait for a customer complaint"], "Inspection comes before opening."),
      Q("VDACS regulates:", "Cottage food operations, farmers market vendors and certain food products", ["Only restaurants", "Only food trucks", "Only grocery chains"], "Check product-specific requirements with VDACS."),
      Q("According to the lesson, a Virginia food handler permit is required for:", "Anyone who handles open food in a food service establishment", ["Only managers", "Only caterers", "Nobody"], "Obtained through the local health department or an approved training program."),
      Q("Looking at what competitors offer and charge helps you:", "See where you can be different and price realistically", ["Copy them exactly", "Ignore your own costs", "Avoid research"], "Run the market price check against your own cost math."),
    ],
  },

  // ---------------- WEEK 4 · Permits and exam prep ----------------
  w4d1: {
    title: 'Quiz 13 · Permits & Licensing Intro', passPct: 70,
    todo: [],
    questions: [
      Q('Which Virginia agency permits and inspects most restaurants and other retail food establishments?', 'The Virginia Department of Health (through local health departments)', ['The Department of Motor Vehicles', 'The Virginia Lottery', 'The State Fire Marshal only'], 'Local health districts of the Virginia Department of Health handle plan review, permits and inspections.'),
      Q('Which Virginia agency is mainly responsible for home food processing exemptions and food manufacturers?', 'The Virginia Department of Agriculture and Consumer Services (VDACS)', ['The Virginia Department of Health', 'The IRS', 'The Department of Education'], 'VDACS administers the home kitchen exemptions and regulates food manufacturers.'),
      Q('Before opening a new food establishment, you generally need to:', 'Submit plans for review and get your permit before you open', ['Open first and apply later', 'Skip permits if the food is good', 'Wait for an inspector to find you'], 'Plan review before construction and a permit before opening are part of the process.'),
      Q('Health department routine inspections are usually:', 'Unannounced', ['Always announced a month ahead', 'Never done', 'Only done after a complaint'], 'Operators should be ready at all times.'),
      Q('If an inspector finds a serious (priority) violation, you should:', 'Correct it right away, and follow up as required', ['Argue and refuse to fix it', 'Ignore it until the next inspection', 'Close for a year'], 'Serious violations must be corrected immediately or within the time the inspector sets.'),
      Q('Foods sold under the Virginia home kitchen exemption must be labeled:', 'With required information, including a statement that the food was not made in an inspected kitchen', ['With a smiley face', 'Only with a price', 'Not at all'], 'Labels tell customers who made the food and that it was processed without state inspection.'),
      Q("Commissary requirements: TCS food production for sale must be done:", "In a licensed commissary kitchen", ["At home under cottage food law", "In any kitchen with a sink", "On a market table"], "Cottage food law covers non-TCS foods only; TCS production needs a licensed kitchen."),
      Q('Permits and licenses:', 'Can expire, so track renewal dates', ['Last forever', 'Never need renewal', 'Are optional once you are open'], 'Missing a renewal can force you to stop operating.'),
      Q('Besides health permits, a business also usually needs:', 'Local business licenses and zoning approval from your city or county', ['Nothing else', 'A pilot\'s license', 'A fishing license'], 'Local rules decide where and how you can operate.'),
      Q("Cottage food law limits include:", "Restrictions on what you can make (non-TCS) and how you can sell it", ["No limits at all", "Only a limit on price", "A requirement to use a truck"], "Know the limits before you build a concept around cottage food."),
    ],
  },

  w4d2: {
    title: 'Quiz 14 · Final Review (ServSafe Food Handler)', passPct: 70, todo: [],
    questions: [
      Q('The temperature danger zone is:', '41°F to 135°F', ['0°F to 41°F', '135°F to 212°F', '70°F to 100°F'], 'Keep cold food at 41°F or below and hot food at 135°F or above.'),
      Q('The minimum internal cooking temperature for poultry is:', '165°F', ['145°F', '135°F', '155°F'], 'Poultry must reach 165°F.'),
      Q('The minimum internal cooking temperature for ground beef is:', '155°F', ['165°F', '135°F', '145°F'], 'Ground meat reaches 155°F.'),
      Q('A complete handwashing takes about:', '20 seconds', ['5 seconds', '1 second', '2 minutes'], 'Scrub 10 to 15 seconds as part of the 20-second process.'),
      Q("Hand sanitizer:", "Is a supplement to handwashing, not a substitute", ["Replaces handwashing when busy", "Works on visibly dirty hands", "Is required instead of soap"], "Sanitizer never replaces handwashing."),
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
      Q("You have vomiting or diarrhea. You should:", "Report it to your manager before working", ["Work and wear gloves", "Tell nobody", "Work only the dish station"], "Report symptoms to your manager. Five diagnoses require exclusion from the facility."),
      Q('Single-use gloves should be changed:', 'When torn or contaminated, and between tasks', ['Once a week', 'Only at the end of a shift', 'Never'], 'Wash your hands before you put on a new pair.'),
      Q('Bare-hand contact with ready-to-eat food is:', 'Not allowed: use tongs, deli paper or gloves', ['Fine if your hands look clean', 'Fine with hand sanitizer alone', 'Required for sandwiches'], 'Ready-to-eat food gets no further cooking.'),
      Q('You should reject a delivery that:', 'Shows signs of thawing and refreezing, damaged packaging, pests or expired dates', ['Is cold and in good packaging', 'Arrives early', 'Comes on a clean truck'], 'Check every delivery before you accept and store it.'),
      Q('To prevent pests, you should:', 'Deny them access, food and shelter', ['Leave food out overnight', 'Keep trash uncovered', 'Prop the back door open'], 'Keep the kitchen clean, closed and dry.'),
    ],
  },
};
