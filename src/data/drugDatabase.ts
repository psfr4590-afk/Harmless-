export const DATA_REVIEW_DATE = '2026-10-02';

export const DATA_SOURCES = [
  { name: 'CDC Overdose Prevention Data Channel', url: 'https://www.cdc.gov/overdose-prevention/data-channel/' },
  { name: 'CDC Overdose Prevention', url: 'https://www.cdc.gov/overdose-prevention/' },
  { name: 'CDC Fentanyl Information', url: 'https://www.cdc.gov/overdose-prevention/about/fentanyl.html' },
  { name: 'SAMHSA Opioid Overdose Prevention and Reversal', url: 'https://www.samhsa.gov/substance-use/treatment/overdose-prevention' },
  { name: 'NIDA Research Topics by Substance', url: 'https://nida.nih.gov/drugabuse.html' },
  { name: 'NIDA Psychedelic and Dissociative Drugs', url: 'https://nida.nih.gov/Infofacts/LSD-Sp.html' }
];

const CATEGORY_SOURCES = {
  Opioids: [DATA_SOURCES[0], DATA_SOURCES[1], DATA_SOURCES[2], DATA_SOURCES[3], DATA_SOURCES[4]],
  Stimulants: [DATA_SOURCES[0], DATA_SOURCES[3], DATA_SOURCES[4]],
  'Depressants & Sedatives': [DATA_SOURCES[0], DATA_SOURCES[2], DATA_SOURCES[3], DATA_SOURCES[4]],
  Dissociatives: [DATA_SOURCES[3], DATA_SOURCES[4]],
  Psychedelics: [DATA_SOURCES[3], DATA_SOURCES[4]],
  Cannabinoids: [DATA_SOURCES[3]],
  Inhalants: [DATA_SOURCES[3]]
};

