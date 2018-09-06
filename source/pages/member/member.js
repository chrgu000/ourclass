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
  }
  onMyShow() {
    var that = this;
  }
  updateuserphoto(){
    this.Base.uploadImage("user", (file) => {
      var UserInfo = AppBase.UserInfo;
      UserInfo.user.photo=file;
      this.Base.setMyData({ UserInfo});
      var api = new UserApi();
      api.photoupdate({ user_id: UserInfo.user.id, photo: file }, (ret) => {
        
      });
    });
  }
}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.updateuserphoto = content.updateuserphoto;
Page(body)