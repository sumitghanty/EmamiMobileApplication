export const REQUEST = 'GET_PJP';

export function getPjp(userId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getTripListSalesByTripNo?user_id=${userId}`
      }
    }
  };
}