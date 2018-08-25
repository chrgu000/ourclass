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
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);

    this.Base.setMyData({ currenttab: 0 });
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();

    instapi.newslist({}, (newslist) => {
      that.Base.setMyData({ newslist: newslist });
    });
  }
  backToSend(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定发出？',
      success(res) {
        if (res.confirm) {

          var api = new ClassApi();
          api.sendmsg({
            "type": "W", news_id: e.currentTarget.id
            , user_id: AppBase.UserInfo.isuser == "Y" ? AppBase.UserInfo.user.id : 0, onlymember_id: that.Base.options.onlymember_id
          }, () => {
            wx.navigateBack({

            });
          });

        }
      }
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
body.loaddata = content.loaddata;
body.backToSend = content.backToSend;

Page(body)