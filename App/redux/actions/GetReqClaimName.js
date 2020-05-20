export const REQUEST = 'GET_REQ_CLAIM_NAME';

export function getReqClaimName(grade) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getReqTypeListForClaim?grade=${grade}`
      }
    }
  };
}