export const REQUEST = 'GET_ATTACHMENT';

export function getAttachment(tripHdrId,tripNo,lineItem) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getAttachmentListNonSales?tripHdrId=${tripHdrId}&tripNo=${tripNo}&lineItem=${lineItem}`
      }
    }
  };
}