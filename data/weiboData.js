/* ============================================================
   文件路径：data/weiboData.js
   说明：小号推文数据
         推文按日期正序排列（从早到晚），页面渲染时倒序显示（最新在上方）
         含带图推文（image 字段）
         isWhyTweet 标识：用于“为什么”掉落特效的定位
         本次更新：
           - 推文内容替换为最新版本
           - 2024-04-20 的推文带鸢尾花图片（assets/images/flower.png）
           - “为什么”长文推文保留 isWhyTweet: true
           - 所有推文 comments 为空数组
   暴露：window.WeiboData
   ============================================================ */
(function () {
  'use strict';

  /* 小号名称与简介 */
  var accountName = '关关子君';
  var bio = '记录一些日常。';

  /* 推文列表（按日期正序） */
  var tweets = [
    { date: '2023-06-20', content: '重新启动这个号，她不知道。', image: null, comments: [] },
    { date: '2023-10-10', content: '悄悄给她点赞。', image: null, comments: [] },
    { date: '2023-11-09', content: '她的话好多，睡觉的时候一直念啊念的，做梦都是她在说话。', image: null, comments: [] },
    { date: '2023-11-11', content: '知道拦不住她。也罢，就当专属于我的白噪音。', image: null, comments: [] },
    { date: '2023-12-03', content: '得意的样子真的很可爱。', image: null, comments: [] },
    { date: '2024-01-01', content: '可以陪我三天，真好。', image: null, comments: [] },
    { date: '2024-01-27', content: '又过去一年了。她说今年要带我回家。她笑的很开心，但我，不可能被接受的。', image: null, comments: [] },
    { date: '2024-02-09', content: '果然。', image: null, comments: [] },
    { date: '2024-02-10', content: '第一次两个人度过。', image: null, comments: [] },
    { date: '2024-02-14', content: '差一点点就被发现了。还好，她没那么聪明，好笨。', image: null, comments: [] },
    { date: '2024-04-20', content: '敢让我碰她的宝贝盆栽，真是心大。', image: 'assets/images/flower.png', comments: [] },
    { date: '2024-05-20', content: '无耻。', image: null, comments: [] },
    { date: '2024-06-24', content: '不该跟她吵架的，明知道她现在已经焦头烂额。但是，看到了父母让她去相亲的消息，很生气……是我的错。', image: null, comments: [] },
    { date: '2024-06-26', content: '和好了。', image: null, comments: [] },
    { date: '2024-08-09', content: '她还是很难过，我会一直陪着她。都会好起来的。', image: null, comments: [] },
    { date: '2024-09-01', content: '公司那边终于要妥协了。', image: null, comments: [] },
    { date: '2024-09-14', content: '再过几天就是她的生日，给她准备了一点惊喜，会喜欢吗。', image: null, comments: [] },
    { date: '2024-09-16', content: '为什么。', image: null, comments: [] },
    {
      date: '2024-09-16',
      content: '为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么为什么',
      image: null,
      comments: [],
      isWhyTweet: true
    },
    { date: '2024-09-19', content: '他们要带走她，我阻止不了。', image: null, comments: [] },
    { date: '2024-10-03', content: '祝你生日快乐。', image: null, comments: [] },
    { date: '2024-11-23', content: '我终于彻底明白，是他们亲手害死了她。我会为她报仇，不惜一切。', image: null, comments: [] },
    { date: '2025-10-03', content: '又是一年，生日快乐。', image: null, comments: [] },
    { date: '2026-09-15', content: '今年的生日，我可能赶不上了。对不起，能不能原谅我。', image: null, comments: [] }
  ];

  /* 挂载到 window */
  window.WeiboData = {
    accountName: accountName,
    bio: bio,
    tweets: tweets
  };

})();