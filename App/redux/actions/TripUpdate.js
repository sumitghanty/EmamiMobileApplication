export const REQUEST = 'TRIP_UPDATE';

export function tripUpdate(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateTripNonSales`,
        data: data
      }
    }
  };
}