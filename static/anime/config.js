/* ============================================================================
 *  ✿  二次元主题 · 个性化配置文件
 *  ---------------------------------------------------------------------------
 *  只改这个文件，就能把博客变成你自己的样子：
 *    · site     —— 首页横幅上的文字、起始日期、GitHub 地址
 *    · buttons  —— 右下角/右中那排「自定义按钮」（增删都行）
 *    · backgrounds —— 背景图切换列表
 *    · quotes   —— 「抽一句」里的一句话
 *    · mascot   —— 看板娘的名字和台词
 *    · effects  —— 樱花、鼠标星光等特效开关
 *
 *  ⚠ 注意：文件里的中文引号「」只是说明，代码里的字符串请用英文引号。
 * ========================================================================== */

window.ANIME_CONFIG = {

  /* ---------------- 站点信息 ---------------- */
  site: {
    name: "LazyBigKing の 博客",
    eyebrow: "✦ WELCOME TO MY LITTLE UNIVERSE ✦",
    // 首页横幅会逐字打出来的句子（可以写多句轮播）
    typed: [
      "在代码与花火之间，记录一点微光。",
      "愿你在这里，偶遇喜欢的故事。",
      "吾名唤做LazyBigKing，呜哈哈哈哈哈。"
    ],
    startDate: "2026-6-10",       // 建站日期（用于「已运行 N 天」）
    github: "https://github.com/LazyBigK1ng",
    footerNote: "用 ❤ 与 ☕ 搭建"
  },

  /* ---------------- 首页横幅 ---------------- */
  hero: {
    enabled: true,
    showMascot: true,
    chips: true,
    actions: [
      { label: "随机逛逛", action: "random", icon: "random", primary: true },
      { label: "抽一句话", action: "quote", icon: "quote" },
      { label: "GitHub", href: "https://github.com/LazyBigK1ng", icon: "github", blank: true }
    ]
  },

  /* ---------------- 右侧 / 底部 按钮坞 ----------------
   * 按钮支持两种写法：
   *   { label: "文字", href: "链接" }        → 跳转链接
   *   { label: "文字", action: "动作" }      → 执行动作
   * 可用 action：random(随机文章)、quote(抽一句话)、background(换背景)、
   *              top(回到顶部)、theme(切换昼夜)、mascot(看板娘说话)、
   *              share(复制当前链接)
   * 可用 icon  ：home / tag / random / quote / palette / top / github /
   *              rss / link / heart / book / star / music
   * 想加友链？复制一行改掉 label 和 href 即可。
   * -------------------------------------------------- */
  buttons: [
    { label: "回到首页", href: "", icon: "home" },
    { label: "标签云", href: "tag.html", icon: "tag" },
    { label: "随机文章", action: "random", icon: "random" },
    { label: "抽一句话", action: "quote", icon: "quote" },
    { label: "更换背景", action: "background", icon: "palette" },
    { label: "切换昼夜", action: "theme", icon: "moon" },
    { label: "回到顶部", action: "top", icon: "top" }
  ],

  /* ---------------- 背景 ----------------
   * theme: light 只在浅色模式自动使用，dark 只在深色模式自动使用，any 都行
   * url  ：图片放在 static/anime/ 里，这里写 anime/图片名
   * -------------------------------------------------- */
  backgrounds: [
    { id: "day", label: "晴空", url: "anime/bg-day.svg", theme: "light" },
    { id: "sakura", label: "樱花", url: "anime/bg-sakura.svg", theme: "light" },
    { id: "dusk", label: "黄昏", url: "anime/bg-dusk.svg", theme: "light" },
    { id: "night", label: "星夜", url: "anime/bg-night.svg", theme: "dark" },
    { id: "aurora", label: "极光", url: "anime/bg-aurora.svg", theme: "dark" }
  ],
  defaultBackground: "auto",   // auto = 根据昼夜自动挑选；也可以填某个 id

  /* ---------------- 「抽一句」的句子 ---------------- */
  quotes: [
    { text: "愿你所有的努力，都在某个春天开出花来。", from: "本站随笔" },
    { text: "代码会报错，但晚风不会。", from: "本站随笔" },
    { text: "把喜欢的东西留在身边，日子就不会太难过。", from: "本站随笔" },
    { text: "星星是天空的标点，用来停顿那些说不出口的话。", from: "本站随笔" },
    { text: "如果累了，就把自己调成飞行模式吧。", from: "懒大王" },
    { text: "我们都是在黑夜里，给彼此点灯的人。", from: "本站随笔" },
    { text: "慢慢来，比较快。", from: "本站随笔" },
    { text: "世界很吵，记得给自己留一格静音。", from: "本站随笔" },
    { text: "春天会迟到，但不会缺席。", from: "懒大王" },
    { text: "把平凡的日子，过成闪闪发光的样子。", from: "本站随笔" },
    { text: "想做的事现在就去做，想见的人现在就去见。", from: "本站随笔" },
    { text: "所有的热爱，都值得被认真对待。", from: "本站随笔" },
    { text: "今天也要像猫咪一样，理直气壮地偷懒五分钟。", from: "懒大王" },
    { text: "你走过的每一步，都算数。", from: "本站随笔" }
  ],

  /* ---------------- 看板娘 ---------------- */
  mascot: {
    enabled: true,
    name: "LazyBigKing",
    image: "anime/mascot.png",
    greetings: [
      "欢迎回来！今天也要元气满满哦～",
      "诶嘿，被你发现啦。要不要抽一句话带走？",
      "偷偷告诉你：右边那排小按钮都可以点哦。",
    ]
  },

  /* ---------------- 特效开关 ---------------- */
  effects: {
    petals: true,        // 飘落的樱花
    petalCount: 26,      // 桌面端花瓣数量
    cursor: true,        // 鼠标星光（仅桌面）
    clickBurst: true,    // 点击时的小花瓣爆开
    avatarRing: true     // 头像旋转光环
  },

  /* ---------------- 文章页 ---------------- */
  post: {
    toc: true,           // 自动生成目录
    tocMinHeadings: 2,   // 至少几个标题才显示目录
    meta: true,          // 显示字数 / 阅读时间 / 日期 / 标签
    progress: true,      // 顶部阅读进度条
    copyLink: true,      // 复制当前链接
    lightbox: true,      // 点击图片放大
    wordsPerMinute: 380  // 中文阅读速度（字/分钟）
  },

  /* 首页每条文章左侧的小图标（按标题自动分配） */
  thumbEmojis: ["🌸", "⭐", "🌙", "🎀", "🍙", "🫧", "🪷", "🍥", "✨", "🌿", "☕", "🎧"]
};
