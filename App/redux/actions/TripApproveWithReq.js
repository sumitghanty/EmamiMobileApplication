export const REQUEST = 'APRV_TRIP_WITH_REQ';

export function postAprvTripWithReq(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateReqNonSales`,
        data: data
      }
    }
  };
}