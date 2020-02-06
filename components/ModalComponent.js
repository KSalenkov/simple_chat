import React, { Component } from 'react';
import { StyleSheet,
          View,
          Text,
          TouchableOpacity,
          Modal,
          ImageBackground } from 'react-native';



export default function ModalComponent(props) {
    
    const { 
        modalVisible, 
        setModalVisible, 
        message,
        deleteMessage,
        editMessage } = props

        let messageVisible

        if (message && message.length > 183) {
            messageVisible = message.substr(0, 181)+'...'
        } else {
            messageVisible = message
        }
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false)
            }}
        >
            <ImageBackground
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={() => {
                    setModalVisible(false)
                }}
                source={require('../src/image/bacground.png')}
            >

                <TouchableOpacity 
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    activeOpacity={1}
                    onPress={() => {
                        setModalVisible(false)
                    }}
                >
        
                    <TouchableOpacity 
                        style={{
                            width: 300,
                            height: 150,
                            backgroundColor: '#a6a6a6',
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 10,
                            borderWidth: 1,
                            borderColor: '#45453e'
                        }}
                        activeOpacity={1}
                    >

                    <View style={{
                        width: 250
                    }}>
                        <Text style={{textAlign: 'justify'}}><Text style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Сообщение:</Text> {messageVisible}</Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#ba7b7b',
                                flexGrow: 1,
                                height: 40,
                                borderColor: '#45453e',
                                borderBottomLeftRadius: 10,
                                borderRightWidth: 0.5,
                                borderTopWidth: 1,
                                justifyContent: 'center'
                            }}
                            onPress={deleteMessage}
                        >
                            <Text style={{textAlign: 'center'}}>Удалить</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#577a57',
                                flexGrow: 1,
                                height: 40,
                                borderColor: '#45453e',
                                borderLeftWidth: 0.5,
                                borderRightWidth: 0.5,
                                borderTopWidth: 1,
                                justifyContent: 'center'
                            }}
                            onPress={() => {
                                editMessage()
                            }}
                        >
                            <Text style={{textAlign: 'center'}}>Изменить</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        style={{
                            backgroundColor: 'gray',
                            flexGrow: 1,
                            height: 40,
                            borderColor: '#45453e',
                            borderBottomRightRadius: 10,
                            borderLeftWidth: 0.5,
                            borderTopWidth: 1,
                            justifyContent: 'center'
                        }}
                        onPress={() => {
                            setModalVisible(false)
                        }}
                        >
                        <Text style={{textAlign: 'center'}}>Отмена</Text>
                        </TouchableOpacity>
                    </View>

                        
                    </TouchableOpacity>

        
                </TouchableOpacity>


            </ImageBackground>
            
        </Modal>
    )
}