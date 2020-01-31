export const REQUEST = 'GET_TRAVEL_TYPE';

export function getTravelType() {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getTravelNameList`
      }
    }
  };
}