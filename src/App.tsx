import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './router';
import {createTable} from './database';

function App(): React.JSX.Element {
  useEffect(() => {
    createTable();
  }, []);

  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}

export default App;
