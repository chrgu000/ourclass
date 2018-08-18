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
   // options.id = 1;
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({ontop:"Y", cover: "", loaded: false });


  }
  onMyShow() {
    var that = this;
    if (this.Base.getMyData().loaded == false) {
      var api = new ClassApi();
      api.noticecover({}, (covers) => {
        that.Base.setMyData({ covers, cover: covers[0].pic });
        console.log("checkid");
        console.log(that.Base.options.id);
        if (that.Base.options.id != undefined) {
          console.log("have");
          api.notice({ id: that.Base.options.id }, (news) => {
            console.log("loadnews");
            console.log(news);
            that.Base.setMyData(news);
            that.Base.setMyData({ loaded: true });
            
          });
        }
      });
    }
  }
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: "创建通知"
    })
  }
  chooseCover() {
    var that = this;
    this.Base.uploadImage("news", (file) => {
      that.Base.setMyData({ cover: file });
    });
  }
  catchange(e) {
    var catindex = e.detail.value;
    this.Base.setMyData({ catindex: catindex });
  }
  formSubmit(e) {
    var that = this;
    console.log(e);
    var json = e.detail.value;
    json.ontop = json.ontop ? "Y" : "N";
    json.status = e.detail.target.id;
    if (that.Base.options.id != undefined) {
      json.primary_id = that.Base.options.id;
    }
    console.log(json);
    if (json.name == "") {
      this.Base.info("请输入标题");
      return;
    }
    if (json.content == "") {
      this.Base.info("请输入正文");
      return;
    }
    var api = new ClassApi();
    api.noticecreate(json, (ret) => {
      if (ret.code == 0) {
        wx.navigateBack({

        })
      } else {

        this.Base.info(ret.return);
      }
    });
  }
  changeCover(e){
    this.Base.setMyData({cover:e.currentTarget.id});
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.chooseCover = content.chooseCover;
body.catchange = content.catchange; 
body.formSubmit = content.formSubmit; 
body.changeCover = content.changeCover;
Page(body)