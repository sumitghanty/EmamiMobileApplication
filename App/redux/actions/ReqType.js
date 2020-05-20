export const REQUEST = 'GET_REQ';

export function getReqType(grade) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getRequisitionTypeList?grade=${grade}`
      }
    }
  };
}