var app = getApp();
const db = wx.cloud.database();
const DB_BOOK = wx.cloud.database().collection("book_info");
const DB_SALE = wx.cloud.database().collection("sale_info");
const DB_CHAT = wx.cloud.database().collection("chatlist");
const _ = db.command;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    item:{},
  },

  onClickIcon() {
    let myOpenId = app.globalData.userData._openid;
    let sellerOpenId = this.data.item._openid;
    let sellerAvatar=this.data.item.avatar;
    let sellerName=this.data.item.seller;
    DB_CHAT.where(_.or([{ user1: myOpenId, user2: sellerOpenId }, { user2: myOpenId, user1: sellerOpenId}])).get({
      success:function(e){
        if(e.data.length==0){
          //create newo
          DB_CHAT.add({
            data:{
              user1:myOpenId,
              user1Avatar:getApp().globalData.userInfo.avatarUrl,
              user1Name:getApp().globalData.userData.name,
              user1Number:0,
              user2:sellerOpenId,
              user2Avatar:sellerAvatar,
              user2Name:sellerName,
              user2Number:0,
              totalNumber:0,
              },
            success:function(e){
              wx.navigateTo({
                url: '/pages/chatroom/chatroom?id='+e._id+'&user=1',
              })
            }
          })
        }else{
          if(e.data[0].user1==myOpenId){
            wx.navigateTo({
              url: '/pages/chatroom/chatroom?id=' + e.data[0]._id + '&user=1',
            })
          }
         else{
            wx.navigateTo({
              url: '/pages/chatroom/chatroom?id=' + e.data[0]._id + '&user=2',
            })
         }
        }
      },
    })
  },
  onClickButton() {
    //需求 将一个状态为“未成功”的交易加入数据库
    //还需要学习云函数改动数据库 =w= 真的好麻烦
    let product = this.data.item;
    DB_SALE.add({
      data: {
        id: product.id,
        pic: product.link,
        sellerId: product._openid,
        sellerName: product.seller,
        bookName: product.bookName,
        buyerId: getApp().globalData.userData._openid,
        buyerName: getApp().globalData.userData.name,
        group: product._openid + getApp().globalData.userData._openid,
      }
    }).then(
      wx.showToast({
        title: '关注完成',
      })
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _id=options.item;
    console.log(_id);
    let that=this;
    DB_BOOK.where({id:_id}).get({
      success:function(res){
        console.log(res.data)
        that.setData({
          item:res.data[0],
        })
      }
    })
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