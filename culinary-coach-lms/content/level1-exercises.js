/* Week 1, Wednesday (w1d3): three scaling exercises of increasing difficulty. The page shows the prompts; the ANSWERS live only
 * on the server (supabase/functions/lms-api-v2, EXERCISES) and are graded there, so a student cannot read them from the page.
 * Keep the `key`s here identical to the keys there. */
const EXERCISES = [
  {
    id: 'ex1', title: 'Exercise 1 · Scale up a vinaigrette', level: 'Warm-up',
    intro: 'This house vinaigrette makes 4 portions. Scale it to 24 portions using one conversion factor.',
    recipe: [['Olive oil', '4 oz'], ['Red wine vinegar', '2 oz'], ['Dijon mustard', '1 tbsp'], ['Kosher salt', '1 tsp']],
    inputs: [
      { key: 'factor', label: 'Conversion factor (24 ÷ 4)', unit: '×' },
      { key: 'oil', label: 'Olive oil for 24 portions', unit: 'oz' },
      { key: 'vinegar', label: 'Red wine vinegar for 24 portions', unit: 'oz' },
      { key: 'dijon', label: 'Dijon mustard for 24 portions', unit: 'tbsp' },
      { key: 'salt', label: 'Kosher salt for 24 portions', unit: 'tsp' },
    ],
  },
  {
    id: 'ex2', title: 'Exercise 2 · Scale down and convert units', level: 'Intermediate',
    intro: 'This tomato soup makes 40 portions. Scale it down to 10 portions, then convert units. (1 qt = 4 cups.)',
    recipe: [['Yellow onion', '8 lb'], ['Chicken stock', '10 qt'], ['Heavy cream', '2 qt']],
    inputs: [
      { key: 'factor', label: 'Conversion factor (10 ÷ 40)', unit: '×' },
      { key: 'onion', label: 'Onion for 10 portions', unit: 'lb' },
      { key: 'stock', label: 'Stock for 10 portions', unit: 'qt' },
      { key: 'cream', label: 'Cream for 10 portions', unit: 'qt' },
      { key: 'cream_cups', label: 'Cream for 10 portions, in cups', unit: 'cups' },
    ],
  },
  {
    id: 'ex3', title: 'Exercise 3 · Scale up with yield', level: 'Advanced',
    intro: 'A recipe for 12 portions needs the edible-portion (EP) amounts below. You are cooking for 30 portions. Scale the EP amounts, then work out how much to BUY (as purchased, AP) using the yield percentage. AP = EP ÷ yield. Round pounds to two decimals.',
    recipe: [['Diced onion (EP) for 12 portions', '3 lb'], ['Onion yield after peeling and trimming', '88%'], ['Boneless chicken (EP) for 12 portions', '4.5 lb'], ['Chicken yield from bone-in, skin-on', '75%']],
    inputs: [
      { key: 'factor', label: 'Conversion factor (30 ÷ 12)', unit: '×' },
      { key: 'onion_ep', label: 'Onion needed (EP) for 30 portions', unit: 'lb' },
      { key: 'onion_ap', label: 'Onion to buy (AP)', unit: 'lb' },
      { key: 'chicken_ep', label: 'Chicken needed (EP) for 30 portions', unit: 'lb' },
      { key: 'chicken_ap', label: 'Chicken to buy (AP)', unit: 'lb' },
    ],
  },
];
LEVEL1.days.forEach(d => { if (d.id === 'w1d3') d.exercises = EXERCISES; });
