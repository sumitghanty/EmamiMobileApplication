export const REQUEST = 'GET_STATES';

export function getStates() {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getStateList`
      }
    }
  };
}