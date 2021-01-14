export const REQUEST = 'GET_MAX_AMOUNT_SALES';

export function getMaxAmntSales(grade,category,dest_city_type,dest_city_class,entitlement) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getMaxAmountForSalesBySubCategory?grade=${grade}&category=${category}&dest_city_type=${dest_city_type}&dest_city_class=${dest_city_class}&entitlement=${entitlement}`
      }
    }
  };
}