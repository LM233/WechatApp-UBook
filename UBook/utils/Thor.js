import tuiComponent from "/components/tuiTabbar/tuiTabbar";
module.exports = {
  name: "tuiTabbar",
  props: {
    //当前索引
    current: {
      type: Number,
      default: 0
    },
    //字体颜色
    color: {
      type: String,
      default: "#666"
    },
    //字体选中颜色
    selectedColor: {
      type: String,
      default: "#5677FC"
    },
    //背景颜色
    backgroundColor: {
      type: String,
      default: "#FFFFFF"
    },
    //是否需要中间凸起按钮
    hump: {
      type: Boolean,
      default: true
    },
    //固定在底部
    isFixed: {
      type: Boolean,
      default: true
    },
    //tabbar
    // "pagePath": "/pages/my/my", 页面路径
    // "text": "thor", 标题
    // "iconPath": "thor_gray.png", 图标地址
    // "selectedIconPath": "thor_active.png", 选中图标地址
    // "hump": true, 是否为凸起图标
    // "num": 2,   角标数量
    // "isDot": true,  角标是否为圆点
    // "verify": true  是否验证  （如登录）
    tabBar: {
      type: Array,
      default() {
        return []
      }
    },
    //角标字体颜色
    badgeColor: {
      type: String,
      default: "#fff"
    },
    //角标背景颜色
    badgeBgColor: {
      type: String,
      default: "#F74D54"
    },
    unlined: {
      type: Boolean,
      default: false
    }

  },
  watch: {
    current() {

    }
  },
  data() {
    return {

    };
  },

  methods: {
    tabbarSwitch(index, hump, pagePath, verify) {
      this.$emit("click", {
        index: index,
        hump: hump,
        pagePath: pagePath,
        verify: verify
      })
    }
  }
}