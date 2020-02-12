export const REQUEST = 'GET_VENDOR_LIST';

export function getVendor(vtype) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getDomesticVendorListAccordingToReqType?vendor_type=${vtype}`
      }
    }
  };
}