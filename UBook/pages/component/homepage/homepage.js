// pages/primary/homepage/homepage.js
var app = getApp();
const db = wx.cloud.database();
const DB_BOOK = wx.cloud.database().collection("book_info");
Component({
  /**
   * 页面的初始数据
   */
  data: {
    input:'',
    mode:0,
    targetId:0,
    tarBook:{},
    bookData:[],
    activeKey: 0,
    category: [
      {
        name: "书籍教材",
        items: []
      },

      {
        name: "生活用品",
        items: []
      },

      {
        name: "电子产品",
        items: []
      },

      {
        name: "美妆护肤",
        items: []
      },

      {
        name: "鞋衣",
        items: []
      },

      {
        name: "其他",
        items: []
      },

    ]
  },
  /* 组件的方法列表 */
  methods: {
    onTap:function(item){
      wx.navigateTo({
        url: '/pages/detail/detail?item=' + item.currentTarget.dataset.product.id,
      })
    },
    onChange: function (event) {
      this.setData({
        activeKey: event.detail
      });
      let _type = ((this.data.activeKey - 0) + 1) * 100;
      let that=this;
      let index = "category[" + this.data.activeKey + "].items";
      console.log(index);
      DB_BOOK.where({ type: _type }).limit(4).get({
        success:function(res){
          console.log(res);
          that.setData({
            [index]:res.data,
          })
        }
      })
      console.log(this.data.category);
    },
    bookName: function (e) {
      this.setData({ input: e.detail.detail.value }, () => console.log("输入的书名：", this.data.input));
    },
    search: function (e) {
      let name=this.data.input;
      wx.navigateTo({
        url: '/pages/component/homepage/result/result?name='+name,
      })    
    },

    items:function() {
      wx.navigateTo({
        url: '/pages/component/homepage/items/items',
      })
    },

    onSight(res){
      //需求 将一个状态为“未成功”的交易加入数据库
      //还需要学习云函数改动数据库 =w= 真的好麻烦
      let product=res.currentTarget.dataset.product;
      DB_SALE.add({
        data:{
          id:product.id,
          sellerId:product._openid,
          sellerName:product.seller,
          bookName:product.bookName,
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
    onChat(res){
      let id_me = getApp().globalData.userData._openid;
      let id_tar = res.currentTarget.dataset.product._openid;
      wx.navigateTo({
        url: '/pages/chatroom/chatroom?group='+id_tar+id_me,
      })
    },
    bookInfo:function(event) {
      var id = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/component/homepage/bookInfo/bookInfo?id=' + id,
      })
    }},
    /* 组件声明周期函数 */
    lifetimes: {
      attached: function () {
        this.setData({
          activeKey: 0
        });
        let _type = ((this.data.activeKey - 0) + 1) * 100;
        let that = this;
        let index = "category[" + this.data.activeKey + "].items";
        console.log(index);
        DB_BOOK.where({ type: _type }).limit(4).get({
          success: function (res) {
            console.log(res);
            that.setData({
              [index]: res.data,
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