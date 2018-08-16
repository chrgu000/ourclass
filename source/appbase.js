/****
import { MemberApi } from "../apis/member.api";
import { WechatApi } from "../apis/wechat.api";
 */
import { ApiConfig } from "apis/apiconfig.js";
import { ApiUtil } from "apis/apiutil.js";
import { InstApi } from "apis/inst.api.js";
import { MemberApi } from "apis/member.api";
import { WechatApi } from "apis/wechat.api";

export class AppBase {

  static UserInfo = {};
  static openid="";
  static session_key="";
  unicode = "ourclass";
  needauth = true;
  inauthpage=false;
  app = null;
  options = null;
  data = {
    uploadpath: ApiConfig.GetUploadPath(),
    copyright: { name: "", website: "mecloud.com" }
  };
  Page = null;
  util = ApiUtil;
  constructor() {
    this.app = getApp();
    this.me = this;
    //ApiConfig.SetToken("10e991a4ca7a93c60794628c11edaea3");
  }
  setPageTitle(){
    var instinfo=this.getMyData().instinfo;
    console.log(instinfo);
    wx.setNavigationBarTitle({
      title:instinfo.name
    })
  }
  generateBodyJson() {
    var base = this;
    return {
      Base: base,
      /**
       * 页面的初始数据
       */
      data: base.data,
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: base.onLoad,

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: base.onReady,

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: base.onShow,

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: base.onHide,

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: base.onUnload,

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: base.onPullDownRefresh,

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: base.onReachBottom,

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: base.onShareAppMessage,
      onMyShow: base.onMyShow, 

      viewPhoto: base.viewPhoto,
      phoneCall: base.phoneCall,
      openMap: base.openMap,
      backPage: base.backPage,
      backHome: base.backHome,
      logout: base.logout,
      switchTab: base.switchTab,
      closePage: base.closePage,
      gotoPage: base.gotoPage, 
      navtoPage: base.navtoPage,
      openContent: base.openContent,
      phonenoCallback: base.phonenoCallback,
      getPhoneNo: base.getPhoneNo
    }
  }
  log() {
    console.log("yeah!");
  }
  onLoad(options) {
    this.Base.options = options;
    console.log(options);
    console.log("onload");
    this.Base.setBasicInfo();


    if (options.class_id == undefined) {
      var class_id = wx.getStorageSync("class_id");
      console.log("class_id");
      console.log(class_id);
      options.class_id=class_id;
    }else{
      wx.setStorageSync("class_id", options.class_id);
    }
    ApiConfig.SetClassId(options.class_id);

    ApiConfig.SetUnicode(this.Base.unicode);
  }
  gotoOpenUserInfoSetting() {
    var that = this;
    wx.showModal({
      title: '需要您授权才能正常使用小程序',
      content: '请点击“去设置”并启用“用户信息”，然后确定即可正常使用',
      confirmText: "去设置",
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({

          })
        } else {
          that.gotoOpenUserInfoSetting();
        }
      }
    })
  }
  setBasicInfo() {
    var that = this;
  }
  onReady() {
    console.log("onReady");
  }minimm
  onShow() {
    var that = this;
    var instapi=new InstApi();

    instapi.info({},(instinfo)=>{
      if(instinfo==null||instinfo==false){
        
        return;
      }
      this.Base.setMyData({ instinfo: instinfo });
      console.log("aaa");
      this.Base.setPageTitle();
      
    },false);
    instapi.resources({},(res)=>{
      this.Base.setMyData({ res });
    });

    if (AppBase.UserInfo.openid == undefined) {
      // 登录
      console.log("onShow");
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res);
          wx.getUserInfo({
            success: userres => {
              AppBase.UserInfo = userres.userInfo;
              console.log(userres);

              var memberapi = new MemberApi();
              memberapi.getuserinfo({ code: res.code, grant_type: "authorization_code" }, data => {
                console.log("here");
                console.log(data);
                AppBase.UserInfo.openid = data.openid;
                AppBase.UserInfo.session_key = data.session_key;
                console.log(AppBase.UserInfo);
                ApiConfig.SetToken(data.openid);
                console.log("goto update info");
                memberapi.update(AppBase.UserInfo, (ret) => {
                  console.log("member update");
                  console.log(ret);
                });


                console.log(AppBase.UserInfo);
                that.Base.setMyData({ UserInfo: AppBase.UserInfo });
                that.onMyShow();
                //that.Base.getAddress();
              });
            },
            fail: res => {
              console.log(res);
              //that.Base.gotoOpenUserInfoSetting();
              if (this.Base.needauth == true) {
                wx.redirectTo({
                  url: '/pages/auth/auth',
                });
              } else {
                that.onMyShow();
              }
              //that.Base.getAddress();
            }
          });

        }
      })
      return false;
    } else {
      if (that.setMyData != undefined) {
        that.setMyData({ UserInfo: AppBase.UserInfo });
      } else {
        that.Base.setMyData({ UserInfo: AppBase.UserInfo });
      }
      that.onMyShow();
      //that.Base.getAddress();
    }

  }

  onMyShow(){
    console.log("onMyShow");
  }
  onHide() {
    console.log("onHide");
  }
  onUnload() {
    console.log("onUnload");
  }
  onPullDownRefresh() {
    console.log("onPullDownRefresh");
    this.onShow();
    wx.stopPullDownRefresh();
  }
  onReachBottom() {
    console.log("onReachBottom");
  }
  onShareAppMessage() {
   
  }
  setMyData(obj) {
    console.log(obj);
    this.Page.setData(obj);
  }
  getMyData() {
    return this.Page.data;
  }
  viewPhoto(e) {
    var img = e.currentTarget.id;
    console.log(img);
    wx.previewImage({
      urls: [img],
    })
  }
  viewGallary(modul, photos, current = "") {
    var nphotos = [];
    for (var i = 0; i < photos.length; i++) {
      nphotos.push(ApiConfig.GetUploadPath() + modul + "/" + photos[i]);
    }
    console.log(nphotos);
    wx.previewImage({
      urls: nphotos,
      current: current
    })
  }
  phoneCall(e) {
    var tel = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
  getAddress(lat, lng) {
    var that=this;
    if (AppBase.QQMAP == null) {
      var QQMapWX = require('libs/qqmap/qqmap-wx-jssdk.js');
      AppBase.QQMAP = new QQMapWX({
        key: 'IDVBZ-TSAKD-TXG43-H442I-74KVK-6LFF5'
      });
    }
    if (lat == undefined && lng == undefined) {
      wx.getLocation({
        success: function (res) {
          lat = res.latitude;
          lng = res.longitude;
          AppBase.QQMAP.reverseGeocoder({
            location: {
              latitude: lat,
              longitude: lng
            },
            success: function (res) {
              that.setMyData({address:res.result.address});
            },
            fail: function (res) {
              console.log("fail");
              console.log(res);
            },
            complete: function (res) {
              console.log("complete");
              console.log(res);
            }
          });
        }
      });
    } else {
      AppBase.QQMAP.reverseGeocoder({
        location: {
          latitude: lat,
          longitude: lng
        },
        success: function (res) {
          console.log("success");
          console.log(res);
        },
        fail: function (res) {
          console.log("fail");
          console.log(res);
        },
        complete: function (res) {
          console.log("complete");
          console.log(res);
        }
      });
    }
  }
  openMap(e) {
    if (AppBase.QQMAP == null) {
      var QQMapWX = require('libs/qqmap/qqmap-wx-jssdk.js');
      AppBase.QQMAP = new QQMapWX({
        key: 'IDVBZ-TSAKD-TXG43-H442I-74KVK-6LFF5'
      });
    }
    var address = e.currentTarget.id;
    AppBase.QQMAP.geocoder({
      address: address,
      success: function (res) {
        if (res.status == 0) {
          var lat = res.result.location.lat;
          var lng = res.result.location.lng;

          wx.openLocation({
            type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
            address: address,
            latitude: lat,
            longitude: lng,
            success: function (res) {

            }
          })
        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  }
  uploadFile(modul, filename, callback) {

    var tempFilePaths = filename
    wx.uploadFile({
      url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
      filePath: tempFilePaths,
      name: 'file',
      formData: {
        'module': modul,
        "field": "file"
      },
      success: function (res) {
        console.log(res);
        var data = res.data
        if (data.substr(0, 7) == "success") {
          data = data.split("|");
          var photo = data[2];
          callback(photo);
        } else {
          wx.showToast({
            title: '上传失败，请重试',
            icon: 'warn',
            duration: 2000
          })
        }
        //do something
      }
    });
  }
  uploadImage(modul, callback, count = 1, completecallback=undefined) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count:count,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            success: function (res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
        if (completecallback != undefined) {
          completecallback();
        }
      }
    })
  }

  uploadVideo(modul, callback,completecallback) {
    wx.chooseVideo({
      compressed: true, // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 60,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = [];
        tempFilePaths.push(res.tempFilePath);
        //res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            success: function (res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
        if(completecallback!=undefined){
          completecallback();
        }
      }
    })
  }
  
  takeImage(modul, callback) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            success: function (res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
      }
    })
  }
  takeVideo(modul, callback) {
    wx.chooseVideo({
      compressed: false,
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 60,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = [res.tempFilePath];
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            success: function (res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
      }
    })
  }
  info(message) {
    wx.showModal({
      title: '提示',
      content: message,
      showCancel: false
    })
  }
  warning(message) {
    wx.showModal({
      title: '警告',
      content: message,
      showCancel: false
    })
  }
  error(message) {
    wx.showModal({
      title: '错误',
      content: message,
      showCancel: false
    })
  } 
  toast(msg){
    wx.showToast({
      title: msg,
      duration:msg.length/3*1000
    })
  }
  getPhoneNo(e) {
    var that = this;
    console.log(e);
    var api = new WechatApi();
    var data = this.Base.getMyData();
    console.log(data);
    
    e.detail.session_key = AppBase.session_key;
    e.detail.openid = AppBase.openid;
    console.log(e.detail);
    api.decrypteddata(e.detail, (ret) => {
      console.log(ret);
      that.phonenoCallback(ret.return.phoneNumber, e);
    });
  }
  phonenoCallback(phoneno, e) {
    console.log("phone no callback");
    console.log(phoneno);
    console.log(e);
  }

  backPage() {
    wx.navigateBack({

    });
  }
  backHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  }
  logout() {
    wx.redirectTo({
      url: '/pages/signin/signin',
    })
  }
  gotoPage(e) {
    console.log(e);
    var dataset = e.currentTarget.dataset;
    var page = dataset.page;
    var parameter = dataset.param;
    if (parameter != "") {
      parameter = "?" + parameter;
    }
    var url = "../" + page + "/" + page + parameter;
    console.log(url);
    wx.redirectTo({
      url: url,
    })
  }
  navtoPage(e) {
    console.log(e);
    var dataset = e.currentTarget.dataset;
    var page = dataset.page;
    var parameter = dataset.param;
    if (parameter != "") {
      parameter = "?" + parameter;
    }
    var url = "../" + page + "/" + page + parameter;
    console.log(url);
    wx.navigateTo({
      url: url,
    })
  }
  switchTab(e) {
    console.log(e);
    var page = e.currentTarget.id;
    var url = "../" + page + "/" + page;
    console.log(url);
    wx.redirectTo({
      url: url,
    })
  }
  closePage() {

  }
  openContent(e){
    var title=e.target.dataset.title;
    var keycode = e.target.dataset.keycode;
    wx.navigateTo({
      url: '/pages/content/content?keycode='+keycode+"&title="+title,
    })
  }
  console(key,val){
    var json={key,val};
    console.log(json);
  }

  checkRealname(callback) {
    var memberapi = new MemberApi();
    memberapi.checkrealname({}, (ret) => {
      if (ret == false) {
        wx.navigateTo({
          url: '/pages/signup/signup',
        })
      } else {
        callback();
      }
    });
  }
} 