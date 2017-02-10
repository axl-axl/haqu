// pages/topic/topic.js
let common = require('../../common.js');
Page({
  data:{
    last_show:'active'
  },
  onLoad:function(options){
    this.setData({
      keyword:options.keyword,
      topic_page_last:1,
      topic_page_hot:1,
      isShare:options.share?options.share:''
    })
    this.default_params()
  },
  onReachBottom: function() {
    this.setData({
      loading:'loading'
    });
    this.get_more();

  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: this.data.keyword, // 分享标题
      desc: '哈趣话题', // 分享描述
      path: '/pages/topic/topic?keyword='+this.data.keyword+"&share=1" // 分享路径
    }
  },
  //loading隐藏
  hide_loading:function(){
    this.setData({
      loading:''
    })
  },
  //获取更多
  get_more:function(){
    if(this.data.last_show){
       this.topic_list(this.data.network,this.data.topic_page_last,1);
    }
    if(this.data.hot_show){
       this.topic_list(this.data.network,this.data.topic_page_hot,2);
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
        that.topic_list(that.data.network,'',1);
        that.topic_list(that.data.network,'',2);
      }
    });
  }, 
  //获取话题列表
  topic_list:function(default_para,page,sortby){
    let that =this;
    let params ={
        soukey:that.data.keyword,
        page:page?page:1,
        sortby:sortby?sortby:1,
    }
    let data = Object.assign(default_para,params);
    wx.request({
      url: 'https://api.dangcdn.com/haqusou/svdsou',
      data:data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        if(typeof(res.data)=='string'){
           res.data = common.android_data(res.data);
        }
        //处理tagss，出过来时id需要文字
        for(let i=0;i<res.data.items.length;i++){
            let old_tags = res.data.items[i]['tags'].split(',');
            for(let y=0;y<res.data.tags.length;y++){
              if(res.data.items[i]['tags'].match(res.data.tags[y]['id'])){
                res.data.items[i]['tags']=res.data.items[i]['tags'].replace(res.data.tags[y]['id'],res.data.tags[y]['name']);
              }
            }
            for(let m=0;m<old_tags.length;m++){
              let reg = new RegExp(old_tags[m]+',?');
               res.data.items[i]['tags'] = res.data.items[i]['tags'].replace(reg,'');
            }
            res.data.items[i]['tags'] = res.data.items[i]['tags'].split(',','3');
              if(res.data.items[i]['playNum']/10000 >= 1){
                res.data.items[i]['playNum'] = Math.floor(res.data.items[i]['playNum']/10000)+'万+'
              }
        }
      //判断page确认是刷新还是初始化
        if(page > 1){
            if(sortby == 1){
              for(let i=0;i<res.data.items.length;i++){
                  that.data.topic_list_last.push(res.data.items[i]); 
              }
            }
            if(sortby == 2){
              for(let i=0;i<res.data.items.length;i++){
                  that.data.topic_list_hot.push(res.data.items[i]); 
              }
            }
            
          }else{
            if(sortby == 1){
                that.data.topic_list_last = res.data.items;
            }
            if(sortby== 2){
                that.data.topic_list_hot = res.data.items;
            }
            that.setData({
              topic_total:res.data.total
            })
            
          }
        //根据sortby修改数据
        if(sortby == 1){
          that.setData({
            topic_list_last:that.data.topic_list_last,
            topic_page_last:(that.data.topic_page_last + 1),
          })
        }
        if(sortby == 2){
          that.setData({
            topic_list_hot:that.data.topic_list_hot,
            topic_page_hot:(that.data.topic_page_hot + 1),
          })
        }
        console.log(that.data.topic_list_hot)
      },
      fail: function() {
        console.log('error:获取话题失败')
      },
      complete:function(){
        that.hide_loading();
      }
    })
  },
  //标记喜欢
  like_btn:function(event){
    let utoken = wx.getStorageSync('utoken');
    let vid = event.target.dataset.vid;
    let type_like = event.target.dataset.type_like;
    let index = event.target.dataset.index;
    let that =this;
    let like_data={
      utoken:utoken,
      vid:vid,
      type:type_like,
      time:(new Date()).getTime(),
      nonce:Math.round(Math.random()*100000)
    }
    let data_default = this.data.network;
    let decode_data = Object.assign(data_default,like_data);
    wx.request({
      url: 'https://api.dangcdn.com/WxEncode',
      data: decode_data,
      method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type":"application/x-www-form-urlencoded"
      }, // 设置请求的 header
      success: function(msg){
         wx.request({
           url: 'https://api.dangcdn.com/haqueventweb/svdlike',
           data:msg.data,
           method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
           header: {
             "Content-Type":"application/x-www-form-urlencoded"
           }, // 设置请求的 header
           success: function(res){
             that.data.movie_lists['items'][index]['isLike'] = type_like;
             that.setData({
               movie_lists:that.data.movie_lists
             })
           }
         })
      }
    })
  },
  //跳转视频详情
  video_info:function(event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../video/video?id='+id,
    })
  },
  //切换栏目
  tab_check:function(event){
    var tab = event.currentTarget.dataset.tab;
    if(tab=="last"){
      this.setData({
        last_show:'active',
        hot_show:''
      })
    }
    if(tab=="hot"){
      this.setData({
        last_show:'',
        hot_show:'active'
      })
    }
  },
  //返回首页
  go_home:function(event){
    wx.switchTab({
      url: '../index/index',
    })
  },
  //跳转tag
  go_tag:function(event){
    let keyword = event.currentTarget.dataset.tag;
    wx.redirectTo({
      url: '../topic/topic?keyword='+keyword,
    })
  }
})