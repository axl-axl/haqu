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
function img_choice(){
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
          var utl=res['tempFilePaths'];
          wx.saveFile({
            tempFilePath: utl[0],
            success: function(res){
              console.log(res)
            },
            fail: function() {
              console.log('error')
            },
          })
      }
    })
}
function previewimage(){
  wx.previewImage({
    // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
    urls: ['http://h.hiphotos.baidu.com/image/pic/item/91ef76c6a7efce1b620971c3ad51f3deb48f659d.jpg','http://a.hiphotos.baidu.com/image/pic/item/f9dcd100baa1cd11daf25f19bc12c8fcc3ce2d46.jpg'],
    success: function(res){
      console.log('ok')
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
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
export{get_list,img_choice,previewimage,more_nav,detault_params,android_data}