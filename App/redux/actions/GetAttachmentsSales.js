export const REQUEST = 'GET_ATTACHMENTS_SALES';

export function getAttachmentsSales(tripHdrId,tripNo,lineItem) {
  return {
    type: REQUEST,
    payload: {
      request: {
				url: `getAttachmentListSales?tripHdrId=${tripHdrId}&tripNo=${tripNo}&lineItem=${lineItem}`
      }
    }
  };
}