export const REQUEST = 'UPDATE_VENDER_AIR_RES';

export function updateVndAirRes(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateVendorResFlightSelectedstatus`,
        data: data
      }
    }
  };
}