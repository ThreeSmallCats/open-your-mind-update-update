/*
 * @Author: TSCats 
 * @Date: 2018-07-26 18:12:43 
 * @Last Modified by: TSCats
 * @Last Modified time: 2018-10-07 13:53:26
 */

// 数据仓库
import * as store from './store.js'
// 数据请求和模板处理
import {
    dataApi
} from "./dataApi.js";
// 滚动函数
// import { scrollFn } from "../js/scroll.js";
// let BScroll = require('better-scroll')
import BScroll from "better-scroll";
//模板
let aboutTemplate = require("../template/about.string")
let jokeTemlate = require('../template/joke.string')
let pictemplate = require('../template/picture.string')
let guessTemplate = require('../template/guess.string')
// 公共变量
let contentUl = document.querySelector('#content-ul')
let contentLiArr = contentUl.children
let contentData = document.querySelector('.content-data')
let showType = 'about'
let guessTypeBox = document.querySelector('.guess-type-box')
let more = document.querySelector('.more')
let answer = document.querySelector('.answer')
let guessArr = []
let guessType = 'gxmy'
// .................轮播...................
export function controlRunningFn() {
    // 初始化轮播位置数据
    let controlDataArr = [{
            byLeft: -20,
            byScale: 0.8,
            byOpacity: 0.7,
            byZIndex: 1,


        },
        {
            byLeft: 30,
            byScale: 0.5,
            byOpacity: 0.5,
            byZIndex: 1,

        },
        {
            byLeft: 80,
            byScale: 0.8,
            byOpacity: 0.7,
            byZIndex: 1,


        },
        {
            byLeft: 30,
            byScale: 1,
            byOpacity: 1,
            byZIndex: 2,


        },
    ]
    // 初始化轮播颜色数据
    let controlDataBgcArr = ['#9999FF', 'rgb(0, 146, 252)', '#66CC99', '#FF6666']
    let controlLeft = document.querySelector('.left')
    let controlRight = document.querySelector('.right')
    let controlNum = 0
    // 初始化轮播
    function controlRunning() {

        for (let i = 0; i < contentLiArr.length; i++) {
            contentLiArr[i].style.left = controlDataArr[i].byLeft + '%'
            contentLiArr[i].style.opacity = controlDataArr[i].byOpacity
            contentLiArr[i].style.zIndex = controlDataArr[i].byZIndex
            contentLiArr[i].style.transform = 'scale(' + controlDataArr[i].byScale + ')'
            contentLiArr[i].style.width = '40%'
            contentLiArr[i].style.background = controlDataBgcArr[i]

        }
        // 防止连续点击崩溃
        contentLiArr[1].addEventListener('transitionend', function () {
            controlNum = 1
        })
    }
    controlRunning()
    // 点击方向健轮播（原理修改初始化轮播数据的排列顺序）
    controlRight.onclick = function () {
        if (controlNum == 1) {
            let go = controlDataArr.splice(3, 1)
            controlDataArr.splice(0, 0, go[0])
            controlRunning()
        }
        controlNum = 0
    }
    controlLeft.onclick = function () {
        if (controlNum == 1) {
            let go = controlDataArr.splice(0, 1)
            controlDataArr.splice(3, 0, go[0])
            controlRunning()
        }
        controlNum = 0
    }
}


