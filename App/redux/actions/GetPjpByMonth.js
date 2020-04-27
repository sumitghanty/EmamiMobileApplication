export const REQUEST = 'GET_PJP_BY_MONTH';

export function getPjpByMonth(userId,month,year) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getTripListSalesbymonthyearanduserId?userId=${userId}&month=${month}&year=${year}`
      }
    }
  };
}