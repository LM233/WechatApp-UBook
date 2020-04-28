// pages/component/remind/chatroom/chatroom.js

var app = getApp();
const db = wx.cloud.database()
const chatroomCollection = db.collection('chatroom')
const DB = wx.cloud.database().collection("chatlist")
var theGroup=''
const _ = wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    textInputValue: '', //发送的消息
    chats: [], // 存储聊天记录
    openId: '', //当前用户openid
    sendMoreMsgFlag: false,
    chooseFiles: [],
    deleteIndex: -1,
    user:'',
  },

  sendMoreMsg: function () {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },

  //选择本地照片与拍照
  chooseImage: function (event) {
    // 已选择图片数组
    var imgArr = this.data.chooseFiles;
    //只能上传3张照片，包括拍照
    var leftCount = 3 - imgArr.length;
    if (leftCount <= 0) {
      return;
    }
    var sourceType = [event.currentTarget.dataset.category],
      that = this;
    console.log(leftCount)
    wx.chooseImage({
      count: leftCount,
      sourceType: sourceType,
      success: function (res) {
        // 可以分次选择图片，但总数不能超过3张
        console.log(res)
        that.setData({
          chooseFiles: imgArr.concat(res.tempFilePaths)
        });
      }
    })
  },

  previewImg:function(event) {
    //获取图片序号
    var imageIdx = event.currentTarget.dataset.idx;
    var imgs = this.data.chooseFiles;
    wx.previewImage({
      urls: imgs,
      current: imgs[imageIdx]
    })
  },

  //删除已经选择的图片
  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx,
      that = this;
    that.setData({
      deleteIndex: index
    });
    that.data.chooseFiles.splice(index, 1);
    setTimeout(function () {
      that.setData({
        deleteIndex: -1,
        chooseFiles: that.data.chooseFiles
      });
    }, 500)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({user:options.user});
    console.log(options.user);
    theGroup = options.id;
    console.log(theGroup);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    chatroomCollection.where({
      groupId: theGroup
    }).watch({
      onChange: this.onChange.bind(this),
      onError(err) {
        console.error(err)
      }
    })

    // 获取用户openid
    const {
      result
    } = await wx.cloud.callFunction({
      name: 'login'
    })
    this.setData({
      openId: result.openid
    })
  },

  onChange(snapshot) {
    // 监听
    console.log(snapshot)
    if (snapshot.type == 'init') { // 初始化
      this.setData({
        chats: [
          ...this.data.chats,
          ...[...snapshot.docs].sort((x, y) => x.sendTimeTs - y.sendTimeTs)
        ]
      })
    } else {
      const chats = [...this.data.chats]
      for (const docChange of snapshot.docChanges) {
        switch (docChange.queueType) {
          case 'enqueue':
            chats.push(docChange.doc)
            break
        }
      }
      this.setData({
        chats: chats.sort((x, y) => x.sendTimeTs - y.sendTimeTs)
      })

    }

  },

  onGetUserInfo(e) {
    // 获取用户头像和昵称
    // console.log(e)
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo
      })
    }
  },

  onSend() {
    let _user=this.data.user;
    DB.where({ _id: theGroup}).get().then(
      (res) => {
        console.log(res.data);
        let _total=res.data[0].totalNumber+1;
        if(_user==1)
          return DB.doc(res.data[0]._id).update({ data: { user1Number: _total, totalNumber: _total }});//第一步完成
        else
          return DB.doc(res.data[0]._id).update({ data: { user2Number: _total, totalNumber: _total }});
      }
    )
    // 发送消息，插入云数据库
    if (!this.data.textInputValue && !this.data.chooseFiles) {
      return
    }

    const doc = {
      textContent: this.data.textInputValue, // 用户输入信息
      imageContent: this.data.chooseFiles[0], //用户输入图片
      avatar: this.data.userInfo.avatarUrl, // 头像
      nickName: this.data.userInfo.nickName, //  昵称
      groupId: theGroup,
      msgType: 'text',
      sendTime: new Date(),
      sendTimeTs: Date.now(),
    }

    chatroomCollection.add({
      data: doc
    })

    // 清空输入框
    this.setData({
      textInputValue: '',
      chooseFiles: '',
    })

  },

  onTextInput(e) {
    // 获取用户输入的信息
    this.setData({
      textInputValue: e.detail.value
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  checkImage(e) {
    var that = this;
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: 'src', // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
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