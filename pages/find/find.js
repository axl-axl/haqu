let common = require('../../common.js');
Page({
  data:{
    day_page:1,
    topic_page:1,
    day_show:'active'
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.default_params()
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    this.get_more();
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: '哈趣发现', // 分享标题
      desc: '哈趣发现', // 分享描述
      path: '/pages/find/find' // 分享路径
    }
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
        that.day_list(common_data);
        that.topic_list(common_data);
      }
    });
  }, 
  //触摸
  touchstart:function(event){
    console.log('开始')
    console.log(event)
    console.log('开始')
  },
  touchmove:function(event){
    console.log('移动')
    console.log(event)
    console.log('移动')
  },
  touchend:function(event){
    console.log('结束')
    console.log(event)
    console.log('结束')
  },
  //切换栏目
  tab_check:function(event){
    var tab = event.currentTarget.dataset.tab;
    if(tab=="day"){
      this.setData({
        day_show:'active',
        topic_show:''
      })
    }
    if(tab=="topic"){
      this.setData({
        day_show:'',
        topic_show:'active'
      })
    }
  },
  //请求每日列表
  day_list:function(default_para,page){
    let that =this;
    let params ={
        page:page?page:1,
        pagesize:8
    }
    let data = Object.assign(default_para,params);
    wx.request({
      url: 'https://api.dangcdn.com/haqumagazine/dailyvdlist',
      data:data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        if(typeof(res.data)=='string'){
           res.data = common.android_data(res.data);
        }
        if(page){
          for(let i=0;i<res.data.items.length;i++){
              that.data.day_list.push(res.data.items[i]); 
          }
        }else{
            that.data.day_list = res.data.items;
        }
        that.setData({
          day_list:that.data.day_list,
          day_page:(that.data.day_page + 1)
        })
      },
      fail: function() {
        console.log('error:获取每日精选')
      }
    })
  },
  //请求话题列表
  topic_list:function(default_para,page){
    let that =this;
    let params ={
        page:page?page:1,
        pagesize:8
    }
    let data = Object.assign(default_para,params);
    wx.request({
      url: 'https://api.dangcdn.com/haqumagazine/topiclist',
      data:data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        if(typeof(res.data)=='string'){
           res.data = common.android_data(res.data);
        }
        if(page){
          for(let i=0;i<res.data.items.length;i++){
              that.data.topic_list.push(res.data.items[i]); 
          }
        }else{
            that.data.topic_list = res.data.items;
        }
        that.setData({
          topic_list:that.data.topic_list,
          topic_page:(that.data.day_page + 1)
        })
      },
      fail: function() {
        console.log('error:获取每日精选')
      }
    })
  },
  //获取更多
  get_more:function(){
    if(this.data.day_show){
       this.day_list(this.data.network,this.data.day_page);
    }
    if(this.data.topic_show){
       this.topic_list(this.data.network,this.data.topic_page);
    }
  },
  //跳转精选详情
  video_info:function(event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../video/video?id='+id,
    })
  },
  //跳转话题详情
  topic_info:function(event){
    let keyword = event.currentTarget.dataset.keyword;
    wx.navigateTo({
      url:'../topic/topic?keyword='+keyword,
    })
  }
})