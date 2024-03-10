import * as React from 'react';
import React, {useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, useColorScheme, Animated, Dimensions, SafeAreaView } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

// Rest Page
function RestPage({ navigation }) {

  const AnimatedText = (props) => {
    const textOpacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(
        textOpacity,
        {
          toValue: 1,
          duration: 4000
        }
      ).start();
    }, [textOpacity])

    return (
      <Animated.Text
        style={{
          ...props.style,
          opacity: textOpacity
        }}
      >
        {props.children}
      </Animated.Text>
    )
  }

  return (
    <View style={styles.container}>
     <StatusBar style="auto" />
        <AnimatedText style={{color: "blue", fontSize: cellHeight/6}}>
          breathe in...
        </AnimatedText>

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
