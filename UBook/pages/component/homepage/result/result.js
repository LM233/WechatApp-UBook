var app = getApp();
const db = wx.cloud.database();
const DB_BOOK = wx.cloud.database().collection("book_info");
const DB_SALE = wx.cloud.database().collection("sale_info");
var app = getApp();
var _input;
function refresh(that){
  that.setData({ mode: 1 });
  console.log(that.data.bookData);
  DB_BOOK.where({
    bookName: db.RegExp({
      regexp: _input,
      options: "i",
    })
  }).get({
    success: function (res) {
      if (!res.data.length) that.setData({ mode: 2 });
      else {
        console.log(res.data);
        that.setData({
          bookData: res.data,
          amount: res.data.length,
        })
      }
    }
  })
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    option1: [
      { text: '全部校区', value: 'a' },
      { text: '本部', value: 'b' },
      { text: '沙河', value: 'c' },
    ],
    option2: [
      { text: '默认顺序', value: 'A' },
      { text: '时间顺序', value: 'B' },
      { text: '时间逆序', value: 'C' },
      { text: '价格顺序', value: 'D' },
      { text: '价格逆序', value: 'E' }
    ],
    option3: [
      { text: "全部学院", value: 0},
      { text: "信息与通信工程学院", value: 1 },
      { text: "电子工程学院", value: 2},
      { text: "计算机学院", value: 3 },
      { text: "自动化学院", value: 4},
      { text: "数字媒体与设计学院", value: 5},
      { text: "现代邮政学院", value: 6 },
      { text: "网络空间安全学院", value: 7 },
      { text: "光电信息学院", value: 8},
      { text: "理学院", value: 9 },
      { text: "经济管理学院", value: 10},
      { text: "公共管理学院", value: 11 },
      { text: "人文学院", value: 12 },
      { text: "国际学院", value: 13 },
      { text: "软件学院", value: 14}
    ],
    value1: 'a',
    value2: 'A',
    value3: 0,
    mode:"0",
    amount:0,
    page:0,
    bookData:[],
  },

  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },

  ondetail:function(item) {
    console.log(item);
    wx.navigateTo({
      url: '/pages/detail/detail?item='+item.currentTarget.dataset.product.id,
    })
  },

  oncart:function() {
    wx.navigateTo({
      url: '/pages/component/remind/remind',
    })
  },

  next(){
    let _page=this.data.page+1;
    let _amount=this.data.amount;
    if(_page*5>=_amount||_page*5<0) return;
    this.setData({
      page:_page,
    })
  },
   previous() {
    let _page = this.data.page - 1;
    let _amount = this.data.amount;
    if (_page * 5 >= _amount || _page * 5 < 0) return;
    this.setData({
      page: _page,
    })
  },
  changeCondition(res){
    let cata=res.currentTarget.dataset.cata;
    let value=res.detail;
    let _value1=this.data.value1;
    let _value2 = this.data.value2;
    let _value3 = this.data.value3;
    if (cata == "a") { this.setData({ value1: value }); _value1 = value;}
    else if (cata == "b") { this.setData({ value2: value }); _value2 = value; }
    else if (cata == "c") { this.setData({ value3: value }); _value3 = value; }
    let _arr=[];
    let that=this;
    DB_BOOK.where({
      bookName: db.RegExp({
        regexp: _input,
        options: "i",
      })
    }).get({
      success: function (res) {
        _arr=res.data;
        if(_value2=='B'){_arr.sort(function(a,b){
          if(a.time>b.time) return 1;
          else return -1;
        })} else if (_value2 == 'C') {
          _arr.sort(function (a, b) {
            if (a.time < b.time) return 1;
            else return -1;
          })
        } else if (_value2 == 'D') {
          _arr.sort(function (a, b) {
            if (a.bookPrice > b.bookPrice) return 1;
            else return -1;
          })
        } else if (_value2 == 'E') {
          _arr.sort(function (a, b) {
            if (a.bookPrice < b.bookPrice) return 1;
            else return -1;
          })
        }

        if(_value1=='b'){
          for(let i=0;i<_arr.length;i++){
            if(_arr[i].location!=0){
              _arr.splice(i,1);
              i=-1;
            }
          }
        }else if(_value1=='c'){
          for (let i = 0; i < _arr.length; i++) {
            if (_arr[i].location != 1) {
              _arr.splice(i,1);
              i = -1;
            }
          }
        }
        if(_value3!=0){
          //1.取对应的学院名称字符串
          //2.如果不相等，那么就删掉对应的元素
          let schoolName=that.data.option3[_value3].text;
          for(let i=0;i<_arr.length;i++){
            console.log(i);
            if(_arr[i].school!=schoolName){
              _arr.splice(i,1);
              i=-1;
            }
          }
        }
//为什么会剩下一个啊啊啊啊啊啊

        console.log(_arr);
        that.setData({bookData:_arr,amount:_arr.length,});
        console.log(_value1, _value2, _value3);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    _input=options.name;
    if(!_input){
        this.setData({mode:2});
        return;
      }
      let that=this;
      this.setData({mode:1});
      console.log(this.data.bookData);
      DB_BOOK.where({
        bookName: db.RegExp({
          regexp: _input,
          options: "i",
        })
      }).get({
        success: function (res) {
          if(!res.data.length) that.setData({mode:2});
          else{
            console.log(res.data);
            that.setData({
              bookData:res.data,
              amount:res.data.length,
            })
          }
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