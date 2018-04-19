import React, { Component } from 'react';
import {Text,View,TouchableOpacity,TouchableHighlight,Animated,PanResponder,Dimensions,TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';
import { transformOrigin, rotateXY, rotateXZ } from './utils';

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rotateView: {
        width: 300,
        height: 300,
        backgroundColor: "rgba(255,255,255,0)",
        shadowOffset: {height: 1, width: 1},
        shadowOpacity: 0.2,
    }
};

let height=new Animated.Value(30);

export default class Medicines extends Component {

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: this.handlePanResponderMove.bind(this)
        });
    }

    handlePanResponderMove(e, gestureState) {
        const {dx, dy} = gestureState;
        const y = `${dx}deg`;
        const x = `${-dy}deg`;

        this.refView.setNativeProps({style: {transform: [{perspective: 1000}, {rotateX: x}]}});
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"rgb(244, 191, 66)"}}>
                    <View style={{flex:1,justifyContent:"space-around",alignItems:"center"}}>
                        <TouchableOpacity
                            onPress={()=>{this.props.navigation.navigate("Home")}}
                        >
                            <Ionicons
                                name="ios-arrow-back"
                                size={30}
                                style={{color: "#ffffff"}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"#ffffff",fontSize:20}}>Medicines</Text>
                    </View>
                    <View style={{flex:1}}></View>
                </View>
                <View style={{flex:10,width:"100%",height:"100%"}}>
                    <View
                        style={styles.container}
                        {...this.panResponder.panHandlers}
                    >
                        <Text>Hello</Text>
                        <View
                            ref={component => this.refView = component}
                            style={styles.rotateView}
                        >
                            <View style={{flex:1,backgroundColor:"blue"}}/>
                            {/*<View style={{flex:1,backgroundColor:"rgba(255,255,255,0)"}}/>*/}
                        </View>
                        <Text>Hello</Text>
                    </View>
                </View>
            </View>
        );
    }
}