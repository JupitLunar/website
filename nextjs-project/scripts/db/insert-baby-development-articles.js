#!/usr/bin/env node

/**
 * 插入Baby Development教育内容到knowledge_chunks表
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 加载环境变量
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少必要的环境变量');
  console.error('请确保设置了 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Baby Development教育文章数据
 */
const developmentArticles = [
  {
    slug: 'baby-milestones-0-6-months-cdc-aap-guidance-2025',
    title: 'What are the key developmental milestones for babies 0-6 months?',
    content: `## Key milestones overview

The first 6 months are a period of rapid growth and development. Babies develop at their own pace, but there are general milestones that most babies reach within certain timeframes. These milestones are important indicators of healthy development and help parents know what to expect.

## 0-2 months: Early reflexes and awareness

**Physical milestones:**
- Lifts head briefly when on tummy
- Moves arms and legs more smoothly
- Begins to follow objects with eyes
- Shows startle reflex (Moro reflex)

**Social and emotional:**
- Begins to smile at people (social smile around 6-8 weeks)
- Cries to communicate needs
- Begins to show interest in faces
- May calm down when picked up or spoken to

**Cognitive:**
- Follows moving objects with eyes
- Shows preference for human faces
- Begins to recognize familiar voices
- Responds to sounds by quieting or turning head

## 2-4 months: Growing awareness and control

**Physical milestones:**
- Holds head steady when supported in sitting position
- Pushes up on forearms when on tummy
- Brings hands to mouth
- Begins to roll from tummy to back

**Social and emotional:**
- Smiles spontaneously at people
- Enjoys playing and may cry when playing stops
- Begins to copy some movements and facial expressions
- Shows excitement when sees a bottle or breast

**Cognitive:**
- Follows moving objects with eyes from side to side
- Recognizes familiar people at a distance
- Begins to use hands and eyes together
- Shows interest in toys and may try to reach for them

## 4-6 months: Increased mobility and interaction

**Physical milestones:**
- Sits without support for brief periods
- Rolls over in both directions
- Reaches for objects with one hand
- Begins to pass objects from one hand to the other

**Social and emotional:**
- Responds to own name
- Shows happiness and sadness
- Enjoys looking at self in mirror
- Shows fear of strangers (stranger anxiety may begin)

**Cognitive:**
- Looks around at things nearby
- Brings things to mouth
- Shows curiosity and tries to get things that are out of reach
- Begins to understand cause and effect

## When to be concerned

**Contact your pediatrician if your baby:**
- Doesn't respond to loud sounds
- Doesn't follow moving objects with eyes by 3 months
- Doesn't smile at people by 3 months
- Doesn't hold head steady by 4 months
- Doesn't roll over by 6 months
- Seems very stiff or very floppy

## Supporting your baby's development

**Daily activities that promote development:**
- Tummy time: Start with a few minutes several times a day
- Reading and talking to your baby
- Playing with age-appropriate toys
- Responding to your baby's sounds and expressions
- Creating a safe environment for exploration

**Red flags to watch for:**
- Loss of previously acquired skills
- Extreme sensitivity to sounds or touch
- Difficulty with feeding or sleeping that affects growth
- Unusual eye movements or lack of eye contact

## Resources and references

**Authoritative sources:**
- CDC Developmental Milestones (0-6 months)
- AAP Bright Futures Guidelines
- WHO Child Growth Standards
- Zero to Three: National Center for Infants, Toddlers, and Families

**Key takeaway:** Every baby develops at their own pace. These milestones are guidelines, not strict deadlines. Regular well-child visits with your pediatrician are the best way to monitor your baby's development and address any concerns early.`,
    summary: 'Babies 0-6 months develop rapidly through key milestones: 0-2 months show early reflexes and social smiles, 2-4 months gain head control and hand-eye coordination, 4-6 months achieve sitting and rolling. Monitor development through regular pediatric visits.',
    category: 'development',
    subcategory: 'milestones',
    age_range: ['0-6 months'],
    risk_level: 'medium',
    tags: ['milestones', 'development', 'cdc', 'aap', 'who', 'physical-development', 'cognitive-development', 'social-development']
  },
  {
    slug: 'baby-milestones-6-12-months-cdc-aap-guidance-2025',
    title: 'What are the key developmental milestones for babies 6-12 months?',
    content: `## Key milestones overview

The second half of the first year is marked by major physical achievements, emerging independence, and rapid cognitive growth. Babies become more mobile, communicative, and interactive with their environment.

## 6-8 months: Mobility and exploration

**Physical milestones:**
- Sits without support
- Crawls on hands and knees (some babies may skip crawling)
- Pulls self up to standing position
- Begins to cruise along furniture

**Social and emotional:**
- Shows stranger anxiety (fear of unfamiliar people)
- Shows clear preference for primary caregivers
- Enjoys social games like peek-a-boo
- Shows frustration when separated from parents

**Cognitive:**
- Understands object permanence (objects exist even when hidden)
- Begins to use gestures to communicate
- Shows interest in cause and effect
- Begins to understand simple words like "no"

**Language:**
- Babbles with consonants ("mama," "dada," "baba")
- Responds to own name
- Understands tone of voice
- Begins to imitate sounds and gestures

## 8-10 months: Increased independence

**Physical milestones:**
- Stands holding onto furniture
- May take first steps while holding onto furniture
- Uses pincer grasp (thumb and forefinger) to pick up small objects
- Transfers objects from one hand to the other

**Social and emotional:**
- Shows clear attachment to primary caregivers
- May show separation anxiety
- Enjoys playing interactive games
- Shows pride in accomplishments

**Cognitive:**
- Looks for hidden objects
- Understands simple commands
- Shows problem-solving skills
- Begins to use objects as tools

**Language:**
- Says "mama" and "dada" with meaning
- Uses gestures like waving bye-bye
- Responds to simple requests
- Imitates sounds and actions

## 10-12 months: Walking and talking

**Physical milestones:**
- Takes first independent steps
- Can stand alone for a few seconds
- Walks while holding onto furniture
- Can drink from a cup with help

**Social and emotional:**
- Shows affection for familiar people
- May show fear in new situations
- Enjoys being the center of attention
- Shows clear preferences for people and activities

**Cognitive:**
- Follows simple directions
- Shows understanding of "in" and "out"
- Can find hidden objects easily
- Shows problem-solving abilities

**Language:**
- Says 2-3 words with meaning
- Understands 10-50 words
- Uses gestures to communicate
- Responds to "no" appropriately

## When to be concerned

**Contact your pediatrician if your baby:**
- Doesn't sit without support by 9 months
- Doesn't bear weight on legs when supported by 12 months
- Doesn't use gestures like pointing by 12 months
- Doesn't say single words like "mama" or "dada" by 12 months
- Loses previously acquired skills
- Doesn't show interest in interacting with people

## Supporting your baby's development

**Activities that promote development:**
- Encourage crawling and walking in safe environments
- Read books together daily
- Play interactive games like peek-a-boo and pat-a-cake
- Provide age-appropriate toys that encourage exploration
- Talk to your baby throughout the day
- Encourage self-feeding with finger foods

**Safety considerations:**
- Baby-proof your home as mobility increases
- Supervise closely during play
- Ensure safe sleeping environment
- Keep small objects out of reach

## Red flags and when to seek help

**Developmental concerns:**
- Regression in previously acquired skills
- Extreme sensitivity to sounds, lights, or textures
- Lack of eye contact or social interaction
- Repetitive behaviors or movements
- Difficulty with feeding that affects growth

**Early intervention resources:**
- Early Intervention programs (birth to 3 years)
- Pediatric developmental specialists
- Speech and language therapists
- Physical therapists for gross motor concerns

## Resources and references

**Authoritative sources:**
- CDC Developmental Milestones (6-12 months)
- AAP Bright Futures Guidelines
- WHO Child Growth Standards
- American Speech-Language-Hearing Association (ASHA)

**Key takeaway:** This is a period of rapid change and growth. Celebrate your baby's achievements while monitoring development through regular pediatric visits. Early intervention can make a significant difference if concerns arise.`,
    summary: 'Babies 6-12 months achieve major milestones: 6-8 months gain mobility and object permanence, 8-10 months show independence and pincer grasp, 10-12 months take first steps and say first words. Monitor development and seek early intervention if concerns arise.',
    category: 'development',
    subcategory: 'milestones',
    age_range: ['6-12 months'],
    risk_level: 'medium',
    tags: ['milestones', 'development', 'walking', 'talking', 'mobility', 'cognitive-development', 'language-development', 'cdc', 'aap']
  },
  {
    slug: 'cognitive-development-activities-babies-2025',
    title: 'What activities can I do with my baby to support cognitive development?',
    content: `## Understanding cognitive development

Cognitive development refers to how babies learn to think, reason, problem-solve, and understand the world around them. During the first year, babies develop foundational cognitive skills that will support all future learning.

## 0-3 months: Building awareness

**Age-appropriate activities:**
- **Face-to-face interaction:** Make eye contact and talk to your baby during feeding and play
- **High-contrast images:** Show black and white pictures or books to stimulate visual development
- **Gentle music:** Play soft music and sing lullabies
- **Tummy time with toys:** Place colorful, safe toys within baby's view during tummy time
- **Mirror play:** Let baby look at themselves in a baby-safe mirror

**What this supports:**
- Visual tracking and focus
- Recognition of faces and voices
- Early cause-and-effect understanding
- Attention and concentration

## 3-6 months: Exploring cause and effect

**Age-appropriate activities:**
- **Rattles and noise makers:** Give baby toys that make sounds when moved
- **Peek-a-boo:** Play simple hiding games to teach object permanence
- **Musical toys:** Provide toys that play music or make sounds
- **Soft books:** Read board books with simple pictures
- **Sensory play:** Let baby explore different textures safely

**What this supports:**
- Understanding that actions have consequences
- Object permanence (things exist even when hidden)
- Hand-eye coordination
- Memory development

## 6-9 months: Problem-solving begins

**Age-appropriate activities:**
- **Simple puzzles:** Large, chunky puzzles with 2-3 pieces
- **Stacking toys:** Blocks or rings that can be stacked
- **Hide and seek with toys:** Hide toys under blankets and let baby find them
- **Interactive books:** Books with flaps or textures to explore
- **Cause-and-effect toys:** Toys that respond to baby's actions

**What this supports:**
- Problem-solving skills
- Understanding of spatial relationships
- Memory and recall
- Planning and execution of actions

## 9-12 months: Advanced problem-solving

**Age-appropriate activities:**
- **Shape sorters:** Simple shape-sorting toys
- **Building blocks:** Large, safe blocks for stacking and knocking down
- **Interactive games:** Simple games like "Where's the ball?"
- **Music and movement:** Dancing and moving to music together
- **Simple pretend play:** Using toys to represent real objects

**What this supports:**
- Advanced problem-solving
- Symbolic thinking (using one thing to represent another)
- Memory and sequencing
- Understanding of categories and concepts

## Daily routines that support cognitive development

**Mealtime activities:**
- Talk about the foods you're eating
- Let baby explore different textures and tastes
- Describe what you're doing during meal preparation
- Use mealtime as a learning opportunity

**Bath time activities:**
- Sing songs and nursery rhymes
- Use bath toys to teach concepts like "full" and "empty"
- Describe body parts as you wash them
- Let baby splash and explore water safely

**Bedtime routines:**
- Read the same book each night for familiarity
- Sing lullabies and talk about the day
- Create a consistent routine that baby can anticipate
- Use bedtime as a time for reflection and learning

## Creating a learning environment

**Home setup:**
- **Safe exploration space:** Create areas where baby can safely explore
- **Variety of textures:** Provide toys and materials with different textures
- **Books everywhere:** Keep age-appropriate books in different rooms
- **Music and sounds:** Play different types of music throughout the day
- **Natural light:** Ensure good lighting for visual development

**Safety considerations:**
- Supervise all activities closely
- Choose age-appropriate toys
- Avoid small objects that could be choking hazards
- Ensure toys are made of safe, non-toxic materials
- Regularly inspect toys for wear and damage

## Signs of healthy cognitive development

**What to look for:**
- Increasing attention span
- Growing curiosity about the environment
- Ability to solve simple problems
- Understanding of cause and effect
- Memory for familiar people and routines
- Interest in books and pictures

## When to be concerned

**Red flags:**
- Lack of interest in toys or people
- No response to sounds or voices
- Extreme difficulty with transitions
- Repetitive behaviors without purpose
- Loss of previously acquired skills
- No improvement in problem-solving over time

## Resources and support

**Professional resources:**
- Pediatrician for developmental concerns
- Early Intervention services (birth to 3 years)
- Child development specialists
- Public library programs for babies and toddlers

**Educational resources:**
- Zero to Three: National Center for Infants, Toddlers, and Families
- CDC Developmental Milestones
- AAP Bright Futures Guidelines
- Local parenting classes and support groups

## Key principles for supporting cognitive development

1. **Follow your baby's lead:** Watch for signs of interest and engagement
2. **Keep it simple:** Young babies learn best from simple, repetitive activities
3. **Be consistent:** Regular routines help babies learn and feel secure
4. **Talk constantly:** Describe what you're doing and what your baby is experiencing
5. **Celebrate small achievements:** Acknowledge and celebrate your baby's learning

**Remember:** Every baby develops at their own pace. These activities are suggestions to support development, not requirements. The most important thing is to provide a loving, responsive environment where your baby feels safe to explore and learn.`,
    summary: 'Support baby cognitive development through age-appropriate activities: 0-3 months focus on face-to-face interaction and visual stimulation, 3-6 months explore cause and effect, 6-9 months introduce problem-solving toys, 9-12 months engage in advanced problem-solving and pretend play.',
    category: 'development',
    subcategory: 'cognitive-activities',
    age_range: ['0-12 months'],
    risk_level: 'low',
    tags: ['cognitive-development', 'learning-activities', 'brain-development', 'problem-solving', 'sensory-play', 'early-learning', 'educational-toys']
  },
  {
    slug: 'language-development-babies-0-12-months-2025',
    title: 'How can I support my baby\'s language development from birth to 12 months?',
    content: `## Understanding language development

Language development begins at birth and involves both understanding (receptive language) and producing (expressive language) communication. Babies learn language through interaction, observation, and practice.

## 0-3 months: Foundation building

**What babies are learning:**
- Recognizing voices, especially primary caregivers
- Understanding that sounds have meaning
- Learning the rhythm and patterns of speech
- Developing the ability to focus attention

**How to support language development:**
- **Talk constantly:** Describe everything you're doing throughout the day
- **Use "parentese":** Speak in a higher pitch with exaggerated facial expressions
- **Respond to sounds:** When baby makes sounds, respond as if they're having a conversation
- **Read aloud:** Even newborns benefit from hearing the rhythm of language
- **Sing songs:** Lullabies and nursery rhymes help babies learn language patterns

**What to expect:**
- Baby may quiet down when they hear familiar voices
- Eye contact during feeding or interaction
- Different cries for different needs
- Cooing sounds around 6-8 weeks

## 3-6 months: Sound exploration

**What babies are learning:**
- Making different sounds with their voice
- Understanding tone and emotion in speech
- Learning that their sounds get responses
- Developing the ability to take turns in "conversation"

**How to support language development:**
- **Imitate sounds:** Repeat the sounds your baby makes
- **Add words:** When baby says "ba," you can say "Yes, that's a ball!"
- **Use gestures:** Wave bye-bye, clap hands, point to objects
- **Name objects:** Point to and name everyday objects
- **Play sound games:** Make animal sounds and simple sound effects

**What to expect:**
- Babbling with vowel sounds ("ah," "oh," "eh")
- Laughing and squealing
- Responding to their name
- Showing excitement when hearing familiar voices

## 6-9 months: Babbling and understanding

**What babies are learning:**
- Combining consonants and vowels ("mama," "dada," "baba")
- Understanding simple words and commands
- Learning that words represent objects and actions
- Developing the ability to follow simple directions

**How to support language development:**
- **Expand on babbling:** When baby says "mama," respond with "Yes, mama is here!"
- **Use simple commands:** "Come here," "Give me the ball," "Wave bye-bye"
- **Read interactive books:** Books with flaps, textures, or sounds
- **Play naming games:** "Where's your nose? Where's your mouth?"
- **Sing action songs:** Songs with hand movements and gestures

**What to expect:**
- Babbling with consonants ("mama," "dada")
- Understanding "no" and other simple commands
- Responding to their name consistently
- Showing interest in books and pictures

## 9-12 months: First words and communication

**What babies are learning:**
- Saying their first meaningful words
- Understanding 10-50 words
- Using gestures to communicate
- Learning that communication is a two-way process

**How to support language development:**
- **Celebrate first words:** Show excitement when baby says words
- **Expand vocabulary:** Add descriptive words ("big ball," "red car")
- **Use simple sentences:** "Mama is coming," "Time for milk"
- **Encourage gestures:** Teach baby to point, wave, and clap
- **Read together daily:** Make reading a special, interactive time

**What to expect:**
- 2-3 meaningful words by 12 months
- Understanding simple questions like "Where's daddy?"
- Using gestures like pointing and waving
- Showing clear preferences and making choices known

## Daily language-building activities

**Morning routine:**
- Talk about getting dressed: "Let's put on your blue shirt"
- Name body parts during diaper changes
- Describe breakfast: "This is your oatmeal, it's warm and yummy"

**Playtime activities:**
- **Narrate play:** Describe what baby is doing: "You're stacking the blocks"
- **Ask simple questions:** "Do you want the red ball or the blue ball?"
- **Use descriptive language:** "The ball is big and bouncy"
- **Encourage imitation:** Model sounds and words for baby to copy

**Mealtime opportunities:**
- **Name foods:** "This is banana, it's yellow and sweet"
- **Talk about tastes:** "This is sour lemon," "This is sweet apple"
- **Describe actions:** "You're using your spoon," "The food is going in your mouth"

## Creating a language-rich environment

**Home setup:**
- **Books everywhere:** Keep age-appropriate books in different rooms
- **Labels and pictures:** Use simple labels on common objects
- **Music and songs:** Play different types of music and sing together
- **Quiet spaces:** Create areas for focused interaction without distractions

**Technology considerations:**
- **Limit screen time:** AAP recommends no screen time before 18 months
- **Focus on interaction:** Real conversation is more valuable than educational videos
- **Use technology together:** If using devices, interact with your baby while using them

## Signs of healthy language development

**What to look for:**
- Increasing variety of sounds
- Responding to familiar words
- Showing interest in books and pictures
- Making eye contact during interaction
- Using gestures to communicate
- Attempting to imitate sounds and words

## Red flags and when to be concerned

**Contact your pediatrician if your baby:**
- Doesn't respond to sounds by 3 months
- Doesn't make eye contact during interaction by 6 months
- Doesn't babble by 9 months
- Doesn't respond to their name by 9 months
- Doesn't say any words by 12 months
- Loses previously acquired language skills

## Supporting bilingual development

**If you speak multiple languages:**
- **Use both languages consistently:** Each parent can use their native language
- **Don't worry about confusion:** Babies can learn multiple languages simultaneously
- **Maintain cultural connections:** Language learning includes cultural understanding
- **Be patient:** Bilingual children may take longer to reach milestones in each language

## Professional resources and support

**When to seek help:**
- Early Intervention services (birth to 3 years)
- Speech-language pathologists
- Hearing specialists (audiologists)
- Pediatric developmental specialists

**Assessment tools:**
- Ages and Stages Questionnaires (ASQ)
- CDC Developmental Milestones
- AAP Bright Futures Guidelines

## Key principles for supporting language development

1. **Talk, talk, talk:** The more language babies hear, the more they learn
2. **Be responsive:** Respond to your baby's sounds and attempts at communication
3. **Make it interactive:** Language learning happens through back-and-forth interaction
4. **Read together:** Daily reading is one of the best ways to support language development
5. **Be patient:** Every baby develops at their own pace

**Remember:** Language development is a journey, not a race. The most important thing is to create a loving, language-rich environment where your baby feels encouraged to communicate and explore the wonderful world of language.`,
    summary: 'Support baby language development through constant talking, reading, singing, and responsive interaction. 0-3 months focus on voice recognition, 3-6 months explore sounds and babbling, 6-9 months develop understanding and consonants, 9-12 months achieve first words and gestures.',
    category: 'development',
    subcategory: 'language-development',
    age_range: ['0-12 months'],
    risk_level: 'low',
    tags: ['language-development', 'speech-development', 'communication', 'babbling', 'first-words', 'reading-aloud', 'parentese', 'early-literacy']
  },
  {
    slug: 'motor-development-activities-babies-2025',
    title: 'What activities can help my baby develop motor skills?',
    content: `## Understanding motor development

Motor development includes both gross motor skills (large muscle movements like crawling and walking) and fine motor skills (small muscle movements like grasping and finger control). Both types of development are crucial for your baby's overall growth and independence.

## Gross motor development activities

### 0-3 months: Building strength and control

**Tummy time activities:**
- **Start early:** Begin tummy time from day one, even if just for a few minutes
- **Make it engaging:** Place colorful toys or mirrors within baby's view
- **Gradually increase:** Work up to 15-30 minutes of tummy time per day by 3 months
- **Supervise closely:** Always stay with your baby during tummy time

**Head and neck control:**
- **Gentle lifting:** Support baby's head and neck when moving them
- **Visual tracking:** Move colorful objects slowly for baby to follow with their eyes
- **Sitting support:** Hold baby in a supported sitting position for short periods

### 3-6 months: Rolling and reaching

**Rolling practice:**
- **Encourage movement:** Place toys just out of reach to encourage rolling
- **Gentle guidance:** Help baby practice rolling motions during play
- **Safe environment:** Ensure plenty of space on a firm, safe surface

**Sitting preparation:**
- **Supported sitting:** Use pillows or your hands to support baby in sitting position
- **Core strengthening:** Encourage reaching and playing while sitting
- **Balance practice:** Let baby practice balancing with minimal support

### 6-9 months: Crawling and standing

**Crawling encouragement:**
- **Tummy time continues:** Regular tummy time builds crawling strength
- **Tunnel play:** Create safe "tunnels" using blankets or furniture
- **Mirror motivation:** Place mirrors to encourage forward movement
- **Obstacle courses:** Create simple obstacles for baby to crawl over or around

**Standing practice:**
- **Furniture cruising:** Let baby pull up on sturdy furniture
- **Standing games:** Play games while baby holds onto furniture
- **Balance support:** Hold baby's hands while they practice standing

### 9-12 months: Walking and climbing

**Walking preparation:**
- **Cruising practice:** Encourage walking while holding onto furniture
- **Hand-holding walks:** Support baby while they take steps
- **Push toys:** Provide safe push toys for walking practice
- **Climbing opportunities:** Create safe climbing challenges

## Fine motor development activities

### 0-3 months: Grasping and exploring

**Hand development:**
- **Finger play:** Gently massage and move baby's fingers
- **Grasping practice:** Place your finger in baby's palm to encourage grasping
- **Texture exploration:** Let baby feel different textures safely

### 3-6 months: Reaching and transferring

**Reaching skills:**
- **Toy placement:** Place toys just within reach to encourage stretching
- **Hanging toys:** Use activity gyms or hanging toys for reaching practice
- **Transfer practice:** Help baby move objects from one hand to the other

### 6-9 months: Pincer grasp and manipulation

**Pincer grasp development:**
- **Small objects:** Provide safe, small objects for picking up
- **Finger foods:** Encourage self-feeding with appropriate finger foods
- **Puzzle pieces:** Simple puzzles with large, chunky pieces

**Hand-eye coordination:**
- **Stacking toys:** Blocks or rings for stacking and knocking down
- **Shape sorters:** Simple shape-sorting activities
- **Ball play:** Rolling and throwing soft balls

### 9-12 months: Advanced manipulation

**Complex movements:**
- **Drawing and scribbling:** Large crayons and paper
- **Button pushing:** Toys with buttons and switches
- **Building:** Simple construction toys
- **Self-feeding:** Encourage use of utensils and cups

## Daily activities that support motor development

**Morning routine:**
- **Dressing practice:** Let baby help with simple dressing tasks
- **Bath time movement:** Encourage splashing and water play
- **Mealtime skills:** Practice self-feeding and drinking from cups

**Playtime opportunities:**
- **Outdoor play:** Fresh air and different surfaces for exploration
- **Music and movement:** Dancing and moving to music
- **Water play:** Supervised water play for coordination and strength

**Evening routines:**
- **Calm activities:** Gentle stretching and massage
- **Reading together:** Holding books and turning pages
- **Quiet play:** Fine motor activities that promote relaxation

## Creating a motor-development-friendly environment

**Home setup:**
- **Safe exploration spaces:** Areas where baby can move freely
- **Appropriate toys:** Age-appropriate toys that encourage movement
- **Soft surfaces:** Rugs and mats for safe falling
- **Barriers and gates:** Safety measures that don't restrict movement

**Safety considerations:**
- **Supervision:** Always supervise motor activities
- **Age-appropriate challenges:** Don't push baby beyond their abilities
- **Safe surfaces:** Ensure play areas are clean and safe
- **Regular toy inspection:** Check toys for wear and potential hazards

## Signs of healthy motor development

**Gross motor milestones:**
- Increasing head control
- Rolling over in both directions
- Sitting without support
- Crawling or other forms of mobility
- Pulling up to standing
- Taking first steps

**Fine motor milestones:**
- Bringing hands to mouth
- Reaching for objects
- Transferring objects between hands
- Using pincer grasp
- Self-feeding attempts
- Simple tool use

## When to be concerned

**Red flags for gross motor development:**
- Not holding head up by 4 months
- Not rolling over by 6 months
- Not sitting without support by 9 months
- Not showing any mobility by 12 months
- Loss of previously acquired skills
- Extreme stiffness or floppiness

**Red flags for fine motor development:**
- Not reaching for objects by 6 months
- Not using pincer grasp by 12 months
- Not attempting self-feeding by 12 months
- Persistent fisting of hands
- Difficulty with hand-eye coordination

## Professional resources and support

**When to seek help:**
- Pediatrician for developmental concerns
- Physical therapists for gross motor delays
- Occupational therapists for fine motor concerns
- Early Intervention services (birth to 3 years)

**Assessment tools:**
- Ages and Stages Questionnaires (ASQ)
- CDC Developmental Milestones
- Peabody Developmental Motor Scales
- Bayley Scales of Infant Development

## Key principles for supporting motor development

1. **Follow baby's lead:** Watch for signs of readiness before introducing new activities
2. **Make it fun:** Keep activities enjoyable and engaging
3. **Be patient:** Every baby develops at their own pace
4. **Celebrate progress:** Acknowledge and celebrate small achievements
5. **Ensure safety:** Always prioritize safety in motor activities

**Remember:** Motor development is a natural process that unfolds at each baby's own pace. Your role is to provide opportunities, encouragement, and a safe environment for exploration. The most important thing is to make motor development activities fun and stress-free for both you and your baby.`,
    summary: 'Support baby motor development through age-appropriate activities: gross motor skills include tummy time, rolling, crawling, and walking practice; fine motor skills involve grasping, reaching, pincer grasp, and manipulation. Create safe environments and celebrate each milestone.',
    category: 'development',
    subcategory: 'motor-development',
    age_range: ['0-12 months'],
    risk_level: 'low',
    tags: ['motor-development', 'gross-motor', 'fine-motor', 'tummy-time', 'crawling', 'walking', 'grasping', 'physical-development', 'milestones']
  }
];

