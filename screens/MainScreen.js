import React, { Component } from 'react';
import { StyleSheet,
          View,
          Text,
          TextInput,
          KeyboardAvoidingView,
          TouchableOpacity,
          Image,
          AppState,
          AsyncStorage,
          Alert } from 'react-native';
import { width, height } from '../constants/sizes';
import { idClient } from '../constants/thisDevise';
import MessageList from '../components/MessageList';
import RandomString from '../components/RandomString';
import { Notifications } from 'expo';
import { stylesGray } from '../src/styles/stylesGray';
import { stylesDark } from '../src/styles/stylesDark'
import { connect } from 'react-redux';
import registerForPushNotificationsAsync from '../components/PushNotifications'
import { channel, channelId } from '../constants/channelNotification'
import { DissconnectServer } from '../actions/DissconnectServer'
import { CheckDataLoaded } from '../actions/CheckDataLoaded'
import ModalComponent from '../components/ModalComponent'


class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      DATA: [],
      dataLoaded: false,
      server: '',
      appState: AppState.currentState,
      style: stylesGray,
      colorHeader: '#C4C4C4',
      modalVisible: false,
      selectedMessage: '',
      iconMenu: require('../src/image/5.png'),
      iconSend: require('../src/image/btn.png')
    }
  }

  _getDataFromLocalStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value) {
        if (key === 'server') {
          this.setState({server: value})
        } else if (key === 'nickName') {
          this.setState({nickName: value})
        } else if (key === 'theme') {
          if (value === 'dark') {
            this.setState({
              style: stylesDark,
              colorHeader: '#363636'
            })
          } else if (value === 'gray') {
            this.setState({
              style: stylesGray,
              colorHeader: '#C4C4C4'
            })
          }
        }
        
      }
    } catch(err) {
      alert('Error')
      console.log(err)
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', (nextAppState) => {
      this.setState({appState: nextAppState})
      if (nextAppState === 'active' && this.state.wsClosed) {
        this.setState({ws: new WebSocket(`ws://${this.state.server}`)})
      }
    });

    this._notificationSubscription = Notifications.addListener(this._handleNotification)
    
    Notifications.createChannelAndroidAsync(channelId, channel)
    
    this._getDataFromLocalStorage('server')
    this._getDataFromLocalStorage('nickName')
    this._getDataFromLocalStorage('theme')
  }

  _handleNotification = notification => {
    if (this.state.appState === 'active') {
      Notifications.dismissAllNotificationsAsync()
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const {server, theme, dissconnect } = this.props;
    const { ws, dataLoaded } = this.state

    if (server !== prevProps.server) {
      this.setState({server: server})
    }

    if (theme !== prevProps.theme) {
      if (theme === 'dark') {
        this.setState({
          style: stylesDark,
          colorHeader: '#363636'
        })
      } else if (theme === 'gray') {
        this.setState({
          style: stylesGray,
          colorHeader: '#C4C4C4'
        })
      }
      const updateData = JSON.parse(JSON.stringify(this.state.DATA))
      this.setState({DATA: updateData})
    }

    if (dissconnect !== prevProps.dissconnect && dissconnect) {
      this.setState({
        server: '',
        DATA: [],
        dataLoaded: false
      })
      if (ws) {
        ws.close()
        this.setState({ws: ''})
      }
      this.props.DissconnectServer(false)
    }

    if (ws != prevState.ws && ws) {
      ws.onopen = () => {
        this.setState({dataLoaded: true})
      }
      ws.onmessage = (event) => {
        
        const message = JSON.parse(event.data)

        if (message.type === 'delete') {
          this.setState({
            DATA: message.value
          });
        } else if (message.type === 'edit') {
          this.setState({
            DATA: message.value
          });
        } else {
          this.setState({
            DATA: [...message, ...this.state.DATA]
          });
        }
        
        
        
        // const message = JSON.parse(event.data)[0];
        // if (message.idClient != idClient && this.state.appState != 'active') {
        //   this._pushNotification(message.message, message.nickName);                                   локалные уведомления
        // }
      }
      ws.onclose = (e) => {
        this.setState({wsClosed: true})
      };

    }

 
    if (this.state.server !== prevState.server) {
      this.connectServer(this.state.server)
    }

    if (dataLoaded !== prevState.dataLoaded) {
      this.props.CheckDataLoaded(dataLoaded)
    }

  }

  componentWillUnmount() {
    this.state.ws.close()
  }

  connectServer = async (server) => {
    if (server) {
      try {
        const response = await fetch(`http://${server}/dataMessage.json`);
        
        if (!response.ok) {
          
        } else {      
          
          registerForPushNotificationsAsync(server)
          
          const responseJson = await response.json();
          
          this.setState({
            dataLoaded: true,
            DATA: responseJson,
            ws: new WebSocket(`ws://${server}`)
          })
  
        
        }  
      } catch (error) {
        console.log(error)
        setTimeout(() => {
          Alert.alert('Невозможно подключиться к серверу')
          this.setState({server: ''})
        }, 10000)
      }
    }
  }

  _addMessage = (text) => {
    this.setState({message: text})
  }

  _sendMessage = () => {
    const { message, dataLoaded, selectedMessage, ws } = this.state;
    if (dataLoaded) {
      const time = new Date;
      if(message && !selectedMessage) {
        
        const id = (+time).toString()+'-'+RandomString(9)+'-'+RandomString(9);
        
        const messageLast = [{
          id,
          message,
          time,
          nickName: this.props.nickName ? (this.props.nickName) : (this.state.nickName),
          idClient
        }];
        ws.send(JSON.stringify(messageLast));
        this.setState({
          message: ''
        });
      } else if (message && selectedMessage) {
        const req = { 
          type: 'edit',
          value: [{
            id: selectedMessage.id,
            message,
            time,
            nickName: selectedMessage.nickName,
            idClient: selectedMessage.idClient,
            edited: true
          }]
        }
    
        ws.send(JSON.stringify(req))
        this.setState({
          selectedMessage: '',
          message: ''
        })
      }
    } else {
        Alert.alert('Нет подключения к серверу')
    }
    
  }

  _deleteMessage = () => {
    const { selectedMessage, ws } = this.state
    const req = { 
      type: 'delete',
      value: [selectedMessage]
    }

    ws.send(JSON.stringify(req))
    this.setState({
      modalVisible: false,
      selectedMessage: ''
    })
  }

  _editMessage = () => {
    const { selectedMessage } = this.state
    this.setState({
      modalVisible: false,
      message: selectedMessage.message
    })
  }

  _cancelEdit = () => {
    this.setState({
      selectedMessage: '',
      message: ''
    })
  }

  _pushNotification = (data, nickName) => {
    const notification = {
      title: 'Cообщение от '+nickName,
      body: data,
      android: {
        channelId: 'simplechat',
        icon: './src/image/chat_icon.png'
      }
    }
    
    Notifications.presentLocalNotificationAsync(notification)
  }

  _selectMessage = (message) => {
    this.setState({selectedMessage: message})
    this._setModalVisible(true)
  }

  _setModalVisible = (visible) => {
    this.setState({modalVisible: visible})
    if (!visible) {
      this.setState({selectedMessage: ''})
    }
  }

  render() {
    
    const {
      container,
      keyboardContainer,
      title,
      titleBox,
      header,
      inputStyle,
      btnStyle,
      messageStyle,
      footer
    } = styles;

    const {
      keyboardContainerColor,
      footerColor,
      messageStyleColor,
      inputStyleColor,
      btnStyleColor,
      itemColor,
      itemMyColor
    } = this.state.style
    
    return (
      
      <View style={container}>
        
        <KeyboardAvoidingView 
          style={[keyboardContainer, keyboardContainerColor]} 
          behavior='padding'
        >
           
          <View style={header}>
            <TouchableOpacity 
              style={[btnStyle, btnStyleColor]}
              onPress={() => this.props.navigation.navigate('Options', {color: this.state.colorHeader})}>
                <Image
                  style={{width: 40, height: 40}}
                  source={this.state.iconMenu}
                />
            </TouchableOpacity>
            
            <View style={titleBox}>
              <Text style={title}>Simple Chat</Text>
            </View>
          
          </View>
          <View style={[messageStyle, messageStyleColor]}>
            <MessageList 
              loaded={this.state.dataLoaded}
              server={this.state.server}
              data={this.state.DATA}
              chooseMessage={this._selectMessage}
              itemColor={itemColor}
              itemMyColor={itemMyColor}
            />
          </View>

         
          <EditedMessage
            message={this.state.selectedMessage.message}
            showModal={this.state.modalVisible}
            press={this._cancelEdit}
          />
          
        
          <View style={[footer, footerColor]}>
            
            <TextInput
              ref={component => this._textInput = component}
              style={[inputStyle, inputStyleColor]}
              placeholder='Введите сообщение'
              value={this.state.message}
              onChangeText={this._addMessage}
              onSubmitEditing={this._sendMessage}
            />
            <TouchableOpacity 
              style={[btnStyle, btnStyleColor]}
              onPress={this._sendMessage}>
                <Image
                  style={{width: 45, height: 45}}
                  source={this.state.iconSend}
                />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <ModalComponent
          modalVisible={this.state.modalVisible}
          setModalVisible={this._setModalVisible}
          message={this.state.selectedMessage.message}
          deleteMessage={this._deleteMessage}
          editMessage={this._editMessage}
        />

      </View>
    )
  }
}

