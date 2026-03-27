import type { TravelRequest, TravelSummaryResponse } from '../types/travel';

const BASE_URL = 'http://localhost:5077';

export async function fetchTravelSummary(
  request: TravelRequest
): Promise<TravelSummaryResponse> {
  const response = await fetch(`${BASE_URL}/api/travel/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(errorBody.error ?? `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<TravelSummaryResponse>;
}
