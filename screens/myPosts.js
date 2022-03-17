import React, {Component} from 'react';
import {View, FlatList} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Button, ButtonGroup, withTheme, Text } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';


class MyPostsScreen extends Component {
    
  constructor(props){
    super(props);

    this.state = {
      isLoading: false,
      myPostdata:[],
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getMyPosts();
    });
  
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  getMyPosts = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + idValue + "/post", {
      method: 'get',
      headers: {
          "X-Authorization": value
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
            myPostdata: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  deletePosts = async (user_id, post_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" +user_id+ "/post/" +post_id , {
      method: 'DELETE',
      headers: {
        'X-Authorization': value 
    }
})
    .then((response) => {
        if (response.status === 200) {
            console.log("Ok")
            this.getMyPosts()
        } else if (response.status === 400) {
            throw Error('Failed validation')
        } else {
            return response.json()
            // throw Error('Something went wrong')
        }
    })
    .then((responseJson) => {
        console.log('Delete: ', responseJson)
    })
    .catch((error) => {
        console.log(error)
    })
}


  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {
    console.log(this.state.myPostdata)


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
        <View         
        style={{
          flex: 1,
          flexDirection: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
                      <FlatList
                data={this.state.myPostdata}
                renderItem={({item}) => (
                    <View>
                      <Text>Post ID: 
                        <Button
                    title= {item.post_id}
                    onPress={() => this.props.navigation.navigate('SinglePost', {user_id: item.author.user_id, post_id: item.post_id})}
                    style={{padding:5, borderWidth:1, margin:5}}
                />  "{item.text}" Author: {item.author.first_name} {item.author.last_name} 
              <Button
                title=""
                icon={{
                  name: 'trash',
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
                onPress={() => this.deletePosts(item.author.user_id, item.post_id)}
              />
                            <Button
                title=""
                icon={{
                  name: 'edit',
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
                onPress={() => this.unLikePosts(item.author.user_id, item.post_id)}
              />
                       </Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.post_id.toString()}
              />



        </View>
      );
    }
    
  }
}







export default MyPostsScreen;