export const REQUEST = 'GET_LOCATIONS';

export function getReqLocations() {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getLocationList`
      }
    }
  };
}