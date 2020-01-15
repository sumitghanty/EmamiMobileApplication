export const REQUEST = 'GET_PJP_FOR_APPROVE_LIST';

export function getPjpAprvList(email,data) {
  return {
    type: REQUEST,
    payload: {
      request: {
				method: 'post',
        url: `getApprovalTripListSales1?userEmail=${email}`,
				data: data
      }
    }
  };
}