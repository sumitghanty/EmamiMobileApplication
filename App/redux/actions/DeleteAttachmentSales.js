export const REQUEST = 'DELETE_ATTACHMENT_SALES';

export function attachmentDeleteSales(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: 	`deletefileSales`,
        data: data
      }
    }
  };
}