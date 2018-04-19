import React from 'react';
import {StackNavigator} from 'react-navigation';
import HomeRoot from './homeDirectory/homeRoot';
import LoginPage from './loginDirectory/loginPage';
import OTPScreen from './loginDirectory/OTPScreen'

const Navigation=StackNavigator(
    {
        HomeRoot:{
            screen:HomeRoot
        },
        LoginPage:{
            screen:LoginPage
        },
        OTPConfirmationPage:{
            screen:OTPScreen
        },
    },
    {
        headerMode:"none",
    }
);

export default class ParentApp extends React.Component{
    render(){
        return(
            <Navigation/>
        )
    }
}