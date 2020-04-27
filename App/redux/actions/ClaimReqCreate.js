export const REQUEST = 'GENERATE_ID';

export function ceateClaimReq(noRow,hdrId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `addRequisitionClaimItemS?no_of_row=${noRow}&tripHdrId=${hdrId}`
      }
    }
  };
}