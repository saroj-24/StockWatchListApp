import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigations/AppNavigator';


const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;