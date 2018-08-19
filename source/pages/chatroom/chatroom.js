// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  ClassApi
} from "../../apis/class.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    var comment = "";
    var a = wx.getStorageSync("roomcomment");
    if (a != undefined) {
      comment = a;
    }
    this.Base.setMyData({
      comment: comment
    });
    recordmgr = wx.getRecorderManager();
    recordmgr.onStop(this.sendAudio);
  }
  onMyShow() {
    var that = this;
    that.loadchatlist();
  }
  commentChange(e) {
    var comment = e.detail.value;
    wx.setStorage({
      key: "roomcomment",
      data: comment,
    })
    this.Base.setMyData({
      comment: comment
    });
  }
  sendComment(e) {

    var that = this;
    var comment = this.Base.getMyData().comment;

    var api = new ClassApi();
    api.sendmsg({
      "type": "T", comment: comment
      ,user_id: AppBase.UserInfo.isuser == "Y" ? AppBase.UserInfo.user.id : 0}, () => {
      wx.setStorage({
        key: "roomcomment",
        data: ""
      })
      this.Base.setMyData({
        comment: ""
        });
        that.loadchatlist();
    });
  }
  sendAudio(res) {
    //console.log(file);
    var file = res.tempFilePath;
    //return;
    var that = this;
    var duration = parseInt(this.Base.getMyData().voiceduration);
    if(duration<1){
      return;
    }

    
    this.Base.uploadFile("chat",file,(audiofile)=>{
      var api = new ClassApi();
      api.sendmsg({
        "type": "A", audio: audiofile, audioduration: duration
        , user_id: AppBase.UserInfo.isuser == "Y" ? AppBase.UserInfo.user.id : 0
      }, () => {
        that.loadchatlist();
      });
    });
    
  } 
  loadchatlist() {
    var api=new ClassApi();
    api.chatlist({ orderby:"send_time"},(chatlist)=>{
      this.Base.setMyData({ chatlist});
    });
  }
  startvoice(){
    var that=this;
    clearInterval(voiceinterval);
    console.log("start voice");
    var start=0;
    this.Base.setMyData({ invoice: true });
    voiceinterval=setInterval(()=>{
      this.Base.setMyData({ voiceduration: ++start });
    },1000);
    recordmgr.start({ sampleRate: 8000});
  }
  endvoice() {
    clearInterval(voiceinterval);
    console.log("end voice");
    //this.Base.info("voiceend");
    this.Base.setMyData({ invoice: false });
    recordmgr.stop();
  }
  playaudio(e){
    console.log(e);
    var audio=e.currentTarget.dataset.audio;
    this.Base.download(audio, (filename)=>{
      wx.playVoice({
        filePath: filename,
      })
    });
  }
}
var voiceinterval=null;
var recordmgr = null;
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.commentChange = content.commentChange;
body.sendComment = content.sendComment;
body.loadchatlist = content.loadchatlist;
body.startvoice = content.startvoice;
body.endvoice = content.endvoice; 
body.sendAudio = content.sendAudio;
body.playaudio = content.playaudio;
Page(body)