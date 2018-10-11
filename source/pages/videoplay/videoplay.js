// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.module="photo";
    //options.file ="8d3ee4575a67ad7551dc1e5321ca8b8b_18081718028.mp4";
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    //https://alioss.app-link.org/alucard263096/ourclass/photo/8d3ee4575a67ad7551dc1e5321ca8b8b_18081718028.mp4
    this.Base.setMyData({"module":options.module,file:options.file});
  }
  onMyShow() {
    var that = this;
  }
  yundownload(){
    this.Base.toast("开始下载");
    var data=this.Base.getMyData();
    var url=data.uploadpath+data.module+"/"+data.file;
    console.log(url);
    this.Base.download(url,()=>{
      this.Base.toast("下载成功，请打开文件夹");
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.yundownload = content.yundownload;
Page(body)