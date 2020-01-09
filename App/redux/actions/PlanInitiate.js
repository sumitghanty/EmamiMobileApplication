export const REQUEST = 'PLAN_INITIATE';

export function planInitiate(data) {
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