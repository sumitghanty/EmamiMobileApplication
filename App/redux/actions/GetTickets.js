export const REQUEST = 'GET_TICKETS_LIST';

export function getTickets(tripNo,lineitem,tripHdrId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getVendorResponseNonSales?trip_no=${tripNo}&lineItem=${lineitem}&tripHdrId=${tripHdrId}`
      }
    }
  };
}