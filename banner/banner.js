class Banner {
  constructor (className) {
    this.ele = document.querySelector(className)

    // 获取 imgBox
    this.imgBox = this.ele.querySelector('.imgBox')

    // 获取 pointBox
    this.pointBox = this.ele.querySelector('.pointBox')

    // 获取左右切换按钮的盒子
    this.leftRightBox = this.ele.querySelector('.leftRightBox')

    // 获取一下可视窗口的宽度
    this.boxWidth = this.ele.clientWidth

    // 准备 索引 index
    this.index = 1

    // 准备一个变量记录定时器
    this.timer = null

    // 提前准备一个 开关变量
    this.loopFlag = true

    // new 的时候就要执行总调度函数
    this.init()
  }

  // 总调度的函数 init
  init () {
    // 1. 设置焦点
    this.setPoint()
    // 2. 复制元素
    this.copyEle()
    // 3. 自动轮播
    this.autoLoop()
    // 4. 移入移出
    this.overOut()
    // 5. 点击左右按钮切换
    this.leftRightEvent()
    // 6. 点击焦点按钮切换
    this.pointEvent()
  }

  // 1. 设置焦点
  setPoint () {
    const num = this.imgBox.children.length

    for (let i = 0; i < num; i++) {
      const li = document.createElement('li')

      // 由某一个 li 由 active 类名
      if (i === 0) {
        li.className = 'active'
      }

      // 在设置焦点的时候就把 索引保存在元素的身上
      li.setAttribute('index', i + 1)
      this.pointBox.appendChild(li)
    }

    this.pointBox.style.width = num * 30 + 'px'
  }

  // 2. 复制元素
  copyEle () {
    // 把原先的第一个和最后一个复制一份下来
    const first = this.imgBox.children[0].cloneNode(true)
    const last = this.imgBox.children[this.imgBox.children.length - 1].cloneNode(true)

    // 把复制的元素插入页面中
    this.imgBox.appendChild(first)
    this.imgBox.insertBefore(last, this.imgBox.children[0])

    // ul 的宽度不够了，我要从新设置
    // ul 的宽度就等于 子元素的个数成 可视窗口的宽度
    this.imgBox.style.width = this.imgBox.children.length * this.boxWidth + 'px'

    // 设置完毕以后，ul 停留再 left 0 的位置
    // 调整 ul 的left 值
    this.imgBox.style.left = -this.index * this.boxWidth + 'px'
  }

  // 3. 自动轮播
  autoLoop () {
    this.timer = setInterval(() => {
      // 要让 轮播图 动起来
      // move 函数
      this.index++

      // 这里调用的 this.moveEnd 函数
      // 想办法让你的 this 指向当前实例
      // 强行改变 this 指向 call / apply / bind
      // call / apply 会立即执行函数
      // bind 会返回一个新的函数，新的函数内部 this 已经被该改变
      // 我这个位置的 this 就是当前实例
      // 使用 bind 方法的时候，让你 this.moveEnd 函数 内部的 this 指向当前实例
      move(this.imgBox, { left: -this.index * this.boxWidth }, this.moveEnd.bind(this))
    }, 1000)
  }

  // 3-1. 运动结束的函数
  moveEnd () {
    // 如果这个函数里面的 this 指向当前实例，那么我就能拿到 index
    // 如果这个函数里面的 this 不指向当前实例，那么肯定是拿不到 index

    // 判断 index === 最后一张的时候
    //   拉回到第一张
    if (this.index === this.imgBox.children.length - 1) {
      this.index = 1
      this.imgBox.style.left = -this.index * this.boxWidth + 'px'
    }

    // 判断 idnex === 0
    //   拉会到倒数第二章
    if (this.index === 0) {
      this.index = this.imgBox.children.length - 2
      this.imgBox.style.left = -this.index * this.boxWidth + 'px'
    }

    // 让焦点配套
    // 让所有焦点灭有 active
    for (let i = 0; i < this.pointBox.children.length; i++) {
      this.pointBox.children[i].className = ''
    }

    // 和索引配套的这个焦点按钮有 active 类名
    this.pointBox.children[this.index - 1].className = 'active'

    // 结束的时候把开关打开
    this.loopFlag = true
  }

  // 4. 移入移出
  overOut () {
    this.ele.addEventListener('mouseover', () => clearInterval(this.timer))
    this.ele.addEventListener('mouseout', () => this.autoLoop())
  }

  // 5. 点击左右按钮
  leftRightEvent () {
    this.leftRightBox.addEventListener('click', e => {
      e = e || window.event

      // 判断如果是 false，直接 return
      // 如果不是 false，我让你变成 false
      if (this.loopFlag === false) {
        return
      }

      this.loopFlag = false

      if (e.target.className === 'left') {
        this.index--
        move(this.imgBox, { left: -this.index * this.boxWidth }, this.moveEnd.bind(this))
      }

      if (e.target.className === 'right') {
        this.index++
        move(this.imgBox, { left: -this.index * this.boxWidth }, this.moveEnd.bind(this))
      }
    })
  }

  // 6. 点击焦点按钮可以切换
  pointEvent () {
    // 这里的 this 是指向当前实例的
    // _this 指向的就是当前实例
    const _this = this
    for (let i = 0; i < this.pointBox.children.length; i++) {
      this.pointBox.children[i].addEventListener('click', function () {
        // 这里的 this 才是我们点击的哪个焦点
        const index = this.getAttribute('index') - 0

        if (_this.loopFlag === false) {
          return
        }

        _this.loopFlag = false

        // 给 this.index 设置为我拿到的 index 的值
        // 这里的 this 已经指向我点击的哪个按钮
        // 不在指向当前实例了
        // 当你在这里访问 _this 的时候拿到的就是当前实例
        _this.index = index
        move(_this.imgBox, { left: -_this.index * _this.boxWidth }, _this.moveEnd.bind(_this))
      })
    }
  }
}
