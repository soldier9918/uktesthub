/**
 * Per-mock intro content shown on individual mock test start pages.
 * Keyed by topic slug then mock number. Used to give each mock page
 * unique body content for SEO and learner guidance.
 */

export type Difficulty = "Beginner" | "Intermediate" | "Exam-ready";

export type PerMockIntro = {
  difficulty: Difficulty;
  covers: string;
  commonMistakes: string[];
};

export type RelatedGuide = { label: string; href: string; intro: string };

export const RELATED_GUIDE_BY_TOPIC: Record<string, RelatedGuide> = {
  "driving-theory": {
    label: "Driving Theory Test Guide",
    href: "/blog/driving-theory-test-questions",
    intro:
      "Read the Driving Theory Test Guide to revise key rules, road signs, hazards and safe driving topics before trying the next mock.",
  },
};

const drivingTheory: Record<number, PerMockIntro> = {
  1: {
    difficulty: "Beginner",
    covers:
      "Driving Theory Mock Test 1 is a good starting point for learners beginning their UK driving theory revision. It covers foundation topics such as road signs, safe driving behaviour, speed awareness, road markings and basic hazard recognition. Use this test to check your general understanding before moving on to more challenging mocks.",
    commonMistakes: [
      "Rushing through simple road sign questions",
      "Missing words such as “must”, “should” or “never”",
      "Confusing warning signs with mandatory signs",
      "Guessing before reading all answer options",
    ],
  },
  2: {
    difficulty: "Beginner",
    covers:
      "Driving Theory Mock Test 2 focuses on everyday driving knowledge, including road positioning, safe following distances, junction awareness and basic rules of the road. It is designed to help learners practise common theory-style questions and improve confidence with the types of decisions drivers need to make on UK roads.",
    commonMistakes: [
      "Choosing an answer too quickly at junction questions",
      "Forgetting to consider vulnerable road users",
      "Confusing stopping distance with thinking distance",
      "Not reviewing incorrect answers after finishing",
    ],
  },
  3: {
    difficulty: "Beginner",
    covers:
      "Driving Theory Mock Test 3 helps you practise key driving safety topics such as speed limits, traffic signs, pedestrian crossings and safe observation. This mock is useful for checking whether you understand basic road rules and can apply them to common driving situations.",
    commonMistakes: [
      "Mixing up speed limits on different road types",
      "Not spotting clues in pedestrian crossing questions",
      "Confusing circular and triangular signs",
      "Ignoring road condition details in the question",
    ],
  },
  4: {
    difficulty: "Beginner",
    covers:
      "Driving Theory Mock Test 4 gives you more practice with essential learner driver topics, including road signs, lane discipline, parking awareness and safe vehicle control. It is suitable for early revision and helps you build a stronger base before attempting more scenario-based questions.",
    commonMistakes: [
      "Misreading lane discipline questions",
      "Forgetting basic parking safety checks",
      "Not linking road signs to their meaning",
      "Overlooking details about weather or traffic conditions",
    ],
  },
  5: {
    difficulty: "Beginner",
    covers:
      "Driving Theory Mock Test 5 focuses on core driving knowledge such as observation, mirrors, signalling, road markings and safe behaviour around other vehicles. This mock helps learners practise the basics of safe decision-making and build confidence with multiple-choice theory questions.",
    commonMistakes: [
      "Forgetting mirror checks before changing direction",
      "Confusing road markings with road signs",
      "Selecting answers that sound safe but are incomplete",
      "Not checking whether the question asks for the safest option",
    ],
  },
  6: {
    difficulty: "Beginner",
    covers:
      "Driving Theory Mock Test 6 covers important early-stage topics, including traffic lights, road signs, safe overtaking, vehicle awareness and dealing with pedestrians. It is designed to support regular revision and help you spot gaps in your knowledge before moving to harder mocks.",
    commonMistakes: [
      "Misunderstanding traffic light rules",
      "Overtaking when it would not be safe",
      "Not considering cyclists and pedestrians",
      "Guessing road sign meanings from colour alone",
    ],
  },
  7: {
    difficulty: "Beginner",
    covers:
      "Driving Theory Mock Test 7 gives learners practice with common questions on speed, road signs, junctions, roundabouts and hazard awareness. It helps you build confidence with everyday driving situations and encourages careful reading of each answer option.",
    commonMistakes: [
      "Treating roundabout questions too casually",
      "Forgetting who may have priority",
      "Confusing advisory signs with rules",
      "Missing key words in longer questions",
    ],
  },
  8: {
    difficulty: "Beginner",
    covers:
      "Driving Theory Mock Test 8 focuses on safe driving habits, road positioning, signs, vehicle control and basic hazard awareness. It is useful for learners who want to strengthen their understanding of routine driving rules before attempting more challenging practice tests.",
    commonMistakes: [
      "Not checking road position clues",
      "Confusing “give way” and “stop” requirements",
      "Forgetting how weather affects driving",
      "Picking the first reasonable answer instead of the best one",
    ],
  },
  9: {
    difficulty: "Beginner",
    covers:
      "Driving Theory Mock Test 9 helps you revise essential theory topics such as speed limits, warning signs, road markings, safety checks and responsible driving. Use this mock to practise accuracy and build a stronger foundation for exam-style driving theory questions.",
    commonMistakes: [
      "Mixing up warning and information signs",
      "Not reading the full scenario",
      "Forgetting basic vehicle safety checks",
      "Confusing legal requirements with good advice",
    ],
  },
  10: {
    difficulty: "Beginner",
    covers:
      "Driving Theory Mock Test 10 brings together foundation topics from earlier mocks, including signs, signals, road markings, safe speed and basic hazard awareness. It is a useful checkpoint before progressing to intermediate driving theory practice.",
    commonMistakes: [
      "Repeating the same mistakes from earlier mocks",
      "Confusing similar road sign shapes",
      "Not reviewing explanations after the test",
      "Underestimating simple-looking questions",
    ],
  },
  11: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 11 introduces a stronger mix of scenario-style questions covering hazards, junctions, speed control, vulnerable road users and safe decision-making. It is designed for learners who already understand the basics and want to practise applying their knowledge.",
    commonMistakes: [
      "Not adjusting answers for weather or traffic conditions",
      "Forgetting cyclists and motorcyclists in hazard questions",
      "Choosing a legal option that is not the safest option",
      "Missing small details in scenario wording",
    ],
  },
  12: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 12 focuses on practical driving judgement, including road positioning, overtaking, motorway awareness, pedestrian safety and traffic signs. This mock helps you practise making safe choices in realistic driving situations.",
    commonMistakes: [
      "Overtaking without enough safety margin",
      "Misunderstanding lane use on faster roads",
      "Forgetting pedestrian priority in some situations",
      "Not linking signs to road layout",
    ],
  },
  13: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 13 covers a balanced mix of road safety, signs, crossings, vehicle handling and hazard awareness. It is useful for learners who want to improve consistency and reduce careless mistakes across different theory topics.",
    commonMistakes: [
      "Confusing different types of pedestrian crossing",
      "Ignoring road surface or weather clues",
      "Not checking whether the question asks what to do first",
      "Choosing answers based on habit instead of rules",
    ],
  },
  14: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 14 helps you practise questions on speed, stopping distances, safe following gaps, road signs and driver responsibility. It is designed to improve your ability to apply safety rules rather than simply memorise answers.",
    commonMistakes: [
      "Confusing thinking distance and braking distance",
      "Forgetting that poor weather increases stopping distance",
      "Choosing answers that are too aggressive",
      "Not spotting “except” or “most likely” wording",
    ],
  },
  15: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 15 focuses on safe road use, including junction decisions, traffic signs, roundabouts, vulnerable road users and responsible behaviour. This mock is useful for learners preparing to move from basic recall to more applied driving theory practice.",
    commonMistakes: [
      "Misjudging priority at junctions",
      "Forgetting to check mirrors and blind spots",
      "Confusing road signs with similar colours",
      "Not considering what other road users may do",
    ],
  },
  16: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 16 includes questions on hazard perception knowledge, road signs, lane discipline, speed awareness and safe reactions. It helps learners practise careful decision-making and identify areas where more revision may be needed.",
    commonMistakes: [
      "Reacting too late in hazard-style questions",
      "Not recognising developing hazards",
      "Misunderstanding lane arrows and markings",
      "Ignoring the safest response in favour of the quickest",
    ],
  },
  17: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 17 covers mixed driving theory topics such as road signs, vehicle safety, speed limits, crossings and road user awareness. It is designed to help learners practise a wider range of questions in one sitting.",
    commonMistakes: [
      "Confusing vehicle safety checks",
      "Forgetting rules around crossings",
      "Not reading the context before choosing",
      "Treating all road sign questions as simple memory questions",
    ],
  },
  18: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 18 focuses on road safety decisions, including when to slow down, when to give way, how to respond to hazards and how to drive safely around pedestrians, cyclists and motorcyclists.",
    commonMistakes: [
      "Not slowing down early enough in scenarios",
      "Forgetting vulnerable road users need extra space",
      "Choosing answers that increase risk",
      "Missing clues about limited visibility",
    ],
  },
  19: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 19 helps you revise key areas such as road markings, motorway rules, signs, speed control and hazard awareness. It is useful for learners who want more practice with mixed-topic theory questions.",
    commonMistakes: [
      "Misreading road markings",
      "Confusing motorway lane rules",
      "Not adjusting speed for conditions",
      "Overlooking warning signs in the question",
    ],
  },
  20: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 20 is a mid-point revision test covering road signs, safety margins, driver attitude, legal responsibilities and practical driving decisions. Use this mock to check how well you are retaining earlier topics.",
    commonMistakes: [
      "Forgetting legal responsibilities",
      "Not keeping a safe separation distance",
      "Choosing impatient or risky actions",
      "Failing to review repeated weak areas",
    ],
  },
  21: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 21 gives practice with more applied questions on hazards, road positioning, crossings, signs and safe driving behaviour. It is designed to help learners improve judgement in situations where more than one answer may seem possible.",
    commonMistakes: [
      "Choosing a possible answer instead of the safest answer",
      "Missing clues about road users nearby",
      "Confusing road sign instructions",
      "Not thinking ahead in hazard questions",
    ],
  },
  22: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 22 focuses on safe choices in everyday road situations, including junctions, traffic signs, speed, observation and responsible driving. It helps learners practise both knowledge and judgement.",
    commonMistakes: [
      "Misreading junction layouts",
      "Forgetting observation checks",
      "Confusing speed guidance with speed limits",
      "Not considering road conditions",
    ],
  },
  23: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 23 covers a useful mix of road signs, hazard awareness, vehicle safety, driver behaviour and traffic rules. This mock helps build confidence by testing a wider range of theory knowledge.",
    commonMistakes: [
      "Forgetting vehicle maintenance basics",
      "Missing the safest action in hazard questions",
      "Confusing similar signs or markings",
      "Not reading all answer options fully",
    ],
  },
  24: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 24 helps learners practise questions on road safety, crossings, signs, stopping distances and driving responsibly around other road users. It is suitable for building accuracy before moving into more exam-ready mocks.",
    commonMistakes: [
      "Confusing crossing types",
      "Underestimating stopping distances",
      "Not leaving enough space for cyclists",
      "Selecting answers based on memory rather than context",
    ],
  },
  25: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 25 focuses on mixed driving theory knowledge, including road signs, legal rules, speed control, hazards and safer driving attitudes. This mock is useful for checking whether you can apply your revision across different question types.",
    commonMistakes: [
      "Forgetting legal rule wording",
      "Rushing mixed-topic questions",
      "Not identifying the main risk in a scenario",
      "Confusing advice with legal requirements",
    ],
  },
  26: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 26 covers practical road awareness, including lane use, speed, road signs, junctions and safe responses to other road users. It helps learners practise calm, safe decision-making under quiz conditions.",
    commonMistakes: [
      "Choosing unsafe lane changes",
      "Not checking mirrors in the correct situations",
      "Missing road layout clues",
      "Ignoring pedestrians or cyclists in the scenario",
    ],
  },
  27: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 27 includes questions on safe driving behaviour, signs, road markings, vehicle control and hazard awareness. It is designed to help learners improve consistency and reduce errors caused by rushing.",
    commonMistakes: [
      "Misreading road markings",
      "Not slowing down for developing hazards",
      "Choosing answers that are too vague",
      "Forgetting to use explanations for revision",
    ],
  },
  28: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 28 focuses on decision-making in common driving situations, including junctions, roundabouts, speed, signs and vulnerable road users. It helps learners practise recognising the safest response.",
    commonMistakes: [
      "Misjudging priority",
      "Forgetting to allow extra space",
      "Confusing similar road sign meanings",
      "Picking an answer before understanding the scenario",
    ],
  },
  29: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 29 covers signs, hazard awareness, vehicle safety, speed and responsible driver behaviour. Use this test to strengthen your recall and improve your ability to apply theory knowledge to road situations.",
    commonMistakes: [
      "Confusing warning signs and information signs",
      "Forgetting vehicle safety checks",
      "Not adapting speed to conditions",
      "Missing key details in longer questions",
    ],
  },
  30: {
    difficulty: "Intermediate",
    covers:
      "Driving Theory Mock Test 30 is a strong revision checkpoint covering road signs, hazards, safety rules, driving attitude and common road situations. It is useful before attempting the more exam-ready practice tests.",
    commonMistakes: [
      "Repeating earlier weak areas",
      "Not checking explanations carefully",
      "Confusing road safety guidance",
      "Losing marks through careless reading",
    ],
  },
  31: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 31 is aimed at learners who are moving towards exam-ready practice. It includes a broader mix of signs, hazards, road rules, speed awareness and scenario-based questions that require careful judgement.",
    commonMistakes: [
      "Rushing under time pressure",
      "Missing small wording differences",
      "Not choosing the safest option",
      "Forgetting to review weaker topics after finishing",
    ],
  },
  32: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 32 focuses on applying theory knowledge across mixed road situations, including hazards, junctions, road signs, vehicle safety and safe driving behaviour. It is designed to test readiness across several common topics.",
    commonMistakes: [
      "Treating scenario questions like memory questions",
      "Not spotting the main hazard",
      "Confusing similar answer options",
      "Choosing a risky action because it seems faster",
    ],
  },
  33: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 33 gives learners more challenging practice with road signs, speed control, crossings, hazards and road user awareness. It helps you check whether your theory knowledge is accurate under mixed-question conditions.",
    commonMistakes: [
      "Confusing speed rules in different settings",
      "Not reading crossing questions carefully",
      "Missing road user clues",
      "Overlooking weather or visibility details",
    ],
  },
  34: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 34 covers a challenging mix of driving theory topics, including legal responsibilities, hazard awareness, signs, markings and safe reactions. It is useful for learners who want to practise more careful, exam-style decision-making.",
    commonMistakes: [
      "Confusing legal rules with general advice",
      "Choosing the quickest response rather than the safest",
      "Missing road marking details",
      "Not reviewing questions answered incorrectly",
    ],
  },
  35: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 35 focuses on road safety, signs, junction decisions, speed awareness and responsible driving behaviour. It helps learners practise applying knowledge to varied situations instead of relying only on memorised answers.",
    commonMistakes: [
      "Misjudging junction priority",
      "Confusing road sign instructions",
      "Not allowing enough safety margin",
      "Missing wording such as “first” or “most important”",
    ],
  },
  36: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 36 gives exam-ready practice across topics such as hazard recognition, road positioning, vulnerable road users, road signs and safe vehicle use. This mock is useful for identifying final revision gaps.",
    commonMistakes: [
      "Not recognising developing hazards",
      "Forgetting extra care around cyclists and pedestrians",
      "Confusing signs that look similar",
      "Ignoring explanations after the test",
    ],
  },
  37: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 37 focuses on mixed-topic revision with questions covering signs, speed, safety distances, road markings, hazards and driver responsibility. It is designed to help learners practise accuracy and consistency.",
    commonMistakes: [
      "Miscalculating safety distances",
      "Not adjusting for road conditions",
      "Confusing road markings with signs",
      "Selecting the answer that sounds familiar rather than correct",
    ],
  },
  38: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 38 helps you practise more advanced decision-making across road signs, junctions, hazards, motorway awareness and safe driving behaviour. It is useful for building confidence before timed exam mode.",
    commonMistakes: [
      "Misunderstanding motorway lane use",
      "Not spotting the safest response at junctions",
      "Forgetting mirror and blind spot checks",
      "Rushing longer scenario questions",
    ],
  },
  39: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 39 includes challenging practice on hazards, signs, road rules, vehicle control and safety awareness. It is designed to help learners test their readiness across a wider range of theory topics.",
    commonMistakes: [
      "Not identifying the highest-risk hazard",
      "Confusing similar traffic signs",
      "Forgetting safe control in poor conditions",
      "Not reading the full question before answering",
    ],
  },
  40: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 40 is a strong exam-ready revision test covering signs, stopping distances, road markings, vulnerable road users and practical safety decisions. Use this mock to check your progress before attempting final practice tests.",
    commonMistakes: [
      "Underestimating stopping distance questions",
      "Forgetting the needs of vulnerable road users",
      "Misreading markings or lane arrows",
      "Not learning from repeated incorrect answers",
    ],
  },
  41: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 41 focuses on final-stage revision, with questions covering road signs, hazards, driver attitude, legal rules and safe decision-making. It helps learners practise staying accurate across different theory areas.",
    commonMistakes: [
      "Losing marks through rushed reading",
      "Confusing legal wording",
      "Choosing answers that are not defensive enough",
      "Forgetting to review weak topics after finishing",
    ],
  },
  42: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 42 gives advanced practice with mixed questions on road signs, safety, speed, junctions and hazard awareness. It is suitable for learners who want to test their confidence before using full exam mode.",
    commonMistakes: [
      "Misreading complex scenarios",
      "Not considering all road users",
      "Choosing answers based on habit",
      "Missing clues about road conditions",
    ],
  },
  43: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 43 focuses on high-confidence revision across road signs, safe driving behaviour, hazards, vehicle awareness and road rules. It helps learners sharpen their accuracy and reduce avoidable mistakes.",
    commonMistakes: [
      "Confusing similar road signs",
      "Not identifying the safest action",
      "Forgetting vehicle safety responsibilities",
      "Rushing because the topic looks familiar",
    ],
  },
  44: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 44 is designed for final-stage practice and includes a varied mix of signs, hazards, traffic rules, speed awareness and safe driving decisions. Use it to check whether your revision is consistent across different topics.",
    commonMistakes: [
      "Overlooking small wording changes",
      "Not adapting answers to the scenario",
      "Confusing road markings and sign instructions",
      "Failing to revisit incorrect answers",
    ],
  },
  45: {
    difficulty: "Exam-ready",
    covers:
      "Driving Theory Mock Test 45 is a final revision mock for learners preparing for timed exam-style practice. It covers a broad mix of road signs, safety rules, hazards, road markings, speed awareness and responsible driving behaviour.",
    commonMistakes: [
      "Rushing because it is the final mock",
      "Forgetting to check all answer options",
      "Missing key safety details in scenarios",
      "Not using the results to plan final revision",
    ],
  },
};

export const PER_MOCK_INTROS: Record<string, Record<number, PerMockIntro>> = {
  "driving-theory": drivingTheory,
};

export function getPerMockIntro(
  topicSlug: string,
  mockNumber: number,
): PerMockIntro | undefined {
  return PER_MOCK_INTROS[topicSlug]?.[mockNumber];
}

export function getRelatedGuide(topicSlug: string): RelatedGuide | undefined {
  return RELATED_GUIDE_BY_TOPIC[topicSlug];
}
