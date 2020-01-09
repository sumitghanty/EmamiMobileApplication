export const REQUEST = 'GET_EXPENSE_CLAIM_PENDING_APPROVAL';

export function getExpPendApr(statusId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getPendingForApprovalList?status=${statusId}`
      }
    }
  };
}