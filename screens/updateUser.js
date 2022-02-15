import React, { Component } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orig_first_name: "",
            orig_last_name: "",
            orig_email: "",
            orig_password: "",
            id: "",
            item_name: "",
            last_name: "",
            email: "",
            password: ""
        };
    }
    


    updateItem = () => {
        let to_send = {};

        if (this.state.first_name != this.state.orig_first_name) {
            to_send['first_name'] = this.state.first_name;
        }

        if (this.state.last_name != this.state.orig_last_name) {
            to_send['last_name'] = this.state.last_name;
        }

        if (this.state.email != this.state.orig_email) {
            to_send['email'] = (this.state.email);
        }

        if (this.state.password != this.state.orig_password) {
            to_send['password'] = (this.state.password);
        }

        console.log(JSON.stringify(to_send));

        const value = AsyncStorage.getItem('@session_token');
        const userid = AsyncStorage.getItem('@userid')

        return fetch("http://localhost:3333/api/1.0.0/" + "user/" + "8", {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'x-authorization': '5a3307cb7807f016e3e44930dbb4c816',
            },
            body: JSON.stringify(to_send)
        })
            .then((response) => {
                console.log("Item updated");
            })
            .catch((error) => {
                console.log(error);
            })
    }



    render() {
        return (
            <View>
                <Text>Update an Item</Text>

                <TextInput
                    placeholder="Enter first name..."
                    onChangeText={(first_name) => this.setState({ first_name })}
                    value={this.state.first_name}
                />
                <TextInput
                    placeholder="Enter last name..."
                    onChangeText={(last_name) => this.setState({ last_name })}
                    value={this.state.last_name}
                />
                <TextInput
                    placeholder="Enter email..."
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Enter password..."
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                />
                <Button
                    title="Update"
                    onPress={() => this.updateItem()}
                />
            </View>
        );
    }
}


export default App;
