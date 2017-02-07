// pages/video/video.js
let common = require('../../common.js');
Page({
  data:{
    comment_page:1
  },
  onLoad:function(options){
       this.setData({
         id:options.id,
         isShare:options.share?options.share:''
       });
       this.default_params();
  },
  onReady:function(){
    this.recommond_video(this.data.network);
    this.comment_list(this.data.network)
  },
  onReachBottom: function() {
    this.comment_list_resher()
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
      return {
        title: this.data.video.info.title, // 分享标题
        desc: '哈趣视频', // 分享描述
        path: '/pages/video/video?id='+this.data.video.info.id+'&share=1' // 分享路径
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
        that.getinfo(common_data);
      }
    });
  },
  //获取video详情
  getinfo:function(default_para){
    let that = this;
    let id =this.data.id;
    let params ={
        vid:id,
    }
    let data = Object.assign(default_para,params);
    wx.request({
      url: 'https://api.dangcdn.com/haqusvd/svddetail',
      data: data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        if(typeof(res.data)=='string'){
           res.data = common.android_data(res.data);
        }
        if(res.data.info['playNum']/10000 >= 1){
          res.data.info['playNum'] = Math.floor(res.data.info['playNum']/10000)+'万'
        }
        that.setData({
          video:res.data,
          cateId:res.data.info.cateId
        })
      }
    })
  },
  //获取相关视频列表
  recommond_video:function(default_para){
    let that=this;
    let time = new Date();
    console.log(default_para);
    let params = {
        vid:this.data.id,
        times:time.getTime(),
        nonce:Math.random(100000,999999),
        catid:this.data.cateId
    }
    let data = Object.assign(default_para,params);
    wx.request({
      url: 'https://api.dangcdn.com/haqusvdweb/svdrecommend',
      data: data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        if(typeof(res.data)=='string'){
           res.data = common.android_data(res.data);
        }
        that.setData({
          relation:res.data
        })
      }
    })
  },
  //获取评论列表(如果comment_page大于1则是预加载)
  comment_list:function(default_para,comment_page){
    let that=this;
    let params = {
        vid:this.data.id,
        page:comment_page?comment_page:1,
    };
    let data = Object.assign(default_para,params);
    wx.request({
      url: 'https://api.dangcdn.com/haqucomment/commentlist',
      data: data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        if(typeof(res.data)=='string'){
           res.data = common.android_data(res.data);
        }
        if(comment_page){
          for(let i=0;i<res.data.items.length;i++){
            var d=new Date(res.data.items[i]['createTime']*1000);
            res.data.items[i]['createTime']=d.getFullYear()+'/'+d.getMonth()+'/'+d.getDate();
            that.data.comment_list.push(res.data.items[i]);
          }
        }
        if(!comment_page){
          for(let i=0;i<res.data.items.length;i++){
            var d=new Date(res.data.items[i]['createTime']*1000);
            res.data.items[i]['createTime']=d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate();
          }
            that.data.comment_list=res.data.items;
        }
        if(comment_page < 2){
          that.setData({
            comment_list: that.data.comment_list,
            comment_page: (that.data.comment_page + 1)
          })
        }else{
          that.setData({
            comment_list_next: that.data.comment_list,
            comment_page: (that.data.comment_page + 1)
          })
        }
        
      }
    })
  },
  //点赞
  zan:function(event){
    let zantype = event.currentTarget.dataset.type;
    let zanid = event.currentTarget.dataset.id;
    let default_prama = this.data.network;
    let data_zan = {
        utoken:'',
        vid:zanid,
        type:zantype,
        times:(new Date()).getTime(),
        nonce:Math.round(Math.random()*1000000),
        sign:'mini'
    }
    let data = Object.assign(data_zan,default_prama);
    console.log(data);
  },
  //评论点赞
  comment_zan:function(event){
    let cmmtid = event.currentTarget.dataset.cmmtid;
    let vid = this.data.video.info.id;
    let default_prama = this.data.network;
    let data_zan = {
        utoken:'',
        vid:vid,
        cmmtid:cmmtid,
        times:(new Date()).getTime(),
        nonce:Math.round(Math.random()*1000000),
        sign:'mini'
    }
    let data = Object.assign(data_zan,default_prama);
    console.log(default_prama);
  },
  //显示预加载
  comment_list_resher:function(){
    this.setData({
      comment_list:this.data.comment_list_next
    });
    this.comment_list(this.data.network,this.data.comment_page)
  },
  //跳转到详情
  video_info:function(event){
    let id = event.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../video/video?id='+id,
    })
  },
  //返回首页
  go_home:function(event){
    console.log(event)
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