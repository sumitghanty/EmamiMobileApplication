import {REQUEST} from '../actions/AdvPmnt'

export default (state = { dataSource: {}, isLoading: true, errorStatus:false}, action) => {
  switch(action.type){
    case REQUEST:
    state = {...state, isLoading:true}
    break;
    case REQUEST+'_SUCCESS':
    state = {...state, dataSource:action.payload.data, isLoading:false}
    break;
    case REQUEST+'_FAIL':
    state = {...state, error:action.payload, errorStatus:true, isLoading:false}
    break;
  }
  return state;
}
