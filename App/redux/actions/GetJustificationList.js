export const REQUEST = 'GET_JUSTIFICATION_LIST';

export function getJustificationList() {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getJustificationList`
      }
    }
  };
}