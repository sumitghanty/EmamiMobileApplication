export const REQUEST = 'ATTACHMENT';

export function attachment(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: 	`uploadFileAsBase64`,
        data: data
      }
    }
  };
}