import React, { Component } from 'react';
import AppNavigator from './navigation/AppNavigator'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from './reducers'

const store = createStore(reducers)
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    )
  }
}

export default App;