export const DRUG_DATA = [
  {
    category: 'Opioids',
    sources: CATEGORY_SOURCES["Opioids"],
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
              'Do not use subjective effect as a reliable measure of potency or safety.',
              'Test the supply for fentanyl and xylazine before use.',
              'Always keep Narcan (Naloxone) visible and accessible. Never use alone.'
            ]
          },
          {
            method: 'Snorting / Sniffing',
            safety: [
              'Use your own sterile sniffing device (clean straws/paper). NEVER share bills to prevent Hep C.',
              'Do not treat preparation technique as a guarantee of reduced harm; nasal injury and unpredictable absorption remain possible.',
              'Rinse nostrils with sterile saline before and after to protect mucous membranes.',
              'Test the supply for fentanyl, especially when switching batches.'
            ]
          },
          {
            method: 'Smoking',
            safety: [
              'Use clean foil or a proper pipe.',
              'Avoid using plastic or painted materials as inhalers.',
              'Do not use subjective onset or intensity to estimate potency or safety.',
              'Use lip balm to prevent chapped/cracked lips from transferring blood.'
            ]
          }
        ],
        overdose: [
          'Recognize: Blue/gray lips or nails, pinpoint pupils, shallow/stopped breathing, pale/clammy skin, "death rattle" gurgling sound.',
          'If someone is not breathing normally or cannot be awakened, contact the local emergency service for the country you are in. Legal protections for calling for help vary by jurisdiction.',
          'Give naloxone according to the product instructions. If there is no response, continue emergency response and follow the product instructions for additional doses.',
          'Begin rescue breathing (1 breath every 5 seconds) if they are not breathing. Naloxone reverses opioid effects but does not replace rescue breathing or emergency medical care when breathing is absent or inadequate.',
          'If you must leave them, place them in the Recovery Position (on their side, knee bent, head supported) to prevent choking on vomit.'
        ],
        mixes: [
          'Avoid combining opioids with benzodiazepines, alcohol, or other central-nervous-system depressants because combined use can substantially increase overdose and respiratory-depression risk.',
          'Avoid combining with: ALCOHOL - Greatly increases the chance of stopping breathing and choking on vomit.',
          'Avoid combining with: GHB, Pregabalin, or other CNS Sedatives.'
        ],
        identification: 'Fentanyl often appears as white, tan, or blue-ish powder, or stamped into counterfeit pills (M30s). Black Tar heroin looks like dark sticky residue or dark rock.',
        testStrips: [
          'Fentanyl test strips may provide limited screening information when used according to the specific product instructions. A negative result does not prove absence.',
          '1. Put a small amount of powder (approx. the size of a match head) in a clean cooker or cup.',
          '2. Add 1/2 teaspoon of water and mix well.',
          '3. Hold the test strip in the water by the blue end for 15 seconds.',
          '4. Lay flat and wait 3 minutes.',
          'Interpret the test only according to the instructions supplied with the specific test-strip product. A negative result does not prove that fentanyl or other potent synthetic opioids are absent.',
          'Beware the "Chocolate Chip Cookie Effect": Fentanyl clumps differently than other powders. One side of a bag might have no fentanyl, while the other is pure fentanyl. Test the whole batch if possible by dissolving it.'
        ]
      },
      {
        name: 'Prescription Pills (Oxy, Roxy, Percocet, Dilaudid)',
        roas: [
          {
            method: 'Oral',
            safety: [
              'Do not crush, chew, or alter extended-release medicines unless the product instructions or a pharmacist specifically says the formulation can be altered.',
              'Beware of counterfeit pressed pills—most street pills contain varying, lethal hotspots of fentanyl.',
              'Combining opioids with alcohol, benzodiazepines, or other depressants can substantially increase respiratory-depression and overdose risk.'
            ]
          },
          {
            method: 'Snorting',
            safety: [
              'Use your own straw/device. Do not share.',
              'Pill binders can heavily clog and damage nasal cavities; flush with saline.',
              'Do not rely on a small test amount as a reliable measure of potency; potency can be unpredictable.'
            ]
          }
        ],
        overdose: [
          'See Opioid/Heroin overdose protocol. Naloxone can reverse opioid effects, but response varies by opioid and dose. Repeat doses and emergency medical care may be needed, especially with long-acting or high-potency opioids.'
        ],
        mixes: [
          'Avoid mixing with Benzos, Alcohol, Sleep Aids (Ambien), or other sedatives.'
        ],
        identification: 'Counterfeit M30s are rampant. Appearance alone cannot reliably distinguish genuine medication from counterfeit pills. Use a pharmacist or an authoritative imprint/product-identification service rather than treating visual traits as proof of authenticity.',
        pillId: 'Counterfeit-pill warning: imprint, color, texture, and logo appearance cannot reliably establish authenticity or contents. Pills obtained outside a legitimate pharmacy may contain unexpected potent drugs. Do not treat visual traits as proof.'
      },
      {
        name: 'Buprenorphine (Suboxone / Subutex)',
        roas: [
          {
            method: 'Sublingual (Under the tongue)',
            safety: [
              'Buprenorphine initiation timing can affect withdrawal symptoms. Follow the current prescribing instructions and clinician guidance for the specific formulation and treatment plan.',
              'Do not chew or swallow; it must absorb through mucous membranes.',
              'Transmucosal buprenorphine can cause serious dental problems. After the medicine has completely dissolved, follow the current FDA oral-care guidance, including rinsing gently with water and waiting at least 1 hour before brushing.'
            ]
          }
        ],
        overdose: [
          'Buprenorphine can cause serious or life-threatening effects, especially when combined with other central-nervous-system depressants or when taken by people for whom it was not prescribed.',
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
              'For prescribed liquid medication, use the measuring device supplied or recommended by the pharmacist.'
            ]
          }
        ],
        overdose: [
          'Causes severe, prolonged respiratory depression.',
          'Naloxone may wear off before methadone does. Continue monitoring, call emergency services, and follow the naloxone product instructions for repeat doses.'
        ],
        mixes: [
          'Avoid combining methadone with benzodiazepines or other central-nervous-system depressants unless directed by the treating clinician; combined use can increase serious respiratory and sedation risks.',
          'Drugs that prolong the QT interval (certain antipsychotics) can cause life-threatening heart arrhythmias when mixed with Methadone.'
        ],
        identification: 'Usually dispensed as a pink or clear liquid (Methadose), or white/peach wafers/pills.'
      },
      {
        name: 'Kratom (Mitragyna speciosa)',
        roas: [
          {
            method: 'Oral',
            safety: [
              'Household-volume measurements are unreliable for variable products. Product strength and individual response can differ substantially.',
              'Avoid excessive water intake. Sip fluids as needed and seek medical care for severe vomiting, confusion, fainting, breathing problems, or other concerning symptoms.',
              'Buy from vendors who provide third-party lab testing (heavy metals and adulterants are common in gas-station kratom).'
            ]
          }
        ],
        overdose: [
          'Most common "overdose" effect is the "wobbles" (nystagmus, extreme nausea, dizziness).',
          'Serious poisoning has been reported with kratom, and risks can increase with adulterated products or combinations with other substances.',
          'Lie down in a dark room and wait it out if experiencing the wobbles.'
        ],
        mixes: [
          'Combining with other sedating drugs can increase adverse effects and overdose risk.',
          'Combining substances can increase anxiety, cardiovascular strain, and other adverse effects.'
        ],
        identification: 'Green, brown, or red fine powder smelling similar to matcha tea, or encapsulated in gel-caps. Kratom extracts are sticky dark liquids.'
      }
    ]
  },
  {
    category: 'Stimulants',
    sources: CATEGORY_SOURCES["Stimulants"],
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
          'If experiencing severe chest pain / heart attack symptoms, contact the local emergency service immediately. Tell paramedics about cocaine or stimulant use so they can choose treatment based on the full clinical situation.',
          'Cool them down with ice packs on the back of the neck/armpits.'
        ],
        mixes: [
          'Avoid combining with: Alcohol (Forms Cocaethylene in the liver, which is highly cardiotoxic and vastly increases heart attack/stroke risk).',
          'Avoid combining with: Tramadol (Lowers seizure threshold, inducing seizures).',
          'Avoid combining with: MAOI Antidepressants (potentially life-threatening hypertensive crisis).'
        ],
        identification: 'White flaky powder. Crack is hard off-white rocks. Use Marquis, Mecke, or Mandelin reagents to test purity.',
        testStrips: [
          'FTS on cocaine are critical due to accidental cross-contamination on dealer scales.',
          'Fentanyl test-strip instructions vary by product and substance. Follow the current instructions supplied with the specific test strip; stimulant samples can require substantially more dilution than opioid samples, and an incorrect dilution can affect results.',
          'Follow the specific product instructions for sample preparation and dilution; procedures differ by substance and test-strip product.',
          'Interpret fentanyl-test-strip lines only according to the instructions supplied with the specific product and sample type; test results have limitations and do not establish safety.'
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
          'Risk includes severe psychosis, dangerous hyperthermia, cardiovascular complications, or other medical emergencies.',
          'Move them to a quiet, cool physical environment. Provide water but do not let them chug massively.',
          'Do not restrain if panicked or violent, unless they are a danger to themselves. contact the local emergency service for severe distress.'
        ],
        mixes: [
          'Avoid combining with: Ayahuasca / MAOIs (potentially life-threatening hypertensive crisis).',
          'Avoid combining with: Tramadol, synthetic cathinones (Bath Salts).'
        ],
        identification: 'Clear or cloudy crystalline shards. Reagent test with Marquis (turns orange-brown).',
        testStrips: [
          'Follow the specific test-strip instructions for methamphetamine and other stimulant samples; dilution requirements are product- and substance-dependent.',
          'Follow specific test strip brand instructions for exact water-to-powder ratios.'
        ]
      },
      {
        name: 'MDMA (Ecstasy / Molly)',
        roas: [
          { 
            method: 'Oral', 
            safety: [
              'Pressed pills can contain unexpected substances. Do not assume a pill is accurately dosed or identified from appearance; follow evidence-based guidance for the specific product.',
              'Regulate body temperature. Take breaks from dancing/hot environments every 30 minutes.',
              'Sip fluids as needed rather than forcing large amounts. Excessive water intake can itself be dangerous.'
            ] 
          }
        ],
        overdose: [
          'Overdoses are heavily linked to Hyperthermia (heatstroke) and Dehydration, or Water Intoxication.',
          'Serotonin Syndrome occurs from mixing with wrong meds: symptoms include rigid vibrating muscles, heavy sweating, extreme confusion, and seizures.',
          'In emergency: Cool them down with ice on neck/armpits. If seizing, contact the local emergency service immediately.'
        ],
        mixes: [
          'Avoid combining with: MAOI Antidepressants (potentially life-threatening serotonin syndrome).',
          'Avoid combining with: 5-HTP taken within 24 hours of MDMA.',
          'SSRIs and other serotonergic medicines can alter MDMA effects and may contribute to medication interactions. Do not treat a subjective change in effects as evidence of safety.'
        ],
        identification: 'Tan/brown/white crystals or colored pressed pills with logos.',
        pillId: 'Pressed MDMA products can contain unexpected substances. Appearance alone cannot establish identity, purity, or safety; reagent tests also have limitations and do not confirm contents.'
      },
      {
        name: 'Prescription Stimulants (Adderall, Ritalin, Vyvanse)',
        roas: [{ method: 'Oral', safety: ['Follow the prescribed product directions and discuss timing or sleep effects with a clinician or pharmacist.', 'Maintain ordinary hydration and nutrition as tolerated; seek medical advice for concerning symptoms.'] }],
        overdose: [
          'Symptoms include severe chest pain, extreme tachycardia (racing heart, 140+ BPM), and panic attacks.',
          'Move to a quiet, dim environment. Use breathing exercises.',
          'Seek emergency attention if chest pain radiates to the arm or jaw.'
        ],
        mixes: [
          'Avoid combining with: MAOIs (potentially life-threatening hypertensive crisis).',
          'Avoid taking with heavy doses of caffeine or energy drinks.'
        ],
        identification: 'Legitimate pharma pills have a sharp, clean snap and uniform precise stamping.',
        pillId: 'Counterfeit stimulant warning: pills obtained outside a legitimate pharmacy may contain unexpected stimulants or fentanyl. Color, imprint, texture, and shape cannot establish authenticity. Use an authoritative imprint service and consider drug-checking resources where available.'
      },
      {
        name: 'Synthetic Cathinones (Bath Salts, Flakka, 3-MMC, 4-MMC)',
        roas: [
          { method: 'Snorting / Oral / IV', safety: ['Highly compulsive redosing profile. Do not assume a preset personal limit makes repeated use safe; potency and individual response are unpredictable.', 'Monitor heart rate constantly. Do not binge for multiple days due to rapid onset of stimulant psychosis.'] }
        ],
        overdose: [
          'Extreme stimulant psychosis, aggressive behavior, extreme hyperthermia, and organ failure.',
          'Severe stimulant toxicity may require emergency medical treatment; medication choices are made by clinicians based on the presentation.'
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
    sources: CATEGORY_SOURCES["Depressants & Sedatives"],
    drugs: [
      {
        name: 'Benzodiazepines (Xanax, Valium, Klonopin, Ativan)',
        roas: [
          {
            method: 'Oral / Sublingual',
            safety: [
              'Combining central-nervous-system depressants, including benzodiazepines, alcohol, and opioids, can substantially increase overdose and respiratory-depression risk.',
              'Beware of pressed street Xanax containing potent designer benzos (RCs).',
              'Abrupt benzodiazepine discontinuation can cause serious withdrawal, including seizures. If physically dependent, discontinuation should be planned with a qualified clinician rather than stopped abruptly.'
            ]
          }
        ],
        overdose: [
          'Loss of coordination, "delusions of sobriety" (thinking you are sober when heavily intoxicated), blackouts lasting days, respiratory depression if combined with other downers.',
          'If someone is unarousable or breathing abnormally slowly, contact the local emergency service immediately.',
          'Prop them in the Recovery Position if you cannot wake them to prevent choking on vomit.'
        ],
        mixes: [
          'Avoid combining with: OPIOIDS (life-threatening respiratory depression).',
          'Avoid combining with: ALCOHOL (life-threatening respiratory depression/massive blackouts).',
          'Avoid combining with: GHB, Ketamine, or Barbiturates.'
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
              'For liquid GHB/GBL/1,4-BDO products, measurement errors can materially change exposure. Do not use beverage containers as measuring devices.',
              'Dose-response curve is incredibly steep. An extra 1mL can be the difference between euphoria and a coma.',
              'Keep products clearly labeled and physically separated from drinks or other ingestible liquids.'
            ] 
          }
        ],
        overdose: [
          '"G-ing out" (falling into an unarousable coma-like sleep) is common when slightly over-dosed.',
          'If an unresponsive person is breathing, placing them in a recovery position can help reduce aspiration risk while emergency help is obtained.',
          'If breathing drops below 8 breaths per minute, lips turn blue, or they seize, contact the local emergency service immediately.'
        ],
        mixes: [
          'Avoid combining with: ALCOHOL (potentially life-threatening interaction. Even one beer + GHB can stop breathing).',
          'Avoid combining with: Ketamine, Opioids, Benzos.'
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
    sources: CATEGORY_SOURCES["Dissociatives"],
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
          'Avoid combining with: ALCOHOL (High risk of vomiting while anesthetized, life-threatening aspiration).',
          'Avoid combining with: GHB, Opioids, Benzos (compounds sedation).'
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
          'Some serotonergic medicines, including MAOIs, can interact with psychoactive substances. The risk and clinical significance depend on the specific substances and person; seek professional guidance.',
          'Avoid combining with: MDMA.'
        ],
        identification: 'Found in OTC cough syrups (Robitussin, Delsym) or gels.'
      },
      {
        name: 'PCP & Analogues (3-MeO-PCP, O-PCE)',
        roas: [
          { method: 'Smoking / Snorting / Oral', safety: ['Milligram-scale variation can materially change effects and risk; fixed dosing guidance is not provided here.', 'A precise scale does not make an unknown substance or dose safe or accurately identified.'] }
        ],
        overdose: [
          'Can induce powerful mania, delusions, severe psychosis, and hyperthermia.',
          'Individuals may not feel pain and can accidentally injure themselves severely while manic.',
          'Contact the local emergency service for severe agitation, hyperthermia, unresponsiveness, or other severe symptoms. Treatment decisions belong to clinicians.'
        ],
        mixes: [
          'Mixing with stimulants (Meth/Cocaine) can substantially increase the risk of severe agitation, mania, or psychosis.',
          'Mixing with depressants causes heavy respiratory issues.'
        ],
        identification: 'PCP is often liquid sprayed onto mint or weed (Dipper, Sherm). Analogues are fine powders.'
      }
    ]
  },
  {
    category: 'Psychedelics',
    sources: CATEGORY_SOURCES["Psychedelics"],
    drugs: [
      {
        name: 'LSD (Acid)',
        roas: [{ method: 'Sublingual', safety: ['Set and Setting are paramount. Take in a safe, controlled environment.', 'Have a sober trip sitter present.'] }],
        overdose: [
          'Physical overdose is rare, but extreme psychological distress ("bad trip") requires grounding techniques.',
          'Change the lighting, music, or room to shift the trip\'s direction.',
          'Do not self-treat severe intoxication with prescription sedatives or antipsychotics; seek emergency medical care for severe symptoms.'
        ],
        mixes: [
          'Lithium has been associated with serious adverse reactions when combined with psychedelics. Do not combine prescription medicines with psychoactive substances without professional guidance.',
          'Avoid combining with: Tramadol (High risk of seizures).',
          'Combining cannabis with psychedelics can intensify subjective effects and anxiety for some people.'
        ],
        identification: 'Found on blotter paper, gel tabs, or liquid drops.',
        testStrips: ['Reagent tests can provide limited information but cannot establish identity, purity, or safety. Do not rely on taste, appearance, or a single reagent result to identify an unknown substance.']
      },
      {
        name: 'Psilocybin (Mushrooms)',
        roas: [{ method: 'Oral', safety: ['Can cause extreme nausea during onset. Brewing as a tea with ginger heavily lessens stomach pain.', 'Potency varies substantially. Avoid relying on a fixed amount as a universally safe dose, and do not assume a delayed effect means more is needed.'] }],
        overdose: [
          'Psychological distress protocol is identical to LSD.',
          'Ensure the mushrooms were not falsely identified toxic wild mushrooms.'
        ],
        mixes: [
          'Mixing with Cannabis dramatically increases intensity.',
          'SSRIs and other medicines can alter psychedelic effects; individual responses vary and this is not evidence of safety.'
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
    sources: CATEGORY_SOURCES["Cannabinoids"],
    drugs: [
      {
        name: 'Marijuana (THC / Cannabis)',
        roas: [
          { method: 'Smoking / Vaping', safety: ['High-THC concentrates can produce intense effects and adverse reactions. Keep equipment clean and seek help for severe symptoms.'] },
          { method: 'Edibles (Oral)', safety: ['Onset takes 1-2 hours. Do NOT take more because "you don\'t feel it yet." Follow current evidence-based guidance for edible onset and do not assume delayed effects mean more is needed.', 'Avoid treating a fixed milligram amount as a universally safe starting dose; product potency and individual response vary.'] }
        ],
        overdose: [
          '"Greening out": Extreme dizziness, severe panic attacks, intense nausea/vomiting, paranoia.',
          'Severe cannabis reactions can occur. Seek urgent medical help for severe or unusual symptoms, especially when the cause is uncertain or other substances may be involved. Keep the person in a safe environment, monitor for worsening symptoms, and seek urgent medical help for severe or unusual symptoms.'
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
    sources: CATEGORY_SOURCES["Inhalants"],
    drugs: [
      {
        name: 'Nitrous Oxide (Whip-Its)',
        roas: [
          { method: 'Inhalation', safety: ['Do not use an enclosed bag or mask over the face because it can impair oxygen delivery.', 'Always sit down before inhaling.', 'Direct inhalation from pressurized dispensers can cause cold injury and other harm; follow the safety instructions for the specific product.', 'Heavy nitrous oxide exposure can interfere with vitamin B12 function and cause neurologic injury; persistent or severe symptoms warrant medical evaluation.'] }
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
          { method: 'Inhalation', safety: ['Nitrite products should not be swallowed. Ingestion can cause severe injury or death.', 'Do not get liquid on skin/eyes (causes chemical burns).'] }
        ],
        overdose: [
          'Can cause extreme drop in blood pressure, fainting, and cyanosis (blue lips/skin from lack of oxygen).'
        ],
        mixes: [
          'Nitrite poppers can cause dangerous drops in blood pressure, low blood oxygen, severe injury, and death. Do not use them recreationally or combine them with medicines or substances without professional guidance.',
          'Avoid Depressants with Inhalants due to vomit/loss of consciousness risk.'
        ],
        identification: 'Small bottles sold as "Video Head Cleaner" or "Room Odorizer".'
      }
    ]
  }
];
