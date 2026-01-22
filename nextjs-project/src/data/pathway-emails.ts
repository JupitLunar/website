export interface PathwayEmail {
  week: number;
  stage: string;
  subject: string;
  preheader: string;
  intro: string;
  tasks: string[];
  redFlags: string[];
  checkIn: string;
  outro: string;
}

export const DEVELOPMENT_EMAILS_STARTER: PathwayEmail[] = [
  {
    week: 1,
    stage: '0-3-months',
    subject: 'Week 1: Calm bonding and tiny movements',
    preheader: 'Three small tasks and one red-flag reminder for week 1.',
    intro:
      'This week is about calm bonding and gentle sensory input. Short, consistent moments matter more than long sessions.',
    tasks: [
      'Skin-to-skin or quiet cuddle time once per day',
      'Short tummy time on your chest for 1-2 minutes',
      'Pause and watch for alert windows before stimulation',
    ],
    redFlags: [
      'Poor feeding or weak suck',
      'No startle response to loud sound',
      'Persistent lethargy or difficulty waking',
    ],
    checkIn: 'Did your baby have one calm, alert window today?',
    outro: 'If any red flags show up, call your pediatrician or urgent care line.',
  },
  {
    week: 2,
    stage: '0-3-months',
    subject: 'Week 2: Early tracking and head control',
    preheader: 'A simple plan for head lift and visual tracking.',
    intro:
      'This week you are building early head control and visual tracking. Keep sessions short and repeat often.',
    tasks: [
      'Use a high-contrast card 8-12 inches from the face',
      'Do tummy time 2-3 short sessions per day',
      'Talk slowly and pause to let baby process sounds',
    ],
    redFlags: [
      'No brief head lift during tummy time',
      'No reaction to voice or sound',
      'Very stiff or very floppy body tone',
    ],
    checkIn: 'Did your baby briefly lift or turn the head today?',
    outro: 'If you are unsure, bring these notes to your next visit.',
  },
  {
    week: 3,
    stage: '0-3-months',
    subject: 'Week 3: Social engagement and coos',
    preheader: 'Face-to-face play and early sounds.',
    intro:
      'Short face-to-face play helps early social engagement. Look for coos or soft sounds in response.',
    tasks: [
      'Face-to-face play for 1-2 minutes',
      'Encourage gentle reaching with a nearby toy',
      'Track one new sound or coo per day',
    ],
    redFlags: [
      'No eye contact or tracking',
      'No response to familiar voice',
      'Consistent back arching or extreme irritability',
    ],
    checkIn: 'Did your baby make eye contact or coo today?',
    outro: 'If concerns build, schedule a pediatric check-in.',
  },
  {
    week: 4,
    stage: '0-3-months',
    subject: 'Week 4: Tummy time endurance and smiles',
    preheader: 'Build a simple routine for tummy time.',
    intro:
      'Aim for a few short tummy time sessions and watch for early social smiles.',
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
    outro: 'Share any red flags with your pediatrician.',
  },
];

export const PARENT_HEALTH_EMAILS_STARTER: PathwayEmail[] = [
  {
    week: 1,
    stage: '0-6-weeks',
    subject: 'Week 1: Recovery basics and rest windows',
    preheader: 'Short recovery tasks and red-flag reminders.',
    intro:
      'This week is about rest, hydration, and noticing any changes that need medical attention.',
    tasks: [
      'Identify one 60-90 minute rest block per day',
      'Track bleeding level and note sudden changes',
      'Ask for one concrete support task',
    ],
    redFlags: [
      'Severe pain, fever, or heavy bleeding',
      'Shortness of breath or chest pain',
      'Thoughts of self-harm or harming baby',
    ],
    checkIn: 'Did you get a short rest block and drink water today?',
    outro: 'If red flags appear, contact your care team immediately.',
  },
  {
    week: 2,
    stage: '0-6-weeks',
    subject: 'Week 2: Gentle movement and mood check-ins',
    preheader: 'Build small movement and mood awareness.',
    intro:
      'Gentle movement and quick mood check-ins help you notice recovery changes early.',
    tasks: [
      'Take a short, slow walk if cleared',
      'Do a 60-second mood check-in each day',
      'Write down two questions for your next appointment',
    ],
    redFlags: [
      'Worsening sadness or anxiety most of the day',
      'Infection symptoms at incision or perineum',
      'Ongoing dizziness or fainting',
    ],
    checkIn: 'Did you name one emotion you felt today?',
    outro: 'Share these notes with your provider if needed.',
  },
  {
    week: 3,
    stage: '0-6-weeks',
    subject: 'Week 3: Protect sleep and core recovery',
    preheader: 'One sleep window and simple recovery notes.',
    intro:
      'Sleep protection and core awareness help recovery stay on track.',
    tasks: [
      'Protect one sleep window by delegating a task',
      'Check for abdominal separation gently',
      'Note any pelvic floor discomfort',
    ],
    redFlags: [
      'Persistent heavy bleeding or large clots',
      'Severe abdominal pain',
      'Uncontrolled anxiety or panic',
    ],
    checkIn: 'Did you get at least one protected sleep block?',
    outro: 'Bring concerns to your postpartum visit.',
  },
  {
    week: 4,
    stage: '0-6-weeks',
    subject: 'Week 4: Prepare for follow-up care',
    preheader: 'Questions to bring to your postpartum visit.',
    intro:
      'Use this week to prepare for follow-up care and track how you are feeling.',
    tasks: [
      'List recovery questions for the postpartum visit',
      'Track pain, bleeding, and mood for 3 days',
      'Plan one support touchpoint for next week',
    ],
    redFlags: [
      'No improvement in mood or energy',
      'Pain that is not improving',
      'Concerns about bonding or overwhelming stress',
    ],
    checkIn: 'Are you ready with questions for your follow-up visit?',
    outro: 'If symptoms worsen, contact your care team sooner.',
  },
];
