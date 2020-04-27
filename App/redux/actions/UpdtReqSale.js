export const REQUEST = 'UPDATE_REQ_SALE';

export function updtReqSale(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateReqSalesLineItem`,
        data: data
      }
    }
  };
}