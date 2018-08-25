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
   //options.id = 2;
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({ cover: "", video:"",inhome:"Y",ontop:"Y",loaded:false});
    

  }
  onMyShow() {
    var that = this;
    if(this.Base.getMyData().loaded==false){
      var api = new InstApi();
      api.newscat({}, (catlist) => {
        that.Base.setMyData({ catlist, catindex: 0 });
        console.log("checkid");
        console.log(that.Base.options.id);
        if (that.Base.options.id != undefined) {
          console.log("have");
          api.news({ id: that.Base.options.id }, (news) => {
            console.log("loadnews");
            console.log(news);
            that.Base.setMyData(news);
            that.Base.setMyData({ loaded: true});
            for (var i = 0; i < catlist.length; i++) {
              if (catlist[i].id == news.id) {
                that.Base.setMyData({ catindex: i });
                break;
              }
            }
          });
        }
      });
    }
  }
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: "创建文章"
    })
  }
  chooseCover(){
    var that=this;
    this.Base.uploadImage("news",(file)=>{
        that.Base.setMyData({cover:file});
    });
  }
  catchange(e) {
    var catindex = e.detail.value;
    this.Base.setMyData({ catindex: catindex });
  }
  formSubmit(e){
    var that=this;
    console.log(e);
    var json=e.detail.value;
    json.inhome = json.inhome ? "Y" : "N";
    json.ontop = json.ontop ? "Y" : "N";
    json.status = e.detail.target.id; 
    json.cat_id = 4;//e.detail.target.id;
    if(that.Base.options.id!=undefined){
      json.primary_id = that.Base.options.id;
    }
    console.log(json);
    if(json.name==""){
      this.Base.info("请输入标题");
      return;
    }
    if (json.cover == "") {
      this.Base.info("请选择一个封面");
      return;
    }
    if (json.content == "") {
      this.Base.info("请输入正文");
      return;
    }
    var api = new ClassApi();
    api.newscreate(json,(ret)=>{
      if(ret.code==0){
        wx.navigateBack({
          
        })
      }else{

        this.Base.info(ret.return);
      }
    });
  }
  chooseVideo(e){
    this.Base.uploadVideo("news", (file)=>{
      this.Base.setMyData({ video: file });
    });
    var id = e.currentTarget.id;
    var videocontext = wx.createVideoContext("video");
    videocontext.pause();
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.chooseCover = content.chooseCover;
body.catchange = content.catchange;
body.formSubmit = content.formSubmit;
body.chooseVideo = content.chooseVideo;
Page(body)