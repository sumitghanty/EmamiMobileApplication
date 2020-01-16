export const REQUEST = 'PJP_CLAIM_TOTAL';

export function postPjpClaimTot(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `createReqSalesClaimpjptotal`,
        data: [data]
      }
    }
  };
}