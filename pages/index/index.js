let common = require('../../common.js');
Page({
  data:{},
  onLoad:function(options){
    var that = this;
      wx.request({
        url: 'https://api.dangcdn.com/haqucom/catelist',
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function(res){
          if(typeof(res.data) == 'string'){
            res.data = common.android_data(res.data);
          }
          that.setData({
            nav_lists:res.data.items
          })
        },
        flase:function(res){
          that.setData({
            error:res
          })
        }
      });
      this.default_params();
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    this.setData({
      "nav_lists[0].active":'active'
    })
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    this.getvideolists(this.data.network,true);
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    this.loading_animation()
    this.getvideolists(this.data.network);
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: this.data.title, // 分享标题
      desc: this.data.desc, // 分享描述
      path: this.data.path // 分享路径
    }
  },
  loading_animation:function(){
    if(this.data.loading){
        this.setData({
          loading:''
        })
    }else{
      this.setData({
        loading:'loading'
      })
    }
  },
//切换导航
  check_nav:function(event){
    for(let i=0;i<this.data.nav_lists.length;i++){
      this.data.nav_lists[i]['active']='';
    }
    let active = event.currentTarget.dataset.index;
    this.data.nav_lists[active]['active']= 'active';
    this.setData({
      nav_lists:this.data.nav_lists
    })
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
        that.getvideolists(that.data.network);
      }
    });
  },
//获取视频列表
  getvideolists:function(common_params,new_nav){
    let that =this;
    let url='https://api.dangcdn.com/haqusvdweb/svdlist';
    let catid = that.data.catid?that.data.catid:99;
    let date = new Date();
    let params = {
        times:date.getTime(),
        nonce:Math.round(Math.random()*1000000),
        catid:catid,
        utoken:'',
        sign:'weixin'
    };
    let data =Object.assign(params,common_params);
    wx.request({
      url: url,
      data:data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
         'Accept': 'application/json'
      }, // 设置请求的 header
      dataType:'json',
      success: function(res){
        wx.stopPullDownRefresh();
        //安卓处理数据
        if(typeof(res.data) == 'string'){
            res.data = common.android_data(res.data);
        }
        //处理tags，出过来时id需要文字
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
            //处理播放数量超过一万显示文字
            if(res.data.items[i]['playNum']/10000 >= 1){
                res.data.items[i]['playNum'] = Math.floor(res.data.items[i]['playNum']/10000)+'万+'
            }
            //刷新处理追加到数组当中
            if(that.data.movie_lists){
              that.data.movie_lists.items.push(res.data.items[i]);
            }
            
        }
        if(that.data.movie_lists && !new_nav){//将数据更新到页面
            that.setData({
              'movie_lists.items':that.data.movie_lists.items,
            })
        }else{
          that.setData({
            movie_lists:res.data
          })
        }
      }
    })
  },
  //点击跳转不涉及更多导航
  gourl:function(event){
    this.check_nav(event);
    let catid = event.target.dataset.catid;
    this.setData({
      'data.catid':catid,
    })
    this.getvideolists(this.data.network,true)
  },
  //跳转导航
  gonavurl: function(event) {
    let catid = event.target.dataset.catid;
    this.setData({
      'data.catid':catid,
    })
    this.getvideolists(this.data.network,true)
    this.more_nav();
  },
  //跳转详情
  video_info:function(event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../video/video?id='+id,
    })
  },
//跳转tag
  go_tag:function(event){
    let keyword = event.currentTarget.dataset.tag;
    wx.navigateTo({
      url: '../topic/topic?keyword='+keyword,
    })
  }
})