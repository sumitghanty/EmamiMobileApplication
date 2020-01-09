export const REQUEST = 'GET_STATUS';

export function getStatus(statusId,substatusId) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getSubStatusValueForKey?status_id=${statusId}&substatus_id=${substatusId}`
      }
    }
  };
}