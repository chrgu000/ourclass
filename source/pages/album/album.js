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
      var cphoto = ret.photo;
      var cvideo = ret.video;
      this.Base.setMyData({ cphoto,cvideo});
      this.loadmore(0);
      this.loadmore(1);
    });
  }
  onReachBottom(){
    var currenttab = this.Base.getMyData().currenttab;
    this.loadmore(currenttab);
  }

  loadmore(currenttab){
    
    var cs=0;
    if(currenttab=="0"){
      var photo = this.Base.getMyData().photo;
      var cphoto = this.Base.getMyData().cphoto;
      
      
      for (var j = photo.length; j < cphoto.length; j++) {
        photo.push(cphoto[j]);
        cs++;
        if (cs >= 7) {
          break;
        }
      }
      if (cs == 0) {
        wx.showToast({
          title: '已经没有了',
          icon: 'none'
        })
        this.Base.setMyData({
          jgnomore: 1,
        });
      }
      else {
        setTimeout(() => {
          console.log("llll");
          this.Base.setMyData({
            photo
          });
          wx.hideLoading()
        }, 500);
      }


    }else{

      var video = this.Base.getMyData().video;
      var cvideo = this.Base.getMyData().cvideo;


      for (var j = video.length; j < cvideo.length; j++) {
        video.push(cvideo[j]);
        cs++;
        if (cs >= 7) {
          break;
        }
      }
      if (cs == 0) {
        wx.showToast({
          title: '已经没有了',
          icon: 'none'
        })
        this.Base.setMyData({
          jgnomore: 1,
        });
      }
      else {
        setTimeout(() => {
          console.log("llll");
          this.Base.setMyData({
            video
          });
          wx.hideLoading()
        }, 500);
      }
    }
  }

  changeTab(e){
    this.Base.setMyData({ currenttab: e.currentTarget.id });
  }
  uploadpic(e) {
    var status = e.currentTarget.id;
    var that=this;
    this.Base.uploadImage("photo", (ret)=>{
      var classapi = new ClassApi();
      classapi.photoupload({
        photo:ret,
        video:"",
        status: status,
        duration:0
      },(ret)=>{
        console.log(ret);
      });
    }, 9, () => {
      if (status == "Z") {
        that.Base.info("上传成功，等待审核");
      } else {
        that.onMyShow();
      }
    });
  }
  uploadvid(e){
    var status=e.currentTarget.id;
    var that = this;
    this.Base.uploadVideo("photo",(ret,duration)=>{
      console.log(ret);
      var classapi = new ClassApi();
      classapi.photoupload({
        photo: "",
        video: ret,
        status: status,
        duration: duration
      }, (ret) => {
        console.log(ret);
        if(status=="Z"){
          that.Base.info("上传成功，等待审核");
        }else{

          that.onMyShow();
        }
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
    console.log(e.currentTarget.id);
    var id = e.currentTarget.id;
    var videoContext = wx.createVideoContext(id);
    console.log("stop");
    videoContext.pause();
    videoContext.stop();
    var fv=id.split("_");
    
    var video = this.Base.getMyData().video;
    for(var i=0;i<video.length;i++){
      console.log(video);
      for (var j = 0; j < video[i].videos.length; j++) {
        console.log(video[i].videos[j]);
        if (fv[1] == video[i].videos[j].id){
          console.log(video[i].videos[j].video);
          wx.navigateTo({
            url: '/pages/videoplay/videoplay?module=photo&file=' + video[i].videos[j].video,
          });
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
body.loadmore = content.loadmore;
Page(body)