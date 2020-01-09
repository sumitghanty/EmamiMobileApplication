import {REQUEST} from '../actions/TripApproveWithReq'

export default (state = { dataSource: {}, isLoading: true, errorStatus:false, successStatus:false}, action) => {
  switch(action.type){
    case REQUEST:
    state = {...state, isLoading:true}
    break;
    case REQUEST+'_SUCCESS':
    state = {...state, dataSource:action.payload.data, isLoading:false, successStatus:true}
    break;
    case REQUEST+'_FAIL':
    state = {...state, error:action.payload, errorStatus:true, isLoading:false}
    break;
  }
  return state;
}
