import React, {Component} from 'react';
import {View, FlatList, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ButtonGroup, withTheme, Text } from 'react-native-elements';


class addFriendsScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      query: ""

    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
    this.addFriend();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search", {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            listData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  searchData = async (query) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search?q=" + query, {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            listData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  addFriend = async (user_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/"+ user_id + "/friends" ,{
      method: 'POST',
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
          console.log(response.status)
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            friendRequestsData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }  

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {

    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    }else{
      return (
        <View>
<TextInput
                    placeholder="Search user"
                    onChangeText={(query) => this.setState({query})}
                    value={this.state.query}
                    style={{padding:5, borderWidth:1, margin:5}}
                />

<Button
                    title="Search"
                    onPress={() => this.searchData(this.state.query)}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
          <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                    <View>
                      <Text> {item.user_id} {item.user_givenname} {item.user_familyname}
                      <Button
                    title=""
                    icon={{
                      name: 'user-plus',
                      type: 'font-awesome',
                      size: 15,
                      color: 'white',
                    }}
                    iconContainerStyle={{ marginRight: 10 }}
                    titleStyle={{ fontWeight: '700' }}
                    buttonStyle={{
                      backgroundColor: 'rgba(90, 154, 230, 1)',
                      borderColor: 'transparent',
                      borderWidth: 0,
                      borderRadius: 30,
                    }}
                    containerStyle={{
                      width: 100,
                      marginHorizontal: 50,
                      marginVertical: 10,
                    }}
                    onPress={() => this.addFriend(item.user_id)}
                    
                />
                      </Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
        </View>
      );
    }
    
  }
}



export default addFriendsScreen;
