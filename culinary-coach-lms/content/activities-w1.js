/* Week 1 · Tuesday–Saturday (w1d2, w1d3, w1d4, w1lab). Schema reference: activities-w1d1.js and tools/check-activities.mjs. */
ACTIVITIES.w1d2 = {
  p1: [
    {
      type: 'choice', title: 'Knife safety: what would you do?',
      intro: 'Each question is a real moment on the line. Choose the safest professional action.',
      items: [
        { q: 'A new cook holds the knife by the handle only, with all four fingers wrapped around it, and says it feels more comfortable. What is the best response?', opts: ['Show the pinch grip: index finger and thumb on the blade at the bolster, other fingers curled around the handle', 'Let it go, since comfort matters most', 'Tell the cook to hold the knife closer to the tip', 'Say it is fine for slow work and only needed at speed'], ans: 0, why: 'The pinch grip is non-negotiable. It gives control of the blade, and no other grip is safe at production speed.' },
        { q: 'You are slicing onions. Your guide hand fingertips are pointing straight down toward the board, near the blade. What should you change?', opts: ['Curl the fingertips back, tuck the thumb behind them, and let the knuckles guide the blade', 'Move the hand farther away and cut faster', 'Keep the fingers flat so you can see them', 'Wear a glove and keep the same hand position'], ans: 0, why: 'The knuckles guide the blade. Fingertips curled back and thumb tucked behind the fingers keep them from ever reaching the edge.' },
        { q: 'Your carrot cuts are slow and you are pushing the blade down hard. What is the correct adjustment?', opts: ['Check the blade angle and draw the knife so its weight does the cutting', 'Press harder so the blade goes through', 'Switch to a smaller knife', 'Hold the blade with a tighter fist'], ans: 0, why: 'The blade is drawn, not pushed. With the right angle, the weight of the blade does the cutting.' },
        { q: 'You must carry your chef’s knife across a crowded kitchen to the dish area. What do you do?', opts: ['Point the blade down and behind you, and say "sharp behind" as you move through', 'Carry it blade up in front so you can watch it', 'Walk quietly so you do not distract anyone', 'Put it in your apron pocket'], ans: 0, why: 'A knife moves blade down and behind you, and you announce "sharp behind" every time you pass through a shared space. No exceptions.' },
        { q: 'At the end of the shift, a cook sets a knife on the flat end of a counter and walks away. What is the problem?', opts: ['Someone can reach for it without seeing it; it belongs in a roll or on a magnetic strip', 'There is no problem if the blade faces the wall', 'It should be left in a drawer instead', 'It should go in the cook’s bag'], ans: 0, why: 'Never leave a knife loose on a flat surface, in a drawer, or in a bag. Store it in a roll or on a magnetic strip.' },
      ],
    },
    {
      type: 'match', title: 'Match the rule to the situation',
      intro: 'Choose the safety habit that fits each moment.',
      options: ['Pinch grip', 'Guide hand with curled fingertips', 'Draw the blade, let its weight cut', 'Blade down and behind, say "sharp behind"', 'Store in a roll or on a magnetic strip'],
      rows: [{ label: 'Controlling the blade at the bolster', ans: 0 }, { label: 'Keeping your fingers away from the edge while you hold the food', ans: 1 }, { label: 'Walking past another cook with a knife', ans: 3 }, { label: 'Putting your knives away after service', ans: 4 }, { label: 'Cutting without forcing or pushing', ans: 2 }],
      why: 'Each habit protects you or the people around you: pinch grip for control, curled guide hand for fingers, drawing the blade for smooth cuts, blade down and behind for travel, and a roll or strip for storage.',
    },
  ],
  p2: [
    { type: 'diagram', svg: 'cuts', title: 'The classic cuts side by side', caption: 'Compare the sizes. Uniform cuts cook evenly and look professional on the plate.' },
    {
      type: 'match', title: 'Match the cut to its dimensions',
      intro: 'Choose the dimensions that belong to each cut.',
      options: ['¾ × ¾ × ¾ inch', '½ × ½ × ½ inch', '¼ × ¼ × ¼ inch', '⅛ × ⅛ × ⅛ inch', '⅛ × ⅛ × 2–2½ inches', 'Thin ribbons from rolling and slicing'],
      rows: [{ label: 'Large dice', ans: 0 }, { label: 'Medium dice', ans: 1 }, { label: 'Small dice / brunoise', ans: 2 }, { label: 'Fine brunoise', ans: 3 }, { label: 'Julienne', ans: 4 }, { label: 'Chiffonade', ans: 5 }],
      why: 'Large dice is ¾ inch, medium ½ inch, small dice ¼ inch, fine brunoise ⅛ inch. Julienne is ⅛ inch thick and 2–2½ inches long. Chiffonade is rolled leaves sliced into ribbons.',
    },
    {
      type: 'choice', title: 'Which cut for the dish?',
      items: [
        { q: 'The chef wants basil for a garnish on a tomato dish, in thin ribbons. Which cut do you use?', opts: ['Chiffonade: stack, roll, and slice', 'Large dice', 'Julienne', 'Oblique'], ans: 0, why: 'Chiffonade is for leafy herbs and greens. You stack the leaves, roll them tight, and slice into thin ribbons.' },
        { q: 'You are prepping root vegetables for roasting and want angled pieces with consistent surface area. Which cut fits?', opts: ['Oblique / roll cut', 'Fine brunoise', 'Chiffonade', 'Julienne'], ans: 0, why: 'The oblique or roll cut gives angled, irregular pieces with consistent surface area, so root vegetables brown evenly.' },
        { q: 'A soffritto base calls for onion, carrot and celery cut very small. Which cut is the best match?', opts: ['Small dice / brunoise (¼ inch)', 'Large dice (¾ inch)', 'Julienne', 'Oblique'], ans: 0, why: 'Soffritto, garnishes and sauces use the small dice or brunoise at ¼ inch.' },
        { q: 'A stew will cook for two hours. The cook cuts the carrots in fine brunoise. What is the likely problem?', opts: ['The pieces are too small for a long cook and will break down; large dice fits stews', 'There is no problem; smaller is always better', 'The carrots will not cook at all', 'Fine brunoise should be used only for meat'], ans: 0, why: 'Stews use large dice (¾ inch) because bigger pieces hold up through a long cook. Match the cut to the cooking time and dish.' },
      ],
    },
    {
      type: 'fill', title: 'Measure the cuts',
      intro: 'Use the dimensions from the table to answer. Enter numbers only.',
      rows: [
        { label: '6 medium dice cubes lined up side by side', unit: 'inches long', ans: 3, tol: 0.01 },
        { label: '4 large dice cubes lined up side by side', unit: 'inches long', ans: 3, tol: 0.01 },
        { label: '8 fine brunoise cubes lined up side by side', unit: 'inches long', ans: 1, tol: 0.01 },
        { label: 'How many small dice (¼ inch) fit across one inch of a board?', unit: 'pieces', ans: 4, tol: 0.01 },
      ],
      why: 'Medium dice is ½ inch, so 6 × ½ = 3 inches. Large dice is ¾ inch, so 4 × ¾ = 3 inches. Fine brunoise is ⅛ inch, so 8 × ⅛ = 1 inch. A ¼ inch cube fits 4 across one inch.',
    },
  ],
  p3: [
    {
      type: 'match', title: 'Sort the ingredients',
      intro: 'Each ingredient belongs to one of the four groups in your Ingredient Identification Library.',
      options: ['Protein', 'Vegetable', 'Aromatic / fresh herb', 'Dry good'],
      rows: [{ label: 'Salmon fillet', ans: 0 }, { label: 'Leek', ans: 1 }, { label: 'Thyme', ans: 2 }, { label: 'Cornstarch', ans: 3 }, { label: 'Shrimp (16/20)', ans: 0 }, { label: 'Ginger', ans: 2 }],
      why: 'Proteins: chicken, ground beef, salmon, shrimp, bacon, eggs. Vegetables include leek, onion and zucchini. Aromatics and herbs include thyme, basil and ginger. Dry goods include flour, salt, oils, sugar and cornstarch.',
    },
    {
      type: 'choice', title: 'Know your ingredients on the job',
      items: [
        { q: 'The chef says "I need the 16/20 shrimp thawed for tonight." What does 16/20 tell you?', opts: ['The count per pound: about 16 to 20 shrimp make a pound', 'The temperature to store them', 'The number of days they last', 'The price per pound'], ans: 0, why: 'Shrimp are sized by count per pound. 16/20 means roughly 16 to 20 shrimp in each pound, which are large.' },
        { q: 'A delivery includes raw chicken thighs, flour, and fresh basil. Which should go into cold storage first?', opts: ['The raw chicken thighs, which must be held at 41°F or below', 'The flour, because it is the heaviest', 'The basil, because it is the lightest', 'None of them; all can wait on the counter'], ans: 0, why: 'Raw chicken is a high-risk food and must stay cold at 41°F or below. Dry goods can wait; they are stored dry and off the floor.' },
        { q: 'You prepped diced onion and sealed it in a container. What should be on the label?', opts: ['Ingredient name, date prepped, use-by date and your initials', 'Only the word "onion"', 'Only the date you bought the onions', 'Nothing, because onion keeps well'], ans: 0, why: 'Every prepped item carries its name, preparation date, use-by date and your initials, so anyone can tell what it is and when to use it.' },
        { q: 'A recipe lists "cremini mushrooms" and the walk-in only has white button mushrooms. What is the best first step?', opts: ['Ask the chef; they are related but not the same ingredient', 'Use them silently and hope it works', 'Skip the mushrooms', 'Buy a different vegetable'], ans: 0, why: 'Cremini and button mushrooms are close, but a professional confirms substitutions with the chef instead of guessing.' },
      ],
    },
    {
      type: 'reflect', title: 'Build one library card',
      intro: 'Pick one ingredient from the list of 25 that you know least. Fill in the card. Use a reliable source for storage and shelf life.',
      prompts: [
        { key: 'ingredient', label: 'Which ingredient did you pick, and why is it one you know least?', help: 'Name it and say what you already know.', items: 1, minWords: 12, rows: 3,
          keywords: [{ match: 'because|never|not sure|unfamiliar|rarely', tip: 'why this one is unfamiliar to you' }] },
        { key: 'storage', label: 'How should it be stored, at what temperature, and how long does it last once prepped?', help: 'Give the temperature or place and the shelf life you found.', items: 1, minWords: 12, rows: 4,
          keywords: [{ match: '°|degree|cold|cooler|dry|room|refrigerat|freezer', tip: 'a temperature or storage place' }, { match: 'day|hour|week|month', tip: 'a shelf life' }] },
        { key: 'method', label: 'Name at least one common preparation method and how you would cut or cook it.', help: 'Tie it to a cut from today if it fits.', items: 1, minWords: 12, rows: 3,
          keywords: [{ match: 'dice|julienne|chiffonade|mince|slice|roast|saut|boil|bake|fry|grill', tip: 'a cut or cooking method' }] },
      ],
      model: 'I picked shallot because I have used onion but never shallot. I found that whole shallots keep in a cool, dry, ventilated place for several weeks, and once peeled and cut they go in a labeled container in the cooler at 41°F or below for a few days. A common method is to brunoise or slice them and sweat them gently in butter for sauces and vinaigrettes, which uses the small dice from class.',
    },
  ],
};

