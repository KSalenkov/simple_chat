import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, TouchableOpacity, View, Alert} from 'react-native';

export default class TestScreen extends Component {
  state = {
    modalVisible: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
        <View style={{backgroundColor: '#e0dfdf'}}>
            {/* <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
                this.setModalVisible(!this.state.modalVisible)
            }}> */}
                <TouchableOpacity 
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 200
                    }}
                    activeOpacity={1}
                    onPress={() => {
                        this.setModalVisible(!this.state.modalVisible)
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
                            paddingTop: 10
                        }}
                        activeOpacity={1}
                    >

                        <View style={{
                            width: 250
                        }}>
                            <Text style={{textAlign: 'justify'}}>Сообщение: Это текст какого то сообщени яол форфорафдр адфцрадшфц оащш фцратсдгф нтсшгфнсш гфцнсгшфнс</Text>
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
                            >
                                <Text style={{textAlign: 'center'}}>Отмена</Text>
                            </TouchableOpacity>
                        </View>

                        
                    </TouchableOpacity>

            
                </TouchableOpacity>
            {/* </Modal>

            <TouchableHighlight
            onPress={() => {
                this.setModalVisible(true);
            }}>
            <Text>Show Modal</Text>
            </TouchableHighlight> */}
        </View>
    );
  }
}




