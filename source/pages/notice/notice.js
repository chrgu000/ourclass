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
  PostApi
} from "../../apis/post.api.js";
var WxParse = require('../../wxParse/wxParse');

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id = 1;
    options.id = parseInt(options.id);
    this.Base.Page = this;
    this.Base.pagetitle = "";
    super.onLoad(options);
    this.Base.setMyData({
      comments: [],
      commenttext: "",
    });

    this.Base.setMyData({
      currenttab: 0,
      reply: null,
      likelist: []
    });
  }
  onMyShow() {


    var that = this;
    var instapi = new ClassApi();
    instapi.notice({
      id: this.Base.options.id
    }, (notice) => {
      var uploadpath = that.Base.getMyData().uploadpath;

      that.Base.setMyData(notice);
      that.Base.pagetitle = notice.name;
      

      wx.setNavigationBarTitle({
        title: notice.name
      });
      notice.content = this.Base.util.HtmlDecode(notice.content);
      WxParse.wxParse('content', 'html', notice.content, that, 10);
    });


    this.loadcomment();
    this.loadlikelist();
  }
  loadcomment() {
    var api = new PostApi();
    api.commentlist({
      notice_id: this.Base.options.id,
      orderby: "r_main.comment_time"
    }, (commentlist) => {
      if (this.Base.options.comment_id != undefined) {
        this.Base.setMyData({
          comments: commentlist,
          into_comment_id: "comment_" + this.Base.options.comment_id
        });
        this.Base.options.comment_id = undefined;
      } else {

        this.Base.setMyData({
          comments: commentlist
        });
      }
    });
  }
  
  showincomment() {
    this.Base.setMyData({
      incomment: true
    });
  }
  commenttextchange(e) {
    this.Base.setMyData({
      commenttext: e.detail.value
    });
  }
  hideincomment() {
    this.Base.setMyData({
      incomment: false
    });
  }
  comment() {
    var commenttext = this.Base.getMyData().commenttext;
    if (commenttext.trim() == "") {
      wx.showToast({
        title: '请输入评论内容',
        icon: "none"
      });
      return;
    }

    var api = new ProductApi();
    api.comment({
      notice_id: this.Base.options.id,
      comment: commenttext
    }, () => {
      this.loadcomment();
      this.Base.setMyData({
        incomment: false,
        commenttext: ""
      });
    });
  }
  loadcomment() {
    var api = new PostApi();
    api.commentlist({
      notice_id: this.Base.options.id
    }, (commentlist) => {
      if (this.Base.options.comment_id != undefined) {
        this.Base.setMyData({
          comments: commentlist,
          into_comment_id: "comment_" + this.Base.options.comment_id
        });
        this.Base.options.comment_id = undefined;
      } else {

        this.Base.setMyData({
          comments: commentlist
        });
      }
    });
  }
  


  likeComment(e) {
    console.log("like?");
    var that = this;
    var seq = e.currentTarget.id;
    var comments = this.Base.getMyData().comments;
    var comment = comments[seq];
    console.log(comment);
    var api = new PostApi();
    api.commentlike({
      comment_id: comment.id,
      notice_id: that.Base.getMyData().id,
    }, (ret) => {
      if (comments[seq].iliked == 'Y') {

        comments[seq].iliked = 'N';
        comments[seq].likecount = parseInt(comments[seq].likecount) - 1;
      } else {

        comments[seq].iliked = 'Y';
        comments[seq].likecount = parseInt(comments[seq].likecount) + 1;
      }
      that.Base.setMyData({
        comments
      });
    });
  }
  likeSubComment(e) {
    console.log("sublike?");
    var that = this;
    var seq = e.currentTarget.id.split("_");
    var seq_1 = seq[0];
    var seq_2 = seq[1];
    var comments = this.Base.getMyData().comments;
    var comment = comments[seq_1].subcomments[seq_2];
    console.log(comment);
    var api = new PostApi();
    api.commentlike({
      comment_id: comment.id,
      notice_id: comment.notice_id
    }, (ret) => {
      comments[seq_1].subcomments[seq_2].iliked = 'Y';
      comments[seq_1].subcomments[seq_2].likecount = parseInt(comments[seq_1].subcomments[seq_2].likecount) + 1;
      that.Base.setMyData({
        comments
      });
    });
  }
  reply(e) {
    var seq = e.currentTarget.id;
    var comments = this.Base.getMyData().comments;
    var comment = comments[seq];
    this.Base.setMyData({
      reply: comment
    });
  }
  subreply(e) {
    var seq = e.currentTarget.id.split("_");
    var seq_1 = seq[0];
    var seq_2 = seq[1];

    var comments = this.Base.getMyData().comments;
    var comment = comments[seq_1].subcomments[seq_2];
    comment.id = comments[seq_1].id;
    this.Base.setMyData({
      reply: comment
    });
  }
  clearReply() {
    this.Base.setMyData({
      reply: null
    });
  }
  loadlikelist() {
    var api = new PostApi();
    api.likelist({
      notice_id: this.Base.options.id
    }, (likelist) => {
      this.Base.setMyData({
        likelist
      });
    });
  }

  deletecomment(e) {
    var seq = e.currentTarget.id;
    var comments = [];
    var that = this;
    comments = this.Base.getMyData().comments;
    var comment = comments[seq];
    wx.showModal({
      title: '提示',
      content: '是否确定删除',
      success(res) {
        if (res.confirm) {

          var api = new PostApi();
          api.deletecomment({
            idlist: comment.id
          }, (ret) => {
            comments.splice(seq, 1);
            that.Base.setMyData({
              comments
            });
          });
        }
      }
    })
  }


  like() {
    var api = new PostApi();
    var that = this;
    api.like({
      notice_id: this.Base.options.id
    }, (ret) => {
      var like = this.Base.getMyData().like;
      var likecount = this.Base.getMyData().likecount;
      if (like == 'Y') {
        this.Base.setMyData({
          like: "N",
          likecount: likecount - 1
        });
      } else {
        this.Base.setMyData({
          like: "Y",
          likecount: parseInt(likecount) + 1
        });
      }
      that.loadlikelist();
    });

    //var data = this.Base.getMyData();
    //var like=this.Base.getMyData().like;
    //this.Base.setMyData({liked:true});
    //this.loadlikelist();
  }

  fav() {
    var fav = this.Base.getMyData().fav;
    var api = new PostApi();
    api.follow({
      "notice_id": this.Base.options.id
    }, (ret) => {

      if (fav == "Y") {
        this.Base.setMyData({
          fav: "N"
        });
        this.Base.toast("取消收藏成功");
      } else {

        this.Base.setMyData({
          fav: "Y"
        });
        this.Base.toast("收藏成功");
      }
    });
  }
}

var catc = null;
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.mydownload = content.mydownload;
body.showincomment = content.showincomment;
body.hideincomment = content.hideincomment;
body.comment = content.comment;
body.commenttextchange = content.commenttextchange;
body.loadcomment = content.loadcomment;
body.fav = content.fav;
body.sharetotimes = content.sharetotimes;
body.deletecomment = content.deletecomment;
body.likeComment = content.likeComment;
body.reply = content.reply;
body.clearReply = content.clearReply;
body.likeSubComment = content.likeSubComment;
body.subreply = content.subreply;
body.loadlikelist = content.loadlikelist;
body.like = content.like;

Page(body)