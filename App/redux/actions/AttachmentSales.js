export const REQUEST = 'ATTACHMENT_SALES';

export function attachmentSales(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: 	`uploadFileAsBase64Sales`,
        data: data
      }
    }
  };
}