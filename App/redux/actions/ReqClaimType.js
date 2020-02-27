export const REQUEST = 'GET_CLAIM_REQ';

export function getReqClaimType(designation,grade) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getReqTypeListForClaim?designation=${designation}&grade=${grade}`
      }
    }
  };
}