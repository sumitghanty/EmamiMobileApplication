export const REQUEST = 'CREATE_REQ_SALE';

export function createReqSale(noRow,hdrId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `addRequisitionPJPItemS?no_of_row=${noRow}&tripHdrId=${hdrId}`
      }
    }
  };
}