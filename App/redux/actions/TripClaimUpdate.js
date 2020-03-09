export const REQUEST = 'TRIP_CLAIM_UPDATE';

export function tripClaimUpdate(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
        method: 'post',
        url: `updateTNStripClaimDetails`,
        data: data
      }
    }
  };
}