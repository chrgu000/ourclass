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

    classapi.noticelist({  inmgr: "Y" }, (list) => {
      that.Base.setMyData({ list: list });
    });
  }
  changestatus(e) {

    var id = e.currentTarget.id;
    var summary = e.detail.value;
    console.log(id);
    var s = id.split("_");
    var idx = parseInt(s[0]);
    var id = parseInt(s[1]);
    var status = (s[2]);

    var list = this.Base.getMyData().list;
    list[idx].status = status;
    this.Base.setMyData({ list });
    var api = new ClassApi();
    api.noticestatusupdate({ id: id, status: status });
  }
  changeontop(e) {

    var id = e.currentTarget.id;
    var summary = e.detail.value;
    console.log(id);
    var s = id.split("_");
    var idx = parseInt(s[0]);
    var id = parseInt(s[1]);
    var status = (s[2]);

    var list = this.Base.getMyData().list;
    list[idx].ontop_value = status;
    this.Base.setMyData({ list });

    var api = new ClassApi();
    api.noticeontopupdate({ id: id, status: status });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
body.loaddata = content.loaddata;
body.changestatus = content.changestatus;
body.changeontop = content.changeontop;

Page(body)