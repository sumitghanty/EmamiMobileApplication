export const REQUEST = 'GENERATE_EXPENSE';

export function generateExp(data) {
  return {
    type: REQUEST,
    payload: {
      request: {
				method: 'post',
        url: `generatePJP`,
        data: data
      }
    }
  };
}