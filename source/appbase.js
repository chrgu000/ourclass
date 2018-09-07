/****
import { MemberApi } from "../apis/member.api";
import { WechatApi } from "../apis/wechat.api";
 */
import {
  ApiConfig
} from "apis/apiconfig.js";
import {
  ApiUtil
} from "apis/apiutil.js";
import {
  InstApi
} from "apis/inst.api.js";
import {
  ClassApi
} from "apis/class.api.js";
import {
  MemberApi
} from "apis/member.api";
import {
  WechatApi
} from "apis/wechat.api";

export class AppBase {

  static UserInfo = {};
  static openid = "";
  static session_key = "";
  unicode = "ourclass";
  needauth = true;
  inauthpage = false;
  app = null;
  options = null;
  data = {
    uploadpath: ApiConfig.GetUploadPath(),
    copyright: {
      name: "",
      website: "mecloud.com"
    }
  };

  Page = null;
  util = ApiUtil;
  constructor() {
    this.app = getApp();
    this.me = this;
    //ApiConfig.SetToken("10e991a4ca7a93c60794628c11edaea3");
  }
  setPageTitle() {
    var api=new ClassApi();
    api.info({},(classinfo)=>{
      wx.setNavigationBarTitle({
        title: classinfo.name
      })
    },false);
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
      getPhoneNo: base.getPhoneNo,
      checkPermission: base.checkPermission
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
      this.Base.log("class_id", class_id);
      options.class_id = class_id;
    } else {
      wx.setStorageSync("class_id", options.class_id);
    }
    ApiConfig.SetClassId(options.class_id);

    ApiConfig.SetUnicode(this.Base.unicode);

