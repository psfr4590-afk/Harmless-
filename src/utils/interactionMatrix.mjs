export const DRUG_CLASSES = [
  'Opioids',
  'Benzodiazepines',
  'Alcohol',
  'GHB / GBL',
  'Cocaine',
  'Amphetamines (Meth/Speed)',
  'MDMA / Ecstasy',
  'Ketamine',
  'MAOI Antidepressants',
  'SSRI Antidepressants'
];

const SOURCES = {
  CDC: { source: 'CDC Overdose Prevention', sourceUrl: 'https://www.cdc.gov/overdose-prevention/' },
  NIDA: { source: 'NIDA Research Topics by Substance', sourceUrl: 'https://nida.nih.gov/drugabuse.html' },
  FDA: { source: 'FDA Drug Interactions & Labeling', sourceUrl: 'https://www.fda.gov/drugs/development-resources/drug-interactions-labeling' }
};

export const INTERACTIONS = {
  'Alcohol + Opioids': { severity: 'FATAL', description: 'Combining opioids with alcohol can dangerously suppress breathing and increase overdose risk.', ...SOURCES.NIDA },
  'Benzodiazepines + Opioids': { severity: 'FATAL', description: 'Combining opioids with benzodiazepines can dangerously suppress breathing and increase overdose risk.', ...SOURCES.NIDA },
  'GHB / GBL + Opioids': { severity: 'FATAL', description: 'Combining opioids with GHB/GBL can cause severe sedation and respiratory depression.', ...SOURCES.NIDA },
  'Cocaine + Opioids': { severity: 'CAUTION', description: 'Combining stimulants and opioids can produce unpredictable effects and does not cancel out overdose risk.', ...SOURCES.NIDA },
  'Amphetamines (Meth/Speed) + Opioids': { severity: 'CAUTION', description: 'Combining stimulants and opioids can produce unpredictable effects and does not cancel out overdose risk.', ...SOURCES.NIDA },
  'Ketamine + Opioids': { severity: 'UNSAFE', description: 'Combining opioids with ketamine can increase sedation and impairment and may increase overdose risk.', ...SOURCES.NIDA },
  'Alcohol + Benzodiazepines': { severity: 'FATAL', description: 'Combining alcohol with benzodiazepines can dangerously increase sedation, respiratory depression, and overdose risk.', ...SOURCES.NIDA },
  'Benzodiazepines + GHB / GBL': { severity: 'FATAL', description: 'Combining benzodiazepines with GHB/GBL can cause severe sedation, respiratory depression, and loss of consciousness.', ...SOURCES.NIDA },
  'Benzodiazepines + Ketamine': { severity: 'UNSAFE', description: 'Combining benzodiazepines with ketamine can increase sedation, impairment, and loss of consciousness.', ...SOURCES.NIDA },
  'Alcohol + GHB / GBL': { severity: 'FATAL', description: 'Combining alcohol with GHB/GBL can cause severe sedation, loss of consciousness, and respiratory depression.', ...SOURCES.NIDA },
  'Alcohol + Cocaine': { severity: 'UNSAFE', description: 'Combining alcohol and cocaine increases cardiovascular and other health risks.', ...SOURCES.NIDA },
  'Alcohol + Ketamine': { severity: 'FATAL', description: 'Combining alcohol with ketamine can substantially increase sedation, impairment, vomiting, and loss of consciousness.', ...SOURCES.NIDA },
  'Alcohol + MDMA / Ecstasy': { severity: 'UNSAFE', description: 'Combining alcohol with MDMA can increase dehydration, overheating, and other adverse effects.', ...SOURCES.NIDA },
  'MAOI Antidepressants + MDMA / Ecstasy': { severity: 'FATAL', description: 'Combining MAOI antidepressants with MDMA can cause dangerous serotonin and cardiovascular effects.', ...SOURCES.NIDA },
  'MDMA / Ecstasy + SSRI Antidepressants': { severity: 'UNSAFE', description: 'SSRIs can alter the effects of MDMA, and the combination can still carry significant health risks.', ...SOURCES.NIDA },
  'Amphetamines (Meth/Speed) + MDMA / Ecstasy': { severity: 'UNSAFE', description: 'Combining multiple stimulants can increase cardiovascular strain and overheating risk.', ...SOURCES.NIDA },
  'Amphetamines (Meth/Speed) + Cocaine': { severity: 'UNSAFE', description: 'Combining stimulants can increase cardiovascular strain, overheating, anxiety, and other adverse effects.', ...SOURCES.NIDA },
  'Amphetamines (Meth/Speed) + MAOI Antidepressants': { severity: 'FATAL', description: 'Combining amphetamine-type stimulants with MAOIs can cause dangerous cardiovascular and neurologic reactions.', ...SOURCES.NIDA },
  'Cocaine + MAOI Antidepressants': { severity: 'FATAL', description: 'Combining cocaine with MAOIs can cause dangerous cardiovascular and neurologic reactions.', ...SOURCES.NIDA }
};

export function checkInteraction(drugA, drugB) {
  if (!drugA || !drugB || drugA === 'Select...' || drugB === 'Select...') {
    return { severity: 'UNKNOWN', description: 'Select two different substance classes to check their interaction.', ...SOURCES.NIDA };
  }
  if (drugA === drugB) {
    return { severity: 'SAME_SUBSTANCE', description: 'This tool checks interactions between different substance classes. It does not determine single-substance dose risk.', ...SOURCES.NIDA };
  }
  const pair = [drugA, drugB].sort().join(' + ');
  return INTERACTIONS[pair] ? { ...INTERACTIONS[pair], pair } : {
    severity: 'UNKNOWN',
    description: 'This combination is not explicitly listed in the rapid-check matrix. Unknown means unlisted, not safe. Do not treat the absence of an entry as evidence that the combination is safe.'
  };
}
