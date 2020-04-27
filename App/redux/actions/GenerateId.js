export const REQUEST = 'GENERATE_ID';

export function generateId(dType) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getLatestTripNumber?type=${dType}`
      }
    }
  };
}