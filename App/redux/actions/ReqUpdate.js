export const REQUEST = 'REQ_UPDATE';

export function reqUpdate(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateRequisitionNonSales`,
        data: data
      }
    }
  };
}