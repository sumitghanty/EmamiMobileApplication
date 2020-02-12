export const REQUEST = 'PLANS_SUBMITE';

export function plansSubmit(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateReqNonSales`,
        data: data
      }
    }
  };
}