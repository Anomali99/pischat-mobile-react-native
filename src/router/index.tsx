import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {MainPage, RegisterPage, LoginPage, ContentPage} from '../pages';

enableScreens();

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Content: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Router: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Main"
        component={MainPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Content"
        component={ContentPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Router;
