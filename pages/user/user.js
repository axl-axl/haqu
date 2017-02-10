// pages/user/user.js
var app = getApp();
let common = require('../../common.js');
Page({
  data:{
    userInfo:{}
  },
  onLoad:function(options){
    let that =this
    app.getUserInfo(function(cb){
      console.log(cb)
      that.setData({
        userInfo:cb.userInfo
      })
    })
  },
  onReady:function(){
    this.default_params()
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  //获取当前网络同时设置了默认参数获取了数据
  default_params:function(){
    var that=this;
    var net = wx.getNetworkType({
      success: function(res) {
        let common_data = common.detault_params(res.networkType);
        that.setData({
          network:common_data,
        });
      }
    });
  },
  onUnload:function(){
    // 页面关闭
  },
  //提交视屏地址
  onload_input:function(){
    wx.navigateTo({
      url: '../urlresolved/urlresolved'
    })
  },
  //跳转到喜欢列表
  like_url:function(){
    wx.navigateTo({
      url:'../like/like'
    })
  },
  //跳转到观看历史
  history_url:function(){
    wx.navigateTo({
      url:"../history/history"
    })
  }
})