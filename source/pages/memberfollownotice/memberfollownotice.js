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

    var classapi = new ClassApi();
    classapi.noticelist({ myfollow: "Y", orderby: "r_main.published_date desc" }, (noticelist) => {
      that.Base.setMyData({ noticelist: noticelist });
    });
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
body.loaddata = content.loaddata;

Page(body)