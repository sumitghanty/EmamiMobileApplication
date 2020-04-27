export const REQUEST = 'YEAR_LIST';

export function getYear() {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getYearList`
      }
    }
  };
}