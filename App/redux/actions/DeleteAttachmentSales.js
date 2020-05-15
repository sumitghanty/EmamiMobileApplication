export const REQUEST = 'DELETE_ATTACHMENT_SALES';

export function attachmentDeleteSales(userId,password,data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: 	`deletefileSales`,
        headers: {
          'userId': userId,
          'password': password
        },
        data: data
      }
    }
  };
}