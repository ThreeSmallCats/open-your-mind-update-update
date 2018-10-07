require('../css/base.less')
require('../css/index.less')
import  * as api  from "./api.js";

window.onload = function () {
    // 网站跳转
    let docwidth = window.screen.availWidth
    if (docwidth <= 640) {
        window.location.href = 'https://tscats.cn/openphone'
    }
     window.addEventListener('resize', function () {
        //  屏幕可用工作区宽度
         let docW = window.screen.availWidth
        //  console.log(docW)
         if (docW <= 640) {

             window.location.href = 'https://tscats.cn/openphone'
         }
     })
    
    api.controlRunningFn()

    api.itemClickFn()
    
   
    
}