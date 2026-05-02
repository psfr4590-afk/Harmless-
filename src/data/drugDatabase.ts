export const DRUG_DATA = [
  {
    category: 'Opioids',
    drugs: [
      {
        name: 'Heroin & Fentanyl',
        roas: [
          {
            method: 'Injection (IV)',
            safety: [
              'Use a new, sterile syringe for every injection to prevent HIV and Hep C.',
              'Clean the injection site with an alcohol swab before hitting.',
              'Use sterile water and clean cookers/cottons. Never share any prep equipment.',
              'Rotate injection sites allowing veins to heal.',
              'Push the plunger slowly to gauge strength.',
              'Test the supply for fentanyl and xylazine before use.',
              'Always keep Narcan (Naloxone) visible and accessible. Never use alone.'
            ]
          },
          {
            method: 'Snorting / Sniffing',
            safety: [
              'Use your own sterile sniffing device (clean straws/paper). NEVER share bills to prevent Hep C.',
              'Chop powder as finely as possible to aid rapid absorption and prevent nasal tearing.',
              'Rinse nostrils with sterile saline before and after to protect mucous membranes.',
              'Test the supply for fentanyl, especially when switching batches.'
            ]
          },
          {
            method: 'Smoking',
            safety: [
              'Use clean foil or a proper pipe.',
              'Avoid using plastic or painted materials as inhalers.',
              'Inhale slowly to gauge the potency, as fentanyl hits rapidly when smoked.',
              'Use lip balm to prevent chapped/cracked lips from transferring blood.'
            ]
          }
        ],
        overdose: [
          'Recognize: Blue/gray lips or nails, pinpoint pupils, shallow/stopped breathing, pale/clammy skin, "death rattle" gurgling sound.',
          'IMMEDIATELY CALL 911. The Good Samaritan Law protects you from prosecution for calling in an overdose in most states.',
          'Administer NARCAN (Naloxone) nasal spray into one nostril. If no response in 2-3 minutes, administer a second dose in the other nostril.',
          'Begin rescue breathing (1 breath every 5 seconds) if they are not breathing. Narcan needs oxygen to work effectively.',
          'If you must leave them, place them in the Recovery Position (on their side, knee bent, head supported) to prevent choking on vomit.'
        ],
        mixes: [
          'NEVER MIX WITH: BENZODIAZEPINES (Xanax, Valium) - Overwhelmingly the highest cause of fatal overdoses due to compound respiratory depression.',
          'NEVER MIX WITH: ALCOHOL - Greatly increases the chance of stopping breathing and choking on vomit.',
          'NEVER MIX WITH: GHB, Pregabalin, or other CNS Sedatives.'
        ],
        identification: 'Fentanyl often appears as white, tan, or blue-ish powder, or stamped into counterfeit pills (M30s). Black Tar heroin looks like dark sticky residue or dark rock.',
        testStrips: [
          'You MUST test all powders, crystals, and pressed pills for Fentanyl.',
          '1. Put a small amount of powder (approx. the size of a match head) in a clean cooker or cup.',
          '2. Add 1/2 teaspoon of water and mix well.',
          '3. Hold the test strip in the water by the blue end for 15 seconds.',
          '4. Lay flat and wait 3 minutes.',
          'ONE RED LINE: POSITIVE for Fentanyl. TWO RED LINES: NEGATIVE.',
          'Beware the "Chocolate Chip Cookie Effect": Fentanyl clumps differently than other powders. One side of a bag might have no fentanyl, while the other is pure fentanyl. Test the whole batch if possible by dissolving it.'
        ]
      },
      {
        name: 'Prescription Pills (Oxy, Roxy, Percocet, Dilaudid)',
        roas: [
          {
            method: 'Oral',
            safety: [
              'Chewing or crushing bypasses extended-release mechanisms—dose significantly lower if doing so to prevent overdose.',
              'Beware of counterfeit pressed pills—most street pills contain varying, lethal hotspots of fentanyl.',
              'Do NOT mix with alcohol or benzos (extreme risk of fatal respiratory depression).'
            ]
          },
          {
            method: 'Snorting',
            safety: [
              'Use your own straw/device. Do not share.',
              'Pill binders can heavily clog and damage nasal cavities; flush with saline.',
              'Start with a small fraction to test strength.'
            ]
          }
        ],
        overdose: [
          'See Opioid/Heroin overdose protocol. Narcan works on ALL prescription opioids, including Tramadol, Codeine, and Morphine.'
        ],
        mixes: [
          'Avoid mixing with Benzos, Alcohol, Sleep Aids (Ambien), or other sedatives.'
        ],
        identification: 'Counterfeit M30s are rampant. Real pharmaceutical pills have sharp, crisp edges, uniform coloring, a glossy coating, and a distinct snap when broken. Counterfeits crumble easily.',
        pillId: 'FAKE M30 WARNING: If the "M" stamp on an M30 pill has curved/rounded armpits (like an archway) instead of sharp, straight V-shaped armpits, IT IS FAKE AND CONTAINS FENTANYL. Fake pills also crumble easily, have chalky textures, or feature inconsistent blue dye spots.'
      },
      {
        name: 'Buprenorphine (Suboxone / Subutex)',
        roas: [
          {
            method: 'Sublingual (Under the tongue)',
            safety: [
              'Wait until you are in moderate to severe opioid withdrawal before taking, otherwise it will cause Precipitated Withdrawal (immediate, severe, agonizing withdrawal symptoms).',
              'Do not chew or swallow; it must absorb through mucous membranes.',
              'Prolonged use of strips can cause dental decay; rinse mouth thoroughly with water 15 minutes after dissolving.'
            ]
          }
        ],
        overdose: [
          'Buprenorphine has a "ceiling effect" making fatal overdose rare in adults with opioid tolerance, but it can be highly dangerous to opioid-naive individuals or children.',
          'Narcan (Naloxone) may require larger or repeated doses to reverse a buprenorphine overdose.'
        ],
        mixes: [
          'Dangerous to mix with strong Benzodiazepines or heavy Alcohol consumption due to compound respiratory depression.'
        ],
        identification: 'Suboxone comes in orange hexagonal tablets or orange square films. Subutex comes in white tablets.'
      },
      {
        name: 'Methadone',
        roas: [
          {
            method: 'Oral',
            safety: [
              'Extremely long half-life (up to 36+ hours). Do not re-dose quickly if you don\'t feel it immediately, as it builds up in the system.',
              'Measure liquid doses accurately with an oral syringe.'
            ]
          }
        ],
        overdose: [
          'Causes severe, prolonged respiratory depression.',
          'Narcan works, but because Methadone outlasts Narcan\'s effect, the person WILL slip back into an overdose. Constant monitoring and repeated Narcan doses in an ER are necessary.'
        ],
        mixes: [
          'NEVER MIX WITH: Benzodiazepines. This is a very common fatal combination.',
          'Drugs that prolong the QT interval (certain antipsychotics) can cause fatal heart arrhythmias when mixed with Methadone.'
        ],
        identification: 'Usually dispensed as a pink or clear liquid (Methadose), or white/peach wafers/pills.'
      },
      {
        name: 'Kratom (Mitragyna speciosa)',
        roas: [
          {
            method: 'Oral',
            safety: [
              'Use a scale to weigh doses; measuring by "teaspoons" is highly inaccurate and leads to high tolerance.',
              'Drink massive amounts of water, as kratom powder is severely dehydrating and causes severe constipation.',
              'Buy from vendors who provide third-party lab testing (heavy metals and adulterants are common in gas-station kratom).'
            ]
          }
        ],
        overdose: [
          'Most common "overdose" effect is the "wobbles" (nystagmus, extreme nausea, dizziness).',
          'Fatal respiratory depression is extremely rare with kratom alone, but risk heavily increases if adulterated or mixed with heavy downers.',
          'Lie down in a dark room and wait it out if experiencing the wobbles.'
        ],
        mixes: [
          'Do not mix with heavy sedatives or classic opioids.',
          'Mixing with stimulants increases anxiety, heart rate, and jitteriness.'
        ],
        identification: 'Green, brown, or red fine powder smelling similar to matcha tea, or encapsulated in gel-caps. Kratom extracts are sticky dark liquids.'
      }
    ]
  },
  {
    category: 'Stimulants',
    drugs: [
      {
        name: 'Cocaine / Crack',
        roas: [
          {
            method: 'Snorting',
            safety: [
              'Never share straws (Hep C risk). Avoid rolled currency/bills.',
              'Chop into an extremely fine powder to avoid chunks tearing the nasal cavity.',
              'Alternate nostrils and rinse with saline immediately following use sessions.',
              'Stay hydrated and monitor heart rate. Do not use alone.'
            ]
          },
          {
            method: 'Smoking (Crack)',
            safety: [
              'Use Pyrex stem and proper brass screens.',
              'Do not share stems to avoid Hep C transmission via burned/cracked lips.',
              'Let pipe cool between hits to prevent glass shattering or lip burns.',
              'Apply lip balm constantly.'
            ]
          },
          {
            method: 'Injection (IV)',
            safety: [
              'Cocaine is a local anesthetic; you may not feel tissue damage if you miss the vein.',
              'Use a new needle every time (cocaine requires frequent injections which rapidly dulls needles).',
              'Never share equipment.'
            ]
          }
        ],
        overdose: [
          '"Overamping" causes racing heart, extreme paranoia, hyperthermia, chest pain, stroke, or seizures.',
          'If seizing: Clear the floor of hazards, place on their side, put NOTHING in their mouth.',
          'If experiencing severe chest pain / heart attack symptoms, call 911 immediately. Tell paramedics they took cocaine so they don\'t administer beta-blockers.',
          'Cool them down with ice packs on the back of the neck/armpits.'
        ],
        mixes: [
          'NEVER MIX WITH: Alcohol (Forms Cocaethylene in the liver, which is highly cardiotoxic and vastly increases heart attack/stroke risk).',
          'NEVER MIX WITH: Tramadol (Lowers seizure threshold, inducing seizures).',
          'NEVER MIX WITH: MAOI Antidepressants (Fatal hypertensive crisis).'
        ],
        identification: 'White flaky powder. Crack is hard off-white rocks. Use Marquis, Mecke, or Mandelin reagents to test purity.',
        testStrips: [
          'FTS on cocaine are critical due to accidental cross-contamination on dealer scales.',
          'Cocaine requires MORE dilution than opioids or you will trigger a False Positive. Add 10 teaspoons of water per 10mg of cocaine.',
          'Testing the residue: Add water directly to the empty baggie, swish to capture everything, then test that water.',
          'ONE line = POSITIVE. TWO lines = NEGATIVE.'
        ]
      },
      {
        name: 'Methamphetamine',
        roas: [
          {
            method: 'Smoking',
            safety: [
              'Use a clean glass bubble pipe. Avoid applying direct flame to the glass to prevent shattering.',
              'Do not share pipes.',
              'Maintain intensive oral hygiene (brush teeth daily, drink immense water to prevent "meth mouth").'
            ]
          },
          {
            method: 'Injection (IV)',
            safety: [
              'Meth is extremely caustic and will rapidly destroy tissue if missed, causing severe abscesses.',
              'Ensure full registration in the vein.',
              'Use new syringe every time.'
            ]
          },
          {
            method: 'Oral / Snorting',
            safety: [
              'Oral consumption provides a much smoother, longer duration with less compulsive redosing.',
              'Snorting is extremely painful and damages cartilage rapidly due to sheer causticity.'
            ]
          }
        ],
        overdose: [
          'Risk of severe psychosis, hyperthermia (fatal overheating), or cardiac arrest.',
          'Move them to a quiet, cool physical environment. Provide water but do not let them chug massively.',
          'Do not restrain if panicked or violent, unless they are a danger to themselves. Call 911 for severe distress.'
        ],
        mixes: [
          'NEVER MIX WITH: Ayahuasca / MAOIs (Fatal hypertensive crisis).',
          'NEVER MIX WITH: Tramadol, synthetic cathinones (Bath Salts).'
        ],
        identification: 'Clear or cloudy crystalline shards. Reagent test with Marquis (turns orange-brown).',
        testStrips: [
          'Methamphetamine requires significantly more water dilution when testing compared to opioids to avoid False Positives.',
          'Follow specific test strip brand instructions for exact water-to-powder ratios.'
        ]
      },
      {
        name: 'MDMA (Ecstasy / Molly)',
        roas: [
          { 
            method: 'Oral', 
            safety: [
              'If taking pills, swallow half first. Wait 90 minutes. Do not redose early.',
              'Regulate body temperature. Take breaks from dancing/hot environments every 30 minutes.',
              'Sip water slowly (1-2 cups an hour max). Do not chug massive amounts to avoid fatal hyponatremia.'
            ] 
          }
        ],
        overdose: [
          'Overdoses are heavily linked to Hyperthermia (heatstroke) and Dehydration, or Water Intoxication.',
          'Serotonin Syndrome occurs from mixing with wrong meds: symptoms include rigid vibrating muscles, heavy sweating, extreme confusion, and seizures.',
          'In emergency: Cool them down with ice on neck/armpits. If seizing, call 911 immediately.'
        ],
        mixes: [
          'NEVER MIX WITH: MAOI Antidepressants (Fatal Serotonin Syndrome).',
          'NEVER MIX WITH: 5-HTP taken within 24 hours of MDMA.',
          'Mixing with SSRI antidepressants (Lexapro, Zoloft) will severely blunt or entirely cancel the roll.'
        ],
        identification: 'Tan/brown/white crystals or colored pressed pills with logos.',
        pillId: 'MDMA presses are notorious for being cut with Methamphetamine, PMMA, or pure Caffeine. YOU CANNOT ID THEM BY SIGHT. You MUST use a Marquis Reagent (Should rapidly turn dark purple/black).'
      },
      {
        name: 'Prescription Stimulants (Adderall, Ritalin, Vyvanse)',
        roas: [{ method: 'Oral', safety: ['Take early in the day to prevent severe insomnia.', 'Force yourself to eat high-protein meals and drink water.'] }],
        overdose: [
          'Symptoms include severe chest pain, extreme tachycardia (racing heart, 140+ BPM), and panic attacks.',
          'Move to a quiet, dim environment. Use breathing exercises.',
          'Seek emergency attention if chest pain radiates to the arm or jaw.'
        ],
        mixes: [
          'NEVER MIX WITH: MAOIs (Fatal hypertensive crisis).',
          'Avoid taking with heavy doses of caffeine or energy drinks.'
        ],
        identification: 'Legitimate pharma pills have a sharp, clean snap and uniform precise stamping.',
        pillId: 'FAKE ADDERALL WARNING: Formatted as orange AD 30 pills, the vast majority sold on the street or darknet are purely Methamphetamine. They are chalky, easily crumble, and often snap incorrectly. ALWAYS fentanyl test street Adderall.'
      },
      {
        name: 'Synthetic Cathinones (Bath Salts, Flakka, 3-MMC, 4-MMC)',
        roas: [
          { method: 'Snorting / Oral / IV', safety: ['Highly compulsive redosing profile. Set a strict limit before starting.', 'Monitor heart rate constantly. Do not binge for multiple days due to rapid onset of stimulant psychosis.'] }
        ],
        overdose: [
          'Extreme stimulant psychosis, aggressive behavior, extreme hyperthermia, and organ failure.',
          'Medical intervention often requires heavy sedation (IV benzodiazepines) in the ER.'
        ],
        mixes: [
          'Extremely dangerous to mix with other stimulants (Cocaine, Meth) or MAOI antidepressants.'
        ],
        identification: 'White or tan powders/crystals with a distinct licorice, vanilla, or heavy chemical "dirty" smell.',
        testStrips: ['Test all powders. Use Marquis and Mecke reagents to differentiate from authentic MDMA or Cocaine.']
      }
    ]
  },
  {
    category: 'Depressants & Sedatives',
    drugs: [
      {
        name: 'Benzodiazepines (Xanax, Valium, Klonopin, Ativan)',
        roas: [
          {
            method: 'Oral / Sublingual',
            safety: [
              'NEVER COMBINE depressants (Benzos + Alcohol + Opioids = Highest risk of fatal overdose).',
              'Beware of pressed street Xanax containing potent designer benzos (RCs).',
              'If physically dependent, NEVER quit cold turkey. Withdrawal can cause fatal seizures. Taper slowly under medical supervision using a long-acting benzo like Valium.'
            ]
          }
        ],
        overdose: [
          'Loss of coordination, "delusions of sobriety" (thinking you are sober when heavily intoxicated), blackouts lasting days, respiratory depression if combined with other downers.',
          'If someone is unarousable or breathing dangerously slow, call 911 immediately.',
          'Prop them in the Recovery Position if you cannot wake them to prevent choking on vomit.'
        ],
        mixes: [
          'NEVER MIX WITH: OPIOIDS (Fatal respiratory depression).',
          'NEVER MIX WITH: ALCOHOL (Fatal respiratory depression/massive blackouts).',
          'NEVER MIX WITH: GHB, Ketamine, or Barbiturates.'
        ],
        identification: 'Prescription pills or street presses (rectangles/bars).',
        pillId: 'FAKE XANAX WARNING: Street "bars" are rarely Alprazolam. Most are pressed with ultra-potent research chemical benzos (Clonazolam, Flualprazolam, Bromazolam) that cause multi-day blackouts, or they are laced with Fentanyl.'
      },
      {
        name: 'GHB / GBL / 1,4-BDO',
        roas: [
          { 
            method: 'Oral', 
            safety: [
              'Measure exact mL with a medical oral syringe. NEVER sip from a water bottle.',
              'Dose-response curve is incredibly steep. An extra 1mL can be the difference between euphoria and a coma.',
              'Add food coloring to the bottle so no one accidentally drinks it.'
            ] 
          }
        ],
        overdose: [
          '"G-ing out" (falling into an unarousable coma-like sleep) is common when slightly over-dosed.',
          'You MUST place them in the Recovery Position so they do not choke on vomit.',
          'If breathing drops below 8 breaths per minute, lips turn blue, or they seize, call 911 immediately.'
        ],
        mixes: [
          'NEVER MIX WITH: ALCOHOL (Extremely fatal interaction. Even one beer + GHB can stop breathing).',
          'NEVER MIX WITH: Ketamine, Opioids, Benzos.'
        ],
        identification: 'Usually a clear liquid. GHB tastes salty/soapy. GBL/1,4-BDO tastes highly chemical/solvent-like and can melt some plastics.'
      },
      {
        name: 'Z-Drugs (Ambien, Zopiclone, Lunesta)',
        roas: [
          { method: 'Oral', safety: ['Take ONLY while actually in bed, ready to sleep. They cause sleepwalking and bizarre blackout behavior if forced to stay awake.'] }
        ],
        overdose: [
          'Similar to benzos: heavy sedation, poor coordination, respiratory depression.',
          'Monitor breathing and use the recovery position.'
        ],
        mixes: [
          'Do not mix with Alcohol, Opioids, or other CNS depressants.'
        ],
        identification: 'Prescription pills. Do not buy on the street.'
      }
    ]
  },
  {
    category: 'Dissociatives',
    drugs: [
      {
        name: 'Ketamine',
        roas: [
          {
            method: 'Snorting',
            safety: [
              'Crush crystals completely into fine powder before sniffing.',
              'Heavy usage causes permanent, severe bladder and urinary tract damage (Ketamine Cystitis). Avoid daily or heavy chronic use.',
              'Spit the "drip" out; swallowing it increases stomach cramping and bladder damage.'
            ]
          },
          {
            method: 'Injection (IM)',
            safety: [
              'Intramuscular (IM) injection hits much harder and faster. Ensure absolute sterile technique to prevent extremely deep muscle abscesses.'
            ]
          }
        ],
        overdose: [
          'A massive dose induces a "K-hole" (deep anesthesia).',
          'Choking on vomit is the primary risk. Prop them in the Recovery Position and do not leave them until motor control returns.',
          'Do NOT put them in a bath or body of water. They will drown.'
        ],
        mixes: [
          'NEVER MIX WITH: ALCOHOL (High risk of vomiting while anesthetized, fatal aspiration).',
          'NEVER MIX WITH: GHB, Opioids, Benzos (compounds sedation).'
        ],
        identification: 'Fine white crystals, rods, or powder. Use a Morris reagent (should turn purple).'
      },
      {
        name: 'DXM (Dextromethorphan)',
        roas: [
          { method: 'Oral', safety: ['Only use products where Dextromethorphan (DXM) is the EXACT AND ONLY active ingredient.'] }
        ],
        overdose: [
          'Taking products with Acetaminophen (Tylenol), Guaifenesin, or CPM will cause liver failure, severe vomiting, or internal bleeding.',
          'Overdoses of pure DXM lead to extreme tachycardia, serotonin syndrome risk, and prolonged psychosis.'
        ],
        mixes: [
          'NEVER MIX WITH: MAOIs or SSRIs (High risk of fatal Serotonin Syndrome).',
          'NEVER MIX WITH: MDMA.'
        ],
        identification: 'Found in OTC cough syrups (Robitussin, Delsym) or gels.'
      },
      {
        name: 'PCP & Analogues (3-MeO-PCP, O-PCE)',
        roas: [
          { method: 'Smoking / Snorting / Oral', safety: ['Dose extremely carefully. Milligram variations are the difference between stimulation and extreme mania.', 'Use a highly accurate mg scale.'] }
        ],
        overdose: [
          'Can induce powerful mania, delusions, severe psychosis, and hyperthermia.',
          'Individuals may not feel pain and can accidentally injure themselves severely while manic.',
          'Call 911 for severe agitation or hyperthermia; ERs will sedate with benzos/antipsychotics.'
        ],
        mixes: [
          'Mixing with stimulants (Meth/Cocaine) almost guarantees severe mania and psychosis.',
          'Mixing with depressants causes heavy respiratory issues.'
        ],
        identification: 'PCP is often liquid sprayed onto mint or weed (Dipper, Sherm). Analogues are fine powders.'
      }
    ]
  },
  {
    category: 'Psychedelics',
    drugs: [
      {
        name: 'LSD (Acid)',
        roas: [{ method: 'Sublingual', safety: ['Set and Setting are paramount. Take in a safe, controlled environment.', 'Have a sober trip sitter present.'] }],
        overdose: [
          'Physical overdose is rare, but extreme psychological distress ("bad trip") requires grounding techniques.',
          'Change the lighting, music, or room to shift the trip\'s direction.',
          'Benzodiazepines or Antipsychotics (Seroquel) are used to "kill" or blunt intense trips in an emergency.'
        ],
        mixes: [
          'NEVER MIX WITH: LITHIUM (Guaranteed fatal seizures and extreme psychosis).',
          'NEVER MIX WITH: Tramadol (High risk of seizures).',
          'Mixing with Marijuana vastly intensifies visuals and paranoia (the #1 cause of bad trips).'
        ],
        identification: 'Found on blotter paper, gel tabs, or liquid drops.',
        testStrips: ['You MUST test LSD blotter paper with an Ehrlich Reagent kit. If it does not turn pink/purple, it is likely an NBOMe compound (fake acid), which can cause fatal overdoses and seizures. If "Acid" tastes extremely metallic/bitter and numbs the tongue, SPIT IT OUT.']
      },
      {
        name: 'Psilocybin (Mushrooms)',
        roas: [{ method: 'Oral', safety: ['Can cause extreme nausea during onset. Brewing as a tea with ginger heavily lessens stomach pain.', 'Start low (1-2g) and wait fully.'] }],
        overdose: [
          'Psychological distress protocol is identical to LSD.',
          'Ensure the mushrooms were not falsely identified toxic wild mushrooms.'
        ],
        mixes: [
          'Mixing with Cannabis dramatically increases intensity.',
          'SSRIs (Zoloft, Lexapro) will significantly reduce or block the trip.'
        ],
        identification: 'Dried fungal caps/stems showing blue bruising where handled.'
      },
      {
        name: 'DMT (Dimethyltryptamine)',
        roas: [
          { method: 'Smoking / Vaporizing', safety: ['Effects are instantaneous and immensely powerful. You will lose total connection with reality in seconds.', 'Always sit or lie down before inhaling. Do not stand up. Have a sitter to take the hot pipe from your hand.'] }
        ],
        overdose: [
          'Lasts only 5-15 minutes, but feels like an eternity. Sitters should remain quiet and simply ensure physical safety until they return.'
        ],
        mixes: [
          'Mixing with MAOIs (like Syrian Rue) turns DMT into an hours-long Ayahuasca trip. Do not do this without extensive research and dietary restriction preparation.'
        ],
        identification: 'Yellow, orange, or white crystalline powder smelling distinctly like mothballs or new sneakers.'
      }
    ]
  },
  {
    category: 'Cannabinoids',
    drugs: [
      {
        name: 'Marijuana (THC / Cannabis)',
        roas: [
          { method: 'Smoking / Vaping', safety: ['Start slow with high-THC concentrates (dabs) to avoid panic attacks. Keep glass rigs clean.'] },
          { method: 'Edibles (Oral)', safety: ['Onset takes 1-2 hours. Do NOT take more because "you don\'t feel it yet." Wait fully 2.5 hours before redosing.', 'Start with 5-10mg for beginners.'] }
        ],
        overdose: [
          '"Greening out": Extreme dizziness, severe panic attacks, intense nausea/vomiting, paranoia.',
          'It is not physically fatal. Hydrate, eat something sugary, lie down in a dark room, and sleep it off. Chewing black peppercorn can help reduce paranoia.'
        ],
        mixes: [
          'Mixing with alcohol (Cross-fading) usually results in severe nausea/spins if weed is smoked AFTER drinking.'
        ],
        identification: 'Green/purple plant matter, sticky concentrates, or branded edibles.'
      },
      {
        name: 'Synthetic Cannabinoids (Spice, K2, Delta-8/9/10 Carts)',
        roas: [
          { method: 'Smoking / Vaping', safety: ['Gas-station Delta-8 carts often fail heavy-metal or solvent lab tests. Buy reputable brands.', 'Traditional "Spice" (JWH/AM/5F analogs) is exceedingly dangerous, avoid entirely.'] }
        ],
        overdose: [
          'K2/Spice overdoses can cause seizures, extreme psychosis, vomiting, and kidney failure.',
          'Treat as a medical emergency if extreme rigidity, seizing, or unresponsiveness occurs.'
        ],
        mixes: [
          'Highly unpredictable when mixed with any other substances.'
        ],
        identification: 'Sprayed plant matter (Spice) or vape cartridges. Real cannabis rarely causes seizures.'
      }
    ]
  },
  {
    category: 'Inhalants',
    drugs: [
      {
        name: 'Nitrous Oxide (Whip-Its)',
        roas: [
          { method: 'Inhalation', safety: ['Never use bags/masks over your face', 'Always sit down before inhaling.', 'Dispense from a cracker into a balloon, NEVER inhale directly from a cracker/dispenser (can cause fatal freezing/frostbite to lungs/throat).', 'Supplement Vitamin B12; heavy use stops B12 absorption leading to irreversible nerve damage and paralysis.'] }
        ],
        overdose: [
          'Nitrous risk is asphyxiation (displacing oxygen to the point of passing out/brain damage).',
          'Administer fresh air immediately. Ensure they are seated.'
        ],
        mixes: [
          'Extremely dangerous standing up or near ledges.'
        ],
        identification: 'Silver steel chargers.'
      },
      {
        name: 'Poppers (Alkyl Nitrites)',
        roas: [
          { method: 'Inhalation', safety: ['Sniff the fumes from the bottle, NEVER drink the liquid (fatal).', 'Do not get liquid on skin/eyes (causes chemical burns).'] }
        ],
        overdose: [
          'Can cause extreme drop in blood pressure, fainting, and cyanosis (blue lips/skin from lack of oxygen).'
        ],
        mixes: [
          'POPPERS FATAL MIX: NEVER mix Alkyl Nitrites (Poppers) with Erectile Dysfunction meds (Viagra, Cialis). This causes an irreversible, fatal drop in blood pressure.',
          'Avoid Depressants with Inhalants due to vomit/loss of consciousness risk.'
        ],
        identification: 'Small bottles sold as "Video Head Cleaner" or "Room Odorizer".'
      }
    ]
  }
];
