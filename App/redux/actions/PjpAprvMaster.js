export const REQUEST = 'PJP_TRIP_APROVE_MASTER';

export function postPjpAprvMaster(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateReqSalesMaster`,
        data: data
      }
    }
  };
}