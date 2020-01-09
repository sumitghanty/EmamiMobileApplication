export const REQUEST = 'GET_TRIPS';

export function getTrips(userId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getTripListNonSales?userid=${userId}`
      }
    }
  };
}