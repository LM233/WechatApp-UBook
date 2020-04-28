// pages/sign/sign.js
const DB = wx.cloud.database().collection("user_info");
// function base64_encode(str) { // 编码，配合encodeURIComponent使用
//   var c1, c2, c3;
//   var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
//   var i = 0, len = str.length, strin = '';
//   while (i < len) {
//     c1 = str.charCodeAt(i++) & 0xff;
//     if (i == len) {
//       strin += base64EncodeChars.charAt(c1 >> 2);
//       strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
//       strin += "==";
//       break;
//     }
//     c2 = str.charCodeAt(i++);
//     if (i == len) {
//       strin += base64EncodeChars.charAt(c1 >> 2);
//       strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
//       strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
//       strin += "=";
//       break;
//     }
//     c3 = str.charCodeAt(i++);
//     strin += base64EncodeChars.charAt(c1 >> 2);
//     strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
//     strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
//     strin += base64EncodeChars.charAt(c3 & 0x3F)
//   }
//   return strin
// }
Page({
  data: {
    number: "",
    code: ""
  },
  onregister:function() {
    wx.navigateTo({
      url: '/pages/sign/register/register',
    })
  },
  number: function (event) {
    this.setData({ number: event.detail.detail.value }, () => console.log(this.data.number));
  },
  code: function (event) {
    this.setData({ code: event.detail.detail.value }, () => console.log(this.data.code));
  },
  onPage: function () {
    let _account=this.data.number;
    let _code=this.data.code;
    let that = this;
    DB.where({ number: that.data.number }).get({
      success: function (res) {
        console.log(res);
        if (res.data.length == 0) {
          wx.showToast({
            title: '学号不存在',
            icon: 'none'
          })
        }
        else if (res.data[0].code == that.data.code) {
          getApp().globalData.number = that.data.number;
          DB.where({ number: that.data.number }).get({
            success: function (res) {
              getApp().globalData.userData = res.data[0];
            }
          });
          wx.redirectTo({
            url: "../primary/primary",
            success: () => {
              getApp().globalData.number = that.data.number;
              DB.where({ number: that.data.number }).get({
                success: function (res) {
                  getApp().globalData.userData = res.data[0];
                }
              });
            },
          })
        } else {
          wx.showToast({
            title: '密码错误',
            icon: 'none'
          })
        }
      }
    })
//WXREQUEST
  // wx.request({
  //   url: 'http://101.200.243.33/v1/token',
  //   data:{"account":_account,"secret":_code,"type":200},
  //   method: 'post',
  //   success:function(res){
  //     console.log(res)
  //     if(res.data.token){
  //       wx.redirectTo({
  //         url: "../primary/primary",
  //         success: () => {
  //           getApp().globalData.userToken = res.data.token;
  //         },
  //       })
  //     }else{
  //       wx.showToast({
  //         title: "登录失败",
  //         icon: 'none',
  //         duration: 2000,
  //       })
  //     }
  //     },
  //   fail:function(res){console.log(res)},
  // })
  }
})