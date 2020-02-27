export const REQUEST = 'GET_EXPENSES';

export function getExpenses(userId,statusId,data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `getExpenseClaimTripForNonSalesListStatuses?userid=${userId}&trip_For=${statusId}`,
        data: data
      }
    }
  };
}