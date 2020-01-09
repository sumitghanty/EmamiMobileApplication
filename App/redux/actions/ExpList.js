export const REQUEST = 'GET_EXPS';

export function getExps(userId,statusId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getTripListNonSales?userid=${userId}&status=${statusId}`
      }
    }
  };
}