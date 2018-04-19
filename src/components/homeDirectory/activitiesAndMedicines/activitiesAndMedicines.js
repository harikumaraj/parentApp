import React, { Component } from 'react';
import {Text,View,TouchableOpacity,ScrollView,Animated,TextInput,Alert,AsyncStorage,Image,StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Spinner from 'react-native-loading-spinner-overlay';
import fetch from "react-native-cancelable-fetch";

export default class ActivitiesAndMedicines extends Component {

    constructor(props) {
        super(props);
        this.state={
            students:(props.screenProps.parentDetail.students===null)?[]:props.screenProps.parentDetail.students,
            kidsPhoto:[require("../../../assets/kid.png"),require("../../../assets/kid.png"),require("../../../assets/kid.png"),require("../../../assets/kid.png")],
            expandToggleArray:[{expanded:false},{expanded:false},{expanded:false},{expanded:false}],
            updateMedicineToggleArray:[{expanded:false},{expanded:false},{expanded:false},{expanded:false}],
            toggleHeightArray:[{height:new Animated.Value(0)},{height:new Animated.Value(0)},{height:new Animated.Value(0)},{height:new Animated.Value(0)}],
            buttonHeightArray:[{height:new Animated.Value(0)},{height:new Animated.Value(0)},{height:new Animated.Value(0)},{height:new Animated.Value(0)}],
            updateMedicineHeightArray:[{height:new Animated.Value(0)},{height:new Animated.Value(0)},{height:new Animated.Value(0)},{height:new Animated.Value(0)}],
            medicineUpdate:"",
            foodUpdate:"",
            additionalDetailsUpdate:"",
            fetchFlag:false,
            spinnerVisible:false,
            updateMedicineAndFoodFlag:false
        };

    }

    updateMedicinesAndFood(studentId){
        if(this.state.foodUpdate===""&&this.state.medicineUpdate===""){
            Alert.alert("Input Error!", "Enter at least one of the food or medicine");
        }
        else {
            this.setState({spinnerVisible: true, fetchFlag: true});
            fetch("http://192.168.1.21:8081/Daycare/parents/updateKidsDailyUpdates", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "mobileNumber": "8985341712",
                    "student": [
                        {
                            "studentId": studentId,
                            "medicine": this.state.medicineUpdate,
                            "food": this.state.foodUpdate,
                            "additionalDetails": this.state.additionalDetailsUpdate
                        }
                    ]
                })
            }, 1)
                .then((response) => response.json())
                .then((response) => {
                    this.setState({
                        spinnerVisible: false,
                        fetchFlag: false,
                        medicineUpdate: "",
                        foodUpdate: "",
                        additionalDetailsUpdate: ""
                    });
                    if (response.statusCode === 200) {
                        this.props.screenProps.revokeGetProfileData();
                        Alert.alert("Success!", "Medicine and food update for the kid!");
                    }
                })
                .catch(() => {
                    this.setState({
                        spinnerVisible: false,
                        fetchFlag: false,
                        medicineUpdate: "",
                        foodUpdate: "",
                        additionalDetailsUpdate: ""
                    });
                    setTimeout(() => {
                        Alert.alert("Internet problem!", "Could not load your details. Please connect to internet")
                    });
                });
            setTimeout(() => {
                fetch.abort(1);
                this.setState({spinnerVisible: false, medicineUpdate: "", foodUpdate: "", additionalDetailsUpdate: ""});
                if (this.state.fetchFlag)
                    setTimeout(() => {
                        Alert.alert("Internet problem", "Could not load your details. Please connect to internet")
                    });
                this.setState({fetchFlag: false});
            }, 1000);
        }
    }

    componentDidMount(){
        AsyncStorage.getItem("kidsPhoto",(err,kidsPhoto)=>{
            if(kidsPhoto!==null)
                this.setState({kidsPhoto:JSON.parse(kidsPhoto)});
        }); //To get locally stored kid photos
    }

    expandToggleFunc(index){
        if(this.state.expandToggleArray[index].expanded) {
            let expandToggle = this.state.expandToggleArray;
            expandToggle[index].expanded = false;
            let tempUpdateMedicineExpandToggle = this.state.updateMedicineToggleArray;
            tempUpdateMedicineExpandToggle[index].expanded = false;
            this.setState({
                expandToggleArray: expandToggle,
                updateMedicineToggleArray:tempUpdateMedicineExpandToggle,
            });
            Animated.timing(
                this.state.toggleHeightArray[index].height,
                {
                    toValue: 0,
                    duration: 200
                }
            ).start();
            Animated.timing(
                this.state.buttonHeightArray[index].height,
                {
                    toValue: 0,
                    duration: 50
                }
            ).start();
            Animated.timing(
                this.state.updateMedicineHeightArray[index].height,
                {
                    toValue: 0,
                    duration: 200
                }
            ).start();
        }
        else{
            setTimeout(()=> {
                let expandToggle = this.state.expandToggleArray;
                expandToggle[index].expanded = true;
                this.setState({expandToggleArray:expandToggle});
            },150);
            Animated.spring(
                this.state.toggleHeightArray[index].height,
                {
                    toValue: 150,
                    duration: 200
                }
            ).start();
            Animated.spring(
                this.state.buttonHeightArray[index].height,
                {
                    toValue: 50,
                    duration: 200
                }
            ).start();
        }
    }

    updateMedicineToggleFunc(student,index){
        if(this.state.updateMedicineToggleArray[index].expanded) {
            this.updateMedicinesAndFood(student.studentId);
            let expandToggle = this.state.updateMedicineToggleArray;
            expandToggle[index].expanded = false;
            this.setState({updateMedicineToggleArray: expandToggle});
            Animated.timing(
                this.state.updateMedicineHeightArray[index].height,
                {
                    toValue: 0,
                    duration: 200
                }
            ).start();
        }
        else{
            setTimeout(()=> {
                let expandToggle = this.state.updateMedicineToggleArray;
                expandToggle[index].expanded = true;
                this.setState({updateMedicineToggleArray:expandToggle});
            },150);
            Animated.spring(
                this.state.updateMedicineHeightArray[index].height,
                {
                    toValue: 150,
                    duration: 200
                }
            ).start();
        }
    }

    renderExtraKidInfo(student,index){
        if(this.state.expandToggleArray[index].expanded===true) {
            return (
                <View style={{height: "100%",width:"100%", justifyContent: "center"}}>
                    <View style={{width:"100%"}}>
                        <Text style={styles.kidInfoText}>Food specified: {(student.food === "default") ? "none" : student.food}</Text>
                        <Text style={styles.kidInfoText}>Last fed time: {(student.lastFetTime === "default") ? "none" : student.lastFetTime}</Text>
                        <Text style={styles.kidInfoText}>Medicines specified: {(student.medicine === null) ? "none" : student.medicine}</Text>
                        <Text style={styles.kidInfoText}>Last medicine given time: {(student.medicineGivenTime === "default") ? "none" : student.medicineGivenTime}</Text>
                        <Text style={styles.kidInfoText}>Total nap time: {(student.napTime === "default") ? "none" : student.napTime}</Text>
                        <Text style={styles.kidInfoText}>Last diaper changed time: {(student.diapersChangedTime === "default") ? "none" : student.diapersChangedTime}</Text>
                        <Text style={styles.kidInfoText}>Child activity: {(student.childActivity === "default") ? "none" : student.childActivity}</Text>
                    </View>
                </View>
            )
        }
        else{
            return null;
        }
    }

    renderCardText(student,index) {
        if (this.state.expandToggleArray[index].expanded === true) {
            return(
                <View style={{marginLeft:"5%",width:"100%"}}>
                    <View>
                        <Text style={{fontSize:15, fontWeight:"500", color:"rgb(57, 203, 239)"}}>{student.studentName}</Text>
                    </View>
                    <View style={{width:"100%"}}>
                        <Text style={styles.cardText}>Age: {student.studentAge}</Text>
                        <Text style={styles.cardText}>Gender: {student.studentGender}</Text>
                        <Text style={styles.cardText}>Student Id: {student.studentId}</Text>
                        <Text style={styles.cardText}>Class Id: {student.classId}</Text>
                    </View>
                </View>
            )
        }
        else{
            return(
                <View style={{marginLeft:"5%"}}>
                    <View>
                        <Text style={{fontSize:15, fontWeight:"500", color:"rgb(57, 203, 239)"}}>{student.studentName}</Text>
                    </View>
                    <View style={{marginTop:"5%"}}>
                        <Text style={styles.cardText}>Last fed at {(student.lastFetTime === "default") ? "none" : student.lastFetTime}.</Text>
                        <Text style={styles.cardText}>Last medicine given at {(student.medicineGivenTime === "default") ? "none" : student.medicineGivenTime}.</Text>
                        <Text style={styles.cardText}>Total nap time is {(student.napTime === "default") ? "none" : student.napTime}.</Text>
                        <Text style={styles.cardText}>Last diaper changed at {(student.diapersChangedTime === "default") ? "none" : student.diapersChangedTime}.</Text>
                    </View>
                </View>
            )
        }
    }

    renderUpdateMedicinePart(student,index){
        if (this.state.updateMedicineToggleArray[index].expanded === true) {
            return(
                <View style={{paddingLeft:10,paddingRight:10}}>
                    <View style={{padding:5,borderWidth:0.5,marginTop:10,borderRadius:5}}>
                        <TextInput
                            placeholderTextColor="rgb(57, 203, 239)"
                            placeholder="Enter medicines"
                            autoCorrect={false}
                            onChangeText={(medicines)=>{this.state.medicineUpdate=medicines}}
                        />
                    </View>
                    <View style={{padding:5,borderWidth:0.5,marginTop:10,borderRadius:5}}>
                        <TextInput
                            placeholderTextColor="rgb(57, 203, 239)"
                            placeholder="Enter food"
                            autoCorrect={false}
                            onChangeText={(food)=>{this.state.foodUpdate=food}}
                        />
                    </View>
                    <View style={{padding:5,borderWidth:0.5,marginTop:10,borderRadius:5}}>
                        <TextInput
                            placeholderTextColor="rgb(57, 203, 239)"
                            placeholder="Additional comments"
                            autoCorrect={false}
                            onChangeText={(additionalData)=>{this.state.additionalDetailsUpdate=additionalData}}
                        />
                    </View>
                </View>
            )
        }
        else{
            return null;
        }
    }


    returnButtonText(index){
        if (this.state.expandToggleArray[index].expanded === true) {
            if(this.state.updateMedicineToggleArray[index].expanded === true){
                return(
                    <Text style={{fontSize: 17, color: "#ffffff"}}>Update medicines and food</Text>
                )
            }
            else {
                return (
                    <Text style={{fontSize: 17, color: "#ffffff"}}>Add medicine and food</Text>
                )
            }
        }
        else{
            return null
        }
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"rgb(244, 191, 66)"}}>
                    <View style={{flex:1,justifyContent:"space-around",alignItems:"center"}}>
                        <TouchableOpacity
                            style={{flex:1,height:"100%",width:"100%",justifyContent:"space-around",alignItems:"center"}}
                            onPress={()=>{this.props.navigation.navigate("DrawerOpen")}}
                        >
                            <Feather
                                name="menu"
                                size={30}
                                style={{color: "#ffffff"}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"#ffffff",fontSize:20}}>Activities and medicines</Text>
                    </View>
                    <View style={{flex:1}}></View>
                </View>
                <View style={{flex:10,backgroundColor:"rgb(244, 191, 66)",paddingLeft:20,paddingRight:20}}>
                    <ScrollView style={{width:"100%"}}>
                        {
                            this.state.students.map((student,index)=>{
                                return(
                                    <View
                                        style={{
                                            width:"100%",
                                            shadowColor: "#000000",
                                            borderLeftWidth:5,
                                            borderLeftColor:"rgb(57, 203, 239)",
                                            shadowOpacity: 0.3,
                                            shadowRadius: 3,
                                            shadowOffset: {
                                                height: 3,
                                                width: 3
                                            },
                                        }}
                                        key={index}
                                    >
                                        <TouchableOpacity style={{
                                            height:120,
                                            width:"100%",
                                            flexDirection:"row",
                                            alignItems:"center",
                                            backgroundColor:"#fff",
                                            borderBottomWidth:1,
                                            borderBottomColor:"rgba(0,0,0,0.2)"
                                        }}
                                                          onPress={()=>{this.expandToggleFunc(index)}}
                                        >
                                            <Image
                                                style={{height:"100%",width:100}}
                                                source={this.state.kidsPhoto[index]}
                                            />
                                            {this.renderCardText(student,index)}
                                        </TouchableOpacity>
                                        <Animated.View style={{
                                            height:this.state.toggleHeightArray[index].height,
                                            width:"100%",
                                            backgroundColor:"white",
                                            borderBottomWidth:1,
                                            borderBottomColor:"rgba(0,0,0,0.2)"
                                        }}>
                                            {this.renderExtraKidInfo(student,index)}
                                        </Animated.View>
                                        <Animated.View style={{
                                            height:this.state.updateMedicineHeightArray[index].height,
                                            width:"100%",
                                            justifyContent:"center",
                                            backgroundColor:"white",
                                        }}>
                                            {this.renderUpdateMedicinePart(student,index)}
                                        </Animated.View>
                                        <Animated.View style={{height:this.state.buttonHeightArray[index].height,width:"100%"}}>
                                            <TouchableOpacity
                                                style={{height:"100%",width:"100%",alignItems:"center",justifyContent:"center",backgroundColor:"rgb(57, 203, 239)"}}
                                                onPress={()=>{this.updateMedicineToggleFunc(student,index)}}
                                            >
                                                {this.returnButtonText(index)}
                                            </TouchableOpacity>
                                        </Animated.View>

                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles=StyleSheet.create({
    cardText:{
        width:"100%",
        fontWeight:"300",
        color:"rgba(0,0,0,0.5)"
    },
    kidInfoText:{
        width:"100%",
        fontWeight:"300",
        color:"rgba(0,0,0,0.5)",
    }
});