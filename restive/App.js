import * as React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, useColorScheme, Animated, Dimensions, Alert, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {  TableView, Section, Cell } from 'react-native-tableview-simple';

const { useRef, useState, useEffect, createContext, useContext } = React;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const cellHeight = screenWidth/1.4;

var breathVal = 5000; // the variable that assigns the length of half of one full cycle
var dotCounter = 'gold'; // ideally this would be reassigned when the cycle runs through the entire grid
var numberofBreaths = 10; // how long the rest program runs for, where 1 = full cycle

const circleDiameter = screenWidth * 2 / 3; // Large circle diameter
const CircleVisibilityContext = createContext(); // Creates a context for global state
const useCircleVisibility = () => useContext(CircleVisibilityContext); // the circle on the rest page
const CircleVisibilityProvider = ({ children }) => { // Define a provider component for global state
  const [visibilityCount, setVisibilityCount] = useState(0); // Global state for visibility control
  return (
    <CircleVisibilityContext.Provider value={{ visibilityCount, setVisibilityCount }}>
      {children}
    </CircleVisibilityContext.Provider>
  );
};
const SmallRedCircle = ({ index }) => { // Individual small circle component - its not red, but it used to be
  const { visibilityCount } = useCircleVisibility();
  return (
    <View style={styles.gridItem}>
      {index < 30 && ( // notes the maximum numebr of snall cicrcles that can be rendered.
        <View style={styles.smallCircle} />
      )}
    </View>
  );
};
////////////////////////////////////////////////////////////////////////////////////////////////////// Home Page
function HomePage({ navigation }) {
  const { visibilityCount } = useCircleVisibility();

  return (
    <View style={styles.container}>

      <View style={styles.gridContainer}>
        {Array.from({ length: visibilityCount }).map((_, index) => (
          <SmallRedCircle key={index} index={index} />
        ))}
      </View>

      <View style={styles.buttonSpace}>
        <Button
          title="settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <TouchableOpacity
        style={styles.largeCircle}
        onPress={() => navigation.navigate('Rest')}
      />
      <StatusBar style="auto" />

    </View>
  );
}
////////////////////////////////////////////////////////////////////////////////////////////////////// Rest Page 
function RestPage({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity for the text
  const ballOpacity = useRef(new Animated.Value(0)).current; // Initial opacity for the ball
  const ballScale = useRef(new Animated.Value(1)).current; // Initial scale 
  const restTime = Animated.delay(500) // Pause for a split second (500 milliseconds) at original size

  const ballDown =  Animated.timing(ballScale, {
    toValue: 0, // Scale down
    duration: breathVal,
    useNativeDriver: true,});
  const ballUp = Animated.timing(ballScale, {
    toValue: 1, // Scale up
    duration: breathVal,
    useNativeDriver: true, });
  const meditation = Animated.sequence([
    ballDown,
    ballUp,
    restTime,]);
  const ballCounter =   useEffect(() => { // THIS DECLARES [visibilityCount, setVisibilityCount] SO DONT MOVE IT FURTHER DOWN
    // Ensures we don't go over 30
    if (visibilityCount < 18) {
      setVisibilityCount(visibilityCount + 1);
    } else {
      setVisibilityCount(0);
    }
  }, [visibilityCount, setVisibilityCount]);
  const { visibilityCount, setVisibilityCount } = useContext(CircleVisibilityContext);

  useEffect(() => { // this is basically the 'rest' function itself...
    Animated.sequence([ // Sequence for fading out text and fading in ball
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
    ]).start(() => { // After the sequence is complete, start the breathing effect
      Animated.loop(
        meditation,
        {iterations: numberofBreaths}
      ).start(() => {
        ballCounter,
        {iterations: 1}
        navigation.navigate('Home')
      });
    });
  }, [fadeAnim, ballOpacity, ballScale]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <Animated.Text 
        style={[styles.fadeText, { 
          opacity: fadeAnim }]}>
        breathe in... {/* text here will fade into display as soon as the page is opened, then fade out as per fadeAnim is assigned in the earlier code */}
      </Animated.Text>
      <Animated.View 
        style={[styles.ball, { 
          opacity: ballOpacity, 
          transform: [{ scale: ballScale }] // Apply scaling animation
        }]}/>
    </View>
  );
}
////////////////////////////////////////////////////////////////////////////////////////////////////// Settings Page
const SettingsPage = ({ navigation }) => {
  const { setVisibilityCount } = useContext(CircleVisibilityContext); // Use useContext to access setVisibilityCount
  const SystemButton = ({ title, onPress }) => { // buttons for the settings page, or any other config page
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
        <Icon name="chevron-right" size={30} color="#5a5a5f" />
      </TouchableOpacity>
    );
  };
  const DATA = [
    { id: '1', title: 'Default timer', link: 'Timer', detail: '' },
    { id: '2', title: 'Reset progress', detail: '' },
    { id: '3', title: 'Total time', detail: '' },
  ];
  const Item = ({ title, link, detail }) => { // retuns system buttons as well
    const handlePress = () => {
      if (link) {
        navigation.navigate(link);
      } else if (title === 'Reset progress') {
        Alert.alert("Reset Progress", "Are you sure?", [ // an alert for reset progress
          { text: "Cancel", style: "cancel" },
          { 
            text: "Yes", onPress: () => {
              setVisibilityCount(0); // Reset the visibilityCount
              navigation.navigate('Home'); // navigate Home
            }
          },
        ]);
      }
    };
    return (
      <View style={styles.item}>
        <SystemButton
          title={`${title} ${detail}`}
          onPress={handlePress}
        />
      </View>
    );
  };
  return (
    <FlatList
      data={DATA}
      renderItem={({ item }) => <Item title={item.title} link={item.link} detail={item.detail} />}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listInset} // we use the Insrt style to make sure we are not at full width
    />
  );
};
const InfoButton = () => {
  // Custom accessory view component (e.g. an information icon)
  // React to onPress to show more info about resting time
  return;
};
////////////////////////////////////////////////////////////////////////////////////////////////////// Timer Page
function TimerPage() {
  return (
    <View style={styles.container}>
      <Text>...</Text>
      <StatusBar style="auto" />
    </View>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////// APP START
const Stack = createNativeStackNavigator();

export default function App() {
  const scheme = useColorScheme(); // Hook to get the color scheme
  const pan = useRef(new Animated.ValueXY()).current;

  return (
    <NavigationContainer theme={DarkTheme}>
      <CircleVisibilityProvider>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Rest" component={RestPage} />
          <Stack.Screen name="Settings" component={SettingsPage} />
          <Stack.Screen name="Timer" component={TimerPage} />
        </Stack.Navigator>
      </CircleVisibilityProvider>
    </NavigationContainer>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////// STYLES 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // force dark mode
    position: 'relative', // Needed for absolute positioning
  },
  
  settings: {
    flex: 1,
    backgroundColor: '#000', 
  },
  button: { // causes issues
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
  
  },
  buttonText: {
    color: 'white', // Text color
    fontSize: screenHeight/50,
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
  listInset: {
    paddingTop: screenWidth/8,
    paddingVertical: 10, // Vertical padding for the whole list
    paddingHorizontal: 16, // Horizontal padding for the list's inset style
    //backgroundColor: '#000', // dark mode
  },
  item: { // SETTINGS CELL 
    //alignContent: 'left',
    backgroundColor: '#1C1C1E', // need to find the correct system colour... but this is the background to the settings cell
    padding: screenHeight/1000,
    marginVertical: 1,
    //marginHorizontal: 1,
    borderRadius: 10, // Rounded corners for each item
  },
  title: {
    fontSize: 18,
    color: '#000'
  },

  //
  gridContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '33%',
    justifyContent: 'left',
    alignItems: 'center',
    
  },

  buttonSpace: {
  
   position: 'absolute', // make sure we dont come before the circle
    paddingTop: screenHeight/1.5, // ensure we render at bottom of screen
    alignItems: 'center', 
  },


  gridItem: {
    width: `${100 / 6}%`, // Divide the top third into 6 columns
    height: '29%', // Each item is 1/3 of the top third
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: dotCounter ,
  },
  largeCircle: {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    backgroundColor: 'blue',
    marginBottom: -(circleDiameter / 3), // Adjust based on your layout needs
  
  },
});

// old code
// useRef to track touch distance


// old home page
// function HomePage({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text>Home Page</Text>

//       <Animated.View 
//         style={[styles.ball, { 
//           opacity: ballOpacity, 
//           transform: [{ scale: ballScale }] // Apply scaling animation
//         }]} 
//       />

//       <Button
//         title="rest"
//         onPress={() => navigation.navigate('Rest')}
//       />
      
      // <Button
      //   title="settings"
      //   onPress={() => navigation.navigate('Settings')}
      // />
//       <StatusBar style="auto" />
//     </View>
//   );
// }

  // cellTop: {
  //   borderTopLeftRadius: 10, // Rounded top-left corner
  //   borderTopRightRadius: 10, // Rounded top-right corner
  //   backgroundColor: '#424242',
  // },
  // cellContent: {
  //   flexDirection: 'row', 
  //   alignItems: 'center',
  //   padding: screenHeight/45, // Adjust the padding as needed
  //   backgroundColor: '#424242',
  // },
  // cellBottom: {
  //   borderBottomLeftRadius: 10, // Rounded bottom-left corner
  //   borderBottomRightRadius: 10, // Rounded bottom-right corner
  //   backgroundColor: '#424242',
  // },
  // cellText: {
  //   flex: 1,
  //   color: '#ffffff', // White text color
  // },
  // cellDetail: {
  //   color: '#ffffff', // White text color for the detail
  // },


///////////////////////////////////////////////////////// --- the below works
//   return (
//     <View style={styles.settings}>
//       {/* ... other settings components ... */}
//       <SystemButton
//         title="Default timer"
//         onPress={() => navigation.navigate('Timer')}
//       />
//       <SystemButton
//         title="Reset progress"
//         onPress={() => {Alert.alert("Progress has been reset ");}}
//       />
//       {/* ... other settings components ... */}
//     </View>
//   );
  
//////////////////////////////////////////////////////// --- the above works

// const SettingsPage = () => {
//   return (
//     <SafeAreaView style={styles.settings}>
    
//       <TableView style={styles.tableContainer}>
      
//         <Section sectionTintColor="transparent">
//           <Cell
//           accessory="DisclosureIndicator"
//             cellContentView={
//               <View style={[styles.cellContent, styles.cellTop]}> 
//                 <Text style={styles.cellText}>Default timer</Text>
//               </View>
//             }
            
//             onPress={() => {/* Navigate to timer settings */}}
//           />

//           <Cell
//           accessory="DisclosureIndicator"
//             cellContentView={
//               <View style={[styles.cellContent, styles.cell]}>
//                 <Text style={styles.cellText}>Reset progress</Text>
//                 <Text style={styles.cellDetail}></Text>
//               </View>
//             }
//             onPress={() => {Alert.alert("Progress has been reset ");}} // Reset the counter logic
//           />
//           <Cell
//           accessory="DisclosureIndicator"
//             cellContentView={
//               <View style={[styles.cellContent, styles.cellBottom]}>
//                 <Text style={styles.cellText}>Total time spent resting:</Text>
//                 <Text style={styles.cellDetail}>120 min</Text>
//               </View>
//             }
//             onPress={() => {/* Additional logic if needed */}}
//           />
//         </Section>
       
//       </TableView>
      
//     </SafeAreaView>
//   );
// };