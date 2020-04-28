// pages/component/homepage/class/class.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    category: [
      {
        name: "图书",
        class: [
          {
            type: "二手书",
            image: "photo-o"
          },
          {
            type: "全新",
            image: "photo-o"
          },
          {
            type: "教材",
            image: "photo-o"
          }
        ]
      },

      {
        name: "电子产品",
        class: [
          {
            type: "二手",
            image: "photo-o"
          },
          {
            type: "全新",
            image: "photo-o"
          },
          {
            type: "耳机",
            image: "photo-o"
          }
        ]
      },

      {
        name: "生活用品",
        class: [
          {
            type: "二手",
            image: "photo-o"
          },
          {
            type: "全新",
            image: "photo-o"
          },
          {
            type: "运动用品",
            image: "photo-o"
          }
        ]
      }
      

    ]
  },

  onChange:function(event) {
    this.setData({
      activeKey: event.detail
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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