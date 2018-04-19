import React, { Component } from 'react';
import {Text,View,TouchableOpacity,TextInput,ScrollView,AsyncStorage,Alert,Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Spinner from 'react-native-loading-spinner-overlay';
import PhotoUpload from 'react-native-photo-upload';
import DateTimePicker from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-material-dropdown';
import fetch from "react-native-cancelable-fetch";

export default class Profile extends Component{

    static navigationOptions = {
        drawerLabel: () => null
    };

    constructor(props){
        super(props);
        this.state={
            parentName:props.screenProps.parentDetail.parentName,
            mobileNo:props.screenProps.mobileNo,
            emailId:props.screenProps.parentDetail.emailId,
            DOA:props.screenProps.parentDetail.DOA,
            building:props.screenProps.parentDetail.building,
            road:props.screenProps.parentDetail.road,
            area:props.screenProps.parentDetail.area,
            city:props.screenProps.parentDetail.city,
            state:props.screenProps.parentDetail.state,
            pinCode:props.screenProps.parentDetail.pinCode,
            country:props.screenProps.parentDetail.country,
            students:props.screenProps.parentDetail.students,
            photo:props.screenProps.photo,
            spinnerVisible:false,
            isDateTimePickerVisibleDOJ: false,
            fetchFlag:true,
            fetchFlag1:true,
            kidsPhoto:props.screenProps.kidsPhoto,
            dobSelectedIndex:0
        };
    }

    returnValidDate(date){
        let tempDate=date.toString().substr(4,11);
        let day=tempDate.substr(4,2);
        let month=tempDate.substr(0,3);
        let year=tempDate.substr(7,4);
        let monthName=month;
        switch(month){
            case "Jan":month="01";break;
            case "Feb":month="02";break;
            case "Mar":month="03";break;
            case "Apr":month="04";break;
            case "May":month="05";break;
            case "Jun":month="06";break;
            case "Jul":month="07";break;
            case "Aug":month="08";break;
            case "Sep":month="09";break;
            case "Oct":month="10";break;
            case "Nov":month="11";break;
            case "Dec":month="12";break;
        }
        return {day,month,monthName,year};
    }

    dateTimePickerHandler={
        _showDateTimePicker: () => {this.setState({ isDateTimePickerVisibleDOA: true })},
        _hideDateTimePicker: () => {this.setState({ isDateTimePickerVisibleDOA: false ,dobSelectedIndex:10})},
        _handleDatePickedDOA: (date) => {
            let tempDate=this.returnValidDate(date);
            this.setState({
                DOA:tempDate.day.concat("-",tempDate.monthName,"-",tempDate.year)
            });
            this.dateTimePickerHandler._hideDateTimePicker();
        },
        _handleDatePickedDOB: (date) => {
            console.log(this.state.dobSelectedIndex);
            let tempDate=this.returnValidDate(date);
            let student=this.state.students;
            student[this.state.dobSelectedIndex].studentDateOfBirth=tempDate.day.concat("-").concat(tempDate.monthName).concat("-").concat(tempDate.year);
            this.setState({students:student});
            this.dateTimePickerHandler._hideDateTimePicker();
        }
    };

    updateProfile(){
        console.log(this.state);
        this.setState({spinnerVisible:true,fetchFlag1:true});
        fetch("http://192.168.1.29:8081/Daycare/parents/updateParentsDetails",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "mobileNumber":this.state.mobileNo,
                "anniversaryDay":this.state.DOA,
                "email":this.state.emailId,
                "student":this.state.students,
                "address1":this.state.building,
                "address2":this.state.road,
                "address3":this.state.area,
                "city":this.state.city,
                "state":this.state.state,
                "pincode":this.state.pinCode,
                "country":this.state.country
            })
        },2)
            .then((response)=>response.json())
            .then((response)=>{
                if(response.statusCode===200){
                    this.props.screenProps.revokeGetProfileData();
                    this.props.screenProps.setKidsPhotos(this.state.kidsPhoto);
                    this.setState({spinnerVisible:false,fetchFlag1:false});
                    setTimeout(()=>{Alert.alert("Update status","Profile updated successfully!")});
                    this.props.screenProps.setPhoto(this.state.photo);

                }
                else{
                    this.setState({spinnerVisible:false,fetchFlag1:false});
                    setTimeout(()=>{Alert.alert("Update status","Unable to update, provide all the details.")})
                }
            })
            .catch(() => {
                this.setState({spinnerVisible: false,fetchFlag1:false});
                setTimeout(()=>{Alert.alert("Error", "Network error! Please try again")});
            });
        setTimeout(()=>{
            fetch.abort(2);
            this.setState({spinnerVisible: false});
            if(this.state.fetchFlag1)
                setTimeout(()=>{Alert.alert("Error", "Network error! Could not load your profile details")});
            this.setState({fetchFlag1:false});
        },10000);
    }
    render(){
        return (
            <View style={{flex:1}}>
                <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"rgb(244, 191, 66)"}}>
                    <View style={{flex:1,justifyContent:"space-around",alignItems:"center"}}>
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
                    </View>
                    <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"#ffffff",fontSize:20}}>Profile</Text>
                    </View>
                    <View style={{flex:1}}>
                        <TouchableOpacity
                            onPress={()=>{this.props.navigation.navigate("Home")}}
                        >
                            <Entypo
                                name="home"
                                size={30}
                                style={{color: "#ffffff"}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex:10,width:"100%",height:"100%",alignItems:"center"}}>
                    <ScrollView
                        style={{width:"100%",height:"100%"}}
                        showsVerticalScrollIndicator={false}
                    >
                        <LinearGradient
                            colors={['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#6536FF', '#8000FF']}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                            style={{ height: 48, width: "100%", alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Text>Parent Details</Text>
                        </LinearGradient>
                        <View style={{paddingLeft:"5%",paddingRight:"5%"}}>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                <Text style={{flex:2}}>Parent name:</Text>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{padding:10,borderWidth:1,borderRadius:5}}
                                        placeholder="Enter parent name"
                                        autoCorrect={false}
                                        autoCapitalize={"words"}
                                        value={this.state.parentName}
                                        onChangeText={(parentData)=>{this.setState({parentData:parentData})}}
                                        editable={false}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                <Text style={{flex:2,marginBottom:5}}>Mobile number:</Text>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{padding:10,borderWidth:1,borderRadius:5}}
                                        placeholder="Enter mobile number"
                                        autoCorrect={false}
                                        value={this.state.mobileNo}
                                        onChangeText={(mobileNo)=>{this.setState({mobileNo:mobileNo})}}
                                        editable={false}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                <Text style={{flex:2,marginBottom:5}}>EmailId:</Text>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{padding:10,borderWidth:1,borderRadius:5}}
                                        placeholder="Enter emailId"
                                        autoCorrect={false}
                                        autoCapitalize={"none"}
                                        value={this.state.emailId}
                                        onChangeText={(emailId)=>{this.setState({emailId:emailId})}}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center",marginTop:"5%"}}>
                                <Text style={{flex:1}}>Anniversary:</Text>
                                <View style={{ flex: 2 }}>
                                    <TouchableOpacity
                                        style={{flex:1,borderBottomWidth:0.5,height:40,flexDirection:"row",alignItems:"center"}}
                                        onPress={this.dateTimePickerHandler._showDateTimePicker}>
                                        <Text style={{flex:7,fontSize:16,paddingLeft:"5%"}}>{this.state.DOA}</Text>
                                        <MaterialIcons
                                            name="arrow-drop-down"
                                            size={27}
                                            style={{flex:1,color: "#000000"}}
                                        />
                                    </TouchableOpacity>
                                    <DateTimePicker
                                        isVisible={this.state.isDateTimePickerVisibleDOA}
                                        onConfirm={this.dateTimePickerHandler._handleDatePickedDOA}
                                        onCancel={this.dateTimePickerHandler._hideDateTimePicker}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                <Text style={{flex:2,marginBottom:5}}>Building:</Text>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{padding:10,borderWidth:1,borderRadius:5}}
                                        placeholder="Enter building details"
                                        autoCorrect={false}
                                        value={this.state.building}
                                        onChangeText={(building)=>{this.setState({building:building})}}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                <Text style={{flex:2,marginBottom:5}}>Road:</Text>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{padding:10,borderWidth:1,borderRadius:5}}
                                        placeholder="Enter road name"
                                        autoCorrect={false}
                                        value={this.state.road}
                                        onChangeText={(road)=>{this.setState({road:road})}}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                <Text style={{flex:2,marginBottom:5}}>Area:</Text>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{padding:10,borderWidth:1,borderRadius:5}}
                                        placeholder="Enter area name"
                                        autoCorrect={false}
                                        value={this.state.area}
                                        onChangeText={(area)=>{this.setState({area:area})}}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                <Text style={{flex:2,marginBottom:5}}>City</Text>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{padding:10,borderWidth:1,borderRadius:5}}
                                        placeholder="Enter city name"
                                        autoCorrect={false}
                                        value={this.state.city}
                                        onChangeText={(city)=>{this.setState({city:city})}}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                <Text style={{flex:2,marginBottom:5}}>State:</Text>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{padding:10,borderWidth:1,borderRadius:5}}
                                        placeholder="Enter state name"
                                        autoCorrect={false}
                                        value={this.state.state}
                                        onChangeText={(state)=>{this.setState({state:state})}}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                <Text style={{flex:2,marginBottom:5}}>Pin code:</Text>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{padding:10,borderWidth:1,borderRadius:5}}
                                        placeholder="Enter pin code"
                                        autoCorrect={false}
                                        value={this.state.pinCode}
                                        onChangeText={(pinCode)=>{this.setState({pinCode:pinCode})}}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                <Text style={{flex:2,marginBottom:5}}>Country:</Text>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{padding:10,borderWidth:1,borderRadius:5}}
                                        placeholder="Enter country"
                                        autoCorrect={false}
                                        value={this.state.country}
                                        onChangeText={(country)=>{this.setState({country:country})}}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection:"row",marginTop:"5%",alignItems:"center"}}>
                                <Text
                                    style={{ color:"#000000",fontSize:15}}
                                >  Upload Photo</Text>
                                <PhotoUpload
                                    onPhotoSelect={avatar => {
                                        if (avatar) {
                                            this.setState({photo:{uri:`data:image/JPG;base64,${avatar}`}});
                                        }
                                    }}
                                >
                                    <Image
                                        style={{
                                            marginLeft:"10%",
                                            width: 120,
                                            height: 120,
                                            borderRadius: 60
                                        }}
                                        resizeMode='cover'
                                        source={this.state.photo}
                                    />
                                </PhotoUpload>
                            </View>
                        </View>
                        <LinearGradient
                            colors={['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#6536FF', '#8000FF']}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                            style={{ height: 48, width: "100%", alignItems: 'center', justifyContent: 'center',marginTop:"5%"}}
                        >
                            <Text>student Details</Text>
                        </LinearGradient>

                        {
                            this.state.students.map((student,index)=>{
                                return(
                                    <View key={index} style={{paddingLeft:"5%",paddingRight:"5%"}}>
                                        <LinearGradient
                                            colors={['#4C64FF', '#6536FF', '#8000FF']}
                                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                                            style={{ height: 30, width: "100%", alignItems: 'center', justifyContent: 'center',marginTop:"5%"}}
                                        >
                                            <Text style={{color:"#ffffff",fontSize:17}}>{student.studentName}</Text>
                                        </LinearGradient>
                                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                            <Text style={{flex:2,marginBottom:5}}>Student Id:</Text>
                                            <View style={{flex:4}}>
                                                <TextInput
                                                    style={{padding:10,borderWidth:1,borderRadius:5}}
                                                    placeholder="Student Id"
                                                    autoCorrect={false}
                                                    value={this.state.students[index].studentId}
                                                    onChangeText={()=>{}}
                                                    editable={false}
                                                />
                                            </View>
                                        </View>
                                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                            <Text style={{flex:2,marginBottom:5}}>Gender:</Text>
                                            <View style={{flex:4}}>
                                                <Dropdown
                                                    label="Select gender"
                                                    value={this.state.students[index].studentGender}
                                                    data={[{value:"male"},{value:"female"},{value:"others"}]}
                                                    containerStyle={{height:40}}
                                                    labelHeight={10}
                                                    onChangeText={(gender)=>{
                                                        let student=this.state.students;
                                                        student[index].studentGender=gender;
                                                        this.setState({students:student});
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                                            <Text style={{flex:2,marginBottom:5}}>Age:</Text>
                                            <View style={{flex:4}}>
                                                <TextInput
                                                    style={{padding:10,borderWidth:1,borderRadius:5}}
                                                    placeholder="Select age"
                                                    autoCorrect={false}
                                                    value={this.state.students[index].studentAge}
                                                    onChangeText={(age)=>{
                                                        let student=this.state.students;
                                                        student[index].studentAge=age;
                                                        this.setState({students:student});
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center",marginTop:"5%"}}>
                                            <Text style={{flex:1}}>DOB:</Text>
                                            <View style={{ flex: 2 }}>
                                                <TouchableOpacity
                                                    style={{flex:1,borderBottomWidth:0.5,height:40,flexDirection:"row",alignItems:"center"}}
                                                    onPress={()=>{this.dateTimePickerHandler._showDateTimePicker();this.setState({dobSelectedIndex:index})}}>
                                                    <Text style={{flex:7,fontSize:16,paddingLeft:"5%"}}>
                                                        {(this.state.students[index].studentDateOfBirth===null)?"Select a date":this.state.students[index].studentDateOfBirth}
                                                        </Text>
                                                    <MaterialIcons
                                                        name="arrow-drop-down"
                                                        size={27}
                                                        style={{flex:1,color: "#000000"}}
                                                    />
                                                </TouchableOpacity>
                                                <DateTimePicker
                                                    isVisible={this.state.isDateTimePickerVisibleDOA}
                                                    onConfirm={(date) => {this.dateTimePickerHandler._handleDatePickedDOB(date)}}
                                                    onCancel={this.dateTimePickerHandler._hideDateTimePicker}
                                                />
                                            </View>
                                        </View>
                                        <View style={{flexDirection:"row",marginTop:"5%",alignItems:"center"}}>
                                            <Text
                                                style={{ color:"#000000",fontSize:15}}
                                            >  Upload Photo</Text>
                                            <PhotoUpload
                                                onPhotoSelect={avatar => {
                                                    if (avatar) {
                                                        this.state.kidsPhoto[index]=({uri:`data:image/JPG;base64,${avatar}`});
                                                    }
                                                }}
                                            >
                                                <Image
                                                    style={{
                                                        marginLeft:"10%",
                                                        width: 120,
                                                        height: 120,
                                                        borderRadius: 60
                                                    }}
                                                    resizeMode='cover'
                                                    source={this.state.kidsPhoto[index]}
                                                />
                                            </PhotoUpload>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        <View style={{alignItems:"center",marginTop:"5%",marginBottom:"5%",width:"100%",paddingLeft:"5%",paddingRight:"5%"}}>
                            <TouchableOpacity
                                style={{backgroundColor:"#376df4",width:"100%",height:50,justifyContent:"center",alignItems:"center",borderRadius:5}}
                                onPress={()=>{this.updateProfile()}}
                            >
                                <Text style={{color:"#ffffff",fontSize:20}}>Update profile</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}