import * as React from 'react';
//import React, {useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, useColorScheme, Animated, Dimensions, SafeAreaView } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { useRef, useEffect } = React;

const screenWidth = Dimensions.get('window').width;
const cellHeight = screenWidth/1.4;

// Home Page
function HomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
      <Button
        title="rest"
        onPress={() => navigation.navigate('Rest')}
      />
      <Button
        title="settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

function RestPage({ navigation }) {
  const inOpacity = useRef(new Animated.Value(0)).current;
  const ballOpacity = useRef(new Animated.Value(0)).current; // Opacity for the blue ball
  const ballScale = useRef(new Animated.Value(1)).current; // Scale for the blue ball

  useEffect(() => {
    // Sequence: Text fades in, then after a delay, the blue ball appears
    Animated.sequence([
      Animated.timing(inOpacity, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.delay(4000), // Wait for 4 seconds after text animation
      Animated.timing(ballOpacity, { // Fade in the blue ball
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();

    // Loop for the blue ball growing and shrinking
    Animated.loop(
      Animated.sequence([
        Animated.timing(ballScale, {
          toValue: 1.5, // Grow the ball to 1.5 times its size
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(ballScale, {
          toValue: 1, // Shrink the ball back to its original size
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [inOpacity, ballOpacity, ballScale]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Animated.Text style={{ color: "blue", fontSize: cellHeight / 6, opacity: inOpacity }}>
        breathe in...
      </Animated.Text>
      <Animated.View style={{
        opacity: ballOpacity,
        width: 50, // Initial size
        height: 50,
        backgroundColor: 'blue',
        borderRadius: 25, // Make it a circle
        marginTop: 20, // Adjust spacing as needed
        transform: [{ scale: ballScale }], // Apply the scaling
      }} />
    </View>
  );
}

// Settings Page
function SettingsPage() {
  return (
    <View style={styles.container}>
      <Text>Settings Page</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const scheme = useColorScheme(); // Hook to get the color scheme


  
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Rest" component={RestPage} />
        <Stack.Screen name="Settings" component={SettingsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // force dark background
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
