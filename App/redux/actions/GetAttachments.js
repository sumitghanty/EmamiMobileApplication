export const REQUEST = 'GET_ATTACHMENTS';

export function getAttachments(tripHdrId,tripNo,lineItem) {
  return {
    type: REQUEST,
    payload: {
      request: {
				url: `getAttachmentListNonSales?tripHdrId=${tripHdrId}&tripNo=${tripNo}&lineItem=${lineItem}`
      }
    }
  };
}