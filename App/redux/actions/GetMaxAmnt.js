export const REQUEST = 'GET_MAX_AMOUNT';

export function getMaxAmnt(designation,grade,CatgId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getMaxAmountSales?designation=${designation}&grade=${grade}&CatgId=${CatgId}`
      }
    }
  };
}