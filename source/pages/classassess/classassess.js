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
    //options.id=1;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var api = new ClassApi();
    api.teacherassess({}, (assessrecord) => {
      this.Base.setMyData({ assessrecord: assessrecord });
    });
  }
  scroe(e){
    var id=e.currentTarget.id;
    console.log(id);
    var s=id.split("_");
    var idx = parseInt(s[0]);
    var score = parseInt(s[1]);
    var schedule_id = parseInt(s[2]);
    var classmate_id = parseInt(s[3]);

    var assessrecord = this.Base.getMyData().assessrecord;
    assessrecord.childlist[idx].score=score;
    this.Base.setMyData({ assessrecord: assessrecord });

    var score = assessrecord.childlist[idx].score;
    var summary = assessrecord.childlist[idx].summary;


    var api = new ClassApi();
    api.childassess({ schedule_id,score,summary,classmate_id},(ret)=>{

    });
  }
  committext(e) {
    var id = e.currentTarget.id;
    var summary = e.detail.value;
    console.log(id);
    var s = id.split("_");
    var idx = parseInt(s[0]);
    var schedule_id = parseInt(s[1]);
    var classmate_id = parseInt(s[2]);

    var assessrecord = this.Base.getMyData().assessrecord;
    assessrecord.childlist[idx].summary = summary;
    this.Base.setMyData({ assessrecord: assessrecord });

    var score = assessrecord.childlist[idx].score;
    var summary = assessrecord.childlist[idx].summary;


    var api = new ClassApi();
    api.childassess({ schedule_id, score, summary, classmate_id }, (ret) => {

    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.updatephoto = content.updatephoto; 
body.scroe = content.scroe;
body.committext = content.committext;
Page(body)