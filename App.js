// App.js
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image, StyleSheet } from 'react-native';

import LoginScreen from './src/screens/Loginscreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UserHomeScreen from './src/screens/UserHomeScreen';  // user dashboard
import AdminDashboard from './src/screens/AdminHomeScreen';  // admin dashboard
import UserFavouriteScreen from './src/screens/UserFavouritScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import CreatePostScreen from './src/screens/CreatePostScreen'; 
import MapPickerScreen from './src/screens/MapPickerScreen';

function SplashScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Login'), 3000);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <Image source={require('./assets/favicon.png')} style={styles.splashImage} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        {/* Splash */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* App routes used by Login redirect */}
        <Stack.Screen name="Home" component={UserHomeScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />

        {/*Other user screens*/}
        <Stack.Screen name="Favourite" component={UserFavouriteScreen} />
        <Stack.Screen name="Profile" component={UserProfileScreen} />

        {/*create post screen*/}
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />

        <Stack.Screen name="MapPicker" component={MapPickerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: { width: 150, height: 150 },
});