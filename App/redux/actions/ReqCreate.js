export const REQUEST = 'REQ_CREATE';

export function reqCreate(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `createReqNonSales`,
        data: data
      }
    }
  };
}