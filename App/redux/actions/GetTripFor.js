export const REQUEST = 'GET_TRIP_FOR';

export function getTripFor() {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getTripForMasterList`
      }
    }
  };
}