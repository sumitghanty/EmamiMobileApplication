export const REQUEST = 'SEND_EMAIL';

export function sendEmail(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `createAndSendMail`,
        data: data
      }
    }
  };
}