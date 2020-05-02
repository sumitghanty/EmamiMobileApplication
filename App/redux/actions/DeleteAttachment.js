export const REQUEST = 'DELETE_ATTACHMENT';

export function attachmentDelete(userId,password,data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: 	`deletefile`,
        headers: {
          'userId': userId,
          'password': password
        },
        data: data
      }
    }
  };
}