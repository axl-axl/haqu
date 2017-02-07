//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
//获取用户信息
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData)
    }else{
      //调用登录接口
      wx.login({
        success: function (param) {//获取到code
          wx.getUserInfo({
            success: function (res) {//获取到密文和vi
              res.code = param.code;
              that.globalData.userInfo = res;
              typeof cb == 'function' && cb(res)
            }
          });
        }
      })
    }
  },
//获取sessionkey
  get_session_key:function(code,info,cb){
      var that = this;
      wx.request({
        url: 'https://api.dangcdn.com/WxSessionKey/index',
        data: {codestr:code},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          that.decodeData(info.encryptedData,res.data.session_key,info.iv,cb);
        },
        fail: function(res) {
          console.log('获取session_key失败：'+res);
        }
      })
    },
//解码encryptedData
  decodeData:function(miwen,session_key,iv,cb){
      var that =this;
      let data ={
          encryptedData:miwen,
          sessionkey:session_key,
          iv:iv
        };
      wx.request({
        url: 'https://api.dangcdn.com/wxApi/index.php',
        data: data,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function(res){
          // that.globalData.userInfoCode = res.data;
          // //设置缓存
          // let da  = res.data.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
          // wx.setStorage({
          //   key: 'userOpind',
          //   data:JSON.parse(da)
          // })
          res.data = res.data.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
          res.data = JSON.parse(res.data);
          wx.setStorageSync('utoken',res.data.info.utoken);
          typeof cb =='function'&& cb(that.globalData.userInfoCode);
        }
      })
  },
  globalData:{
    userInfo:null,
    common_data:null
  }
})