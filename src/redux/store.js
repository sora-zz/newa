import { legacy_createStore as createStore ,combineReducers} from "redux"; 
import loadingReceduer from './reducers/loading'
import collapseReceduer from './reducers/collapse'
import tokenReceduer from './reducers/token'

const reducer = combineReducers({
  loadingReceduer,
  collapseReceduer,
  tokenReceduer
});

const store = createStore(reducer)

export default store