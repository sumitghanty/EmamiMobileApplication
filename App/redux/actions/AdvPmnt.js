export const REQUEST = 'ADV_PMNT';

export function advPmnt(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `submitAdvancePayDetails`,
        data: data
      }
    }
  };
}