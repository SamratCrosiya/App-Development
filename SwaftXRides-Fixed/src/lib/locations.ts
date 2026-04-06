// src/lib/locations.ts
// Ported from the web app's locations lib

export interface Location {
  id: string;
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
}

export interface RideResult {
  service: string;
  price: number;
  eta: string;
  color: string;
  deepLink?: string;
}

export type RideType = 'auto' | 'bike' | 'cab';

// Indian city locations database
export const LOCATIONS: Location[] = [
  // Bengaluru
  { id: 'blr-kp', name: 'Koramangala', area: 'South Bengaluru', city: 'Bengaluru', lat: 12.9352, lng: 77.6245 },
  { id: 'blr-in', name: 'Indiranagar', area: 'East Bengaluru', city: 'Bengaluru', lat: 12.9784, lng: 77.6408 },
  { id: 'blr-wh', name: 'Whitefield', area: 'East Bengaluru', city: 'Bengaluru', lat: 12.9698, lng: 77.7499 },
  { id: 'blr-mg', name: 'MG Road', area: 'Central Bengaluru', city: 'Bengaluru', lat: 12.9742, lng: 77.6142 },
  { id: 'blr-el', name: 'Electronic City', area: 'South Bengaluru', city: 'Bengaluru', lat: 12.8399, lng: 77.6770 },
  { id: 'blr-jp', name: 'Jayanagar', area: 'South Bengaluru', city: 'Bengaluru', lat: 12.9253, lng: 77.5938 },
  { id: 'blr-airport', name: 'Kempegowda Airport', area: 'Devanahalli', city: 'Bengaluru', lat: 13.1986, lng: 77.7066 },
  // Mumbai
  { id: 'mum-bkc', name: 'BKC', area: 'Bandra Kurla Complex', city: 'Mumbai', lat: 19.0654, lng: 72.8651 },
  { id: 'mum-andheri', name: 'Andheri', area: 'Western Suburbs', city: 'Mumbai', lat: 19.1136, lng: 72.8697 },
  { id: 'mum-dadar', name: 'Dadar', area: 'Central Mumbai', city: 'Mumbai', lat: 19.0178, lng: 72.8478 },
  { id: 'mum-colaba', name: 'Colaba', area: 'South Mumbai', city: 'Mumbai', lat: 18.9067, lng: 72.8147 },
  { id: 'mum-powai', name: 'Powai', area: 'North-East Mumbai', city: 'Mumbai', lat: 19.1197, lng: 72.9051 },
  { id: 'mum-airport', name: 'Chhatrapati Shivaji Airport', area: 'Santacruz', city: 'Mumbai', lat: 19.0896, lng: 72.8656 },
  // Delhi
  { id: 'del-cp', name: 'Connaught Place', area: 'Central Delhi', city: 'Delhi', lat: 28.6315, lng: 77.2167 },
  { id: 'del-aerocity', name: 'Aerocity', area: 'Near Airport', city: 'Delhi', lat: 28.5562, lng: 77.1000 },
  { id: 'del-noida', name: 'Noida Sector 18', area: 'Noida', city: 'Delhi', lat: 28.5706, lng: 77.3219 },
  { id: 'del-gurugram', name: 'Cyber City', area: 'Gurugram', city: 'Delhi', lat: 28.4944, lng: 77.0881 },
  { id: 'del-lajpat', name: 'Lajpat Nagar', area: 'South Delhi', city: 'Delhi', lat: 28.5705, lng: 77.2430 },
  // Hyderabad
  { id: 'hyd-hitech', name: 'HITEC City', area: 'Cyberabad', city: 'Hyderabad', lat: 17.4435, lng: 78.3772 },
  { id: 'hyd-banjara', name: 'Banjara Hills', area: 'West Hyderabad', city: 'Hyderabad', lat: 17.4156, lng: 78.4347 },
  { id: 'hyd-gachibowli', name: 'Gachibowli', area: 'Financial District', city: 'Hyderabad', lat: 17.4401, lng: 78.3489 },
  { id: 'hyd-airport', name: 'Rajiv Gandhi Airport', area: 'Shamshabad', city: 'Hyderabad', lat: 17.2403, lng: 78.4294 },
  // Chennai
  { id: 'che-annasalai', name: 'Anna Salai', area: 'Mount Road', city: 'Chennai', lat: 13.0569, lng: 80.2425 },
  { id: 'che-omr', name: 'OMR', area: 'Old Mahabalipuram Road', city: 'Chennai', lat: 12.9266, lng: 80.2276 },
  { id: 'che-t-nagar', name: 'T. Nagar', area: 'South Chennai', city: 'Chennai', lat: 13.0418, lng: 80.2341 },
  // Pune
  { id: 'pun-koregaon', name: 'Koregaon Park', area: 'East Pune', city: 'Pune', lat: 18.5362, lng: 73.8940 },
  { id: 'pun-hinjewadi', name: 'Hinjewadi', area: 'IT Hub', city: 'Pune', lat: 18.5912, lng: 73.7378 },
  { id: 'pun-mg', name: 'MG Road', area: 'Camp Area', city: 'Pune', lat: 18.5195, lng: 73.8553 },
  // Kolkata
  { id: 'kol-park', name: 'Park Street', area: 'Central Kolkata', city: 'Kolkata', lat: 22.5530, lng: 88.3512 },
  { id: 'kol-salt', name: 'Salt Lake', area: 'East Kolkata', city: 'Kolkata', lat: 22.5744, lng: 88.4146 },
  // Jaipur
  { id: 'jai-mi-road', name: 'MI Road', area: 'Central Jaipur', city: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { id: 'jai-malviya', name: 'Malviya Nagar', area: 'South Jaipur', city: 'Jaipur', lat: 26.8628, lng: 75.8050 },
];

export function searchLocations(query: string): Location[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.area.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q)
  ).slice(0, 6);
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function getDistance(a: Location, b: Location): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function findClosestLocation(lat: number, lng: number): Location {
  return LOCATIONS.reduce((prev, curr) => {
    const dPrev = Math.abs(prev.lat - lat) + Math.abs(prev.lng - lng);
    const dCurr = Math.abs(curr.lat - lat) + Math.abs(curr.lng - lng);
    return dCurr < dPrev ? curr : prev;
  });
}

