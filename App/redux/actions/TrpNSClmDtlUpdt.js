export const REQUEST = 'TRIP_NONE_SALE_CLAIM_DETAILS_UPDATE';

export function trpNSClmDtlUpdt(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateRequisitionNonSales`,
        data: data
      }
    }
  };
}