import React from 'react';
import { createAppContainer } from 'react-navigation';
import StackNavigator from './StackNavigator';

const AppNavigator = createAppContainer(StackNavigator);

export default AppNavigator