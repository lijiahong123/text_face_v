const app = getApp()
import {
    query
} from '../../utils/util.js'

const obj = {
    expression: {
        none: '不笑',
        smile: '微笑',
        laugh: '大笑'
    },
    gender: {
        male: '男生',
        female: '女生'
    },
    glasses: {
        none: '无眼镜',
        common: '普通眼镜',
        sun: '墨镜'
    },
    emotion: {
        angry: '愤怒',
        disgust: '厌恶',
        fear: '恐惧',
        happy: '高兴',
        sad: '伤心',
        surprise: '惊讶',
        neutral: '无表情',
        pouty: '撅嘴',
        grimace: '鬼脸'
    }
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 窗口可用高度
        windowHeight: 0,
        // 摄像头朝向  back   front
        isfront: true,
        // 照片路径
        src: '',
        // 测出来的颜值
        face: null
    },

    // 翻转摄像头
    reversecamera() {
        this.setData({
            isfront: !this.data.isfront
        })
    },

    // 点击拍照按钮
    takePhoto() {
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                this.setData({
                    src: res.tempImagePath
                }, () => this.getfacevalue())
            }
        })
    },

    // 点击相册选择
    chooseImage() {
        wx.chooseImage({
            count: 1,
            success: res => {
                res.tempFilePaths.length && this.setData({
                    src: res.tempFilePaths[0]
                }, () => this.getfacevalue())
            },
            fail: () => {
                console.log(this)
                this.setData({
                    src: ''
                })
                wx.showToast({
                    title: '未选择照片',
                    icon: 'none'
                })
            }
        })
    },

    // 点击重新选择
    rechoosepic() {
        this.setData({
            src: ''
        })
    },

    // 测颜值函数
    getfacevalue() {
        const {
            token: access_token
        } = app.store
        if (access_token) {
            const file = wx.getFileSystemManager()
            const base64 = file.readFileSync(this.data.src, 'base64')

            wx.showLoading({
                title: '正在检测中..'
            });

            wx.request({
                url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect' + query({
                    access_token
                }),
                method: 'post',
                header: {
                    'Content-Type': 'application/json'
                },
                data: {
                    image: base64,
                    image_type: 'BASE64',
                    // 年龄,颜值,
                    face_field: 'age,beauty,expression,gender,glasses,emotion'
                },
                success: ({
                    data: {
                        result
                    }
                }) => {
                    if (result && result.face_num) {
                        const {
                            age,
                            beauty,
                            expression: {
                                type: expression
                            },
                            gender: {
                                type: gender
                            },
                            glasses: {
                                type: glasses
                            },
                            emotion: {
                                type: emotion
                            }
                        } = result.face_list[0]

                        this.setData({
                            face: {
                                age,
                                beauty,
                                expression: obj.expression[expression],
                                gender: obj.gender[gender],
                                glasses: obj.glasses[glasses],
                                emotion: obj.emotion[emotion]
                            }
                        })

                    } else {
                        wx.showToast({
                            title: '人脸识别失败',
                            icon: 'none'
                        })
                    }
                },
                fail() {
                    wx.showToast({
                        title: '人脸识别失败！',
                        icon: 'none'
                    })
                },
                complete() {
                    wx.hideLoading();
                }
            })
        } else {
            wx.showToast({
                title: '连接 AI 接口失败！',
                icon: 'none'
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const {
            windowHeight
        } = wx.getSystemInfoSync()
        this.setData({
            windowHeight
        })

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})