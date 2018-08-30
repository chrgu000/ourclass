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
    var api= new ClassApi();
    api.assessrecord({ classmate_id: this.Base.options.id }, (assessrecord) => {
      this.Base.setMyData({ assessrecord: assessrecord });
    });
    api.childinfo({ id: this.Base.options.id }, (childinfo) => {
      this.Base.setMyData({ childinfo: childinfo });
    });
  }
  updatephoto(){
    this.Base.uploadImage("class",(file)=>{
      var api = new ClassApi();
      api.childphotoupdate({ id: this.Base.options.id, photo: file},(ret)=>{
        var childinfo=this.Base.getMyData().childinfo;
        childinfo.photo = file;
        this.Base.setMyData({ childinfo});
      });
    });
  }



}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.updatephoto = content.updatephoto;
Page(body)