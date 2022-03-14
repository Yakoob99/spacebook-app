import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import LogoutScreen from './screens/logout';
import ProfileScreen from './screens/profile';
import UpdateUserScreen from './screens/updateUser';
import FriendsScreen from './screens/friends';
import UploadPPScreen from './screens/uploadPP';
import addFriendsScreen from './screens/addFriends';
import SinglePostScreen from './screens/singlePost';


const Drawer = createDrawerNavigator();

class App extends Component{
    render(){
        return (
            <NavigationContainer>
                <Drawer.Navigator initialRouteName="Login">
                    <Drawer.Screen name="Home" component={HomeScreen} />
                    <Drawer.Screen name="Profile" component={ProfileScreen} />
                    <Drawer.Screen name="Friends" component={FriendsScreen} />
                    <Drawer.Screen name="Signup" component={SignupScreen} />
                    <Drawer.Screen name="Update Info" component={UpdateUserScreen} />
                    <Drawer.Screen name="Upload PP" component={UploadPPScreen} />
                    <Drawer.Screen name="Add Friends" component={addFriendsScreen} options ={{drawerItemStyle: { height: 0 }}}/> 
                    <Drawer.Screen name="Login" component={LoginScreen} />
                    <Drawer.Screen name="Logout" component={LogoutScreen} />
                    <Drawer.Screen name="SinglePost" component={SinglePostScreen} options ={{drawerItemStyle: { height: 0 }}}/>
                </Drawer.Navigator>
                
            </NavigationContainer>
        );
    }
}

export default App;