// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ClassApi } from "../../apis/class.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.class_id=0;
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var api=new ClassApi();
    api.allclass({}, (allclass)=>{
      this.Base.setMyData({ allclass});
    });
  }

  setPageTitle(){
    wx.setNavigationBarTitle({
      title: '请选择班级快速进入',
    })
  }

  checkPermission(){

  }
  
}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.updateuserphoto = content.updateuserphoto;
Page(body)