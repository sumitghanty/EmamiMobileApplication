export const REQUEST = 'GET_CLAIM_REQ';

export function getReqClaimType(grade) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getReqTypeListForClaim?grade=${grade}`
      }
    }
  };
}