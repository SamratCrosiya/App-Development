/**
 * SwaftXRides API Client
 * Calls the FastAPI backend. Falls back to local offline calculation
 * if the backend is unreachable (so the app works without a running server).
 */

import { Platform } from 'react-native';
import { calculateFares, searchLocations, findClosestLocation, getDistance, RideType, RideResult } from './locations';
import type { Location } from './locations';

// ── Base URL ──────────────────────────────────────────────────────────────────
// On Android emulator, 10.0.2.2 maps to the host machine's localhost.
// On iOS simulator / physical device, localhost works directly.
// Change this to your deployed backend URL when deploying.
const BASE_URL: string =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';

let _authToken: string | null = null;

export function setAuthToken(token: string | null) {
  _authToken = token;
}

function authHeaders(): Record<string, string> {
  return _authToken ? { Authorization: `Bearer ${_authToken}` } : {};
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...(options?.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Network error — fall back to offline mode
    return null;
  }
}

// ── Fare Comparison ───────────────────────────────────────────────────────────

export interface FareAPIResponse {
  pickup_name: string;
  drop_name: string;
  distance_km: number;
  rides: Array<{
    service: string;
    price: number;
    eta: string;
    color: string;
    deep_link: string;
    distance_km: number;
  }>;
  savings: number;
  token: string;
}

/**
 * Compare fares via the backend. Falls back to the local engine
 * if the backend is unreachable, so the app always shows results.
 */
export async function compareFares(
  pickup: Location,
  drop: Location,
  rideType: RideType
): Promise<{ rides: RideResult[]; savings: number; distance: number; token?: string }> {
  const data = await apiFetch<FareAPIResponse>('/api/fares/compare', {
    method: 'POST',
    body: JSON.stringify({
      pickup_id: pickup.id,
      drop_id: drop.id,
      ride_type: rideType,
    }),
  });

  if (data) {
    const rides: RideResult[] = data.rides.map((r) => ({
      service: r.service,
      price: r.price,
      eta: r.eta,
      color: r.color,
      deepLink: r.deep_link,
    }));
    return { rides, savings: data.savings, distance: data.distance_km, token: data.token };
  }

  // Offline fallback
  const rides = calculateFares(pickup, drop, rideType).sort((a, b) => a.price - b.price);
  const savings = rides.length > 1 ? rides[rides.length - 1].price - rides[0].price : 0;
  return { rides, savings, distance: getDistance(pickup, drop) };
}

// ── Location Search ───────────────────────────────────────────────────────────

/**
 * Search locations via backend. Falls back to local DB.
 */
export async function searchLocationsAPI(query: string): Promise<Location[]> {
  const data = await apiFetch<{ results: Location[] }>(
    `/api/locations/search?q=${encodeURIComponent(query)}`
  );
  if (data?.results?.length) return data.results;
  return searchLocations(query);
}

/**
 * Snap GPS coordinates to nearest location via backend. Falls back locally.
 */
export async function snapToLocation(lat: number, lng: number): Promise<Location> {
  const data = await apiFetch<{ location: Location }>(
    `/api/locations/snap?lat=${lat}&lng=${lng}`
  );
  if (data?.location) return data.location;
  return findClosestLocation(lat, lng);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    phone: string;
    preferred_ride_type: string;
    default_city: string;
  };
}

export async function register(
  name: string,
  phone: string,
  password: string
): Promise<AuthResponse | null> {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, phone, password }),
  });
}

export async function login(
  phone: string,
  password: string
): Promise<AuthResponse | null> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });
}

export async function getMe(): Promise<AuthResponse['user'] | null> {
  return apiFetch<AuthResponse['user']>('/api/auth/me');
}

export async function updatePreferences(prefs: {
  preferred_ride_type?: string;
  default_city?: string;
}): Promise<boolean> {
  const res = await apiFetch('/api/auth/preferences', {
    method: 'PATCH',
    body: JSON.stringify(prefs),
  });
  return res !== null;
}

// ── Saved Locations ───────────────────────────────────────────────────────────

export interface SavedLocation {
  id: string;
  label: string;
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
}

export async function getSavedLocations(): Promise<SavedLocation[]> {
  const data = await apiFetch<{ saved_locations: SavedLocation[] }>('/api/saved-locations/');
  return data?.saved_locations ?? [];
}

export async function addSavedLocation(
  loc: Omit<SavedLocation, 'id'>
): Promise<SavedLocation | null> {
  const data = await apiFetch<{ saved_location: SavedLocation }>('/api/saved-locations/', {
    method: 'POST',
    body: JSON.stringify(loc),
  });
  return data?.saved_location ?? null;
}

export async function deleteSavedLocation(id: string): Promise<boolean> {
  const res = await apiFetch(`/api/saved-locations/${id}`, { method: 'DELETE' });
  return res !== null;
}
