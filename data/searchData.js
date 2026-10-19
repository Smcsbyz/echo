/* ============================================================
   文件路径：data/searchData.js
   说明：给力GAME交流站 搜索数据
         本次修正：
           1. post41 替换为「大家好，我是从FGA来的」（小白菜难民），
              并在 threadsByBoard['board-screenshot'] 中补入该条目，
              使 post41 能在「闲谈茶馆」版块中正常显示
           2. post5 的 board 字段保持为「闲谈茶馆」
           3. 其余帖子数据与排序均保持原样
   暴露：window.SearchData
   ============================================================ */
(function () {
  'use strict';

  var posts = {

    /* post1 */
    post1: {
      id: 'post1',
      title: '【讨论】有没有人知道这款游戏是谁开发的？',
      author: '种下一颗大太阳',
      authorUID: 100861,
      date: '2023-12-03',
      board: '游戏讨论',
      replyCount: 12,
      viewCount: 428,
      content: '叫做《我的小屋》，没事冲浪的时候看到的，虽然还是个demo，但我感觉潜力很大，听说还是咱们论坛里的朋友做的，有没有人知道到底是谁啊？',
      comments: [
        {
          author: '种下一颗大太阳',
          content: '《我的小屋》？没听说过，路边的三流小作品吧',
          date: '2023-12-03',
          replies: [
            { author: '种下一颗大太阳', content: '怎么能这么说呢？明明是入股不亏！', date: '2023-12-03', replyTo: '种下一颗大太阳' },
            { author: '种下一颗大太阳', content: '哼，还"入股不亏"，我看你就是批皮粉丝吧！', date: '2023-12-03', replyTo: '种下一颗大太阳' },
            { author: '种下一颗大太阳', content: '你这人说话真没意思，上来就扣帽子，拉黑了！', date: '2023-12-03', replyTo: '种下一颗大太阳' },
            { author: '种下一颗大太阳', content: '那我也拉黑！', date: '2023-12-03', replyTo: '种下一颗大太阳' }
          ]
        },
        {
          author: '嘿嘿的天空',
          content: '我来翻译一下阳语："我做了新的游戏快点来玩"',
          date: '2023-12-03',
          replies: [
            { author: '是无等等咒', content: '好翻', date: '2023-12-03', replyTo: '嘿嘿的天空' }
          ]
        },
        {
          author: '不会不会吃饭',
          content: '。。。阳大又在评论区演起来了',
          date: '2023-12-03',
          replies: [
            { author: '种下一颗大太阳', content: '矣嘿：P', date: '2023-12-03', replyTo: '不会不会吃饭' }
          ]
        },
        {
          author: '睡觉前杀鸡887',
          content: '刚来，这是在干嘛，楼主精分了？',
          date: '2023-12-03',
          replies: [
            {
              author: '经济适用男yo',
              content: '楼主是做独立小游戏的，有时候会来站里宣传，不过宣传方式嘛。。你懂的',
              date: '2023-12-03',
              replyTo: '睡觉前杀鸡887',
              replies: [
                { author: '睡觉前杀鸡887', content: '原来如此2333', date: '2023-12-03', replyTo: '经济适用男yo' }
              ]
            }
          ]
        }
      ]
    },

    /* post2 */
    post2: {
      id: 'post2',
      title: '【谢罪】分享一下游戏进程',
      author: '种下一颗大太阳',
      authorUID: 100861,
      date: '2024-02-24',
      board: '游戏讨论',
      replyCount: 8,
      viewCount: 356,
      content: '最近一直被各种各样的事情拖慢脚步，完全敲不动代码orz，不过放心好了，在室友的投喂中已经好起来了！甚至圆润了很多（喂）\n\n总之，接下来会尽快更新的，求各位股东原谅！！！',
      comments: [
        {
          author: '正是皇帝',
          content: '赦免你',
          date: '2024-02-24',
          replies: [
            { author: '种下一颗大太阳', content: '谢主隆恩！', date: '2024-02-24', replyTo: '正是皇帝' }
          ]
        },
        {
          author: '国庆节后不上班',
          content: '这个时间，阳大不会是跟家里人吵架了吧。反正我每次过年回家都很糟心，唉',
          date: '2024-02-24',
          replies: [
            { author: '种下一颗大太阳', content: '唉，摸摸', date: '2024-02-24', replyTo: '国庆节后不上班' }
          ]
        },
        {
          author: '十八线五河道',
          content: '什么？阳大有新作了？好矣！这次还是和用户大大一起吗？',
          date: '2024-02-24',
          replies: [
            { author: '种下一颗大太阳', content: '是的！感谢支持！', date: '2024-02-24', replyTo: '十八线五河道' }
          ]
        },
        {
          author: '会不会不好',
          content: '用户大大是谁啊',
          date: '2024-02-24',
          replies: [
            { author: '十八线五河道', content: '是阳大的合作美术兼室友啦，叫**用户96234**，超神秘的，而且做饭超好吃（？）', date: '2024-02-24', replyTo: '会不会不好' }
          ]
        }
      ]
    },

    /* post3 */
    post3: {
      id: 'post3',
      title: '【再次谢罪】我。。从地狱。。爬回来了。。。',
      author: '种下一颗大太阳',
      authorUID: 100861,
      date: '2024-08-12',
      board: '游戏讨论',
      replyCount: 10,
      viewCount: 412,
      content: '没想到谢罪贴还会写第二次orz\n\n没坑，没坑，真的没坑！这真的是我经历过最坎坷的一次开发了，三次事情真的太多，倒霉的事情一个接一个，真的是（埋进室友的怀抱）\n\n总之，下一次更新会在9月，一定要等着我！',
      comments: [
        { author: '还是不会显示吗', content: '你还活着啊', date: '2024-08-12' },
        {
          author: '香水百合lily',
          content: '等的你好苦，你知不知道没了你我是怎么过的婴婴',
          date: '2024-08-12',
          replies: [
            { author: '种下一颗大太阳', content: '对不起TOT', date: '2024-08-12', replyTo: '香水百合lily' }
          ]
        },
        { author: '十三四五好呀', content: '呜哇，诈尸了', date: '2024-08-12' },
        {
          author: '圣熙八号888',
          content: '我也想埋',
          date: '2024-08-12',
          replies: [
            { author: '种下一颗大太阳', content: '不许！这是我的专属怀抱', date: '2024-08-12', replyTo: '圣熙八号888' },
            { author: '圣熙八号888', content: '独占欲好强ww', date: '2024-08-12', replyTo: '种下一颗大太阳' }
          ]
        },
        { author: '啊金色时光', content: '没关系，慢慢来', date: '2024-08-12' },
        { author: '沙河五年级啊', content: '**抄袭**那件事不打算解释一下吗？', date: '2024-08-12' }
      ]
    },

    /* post4 */
    post4: {
      id: 'post4',
      title: '【讨论】有人玩过《我的小屋》吗？',
      author: '伤害爆炸mvp',
      authorUID: 200050,
      date: '2025-01-09',
      board: '闲谈茶馆',
      replyCount: 7,
      viewCount: 268,
      content: '游戏底子挺不错的，但是为什么大半年都没更新了，太监了？',
      comments: [
        {
          author: '喝奶茶针不戳',
          content: '我都快忘了这游戏了，作者就是站友来着，上次说9月要更新，结果也没消息了',
          date: '2025-01-09',
          replies: [
            { author: '上班哈哈', content: '说不定是明年的9月呢doge', date: '2025-01-09', replyTo: '喝奶茶针不戳' }
          ]
        },
        { author: '睡觉觉SJ', content: '**阳大**吗？她都做了好几款游戏了，不至于吧', date: '2025-01-09' },
        { author: '伤疤童脸狼', content: '做独立游戏的，太监很正常，没钱嘛', date: '2025-01-09' },
        { author: '水仙花萨巴赫', content: '爱信等', date: '2025-01-09' }
      ]
    },

    /* post5 */
    post5: {
      id: 'post5',
      title: '这好像是某个游戏的制作人，太惨了吧。。',
      author: '睡不醒呀910',
      authorUID: 200051,
      date: '2024-09-21',
      board: '闲谈茶馆',
      replyCount: 7,
      viewCount: 486,
      content: '*网页链接*今天看新闻刷到的，车祸，好像才二十多岁，这么年轻就，唉',
      comments: [
        { author: '海沃德', content: '默哀', date: '2024-09-21' },
        { author: '剩下发际线你看', content: '唉，默哀', date: '2024-09-21' },
        { author: '神光追看121', content: '天妒英才', date: '2024-09-21' },
        { author: '杀不够哇卡卡', content: '她的玩家一定不会知道发生了什么，我宁愿我的断更作者是太监而不是真的出事', date: '2024-09-21' },
        { author: '先说好不喝酒ao', content: '我表弟的朋友就是被酒驾害了，开车不喝酒啊各位', date: '2024-09-21' }
      ]
    },

    /* post6 —— 作者名乱码 + 头像锚定 */
    post6: {
      id: 'post6',
      title: '云州市第一人民医院 病例记录',
      author: '锟斤拷锟斤拷锟斤拷',
      authorUID: 999999,
      authorAvatar: 'assets/avatars/avatar41.png',
      date: '2024-10-01',
      board: '杂谈',
      replyCount: 5,
      viewCount: 268,
      content: '',
      images: [
        'assets/images/post6-img1.png',
        'assets/images/post6-img2.png',
        'assets/images/post6-img3.png'
      ],
      comments: []
    },

    /* post7 —— 作者名乱码 + 头像锚定 */
    post7: {
      id: 'post7',
      title: '临海市儿童福利院 安置档案',
      author: '锟斤拷锟斤拷锟斤拷',
      authorUID: 999999,
      authorAvatar: 'assets/avatars/avatar41.png',
      date: '2024-10-02',
      board: '杂谈',
      replyCount: 3,
      viewCount: 186,
      content: '',
      images: [
        'assets/images/post7-img1.png'
      ],
      comments: []
    },

    /* post8 */
    post8: {
      id: "post8",
      title: "有没有人扒一下用户96234？这人到底存不存在？",
      author: "Qbhenji",
      date: "2024-04-27",
      board: "闲谈茶馆",
      content: "如题。这人到底是男是女，怎么网上一点信息都找不到",
      comments: [
        {
          author: "香水百合lily",
          content: "你问这个干嘛",
          replies: [
            { author: "Qbhenji", content: "好奇嘛", replyTo: "香水百合lily" }
          ]
        },
        {
          author: "我家猫最可爱",
          content: "不知道，我猜是女的",
          replies: [
            { author: "Qbhenji", content: "为啥", replyTo: "我家猫最可爱" },
            { author: "我家猫最可爱", content: "我都说了我不知道", replyTo: "Qbhenji" }
          ]
        },
        {
          author: "五月五号",
          content: "女的吧，不是跟阳大是室友吗？",
          replies: [
            { author: "新世界new", content: "不说是**恋人**吗，应该是男的吧", replyTo: "五月五号" }
          ]
        },
        {
          author: "上半身阿姐",
          content: "猜一手男的",
          replies: [
            { author: "五月五号", content: "女的就不能是恋人了？", replyTo: "新世界new" },
            { author: "新世界new", content: "emmm。。不支持不反对", replyTo: "五月五号" }
          ]
        },
        { author: "不会写时间啊", content: "管他呢，画画得好看不就得了，我还说是外星人呢" },
        { author: "睡不醒哈哈", content: "是阳大马甲也说不定呢，歪比巴卜" }
      ],
      replyCount: 14,
      viewCount: 720
    },

    /* post9 */
    post9: {
      id: 'post9',
      title: '最近风很大的那个游戏估计是要完蛋了',
      author: '海上海事局',
      authorUID: 200053,
      date: '2024-08-10',
      board: '闲谈茶馆',
      replyCount: 5,
      viewCount: 386,
      content: '多方求证，我堂姐就在熊厂里上班，据说要打官司了',
      comments: [
        { author: '砂石款久啊', content: '真的假的', date: '2024-08-10' },
        { author: '晒去SQ', content: '《小狗飞船》变成《熊熊飞船》，下一个是什么？《塔塔熊战纪》吗？', date: '2024-08-10' },
        { author: '青蛙氛围', content: '喷喷喷', date: '2024-08-10' }
      ]
    },

    /* post10 */
    post10: {
      id: 'post10',
      title: '某独立游戏抄了大厂？',
      author: '砂加气QQ',
      authorUID: 200054,
      date: '2024-07-26',
      board: '闲谈茶馆',
      replyCount: 10,
      viewCount: 448,
      content: '如题。链接就不放了，怕小腿毛过来骂我。这作者胆子也是够大的，熊厂的游戏也敢抄，北极必胜客跟你闹呢，等着倒霉吧',
      comments: [
        { author: '小时把控', content: '？说的什么屁话', date: '2024-07-26' },
        { author: '不适合耍心机', content: '我看你才是熊厂孝子吧，那独游发布时间比你家游戏早多了知道吗', date: '2024-07-26' },
        { author: 'shakjL', content: '未知全貌，不予置评', date: '2024-07-26' },
        { author: '阿卡可Aka', content: '熊厂是靠什么起家的不用我多说了吧，搁这倒打一耙真有乐子', date: '2024-07-26' },
        {
          author: '小烧烤',
          content: '求解码，哪个独游这么倒霉啊',
          date: '2024-07-26',
          replies: [
            { author: '显卡8090Ti', content: '是站里那个《塔塔虾战纪》吧，作者是最近开了新作叫《小屋》的那个', date: '2024-07-26', replyTo: '小烧烤' }
          ]
        },
        {
          author: '今晚先杀卡萨',
          content: '这玩意谁说得准，独游抄大厂的又不是没有',
          date: '2024-07-26',
          replies: [
            { author: '砂加气QJQ', content: '说的对啊', date: '2024-07-26', replyTo: '今晚先杀卡萨' }
          ]
        }
      ]
    },

    /* post11 */
    post11: {
      id: "post11",
      title: "【讨论】恋人不被家里认可怎么办？",
      author: "长沙酒砂",
      date: "2024-01-09",
      board: "闲谈茶馆",
      content: "这不是快过年了，想把恋人带回家给父母看看，但是他们推三阻四的，话里话外都是别让我带回家，说怕人笑话。刚才还打电话过来让我尽快分手，但我和恋人在一起六年了，关系特别好，不想分开，怎么办啊",
      comments: [
        {
          author: "消杀机kk",
          content: "家里为什么不满意，对方是没钱还是长得丑",
          replies: [
            { author: "长沙酒砂", content: "都不是", replyTo: "消杀机kk" },
            { author: "小山河", content: "那是为什么，讨厌总得有个理由吧", replyTo: "长沙酒砂" },
            { author: "长沙酒砂", content: "因为。。。我恋人是男生", replyTo: "小山河" },
            { author: "长沙酒砂", content: "我也是", replyTo: "小山河" }
          ]
        },
        { author: "销售部杀气慢慢", content: "啊，那就不奇怪了那就不奇怪了" },
        { author: "是星巴克", content: "给" },
        {
          author: "阿哥扎哈山",
          content: "我是你爸妈我也不同意",
          replies: [
            { author: "长沙酒砂", content: "为什么", replyTo: "阿哥扎哈山" },
            { author: "阿哥扎哈山", content: "阴阳调合才是正道，自然界哪有你们这种", replyTo: "长沙酒砂" },
            { author: "消失不见九", content: "生物大拿来了，笑死", replyTo: "阿哥扎哈山" }
          ]
        },
        { author: "种下一颗大太阳", content: "抱抱" },
        {
          author: "熊玛利亚",
          content: "透明的风暴终究席卷你我",
          replies: [
            { author: "哈哈并不会", content: "中二病？", replyTo: "熊玛利亚" }
          ]
        },
        {
          author: "长沙酒砂",
          content: "唉，想了想，也不怪他们接受不了，但是我真的很爱我的恋人",
          replies: [
            { author: "神仙妈咪到我家", content: "这有啥，我对象还是沃尔玛购物袋呢", replyTo: "长沙酒砂" },
            {
              author: "电话汇报1109",
              content: "虽然遇到的困境不一样。但是作为过来人，希望无论楼主最后是选了哪一边，都要坚定，选父母就不要留恋，选恋人就做好顶住压力的准备，不然难过的不只有他们，还有你",
              replyTo: "长沙酒砂",
              replies: [
                { author: "啥啊啊啊啊", content: "老哥有故事", replyTo: "电话汇报1109" },
                { author: "电话汇报1109", content: "唉", replyTo: "啥啊啊啊啊" }
              ]
            }
          ]
        }
      ],
      replyCount: 18,
      viewCount: 960
    },

    /* post12 */
    post12: {
      id: 'post12',
      title: '【讨论】人死后会不会赛博飞升？',
      author: '小昂哈我去',
      authorUID: 200056,
      date: '2023-10-26',
      board: '闲谈茶馆',
      replyCount: 8,
      viewCount: 356,
      content: '最近看了《赛博朋克2066》的pv，然后我突然在想，如果人能把灵魂上传到互联网里，那是不是就能在网络里永生了，感觉很有搞头啊',
      comments: [
        { author: '嘻哈加油', content: '好主意，我要成为二次元！', date: '2023-10-26' },
        { author: '束口裤卡其亚', content: '我来搞定脑机接口！', date: '2023-10-26' },
        { author: '我喜欢黄金马桶', content: '抛却血肉苦痛，拥抱赛博飞升', date: '2023-10-26' },
        { author: '好不快活沙悟净66', content: '很有想法，但首先，要怎么上传', date: '2023-10-26' },
        { author: '就是爱添乱', content: '《电子人会不会有赛博墓碑》', date: '2023-10-26' }
      ]
    },

    /* post13 */
    post13: {
      id: 'post13',
      title: '【求助】哈里西战争这游戏咋样，值得入吗？',
      author: '11区卡密sama',
      authorUID: 200011,
      date: '2024-02-10',
      board: '游戏讨论',
      replyCount: 8,
      viewCount: 380,
      content: '老看到有人推荐，最近正好结冰平台打折，才23块，在思考要不要入手',
      comments: [
        { author: '告白成功就改名', content: '入股不亏，好玩的，早上打开游戏，回过神就到晚上了，很省饭钱', date: '2024-02-10' },
        {
          author: '唐僧洗头用飘柔',
          content: '你来晚了，Apic前几天刚送过',
          date: '2024-02-10',
          replies: [
            { author: '11区卡密sama', content: '纳尼？！', date: '2024-02-10', replyTo: '唐僧洗头用飘柔' }
          ]
        },
        { author: '卡夏886', content: '没玩过，蹲一个评价', date: '2024-02-10' },
        {
          author: '%路过的路人%',
          content: '挺好玩就是引导太弱了得自己上 wiki 上扒攻略',
          date: '2024-02-10',
          replies: [
            { author: '11区卡密sama', content: '这倒没事，我玩的上一款游戏叫《吃饱》', date: '2024-02-10', replyTo: '%路过的路人%' },
            { author: '%路过的路人%', content: '那没事了很适合你', date: '2024-02-10', replyTo: '11区卡密sama' }
          ]
        }
      ]
    },

    /* post14 */
    post14: {
      id: 'post14',
      title: '【求助】去火星最后一关的解密怎么整啊',
      author: '想做游戏',
      authorUID: 200012,
      date: '2019-03-05',
      board: '游戏讨论',
      replyCount: 12,
      viewCount: 3200,
      content: '玩到了第九章，应该是最后一关吧。火箭前面那个解密，说是要填一串字母，但是前面密码纸上给的不是数字+字母吗，是解密还是bug啊？有没有通关的大佬帮帮忙orz',
      comments: [
        { author: '我没别的意思就想试试id能有多长诶呦真挺长', content: '同蹲', date: '2019-03-05' },
        {
          author: '苯⑩纪嘚仼者',
          content: '解密，我记得是那个，沙拉密码来着',
          date: '2019-03-05',
          replies: [
            {
              author: '木子李',
              content: '什么沙拉，是**凯撒密码**',
              date: '2019-03-05',
              replyTo: '苯⑩纪嘚仼者',
              replies: [
                { author: '想做游戏', content: '佬，凯撒密码是什么？', date: '2019-03-05', replyTo: '木子李' },
                { author: '木子李', content: '就是一种错位密码，比如，把字母表偏移三位，A就变成D，B就变成E什么的', date: '2019-03-05', replyTo: '想做游戏' },
                { author: '木子李', content: '也不一定就是三位，我记得这里面是根据纸条上的数字计算偏移的，总之就是要有**偏移量+原始字母**', date: '2019-03-05', replyTo: '想做游戏' },
                { author: '想做游戏', content: '明白了，感谢大佬！', date: '2019-03-05', replyTo: '木子李' }
              ]
            }
          ]
        },
        { author: '月落无敌', content: '沙拉沙拉的，看饿了', date: '2019-03-05' }
      ]
    },

    /* post15 */
    post15: {
      id: 'post15',
      title: '【GAL】Q社经典蔷薇缭乱全系列',
      author: '最爱宫本利亚',
      authorUID: 200013,
      date: '2024-03-20',
      board: '资源分享',
      replyCount: 8,
      viewCount: 296,
      content: '见评论',
      comments: [
        { author: '最爱宫本利亚', content: '*网盘链接*', date: '2024-03-20' },
        { author: '青柠', content: '赞', date: '2024-03-20' },
        { author: '汉堡真好吃', content: '楼主好人', date: '2024-03-20' },
        {
          author: 'TERITERI0908',
          content: '链接失效了，求补档',
          date: '2024-03-20',
          replies: [
            { author: '最爱宫本利亚', content: '已补', date: '2024-03-20', replyTo: 'TERITERI0908' },
            { author: 'TERITERI0908', content: '感谢楼主', date: '2024-03-20', replyTo: '最爱宫本利亚' }
          ]
        },
        { author: '手慢无', content: '还有补档吗？（哭）', date: '2024-03-20' }
      ]
    },

    /* post16 */
    post16: {
      id: 'post16',
      title: '【分享】这个游戏的BGM真好听',
      author: '锅之大',
      authorUID: 200014,
      date: '2022-04-02',
      board: '资源分享',
      replyCount: 12,
      viewCount: 680,
      content: '*网盘链接*\n\n有没有人知道这个游戏的BGM作者是谁？感觉特别契合氛围，想找原声带。',
      comments: [
        { author: '北山必胜客', content: '蹲', date: '2022-04-02' },
        { author: 'Celi-A', content: '第一次听，确实好听矣，同蹲', date: '2022-04-02' },
        {
          author: '我胡写作文',
          content: '这游戏06年的，都快成lostmedia了，真亏楼主找的出来',
          date: '2022-04-02',
          replies: [
            { author: '邵叔叔蛋黄酥', content: '比我大三岁', date: '2022-04-02', replyTo: '我胡写作文' },
            { author: '我胡写作文', content: '乖，写作业去', date: '2022-04-02', replyTo: '邵叔叔蛋黄酥' }
          ]
        },
        {
          author: '看到我就让我去喝水',
          content: '这种小工作室最不好找了 作曲家本人说不定都退出业界了楼主别抱太大希望做游戏做一半突然消失的都很多',
          date: '2022-04-02',
          replies: [
            { author: '锅之大', content: '唉，好吧', date: '2022-04-02', replyTo: '看到我就让我去喝水' },
            { author: '锅之大', content: '去喝水', date: '2022-04-02', replyTo: '看到我就让我去喝水' },
            { author: '看到我就让我去喝水', content: '好嘞', date: '2022-04-02', replyTo: '锅之大' }
          ]
        }
      ]
    },

    /* post17 */
    post17: {
      id: 'post17',
      title: '【分享】总会被这种剧情骗走眼泪',
      author: '我心如铁',
      authorUID: 200015,
      date: '2022-04-15',
      board: '闲谈茶馆',
      replyCount: 8,
      viewCount: 720,
      content: '音乐社刚通关，小酒线结局那段真的绷不住了，永远会被这种专注的爱意打动，坐在电脑前面哭得像个一百六十斤的孩子。不剧透，但建议大家都来玩音乐社最后，没人会不喜欢小酒！！',
      comments: [
        {
          author: '一行白鹅下油锅',
          content: '笑死，与楼主id形成鲜明对比',
          date: '2022-04-15',
          replies: [
            { author: '我心如铁', content: '你不懂，小酒她不一样', date: '2022-04-15', replyTo: '一行白鹅下油锅' }
          ]
        },
        {
          author: '我是大聪明、',
          content: '小酒确实好啊，就是有点啥',
          date: '2022-04-15',
          replies: [
            { author: '我心如铁', content: '小酒。。不啥。', date: '2022-04-15', replyTo: '我是大聪明、' }
          ]
        },
        { author: 'DarkKing', content: '楼主性情了', date: '2022-04-15' },
        { author: '李小红AuA', content: '没人会不喜欢小酒！！', date: '2022-04-15' }
      ]
    },

    /* post18 */
    post18: {
      id: 'post18',
      title: '新人报到，请多关照',
      author: '新用户2234',
      authorUID: 200016,
      date: '2017-05-01',
      board: '资源分享',
      replyCount: 7,
      viewCount: 3420,
      content: '大家好，我是刚注册的新人，平时喜欢玩单机游戏。请多关照！',
      comments: [
        { author: '登峰来', content: '欢迎，不过发错版了哦', date: '2017-05-01' },
        { author: '小满', content: '欢迎欢迎', date: '2017-05-01' },
        { author: '一口盐汽水', content: '来晚了地板', date: '2017-05-01' },
        { author: '热心市民FAN先生', content: '板凳', date: '2017-05-01' },
        { author: '自愿晚自习', content: '沙发', date: '2017-05-01' }
      ]
    },

    /* post19 */
    post19: {
      id: 'post19',
      title: '今天天气真好，有人出去散步吗？',
      author: '比-太-阳-更-光',
      authorUID: 200017,
      date: '2020-05-15',
      board: '闲谈茶馆',
      replyCount: 5,
      viewCount: 640,
      content: '累了五天，难得周末天气这么好，准备出去走走。大家周末都干嘛？',
      comments: [
        {
          author: '沃斯路人甲',
          content: '加班（',
          date: '2020-05-15',
          replies: [
            { author: '比-太-阳-更-光', content: '辛苦了', date: '2020-05-15', replyTo: '沃斯路人甲' }
          ]
        },
        { author: '净给人添乱&&', content: '进行一次更加宏大的社交！', date: '2020-05-15' },
        { author: '半灯cat', content: 'zzz', date: '2020-05-15' }
      ]
    },

    /* post20 */
    post20: {
      id: 'post20',
      title: '【讨论】大家平时都玩什么类型的游戏？',
      author: '大西洋不相信眼泪',
      authorUID: 200018,
      date: '2018-06-01',
      board: '闲谈茶馆',
      replyCount: 7,
      viewCount: 4860,
      content: '好奇大家的口味，我现在比较喜欢解谜和剧情向的',
      comments: [
        { author: '塔兹米', content: '老了，动作游戏玩不动了', date: '2018-06-01' },
        {
          author: '私人空间享受者',
          content: '解谜+1，还有模拟经营，玩不来强社交',
          date: '2018-06-01',
          replies: [
            { author: '蜡笔笔笔', content: '同道中人，我恐人可能', date: '2018-06-01', replyTo: '私人空间享受者' }
          ]
        },
        { author: '太平洋最肯定汗水', content: '楼主咱俩情侣ID矣', date: '2018-06-01' },
        {
          author: '白鹭',
          content: '恐怖游戏，但从心',
          date: '2018-06-01',
          replies: [
            { author: '大西洋不相信眼泪', content: '挽尊', date: '2018-06-01', replyTo: '白鹭' }
          ]
        }
      ]
    },

    /* post21 */
    post21: {
      id: 'post21',
      title: '【分享】我有种很奇怪的癖好',
      author: '|东方|既白|',
      date: '2017-06-15',
      board: '闲谈茶馆',
      content: '我发现不怎么爱玩纯正的BL游戏，也不喜欢BL漫画，但就爱玩那种，支线的BL线。就是，有些GAL里面会有那种戏份很少的彩蛋兄弟线，要是最后哪个妹子都不喜欢你就会走这种线，跟兄弟度过情人节。我就爱玩这种，百分百的反而缺了点味道。怀疑自己是不是有点大病。',
      comments: [
        { author: '土豆子成了精', content: '淦，好怪哦' },
        { author: '猎人啥时候更新', content: '这设计不是安抚玩家用的吗？楼主多少是有点叛逆了' },
        { author: '响沙湾第一大帅哥', content: '兄弟，兄弟' },
        { author: '名侦探美兔', content: '异食癖来的，不过原来还有这种线路吗，涨芝士了' },
        { author: '大人就是', content: '那有啥的，我全都要', replies: [
          { author: '|东方|既白|', content: '不愧是你，我悟了', replyTo: '大人就是' }
        ] }
      ],
      replyCount: 8,
      viewCount: 1200
    },

    /* post22 */
    post22: {
      id: 'post22',
      title: '【讨论】熬夜打游戏真的会猝死吗？',
      author: '月亮不睡我不睡',
      authorUID: 200020,
      date: '2025-01-24',
      board: '闲谈茶馆',
      replyCount: 10,
      viewCount: 486,
      content: '最近放假，连续熬了好几天打油戏，虽然有点累，蛋感觉意识还是很庆幸，就是从马桶上起来的时候邮电头晕，应该没什么事吧',
      comments: [
        { author: '沃兹基硕德', content: '没看出意识清醒', date: '2025-01-24' },
        { author: '小小豆娃<', content: '早点睡吧朋友，都有好几个新闻讲熬夜打游戏**昏迷**的了', date: '2025-01-24' },
        { author: '哈哈哈刀哈哈哈', content: '楼主辛，此帖完结', date: '2025-01-24' },
        {
          author: '月亮不睡我不睡',
          content: '没有哇，我真的很情形d',
          date: '2025-01-24',
          replies: [
            { author: '楚河汉界', content: '楼主——！', date: '2025-01-24', replyTo: '月亮不睡我不睡' },
            { author: 'dudu爱', content: '楼主——！', date: '2025-01-24', replyTo: '月亮不睡我不睡' },
            { author: '比比六部', content: '楼主——！', date: '2025-01-24', replyTo: '月亮不睡我不睡' }
          ]
        }
      ]
    },

    /* post23 */
    post23: {
      id: 'post23',
      title: '你们这个是个什么论坛啊？！',
      author: '国服第一李莫愁',
      authorUID: 200021,
      date: '2019-07-15',
      board: '游戏讨论',
      replyCount: 12,
      viewCount: 4280,
      content: '你们这是什么论坛啊？你们真是害人不浅啊你们这个论坛！真的，麻烦你们，你们搞这个论坛干什么，我儿子每科那个成绩都不过平均分哪！他现在初二，你们叫我儿子怎么办嘛，他还不到高中的好不好！你们这个是个什么论坛哪！你们害死我儿子了！',
      comments: [
        { author: '国服第一李莫愁', content: '谁是论坛主？快点出来你们那个论坛主！再这样我去报警了哈！', date: '2019-07-15' },
        { author: '国服第一李莫愁', content: '我跟你们说你们一大帮人啊，一天到晚搞什么游戏啊动漫啊会害死你们的！没有前途我跟你们说！', date: '2019-07-15' },
        { author: '国服第一李莫愁', content: '你们这几千个人哪，一天天不好好学习在这上网，有什么意思，能不能在乎一点你们的生活目标，你们的学习目标好不好，一天到晚上网，是不是人呢？', date: '2019-07-15' },
        { author: '老王123', content: '牛掰啊。。。', date: '2019-07-15' },
        { author: '额不是小丑', content: '来个管理，办事了', date: '2019-07-15' },
        { author: '此用户没有注销', content: '阿姨我们这是成功人士交流站啦', date: '2019-07-15' },
        { author: 'Hanshin!!!', content: '哈哈，过', date: '2019-07-15' },
        { author: '2342345', content: '预感要火 合影先', date: '2019-07-15' }
      ]
    },

    /* post24 */
    post24: {
      id: 'post24',
      title: '【讨论】今天食堂的饭好难吃',
      author: '比格嗷呜啊',
      authorUID: 200022,
      date: '2023-08-01',
      board: '闲谈茶馆',
      replyCount: 5,
      viewCount: 620,
      content: '如题，今天的菜全是我不爱吃的，只能靠泡面度日了。',
      comments: [
        { author: '键盘不是侠', content: '是呢', date: '2023-08-01' },
        {
          author: 'shiahwudw',
          content: '食堂难吃真很让人难过，不如来一块库奇船长的酸橙派，酸橙派那浓厚的酸橙芝士，再搭配上酥脆可口的饼皮，还有那甜而不腻的奶油，尝一口，好吃到连味蕾都在颤抖！现在就立刻去库奇船长的店里尝尝看吧！一定会你口味的！绝对可口，绝对美味，是您的不二之选！',
          date: '2023-08-01',
          replies: [
            { author: '比格嗷呜啊', content: '？怎么还有广告', date: '2023-08-01', replyTo: 'shiahwudw' }
          ]
        }
      ]
    },

    /* post25 */
    post25: {
      id: 'post25',
      title: '【QWRL】今天游戏怎么全是乱码，求一只大佬解惑',
      author: '键盘侠',
      date: '2020-04-01',
      board: '游戏讨论',
      content: '好几天没玩了，今天闲下来想打几局，说要更新。结果一打开更新网址，全是**乱码**，还以为是网络问题，刷新也好，热点也好试了好几遍，这是咋回事啊？土豆服务器又发力了？',
      comments: [
        { author: '暴打大朋友', content: '节哀，为楼主点香', replies: [
          { author: '键盘侠', content: '别弃疗啊', replyTo: '暴打大朋友' }
        ] },
        { author: '别在意', content: '楼主看眼日期就懂了', replies: [
          { author: '键盘侠', content: '啊？啥意思啊', replyTo: '别在意' }
        ] },
        { author: '挥一挥衣袖HJK', content: '愚人节彩蛋。你按f12，往里面输入__decodePage()，就能恢复正常了', replies: [
          { author: '键盘侠', content: '！！！感谢老大救我狗命！', replyTo: '挥一挥衣袖HJK' },
          { author: '挥一挥衣袖HJK', content: '没事，别在意', replyTo: '键盘侠' }
        ] },
        { author: '柠檬苏打水', content: '我就说别骗老实人' }
      ],
      replyCount: 8,
      viewCount: 1200
    },

    /* post26 */
    post26: {
      id: 'post26',
      title: '【音频】听着很舒服的白噪音21首',
      author: '失眠患者112',
      authorUID: 200024,
      date: '2024-08-25',
      board: '资源分享',
      replyCount: 5,
      viewCount: 320,
      content: '见评论',
      comments: [
        { author: '失眠患者112', content: '*网盘链接*', date: '2024-08-25' },
        { author: '孤灯', content: '赞', date: '2024-08-25' },
        { author: 'BGM享受GMB', content: '赞', date: '2024-08-25' }
      ]
    },

    /* post27 */
    post27: {
      id: 'post27',
      title: '【DDAC】怎么打HE啊，试了好多方法都不行',
      author: '2233超级萌',
      date: '2014-01-10',
      board: '游戏讨论',
      content: '首先我找了一大堆攻略，然后就这个靠谱点：\n1. 难度要在普通以上（HARD模式）\n2. 收服前面八关所有战士，回酒吧对话得知隐藏关卡（练功房），并且到第六关右上角的房间拿酒，拿舞会CG。宠物全部收复，然后去酒馆该有的剧情都触发了，顺便衣服的剧情也全触发了。换衣服去酒馆后会多出来一些，比如巫女装去酒馆会送你幽灵装。\n3. 全部搞定再去老大的房間，对话两次，应该会有三个新CG。（楼主也就这个条件没满足，回忆里面少了一个）\n4. BOSS战必须让老大出战。（没出战都试了一遍……老大不是你跟我说不要让你出战的吗QAQ）\n然后打完BOSS莉莉娅，却只有一个选项，没有第二个……\n跪求大神支个招！！！',
      comments: [
        { author: '超级智慧大统领', content: '练功房还有两个新战士，你是不是漏抓了' },
        { author: '超级智慧大统领', content: '这里是结局分支点，难度必须是普通，然后带好足够的次元石和记忆石，练到37级，出来', replies: [
          { author: '江上988', content: '困难也不行的吗', replyTo: '超级智慧大统领' },
          { author: '超级智慧大统领', content: '貌似也不行，只能用普通', replyTo: '江上988' }
        ] },
        { author: '狗牌不是狗', content: '我和你一样啊，同求同求，昨晚花了4个小时没搞定' },
        { author: '账号已注销？', content: '老大要一开始就参战，不要等到第二次才出，不然进不去**三周目**' },
        { author: '00023', content: '练功房在哪' },
        { author: '不工作细胞', content: '楼主 竹叶装怎么出的啊？', replies: [
          { author: '倔强の少年', content: '买黄色或者白色水手服，然后到酒馆对话就行了', replyTo: '不工作细胞' }
        ] },
        { author: '蔷薇Ziou', content: '熊猫装怎么获得的啊', replies: [
          { author: '安德烈冰赛斯', content: '大佬大佬，问一下你是怎么打补丁的？', replyTo: '蔷薇Ziou' },
          { author: '泰戈尔765', content: '我发了服饰收藏攻略，有兴趣可以自取', replyTo: '安德烈冰赛斯' }
        ] }
      ],
      replyCount: 32,
      viewCount: 15680
    },

    /* post28 */
    post28: {
      id: 'post28',
      title: '【天使乡】这游戏的意义',
      author: '啊哈哈哈',
      authorUID: 200026,
      date: '2017-09-30',
      board: '游戏讨论',
      replyCount: 18,
      viewCount: 5230,
      content: '家人们我刚接触这游戏，暂时感觉这游戏的恋爱内容和游戏本体游戏性很割裂，就像是单独做的东西没有和其他内容有完美的联动。有没有玩过的大佬解答一下，这游戏算恋爱游戏吗，我请问了：（',
      comments: [
        {
          author: '脆皮鸭',
          content: '算吧……？不过确实很割裂',
          date: '2017-09-30',
          replies: [
            { author: '啊哈哈哈', content: '难怪玩的时候像正经游戏', date: '2017-09-30', replyTo: '脆皮鸭' }
          ]
        },
        { author: '芭莎颗粒', content: '差不多，不过倒也算是优点，因为你不会因为一部分玩法而卡住了另一部分玩法，你甚至可以把天使卖掉，田也不种然后去专心打地牢。（不过真的能有人忍住不打地牢吗）', date: '2017-09-30' },
        { author: '心直口快', content: '就是割裂', date: '2017-09-30' },
        { author: '重生成为富二代', content: '要美术有美术，要剧情有美术，要优化有美术，要玩法有美术', date: '2017-09-30' },
        {
          author: '你在说啥002',
          content: '不是挺好的，我从来不让天使去打地牢的，受了伤我心疼',
          date: '2017-09-30',
          replies: [
            { author: '时尚巴比', content: '朋友，你挺性感的', date: '2017-09-30', replyTo: '你在说啥002' },
            { author: '啊哈哈哈', content: '那是感性', date: '2017-09-30', replyTo: '时尚巴比' },
            { author: '干哔啊', content: '那是感性', date: '2017-09-30', replyTo: '时尚巴比' },
            { author: '竖着走路也是螃蟹', content: '那是感性', date: '2017-09-30', replyTo: '时尚巴比' },
            { author: 'Doeg', content: '打破队形', date: '2017-09-30', replyTo: '时尚巴比' },
            { author: '你说的白是什么', content: '队形都没了啦，都怪你', date: '2017-09-30', replyTo: 'Doeg' }
          ]
        }
      ]
    },

    /* post29 */
    post29: {
      id: 'post29',
      title: '【WWT】有无大佬可以分享全cg存档',
      author: '芭芭拉能飞',
      authorUID: 200027,
      date: '2018-09-30',
      board: '资源分享',
      replyCount: 5,
      viewCount: 2480,
      content: '有无大佬可以分享全cg存档',
      comments: [
        { author: '芭芭拉能飞', content: '跪求', date: '2018-09-30' },
        { author: '芭芭拉能飞', content: '没人吗？', date: '2018-09-30' },
        { author: '芭芭拉能飞', content: '顶', date: '2018-09-30' }
      ]
    },

    /* post30 */
    post30: {
      id: 'post30',
      title: '【恋夏】这游戏是不是要坑了',
      author: '怒回去ooo',
      authorUID: 200028,
      date: '2021-11-21',
      board: '游戏讨论',
      replyCount: 8,
      viewCount: 860,
      content: '如题，我看作者上次更新都是3月份的事了，都大半年没动静，是不是要坑了',
      comments: [
        { author: '超胆大兔子244', content: '没坑，这作者就这样', date: '2021-11-21' },
        { author: '超胆大兔子244', content: '每次都挤牙膏更新，吃赞助吃爽了', date: '2021-11-21' },
        { author: 'dfgg大业', content: '外网赞助每月1w呢，这作者上个游戏也这样，习惯就好', date: '2021-11-21' },
        {
          author: '乌贼王',
          content: '上个游戏也**断更**了，独立游戏这样太正常了',
          date: '2021-11-21',
          replies: [
            { author: '怒回去ooo', content: '那他之后怎么处理的？', date: '2021-11-21', replyTo: '乌贼王' },
            { author: '乌贼王', content: '之后？之后你玩的这个游戏就出来了', date: '2021-11-21', replyTo: '怒回去ooo' },
            { author: '怒回去ooo', content: 'TAT', date: '2021-11-21', replyTo: '乌贼王' }
          ]
        }
      ]
    },

    /* post31 */
    post31: {
      id: 'post31',
      title: '【最后的物语】救救救！姐姐黑化线怎么走',
      author: '该电一电了',
      authorUID: 200029,
      date: '2022-12-09',
      board: '游戏讨论',
      replyCount: 16,
      viewCount: 1480,
      content: '妹妹线、妹妹黑化线、姐姐线都走过了，就是这个黑化线开不了，急得我上蹿下跳',
      comments: [
        {
          author: '勇士(=v=)',
          content: '黑化线剧情不咋地，写的最烂的一条，怀疑作者抽风了',
          date: '2022-12-09',
          replies: [
            { author: '该电一电了', content: '但是CG缺一张，我强迫症', date: '2022-12-09', replyTo: '勇士(=v=)' }
          ]
        },
        { author: 'Ddd嘟嘟嘟', content: '学园祭那别答应姐姐，也别回家就行', date: '2022-12-09' },
        {
          author: '交换机花岗岩',
          content: '姐1',
          date: '2022-12-09',
          replies: [
            { author: '该电一电了', content: '错误的妹1', date: '2022-12-09', replyTo: '交换机花岗岩' },
            { author: 'Dguadja', content: '正确的', date: '2022-12-09', replyTo: '该电一电了' }
          ]
        }
      ]
    },

    /* post32 */
    post32: {
      id: 'post32',
      title: '【八千八百】没有汉化怎么活',
      author: '白色烟雨°',
      authorUID: 200030,
      date: '2023-08-12',
      board: '资源分享',
      replyCount: 9,
      viewCount: 1240,
      content: '这游戏刚买的没有汉化攻略也没有刚打开就两眼一黑目前用的无道词典一点一点玩翻译还不是很难超级累希望有生之年能等到汉化要哭了',
      comments: [
        { author: '信心小心', content: '我买了个实时翻译软件还不错，不过会被反作弊检测出来然后弹出去，所以要随时存档。这个反作弊也是奇怪，有时候有，有时候又没有，摸不清楚规律', date: '2023-08-12' },
        {
          author: '旅行小鸟',
          content: '叫什么呀，能不能推荐一下',
          date: '2023-08-12',
          replies: [
            { author: '信心小心', content: '私你了', date: '2023-08-12', replyTo: '旅行小鸟' }
          ]
        },
        { author: '吾爱love', content: '找到了吗', date: '2023-08-12' },
        {
          author: '小小的最可爱',
          content: '汉化链接来一个呗论坛啥的找不到啊',
          date: '2023-08-12',
          replies: [
            { author: 'lamo@bblb', content: '私我', date: '2023-08-12', replyTo: '小小的最可爱' },
            { author: '小小的最可爱', content: '哇塞！感谢大佬！', date: '2023-08-12', replyTo: 'lamo@bblb' }
          ]
        },
        { author: '路易十六没有头', content: '这游戏没有官方汉化，只有民间的', date: '2023-08-12' }
      ]
    },

    /* post33 */
    post33: {
      id: 'post33',
      title: '【天使乡】求一份游戏资源',
      author: '立志成为无业游民',
      authorUID: 200031,
      date: '2017-09-30',
      board: '资源分享',
      replyCount: 14,
      viewCount: 3860,
      content: '小时候看姐姐玩过，现在姐姐去上大学了，她说已经删了那个游戏好久了。我小时候就很喜欢里面的天使，觉得好漂亮好漂亮，现在我也有电脑了，求大佬给我一个重温童年的机会',
      comments: [
        { author: '啊哈哈哈', content: '这游戏现在还有人玩啊', date: '2017-09-30' },
        {
          author: '#我重生了#',
          content: '私我',
          date: '2017-09-30',
          replies: [
            { author: '立志成为无业游民', content: '感谢大佬！！！', date: '2017-09-30', replyTo: '#我重生了#' }
          ]
        },
        { author: '我的仓鼠真可爱', content: '姐姐是个人物', date: '2017-09-30' }
      ]
    },

    /* post34 */
    post34: {
      id: 'post34',
      title: '【金色彼女】求金彼完美典藏版有偿',
      author: 'o最怒不过信阳红o',
      authorUID: 200032,
      date: '2017-09-30',
      board: '资源分享',
      replyCount: 11,
      viewCount: 2860,
      content: '有偿求该版本。\n有的朋友联系我。',
      comments: [
        { author: '神迹的神', content: '我只有普通版，遗憾desu', date: '2017-09-30' },
        {
          author: '永恒のAI',
          content: '需要吗我有',
          date: '2017-09-30',
          replies: [
            { author: 'o最怒不过信阳红o', content: '方便发一下吗', date: '2017-09-30', replyTo: '永恒のAI' }
          ]
        }
      ]
    },

    /* post35 */
    post35: {
      id: 'post35',
      title: '【讨论】现在的游戏越来越贵了，玩不起了',
      author: '无敌吴迪',
      authorUID: 200033,
      date: '2021-09-22',
      board: '闲谈茶馆',
      replyCount: 24,
      viewCount: 1680,
      content: '以前几十块就能买个不错的游戏，现在动不动就两三百，还要买DLC。感觉钱包越来越不够用了。',
      comments: [
        { author: '不哈都舍不得海', content: '制作也比以前好了嘛有得必有失', date: '2021-09-22' },
        { author: '三头大白鲨', content: '总得让人挣钱，不过实在没钱就学习版咯，有钱再补票', date: '2021-09-22' },
        {
          author: '埃菲尔钢管',
          content: '等打折吧，我都是等半价才买',
          date: '2021-09-22',
          replies: [
            { author: '海底世界', content: '太富有了，我都等A宝送', date: '2021-09-22', replyTo: '埃菲尔钢管' }
          ]
        }
      ]
    },

    /* post36 */
    post36: {
      id: 'post36',
      title: '【缅怀】最爱的剧本家走了，难过',
      author: '四十岁老头子',
      authorUID: 200034,
      date: '2024-11-10',
      board: '闲谈茶馆',
      replyCount: 18,
      viewCount: 456,
      content: '哎，最近上班太忙都没怎么打游戏，结果前几天朋友告诉我，我以前最喜欢的一个剧本家去世了，说是寿终正寝，好难过，感觉自己老了，一个时代就在眼前流走了',
      comments: [
        { author: '三把火呀', content: '默哀', date: '2024-11-10' },
        { author: '阿加莎不睡觉', content: '默哀', date: '2024-11-10' },
        { author: '舍不得哈巴狗', content: '默哀', date: '2024-11-10' },
        {
          author: 'QueenK',
          content: '默哀，不过寿终正寝已经很好了，没遭罪，前几天我还看一新闻，说有个特年轻的游戏制作人也走了，唉，长叹一声',
          date: '2024-11-10',
          replies: [
            { author: '四十岁老头子', content: '真的假的不会吧', date: '2024-11-10', replyTo: 'QueenK' },
            { author: 'QueenK', content: '应该是真的，好像是**车祸**什么的', date: '2024-11-10', replyTo: '四十岁老头子' },
            { author: '四十岁老头子', content: '唉，英年早逝', date: '2024-11-10', replyTo: 'QueenK' }
          ]
        }
      ]
    },

    /* post37 */
    post37: {
      id: 'post37',
      title: '【求助】求战王4的汉化补丁',
      author: '夕阳西下几时走',
      authorUID: 200035,
      date: '2022-09-15',
      board: '资源分享',
      replyCount: 3,
      viewCount: 680,
      content: '下好了游戏发现没中文，楼主也不会英语啊，这可咋办',
      comments: [
        {
          author: '白金汉爵',
          content: '私',
          date: '2022-09-15',
          replies: [
            { author: '夕阳西下几时走', content: '好嘞', date: '2022-09-15', replyTo: '白金汉爵' }
          ]
        }
      ]
    },

    /* post38 */
    post38: {
      id: 'post38',
      title: '【讨论】有些游戏评论区真的没法看',
      author: '你是不是油饼',
      authorUID: 200036,
      date: '2021-12-20',
      board: '闲谈茶馆',
      replyCount: 4,
      viewCount: 720,
      content: '现在游戏评论区房气太重了，稍微有点问题就一顿骂，还有人专门去刷差评。\n\n这样下去谁还敢做游戏？',
      comments: [
        {
          author: '8拾光者8',
          content: '所以我现在不看评论了，自己玩',
          date: '2021-12-20',
          replies: [
            { author: '你是不是油饼', content: '明智', date: '2021-12-20', replyTo: '8拾光者8' }
          ]
        },
        { author: '不说假的', content: '确实，有些人就是来发泄的', date: '2021-12-20' }
      ]
    },

    /* post39 */
    post39: {
      id: 'post39',
      title: '【沃德之城】十周年了真一点动静也没有？',
      author: '我爱你爱和恨',
      authorUID: 200037,
      date: '2023-01-29',
      board: '游戏讨论',
      replyCount: 7,
      viewCount: 980,
      content: '2013年1月8日沃德之城上线1.0版本，十周年了断更六年，还是一点风声也没有吗？苟公司都在干嘛',
      comments: [
        { author: '丽丽姐', content: '早就是弃子了', date: '2023-01-29' },
        { author: '买橙子的小姑娘', content: '可惜啊', date: '2023-01-29' },
        { author: '我就爱玩太刀', content: '认清现实了', date: '2023-01-29' },
        { author: '小满月', content: '断更六年没绷住', date: '2023-01-29' },
        { author: '新来的98L', content: '寄了', date: '2023-01-29' }
      ]
    },

    /* post40 */
    post40: {
      id: 'post40',
      title: '【公告】关于撤销ALLWORLD红版主管理权限的说明',
      author: '论坛用户0987564',
      authorUID: 200038,
      date: '2024-02-25',
      board: '资源分享',
      replyCount: 1,
      viewCount: 348,
      content: '经核实版主ALLWORLD红未通过普通版主考核。违反《给力GAME版主制度》相关规定，无法在建设资源分享板块内容上、言论导向上发挥应有的模范带头作用。故撤销其版主管理权限。\n\n给力GAME管理组\n\n2024年2月25日',
      comments: []
    },

    /* post41 —— 本次更新为「大家好，我是从FGA来的」 */
    post41: {
      id: "post41",
      title: "大家好，我是从FGA来的",
      author: "小白菜难民",
      date: "2022-05-15",
      board: "闲谈茶馆",
      content: "FGA最近改版太频繁了，老资历用不习惯，听说这个论坛氛围不错，就过来看看",
      comments: [
        { author: "今夜航船", content: "欢迎，这里确实安静一些" },
        { author: "给我留盏灯", content: "F站现在确实变味了", replies: [
          { author: "小白菜难民", content: "唉，老资历真是老了", replyTo: "给我留盏灯" }
        ] },
        { author: "小小切是企鹅", content: "放心，这里可能会倒闭，但绝对不会变质" }
      ],
      replyCount: 5,
      viewCount: 320
    },

    /* post42 */
    post42: {
      id: 'post42',
      title: '【求助】还有人记得十年前的老游戏吗？',
      author: '老骨头',
      authorUID: 200040,
      date: '2022-03-15',
      board: '游戏讨论',
      replyCount: 6,
      viewCount: 1080,
      content: '找一款游戏，好像是个种田的，但是还带点恐怖。我记得剧情是男主是个农夫，有一天跟妻子争执，失手杀了人。这游戏就是白天种地，晚上偷偷挖坑埋尸体，还挺吓人的。我记得我玩过，但是网上怎么也找不到',
      comments: [
        { author: '要得好167', content: '没玩过，但感觉挺有意思的，蹲一个', date: '2022-03-15' },
        { author: '俺就爱吃大米饭', content: '有点诡异了吧这游戏', date: '2022-03-15' },
        {
          author: '熟悉阿布',
          content: '真的假的，不会是楼主自己做梦当真了吧',
          date: '2022-03-15',
          replies: [
            { author: '老骨头', content: '应该，不会吧。。。', date: '2022-03-15', replyTo: '熟悉阿布' }
          ]
        },
        {
          author: '凌晨两点半不回家',
          content: '不管真的假的，想玩，楼主能不能做出来',
          date: '2022-03-15',
          replies: [
            { author: '特工零零发', content: '+10086', date: '2022-03-15', replyTo: '凌晨两点半不回家' }
          ]
        }
      ]
    },

    /* post43 */
    post43: {
      id: 'post43',
      title: '【分享】翻出了小时候玩的游戏机，还能开机',
      author: '第①考古学家',
      authorUID: 200041,
      date: '2022-06-20',
      board: '闲谈茶馆',
      replyCount: 5,
      viewCount: 820,
      content: '收拾房间翻出了小时候的游戏机，没想到还能开机！插上卡带居然能玩，泪目了。',
      comments: [
        { author: '大奶牛hhh', content: '牛啊，我的早就坏了', date: '2022-06-20' },
        {
          author: '不敢看电视',
          content: '这才是真正的考古',
          date: '2022-06-20',
          replies: [
            { author: '第①考古学家', content: '哈哈哈，确实', date: '2022-06-20', replyTo: '不敢看电视' }
          ]
        },
        { author: '不是啥子', content: '保存得真好，我以前的都不知道扔哪了', date: '2022-06-20' }
      ]
    },

    /* post44 */
    post44: {
      id: 'post44',
      title: '【服务公告】社区内容规范优化及发帖秩序整顿通知',
      author: '给力GAME管理组',
      authorUID: 300026,
      date: '2016-06-20',
      board: '站务公告',
      replyCount: 3,
      viewCount: 2860,
      content: '各位论坛玩家、社区用户：\n为进一步净化社区讨论环境，规范论坛发帖及互动秩序，营造健康、理性、友好的独立游戏交流氛围，本站服务团队结合近期社区运营情况，针对站内发帖规范、内容审核、互动行为管理等相关规则进行统一优化与重申。即日起，论坛将正式开展常态化社区秩序整顿工作，现将具体规则与整改要求公告如下，请全体用户自觉遵守。\n\n一、严格规范发帖内容，杜绝无关水帖与违规内容\n本次整顿将重点整治无意义灌水、重复发帖、刷屏引流、低质凑数帖等影响社区浏览体验的内容。所有用户发帖需严格对应对应板块分类，独立游戏测评、新作安利、开发心得、资源分享、求助答疑等内容需对号入座，禁止跨板块乱发、批量发帖、恶意屠版。同时，严禁发布包含低俗色情、引战对线、人身攻击、造谣传谣、侵权搬运、商业引流、外挂破解、盗版资源传播等违规内容，一经发现将直接进行删帖处理。\n\n二、规范社区互动行为，杜绝恶意引战与网络对立\n论坛始终秉持理性交流、尊重创作、友好讨论的核心宗旨，鼓励玩家分享游戏体验、交流开发思路、探讨游戏玩法。严禁用户在评论区、帖子内恶意抬杠、人身攻击、嘲讽谩骂、拉踩引战，禁止针对个人、团队、游戏作品进行无端抹黑与恶意诋毁。对于理性观点分歧、正常讨论争议，服务团队将中立判定，但若出现刻意激化矛盾、抱团攻击、恶意挂人等行为，将一律从严处置。\n\n三、明确违规处罚标准，实行分级管理机制\n为保障社区公平有序，本次整顿实行分级处罚机制，根据违规情节轻重采取对应处置措施：对于轻度水帖、轻微违规言论，将以删帖、私信警告为主；对于多次违规、恶意刷屏、跨版乱发内容的用户，将进行短期禁言、限制发帖权限处理；对于传播违规资源、恶意引战、人身攻击、造谣抹黑、屡教不改的用户，将直接永久封禁账号，不予解封。\n\n四、开通合规申诉渠道，欢迎用户监督反馈\n为保障全体用户的合法权益，若用户对删帖、禁言、封禁等处置结果存在异议，可通过论坛私信官方版务账号提交申诉，申诉需附带帖子链接、违规说明及相关截图凭证，服务团队将在24小时内完成核查并回复结果。同时，欢迎广大用户积极举报站内违规内容与不良行为，共同监督维护社区环境，携手共建优质独立游戏交流社区。\n\n优质的社区氛围需要每一位用户共同维护，希望全体玩家自觉遵守论坛规章制度，理性发言、文明交流，尊重每一位游戏创作者的心血与成果，共同守护纯粹、优质、积极的游戏交流平台。后续服务团队将持续常态化巡查社区内容，根据社区运营情况适时优化规则，相关更新内容将第一时间发布公告告知。特此公告。\n\n给力GAME管理组\n\n2016年6月20日',
      comments: [
        { author: '是内涵式哟', content: '支持', date: '2016-06-20' },
        { author: '韩新·画', content: '支持', date: '2016-06-20' },
        { author: '上班喝下班喝', content: '支持', date: '2016-06-20' }
      ]
    },

    /* post45 */
    post45: {
      id: 'post45',
      title: '【服务公告】关于最近版内灌水现象的公告',
      author: '给力GAME管理组',
      authorUID: 300027,
      date: '2018-09-12',
      board: '站务公告',
      replyCount: 3,
      viewCount: 2240,
      content: '各位论坛用户、各位创作者与玩家：\n近期，服务团队在日常巡查中发现，本板块无意义灌水、重复刷屏、凑字数水帖、无脑回复等现象明显增多，对板块阅读体验、内容质量以及正常讨论秩序造成较大影响。为维护干净、有序、高质量的交流环境，现针对版内灌水问题统一公告整改要求，即日起正式执行。\n\n本次整治重点针对以下灌水行为，一经发现将统一处理：\n\n1. 纯凑数类内容：仅发表"路过""看看""不错""顶一下"等无实际观点、无有效信息的空泛回复，以及无文字内容的纯表情、纯符号刷屏回复。\n\n2. 重复批量灌水：短时间内连续发布多条同质化内容、重复回复、重复占位楼层，恶意抬高帖子热度、占用版面资源的行为。\n\n3. 低质水帖刷屏：无主题、无内容、无讨论价值的空帖、测试帖、随手水帖，与板块游戏交流、创作讨论主题无关的闲聊灌水帖。\n\n4. 恶意蹭帖灌水：在新作分享、开发日志、测评攻略、求助答疑等优质内容帖子下，大量无关灌水、歪楼闲聊，干扰正常讨论。\n\n本板块定位为游戏作品交流、创作分享、技术探讨与经验交流板块，欢迎大家发布真实体验、客观评价、开发心得、问题求助与干货内容。良性讨论、观点交流、有理有据的争议发言，不属于灌水范畴，平台始终鼓励优质原创内容与理性互动。\n\n即日起，服务团队将对版内内容进行常态化清理与巡查，执行统一处置标准：\n\n1. 普通灌水回复、低质水帖，统一直接删除，不另行通知；\n\n2. 短期内多次灌水、屡发屡删的账号，将视情节给予限时禁言、限制发帖处罚；\n\n3. 恶意刷屏、批量灌水、刻意扰乱版面秩序的账号，将直接永久封禁。\n\n良好的社区氛围需要所有人共同维护。希望各位用户自觉规范发言与发帖行为，拒绝无效灌水，专注内容交流。服务团队将持续严格落实版面管理规则，持续净化社区环境，为广大创作者与玩家提供纯粹、优质的交流阵地。特此公告，请全体用户知悉并自觉遵守。\n\n给力GAME管理组\n\n2018年9月12日',
      comments: [
        { author: '各奋斗各的', content: '支持', date: '2018-09-12' },
        { author: '啊大大啊@A', content: '支持', date: '2018-09-12' },
        { author: '王策的纷纷88978', content: '支持', date: '2018-09-12' }
      ]
    },

    /* post46 */
    post46: {
      id: 'post46',
      title: '【新手指南】论坛注册、发帖与板块规范入门指引',
      author: '给力GAME管理组',
      authorUID: 300028,
      date: '2016-09-12',
      board: '新手指南',
      replyCount: 3,
      viewCount: 1980,
      content: '欢迎各位新玩家、独立游戏创作者加入本站！\n为帮助新进用户快速熟悉论坛规则、了解板块功能、规避常见违规问题，更快融入社区交流氛围，服务团队特此整理本新手指南。请各位新人在发帖、回复前认真阅读，自觉遵守社区规范，共同维护优质的游戏交流环境。\n\n一、论坛定位与社区理念\n本站为独立游戏专属交流社区，面向游戏玩家、独立开发者、游戏爱好者开放。社区主打原创分享、开发交流、作品测评、资源互助与经验探讨。我们鼓励真实、理性、有价值的内容输出，拒绝低质灌水、恶意引战、侵权搬运与商业引流行为，致力于打造纯粹、高质量的独立游戏交流平台。\n\n二、基础账号使用规范\n1. 本站账号注册遵循自愿、自主原则，严禁批量注册小号、恶意注册马甲账号用于刷屏、引战、违规顶帖。\n\n2. 用户昵称、头像、个人签名禁止包含低俗、暴力、引战、涉政、广告导流等违规元素，一经发现将强制修改，情节严重者直接封禁账号。\n\n3. 禁止盗用他人账号、抄袭他人个人主页信息、冒充其他用户或知名创作者，杜绝一切侵权与冒充行为。\n\n三、发帖与回复通用规则\n1. 杜绝低质灌水：禁止纯表情、无意义短句、重复回复、凑字数占位等灌水行为，相关内容将统一清理。\n\n2. 尊重原创创作：转载内容需注明来源与作者，禁止私自搬运、篡改他人原创作品、盗用开发素材，严禁传播盗版资源、破解补丁与外挂工具。\n\n3. 文明理性交流：禁止人身攻击、嘲讽谩骂、拉踩引战、挂人对线，允许合理观点争议，但严禁刻意激化矛盾、恶意抬杠。\n\n4. 严禁违规引流：禁止私发广告、社群二维码、外部链接、商业推广内容，杜绝一切盈利引流、传销推广行为。\n\n四、新人常见禁忌与处罚说明\n1. 新人首次轻微违规（轻度灌水、错版发帖），以删帖+站内提醒为主，予以容错纠正；\n\n2. 多次违规、屡教不改、恶意刷屏扰乱版面秩序，将给予限时禁言、限制发帖处罚；\n\n3. 涉及侵权、传播违规资源、恶意引战抹黑、账号违规操作等严重行为，直接永久封禁，不予申诉解封。\n\n五、申诉与求助渠道\n新人若遇到账号异常、误删帖子、板块疑问、规则困惑等问题，可通过论坛私信联系服务团队咨询。所有申诉请附带帖子链接、问题截图，服务将在工作日24小时内核实回复，公正处理各类问题。\n\n最后，再次欢迎各位新用户入驻！希望大家遵守社区规则，积极参与优质内容创作与交流，在这里分享热爱、收获成长，共同搭建良好的独立游戏社区氛围。\n\n本指南最终解释权归论坛版务组所有，后续将根据社区运营情况适时更新。\n\n给力GAME管理组\n\n2016年9月12日',
      comments: [
        { author: '多磨痛的领wu', content: '支持', date: '2016-09-12' },
        { author: 'Y大的就是好Y', content: '支持', date: '2016-09-12' },
        { author: '保护你方水晶', content: '支持', date: '2016-09-12' }
      ]
    },

    /* post47 */
    post47: {
      id: 'post47',
      title: '【重要公告】社区停运及维护终止说明',
      author: '给力GAME管理组',
      authorUID: 300029,
      date: '2025-01-01',
      board: '站务公告',
      replyCount: 3,
      viewCount: 120,
      content: '各位长久以来支持本站的用户、独立游戏爱好者与创作者：\n时光荏苒，本站自2016年初正式开启运营，至今已陪伴大家走过近十年时光。多年来，我们始终致力于为广大独立游戏玩家、开发者提供纯粹、自由、友好的交流平台，见证了无数原创作品的诞生、无数开发心得的分享，也留存了大量珍贵的社区帖文与交流记录。\n\n因平台运营规划整体调整，经服务团队慎重研究并综合评估后，现正式公告：本站将于2025年3月1日正式停止所有后台维护、更新及人工运营工作。\n\n为最大程度保留社区各位用户的原创内容与珍贵回忆，平台停运后将不会删除任何用户发布的帖文、作品分享、讨论内容。全站将永久转为只读模式。届时，用户将无法进行注册、发帖、回复、编辑、上传等操作，仅可正常浏览站内全部历史内容。\n\n自本公告发布之日起，社区将不再开展新的活动、内容更新及板块优化工作。2025年3月1日起，所有人工服务管理、问题申诉、账号维护、故障修复等工作将全面终止，后续不再受理任何相关咨询与申请。\n\n十年相伴，感恩同行。衷心感谢每一位用户多年来的热爱、包容与坚守，感谢所有独立创作者的真诚分享与用心产出。纵使平台停止运营，这片承载着无数热爱与初心的社区沃土，将以只读的形式永久留存，定格所有美好与珍贵的创作回忆。\n\n再次向所有支持过本站的用户致以最诚挚的谢意！\n\n特此公告。\n\n给力GAME管理组\n\n2025年1月1日',
      comments: [
        { author: '不会学不会', content: '再见', date: '2025-01-01' },
        { author: '@不是学生900', content: '舍不得啊', date: '2025-01-01' },
        { author: '高压锅一个吧', content: '，爷青结了，感谢陪伴', date: '2025-01-01' }
      ]
    },

    /* post48 */
    post48: {
      id: 'post48',
      title: '【月次】云间彩，心上霜',
      author: '小熊饼干xgf',
      authorUID: 400048,
      date: '2024-07-20',
      board: '同人创作',
      replyCount: 4,
      viewCount: 268,
      content: '',
      comments: []
    },
    /* post49 */
    post49: {
      id: 'post49',
      title: '【胡梦/cp向】结局的另一种可能',
      author: '我是文档大王',
      authorUID: 400049,
      date: '2022-08-30',
      board: '同人创作',
      replyCount: 2,
      viewCount: 586,
      content: '',
      comments: []
    },
    /* post50 */
    post50: {
      id: 'post50',
      title: '画一些健康的boy meets girl图',
      author: '小满',
      authorUID: 400050,
      date: '2021-08-05',
      board: '同人创作',
      replyCount: 2,
      viewCount: 698,
      content: '',
      comments: []
    },
    /* post51 */
    post51: {
      id: 'post51',
      title: '【西北组】试着给游戏主题曲填了词',
      author: '不洗路人甲',
      authorUID: 400051,
      date: '2022-04-15',
      board: '同人创作',
      replyCount: 3,
      viewCount: 624,
      content: '',
      comments: []
    },
    /* post52 */
    post52: {
      id: 'post52',
      title: '【兴业兴】雨夜三章：一个关于遗忘与死亡的故事',
      author: '我滴个天呐',
      authorUID: 400052,
      date: '2018-10-02',
      board: '同人创作',
      replyCount: 4,
      viewCount: 3080,
      content: '',
      comments: []
    },
    /* post53 */
    post53: {
      id: 'post53',
      title: '【原创】画了一张主角的立绘',
      author: '拾光者hhJ',
      authorUID: 400053,
      date: '2024-06-10',
      board: '同人创作',
      replyCount: 5,
      viewCount: 312,
      content: '',
      comments: []
    },
    /* post54 */
    post54: {
      id: 'post54',
      title: '七夕特供！',
      author: '船上有个人6678',
      authorUID: 400054,
      date: '2019-05-23',
      board: '同人创作',
      replyCount: 2,
      viewCount: 2288,
      content: '',
      comments: []
    },
    /* post55 */
    post55: {
      id: 'post55',
      title: '【音乐社】自制游戏BGM翻奏',
      author: '懒懒的蛋黄',
      authorUID: 400055,
      date: '2019-04-25',
      board: '同人创作',
      replyCount: 3,
      viewCount: 2442,
      content: '',
      comments: []
    },
    /* post56 */
    post56: {
      id: 'post56',
      title: '后记',
      author: '许云',
      date: 'DYNAMIC_DATE',
      board: '首页-热点推荐',
      content: '1\n郑怡君。\n许云没见过她几次。\n\n2\n第一次是在春节。\n那是24年，往后十年里年味最淡的一个新年，也是此前十年年味最浓的一年。\n许云回了家，看见门上挂了不知道多少年的老虎年画被摘下来，换上了当年对应的生肖，心里生出几分新奇。\n父母难得为了那些从来看不上眼的习俗忙前忙后。一问，母亲扬起嘴角告诉他，许阳要回来，带着对象一起。\n\n3\n许阳。\n他有好多年没听过这个名字了。\n\n4\n同胞的姐姐，在印象里，是太阳一样的人物。\n都说双胞胎哪里都会很像，但或许因为是龙凤胎，长得不同，性别也不一样，所以注定处处相反。\n她张扬，他内向；她叛逆，他顺从。当年她偷玩游戏，被父亲拎着扫帚追得满院子跑的时候，他还坐在房间里一声不吭地做题。\n明明出生时只差了十分钟，性格却如同地球仪的两极，天差地别。\n就连邻居提及他们的时候，也总要来上一句：\u201c这两个孩子，真是哪哪都不一样。\u201d\n可许云总觉得，差异没有那么复杂。\n许阳勇敢，而他懦弱，仅此而已。\n\n5\n勇敢的许阳早早飞出了这个家。\n她在报考志愿的时候，跑到了父母嘴里最不喜欢的\u201c远地方\u201d，选了父母看也看不懂的计算机。\n而懦弱的许云留了下来，在离家很近的城市，当了老师。\n许阳走的那天下了很大的雨，跟父母也吵了很大的架。许云插不上嘴，只能眼睁睁听着父母穷尽难听的话去诅咒自己的另一个骨肉。\n怎么能那么狠心呢？\n像是为了证明自己的决心，许阳一走就是好多年，再没回过家。\n\n6\n许阳回来了，又走了。\n那天的气氛从一开始就紧绷。父母盛装打扮，脸上勉强挤出的笑容，在看见门后的那个人时瞬间垮掉，质问与争吵接踵而至。\n许云沉默地起身，片刻便明白了这场冲突的根源。\n许阳说要带回来的对象，是个女人。\n\n7\n许云也会上网，他当然知道这意味着什么。他的父母应该也知道，所以才会那么崩溃。\n母亲失控地大哭起来，而父亲随手抄起烧火用的棍子，怒吼着不要让她再回来。\n许阳转身就走。\n许云制住冲动的父亲，在晃动的人影缝隙间，他看见了多年未见的长姐，还有那个始终被她护在身后的那个人。\n很漂亮，打扮得也很得体。\n倘若许阳是个男人，她大概会是父母最爱的那一类儿媳。\n可惜，许阳是他姐姐。\n\n8\n母亲终日以泪洗面，哀叹那个永远不会降生的外孙。父亲也开始一包一包地抽烟，恨不得将院子变成开放式谋杀中心。\n许云避开烟雾缭绕的父亲，回屋，对母亲说上几句安抚的话。\n心里却在想：你们在震惊、难过些什么呢？许阳不就是这样一个人吗？\n热烈的，张扬的，从来不肯循规蹈矩地活着的。\n在许云眼里，眼前这个真实存在的爱人，难道不比一个虚无缥缈的 \u201c姐夫\u201d 更加值得珍惜吗？\n但他到底没说出来，反正他们是不会听的。\n\u201c我是造了什么孽……\u201d\n母亲又凄凄一声。\n\n9\n多说多错，多做多错。\n这是许云从父母那里学来的处事准则。\n所以，对于许阳的这件事，他同样做了个沉默的透明人。\n反正冷战又不是一天两天了，总有缓和的时候。\n\n10\n可再次得知许阳的消息，是一通医院打来的电话。\n许阳死了。\n将这件事转告给父母的时候，他甚至还带着一丝不真实的戏谑。\n因为，太阳怎么可能熄灭呢？\n可等赶到医院，医生仅仅掀开白布一角，母亲凄厉的哭嚎立刻响彻整条走廊。\n许云不忍心去看，他下意识侧目，看见不远处坐着另一个人。脸色惨白，脚上只穿了一只鞋，另一只不知去向，整个人僵直得如同木偶。\n啊。许云想。\n她也在。\n\n11\n事故判定结束之后，遗体的安置也可以继续进行了。\n现在早就不流行土葬，遗体被推进炉火，青烟袅袅，最后变成小小一坛。\n许云抱着它。\n敲响了出租屋的门。\n\n12\n许阳要回到老家安葬，她的东西也该带走。\n再一次相见，两方的气氛都平静了很多。父母微微颔首，沉默地收拾起东西，仿佛昔日的争执从来不存在。\n人已经不在了，再争辩对错又有什么意义。\n更何况，谁还能对那样的人再说出什么重话呢？\n那样形容枯槁，像是一夜之间被抽走了所有生机，所有的美丽都覆上一层挥之不去的死气。\n对那样的人，还能在说出什么话呢？\n\u201c要抱一抱吗？\u201d\n许云俯下身，将那个罐子举到她的面前。\n那个罐子并不很大，买的是最贵的那一档，推销人员说的天花乱坠，夸它是难得的珍品。\n它的确好看，许云却觉得太\u201c沉\u201d了，白色的陶瓷材质，微微泛着青，沉静，雅致。\n一点也不像她。\n或许，郑怡君也是这么想的。\n她缓缓伸出手，手指很轻地触碰了一瞬，又躲开。\n眼泪猝的就掉了下来。\n\n13\n许云见她的最后一面，还是在出租屋。\n已经不是原来那间了，跟着地址一路找过去的时候，连他自己都不敢相信。\n城中村的小单间，阴暗，潮湿，逼仄，没有开灯，也没有窗户。\n瘦削的女人躺在那里，已经没了气息。\n吃得肥头大耳的房东发出一声惊呼，又骂骂咧咧地说\u201c真晦气，这样还怎么租给别人\u201d。\n许云只是定定地上前，把那些都当做耳旁风。\n白玉般的骨灰坛的另一边，是一本被风吹开的日记。\n\n14\n郑怡君是孤儿。\n她没有家人，也几乎没有朋友，只能独来独往地想念她。\n\n15\n许云将她们合葬在一起。他心里清楚，若是父母知晓这件事，一定会像以前勃然大怒。\n母亲会痛哭，父亲会发怒，呵斥着他的不孝，逼他承认自己的错误。\n可许云还是这么做了。\n这几年，他常常在想。\n如果那年春节，自己没有沉默，没有任由双方争执爆发，会不会更好。\n如果过去的那些年，自己没有选择疏离，而是跟许阳站在一起，会不会更好。\n他当然明白\u201c如果\u201d是不存在的，也当然知道，依照父母的个性，就算他当时出面，冲突未必能够避免，许阳的结局或许依旧无法改变。\n可是，遗憾还在，遗憾总在，长久地盘踞心底。\n直到坟土重新覆合，许云仰头，朝天缓缓吐出一口气。\n要入冬了。\n新的一年，就要到了。',
      comments: [
        { author: '来自作者', content: '谢谢你，玩了我的游戏' }
      ],
      replyCount: 1,
      viewCount: 1
    },
    /* post57 */
    post57: {
      id: 'post57',
      title: '【满轨】cp相性50问',
      author: '子木李不是木子李',
      authorUID: 400057,
      date: '2017-03-15',
      board: '同人创作',
      replyCount: 2,
      viewCount: 2172,
      content: '',
      comments: []
    },
    /* post58 */
    post58: {
      id: 'post58',
      title: '【PTO】游戏场景水彩练习',
      author: '花洒不合适九年级',
      authorUID: 400058,
      date: '2021-02-20',
      board: '同人创作',
      replyCount: 2,
      viewCount: 556,
      content: '',
      comments: []
    }
  };

  /* ---------- 搜索索引 ---------- */
  var searchIndex = {
    '我的小屋': ['post4'],
    '用户96234': ['post8'],
    '抄袭': ['post9', 'post10'],
    '车祸': ['post5'],
    '赛博飞升': ['post12'],
    '恋人': ['post11'],
    '郑怡君': ['post6', 'post7'],
    '2024年9月15日': ['post5']
  };

  var forumCredentials = {
    username: 'player',
    password: '123456'
  };

  /* ---------- 版块列表 ---------- */
  var boards = [
    {
      name: '管理',
      forums: [
        {
          id: 'board-admin',
          name: '站务公告',
          iconText: '站',
          color: '#4a7ca0',
          moderator: '管理员',
          today: 0,
          threads: 32,
          posts: 568,
          lastTitle: '【重要公告】社区停运及维护终止说明',
          lastAuthor: '给力GAME管理组',
          lastDate: '2025-01-01'
        },
        {
          id: 'board-guide',
          name: '新手指南',
          iconText: '新',
          color: '#5a8a5a',
          moderator: '管理员',
          today: 0,
          threads: 28,
          posts: 204,
          lastTitle: '【新手指南】论坛注册、发帖与板块规范入门指引',
          lastAuthor: '给力GAME管理组',
          lastDate: '2016-09-12'
        }
      ]
    },
    {
      name: '杂谈',
      forums: [
        {
          id: 'board-game',
          name: '游戏讨论',
          iconText: '游',
          color: '#4a7ca0',
          moderator: '南山客',
          today: 30,
          threads: 606,
          posts: 13542,
          lastTitle: '【求助】哈里西战争这游戏咋样，值得入吗？',
          lastAuthor: '11区卡密sama',
          lastDate: '2024-02-10'
        },
        {
          id: 'board-resource',
          name: '资源分享',
          iconText: '资',
          color: '#3a7a7a',
          moderator: '拾光者',
          today: 188,
          threads: 1271,
          posts: 32998,
          lastTitle: '【音频】听着很舒服的白噪音21首',
          lastAuthor: '失眠患者112',
          lastDate: '2024-08-25'
        },
        {
          id: 'board-screenshot',
          name: '闲谈茶馆',
          iconText: '闲',
          color: '#a06a3a',
          moderator: '白鹭',
          today: 106,
          threads: 892,
          posts: 21045,
          lastTitle: '【讨论】熬夜打游戏真的会猝死吗？',
          lastAuthor: '月亮不睡我不睡',
          lastDate: '2025-01-24'
        },
        {
          id: 'board-fanart',
          name: '同人创作',
          iconText: '同',
          color: '#7a5a9a',
          moderator: '苏打水',
          today: 87,
          threads: 634,
          posts: 15872,
          lastTitle: '【月次】云间彩，心上霜',
          lastAuthor: '小熊饼干xgf',
          lastDate: '2024-07-20'
        }
      ]
    }
  ];

  var hotPosts = [
    'post20',
    'post23',
    'post42',
    'post24'
  ];

  /* ---------- 各版块的帖子列表 ----------
     说明：
       - board-screenshot（闲谈茶馆）新增 post41（本次补入）
       - post5 仍然保留在 threadsByBoard 中，由 js/forum.js 在
         applyThreadFilter 阶段统一剔除，保证 post5 不出现在
         子版块列表中，但仍可被搜索命中
  ---------------------------------------------------- */
  var threadsByBoard = {
    'board-admin': [
      { id: 'post47', title: '【重要公告】社区停运及维护终止说明', tag: '公告', author: '给力GAME管理组', replies: 3, views: 120, lastAuthor: '高压锅一个吧', lastDate: '2025-01-01' },
      { id: 'post45', title: '【服务公告】关于最近版内灌水现象的公告', tag: '公告', author: '给力GAME管理组', replies: 3, views: 2240, lastAuthor: '王策的纷纷88978', lastDate: '2018-09-12' },
      { id: 'post44', title: '【服务公告】社区内容规范优化及发帖秩序整顿通知', tag: '公告', author: '给力GAME管理组', replies: 3, views: 2860, lastAuthor: '上班喝下班喝', lastDate: '2016-06-20' }
    ],
    'board-guide': [
      { id: 'post46', title: '【新手指南】论坛注册、发帖与板块规范入门指引', tag: '公告', author: '给力GAME管理组', replies: 3, views: 1980, lastAuthor: '保护你方水晶', lastDate: '2016-09-12' }
    ],
    'board-game': [
      { id: 'post13', title: '【求助】哈里西战争这游戏咋样，值得入吗？', tag: '讨论', author: '11区卡密sama', replies: 8, views: 380, lastAuthor: '11区卡密sama', lastDate: '2024-02-10' },
      { id: 'post39', title: '【沃德之城】十周年了真一点动静也没有？', tag: '讨论', author: '我爱你爱和恨', replies: 7, views: 980, lastAuthor: '我爱你爱和恨', lastDate: '2023-01-29' },
      { id: 'post31', title: '【最后的物语】救救救！姐姐黑化线怎么走', tag: '讨论', author: '该电一电了', replies: 16, views: 1480, lastAuthor: '该电一电了', lastDate: '2022-12-09' },
      { id: 'post42', title: '【求助】还有人记得十年前的老游戏吗？', tag: '讨论', author: '老骨头', replies: 6, views: 1080, lastAuthor: '老骨头', lastDate: '2022-03-15' },
      { id: 'post30', title: '【恋夏】这游戏是不是要坑了', tag: '讨论', author: '怒回去ooo', replies: 8, views: 860, lastAuthor: '怒回去ooo', lastDate: '2021-11-21' },
      { id: 'post25', title: '【QWRL】今天游戏怎么全是乱码，求一只大佬解惑', tag: '讨论', author: '键盘侠', replies: 8, views: 1200, lastAuthor: '键盘侠', lastDate: '2020-04-01' },
      { id: 'post23', title: '你们这个是个什么论坛啊？！', tag: '讨论', author: '国服第一李莫愁', replies: 12, views: 4280, lastAuthor: '国服第一李莫愁', lastDate: '2019-07-15' },
      { id: 'post14', title: '【求助】去火星最后一关的解密怎么整啊', tag: '讨论', author: '想做游戏', replies: 12, views: 3200, lastAuthor: '想做游戏', lastDate: '2019-03-05' },
      { id: 'post28', title: '【天使乡】这游戏的意义', tag: '讨论', author: '啊哈哈哈', replies: 18, views: 5230, lastAuthor: '啊哈哈哈', lastDate: '2017-09-30' },
      { id: 'post27', title: '【DDAC】怎么打HE啊，试了好多方法都不行', tag: '讨论', author: '2233超级萌', replies: 32, views: 15680, lastAuthor: '2233超级萌', lastDate: '2014-01-10' }
    ],
    'board-resource': [
      { id: 'post26', title: '【音频】听着很舒服的白噪音21首', tag: '资源', author: '失眠患者112', replies: 5, views: 320, lastAuthor: '失眠患者112', lastDate: '2024-08-25' },
      { id: 'post15', title: '【GAL】Q社经典蔷薇缭乱全系列', tag: '资源', author: '最爱宫本利亚', replies: 8, views: 296, lastAuthor: '最爱宫本利亚', lastDate: '2024-03-20' },
      { id: 'post40', title: '【公告】关于撤销ALLWORLD红版主管理权限的说明', tag: '公告', author: '论坛用户0987564', replies: 1, views: 348, lastAuthor: '论坛用户0987564', lastDate: '2024-02-25' },
      { id: 'post32', title: '【八千八百】没有汉化怎么活', tag: '资源', author: '白色烟雨°', replies: 9, views: 1240, lastAuthor: '白色烟雨°', lastDate: '2023-08-12' },
      { id: 'post37', title: '【求助】求战王4的汉化补丁', tag: '资源', author: '夕阳西下几时走', replies: 3, views: 680, lastAuthor: '夕阳西下几时走', lastDate: '2022-09-15' },
      { id: 'post16', title: '【分享】这个游戏的BGM真好听', tag: '资源', author: '锅之大', replies: 12, views: 680, lastAuthor: '锅之大', lastDate: '2022-04-02' },
      { id: 'post29', title: '【WWT】有无大佬可以分享全cg存档', tag: '资源', author: '芭芭拉能飞', replies: 5, views: 2480, lastAuthor: '芭芭拉能飞', lastDate: '2018-09-30' },
      { id: 'post33', title: '【天使乡】求一份游戏资源', tag: '资源', author: '立志成为无业游民', replies: 14, views: 3860, lastAuthor: '立志成为无业游民', lastDate: '2017-09-30' },
      { id: 'post34', title: '【金色彼女】求金彼完美典藏版有偿', tag: '资源', author: 'o最怒不过信阳红o', replies: 11, views: 2860, lastAuthor: 'o最怒不过信阳红o', lastDate: '2017-09-30' },
      { id: 'post18', title: '新人报到，请多关照', tag: '资源', author: '新用户2234', replies: 7, views: 3420, lastAuthor: '新用户2234', lastDate: '2017-05-01' }
    ],
    'board-screenshot': [
      { id: 'post22', title: '【讨论】熬夜打游戏真的会猝死吗？', tag: '分享', author: '月亮不睡我不睡', replies: 10, views: 486, lastAuthor: '月亮不睡我不睡', lastDate: '2025-01-24' },
      { id: 'post4', title: '【讨论】有人玩过《我的小屋》吗？', tag: '分享', author: '伤害爆炸mvp', replies: 7, views: 268, lastAuthor: '伤害爆炸mvp', lastDate: '2025-01-09' },
      { id: 'post36', title: '【缅怀】最爱的剧本家走了，难过', tag: '分享', author: '四十岁老头子', replies: 18, views: 456, lastAuthor: '四十岁老头子', lastDate: '2024-11-10' },
      { id: 'post5', title: '这好像是某个游戏的制作人，太惨了吧。。', tag: '分享', author: '睡不醒呀910', replies: 7, views: 486, lastAuthor: '睡不醒呀910', lastDate: '2024-09-21' },
      { id: 'post24', title: '【讨论】今天食堂的饭好难吃', tag: '分享', author: '比格嗷呜啊', replies: 5, views: 620, lastAuthor: '比格嗷呜啊', lastDate: '2023-08-01' },
      { id: 'post43', title: '【分享】翻出了小时候玩的游戏机，还能开机', tag: '分享', author: '第①考古学家', replies: 5, views: 820, lastAuthor: '第①考古学家', lastDate: '2022-06-20' },
      { id: 'post41', title: '大家好，我是从FGA来的', tag: '分享', author: '小白菜难民', replies: 5, views: 320, lastAuthor: '小白菜难民', lastDate: '2022-05-15' },
      { id: 'post17', title: '【分享】总会被这种剧情骗走眼泪', tag: '分享', author: '我心如铁', replies: 8, views: 720, lastAuthor: '我心如铁', lastDate: '2022-04-15' },
      { id: 'post38', title: '【讨论】有些游戏评论区真的没法看', tag: '分享', author: '你是不是油饼', replies: 4, views: 720, lastAuthor: '你是不是油饼', lastDate: '2021-12-20' },
      { id: 'post35', title: '【讨论】现在的游戏越来越贵了，玩不起了', tag: '分享', author: '无敌吴迪', replies: 24, views: 1680, lastAuthor: '无敌吴迪', lastDate: '2021-09-22' },
      { id: 'post19', title: '今天天气真好，有人出去散步吗？', tag: '分享', author: '比-太-阳-更-光', replies: 5, views: 640, lastAuthor: '比-太-阳-更-光', lastDate: '2020-05-15' },
      { id: 'post20', title: '【讨论】大家平时都玩什么类型的游戏？', tag: '分享', author: '大西洋不相信眼泪', replies: 7, views: 4860, lastAuthor: '大西洋不相信眼泪', lastDate: '2018-06-01' },
      { id: 'post21', title: '【分享】我有种很奇怪的癖好', tag: '分享', author: '|东方|既白|', replies: 8, views: 1200, lastAuthor: '|东方|既白|', lastDate: '2017-06-15' }
    ],
    'board-fanart': [
      { id: 'post48', title: '【月次】云间彩，心上霜', tag: '原创', author: '小熊饼干xgf', replies: 4, views: 268, lastAuthor: '小熊饼干xgf', lastDate: '2024-07-20' },
      { id: 'post53', title: '【原创】画了一张主角的立绘', tag: '原创', author: '拾光者hhJ', replies: 5, views: 312, lastAuthor: '拾光者hhJ', lastDate: '2024-06-10' },
      { id: 'post49', title: '【胡梦/cp向】结局的另一种可能', tag: '原创', author: '我是文档大王', replies: 2, views: 586, lastAuthor: '我是文档大王', lastDate: '2022-08-30' },
      { id: 'post51', title: '【西北组】试着给游戏主题曲填了词', tag: '原创', author: '不洗路人甲', replies: 3, views: 624, lastAuthor: '不洗路人甲', lastDate: '2022-04-15' },
      { id: 'post50', title: '画一些健康的boy meets girl图', tag: '原创', author: '小满', replies: 2, views: 698, lastAuthor: '小满', lastDate: '2021-08-05' },
      { id: 'post58', title: '【PTO】游戏场景水彩练习', tag: '原创', author: '花洒不合适九年级', replies: 2, views: 556, lastAuthor: '花洒不合适九年级', lastDate: '2021-02-20' },
      { id: 'post54', title: '七夕特供！', tag: '原创', author: '船上有个人6678', replies: 2, views: 2288, lastAuthor: '船上有个人6678', lastDate: '2019-05-23' },
      { id: 'post55', title: '【音乐社】自制游戏BGM翻奏', tag: '原创', author: '懒懒的蛋黄', replies: 3, views: 2442, lastAuthor: '懒懒的蛋黄', lastDate: '2019-04-25' },
      { id: 'post52', title: '【兴业兴】雨夜三章：一个关于遗忘与死亡的故事', tag: '原创', author: '我滴个天呐', replies: 4, views: 3080, lastAuthor: '我滴个天呐', lastDate: '2018-10-02' },
      { id: 'post57', title: '【满轨】cp相性50问', tag: '原创', author: '子木李不是木子李', replies: 2, views: 2172, lastAuthor: '子木李不是木子李', lastDate: '2017-03-15' }
    ]
  };

  window.SearchData = {
    posts: posts,
    searchIndex: searchIndex,
    forumCredentials: forumCredentials,
    boards: boards,
    hotPosts: hotPosts,
    threadsByBoard: threadsByBoard
  };

})();