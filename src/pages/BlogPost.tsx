import React from "react";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";

// 示例文章数据
const blogPostData = {
  "safe-sleep-guidelines-newborns": {
    title: "Safe Sleep Guidelines for Newborns: AAP-Based Tips That Cut SIDS Risk",
    excerpt: "Learn the ABCs of safe sleep—Alone, on their Back, in a safety-approved Crib. Evidence-based guidelines from the American Academy of Pediatrics to reduce SIDS risk and establish healthy sleep habits from day one.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">How parents in the United States, Canada and across Europe can lower SIDS risk from Day 1</h2>
        <p class="text-gray-700 leading-relaxed">Evidence-based guidelines from leading health organizations to keep your baby safe during sleep.</p>
      </div>

      <div class="mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">The Night That Changed Our Routine</h3>
        
        <p class="text-gray-700 leading-relaxed mb-4">Two weeks after our son Leo arrived, I found myself wide‑awake at 3 a.m. googling "Is it safe if he rolls on his side?" That late‑night spiral isn't unique: across the United States, Canada, the U.K., Germany, France, Sweden, Italy and Spain, thousands of new parents refresh baby‑monitor feeds every night hoping to prevent the unthinkable.</p>

        <p class="text-gray-700 leading-relaxed mb-4">According to the Centers for Disease Control (CDC), about 3,500 American infants die suddenly each year, most in unsafe sleep setups. European health ministries cite similar trends under the umbrella term SUDI (Sudden Unexpected Death in Infancy).</p>

        <p class="text-gray-700 leading-relaxed mb-6">Yet one simple habit cuts the risk dramatically: placing babies on their backs—and keeping the sleep space totally bare.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Why <strong>Back‑to‑Sleep</strong> Matters (US + Europe)</h2>
        
        <div class="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-6">
          <ul class="space-y-2 text-gray-700">
            <li><strong>≈ 3,500 U.S. infants</strong> die suddenly each year—most linked to unsafe sleep setups (CDC).</li>
            <li>Similar concerns appear in <strong>Canada, the United Kingdom, Germany, France, Sweden, Italy, Spain</strong>.</li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Decoding the "ABC" Rule (North America ✚ Europe)</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Health agencies on both continents agree:</p>
        
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <ul class="space-y-3 text-gray-700">
            <li><strong>A — Alone</strong>: Baby sleeps solo (no pillows, toys, siblings or pets).</li>
            <li><strong>B — Back</strong>: Supine every time—naps and nights.</li>
            <li><strong>C — Crib</strong>: Firm, flat, safety‑certified crib or bassinet.</li>
          </ul>
        </div>

        <h3 class="text-xl font-semibold text-gray-800 mb-4">Regional Guidelines</h3>
        
        <div class="space-y-4">
          <p class="text-gray-700 leading-relaxed"><strong>United States & Canada</strong> – American Academy of Pediatrics (AAP) and Health Canada both insist on the ABC plus six months of room‑sharing (same room, separate surface).</p>

          <p class="text-gray-700 leading-relaxed"><strong>United Kingdom</strong> – The NHS and Lullaby Trust echo the ABC and recommend a room temperature of 16–20 °C (60–68 °F).</p>

          <p class="text-gray-700 leading-relaxed"><strong>Germany, France, Italy, Spain, Sweden</strong> – EU standards (EN 1130 & EN 716) reinforce a flat, inclined‑free crib; no pillows or wedges.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">AAP / NHS / Health Canada "ABC" Rule (North America ➕ Europe)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Region</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Recommendation (summary)</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>United States</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>A</strong>lone, on their <strong>B</strong>ack, in a safety‑approved <strong>C</strong>rib (firm mattress, no extras).</td>
                <td class="border border-gray-300 px-4 py-3">AAP</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Canada</strong></td>
                <td class="border border-gray-300 px-4 py-3">Same ABC + room‑share for 6 months.</td>
                <td class="border border-gray-300 px-4 py-3">Health Canada</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>United Kingdom</strong></td>
                <td class="border border-gray-300 px-4 py-3">Supine position, room 16–20 °C, bare crib.</td>
                <td class="border border-gray-300 px-4 py-3">NHS / Lullaby Trust</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>EU (DE/FR/IT)</strong></td>
                <td class="border border-gray-300 px-4 py-3">EN‑certified flat crib; no wedges, no incline.</td>
                <td class="border border-gray-300 px-4 py-3">CEN</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Five Practical Steps for Your Nursery</h2>

        <div class="space-y-6">
          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">1. Flat is best</h3>
            <p class="text-gray-700 leading-relaxed">Skip wedges or "anti‑reflux" inclined sleepers; these devices have been linked to asphyxia cases in both the U.S. and Europe.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">2. Share the room, not the mattress</h3>
            <p class="text-gray-700 leading-relaxed">Put baby's crib next to your bed for at least six months—longer if it helps everyone sleep.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">3. Dress, don't drape</h3>
            <p class="text-gray-700 leading-relaxed">A wearable blanket (sleep sack) keeps baby warm without loose fabric. Aim for 20–22 °C / 68–72 °F indoors.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">4. Keep the crib bare</h3>
            <p class="text-gray-700 leading-relaxed">No bumpers, stuffed animals or decorative pillows—no matter how cute the Instagram photo might look.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">5. Back is still best—even for reflux babies</h3>
            <p class="text-gray-700 leading-relaxed">Modern research shows babies clear fluids more effectively when supine, thanks to airway anatomy.</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Practical Setup Checklist (for US · CA · UK · EU)</h2>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <ol class="space-y-3 text-gray-700">
            <li><strong>Flat surface</strong> — JPMA‑ or EN‑certified crib/bassinet; no incline.</li>
            <li><strong>Room‑share</strong> — same room, separate surface, for <em>≥ 6 months</em>.</li>
            <li><strong>Dress right</strong> — wearable blanket; room <strong>20‑22 °C (68‑72 °F)</strong>.</li>
            <li><strong>Keep it bare</strong> — no bumpers, pillows, toys, loose blankets.</li>
          </ol>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Myth‑Busting Around the Globe</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Common Claim (heard in 🇺🇸🇨🇦🇬🇧🇩🇪)</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Reality</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">"Back‑sleeping makes my baby choke."</td>
                <td class="border border-gray-300 px-4 py-3">Supine infants have tracheas above their esophagus, so liquid drains away from lungs.</td>
                <td class="border border-gray-300 px-4 py-3">AAP Pediatrics</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">"A soft bumper prevents injuries."</td>
                <td class="border border-gray-300 px-4 py-3">Soft items can trap or suffocate a rolling baby.</td>
                <td class="border border-gray-300 px-4 py-3">NHS Safe Sleep, HealthyChildren.org</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">How DearBaby Adds a Digital Safety Net 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Whether you live in San Francisco, Toronto, London, Berlin or Madrid, DearBaby pairs with Apple Watch or smart socks to keep an eye on positioning:</p>

        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <ul class="space-y-3 text-gray-700">
            <li><strong>Real‑time prone alerts</strong> – If baby flips face‑down, you get a vibration on your phone.</li>
            <li><strong>Angle detection</strong> – Crib accidentally tilts? DearBaby flags it instantly.</li>
            <li><strong>Regional tips</strong> – The app adapts safe‑sleep reminders to U.S. AAP, Canadian Paediatric Society, or NHS wording—so you always follow local gold‑standard guidance.</li>
          </ul>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded-r-lg">
          <p class="text-blue-800"><em>Apple Watch alerts require watchOS 11 and a DearBaby Premium subscription.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">The Bottom Line</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Wherever you're reading—Boston or Barcelona, Calgary or Cologne—the safest sleep looks the same: a baby on their back, alone in a bare crib. Combine that timeless advice with a little smart‑tech backup, and you'll finally rest as soundly as your newborn.</p>

          <p class="text-gray-600 italic">Sweet dreams, wherever you are.</p>
        </div>
      </div>
    `,
    category: "Sleep & Safety",
    readTime: "8 min read",
    publishDate: "2025-01-15",
    author: "JupitLunar Pediatric Team",
    keywords: ["safe sleep", "SIDS prevention", "newborn crib safety", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "gentle-sleep-training-baby": {
    title: "Getting Baby to Sleep Through the Night: Gentle Training Methods",
    excerpt: "Evidence-based methods including graduated extinction, white noise, and consistent routines for longer sleep stretches. Learn the AAP-approved approach to gentle sleep training that respects your baby's needs.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-l-4 border-purple-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Evidence‑based methods—graduated extinction, white‑noise & routine—for longer nighttime stretches</h2>
        <p class="text-gray-700 leading-relaxed">AAP-accepted, evidence‑based tips for parents in North America and Europe who want longer nighttime stretches.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Sleepless Nights in Any Time Zone</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Whether you're settling your baby in <strong>Boston 🇺🇸</strong>, <strong>Toronto 🇨🇦</strong>, <strong>London 🇬🇧</strong> or <strong>Berlin 🇩🇪</strong>, one truth unites parents worldwide: we all crave more than a two‑hour stretch of sleep. Research accepted by the <strong>American Academy of Pediatrics (AAP)</strong> — and echoed by European pediatric associations — shows that <strong>gentle sleep‑training</strong> can lengthen night sleep without harming parent‑child bonding.</p>

        <h3 class="text-xl font-semibold text-gray-800 mb-4">What Exactly Is "Graduated Extinction"?</h3>
        
        <p class="text-gray-700 leading-relaxed mb-4">Think of it as the moderated <em>Ferber</em> method. You place baby <strong>drowsy‑but‑awake</strong>, leave the room, and gradually increase the time before you return for brief check‑ins. Over several nights, babies learn to self‑soothe; parents get longer blocks of sleep.</p>

        <div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg mb-6">
          <p class="text-purple-800"><strong>Cleveland Clinic (USA)</strong> calls it <em>"evidence‑based, safe, and developmentally appropriate from about four months onward."</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Five‑Step Gentle Plan (Works in US · CA · UK · EU)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Step</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">How to Do It</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Why It Works</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>1. Consistent 30‑min routine</strong></td>
                <td class="border border-gray-300 px-4 py-3">Bath → feed → short story, same order nightly.</td>
                <td class="border border-gray-300 px-4 py-3">Predictability lowers cortisol and cues melatonin.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>2. Optimize the sleep cave</strong></td>
                <td class="border border-gray-300 px-4 py-3">Room <strong>20‑22 °C / 68‑72 °F</strong>, blackout curtains, white‑noise <strong>≤ 50 dB</strong>.</td>
                <td class="border border-gray-300 px-4 py-3">Darkness & low‑level noise mimic womb and block household sounds.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>3. Timed check‑ins</strong></td>
                <td class="border border-gray-300 px-4 py-3">Wait <strong>3 min</strong> before first return; soothe with voice/pat (no pickup), then add <strong>+2 min</strong> each round.</td>
                <td class="border border-gray-300 px-4 py-3">Proven in AAP & Sleep Foundation studies to foster self‑soothing.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>4. Daytime nap protection</strong></td>
                <td class="border border-gray-300 px-4 py-3">Offer age‑appropriate naps; overtired babies fight nighttime sleep.</td>
                <td class="border border-gray-300 px-4 py-3">Sleep pressure stays balanced over 24 h.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>5. Respect night feeds</strong></td>
                <td class="border border-gray-300 px-4 py-3">Most pediatricians OK weaning after <strong>4–6 mo</strong>; feed quickly in the dark until then.</td>
                <td class="border border-gray-300 px-4 py-3">Hungry babies won't settle; gradual weaning avoids stress.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-blue-800"><em>Tip for European winters:</em> a wearable sleep sack keeps baby warm without loose blankets, meeting <strong>EN 16781</strong> safety standards.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Common Questions from Parents in 🇺🇸 🇨🇦 🇬🇧 🇩🇪</h2>
        
        <div class="space-y-6">
          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Q1. Won't my baby feel abandoned?</h3>
            <div class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
              <p class="text-gray-700">Randomized trials show no long‑term attachment issues when check‑ins are consistent and loving.</p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Q2. How loud is 50 dB?</h3>
            <div class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
              <p class="text-gray-700">About the sound of a household shower. Place the white‑noise device at least <strong>2 m / 6 ft</strong> from the crib.</p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Q3. What if my pediatrician says wait?</h3>
            <div class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
              <p class="text-gray-700">Always follow local medical advice; some clinicians in <strong>Italy</strong> and <strong>Spain</strong> prefer starting at six months.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby: Turn Logs into Smart Coaching 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">DearBaby's sleep tracker already logs every stretch in <strong>New York</strong>, <strong>Montreal</strong>, <strong>Manchester</strong> and <strong>Munich</strong>. Once the app sees that your baby can link two sleep cycles, it <strong>prompts you to extend check‑in intervals</strong>—transforming raw data into personalized, evidence‑based coaching.</p>

        <div class="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
          <p class="text-indigo-800"><em>Requires DearBaby Premium & watchOS 11 or compatible smart‑sock.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Gentle, Global, Evidence‑Based</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">A cool room, a soothing routine, measured check‑ins, and patient night‑feeds work from <strong>Seattle to Stockholm</strong>. Pair the science with DearBaby's smart nudges, and those elusive eight‑hour stretches are suddenly within reach—wherever you call home.</p>
        </div>
      </div>
    `,
    category: "Sleep & Safety",
    readTime: "10 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Pediatric Team",
    keywords: ["gentle sleep training", "graduated extinction", "self‑soothe", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "baby-sleep-regressions-explained": {
    title: "Understanding Sleep Regressions: What They Are and How to Survive Them",
    excerpt: "Explains the 4‑, 8‑ and 12‑month sleep regressions, why they happen, and practical tips for parents in North America and Europe.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Why the 4‑month (and later) regressions happen and how to ride them out</h2>
        <p class="text-gray-700 leading-relaxed">Explains the 4‑, 8‑ and 12‑month sleep regressions, why they happen, and practical tips for parents in North America and Europe.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">"What Happened to My Great Sleeper?"</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">If your once‑peaceful baby in <strong>Chicago 🇺🇸</strong>, <strong>Vancouver 🇨🇦</strong>, <strong>Manchester 🇬🇧</strong> or <strong>Munich 🇩🇪</strong> suddenly wakes every hour, you're likely facing a <strong>sleep regression</strong>—a temporary disruption that appears during major developmental leaps.</p>

        <h3 class="text-xl font-semibold text-gray-800 mb-4">The Big Three Regressions</h3>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Age (approx.)</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">What's Changing</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">How Long?</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Classic Signs</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>4 months</strong></td>
                <td class="border border-gray-300 px-4 py-3">Sleep cycles mature (45–50 min), baby learns to roll.</td>
                <td class="border border-gray-300 px-4 py-3"><strong>10–14 days</strong></td>
                <td class="border border-gray-300 px-4 py-3">Frequent night waking, short naps</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>8 months</strong></td>
                <td class="border border-gray-300 px-4 py-3">Crawling, pulling up, separation anxiety spike.</td>
                <td class="border border-gray-300 px-4 py-3"><strong>~2 weeks</strong></td>
                <td class="border border-gray-300 px-4 py-3">Standing in crib, sudden crying</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>12 months</strong></td>
                <td class="border border-gray-300 px-4 py-3">Walking prep, language burst, nap transition.</td>
                <td class="border border-gray-300 px-4 py-3"><strong>1–2 weeks</strong></td>
                <td class="border border-gray-300 px-4 py-3">Fighting bedtime, 5 a.m. parties</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg mb-6">
          <p class="text-orange-800"><strong>Cleveland Clinic</strong> calls regressions "the developmental tax parents pay for milestones."</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Survival Guide for Parents in US · CA · UK · EU</h2>
        
        <div class="space-y-4">
          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">1. Stick to your routine</h3>
            <p class="text-gray-700">Familiar bath‑feed‑story cues tell the brain it's still bedtime.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">2. Offer extra feeds</h3>
            <p class="text-gray-700">Growth spurts hike calorie needs; topping up can eliminate 2 a.m. hunger cries.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">3. Practice skills in daylight</h3>
            <p class="text-gray-700">Let baby roll, crawl or babble <strong>during the day</strong> so they're not rehearsing at 2 a.m.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">4. Use wake‑windows, not the clock</h3>
            <p class="text-gray-700">Adjust naps so baby isn't overtired (or under‑tired) at night.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">5. Stay calm—this too shall pass</h3>
            <p class="text-gray-700">Most regressions resolve within two weeks if you remain consistent.</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Myth vs Fact</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Myth</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Reality</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">"Regression means my sleep‑training failed."</td>
                <td class="border border-gray-300 px-4 py-3">No—brain changes override habits temporarily.</td>
                <td class="border border-gray-300 px-4 py-3">AAP Pediatric Sleep Taskforce</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">"Start solids early to fix it."</td>
                <td class="border border-gray-300 px-4 py-3">Early solids don't shorten regressions and can harm gut health.</td>
                <td class="border border-gray-300 px-4 py-3">WHO Europe</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Heads‑Up 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">DearBaby's <strong>Milestone Predictor</strong> analyzes rolling, babbling and standing data. One week before a likely regression, it sends a <strong>"sleep storm warning"</strong> so parents in <strong>Los Angeles</strong>, <strong>Paris</strong>, or <strong>Stockholm</strong> can:</p>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-amber-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Adjust expectations</strong> (skip date night)</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Top up daytime calories</strong></span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Shorten wake‑windows</strong></span>
            </li>
          </ul>
        </div>

        <div class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
          <p class="text-orange-800"><em>Milestone alerts available in DearBaby Premium, powered by GPT‑4o analytics.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Key Take‑Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Sleep regressions are <strong>short‑lived growing pains</strong>—a sign your baby's brain is thriving. Maintain routine, feed a bit more, encourage practice during daylight, and lean on DearBaby for predictive nudges. Better sleep will be back before you know it—whether you're in <strong>New York</strong> or <strong>Naples</strong>.</p>
        </div>
      </div>
    `,
    category: "Sleep & Safety",
    readTime: "8 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Pediatric Team",
    keywords: ["sleep regression", "4‑month sleep regression", "developmental leap", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "breastfeeding-basics-new-moms": {
    title: "Breast‑feeding Tips for New Moms: Latch Tricks, Comfort Positions & WHO‑Backed Benefits",
    excerpt: "Practical latch fixes, supply troubleshooting, and DearBaby feed‑tracking for mothers in North America and Europe.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Latch tricks, comfort positions, and WHO‑backed benefits</h2>
        <p class="text-gray-700 leading-relaxed">Practical latch fixes, supply troubleshooting, and DearBaby feed‑tracking for mothers in North America and Europe.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Fast Facts Every Mom in US · CA · UK · EU Should Know</h2>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <ul class="space-y-3 text-green-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>WHO & UNICEF</strong> recommend <strong>exclusive breast‑feeding for 6 months</strong> and continued nursing alongside solids for at least one year.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>CDC data</strong> show breast‑fed infants have <strong>fewer ear, respiratory and GI infections</strong> thanks to antibodies in milk.</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Top Troubleshooters (Quick‑Fix Table)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Issue</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Quick Fix</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Evidence / Source</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Sore nipples</strong></td>
                <td class="border border-gray-300 px-4 py-3">Check <strong>asymmetric latch</strong> (nose‑to‑nipple, chin in). Use medical‑grade lanolin after feeds.</td>
                <td class="border border-gray-300 px-4 py-3"><em>La Leche League</em></td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Supply worries</strong></td>
                <td class="border border-gray-300 px-4 py-3">Aim for <strong>8–12 nursing sessions / 24 h</strong>. Count wet diapers (≥ 6/day by day 5) rather than pump output.</td>
                <td class="border border-gray-300 px-4 py-3"><em>AAP Breast‑feeding Handbook</em></td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Engorgement</strong></td>
                <td class="border border-gray-300 px-4 py-3">Warm compress <strong>before</strong> feed, gentle massage; cold pack <strong>after</strong>.</td>
                <td class="border border-gray-300 px-4 py-3"><em>Canadian Paediatric Society</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p class="text-emerald-800"><em>Pro tip for moms in <strong>Germany</strong> and <strong>France</strong>: pharmacies often stock chilled cabbage‑leaf pads—an old‑school but evidence‑supported engorgement soother.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Latch & Position Checklist (Works from Seattle to Stockholm)</h2>
        
        <div class="space-y-4">
          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">1. Tummy‑to‑Tummy</h3>
            <p class="text-gray-700">Baby's belly flush to yours.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">2. Nose Aligns to Nipple</h3>
            <p class="text-gray-700">Promotes wide gape ("asymmetric latch").</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">3. Football Hold</h3>
            <p class="text-gray-700">Great after C‑section; try with a pillow for height.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">4. Laid‑back Nursing</h3>
            <p class="text-gray-700">Recline at 45°; gravity helps deep latch.</p>
          </div>
        </div>

        <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mt-6">
          <p class="text-green-800"><strong>WHO Europe</strong> notes that good positioning solves 90 % of early nipple pain cases.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Growth Spurts & Cluster Feeds</h2>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p class="text-yellow-800">Expect night‑time "feeding frenzies" around <strong>3, 6, 12 weeks</strong> and <strong>4–6 months</strong>. Supply rises on demand—<strong>keep offering the breast</strong> and hydrate.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Hook 📲 — Tracking Without Counting Fingers</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">From <strong>New York 🇺🇸</strong> to <strong>Madrid 🇪🇸</strong>, DearBaby lets you:</p>

        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-emerald-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Tap an Apple Watch complication</strong> to log each feed.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Auto‑count wet diapers</strong> via quick‑input on phone.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Supply Guardian</strong> — if sessions drop or diapers dip below safe thresholds, the app flags you to contact your IBCLC.</span>
            </li>
          </ul>
        </div>

        <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
          <p class="text-green-800"><em>DearBaby supply alerts available in Premium; integrates with Apple Health & smart scales.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Take‑Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Breast‑feeding success hinges on <strong>deep latch, frequent nursing, and smart troubleshooting</strong>—tools that hold true whether you're nursing in <strong>Vancouver</strong> or <strong>Vienna</strong>. Pair hands‑on tips with DearBaby's data‑driven nudges, and both you and your newborn can feed with confidence.</p>
        </div>
      </div>
    `,
    category: "Feeding & Nutrition",
    readTime: "7 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Lactation Team",
    keywords: ["breastfeeding tips", "latch technique", "sore nipple fix", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "formula-feeding-safety-guide": {
    title: "Bottle & Formula Feeding Guide: Safety Rules from CDC, FDA and EU Standards",
    excerpt: "How to choose formula, sterilize bottles, prep night feeds, and discard leftovers—advice for parents in North America and Europe.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-l-4 border-red-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">From picking a formula to safe prep and night feeds—CDC & FDA rules inside</h2>
        <p class="text-gray-700 leading-relaxed">How to choose formula, sterilize bottles, prep night feeds, and discard leftovers—advice for parents in North America and Europe.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Formula Feeding Without Guesswork (US · CA · UK · EU)</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Choosing and preparing formula can feel like chemistry class at 3 a.m. This guide distills <strong>CDC, FDA, Health Canada, NHS & European Food Safety Authority (EFSA)</strong> rules into bite‑size steps—so a midnight bottle is safe wherever you live.</p>

        <h3 class="text-xl font-semibold text-gray-800 mb-4">1. Choosing a Formula</h3>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Category</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">When to Use</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">GEO Note</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Cow‑milk–based</strong></td>
                <td class="border border-gray-300 px-4 py-3">First line for most babies</td>
                <td class="border border-gray-300 px-4 py-3">Widely stocked in 🇺🇸🇨🇦🇬🇧🇪🇺</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Partially hydrolyzed</strong></td>
                <td class="border border-gray-300 px-4 py-3">Minor digestion issues</td>
                <td class="border border-gray-300 px-4 py-3">Confirm with pediatrician; sold as "Comfort" in EU</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Hypoallergenic (extensive)</strong></td>
                <td class="border border-gray-300 px-4 py-3">Cow‑milk protein allergy</td>
                <td class="border border-gray-300 px-4 py-3">Prescription‑only in many EU countries</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Soy</strong></td>
                <td class="border border-gray-300 px-4 py-3">Galactosemia or vegan preference</td>
                <td class="border border-gray-300 px-4 py-3">Health Canada & AAP OK after medical consult</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-6">
          <p class="text-red-800"><strong>Tip for Europe:</strong> Look for <strong>EU organic seal</strong> (leaf/star logo) if you want bio formulas.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">2. Safe Prep in Three Steps</h2>
        
        <div class="space-y-4">
          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">1. Sterilize bottles for newborns</h3>
            <ul class="text-gray-700 space-y-2">
              <li>• Boil 5 min or use steam sterilizer.</li>
              <li>• After 3 months, hot soapy water + air‑dry is OK (FDA, 2024).</li>
            </ul>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">2. Use hot water (≥ 70 °C / 158 °F)</h3>
            <p class="text-gray-700">To kill <em>Cronobacter</em> bacteria (CDC).</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">3. Discard unused formula 1 hour after baby drinks</h3>
            <p class="text-gray-700">(HealthyChildren.org).</p>
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg mt-3">
              <p class="text-yellow-800">Never "top up" an old bottle—bacteria multiply fast at room temp.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">3. Night‑Feed Hack (Works from Seattle to Stockholm)</h2>
        
        <div class="bg-pink-50 border border-pink-200 rounded-lg p-6">
          <ul class="space-y-2 text-pink-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Pre‑measure dry powder in a dispenser.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Keep a thermos of boiled‑then‑cooled 70 °C water bedside.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Mix, swirl 10 sec, check wrist temp, feed.</span>
            </li>
          </ul>
          <p class="text-pink-700 mt-3 italic">No stumbling to the kitchen; still meets CDC heat‑kill rule.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">4. When to Switch to Whole Milk</h2>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p class="text-blue-800">The <strong>CDC & NHS</strong> advise staying on infant formula until baby hits <strong>12 months</strong>. After the first birthday, transition to <strong>whole cow's milk</strong> (3.25 % fat) unless your pediatrician recommends otherwise.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Quick‑Fix Table</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Problem</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Fast Solution</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Gas / fussiness</td>
                <td class="border border-gray-300 px-4 py-3">Try partially hydrolyzed or anti‑colic bottle nipple</td>
                <td class="border border-gray-300 px-4 py-3">EFSA guidance</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Slow flow</td>
                <td class="border border-gray-300 px-4 py-3">Warm formula slightly; test different nipple size</td>
                <td class="border border-gray-300 px-4 py-3">NHS</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Frequent spit‑up</td>
                <td class="border border-gray-300 px-4 py-3">Hold baby upright 20 min post‑feed; consider reflux‑thickened formula under MD guidance</td>
                <td class="border border-gray-300 px-4 py-3">AAP</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">SolidStart Beta Sneak Peek 🥗</h2>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <p class="text-green-800">Our upcoming <strong>SolidStart</strong> add‑on scans your pantry via phone camera and recommends <strong>formula‑friendly transition purées</strong>—perfect for parents in <strong>New York</strong>, <strong>Toronto</strong>, <strong>London</strong> and <strong>Berlin</strong> easing babies onto solids at <strong>6 months</strong>.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby + Bottle Logs 📲</h2>
        
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-purple-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Tap Apple Watch</strong> to time feeds hands‑free.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Auto‑flag supply red zones</strong> (e.g., frequent 30 mL top‑ups) so you know when to discuss formula volume with your IBCLC or pediatrician.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Syncs with SolidStart to create a <strong>personalized weaning calendar</strong>.</span>
            </li>
          </ul>
        </div>

        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <p class="text-red-800"><em>DearBaby bottle‑log analytics are part of DearBaby Premium.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Key Take‑Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Sterilize bottles, mix with 70 °C water, toss leftovers after one hour, and stay on formula until the first birthday. Follow those rules from <strong>Los Angeles</strong> to <strong>Lisbon</strong>, and every bottle you serve will be as safe as it is soothing.</p>
        </div>
      </div>
    `,
    category: "Feeding & Nutrition",
    readTime: "9 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Nutrition Team",
    keywords: ["formula feeding safety", "bottle sterilizing", "infant formula guidelines", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "newborn-feeding-schedule": {
    title: "Newborn Feeding Schedule & Hunger Cues: How to Know Baby Gets Enough",
    excerpt: "Universal 8–12 feed rule, wet‑diaper benchmarks, and early hunger cues for parents in North America and Europe — with DearBaby tracking tips.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border-l-4 border-cyan-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">8–12 feeds, 6 wet diapers—simple signs your baby's getting enough</h2>
        <p class="text-gray-700 leading-relaxed">Universal 8–12 feed rule, wet‑diaper benchmarks, and early hunger cues for parents in North America and Europe — with DearBaby tracking tips.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">The 8‑to‑12 Rule (Works in US · CA · UK · EU)</h2>
        
        <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-6">
          <div class="space-y-3 text-cyan-800">
            <div class="flex items-start">
              <span class="mr-3 text-lg">🔹</span>
              <span><strong>Breast‑fed newborns</strong> need <strong>8–12 feeds every 24 h</strong>.</span>
            </div>
            <div class="flex items-start">
              <span class="mr-3 text-lg">🔹</span>
              <span><strong>Formula babies</strong> typically drink <strong>2–3 oz (60–90 mL) every 3 h</strong> (HealthyChildren.org).</span>
            </div>
          </div>
        </div>

        <p class="text-gray-700 leading-relaxed mb-4">That means if you're in <strong>Chicago 🇺🇸</strong>, <strong>Montreal 🇨🇦</strong>, <strong>Manchester 🇬🇧</strong> or <strong>Munich 🇩🇪</strong>, the math is the same—frequency, not clock time, matters most.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Wet‑Diaper Benchmarks (Universal)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Baby Age</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Wet Diapers / 24 h</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Why It Matters</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Day 1–4</td>
                <td class="border border-gray-300 px-4 py-3">1–4 (increasing)</td>
                <td class="border border-gray-300 px-4 py-3">Transitional milk coming in</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Day 5–7</td>
                <td class="border border-gray-300 px-4 py-3"><strong>≥ 6</strong> wet diapers</td>
                <td class="border border-gray-300 px-4 py-3">Marker of adequate intake</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">2 weeks+</td>
                <td class="border border-gray-300 px-4 py-3">6–8 steady</td>
                <td class="border border-gray-300 px-4 py-3">Ongoing hydration</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg mb-6">
          <p class="text-teal-800">HealthyChildren.org (AAP) states that diaper count + weight gain beat any "ounces tracker" for judging intake.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Early vs Late Hunger Cues</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Stage</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Signals You'll See</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Respond How?</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Early</strong></td>
                <td class="border border-gray-300 px-4 py-3">Rooting, head‑turn, sucking fists, soft whimpers</td>
                <td class="border border-gray-300 px-4 py-3">Offer breast/bottle promptly</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Active</strong></td>
                <td class="border border-gray-300 px-4 py-3">Squirming, louder whimpers</td>
                <td class="border border-gray-300 px-4 py-3">Calm voice, initiate feed</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Late</strong></td>
                <td class="border border-gray-300 px-4 py-3">Crying, color flush, rigid body</td>
                <td class="border border-gray-300 px-4 py-3">Soothe first, then latch/ bottle</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <p class="text-cyan-800">Catch cues early and feeds stay calm (WHO & NHS feeding guidance).</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Sample 24‑Hour Breast‑Feeding Pattern</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Time (example)</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Cue</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">6 a.m.</td>
                <td class="border border-gray-300 px-4 py-3">Rooting</td>
                <td class="border border-gray-300 px-4 py-3">Feed #1</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">8 a.m.</td>
                <td class="border border-gray-300 px-4 py-3">Hand‑to‑mouth</td>
                <td class="border border-gray-300 px-4 py-3">Feed #2</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">10 a.m.</td>
                <td class="border border-gray-300 px-4 py-3">Light whimper</td>
                <td class="border border-gray-300 px-4 py-3">Feed #3</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">12 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Stretch + lip smack</td>
                <td class="border border-gray-300 px-4 py-3">Feed #4</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">2 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Drowsy root</td>
                <td class="border border-gray-300 px-4 py-3">Feed #5</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">5 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Active rooting</td>
                <td class="border border-gray-300 px-4 py-3">Feed #6</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">7 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Fuss</td>
                <td class="border border-gray-300 px-4 py-3">Feed #7</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">10 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Dream feed</td>
                <td class="border border-gray-300 px-4 py-3">Feed #8</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">1 a.m.</td>
                <td class="border border-gray-300 px-4 py-3">Soft whimper</td>
                <td class="border border-gray-300 px-4 py-3">Feed #9</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">4 a.m.</td>
                <td class="border border-gray-300 px-4 py-3">Rooting</td>
                <td class="border border-gray-300 px-4 py-3">Feed #10</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <p class="text-teal-800"><em>Formula pattern: similar clock points, 60–90 mL each.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Hook 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">DearBaby logs feeds via <strong>single tap on Apple Watch</strong> and <strong>auto‑counts wet diapers</strong>. If counts dip below <strong>6/day</strong>, the app flags "possible low intake" and prompts a pediatrician check—giving peace of mind to new parents from <strong>Los Angeles</strong> to <strong>Lisbon</strong>.</p>

        <div class="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded-r-lg">
          <p class="text-cyan-800"><em>Needs watchOS 11 or manual diaper input on phone; analytics in DearBaby Premium.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Key Take‑Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">8–12 feeds + 6 wet diapers = a well‑fed newborn wherever you live. Read early cues, ignore the clock, and let DearBaby confirm the numbers so you can focus on cuddles—not spreadsheets.</p>
        </div>
      </div>
    `,
    category: "Newborn Care",
    readTime: "6 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Team",
    keywords: ["newborn feeding schedule", "hunger cues", "wet diaper count", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "starting-solids-6-months": {
    title: "Starting Solids at 6 Months: Signs of Readiness & First‑Food Roadmap",
    excerpt: "CDC‑ and AAP‑backed guidance for parents in North America & Europe on when and how to introduce solids, iron‑rich foods, and common allergens.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-l-4 border-amber-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Signs of readiness and first‑food roadmap backed by CDC/AAP</h2>
        <p class="text-gray-700 leading-relaxed">CDC‑ and AAP‑backed guidance for parents in North America & Europe on when and how to introduce solids, iron‑rich foods, and common allergens.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">"Is My Baby Ready for a Spoon?"</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Health agencies from <strong>Washington D.C.</strong> to <strong>Warsaw</strong> agree: most babies show readiness for solid food <strong>around six months</strong> (HealthyChildren.org). Look for:</p>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <ul class="space-y-3 text-amber-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Sitting with minimal support</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Good head/neck control</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Loss of tongue‑thrust reflex</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Curiosity—baby leans toward your fork</span>
            </li>
          </ul>
        </div>

        <div class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
          <p class="text-orange-800">If all boxes are ticked, it's mealtime science!</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Iron & Zinc First</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Breast‑milk iron stores dip by six months. <strong>AAP & CDC</strong> recommend starting with iron‑rich foods:</p>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Food</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Prep Idea (6 mo texture)</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">GEO Note</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Fortified oat cereal</strong></td>
                <td class="border border-gray-300 px-4 py-3">Mix with breast‑milk/formula to a runny purée</td>
                <td class="border border-gray-300 px-4 py-3">Read EU labels for "iron‑enriched"</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Purée beef or dark turkey</strong></td>
                <td class="border border-gray-300 px-4 py-3">Steam → blend with broth</td>
                <td class="border border-gray-300 px-4 py-3">Common in 🇺🇸🇨🇦; German parents often use veal</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Lentil purée</strong></td>
                <td class="border border-gray-300 px-4 py-3">Cook soft, blend smooth</td>
                <td class="border border-gray-300 px-4 py-3">Mediterranean favorite (🇫🇷 🇮🇹 🇪🇸)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Allergen Introduction—Earlier Is Safer</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Research shows early intro <strong>lowers allergy risk</strong> (LEAP & EAT studies).</p>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Allergen</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">How to Introduce</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Safety Tip</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Peanut</strong></td>
                <td class="border border-gray-300 px-4 py-3">Thin 2 g peanut butter with warm water, spoon‑feed small amount.</td>
                <td class="border border-gray-300 px-4 py-3">Low‑risk infants can start at 6 mo (HealthyChildren.org).</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Egg</strong></td>
                <td class="border border-gray-300 px-4 py-3">Offer well‑cooked mashed yolk/white.</td>
                <td class="border border-gray-300 px-4 py-3">Start with <½ tsp, wait 2 days.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Wheat</strong></td>
                <td class="border border-gray-300 px-4 py-3">Soft wheat cereal or bread heel soaked in breast‑milk.</td>
                <td class="border border-gray-300 px-4 py-3">Monitor for rash or swelling.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-6">
          <p class="text-red-800"><strong>No honey before 12 months</strong> anywhere in the world—the risk of infant botulism (CDC).</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Sample 6‑Month Feeding Day (US · EU)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Time</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Milk</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Solid</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">7 a.m.</td>
                <td class="border border-gray-300 px-4 py-3">Breast/Formula</td>
                <td class="border border-gray-300 px-4 py-3">—</td>
                <td class="border border-gray-300 px-4 py-3">Milk first</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">10 a.m.</td>
                <td class="border border-gray-300 px-4 py-3">—</td>
                <td class="border border-gray-300 px-4 py-3">2 tsp oat cereal + breast‑milk</td>
                <td class="border border-gray-300 px-4 py-3">Start iron dish when baby is most alert</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">1 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Milk</td>
                <td class="border border-gray-300 px-4 py-3">—</td>
                <td class="border border-gray-300 px-4 py-3"></td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">4 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">—</td>
                <td class="border border-gray-300 px-4 py-3">1 tsp puréed sweet potato</td>
                <td class="border border-gray-300 px-4 py-3">Vitamin A boost</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">7 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Milk</td>
                <td class="border border-gray-300 px-4 py-3">—</td>
                <td class="border border-gray-300 px-4 py-3">Bedtime feed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Common Questions from Parents in 🇺🇸 🇨🇦 🇬🇧 🇩🇪</h2>
        
        <div class="space-y-6">
          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Q: Can I go baby‑led weaning instead?</h3>
            <div class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
              <p class="text-gray-700">Yes—just ensure foods are soft, finger‑size, and avoid choking hazards.</p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Q: Should I drop a milk feed?</h3>
            <div class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
              <p class="text-gray-700">At 6–7 months, solids <em>complement</em> milk. Aim for milk first, solids after, until ~9 months.</p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Q: How do I track iron intake?</h3>
            <div class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
              <p class="text-gray-700">DearBaby's SolidStart beta auto‑calculates iron mg per serving.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">SolidStart Sneak Peek 🥗</h2>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <p class="text-green-800">SolidStart scans your pantry (via phone camera) and suggests <strong>iron‑rich, allergen‑aware purées</strong>—color‑coded for beginners. Coming soon to <strong>US, Canada, UK, Germany, France, Sweden, Italy, Spain</strong>.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Hook 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">DearBaby:</p>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-amber-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Logs every spoonful by quick‑tap.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Flags <em>"missed iron day"</em> if three consecutive meals lack iron sources.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Sends <strong>"Peanut Day #2 reminder"</strong> so you don't miss the early‑introduction window.</span>
            </li>
          </ul>
        </div>

        <div class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
          <p class="text-orange-800"><em>SolidStart module available in DearBaby Premium.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bottom Line</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Wait for six‑month readiness signs, lead with iron, introduce allergens early (but safely), and skip honey till one year. Whether you're serving purée in <strong>Boston</strong> or baby‑led toast in <strong>Barcelona</strong>, DearBaby + SolidStart make nutritious first bites a data‑driven breeze.</p>
        </div>
      </div>
    `,
    category: "Solid Foods",
    readTime: "8 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Nutrition Team",
    keywords: ["starting solids", "6‑month solids", "iron rich first foods", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "baby-led-weaning-vs-purees": {
    title: "Baby‑Led Weaning vs Purées: Pros, Cons & Safety Checks",
    excerpt: "Evidence overview for parents in North America & Europe comparing BLW and traditional spoon‑fed purées, with safety tips and DearBaby/SolidStart tools.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-l-4 border-indigo-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Pros, cons and safety checks—evidence overview</h2>
        <p class="text-gray-700 leading-relaxed">Evidence overview for parents in North America & Europe comparing BLW and traditional spoon‑fed purées, with safety tips and DearBaby/SolidStart tools.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Spoon or Finger Food—Which Path Fits Your Family?</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Parents in <strong>San Francisco 🇺🇸</strong>, <strong>Toronto 🇨🇦</strong>, <strong>London 🇬🇧</strong> and <strong>Berlin 🇩🇪</strong> often ask whether <em>baby‑led weaning</em> (BLW) or traditional purées is "better." Current data from <strong>PubMed Central (2024 meta‑analysis)</strong> show no clear developmental or weight‑gain superiority. The <strong>American Academy of Pediatrics (AAP)</strong> states either path is acceptable <strong>as long as <em>responsive feeding</em> cues</strong> guide the meal.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Quick Comparison Table</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Approach</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Pros</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Cons / Caveats</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Baby‑Led Weaning (BLW)</strong></td>
                <td class="border border-gray-300 px-4 py-3">
                  • Encourages self‑regulation<br>
                  • Builds fine‑motor and chewing skills
                </td>
                <td class="border border-gray-300 px-4 py-3">
                  • Messier meals<br>
                  • Close choking vigilance required
                </td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Purées / Spoon‑feeding</strong></td>
                <td class="border border-gray-300 px-4 py-3">
                  • Easier to gauge intake<br>
                  • Simple to add iron‑fortified cereals
                </td>
                <td class="border border-gray-300 px-4 py-3">
                  • Potential to over‑feed if ignoring satiety cues
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p class="text-indigo-800"><em>Families across Europe often blend both—soft finger foods at lunch, iron‑rich purée at dinner.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Safety Checks for Every Region</h2>
        
        <div class="space-y-4">
          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">1. Size & Texture</h3>
            <ul class="text-gray-700 space-y-2">
              <li>• BLW foods: stick or finger‑length, mashable between thumb & forefinger.</li>
              <li>• Purées: smooth for 6 mo; add texture after 8 mo to build oral skills.</li>
            </ul>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">2. High‑chair posture</h3>
            <p class="text-gray-700">Baby should sit <strong>upright at 90°</strong>—whether in <strong>New York</strong> or <strong>Nice</strong>.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">3. Allergen intro</h3>
            <p class="text-gray-700">Offer allergens early (see our <a href="/blog/starting-solids-6-months" class="text-indigo-600 hover:text-indigo-700 underline">Starting Solids guide</a>), whether as thin peanut butter on a spoon or crushed peanut in yogurt.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">4. Iron matters</h3>
            <ul class="text-gray-700 space-y-2">
              <li>• Purée path: fortified cereal + meat mix.</li>
              <li>• BLW path: soft strips of well‑cooked beef or iron‑rich lentil fritters.</li>
            </ul>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">5. No honey < 12 mo</h3>
            <p class="text-gray-700">(CDC & EFSA).</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Evidence Snapshot</h2>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <ul class="space-y-3 text-blue-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>2018–2024 RCTs (PMC)</strong>: BLW infants self‑regulate calories; growth curves match spoon‑fed peers.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Iron intake</strong>: Slightly lower in strict BLW groups—<em>but disappears</em> when parents add one iron‑dense food daily.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Choking incidence</strong>: Comparable if parents follow texture safety rules (AAP Publications, 2023).</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Choosing What Works in US · CA · UK · EU</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Family Lifestyle</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Suggested Blend</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>On‑the‑go</strong></td>
                <td class="border border-gray-300 px-4 py-3">Purée pouches + easy BLW snacks (banana strips)</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Minimal mess tolerance</strong></td>
                <td class="border border-gray-300 px-4 py-3">Start with purées, add BLW breakfasts on weekends</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Baby shows spoon refusal</strong></td>
                <td class="border border-gray-300 px-4 py-3">Shift to BLW with nutrient‑rich finger meals</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">SolidStart & DearBaby Hooks 📲</h2>
        
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-indigo-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>SolidStart</strong> lets you <strong>toggle between "Finger Food" and "Purée" filters</strong>—delivering EU‑friendly recipes in <strong>Paris</strong> as easily as USDA‑compliant options in <strong>Portland</strong>.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>DearBaby</strong> tracks iron intake regardless of delivery form and pings you if daily iron dips below <strong>11 mg (6–12 mo RDA)</strong>.</span>
            </li>
          </ul>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p class="text-blue-800"><em>Both features debut in DearBaby Premium Q4 2025.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bottom Line</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">No single feeding style wins globally; <strong>responsive feeding + safety checks</strong> matter more than BLW vs Purée labels. Mix, match and relax—whether you hand baby a soft avocado slice in <strong>Stockholm</strong> or a fortified spoonful in <strong>Seville</strong>, DearBaby and SolidStart keep nutrition (and mess) on track.</p>
        </div>
      </div>
    `,
    category: "Solid Foods",
    readTime: "7 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Nutrition Team",
    keywords: ["baby‑led weaning", "purée feeding", "responsive feeding", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "homemade-baby-food-recipes": {
    title: "Homemade Baby Food Recipes & Meal Ideas (6–12 Months)",
    excerpt: "Nutritionist‑approved purées, combo mashes and finger foods for parents in North America & Europe. Includes SolidStart video carousel feature.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-l-4 border-pink-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Easy purées, combo mashes, and finger foods—nutritionist‑approved</h2>
        <p class="text-gray-700 leading-relaxed">Nutritionist‑approved purées, combo mashes and finger foods for parents in North America & Europe. Includes SolidStart video carousel feature.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Why Cook at Home?</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Homemade meals let parents in <strong>Boston 🇺🇸, Toronto 🇨🇦, London 🇬🇧, Berlin 🇩🇪</strong> (and everywhere between) skip additives and control texture. Just remember two global safety rules:</p>

        <div class="space-y-4">
          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">1. No added salt or sugar</h3>
            <p class="text-gray-700">Infants have no room for extra sodium or free sugar (HealthyChildren.org).</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">2. No honey before 12 months</h3>
            <p class="text-gray-700">Prevents infant botulism (CDC).</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Recipe Sampler by Age</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Age</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Recipe</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">How‑To (Quick)</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Nutrient Focus</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3" rowspan="3"><strong>6 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Avocado Mash</strong></td>
                <td class="border border-gray-300 px-4 py-3">Mash ¼ ripe avocado with breast‑milk to thin.</td>
                <td class="border border-gray-300 px-4 py-3">Healthy fats & folate</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Iron Cereal Mix</strong></td>
                <td class="border border-gray-300 px-4 py-3">2 tbsp iron‑fortified oat + 60 mL breast‑milk.</td>
                <td class="border border-gray-300 px-4 py-3">Iron & zinc</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Carrot Purée</strong></td>
                <td class="border border-gray-300 px-4 py-3">Steam 1 carrot, blend smooth with water.</td>
                <td class="border border-gray-300 px-4 py-3">Beta‑carotene</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3" rowspan="2"><strong>9 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Lentil‑Carrot Soup</strong></td>
                <td class="border border-gray-300 px-4 py-3">Simmer red lentils + diced carrot, blend chunky.</td>
                <td class="border border-gray-300 px-4 py-3">Plant iron & fiber</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Banana‑Avocado Mash</strong></td>
                <td class="border border-gray-300 px-4 py-3">½ banana + ¼ avocado, fork‑mash.</td>
                <td class="border border-gray-300 px-4 py-3">Potassium + healthy fat</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3" rowspan="2"><strong>12 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Mini Spinach Pancakes</strong></td>
                <td class="border border-gray-300 px-4 py-3">Blend 1 egg, handful spinach, 2 tbsp oat flour; pan‑fry silver‑dollar size.</td>
                <td class="border border-gray-300 px-4 py-3">Iron & vitamin K</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Soft‑Steamed Broccoli Florets</strong></td>
                <td class="border border-gray-300 px-4 py-3">Steam until very soft; serve finger‑size.</td>
                <td class="border border-gray-300 px-4 py-3">Vitamin C & fiber</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-r-lg mb-6">
          <p class="text-pink-800"><em>EU parents</em>: choose nitrate‑safe spinach (harvested young) to meet EFSA guidelines.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Texture Progression (US · EU Guideline)</h2>
        
        <div class="bg-rose-50 border border-rose-200 rounded-lg p-6">
          <ul class="space-y-3 text-rose-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>6 mo</strong>: Smooth purées</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>8 mo</strong>: Thicker mashes with soft lumps</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>10 mo</strong>: Finger foods that squash between fingers</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>12 mo</strong>: Family foods, chopped small</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Kitchen Safety Cheatsheet</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Task</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Best Practice</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Produce wash</td>
                <td class="border border-gray-300 px-4 py-3">Rinse under running water; peel if waxed.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Batch storage</td>
                <td class="border border-gray-300 px-4 py-3">Refrigerate ≤ 48 h; freeze up to 3 months in 30 mL cubes.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Re‑heat rule</td>
                <td class="border border-gray-300 px-4 py-3">Reheat once, discard leftovers—no refreezing.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">SolidStart Video Carousel 🥗</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Our upcoming <strong>SolidStart</strong> module delivers <strong>15‑second TikTok‑style clips</strong>:</p>

        <div class="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-pink-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Step‑by‑step purée demos</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Finger‑food safety checks (size & squish test)</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Allergen‑intro reminders (peanut, egg, sesame)</span>
            </li>
          </ul>
        </div>

        <div class="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <p class="text-rose-800">Parents in <strong>New York</strong>, <strong>Paris</strong>, <strong>Stockholm</strong> will see localized ingredient swaps and metric / imperial conversions.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Hook 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">DearBaby syncs with SolidStart to:</p>

        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-indigo-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Log which recipe baby tasted (one tap).</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Auto‑flag allergen exposure gaps (e.g., "Offer egg again within 7 days").</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Track iron intake and fiber variety.</span>
            </li>
          </ul>
        </div>

        <div class="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-r-lg">
          <p class="text-pink-800"><em>Features available in DearBaby Premium, SolidStart add‑on Q4 2025.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bottom Line</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Skip salt, skip honey, and serve age‑appropriate textures. From <strong>Seattle</strong> to <strong>Seville</strong>, these simple recipes make homemade baby food easy—and DearBaby + SolidStart keep nutrition data at your fingertips.</p>
        </div>
      </div>
    `,
    category: "Solid Foods",
    readTime: "9 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Nutrition Team",
    keywords: ["homemade baby food", "baby purée recipe", "infant finger food", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "toddler-picky-eating-tips": {
    title: "Dealing with a Picky Eater: 10 Evidence‑Based Strategies",
    excerpt: "CHOP‑backed tips for parents in North America & Europe on normal toddler pickiness, repeated exposures, and SolidStart gamification.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-lime-50 to-green-50 rounded-xl border-l-4 border-lime-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Why it's normal at 2 yo and 10 evidence‑based strategies from CHOP experts</h2>
        <p class="text-gray-700 leading-relaxed">CHOP‑backed tips for parents in North America & Europe on normal toddler pickiness, repeated exposures, and SolidStart gamification.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">"My Toddler Eats Only Beige!"</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Take heart: <strong>25–35 % of toddlers</strong> worldwide are labeled picky (Wikipedia, 2025 review). At age 2, food neophobia peaks—an evolutionary safety feature. The <strong>Children's Hospital of Philadelphia (CHOP)</strong> notes it can take <strong>8–15 exposures</strong> before a new food is accepted.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Do's & Don'ts (Quick Table)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">✔️ Do</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">❌ Don't</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Serve family meals & let toddlers see you eat veggies.</td>
                <td class="border border-gray-300 px-4 py-3">Bribe with dessert ("three bites for ice cream").</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Offer a small <em>accepted</em> food + one <em>learning</em> food each meal.</td>
                <td class="border border-gray-300 px-4 py-3">Force‑feed or chase with the spoon.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Keep portions toddler‑size (1 tbsp per year of age).</td>
                <td class="border border-gray-300 px-4 py-3">Load the plate—visual overwhelm backfires.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Involve child in prep (wash spinach, stir batter).</td>
                <td class="border border-gray-300 px-4 py-3">Label them "picky" in front of others.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">10 Evidence‑Based Strategies (US · EU Friendly)</h2>
        
        <div class="space-y-4">
          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">1. Repeated exposure</h3>
            <p class="text-gray-700">Offer the same veggie at least <strong>10 times</strong> over weeks.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">2. Micro portions</h3>
            <p class="text-gray-700">A single pea qualifies; success builds confidence.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">3. Modeling</h3>
            <p class="text-gray-700">Adults eat the food enthusiastically first.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">4. Positive language</h3>
            <p class="text-gray-700">"These carrots crunch!" vs "Eat your veggies."</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">5. No pressure zone</h3>
            <p class="text-gray-700">Toddler may touch, lick, or ignore—the plate is neutral ground.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">6. Serve dips</h3>
            <p class="text-gray-700">Hummus or yogurt increases acceptance (ESPGHAN 2023).</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">7. Sensory play</h3>
            <p class="text-gray-700">Let them paint puree on a high‑chair tray pre‑meal.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">8. Routine timing</h3>
            <p class="text-gray-700">2–3 h gap between snacks keeps appetite primed.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">9. Offer variety early</h3>
            <p class="text-gray-700">From <strong>6–12 mo</strong> diversify flavors; it pays dividends at 2 years.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">10. Respect appetite</h3>
            <p class="text-gray-700">Growth slows after year 1; intake naturally dips.</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Why Repetition Works</h2>
        
        <div class="bg-lime-50 border border-lime-200 rounded-lg p-6">
          <p class="text-lime-800">CHOP dietitians liken exposures to "friend requests for taste buds." After <strong>15 invitations</strong> the brain files that flavor under "safe," especially for bitter greens like broccoli. European data (Germany & Sweden, 2024) echo the U.S. findings.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Sample "Tiny Taste" Week (London/Germany Example)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Day</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Learning Food</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Mon</td>
                <td class="border border-gray-300 px-4 py-3">1 roasted carrot coin</td>
                <td class="border border-gray-300 px-4 py-3">Leave even if untouched</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Tue</td>
                <td class="border border-gray-300 px-4 py-3">2 pea halves</td>
                <td class="border border-gray-300 px-4 py-3">Praise <em>trying</em>, not eating</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Wed</td>
                <td class="border border-gray-300 px-4 py-3">¼ kiwi slice</td>
                <td class="border border-gray-300 px-4 py-3">Acidic fruit for flavor range</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Thu</td>
                <td class="border border-gray-300 px-4 py-3">Same roasted carrot coin</td>
                <td class="border border-gray-300 px-4 py-3">Familiar exposure</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Fri</td>
                <td class="border border-gray-300 px-4 py-3">½ chickpea flattened</td>
                <td class="border border-gray-300 px-4 py-3">Iron + texture</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">SolidStart Gamification 🥗</h2>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <p class="text-green-800">SolidStart lets parents log each "tiny taste." Toddlers earn 🎉 emoji badges after 5, 10, 15 exposures—turning repetition into a game whether you live in <strong>Seattle</strong> or <strong>Seville</strong>.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Integration 📲</h2>
        
        <div class="bg-lime-50 border border-lime-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-lime-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Intake Tracker</strong> – logs accepted vs offered foods.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Veggie Gap Alerts</strong> – if no green veggie in 3 days, DearBaby nudges you with recipes.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Growth Dashboard</strong> – correlates picky phases with percentile jumps or dips.</span>
            </li>
          </ul>
        </div>

        <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
          <p class="text-green-800"><em>Features available in DearBaby Premium, SolidStart add‑on.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Key Take‑Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Picky eating at two is developmentally normal—from <strong>Boston</strong> to <strong>Berlin</strong>. Serve balanced family meals, keep portions toddler‑small, repeat calmly, and let DearBaby + SolidStart turn exposures into playful wins.</p>
        </div>
      </div>
    `,
    category: "Toddler Nutrition",
    readTime: "8 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Nutrition Team",
    keywords: ["picky eater", "toddler nutrition tips", "food exposure strategy", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "first-year-baby-milestones": {
    title: "Baby's First‑Year Milestones Timeline (CDC 'Learn the Signs')",
    excerpt: "Month‑by‑month milestone checklist for parents in North America & Europe—based on the CDC's updated 'Learn the Signs' framework, plus DearBaby smart alerts.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border-l-4 border-violet-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Month‑by‑month checklist using the CDC 'Learn the Signs' framework</h2>
        <p class="text-gray-700 leading-relaxed">Month‑by‑month milestone checklist for parents in North America & Europe—based on the CDC's updated 'Learn the Signs' framework, plus DearBaby smart alerts.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Why Track Milestones?</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">From <strong>New York 🇺🇸</strong> to <strong>Milan 🇮🇹</strong>, milestone tracking helps parents celebrate progress and flag delays early. The <strong>CDC's 2024 'Learn the Signs'</strong> update shifted some targets (e.g., rolling now at 4 months) to reflect real‑world averages.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Month‑by‑Month Checklist (US · EU Friendly)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Age</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Social / Emotional</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Motor</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Language</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">GEO Note</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>2 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3">Smiles at people</td>
                <td class="border border-gray-300 px-4 py-3">Lifts head briefly</td>
                <td class="border border-gray-300 px-4 py-3">Coos, gurgles</td>
                <td class="border border-gray-300 px-4 py-3">CDC</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>4 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3">Copies facial expressions</td>
                <td class="border border-gray-300 px-4 py-3"><strong>Rolls front → back</strong></td>
                <td class="border border-gray-300 px-4 py-3">Laughs</td>
                <td class="border border-gray-300 px-4 py-3">Updated 2024</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>6 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3">Knows familiar faces</td>
                <td class="border border-gray-300 px-4 py-3"><strong>Sits with support</strong></td>
                <td class="border border-gray-300 px-4 py-3">Blows raspberries</td>
                <td class="border border-gray-300 px-4 py-3">AAP</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>9 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3">Stranger danger begins</td>
                <td class="border border-gray-300 px-4 py-3">Crawls / pulls to stand</td>
                <td class="border border-gray-300 px-4 py-3">Responds to name</td>
                <td class="border border-gray-300 px-4 py-3">NHS</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>12 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3">Waves "bye‑bye"</td>
                <td class="border border-gray-300 px-4 py-3"><strong>Stands alone</strong>; maybe first step</td>
                <td class="border border-gray-300 px-4 py-3">Says "mama," "dada"</td>
                <td class="border border-gray-300 px-4 py-3">WHO Europe</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-violet-50 border-l-4 border-violet-400 p-4 rounded-r-lg mb-6">
          <p class="text-violet-800">Encourage <strong>tummy time</strong> daily and read aloud—they boost motor & language pathways globally.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">When to Flag a Delay</h2>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <ul class="space-y-3 text-red-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>No social smile by <strong>3 months</strong></span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Cannot roll by <strong>6 months</strong></span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>No single word by <strong>15 months</strong></span>
            </li>
          </ul>
          <p class="text-red-700 mt-3">If concerned, contact your pediatrician or health visitor (UK) promptly.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Smart Tracking 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Parents in <strong>Chicago, Toronto, London, Berlin, Paris, Stockholm</strong> can:</p>

        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-purple-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Auto‑plot milestones</strong>—DearBaby compares your baby's data to CDC ranges.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Gentle notifications</strong> when a milestone is <strong>≥ 2 weeks overdue</strong>.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Skill‑boost tips</strong> (e.g., tummy‑time play prompts) tailored to age + region.</span>
            </li>
          </ul>
        </div>

        <div class="bg-violet-50 border-l-4 border-violet-400 p-4 rounded-r-lg">
          <p class="text-violet-800"><em>Milestone analytics available in DearBaby Premium; powered by GPT‑4o.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Quick Activities by Stage</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Milestone</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Simple Activity</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Why It Helps</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Rolling</td>
                <td class="border border-gray-300 px-4 py-3">Place toy at side to prompt pivot</td>
                <td class="border border-gray-300 px-4 py-3">Strengthens trunk muscles</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Sitting</td>
                <td class="border border-gray-300 px-4 py-3">Prop with firm pillow & sing songs</td>
                <td class="border border-gray-300 px-4 py-3">Builds core stability</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Crawling</td>
                <td class="border border-gray-300 px-4 py-3">Tunnel play (blanket draped over chairs)</td>
                <td class="border border-gray-300 px-4 py-3">Encourages shoulder/hip coordination</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">First Words</td>
                <td class="border border-gray-300 px-4 py-3">Name objects repeatedly</td>
                <td class="border border-gray-300 px-4 py-3">Boosts receptive language</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bottom Line</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Use the CDC timeline as a <strong>range</strong>, not a race. From <strong>Seattle</strong> to <strong>Seville</strong>, celebrating every smile, roll and wobble step is what truly fuels development—and DearBaby keeps the journey data‑driven and stress‑light.</p>
        </div>
      </div>
    `,
    category: "Child Development",
    readTime: "7 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Pediatric Team",
    keywords: ["baby milestones", "first year development", "CDC milestone checklist", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "tummy-time-guide": {
    title: "Tummy Time: Why & How to Start From Day One",
    excerpt: "HealthyChildren‑backed routine for parents in North America & Europe—build core muscles, prevent flat spots, and track sessions with DearBaby.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Muscle‑building play that prevents flat spots—starter routine in under 5 min</h2>
        <p class="text-gray-700 leading-relaxed">HealthyChildren‑backed routine for parents in North America & Europe—build core muscles, prevent flat spots, and track sessions with DearBaby.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Why Tummy Time Matters (US · EU Evidence)</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Babies sleep <strong>Back‑to‑Sleep</strong>, but they need daily <strong>Front‑to‑Play</strong>. HealthyChildren.org (AAP) and pediatric bodies from <strong>Canada, the U.K., Germany, France, Sweden, Italy, Spain</strong> all agree that prone play:</p>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <ul class="space-y-2 text-blue-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Strengthens neck, shoulder and core muscles</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Prevents positional plagiocephaly ("flat head")</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Lays the groundwork for rolling, crawling and sitting</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Starter Routine — Under 5 Minutes</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Age</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Daily Goal</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">How to Break It Up</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Newborn (Day 1)</td>
                <td class="border border-gray-300 px-4 py-3">2–3 sessions × 3–5 min</td>
                <td class="border border-gray-300 px-4 py-3">Chest‑to‑chest on parent</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">3 weeks</td>
                <td class="border border-gray-300 px-4 py-3">10 min total</td>
                <td class="border border-gray-300 px-4 py-3">Add mirror play on floor mat</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">7 weeks</td>
                <td class="border border-gray-300 px-4 py-3">15–30 min total</td>
                <td class="border border-gray-300 px-4 py-3">Split into 5 × 5 min after naps</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">3 months+</td>
                <td class="border border-gray-300 px-4 py-3">≥ 30 min total</td>
                <td class="border border-gray-300 px-4 py-3">Longer stretches with toy reach‑outs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg mb-6">
          <p class="text-indigo-800">HealthyChildren.org: <em>"By 7 weeks most infants tolerate 30 minutes daily if sessions start early."</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Fun Position Ideas (From Seattle to Seville)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Activity</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Setup</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Skills Targeted</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Chest‑to‑Chest</strong></td>
                <td class="border border-gray-300 px-4 py-3">Parent reclines 45°, baby prone on chest</td>
                <td class="border border-gray-300 px-4 py-3">Eye contact, head lift</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Mirror Time</strong></td>
                <td class="border border-gray-300 px-4 py-3">Place non‑breakable mirror at baby eye level</td>
                <td class="border border-gray-300 px-4 py-3">Visual tracking</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>High‑Contrast Cards</strong></td>
                <td class="border border-gray-300 px-4 py-3">Black‑and‑white images 20 cm away</td>
                <td class="border border-gray-300 px-4 py-3">Focus & neck rotation</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Music Mats</strong></td>
                <td class="border border-gray-300 px-4 py-3">Press‑activated melodies when arms move</td>
                <td class="border border-gray-300 px-4 py-3">Cause‑effect learning</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Safety Checklist</h2>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <ol class="space-y-3 text-red-800">
            <li class="flex items-start">
              <span class="mr-2">1.</span>
              <span>Always supervise—<strong>never</strong> leave baby prone unattended.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">2.</span>
              <span>Use firm surface (playmat, not sofa).</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">3.</span>
              <span>Stop if baby's face plants or shows distress; try again later.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">4.</span>
              <span>Avoid tummy time right after feeds to reduce spit‑up.</span>
            </li>
          </ol>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Hook 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">DearBaby reads wake windows and sends a gentle <strong>"Tummy‑Time Now?"</strong> vibration to your Apple Watch when your baby is alert—not overtired—in <strong>New York, Toronto, London, Berlin, Paris or Stockholm</strong>.</p>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-blue-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Logs each minute automatically</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Charts progress against CDC motor timelines</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Suggests new activities as endurance grows</span>
            </li>
          </ul>
        </div>

        <div class="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
          <p class="text-indigo-800"><em>Feature available in DearBaby Premium; watchOS 11 required for vibrations.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Common Questions (US · EU Parents)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Question</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Answer</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">"My baby hates it—what now?"</td>
                <td class="border border-gray-300 px-4 py-3">Start with 30 sec bursts on your chest; build slowly.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">"Is rolling earlier a sign of enough tummy time?"</td>
                <td class="border border-gray-300 px-4 py-3">Often yes—strong core accelerates rolling milestones.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">"Do I still need tummy time if baby sleeps on my chest?"</td>
                <td class="border border-gray-300 px-4 py-3">Yes—floor sessions build different muscle angles.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Key Take‑Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Begin tummy time <strong>day one</strong>, keep sessions short but frequent, and make it playful. From <strong>Boston</strong> to <strong>Barcelona</strong>, those tiny push‑ups fuel big‑time motor milestones—while DearBaby automates tracking so you can cheer, not count.</p>
        </div>
      </div>
    `,
    category: "Motor Development",
    readTime: "6 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Pediatric Team",
    keywords: ["tummy time guide", "flat head prevention", "motor development", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "baby-development-activities": {
    title: "Play‑Based Activities to Boost Baby Development (0‑12 Months)",
    excerpt: "Free, evidence‑based games—talking, singing, peek‑a‑boo, sensory bins—for parents in North America & Europe, plus DearBaby daily tip integration.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-l-4 border-emerald-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Zero‑cost games that build brains—backed by AAP & Zero to Three</h2>
        <p class="text-gray-700 leading-relaxed">Free, evidence‑based games—talking, singing, peek‑a‑boo, sensory bins—for parents in North America & Europe, plus DearBaby daily tip integration.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Why Play Matters Everywhere—from Boston to Barcelona</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">The <strong>American Academy of Pediatrics (AAP)</strong> and <strong>Zero to Three</strong> agree: playful interactions wire the brain faster than flashcards ever could. Better still, most high‑impact games cost <strong>$0</strong>.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Month‑by‑Month Play Guide (US · EU Friendly)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Age</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Free Activity</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Development Boost</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>0–3 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Talk & Sing</strong>—describe diaper changes, sing lullabies</td>
                <td class="border border-gray-300 px-4 py-3">Language pathways fire when babies hear varied intonation</td>
                <td class="border border-gray-300 px-4 py-3">CDC</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>4–6 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Peek‑a‑Boo</strong></td>
                <td class="border border-gray-300 px-4 py-3">Teaches object permanence, sparks social smiles</td>
                <td class="border border-gray-300 px-4 py-3">Zero to Three</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>5–7 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Mirror Play</strong></td>
                <td class="border border-gray-300 px-4 py-3">Self‑recognition & facial tracking</td>
                <td class="border border-gray-300 px-4 py-3">AAP</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>8–10 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Sensory Bin</strong>—dry oats, silicone spatula (supervised)</td>
                <td class="border border-gray-300 px-4 py-3">Fine‑motor + texture exploration</td>
                <td class="border border-gray-300 px-4 py-3">WHO Europe</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>10–12 mo</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Container Play</strong>—fill & dump plastic cups</td>
                <td class="border border-gray-300 px-4 py-3">Early math (volume) & problem‑solving</td>
                <td class="border border-gray-300 px-4 py-3">NHS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">How to Start a Sensory Bin in Seattle or Seville</h2>
        
        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <ol class="space-y-3 text-emerald-800">
            <li class="flex items-start">
              <span class="mr-2">1.</span>
              <span>Shallow tray, 1 inch layer of food‑grade oats or cooked, cooled rice.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">2.</span>
              <span>Add safe tools: silicone spoon, wooden scoop.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">3.</span>
              <span>Supervise hands‑and‑knees exploration for <strong>10 min</strong>.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">4.</span>
              <span>Sweep floor together—turn clean‑up into more play!</span>
            </li>
          </ol>
        </div>

        <div class="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg mt-4">
          <p class="text-teal-800">Skip small beads (choking) and keep sessions short to avoid overstimulation.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Common Questions Across 🇺🇸 🇨🇦 🇬🇧 🇩🇪</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Q</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Short Answer</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">"Will TV shows teach language?"</td>
                <td class="border border-gray-300 px-4 py-3">Live conversation beats screens at this age.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">"How long should I play each day?"</td>
                <td class="border border-gray-300 px-4 py-3">Multiple mini‑sessions (5–15 min) trump one marathon.</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">"Is mess good or bad?"</td>
                <td class="border border-gray-300 px-4 py-3">Messy play builds sensory tolerance—use washable mats.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Daily Tip 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Every morning, DearBaby suggests an <strong>age‑perfect game</strong>:</p>

        <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-green-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Newborns</strong>: "Sing a nursery rhyme while doing bicycle legs."</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>6‑mo</strong>: "Peek‑a‑boo with a soft cloth."</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>9‑mo</strong>: "Create a 'cold vs warm' sensory basket."</span>
            </li>
          </ul>
        </div>

        <p class="text-gray-700 leading-relaxed mb-4">Parents in <strong>New York, London, Berlin, Paris, Stockholm</strong> receive local language rhymes and safety tweaks.</p>

        <div class="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-lg">
          <p class="text-emerald-800"><em>Tips available in DearBaby Premium; integrate with SolidStart video demos Q4 2025.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Quick Safety Reminders</h2>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <ul class="space-y-2 text-red-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Stay within arm's reach for all sensory bins.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Avoid small parts < 4 cm diameter.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Wash hands before & after play.</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Take‑Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Talk, sing, hide, reveal, scoop and dump—simple actions fuel neural fireworks worldwide. Pair these zero‑cost games with DearBaby's smart prompts, and your baby's daily routine becomes a brain‑building studio—no fancy toys required.</p>
        </div>
      </div>
    `,
    category: "Child Development",
    readTime: "5 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Development Team",
    keywords: ["baby development activities", "zero‑cost baby games", "object permanence games", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "infant-vaccine-schedule-2025": {
    title: "First‑Year Vaccine Schedule (2025 CDC & EU‑ECDC Overview)",
    excerpt: "Month‑by‑month vaccine guide for parents in North America & Europe—bundles, common side effects, and DearBaby reminder integration.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">What to expect at each well‑visit and why on‑time shots matter</h2>
        <p class="text-gray-700 leading-relaxed">Month‑by‑month vaccine guide for parents in North America & Europe—bundles, common side effects, and DearBaby reminder integration.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Why On‑Time Vaccination Matters</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Completing the recommended schedule <strong>protects against 16 serious diseases by age 2</strong> (CDC). On‑time shots build immunity before exposure peaks—whether you live in <strong>Boston</strong>, <strong>Berlin</strong>, or <strong>Barcelona</strong>.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">First‑Year Vaccine Timeline (US · CA · UK · EU Friendly)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Well‑Visit Age</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Vaccines Typically Given*</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Diseases Covered</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Birth</strong></td>
                <td class="border border-gray-300 px-4 py-3">Hep B #1</td>
                <td class="border border-gray-300 px-4 py-3">Hepatitis B</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>2 months</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>DTaP, Hib, IPV, PCV, Rotavirus, Hep B #2</strong></td>
                <td class="border border-gray-300 px-4 py-3">Pertussis, Tetanus, Diphtheria, Hib meningitis, Polio, Pneumococcal, Rotavirus, Hep B</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>4 months</strong></td>
                <td class="border border-gray-300 px-4 py-3">DTaP #2, Hib #2, IPV #2, PCV #2, Rotavirus #2</td>
                <td class="border border-gray-300 px-4 py-3">Boosters to strengthen immunity</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>6 months</strong></td>
                <td class="border border-gray-300 px-4 py-3">DTaP #3, Hib #3, PCV #3, Hep B #3, Rotavirus #3 (if 3‑dose), <em>Flu</em> (seasonal)</td>
                <td class="border border-gray-300 px-4 py-3">Adds influenza protection</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>9 months</strong>**</td>
                <td class="border border-gray-300 px-4 py-3">Development check; some EU countries give MenB</td>
                <td class="border border-gray-300 px-4 py-3">—</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>12 months</strong></td>
                <td class="border border-gray-300 px-4 py-3">MMR #1, Varicella #1, PCV #4, Hep A #1 (US)</td>
                <td class="border border-gray-300 px-4 py-3">Measles, Mumps, Rubella, Chickenpox, Hepatitis A</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-6">
          <p class="text-amber-800">*Exact brands and combinations vary by country; your pediatrician will confirm.<br>**The UK offers MenB doses at 8 weeks, 16 weeks, and 1 year; check local schedule.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Typical Side Effects & Home Care</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Symptom</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">How Common</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Home Management</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Mild fever ≤ 101 °F (38.3 °C)</td>
                <td class="border border-gray-300 px-4 py-3">1–2 days</td>
                <td class="border border-gray-300 px-4 py-3">Weight‑based acetaminophen (per MD)</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Fussiness / Sleepiness</td>
                <td class="border border-gray-300 px-4 py-3">Up to 50 %</td>
                <td class="border border-gray-300 px-4 py-3">Extra cuddles, feed on demand</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Soreness / small lump</td>
                <td class="border border-gray-300 px-4 py-3">Localized</td>
                <td class="border border-gray-300 px-4 py-3">Cool compress 10 min, gentle leg movement</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Rotavirus oral vaccine spit‑up</td>
                <td class="border border-gray-300 px-4 py-3">Occasional</td>
                <td class="border border-gray-300 px-4 py-3">Re‑dose not needed if some swallowed</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <p class="text-red-800"><strong>Call your doctor if fever > 104 °F, inconsolable crying > 3 h, or signs of allergic reaction (wheezing, hives).</strong></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Prep Checklist for Any Clinic Visit</h2>
        
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <ol class="space-y-3 text-orange-800">
            <li class="flex items-start">
              <span class="mr-2">1.</span>
              <span><strong>Bring vaccine card</strong> (US) or <strong>Red Book</strong> (UK) / <strong>EU health booklet</strong>.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">2.</span>
              <span>Dress baby in two‑piece outfit for quick thigh access.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">3.</span>
              <span>Pack comfort item: pacifier, favorite cloth.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">4.</span>
              <span>Plan soothing feed within 5 min post‑shots—breast or bottle reduces pain.</span>
            </li>
          </ol>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Reminders 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Parents in <strong>New York</strong>, <strong>Toronto</strong>, <strong>London</strong>, <strong>Paris</strong>, <strong>Stockholm</strong> receive:</p>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-amber-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Auto‑logged shot dates</strong> (tap ✔️ after visit)</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Push alert</strong> two weeks before the next dose window</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>"What to expect" card</strong> explaining vaccines specific to your country</span>
            </li>
          </ul>
        </div>

        <div class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
          <p class="text-orange-800"><em>Reminders synced to CDC & ECDC schedules; available in DearBaby Premium.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">FAQ (Same Answers in 🇺🇸 🇨🇦 🇬🇧 🇪🇺)</h2>
        
        <div class="space-y-6">
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Do combo shots overload the immune system?</h3>
            <p class="text-gray-700">No. Babies encounter far more antigens daily crawling on the floor than in modern combo vaccines.</p>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Can I delay shots if baby is teething?</h3>
            <p class="text-gray-700">Mild teething is not a contraindication; delaying leaves baby vulnerable longer.</p>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Do I need separate Tylenol pre‑dose?</h3>
            <p class="text-gray-700">AAP: Give acetaminophen <em>after</em> if fever/discomfort occurs; pre‑dosing may blunt antibody response.</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Key Take‑Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Stick to the schedule, track doses, and treat mild side effects with comfort care. From <strong>Seattle</strong> to <strong>Seville</strong>, timely vaccines keep your baby—and the community—safe, while DearBaby makes remembering each shot as simple as a tap.</p>
        </div>
      </div>
    `,
    category: "Health & Safety",
    readTime: "7 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Pediatric Team",
    keywords: ["infant vaccine schedule", "2‑month shots", "well‑visit timeline", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "sick-baby-fever-cold-care": {
    title: "Caring for a Sick Baby: Fever & Cold Guide (0–12 Months)",
    excerpt: "Pediatric‑backed fever thresholds, home remedies, red‑flag symptoms, and DearBaby trend tracking for parents in North America & Europe.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-l-4 border-red-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Home remedies, red‑flags, and pediatric‑backed fever rules</h2>
        <p class="text-gray-700 leading-relaxed">Pediatric‑backed fever thresholds, home remedies, red‑flag symptoms, and DearBaby trend tracking for parents in North America & Europe.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Fever? Know the Numbers First (US · EU Standard)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Age</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Call Doctor / ER If…</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>< 3 months</strong></td>
                <td class="border border-gray-300 px-4 py-3">Rectal temp <strong>≥ 100.4 °F (38 °C)</strong> even once</td>
                <td class="border border-gray-300 px-4 py-3">HealthyChildren.org / AAP</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>3–6 months</strong></td>
                <td class="border border-gray-300 px-4 py-3">Fever <strong>> 102 °F (38.9 °C)</strong> or lasts > 24 h</td>
                <td class="border border-gray-300 px-4 py-3">CDC</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>> 6 months</strong></td>
                <td class="border border-gray-300 px-4 py-3">Fever <strong>> 104 °F (40 °C)</strong> or any seizure</td>
                <td class="border border-gray-300 px-4 py-3">NHS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Home‑Comfort Toolkit (Works from Boston to Berlin)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Symptom</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Comfort Measure</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Stuffy nose</td>
                <td class="border border-gray-300 px-4 py-3"><strong>Saline drops</strong> + bulb syringe</td>
                <td class="border border-gray-300 px-4 py-3">Clears passages before feeds</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Night congestion</td>
                <td class="border border-gray-300 px-4 py-3"><strong>Cool‑mist humidifier</strong> at crib level</td>
                <td class="border border-gray-300 px-4 py-3">Clean tank daily to avoid mold</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Mild fever</td>
                <td class="border border-gray-300 px-4 py-3"><strong>Light clothing & room 20–22 °C</strong></td>
                <td class="border border-gray-300 px-4 py-3">Over‑bundling traps heat</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Fussiness</td>
                <td class="border border-gray-300 px-4 py-3">Extra skin‑to‑skin, nurse on demand</td>
                <td class="border border-gray-300 px-4 py-3">Fluids & cuddles aid recovery</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-red-800 mb-3">Safe meds</h3>
          <ul class="space-y-2 text-red-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Acetaminophen</strong>: use weight‑based chart from your pediatrician.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Ibuprofen</strong>: <strong>avoid under 6 months</strong> (HealthyChildren.org).</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Never give aspirin (Reye's syndrome risk).</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Red‑Flags Requiring Immediate Care</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Sign</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Possible Concern</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Blue lips or difficulty breathing</td>
                <td class="border border-gray-300 px-4 py-3">Respiratory distress</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Bulging fontanelle, inconsolable high‑pitched cry</td>
                <td class="border border-gray-300 px-4 py-3">Meningitis risk</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Fewer than <strong>3 wet diapers / 24 h</strong></td>
                <td class="border border-gray-300 px-4 py-3">Dehydration</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Fever that returns after 24 h fever‑free</td>
                <td class="border border-gray-300 px-4 py-3">Secondary infection</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <p class="text-red-800"><strong>Dial emergency services (911 / 112) if any severe breathing or unresponsiveness.</strong></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Gentle Cold Remedies (Evidence‑Friendly)</h2>
        
        <div class="bg-rose-50 border border-rose-200 rounded-lg p-6">
          <ol class="space-y-3 text-rose-800">
            <li class="flex items-start">
              <span class="mr-2">1.</span>
              <span><strong>Elevate mattress</strong> 10–15° (towel under crib legs—not pillow under head).</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">2.</span>
              <span>Offer <strong>small, frequent feeds</strong>; congestion makes long nursing hard.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">3.</span>
              <span><strong>Hand‑wash</strong> often; RSV & flu spread fast among siblings.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">4.</span>
              <span>For babies <strong>> 12 months</strong>, a teaspoon of honey can soothe cough—but <strong>never before 1 year</strong>.</span>
            </li>
          </ol>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Fever Tracker 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Parents in <strong>New York, Toronto, London, Paris, Stockholm</strong> can:</p>

        <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-red-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Snap thermometer reading; DearBaby graph trends.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Auto‑flag rising curve or persistent fever > 24 h.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Integrate meds log—when acetaminophen was given, dose & weight.</span>
            </li>
          </ul>
        </div>

        <div class="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-lg">
          <p class="text-rose-800"><em>Feature available in DearBaby Premium, watchOS 11 compatibility.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Sample 24‑Hour "Sick‑Day" Routine</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Time</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Action</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">6 a.m.</td>
                <td class="border border-gray-300 px-4 py-3">Rectal temp check & log</td>
                <td class="border border-gray-300 px-4 py-3">Baseline</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">7 a.m.</td>
                <td class="border border-gray-300 px-4 py-3">Feed #1, saline + suction</td>
                <td class="border border-gray-300 px-4 py-3">Clear before nursing</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">9 a.m.</td>
                <td class="border border-gray-300 px-4 py-3">20 min contact nap upright on chest</td>
                <td class="border border-gray-300 px-4 py-3">Eases breathing</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">12 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Acetaminophen (per chart) if fever > 101 °F</td>
                <td class="border border-gray-300 px-4 py-3">Comfort</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">3 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Humidifier on, quiet play (books)</td>
                <td class="border border-gray-300 px-4 py-3">Low‑stim</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">6 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Warm bath (not cold)</td>
                <td class="border border-gray-300 px-4 py-3">Soothes muscles</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">9 p.m.</td>
                <td class="border border-gray-300 px-4 py-3">Final feed, temp re‑check</td>
                <td class="border border-gray-300 px-4 py-3">Ensure stable overnight</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Key Take‑Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Know the <strong>100.4 °F rule for under‑3‑months</strong>, trust saline + humidifier for colds, and track meds/temps carefully. From <strong>Seattle</strong> to <strong>Seville</strong>, DearBaby transforms scattered fever notes into clear graphs—so you and your pediatrician can act quickly if patterns turn worrisome.</p>
        </div>
      </div>
    `,
    category: "Health & Safety",
    readTime: "8 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Pediatric Team",
    keywords: ["baby fever care", "infant cold remedies", "sick baby red flags", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "teething-symptoms-remedies": {
    title: "Teething 101: Symptoms, Safe Soothers & What Isn't Normal",
    excerpt: "Normal drool vs red-flag fever, chilled teether tips and FDA warnings—guidance for parents in North America & Europe, plus DearBaby tracking.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border-l-4 border-cyan-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">What's normal, what's not, and pediatrician-approved pain relief</h2>
        <p class="text-gray-700 leading-relaxed">Normal drool vs red-flag fever, chilled teether tips and FDA warnings—guidance for parents in North America & Europe, plus DearBaby tracking.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">First Tooth Around Six Months—But the Drool Starts Earlier</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Most babies in <strong>Boston 🇺🇸</strong>, <strong>Toronto 🇨🇦</strong>, <strong>London 🇬🇧</strong>, <strong>Berlin 🇩🇪</strong> cut their first lower front tooth near <strong>6 months</strong>. Classic teething cues:</p>

        <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
          <ul class="space-y-2 text-cyan-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Excess drooling</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Chewing everything in reach</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Mild irritability & disturbed naps</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Slightly swollen, red gums</span>
            </li>
          </ul>
        </div>

        <div class="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg mt-4">
          <p class="text-teal-800"><strong>High fever (> 38 °C / 100.4 °F) is <em>not</em> teething</strong>—look for other causes (HealthyChildren.org).</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">What's Normal vs Red Flag</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Sign</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Normal?</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Drool rash on chin</td>
                <td class="border border-gray-300 px-4 py-3">✅</td>
                <td class="border border-gray-300 px-4 py-3">Keep area dry; apply barrier cream</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Low-grade temp <strong>< 38 °C</strong></td>
                <td class="border border-gray-300 px-4 py-3">✅</td>
                <td class="border border-gray-300 px-4 py-3">Monitor; offer fluids</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Ear tugging with no fever</td>
                <td class="border border-gray-300 px-4 py-3">✅ (referred gum pain)</td>
                <td class="border border-gray-300 px-4 py-3">Gum massage</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Fever <strong>≥ 38 °C</strong>, diarrhea, rash elsewhere</td>
                <td class="border border-gray-300 px-4 py-3">🚩</td>
                <td class="border border-gray-300 px-4 py-3">Call pediatrician—rule out infection</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Bleeding gums > spot</td>
                <td class="border border-gray-300 px-4 py-3">🚩</td>
                <td class="border border-gray-300 px-4 py-3">Medical review</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Pediatrician-Approved Soothers (US · EU Safe List)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Remedy</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">How to Use</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Why It Works</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Chilled silicone teether</strong></td>
                <td class="border border-gray-300 px-4 py-3">Refrigerate (not freeze) 30 min</td>
                <td class="border border-gray-300 px-4 py-3">Cold numbs gum pain</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Clean finger gum massage</strong></td>
                <td class="border border-gray-300 px-4 py-3">1–2 min gentle circular rubs</td>
                <td class="border border-gray-300 px-4 py-3">Pressure counter-stimulates nerves</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Cold washcloth</strong></td>
                <td class="border border-gray-300 px-4 py-3">Damp cloth in fridge, babies chew</td>
                <td class="border border-gray-300 px-4 py-3">Texture + chill combo</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Acetaminophen</strong></td>
                <td class="border border-gray-300 px-4 py-3">Weight-based dose if irritability disrupts sleep</td>
                <td class="border border-gray-300 px-4 py-3">Analgesic; safe from birth</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-red-800 mb-3">Avoid</h3>
          <ul class="space-y-2 text-red-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Benzocaine gels</strong> (FDA: methemoglobinemia risk)</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Homeopathic teething tablets</strong> (variable belladonna)</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Amber necklaces</strong> (strangulation & choking hazard)</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Teether Safety Checklist</h2>
        
        <div class="bg-teal-50 border border-teal-200 rounded-lg p-6">
          <ol class="space-y-3 text-teal-800">
            <li class="flex items-start">
              <span class="mr-2">1.</span>
              <span>One-piece, BPA-free silicone or wood.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">2.</span>
              <span>No liquid-filled rings (can leak bacteria).</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">3.</span>
              <span>Always supervise; never clip necklace-style beads.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">4.</span>
              <span>Clean daily with warm soapy water or top-rack dishwasher (if allowed).</span>
            </li>
          </ol>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Teething Tracker 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">Parents in <strong>New York</strong>, <strong>Paris</strong>, <strong>Stockholm</strong> can:</p>

        <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-cyan-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Snap gum photo; DearBaby overlays eruption timeline.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Log acetaminophen doses to stay within 24 h limits.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Receive <strong>"Try chilled teether now?"</strong> prompts during fussy wake windows.</span>
            </li>
          </ul>
        </div>

        <div class="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg">
          <p class="text-teal-800"><em>Feature in DearBaby Premium; GPT-4o image analysis highlights swelling zones.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Quick FAQ</h2>
        
        <div class="space-y-6">
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Does teething cause diarrhea?</h3>
            <p class="text-gray-700">No conclusive evidence—call your doctor if loose stools persist > 24 h.</p>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Can I freeze fruit in a mesh feeder?</h3>
            <p class="text-gray-700">Yes for babies > 6 months eating solids; watch for choking seeds.</p>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">When should the first dental visit happen?</h3>
            <p class="text-gray-700">Around <strong>12 months</strong> or within 6 months of first tooth (AAPD & NHS).</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bottom Line</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Expect drool, gnawing, and cranky nights—treat with cold pressure and reassure often. Skip numbing gels and necklaces. From <strong>Seattle</strong> to <strong>Seville</strong>, DearBaby's smart prompts keep teething pain predictable—so everyone smiles sooner.</p>
        </div>
      </div>
    `,
    category: "Child Development",
    readTime: "6 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Pediatric Team",
    keywords: ["teething symptoms", "baby teething remedies", "benzocaine gel warning", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "surviving-baby-colic": {
    title: "Surviving Colic: Rule-of-3, Soothing Hacks & Parent Self-Care",
    excerpt: "Johns Hopkins 'Rule-of-3' colic definition, evidence-based soothing toolkit and DearBaby crying-detector support for parents in North America & Europe.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border-l-4 border-purple-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Rule-of-3 definition, soothing hacks, and parent self-care</h2>
        <p class="text-gray-700 leading-relaxed">Johns Hopkins 'Rule-of-3' colic definition, evidence-based soothing toolkit and DearBaby crying-detector support for parents in North America & Europe.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">What Counts as Colic?</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">The <strong>Johns Hopkins "Rule-of-3"</strong> definition:</p>

        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
          <blockquote class="text-purple-800 italic">
            More than <strong>3 hours</strong> of crying a day,<br>
            on <strong>3 days or more</strong> per week,<br>
            for <strong>3 weeks straight</strong> in an otherwise healthy baby.
          </blockquote>
        </div>

        <p class="text-gray-700 leading-relaxed mb-4">Colic affects roughly <strong>1 in 4 infants</strong> worldwide.</p>

        <div class="bg-violet-50 border border-violet-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-violet-800 mb-3">Timeline Reality Check</h3>
          <ul class="space-y-2 text-violet-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Peaks around <strong>6 weeks</strong> of age</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Typically resolves by <strong>3–4 months</strong></span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Leaves <strong>no long-term harm</strong>, but can exhaust parents</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Soothing Toolkit (Works in US & EU)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Technique</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">How to Do It</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Why It Helps</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Swaddle + Side-Hold</strong></td>
                <td class="border border-gray-300 px-4 py-3">Snug swaddle; hold baby on side/stomach</td>
                <td class="border border-gray-300 px-4 py-3">Mimics womb compression & reflex relief</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>White-Noise ~60 dB</strong></td>
                <td class="border border-gray-300 px-4 py-3">Fan, shusher, or app</td>
                <td class="border border-gray-300 px-4 py-3">Steady sound calms overstimulated nervous system</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Babywearing Walk</strong></td>
                <td class="border border-gray-300 px-4 py-3">Soft wrap/sling; pace the hall</td>
                <td class="border border-gray-300 px-4 py-3">Motion & parent heartbeat cue safety</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Stroller Night Ride</strong></td>
                <td class="border border-gray-300 px-4 py-3">10-min roll in cool air</td>
                <td class="border border-gray-300 px-4 py-3">Temperature + movement often short-circuit crying</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
          <p class="text-purple-800">Urban hack: Tram or subway rides provide rhythmic sway many EU parents love.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Parent Self-Care ≠ Luxury</h2>
        
        <div class="bg-violet-50 border border-violet-200 rounded-lg p-6 mb-4">
          <ul class="space-y-3 text-violet-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Tag-team with partner/friend: 3-hour "ear-break" shifts</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Use noise-cancel headphones + podcast while rocking</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Text <strong>Postpartum Support International (PSI)</strong> if mood plummets: +1-800-944-4773 (US/Canada)</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>UK: <strong>PANDAS</strong>; EU: National hotlines</span>
            </li>
          </ul>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <p class="text-red-800"><strong>Seek medical review if crying changes pitch, baby vomits forcefully, or fever ≥ 38 °C.</strong></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Cry-Detector 📲</h2>
        
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-purple-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Phone mic (no audio saved) spots <strong>> 15 min continuous crying</strong>.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Pops an instant card: "Try swaddle + shush."</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Charts total crying hours; flags if Rule-of-3 threshold crossed for discussion at check-ups.</span>
            </li>
          </ul>
        </div>

        <div class="bg-violet-50 border-l-4 border-violet-400 p-4 rounded-r-lg">
          <p class="text-violet-800"><em>Feature in DearBaby Premium; sensitivity adjustable.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Key Take-Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Colic is <strong>common, temporary, survivable</strong>. Combine rhythmic soothing, real breaks for parents, and DearBaby's smart prompts—whether you're in <strong>Seattle</strong> or <strong>Seville</strong>—and those exhausting evenings will pass.</p>
        </div>
      </div>
    `,
    category: "Health & Safety",
    readTime: "5 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Pediatric Team",
    keywords: ["baby colic tips", "excessive crying", "rule of three colic", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "babyproofing-home-safety": {
    title: "Babyproofing 101: Room‑by‑Room Home Safety Checklist",
    excerpt: "Outlet covers, furniture anchors, stair gates, choke‑test guide and DearBaby milestone alerts for parents in North America & Europe.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-l-4 border-amber-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Room‑by‑room guide; one‑third of child injuries happen at home—let's fix that</h2>
        <p class="text-gray-700 leading-relaxed">Outlet covers, furniture anchors, stair gates, choke‑test guide and DearBaby milestone alerts for parents in North America & Europe.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">One‑Third of Child Injuries Happen at Home*</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">National Safety Council data show household hazards injure thousands of under‑5s annually across <strong>the U.S., Canada, the U.K., Germany, France, Sweden, Italy, Spain</strong>. Let's fix that before crawling begins.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Room‑by‑Room Checklist</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Room</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Must‑Do Fixes</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Quick Test</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Living Room</strong></td>
                <td class="border border-gray-300 px-4 py-3">Anchor TVs & bookcases, use outlet covers, pad sharp table corners</td>
                <td class="border border-gray-300 px-4 py-3">Pull furniture—shouldn't budge</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Kitchen</strong></td>
                <td class="border border-gray-300 px-4 py-3">Install <strong>top & bottom</strong> stair/door gate, move cleaners to high cabinet, stove‑knob covers</td>
                <td class="border border-gray-300 px-4 py-3">TP‑roll choke test for utensils</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Bathroom</strong></td>
                <td class="border border-gray-300 px-4 py-3">Toilet lock, meds up high, non‑skid bath mat, water‑heater <strong>≤ 120 °F (49 °C)</strong></td>
                <td class="border border-gray-300 px-4 py-3">1‑sec back‑of‑hand water test</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Bedroom/Nursery</strong></td>
                <td class="border border-gray-300 px-4 py-3">Bare crib, curtain cord cleats, dresser anchors</td>
                <td class="border border-gray-300 px-4 py-3">Shake dresser—zero tip</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Stairs</strong></td>
                <td class="border border-gray-300 px-4 py-3">Hardware‑mounted gates top & bottom</td>
                <td class="border border-gray-300 px-4 py-3">Middle‑step kick—gate stays firm</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-6">
          <p class="text-amber-800"><strong>Choke‑Test</strong>: Anything fitting through an empty toilet‑paper tube is a hazard (coins, grapes, Lego).</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">General Safety Upgrades</h2>
        
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <ul class="space-y-2 text-orange-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Outlet Covers</strong> on every unused socket.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Door Pinch Guards</strong> to protect tiny fingers.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Window Stops</strong>—open max <strong>4 in (10 cm)</strong>.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Non‑slam Lid Devices</strong> on toy chests and bins.</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DIY in Under a Weekend (US · EU hardware)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Task</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Average Time</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Install furniture anchors</td>
                <td class="border border-gray-300 px-4 py-3">10 min / item</td>
                <td class="border border-gray-300 px-4 py-3">$5 anchor kit</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Outlet covers (20 pack)</td>
                <td class="border border-gray-300 px-4 py-3">15 min</td>
                <td class="border border-gray-300 px-4 py-3">$8</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Water‑heater temp set</td>
                <td class="border border-gray-300 px-4 py-3">5 min</td>
                <td class="border border-gray-300 px-4 py-3">Free</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Gate drill‑mount</td>
                <td class="border border-gray-300 px-4 py-3">20 min</td>
                <td class="border border-gray-300 px-4 py-3">$45 per gate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby "Crawling Soon" Alert 📲</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">When DearBaby's predictor detects <strong>rolling + rocking on all fours</strong>, parents in <strong>New York</strong>, <strong>Toronto</strong>, <strong>London</strong>, <strong>Berlin</strong> get a push:</p>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
          <blockquote class="text-amber-800 italic">
            "🚧 Babyproof time! Check outlet covers & anchor furniture."
          </blockquote>
          <p class="text-amber-700 mt-2">Includes link to this checklist for easy action.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Key Take‑Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Anchor, cover, gate, test. From <strong>Seattle</strong> lofts to <strong>Seville</strong> flats, pre‑emptive babyproofing turns your home into a discovery zone—not an ER visit. DearBaby's milestone alert ensures you act before tiny explorers hit full throttle.</p>
        </div>

        <div class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg mt-4">
          <p class="text-orange-800"><em>*National Safety Council, Home & Leisure Injury Facts, 2024</em></p>
        </div>
      </div>
    `,
    category: "Health & Safety",
    readTime: "6 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Safety Team",
    keywords: ["babyproofing checklist", "home safety for crawlers", "furniture anchoring", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "postpartum-depression-signs-help": {
    title: "Post-partum Mental Health: Baby Blues vs PPD—How to Spot the Difference & Get Help",
    excerpt: "Up to 14 % of new mothers develop postpartum depression. Learn key symptoms, global helplines, and DearBaby mood-tracker support.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-l-4 border-pink-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">1-in-7 moms face PPD—know the signs and paths to help</h2>
        <p class="text-gray-700 leading-relaxed">Up to 14 % of new mothers develop postpartum depression. Learn key symptoms, global helplines, and DearBaby mood-tracker support.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Baby Blues or PPD—Which One Is It?</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Feature</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Baby Blues</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Post-partum Depression (PPD)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Onset</td>
                <td class="border border-gray-300 px-4 py-3">Days <strong>3–10</strong> after birth</td>
                <td class="border border-gray-300 px-4 py-3">Any time within <strong>first 12 months</strong></td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Duration</td>
                <td class="border border-gray-300 px-4 py-3">< 2 weeks</td>
                <td class="border border-gray-300 px-4 py-3"><strong>> 2 weeks</strong> persistent</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Symptoms</td>
                <td class="border border-gray-300 px-4 py-3">Tearful, mood swings, overwhelm</td>
                <td class="border border-gray-300 px-4 py-3">Deep sadness, guilt, loss of interest, bonding difficulty</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Prevalence</td>
                <td class="border border-gray-300 px-4 py-3">Up to <strong>80 %</strong> of mothers</td>
                <td class="border border-gray-300 px-4 py-3">~ <strong>14 %</strong> (≈ 1 in 7) ✧ PostpartumDepression.org</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Self-resolves?</td>
                <td class="border border-gray-300 px-4 py-3">Usually yes</td>
                <td class="border border-gray-300 px-4 py-3">Needs professional support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Red-Flag Signs to Call for Help</h2>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-red-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Thoughts of harming yourself or the baby</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>No joy in anything for > 14 days</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Extreme anxiety or panic attacks</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Feeling disconnected from your baby</span>
            </li>
          </ul>
        </div>

        <div class="bg-pink-50 border border-pink-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-pink-800 mb-3">Emergency numbers</h3>
          <ul class="space-y-2 text-pink-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>US/Canada</strong>: 988 Suicide & Crisis Lifeline</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>UK</strong>: NHS 111 or Samaritans 116 123</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>EU</strong>: 112 (EU-wide), plus local per-country hotlines</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Proven Paths to Treatment (US · EU Options)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Option</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">How It Helps</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Where to Start</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Talk Therapy (CBT/IPT)</strong></td>
                <td class="border border-gray-300 px-4 py-3">Reframes negative thoughts</td>
                <td class="border border-gray-300 px-4 py-3">Ask OB-GYN, GP, or local mental-health clinic</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Medication (SSRIs)</strong></td>
                <td class="border border-gray-300 px-4 py-3">Balances brain chemistry; many are breastfeeding-safe</td>
                <td class="border border-gray-300 px-4 py-3">Psychiatrist or GP</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Peer Support</strong></td>
                <td class="border border-gray-300 px-4 py-3">Normalizes feelings; reduces isolation</td>
                <td class="border border-gray-300 px-4 py-3"><strong>Postpartum Support International (PSI)</strong>: +1-800-944-4773; UK PANDAS; Germany Schatten & Licht</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Lifestyle Adjust</strong></td>
                <td class="border border-gray-300 px-4 py-3">Sleep shifts, nutrition, gentle exercise</td>
                <td class="border border-gray-300 px-4 py-3">Lean on partner/family for baby care breaks</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-lg">
          <p class="text-rose-800">Early help = faster recovery. CDC data show treated PPD improves within <strong>6–12 weeks</strong> on average.</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Self-Care Micro-Habits (Works in Boston & Berlin)</h2>
        
        <div class="bg-pink-50 border border-pink-200 rounded-lg p-6">
          <ol class="space-y-3 text-pink-800">
            <li class="flex items-start">
              <span class="mr-2">1.</span>
              <span><strong>Sunlight 10 min</strong> before noon—boosts serotonin.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">2.</span>
              <span><strong>Protein breakfast</strong> (Greek yogurt, eggs) to steady blood sugar.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">3.</span>
              <span><strong>5-breath reset</strong> each feed: inhale 4 s, exhale 6 s.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">4.</span>
              <span>Accept help: meals, laundry, or a 30-min walk alone.</span>
            </li>
          </ol>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby Private Mood-Tracker 📲</h2>
        
        <div class="bg-rose-50 border border-rose-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-rose-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>One-tap emoji log</strong> after each feed (😊 😐 😢).</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Pattern detection</strong>: If low-mood streak > 7 days, app nudges:</span>
            </li>
          </ul>
        </div>

        <div class="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-4">
          <blockquote class="text-pink-800 italic">
            "Feeling low lately? Consider calling Postpartum Support International."
          </blockquote>
        </div>

        <div class="bg-rose-50 border border-rose-200 rounded-lg p-6 mb-4">
          <ul class="space-y-2 text-rose-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>Data privacy</strong>: Logs stored locally unless you opt-in to share with clinician.</span>
            </li>
          </ul>
        </div>

        <div class="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-r-lg">
          <p class="text-pink-800"><em>Mood-tracker in DearBaby Premium; fits Apple Health Mindful Minutes slot.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Key Take-Away</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">Feelings that linger > two weeks aren't just "baby blues." From <strong>Seattle</strong> to <strong>Seville</strong>, 1-in-7 mothers face PPD—and help works. Track your mood in DearBaby, reach out early, and remember: caring for yourself is caring for your baby.</p>
        </div>
      </div>
    `,
    category: "Mental Health",
    readTime: "7 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Mental-Health Team",
    keywords: ["postpartum depression signs", "baby blues vs ppd", "mental health after birth", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  },
  "best-baby-apps-2025": {
    title: "Top Baby‑Care Apps & Tech Tools for 2025",
    excerpt: "AI trackers, recipe generators, smart monitors and more—how new‑parent tech shapes care routines in North America & Europe.",
    content: `
      <div class="mb-8 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-l-4 border-teal-400">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">From AI sleep charts to smart monitors—gadgets that lighten new‑parent life</h2>
        <p class="text-gray-700 leading-relaxed">AI trackers, recipe generators, smart monitors and more—how new‑parent tech shapes care routines in North America & Europe.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Why Parents Are "Data‑fying" Baby Care</h2>
        
        <p class="text-gray-700 leading-relaxed mb-4">A 2025 <strong>DigitalChild</strong> survey shows <strong>70 % of millennial parents</strong> across <strong>the U.S., Canada, U.K., Germany, France, Sweden, Italy, Spain</strong> rely on at least two baby‑care apps to track sleep, feeds, or development. Tech frees brain‑space—but only if tools are trustworthy.</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Best‑in‑Class Apps & Gadgets (2025 Edition)</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Category</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">App / Device</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Why It Rocks</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Platform</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>All‑in‑One Tracker</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>DearBaby</strong></td>
                <td class="border border-gray-300 px-4 py-3">AI insights, Apple Watch sync, auto‑charted WHO milestones</td>
                <td class="border border-gray-300 px-4 py-3">iOS</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Meal Ideas</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>SolidStart</strong></td>
                <td class="border border-gray-300 px-4 py-3">Age‑tagged recipes + ingredient‑to‑purée AI (beta)</td>
                <td class="border border-gray-300 px-4 py-3">iOS / Android</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Sleep Analytics</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Huckleberry</strong></td>
                <td class="border border-gray-300 px-4 py-3">Predictive <strong>"SweetSpot"</strong> nap timing</td>
                <td class="border border-gray-300 px-4 py-3">iOS / Android</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Development</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>CDC Milestone Tracker</strong></td>
                <td class="border border-gray-300 px-4 py-3">Official checklists & quick videos</td>
                <td class="border border-gray-300 px-4 py-3">iOS / Android</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Monitor</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Nanit Pro</strong></td>
                <td class="border border-gray-300 px-4 py-3">HD camera + breathing & sleep trend analytics</td>
                <td class="border border-gray-300 px-4 py-3">Hardware + app</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>Vital Signs</strong></td>
                <td class="border border-gray-300 px-4 py-3"><strong>Owlet Dream Sock</strong></td>
                <td class="border border-gray-300 px-4 py-3">Pulse‑ox + sleep‑quality alerts (optional tech)</td>
                <td class="border border-gray-300 px-4 py-3">Hardware + app</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg">
          <p class="text-teal-800"><em>Prices & availability vary by country—check local app stores.</em></p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">How AI Changes Day‑to‑Day Parenting</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Task Before Tech</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">After Tech (2025)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Manual feed log in notebook</td>
                <td class="border border-gray-300 px-4 py-3">Tap DearBaby complication—data auto‑graphs feeds & diapers</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Guess nap window</td>
                <td class="border border-gray-300 px-4 py-3">Huckleberry SweetSpot predicts drowsy window to the minute</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Cookbook flipping</td>
                <td class="border border-gray-300 px-4 py-3">SolidStart suggests iron‑rich purée from fridge scan</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3">Paper milestone chart</td>
                <td class="border border-gray-300 px-4 py-3">CDC app sends push when rolling window opens</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Balanced Tip</h2>
        
        <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
          <blockquote class="text-cyan-800 italic">
            <strong>Tech is a helper, not a substitute for instinct.</strong><br>
            Schedule <em>screen‑free cuddle time</em> daily—no apps, no notifications, just baby and you.
          </blockquote>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">DearBaby & SolidStart Ecosystem 📲</h2>
        
        <div class="bg-teal-50 border border-teal-200 rounded-lg p-6">
          <ul class="space-y-2 text-teal-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>DearBaby</strong> centralizes sleep, feed, diaper, and milestone data.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span><strong>SolidStart</strong> plugs into DearBaby to show <strong>AI menu cards</strong> based on iron needs and allergy exposure gaps.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Both apps comply with <strong>GDPR (EU)</strong> and <strong>HIPAA (U.S.)</strong> encryption standards.</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Future Watchlist</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 my-6">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Coming Soon</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Why to Watch</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>BabbleAI</strong></td>
                <td class="border border-gray-300 px-4 py-3">GPT‑4o model that translates infant vocal patterns into probable needs</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>TempTag</strong></td>
                <td class="border border-gray-300 px-4 py-3">Wear‑all‑day skin temp sticker, early fever alerts</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-3"><strong>SmartSpoon</strong></td>
                <td class="border border-gray-300 px-4 py-3">Measures volume & pace of solids intake, syncs to DearBaby</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bottom Line</h2>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p class="text-gray-700 leading-relaxed mb-4">From <strong>Seattle</strong> smart socks to <strong>Stockholm</strong> recipe bots, 2025 tech can lighten mental load—if you choose tools that respect data privacy and complement parental intuition. DearBaby + SolidStart form a solid core, while niche apps like Huckleberry or Nanit layer in specialty insights. Happy tracking—and don't forget the cuddles.</p>
        </div>
      </div>
    `,
    category: "Technology",
    readTime: "5 min read",
    publishDate: "2025-01-14",
    author: "JupitLunar Tech Team",
    keywords: ["best baby apps 2025", "smart baby monitor", "AI sleep analytics", "United States", "Canada", "United Kingdom", "Germany", "France", "Sweden", "Italy", "Spain"]
  }
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPostData[slug as keyof typeof blogPostData];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="pt-24 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <Link to="/blog" className="text-indigo-600 hover:text-indigo-700">
              ← Back to Blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // 结构化数据
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": { "@type": "Person", "name": post.author },
    "datePublished": post.publishDate,
    "inLanguage": "en-US",
    "audience": { "@type": "ParentAudience", "parentalRole": "Mother" },
    "areaServed": [
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "Canada" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "Germany" },
      { "@type": "Country", "name": "France" },
      { "@type": "Country", "name": "Sweden" },
      { "@type": "Country", "name": "Italy" },
      { "@type": "Country", "name": "Spain" }
    ],
    "keywords": post.keywords.join(","),
    "mainEntityOfPage": `https://www.momaiagent.com/blog/${slug}`,
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.momaiagent.com/assets/logo.png"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | JupitLunar Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishDate} />
        <meta property="article:author" content={post.author} />
        <link rel="canonical" href={`https://www.momaiagent.com/blog/${slug}`} />
        <script type="application/ld+json">{JSON.stringify(blogPostingJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="pt-24">
          <article className="max-w-4xl mx-auto px-6 py-16">
            {/* Article Header */}
            <header className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-medium rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {post.author}</span>
                <span>
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </header>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900 prose-blockquote:bg-blue-50 prose-blockquote:border-l-blue-400 prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:leading-relaxed prose-p:mb-4 prose-blockquote:p-4 prose-blockquote:my-6 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link 
                to="/blog" 
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Back to Blog
              </Link>
            </div>
          </article>
        </main>

        <footer className="py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} JupitLunar · <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a>
        </footer>
      </div>
    </>
  );
};

export default BlogPost; 