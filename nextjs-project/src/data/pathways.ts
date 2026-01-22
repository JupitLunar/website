export interface PathwayWeek {
  week: number;
  range: string;
  stage: string;
  focus: string;
  tasks: string[];
  redFlags: string[];
  checkIn: string;
}

export interface PathwayStage {
  id: string;
  label: string;
  range: string;
  description: string;
}

export const DEVELOPMENT_STAGES: PathwayStage[] = [
  {
    id: '0-3-months',
    label: '0-3 months',
    range: 'Weeks 1-12',
    description: 'Bonding, head control, social engagement, and early motor cues.',
  },
  {
    id: '4-6-months',
    label: '4-6 months',
    range: 'Weeks 13-24',
    description: 'Rolling, reaching, vocal play, and supported sitting.',
  },
  {
    id: '7-9-months',
    label: '7-9 months',
    range: 'Weeks 25-36',
    description: 'Sitting stability, crawling prep, and object permanence.',
  },
  {
    id: '10-12-months',
    label: '10-12 months',
    range: 'Weeks 37-52',
    description: 'Pull-to-stand, pincer grasp, and first words.',
  },
];

export const DEVELOPMENT_WEEKS: PathwayWeek[] = [
  {
    week: 1,
    range: '0-2 weeks',
    stage: '0-3-months',
    focus: 'Bonding, feeding rhythms, and calm sensory exposure',
    tasks: [
      'Practice skin-to-skin or quiet cuddle time daily',
      'Offer short tummy time on your chest for 1-2 minutes',
      'Watch for alert windows and pause before overstimulation',
    ],
    redFlags: [
      'Poor feeding or weak suck',
      'No startle response to loud sounds',
      'Persistent lethargy or difficulty waking',
    ],
    checkIn: 'Did your baby have at least one calm, alert window today?',
  },
  {
    week: 2,
    range: '2-4 weeks',
    stage: '0-3-months',
    focus: 'Early head control and tracking',
    tasks: [
      'Place a high-contrast card 8-12 inches from the face',
      'Do tummy time 2-3 short sessions per day',
      'Talk slowly and pause so baby can process sounds',
    ],
    redFlags: [
      'No brief head lift during tummy time',
      'No reaction to voice or loud sound',
      'Very stiff or very floppy body tone',
    ],
    checkIn: 'Did your baby briefly lift or turn the head today?',
  },
  {
    week: 3,
    range: '1-2 months',
    stage: '0-3-months',
    focus: 'Social engagement and early motor movement',
    tasks: [
      'Use face-to-face play for 1-2 minutes',
      'Encourage gentle reach by placing a toy near the hands',
      'Track one new sound or coo per day',
    ],
    redFlags: [
      'No eye contact or tracking',
      'No response to familiar voice',
      'Consistent back arching or extreme irritability',
    ],
    checkIn: 'Did your baby make eye contact or coo today?',
  },
  {
    week: 4,
    range: '2-3 months',
    stage: '0-3-months',
    focus: 'Tummy time endurance and social smiles',
    tasks: [
      'Aim for 3-5 tummy time sessions, even if short',
      'Try mirror play to encourage smiles',
      'Track head control in supported sitting',
    ],
    redFlags: [
      'No social smile by 2-3 months',
      'No head control improvement',
      'Feeding or growth concerns',
    ],
    checkIn: 'Did your baby offer at least one social smile this week?',
  },
  {
    week: 5,
    range: '4-5 months',
    stage: '4-6-months',
    focus: 'Rolling practice and hand-to-mouth exploration',
    tasks: [
      'Encourage rolling with toy prompts on both sides',
      'Offer safe objects to grasp and mouth',
      'Track head control in supported sitting',
    ],
    redFlags: [
      'No attempt to roll in either direction',
      'Very limited hand opening or grasping',
      'No response to caregiver voice',
    ],
    checkIn: 'Did your baby attempt rolling or purposeful reaching this week?',
  },
  {
    week: 6,
    range: '5-6 months',
    stage: '4-6-months',
    focus: 'Sitting support and vocal back-and-forth',
    tasks: [
      'Practice supported sitting for short intervals',
      'Play turn-taking sounds (you speak, baby responds)',
      'Encourage reaching across midline',
    ],
    redFlags: [
      'Cannot hold head steady when supported',
      'No vocal engagement or cooing',
      'Consistently stiff or floppy tone',
    ],
    checkIn: 'Did your baby sit with support and respond to sounds?',
  },
  {
    week: 7,
    range: '7-8 months',
    stage: '7-9-months',
    focus: 'Sitting stability and movement exploration',
    tasks: [
      'Place toys just out of reach to encourage movement',
      'Practice sitting with hands free for play',
      'Play peekaboo to build object permanence',
    ],
    redFlags: [
      'Cannot sit without support for a few seconds',
      'Limited movement or exploration',
      'No babbling or sound variety',
    ],
    checkIn: 'Did your baby sit independently and explore toys?',
  },
  {
    week: 8,
    range: '10-12 months',
    stage: '10-12-months',
    focus: 'Standing support and early language',
    tasks: [
      'Offer furniture support for pulling to stand',
      'Name familiar objects and pause for response',
      'Encourage pincer grasp with finger foods',
    ],
    redFlags: [
      'No attempt to bear weight on legs',
      'No consonant sounds or babbling',
      'No response to name',
    ],
    checkIn: 'Did your baby practice standing and respond to simple words?',
  },
];

