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

    //options.comment_id=16;
    super.onLoad(options);
    this.Base.setMyData({ options });
  }
  onMyShow() {
    var that = this;
    var api=new ClassApi();
    api.commentinfo({id:this.Base.options.comment_id},
    (commentinfo)=>{
      this.Base.setMyData({commentinfo});
      })
    api.quickreply({  },
      (quickreply) => {
        this.Base.setMyData({ quickreply });
      })
  }
  confirm(e) {
    var reply = e.detail.value.reply;
    if (reply.trim() == "") {
      this.Base.info("回复不能为空");
      return;
    }
    console.log(reply);
    var api = new ClassApi();
    api.reply({ comment_id: this.Base.options.comment_id, reply: reply }, (ret) => {

      this.backPage();
    });
  }
  copy(e){
    var reply=e.target.dataset.txt;
    this.Base.setMyData({reply:reply});
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.confirm = content.confirm;
body.copy = content.copy;
Page(body)