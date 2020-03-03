export const REQUEST = 'GET_HOTELS';

export function getHotels(reqType) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getDomesticVendorListAccordingToReqType?vendor_type=${reqType}`
      }
    }
  };
}