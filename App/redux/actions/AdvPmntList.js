export const REQUEST = 'GET_ADV_PMNTS';

export function getAdvPmnts(userId,statusId,data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `getAdvPayTripForNonSalesListStatuses?userid=${userId}&trip_For=${statusId}`,
        data: data
      }
    }
  };
}