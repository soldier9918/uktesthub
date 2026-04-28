export type MCQQuestion = {
  type?: "mcq";
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  image?: string;
  signType?: string;
};

export type FillBlanksQuestion = {
  type: "fill-blanks";
  id: number;
  // Sentence with placeholders like {{0}}, {{1}}.
  template: string;
  prompt?: string;
  blanks: { options: string[]; correctIndex: number }[];
  explanation: string;
};

export type Question = MCQQuestion | FillBlanksQuestion;

export type Quiz = {
  slug: string;
  category: string; // category slug
  topic: string; // topic slug
  quizTitle: string;
  description: string;
  timeLimit: number; // seconds
  difficulty: "Easy" | "Medium" | "Hard";
  passMark: number; // percentage
  questions: Question[];
};

export const quizzes: Quiz[] = [
  // -------------------- DRIVING --------------------
  {
    slug: "driving-theory-mock-1",
    category: "driving",
    topic: "driving-theory",
    quizTitle: "UK Driving Theory — Mock Test 1",
    description:
      "A 10-question DVSA-style mock test covering rules of the road, safety and driving conditions.",
    timeLimit: 600,
    difficulty: "Medium",
    passMark: 86,
    questions: [
      {
        id: 1,
        question: "What is the national speed limit on a single carriageway for cars?",
        options: ["50 mph", "60 mph", "70 mph", "40 mph"],
        correctAnswer: 1,
        explanation: "On a single carriageway, the national speed limit for cars is 60 mph.",
      },
      {
        id: 2,
        question: "When MUST you use your headlights?",
        options: [
          "Only at night",
          "When visibility is seriously reduced",
          "On all motorways",
          "Whenever it rains",
        ],
        correctAnswer: 1,
        explanation:
          "You must use headlights when visibility is seriously reduced, generally when you can't see for more than 100 metres (328 ft).",
      },
      {
        id: 3,
        question: "What does a broken white line along the centre of the road mean?",
        options: [
          "No overtaking",
          "Hazard ahead",
          "Lane marking — you may cross if safe",
          "Edge of the carriageway",
        ],
        correctAnswer: 2,
        explanation:
          "A broken white line marks lanes or the centre of the road and may be crossed when safe.",
      },
      {
        id: 4,
        question: "You're approaching a zebra crossing and a pedestrian is waiting. You should:",
        options: [
          "Wave them across",
          "Sound your horn",
          "Slow down and prepare to stop",
          "Continue at the same speed",
        ],
        correctAnswer: 2,
        explanation:
          "Slow down and prepare to stop. Never wave pedestrians across — another driver may not have seen them.",
      },
      {
        id: 5,
        question: "The legal alcohol limit for drivers in England is:",
        options: [
          "80 mg per 100 ml of blood",
          "50 mg per 100 ml of blood",
          "100 mg per 100 ml of blood",
          "There is no limit",
        ],
        correctAnswer: 0,
        explanation:
          "In England, Wales and Northern Ireland the limit is 80 mg per 100 ml of blood. In Scotland it is lower (50 mg).",
      },
      {
        id: 6,
        question: "What's the minimum tread depth for car tyres in the UK?",
        options: ["1.0 mm", "1.6 mm", "2.0 mm", "3.0 mm"],
        correctAnswer: 1,
        explanation:
          "The legal minimum tread depth is 1.6 mm across the central three-quarters of the tyre.",
      },
      {
        id: 7,
        question: "You see a red triangle road sign. It means:",
        options: ["Order", "Warning", "Information", "Direction"],
        correctAnswer: 1,
        explanation: "Triangular signs warn you of hazards ahead.",
      },
      {
        id: 8,
        question: "When can you overtake on the left?",
        options: [
          "Never",
          "When the vehicle ahead is signalling to turn right and there's room",
          "Whenever the road is clear",
          "Only on a motorway",
        ],
        correctAnswer: 1,
        explanation:
          "You may pass on the left when the vehicle ahead is turning right, in slow-moving queues, or in one-way streets.",
      },
      {
        id: 9,
        question: "What should you do if you're dazzled by oncoming headlights?",
        options: [
          "Flash your headlights",
          "Slow down or stop",
          "Close your eyes briefly",
          "Speed up",
        ],
        correctAnswer: 1,
        explanation: "Slow down or stop until your eyes recover.",
      },
      {
        id: 10,
        question: "The 'two-second rule' is used to:",
        options: [
          "Time your indicator",
          "Keep a safe following distance in good conditions",
          "Set the wipers",
          "Time gear changes",
        ],
        correctAnswer: 1,
        explanation:
          "It's a guide to keep a safe gap from the vehicle ahead in good, dry conditions.",
      },
    ],
  },
  {
    slug: "road-signs-essentials",
    category: "driving",
    topic: "road-signs",
    quizTitle: "UK Road Signs — Identify the Sign",
    description:
      "Look at each UK road sign and choose what it means. Covers warning, order and information signs.",
    timeLimit: 480,
    difficulty: "Easy",
    passMark: 80,
    questions: [
      {
        id: 1,
        question: "What does this sign mean?",
        signType: "stop",
        options: ["Give way", "Stop", "No entry for vehicles", "End of restriction"],
        correctAnswer: 1,
        explanation:
          "The octagonal red STOP sign is unique — you must come to a complete stop at the line.",
      },
      {
        id: 2,
        question: "What does this sign mean?",
        signType: "giveWay",
        options: ["Stop", "Give way to traffic on the major road", "No through road", "Roundabout ahead"],
        correctAnswer: 1,
        explanation:
          "An inverted red triangle means 'Give way' — slow down and yield to traffic on the main road.",
      },
      {
        id: 3,
        question: "What does this sign mean?",
        signType: "noEntry",
        options: ["No entry for vehicular traffic", "One-way street", "No stopping", "Road closed"],
        correctAnswer: 0,
        explanation:
          "A red circle with a white horizontal bar means no entry for vehicular traffic.",
      },
      {
        id: 4,
        question: "What is the maximum speed allowed?",
        signType: "speed30",
        options: ["20 mph", "30 mph", "40 mph", "National speed limit"],
        correctAnswer: 1,
        explanation:
          "A red ring around a number sets the maximum speed limit in mph — here, 30 mph.",
      },
      {
        id: 5,
        question: "What does this sign mean?",
        signType: "noOvertaking",
        options: [
          "Two-way traffic",
          "No overtaking",
          "Lane closure ahead",
          "End of dual carriageway",
        ],
        correctAnswer: 1,
        explanation:
          "Two cars in a red ring (one red, one black) means no overtaking.",
      },
      {
        id: 6,
        question: "What does this sign instruct you to do?",
        signType: "turnLeft",
        options: ["Turn left ahead", "Keep left", "No left turn", "One-way left"],
        correctAnswer: 0,
        explanation:
          "Blue circular signs give a positive instruction — this one means turn left ahead.",
      },
      {
        id: 7,
        question: "What does this sign mean?",
        signType: "miniRoundabout",
        options: [
          "Roundabout — give way to traffic from the right",
          "Sharp bend",
          "T-junction",
          "Cycle route",
        ],
        correctAnswer: 0,
        explanation:
          "Blue circular roundabout sign — give way to traffic coming from your right.",
      },
      {
        id: 8,
        question: "What does this warning sign mean?",
        signType: "schoolWarning",
        options: ["Pedestrians in road", "School children crossing", "Playground", "Bus stop"],
        correctAnswer: 1,
        explanation:
          "Red triangle warning of school children likely to cross — slow down and watch for kids.",
      },
      {
        id: 9,
        question: "What does this warning sign mean?",
        signType: "crossroadsWarning",
        options: ["Crossroads ahead", "T-junction", "Staggered junction", "Level crossing"],
        correctAnswer: 0,
        explanation:
          "A red triangle with a plus shape warns of a crossroads ahead.",
      },
      {
        id: 10,
        question: "What hazard does this sign warn you about?",
        signType: "slipperyRoad",
        options: ["Loose chippings", "Slippery road", "Road narrows", "Steep hill"],
        correctAnswer: 1,
        explanation:
          "A car with skid marks in a red triangle warns of a slippery road surface.",
      },
      {
        id: 11,
        question: "What does this sign mean?",
        signType: "nationalSpeedLimit",
        options: [
          "End of speed limit / national speed limit applies",
          "No speed limit at all",
          "30 mph zone",
          "Derestricted footpath",
        ],
        correctAnswer: 0,
        explanation:
          "A white circle with a single black diagonal stripe means the national speed limit applies.",
      },
      {
        id: 12,
        question: "What does this sign mean?",
        signType: "noUTurn",
        options: ["No right turn", "No U-turns", "No through road", "Roundabout"],
        correctAnswer: 1,
        explanation:
          "A U-shaped arrow with a red diagonal bar means no U-turns.",
      },
      {
        id: 13,
        question: "What does this sign instruct you to do?",
        signType: "aheadOnly",
        options: ["Turn left ahead", "Ahead only", "One-way street", "End of dual carriageway"],
        correctAnswer: 1,
        explanation:
          "A blue circle with a single up arrow means you must go straight ahead only.",
      },
      {
        id: 14,
        question: "What does this warning sign mean?",
        signType: "pedestrianCrossing",
        options: ["School crossing", "Pedestrians in road ahead", "Bus stop", "Tram stop"],
        correctAnswer: 1,
        explanation:
          "A pedestrian on zebra stripes warns of a pedestrian crossing or pedestrians in the road ahead.",
      },
      {
        id: 15,
        question: "What does this sign mean?",
        signType: "twoWayTraffic",
        options: ["Two-way traffic ahead", "Overtaking lane", "Lane closed", "Dual carriageway ends"],
        correctAnswer: 0,
        explanation:
          "Two opposing vertical arrows in a triangle warn of two-way traffic on the road ahead.",
      },
      {
        id: 16,
        question: "What does this warning sign mean?",
        signType: "roadWorks",
        options: ["Pedestrians", "Road works ahead", "School", "Hospital"],
        correctAnswer: 1,
        explanation:
          "A figure with a shovel inside a red triangle warns of road works ahead.",
      },
      {
        id: 17,
        question: "What does this sign mean?",
        signType: "levelCrossingNoGate",
        options: [
          "No entry",
          "Level crossing without barrier or gate ahead",
          "Crossroads",
          "Junction closed",
        ],
        correctAnswer: 1,
        explanation:
          "A red triangle with a Saint Andrew's cross warns of a level crossing without a barrier or gate.",
      },
      {
        id: 18,
        question: "What does this sign mean?",
        signType: "endOfRestrictions",
        options: [
          "End of all restrictions previously signed",
          "Closed road",
          "End of motorway",
          "No vehicles allowed",
        ],
        correctAnswer: 0,
        explanation:
          "A white circle with diagonal black lines indicates the end of all previously signed restrictions.",
      },
    ],
  },

  // -------------------- LIFE IN THE UK --------------------
  {
    slug: "life-in-the-uk-mock-1",
    category: "citizenship",
    topic: "life-in-the-uk",
    quizTitle: "Life in the UK — Mock Test 1",
    description:
      "Practice questions covering British history, traditions, government and culture for the Life in the UK Test.",
    timeLimit: 1500,
    difficulty: "Medium",
    passMark: 75,
    questions: [
      {
        id: 1,
        question: "What is the capital city of Scotland?",
        options: ["Glasgow", "Edinburgh", "Aberdeen", "Dundee"],
        correctAnswer: 1,
        explanation: "Edinburgh is the capital of Scotland.",
      },
      {
        id: 2,
        question: "Which flower is associated with England?",
        options: ["Thistle", "Daffodil", "Rose", "Shamrock"],
        correctAnswer: 2,
        explanation: "The rose is the national flower of England.",
      },
      {
        id: 3,
        question: "How often are general elections held in the UK?",
        options: ["Every 3 years", "Every 4 years", "At least every 5 years", "Every 7 years"],
        correctAnswer: 2,
        explanation: "A UK general election must be held at least every five years.",
      },
      {
        id: 4,
        question: "Who wrote the play 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Geoffrey Chaucer"],
        correctAnswer: 1,
        explanation: "Shakespeare wrote Romeo and Juliet in the 16th century.",
      },
      {
        id: 5,
        question: "Which of these is a UK Bank Holiday?",
        options: ["Thanksgiving", "Boxing Day", "Independence Day", "Bastille Day"],
        correctAnswer: 1,
        explanation: "Boxing Day (26 December) is a UK Bank Holiday.",
      },
      {
        id: 6,
        question: "What is the patron saint of Wales?",
        options: ["St George", "St Andrew", "St David", "St Patrick"],
        correctAnswer: 2,
        explanation: "St David is the patron saint of Wales; his day is 1 March.",
      },
      {
        id: 7,
        question: "The House of Commons is made up of:",
        options: ["Lords", "MPs", "Judges", "Bishops"],
        correctAnswer: 1,
        explanation: "Members of Parliament (MPs) sit in the House of Commons.",
      },
      {
        id: 8,
        question: "When did women get the right to vote on the same terms as men?",
        options: ["1918", "1928", "1945", "1969"],
        correctAnswer: 1,
        explanation: "The Equal Franchise Act of 1928 gave women the vote on equal terms.",
      },
    ],
  },
  {
    slug: "uk-geography-quick",
    category: "citizenship",
    topic: "uk-geography",
    quizTitle: "UK Geography — Quick Quiz",
    description: "Test your knowledge of UK cities, rivers and landmarks.",
    timeLimit: 300,
    difficulty: "Easy",
    passMark: 70,
    questions: [
      {
        id: 1,
        question: "The longest river in the UK is the:",
        options: ["Thames", "Severn", "Trent", "Mersey"],
        correctAnswer: 1,
        explanation: "The River Severn is the longest at about 220 miles.",
      },
      {
        id: 2,
        question: "Ben Nevis is located in:",
        options: ["Wales", "England", "Scotland", "Northern Ireland"],
        correctAnswer: 2,
        explanation: "Ben Nevis, the UK's highest mountain, is in Scotland.",
      },
      {
        id: 3,
        question: "Which is the capital of Northern Ireland?",
        options: ["Dublin", "Belfast", "Derry", "Cardiff"],
        correctAnswer: 1,
        explanation: "Belfast is the capital of Northern Ireland.",
      },
      {
        id: 4,
        question: "The Lake District is in which English county?",
        options: ["Yorkshire", "Cumbria", "Devon", "Kent"],
        correctAnswer: 1,
        explanation: "The Lake District National Park is in Cumbria.",
      },
      {
        id: 5,
        question: "Stonehenge is located on:",
        options: ["Salisbury Plain", "Dartmoor", "The South Downs", "Snowdonia"],
        correctAnswer: 0,
        explanation: "Stonehenge stands on Salisbury Plain in Wiltshire.",
      },
    ],
  },

  // -------------------- ENGLISH --------------------
  {
    slug: "ielts-grammar-starter",
    category: "english",
    topic: "grammar",
    quizTitle: "English Grammar — Starter",
    description: "Warm-up grammar quiz suitable for IELTS / ESOL learners.",
    timeLimit: 360,
    difficulty: "Easy",
    passMark: 70,
    questions: [
      {
        id: 1,
        question: "Choose the correct sentence:",
        options: [
          "She don't like coffee.",
          "She doesn't likes coffee.",
          "She doesn't like coffee.",
          "She not like coffee.",
        ],
        correctAnswer: 2,
        explanation: "Use 'doesn't' + base verb in present simple negatives.",
      },
      {
        id: 2,
        question: "I ___ to London three times.",
        options: ["have been", "has been", "am been", "was been"],
        correctAnswer: 0,
        explanation: "Present perfect for life experiences: 'I have been'.",
      },
      {
        id: 3,
        question: "Pick the correct article: '___ honest answer is best.'",
        options: ["A", "An", "The", "No article"],
        correctAnswer: 1,
        explanation: "'Honest' starts with a vowel sound, so we use 'an'.",
      },
      {
        id: 4,
        question: "Which is a comparative adjective?",
        options: ["Quick", "Quickly", "Quicker", "Quickest"],
        correctAnswer: 2,
        explanation: "'Quicker' compares two things; 'quickest' is superlative.",
      },
      {
        id: 5,
        question: "If it ___ tomorrow, we'll stay in.",
        options: ["rains", "will rain", "rained", "would rain"],
        correctAnswer: 0,
        explanation: "First conditional: present simple in the 'if' clause.",
      },
    ],
  },

  // -------------------- EDUCATION --------------------
  {
    slug: "gcse-maths-warmup",
    category: "education",
    topic: "gcse-maths",
    quizTitle: "GCSE Maths — Warm-up",
    description: "Quick-fire arithmetic, percentages and algebra refresh.",
    timeLimit: 360,
    difficulty: "Medium",
    passMark: 60,
    questions: [
      {
        id: 1,
        question: "What is 15% of 200?",
        options: ["20", "25", "30", "35"],
        correctAnswer: 2,
        explanation: "10% of 200 = 20, plus half (5%) = 10. Total 30.",
      },
      {
        id: 2,
        question: "Solve for x: 2x + 6 = 20",
        options: ["6", "7", "8", "10"],
        correctAnswer: 1,
        explanation: "2x = 14, so x = 7.",
      },
      {
        id: 3,
        question: "The area of a triangle with base 10 cm and height 6 cm is:",
        options: ["30 cm²", "60 cm²", "16 cm²", "36 cm²"],
        correctAnswer: 0,
        explanation: "Area = ½ × base × height = ½ × 10 × 6 = 30.",
      },
      {
        id: 4,
        question: "Simplify: 3/4 + 1/8",
        options: ["4/12", "5/8", "7/8", "1"],
        correctAnswer: 2,
        explanation: "3/4 = 6/8; 6/8 + 1/8 = 7/8.",
      },
      {
        id: 5,
        question: "What is √144?",
        options: ["10", "11", "12", "14"],
        correctAnswer: 2,
        explanation: "12 × 12 = 144.",
      },
    ],
  },

  // -------------------- CAREER --------------------
  {
    slug: "numerical-reasoning-starter",
    category: "career",
    topic: "numerical",
    quizTitle: "Numerical Reasoning — Starter",
    description: "Typical numerical aptitude questions used in graduate assessments.",
    timeLimit: 480,
    difficulty: "Medium",
    passMark: 60,
    questions: [
      {
        id: 1,
        question: "A jacket costs £80 with a 25% discount. What was the original price?",
        options: ["£100", "£105", "£106.66", "£110"],
        correctAnswer: 2,
        explanation: "80 ÷ 0.75 ≈ £106.66.",
      },
      {
        id: 2,
        question: "If a train travels 180 miles in 3 hours, its average speed is:",
        options: ["50 mph", "55 mph", "60 mph", "65 mph"],
        correctAnswer: 2,
        explanation: "180 ÷ 3 = 60 mph.",
      },
      {
        id: 3,
        question: "Sales rose from £40k to £50k. The percentage increase is:",
        options: ["10%", "20%", "25%", "30%"],
        correctAnswer: 2,
        explanation: "Increase 10/40 = 25%.",
      },
      {
        id: 4,
        question: "What's the next number: 2, 6, 12, 20, ?",
        options: ["28", "30", "32", "26"],
        correctAnswer: 1,
        explanation: "Differences: 4, 6, 8, 10 → next is 30.",
      },
      {
        id: 5,
        question: "If 5 workers build a wall in 12 days, how long for 10 workers?",
        options: ["3 days", "5 days", "6 days", "8 days"],
        correctAnswer: 2,
        explanation: "Double the workforce halves the time: 6 days.",
      },
    ],
  },

  // -------------------- PROFESSIONAL --------------------
  {
    slug: "cscs-card-starter",
    category: "professional",
    topic: "cscs",
    quizTitle: "CSCS Card — Starter Test",
    description: "Health, safety and environment basics for the CSCS Operative card.",
    timeLimit: 600,
    difficulty: "Easy",
    passMark: 80,
    questions: [
      {
        id: 1,
        question: "A hard hat must be worn:",
        options: [
          "Only on scaffolding",
          "Wherever there is a risk of head injury",
          "Only when the supervisor says so",
          "Only outside",
        ],
        correctAnswer: 1,
        explanation: "Hard hats are required wherever there's a risk of head injury.",
      },
      {
        id: 2,
        question: "What does a yellow safety sign mean?",
        options: ["Mandatory", "Prohibition", "Warning / hazard", "Safe condition"],
        correctAnswer: 2,
        explanation: "Yellow triangular signs warn of hazards.",
      },
      {
        id: 3,
        question: "What's the first thing to do if you spot a fire?",
        options: [
          "Try to put it out",
          "Raise the alarm",
          "Carry on working",
          "Open windows",
        ],
        correctAnswer: 1,
        explanation: "Always raise the alarm first so others can evacuate.",
      },
      {
        id: 4,
        question: "When lifting a heavy object you should:",
        options: [
          "Bend your back",
          "Keep your legs straight",
          "Bend your knees and keep your back straight",
          "Lift quickly",
        ],
        correctAnswer: 2,
        explanation: "Bend the knees and keep the back straight to avoid injury.",
      },
      {
        id: 5,
        question: "A COSHH assessment relates to:",
        options: ["Working at height", "Hazardous substances", "Manual handling", "Noise"],
        correctAnswer: 1,
        explanation: "COSHH = Control of Substances Hazardous to Health.",
      },
    ],
  },

  // -------------------- FUN --------------------
  {
    slug: "how-british-are-you",
    category: "fun",
    topic: "how-british",
    quizTitle: "How British Are You?",
    description: "A light-hearted quiz on tea, queues and the great British weather.",
    timeLimit: 240,
    difficulty: "Easy",
    passMark: 50,
    questions: [
      {
        id: 1,
        question: "Someone bumps into you. You say:",
        options: ["Watch it!", "Sorry", "Nothing", "Excuse me"],
        correctAnswer: 1,
        explanation: "The most British answer: apologise even when it wasn't your fault.",
      },
      {
        id: 2,
        question: "Tea should be made with:",
        options: ["Cold water", "Boiling water", "Lukewarm water", "Sparkling water"],
        correctAnswer: 1,
        explanation: "Always boiling water — it's basically the law.",
      },
      {
        id: 3,
        question: "What's the correct queue etiquette?",
        options: [
          "Push to the front",
          "Wait patiently in line",
          "Form a huddle",
          "Skip if no one is looking",
        ],
        correctAnswer: 1,
        explanation: "Queueing is a national sport.",
      },
      {
        id: 4,
        question: "'It's a bit nippy' means:",
        options: ["It's hot", "It's cold", "It's noisy", "It's busy"],
        correctAnswer: 1,
        explanation: "'Nippy' = chilly weather.",
      },
      {
        id: 5,
        question: "A 'cuppa' is:",
        options: ["A trophy", "A cup of tea", "A small cake", "A type of hat"],
        correctAnswer: 1,
        explanation: "A 'cuppa' = a cup of tea.",
      },
    ],
  },
  {
    slug: "general-knowledge-daily",
    category: "fun",
    topic: "daily",
    quizTitle: "General Knowledge — Daily Challenge",
    description: "A fresh 5-question quiz to test your general knowledge today.",
    timeLimit: 180,
    difficulty: "Medium",
    passMark: 60,
    questions: [
      {
        id: 1,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Mercury"],
        correctAnswer: 1,
        explanation: "Mars appears red due to iron oxide on its surface.",
      },
      {
        id: 2,
        question: "Who painted the Mona Lisa?",
        options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
        correctAnswer: 1,
        explanation: "Leonardo da Vinci painted it in the early 1500s.",
      },
      {
        id: 3,
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        explanation: "Gold = Au, from the Latin 'aurum'.",
      },
      {
        id: 4,
        question: "In which year did the Titanic sink?",
        options: ["1905", "1912", "1918", "1923"],
        correctAnswer: 1,
        explanation: "The Titanic sank on 15 April 1912.",
      },
      {
        id: 5,
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "Seven: Africa, Antarctica, Asia, Australia/Oceania, Europe, N. America, S. America.",
      },
    ],
  },

  // -------------------- SERU TfL --------------------
  {
    slug: "seru-tfl-mock-1",
    category: "professional",
    topic: "seru",
    quizTitle: "SERU TfL Assessment — Mock Test 1",
    description:
      "Practice for the Transport for London Safety, Equality and Regulatory Understanding (SERU) assessment for private hire drivers.",
    timeLimit: 900,
    difficulty: "Medium",
    passMark: 80,
    questions: [
      {
        id: 1,
        question: "What does the term 'safeguarding' mean for a private hire driver?",
        options: [
          "Protecting children and vulnerable adults from harm or abuse",
          "Locking the vehicle when parked",
          "Carrying a first aid kit",
          "Reporting traffic offences",
        ],
        correctAnswer: 0,
        explanation:
          "Safeguarding is about protecting children and vulnerable adults from abuse, neglect or exploitation.",
      },
      {
        id: 2,
        question: "A passenger with a guide dog wants to travel. You should:",
        options: [
          "Refuse — dogs aren't allowed in your car",
          "Charge an extra cleaning fee",
          "Carry them at no extra charge unless you have a medical exemption",
          "Ask them to put the dog in the boot",
        ],
        correctAnswer: 2,
          explanation:
          "Under the Equality Act 2010 you must carry assistance dogs at no extra cost unless you hold a valid medical exemption certificate from a licensing authority.",
      },
      {
        id: 3,
        question: "A passenger appears very drunk and is unsteady. The safest action is to:",
        options: [
          "Refuse the journey if you believe they pose a safety risk",
          "Drive faster to drop them off quickly",
          "Take them anywhere they ask without question",
          "Charge them double",
        ],
        correctAnswer: 0,
        explanation:
          "You may refuse a fare if a passenger is a clear risk to themselves, you, the vehicle or other road users.",
      },
      {
        id: 4,
        question: "You suspect a child passenger is being trafficked. You should:",
        options: [
          "Continue the journey and forget about it",
          "Confront the adult passenger",
          "Complete the journey if safe and report concerns to the police on 101 (or 999 if urgent)",
          "Drop them at the nearest petrol station",
        ],
        correctAnswer: 2,
        explanation:
          "Don't intervene directly. Note details and report safeguarding concerns to the police — 999 if there's immediate danger.",
      },
      {
        id: 5,
        question: "Which of these is a TfL licensing requirement for private hire drivers?",
        options: [
          "Display a 'Taxi' rooflight",
          "Only accept pre-booked journeys via a licensed operator",
          "Pick up passengers who hail you in the street",
          "Wear a uniform at all times",
        ],
        correctAnswer: 1,
        explanation:
          "Private hire vehicles must be pre-booked through a TfL-licensed operator — they cannot be hailed or ply for hire.",
      },
      {
        id: 6,
        question: "A passenger in a wheelchair asks for a ride. You should:",
        options: [
          "Refuse if your car isn't wheelchair-adapted",
          "Help them where reasonable and not charge extra for the disability",
          "Charge a higher fare for the additional time",
          "Ask them to fold the wheelchair themselves",
        ],
        correctAnswer: 1,
        explanation:
          "It's unlawful to charge a disabled passenger more or refuse them because of their disability.",
      },
      {
        id: 7,
        question: "What must you do if you're involved in a road traffic collision?",
        options: [
          "Drive away if no one is hurt",
          "Stop, exchange details and report to police within 24 hours if needed",
          "Only stop if the other driver flags you down",
          "Call your operator and continue working",
        ],
        correctAnswer: 1,
        explanation:
          "You must stop, give details, and report to the police within 24 hours if anyone is injured or if details weren't exchanged.",
      },
      {
        id: 8,
        question: "A passenger leaves property in your vehicle. You should:",
        options: [
          "Keep it",
          "Throw it away after the shift",
          "Hand it to your operator or to a police station as soon as possible",
          "Sell it online",
        ],
        correctAnswer: 2,
        explanation:
          "Lost property must be handed to your operator or the police promptly — keeping it is theft.",
      },
      {
        id: 9,
        question: "What is 'plying for hire'?",
        options: [
          "Refuelling the vehicle",
          "Looking for passengers without a pre-booking — illegal for private hire drivers",
          "Driving an empty vehicle to the depot",
          "Working overtime",
        ],
        correctAnswer: 1,
        explanation:
          "Soliciting passengers without a pre-booking is plying for hire — only licensed taxis (black cabs) may do this in London.",
      },
      {
        id: 10,
        question: "How often must a TfL private hire driver complete the SERU assessment?",
        options: [
          "Every journey",
          "Once, as part of the licensing process",
          "Every year",
          "Every 10 years",
        ],
        correctAnswer: 1,
        explanation:
          "SERU is taken once as part of obtaining your TfL private hire driver licence (with re-takes if you fail).",
      },
    ],
  },

  // -------------------- NHS / HEALTHCARE --------------------
  {
    slug: "nhs-numeracy-starter",
    category: "nhs",
    topic: "nhs-numeracy",
    quizTitle: "NHS Numeracy Test — Starter",
    description:
      "Drug calculations, dosages and basic arithmetic typical of NHS numeracy assessments for clinical staff.",
    timeLimit: 600,
    difficulty: "Medium",
    passMark: 80,
    questions: [
      {
        id: 1,
        question: "A patient needs 250 mg of a drug. Tablets come in 125 mg. How many tablets?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "250 ÷ 125 = 2 tablets.",
      },
      {
        id: 2,
        question:
          "Prescribed dose: 60 mg. Stock: 20 mg/5 ml suspension. How many ml do you give?",
        options: ["10 ml", "12 ml", "15 ml", "20 ml"],
        correctAnswer: 2,
        explanation: "60 ÷ 20 = 3, then 3 × 5 ml = 15 ml.",
      },
      {
        id: 3,
        question: "Convert 0.5 g to mg.",
        options: ["5 mg", "50 mg", "500 mg", "5000 mg"],
        correctAnswer: 2,
        explanation: "1 g = 1000 mg, so 0.5 g = 500 mg.",
      },
      {
        id: 4,
        question:
          "An IV infusion of 1000 ml runs over 8 hours. What's the rate in ml/hour?",
        options: ["100 ml/h", "115 ml/h", "125 ml/h", "150 ml/h"],
        correctAnswer: 2,
        explanation: "1000 ÷ 8 = 125 ml/h.",
      },
      {
        id: 5,
        question: "A patient weighs 70 kg. Dose is 5 mg/kg. Total dose?",
        options: ["250 mg", "300 mg", "350 mg", "400 mg"],
        correctAnswer: 2,
        explanation: "70 × 5 = 350 mg.",
      },
      {
        id: 6,
        question: "A 2-litre bag of saline runs at 250 ml/h. How long until empty?",
        options: ["6 h", "7 h", "8 h", "10 h"],
        correctAnswer: 2,
        explanation: "2000 ÷ 250 = 8 hours.",
      },
      {
        id: 7,
        question: "Convert 1.25 mg to micrograms.",
        options: ["125 µg", "1250 µg", "12.5 µg", "12 500 µg"],
        correctAnswer: 1,
        explanation: "1 mg = 1000 µg, so 1.25 mg = 1250 µg.",
      },
      {
        id: 8,
        question: "10% of 250 ml is:",
        options: ["10 ml", "20 ml", "25 ml", "50 ml"],
        correctAnswer: 2,
        explanation: "10% of 250 = 25 ml.",
      },
    ],
  },
  {
    slug: "nhs-values-starter",
    category: "nhs",
    topic: "nhs-values",
    quizTitle: "NHS Values-Based Recruitment — Starter",
    description:
      "Situational judgement questions based on the six NHS Constitution values: respect, compassion, quality, working together, improvement and dignity.",
    timeLimit: 600,
    difficulty: "Medium",
    passMark: 70,
    questions: [
      {
        id: 1,
        question:
          "A patient is upset because they've waited a long time. The best first response is:",
        options: [
          "Tell them everyone has to wait",
          "Acknowledge their frustration, apologise for the delay and explain what you can",
          "Ignore them and continue working",
          "Tell them to complain to the manager",
        ],
        correctAnswer: 1,
        explanation:
          "NHS values of respect and compassion expect you to acknowledge feelings, apologise sincerely and communicate openly.",
      },
      {
        id: 2,
        question:
          "You see a colleague not washing their hands between patients. You should:",
        options: [
          "Say nothing — it's not your business",
          "Politely remind them and report repeated incidents to a senior",
          "Post about it on social media",
          "Refuse to work with them",
        ],
        correctAnswer: 1,
        explanation:
          "Patient safety comes first. Raise concerns directly and respectfully, and escalate if needed.",
      },
      {
        id: 3,
        question: "A patient confides something personal. You should:",
        options: [
          "Share it with other patients to make them feel less alone",
          "Discuss it loudly at the nurses' station",
          "Keep it confidential and only share with the clinical team if relevant to care",
          "Post it anonymously online",
        ],
        correctAnswer: 2,
        explanation:
          "Confidentiality is a core NHS value, governed by the NHS Confidentiality Code of Practice and UK GDPR.",
      },
      {
        id: 4,
        question:
          "You don't know how to operate a new piece of equipment. The safest action is:",
        options: [
          "Try anyway — you'll figure it out",
          "Ask a trained colleague to help or supervise you before using it",
          "Skip the task",
          "Use it on the easiest patient first",
        ],
        correctAnswer: 1,
        explanation:
          "Working together and patient safety mean asking for help and proper training before using unfamiliar equipment.",
      },
      {
        id: 5,
        question:
          "A patient with limited English struggles to understand their treatment plan. You should:",
        options: [
          "Speak loudly and slowly",
          "Skip the explanation and hope they understand",
          "Arrange a professional interpreter and use accessible written materials",
          "Use the patient's child to translate",
        ],
        correctAnswer: 2,
        explanation:
          "Family members (especially children) shouldn't interpret clinical information. Use NHS-approved interpreters to ensure informed consent.",
      },
      {
        id: 6,
        question:
          "You make a small medication error that didn't harm the patient. You should:",
        options: [
          "Say nothing — no harm done",
          "Report it via the incident reporting system and inform the patient and team",
          "Tell only your closest friend at work",
          "Remove the entry from the chart",
        ],
        correctAnswer: 1,
        explanation:
          "The NHS duty of candour requires open reporting of all errors and near-misses so the system can learn and improve.",
      },
    ],
  },
];

