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
import {
  MemberApi
} from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  worker = null;
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    if (options.onlymember_id == undefined) {
      options.onlymember_id = 0;
    }
    super.onLoad(options);
    var comment = "";
    var sendtype = "K";
    this.Base.log("roomsendtype", sendtype);
    this.Base.setMyData({
      chatlist: [],
      comment: comment, sendtype: sendtype, invoice: "A", showmore: false
    });

    recordmgr = wx.getRecorderManager();
    recordmgr.onStop(this.sendAudio);


    var that = this;
    clearInterval(this.Base.worker);
    this.Base.worker = setInterval(() => {
      that.loadchatlist();
    }, 1000);
  }
  onMyShow() {
    var that = this;

  }
  commentChange(e) {
    var comment = e.detail.value;
    this.Base.setMyData({
      comment: comment
    });
  }
  sendComment(e) {

    var that = this;
    var comment = this.Base.getMyData().comment;

    var api = new ClassApi();
    api.sendmsg({
      onlymember_id: that.Base.options.onlymember_id,
      "type": "T", comment: comment
      , user_id: AppBase.UserInfo.isuser == "Y" ? AppBase.UserInfo.user.id : 0
    }, () => {
      this.Base.setMyData({
        comment: ""
      });
      that.loadchatlist();
    });
  }
  sendAudio(res) {
    //console.log(file);
    var file = res.tempFilePath;
    var voicecancel = this.Base.getMyData().voicecancel;
    //return;
    var that = this;
    var duration = parseInt(this.Base.getMyData().voiceduration);
    if (res.duration < 1000 || voicecancel == true) {
      return;
    }


    this.Base.uploadFile("chat", file, (audiofile) => {
      var api = new ClassApi();
      api.sendmsg({
        onlymember_id: that.Base.options.onlymember_id,
        "type": "A", audio: audiofile, audioduration: duration
        , user_id: AppBase.UserInfo.isuser == "Y" ? AppBase.UserInfo.user.id : 0
      }, () => {
        that.loadchatlist();
      });
    });

  }
  sendPic() {
    var that = this;
    this.Base.uploadImage("chat", (ret) => {
      var api = new ClassApi();
      api.sendmsg({
        onlymember_id: that.Base.options.onlymember_id,
        "type": "P", pic: ret
        , user_id: AppBase.UserInfo.isuser == "Y" ? AppBase.UserInfo.user.id : 0
      }, () => {
        that.loadchatlist();
      });
    });
  }

  sendVideo() {
    var that = this;
    this.Base.uploadVideo("chat", (ret) => {
      var api = new ClassApi();
      api.sendmsg({
        onlymember_id: that.Base.options.onlymember_id,
        "type": "V", video: ret
        , user_id: AppBase.UserInfo.isuser == "Y" ? AppBase.UserInfo.user.id : 0
      }, () => {
        that.loadchatlist();
      });
    });
  }

  loadchatlist() {
    var api = new ClassApi();
    api.chatlist({
      onlymember_id: this.Base.options.onlymember_id, orderby: "send_time"
    }, (chatlist) => {
      var chatlistcount = this.Base.getMyData().chatlist.length;

      var indid = this.Base.getMyData().indid;
      if (chatlist.length == 0) {
        return;
      }
      if (chatlistcount == chatlist.length) {
        return;
      }
      if (firstloaded == false || indid != chatlist[chatlist.length - 1].id) {
        firstloaded = true;
        this.Base.setMyData({ chatlist, indid: chatlist[chatlist.length - 1].id });
      } else {
        this.Base.setMyData({ chatlist });
      }

    }, false);
  }
  startvoice(e) {
    var that = this;
    clearInterval(voiceinterval);
    console.log("start voice");
    var start = 0;
    this.Base.setMyData({ invoice: "B" });
    voiceinterval = setInterval(() => {
      this.Base.setMyData({ voiceduration: ++start, });
    }, 1000);
    touchy = e.touches[0].pageY;
    recordmgr.start({ sampleRate: 8000 });
  }
  endvoice() {
    clearInterval(voiceinterval);
    console.log("end voice");
    var invoice = this.Base.getMyData().invoice;
    //this.Base.info("voiceend");
    if (invoice == "B") {
      recordmgr.stop();
    }
    this.Base.setMyData({ invoice: "A" });
  }
  cancelvoice(e) {
    console.log(e);
    console.log(Math.abs(touchy - e.touches[0].pageY));
    if (Math.abs(touchy - e.touches[0].pageY) > 15) {
      this.Base.setMyData({ invoice: "C" });
    } else {
      this.Base.setMyData({ invoice: "B" });
    }
  }
  playaudio(e) {
    var that = this;
    console.log(e);

    var id = e.currentTarget.id;
    var audioCtx = wx.createAudioContext('a_' + id);
    audioCtx.play();



  }
  changeSendtype(e) {
    var id = e.currentTarget.id;
    this.Base.setMyData({ sendtype: id });
  }
  showmore() {
    var showmore = this.Base.getMyData().showmore;

    this.Base.setMyData({ showmore: !showmore });
  }
  playvideo(e) {
    console.log(e.currentTarget.id);
    var url = e.currentTarget.dataset.src;
    var id = e.currentTarget.id;
    var videoContext = wx.createVideoContext(id);
    videoContext.pause();
    wx.navigateTo({
      url: '/pages/videoplay/videoplay?module=chat&file=' + url,
    })
    return;
  }
  onUnload() {
    clearInterval(this.Base.worker);
  }
  sendNotice() {
    wx.navigateTo({
      url: '/pages/noticeselect/noticeselect?onlymember_id=' + this.Base.options.onlymember_id,
    })
  }
  sendNews() {
    wx.navigateTo({
      url: '/pages/newsselect/newsselect?onlymember_id=' + this.Base.options.onlymember_id,
    })
  }
  talktoStudent(e) {
    console.log(this.Base.options.onlymember_id);
    if (parseInt(this.Base.options.onlymember_id) > 0) {
      console.log("a");
      return;
    }

    var member_id = e.currentTarget.id;
    if (AppBase.UserInfo.isuser != 'Y') {
      console.log("b");
      return;
    }
    wx.navigateTo({
      url: '/pages/chatroom/chatroom?onlymember_id=' + member_id,
    })
  }
  talktoTeacher() {
    if (parseInt(this.Base.options.onlymember_id) > 0) {
      return;
    }
    if (AppBase.UserInfo.isuser == 'Y') {
      return;
    }
    wx.navigateTo({
      url: '/pages/chatroom/chatroom?onlymember_id=' + AppBase.UserInfo.id,
    })
  }

  setPageTitle() {
    if(AppBase.UserInfo.isuser=='Y'){

      var api = new MemberApi();
      api.info({ member_id: this.options.onlymember_id },(p)=>{
        wx.setNavigationBarTitle({
          title: p.name
        })
      });
    }else{
      var api = new ClassApi();
      api.info({  }, (p) => {
        wx.setNavigationBarTitle({
          title: p.teacher_id_name
        })
      });
    }
  }
  boxrequire(e) {
    var that = this;
    console.log(e);
    var chatlist = this.Base.getMyData().chatlist;
    var item = null;
    for (var i = chatlist.length - 1; i >= 0; i--) {
      if (chatlist[i].id == e.currentTarget.id && chatlist[i].member_id == AppBase.UserInfo.id) {
        item = chatlist[i];
        break;
      }
    }
    if (item == null) {
      return;
    }
    console.log(parseInt(item.send_time_timespan * 1000) + 1000 * 120);
    console.log((new Date().getTime()));
    if ((parseInt(item.send_time_timespan * 1000) + 120000) > (new Date().getTime())) {
      wx.showActionSheet({
        itemList: ["撤回", "取消"],
        success(e) {
          var api = new ClassApi();
          api.cutchat({ id: item.id }, (ret) => {
            that.loadchatlist();
          });
        }
      })
    } else {
      wx.showToast({
        title: '只允许撤销2分钟内的信息',
        icon: "none"
      })
    }
  }
}
var firstloaded = false;
var touchy = 0;
var voiceinterval = null;
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
body.changeSendtype = content.changeSendtype;
body.cancelvoice = content.cancelvoice;
body.showmore = content.showmore;
body.sendPic = content.sendPic;
body.sendVideo = content.sendVideo;
body.playvideo = content.playvideo;
body.sendNotice = content.sendNotice;
body.sendNews = content.sendNews;
body.talktoStudent = content.talktoStudent;
body.talktoTeacher = content.talktoTeacher;
body.boxrequire = content.boxrequire;
Page(body)