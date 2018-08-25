// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { UserApi } from "../../apis/user.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ photo:""});
  }
  onMyShow() {
    var that = this;
  }

  setPageTitle() {
    wx.setNavigationBarTitle({
      title: "员工绑定"
    })
  }
  phonenoCallback(mobile){
    this.Base.setMyData({ mobile});
  }
  choosePhoto(){
    this.Base.uploadImage("user",(photo)=>{
      this.Base.setMyData({photo});
    });
  }
  bind(e){
    console.log(e);
    var data=e.detail.value;
    if(data.photo==""){
      this.Base.info("请选择头像");
      return;
    }
    if (data.user_name == "") {
      this.Base.info("请输入你的姓名");
      return;
    }
    if (data.mobile == "") {
      this.Base.info("请点击绑定手机");
      return;
    }
    var userapi=new UserApi();
    userapi.bind(data,(ret)=>{
      if(ret.code==0){
        wx.reLaunch({
          url: '/pages/home/home?class_id='+ret.return,
        })
      }else{
        this.Base.info(ret.return);
      }
    });
  }
  checkPermission() {

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.choosePhoto = content.choosePhoto;
body.bind = content.bind;
Page(body)