/**
 * 批量插入development文章
 */
async function insertDevelopmentArticles() {
  console.log('📝 开始插入Baby Development教育文章到knowledge_chunks表...\n');
  
  let successCount = 0;
  let totalCount = developmentArticles.length;
  
  for (let i = 0; i < developmentArticles.length; i++) {
    const article = developmentArticles[i];
    
    try {
      console.log(`📄 插入文章 ${i + 1}/${totalCount}: ${article.slug}`);
      
      const articleData = {
        source_type: 'kb_guide',
        source_id: require('crypto').randomUUID(),
        source_slug: article.slug,
        title: article.title,
        content: article.content,
        summary: article.summary,
        category: article.category,
        subcategory: article.subcategory,
        age_range: article.age_range,
        locale: 'Global',
        priority: 8, // 高优先级教育内容
        risk_level: article.risk_level,
        tags: article.tags,
        status: 'published'
      };
      
      const { data, error } = await supabase
        .from('knowledge_chunks')
        .insert(articleData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      successCount++;
      console.log(`   ✅ 成功插入 (ID: ${data.id})`);
      console.log(`   📊 类别: ${data.category}`);
      console.log(`   🏷️ 标签: ${data.tags.slice(0, 4).join(', ')}...`);
      console.log('');
      
    } catch (error) {
      console.error(`   ❌ 插入失败: ${error.message}`);
      console.log('');
    }
  }
  
  console.log(`📊 插入结果: ${successCount}/${totalCount} 篇文章成功插入`);
  
  return successCount;
}

/**
 * 检查插入结果
 */
async function checkInsertResults() {
  console.log('🔍 检查插入结果...\n');
  
  try {
    const slugs = developmentArticles.map(a => a.slug);
    
    const { data, error } = await supabase
      .from('knowledge_chunks')
      .select('id, source_slug, title, category, status, embedding')
      .in('source_slug', slugs)
      .eq('status', 'published');
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ 找到 ${data.length} 篇已插入的文章:`);
    
    data.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.source_slug}`);
      console.log(`      ID: ${article.id}`);
      console.log(`      标题: ${article.title.substring(0, 60)}...`);
      console.log(`      类别: ${article.category}`);
      console.log(`      嵌入: ${article.embedding ? 'YES' : 'NO'}`);
      console.log('');
    });
    
    return data.length;
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
    return 0;
  }
}