const EditedMessage = ({message, showModal, press}) => {
  if (message && !showModal) {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', width: width-20, marginTop: 10}}>
        <View style={{width: width-40}}>
          <Text>{message}</Text>
        </View>
      
        <TouchableOpacity
          onPress={press}
        >
          <Image
            style={{width: 20, height: 20}}
            source={require('../src/image/close.png')}
          />
        </TouchableOpacity>
      
      </View>
    )
  } else {
    return (
      <View></View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-between',
  },
  keyboardContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: height * 0.05,
    paddingBottom: 10,
  },
  titleBox: {
    justifyContent: 'center',
    marginRight: width*0.1,

  },
  title: {
    fontSize: 25,
    fontStyle: 'italic',
    fontWeight: 'bold',
    letterSpacing: 2
  },
  footer: {
    width: width-20,
    height: height*0.1,
    paddingVertical: 10,
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageStyle: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center'
  },
  inputStyle: {
    width: width *0.8,
    height: 40,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 3
  },
  btnStyle: {
    height: 40,
    width: width*0.13,
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

const mapStateToProps = state => {
  return {
    server: state.options.server,
    nickName: state.options.nickName,
    theme: state.options.theme,
    dissconnect: state.options.dissconnect
  }
}

export default connect(mapStateToProps, { DissconnectServer, CheckDataLoaded })(MainScreen)