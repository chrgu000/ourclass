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

    instapi.newslist({ cat_id: 4,inmgr:"Y" }, (newslist) => {
      that.Base.setMyData({ newslist: newslist });
    });
  }
  changestatus(e){

    var id = e.currentTarget.id;
    var summary = e.detail.value;
    console.log(id);
    var s = id.split("_");
    var idx = parseInt(s[0]);
    var id = parseInt(s[1]);
    var status = (s[2]);

    var newslist = this.Base.getMyData().newslist;
    newslist[idx].status=status;
    this.Base.setMyData({ newslist });
    var api = new ClassApi();
    api.newsstatusupdate({ id: id, status: status });
  }
  changeontop(e){

    var id = e.currentTarget.id;
    var summary = e.detail.value;
    console.log(id);
    var s = id.split("_");
    var idx = parseInt(s[0]);
    var id = parseInt(s[1]);
    var status = (s[2]);

    var newslist = this.Base.getMyData().newslist;
    newslist[idx].ontop_value = status;
    this.Base.setMyData({ newslist });

    var api=new ClassApi();
    api.newsontopupdate({id:id,status:status});
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