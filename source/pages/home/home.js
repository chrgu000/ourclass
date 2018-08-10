// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var instapi=new InstApi();
    instapi.indexbanner({},(indexbanner)=>{
      that.Base.setMyData({ indexbanner: indexbanner});
    });
    instapi.info({}, (info) => {
      that.Base.setMyData(info);
    });
    instapi.aboutuslist({ inhome: "Y" }, (aboutuslist) => {
      that.Base.setMyData({ aboutuslist: aboutuslist });
    });
    instapi.newslist({ inhome: "Y" }, (newslist) => {
      that.Base.setMyData({ newslist: newslist });
    });
    instapi.servicelist({ inhome: "Y" }, (servicelist) => {
      that.Base.setMyData({ servicelist: servicelist });
    });
    instapi.productlist({ inhome: "Y" }, (productlist) => {
      that.Base.setMyData({ productlist: productlist });
    });
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)