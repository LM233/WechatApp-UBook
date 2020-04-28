# WeChat-App-Ubooks-
A wechat app aiming to build an online shopping platform in campus.



修改说明：

增加一个组件库：[Vant Weapp](https://youzan.github.io/vant-weapp/#/intro) 放在dist_1目录下(添加组件目录时请注意)

注册页面(/pages/sign/register)：增加了用户名输入

搜索(/pages/component/homepage)：搜索按钮迁移到一个页面(未迁移代码)，增加目录按钮，搜索框下增加物品显示(未设置跳转)

搜索页面(/pages/component/homepage/result/result)：购物车按钮可跳转到交易页面，搜索框下增加排序，最下面显示搜索结果，点击可跳转到商品详情页面(修改时，可直接在card添加属性url,link-type)

商品详情页面(/pages/detail/detail)：聊天/加入收藏

聊天页面(/pages/component/roomList/roomList)：点击聊天对象进入聊天

聊天界面(/pages/chatroom/chatroom)：增加照片/拍照

交易页面(/pages/component/remind/remind)：分为两部分，其中‘我发布的交易’右滑可删除

其他修改：我的