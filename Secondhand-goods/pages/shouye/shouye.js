// pages/shouye/shouye.js
// var searchData =require('../../mapWeather/search/search.js')
// 此处的变量时search功能所需的
var bmap = require('../../utils/bmap-wx.min.js');
var app = getApp();
var wxMarkerData = [];
var searchData = {};
//系统此时的时间-小时
var timestamp = Date.parse(new Date());
var hover = new Date(timestamp).getHours();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 首页的轮播图
    imgUrls: [
      "/images/shouye/lunbotu7.jpg",
      "/images/shouye/lunbotu6.jpg",
      "/images/shouye/lunbotu3.png",
      "/images/shouye/lunbotu2.png",
    ],
    indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长
    inputShowed: false,
    inputVal: "",

    // 定位的数据
    search: {
      markers: [],
      latitude: '',
      longitude: '',
      placeData: {
        title: ''
      }
    },

    //背景颜色
    pageBackgroundColor: 'transparent',

    //时间天气数据
    weatherData: '',
    weather_data: [],
    weatherUrl: '',
    //电影数据
    inThearters: [], //热映
    comingSoon: [],  //天气
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // canvas
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.scale(0.7, 0.7)
    ctx.setLineWidth(2)
    ctx.moveTo(10, 10)
    ctx.lineTo(20, 20)
    ctx.lineTo(30, 10)
    ctx.setStrokeStyle('#3E97CC')
    ctx.stroke()
    ctx.draw()
    
    // 以下是页面加载时，加载定位的函数
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'zuwiVmIUj822mmW6psamM888QLz8Q5wF'
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (data) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
    var that = this;
    var schoolPlace = 'search.schoolPlace';
    var weatherUrl = that.data.weatherUrl;
    var weather_data = that.data.weather_data;
    wx.getStorage({
      key: 'schoolPlace',
      success: function(res) {
        that.setData({
          [schoolPlace]: res.data
        })
      },
    })
    wx.getStorage({
      key: 'weatherUrl',
      success: function(res) {
        that.setData({
          weatherUrl: res.data
        })
      },
    })
    wx.getStorage({
      key: 'weather_data',
      success: function(res) {
        that.setData({
          weather_data: res.data
        })
      },
    })
    var inTheartersURl = app.globalData.huanbaoBase + 'indexbook.php';
    var comingSoonURL = app.globalData.huanbaoBase + 'indexthing.php'
    //调用自定义函数，获取指定对象属性的数据；
    this.getMovieListData(inTheartersURl, 'inThearters');
    this.getMovieListData(comingSoonURL, 'comingSoon');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
 
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.setNavigationBarTitle({
      title: '校园二手交易'
    });
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //位置标记的三个函数
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.changeMarkerColor(wxMarkerData, id);
  },
  showSearchInfo: function (data, i) {

    
    var that = this;
    var placeData = 'search.placeData';
    
    that.setData({
      [placeData]: {
        title:  data[i].title + '\n',
        address: '地址：' + data[i].address + '\n',
        telephone: '电话：' + data[i].telephone
      }
    });
    
  },
  changeMarkerColor: function (data, id) {
    var that = this;
    var markersTemp = [];
    var markers = 'search.markers'
    for (var i = 0; i < data.length; i++) {
      if (i === id) {
        data[i].iconPath = "../../images/map/marker_yellow.png";
      } else {
        data[i].iconPath = "../../images/map/marker_red.png";
      }
      markersTemp[i] = data[i];
    }
    that.setData({
      [markers]: markersTemp
    });
  }, 

  //封装函数getMovieListData
  getMovieListData(url, _type) {
    var that = this;
    //加载资源的内部函数
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 5000
    });
    wx.request({
      url,//url:url,可以简写
      type: 'GET',
      header: { 'content-type': 'json' },
      success:function(res){
        console.log(res);
        that.setData({ [_type]: res.data.data })
        // that.setData({ [_type]: res.data.subjects })
      },
      fail: err => console.log(err),
      //请求完成后，触发函数
      complete() {
        //请求完成后，隐藏“加载中”
        wx.hideToast();
      }
    })
  },
  //搜索功能
  bindSearchBook() {
    wx.navigateTo({
      url: '../search-book/search-book',
    })
  },
  
  //点击“更多”
  bindToMore(event) {
    var typeId = event.currentTarget.dataset.typeId;
    wx.navigateTo({
      url: '../sonShouye/movie-more/movie-more?typeId=' + typeId,
    })
  },
  //电影详情
  toDetail(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + id,
    })
  },
    toThingsDetail(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../thing-detail/thing-detail?id=' + id,
    })
  }
})

