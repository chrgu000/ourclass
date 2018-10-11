// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  ClassApi
} from "../../apis/class.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      photo: ""
    });
  }
  onMyShow() {
    var that = this;
    var api = new ClassApi();
    api.info({}, (classinfo) => {
      this.Base.setMyData({
        classinfo
      });
    });
  }

  setPageTitle() {
    wx.setNavigationBarTitle({
      title: "入班申请"
    })
  }
  phonenoCallback(mobile) {
    this.Base.setMyData({
      mobile
    });
  }
  choosePhoto() {
    this.Base.uploadImage("class", (photo) => {
      this.Base.setMyData({
        photo
      });
    });
  }
  bind(e) {
    var data = e.detail.value;
    if (data.photo == "") {
      this.Base.info("请选择头像");
      return;
    }
    if (data.name == "") {
      this.Base.info("请输入孩子的姓名");
      return;
    }
    if (data.idno == "" ) {
      this.Base.info("请正确输入孩子名字拼音首字母加出生年月日");
      return;
    }
    if (data.relationship == "") {
      this.Base.info("请点击绑定手机");
      return;
    }
    var api = new ClassApi();
    api.bind(data, (ret) => {
      if (ret.code == 0) {
        var pages = getCurrentPages();
        if (pages.length > 1) {
          wx.navigateBack({

          });
        } else {

          wx.reLaunch({
            url: '/pages/home/home',
          })
        }
      } else {
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