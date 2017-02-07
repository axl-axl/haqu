// pages/like/like.js
let common = require('../../common.js');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.default_params()
  },
  onReady:function(){
    this.like_list(this.data.network);
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //获取当前网络
  default_params:function(){
    var that=this;
    let utoken = wx.getStorageSync('utoken');
    this.setData({
      utoken:utoken
    });
    var net = wx.getNetworkType({
      success: function(res) {
        let common_data = common.detault_params(res.networkType);
        that.setData({
          network:common_data,
        });
      }
    });
  },
  //获取喜欢列表
  like_list:function(default_paras){
    let that =this;
    let data_like = {
      utoken:this.data.utoken,
      uptime:(new Date()).getTime()
    }
    let data = Object.assign(data_like,default_paras);
    wx.request({
      url: 'https://api.dangcdn.com/haquuser/mylikelist',
      data: data,
      method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(res);
        that.setData({
          like_list:res.data
        })
      }
    })
  },
  //删除视频
  del_like:function(event){
    let that = this;
    let vid = event.currentTarget.dataset.lid;
    let default_param = this.data.network;
    let index = event.currentTarget.dataset.index;
    let data_del = {
      times:(new Date()).getTime(),
      nonce:Math.round(Math.random()*1000000),
      utoken:this.data.utoken,
      vid:vid,
      isall:'',
      sign:'weixin'
    }
    let data = Object.assign(data_del,default_param);
    wx.request({
      url: 'https://api.dangcdn.com/haqurcd/dellike',
      data: data,
      method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        let like_list = that.data.like_list;
        console.log(res)
        like_list.remove(index);
        that.setData({
          like_list:like_list
        })
      }
    })
  }
})