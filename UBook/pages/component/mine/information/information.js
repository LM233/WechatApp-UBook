// pages/component/mine/information/information.js
const DB = wx.cloud.database().collection("user_info");
Page({
  data: {
    userInfo:null,
    userData:null,
    mode:0,
    gender: [
      { id: 1, name: "男" },
      { id: 2, name: "女" }
    ],
    current: "男",
    department: [
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
      "请选择你的学院",
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
    number: '',
    name: '',
    code: '',
    reCode: '',
  },
  onLoad: function (options) {
    console.log(getApp().globalData.userInfo,getApp().globalData.userData);
    this.setData({
      userInfo: getApp().globalData.userInfo,
      userData: getApp().globalData.userData,
      number: getApp().globalData.userData.number,
      name: getApp().globalData.userData.name,
      code: getApp().globalData.userData.code,
      reCode: getApp().globalData.userData.code,
      current: getApp().globalData.userData.sex
    })
  },
 onClick:function(){
   this.setData({mode:1});
 },
  onBoxChange({ detail = {} }) {
    this.setData({
      current: detail.value
    });
  },

  bindPickerChange: function (event) {
    this.setData({
      index: event.detail.value
    })
  },

  name(e) { this.setData({ name: e.detail.detail.value }); },
  number(e) { this.setData({ number: e.detail.detail.value }) },
  code(e) { this.setData({ code: e.detail.detail.value }); },
  reCode(e) { this.setData({ reCode: e.detail.detail.value }); },
  changeData() {
    let _name = this.data.name;
    let _number = this.data.number;
    let _code = this.data.code;
    let _reCode = this.data.reCode;
    let _index = this.data.index;
    let _tempt = this.data.tempt;
    let _school = _tempt[_index];
    let _sex = this.data.current;
    console.log(_name, _number, _code, _reCode);
    if (_code != _reCode) {
      wx.showToast({
        title: '两次密码应该相等',
        icon: 'none',
        duration: 2000,
      })
    }
    else {
      let that = this;
      DB.where({number:_number}).remove({
        success:
        ()=>{DB.add({
            data: {
              number: _number,
              code: _code,
              name: _name,
              school: _school,
              sex: _sex,
            },
            success: function (res) {
              DB.where({number:_number}).get({
                success:(res)=>{
                  getApp().globalData.userData = res.data[0];
                  that.setData({userData:res.data[0]},
                    wx.showModal({
                      title: '提示',
                      content: '修改信息完成',
                      success(res) {
                        that.setData({ mode: 0 });
                      }
                    }))
                  }
              });
            }
          })}
      });
      
      //   wx.request({
      //     url: 'http://49.234.87.52:8080/BUPT_war/user?type=new',
      //     method: "get",
      //     data: {
      //       stuId:_number,
      //       userId:"default",
      //       psd:_code,
      //       grade:1,
      //       major:"default",
      //     },
      //     success(res){
      //       wx.showToast({
      //         title: '创建用户成功',
      //         icon: 'none',
      //         duration: 2000,
      //       });
      //       wx.navigateBack({
      //         delta: 1
      //       })
      //     },
      //     fail(res){
      //       console.log(res);
      //     }
      // })
    }
  }
})