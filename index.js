/**
 * @format
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import { Provider } from 'react-redux';
import store from './App/redux'
import App from './App/App'
import {name as appName} from './app.json'

export default class TravelManagment extends Component {
  render() {
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => TravelManagment);
