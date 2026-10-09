/* Week 1 · Monday (w1d1) — Mise en Place. Reference example for the activity schema (see activities-engine.js and tools/check-activities.mjs). */
ACTIVITIES.w1d1 = {
  p1: [
    {
      type: 'choice', title: 'What mise en place really means',
      intro: 'Answer all four, then check. You will see why each answer is right.',
      items: [
        { q: 'What does "mise en place" mean in a professional kitchen?', opts: ['Everything in its place, physically and mentally, before service begins', 'A French sauce made from stock', 'A technique for cutting vegetables quickly', 'The list of dishes on tonight’s menu'], ans: 0, why: 'It is a mindset from the French brigade system, not a single technique: everything in its place before service begins.' },
        { q: 'A messy station during service is best described as:', opts: ['A symptom of a disorganized mind: the setup reveals the operator', 'Normal in a busy kitchen', 'Proof that the cook is working hard', 'Only a problem during health inspections'], ans: 0, why: 'Working clean and thinking clean go together. How you set up shows how you think.' },
        { q: 'How does mise en place reduce cognitive load during high-pressure service?', opts: ['Decisions made in advance cannot slow you down during execution', 'It lets you skip reading the recipe', 'It means you never have to taste the food', 'It gives you more time to take breaks'], ans: 0, why: 'The thinking is done before service, so during service you only execute.' },
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
      type: 'reflect', title: 'Build your Honest Map',
      intro: 'List the stressors you expect in culinary and hospitality work, one per line, in each of the four categories. Write at least three specific entries per category (at least three words each). This is your working reference for the whole cohort and your first KRP Portfolio deliverable. Download it when you are done and upload that file on Thursday, Oct 15 as your Honest Map.',
      prompts: [
        { key: 'physical', label: 'Physical', help: 'pace, standing, heat, repetitive motion, minor injuries', items: 3, minWords: 3, rows: 5,
          placeholder: 'One per line. Example: Standing on a hard floor for eight hours',
          keywords: [{ match: 'stand|feet|floor|lift|carry', tip: 'standing or lifting all day' }, { match: 'heat|hot|burn|steam', tip: 'heat and burns' }, { match: 'cut|knife|slip|injur', tip: 'cuts, slips, minor injuries' }, { match: 'pace|fast|rush|speed|repeat', tip: 'pace and repetitive motion' }] },
        { key: 'emotional', label: 'Emotional', help: 'customer incivility, difficult colleagues, pressure, criticism of your food', items: 3, minWords: 3, rows: 5,
          placeholder: 'One per line. Example: A customer sends a dish back and is rude about it',
          keywords: [{ match: 'customer|guest|rude|complain', tip: 'rude or demanding customers' }, { match: 'critic|feedback|send.*back|bad review', tip: 'criticism of your food' }, { match: 'pressure|stress|rush|busy', tip: 'high-pressure moments' }, { match: 'colleague|coworker|team|chef', tip: 'difficult colleagues' }] },
        { key: 'relational', label: 'Relational', help: 'kitchen hierarchy, working under a chef, team dynamics, correction in front of peers', items: 3, minWords: 3, rows: 5,
          placeholder: 'One per line. Example: Being corrected by the chef in front of the whole line',
          keywords: [{ match: 'chef|boss|manager|hierarch', tip: 'working under a chef or manager' }, { match: 'correct|corrected|criticis|called out', tip: 'being corrected in front of others' }, { match: 'team|line|coworker|colleague|conflict', tip: 'team dynamics during service' }] },
        { key: 'economic', label: 'Economic', help: 'entry-level wages, unpredictable hours, tips vs salary, cost of equipment', items: 3, minWords: 3, rows: 5,
          placeholder: 'One per line. Example: Entry-level pay that barely covers rent',
          keywords: [{ match: 'wage|pay|salary|paid|money', tip: 'entry-level wages' }, { match: 'hour|schedule|shift|overtime', tip: 'unpredictable hours' }, { match: 'tip', tip: 'tips vs salary' }, { match: 'knife|equipment|uniform|shoes|cost', tip: 'the cost of your own equipment' }] },
      ],
      model: 'PHYSICAL\n- Standing on a hard floor for eight hours straight\n- Burns and cuts during a rush\n- Lifting heavy stockpots and cases\n\nEMOTIONAL\n- A customer sends a dish back and is rude about it\n- Getting criticized for food I was proud of\n- Staying calm when five tickets hit at once\n\nRELATIONAL\n- Being corrected by the chef in front of the line\n- A coworker who will not communicate during service\n- Learning the kitchen hierarchy and where I fit\n\nECONOMIC\n- Entry-level pay that barely covers rent\n- Schedules that change week to week\n- Paying for my own knives and non-slip shoes',
      download: { label: 'Honest Map', title: 'My Honest Map: Culinary Entrepreneurship I', filename: 'honest-map' },
    },
  ],
};
