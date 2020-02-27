export const REQUEST = 'UPDATE_REQ_NS_BASIC_DTLS';

export function updtReqNSBD(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateRequisitionNonSalesBasicDetails`,
        data: data
      }
    }
  };
}