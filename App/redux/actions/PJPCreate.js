export const REQUEST = 'PJP_CREATE';

export function pjpCreate(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
				method: 'post',
        url: `createTripSales`,
        data: data
      }
    }
  };
}