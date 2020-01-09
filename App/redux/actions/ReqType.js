export const REQUEST = 'GET_REQ';

export function getReqType(designation,grade) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getRequisitionTypeList?designation=${designation}&grade=${grade}`
      }
    }
  };
}