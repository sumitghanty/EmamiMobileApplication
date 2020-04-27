export const REQUEST = 'GET_CITY_NAME';

export function getCityName(id) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `cityCategoryById?cityCatgId=${id}`
      }
    }
  };
}