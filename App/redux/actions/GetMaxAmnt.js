export const REQUEST = 'GET_MAX_AMOUNT';

export function getMaxAmnt(grade,CatgId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getMaxAmountSales?grade=${grade}&CatgId=${CatgId}`
      }
    }
  };
}