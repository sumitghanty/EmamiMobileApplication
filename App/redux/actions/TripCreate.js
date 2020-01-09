export const REQUEST = 'TRIP_CREATE';

export function tripCreate(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `createTripNonSales`,
        data: data
      }
    }
  };
}