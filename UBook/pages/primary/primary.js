// pages/primary/primary.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: "homepage"
  },

  handleChange:function({ detail }) {
    this.setData({
      current: detail.key
    });
    // switch (this.current) {
    //   case "homepage": wx.switchTab({
    //     url: '/pages/primary/homepage/homepage',
    //   }); break;
    //   case "publish": wx.switchTab({
    //     url: '/pages/primary/publish/publish',
    //   }); break;
    //   case "remind": wx.switchTab({
    //     url: '/pages/primary/remind/remind',
    //   }); break;
    //   case "mine": wx.switchTab({
    //     url: '/pages/primary/mine/mine',
    //   }); break;
    //   default: break;
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.userData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
    // wx.switchTab({
    //   url: '/pages/primary/homepage/homepage',
    // });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})