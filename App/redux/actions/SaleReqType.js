export const REQUEST = 'GET_REQ_TYPE_LIST_SALES';

export function getReqTypeSale(designation,grade) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getTravelModeList?designation=${designation}&grade=${grade}`
      }
    }
  };
}