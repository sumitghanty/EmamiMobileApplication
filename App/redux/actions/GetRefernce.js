export const REQUEST = 'GET_REFERNCE';

export function getRefernce(listName) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getRefernceListByName?listName=${listName}`
      }
    }
  };
}