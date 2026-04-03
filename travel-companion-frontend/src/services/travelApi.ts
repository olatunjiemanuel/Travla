import type { TravelRequest, TravelSummaryResponse } from '../types/travel';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchTravelSummary(
  request: TravelRequest,
): Promise<TravelSummaryResponse> {
  const response = await fetch(`${BASE_URL}/api/travel/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    console.error('[travelApi] Request failed:', errorBody.error ?? `HTTP ${response.status}`);
    throw new Error('Something went wrong. Please try again.');
  }

  return response.json() as Promise<TravelSummaryResponse>;
}
