export const REQUEST = 'GET_PURPOSE';

export function getPurpose(activeFor) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `activeForListOfTripForMaster?active_for=${activeFor}`
      }
    }
  };
}