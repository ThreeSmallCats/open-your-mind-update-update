
// 暂时没有使用，滚动是由batter-scroll插件提供
let startY = 0
let moveY = 0
let lastMoveY = 0

// 滚动函数
export function scrollFn(ele) {
    ele.onmousedown = function (event) {
        event = event || window.event
        startY = event.clientY
        // console.log(startY )
        // 当鼠标点击不放开后触发监听鼠标移动事件
        ele.addEventListener('mousemove',mouseMoveFn)
            
    }
    // 当鼠标点击放开后清除监听鼠标移动事件
    ele.onmouseup = function () {
        lastMoveY = lastMoveY + moveY
        console.log('last',lastMoveY)
        ele.removeEventListener('mousemove',mouseMoveFn)
    }
    // 鼠标移动时触发的函数
    function mouseMoveFn(event) {
        event = event ||window.event
        let endY = event.clientY
        moveY = endY - startY
        console.log('now',moveY)
        ele.style.transform = `translateY(${lastMoveY+moveY}px)`
    }
}