/**
 * 获取数据库统计
 */
async function getDatabaseStats() {
  console.log('📊 获取数据库统计...\n');
  
  try {
    const { count: totalChunks, error: totalError } = await supabase
      .from('knowledge_chunks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');
    
    if (totalError) throw totalError;
    
    const { count: withEmbeddings, error: embedError } = await supabase
      .from('knowledge_chunks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .not('embedding', 'is', null);
    
    if (embedError) throw embedError;
    
    // 获取development类别统计
    const { count: developmentChunks, error: devError } = await supabase
      .from('knowledge_chunks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .eq('category', 'development');
    
    if (devError) throw devError;
    
    console.log('📈 数据库统计:');
    console.log(`   总知识块数: ${totalChunks}`);
    console.log(`   有嵌入的知识块: ${withEmbeddings}`);
    console.log(`   嵌入覆盖率: ${((withEmbeddings / totalChunks) * 100).toFixed(1)}%`);
    console.log(`   Development文章: ${developmentChunks}`);
    
    return { totalChunks, withEmbeddings, developmentChunks };
    
  } catch (error) {
    console.error('❌ 获取统计失败:', error.message);
    return null;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Baby Development教育文章插入工具\n');
  
  try {
    // 插入文章
    const insertedCount = await insertDevelopmentArticles();
    
    // 检查结果
    const foundCount = await checkInsertResults();
    
    // 获取统计
    const stats = await getDatabaseStats();
    
    console.log('🎉 Baby Development文章插入完成！');
    console.log(`\n📋 处理结果:`);
    console.log(`   成功插入: ${insertedCount}/${developmentArticles.length} 篇文章`);
    console.log(`   数据库确认: ${foundCount} 篇文章`);
    
    if (stats) {
      console.log(`\n📊 数据库状态:`);
      console.log(`   总知识块: ${stats.totalChunks}`);
      console.log(`   嵌入覆盖: ${((stats.withEmbeddings / stats.totalChunks) * 100).toFixed(1)}%`);
      console.log(`   Development文章: ${stats.developmentChunks}`);
    }
    
    console.log('\n💡 下一步建议:');
    console.log('   1. 生成向量嵌入: node scripts/generate-embeddings.js');
    console.log('   2. 测试development相关搜索');
    console.log('   3. 验证教育内容质量');
    
  } catch (error) {
    console.error('\n❌ 插入失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  insertDevelopmentArticles,
  checkInsertResults,
  getDatabaseStats
};
