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
    this.Base.setMyData({ currenttab: 0, photo: [], video: []});
  }
  onMyShow() {
    var that = this;
    var classapi = new ClassApi();
    classapi.photolist({},(ret)=>{
      this.Base.setMyData(ret);
    });
  }
  changeTab(e){
    this.Base.setMyData({ currenttab: e.currentTarget.id });
  }
  uploadpic(){
    var that=this;
    this.Base.uploadImage("photo", (ret)=>{
      var classapi = new ClassApi();
      classapi.photoupload({
        photo:ret,
        video:"",
        duration:0
      },(ret)=>{
        console.log(ret);
      });
    },  9, ()=>{
      that.onMyShow();
    });
  }
  uploadvid(e){
    var that = this;
    this.Base.uploadVideo("photo",(ret,duration)=>{
      console.log(ret);
      var classapi = new ClassApi();
      classapi.photoupload({
        photo: "",
        video: ret,
        duration: duration
      }, (ret) => {
        console.log(ret);
        that.onMyShow();
      });
    });
  }
  viewphotos(e){
    var photos=[];
    var photo=this.Base.getMyData().photo;
    for(var i=0;i<photo.length;i++){
      for (var j = 0; j < photo[i].photos.length; j++) {
        photos.push(photo[i].photos[j].photo);
      }
    }

    this.Base.viewGallary("photo", photos, e.currentTarget.id)

  }
  videoplay(e){
    if (ingoto==true){
      return;
    }
    ingoto=true;
    console.log(e.currentTarget.id);
    var id = e.currentTarget.id;
    var videoContext = wx.createVideoContext(id);
    console.log("stop");
    videoContext.pause();
    var fv=id.split("_");
    
    var video = this.Base.getMyData().video;
    for(var i=0;i<video.length;i++){
      console.log(video);
      for (var j = 0; j < video[i].videos.length; j++) {
        console.log(video[i].videos[j]);
        if (fv[1] == video[i].videos[j].id){

          wx.navigateTo({
            url: '/pages/videoplay/videoplay?module=photo&file=' + video[i].videos[j].video,
          });
          ingoto=false;
          return;
        }
      }
    }


  }
}
var ingoto=false;
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.changeTab = content.changeTab; 
body.uploadpic = content.uploadpic; 
body.viewphotos = content.viewphotos; 
body.uploadvid = content.uploadvid; 
body.videoplay = content.videoplay;
Page(body)