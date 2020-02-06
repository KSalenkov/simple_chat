import React, { Component } from 'react';
import { View, 
        Text, 
        TextInput,
        Image,
        TouchableOpacity, 
        StyleSheet, 
        Picker,
        AsyncStorage } from 'react-native';
import { width, height } from '../constants/sizes'
import { connect } from 'react-redux'
import { EnterServer } from '../actions/EnterServer'
import { EnterNickName } from '../actions/EnterNickName'
import { ChooseTheme } from '../actions/ChooseTheme'
import { DissconnectServer } from '../actions/DissconnectServer'
import { stylesGray } from '../src/styles/stylesGray'
import { stylesDark } from '../src/styles/stylesDark'

class Options extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serverInput: '192.168.88.221:3000',
            nickName: '',
            theme: 'gray',
            iconNot: require('../src/image/resNot.png'),
            iconOk: require('../src/image/resOk.png'),
            style: stylesGray
        }
    }

    _setValuesToLocalStorage = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value)
        } catch (error) {
            alert('error')
        }
    }

    _getValuesFromLocalStorage = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key)
            if (key === 'nickName') {
                this.props.EnterNickName(value)
            } else if (key === 'server') {
                if (value) {
                    this.setState({serverInput: value})
                } else {
                    this.setState({serverInput: ''})
                }
            } 
            else if (key === 'theme') {
                if (value === 'dark') {
                    this.setState({
                        style: stylesDark,
                        theme: value
                    })
                } else if (value === 'gray') {
                    this.setState({
                        style: stylesGray,
                        theme: value
                    })
                }
            }
        } catch(err) {
            alert('Error')
        }
    }

    _removeItemFromLocalStorage = async (key) => {
        try {
           await AsyncStorage.removeItem(key) 
        } catch(err) {
            alert('Error')
        }
    }

    componentDidMount() {
        this._getValuesFromLocalStorage('nickName')
        this._getValuesFromLocalStorage('server')
        this._getValuesFromLocalStorage('theme')
    }
    
    componentDidUpdate(prevProps) {
        const { dataLoaded, theme } = this.props;
        
        if (dataLoaded !== prevProps.dataLoaded) {
            this.setState({dataLoaded})
        }

        if (theme !== prevProps.theme) {
            if (theme === 'dark') {
                this.setState({style: stylesDark})
            } else if (theme === 'gray') {
                this.setState({style: stylesGray})
            }
        }
    }

    _inputServer = (text) => {
        this.setState({serverInput: text})
    }

    _connectServer = () => {
        this.props.EnterServer(this.state.serverInput)
        this._setValuesToLocalStorage('server', this.state.serverInput)
    }

    _inputNickName = (text) => {
        this.setState({nickName: text})
    }

    _saveNickName = () => {
        this.props.EnterNickName(this.state.nickName)
        this._setValuesToLocalStorage('nickName', this.state.nickName)
        this.setState({nickName: ''})
    }

    _pickerValueChange = (value) => {
        this.setState({theme: value})
        this.props.ChooseTheme(value)
        this._setValuesToLocalStorage('theme', value)
        if (value === 'dark') {
            this.props.navigation.navigate('Options', {color: '#363636'})
        } else {
            this.props.navigation.navigate('Options', {color: '#C4C4C4'})
        }
        
    }

    _dissconnectServer = () => {
        this.props.DissconnectServer(true)
        this.props.EnterServer('')
        this._removeItemFromLocalStorage('server')
        this.setState({serverInput: ''})
    }
    

    render() {

        const {
            containerOptions,
            inputAndBtnOptions,
            inputOptions,
            btnOptions,
            pickerOptions
        } = this.state.style
        
        return (
            <View style={[styles.container, containerOptions]}>
                <View style={styles.block}>
                    <View style={styles.blockTitle}>
                        <Text style={styles.title}>Подключение к серверу:</Text>
                        <Icon
                            dataLoaded={this.props.dataLoaded}
                            urlNot={this.state.iconNot}
                            urlOk={this.state.iconOk}
                        />
                    </View>
                    

                    <View style={[styles.inputAndBtn, inputAndBtnOptions]}>
                        <TextInput 
                            style={[styles.input, inputOptions]}
                            placeholder='Введите адрес сервера'
                            value={this.state.serverInput}
                            onChangeText={this._inputServer}
                        />
                        <BtnServer
                            dataLoaded={this.props.dataLoaded}
                            pressConnect={this._connectServer}
                            pressDisc={this._dissconnectServer}
                            style={[styles.btn, btnOptions]}
                            styleDisc={[styles.btnDisc, btnOptions]}
                        />
                    </View>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Никнейм: {this.props.nickName}</Text>
                    <View style={[styles.inputAndBtn, inputAndBtnOptions]}>
                        <TextInput 
                            style={[styles.input, inputOptions]}
                            value={this.state.nickName}
                            onChangeText={this._inputNickName}
                        />
                        <TouchableOpacity 
                            style={[styles.btn, btnOptions]}
                            onPress={this._saveNickName}
                        >
                                <Text>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Тема:</Text>
                    <View style={[styles.inputAndBtn, inputAndBtnOptions]}>
                        <Picker
                            style={[styles.picker, pickerOptions]}
                            selectedValue={this.state.theme}
                            onValueChange={this._pickerValueChange}
                        >
                            <Picker.Item label="Gray theme" value="gray" />
                            <Picker.Item label="Dark theme" value="dark" />
                        
                        </Picker>
                        
                    </View>
                </View>

                {/* Тестовая кнопка */}

                <View style={[styles.block, 
                    { display: 'none' }
                    ]}>
                    <TouchableOpacity style={{ width: width*0.9, height: 50, backgroundColor: '#89888a' }}
                        onPress={() => { this.props.navigation.navigate('Test') }}
                    >

                    </TouchableOpacity>
                </View>
                 
            </View>
        )
    }
    
}

const Icon = ({ dataLoaded, urlNot, urlOk }) => {
    if (!dataLoaded) {
        return (
            <Image
                style={{width: 22, height: 22}}
                source={urlNot}
            />
        )
    } else {
        return (
            <Image
                style={{width: 22, height: 22}}
                source={urlOk}
            />
        )
    }
}

const BtnServer = ({ dataLoaded, pressConnect, pressDisc, style, styleDisc }) => {
    if (!dataLoaded) {
        return (
            <TouchableOpacity 
                style={style}
                onPress={pressConnect}
            >
                    <Text>OK</Text>
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity 
                style={styleDisc}
                onPress={pressDisc}
            >
                    <Text>x</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: height*0.05,
    },
    block: {
        width: width*0.95
    },
    blockTitle: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 20,
        marginHorizontal: 10,
    },
    inputAndBtn: {
        width: width,
        height: height*0.1,
        padding: 10,
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    input: {
        width: width*0.8,
        height: 40,
        borderWidth: 1,
        borderRadius: 2,
        paddingHorizontal: 3
    },
    btn: {
        height: 40,
        width: width*0.13,
        backgroundColor: '#1a8510',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 2,
    },
    btnDisc: {
        height: 40,
        width: width*0.13,
        backgroundColor: '#e81a1a',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 2,
    },
    picker: {
        height: 40,
        width: width-20,
        borderWidth: 1,
        borderRadius: 2,
        paddingHorizontal: 3
    }
})

const mapStateToProps = state => {
    return {
      nickName: state.options.nickName,
      theme: state.options.theme,
      dataLoaded: state.options.dataLoaded
    }
  }

export default connect(mapStateToProps, { EnterServer, EnterNickName, ChooseTheme, DissconnectServer })(Options)