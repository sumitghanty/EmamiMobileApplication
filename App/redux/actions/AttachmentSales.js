export const REQUEST = 'ATTACHMENT_SALES';

export function attachmentSales(userId,password,data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: 	`uploadFileAsBase64Sales`,
        headers: {
          'userId': userId,
          'password': password
        },
        data: data
      }
    }
  };
}