require('../css/base.less')
require('../css/index.less')
import  * as api  from "./api.js";

window.onload = function () {
    
    api.controlRunningFn()

    api.itemClickFn()
    
   
    
}