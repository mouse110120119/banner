class Banner {
  constructor (className) {
    this.ele = document.querySelector(className)

    this.imgBox = this.ele.querySelector('.imgBox')

    this.pointBox = this.ele.querySelector('.pointBox')

    this.leftRightBox = this.ele.querySelector('.leftRightBox')

    // 提前准备保存索引的变量
    this.index = 0

    // 提前准备一个定时器变量
    this.timer = null

    // 准备一个节流阀
    this.loopFlag = true

    // 入口函数调用
    this.init()
  }

  init () {
    this.setPoint()
    this.autoLoop()
    this.overOut()
    this.leftRightEvent()
    this.pointEvent()
  }

  // 1. 设置 point
  setPoint () {
    const num = this.imgBox.children.length

    for (let i = 0; i < num; i++) {
      const li = document.createElement('li')

      if (i === 0) {
        li.className = 'active'
      }

      // 在最开始的时候存储一下索引
      li.setAttribute('index', i)

      this.pointBox.appendChild(li)
    }

    this.pointBox.style.width = num * 20 + 'px'
  }

  // 2. 动起来
  autoLoop () {
    // 我也要依靠 index++
    this.timer = setInterval(() => {
      this.change(true)
    }, 1500)
  }

  // 2-1. 切换一次的行为
  change (boo) {
    // 在这个函接受一个形参
    // 如果 boo === true index++
    // 如果 boo === false index--

    // 在这里的时候 this.index === 0
    this.imgBox.children[this.index].style.opacity = 0

    // 在 change 函数内部做 this.index--

    if (boo) {
      this.index++
    } else {
      this.index--
    }

    // 只要你 ++ 完毕以后得不到5
    if (this.index >= this.imgBox.children.length) {
      this.index = 0
    }

    // 加一个条件判断
    // index < 0 的时候
    if (this.index < 0) {
      this.index = this.imgBox.children.length - 1
    }

    // 在这里找的下一张
    this.imgBox.children[this.index].style.opacity = 1

    // 要让所有的焦点没有 active
    // 索引对应的焦点有 active
    for (let i = 0; i < this.pointBox.children.length; i++) {
      this.pointBox.children[i].className = ''
    }
    this.pointBox.children[this.index].className = 'active'
    // this.imgBox.children[this.index] 在 从 opacity 0 向 opacity 1 过度
    // 过度结束的时候 opacity === 1 的时候就结束了
    // 在过度结束的时候把开关打开
    // transitionend 事件可以知道你过度结束了
    // this.imgBox.children[this.index].addEventListener('transitionend', () => {
    //   console.log('过度结束了')
    // })

    // 这个函数会越来越多
    this.imgBox.children[this.index].addEventListener('transitionend', () => {
      this.loopFlag = true
    })
  }

  // 3. overOut
  overOut () {
    this.ele.addEventListener('mouseover', () => clearInterval(this.timer))
    this.ele.addEventListener('mouseout', () => this.autoLoop())
  }

  // 4. 左右切换
  leftRightEvent () {
    this.leftRightBox.addEventListener('click', e => {
      e = e || window.event

      if (this.loopFlag === false) {
        return
      }

      this.loopFlag = false

      if (e.target.className === 'left') {
        this.change(false)
      }

      if (e.target.className === 'right') {
        this.change(true)
      }
    })
  }

  // 5. 点击焦点按钮切换
  pointEvent () {
    const _this = this
    for (let i = 0; i < this.pointBox.children.length; i++) {
      this.pointBox.children[i].addEventListener('click', function () {
        // 焦点按钮的索引就是我要切换的索引
        const index = this.getAttribute('index')

        if (_this.loopFlag === false) {
          return
        }

        _this.loopFlag = false

        // 当前的这一张消失
        _this.imgBox.children[_this.index].style.opacity = 0

        _this.index = index

        _this.imgBox.children[_this.index].style.opacity = 1

        for (let i = 0; i < _this.pointBox.children.length; i++) {
          _this.pointBox.children[i].className = ''
        }

        _this.pointBox.children[_this.index].className = 'active'
      })
    }
  }
}
