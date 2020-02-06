import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { width } from '../constants/sizes'
import MainScreen from '../screens/MainScreen';
import Options from '../screens/Options'
import TestScreen from '../screens/TestScreen'


const StackNavigator = createStackNavigator(
    {
       
        Main: {
            screen: MainScreen,
            navigationOptions: () => ({
                header: null,
            })
        },
        Options: {
            screen: Options,
            navigationOptions: (navigation) => {
                let color = navigation.navigation.state.params.color
                return ({
                    title: 'Options',
                    headerStyle: {
                        backgroundColor: color,
                    },
                    headerTitleStyle: {
                        width: width-145,
                        textAlign: 'center',
                    }
                })
            }
            
                
        },
        Test: {
            screen: TestScreen
        },
    }
)

export default StackNavigator