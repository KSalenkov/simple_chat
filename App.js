import React, { Component } from 'react';
import { StyleSheet,
          View,
          TextInput,
          KeyboardAvoidingView,
          TouchableOpacity,
          Image,
          AppState} from 'react-native';
import { width, height } from './constants/sizes';
import { idClient } from './constants/thisDevise';
import MessageList from './components/MessageList';
import RandomString from './components/RandomString';
import { Notifications } from 'expo';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      DATA: [],
      dataLoaded: false,
      serverInput: '192.168.88.221',
      server: '',
      appState: AppState.currentState
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', (nextAppState) => {
      this.setState({appState: nextAppState})
    });
    const channel = {
      name: 'Simple Chat',
      sound: true
    }
    Notifications.createChannelAndroidAsync('simplechat', channel)
  }
  

  componentWillUnmount() {
    this.state.ws.close()
  }

  getDataMessage = async (server) => {

    try {
      const response = await fetch(`http://${server}:3000/dataMessage.json`);
      
      if (!response.ok) {
        this.setState({dataLoaded: false})
      } else {      
        const responseJson = await response.json();
        
        this.setState({
          dataLoaded: true,
          DATA: responseJson
        })
      }  
    } catch (error) {
      console.log(error)
    }
  }

  _addServer = (text) => {
    this.setState({serverInput: text});
  }

  _connectServer = () => {
    const { serverInput, server, ws } = this.state;
    if (serverInput) {
      this.getDataMessage(serverInput);
      this.setState({
        serverInput: '',
        server: serverInput
      })
      if (!ws) {
        this.setState({
          ws: new WebSocket(`ws://${serverInput}:3000`)
        })
      } else {
        ws.close();
        this.setState({
          ws: new WebSocket(`ws://${serverInput}:3000`)
        })
      }
    }

  }

  _addMessage = (text) => {
    this.setState({message: text})
  }

  _sendMessage = () => {
    const { message } = this.state;
    if(message) {
      const time = new Date;
      const id = (+time).toString()+'-'+RandomString(9)+'-'+RandomString(9);
      
      const messageLast = [{
        id,
        message,
        time,
        idClient
      }];
      this.state.ws.send(JSON.stringify(messageLast));
      this.setState({
        message: ''
      });
    }
  }

  _pushNotification = (data) => {
    const notification = {
      title: 'Новое сообщение',
      body: data,
      android: {
        channelId: 'simplechat',
        icon: './src/image/chat_icon.png'
      }
    }
    
    Notifications.presentLocalNotificationAsync(notification)
  }

  render() {
    
    if(this.state.ws) {
      this.state.ws.onopen = () => {
        this.setState({dataLoaded: true})
      }
      
      this.state.ws.onmessage = (event) => {
        this.setState({
          DATA: [...JSON.parse(event.data), ...this.state.DATA]
        });
        const message = JSON.parse(event.data)[0];
        if (message.idClient != idClient && this.state.appState != 'active') {
          this._pushNotification(message.message);
        }
      }
    }

    return (
      <View style={styles.container}>
        
        <KeyboardAvoidingView 
          style={styles.messageContainer} 
          behavior='padding' 
          keyboardVerticalOffset={height*0.1}
        >
            <View style={styles.header}>
              <TextInput 
                style={styles.inputStyle}
                placeholder='Введите адрес сервера'
                value={this.state.serverInput}
                onChangeText={this._addServer}
              />
              <TouchableOpacity 
                style={styles.btnStyle}
                onPress={this._connectServer}>
                  <Image
                    style={{width: 35, height: 35}}
                    source={require('./src/image/ok.png')}
                  />
              </TouchableOpacity>
            </View>
            <View style={styles.messageStyle}>
              <MessageList 
                loaded={this.state.dataLoaded}
                data={this.state.DATA}
              />
            </View>
        </KeyboardAvoidingView>

        <KeyboardAvoidingView behavior='position'>
          <View style={styles.footer}>
            <TextInput 
              style={styles.inputStyle}
              placeholder='Введите сообщение'
              value={this.state.message}
              onChangeText={this._addMessage}
            />
            <TouchableOpacity 
              style={styles.btnStyle}
              onPress={this._sendMessage}>
                <Image
                  style={{width: 45, height: 45}}
                  source={require('./src/image/btn.png')}
                />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-between',
  },
  messageContainer: {
    height: height*0.9,
    backgroundColor: '#e0dfdf',
    paddingHorizontal: 10,
    paddingTop: height * 0.1,
    paddingBottom: 10,
  },
  footer: {
    width: width,
    height: height*0.1,
    backgroundColor: '#e0dfdf',
    padding: 10,
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageStyle: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center'
  },
  inputStyle: {
    width: width *0.8,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRadius: 2,
    paddingHorizontal: 3
  },
  btnStyle: {
    height: 40,
    width: width*0.13,
    backgroundColor: '#e0dfdf',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  }
})

export default App;