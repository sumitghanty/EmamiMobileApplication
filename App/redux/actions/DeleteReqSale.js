export const REQUEST = 'DELETE_REQ_SALE';

export function deleteReqSale(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
				method: 'post',
        url: `deleteLineItemStatusByTripIdandLineItemS`,
        data: data
      }
    }
  };
}