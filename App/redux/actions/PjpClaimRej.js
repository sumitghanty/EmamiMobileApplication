export const REQUEST = 'PJP_CLAIM_REJECT';

export function postPjpClaimRej(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `claimupdateReqSales`,
        data: data
      }
    }
  };
}