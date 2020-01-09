export const REQUEST = 'APPROVE_ADVANCE_PAYMENT_PENDING';

export function postAprAdvPmnt(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateAdvancePayApproveNonSalesDetails`,
        data: [data]
      }
    }
  };
}