// ...............动画点击事件............
export function itemClickFn() {
    // 创建轮播每一项的点击事件
    for (let i = 0; i < contentLiArr.length; i++) {
        contentLiArr[i].onclick = function (event) {
            // 修改了这里。。。。。。。。。event.target变成 contentLiArr[i]
            let ele = contentLiArr[i]
            let state = contentLiArr[i].dataset.state
            let controlLeft = document.querySelector('.left')
            let controlRight = document.querySelector('.right')
            let twoArr = document.querySelectorAll('.two')

            // 获取当前类型
            showType = ele.dataset.type
            if (showType == 'guess') {
                guessTypeBox.style.width = '20%'
            }
            // console.log(showType)

            // 还原轮播
            if (state == 'show') {
                ele.dataset.state = 'hide'
                // 控制刷新按钮和答案按钮的显示和隐藏
                more.style.display = 'none'
                answer.style.display = 'none'

                guessTypeBox.style.right = '-100%'
                guessTypeBox.style.display = 'none'

                contentData.classList.remove('active')
                contentData.classList.add('hide')
                // contentUl.style.border = '1px solid'
                // 用仓库数据还原轮播原始状态
                setTimeout(() => {

                    ele.style.left = store.oldLeft
                    ele.style.width = store.oldWidth
                    ele.style.transform = store.oldScale
                }, 250);
                // 使用时间函数为了更好的视觉效果
                setTimeout(() => {
                    controlLeft.style.display = 'block'
                    controlRight.style.display = 'block'
                }, 500);

                for (let i = 0; i < contentLiArr.length; i++) {
                    // 使用时间函数为了更好的视觉效果
                    setTimeout(() => {

                        contentLiArr[i].style.width = '40%'
                        contentLiArr[i].style.opacity = 1
                        contentLiArr[i].style.borderRadius = '10px'
                        twoArr[i].style.display = 'block'
                    }, 500);
                }
                return
                // 修改轮播
            } else if (state == 'hide') {
                more.style.background = ele.style.background
                // 获取数据
                // guessTypeBox.style.display = 'block'

                ajaxData(showType)
                // 谜语侧边栏动画控制
                if (showType == 'guess') {
                    guessTypeBox.style.display = 'block'
                    setTimeout(() => {

                        guessTypeBox.style.right = '-20%'
                    }, 500);
                }



                // 更新仓库数据
                store.oldLeft = ele.style.left
                store.oldScale = ele.style.transform
                store.oldWidth = ele.style.width
                store.background = ele.style.background


                // console.log(store.background)
                // 隐藏方向健
                controlLeft.style.display = 'none'
                controlRight.style.display = 'none'
                // 使用排他思想改变轮播每一项的style
                for (let i = 0; i < contentLiArr.length; i++) {
                    contentLiArr[i].style.width = 0
                    contentLiArr[i].style.opacity = 0
                    contentLiArr[i].style.borderRadius = '0'
                    twoArr[i].style.display = 'none'

                }
                // 改变轮播点击项的style
                contentLiArr[i].style.opacity = 1
                ele.dataset.state = 'show'
                ele.style.left = '-10%'
                ele.style.width = '10%'
                ele.style.transform = 'scale(1)'
                // 使用时间函数为了更好的视觉效果
                setTimeout(() => {

                    contentData.classList.remove('hide')
                    contentData.classList.add('active')
                    contentData.style.border = `1px solid ${store.background}`
                }, 500);

                return
            }
        }
    }
}

