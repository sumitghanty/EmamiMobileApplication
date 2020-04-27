export const REQUEST = 'PJP_DELETE';

export function pjpDelete(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
				method: 'post',
        url: `deleteTripSales`,
        data: data
      }
    }
  };
}