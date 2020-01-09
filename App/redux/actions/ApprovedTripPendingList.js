export const REQUEST = 'GET_APPROVED_TRIPS_PENDING';

export function getApprovedTripPending(pendingWithEmail) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getApprovalTripListNonSales?pending_with_email=${pendingWithEmail}`
      }
    }
  };
}