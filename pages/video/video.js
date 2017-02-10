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
    this.comment_list(this.data.network);
    this.setData({
      utoken:wx.getStorageSync('utoken')
    })
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
    let params_comment = {
        vid:this.data.id,
        page:comment_page?comment_page:1,
    };
    let data = Object.assign(params_comment,default_para);
    wx.request({
      url: 'https://api.dangcdn.com/haqucomment/commentlist',
      data: data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(data)
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
        console.log(that.data.comment_list)
        }
        
      }
    })
  },
  //点赞
  zan:function(event){
    let zantype = event.currentTarget.dataset.type;
    let zanid = event.currentTarget.dataset.id;
    let default_prama = common.detault_params(this.data.network.network);
    let that=this;
    var data_zan = {
        utoken:this.data.utoken,
        vid:zanid,
        type:Number(zantype),
        times:(new Date()).getTime(),
        nonce:Math.round(Math.random()*1000000)
    }
    let data_zan_post = Object.assign(default_prama,data_zan);
    wx.request({
      url: 'https://api.dangcdn.com/WxEncode',
      data: data_zan_post,
      method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type":"application/x-www-form-urlencoded"
      },
      success: function(msg){
        wx.request({
          url: 'https://api.dangcdn.com/haquevent/updwn',
          data: msg.data,
          method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            "Content-Type":"application/x-www-form-urlencoded"
          },
          success: function(res){
            console.log(res)
            if(res.data.event=="dwn"){
                let num_old = that.data.video.info.dwnNum;
                that.setData({
                  'video.info.dwnNum':Number(num_old)+1
                })
            }
            if(res.data.event=="up"){
                let num_old = that.data.video.info.upNum;
                that.setData({
                  'video.info.upNum':Number(num_old)+1
                })
            }
          }
        })
      }
    })
  },
  //评论点赞
  comment_zan:function(event){
    let cmmtid = event.currentTarget.dataset.cmmtid;
    let checked = event.currentTarget.dataset.clicked
    let vid = this.data.video.info.id;
    let index = event.currentTarget.dataset.index;
    let default_prama = common.detault_params(this.data.network.network);
    let that=this;
    if(checked){
      return false;
    }else{
      this.data.comment_list[index]['clicked'] = true;
        that.setData({
          comment_list:that.data.comment_list
        })
    }
    let data_zan_comment = {
        utoken:this.data.utoken,
        vid:vid,
        cmmtid:cmmtid,
        times:(new Date()).getTime(),
        nonce:Math.round(Math.random()*1000000)
    }
    let data = Object.assign(default_prama,data_zan_comment);
    wx.request({
      url: 'https://api.dangcdn.com/WxEncode',
      data: data,
      method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
            "Content-Type":"application/x-www-form-urlencoded"
          },
      success: function(msg){
        wx.request({
          url: 'https://api.dangcdn.com/haquevent/cmmtlike',
          data: msg.data,
          method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            "Content-Type":"application/x-www-form-urlencoded"
          },
          success: function(res){
            console.log(res)
            if(res.data.code==6200){
                let old_num = event.currentTarget.dataset.value;
                let new_num = Number(old_num)+1;
                that.data.comment_list[index]['diggCnt'] = new_num;
                that.setData({
                  comment_list:that.data.comment_list
                })
            }
          }
        })
      }
    })
  },
  //显示预加载
  comment_list_resher:function(){
    this.setData({
      comment_list:this.data.comment_list_next
    });
    console.log(this.data.comment_page)
    this.comment_list(this.data.network,this.data.comment_page)
  },
  //展开评论
  comment_auto:function(event){
    let index=event.currentTarget.dataset.index;
    let status = event.currentTarget.dataset.status;
    if(status){
      this.data.comment_list[index]['heightAuto'] =false;
    }else{
      this.data.comment_list[index]['heightAuto'] =true;
    }
    console.log(this.data.comment_list[index]);
    this.setData({
      comment_list:this.data.comment_list
    })
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