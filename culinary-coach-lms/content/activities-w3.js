/* Week 3 activities: costing, pricing, menus, business formats, customers and permits. */

/* ---- Monday: food cost, pricing, costing exercise ---------------------------------------------------------------- */
ACTIVITIES.w3d1 = {
  p1: [
    {
      type: 'fill', title: 'Food cost %, yield and true cost',
      intro: 'Practice figures. Use the formulas from the lesson. Round percentages to one decimal and dollars to cents.',
      rows: [
        { label: 'A plate has $3.60 of ingredients and sells for $12.00. What is the food cost percentage?', unit: '%', ans: 30, tol: 0.1 },
        { label: 'You buy 5 lbs of chicken (AP) and trim it to 4 lbs usable (EP). What is the yield percentage?', unit: '%', ans: 80, tol: 0.1 },
        { label: 'That 5 lbs cost $15.00 as purchased. What is your true cost per pound of usable (EP) chicken?', unit: '$ per lb', ans: 3.75, tol: 0.01 },
      ],
      why: 'Food cost % = ingredient cost ÷ sale price × 100, so 3.60 ÷ 12.00 = 0.30, or 30%. Yield % = EP ÷ AP = 4 ÷ 5 = 80%. You paid $15.00 but only 4 lbs are usable, so the true cost is 15.00 ÷ 4 = $3.75 per lb, higher than the $3.00 per lb on the invoice.',
    },
    {
      type: 'choice', title: 'Costing decisions',
      items: [
        { q: 'You are costing a soup. The recipe uses 2 lbs of trimmed carrots, but you bought 2.5 lbs unpeeled. Which weight do you cost?', opts: ['The 2.5 lbs you bought, since that is what you paid for', 'The 2 lbs of trimmed carrots, using EP weight and the cost per EP pound', 'A rough guess of about 2 lbs', 'Neither: carrots are too cheap to cost'], ans: 1, why: 'The lesson says to use EP weight after trimming, and to cost every ingredient at the exact quantity used. Trim loss still costs you money, so it is built into the cost per EP pound.' },
        { q: 'Which number do you price from?', opts: ['The cost of the most expensive ingredient', 'What the competitor charges', 'The plate cost: the total ingredient cost to produce one portion', 'The market fee for the day'], ans: 2, why: 'Plate cost is the number you price from. Competitor prices come in later as a market check, not as the starting point.' },
        { q: 'Your pop-up plate sells at a 34% food cost. Is that automatically a problem?', opts: ['Yes, anything above 28% always loses money', 'Not automatically: a food truck or pop-up can often operate at 30–35%', 'No, food cost does not matter for a pop-up', 'Yes, it must be under 20%'], ans: 1, why: 'The standard for most operations is 28–32%, but a food truck or pop-up can often operate at 30–35%. Know your format’s range and check that your other costs still leave you a profit.' },
      ],
    },
  ],
  p2: [
    { type: 'diagram', svg: 'cost', title: 'From ingredients to price', caption: 'Cost every ingredient at the exact EP quantity, add up the plate cost, then divide by your target food cost % to find the minimum sale price.' },
    {
      type: 'fill', title: 'Find the minimum sale price',
      intro: 'Sale Price = Plate Cost ÷ Target Food Cost %. Practice figures. Give the answer in dollars and cents.',
      rows: [
        { label: 'Plate cost $4.50, target 30%', unit: '$', ans: 15, tol: 0.01 },
        { label: 'Plate cost $2.80, target 28%', unit: '$', ans: 10, tol: 0.01 },
        { label: 'Plate cost $3.15, target 35%', unit: '$', ans: 9, tol: 0.01 },
      ],
      why: 'Divide the plate cost by the target as a decimal: 4.50 ÷ 0.30 = $15.00; 2.80 ÷ 0.28 = $10.00; 3.15 ÷ 0.35 = $9.00.',
    },
    {
      type: 'choice', title: 'Price, then check the market',
      items: [
        { q: 'Your chicken plate costs $4.20 and you want a 30% food cost. What is the minimum sale price?', opts: ['$12.60', '$14.00', '$16.80', '$8.40'], ans: 1, why: '4.20 ÷ 0.30 = $14.00. Multiplying by 3 instead of dividing by 0.30 happens to get close, but always use the formula: Plate Cost ÷ Target %.' },
        { q: 'Your math says $13.33, but comparable items at your farmers market sell for $8. What is the sensible next step?', opts: ['Charge $13.33 anyway because the math says so', 'Drop to $8 without looking at costs', 'Treat the gap as a warning: recheck your plate cost and portion, and decide whether your product or market needs to change', 'Ignore the market, since customers will pay for anything'], ans: 2, why: 'The lesson’s market pricing check asks whether the market supports your math. A big gap means revisiting plate cost, portion size, the target, or where you sell. Do not simply pick one number and hope.' },
        { q: 'Break-even is best described as:', opts: ['The price where food cost is exactly 30%', 'The number of units you must sell to cover your costs before you make a profit', 'The day the market opens', 'Half of your plate cost'], ans: 1, why: 'Break-even is the number of units you must sell to cover costs before any profit. It is covered in depth in Level II.' },
      ],
    },
    {
      type: 'order', title: 'Pricing a menu item',
      intro: 'Put the steps in order, first step at the top.',
      steps: ['Cost every ingredient at the exact quantity used, by EP weight', 'Add the ingredient costs and divide by portions to get the plate cost', 'Divide the plate cost by your target food cost %', 'Research comparable prices at farmers markets, pop-ups and restaurants nearby', 'Decide whether the market supports your price and adjust if it does not'],
      why: 'Cost the ingredients, find the plate cost, apply the formula for a minimum price, then test that price against the market.',
    },
  ],
  p3: [
    {
      type: 'fill', title: 'Cost a recipe end to end',
      intro: 'Practice recipe: Chicken Salad Rolls, a batch of 10 portions. You buy 5 lbs of chicken (AP) at $3.00 per lb. Trimming leaves 4 lbs usable (EP). Other ingredients for the batch: dressing and vegetables $7.00, and 10 rolls at $0.50 each. Target food cost: 30%.',
      rows: [
        { label: 'EP weight of chicken', unit: 'lbs', ans: 4, tol: 0.01 },
        { label: 'Total ingredient cost for the batch (chicken, dressing and vegetables, rolls)', unit: '$', ans: 27, tol: 0.01 },
        { label: 'Plate cost (cost of one portion)', unit: '$', ans: 2.7, tol: 0.01 },
        { label: 'Minimum sale price at a 30% target', unit: '$', ans: 9, tol: 0.01 },
      ],
      why: 'EP weight is what is left after trimming: 4 lbs usable from the 5 lbs purchased. Chicken costs 5 × $3.00 = $15.00 because you pay for the trim. Add $7.00 and 10 × $0.50 = $5.00 for $27.00. Divide by 10 portions for a $2.70 plate cost. Then 2.70 ÷ 0.30 = $9.00.',
    },
    {
      type: 'reflect', title: 'What would you need to cost?',
      intro: 'Think about the product from your Concept Brief (or the recipe you were assigned).',
      prompts: [
        { key: 'ingredients', label: 'List the ingredients you would need to cost for your product', help: 'One per line: the ingredient, the quantity in one portion, and how you buy it (for example, 3 oz chicken EP, bought by the case).', items: 4, minWords: 4, rows: 6,
          placeholder: 'One per line. Example: 3 oz chicken, EP weight, bought as 5 lb packs',
          keywords: [{ match: 'oz|lb|pound|ounce|gram|cup|each|piece', tip: 'the exact quantity in one portion' }, { match: 'EP|AP|trim|yield|usable', tip: 'whether the weight is EP or AP, and any trim loss' }, { match: 'pack|case|bag|buy|bought|purchase', tip: 'how you purchase it' }] },
      ],
      model: '3 oz chicken, EP weight, bought as 5 lb packs with some trim loss\n2 tablespoons dressing, made in batches from mayonnaise and herbs\n1 roll, bought in a pack of 12 from the bakery\n1 oz lettuce and tomato, EP weight after washing and trimming\nPackaging: one paper tray and napkin per portion',
    },
  ],
};

