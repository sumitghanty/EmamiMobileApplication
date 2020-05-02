export const REQUEST = 'ATTACHMENT';

export function attachment(userId,password,data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: 	`uploadFileAsBase64`,
        headers: {
          'userId': userId,
          'password': password
        },
        data: data
      }
    }
  };
}