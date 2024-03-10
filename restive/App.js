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
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity for the text
  const ballOpacity = useRef(new Animated.Value(0)).current; // Initial opacity for the ball
  const ballScale = useRef(new Animated.Value(1)).current; // Initial scale for the ball

  useEffect(() => {
    // Sequence for fading out text and fading in ball
    Animated.sequence([
      Animated.delay(4000), // Wait for 4 seconds
      Animated.timing(fadeAnim, { // Fade out the text
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(ballOpacity, { // Fade in the ball
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After the sequence is complete, start the breathing effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(ballScale, {
            toValue: 9, // Scale up
            duration: 10000,
            useNativeDriver: true,
          }),
          Animated.timing(ballScale, {
            toValue: 1, // Scale down
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [fadeAnim, ballOpacity, ballScale]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Animated.Text style={[styles.fadeText, { opacity: fadeAnim }]}>
        breathe in...
      </Animated.Text>
      <Animated.View style={[styles.ball, { 
        opacity: ballOpacity, 
        transform: [{ scale: ballScale }] // Apply scaling animation
      }]} />
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // force dark mode
    position: 'relative', // Needed for absolute positioning
  },
  fadeText: {
    color: "blue",
    fontSize: cellHeight/6, // Adjust as needed
    position: 'absolute', // Allows the text and the ball to occupy the same space
  },
  ball: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 25, // Make it a circle
    position: 'absolute', // Allows the text and the ball to occupy the same space
    opacity: 0, // Start invisible
  },
});
