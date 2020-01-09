export const REQUEST = 'EXPENSE_APPROVE';

export function postExpAprv(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateExpenseClaimNonSalesStatus`,
        data: [data]
      }
    }
  };
}