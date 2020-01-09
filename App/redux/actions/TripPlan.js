export const REQUEST = 'GET_PLANS';

export function getPlans(tripHdrId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getRequisitionListNonSales?triphdrId=${tripHdrId}`
      }
    }
  };
}