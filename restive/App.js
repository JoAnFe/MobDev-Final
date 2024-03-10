import * as React from 'react';
//import React, {useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, useColorScheme, Animated, Dimensions, SafeAreaView } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { useRef, useEffect } = React;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const cellHeight = screenWidth/1.4;
var breathVal = 5000;


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

// --------------------------------------------------------------------------------------------- rest page main funtion
// --------------------------------------------------------------------------------------------------------------------
function RestPage({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity for the text
  const ballOpacity = useRef(new Animated.Value(0)).current; // Initial opacity for the ball
  const ballScale = useRef(new Animated.Value(1)).current; // Initial scale for the ball
  const [counter, setCounter] = useState(0); // Initialize counter state

  useEffect(() => {
    // Sequence for fading out text and fading in ball
    Animated.sequence([
      Animated.delay(2000), // Wait...

      Animated.timing(fadeAnim, { // Fade out the text
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),

      Animated.timing(ballOpacity, { // Fade in the ball
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),

    ]).start(() => {
      // After the sequence is complete, start the breathing effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(ballScale, {
            toValue: 0, // Scale down
            duration: breathVal,
            useNativeDriver: true,
          }),
          Animated.timing(ballScale, {
            toValue: 1, // Scale up
            duration: breathVal,
            useNativeDriver: true,
          }),

          Animated.delay(500), // Pause for a split second (500 milliseconds) at original size

        ])
      ).start();

    });
  }, [fadeAnim, ballOpacity, ballScale]);

  return (
    <View style={styles.container}>

      <StatusBar style="auto" />

      <Animated.Text 
        style={[styles.fadeText, { 
          opacity: fadeAnim }]}>
        breathe in... {/* text here will fade into display as soon as the page is opened, then fade out as per fadeAnim is assigned in the earlier code */}
      </Animated.Text>

      <Animated.View 
        style={[styles.ball, { 
          opacity: ballOpacity, 
          transform: [{ scale: ballScale }] // Apply scaling animation
        }]} 
      />

    </View>
  );
}


//----------------------------- >>>> END REST PAGE >>----------------------------- >>>>
//----------------------------- >>>> END REST PAGE >>----------------------------- >>>>

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
    width: screenWidth*1.3,
    height: screenWidth*1.3,
    backgroundColor: 'blue',
    borderRadius: 1000, // Make it a circle
    position: 'absolute', // Allows the text and the ball to occupy the same space
    opacity: 0, // Start invisible
  },
});
