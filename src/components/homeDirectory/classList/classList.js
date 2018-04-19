import React, { Component } from 'react';
import {Text,View,TouchableOpacity,ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ClassList extends Component{
    static navigationOptions = {
        drawerLabel: () => null
    };

    constructor(props){
        super(props);
        this.state={
            classList:[
                {className:"class 1",assignedTo:"ping",time:"11:12"},
                {className:"class 2",assignedTo:"pong",time:"10:22"},
                {className:"class 3",assignedTo:"ding",time:"14:33"},
            ],
            branchId:props.screenProps.branchId
        };
    }

    render(){
        return (
            <View style={{flex:1}}>
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"rgb(2, 112, 247)"}}>
                    <TouchableOpacity
                        style={{flex:1,height:"100%",width:"100%",justifyContent:"space-around",alignItems:"center"}}
                        onPress={()=>{this.props.navigation.navigate("Home")}}
                    >
                        <Ionicons
                            name="ios-arrow-back"
                            size={30}
                            style={{color: "#ffffff"}}
                        />
                    </TouchableOpacity>
                    <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"#ffffff",fontSize:20}}>Class list</Text>
                    </View>
                    <View style={{flex:1}}></View>
                </View>
                <View style={{flex:10,width:"100%",height:"100%"}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center",marginLeft:10}}>
                        <Text>Branch id:  {this.state.branchId}</Text>
                    </View>
                    <View style={{flex:15,margin:5,backgroundColor:"rgb(122, 181, 249)",borderRadius:5}}>
                        <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                            <Text style={{flex:1,color:"#ffffff",textAlign:"center",fontSize:17}}>Class</Text>
                            <Text style={{flex:2,color:"#ffffff",textAlign:"center",fontSize:17}}>Assigned to</Text>
                            <Text style={{flex:1,color:"#ffffff",textAlign:"center",fontSize:17}}>Time</Text>
                            <Text style={{flex:1,color:"#ffffff"}}></Text>
                        </View>
                        <View style={{flex:12}}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{flex:1,margin:5,backgroundColor:"#ffffff",padding:1}}
                            >
                                {
                                    this.state.classList.map((oneClass) => {
                                        return(
                                            <View style={{width:"100%",height:40,flexDirection:"row",alignItems:"center",justifyContent:"center",borderBottomWidth:1,borderColor:"#ffffff"}}>
                                                <View style={{flex:1,height:"100%",backgroundColor:"rgb(155, 196, 247)",alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={{textAlign:"center",}}>{oneClass.className}</Text>
                                                </View>
                                                <View style={{flex:2,height:"100%",backgroundColor:"rgb(184, 210, 242)",alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={{textAlign:"center",}}>{oneClass.assignedTo}</Text>
                                                </View>
                                                <View style={{flex:1,height:"100%",backgroundColor:"rgb(217, 233, 252)",alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={{textAlign:"center",}}>{oneClass.time}</Text>
                                                </View>
                                                <View style={{flex:1,height:"100%",backgroundColor:"rgb(232, 240, 249)",alignItems:"center",justifyContent:"center"}}>
                                                    <TouchableOpacity
                                                        style={{backgroundColor:"rgb(26, 93, 175)",height:30,width:50,alignItems:"center",justifyContent:"center",borderRadius:2}}
                                                    >
                                                        <Text style={{color:"#ffffff"}}>Details</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}