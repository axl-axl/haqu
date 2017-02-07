// pages/urlresolved/urlresolved.js
let common = require('../../common.js');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.default_params();
  },
  onReady:function(){
    // 页面渲染完成
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
  //url数据绑定
  url_change:function(event){
      let value = event.detail.value;
      this.setData({
        url_value:value
      })
  },
  //解析
  url_decode:function(){
    let default_params = this.data.network; 
    let data_url = {
      url:this.data.url_value,
      times:(new Date()).getTime(),
      nonce:Math.round(Math.random()*1000000),
      sign:'weixin'
    }
    let data = Object.assign(data_url,default_params);
    console.log(data);
  }
})