ACTIVITIES.w1d3 = {
  p1: [
    {
      type: 'match', title: 'What does each part of the recipe do?',
      intro: 'Match the cook’s question to the part of the standardized recipe that answers it.',
      options: ['Recipe name and yield', 'Ingredients list', 'Method', 'Plating notes', 'Allergen flags'],
      rows: [{ label: 'How many portions will this make, and how big is each?', ans: 0 }, { label: 'At what temperature and for how long do I cook it?', ans: 2 }, { label: 'Where does the garnish go, and how many ounces per plate?', ans: 3 }, { label: 'Does this dish contain milk, wheat, or sesame?', ans: 4 }, { label: 'How much of each item do I weigh out, and in what order do I use them?', ans: 1 }],
      why: 'The yield sets the size of the job, the ingredients list gives order and exact amounts, the method gives temperatures, times and doneness cues, the plating notes show the finished look, and allergen flags protect guests.',
    },
    {
      type: 'choice', title: 'Reading a recipe and the Big 9',
      items: [
        { q: 'A recipe makes a creamy dressing from mayonnaise, buttermilk, and tahini. Which Big 9 allergens should the allergen flag list?', opts: ['Eggs, milk, and sesame', 'Only milk', 'Peanuts and soy', 'None, because they are condiments'], ans: 0, why: 'Mayonnaise contains eggs, buttermilk is milk, and tahini is made of sesame. Condiments still carry allergens, so every recipe is flagged.' },
        { q: 'Which of these is NOT one of the Big 9 allergens?', opts: ['Corn', 'Fish', 'Soy', 'Tree nuts'], ans: 0, why: 'The Big 9 are milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soy and sesame. Corn is not on the list.' },
        { q: 'A guest says they have a shellfish allergy and orders the seafood chowder. The recipe card lists shrimp. What do you do?', opts: ['Tell the chef right away so the guest is not served that dish', 'Remove the shrimp and serve it', 'Say nothing, since the allergen flag is only for the cook', 'Add extra seasoning'], ans: 0, why: 'Allergen flags exist so the team can protect guests. Removing an ingredient does not remove cross-contact, so the chef decides how to handle it.' },
        { q: 'The method says "sauté until the onions are translucent, about 5 minutes." Your onions are still firm at 5 minutes. What do you do?', opts: ['Keep cooking until they look translucent, because the visual indicator is the real test', 'Stop at 5 minutes because the time is exact', 'Turn the heat up to high and leave', 'Add extra onions'], ans: 0, why: 'Times are a guide. The visual indicators of doneness in the method are what confirm the step is finished.' },
        { q: 'A recipe lists "2 cups flour" but your station has a scale. Why do professional recipes give weights?', opts: ['Weight is more precise than volume, so results are consistent every time', 'Weights are faster to write', 'Scales are required by law', 'Volume cannot be measured'], ans: 0, why: 'The professional kitchen weighs ingredients. Volume is mostly used for liquids because it varies for dry goods.' },
      ],
    },
  ],
  p2: [
    {
      type: 'fill', title: 'Convert the units',
      intro: 'Use standard kitchen conversions: 16 ounces in a pound, 3 teaspoons in a tablespoon, 16 tablespoons in a cup, 4 cups in a quart, 4 quarts in a gallon.',
      rows: [
        { label: '48 ounces of butter', unit: 'pounds', ans: 3, tol: 0.01 },
        { label: '2.5 pounds of rice', unit: 'ounces', ans: 40, tol: 0.01 },
        { label: '4 tablespoons of lemon juice', unit: 'teaspoons', ans: 12, tol: 0.01 },
        { label: '12 cups of stock', unit: 'quarts', ans: 3, tol: 0.01 },
        { label: '2 gallons of water', unit: 'quarts', ans: 8, tol: 0.01 },
      ],
      why: '48 ÷ 16 = 3 pounds. 2.5 × 16 = 40 ounces. 4 × 3 = 12 teaspoons. 12 ÷ 4 = 3 quarts. 2 × 4 = 8 quarts.',
    },
    {
      type: 'fill', title: 'Yield percentage: how much is usable?',
      intro: 'Yield percentage = usable (edible) weight ÷ as-purchased weight × 100. Enter numbers only.',
      rows: [
        { label: 'You buy 10 lb of carrots and get 8 lb after peeling and trimming. What is the yield?', unit: '%', ans: 80, tol: 0.5 },
        { label: 'A case of celery weighs 20 lb and has an 85% yield. How many pounds are usable?', unit: 'lb', ans: 17, tol: 0.1 },
        { label: 'You need 9 lb of usable shallots and they yield 90%. How many pounds must you buy?', unit: 'lb', ans: 10, tol: 0.1 },
      ],
      why: '8 ÷ 10 = 80%. 20 × 0.85 = 17 lb. To find what to buy, divide the usable weight by the yield: 9 ÷ 0.90 = 10 lb. Trimming loss is real and must be counted in food cost.',
    },
    {
      type: 'choice', title: 'Why the numbers matter',
      items: [
        { q: 'A cook scales a sauce from 6 to 18 portions. They triple the beef stock, flour and butter, but keep the salt the same. What is the problem?', opts: ['Every ingredient must be multiplied by the same factor, including the salt', 'Nothing; salt never changes', 'Only liquids should be multiplied', 'The cook should have multiplied by 6'], ans: 0, why: 'Scaling uses one conversion factor for every ingredient. Here the factor is 3. Taste and adjust seasoning at the end of cooking.' },
        { q: 'The recipe costs onion at the as-purchased price per pound. Why will your food cost be too low?', opts: ['Peeling and trimming removes weight, so each usable pound costs more than the purchase price', 'Onions change price every day', 'Onion is always cheap', 'Cost is based on volume'], ans: 0, why: '1 lb of onion does not give 1 lb of usable onion. Trimming loss must be accounted for in food cost.' },
      ],
    },
  ],
  p3: [
    {
      type: 'order', title: 'Build the prep list for a 40-cover dinner',
      intro: 'The menu has four items: a braised short rib, marinated grilled chicken, roasted root vegetables, and a green salad with a vinaigrette. Put the prep tasks in the best order, first task at the top. Remember: long cook or marinade first, close-to-service items last.',
      steps: ['Season and start the short rib braise (long cooking time)', 'Cut and start marinating the chicken (extended marination)', 'Cut the root vegetables and portion them for roasting', 'Make the vinaigrette and label it', 'Wash, dry and cut the salad greens', 'Portion and garnish items that must be fresh and cold, close to service'],
      why: 'Items with long cooking times or marinades go first so they have the time they need. Stable items such as vegetables and dressing come next. Delicate, temperature-sensitive items like cut greens are prepped last, close to service.',
    },
    {
      type: 'choice', title: 'Sequencing and labeling decisions',
      items: [
        { q: 'Your prep list has tasks for the grill, the salad station, and the sauté station mixed together on one page. What is the best way to improve it?', opts: ['Group the tasks by station so each cook has all their work in one place', 'Alphabetize the tasks', 'Put the shortest tasks first', 'Remove the station names'], ans: 0, why: 'Grouping by station keeps station-specific prep together and not scattered, which saves steps and prevents missed tasks.' },
        { q: 'Which item belongs closest to the END of your prep list for a 5:00 PM service?', opts: ['Cutting fresh salad greens and slicing avocado', 'Marinating chicken for eight hours', 'Starting a stock', 'Braising short rib'], ans: 0, why: 'Temperature-sensitive and delicate items should be prepped close to service so they stay cold and fresh.' },
        { q: 'You finish a batch of vinaigrette and put it in a container without a label because you are the only one using it. What is wrong?', opts: ['Every container needs a clear label so anyone can identify it and its dates', 'Nothing; labels are for large containers only', 'Vinaigrette does not need to be stored', 'Only proteins need a label'], ans: 0, why: 'Clear labeling standards apply to every container produced. Labels protect the team, reduce waste, and prevent mistakes.' },
        { q: 'You are given a 40-cover prep list. Before you cut anything, what is the best first move?', opts: ['Read the whole list and ask which tasks take the longest', 'Start with the first item you like', 'Wait for the chef to tell you each task', 'Begin with the easiest item'], ans: 0, why: 'A prep list is a plan. Reading all of it first lets you start long-lead items early, which is the heart of mise en place.' },
      ],
    },
  ],
};

