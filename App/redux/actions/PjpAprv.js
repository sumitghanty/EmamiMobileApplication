export const REQUEST = 'PJP_TRIP_APROVE';

export function postPjpAprv(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateReqSales`,
        data: data
      }
    }
  };
}