    wx.hideShareMenu();
  }
  gotoOpenUserInfoSetting() {
    var that = this;
    wx.showModal({
      title: '需要您授权才能正常使用小程序',
      content: '请点击“去设置”并启用“用户信息”，然后确定即可正常使用',
      confirmText: "去设置",
      success: function(res) {
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
  }
  minimm
  onShow() {
    var that = this;
    var instapi = new InstApi();

    instapi.info({}, (instinfo) => {
      if (instinfo == null || instinfo == false) {
        return;
      }
      this.Base.setMyData({
        instinfo: instinfo
      });
      console.log("aaa");
      this.Base.setPageTitle();

    }, false);
    instapi.resources({}, (res) => {
      this.Base.setMyData({
        res
      });
    }, false);

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
              memberapi.getuserinfo({
                code: res.code,
                grant_type: "authorization_code"
              }, data => {
                console.log("here");
                console.log(data);
                console.log(AppBase.UserInfo);
                ApiConfig.SetToken(data.openid);
                AppBase.UserInfo.openid = data.openid;
                AppBase.UserInfo.session_key = data.session_key;
                that.Base.log("goto update info", data);
                memberapi.update(AppBase.UserInfo, (ret) => {

                  that.Base.log("member update", ret);

                  memberapi.info({}, data => {
                    AppBase.UserInfo = data;
                    that.Base.setMyData({
                      UserInfo: AppBase.UserInfo
                    });
                    that.Base.log("check permission", AppBase.UserInfo);
                    that.checkPermission();

                    that.onMyShow();
                  }, false);

                }, false);



                //that.Base.getAddress();
              }, false);
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
      var memberapi = new MemberApi();
      memberapi.info({}, data => {
        AppBase.UserInfo = data;
        that.Base.setMyData({
          UserInfo: AppBase.UserInfo
        });
        that.checkPermission();
        that.onMyShow();
      }, false);
      //that.Base.getAddress();
    }

  }

  onMyShow() {
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
  checkPermission() {
    var userinfo = AppBase.UserInfo;
    this.Base.log("check permission", userinfo);
    if (userinfo.isuser == "N") {
      this.Base.log("check permission", userinfo);
      if (userinfo.inclassstatus == "N") {
        wx.reLaunch({
          url: '/pages/classrequest/classrequest',
        })
      }
    }
    if(userinfo.isuser=="Y"){
      if(userinfo.isteacher1=='Y'
        || userinfo.isteacher2 == 'Y'
        || userinfo.isteacher3 == 'Y'
        || userinfo.positionname == '园长'
        || userinfo.positionname == '家委会主席'
        || userinfo.positionname == '管理员'){

        }else{
          wx.reLaunch({
            url: '/pages/classrequest/classrequest',
          })
          return;
        }
    }
    var needshowreddot=false;
    if(userinfo.isuser=="N"){

      if (userinfo.onlychatunread != 'N') {
        needshowreddot = true;
      }
    }
    if (userinfo.tipsmemberinfo == "Y") {
      needshowreddot=true;
    }
    if (userinfo.isteacher1 == "Y") {
      if (userinfo.noschedule != 'N'  ) {
        if (userinfo.classmember.length > userinfo.assesscount) {

          needshowreddot = true;
        }
      } 
      if (userinfo.onlychatunread != 'N') {
        needshowreddot = true;
      }
      if (userinfo.newswaitapprove != 'N' ) {
          needshowreddot = true;
      }
    }

    if (needshowreddot==true){
      wx.showTabBarRedDot({
        index: 2,
      })
    }else{
      wx.hideTabBarRedDot({
        index: 2,
      })
    }
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
    current = ApiConfig.GetUploadPath() + modul + "/" + current;
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
    var that = this;
    if (AppBase.QQMAP == null) {
      var QQMapWX = require('libs/qqmap/qqmap-wx-jssdk.js');
      AppBase.QQMAP = new QQMapWX({
        key: 'IDVBZ-TSAKD-TXG43-H442I-74KVK-6LFF5'
      });
    }
    if (lat == undefined && lng == undefined) {
      wx.getLocation({
        success: function(res) {
          lat = res.latitude;
          lng = res.longitude;
          AppBase.QQMAP.reverseGeocoder({
            location: {
              latitude: lat,
              longitude: lng
            },
            success: function(res) {
              that.setMyData({
                address: res.result.address
              });
            },
            fail: function(res) {
              console.log("fail");
              console.log(res);
            },
            complete: function(res) {
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
        success: function(res) {
          console.log("success");
          console.log(res);
        },
        fail: function(res) {
          console.log("fail");
          console.log(res);
        },
        complete: function(res) {
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
      success: function(res) {
        if (res.status == 0) {
          var lat = res.result.location.lat;
          var lng = res.result.location.lng;

          wx.openLocation({
            type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
            address: address,
            latitude: lat,
            longitude: lng,
            success: function(res) {

            }
          })
        }
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
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
      success: function(res) {
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
  uploadImage(modul, callback, count = 1, completecallback = undefined) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: count,
      success: function(res) {
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
            success: function(res) {
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
              if (i == tempFilePaths.length) {
                if (completecallback != undefined) {
                  completecallback();
                }
              }
              //do something
            }
          });
        }
      }
    })
  }

  uploadVideo(modul, callback, completecallback) {

    wx.chooseVideo({
      compressed: true, // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 60,
      success: function(vidres) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        console.log(vidres);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = [];
        tempFilePaths.push(vidres.tempFilePath);
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
            success: function(res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo, vidres.duration);
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
      },
      fail(e) {
        console.log("upload fail");
        console.log(e);
      }
    })
  }

  takeImage(modul, callback) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
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
            success: function(res) {
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
      success: function(res) {
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
            success: function(res) {
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
  log(tag, data) {
    var data = {
      tag: tag,
      data: data
    };
    console.log(data);
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
  toast(msg) {
    wx.showToast({
      title: msg,
      duration: msg.length / 3 * 1000
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
    }, false);
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
  openContent(e) {
    var title = e.target.dataset.title;
    var keycode = e.target.dataset.keycode;
    wx.navigateTo({
      url: '/pages/content/content?keycode=' + keycode + "&title=" + title,
    })
  }
  console(key, val) {
    var json = {
      key,
      val
    };
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
    }, false);
  }

  download(url, callback, open = false) {
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      success: function(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function(res) {
              var savedFilePath = res.savedFilePath;
              if (open == true) {
                wx.openDocument({
                  filePath: savedFilePath,
                });
              }
              console.log(savedFilePath);
              if (callback != null) {
                callback(savedFilePath);
              }
            }
          })
        }
      }
    })
  }
}