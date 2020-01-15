export const REQUEST = 'GET_REQ_CLAIM_NAME';

export function getReqClaimName(designation,grade) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getReqTypeListForClaim?designation=${designation}&grade=${grade}`
      }
    }
  };
}