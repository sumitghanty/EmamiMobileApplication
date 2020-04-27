export const REQUEST = 'DELETE_ATTACHMENT';

export function attachmentDelete(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: 	`deletefile`,
        data: data
      }
    }
  };
}