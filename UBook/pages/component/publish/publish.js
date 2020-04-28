const DB_USER = wx.cloud.database().collection("user_info");
const DB_BOOK = wx.cloud.database().collection("book_info");
const _ = wx.cloud.database().command
Component({
  data:{
    pos:[{id:1,name:'本部'},{id:2,name:'沙河'}],
    tempt:["书籍教材","生活用品","电子产品","美妆护肤","鞋衣","其他"],
    index:0,
    position:"right",
    current:0,
    bookName:'',
    bookPrice:'',
    bookCourse:'',
    bookNote:'',
    localImgLink:'',
    damage:'',
    id:'',//每当进入这个页面的时候，从云端拿一个ID
  },
  methods:{
    bindPickerChange(e){
      this.setData({
        index:e.detail.value,
      })
    },
    damage(e){this.setData({damage:e.detail.detail.value});},
    bookName(e) { this.setData({ bookName: e.detail.detail.value }); },
    bookPrice(e) { this.setData({ bookPrice: e.detail.detail.value }); },
    bookCourse(e) { this.setData({ bookCourse: e.detail.detail.value }); },
    bookNote(e) { this.setData({ bookNote: e.detail.detail.value }); },
    handlePosChange(res) {
      if (res.detail.value == "沙河") {
        this.setData({
          current: 1,
        })
      }else {
        this.setData({
          current: 0,
        })
      }
    },
    onChooseImg(){
      let that=this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          that.setData({
            localImgLink: res.tempFilePaths[0],
          });
        }
      })
    },
    onClick(){
      let _type=((this.data.index-0)+1)*100;
      let _place=((this.data.current-0)+1)*100;
      let _damage=this.data.damage-0;
      let _bookName=this.data.bookName;
      let _bookPrice=this.data.bookPrice;
      let _bookCourse=this.data.bookCourse;
      let _bookNote=this.data.bookNote;
      let _location=this.data.current;
      let _localImgLink=this.data.localImgLink;
      let _time=(new Date()).getTime();
      
      if(!_bookName||!_bookPrice||!_bookNote||!_localImgLink){
        //这里可以添加更多检验内容，第一次开发就不在这里停留太久了
        wx.showToast({
            title: '信息不完整',
            icon: 'none',
            duration: 2000,
          });
      }
      else{
        //1.数据库里取id
        //id的设计：本人学号+产品数
        //2.上传图片，拿到地址
        //3.建立图书数据
        //这个步骤必须用promise语句，否则回调层数太多了
        let _id='';
        let _name='';
        DB_USER.where({number: getApp().globalData.userData.number}).get().then(
          (res)=>{
            console.log(res.data);
            _id=res.data[0].number+(res.data[0].product+'');
            _name=res.data[0].name;
            return DB_USER.doc(res.data[0]._id).update({ data: { product: _.inc(1) } });//第一步完成
          }
        ).then(
          (res)=>{
            console.log(res);console.log(_id);
            return wx.cloud.uploadFile({
              // 指定上传到的云路径
              cloudPath: 'product_photo/'+_id+'.png',//照片格式会不会造成影响？
              // 指定要上传的文件的小程序临时文件路径
              filePath: _localImgLink,
            })
        }).then(
          (res)=>{
            // console.log(res);
            // console.log(getApp().globalData.userToken)
            // wx.request({
            //   url: 'http://101.200.243.33/v1/seller/up',
            //   data: {
            //     "access_token": getApp().globalData.userToken,
            //     "book_type": _type,
            //     "location": _place,
            //     "title": _bookName,
            //     "price": _bookPrice,
            //     "condition": _damage,
            //     "summary": _bookNote,
            //     "image1": res.fileID,
            //     "image2": "",
            //     "image3": ""
            //   },
            //   header:{
            //     'Authorization':'Bearer '+getApp().globalData.userToken,
            //   },
            //   method: "POST",
            //   success:function(res){console.log(res)},
            //   fail:function(res){console.log(res)},
            // })
            return DB_BOOK.add({
              data:{
                bookName:_bookName,
                bookPrice:_bookPrice,
                bookCourse:_bookCourse,
                bookNote:_bookNote,
                location:_location,
                type:_type,
                id:_id,
                link:res.fileID,
                seller:_name,
                avatar:getApp().globalData.userInfo.avatarUrl,
                school: getApp().globalData.userData.school,
                time:_time,
              }
            })}
          // })
        ).then(
          wx.showModal({
            title: '提示',
            content: '新书创建完成',
            success(res) {
              if (res.confirm) wx.navigateTo({
                url: '../primary/primary',
              })
            }
          })
        )
      }
    },

  },

  /* 组件声明周期函数 */
    lifetimes: {
    attached: function () {

    },
    moved: function () {

    },
    detached: function () {

    },
  },

});