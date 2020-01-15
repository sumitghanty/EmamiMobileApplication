export const REQUEST = 'GET_REQ_LIST_SALES';

export function getReqSale(tripId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getRequisitionListSales?tripId=${tripId}`
      }
    }
  };
}