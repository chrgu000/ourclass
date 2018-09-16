// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
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
    var api = new ClassApi();
    api.teacherlist({  }, (teacherlist) => {
      that.Base.setMyData({ teacherlist: teacherlist });
    });

  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.updateparentstatus = content.updateparentstatus;

Page(body)