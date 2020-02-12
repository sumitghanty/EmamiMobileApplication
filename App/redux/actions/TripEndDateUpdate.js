export const REQUEST = 'TRIP_END_DATE_UPDATE';

export function tripEndDateUpdate(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateTripEndDateById`,
        data: data
      }
    }
  };
}