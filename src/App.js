import React from 'react'
import Router from './Router'
import store from './redux/store'
import { Provider } from 'react-redux'
import NewsBox from './views/news/NewsBox'

function App() {
  return (
    <Provider store={store}>
      <Router>
      <NewsBox />
      </Router>
    </Provider>

  )
}

export default App
