export const REQUEST = 'GET_REQ_TYPE_LIST_SALES';

export function getReqTypeSale(grade) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getTravelModeList?grade=${grade}`
      }
    }
  };
}