import React from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';

export default class RequestScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            medicineName: '',
            userId: firebase.auth().currentUser.email,
            numberOfMedicines: '',
            quantity: '',
            allMedicines: [],
            textInputs: [],
        };
        this.itemsRef = null;
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7);
    }

    addRequest = async (medicineName, numberOfMedicines) => {
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();
        console.log("state 34: ", medicineName, numberOfMedicines)
        db.collection('requestMedicines').add({
            userId: userId,
            medicineName: medicineName,
            numberOfMedicines: numberOfMedicines,
            requestId: randomRequestId,
        });
        this.setState({
            bookName: '',
            reasonToRequest: '',
        });
        return alert('Medicine Requested Successfully');
    };

    getAllMedicines = () => {
        this.itemsRef = db.collection('medicines').onSnapshot((snapshot) => {
            var allMedicines = snapshot.docs.map((document) => document.data());
            //console.log('Line 120 : ', allMedicines);
            this.setState({
                allMedicines: allMedicines,
            });
            //console.log('Line 123 : ', this.state.allMedicines);
        });
    };

    keyExtractor = (item, index) => index.toString();

    renderItem = (obj) => {
        const { item, index } = obj;
        return (
            <ListItem
                key={index}
                title={'Medicine Name: ' + item.medicineName}
                titleStyle={{ color: 'black', fontWeight: 'bold', fontSize: 15 }}
                rightElement={
                    <View style={{ flexDirection: 'row', marginLeft: 110 }}>
                        <TextInput
                            style={styles.requestInputBox}
                            label={'Number Of Medicines'}
                            placeholder={'No'}
                            containerStyle={{ marginTop: 60 }}
                            onChangeText={(text) => {
                                let { textInputs } = this.state;
                                textInputs[index] = text;
                                this.setState({
                                    textInputs,
                                });
                            }}
                            value={this.state.textInputs[index]}
                        />
                        <TouchableOpacity
                            style={styles.button1}
                            onPress={() => {
                                let { textInputs } = this.state;
                                //console.log('Request Button');
                                this.addRequest(item.medicineName, this.state.textInputs[index]);
                            }}>
                            <Text style={{ color: 'black' }}>Request</Text>
                        </TouchableOpacity>
                    </View>
                }
                bottomDivider
            />
        );
    };

    componentDidMount() {
        this.getAllMedicines();
    }

    render() {
        return (
            <View>
                <MyHeader
                    title="Request Medicines"
                    navigation={this.props.navigation}
                />
                <View>
                    <TextInput
                        style={styles.textInputBox}
                        label={'Request Medicines'}
                        placeholder={'Enter the medicine name'}
                        containerStyle={{ marginTop: 60 }}
                        onChangeText={(text) => {
                            this.setState({
                                medicineName: text,
                            });
                        }}
                        value={this.state.medicineName}
                    />

                    <TextInput
                        style={styles.textInputBox}
                        label={'Number Of Medicines'}
                        placeholder={'Enter the number of medicines required'}
                        containerStyle={{ marginTop: 60 }}
                        onChangeText={(text) => {
                            this.setState({
                                numberOfMedicines: text,
                            });
                        }}
                        value={this.state.numberOfMedicines}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            this.addRequest(
                                this.state.medicineName,
                                this.state.numberOfMedicines
                            );
                        }}>
                        <Text>Request</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.allMedicines}
                        renderItem={this.renderItem}
                    />
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    textInputBox: {
        width: '75%',
        height: 35,
        alignSelf: 'center',
        borderColor: '#ffab91',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        padding: 10,
    },
    button: {
        width: '25%',
        height: 50,
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#CE8A8A',
        shadowColor: '#DDDCDC',
        shadowOffset: {
            width: 0,
            height: 8,
        },
    },
    button1: {
        width: 100,
        height: 25,
        marginTop: 5,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 15,
        backgroundColor: '#CE8A8A',
        shadowColor: '#DDDCDC',
        shadowOffset: {
            width: 0,
            height: 8,
        },
    },
    requestInputBox: {
        width: '17%',
        height: 20,
        alignSelf: 'center',
        borderColor: '#ffab91',
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
    },
});
