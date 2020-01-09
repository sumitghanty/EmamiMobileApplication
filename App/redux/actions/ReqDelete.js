export const REQUEST = 'REQ_DELETE';

export function reqDelete(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `deleteLineItemStatusByTripIdandLineItem`,
        data: data
      }
    }
  };
}