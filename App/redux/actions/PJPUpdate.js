export const REQUEST = 'PJP_UPDATE';

export function pjpUpdate(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
				method: 'post',
        url: `updateTripSalesById`,
        data: data
      }
    }
  };
}