/* ---- Tuesday: menu engineering, consistency, capacity ------------------------------------------------------------ */
ACTIVITIES.w3d2 = {
  p1: [
    { type: 'diagram', svg: 'menuquad', title: 'Menu engineering matrix', caption: 'Stars: high profit, high popularity. Plowhorses: low profit, high popularity. Puzzles: high profit, low popularity. Dogs: low profit, low popularity, and candidates for removal.' },
    {
      type: 'match', title: 'Classify each menu item',
      intro: 'Choose the menu engineering category that fits each item.',
      options: ['Star', 'Plowhorse', 'Puzzle', 'Dog'],
      rows: [
        { label: 'A signature plate that earns a strong profit and sells out every market day', ans: 0 },
        { label: 'A cheap side that sells constantly but earns very little per plate', ans: 1 },
        { label: 'A specialty item with a healthy profit that few customers order', ans: 2 },
        { label: 'An item that earns little and rarely sells', ans: 3 },
        { label: 'A pastry with a high profit that customers keep asking for again', ans: 0 },
      ],
      why: 'Profit and popularity are the two questions. High and high is a Star. Low profit but high popularity is a Plowhorse. High profit but low popularity is a Puzzle. Low and low is a Dog, and Dogs are candidates for removal.',
    },
    {
      type: 'choice', title: 'Menu decisions',
      items: [
        { q: 'You have 14 items on a pop-up menu and several never sell. According to the lesson, what is the strongest move?', opts: ['Add more items so there is something for everyone', 'Cut the Dogs and focus on a smaller menu you can make consistently', 'Keep everything in case demand changes', 'Raise the price of every item equally'], ans: 1, why: 'A smaller menu is almost always stronger for a startup. Every item adds inventory, labor and risk of waste, and Dogs are candidates for removal.' },
        { q: 'Your most popular item is a Plowhorse. What is the right question to ask?', opts: ['How can I make it more profitable without losing the customers who love it?', 'Should I stop selling it immediately?', 'Why do customers like it? It does not matter.', 'Should I hide it from the menu?'], ans: 0, why: 'A Plowhorse already has the popularity. The work is on the profit side: check the portion, ingredient cost and price while keeping what customers like.' },
        { q: 'Which statement matches the lesson’s idea of a menu?', opts: ['A list of everything you are able to cook', 'A curated set of what you can make consistently, at a profit, within your production capacity', 'The most expensive dishes you can think of', 'Whatever the biggest competitor offers'], ans: 1, why: 'A menu is a curated set, not a list of what you can make. Consistency, profit and capacity all shape it.' },
      ],
    },
    {
      type: 'reflect', title: 'Why a smaller menu is stronger',
      prompts: [
        { key: 'smaller', label: 'Explain in your own words why a smaller menu is usually stronger for a startup food business.', help: 'Use what each extra item requires.', items: 1, minWords: 25, rows: 5,
          keywords: [{ match: 'inventor|ingredient|stock', tip: 'extra inventory' }, { match: 'labor|time|prep', tip: 'extra labor' }, { match: 'waste', tip: 'the risk of waste' }, { match: 'consisten', tip: 'making each item consistently' }] },
      ],
      model: 'A smaller menu is stronger because every item I add needs its own inventory, more prep labor, and more risk of waste if it does not sell. With fewer items I can make each one the same way every time, keep my ingredient list short, and spend my limited prep time on what customers actually buy.',
    },
  ],
  p2: [
    {
      type: 'fill', title: 'Production capacity and revenue ceiling',
      intro: 'Practice figures. You have 4 hours of prep time (240 minutes). One batch of your wraps takes 20 minutes and makes 12 wraps. Each wrap sells for $9.',
      rows: [
        { label: 'How many batches can you make in your prep time?', unit: 'batches', ans: 12, tol: 0.01 },
        { label: 'How many wraps is that in total (your capacity)?', unit: 'wraps', ans: 144, tol: 0.01 },
        { label: 'If every wrap sells, what is the most revenue you can earn?', unit: '$', ans: 1296, tol: 0.01 },
      ],
      why: '240 minutes ÷ 20 minutes per batch = 12 batches. 12 × 12 = 144 wraps. 144 × $9 = $1,296. That figure is your revenue ceiling for this item with this prep time, which is why capacity determines menu size.',
    },
    {
      type: 'order', title: 'Before an item is sold publicly',
      intro: 'Every item needs a written, costed, standardized recipe before you sell it. Put the steps in order.',
      steps: ['Write the recipe with exact quantities and method', 'Cook it the same way each time and adjust until it is repeatable', 'Cost every ingredient at the exact quantity used', 'Calculate plate cost and set the price from your target food cost %', 'Sell it publicly'],
      why: 'Write it down, make it repeatable, cost it, price it, and only then sell it. Selling before the recipe is standardized and costed means you do not know your cost or your results.',
    },
    {
      type: 'choice', title: 'Consistency and capacity scenarios',
      items: [
        { q: 'A customer returns to your market stall and says today’s sauce tastes different from last week. What does the lesson say is at risk?', opts: ['Nothing, customers expect variety', 'Repeat business: inconsistency kills it, because customers return for the same food every time', 'Only your food cost percentage', 'Your market fee'], ans: 1, why: 'At a farmers market or pop-up customers return because the food is the same every time. Consistency is the product.' },
        { q: 'You can only make about 60 portions of item A in your prep time, but you have 8 items planned. What does capacity tell you?', opts: ['Add more items and hope some sell', 'Capacity sets your menu size and revenue ceiling, so cut or combine items you cannot produce well', 'Ignore capacity until the first sales day', 'Buy more ingredients'], ans: 1, why: 'How many units you can realistically produce with your prep time and equipment determines menu size and revenue ceiling.' },
        { q: 'A friend says you do not need a written recipe because you know it by heart. What is the lesson’s answer?', opts: ['They are right if the dish is simple', 'Standardized recipes are not optional: each item needs a written, costed, standardized recipe before public sale', 'Only required if you hire staff', 'Only required for desserts'], ans: 1, why: 'The lesson is clear: every item on your menu must have a written, costed, standardized recipe before you sell it publicly.' },
      ],
    },
  ],
};

