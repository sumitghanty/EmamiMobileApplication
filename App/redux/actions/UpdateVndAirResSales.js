export const REQUEST = 'UPDATE_VENDER_AIR_RES_SALES';

export function updateVndAirResSales(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateVendorResSalesFlightSelectedstatus`,
        data: data
      }
    }
  };
}