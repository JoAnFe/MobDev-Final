import * as React from 'react';
//import React, {useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, useColorScheme, Animated, Dimensions, SafeAreaView } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import {  TableView, Section, Cell } from 'react-native-tableview-simple';
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
 // const [counter, setCounter] = useState(0); // Initialize counter state

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
const SettingsPage = () => {
  return (
    <SafeAreaView style={styles.settings}>

      <TableView style={styles.tableContainer}>
        <Section>
          <Cell
            cellContentView={
              <View style={[styles.cellContent, styles.cellTop]}>
                {/* Content of your top cell */}
                <Text style={styles.cellText}>Default timer</Text>
              </View>
            }
            accessory="DisclosureIndicator"
            onPress={() => {/* Navigate to timer settings */}}
          />
          <Cell
            cellStyle="Basic"
            title="Reset progress"
            accessory="DisclosureIndicator"
            titleTextColor="#ffffff"
            backgroundColor="#424242" // Use the grey color for the cell
            onPress={() => {/* Reset the counter logic */}}
          />
          <Cell
            cellContentView={
              <View style={[styles.cellContent, styles.cellBottom]}>
                {/* Content of your bottom cell */}
                <Text style={styles.cellText}>Total time spent resting:</Text>
                <Text style={styles.cellDetail}>120 min</Text>
              </View>
            }
            accessory="DisclosureIndicator"
            onPress={() => {/* Additional logic if needed */}}
          />
        </Section>
      </TableView>

    </SafeAreaView>
  );
};
const InfoButton = () => {
  // Custom accessory view component (e.g. an information icon)
  // React to onPress to show more info about resting time
  return;
};

// function SettingsPage({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text>Settings Page</Text>
//       <Button
//         title="change timer"
//         onPress={() => navigation.navigate('Timer')}
//       />
//       <StatusBar style="auto" />
//     </View>
    
//   );
// }

// Timer Page
function TimerPage() {
  return (
    <View style={styles.container}>
      <Text>...</Text>
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
        <Stack.Screen name="Timer" component={TimerPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// STYLES 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // force dark mode
    position: 'relative', // Needed for absolute positioning
  },
  settings: {
    flex: 1,
    backgroundColor: '#000', // Dark background color
  },
  tableContainer: {
    margin: 15,
    backgroundColor: 'transparent', // Set the background color to transparent
  },
  cell: {
    backgroundColor: '#424242', // Grey color for the cell
  },
  cellContent: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 10, // Adjust the padding as needed
  },
  cellTop: {
    borderTopLeftRadius: 10, // Rounded top-left corner
    borderTopRightRadius: 10, // Rounded top-right corner
    backgroundColor: '#424242',
  },
  cellBottom: {
    borderBottomLeftRadius: 10, // Rounded bottom-left corner
    borderBottomRightRadius: 10, // Rounded bottom-right corner
    backgroundColor: '#424242',
  },
  cellText: {
    flex: 1,
    color: '#ffffff', // White text color
  },
  cellDetail: {
    color: '#ffffff', // White text color for the detail
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
