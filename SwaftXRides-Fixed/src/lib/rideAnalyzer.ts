/**
 * Smart ride ranking using weighted score (price 70%, ETA 30%).
 * Based on friend's analyzeRides algorithm — adapted for TypeScript.
 */

export interface ScoredRide {
  service: string;
  price: number;
  eta: string;         // e.g. "7 min"
  etaMinutes: number;  // numeric minutes
  color: string;
  deepLink: string;
  normalizedPrice: number;
  normalizedEta: number;
  score: number;
  surgeMultiplier: number;
  surgedPrice: number;
  surgeBreakdown: SurgeBreakdown;
}

export interface SurgeBreakdown {
  base: number;
  weather: number;
  traffic: number;
  time: number;
  weatherLabel: string;
  trafficLabel: string;
}

// ── ETA parser ────────────────────────────────────────────────────────────────
function parseEtaMinutes(eta: string): number {
  const m = eta.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 5;
}

// ── Normalize 0→1 (lower is better for both price and ETA) ────────────────
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

// ── Surge engine: time + weather code + traffic ───────────────────────────

/** Weather codes from Open-Meteo free API (no key needed). */
function weatherSurge(code: number): { multiplier: number; label: string } {
  if (code === 0)                  return { multiplier: 0.0, label: 'Clear sky' };
  if (code >= 1 && code <= 3)     return { multiplier: 0.1, label: 'Partly cloudy' };
  if (code >= 51 && code <= 67)   return { multiplier: 0.5, label: 'Rain' };
  if (code >= 71 && code <= 77)   return { multiplier: 0.7, label: 'Snow' };
  if (code === 95)                 return { multiplier: 0.8, label: 'Thunderstorm' };
  return { multiplier: 0.0, label: 'Normal' };
}

function timeSurge(hour: number): number {
  if ((hour >= 8 && hour < 11) || (hour >= 17 && hour < 21)) return 0.3; // rush hours
  if (hour >= 0 && hour < 5)                                  return 0.2; // late night
  return 0.0;
}

function trafficSurge(hour: number): { multiplier: number; label: string } {
  if (hour >= 8 && hour < 11)   return { multiplier: 0.5, label: 'Heavy (morning rush)' };
  if (hour >= 17 && hour < 21)  return { multiplier: 0.5, label: 'Heavy (evening rush)' };
  if (hour >= 11 && hour < 17)  return { multiplier: 0.2, label: 'Moderate (daytime)' };
  return { multiplier: 0.0, label: 'Light (off-hours)' };
}

export interface SurgeResult {
  surgeMultiplier: number;
  breakdown: SurgeBreakdown;
}

export function calculateSurge(weatherCode: number): SurgeResult {
  const hour = new Date().getHours();
  const wSurge = weatherSurge(weatherCode);
  const tSurge = trafficSurge(hour);
  const timeMul = timeSurge(hour);

  const base = 1.0;
  const total = Math.min(base + wSurge.multiplier + tSurge.multiplier + timeMul, 3.0);

  return {
    surgeMultiplier: total,
    breakdown: {
      base,
      weather: wSurge.multiplier,
      traffic: tSurge.multiplier,
      time: timeMul,
      weatherLabel: wSurge.label,
      trafficLabel: tSurge.label,
    },
  };
}

// ── Fetch weather code from Open-Meteo (free, no API key) ────────────────────
export async function fetchWeatherCode(lat: number, lng: number): Promise<number> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
    );
    const data = await res.json();
    return data?.current_weather?.weathercode ?? 0;
  } catch {
    return 0; // default to clear sky if fetch fails
  }
}

// ── Main analyzer ─────────────────────────────────────────────────────────────

export function analyzeRides(
  rawRides: Array<{ service: string; price: number; eta: string; color: string; deepLink: string }>,
  surgeResult: SurgeResult
): { bestRide: ScoredRide; rides: ScoredRide[] } {
  const etaMinutesArr = rawRides.map((r) => parseEtaMinutes(r.eta));
  const prices = rawRides.map((r) => r.price);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minEta   = Math.min(...etaMinutesArr);
  const maxEta   = Math.max(...etaMinutesArr);

  const scored: ScoredRide[] = rawRides.map((r, i) => {
    const etaMins = etaMinutesArr[i];
    const normalizedPrice = normalize(r.price, minPrice, maxPrice);
    const normalizedEta   = normalize(etaMins, minEta, maxEta);

    // 70% price, 30% ETA — lower score = better
    const score = 0.7 * normalizedPrice + 0.3 * normalizedEta;

    const surgedPrice = Math.round(r.price * surgeResult.surgeMultiplier);

    return {
      ...r,
      etaMinutes: etaMins,
      normalizedPrice,
      normalizedEta,
      score,
      surgeMultiplier: surgeResult.surgeMultiplier,
      surgedPrice,
      surgeBreakdown: surgeResult.breakdown,
    };
  });

  // Sort ascending (lowest score = best value)
  scored.sort((a, b) => a.score - b.score);

  return { bestRide: scored[0], rides: scored };
}