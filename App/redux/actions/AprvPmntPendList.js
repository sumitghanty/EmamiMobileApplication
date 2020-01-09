export const REQUEST = 'GET_ADVANCE_PAYMENT_PENDING_FOR_APPROVE';

export function getAdvPmntPend(userId,statusId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getAdvPayPendingForApprovalList?pending_with=${userId}&status=${statusId}`
      }
    }
  };
}