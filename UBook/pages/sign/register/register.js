// pages/sign/register/register.js
const DB = wx.cloud.database().collection("user_info");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender:[
      {id: 1, name:"男"},
      {id: 2, name:"女"}
    ],
    current: 0,
    department:[
      { id: 0, name: "请选择你的学院" },
      { id: 1, name: "信息与通信工程学院" },
      { id: 2, name: "电子工程学院" },
      { id: 3, name: "计算机学院" },
      { id: 4, name: "自动化学院" },
      { id: 5, name: "数字媒体与设计学院" },
      { id: 6, name: "现代邮政学院" },
      { id: 7, name: "网络空间安全学院" },
      { id: 8, name: "光电信息学院" },
      { id: 9, name: "理学院" },
      { id: 10, name: "经济管理学院" },
      { id: 11, name: "公共管理学院" },
      { id: 12, name: "人文学院" },
      { id: 13, name: "国际学院" },
      { id: 14, name: "软件学院" }
    ],
    index: 0,
    tempt: [
      "信息与通信工程学院",
      "电子工程学院",
      "计算机学院",
      "自动化学院",
      "数字媒体与设计学院",
      "现代邮政学院",
      "网络空间安全学院",
      "光电信息学院",
      "理学院",
      "经济管理学院",
      "公共管理学院",
      "人文学院",
      "国际学院",
      "软件学院"
    ],
    number:'',
    name:'',
    code:'',
    reCode:'',
  },

  onBoxChange(res) {
    if(res.detail.value=="女"){
      this.setData({
        current:1,
      })
    }else{
      this.setData({
        current:0,
      })
    }
  },

  bindPickerChange:function(event) {
    this.setData({
      index: event.detail.value
    })
  },
  
  name(e) { this.setData({ name: e.detail.detail.value }); },
  number(e) { this.setData({ number: e.detail.detail.value })},
  code(e) { this.setData({ code: e.detail.detail.value }); },
  reCode(e) { this.setData({ reCode: e.detail.detail.value }); },
  onClick(){
    let _name=this.data.name;
    let _number=this.data.number;
    let _code = this.data.code;
    let _reCode = this.data.reCode;
    let _index=this.data.index;
    let _tempt=this.data.tempt;
    let _school=_tempt[_index];
    let _sex=this.data.current;
    console.log(_name,_number,_code,_reCode);
    if(_code!=_reCode){
      wx.showToast({
        title: '两次密码应该相等',
        icon: 'none',
        duration: 2000,
      })
    }
    else{
      let that = this;
      DB.add({
        data: {
          number:_number,
          code:_code,
          name:_name,
          school:_school,
          sex:_sex,
          product:0,
        },
        success: function (res) {
          console.log("cloud_database...")
        }
      });
      console.log(_sex,_index);
    // wx.request({
    //   url: 'http://101.200.243.33/v1/client/register',
    //   method: 'post',
    //   data:{
    //     "account": _number, "campus": _index+1, "nickname": _name, "secret": _code,
    //     "secret2": _code, "gender": _sex+1,"openid":"0000000000", "type": 200
    //   },
    //   success:function(res){
    //     console.log(res);
    //     if(res.data.error_code==0){
    //       wx.showModal({
    //         title: '提示',
    //         content: '账户创建完成',
    //         success(res) {
    //           if (res.confirm) wx.navigateTo({ url: '/pages/sign/sign', });
    //         }
    //       })
    //     }else{
    //       wx.showToast({
    //         title: "创建用户失败",
    //         icon: 'none',
    //         duration: 2000,
    //       })
    //     }
    //   },
    //   fail:function(res){
    //     console.log(res);
    //   }
    // })
  }
  }
})