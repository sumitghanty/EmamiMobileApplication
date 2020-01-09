export const REQUEST = 'GET_PJP_CLAIM';

export function getPjpClaim(userId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `updateReqSales?user_id=${userId}`
      }
    }
  };
}