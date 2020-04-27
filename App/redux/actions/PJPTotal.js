export const REQUEST = 'PJP_TOTAL';

export function pjpTotal(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
				method: 'post',
        url: `createReqSalespjptotal`,
        data: data
      }
    }
  };
}