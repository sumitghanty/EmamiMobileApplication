export const REQUEST = 'PJP_CLAIM_APROVE';

export function postPjpClaimAprv(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `claimAprrovalPendingupdateReqSales`,
        data: data
      }
    }
  };
}