// 获取数据
function ajaxData(showType) {
    if (showType == 'about') {
        // 控制刷新按钮和答案按钮的显示和隐藏
        more.style.display = 'none'
        answer.style.display = 'none'
        // 获取数据位置
        // ........................
        // console.log(dataApi)
        let html = dataApi.getHtml(aboutTemplate, {
            data: 'a'
        })
        // console.log(aboutHtml)
        // 渲染模板
        contentData.innerHTML = html
        let download = document.querySelector('#download')
        let androidOrIphone = navigator.userAgent.toLowerCase();
        download.onclick = function (event) {
            event = event || window.event
            if (/iphone|ipad|ipod/.test(androidOrIphone)) {
                alert('对不起，我们暂时只有安卓的app')
                event.preventDefault();
            } else if (/android/.test(androidOrIphone)) {

            } else if (/window/.test(androidOrIphone)) {

            }
        }
    } else if (showType == 'joke') {
        // 刷新功能
        moreBtn(showType)
        // 控制刷新按钮和答案按钮的显示和隐藏
        more.style.display = 'block'
        answer.style.display = 'none'
        //  笑话数据加载
        jokeData()
    } else if (showType == 'guess') {
        // 刷新功能
        moreBtn(showType)
        // 控制刷新按钮和答案按钮的显示和隐藏
        more.style.display = 'block'
        answer.style.display = 'block'
        let guessTypeArr = guessTypeBox.children

        guessData(guessType)
        for (let i = 0; i < guessTypeArr.length; i++) {
            guessTypeArr[i].onclick = function (event) {
                event = event || window.event
                guessType = event.target.dataset.guessType
                // console.log(guessType)
                for (let i = 0; i < guessTypeArr.length; i++) {
                    guessTypeArr[i].classList.remove('active')

                }
                event.target.classList.add('active')
                // 获取数据位置
                // .............................
                guessData(guessType)
            }

        }

    } else if (showType == 'picture') {
        // 刷新功能
        moreBtn(showType)
        // 控制刷新按钮和答案按钮的显示和隐藏
        more.style.display = 'block'
        answer.style.display = 'none'
        // 获取数据位置
        // ........................
        //  图片数据加载（数据不稳定，暂时不提供）
        picData()

    }
}
// 笑话数据加载函数
function jokeData() {
    contentData.innerHTML = '<span>该接口已经关闭，剩下谜语接口了</span>'
    dataApi.getJoke(dataApi.pages('笑话').oldpage).then((res) => {
        let jokedata = res.showapi_res_body.contentlist
        
        // 对笑话文本进行简单处理
        for (let i = 0; i < jokedata.length; i++) {
            jokedata[i].text = jokedata[i].text.replace(/<br \/>/g, '')
            jokedata[i].text = jokedata[i].text.replace(/<br>/g, '')
            
        }
        // 渲染模板
        let html = dataApi.getHtml(jokeTemlate, {
            data: jokedata
        })
        // console.log(html)
        contentData.innerHTML = html
        // 滚动函数
        // 时间函数为了等数据加载完
        setTimeout(() => {
            let jokeBox = document.querySelector('.joke')
            // console.log(jokeBox)
            // scrollFn(jokeBox)
            let jokeArr = jokeBox.children
            // console.log(jokeArr)
            let liHeight = 0

            for (let i = 0; i < jokeArr.length; i++) {
                liHeight += jokeArr[i].offsetHeight
                
            }
            // console.log(liHeight)
            jokeBox.style.height = liHeight + 20 * 5 + 10 + 'px'

            let scroll = new BScroll(contentData)
        }, 1000);


    })
}
// 图片数据加载函数
function picData() {
    dataApi.getPic(dataApi.pages('图片').oldpage).then((res) => {
        let picdata = res.showapi_res_body.contentlist
        let html = dataApi.getHtml(pictemplate, {
            data: picdata
        })
        contentData.innerHTML = html
    })
}

// 谜语数据加载函数
function guessData(guessType) {
    dataApi.getGuess(guessType, dataApi.pages(guessType).oldpage).then((res) => {
        // console.log(res)
        let guessData = res.showapi_res_body.pb.contentlist
        
        let html = dataApi.getHtml(guessTemplate, {
            data: guessData
        })
        contentData.innerHTML = html
        // 时间函数为了等数据加载完
        setTimeout(() => {
            let guessBox = document.querySelector('.guess')
            guessArr = guessBox.children
            // console.log(guessArr)
            let liHeight = 0

            for (let i = 0; i < guessArr.length; i++) {
                liHeight += guessArr[i].offsetHeight
                // console.log(guessArr[i].offsetHeight)
            }
            // console.log(liHeight)
            guessBox.style.height = liHeight + 20 * 10 + 'px'

            let scroll = new BScroll(contentData)
            answerData()
        }, 500);
    })
}
// 谜语答案加载
function answerData() {
    for (let i = 0; i < guessArr.length; i++) {
        guessArr[i].onclick = function (event) {
            event = event || window.event
            let answerText = event.target.dataset.answer
            answer.innerHTML = answerText
        }

    }

}

// 刷新按钮
function moreBtn(showType) {
    more.onclick = function () {

        if (showType == 'joke') {
            jokeData()
        } else if (showType == 'picture') {
            picData()
        } else if (showType == 'guess') {
            guessData(guessType)
        }
    }
}