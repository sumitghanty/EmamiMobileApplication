export const REQUEST = 'PJP_CLAIM_APROVE';

export function pjpClaimAprv(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateReqSales`,
        data: data
      }
    }
  };
}