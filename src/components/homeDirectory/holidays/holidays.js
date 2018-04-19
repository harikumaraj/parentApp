import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Animated, ScrollView, AsyncStorage,Alert,ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fetch from 'react-native-cancelable-fetch';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Holidays extends Component {

    constructor() {
        super();
        this.state = {
            addHolidayHeightAnimate: new Animated.Value(0),
            formalHolidaysHeightAnimate: new Animated.Value(0),
            unFormalHolidaysHeightAnimate: new Animated.Value(0),
            formalHolidayContainer:new Animated.Value(0),
            unFormalHolidayContainer:new Animated.Value(0),
            addHolidayExpanded: false,
            formalHolidayExpanded: false,
            unFormalHolidayExpanded: false,
            formalHolidayList: [],
            unFormalHolidayList: [],
            year: parseInt(new Date().toLocaleString().substr(6, 4)),
            isDateTimePickerVisible: false,
            textBoxBorderWidth: 0,
            spinnerVisible:false,
            getHolidayListController:null,
            fetchFlag:true,
        }
    }

    componentDidMount(){
        AsyncStorage.getItem("formalHolidayList", (err, formalHolidayList) => {
            if (formalHolidayList !== null) {
                let tempHolidayList = JSON.parse(formalHolidayList);
                this.setState({formalHolidayList: tempHolidayList});
            }
        });
            AsyncStorage.getItem("unFormalHolidayList", (err, unFormalHolidayList) => {
                if (unFormalHolidayList !== null) {
                    let tempHolidayList = JSON.parse(unFormalHolidayList);
                    this.setState({unFormalHolidayList:tempHolidayList});
                }
        });
        this.getHolidayList();
    }

    getHolidayList() {
        this.setState({spinnerVisible: true, fetchFlag: true});
        fetch("http://192.168.1.19:8081/Daycare/centerdirector/showingHolidays",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"year":2018})
        },1)
            .then((response)=>response.json())
            .then((response)=>{
                console.log(response);
                this.setState({spinnerVisible:false,fetchFlag:false});
                if(response.statusCode===200){
                    this.setState({formalHolidayList:response.data[0].formalHolidays,unFormalHolidayList:(response.data[0].unformalHolidays===null)?[]:response.data[0].unformalHolidays});
                    AsyncStorage.setItem("formalHolidayList",JSON.stringify(response.data[0].formalHolidays));
                    AsyncStorage.setItem("unFormalHolidayList",JSON.stringify((response.data[0].unformalHolidays===null)?[]:response.data[0].unformalHolidays));
                }
                else{
                    setTimeout(()=>{Alert.alert("Error","Could not get the data, try again!")},50);
                }
            })
            .catch(()=>{
                this.setState({spinnerVisible:false,fetchFlag:false});
                setTimeout(()=>{Alert.alert("Error","Could not connect to internet! Loading older data!")},50)
            });
        setTimeout(() => {
            fetch.abort(1);
            this.setState({spinnerVisible: false});
            if (this.state.fetchFlag)
                setTimeout(() => {
                    Alert.alert("Error", "Network error! Loaded older data.")
                });
            this.setState({fetchFlag: false});
        }, 10000);
    }

    formalHolidayToggle() {
        if (this.state.formalHolidayExpanded) {
            this.setState({formalHolidayExpanded: false});
            Animated.timing(
                this.state.formalHolidaysHeightAnimate,
                {
                    duration: 200,
                    toValue: 0
                }
            ).start();
        }
        else {
            this.setState({formalHolidayExpanded: true});
            Animated.spring(
                this.state.formalHolidaysHeightAnimate,
                {
                    duration: 200,
                    toValue: 40+this.state.formalHolidayList.length*30
                }
            ).start();
        }
    }

    unFormalHolidayToggle() {
        if (this.state.unFormalHolidayExpanded) {
            this.setState({unFormalHolidayExpanded: false});
            Animated.timing(
                this.state.unFormalHolidaysHeightAnimate,
                {
                    duration: 200,
                    toValue: 0
                }
            ).start();
        }
        else {
            this.setState({unFormalHolidayExpanded: true});
            Animated.spring(
                this.state.unFormalHolidaysHeightAnimate,
                {
                    duration: 200,
                    toValue: 40+this.state.unFormalHolidayList.length*30
                }
            ).start();
        }
    }

    holidayContainerToggle(toggle,holidayContainer){
        if (toggle===false){
            Animated.timing(
                holidayContainer,
                {
                    duration: 200,
                    toValue: 0
                }
            ).start();
        }
        else {
            Animated.spring(
                holidayContainer,
                {
                    duration: 200,
                    toValue: 30
                }
            ).start();
        }
    }

    arrowDirection(expanded) {
        if (expanded) {
            return (
                <Ionicons
                    name="ios-arrow-dropup"
                    size={20}
                    style={{color: "#fff"}}
                />

            )
        }
        else {
            return (
                <Ionicons
                    name="ios-arrow-dropdown"
                    size={20}
                    style={{color: "#fff"}}
                />
            )
        }
    }

    holidayView(holidayList,expanded,holidayContainer){
        if(expanded===true){
            return(
                <View style={{flex:1}}>
                    <View style={{height:40,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"rgba(255, 255, 255,0.8)"}}>
                        <View style={{flex:2,height:"80%",borderRightWidth:0.5,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{color:"rgb(249, 77, 64)"}}>Occasion</Text>
                        </View>
                        <View style={{flex:1,height:"80%",borderRightWidth:0.5,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{color:"rgb(255, 151, 7)"}}>Day</Text>
                        </View>
                        <View style={{flex:1,height:"80%",borderRightWidth:0.5,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{color:"rgb(13, 145, 1)"}}>Month</Text>
                        </View>
                        <View style={{flex:1,height:"80%",borderRightWidth:0.5,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{color:"rgb(1, 101, 168)"}}>Date</Text>
                        </View>
                    </View>
                    <View style={{flex:10}}>
                        {holidayList.map((holidayData,index)=>{
                            let backgroundColorVar="";
                            let textColorVar="";
                            if(index%2===0){
                                backgroundColorVar="rgba(121, 197, 252,0.5)";
                                textColorVar="#ffffff";
                            }else{
                                backgroundColorVar="rgba(255, 255, 255,0.8)";
                                textColorVar="rgb(25, 163, 255)"
                            }
                            return(
                                <Animated.View key={index} style={{height:holidayContainer,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:backgroundColorVar}}>
                                    <View style={{flex:2,height:"100%",justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{color:textColorVar,fontSize:12}}>{holidayData.festivalsOrOccasions}</Text>
                                    </View>
                                    <View style={{flex:1,height:"100%",justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{color:textColorVar,fontSize:12}}>{holidayData.day}</Text>
                                    </View>
                                    <View style={{flex:1,height:"100%",justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{color:textColorVar,fontSize:12}}>{holidayData.month}</Text>
                                    </View>
                                    <View style={{flex:1,height:"100%",justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{color:textColorVar,fontSize:12}}>{holidayData.holidayDate}</Text>
                                    </View>
                                </Animated.View>
                            )
                        })}
                    </View>
                </View>
            );
        }else{
            return null;
        }
    }

    render() {
        return (
            <ImageBackground
                style={{flex:1,width:"100%",height:"100%"}}
                source={require("../../../assets/colorPencils.jpg")}
                blurRadius={10}
            >
                <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            height: "100%",
                            width: "100%",
                            justifyContent: "space-around",
                            alignItems: "center"
                        }}
                        onPress={() => {
                            this.props.navigation.navigate("Home")
                        }}
                    >
                        <Ionicons
                            name="ios-arrow-back"
                            size={30}
                            style={{color: "#ffffff"}}
                        />
                    </TouchableOpacity>
                    <View style={{flex: 5, alignItems: "center", justifyContent: "center"}}>
                        <Text style={{color: "#ffffff", fontSize: 20}}>Holidays</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                        flex: 1,
                        height: "100%",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                        onPress={()=>{this.getHolidayList()}}
                    >
                        <MaterialIcons
                            name="refresh"
                            size={30}
                            style={{color: "#ffffff"}}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 10,justifyContent:"center"}}>
                    <View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TouchableOpacity
                                style={{height: 40, width: "100%", alignItems: "center", justifyContent: "center"}}
                                onPress={() => {
                                    this.formalHolidayToggle();
                                    setTimeout(()=>{this.holidayContainerToggle(this.state.formalHolidayExpanded,this.state.formalHolidayContainer);},50)
                                }}
                            >
                                <Text style={{color: "#fff", fontSize: 17}}>Formal holidays list  {this.arrowDirection(this.state.formalHolidayExpanded)}</Text>
                            </TouchableOpacity>
                            <Animated.View style={{
                                height:this.state.formalHolidaysHeightAnimate,
                                backgroundColor:"rgba(100,100,100,0.4)",
                                width: "100%",
                                borderBottomWidth: 0.5,
                                borderBottomColor: "#fff"
                            }}
                            >
                                {this.holidayView(this.state.formalHolidayList,this.state.formalHolidayExpanded,this.state.formalHolidayContainer)}
                            </Animated.View>
                            <TouchableOpacity
                                style={{height: 40, width: "100%", alignItems: "center", justifyContent: "center"}}
                                onPress={() => {
                                    this.unFormalHolidayToggle();
                                    setTimeout(()=>{this.holidayContainerToggle(this.state.unFormalHolidayExpanded,this.state.unFormalHolidayContainer);},50)
                                }}
                            >
                                <Text style={{color: "#fff", fontSize: 17}}>non-formal holidays list  {this.arrowDirection(this.state.unFormalHolidayExpanded)}</Text>
                            </TouchableOpacity>
                            <Animated.View style={{
                                height:this.state.unFormalHolidaysHeightAnimate,
                                backgroundColor:"rgba(100,100,100,0.4)",
                                width: "100%",
                                borderBottomWidth: 0.5,
                                borderBottomColor: "#fff"
                            }}
                            >
                                {this.holidayView(this.state.unFormalHolidayList,this.state.unFormalHolidayExpanded,this.state.unFormalHolidayContainer)}
                            </Animated.View>
                        </ScrollView>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}