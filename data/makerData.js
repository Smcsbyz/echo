/* ============================================================
   文件路径：data/makerData.js
   说明：开发者日志数据（推文流形式 + NPC 评论）
         所有推文作者昵称统一为“种下一颗大太阳”
         推文按日期正序排列（从早到晚）
         页面渲染时同样按时间正序显示（最早在上方）
         保留富文本规则：**文字** 渲染为加粗
         评论支持嵌套，使用 replies 字段，最多两层
         每条推文 likers 数组第一个元素固定为“关关子君”
   暴露：window.MakerData
   ============================================================ */
(function () {
  'use strict';

  /* 统一作者昵称 */
  var AUTHOR = '种下一颗大太阳';

  /* 开发者日志推文（按日期正序）
     likers 数组第一个元素固定为“关关子君”
     likes / collects 为合理数值
     npcComments 为固定 NPC 评论，始终显示 */
  var devlogTweets = [
    {
      id: 1,
      date: '2023-05-21',
      author: AUTHOR,
      content: 'Ps：室友让我建一个开发者日志，但我也不知道写啥，就当分享生活了你们觉得怎么样(ˇˍˇ)',
      likes: 5,
      collects: 2,
      likers: ['关关子君', '夜航船', '半盏灯', '拾光者'],
      npcComments: [
        { author: '啥价阿奇', content: '完全是你的风格呢' }
      ]
    },
    {
      id: 2,
      date: '2023-05-24',
      author: AUTHOR,
      content: '《塔塔虾》终于更完了，暂时没有DLC的打算。',
      likes: 6,
      collects: 2,
      likers: ['关关子君', '南山客', '白鹭', '木子李', '青柠'],
      npcComments: []
    },
    {
      id: 3,
      date: '2023-10-09',
      author: AUTHOR,
      content: '最近有了些新作的点子，但还没梳理好，只能说"敬请期待"！',
      likes: 7,
      collects: 3,
      likers: ['关关子君', '小满', '苏打水', '夜航船'],
      npcComments: [
        { author: '丘比秋米', content: '哇酷哇酷' },
        { author: '一盏小灯', content: '半年了，你终于冒泡了' }
      ]
    },
    {
      id: 4,
      date: '2023-11-10',
      author: AUTHOR,
      content: '本咸鱼决定正式开工！这几天总拉着室友聊构思，把她念叨烦了，跟我说"能不能给我留点私人空间？"，直接把我赶去敲代码了嘤嘤嘤',
      likes: 8,
      collects: 3,
      likers: ['关关子君', '半盏灯', '拾光者', '南山客', '白鹭'],
      npcComments: [
        { author: '亲水大能', content: '帮我谢谢你室友' }
      ]
    },
    {
      id: 5,
      date: '2023-11-11',
      author: AUTHOR,
      content: '她还是想得太天真，就算敲代码，我照样可以缠着她，嘿嘿嘿O(∩_∩)O',
      likes: 9,
      collects: 3,
      likers: ['关关子君', '木子李', '青柠', '小满'],
      npcComments: [
        { author: '设置八号223', content: '光棍节就给我吃这个？有点太丰盛了' },
        { author: '白衣师尊我本命', content: 'fff团启动！' }
      ]
    },
    {
      id: 6,
      date: '2023-12-03',
      author: AUTHOR,
      content: '骨架刚搭好就迫不及待上传了，是不是有点得意忘形了？',
      likes: 6,
      collects: 2,
      likers: ['关关子君', '苏打水', '夜航船', '半盏灯', '拾光者'],
      npcComments: [
        { author: '关关子君', content: '（笑）' }
      ]
    },
    {
      id: 7,
      date: '2024-01-01',
      author: AUTHOR,
      content: '元旦快乐ヾ (@^▽^@) ノ！放假三天理所应当！这几天暂停工作，准备和室友出去玩',
      likes: 10,
      collects: 4,
      likers: ['关关子君', '南山客', '白鹭', '木子李'],
      npcComments: [
        {
          author: '蛇还是龙',
          content: '阳大跟室友关系真好，认识很多年了吗？',
          replies: [
            { author: '本人', content: '是啊，有**8年**了呢(⺣◡⺣)♡', replyTo: '蛇还是龙' }
          ]
        }
      ]
    },
    {
      id: 8,
      date: '2024-01-25',
      author: AUTHOR,
      content: '一眨眼就要过年了，大家都怎么过？我今年会跟室友一起回家哦',
      likes: 8,
      collects: 3,
      likers: ['关关子君', '青柠', '小满', '苏打水', '夜航船'],
      npcComments: [
        {
          author: '销售部-晗',
          content: '回室友的家？',
          replies: [
            { author: '本人', content: '说的不太清楚，其实是我家啦', replyTo: '销售部-晗' }
          ]
        }
      ]
    },
    {
      id: 9,
      date: '2024-02-09',
      author: AUTHOR,
      content: '唉，结果大吵一架，跟父母的相处真是难，完全搞不懂他们怎么想的，就连弟弟也跟他们站在一边。回出租屋了！今年是和室友两个人的团圆！',
      likes: 12,
      collects: 5,
      likers: ['关关子君', '半盏灯', '拾光者', '南山客', '白鹭'],
      npcComments: []
    },
    {
      id: 10,
      date: '2024-02-14',
      author: AUTHOR,
      content: '今天偶然发现室友偷偷注册了小号，特别好奇，但登录需要密码。问她，她只说："是很适合今天说的话"。我试着猜了密码，竟然！全都不对！',
      likes: 9,
      collects: 4,
      likers: ['关关子君', '木子李', '青柠', '小满'],
      npcComments: []
    },
    {
      id: 11,
      date: '2024-02-14',
      author: AUTHOR,
      content: '她说我好笨。好吧，笨就笨，能不能告诉我密码是什么啊。她只会笑，也不说。哼',
      likes: 10,
      collects: 4,
      likers: ['关关子君', '苏打水', '夜航船', '半盏灯', '拾光者'],
      npcComments: [
        { author: 'Stella-BB', content: '闻到了一股酸臭味，呃啊' }
      ]
    },
    {
      id: 12,
      date: '2024-03-21',
      author: AUTHOR,
      content: '软磨硬泡拉着她帮我画了不少美术素材，嘿嘿嘿',
      likes: 8,
      collects: 3,
      likers: ['关关子君', '南山客', '白鹭', '木子李'],
      npcComments: []
    },
    {
      id: 13,
      date: '2024-04-10',
      author: AUTHOR,
      content: '拼死拼活上了更新，祝我长寿',
      likes: 9,
      collects: 4,
      likers: ['关关子君', '青柠', '小满', '苏打水', '夜航船'],
      npcComments: []
    },
    {
      id: 14,
      date: '2024-04-21',
      author: AUTHOR,
      content: '二次元真美好，想要**赛博飞升**─=≡Σ(((つ•̀ω•́)つ',
      likes: 8,
      collects: 3,
      likers: ['关关子君', '半盏灯', '拾光者', '南山客'],
      npcComments: []
    },
    {
      id: 15,
      date: '2024-05-23',
      author: AUTHOR,
      content: '要暂时停更一段时间了',
      likes: 7,
      collects: 3,
      likers: ['关关子君', '白鹭', '木子李', '青柠', '小满'],
      npcComments: [
        { author: '八号迷失', content: '？怎么了' }
      ]
    },
    {
      id: 16,
      date: '2024-06-24',
      author: AUTHOR,
      content: '真是起起落落落落落落落落落落',
      likes: 8,
      collects: 3,
      likers: ['关关子君', '苏打水', '夜航船', '半盏灯'],
      npcComments: [
        { author: '阿克苏桃子', content: '没事吧？' }
      ]
    },
    {
      id: 17,
      date: '2024-07-18',
      author: AUTHOR,
      content: '《塔塔虾战纪》开发团队郑重声明：本作代码、美术资源均为团队原创，不存在抄袭、盗用第三方素材行为。\n\n若有和其他作品相似之处，纯属创作巧合。团队拥有游戏相关内容完整著作权。对于造谣抹黑、散布不实抄袭言论者，我方保留法律维权权利。\n\n感谢各位玩家关注。\n\n《塔塔虾战纪》开发团队',
      likes: 15,
      collects: 6,
      likers: ['关关子君', '拾光者', '南山客', '白鹭', '木子李'],
      npcComments: [
        { author: '不哈要上班', content: '原来是处理这件事去了，阳大辛苦' },
        { author: '绝亚JY', content: '跟熊厂沾边的就没什么好事' },
        { author: '啊呀刷卡与', content: '你知道的，我从出生起就喜欢塔塔虾了' }
      ]
    },
    {
      id: 18,
      date: '2024-08-08',
      author: AUTHOR,
      content: '要打官司就来',
      likes: 13,
      collects: 5,
      likers: ['关关子君', '青柠', '小满', '苏打水', '夜航船'],
      npcComments: [
        { author: '不哈研究室', content: '咱们阳家军不惹事，也不怕事！' }
      ]
    },
    {
      id: 19,
      date: '2024-08-10',
      author: AUTHOR,
      content: '新版本快了，最近总跟莫名其妙的家伙扯皮，身心俱疲，好在有室友陪着。这真是最坎坷的一次开发了TAT',
      likes: 11,
      collects: 4,
      likers: ['关关子君', '半盏灯', '拾光者', '南山客'],
      npcComments: []
    },
    {
      id: 20,
      date: '2024-09-02',
      author: AUTHOR,
      content: '好累，真的',
      likes: 10,
      collects: 4,
      likers: ['关关子君', '白鹭', '木子李', '青柠', '小满'],
      npcComments: []
    },
    {
      id: 21,
      date: '2024-09-02',
      author: AUTHOR,
      content: '做游戏这件事，会不会从一开始就是错的',
      likes: 14,
      collects: 5,
      likers: ['关关子君', '苏打水', '夜航船', '半盏灯', '拾光者'],
      npcComments: [
        { author: '行吧辛巴', content: '？' },
        { author: '上班还轻松', content: '？？' },
        { author: '下啥苦', content: '怎么了阳大' },
        { author: '安顺医院董老师', content: '别太监啊？' },
        { author: '爱上金在中', content: '阳大你说句话啊？' }
      ]
    },
    {
      id: 22,
      date: '2026-09-15',
      author: AUTHOR,
      content: '游戏最终版已上传。',
      likes: 18,
      collects: 8,
      likers: ['关关子君', '南山客', '白鹭', '木子李', '青柠'],
      npcComments: [
        { author: '白胡须啊哈哈', content: '我去！诈尸了！' },
        { author: '沙哈', content: '阳大你还活着啊' },
        { author: '家可能JKn', content: '你是？' }
      ]
    }
  ];

  /* 点赞者主页链接 */
  var likerProfileUrl = 'weibo.html';

  /* 挂载到 window */
  window.MakerData = {
    devlogTweets: devlogTweets,
    likerProfileUrl: likerProfileUrl
  };

})();