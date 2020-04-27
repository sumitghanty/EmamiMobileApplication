export const REQUEST = 'GET_TICKETS_LIST_SALE';

export function getTicketsSales(tripNo,lineitem,tripHdrId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getVendorResponseSales?trip_no=${tripNo}&lineItem=${lineitem}&tripHdrId=${tripHdrId}`
      }
    }
  };
}