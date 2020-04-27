export const REQUEST = 'GET_PJP_CLAIM';

export function getPjpClaim(userId,data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `getExpenseClaimTripForSalesListStatuses?userid=${userId}`,
        data: data
      }
    }
  };
}