function get_list(event){
    console.log(event);
    wx.request({
      url: 'https://api.dangcdn.com/haqucom/catelist',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(res);
        console.log(event['currentTarget']['dataset']['name']);
      }
    })
}

function more_nav(that){
    if(that.data.nav_list){
      that.setData({
        nav_list:false
      })
      console.log(that.data.nav_list)
    }else{
      that.setData({
        nav_list:true
      })
    }
}
function detault_params(net){
  return{
    apptype: 'mini',
    version:'1.0.0',
    vcode:'weixin',
    os:'weixin',
    cpu:'CPU',
    devid:'weixin',
    network:net,
    channel:'haqu',
    isencrypt:0
  }
}
//获取当前网络同时设置了默认参数获取了数据
function default_net(cb){
    var that=this;
    var net = wx.getNetworkType({
      success: function(res) {
        let common_data = detault_params(res.networkType);
        that.globalData.common_data = common_data;
         typeof cb=='function' && cb(that.globalData.common_data,default_net)
      }
    });
}
//安卓数据转换
function android_data(data){
  var items;
  items = data.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  return JSON.parse(items);
}
//加密
function encode(data){
  console.log(data)
  wx.request({
    url: 'https://api.dangcdn.com/WxEncode',
    data: data,
    method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
        "Content-Type":"application/x-www-form-urlencoded"
    },
    success: function(res){
      console.log(res)
    }
  })
}
export{get_list,more_nav,detault_params,android_data,encode}