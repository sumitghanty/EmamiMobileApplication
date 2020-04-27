export const REQUEST = 'UPDATE_CLAIM_SALE';

export function updtClaimReq(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `claimcreateReqSales`,
        data: data
      }
    }
  };
}