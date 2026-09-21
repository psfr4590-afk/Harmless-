export function canonicalPair(a, b) {
  if (!a || !b || a === 'Select...' || b === 'Select...') return null;
  return [a, b].sort().join(' + ');
}

export function safeExternalUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export function dedupeById(items) {
  const seen = new Set();
  return items.filter(item => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function buildOverpassQuery(selectors, lat, lng, radius = 20000) {
  const clauses = selectors
    .map(selector => `nwr${selector}(around:${radius},${lat},${lng});`)
    .join('\n');
  return `[out:json][timeout:25];(${clauses});out center tags;`;
}

export function calculateVolumetricDose(massMg, volumeMl, targetDoseMg) {
  const mass = Number(massMg);
  const volume = Number(volumeMl);
  const target = Number(targetDoseMg);

  if (![mass, volume, target].every(Number.isFinite) || mass <= 0 || volume <= 0 || target <= 0) {
    return { concentration: 0, requiredVolume: 0 };
  }

  const concentration = mass / volume;
  return { concentration, requiredVolume: target / concentration };
}

export function extractOverpassElements(data) {
  return data && typeof data === 'object' && Array.isArray(data.elements) ? data.elements : null;
}
