export const REQUEST = 'APRV_TRIP_NON_REQ';

export function aprvTripNonReq(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateTripNonSalesPendingStatus`,
        data: [data]
      }
    }
  };
}