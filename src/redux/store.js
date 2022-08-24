import { legacy_createStore as createStore ,combineReducers} from "redux"; 
import loadingReceduer from './reducers/loading'
import collapseReceduer from './reducers/collapse'

const reducer = combineReducers({
  loadingReceduer,
  collapseReceduer
});

const store = createStore(reducer)

console.log(store.getState());

export default store