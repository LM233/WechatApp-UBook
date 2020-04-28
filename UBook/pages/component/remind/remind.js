// pages/primary/remind/remind.js
var app = getApp();
const DB_SALE = wx.cloud.database().collection("sale_info");
const DB_BOOK = wx.cloud.database().collection("book_info");
const DB_CHAT = wx.cloud.database().collection("chatlist");
const _ = wx.cloud.database().command
Component({

  /* 开启全局样式设置 */
  options: {
    addGlobalClass: true,
  },

  /* 组件的属性列表 */
  properties: {
    name: {
      type: String,
      value: "remind"
    },
  },

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    myFocusBook:[],
    myBook:[],
    myBookDetail:[]
  },

  /* 组件的方法列表 */
  methods: {
    refreash(){
      let myId = getApp().globalData.userData._openid;
      let that = this;
      //找到所有我有意向购买的书籍
      DB_SALE.where({ buyerId: myId }).get({
        success(res) {
          console.log(res.data);
          that.setData({
            myFocusBook: res.data,
          })
        }
      });
      DB_SALE.where({ sellerId: myId }).get({
        success(res) {
          console.log(res.data);
          that.setData({
            myBookDetail: res.data,
          })
        }
      });
      DB_BOOK.where({ _openid: myId }).get({
        success(res) {
          console.log(res.data);
          that.setData({
            myBook: res.data,
          })
        }
      })
    },
    chat(res) { 
    let myOpenId = res.currentTarget.dataset.id_me;
    let sellerOpenId = res.currentTarget.dataset.id_tar;
    let sellerAvatar = res.currentTarget.dataset.avatar;
    let sellerName = res.currentTarget.dataset.name;
    DB_CHAT.where(_.or([{ user1: myOpenId, user2: sellerOpenId }, { user2: myOpenId, user1: sellerOpenId}])).get({
      success:function(e){
        if(e.data.length==0){
          //create newo
          DB_CHAT.add({
            data:{
              user1:myOpenId,
              user1Avatar:getApp().globalData.userInfo.avatarUrl,
              user1Name:getApp().globalData.userData.name,
              user2:sellerOpenId,
              user2Avatar:sellerAvatar,
              user2Name:sellerName,
              },
            success:function(e){
              wx.navigateTo({
                url: '/pages/chatroom/chatroom?id='+e._id,
              })
            }
          })
        }else{
          wx.navigateTo({
            url: '/pages/chatroom/chatroom?id=' + e.data[0]._id,
          })
        }
      },
    })
    },
    del(res){
      let that=this;
      let id_pro = res.currentTarget.dataset.id_pro;
      DB_SALE.where({id:id_pro}).remove({
        success(){
          let myId = getApp().globalData.userData._openid;
          DB_SALE.where({ buyerId: myId }).get({
            success(res) {
              console.log(res.data);
              that.setData({
                myFocusBook: res.data,
              })
            }
          })
        },
      })
    },
    del2(res) {
      let that = this;
      let id_pro = res.currentTarget.dataset.id_pro;
      DB_BOOK.where({ id: id_pro }).remove({
        success() {
          let myId = getApp().globalData.userData._openid;
          DB_BOOK.where({ _openid: myId }).get({
            success(res) {
              console.log(res.data);
              that.setData({
                myBook: res.data,
              })
            }
          });
        },
      })
    },

    handleChange({ detail }) {
      this.setData({
        current: detail.key
      });
    },

    onClose(event) {
      const { position, instance } = event.detail;
      switch (position) {
        case 'left':
        case 'cell':
          instance.close();
          break;
        case 'right':
          Dialog.confirm({
            message: '确定删除吗？'
          }).then(() => {
            instance.close();
          });
          break;
      }
    }

  },

  /* 组件声明周期函数 */
  lifetimes: {
    attached: function () {
      console.log("HERE");
      let myId = getApp().globalData.userData._openid;
      let that = this;
      //找到所有我有意向购买的书籍
      DB_SALE.where({ buyerId: myId }).get({
        success(res) {
          console.log(res.data);
          that.setData({
            myFocusBook: res.data,
          })
        }
      }),
        DB_SALE.where({ sellerId: myId }).get({
          success(res) {
            console.log(res.data);
            that.setData({
              myBookDetail: res.data,
            })
          }
        }),
        DB_BOOK.where({ _openid: myId }).get({
          success(res) {
            console.log(res.data);
            that.setData({
              myBook: res.data,
            })
          }
        })
    },
    moved: function () {

    },
    detached: function () {

    },
  },
})