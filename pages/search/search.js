// pages/search/search.js
let common = require('../../common.js');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.default_params();
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
        that.hot_list(that.data.network);
      }
    });
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: '哈趣搜索', // 分享标题
      desc: '海量视频随时查阅', // 分享描述
      path: '' // 分享路径
    }
  },
  //hot搜索列表
  hot_list:function(default_params){
    let that =this;
    wx.request({
      url: 'https://api.dangcdn.com/haqusou/hotkeylist',
      data: default_params,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        if(typeof(res.data)=='string'){
           res.data = common.android_data(res.data);
        }
        that.setData({
          hot_lists:res.data.items
        })
      }
    })
  },
  //点击完成
  search_key:function(event){
     let keyword = event.detail.value;
     wx.navigateTo({
      url: '../topic/topic?keyword='+keyword,
    })
  },
  //点击跳转
  search_btn:function(event){
     let keyword = event.currentTarget.dataset.keyword;
     wx.navigateTo({
      url: '../topic/topic?keyword='+keyword,
    })
  }
})