ACTIVITIES.w1d4 = {
  p1: [
    { type: 'diagram', svg: 'cooler', title: 'Walk-in cooler storage order', caption: 'Top to bottom: ready-to-eat foods, whole fish, whole beef and pork, ground meat and ground fish, whole and ground poultry. The food that needs the lowest cooking temperature goes highest.' },
    { type: 'diagram', svg: 'thermometer', title: 'The temperature danger zone', caption: 'Cold foods at or below 41°F. Hot foods at or above 135°F. Between 41°F and 135°F bacteria multiply rapidly.' },
    {
      type: 'order', title: 'Stock the walk-in cooler',
      intro: 'Put these in storage order from the top shelf to the bottom shelf.',
      steps: ['Ready-to-eat foods (for example, cut salad greens)', 'Whole fish', 'Whole beef and pork', 'Ground beef and ground fish', 'Whole and ground poultry'],
      why: 'Foods that need the lowest cooking temperature go on top and foods that need the highest go on the bottom. This way, drips from raw products never land on food that will not be cooked again.',
    },
    {
      type: 'fill', title: 'Time in the danger zone adds up',
      intro: 'Time in the danger zone is cumulative, and four hours is the limit. A tray of cooked rice sat at room temperature for 1.5 hours during prep, went back to the cooler, then sat out for 2 hours on the line.',
      rows: [
        { label: 'Total time in the danger zone so far', unit: 'hours', ans: 3.5, tol: 0.01 },
        { label: 'Minutes left before the 4-hour limit is reached', unit: 'minutes', ans: 30, tol: 1 },
      ],
      why: '1.5 + 2 = 3.5 hours. The clock does not reset when food goes back into the cooler. That leaves 30 minutes of the 4-hour limit.',
    },
    {
      type: 'choice', title: 'Storage and cross-contamination: what do you do?',
      items: [
        { q: 'You find a tray of raw chicken on the shelf above a tub of sliced lettuce. What do you do?', opts: ['Move the chicken to the bottom shelf, below the ready-to-eat food, and tell the chef', 'Cover the lettuce with plastic wrap', 'Leave it; both are cold', 'Move the lettuce to the floor'], ans: 0, why: 'Raw poultry stores lowest in the cooler, so juices cannot drip onto food that will not be cooked.' },
        { q: 'A delivery arrives. The cooler already has two cases of the same product from yesterday. Where does the new case go?', opts: ['Behind the older cases, so the older product is used first', 'In front of the older cases', 'On top of them', 'In the freezer'], ans: 0, why: 'FIFO (first in, first out): older product moves to the front, newer product goes to the back.' },
        { q: 'A cook cuts raw chicken, then needs to slice tomatoes. What is the best practice?', opts: ['Wash hands, change to the green board for produce, and sanitize the station', 'Wipe the board with a towel and keep going', 'Use the same board and knife for speed', 'Only change gloves'], ans: 0, why: 'Use dedicated color-coded boards and wash hands between tasks. Gloves do not replace handwashing.' },
        { q: 'You see a cook pick up sandwich bread with bare hands and place it on a tray of ready-to-eat items. What is the problem?', opts: ['No bare-hand contact with ready-to-eat foods; use gloves or utensils', 'Nothing, bread is dry', 'The bread should be warmer', 'The tray is too small'], ans: 0, why: 'Ready-to-eat foods will not be cooked again, so bare-hand contact can pass germs directly to guests.' },
        { q: 'A container of cooked soup in the cooler has no label. What should you do?', opts: ['Ask the chef; without a prep date and use-by date, it cannot be safely used', 'Taste it to see if it is good', 'Use it first because it is older', 'Put it at the back'], ans: 0, why: 'Every prepped item gets a preparation date, use-by date and initials. An unlabeled item cannot be verified, so it is not used.' },
      ],
    },
  ],
  p2: [
    {
      type: 'match', title: 'Which call fits the moment?',
      intro: 'Choose the kitchen call you would use in each situation.',
      options: ['Behind', 'Sharp', 'Corner', 'Heard', '86', 'All day', 'Fire'],
      rows: [
        { label: 'You are carrying a hot pan and about to turn a blind corner', ans: 2 },
        { label: 'The chef says "two salmon on table 6" and you confirm you got it', ans: 3 },
        { label: 'You have just used the last portion of short rib', ans: 4 },
        { label: 'The expediter wants to know how many burgers are on order across all open tickets', ans: 5 },
        { label: 'You are walking with a chef’s knife through the aisle', ans: 1 },
        { label: 'The chef says to start cooking table 4’s steak now', ans: 6 },
        { label: 'You need to pass directly behind a cook at the stove', ans: 0 },
      ],
      why: '"Corner" before a blind turn, "Heard" to confirm a direction, "86" when an item is out, "All day" for the total count on order, "Sharp" when moving a knife, "Fire" to begin cooking, and "Behind" when passing behind someone.',
    },
    {
      type: 'choice', title: 'Communication on the line',
      items: [
        { q: 'The chef calls "Fire two chicken." You are on the grill and keep working without answering. What is the problem?', opts: ['You did not say "Heard," so no one knows you received the message', 'Nothing, since you are working', 'You should have said "86"', 'You should have said "Behind"'], ans: 0, why: '"Heard" is the response to any direction from a chef or expediter. It confirms the message was received.' },
        { q: 'You squeeze behind a cook who is plating, and say nothing because the kitchen is loud. What is the best correction?', opts: ['Say "Behind" every time, without exception, and say it loudly enough to be heard', 'Tap them on the shoulder', 'Wait until the kitchen is quiet', 'Walk faster'], ans: 0, why: 'Communication is a safety requirement, not an option. The call is made every time, even when it is loud.' },
        { q: 'You notice the last portion of the soup is nearly gone and a ticket just came in for soup. What do you do?', opts: ['Tell the expediter "86 soup" as soon as it runs out', 'Keep it a secret until the end of the shift', 'Make a smaller portion and hope no one notices', 'Wait for the guest to ask'], ans: 0, why: '"86" lets the front of house stop selling the item, so a guest is not promised food the kitchen no longer has.' },
        { q: 'Your teammate is carrying a stock pot toward a blind corner. What should they call?', opts: ['Corner', 'Fire', 'Heard', 'All day'], ans: 0, why: 'Announce before turning a blind corner carrying anything, so no one walks into you.' },
      ],
    },
  ],
  p3: [
    {
      type: 'order', title: 'Get ready for Saturday: a readiness plan',
      intro: 'Put these steps in the most sensible order, first step at the top.',
      steps: ['Read the full lab prep list: every item, quantity and cut specification', 'Mark the time-critical tasks and decide what must be done first', 'Look up any ingredient you do not know', 'Check that your knife roll is complete and your knives are sharp', 'Lay out your full uniform and tools the night before', 'Arrive by 10:00 AM in full uniform'],
      why: 'Review the whole plan, decide the order of work, and research gaps while there is time. Then check your tools and uniform and arrive ready. Doing it in this order means no surprises on the day.',
    },
    {
      type: 'choice', title: 'Readiness check',
      items: [
        { q: 'The lab prep list says "chiffonade 1 bunch basil" and you have never done it. What is the best use of the days before the lab?', opts: ['Practice the cut at home and review how to stack, roll and slice', 'Plan to watch others on the day', 'Skip it and let a classmate do it', 'Hope the instructor changes the list'], ans: 0, why: 'The briefing is the only window to ask questions, so arrive knowing the cut. Practice makes you faster and safer.' },
        { q: 'You open your knife roll the night before and find the honing steel missing. What do you do?', opts: ['Replace it before Saturday so the roll is complete', 'Go without it', 'Borrow one at the lab', 'Take a different tool'], ans: 0, why: 'The minimum roll is a chef’s knife, paring knife, bench scraper, peeler and honing steel. A deficiency is documented on the rubric at arrival.' },
        { q: 'You are unsure of the exact weight to cut for one item on the lab prep list. When is the best time to ask?', opts: ['Before you arrive if possible, or during the pre-shift briefing', 'After you have started cutting', 'During the quality check', 'Never, because asking looks weak'], ans: 0, why: 'The pre-shift briefing is the only window for questions. Reviewing in advance means your questions are specific and short.' },
      ],
    },
    {
      type: 'reflect', title: 'Your pre-lab plan',
      intro: 'Review the Saturday lab plan, then write your own plan in your own words.',
      prompts: [
        { key: 'critical', label: 'Which tasks on the prep list are time-critical, and why do they go first?', help: 'Name at least two tasks and the reason for the order.', items: 1, minWords: 20, rows: 5,
          keywords: [{ match: 'first|start|begin|early', tip: 'what you will start first' }, { match: 'because|so that|since|takes', tip: 'the reason (time needed, safety, quality)' }, { match: 'chicken|carrot|onion|potato|garlic|shallot', tip: 'a task from the actual prep list' }] },
        { key: 'unfamiliar', label: 'Which ingredient or cut is unfamiliar, and how will you research it before you arrive?', help: 'Name it and say exactly what you will look up.', items: 1, minWords: 20, rows: 5,
          keywords: [{ match: 'research|look up|watch|read|practice|ask', tip: 'how you will learn about it' }, { match: 'store|storage|cut|dice|shelf|temperature|prepare', tip: 'storage, shelf life or how it is cut' }] },
      ],
      model: 'The chicken portioning and the onion and potato work are time-critical because they take the longest and need correct storage, so I will start them right after the briefing. The garlic and herbs can be done later in the shift. The ingredient I know least is fingerling potatoes, so before Saturday I will look up how to store them, how long they keep once cut, and watch a video of an oblique cut so I can start with confidence.',
    },
  ],
};

