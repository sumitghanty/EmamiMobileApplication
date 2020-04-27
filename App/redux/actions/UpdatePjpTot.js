export const REQUEST = 'UPDATE_PJP_TOTAL';

export function updatePjpTot(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
				method: 'post',
        url: `updateReqSalesPjptotal`,
        data: data
      }
    }
  };
}