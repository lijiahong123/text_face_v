import { query } from './utils/util.js'

App({
    store:{
        token:''
    },

    gettoken(){
        const params = {
            grant_type: 'client_credentials',
            client_id: 'IwrKu4GZXH6bdKug8KDqdNic',
            client_secret: '4HbVjfKHBCuyA39YHtj8xq5yOiDoWUpr '
        }
        wx.request({
            url: 'https://aip.baidubce.com/oauth/2.0/token' + query(params),
            method: 'post',
            success: res => {
                this.store.token = res.data.access_token
            },
            fail: function (res) {
                wx.showToast({
                    title: '调用接口失败!!',
                    icon: 'none'
                })
            },
        })
    },


  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
      this.gettoken()
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