export const PARENT_HEALTH_STAGES: PathwayStage[] = [
  {
    id: '0-6-weeks',
    label: '0-6 weeks',
    range: 'Early postpartum',
    description: 'Rest, wound healing, and mental health check-ins.',
  },
  {
    id: '6-12-weeks',
    label: '6-12 weeks',
    range: 'Recovery phase',
    description: 'Follow-up care, mobility, and rebuilding strength.',
  },
  {
    id: '3-6-months',
    label: '3-6 months',
    range: 'Sustain phase',
    description: 'Energy management, stress support, and routines.',
  },
  {
    id: '6-12-months',
    label: '6-12 months',
    range: 'Long-term support',
    description: 'Return-to-work transitions and ongoing recovery signals.',
  },
];

export const PARENT_HEALTH_WEEKS: PathwayWeek[] = [
  {
    week: 1,
    range: '0-1 week postpartum',
    stage: '0-6-weeks',
    focus: 'Rest, hydration, and recovery basics',
    tasks: [
      'Identify one 60-90 minute rest block per day',
      'Track bleeding level and note any sudden changes',
      'Ask for one concrete support task (meals, laundry, or baby care)',
    ],
    redFlags: [
      'Severe pain, fever, or heavy bleeding',
      'Shortness of breath or chest pain',
      'Thoughts of self-harm or harming baby',
    ],
    checkIn: 'Did you get a short rest block and drink water today?',
  },
  {
    week: 2,
    range: '1-2 weeks postpartum',
    stage: '0-6-weeks',
    focus: 'Gentle movement and emotional check-ins',
    tasks: [
      'Take a short, slow walk if cleared by your care team',
      'Do a 60-second mood check-in each day',
      'Write down two questions for your next appointment',
    ],
    redFlags: [
      'Worsening sadness or anxiety most of the day',
      'Infection symptoms at incision or perineum',
      'Ongoing dizziness or fainting',
    ],
    checkIn: 'Did you notice one emotion and name it today?',
  },
  {
    week: 3,
    range: '2-4 weeks postpartum',
    stage: '0-6-weeks',
    focus: 'Sleep protection and core recovery awareness',
    tasks: [
      'Protect one sleep window by delegating a task',
      'Check for abdominal separation (diastasis recti) gently',
      'Note any pelvic floor discomfort or incontinence',
    ],
    redFlags: [
      'Persistent heavy bleeding or large clots',
      'Severe abdominal pain',
      'Uncontrolled anxiety or panic',
    ],
    checkIn: 'Did you get at least one protected sleep block?',
  },
  {
    week: 4,
    range: '4-6 weeks postpartum',
    stage: '0-6-weeks',
    focus: 'Prepare for follow-up visit and longer-term support',
    tasks: [
      'List recovery questions for the postpartum visit',
      'Track pain, bleeding, and mood for 3 days',
      'Plan one support touchpoint for the next week',
    ],
    redFlags: [
      'No improvement in mood or energy',
      'Pain that is not improving',
      'Concerns about bonding or overwhelming stress',
    ],
    checkIn: 'Are you ready with questions for your follow-up visit?',
  },
  {
    week: 5,
    range: '6-8 weeks postpartum',
    stage: '6-12-weeks',
    focus: 'Rebuild energy and check recovery progress',
    tasks: [
      'Schedule or attend the postpartum follow-up visit',
      'Track any lingering pain or bleeding',
      'Plan one gentle movement session this week',
    ],
    redFlags: [
      'Pain that is worsening instead of improving',
      'No energy improvement or severe fatigue',
      'Ongoing infection symptoms',
    ],
    checkIn: 'Did you review recovery questions with your care team?',
  },
  {
    week: 6,
    range: '9-12 weeks postpartum',
    stage: '6-12-weeks',
    focus: 'Return-to-activity and pelvic floor awareness',
    tasks: [
      'Add one low-impact activity if cleared',
      'Note any pelvic floor heaviness or discomfort',
      'Identify one stress trigger and plan a response',
    ],
    redFlags: [
      'New or worsening pelvic pain',
      'Persistent depression or panic',
      'Unresolved bleeding concerns',
    ],
    checkIn: 'Did you identify one manageable recovery goal?',
  },
  {
    week: 7,
    range: '3-4 months postpartum',
    stage: '3-6-months',
    focus: 'Sustain mental health and daily routines',
    tasks: [
      'Check sleep patterns and adjust support',
      'Plan one 15-minute personal reset',
      'Review childcare or partner load-sharing plan',
    ],
    redFlags: [
      'Persistent mood symptoms without relief',
      'Feeling unsafe or overwhelmed most days',
      'Loss of appetite or major sleep disruption',
    ],
    checkIn: 'Did you get one small reset window this week?',
  },
  {
    week: 8,
    range: '5-6 months postpartum',
    stage: '3-6-months',
    focus: 'Strength building and social support',
    tasks: [
      'Schedule one check-in with a trusted support person',
      'Add one gentle strength or core activity',
      'Track hydration and nutrition for two days',
    ],
    redFlags: [
      'Persistent pain with daily activities',
      'Isolation that feels unmanageable',
      'Anxiety that interferes with care',
    ],
    checkIn: 'Did you connect with a support person this week?',
  },
  {
    week: 9,
    range: '6-9 months postpartum',
    stage: '6-12-months',
    focus: 'Work or childcare transitions',
    tasks: [
      'Write down new schedule stress points',
      'Set one boundary or support request',
      'Plan one health check-in with your provider if needed',
    ],
    redFlags: [
      'Burnout that impacts daily functioning',
      'No time for recovery or rest',
      'Escalating anxiety or panic symptoms',
    ],
    checkIn: 'Did you set one boundary to protect your energy?',
  },
  {
    week: 10,
    range: '9-12 months postpartum',
    stage: '6-12-months',
    focus: 'Long-term recovery signals and sustainment',
    tasks: [
      'Review physical symptoms that still linger',
      'Plan one preventive health appointment',
      'Identify one support system you can lean on',
    ],
    redFlags: [
      'Ongoing pain or bleeding without improvement',
      'Persistent depressive symptoms',
      'Severe stress without support',
    ],
    checkIn: 'Did you plan your next health check-in?',
  },
];