ACTIVITIES.w1lab = {
  end: [
    {
      type: 'order', title: 'The 4-hour lab timeline',
      intro: 'Put the six blocks of Saturday’s lab in the order they happen, first block at the top.',
      steps: ['Arrive, uniform and tool check, station assignment (0:00–0:15)', 'Pre-shift briefing: prep list, stations, yield targets (0:15–0:30)', 'Active production (0:30–2:30)', 'Quality check of finished prep (2:30–3:00)', 'Breakdown and sanitation of your station (3:00–3:30)', 'Debrief and self-assessment (3:30–4:00)'],
      why: 'You check in, get briefed, produce for two hours, have your work checked, clean your station back to its starting condition, and then reflect.',
    },
    {
      type: 'fill', title: 'Plan your time and your product',
      intro: 'Use the lab schedule and the prep list. Enter numbers only.',
      rows: [
        { label: 'How many minutes is the active production block?', unit: 'minutes', ans: 120, tol: 0.01 },
        { label: 'All stations portion 8 chicken breasts at 6 oz each. How many ounces of chicken in all?', unit: 'oz', ans: 48, tol: 0.01 },
        { label: 'That is how many pounds of chicken?', unit: 'lb', ans: 3, tol: 0.01 },
        { label: 'How many minutes after you arrive does the debrief start?', unit: 'minutes', ans: 210, tol: 0.01 },
      ],
      why: 'Production runs from 0:30 to 2:30, which is 120 minutes. 8 × 6 = 48 oz, and 48 ÷ 16 = 3 lb. The debrief starts at 3:30 after arrival, which is 210 minutes.',
    },
    {
      type: 'choice', title: 'Lab day: what would you do?',
      intro: 'The instructor scores your uniform, tools, communication, labeling and sanitation. Choose the best action in each moment.',
      items: [
        { q: 'You arrive at 9:55 AM and realize you left your honing steel at home. What do you do?', opts: ['Tell the instructor at the tool check; the deficiency is documented and you continue', 'Hide it and hope no one checks', 'Go home to get it and arrive late', 'Borrow someone’s without asking'], ans: 0, why: 'Deficiencies are documented on the rubric immediately. Honest reporting is better than hiding a gap, and it is better to arrive on time.' },
        { q: 'During the briefing you are unsure how fine the brunoise should be. When should you ask?', opts: ['Right then, because the briefing is the only window for clarifying questions', 'Later, during production', 'At the quality check', 'Never; guess from the table'], ans: 0, why: 'Students ask clarifying questions in the pre-shift briefing. Once production starts, questions cost time and mistakes.' },
        { q: 'During production, you carry your knife past another station. What is expected?', opts: ['Blade down and behind, and call "sharp behind" as you pass', 'Walk quietly so you do not interrupt', 'Hold the knife up for better control', 'Put the knife in your apron'], ans: 0, why: 'Communication protocols are in effect for the whole production block. Safety violations are addressed immediately and documented.' },
        { q: 'You finish your diced zucchini and put it in a clean container. What must you do before it goes to storage?', opts: ['Label it with the item, prep date, use-by date and your initials, and store it correctly', 'Leave it on the counter for the instructor', 'Cover it and hope it is recognized', 'Mix it with the celery'], ans: 0, why: 'Labeling is scored at the quality check, along with cut uniformity, dimensions and temperature compliance.' },
        { q: 'At 3:00 PM your station has been used but the instructor is busy elsewhere. What is your responsibility during breakdown?', opts: ['Wipe surfaces, clean and return equipment, sweep the floor, and return the station to its starting condition', 'Clean only your cutting board', 'Wait for the instructor', 'Leave the sanitizing to someone else'], ans: 0, why: 'Students are responsible for their full station. It is returned to the condition it was in when you started.' },
        { q: 'At the quality check, the instructor says your julienne carrots are uneven in length. What is the best response?', opts: ['Listen, take the feedback, and note it for your self-assessment', 'Explain why it was not your fault', 'Hide the tray', 'Remake all carrots without asking'], ans: 0, why: 'The instructor gives verbal feedback on each item. Taking it calmly, without defending, shows professional maturity and feeds your self-assessment.' },
      ],
    },
    {
      type: 'match', title: 'What does the instructor look for?',
      intro: 'Match each observation to the area it is scored under.',
      options: ['Uniform and tools', 'Communication calls', 'Cut quality', 'Labeling and storage', 'Station sanitation'],
      rows: [{ label: 'A closed knife roll with all five pieces', ans: 0 }, { label: 'Saying "Heard" after a direction', ans: 1 }, { label: 'Carrot julienne that is all ⅛ inch and the same length', ans: 2 }, { label: 'A container with name, dates and initials', ans: 3 }, { label: 'A wiped counter and swept floor at the end', ans: 4 }],
      why: 'The rubric covers the full picture: how you arrive, how you communicate, what you produce, how you label and store it, and how you leave your station.',
    },
    {
      type: 'reflect', title: 'After the lab: your self-assessment',
      intro: 'Do this after Saturday’s lab, against the rubric. Be honest and specific. Write in full sentences.',
      prompts: [
        { key: 'well', label: 'What went well? Give at least two examples from the lab.', help: 'Name the task and what you did.', items: 1, minWords: 20, rows: 5,
          keywords: [{ match: 'cut|dice|julienne|brunoise|chiffonade|mince', tip: 'a specific cut or task' }, { match: 'label|sanit|uniform|knife|communicat|heard|behind|sharp', tip: 'a scored area such as labeling or communication' }] },
        { key: 'improve', label: 'What will you improve before Lab 2, and how?', help: 'Name one weakness and one action you will take.', items: 1, minWords: 20, rows: 5,
          keywords: [{ match: 'practice|improve|work on|focus|next time|will', tip: 'what you will do about it' }, { match: 'because|so that|since', tip: 'why it matters' }] },
      ],
      model: 'My knife grip and the labeling went well: I used the pinch grip on every cut and my containers had name, dates and initials. I called "sharp behind" each time I walked past. I need to improve the uniformity of my julienne because the carrot pieces were uneven in length. Before the next lab I will practice julienne on a bag of carrots twice this week and measure the pieces against the ⅛ inch standard.',
    },
  ],
};
