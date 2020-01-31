export const REQUEST = 'GET_TRAVEL_THROUGH';

export function getTravelThrough() {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getTravelThroughList`
      }
    }
  };
}