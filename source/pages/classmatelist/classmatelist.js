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
    api.classmatelist({ position: "news" }, (classmatelist) => {
      that.Base.setMyData({ classmatelist: classmatelist });
    });

  }
  updateparentstatus(e){
    var id=e.currentTarget.id;
    console.log(id);
    var s=id.split("_");
    var idx = parseInt(s[1]);
    var idq = parseInt(s[2]);
    id = parseInt(s[0]);
    var status = s[3];

    var classmatelist = this.Base.getMyData().classmatelist;
    classmatelist[idx].parents[idq].status=status;

    this.Base.setMyData({ classmatelist: classmatelist });

    var api = new ClassApi();
    api.updateparentstatus({ id:id,status:status });

  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.updateparentstatus = content.updateparentstatus;

Page(body)