// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { ClassApi } from '../../apis/class.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      inputShowed: true,
      inputVal: "",
      currenttab:0
    });
  }
  onMyShow() {
    var that = this;
    var instapi = new ClassApi();
      instapi.searchkeyword({},(ret)=>{
        that.Base.setMyData({ history: ret.history, hotest: ret.hotest});
      });
    this.Base.setMyData({ onfocus:true});
  }

  showInput() {
    this.Base.setMyData({
      inputShowed: true
    });
  }
  hideInput() {
    this.Base.setMyData({
      inputVal: "",
      inputShowed: false, searchresult: []
    });
  }
  clearInput() {
    this.Base.setMyData({
      inputVal: "", searchresult:[]
    });
    
  }
  inputTyping(e) {
    this.Base.setMyData({
      inputVal: e.detail.value
    });
  }
  search(){
    var inputVal = this.Base.getMyData().inputVal;
    var api = new ClassApi();
    api.search({keyword:inputVal},(searchresult)=>{
      var a = searchresult[0];
      var b = searchresult[1];
      var c = searchresult[2];
      var vnew=[];
      for(var i=0;i<a.length;i++){
        a[i].pagename="news";
        vnew.push(a[i]);
      }
      for (var i = 0; i < b.length; i++) {
        b[i].pagename = "notice";
        vnew.push(b[i]);
      }
      for (var i = 0; i < c.length; i++) {
        c[i].pagename = "news";
        vnew.push(c[i]);
      }

      vnew.sort(function(a,b){
        return a.published_date_timespan > b.published_date_timespan?1:-1;
      });


      this.Base.setMyData({ searchresult:vnew});
    });
  }
  searchKeyword(e){
    var val=e.currentTarget.id;
    this.Base.setMyData({
      inputVal: val, inputShowed: true
    });
    this.search();
  }
  clearrecord(){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否确定清空我的搜索记录？',
      success(e){
        if(e.confirm){
          that.Base.setMyData({ history: [] });

          var instapi = new ClassApi();
          instapi.clearkeyword({}, (ret) => {

          });
        }
      }
    })
  }
  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.detail.current });
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.currentTarget.id });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.showInput = content.showInput;
body.hideInput = content.hideInput;
body.clearInput = content.clearInput; 
body.inputTyping = content.inputTyping; 
body.search = content.search; 
body.searchKeyword = content.searchKeyword; 
body.clearrecord = content.clearrecord;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
Page(body)