import { getMockBySlug, mockToQuiz } from "@/data/mocks";
import { findTopic } from "@/data/categories";

export const getQuiz = (slug: string): Quiz | undefined => {
  // Mock-test slugs (e.g. "driving-theory-mock-7") MUST resolve to the
  // AI-generated 24-question JSON, not any legacy 10-question stub that
  // may share the same slug in this file.
  if (/-mock-\d+$/.test(slug)) {
    const mock = getMockBySlug(slug);
    if (mock) {
      const found = findTopic(mock.topic);
      if (found) return mockToQuiz(found.category.slug, mock);
    }
  }
  const direct = quizzes.find((q) => q.slug === slug);
  if (direct) return direct;
  const mock = getMockBySlug(slug);
  if (!mock) return undefined;
  const found = findTopic(mock.topic);
  return found ? mockToQuiz(found.category.slug, mock) : undefined;
};

export const getQuizzesByCategory = (cat: string) =>
  quizzes.filter((q) => q.category === cat);
export const getDailyQuiz = () =>
  quizzes.find((q) => q.slug === "general-knowledge-daily")!;
export const getFeaturedQuizzes = () =>
  [
    "driving-theory-mock-1",
    "life-in-the-uk-mock-1",
    "gcse-maths-warmup",
    "numerical-reasoning-starter",
  ]
    .map((s) => getQuiz(s))
    .filter((q): q is Quiz => Boolean(q));
