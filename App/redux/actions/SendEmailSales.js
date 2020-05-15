export const REQUEST = 'SEND_EMAIL_Sales';

export function sendEmailSales(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `createAndSendMailForSales`,
        data: data
      }
    }
  };
}