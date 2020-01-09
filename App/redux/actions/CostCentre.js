export const REQUEST = 'GET_COST_CENTRE';

export function getCostCentre(costCentre) {
  return {
    type: REQUEST,
    payload: {
      request: {
        url: `getBudgetListForCostCentre?costCentre=${costCentre}`
      }
    }
  };
}