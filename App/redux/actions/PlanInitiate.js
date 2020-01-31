export const REQUEST = 'PLAN_UPDATE';

export function planUpdate(data) {
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