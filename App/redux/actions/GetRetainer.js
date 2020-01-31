export const REQUEST = 'GET_RETAINER';

export function getRetainer() {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getRetainerNameList`
      }
    }
  };
}