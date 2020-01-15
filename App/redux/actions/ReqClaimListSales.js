export const REQUEST = 'GET_REQ_CLAIM_LIST_SALES';

export function getReqClaimSale(tripId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getClaimRequisitionListSales?triphdrId=${tripId}`
      }
    }
  };
}