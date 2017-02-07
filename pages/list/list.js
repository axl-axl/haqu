Page({
  data:{
    
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    String2
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    String3
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    String4
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    String5
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    String6
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    String7
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    wx.request({
      url: 'https://URL',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})