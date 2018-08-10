// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
    this.inauthpage=true;
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ photo: "", step: 0, mobile:"",name:""});
  }
  onMyShow() {
    var that = this;
  }

  setPageTitle(){
    wx.setNavigationBarTitle({
      title: '授权登录',
    });
  }

  uploadphoto(){
    var that=this;
    this.Base.uploadImage("member",(ret)=>{
      that.Base.setMyData({ photo: ret });
      setTimeout(() => {
        that.Base.setMyData({ step: 1 });
      }, 1000);
    },1);
  }
  namechange(e){
    var val=e.detail.value;
    this.Base.setMyData({ name: val }); 
  }
  confirmname() {
    var that = this;
    setTimeout(() => {
      that.Base.setMyData({ step: 2 });
    }, 1000);
  }
  swchange(){
    var data=this.Base.getMyData();
    if(data.photo==""){
      this.Base.setMyData({step:0});
      return;
    }
    if (data.name == "") {
      this.Base.setMyData({ step: 1 });
      return;
    }
    if (data.mobile == "") {
      this.Base.setMyData({ step: 2 });
      return;
    }
  }
  phonenoCallback(mobile){

    var that = this;
    this.Base.setMyData({ mobile: mobile });
    setTimeout(() => {
      that.Base.setMyData({ step: 3 });
    }, 1000);
  }
  confirmReg(){
    var data=this.Base.getMyData();
    data.openid=AppBase.openid;
    data.session_key=AppBase.session_key;
    var memberapi = new MemberApi();
    memberapi.update(data,(ret)=>{
      if(ret.code==0){
        wx.reLaunch({
          url: '/pages/home/home',
        })
      }
    });
  }
} 
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.uploadphoto = content.uploadphoto; 
body.namechange = content.namechange; 
body.confirmname = content.confirmname;
body.swchange = content.swchange;
body.confirmReg = content.confirmReg;
Page(body)