export const REQUEST = 'GET_REQ_NAME';

export function getReqName() {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getSubCategoryNameForKeyDB?key=`
      }
    }
  };
}