/* ---- Wednesday: business formats, sourcing ----------------------------------------------------------------------- */
ACTIVITIES.w3d3 = {
  p1: [
    {
      type: 'choice', title: 'Is a booth at the market right for this seller?',
      items: [
        { q: 'A seller has under $1,000 to start and wants direct customer feedback. Which format fits best?', opts: ['Food truck', 'Booth at a farmers market', 'Large catering company', 'Restaurant lease'], ans: 1, why: 'The farmers market booth is the simplest entry point: low capital (possible under $1,000), and a direct customer feedback loop.' },
        { q: 'Someone bakes non-TCS cookies at home and wants to sell them directly to consumers. What does the lesson say about Virginia?', opts: ['It is not allowed without a truck', 'Virginia cottage food law allows sale of non-TCS foods made at home directly to consumers', 'Only if sold through a grocery store', 'Only with a commissary kitchen'], ans: 1, why: 'The lesson states that cottage food law allows non-TCS foods made at home to be sold directly to consumers. TCS foods require a licensed commissary kitchen.' },
        { q: 'Another seller wants to sell a TCS food made at home. What does the lesson say?', opts: ['Cottage food law covers it', 'It requires a licensed commissary kitchen', 'No rules apply', 'Only a tent is required'], ans: 1, why: 'TCS (temperature-controlled) foods require a licensed commissary kitchen, so they do not fall under the cottage food rule for non-TCS foods.' },
      ],
    },
    {
      type: 'fill', title: 'Booth startup budget',
      intro: 'Practice figures (not real prices, except that the lesson says a tent runs $100–$300 and market fees $25–$150/day). Add up this budget: tent $200, tables and display $120, signage $60, packaging $90, first day market fee $50.',
      rows: [
        { label: 'Total startup cost', unit: '$', ans: 520, tol: 0.01 },
        { label: 'Money left from a $1,000 budget', unit: '$', ans: 480, tol: 0.01 },
      ],
      why: '200 + 120 + 60 + 90 + 50 = $520. 1,000 − 520 = $480 left. The lesson says a total startup under $1,000 is possible for a booth.',
    },
  ],
  p2: [
    {
      type: 'match', title: 'Match the format to its requirement',
      intro: 'Choose the requirement the lesson attaches to each format.',
      options: ['Temporary food establishment permit from the local health department', 'Licensed kitchen and food handler permits for all staff', 'Mobile Retail Food Establishment license in Virginia', 'Virginia cottage food law (non-TCS foods made at home)', 'Licensed commissary kitchen'],
      rows: [
        { label: 'Pop-up at a rotating location', ans: 0 },
        { label: 'Catering an event', ans: 1 },
        { label: 'Food truck', ans: 2 },
        { label: 'Farmers market booth selling home-baked non-TCS goods', ans: 3 },
        { label: 'Farmers market booth selling TCS foods', ans: 4 },
      ],
      why: 'Pop-ups need a temporary food establishment permit from the local health department. Catering needs a licensed kitchen and food handler permits for all staff. A food truck needs a Mobile Retail Food Establishment license in Virginia. Non-TCS home foods fall under cottage food law, while TCS foods require a licensed commissary kitchen.',
    },
    {
      type: 'choice', title: 'Choose the format',
      items: [
        { q: 'A new seller has $2,000 and wants to test demand before committing more. Which is the most sensible first step?', opts: ['Buy a built food truck at $50,000–$150,000', 'Start at a farmers market or pop-up, the lower-capital entry points', 'Wait three years to save more', 'Open with a catering contract for 300 guests'], ans: 1, why: 'A built truck costs $50,000–$150,000. Farmers markets are the simplest entry and pop-ups are often the first step beyond them.' },
        { q: 'Which format has ongoing vehicle maintenance, fuel and commissary costs?', opts: ['Farmers market booth', 'Food truck', 'Pop-up', 'Online recipes'], ans: 1, why: 'The lesson lists vehicle maintenance, fuel and commissary costs as ongoing costs of a food truck.' },
        { q: 'A caterer earns more per event than a market stall. What is the trade-off the lesson names?', opts: ['None: catering is simpler', 'Higher production complexity', 'Lower revenue', 'No kitchen needed'], ans: 1, why: 'Catering has higher revenue per event but higher production complexity, along with the licensed kitchen and staff food handler permit requirements.' },
      ],
    },
  ],
  p3: [
    {
      type: 'choice', title: 'Sourcing and vendors',
      items: [
        { q: 'You make a large volume of one item and want the lowest cost per unit. Where do you look first?', opts: ['A local specialty farm only', 'A wholesale supplier such as Restaurant Depot or Sysco, which offers lower per-unit costs but needs volume', 'The most expensive vendor', 'Ask customers to bring ingredients'], ans: 1, why: 'Wholesale suppliers offer lower per-unit costs but require volume. Local farms and specialty vendors cost more but add quality and storytelling value.' },
        { q: 'Which approach builds a good supplier relationship?', opts: ['Pay late and negotiate hard', 'Pay on time, communicate your volume needs in advance, and give feedback on quality', 'Only call when something is wrong', 'Buy from a different vendor every week'], ans: 1, why: 'Good vendor relationships create price flexibility over time. Paying on time, sharing your volume needs and giving feedback all help.' },
        { q: 'You will process tomatoes into sauce right away. Which negotiation idea fits?', opts: ['Ask about scratch-and-dent or short-coded product for items processed immediately', 'Never ask for discounts', 'Always pay the full case price', 'Buy only from one vendor'], ans: 0, why: 'The lesson suggests asking about scratch-and-dent or short-coded product for items that will be processed immediately, asking for case pricing, and keeping multiple vendors.' },
        { q: 'Why keep relationships with more than one vendor?', opts: ['To confuse suppliers', 'So you have options if a price rises or a vendor cannot deliver', 'To avoid paying any of them', 'It is required by law'], ans: 1, why: 'Multiple vendors give you options, which is part of cost negotiation basics.' },
      ],
    },
    {
      type: 'reflect', title: 'Your sourcing plan',
      prompts: [
        { key: 'sourcing', label: 'Choose one main ingredient for your concept. Where would you source it and why?', help: 'Compare at least two sources (for example wholesale versus a local farm) on cost, volume and quality.', items: 1, minWords: 25, rows: 5,
          keywords: [{ match: 'wholesale|Sysco|Restaurant Depot', tip: 'a wholesale option' }, { match: 'local|farm|specialty', tip: 'a local farm or specialty vendor' }, { match: 'cost|price|volume|case', tip: 'cost, volume or case pricing' }, { match: 'quality|story|fresh', tip: 'quality or storytelling value' }] },
      ],
      model: 'My main ingredient is chicken. A wholesale supplier like Restaurant Depot would give me a lower price per pound if I buy a case, which suits my volume. A local farm would cost more but I could tell customers where the chicken comes from. I will start with wholesale for cost and ask a local farm about case pricing so I have a second vendor.',
    },
  ],
};

