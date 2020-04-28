// pages/component/roomList/roomList.js
const DB = wx.cloud.database().collection("chatlist");
const _=wx.cloud.database().command;
Component({

  /* 开启全局样式设置 */
  options: {
    addGlobalClass: true
  },

  /* 组件的属性列表 */
  properties: {
    name: {
      type: String,
      value: "roomList"
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
  },

  /* 组件声明周期函数 */
  lifetimes: {
    attached: function () {
      let myOpenId=getApp().globalData.userData._openid;
      let _userList=[];
      let that=this;
      DB.where(_.or([{ user1: myOpenId }, { user2: myOpenId }])).get({
        success: function (res) {
          let list=res.data;
          for(let i=0;i<list.length;i++){
            if(list[i].user1==myOpenId){
              _userList.push({user:list[i].user2,avatar:list[i].user2Avatar,name:list[i].user2Name,id:list[i]._id,
              number: list[i].totalNumber - list[i].user1Number, }); 
            }else{
              _userList.push({ user: list[i].user1, avatar: list[i].user1Avatar, name: list[i].user1Name, id: list[i]._id,
              number: list[i].tota2Number - list[i].user1Number, });
            }
          }
          that.setData({ userList: _userList },()=>{
            let _userList = that.data.userList;
            console.log(_userList);

          });
        }
      });
      DB.watch({
        onChange: function(){
          let myOpenId = getApp().globalData.userData._openid;
          let _userList = [];
          DB.where(_.or([{ user1: myOpenId }, { user2: myOpenId }])).get({
            success: function (res) {
              let list = res.data;
              for (let i = 0; i < list.length; i++) {
                if (list[i].user1 == myOpenId) {
                  _userList.push({
                    user: list[i].user2, avatar: list[i].user2Avatar, name: list[i].user2Name, id: list[i]._id,
                    number: list[i].totalNumber - list[i].user1Number,
                  });
                } else {
                  _userList.push({
                    user: list[i].user1, avatar: list[i].user1Avatar, name: list[i].user1Name, id: list[i]._id,
                    number: list[i].totalNumber - list[i].user2Number,
                  });
                }
              }
              that.setData({ userList: _userList });
            }
          })
        },
        onError(err) {
          console.error(err)
        }
      })
    },
    moved: function () {

    },
    detached: function () {

    },
  },

  /* 组件的方法列表 */
  methods: {
    onchat: function () {
      wx.navigateTo({
        url: '/pages/chatroom/chatroom',
      })
    },
    onTap:function(res){
      let myOpenId = getApp().globalData.userData._openid;
      let id = res.currentTarget.dataset.id;
      console.log(id);
      DB.where({_id: id}).get({
        success:function(res){
          if(res.data[0].user1==myOpenId){
            wx.navigateTo({
              url: '/pages/chatroom/chatroom?id=' + id+"&user=1",
            })
          }else{
            wx.navigateTo({
              url: '/pages/chatroom/chatroom?id=' + id + "&user=2",
            })
          }
        }
      })
      
    },
    del:function(res){
      let that = this;
      let id_pro = res.currentTarget.dataset.id_pro;
      DB.where({ _id: id_pro }).remove({
        success(){
          let myOpenId = getApp().globalData.userData._openid;
          let _userList = [];
          DB.where(_.or([{ user1: myOpenId }, { user2: myOpenId }])).get({
            success: function (res) {
              let list = res.data;
              for (let i = 0; i < list.length; i++) {
                if (list[i].user1 == myOpenId) {
                  _userList.push({ user: list[i].user2, avatar: list[i].user2Avatar, name: list[i].user2Name, id: list[i]._id ,
                  number: list[i].totalNumber - list[i].user1Number,});
                } else {
                  _userList.push({ user: list[i].user1, avatar: list[i].user1Avatar, name: list[i].user1Name, id: list[i]._id ,
                  number: list[i].totalNumber - list[i].user2Number,});
                }
              }
              that.setData({ userList: _userList });
            }
          })
        },
      })
    },
    refresh(){
      let myOpenId = getApp().globalData.userData._openid;
      let _userList = [];
      let that=this;
      DB.where(_.or([{ user1: myOpenId }, { user2: myOpenId }])).get({
        success: function (res) {
          let list = res.data;
          for (let i = 0; i < list.length; i++) {
            if (list[i].user1 == myOpenId) {
              _userList.push({ user: list[i].user2, avatar: list[i].user2Avatar, name: list[i].user2Name, id: list[i]._id, 
              number:list[i].totalNumber-list[i].user1Number, });
            } else {
              _userList.push({ user: list[i].user1, avatar: list[i].user1Avatar, name: list[i].user1Name, id: list[i]._id, 
              number:list[i].totalNumber-list[i].user2Number, });
            }
          }
          that.setData({ userList: _userList });
        }
      })
    }
  },

  

  
})