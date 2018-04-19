import React from 'react';
import {AsyncStorage,View,Alert} from 'react-native'
import {DrawerNavigator,NavigationActions} from 'react-navigation';
import Notification from './notification/notificationScreen';
import Home from './home/homeScreen';
import Profile from './profile/profileScreen'
import CustomDrawerContentComponent from './custonDrawer/customDrawerScreen';
import Report from './reportPage/reportPage';
import Holidays from './holidays/holidays';
import About from './abount/about';
import Spinner from 'react-native-loading-spinner-overlay'
import fetch from "react-native-cancelable-fetch";

const Navigation = DrawerNavigator(
    {
        Home: {
            screen: Home,
        },
        Notifications: {
            screen: Notification,
        },
        Profile:{
            screen:Profile
        },
        Report:{
            screen:Report
        },
        Holidays:{
            screen:Holidays
        },
        About:{
            screen:About
        },
    },
    {
        headerMode: 'float',
        contentComponent:CustomDrawerContentComponent,
        initialRouteName:"Home",
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle'
    }
);

export default class HomeRoot extends React.Component{

    constructor(props){
        super(props);
        this.state={
            mobileNo:"",
            parentName:"User",
            photo:require("../../assets/directorUser.png"),
            kidsPhoto:[require("../../assets/kid.png"),require("../../assets/kid.png"),require("../../assets/kid.png"),require("../../assets/kid.png"),require("../../assets/kid.png")],
            loginFlag:false,
            spinnerVisible:false,
            fetchFlag:true,
            parentDetail:{}
        };
    }

    componentDidMount(){
        AsyncStorage.getItem("loginFlag",(err,loginCheck)=>{
            this.setState({loginFlag:JSON.parse(loginCheck)});
            if(loginCheck!=="true")
                this.props.navigation.dispatch(this.loginPageResetAction);
        });
        AsyncStorage.getItem("mobileNo",(err,mobileNo)=>{
            if(mobileNo!==null) {
                this.setState({mobileNo: mobileNo});
                this.getProfileData();
            }
        });
        AsyncStorage.getItem("photo",(err,photo)=>{
            if(photo!==null)
                this.setState({photo:JSON.parse(photo)});
            else
                this.setState({photo:require("../../assets/directorUser.png")});
        });
        setTimeout(()=> {
            AsyncStorage.getItem("parentDetail", (err, parentDetail) => {
                if (parentDetail !== null)
                    this.setState({parentDetail: JSON.parse(parentDetail)});
            });
        },500);
        AsyncStorage.getItem("kidsPhoto",(err,kidsPhoto)=>{
            if(kidsPhoto!==null)
                this.setState({kidsPhoto:JSON.parse(kidsPhoto)});
        }); //To get locally stored kid photos
    }

    loginPageResetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'LoginPage'})
        ]
    });

    navigateToLoginPage=(()=>{
        this.props.navigation.dispatch(this.loginPageResetAction);
        AsyncStorage.setItem("loginFlag",JSON.stringify(false));
        AsyncStorage.removeItem("mobileNo");
        AsyncStorage.removeItem("photo");
        AsyncStorage.removeItem("parentDetail");
        AsyncStorage.removeItem("kidsPhoto");
    }).bind(this);

    setPhoto=((photo)=>{
        this.setState({photo:photo});
        AsyncStorage.setItem("photo",JSON.stringify(photo));
    }).bind(this);

    setKidsPhotos=((kidsPhotos)=>{
        this.setState({kidsPhoto:kidsPhotos});
        AsyncStorage.setItem("kidsPhoto",JSON.stringify(this.state.kidsPhoto));
    }).bind(this);

    getKidsPhotos=(()=>{
        return this.state.kidsPhoto;
    }).bind(this);

    silentGetProfileData=(()=>{  //called when needed to update without being visible.
        fetch("http://192.168.1.19:8081/Daycare/centerdirector/selectingParentsDetailsByMobileNumber",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "mobileNumber":this.state.mobileNo,
            })
        })
            .then((response)=>response.json())
            .then((response)=>{
                if(response.statusCode===200) {
                    let data = response.data[0];
                    let parentData={
                        mobileNumber:data.mobileNumber,
                        parentName:data.parentName,
                        emailId: (data.email === "default") ? "" : data.email,
                        DOA: (data.anniversaryDay === "default") ? "pick a date" : data.anniversaryDay,
                        building: (data.address1 === "default") ? "" : data.address1,
                        road: (data.address2 === "default") ? "" : data.address2,
                        area: (data.address3 === "default") ? "" : data.address3,
                        city: (data.city === "default") ? "" : data.city,
                        state: (data.state === "default") ? "" : data.state,
                        pinCode: (data.pinCode === "default") ? "" : data.pincode,
                        country: (data.country === "default") ? "" : data.country,
                        students: data.student
                    };
                    this.setState({
                        parentDetail:parentData,
                        parentName:data.parentName
                    });
                    AsyncStorage.setItem("parentDetail",JSON.stringify(parentData))
                }
            })
    }).bind(this);

    getProfileData=(()=>{  //this is called when page app loads
        this.setState({spinnerVisible:true,fetchFlag:true});
        fetch("http://192.168.1.19:8081/Daycare/centerdirector/selectingParentsDetailsByMobileNumber",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "mobileNumber":this.state.mobileNo,
            })
        },1)
            .then((response)=>response.json())
            .then((response)=>{
                this.setState({spinnerVisible: false,fetchFlag:false});
                if(response.statusCode===200) {
                    let data = response.data[0];
                    let parentData={
                        mobileNumber:data.mobileNumber,
                        parentName:data.parentName,
                        emailId: (data.email === "default") ? "" : data.email,
                        DOA: (data.anniversaryDay === "default") ? "pick a date" : data.anniversaryDay,
                        building: (data.address1 === "default") ? "" : data.address1,
                        road: (data.address2 === "default") ? "" : data.address2,
                        area: (data.address3 === "default") ? "" : data.address3,
                        city: (data.city === "default") ? "" : data.city,
                        state: (data.state === "default") ? "" : data.state,
                        pinCode: (data.pinCode === "default") ? "" : data.pincode,
                        country: (data.country === "default") ? "" : data.country,
                        students: data.student
                    };
                    this.setState({
                    parentDetail:parentData,
                        parentName:data.parentName
                    });
                    AsyncStorage.setItem("parentDetail",JSON.stringify(parentData));
                }
            })
            .catch(() => {
                this.setState({spinnerVisible: false,fetchFlag:false});
                setTimeout(()=>{Alert.alert("Internet problem!", "Could not load your details. Please connect to internet")});
            });
        setTimeout(()=>{
            fetch.abort(1);
            this.setState({spinnerVisible: false});
            if(this.state.fetchFlag)
                setTimeout(()=>{Alert.alert("Internet problem", "Could not load your details. Please connect to internet")});
            this.setState({fetchFlag:false});
        },10000);
    }).bind(this);

    render(){
        return (
            <View style={{flex:1}}>
                <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <Navigation screenProps={{
                    navigateToLoginPage:this.navigateToLoginPage,
                    mobileNo:this.state.mobileNo,
                    parentName:this.state.parentName,
                    photo:this.state.photo,
                    setPhoto:this.setPhoto,
                    loginFlag:this.state.loginFlag,
                    parentDetail:this.state.parentDetail,
                    revokeGetProfileData:this.silentGetProfileData,
                    kidsPhoto:this.state.kidsPhoto,
                    setKidsPhotos:this.setKidsPhotos,
                    getKidsPhotos:this.getKidsPhotos
                }}/>
            </View>
        );
    }
}