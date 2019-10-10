/*
  参数
    元素
    目标位置
    结束后的回调函数

    运动
      当前位置到目标位置的距离 / 运动系数 = 本次运动的距离

      赋值的时候
      当前位置 + 本次应该运动的距离
*/

/**
 * move 运动函数
 * @param {DOM} ele  =>  要运动的 dom 元素
 * @param {OBJECT} target  =>  运动的目标位置
 * @param {FUNCTION} callback  =>  运动结束执行的函数
 */
function move(ele, target, callback) {
  // 因为多个属性的运动
  // 准备一个对象用来保存定时器
  const obj = {}
  for (let attr in target) {
    // 有多少属性就开启多少个定时器
    obj[attr] = setInterval(() => {
      // 获取一个非行间样式
      let curAttr
      if (attr === 'opacity') {
        curAttr = parseFloat(getStyle(ele, attr) * 100)
      } else {
        curAttr = parseInt(getStyle(ele, attr))
      }

      // 计算应该运动的距离
      let speed = (target[attr] - curAttr) / 5
      // 取整的运算
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)

      // 赋值
      // 如果没有达到目标位置，那么就赋值
      // 如果达到目标位置就结束
      if (target[attr] === curAttr) {
        // 关闭定时器
        clearInterval(obj[attr])
        // 把对象里面的对应成员删除
        delete obj[attr]

        // 判断是不是所有运动都结束了
        if (getTimerLength(obj) === 0) {
          // 运动结束
          callback && callback()
        }

      } else {
        if (attr === 'opacity') {
          ele.style[attr] = (curAttr + speed) / 100
        } else {
          ele.style[attr] = curAttr + speed + 'px'
        }
      }
    }, 30)
  }
}

/**
 * getAtyle 获取非行间眼视光hi
 * @param {DOM} ele  =>  获取哪个元素的非行间样式
 * @param {STRING} attr  =>  获取哪个样式
 * @return {STRING}  =>  你获取到的元素的样式的值
 */
function getStyle(ele, attr) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(ele)[attr]
  } else {
    return ele.currentStyle[attr]
  }
}


function getTimerLength(obj) {
  let n = 0
  for (let attr in obj) {
    n++
  }
  return n
}