const RIDE_SERVICES: Record<RideType, Array<{ name: string; basePerKm: number; base: number; color: string }>> = {
  auto: [
    { name: 'Ola Auto', basePerKm: 12, base: 25, color: '#F59E0B' },
    { name: 'Uber Auto', basePerKm: 13, base: 22, color: '#000000' },
    { name: 'Rapido Auto', basePerKm: 11, base: 20, color: '#FACC15' },
    { name: 'Namma Yatri', basePerKm: 10, base: 15, color: '#10B981' },
  ],
  bike: [
    { name: 'Rapido Bike', basePerKm: 7, base: 15, color: '#FACC15' },
    { name: 'Uber Moto', basePerKm: 8, base: 18, color: '#000000' },
    { name: 'Ola Bike', basePerKm: 7.5, base: 16, color: '#F59E0B' },
  ],
  cab: [
    { name: 'Ola Mini', basePerKm: 14, base: 50, color: '#F59E0B' },
    { name: 'Uber Go', basePerKm: 15, base: 55, color: '#000000' },
    { name: 'Ola Prime', basePerKm: 18, base: 60, color: '#F59E0B' },
    { name: 'Uber Premier', basePerKm: 20, base: 70, color: '#000000' },
  ],
};

function getEta(dist: number): string {
  const mins = Math.round(dist * 3 + Math.random() * 4 + 2);
  return `${mins} min`;
}

export function calculateFares(pickup: Location, drop: Location, rideType: RideType): RideResult[] {
  const dist = getDistance(pickup, drop);
  const services = RIDE_SERVICES[rideType];
  return services.map((s) => {
    const rawPrice = s.base + s.basePerKm * dist;
    const jitter = 1 + (Math.random() - 0.5) * 0.08;
    return {
      service: s.name,
      price: Math.round(rawPrice * jitter),
      eta: getEta(dist),
      color: s.color,
    };
  });
}
