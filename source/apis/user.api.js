/****使用方法，下面两句复制到page的js文件的头部
		
import { ApiConfig } from '../../apis/apiconfig';
import { InstApi } from '../../apis/inst.api';

var instApi=new InstApi();
        *******/
import {
  ApiConfig
} from 'apiconfig';
export class UserApi {
  //获取机构的基础信息
  bind(json, callback, showLoading = true) {

    if (showLoading)
      ApiConfig.ShowLoading();

    var header = ApiConfig.GetHeader();
    console.log(header);
    wx.request({
      url: ApiConfig.GetApiUrl() + 'user/bind',
      data: json,
      method: 'POST',
      dataType: 'json',
      header: header,
      success: function(res) {
        if (callback != null) {
          callback(res.data);
        }
      },
      fail: function(res) {
        console.log(res);
        callback(false);
      },
      complete: function(res) {
        console.log(res);

        if (showLoading)
          ApiConfig.CloseLoading();
      }
    })
  }

  //获取机构的基础信息
  photoupdate(json, callback, showLoading = true) {

    if (showLoading)
      ApiConfig.ShowLoading();

    var header = ApiConfig.GetHeader();
    console.log(header);
    wx.request({
      url: ApiConfig.GetApiUrl() + 'user/photoupdate',
      data: json,
      method: 'POST',
      dataType: 'json',
      header: header,
      success: function(res) {
        if (callback != null) {
          callback(res.data);
        }
      },
      fail: function(res) {
        console.log(res);
        callback(false);
      },
      complete: function(res) {
        console.log(res);

        if (showLoading)
          ApiConfig.CloseLoading();
      }
    })
  }


}