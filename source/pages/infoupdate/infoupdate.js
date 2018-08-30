import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({loaded:false,mobile:""});
  }
  onMyShow() {
    var that = this;
    var loaded = this.Base.getMyData().loaded;
    if(loaded==false){
      var api = new MemberApi();
      api.info({},(info)=>{
        this.Base.setMyData({ mobile: info.mobile, photo: info.photo, name: info.name, loaded: true });
      });
    }
  }
  choosePhoto() {
    this.Base.uploadImage("member", (photo) => {
      this.Base.setMyData({ photo });
    });
  }
  phonenoCallback(mobile) {
    this.Base.setMyData({ mobile });
  }
  confirm(e){
    var data=e.detail.value;
    console.log(data);
    if(data.photo==""){
      this.Base.info("请选择头像");
      return;
    }
    if (data.name == "") {
      this.Base.info("请输入姓名");
      return;
    }
    if (data.mobile == "") {
      this.Base.info("请获取手机号码");
      return;
    }
    var api = new MemberApi();
    api.updateinfo(data, (ret) => {
      if(ret.code==0){
        wx.navigateBack({
          
        })
      }else{
        this.Base.info("修改提交发送错误");
      }
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.choosePhoto = content.choosePhoto;
body.confirm = content.confirm;
Page(body)