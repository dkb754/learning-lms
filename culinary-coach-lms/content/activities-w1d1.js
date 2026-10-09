/* Week 1 · Monday (w1d1) — Mise en Place. Reference example for the activity schema (see activities-engine.js and tools/check-activities.mjs). */
ACTIVITIES.w1d1 = {
  p1: [
    {
      type: 'choice', title: 'What mise en place really means',
      intro: 'Answer all four, then check. You will see why each answer is right.',
      items: [
        { q: 'What does "mise en place" mean in a professional kitchen?', opts: ['Everything in its place, physically and mentally, before service begins', 'A French sauce made from stock', 'A technique for cutting vegetables quickly', 'The list of dishes on tonight’s menu'], ans: 0, why: 'It is a mindset from the French brigade system, not a single technique: everything in its place before service begins.' },
        { q: 'A messy station during service is best described as:', opts: ['A symptom of a disorganized mind: the setup reveals the operator', 'Normal in a busy kitchen', 'Proof that the cook is working hard', 'Only a problem during health inspections'], ans: 0, why: 'Working clean and thinking clean go together. How you set up shows how you think.' },
        { q: 'How does mise en place help you when the kitchen gets busy and everything is moving fast?', opts: ['You made the decisions ahead of time, so nothing slows you down while you cook', 'It lets you skip reading the recipe', 'It means you never have to taste the food', 'It gives you more time to take breaks'], ans: 0, why: 'The thinking is done before service starts. During the rush you only have to cook.' },
        { q: 'Two cooks work the same service. Cook A prepped and staged everything. Cook B started cutting when the first ticket came in. What is the most likely result?', opts: ['A keeps pace with calm decisions; B falls behind and makes avoidable mistakes', 'Both finish at the same time', 'B finishes first because B started fresh', 'A runs out of ingredients'], ans: 0, why: 'Same service, different outcomes. Preparation moves the work out of the pressure window.' },
      ],
    },
    {
      type: 'reflect', title: 'Cook A and Cook B: your turn',
      intro: 'Think about the two line cooks. Write your answer in full sentences.',
      prompts: [
        { key: 'cookb', label: 'What three things should Cook B have done before service started?', help: 'Be specific about the work, not just "be ready".', items: 1, minWords: 15, rows: 4,
          keywords: [{ match: 'prep|cut|chop|portion', tip: 'the prep work itself (cutting, portioning)' }, { match: 'label|stage|contain|organi[sz]e|set ?up', tip: 'staging and labeling containers in order of use' }, { match: 'read|list|plan|recipe', tip: 'reading the prep list or recipe first' }] },
      ],
      model: 'Cook B should have read the whole prep list, done the cutting and portioning that could be done ahead, and staged labeled containers in order of use within reach. Then during service every decision was already made and Cook B only had to execute.',
    },
  ],
  p2: [
    { type: 'diagram', svg: 'workstation', title: 'Your professional workstation', caption: 'Board centered in front of you. Waste bowl top right of the board. Damp towel on your left. Containers staged in order of use. Knife roll closed and off the floor.' },
    { type: 'diagram', svg: 'boards', title: 'Color-coded cutting boards', caption: 'Red raw proteins · yellow poultry · green produce · white ready-to-eat · blue seafood.' },
    {
      type: 'match', title: 'Match the board to the job',
      intro: 'Choose the cutting board color for each use.',
      options: ['Red', 'Yellow', 'Green', 'White', 'Blue'],
      rows: [{ label: 'Raw beef and pork', ans: 0 }, { label: 'Chicken breasts', ans: 1 }, { label: 'Lettuce and tomatoes', ans: 2 }, { label: 'Sliced bread and cooked foods', ans: 3 }, { label: 'Salmon fillets', ans: 4 }],
      why: 'Red = raw proteins, yellow = poultry, green = produce, white = ready-to-eat, blue = seafood. Sanitize between tasks, not just between proteins.',
    },
    {
      type: 'order', title: 'Set up your station',
      intro: 'Put these in a sensible order, first step at the top. Use the arrows.',
      steps: ['Read the whole prep list and recipe', 'Gather your knife roll, board and towel', 'Square the board to the counter edge and set the damp towel on your left', 'Place the waste bowl at the top right of the board', 'Prep, label and stage containers in order of use'],
      why: 'Read first, gather, set the board and towel, place the waste bowl, then prep and stage in order of use.',
    },
    {
      type: 'choice', title: 'Workstation details',
      items: [
        { q: 'How should the towel at your station be used?', opts: ['Damp, on your left, to wipe the board between cuts, never to dry your hands', 'Dry, shared with the next cook', 'Over your shoulder to dry your hands', 'On the floor so it stays out of the way'], ans: 0, why: 'A damp personal towel wipes the board between cuts. It is never shared and never on the floor.' },
        { q: 'A mise en place container is labeled with:', opts: ['Ingredient name, date prepped, use-by date and your initials', 'Only the ingredient name', 'The price of the ingredient', 'Nothing if you will use it today'], ans: 0, why: 'Name, prep date, use-by date and initials let anyone read the container at a glance.' },
        { q: 'Where does the waste bowl go?', opts: ['Top right of the cutting board', 'On the floor', 'Across the kitchen by the sink', 'Directly on the board'], ans: 0, why: 'It keeps trim moving off the board without cross-contamination and keeps the station clear.' },
        { q: 'Which pieces are the minimum knife roll?', opts: ['Chef’s knife, paring knife, bench scraper, peeler, honing steel', 'Only a chef’s knife', 'A cleaver and a fork', 'Whatever the kitchen provides'], ans: 0, why: 'Each piece has a designated position and the closed roll stays off the floor.' },
      ],
    },
  ],
  p3: [
    {
      type: 'reflect', title: 'Build your Honest Map', exampleFirst: true,
      intro: 'Your Honest Map is a list of the hard parts of working in food. If you know them now, nothing catches you off guard later. How to do it: picture a busy shift at a restaurant, a market stand or a catering job. Ask yourself what could be hard. Write each hard thing on its own line. Write at least 3 in each of the 4 boxes, a few words each. Not sure what to write? Read the hint under each box title. The gray example in each box shows the style. When you finish, click Check, then Download. You will upload that file on Thursday, Oct 15.',
      prompts: [
        { key: 'physical', label: 'Your body (Physical)', help: 'What will be hard on your body? Think about standing, heat, speed, lifting, burns and cuts.', items: 3, minWords: 3, rows: 5,
          placeholder: 'One hard thing per line. Example: Standing on a hard floor for eight hours',
          keywords: [{ match: 'stand|feet|floor|lift|carry', tip: 'standing or lifting all day' }, { match: 'heat|hot|burn|steam', tip: 'heat and burns' }, { match: 'cut|knife|slip|injur', tip: 'cuts, slips and small injuries' }, { match: 'pace|fast|rush|speed|repeat', tip: 'working fast and doing the same motion again and again' }] },
        { key: 'emotional', label: 'Your feelings (Emotional)', help: 'What will be hard on your feelings? Think about rude customers, criticism, and staying calm when it gets busy.', items: 3, minWords: 3, rows: 5,
          placeholder: 'One hard thing per line. Example: A customer sends a dish back and is rude about it',
          keywords: [{ match: 'customer|guest|rude|complain', tip: 'rude or demanding customers' }, { match: 'critic|feedback|send.*back|bad review', tip: 'people criticizing your food' }, { match: 'pressure|stress|rush|busy', tip: 'staying calm in a rush' }, { match: 'colleague|coworker|team|chef', tip: 'hard coworkers' }] },
        { key: 'relational', label: 'Your people (Relational)', help: 'Who will you work with or answer to? Think about the chef, your coworkers, and being corrected in front of others.', items: 3, minWords: 3, rows: 5,
          placeholder: 'One hard thing per line. Example: Being corrected by the chef in front of the whole line',
          keywords: [{ match: 'chef|boss|manager|hierarch|in charge', tip: 'working for a chef or manager' }, { match: 'correct|corrected|criticis|called out', tip: 'being corrected in front of others' }, { match: 'team|line|coworker|colleague|conflict', tip: 'how the team works together in a rush' }] },
        { key: 'economic', label: 'Your money (Economic)', help: 'What will be hard about money and time? Think about starting pay, hours that change, tips, and buying your own tools.', items: 3, minWords: 3, rows: 5,
          placeholder: 'One hard thing per line. Example: Starting pay that barely covers rent',
          keywords: [{ match: 'wage|pay|salary|paid|money', tip: 'starting pay' }, { match: 'hour|schedule|shift|overtime', tip: 'hours that change' }, { match: 'tip', tip: 'tips vs. a steady paycheck' }, { match: 'knife|equipment|uniform|shoes|cost', tip: 'the cost of your own tools and gear' }] },
      ],
      model: 'YOUR BODY (PHYSICAL)\n- Standing on a hard floor for eight hours straight\n- Burns and cuts during a rush\n- Lifting heavy stockpots and cases\n\nYOUR FEELINGS (EMOTIONAL)\n- A customer sends a dish back and is rude about it\n- Getting criticized for food I was proud of\n- Staying calm when five orders come in at once\n\nYOUR PEOPLE (RELATIONAL)\n- Being corrected by the chef in front of the line\n- A coworker who will not talk to me during a rush\n- Learning who is in charge and where I fit\n\nYOUR MONEY (ECONOMIC)\n- Starting pay that barely covers rent\n- Hours that change every week\n- Paying for my own knives and non-slip shoes',
      download: { label: 'Honest Map', title: 'My Honest Map: Culinary Entrepreneurship I', filename: 'honest-map' },
    },
  ],
};
