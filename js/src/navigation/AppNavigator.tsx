// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../views/LoginScreen';
;

import AuthViewModel from '../viewmodels/AuthViewModel'; '../viewmodels/AuthViewModel';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={AuthViewModel.isLoggedIn ? "Login" : "Login"}
    >
      {/* {!AuthViewModel.isLoggedIn ? (
        <Stack.Screen name="Login" component={LoginScreen} />)
      :null} */}
         <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