/* ---- Thursday: customers, demand, permits ------------------------------------------------------------------------ */
ACTIVITIES.w3d4 = {
  p1: [
    {
      type: 'reflect', title: 'Define your customer',
      intro: 'Describe one specific customer for your concept in the terms the lesson lists. Avoid "everyone".',
      prompts: [
        { key: 'who', label: 'Who is your customer?', help: 'Include age range, income level, geography, and values (for example health-conscious, culturally connected, convenience-driven).', items: 1, minWords: 25, rows: 5,
          keywords: [{ match: 'age|aged|\\d+', tip: 'an age range' }, { match: 'income|budget|afford|\\$', tip: 'income level' }, { match: 'neighborhood|city|Richmond|local|area|live', tip: 'where they live' }, { match: 'health|cultur|conven|value', tip: 'their values' }] },
        { key: 'buy', label: 'Where do they currently buy what you sell?', help: 'Name the specific places.', items: 1, minWords: 12, rows: 3 },
      ],
      model: 'My customer is a woman aged 28 to 45 with a household income around $60,000 who lives in or near the Fan district in Richmond. She is health-conscious and likes food with a story. Right now she buys lunch from the Saturday farmers market and from two local cafes near her office.\nShe currently buys prepared meals at the farmers market and from the cafes near her work.',
    },
    {
      type: 'order', title: 'Test demand before you commit',
      intro: 'Put these in order, first step at the top.',
      steps: ['Choose the market where you plan to sell', 'Attend that market and observe what sells out and what sits', 'Talk to vendors about their customers and what works', 'Compare your product and price to what you saw', 'Adjust your product and price, then commit'],
      why: 'Pick the market, watch what sells out and what sits, talk to vendors, compare, and only then commit. The lesson warns against building a product first and then looking for a customer.',
    },
    {
      type: 'choice', title: 'Pricing and customer alignment',
      items: [
        { q: 'Your product is a $14 plate, but you are choosing between a $5 farmers market and a curated food festival. Which is the better fit?', opts: ['The $5 market, since the lowest price wins', 'The curated food festival, where customers expect $14 items', 'Either, since customers never compare', 'Neither: change the product to be free'], ans: 1, why: 'The lesson says a customer at a $5 market expects $5 items and a customer at a curated festival expects $14 items. Same product, different customer, different price point, different margin.' },
        { q: 'A vendor at the market tells you the cookies at the end of the row always sit while the brownies sell out. What should you do with that?', opts: ['Ignore it', 'Treat it as demand information and shape your menu around what sells', 'Copy the cookies since they are different', 'Raise your cookie price'], ans: 1, why: 'Talking to vendors and observing what sells out and what sits is exactly how the lesson says to read demand.' },
        { q: 'Which description of a customer is specific enough to use?', opts: ['Anyone who likes food', 'Adults 30 to 50, middle income, living near the downtown market, who value local ingredients', 'People with money', 'Everyone in Virginia'], ans: 1, why: 'A good definition names age range, income level, geography, values and where they currently buy.' },
      ],
    },
  ],
  p2: [
    {
      type: 'match', title: 'Which rule applies?',
      intro: 'Choose the item that matches each description from the lesson.',
      options: ['Virginia food handler permit', 'Business registration with the Virginia State Corporation Commission', 'Health department inspection', 'VDACS'],
      rows: [
        { label: 'Required for anyone who handles open food in a food service establishment', ans: 0 },
        { label: 'Register your business name; an LLC protects your personal money and property', ans: 1 },
        { label: 'Required before opening a commercial kitchen or selling non-cottage food products', ans: 2 },
        { label: 'Regulates cottage food operations and farmers market vendors; check product-specific requirements', ans: 3 },
        { label: 'Obtained through the local health department or an approved training program', ans: 0 },
      ],
      why: 'The food handler permit is for anyone handling open food and comes through the local health department or an approved training program. Business registration is with the Virginia State Corporation Commission. Commercial kitchens and non-cottage food products must pass a health department inspection. VDACS regulates cottage food operations and farmers market vendors.',
    },
    {
      type: 'choice', title: 'Permit scenarios',
      items: [
        { q: 'You want an LLC to protect your personal money and property. Where do you register, and what does the lesson say it costs?', opts: ['With VDACS, free', 'With the Virginia State Corporation Commission, a $100 filing fee', 'With the health department, $25', 'No registration is needed for an LLC'], ans: 1, why: 'The lesson says to register your business name with the Virginia State Corporation Commission, and that the LLC filing fee is $100.' },
        { q: 'You will cook in a commercial kitchen and sell non-cottage food products. What must happen before you open?', opts: ['Nothing', 'You must pass a health department inspection', 'Only register with the SCC', 'Just get a tent'], ans: 1, why: 'Any food business operating from a commercial kitchen or selling non-cottage food products must pass a health department inspection before opening.' },
        { q: 'You are not sure what rules apply to your specific farmers market product. What does the lesson tell you to do?', opts: ['Assume none apply', 'Check product-specific requirements with VDACS', 'Ask a customer', 'Wait until someone complains'], ans: 1, why: 'VDACS regulates cottage food operations, farmers market vendors and certain food products, so the lesson tells you to check product-specific requirements.' },
      ],
    },
  ],
};

/* ---- Saturday Lab 3: production and costing in action ------------------------------------------------------------ */
ACTIVITIES.w3lab = {
  end: [
    {
      type: 'fill', title: 'Costing worksheet: practice recipe',
      intro: 'Practice recipe: Herb Chicken Rice Bowls, a batch of 8 portions, as it might appear on a standardized card. Weights recorded at the start: chicken 5 lbs AP at $3.20 per lb (4 lbs EP after trimming); vegetables $6.00; sauce $4.00; rice $2.00. Target food cost: 35% (a pop-up range).',
      rows: [
        { label: 'Chicken yield percentage (EP ÷ AP)', unit: '%', ans: 80, tol: 0.1 },
        { label: 'Total ingredient cost for the batch', unit: '$', ans: 28, tol: 0.01 },
        { label: 'Plate cost (one portion)', unit: '$', ans: 3.5, tol: 0.01 },
        { label: 'Minimum sale price at a 35% target', unit: '$', ans: 10, tol: 0.01 },
      ],
      why: 'Yield = 4 ÷ 5 = 80%. Chicken cost is 5 lbs AP × $3.20 = $16.00. Batch total = 16.00 + 6.00 + 4.00 + 2.00 = $28.00. Plate cost = 28.00 ÷ 8 = $3.50. Price = 3.50 ÷ 0.35 = $10.00.',
    },
    {
      type: 'order', title: 'The flow of lab day',
      intro: 'Put the lab flow in order, first step at the top.',
      steps: ['Receive and read your standardized recipe card', 'Weigh ingredients and record the weights at the start', 'Produce the dish while costing it on the Recipe Cost Sheet', 'Plate and present the finished dish to the cohort', 'Take part in peer critique', 'Submit your costed recipe card at the end of lab'],
      why: 'Start from the standardized card, weigh and record before you cook, produce and cost together, plate and present, hear critique, and submit the costed card at the end.',
    },
    {
      type: 'reflect', title: 'Post-lab critique',
      intro: 'Look at your cost sheet and the feedback you received.',
      prompts: [
        { key: 'sheet', label: 'What did the cost sheet show me?', help: 'Name a specific cost, yield or plate cost number that surprised or taught you something.', items: 1, minWords: 20, rows: 4,
          keywords: [{ match: 'cost|plate|yield|price|percent|%', tip: 'a specific cost or percentage' }, { match: 'weigh|weight|EP|AP|trim', tip: 'the recorded weights' }] },
        { key: 'change', label: 'What would I change next time?', help: 'About the recipe, portion, price or your process.', items: 1, minWords: 20, rows: 4,
          keywords: [{ match: 'portion|recipe|price|process|order|prep', tip: 'a specific change' }, { match: 'because|so that|to reduce|to improve', tip: 'why that change helps' }] },
      ],
      model: 'The cost sheet showed me that my chicken cost more than I expected because the trim loss meant I paid for 5 lbs but only used 4, so my plate cost was higher than the invoice price suggested.\nNext time I would weigh the trim as I go, tighten my portion so the plate cost stays closer to my target, and check the price against what the market will pay before I commit to it.',
    },
  ],
};
