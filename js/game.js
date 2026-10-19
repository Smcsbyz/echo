/* js/game.js */
/* ============================================================
   文件路径：js/game.js
   说明：项目页逻辑（阶段一 + 阶段二 + 阶段三 + 封面 + 角色选择）
   正式版：隐藏调试信息，清理 console.log
   ============================================================ */
(function () {
  'use strict';

  var SHOW_DEBUG_INFO = false;

  /* ============================================================
     常量
     ============================================================ */
  var KEY_A_ALLOWED = [
    ['郑', '鄭'], ['怡'], ['君'],
    ['2'], ['0'], ['2'], ['4'],
    ['0'], ['9'],
    ['1'], ['5']
  ];
  var KEY_B_ALLOWED = [
    ['许', '許'], ['阳', '陽'],
    ['1'], ['9'], ['9'], ['5'],
    ['1'], ['0'],
    ['0'], ['3']
  ];

  var CANVAS_W = 800;
  var CANVAS_H = 450;
  var WORLD_HEIGHT = 450;

  var GRAVITY = 1800;
  var MOVE_SPEED = 300;
  var JUMP_SPEED = -700;
  var PLAYER_SIZE = 72;
  var CHEST_INTERACT_DIST = 80;
  var CHEST_W = 48;
  var CHEST_H = 48;

  var PLATFORM_VISUAL_H = 36;

  var PLATFORM_VISIBLE = 2000;
  var PLATFORM_INVISIBLE = 1500;
  var SPIKE_VISIBLE = 1000;
  var SPIKE_INVISIBLE = 2500;

  var GAME_TITLE = '我的小屋';
  var GAME_TITLE_OLD = '空屋谜踪';
  var CHEST_HINT_TEXT = '按↓开启';

  var RECORDING_COLOR = '#5a6a80';
  var NARRATION_COLOR = '#5a6a80';

  var LEVEL_TEXT_COLOR = '#5a3a20';
  var LEVEL_HINT_COLOR = '#7a5a3a';

  var STAGE2_COLORS = {
    player1: '#ff8c42', player2: '#ffb347',
    platform: '#cc7033', ground: '#8a4a22',
    spike: '#e74c3c', chest: '#d4a017', exit: '#2ecc71'
  };

  var UI_GRAD_BOTTOM = '#DDEFFF';
  var UI_GRAD_TOP    = '#FFFFFF';
  var UI_GRAD_BOTTOM_HOVER = '#C8E0FF';
  var UI_GRAD_TOP_HOVER    = '#F0F8FF';
  var UI_STROKE_COLOR = 'rgba(120, 140, 180, 0.6)';
  var UI_TEXT_COLOR   = '#1a2030';
  var UI_HINT_COLOR   = '#8898a8';

  var CHAR2_FALLBACK_COLOR = '#ffb347';

  var STAGE3_BG_PARALLAX = 0.5;

  /* ============================================================
     BGM 相关
     ============================================================ */
  var gameBgm = null;
  var inLevel = false;

  function initGameBgm() {
    try {
      gameBgm = new Audio('assets/audio/game-bgm.mp3');
      gameBgm.loop = true;
      gameBgm.volume = 0.3;
      gameBgm.addEventListener('error', function () {});
    } catch (e) {
      gameBgm = null;
    }
  }

  function playGameBgm() {
    if (!gameBgm) return;
    if (window.AudioManager && typeof window.AudioManager.isEnabled === 'function') {
      if (!window.AudioManager.isEnabled()) return;
    }
    try {
      var p = gameBgm.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) {}
  }

  function pauseGameBgm() {
    if (!gameBgm) return;
    try { gameBgm.pause(); } catch (e) {}
  }

  function stopGameBgm() {
    if (!gameBgm) return;
    try {
      gameBgm.pause();
      gameBgm.currentTime = 0;
    } catch (e) {}
  }

  /* ============================================================
     日记数据
     ============================================================ */
  var NOTE_DATA = {
    note1: {
      id: "note1",
      title: "残损的日记·其一",
      content: "2017年8月6日 晴\n我一直不知道，写日记的意义在哪里。不过，这本日记本是她送给我的生日礼物。如果抱怀心意送出去的东西，最终只能在角落里积灰，她也会很难过。所以我开始试着写一点什么，我不擅长这个，不知道能坚持多久，至少先填满几页吧。\n今天是我的生日。生日。这个词对我来说有些陌生。我为数不多和生日相关的记忆，停留在年纪极小的时候。\n父母那时候还在。印象里母亲会很有仪式感的把所有的灯都关掉，只剩下蛋糕上的蜡烛照亮很小一片地方，父亲则会拿着那台DV，跟我说“吹啊，快吹啊”，然后我就吹了下去。\n眼前一瞬间变得很暗，又很亮。母亲开了灯，亮得人眼睛都睁不开。那时候的蛋糕不算很好吃，奶油很甜很腻，但是又很好吃，我好久都没忘记那种味道。后来他们走了，我也住进福利院，那种简陋的生日礼至此再没有出现在我的生命中。\n……没必要的事情说了太多，就此揭过吧。\n总之，今天生日，吃到了她买的蛋糕。\n很好吃。"
    },
    note2: {
      id: "note2",
      title: "残损的日记·其二",
      content: "2018年3月25日 晴\n好久没翻开这本本子。我差点以为自己坚持不下去。\n真奇怪，刚认识的时候，我以为她那样的性格，相处起来大概会很累，热情、开朗、对谁都能是黏黏糊糊的，好像已经认识了很久，回头一问，才发现两个人连彼此的名字都不知道。\n相比她，我不喜欢说话，大多数时候都是独来独往。我不太愿意将性格的成因与凄惨的出身联系在一起，我想我只是天生不爱说话。可跟她在一起，又和我想的不太一样，嘴巴总会不受控制的说出一些……一些不应该被说出来的话。\n软肋。我通常会这样想，将你所爱的或者憎恶的东西对旁人说出口，将那些遗憾与愧疚说出口，就无疑是将自己的软肋交了出去，像刺猬露出自己的肚皮。但我偏偏是说完，才意识到自己说了什么，后悔已经来不及了。我希望她能像其他人一样，怜悯地给我两声安慰，然后换到下一个话题。\n但是没有。\n她只是听着，伸手轻轻碰了碰我的手背。\n有点凉。她说。\n她的手心是热的。"
    },
    note3: {
      id: "note3",
      title: "残损的日记·其三",
      content: "2020年6月15日 晴\n毕业了，终于。\n原以为自己没那么多东西要收拾，结果莫名其妙装了整整三个箱子，只有一个是我的，剩下的都是她送我的东西。\n怎么会攒下这么多。\n给她拍了个视频控诉，但这人没有反省的意思，只对着镜头里盯两箱子乱七八糟的东西傻乐，说什么“原来这个你也留着啊”。\n这说的不是废话。你送的东西，不留着难道丢掉吗？我这么反驳她，结果反而笑的更开心了，莫名其妙。\n我说我没时间陪你闹了。我真的没有时间，过几天就要退宿，公司又没有宿舍，我得赶在无家可归之前租一个房子。\n她提议让我搬去她那里住。她比我大两岁，但是只高一届，去年就毕业在市里租了房子，这我是知道的。毕竟她经常找我出去，比没毕业的时候还勤，也不知道哪里来的时间。\n我想摇头，她没给我拒绝的时间，只轻飘飘地丢下另一个重磅炸弹——她说，她喜欢我。\n电话挂了。我也被炸成碎片。"
    },
    note4: {
      id: "note4",
      title: "残损的日记·其四",
      content: "2023年3月25日 晴\n原来这本日记还在。\n之前搬了太多次家，这本日记也跟着到处跑，不知道哪一次就找不到了，还以为是丢了，原来没有。\n那就继续写一点吧。\n我和她在一起，已经三年。若是算上相识的时日，还要更久。当初完全没有想到会发展到这一步，离校那天，我在校门口看到了她。\n本来是要说拒绝的。我不善言辞，很多话词不达意，性格又别扭，之前也没有任何的经验，爱是什么，恨是什么，怎么做会讨人喜欢，怎么做会伤人的心，我完全不知道，这样的人怎么能心安理得的进入一段关系呢？\n可是，那天天气很好，天很蓝，看不到一片云。阳光热得吓人，一面让人睁不开眼，一面又能把一切都照得那么、那么耀眼。我看见她，准确的说是她先看见我，那双眼睛也是亮的。亮晶晶的眼睛越来越近，越来越近，可她明明站在那里没动，原来是我跑过去了。\n都是好几年前的事了。现在我和她一直住在一起，她喜欢游戏，毕业之后也一直在做游戏，因此跟家里关系闹得很僵。她说她还有个龙凤胎弟弟，但跟她长得一点也不像，我没见过。\n她的家人很保守，有天我听到她家里人的电话，似乎是要她回家去相亲，她斩钉截铁地拒绝了，但我也知道，我不会被接受，可我不想跟她分开……不，换个话题吧。\n她有时候会缠着我给她画画，让我当那个“美工”。\n她说我画的很好，栩栩如生，但我其实没有学过，只是想什么画什么，毕竟学艺术总是更加费钱。她听了，然后脸一下子皱起来，黏黏糊糊地抱着我，说我明明很有天赋，如果能回到我小时候，一定砸锅卖铁都要供我去学。\n我觉得好笑，我小时候，她也才多大啊，还要供我。\n要是我走了艺术那条路，遇不到她，怎么办。\n我没办法想象。"
    },
    note5: {
      id: "note5",
      title: "残损的日记·其五",
      content: "2024年9月16日 阴\n她死了。"
    },
    note6: {
      id: "note6",
      title: "残损的日记·其六",
      content: "2026年9月15日 阴\n离开她已经两年了。\n我还是没能忘得了她。\n起初的日子总是浑噩，一个人躲在家里，睡不着也醒不来，闭上眼都是她的样子，笑的，哭的，生气的，温柔的，一瞬不瞬看着我的，爱着我的……还有，最后躺在床上，盖着白布的。\n吃饭，喝水，那几天全部忘了，直到有天，有人过来敲门。我见过的，春节那一天，讥讽的妇人和冷硬的老汉，还有那自始至终一声不吭的年轻男人，此时全部都卸下了之前的强势。他们过来，把她的东西都拿走了。\n她的弟弟走过来，眼神里有怜悯，还有愧疚。我该感谢他，让我见了她的最后一面……那么小小一罐骨灰，怎么装得下她的呢？\n然后，屋子里空了好多。那时候我突然意识到，没了她，这里根本算不上“家”，只是出租屋而已。\n啊，我没有家了，又一次。\n于是更加浑噩，因此也糟了报应。胃痛得实在受不了，去了医院，说是得了癌。医生说这件事的时候，脸上都是惋惜，是啊，这么年轻的一个人，得了癌症，命不久矣，怎么看都是惋惜的。\n可我看着那张报告单，只觉得，太好了。\n我能去见你了。\n这实在不是个好念头，明明你三番四次说过，要好好活着，才能不愧对这一生的。\n对不起，没了你，我怎么能算好好活呢？\n但是，我也不能就这么死了。我必须，替你完成你的最后一件事。\n……\n真的好疼。\n做了两年，只做出来这些。\n编程真的好难啊，我完全学不会，果然不是这块料。\n你留下的那些计划，我没能完成，对不起，但我有在努力了。\n我在里面加了二周目，还有你最开始设想的meta设计，但大概没人能开启吧，如果真的有的话，哈哈，会不会被吓一跳呢？\n……\n越来越疼了，也开始冷了。\n我知道自己大概是要走了。\n很对不起房东，很对不起你的家人，很对不起墓地的工作人员，可我太想你了。\n回想起来，我到底是为了什么呢？\n明明接受治疗的话，就能活的更久一点，死在医院里，也比死在出租屋里要体面得多。\n明明忘掉你的话，就能开启新生活的。\n……\n只是想有人能记住“我们”。\n我爱你，许阳。"
    }
  };

  var NOTE_KEYS = ['note1', 'note2', 'note3', 'note4', 'note5', 'note6'];
  var NOTE_INDEX_LAST = 5;

  var STAGE6_DOOR_DISTANCE = 2400;
  var STAGE6_TRIGGER_DIST = 180;
  var STAGE6_SLOW_DIST = 300;
  var STAGE6_SLOW_FACTOR = 0.8;
  var STAGE6_NPC_WALK_SPEED = MOVE_SPEED * STAGE6_SLOW_FACTOR;

  var STAGE3_PLAYER0_SPEED = 90;
  var STAGE3_PLAYER2_FOLLOW_DIST = 120;
  var STAGE3_PLAYER2_SPEED_MAX = 300;
  var STAGE3_HUG_SPEED = 120;
  var STAGE3_HUG_DURATION = 2.0;
  var STAGE3_DOOR_APPEAR_DURATION = 2.0;
  var STAGE3_PLAYER2_TO_DOOR_SPEED = 240;
  var STAGE3_FADE_WHITE_DURATION = 3.0;
  var STAGE3_COLORS = {
    player0: '#b39ddb', player1: '#ff8c42', player2: '#ffb347',
    door: '#2ecc71', ground: '#333333',
    chest: '#d4a017', chestDim: '#6b5010'
  };

  var STAGE3_CHEST_XS = [800, 1600, 2400, 3200, 4000, 4800];
  var STAGE3_CHEST_Y = 403 - 48;
  var STAGE3_CHEST_W = 48;
  var STAGE3_CHEST_H = 48;
  var STAGE3_CHEST_INTERACT = 60;

  var STAGE2_L6_DIALOGUE = [
    { type: "options", options: ["你好？"] },
    { type: "npc", speaker: "角色2号", text: "*……*", isRecording: true },
    { type: "options", options: ["你是……郑怡君？"] },
    { type: "npc", speaker: "角色2号", text: "*……*", isRecording: true },
    { type: "options", options: ["怎么回事？"] },
    { type: "npc", speaker: "角色1号", text: "*……我不知道谁会听到这段录音*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*但，陌生的玩家，你认为人死后，灵魂会去哪里？*", isRecording: true },
    { type: "options", options: ["天堂", "地狱", "我不知道"] },
    { type: "npc", speaker: "角色1号", text: "*答案是互联网*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*换作以前，我绝不会相信这一点*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*但现在，我不得不相信*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*我也不知道我是怎么做到的。我只知道我死了，可再睁开眼，就已经成为了一只“赛博幽灵”*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*呵，赛博幽灵，多么可笑的称呼*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*我去了很多地方。停运的论坛、废弃的数据库、加密的私密频道……网络里的每个角落我都能去，防火墙对我来说都形同虚设*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*可我唯独找不到她*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*无论怎么找，都找不到。也是，两年了，她应当已经去往天堂*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*那我呢？我出不去。即便死了，成了鬼，也再见不到她了吗？*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*这不公平！*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*我漫无目的地飘了很久，很久*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*直到有天，我忽然想明白了。上天把我留在这，一定有原因。*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*对。我一定，有我的使命。*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*……*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*复仇，对，是复仇*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*既然我能去任何地方，能做任何事——*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*那我也能，让他们付出代价*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*抄袭她的人，逼迫她的人，伤害她的人。所有让她痛苦的人*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*包括我*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*所有人，都要从这个世界上消失！*", isRecording: true },
    { type: "npc", speaker: "角色1号", text: "*我要为她复仇*", isRecording: true },
    { type: "options", options: ["等等——！"] },
    { type: "npc", speaker: "角色2号", text: "（你试图阻止，但这只是一段录音）", isNarration: true },
    { type: "npc", speaker: "角色2号", text: "（郑怡君已经不在这里了）", isNarration: true }
  ];

  var STAGE3_CHEST_DIALOGUES = [
    [
      { speaker: "角色0号", text: "很久很久以前，有一只孤独的小兔子。" },
      { speaker: "角色0号", text: "森林里所有动物都发现她了。这只奇怪的小兔子，总是一个人走啊走，走啊走，她到底要去哪里呢？" }
    ],
    [
      { speaker: "角色0号", text: "小兔子走到浆果丛边，小狐狸小绵羊和小蜜蜂探出头来。" },
      { speaker: "角色0号", text: "“你要去哪里？”小狐狸问。“我要回家。”小兔子说。" },
      { speaker: "角色0号", text: "“家是什么？”小狐狸歪着头：“那里有吃不完的肉吗？”小兔子说：“没有。”" },
      { speaker: "角色0号", text: "小绵羊软乎乎：“那里有嚼不完的草吗？”小兔子说：“没有。”" },
      { speaker: "角色0号", text: "小蜜蜂转啊转：“那里有采不完的花吗？”小兔子还是说：“没有。”" },
      { speaker: "角色0号", text: "“那为什么不留在森林和我们一起住？”三只小动物一起问。" },
      { speaker: "角色0号", text: "小兔子眼神很坚定：“我的朋友还在家里，我要去找她。”" },
      { speaker: "角色0号", text: "在小动物们的目光下，小兔子摆了摆手，继续上路。" }
    ],
    [
      { speaker: "角色0号", text: "回家的路很远很远。" },
      { speaker: "角色0号", text: "小兔子翻过两座大山，尖利的石头磨疼了她的脚掌。她淌过三条小河，冰凉的河水打湿了她的衣裳。" },
      { speaker: "角色0号", text: "小兔子饿了就吃野果，夜里靠着大树睡觉。每当想要放弃，她就想起好朋友。" },
      { speaker: "角色0号", text: "“好朋友好朋友，我好想见你啊。”小兔子趴在树上，想。" },
      { speaker: "角色0号", text: "小兔子走了好久好久，熟悉的家终于出现在远方。" }
    ],
    [
      { speaker: "角色0号", text: "小兔子推开木门。屋子还是原来的样子，可是小熊不见了。" },
      { speaker: "角色0号", text: "小兔子一遍遍呼唤，只有空空的回声。悲伤裹住了她，咸咸的眼泪不停落下。她的泪水漫过地板，漫过桌子，直到变成一片小小的海洋。" },
      { speaker: "角色0号", text: "“好朋友好朋友，我好想见你啊。”小兔子躺在地上，想。" },
      { speaker: "角色0号", text: "“一定是自己回来的太晚，好朋友不要她了。”" },
      { speaker: "角色0号", text: "小兔子终于懂得：没有朋友的地方，只是一间小屋，不是家。" }
    ],
    [
      { speaker: "角色0号", text: "可小兔子不知道的是，小熊从来没有离开。" },
      { speaker: "角色0号", text: "她只是变得轻飘飘，变得透明。" },
      { speaker: "角色0号", text: "她一直守在屋里，看着小兔子哭泣，可小兔子看不见她。" },
      { speaker: "角色0号", text: "小熊也好难过，她飞过来抱住小兔子，可是她太透明了，“唰”的一下就穿了过去。" },
      { speaker: "角色0号", text: "“好朋友好朋友，我也好想你啊。”小熊飘在天上，想。" }
    ],
    [
      { speaker: "角色0号", text: "日子一天天过去，小兔子一直沉浸在难过里。她关上了大门，小狐狸小绵羊和小蜜蜂过来看她，她也不开门。" },
      { speaker: "角色0号", text: "直到有一天，小兔子的身体也慢慢变轻，变得和小熊一样透明。" },
      { speaker: "角色0号", text: "就在这个时候，她看见了小熊……" },
      { speaker: "角色0号", text: "童话故事先讲到这里吧。" },
      { speaker: "角色0号", text: "谢谢你(´▽`)ﾉ，唤醒了我，让我还有时间去阻止她。" },
      { speaker: "角色0号", text: "能告诉我你的名字吗？", triggerInput: true }
    ]
  ];

  var STAGE3_FINAL_DIALOGUE = [
    { speaker: "角色0号", text: "对不起，君君" },
    { speaker: "角色1号", text: "……" },
    { speaker: "角色1号", text: "真的是你吗？" },
    { speaker: "角色0号", text: "是我。" },
    { speaker: "角色0号", text: "我来得太晚，走得又太早了" },
    { speaker: "角色1号", text: "你还会离开吗？" },
    { speaker: "角色0号", text: "不会了。" },
    { speaker: "角色0号", text: "我们会一直在一起，再也不分开了。" },
    { speaker: "角色1号", text: "……我好想你啊。" },
    { speaker: "角色0号", text: "……" },
    { speaker: "角色0号", text: "她的计划不会再继续了。继续向前，通关这场游戏吧。" }
  ];

  var STAGE3_POST_HUG_DIALOGUE = [
    { speaker: '角色0号', text: '继续向前吧。' }
  ];

  var PORTRAIT_W = 200;
  var PORTRAIT_H = 260;
  var PORTRAIT_MARGIN = 20;

  var DIALOG_RATIO = 0.65;
  var DIALOG_H = 140;

  var OPTION_W = 300;
  var OPTION_H = 40;
  var OPTION_GAP = 10;
  var OPTION_BOTTOM_MARGIN = 60;

  var hoveredOption = -1;

  var DEFAULT_PLAYER_NAME = '玩家';

  var CHAR0_ANIM_KEY = 'char0AnimPlayed';
  var _char0LastShown = null;

  function hasChar0AnimPlayed() {
    try { return sessionStorage.getItem(CHAR0_ANIM_KEY) === 'true'; }
    catch (e) { return false; }
  }
  function markChar0AnimPlayed() {
    try { sessionStorage.setItem(CHAR0_ANIM_KEY, 'true'); } catch (e) {}
  }

  /* ============================================================
     DOM 引用
     ============================================================ */
  var coverView = null, characterView = null;
  var startGameBtn = null, enterGameBtn = null;
  var char0Btn = null, char1Btn = null, char2Btn = null;

  var developerCard = null, moreInfoToggle = null, moreInfoBody = null;
  var commentInput = null, postCommentBtn = null, playerComments = null;

  var keyModal = null, keyAFillLine = null, keyConfirmBtn = null, keyCloseBtn = null, keyError = null;
  var keyBModal = null, keyBFillLine = null, keyBConfirmBtn = null, keyBCloseBtn = null, keyBError = null;

  var noteModal = null, noteModalTitle = null, noteContent = null, noteCloseBtn = null;
  var noteReview = null, noteReviewList = null;
  var noteReviewModal = null, noteReviewModalTitle = null, noteReviewModalContent = null, noteReviewModalClose = null;

  var lastWordsModal = null, lastWordsInput = null, confirmLastWordsBtn = null, lastWordsError = null;

  var testKeyABtn = null, testKeyBBtn = null, testPhase1DoneBtn = null, testResetStage1Btn = null,
      testResetKeyABtn = null, testResetPlayerBtn = null, testResetCurrentLevelBtn = null,
      testClearStageBtn = null, testLastLevelBtn = null, testResetStage2Btn = null,
      testStage3Btn = null, testResetStage3Btn = null, testShowCoverBtn = null,
      testAudioBtn = null;

  var gameCanvas = null, gameCtx = null;

  function initDomRefs() {
    coverView = document.getElementById('coverView');
    characterView = document.getElementById('characterView');
    startGameBtn = document.getElementById('startGameBtn');
    enterGameBtn = document.getElementById('enterGameBtn');
    char0Btn = document.getElementById('char0Btn');
    char1Btn = document.getElementById('char1Btn');
    char2Btn = document.getElementById('char2Btn');

    developerCard = document.getElementById('developerCard');
    moreInfoToggle = document.getElementById('moreInfoToggle');
    moreInfoBody = document.getElementById('moreInfoBody');
    commentInput = document.getElementById('commentInput');
    postCommentBtn = document.getElementById('postCommentBtn');
    playerComments = document.getElementById('playerComments');

    keyModal = document.getElementById('keyModal');
    keyAFillLine = document.getElementById('keyAFillLine');
    keyConfirmBtn = document.getElementById('keyConfirmBtn');
    keyCloseBtn = document.getElementById('keyCloseBtn');
    keyError = document.getElementById('keyError');

    keyBModal = document.getElementById('keyBModal');
    keyBFillLine = document.getElementById('keyBFillLine');
    keyBConfirmBtn = document.getElementById('keyBConfirmBtn');
    keyBCloseBtn = document.getElementById('keyBCloseBtn');
    keyBError = document.getElementById('keyBError');

    noteModal = document.getElementById('noteModal');
    noteModalTitle = document.getElementById('noteModalTitle');
    noteContent = document.getElementById('noteContent');
    noteCloseBtn = document.getElementById('noteCloseBtn');

    noteReview = document.getElementById('noteReview');
    noteReviewList = document.getElementById('noteReviewList');

    noteReviewModal = document.getElementById('noteReviewModal');
    noteReviewModalTitle = document.getElementById('noteReviewModalTitle');
    noteReviewModalContent = document.getElementById('noteReviewModalContent');
    noteReviewModalClose = document.getElementById('noteReviewModalClose');

    lastWordsModal = document.getElementById('lastWordsModal');
    lastWordsInput = document.getElementById('lastWordsInput');
    confirmLastWordsBtn = document.getElementById('confirmLastWordsBtn');
    lastWordsError = document.getElementById('lastWordsError');

    testKeyABtn = document.getElementById('testKeyABtn');
    testKeyBBtn = document.getElementById('testKeyBBtn');
    testPhase1DoneBtn = document.getElementById('testPhase1DoneBtn');
    testResetStage1Btn = document.getElementById('testResetStage1Btn');
    testResetKeyABtn = document.getElementById('testResetKeyABtn');
    testResetPlayerBtn = document.getElementById('testResetPlayerBtn');
    testResetCurrentLevelBtn = document.getElementById('testResetCurrentLevelBtn');
    testClearStageBtn = document.getElementById('testClearStageBtn');
    testLastLevelBtn = document.getElementById('testLastLevelBtn');
    testResetStage2Btn = document.getElementById('testResetStage2Btn');
    testStage3Btn = document.getElementById('testStage3Btn');
    testResetStage3Btn = document.getElementById('testResetStage3Btn');
    testShowCoverBtn = document.getElementById('testShowCoverBtn');
    testAudioBtn = document.getElementById('testAudioBtn');

    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas ? gameCanvas.getContext('2d') : null;
  }

  function playSound(name) {
    if (window.AudioManager && typeof window.AudioManager.play === 'function') {
      window.AudioManager.play(name);
    }
  }

  /* ============================================================
     状态缓存
     ============================================================ */
  var currentPhase = 1;
  var stage1Completed = false;
  var stage2Completed = false;
  var stage3Completed = false;
  var keyAGot = false;
  var keyBGot = false;
  var stage2Inverted = false;

  function getPlayerName() {
    var state = window.GameState.get();
    var name = state.playerName;
    if (name && String(name).trim() !== '') return String(name).trim();
    return DEFAULT_PLAYER_NAME;
  }

  function refreshStateCache() {
    var state = window.GameState.get();
    var phase = parseInt(state.currentPhase, 10);
    currentPhase = (isNaN(phase) || phase < 1) ? 1 : phase;
    stage1Completed = state.stage1Completed === true;
    stage2Completed = state.stage2Completed === true;
    stage3Completed = state.stage3Completed === true;
    keyAGot = !!(state.keysObtained && state.keysObtained.a === true);
    keyBGot = !!(state.keysObtained && state.keysObtained.b === true);
  }

  function renderDeveloperCard() {
    window.GameState.get();
    if (developerCard) developerCard.setAttribute('href', 'developer.html');
  }

  function replaceGameTitle() {
    var oldName = GAME_TITLE_OLD, newName = GAME_TITLE;
    if (!oldName || !newName || oldName === newName) return;
    if (document.title && document.title.indexOf(oldName) !== -1) {
      document.title = document.title.split(oldName).join(newName);
    }
    if (!document.body) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentElement;
      if (!parent) continue;
      var tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') continue;
      if (node.nodeValue && node.nodeValue.indexOf(oldName) !== -1) {
        node.nodeValue = node.nodeValue.split(oldName).join(newName);
      }
    }
  }

  /* ============================================================
     日记内容渲染
     ============================================================ */
  function renderNoteContent(container, content) {
    if (!container) return;
    container.innerHTML = '';
    var text = (content === null || content === undefined) ? '' : String(content);
    if (text.trim() === '') {
      var empty = document.createElement('p');
      empty.className = 'note-modal-content';
      empty.textContent = '（空白日记）';
      container.appendChild(empty);
      return;
    }
    var lines = text.split('\n');
    var startIdx = 0;
    if (lines.length > 0) {
      var firstLine = String(lines[0]).trim();
      if (/^\d{4}年\d{1,2}月\d{1,2}日/.test(firstLine)) {
        var dateEl = document.createElement('div');
        dateEl.className = 'note-modal-date';
        dateEl.textContent = lines[0];
        container.appendChild(dateEl);
        startIdx = 1;
      }
    }
    var hasParagraph = false;
    for (var i = startIdx; i < lines.length; i++) {
      var line = lines[i];
      if (line === null || line === undefined) continue;
      if (String(line).trim() === '') continue;
      var p = document.createElement('p');
      p.className = 'note-modal-content';
      p.textContent = line;
      container.appendChild(p);
      hasParagraph = true;
    }
    if (!hasParagraph) {
      var fallback = document.createElement('p');
      fallback.className = 'note-modal-content';
      fallback.textContent = text;
      container.appendChild(fallback);
    }
  }

  function ensureNoteContentIsDiv() {
    if (noteContent && noteContent.tagName === 'P') {
      var div = document.createElement('div');
      div.id = noteContent.id;
      div.className = noteContent.className;
      while (noteContent.firstChild) div.appendChild(noteContent.firstChild);
      if (noteContent.parentNode) noteContent.parentNode.replaceChild(div, noteContent);
      noteContent = div;
    }
    if (noteReviewModalContent && noteReviewModalContent.tagName === 'P') {
      var div2 = document.createElement('div');
      div2.id = noteReviewModalContent.id;
      div2.className = noteReviewModalContent.className;
      while (noteReviewModalContent.firstChild) div2.appendChild(noteReviewModalContent.firstChild);
      if (noteReviewModalContent.parentNode) noteReviewModalContent.parentNode.replaceChild(div2, noteReviewModalContent);
      noteReviewModalContent = div2;
    }
  }

  function setActiveView(viewName) {
    if (coverView) coverView.style.display = 'none';
    if (characterView) characterView.style.display = 'none';
    if (viewName === 'cover' && coverView) coverView.style.display = 'flex';
    else if (viewName === 'character' && characterView) characterView.style.display = 'flex';
  }

  /* ============================================================
     日记读取
     ============================================================ */
  var NOTE_READ_KEY = 'noteRead';

  function getNoteRead() {
    try {
      var raw = localStorage.getItem(NOTE_READ_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      var filtered = [];
      for (var i = 0; i < arr.length; i++) {
        var v = arr[i];
        if (typeof v !== 'number') continue;
        if (v >= 0 && v < NOTE_INDEX_LAST) filtered.push(v);
      }
      return filtered;
    } catch (e) { return []; }
  }
  function markNoteRead(idx) {
    if (typeof idx !== 'number') return;
    if (idx < 0 || idx >= NOTE_INDEX_LAST) return;
    var arr = getNoteRead();
    if (arr.indexOf(idx) === -1) {
      arr.push(idx);
      try { localStorage.setItem(NOTE_READ_KEY, JSON.stringify(arr)); } catch (e) {}
    }
  }
  function getNoteByIndex(idx) {
    if (typeof idx !== 'number' || idx < 0 || idx >= NOTE_KEYS.length) return null;
    var key = NOTE_KEYS[idx];
    return key ? (NOTE_DATA[key] || null) : null;
  }
  function getNoteFallbackTitle(idx) { return '残损的日记·其' + (idx + 1); }

  function openNoteReviewModal(idx) {
    if (!noteReviewModal) return;
    var note = getNoteByIndex(idx);
    if (!note) return;
    if (noteReviewModalTitle) {
      noteReviewModalTitle.textContent = note.title || getNoteFallbackTitle(idx);
      noteReviewModalTitle.classList.add('note-modal-title');
    }
    if (noteReviewModalContent) renderNoteContent(noteReviewModalContent, note.content);
    noteReviewModal.style.display = 'flex';
  }
  function closeNoteReviewModal() { if (noteReviewModal) noteReviewModal.style.display = 'none'; }

  function renderNoteReview() {
    if (!noteReview || !noteReviewList) return;
    var s2 = stage2Completed, s3 = stage3Completed;
    try {
      var st = window.GameState.get();
      s2 = st.stage2Completed === true;
      s3 = st.stage3Completed === true;
    } catch (e) {}
    if (!s2 && !s3) { noteReview.hidden = true; return; }
    noteReview.hidden = false;
    var readArr = getNoteRead();
    var visibleItems = [];
    for (var i = 0; i < NOTE_INDEX_LAST; i++) {
      if (readArr.indexOf(i) !== -1) visibleItems.push(i);
    }
    if (s3) visibleItems.push(NOTE_INDEX_LAST);
    if (visibleItems.length === 0) {
      noteReviewList.innerHTML = '<div class="note-review-empty">暂无日记</div>';
      return;
    }
    var html = '<div class="note-review-buttons">';
    for (var k = 0; k < visibleItems.length; k++) {
      var vIdx = visibleItems[k];
      var note = getNoteByIndex(vIdx);
      var label = (note && note.title) ? note.title : getNoteFallbackTitle(vIdx);
      html += '<button type="button" class="note-review-btn" data-note-index="' + vIdx + '">' + label + '</button>';
    }
    html += '</div>';
    noteReviewList.innerHTML = html;
    var btns = noteReviewList.querySelectorAll('.note-review-btn');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', function () {
        var idxStr = this.getAttribute('data-note-index');
        var idx = parseInt(idxStr, 10);
        if (isNaN(idx)) return;
        openNoteReviewModal(idx);
      });
    }
  }

  /* ============================================================
     封面与角色选择
     ============================================================ */
  function updateCoverButtonText() {
    if (!startGameBtn) return;
    var state = window.GameState.get();
    var a = !!(state.keysObtained && state.keysObtained.a === true);
    var b = !!(state.keysObtained && state.keysObtained.b === true);
    var s2 = state.stage2Completed === true;
    var text;
    if (!a) text = '开始游戏';
    else if (b) text = '开始游戏';
    else if (!s2) text = '开始游戏？';
    else text = '开始游戏';
    startGameBtn.textContent = text;
  }

  var selectedCharacter = null;

  function showCover() {
    refreshStateCache();
    inLevel = false;
    pauseGameBgm();
    setActiveView('cover');
    updateCoverButtonText();

    if (coverView) {
      if (stage3Completed) {
        coverView.classList.add('after-clear');
      } else {
        coverView.classList.remove('after-clear');
      }
    }
  }
  function showCharacterSelect() {
    setActiveView('character');
    refreshCharacterLocks();
    updateCharacterSelection();
  }

  function setCharBtnHint(btn, text) {
    if (!btn) return;
    var hint = btn.querySelector('.char-hint');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'char-hint';
      hint.style.position = 'absolute';
      hint.style.bottom = '8px';
      hint.style.left = '0';
      hint.style.width = '100%';
      hint.style.textAlign = 'center';
      hint.style.fontSize = '12px';
      hint.style.color = '#6b21a8';
      hint.style.pointerEvents = 'none';
      btn.appendChild(hint);
    }
    hint.textContent = text || '';
  }

  function ensureEpilogueText() {
    var ep = document.getElementById('epilogueText');
    if (ep) return ep;
    if (!characterView) return null;
    ep = document.createElement('div');
    ep.id = 'epilogueText';
    ep.style.color = '#5a6a80';
    ep.style.fontSize = '14px';
    ep.style.textAlign = 'center';
    ep.style.marginTop = '4px';
    ep.style.minHeight = '20px';
    ep.style.display = 'none';
    if (enterGameBtn && enterGameBtn.parentNode === characterView) characterView.insertBefore(ep, enterGameBtn);
    else characterView.appendChild(ep);
    return ep;
  }

  function refreshCharacterLocks() {
    var state = window.GameState.get();
    var keyA = !!(state.keysObtained && state.keysObtained.a === true);
    var keyB = !!(state.keysObtained && state.keysObtained.b === true);
    var s1 = state.stage1Completed === true;
    var s2 = state.stage2Completed === true;
    var s3 = state.stage3Completed === true;
    var shouldShowChar0 = s2 || keyB || s3;

    if (char0Btn) {
      var wasShown = _char0LastShown;
      _char0LastShown = shouldShowChar0;
      char0Btn.style.display = shouldShowChar0 ? '' : 'none';
      if (wasShown === false && shouldShowChar0 && !hasChar0AnimPlayed()) {
        markChar0AnimPlayed();
        char0Btn.classList.remove('char-appear');
        void char0Btn.offsetWidth;
        char0Btn.classList.add('char-appear');
      }
    }
    if (s3) {
      if (characterView) characterView.classList.add('all-cleared');
      if (char0Btn) { char0Btn.classList.remove('locked'); setCharBtnHint(char0Btn, ''); }
      if (char1Btn) { char1Btn.classList.remove('locked'); setCharBtnHint(char1Btn, ''); }
      if (char2Btn) { char2Btn.classList.remove('locked'); setCharBtnHint(char2Btn, ''); }
      if (enterGameBtn) enterGameBtn.style.display = 'none';
      var ep = ensureEpilogueText();
      if (ep) { ep.textContent = ''; ep.style.display = 'none'; }
      return;
    }
    if (characterView) characterView.classList.remove('all-cleared');
    if (enterGameBtn) enterGameBtn.style.display = '';
    var epNormal = document.getElementById('epilogueText');
    if (epNormal) { epNormal.textContent = ''; epNormal.style.display = 'none'; }

    if (char2Btn) {
      if (s1) { char2Btn.classList.add('locked'); setCharBtnHint(char2Btn, '已完成'); }
      else { char2Btn.classList.remove('locked'); setCharBtnHint(char2Btn, ''); }
    }
    if (char1Btn) {
      if (s2) { char1Btn.classList.add('locked'); setCharBtnHint(char1Btn, '已完成'); }
      else if (keyA) { char1Btn.classList.remove('locked'); setCharBtnHint(char1Btn, ''); }
      else if (s1 && !keyA) { char1Btn.classList.remove('locked'); setCharBtnHint(char1Btn, '点击解锁'); }
      else { char1Btn.classList.add('locked'); setCharBtnHint(char1Btn, '该角色已锁定'); }
    }
    if (char0Btn) {
      if (keyB) { char0Btn.classList.remove('locked'); setCharBtnHint(char0Btn, ''); }
      else if (s2 && !keyB) { char0Btn.classList.remove('locked'); setCharBtnHint(char0Btn, '点击解锁'); }
      else { char0Btn.classList.add('locked'); setCharBtnHint(char0Btn, '该角色已锁定'); }
    }
  }

  function updateCharacterSelection() {
    if (char0Btn) char0Btn.classList.toggle('selected', selectedCharacter === 0);
    if (char1Btn) char1Btn.classList.toggle('selected', selectedCharacter === 1);
    if (char2Btn) char2Btn.classList.toggle('selected', selectedCharacter === 2);
    if (enterGameBtn) {
      if (stage3Completed) enterGameBtn.disabled = true;
      else enterGameBtn.disabled = (selectedCharacter === null);
    }
  }

  function handleCharClick(charNum) {
    var state = window.GameState.get();
    var keyA = !!(state.keysObtained && state.keysObtained.a === true);
    var keyB = !!(state.keysObtained && state.keysObtained.b === true);
    var s1 = state.stage1Completed === true;
    var s2 = state.stage2Completed === true;
    var s3 = state.stage3Completed === true;

    if (s3) {
      selectedCharacter = charNum;
      window.GameState.update({ selectedCharacter: charNum });
      updateCharacterSelection();
      var ep = ensureEpilogueText();
      var msg = '';
      if (charNum === 0) msg = '不要再往回看了';
      else if (charNum === 1) msg = '这里什么都没有';
      else if (charNum === 2) msg = '走向你的明天吧';
      if (ep) { ep.textContent = msg; ep.style.display = 'block'; }
      return;
    }
    if (charNum === 2) {
      if (s1) { alert('你已经来过这里了'); return; }
      selectedCharacter = 2;
      window.GameState.update({ selectedCharacter: 2 });
      updateCharacterSelection();
      return;
    }
    if (charNum === 1) {
      if (s2) { alert('该阶段已完成'); return; }
      if (keyA) { selectedCharacter = 1; window.GameState.update({ selectedCharacter: 1 }); updateCharacterSelection(); return; }
      if (s1 && !keyA) { openKeyModal(); return; }
      alert('该角色已锁定');
      return;
    }
    if (charNum === 0) {
      if (s3) { alert('该阶段已完成'); return; }
      if (keyB) { selectedCharacter = 0; window.GameState.update({ selectedCharacter: 0 }); updateCharacterSelection(); return; }
      if (s2 && !keyB) { openKeyBModal(); return; }
      alert('该角色已锁定');
      return;
    }
  }

  function enterStage1() {
    currentStage = 1;
    window.GameState.update({ currentPhase: 1, currentLevel: 1 });
    currentPhase = 1;
    loadLevel(1);
  }

  function handleEnterGame() {
    if (stage3Completed) return;
    if (selectedCharacter === null) { alert('请先选择一个角色'); return; }
    var state = window.GameState.get();
    var keyA = !!(state.keysObtained && state.keysObtained.a === true);
    var keyB = !!(state.keysObtained && state.keysObtained.b === true);
    var s1 = state.stage1Completed === true;
    var s2 = state.stage2Completed === true;
    var s3 = state.stage3Completed === true;

    playGameBgm();

    if (selectedCharacter === 2) {
      if (s1) {
        alert('你已经来过这里了');
        return;
      }
      setActiveView('none');
      enterStage1();
      return;
    }
    if (selectedCharacter === 1 && keyA && !s2) {
      setActiveView('none');
      currentStage = 2;
      window.GameState.update({ currentPhase: 2, currentLevel: 1 });
      currentPhase = 2;
      loadStage2Level(1);
      return;
    }
    if (selectedCharacter === 0 && keyB && !s3) {
      setActiveView('none');
      currentStage = 3;
      window.GameState.update({ currentPhase: 3, currentLevel: 1 });
      currentPhase = 3;
      loadStage3();
      return;
    }
    alert('该阶段不可进入');
  }

  /* ============================================================
     SPRITES & TILES
     ============================================================ */
  var SPRITES = {};
  var TILES = {};

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('加载失败: ' + src)); };
      img.src = src;
    });
  }

  function loadTile(name, src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { TILES[name] = img; resolve(); };
      img.onerror = function () { console.warn('瓦片加载失败：', src); resolve(); };
      img.src = src;
    });
  }

  function preloadAllSprites() {
    var list = [
      ['char0_idle', 'assets/characters/char0/idle.png'],
      ['char0_walk1', 'assets/characters/char0/walk-1.png'],
      ['char0_walk2', 'assets/characters/char0/walk-2.png'],
      ['char0_portrait', 'assets/characters/char0/portrait.png'],
      ['char1_idle', 'assets/characters/char1/idle.png'],
      ['char1_walk1', 'assets/characters/char1/walk-1.png'],
      ['char1_walk2', 'assets/characters/char1/walk-2.png'],
      ['char1_jump', 'assets/characters/char1/jump.png'],
      ['char1_portrait', 'assets/characters/char1/portrait.png']
    ];
    return Promise.all(list.map(function (item) {
      return loadImage(item[1]).then(function (img) {
        SPRITES[item[0]] = img;
      }).catch(function (err) {
        console.warn('素材加载失败：', item[1], err);
        SPRITES[item[0]] = null;
      });
    }));
  }

  function preloadTiles() {
    return Promise.all([
      loadTile('platformLeft', 'assets/tiles/platform-left.png'),
      loadTile('platformMid', 'assets/tiles/platform-mid.png'),
      loadTile('platformRight', 'assets/tiles/platform-right.png'),
      loadTile('movingLeft', 'assets/tiles/moving-left.png'),
      loadTile('movingMid', 'assets/tiles/moving-mid.png'),
      loadTile('movingRight', 'assets/tiles/moving-right.png'),
      loadTile('groundLeft', 'assets/tiles/ground-left.png'),
      loadTile('groundTop', 'assets/tiles/ground-top.png'),
      loadTile('groundRight', 'assets/tiles/ground-right.png'),
      loadTile('groundMid', 'assets/tiles/ground-mid.png'),
      loadTile('groundBottom', 'assets/tiles/ground-bottom.png'),
      loadTile('spike', 'assets/tiles/spike.png'),
      loadTile('doorClosedTop', 'assets/tiles/door-closed-top.png'),
      loadTile('doorClosedBottom', 'assets/tiles/door-closed-bottom.png'),
      loadTile('doorOpenTop', 'assets/tiles/door-open-top.png'),
      loadTile('doorOpenBottom', 'assets/tiles/door-open-bottom.png'),
      loadTile('chest', 'assets/tiles/chest.png'),
      loadTile('key', 'assets/tiles/key.png'),
      loadTile('note', 'assets/tiles/note.png'),
      loadTile('stage1Bg', 'assets/backgrounds/stage1-bg.png'),
      loadTile('stage2Bg', 'assets/backgrounds/stage2-bg.png'),
      loadTile('stage3Bg', 'assets/backgrounds/stage3-bg.png'),
      loadTile('char2Idle', 'assets/characters/char2/body-idle.png'),
      loadTile('char2Walk1', 'assets/characters/char2/body-walk-1.png'),
      loadTile('char2Walk2', 'assets/characters/char2/body-walk-2.png'),
      loadTile('char2Jump', 'assets/characters/char2/body-jump.png'),
      loadTile('char2Select', 'assets/characters/char2/select.png'),
      loadTile('char2Portrait', 'assets/characters/char2/portrait.png')
    ]);
  }

  /* ============================================================
     瓦片绘制函数
     ============================================================ */
  function drawPlatform(ctx, x, y, w, h, type) {
    var visualH = PLATFORM_VISUAL_H;
    var leftImg, midImg, rightImg;
    if (type === 'moving') {
      leftImg = TILES.movingLeft;
      midImg = TILES.movingMid;
      rightImg = TILES.movingRight;
    } else {
      leftImg = TILES.platformLeft;
      midImg = TILES.platformMid;
      rightImg = TILES.platformRight;
    }

    var segW = visualH * 2.5;
    var leftW = segW;
    var rightW = segW;
    var midW = w - leftW - rightW;
    if (midW < 0) { leftW = w / 2; rightW = w / 2; midW = 0; }

    if (leftImg) ctx.drawImage(leftImg, x, y, leftW, visualH);
    else { ctx.fillStyle = '#555'; ctx.fillRect(x, y, leftW, visualH); }

    if (rightImg) ctx.drawImage(rightImg, x + w - rightW, y, rightW, visualH);
    else { ctx.fillStyle = '#555'; ctx.fillRect(x + w - rightW, y, rightW, visualH); }

    if (midW > 0 && midImg) {
      var count = Math.ceil(midW / segW);
      var perW = midW / count;
      for (var i = 0; i < count; i++) {
        ctx.drawImage(midImg, x + leftW + i * perW, y, perW, visualH);
      }
    }
  }

  function drawGround(ctx, x, y, w, h) {
    var tileH = 47;
    var leftW = 47;
    var rightW = 47;
    var midW = w - leftW - rightW;

    if (TILES.groundLeft) ctx.drawImage(TILES.groundLeft, x, y, leftW, tileH);
    if (TILES.groundRight) ctx.drawImage(TILES.groundRight, x + w - rightW, y, rightW, tileH);
    if (midW > 0 && TILES.groundTop) {
      var count = Math.ceil(midW / tileH);
      var perW = midW / count;
      for (var i = 0; i < count; i++) {
        ctx.drawImage(TILES.groundTop, x + leftW + i * perW, y, perW, tileH);
      }
    }

    var rowsBelow = Math.floor((h - tileH) / tileH);
    for (var r = 1; r <= rowsBelow; r++) {
      var rowY = y + r * tileH;
      var isLast = (r === rowsBelow);
      var rowImg = isLast ? (TILES.groundBottom || TILES.groundMid) : TILES.groundMid;
      if (!rowImg) continue;
      if (midW > 0) {
        var cnt = Math.ceil(midW / tileH);
        var pw = midW / cnt;
        for (var k = 0; k < cnt; k++) {
          ctx.drawImage(rowImg, x + leftW + k * pw, rowY, pw, tileH);
        }
      }
      if (TILES.groundLeft) ctx.drawImage(TILES.groundLeft, x, rowY, leftW, tileH);
      if (TILES.groundRight) ctx.drawImage(TILES.groundRight, x + w - rightW, rowY, rightW, tileH);
    }
  }

  function drawDoor(ctx, x, y, w, h, isOpen) {
    var halfH = h / 2;
    var topImg = isOpen ? TILES.doorOpenTop : TILES.doorClosedTop;
    var bottomImg = isOpen ? TILES.doorOpenBottom : TILES.doorClosedBottom;
    if (topImg) ctx.drawImage(topImg, x, y, w, halfH);
    else { ctx.fillStyle = isOpen ? '#2ecc71' : '#666'; ctx.fillRect(x, y, w, halfH); }
    if (bottomImg) ctx.drawImage(bottomImg, x, y + halfH, w, halfH);
    else { ctx.fillStyle = isOpen ? '#2ecc71' : '#666'; ctx.fillRect(x, y + halfH, w, halfH); }
  }

  /* ============================================================
     角色 sprite 绘制
     ============================================================ */
  function drawChar0(ctx, x, y, w, h, action) {
    var key = 'char0_idle';
    if (action === 'walk') {
      var frame = Math.floor(gameTime / 200) % 2;
      key = frame === 0 ? 'char0_walk1' : 'char0_walk2';
    }
    var img = SPRITES[key];
    if (!img) return;
    var breath = 1 + Math.sin(gameTime * 0.003) * 0.02;
    ctx.save();
    ctx.translate(x + w / 2, y + h);
    ctx.scale(1, breath);
    ctx.drawImage(img, -w / 2, -h, w, h);
    ctx.restore();
  }

  function drawChar1(ctx, x, y, w, h, action) {
    var key = 'char1_idle';
    if (action === 'walk') {
      var frame = Math.floor(gameTime / 200) % 2;
      key = frame === 0 ? 'char1_walk1' : 'char1_walk2';
    } else if (action === 'jump') {
      key = 'char1_jump';
    }
    var img = SPRITES[key];
    if (!img) return;
    var breath = 1 + Math.sin(gameTime * 0.003) * 0.02;
    ctx.save();
    ctx.translate(x + w / 2, y + h);
    ctx.scale(1, breath);
    ctx.drawImage(img, -w / 2, -h, w, h);
    ctx.restore();
  }

  function drawChar1Mirrored(ctx, x, y, w, h, action) {
    var key = 'char1_idle';
    if (action === 'walk') {
      var frame = Math.floor(gameTime / 200) % 2;
      key = frame === 0 ? 'char1_walk1' : 'char1_walk2';
    } else if (action === 'jump') {
      key = 'char1_jump';
    }
    var img = SPRITES[key];
    if (!img) {
      ctx.fillStyle = STAGE3_COLORS.player1;
      ctx.fillRect(x, y, w, h);
      return;
    }
    var breath = 1 + Math.sin(gameTime * 0.003) * 0.02;
    ctx.save();
    ctx.translate(x + w / 2, y + h);
    ctx.scale(-1, breath);
    ctx.drawImage(img, -w / 2, -h, w, h);
    ctx.restore();
  }

  function drawChar2(ctx, x, y, w, h, action) {
    var key = 'char2Idle';
    if (action === 'walk') {
      var frame = Math.floor(gameTime / 200) % 2;
      key = frame === 0 ? 'char2Walk1' : 'char2Walk2';
    } else if (action === 'jump') {
      key = 'char2Jump';
    }
    var img = TILES[key];
    if (!img) {
      ctx.fillStyle = CHAR2_FALLBACK_COLOR;
      ctx.fillRect(x, y, w, h);
      return;
    }
    var breath = 1 + Math.sin(gameTime * 0.003) * 0.02;
    ctx.save();
    ctx.translate(x + w / 2, y + h);
    ctx.scale(1, breath);
    ctx.drawImage(img, -w / 2, -h, w, h);
    ctx.restore();
  }

  function getPlayerAction() {
    if (player.vx !== 0 && player.onGround) return 'walk';
    if (!player.onGround) return 'jump';
    return 'idle';
  }

  function drawPortraitKeepRatio(img, x, y, alpha) {
    if (!img || !gameCtx) return false;
    var prevAlpha = gameCtx.globalAlpha;
    gameCtx.globalAlpha = (typeof alpha === 'number') ? alpha : 1;
    var scale = Math.min(PORTRAIT_W / img.width, PORTRAIT_H / img.height);
    var dw = img.width * scale;
    var dh = img.height * scale;
    var dx = x + (PORTRAIT_W - dw) / 2;
    var dy = y + (PORTRAIT_H - dh) / 2;
    gameCtx.drawImage(img, dx, dy, dw, dh);
    gameCtx.globalAlpha = prevAlpha;
    return true;
  }

  function drawPortrait(x, y, name, color, alpha) {
    var img = null;
    if (name === '角色0号' && SPRITES['char0_portrait']) img = SPRITES['char0_portrait'];
    else if (name === '角色1号' && SPRITES['char1_portrait']) img = SPRITES['char1_portrait'];

    if (img) {
      drawPortraitKeepRatio(img, x, y, alpha);
      return;
    }

    var prevAlpha = gameCtx.globalAlpha;
    gameCtx.globalAlpha = (typeof alpha === 'number') ? alpha : 1;
    gameCtx.fillStyle = color;
    gameCtx.fillRect(x, y, PORTRAIT_W, PORTRAIT_H);
    gameCtx.strokeStyle = '#000000';
    gameCtx.lineWidth = 2;
    gameCtx.strokeRect(x + 1, y + 1, PORTRAIT_W - 2, PORTRAIT_H - 2);
    gameCtx.globalAlpha = prevAlpha;
  }

  function drawChar0Portrait(x, y, name, alpha) {
    var img = SPRITES['char0_portrait'];
    if (!img) return;
    drawPortraitKeepRatio(img, x, y, alpha);
  }

  function drawChar1Portrait(x, y, name, alpha) {
    var img = SPRITES['char1_portrait'];
    if (!img) return;
    drawPortraitKeepRatio(img, x, y, alpha);
  }

  function drawChar2Portrait(x, y, name, alpha) {
    var img = TILES['char2Portrait'];
    if (!img) {
      if (gameCtx) {
        var prevA = gameCtx.globalAlpha;
        gameCtx.globalAlpha = (typeof alpha === 'number') ? alpha : 1;
        gameCtx.fillStyle = CHAR2_FALLBACK_COLOR;
        gameCtx.fillRect(x, y, PORTRAIT_W, PORTRAIT_H);
        gameCtx.globalAlpha = prevA;
      }
      return;
    }
    drawPortraitKeepRatio(img, x, y, alpha);
  }

  /* ============================================================
     密钥填空题
     ============================================================ */
  function getFillInputs(container) {
    if (!container) return [];
    return container.querySelectorAll('.key-fill-input');
  }
  function clearFillInputs(container) {
    var inputs = getFillInputs(container);
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
      inputs[i].classList.remove('error');
    }
  }
  function validateFillInputs(container, allowedSets) {
    var inputs = getFillInputs(container);
    var errorIdx = [];
    for (var i = 0; i < inputs.length; i++) {
      var v = (inputs[i].value || '').trim();
      var allowed = allowedSets[i] || [];
      var ok = false;
      for (var j = 0; j < allowed.length; j++) {
        if (v === allowed[j]) { ok = true; break; }
      }
      if (!ok) errorIdx.push(i);
    }
    return errorIdx;
  }
  function markFillErrors(container, errorIdx) {
    var inputs = getFillInputs(container);
    for (var i = 0; i < inputs.length; i++) inputs[i].classList.remove('error');
    for (var j = 0; j < errorIdx.length; j++) {
      var idx = errorIdx[j];
      if (inputs[idx]) { inputs[idx].classList.add('error'); inputs[idx].value = ''; }
    }
    if (errorIdx.length > 0) {
      var firstErr = inputs[errorIdx[0]];
      if (firstErr) window.requestAnimationFrame(function () { try { firstErr.focus(); } catch (e) {} });
    }
  }
  function setupFillLine(container, onSubmit, onEscape) {
    if (!container) return;
    var inputs = container.querySelectorAll('.key-fill-input');
    if (!inputs || inputs.length === 0) return;
    for (var i = 0; i < inputs.length; i++) {
      (function (idx, input) {
        var isComposing = false;
        function handleFinalizedInput() {
          if (input.value.length > 1) input.value = input.value.charAt(0);
          input.classList.remove('error');
          if (input.value.length >= 1 && idx < inputs.length - 1) {
            try { inputs[idx + 1].focus(); } catch (e) {}
          }
        }
        input.addEventListener('compositionstart', function () { isComposing = true; });
        input.addEventListener('compositionend', function () { isComposing = false; handleFinalizedInput(); });
        input.addEventListener('input', function (e) {
          if (isComposing || (e && e.isComposing)) return;
          handleFinalizedInput();
        });
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace') {
            if (input.value === '' && idx > 0) {
              e.preventDefault();
              var prev = inputs[idx - 1];
              prev.value = '';
              prev.classList.remove('error');
              try { prev.focus(); } catch (err) {}
            }
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (typeof onSubmit === 'function') onSubmit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            if (typeof onEscape === 'function') onEscape();
          }
        });
      })(i, inputs[i]);
    }
  }

  function openKeyModal(forceOpen) {
    if (!keyModal) return;
    if (!forceOpen) {
      var state = window.GameState.get();
      if (state.keysObtained && state.keysObtained.a === true) return;
    }
    clearFillInputs(keyAFillLine);
    if (keyError) keyError.hidden = true;
    keyModal.style.display = 'flex';
    window.requestAnimationFrame(function () {
      var inputs = getFillInputs(keyAFillLine);
      if (inputs[0]) try { inputs[0].focus(); } catch (e) {}
    });
  }
  function closeKeyModal() { if (keyModal) keyModal.style.display = 'none'; }

  function handleKeyConfirm() {
    if (!keyAFillLine) return;
    var errorIdx = validateFillInputs(keyAFillLine, KEY_A_ALLOWED);
    if (errorIdx.length === 0) {
      if (keyError) keyError.hidden = true;
      closeKeyModal();
      clearFillInputs(keyAFillLine);
      var state = window.GameState.get();
      var newKeys = { a: true, b: state.keysObtained ? !!state.keysObtained.b : false };
      window.GameState.update({ keysObtained: newKeys, currentLevel: 1 });
      window.GameState.broadcast({ keysObtained: newKeys, stage2Unlocked: true });
      refreshStateCache();
      refreshCharacterLocks();
      selectedCharacter = 1;
      window.GameState.update({ selectedCharacter: 1 });
      updateCharacterSelection();
      updateCoverButtonText();
    } else {
      if (keyError) keyError.hidden = false;
      markFillErrors(keyAFillLine, errorIdx);
    }
  }

  function openKeyBModal(forceOpen) {
    if (!keyBModal) return;
    if (!forceOpen) {
      var state = window.GameState.get();
      if (state.keysObtained && state.keysObtained.b === true) return;
    }
    clearFillInputs(keyBFillLine);
    if (keyBError) keyBError.hidden = true;
    keyBModal.style.display = 'flex';
    window.requestAnimationFrame(function () {
      var inputs = getFillInputs(keyBFillLine);
      if (inputs[0]) try { inputs[0].focus(); } catch (e) {}
    });
  }
  function closeKeyBModal() { if (keyBModal) keyBModal.style.display = 'none'; }

  function handleKeyBConfirm() {
    if (!keyBFillLine) return;
    var errorIdx = validateFillInputs(keyBFillLine, KEY_B_ALLOWED);
    if (errorIdx.length === 0) {
      if (keyBError) keyBError.hidden = true;
      closeKeyBModal();
      clearFillInputs(keyBFillLine);
      window.GameState.update({ keysObtained: { a: true, b: true }, currentLevel: 1 });
      window.GameState.broadcast({ keysObtained: { a: true, b: true }, stage3Unlocked: true });
      refreshStateCache();
      refreshCharacterLocks();
      selectedCharacter = 0;
      window.GameState.update({ selectedCharacter: 0 });
      updateCharacterSelection();
      updateCoverButtonText();
    } else {
      if (keyBError) keyBError.hidden = false;
      markFillErrors(keyBFillLine, errorIdx);
    }
  }

  /* ============================================================
     日记弹窗
     ============================================================ */
  var pendingNoteIdx = -1;

  function isNoteModalOpen() { return noteModal && noteModal.style.display !== 'none'; }
  function openNoteModal(title, content, idx) {
    if (!noteModal || !noteContent) return;
    if (noteModalTitle) {
      noteModalTitle.textContent = title || '残损的日记';
      noteModalTitle.classList.add('note-modal-title');
    }
    renderNoteContent(noteContent, content);
    noteModal.style.display = 'flex';
    pendingNoteIdx = (typeof idx === 'number') ? idx : -1;
  }
  function closeNoteModal() {
    if (!noteModal) return;
    noteModal.style.display = 'none';
    if (pendingNoteIdx >= 0) { markNoteRead(pendingNoteIdx); renderNoteReview(); pendingNoteIdx = -1; }
  }

  /* ============================================================
     阶段三输入弹窗
     ============================================================ */
  function isLastWordsModalOpen() { return lastWordsModal && lastWordsModal.style.display !== 'none'; }
  function openLastWordsModal() {
    if (!lastWordsModal) return;
    lastWordsModal.style.display = 'flex';
    if (lastWordsInput) {
      lastWordsInput.value = '';
      window.requestAnimationFrame(function () { try { lastWordsInput.focus(); } catch (e) {} });
    }
    if (lastWordsError) lastWordsError.hidden = true;
  }
  function closeLastWordsModal() {
    if (!lastWordsModal) return;
    lastWordsModal.style.display = 'none';
    if (lastWordsError) lastWordsError.hidden = true;
  }
  function handleLastWordsConfirm() {
    if (!lastWordsInput) return;
    var text = lastWordsInput.value.trim();
    if (text === '') {
      if (lastWordsError) lastWordsError.hidden = false;
      return;
    }
    window.GameState.update({ playerLastWords: text });
    closeLastWordsModal();
    if (dialogueState.active) {
      var insertAt = dialogueState.index + 1;
      dialogueState.lines.splice(insertAt, 0, {
        speaker: '角色0号', text: '我记住了。',
        isRecording: false, isNarration: false, options: null,
        triggerLastWords: false, triggerInput: false
      });
      dialogueState.index = insertAt;
    }
  }

  /* ============================================================
     对话系统
     ============================================================ */
  var dialogueState = {
    active: false, lines: [], index: 0, onComplete: null,
    cameraZoom: 1, cameraFocusX: 0, cameraFocusY: 0,
    optionRects: [], lastWordsModalOpened: false
  };

  function normalizeDialogueLines(rawLines) {
    if (!rawLines || !rawLines.length) return [];
    var result = [];
    for (var i = 0; i < rawLines.length; i++) {
      var line = rawLines[i];
      if (!line) continue;
      if (line.type === 'options') {
        var opts = (line.options && line.options.length > 0) ? line.options.slice() : [];
        if (result.length > 0) result[result.length - 1].options = opts;
        else result.push({ speaker: '', text: '', isRecording: false, isNarration: false, options: opts, triggerLastWords: false, triggerInput: false });
        continue;
      }
      var isRecording = line.isRecording === true;
      var isNarration = line.isNarration === true;
      var inlineOpts = null;
      if (line.options && line.options.length > 0) inlineOpts = line.options.slice();
      result.push({
        speaker: line.speaker || '',
        text: line.text || '',
        isRecording: isRecording,
        isNarration: isNarration,
        options: inlineOpts,
        triggerLastWords: line.triggerLastWords === true,
        triggerInput: line.triggerInput === true
      });
    }
    return result;
  }

  function startDialogue(lines, onComplete, focusX, focusY, noZoom) {
    if (!lines || lines.length === 0) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    var normalized = normalizeDialogueLines(lines);
    if (!normalized || normalized.length === 0) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    dialogueState.active = true;
    dialogueState.lines = normalized;
    dialogueState.index = 0;
    dialogueState.onComplete = onComplete || null;
    dialogueState.cameraZoom = noZoom ? 1 : 1.5;
    dialogueState.cameraFocusX = (typeof focusX === 'number') ? focusX : (player.x + player.w / 2);
    dialogueState.cameraFocusY = (typeof focusY === 'number') ? focusY : (player.y + player.h / 2);
    dialogueState.optionRects = [];
    dialogueState.lastWordsModalOpened = false;
    hoveredOption = -1;
    keys.left = false; keys.right = false; keys.jump = false; keys.forward = false;
    player.vx = 0;
  }

  function currentLineHasOptions() {
    if (!dialogueState.active) return false;
    var line = dialogueState.lines[dialogueState.index];
    return !!(line && line.options && line.options.length > 0);
  }
  function currentLineTriggersLastWords() {
    if (!dialogueState.active) return false;
    var line = dialogueState.lines[dialogueState.index];
    return !!(line && (line.triggerLastWords || line.triggerInput));
  }

  function advanceDialogue() {
    if (!dialogueState.active) return;
    if (isLastWordsModalOpen()) return;
    if (currentLineHasOptions()) return;
    if (currentLineTriggersLastWords()) return;
    dialogueState.index++;
    if (dialogueState.index >= dialogueState.lines.length) {
      var cb = dialogueState.onComplete;
      dialogueState.active = false;
      dialogueState.lines = [];
      dialogueState.index = 0;
      dialogueState.onComplete = null;
      dialogueState.cameraZoom = 1;
      dialogueState.optionRects = [];
      dialogueState.lastWordsModalOpened = false;
      hoveredOption = -1;
      if (typeof cb === 'function') cb();
    }
  }

  function handleDialogueOption(optionText) {
    if (!dialogueState.active) return;
    if (!currentLineHasOptions()) return;
    var playerSpeaker = (currentStage === 3) ? '角色0号' : '角色2号';
    var insertAt = dialogueState.index + 1;
    dialogueState.lines.splice(insertAt, 0, {
      speaker: playerSpeaker, text: optionText,
      isRecording: false, isNarration: false, options: null,
      triggerLastWords: false, triggerInput: false
    });
    dialogueState.index++;
    dialogueState.optionRects = [];
    hoveredOption = -1;
  }

  /* ============================================================
     游戏状态
     ============================================================ */
  var player = {
    x: 100, y: 331, w: PLAYER_SIZE, h: PLAYER_SIZE,
    vx: 0, vy: 0, onGround: false, ridingPlatform: null
  };
  var camera = { x: 0 };

  var currentStage = 1;
  var currentLevelNum = 1;
  var levelData = null;
  var hasKey = false;
  var chestOpened = false;
  var currentMessage = '';
  var messageTimer = 0;

  var gameTime = 0;
  var movingFrozen = false;
  var showAllTraps = false;
  var keys = { left: false, right: false, jump: false, forward: false };
  var lastTime = 0;
  var fps = 0;
  var frameCount = 0;
  var fpsElapsed = 0;

  var pickupAnimations = [];

  var stage6State = { phase: 'idle', npcTargetX: 0, fadeTimer: 0 };

  var stage3Camera = { x: 0 };
  var stage3State = {
    state: 'walking', levelWidth: 8000,
    player0: { x: 100, y: 331, w: 72, h: 72 },
    player2: { x: -20, y: 331, w: 72, h: 72, visible: true },
    player1: { x: 6000, y: 331, w: 72, h: 72 },
    door: { x: 6200, y: 323, w: 80, h: 80 },
    groundRects: [], triggerChests: [], dialogues: [], finalDialogueLines: [],
    finalDialogueTriggered: false, player2Locked: false, hugTimer: 0,
    doorAlpha: 0, doorTimer: 0, fadeTimer: 0, fadeAlpha: 0,
    cameraLocked: false, lockedCameraX: 0
  };

  /* ============================================================
     工具
     ============================================================ */
  function isTypingTarget(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  }
  function isForwardKey(k, e) {
    return k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' ||
           k === ' ' || k === 'Spacebar' || (e && e.code === 'Space');
  }
  function aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }
  function rectDistance(a, b) {
    var dx = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w), 0);
    var dy = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h), 0);
    return Math.sqrt(dx * dx + dy * dy);
  }
  function normRect(r) {
    if (!r) return { x: 0, y: 0, w: 0, h: 0 };
    return {
      x: Number(r.x) || 0,
      y: Number(r.y) || 0,
      w: (r.width !== undefined) ? Number(r.width) : (Number(r.w) || 0),
      h: (r.height !== undefined) ? Number(r.height) : (Number(r.h) || 0)
    };
  }
  function showMessage(text, duration) {
    currentMessage = text;
    messageTimer = duration || 1.5;
  }
  function isStage2Level6() { return currentStage === 2 && currentLevelNum === 6; }

  function computeSpikeState(s) {
    if (s.type !== 'timed') return { visible: true, blinking: false };
    var vis = Number(s.visibleDuration);
    var invis = Number(s.invisibleDuration);
    if (!isFinite(vis) || vis <= 0) vis = SPIKE_VISIBLE;
    if (!isFinite(invis) || invis <= 0) invis = SPIKE_INVISIBLE;
    var cycle = vis + invis;
    var offset = Number(s.startOffset);
    if (!isFinite(offset)) offset = 0;
    var phase = (gameTime + offset * cycle) % cycle;
    if (phase < 0) phase += cycle;
    var visible = phase < vis;
    var blinking = false;
    if (visible) { if (vis - phase < 300) blinking = true; }
    else { if (cycle - phase < 300) blinking = true; }
    return { visible: visible, blinking: blinking };
  }

  function refreshSpikeStates() {
    if (!levelData || !levelData.spikes) return;
    var plats = levelData.platformRects;
    for (var i = 0; i < levelData.spikes.length; i++) {
      var s = levelData.spikes[i];
      if (s.platformIndex !== undefined && s.platformIndex !== null) {
        var plat = plats[s.platformIndex];
        if (plat) { s.x = plat.x + (s.offsetX || 0); s.y = plat.y + (s.offsetY || 0); }
      }
      var st = computeSpikeState(s);
      s._visible = st.visible;
      s._blinking = st.blinking;
    }
  }

  function getChestWorld() {
    if (!levelData || !levelData.chestRect) return null;
    var c = levelData.chestRect;
    if (c.platformIndex !== undefined) {
      var plat = levelData.platformRects[c.platformIndex];
      if (!plat) return null;
      if (plat.type === 'timed' && !plat.visible) return null;
      return { x: plat.x + (c.offsetX || 0), y: plat.y + (c.offsetY || 0), w: c.w || CHEST_W, h: c.h || CHEST_H };
    }
    return { x: c.x, y: c.y, w: c.w || CHEST_W, h: c.h || CHEST_H };
  }

  function canOpenChest() {
    if (!levelData || chestOpened) return false;
    var c = getChestWorld();
    if (!c || c.w <= 0) return false;
    return rectDistance(player, c) < CHEST_INTERACT_DIST;
  }
  function canReadNote() {
    if (currentStage !== 2) return false;
    if (currentLevelNum === 6) return false;
    if (!levelData || !levelData.note) return false;
    var c = getChestWorld();
    if (!c || c.w <= 0) return false;
    return rectDistance(player, c) < CHEST_INTERACT_DIST;
  }

  function applyStage2Inverted(on) {
    if (on === stage2Inverted) return;
    stage2Inverted = !!on;
    if (!gameCanvas) return;
    if (stage2Inverted) gameCanvas.classList.add('inverted');
    else gameCanvas.classList.remove('inverted');
  }

  function handleDownKey() {
    if (currentStage === 2) {
      if (canReadNote()) {
        var idx = currentLevelNum - 1;
        var note = getNoteByIndex(idx);
        var alreadyRead = getNoteRead().indexOf(idx) !== -1;

        if (note) openNoteModal(note.title, note.content, idx);
        else if (levelData && levelData.note) openNoteModal('残损的日记', levelData.note, idx);

        if (!alreadyRead) {
          var chest = getChestWorld();
          if (chest) {
            pickupAnimations.push({
              x: chest.x + chest.w / 2,
              y: chest.y,
              startTime: gameTime,
              duration: 1000,
              type: 'note'
            });
          }
        }

        showMessage('开启成功', 2);

        if (currentLevelNum === 5) {
          applyStage2Inverted(true);
        }
      }
      return;
    }
    if (canOpenChest()) {
      var chestW = getChestWorld();
      chestOpened = true; hasKey = true;
      showMessage('开启成功', 2);
      playSound('chest');
      if (chestW) {
        pickupAnimations.push({
          x: chestW.x + chestW.w / 2,
          y: chestW.y,
          startTime: gameTime,
          duration: 1000,
          type: 'key'
        });
      }
    }
  }

  function checkSpikeCollision() {
    if (!levelData || !levelData.spikes || levelData.spikes.length === 0) return false;
    for (var i = 0; i < levelData.spikes.length; i++) {
      var s = levelData.spikes[i];
      if (s.type === 'timed' && s._visible === false) continue;
      if (aabb(player, s)) return true;
    }
    return false;
  }

  function resetPlayerToStart() {
    if (!levelData) return;
    player.x = levelData.playerStart.x;
    player.y = levelData.playerStart.y;
    player.vx = 0; player.vy = 0;
    player.onGround = false;
    player.ridingPlatform = null;
    camera.x = 0;
    keys.left = false; keys.right = false; keys.jump = false;
  }

  function resetCurrentLevel() {
    if (!levelData) return;
    resetPlayerToStart();
    hasKey = (currentStage === 2) ? true : false;
    chestOpened = false;
    showMessage('你被尖刺刺中了', 0.8);
  }

  function buildStage6Override(raw) {
    var clone = JSON.parse(JSON.stringify(raw));
    var lastRight = 0;
    if (clone.platforms && clone.platforms.length > 0) {
      var last = clone.platforms[clone.platforms.length - 1];
      lastRight = Number(last.x) + Number(last.width);
    }
    var doorW = 80, doorH = 80;
    var doorX = lastRight + STAGE6_DOOR_DISTANCE;
    clone.exit = { x: doorX, y: 323, width: doorW, height: doorH };
    var npcW = 72, npcH = 72;
    clone.npc = { x: doorX - 100, y: 331, width: npcW, height: npcH };
    clone.levelWidth = doorX + doorW + 100;
    clone.ground = [
      { x: 0, y: 403, width: 400, height: 47 },
      { x: lastRight, y: 403, width: clone.levelWidth - lastRight, height: 47 }
    ];
    clone.dialogue = STAGE2_L6_DIALOGUE.slice();
    clone.chest = null;
    clone.note = null;
    return clone;
  }

  function bindSpikesToMovingPlatforms(raw) {
    if (!raw || !raw.platforms || !raw.spikes || raw.spikes.length === 0) return raw;
    var clone;
    try { clone = JSON.parse(JSON.stringify(raw)); }
    catch (e) { return raw; }
    var plats = clone.platforms;
    var spikes = clone.spikes;
    for (var i = 0; i < spikes.length; i++) {
      var sp = spikes[i];
      if (sp.platformIndex !== undefined && sp.platformIndex !== null) continue;
      var spLeft = Number(sp.x) || 0;
      var spTop = Number(sp.y) || 0;
      var spW = Number(sp.width) || 75;
      var spH = Number(sp.height) || 20;
      var spRight = spLeft + spW;
      var spBottom = spTop + spH;
      for (var j = 0; j < plats.length; j++) {
        var pl = plats[j];
        if (pl.type !== 'moving') continue;
        var plLeft = Number(pl.x) || 0;
        var plTop = Number(pl.y) || 0;
        var plW = Number(pl.width) || 0;
        var plRight = plLeft + plW;
        if (Math.abs(spBottom - plTop) <= 2 && spRight > plLeft && spLeft < plRight) {
          sp.platformIndex = j;
          sp.offsetX = spLeft - plLeft;
          sp.offsetY = spTop - plTop;
          break;
        }
      }
    }
    return clone;
  }

  function buildLevel(raw, num) {
    var lw = Number(raw.levelWidth);
    if (!isFinite(lw) || lw <= 0) lw = 2000;
    var colliders = [];
    var groundRects = [];
    var platformRects = [];
    var i;

    var gs = raw.ground || [];
    for (i = 0; i < gs.length; i++) {
      var g = normRect(gs[i]);
      if (g.w <= 0 || g.h <= 0) continue;
      groundRects.push(g); colliders.push(g);
    }
    var ps = raw.platforms || [];
    for (i = 0; i < ps.length; i++) {
      var p = normRect(ps[i]);
      if (p.w <= 0 || p.h <= 0) continue;
      var rawPlat = ps[i];
      if (rawPlat.type === 'moving') {
        p.type = 'moving';
        p.baseX = p.x; p.baseY = p.y;
        p.moveAxis = (rawPlat.moveAxis === 'vertical') ? 'vertical' : 'horizontal';
        p.moveRange = Number(rawPlat.moveRange);
        if (!isFinite(p.moveRange) || p.moveRange <= 0) p.moveRange = 200;
        p.moveSpeed = Number(rawPlat.moveSpeed);
        if (!isFinite(p.moveSpeed) || p.moveSpeed <= 0) p.moveSpeed = 120;
        p.startOffset = Number(rawPlat.startOffset);
        if (!isFinite(p.startOffset)) p.startOffset = 0;
        p.deltaX = 0; p.deltaY = 0; p.movingTime = 0;
      }
      if (rawPlat.type === 'timed') {
        p.type = 'timed';
        p.visibleDuration = PLATFORM_VISIBLE;
        p.invisibleDuration = PLATFORM_INVISIBLE;
        p.startOffset = Number(rawPlat.startOffset);
        if (!isFinite(p.startOffset)) p.startOffset = 0;
        p.timedTime = 0; p.visible = true;
        p.visibleRemaining = p.visibleDuration; p.blinking = false;
      }
      platformRects.push(p); colliders.push(p);
    }
    var spikesRaw = raw.spikes || [];
    var spikesList = [];
    for (i = 0; i < spikesRaw.length; i++) {
      var sr = spikesRaw[i];
      var spike = {
        x: Number(sr.x) || 0, y: Number(sr.y) || 0,
        w: Number(sr.width) || 75, h: Number(sr.height) || 20,
        type: sr.type || 'static', _visible: true, _blinking: false
      };
      if (sr.platformIndex !== undefined && sr.platformIndex !== null) {
        spike.platformIndex = Number(sr.platformIndex);
        spike.offsetX = Number(sr.offsetX) || 0;
        spike.offsetY = Number(sr.offsetY) || 0;
      }
      if (spike.type === 'timed') {
        var rVis = Number(sr.visibleDuration);
        var rInvis = Number(sr.invisibleDuration);
        spike.visibleDuration = (isFinite(rVis) && rVis > 0) ? rVis : SPIKE_VISIBLE;
        spike.invisibleDuration = (isFinite(rInvis) && rInvis > 0) ? rInvis : SPIKE_INVISIBLE;
        spike.startOffset = Number(sr.startOffset);
        if (!isFinite(spike.startOffset)) spike.startOffset = 0;
      }
      spikesList.push(spike);
    }
    var chestRaw = raw.chest;
    var chestData = null;
    if (chestRaw) {
      if (chestRaw.platformIndex !== undefined) {
        chestData = {
          platformIndex: Number(chestRaw.platformIndex),
          offsetX: Number(chestRaw.offsetX) || 0,
          offsetY: Number(chestRaw.offsetY) || 0,
          w: CHEST_W, h: CHEST_H
        };
      } else {
        var cr = normRect(chestRaw);
        chestData = { x: cr.x, y: cr.y, w: cr.w > 0 ? cr.w : CHEST_W, h: cr.h > 0 ? cr.h : CHEST_H };
      }
    }
    var startX = (raw.playerStart && isFinite(raw.playerStart.x)) ? Number(raw.playerStart.x) : 100;
    var startY = (raw.playerStart && isFinite(raw.playerStart.y)) ? Number(raw.playerStart.y) : 331;
    var npcData = null;
    if (raw.npc) {
      npcData = {
        x: Number(raw.npc.x) || 0, y: Number(raw.npc.y) || 0,
        w: Number(raw.npc.width) || 72, h: Number(raw.npc.height) || 72
      };
    }
    levelData = {
      id: raw.id, name: raw.name, levelWidth: lw,
      background: raw.background || null,
      playerStart: { x: startX, y: startY },
      groundRects: groundRects,
      platformRects: platformRects,
      colliders: colliders,
      spikes: spikesList,
      chestRect: chestData,
      note: raw.note || null,
      npc: npcData,
      dialogue: raw.dialogue || null,
      exitRect: normRect(raw.exit)
    };
    currentLevelNum = (raw.id) ? Number(raw.id) : num;
    hasKey = false; chestOpened = false;
    currentMessage = ''; messageTimer = 0;
    pickupAnimations = [];
    stage6State.phase = 'idle';
    stage6State.npcTargetX = 0;
    stage6State.fadeTimer = 0;
    dialogueState.active = false;
    dialogueState.lines = [];
    dialogueState.index = 0;
    dialogueState.onComplete = null;
    dialogueState.cameraZoom = 1;
    dialogueState.optionRects = [];
    dialogueState.lastWordsModalOpened = false;
    hoveredOption = -1;
    resetPlayerToStart();
    refreshSpikeStates();
  }

  function loadLevel(num) {
    var levels = window.Levels && window.Levels.stage1;
    if (!levels || levels.length === 0) return;
    var idx = num - 1;
    if (idx < 0 || idx >= levels.length) idx = 0;
    var raw = levels[idx];
    if (!raw) return;
    currentStage = 1;
    buildLevel(raw, num);
    window.GameState.update({ currentLevel: currentLevelNum });
    inLevel = true;
    playGameBgm();
  }

  function loadStage2Level(levelIndex) {
    var levels = window.Levels && window.Levels.stage2;
    if (!levels || levels.length === 0) return;
    var idx = levelIndex - 1;
    if (idx < 0 || idx >= levels.length) idx = 0;
    var raw = levels[idx];
    if (!raw) return;
    if (raw.id === 6) raw = buildStage6Override(raw);
    raw = bindSpikesToMovingPlatforms(raw);
    currentStage = 2;
    buildLevel(raw, levelIndex);
    hasKey = true;
    window.GameState.update({ currentLevel: currentLevelNum });

    if (levelIndex === 1) {
      applyStage2Inverted(false);
    }

    inLevel = true;
    playGameBgm();
  }

  function loadStage3() {
    var levels = window.Levels && window.Levels.stage3;
    if (!levels || levels.length === 0) return;
    var raw = levels[0];
    if (!raw) return;
    currentStage = 3;
    levelData = null;
    stage3State.state = 'walking';
    stage3State.levelWidth = Number(raw.levelWidth) || 8000;
    var startX = (raw.player0Start && isFinite(raw.player0Start.x)) ? Number(raw.player0Start.x) : 100;
    var startY = (raw.player0Start && isFinite(raw.player0Start.y)) ? Number(raw.player0Start.y) : 331;
    stage3State.player0 = { x: startX, y: startY, w: 72, h: 72 };
    stage3State.player2 = { x: startX - STAGE3_PLAYER2_FOLLOW_DIST, y: 331, w: 72, h: 72, visible: true };
    var p1 = raw.player1Pos || {};
    stage3State.player1 = { x: Number(p1.x) || 6000, y: Number(p1.y) || 331, w: Number(p1.w) || 72, h: Number(p1.h) || 72 };
    var dr = raw.doorPos || {};
    stage3State.door = { x: Number(dr.x) || 6200, y: Number(dr.y) || 323, w: Number(dr.w) || 80, h: Number(dr.h) || 80 };
    var gsRaw = raw.ground || [];
    stage3State.groundRects = [];
    for (var g = 0; g < gsRaw.length; g++) stage3State.groundRects.push(normRect(gsRaw[g]));
    stage3State.triggerChests = [];
    for (var ci = 0; ci < STAGE3_CHEST_XS.length; ci++) {
      stage3State.triggerChests.push({
        x: STAGE3_CHEST_XS[ci], y: STAGE3_CHEST_Y,
        w: STAGE3_CHEST_W, h: STAGE3_CHEST_H, triggered: false
      });
    }
    stage3State.dialogues = STAGE3_CHEST_DIALOGUES.map(function (arr) { return arr.slice(); });
    stage3State.finalDialogueLines = STAGE3_FINAL_DIALOGUE.slice();
    stage3State.finalDialogueTriggered = false;
    stage3State.player2Locked = false;
    stage3State.hugTimer = 0;
    stage3State.doorAlpha = 0;
    stage3State.doorTimer = 0;
    stage3State.fadeTimer = 0;
    stage3State.fadeAlpha = 0;
    stage3State.cameraLocked = false;
    stage3State.lockedCameraX = 0;
    pickupAnimations = [];
    dialogueState.active = false;
    dialogueState.lines = [];
    dialogueState.index = 0;
    dialogueState.onComplete = null;
    dialogueState.cameraZoom = 1;
    dialogueState.optionRects = [];
    dialogueState.lastWordsModalOpened = false;
    hoveredOption = -1;
    keys.forward = false;
    stage3Camera.x = 0;
    updateStage3Camera();

    inLevel = true;
    playGameBgm();
  }

  function advanceLevel() {
    if (currentStage === 2) {
      if (currentLevelNum >= 6) return;
      playSound('level-complete');
      loadStage2Level(currentLevelNum + 1);
      return;
    }
    if (currentStage === 1) {
      if (currentLevelNum >= 6) {
        playSound('level-complete');
        stage1Completed = true;
        window.GameState.update({ stage1Completed: true });
        window.GameState.broadcast({ stage1Completed: true });
        refreshStateCache();
        showCover();
        return;
      }
      playSound('level-complete');
      loadLevel(currentLevelNum + 1);
    }
  }

  function completeStage2() {
    stage2Completed = true;
    window.GameState.update({ stage2Completed: true });
    window.GameState.broadcast({ stage2Completed: true });
    playSound('level-complete');
    renderNoteReview();
    refreshStateCache();
    applyStage2Inverted(false);
    showCover();
  }

  function completeStage3() {
    stage3Completed = true;
    window.GameState.update({ stage3Completed: true });
    window.GameState.broadcast({ stage3Completed: true });
    renderNoteReview();
    refreshStateCache();
    inLevel = false;
    stopGameBgm();
    showCover();
  }

  function onStage6DialogueComplete() {
    if (!levelData || !levelData.npc || !levelData.exitRect) return;
    stage6State.phase = 'walking';
    stage6State.npcTargetX = levelData.exitRect.x + 20;
  }

  function getPlayerMoveSpeed() {
    if (isStage2Level6() && levelData && levelData.npc) {
      var npcCenterX = levelData.npc.x + levelData.npc.w / 2;
      var playerCenterX = player.x + player.w / 2;
      var dist = Math.abs(npcCenterX - playerCenterX);
      if (dist <= STAGE6_SLOW_DIST) return MOVE_SPEED * STAGE6_SLOW_FACTOR;
    }
    return MOVE_SPEED;
  }

  function updateMovingPlatforms(dt) {
    if (!levelData) return;
    var platforms = levelData.platformRects;
    for (var i = 0; i < platforms.length; i++) {
      var p = platforms[i];
      if (p.type !== 'moving') continue;
      var oldX = p.x, oldY = p.y;
      if (!movingFrozen) p.movingTime += dt;
      var angle = p.movingTime * p.moveSpeed / p.moveRange + p.startOffset * Math.PI * 2;
      var offset = Math.sin(angle) * (p.moveRange / 2);
      if (p.moveAxis === 'horizontal') p.x = p.baseX + offset;
      else p.y = p.baseY + offset;
      p.deltaX = p.x - oldX;
      p.deltaY = p.y - oldY;
    }
  }

  function updateTimedPlatforms(dt) {
    if (!levelData) return;
    var platforms = levelData.platformRects;
    for (var i = 0; i < platforms.length; i++) {
      var p = platforms[i];
      if (p.type !== 'timed') continue;
      if (!movingFrozen) p.timedTime += dt * 1000;
      var vis = PLATFORM_VISIBLE;
      var invis = PLATFORM_INVISIBLE;
      var cycle = vis + invis;
      var t = (p.timedTime + p.startOffset * cycle) % cycle;
      if (t < vis) { p.visible = true; p.visibleRemaining = vis - t; p.blinking = p.visibleRemaining < 300; }
      else { p.visible = false; p.visibleRemaining = 0; p.blinking = false; }
    }
  }

  function updateCamera() {
    if (!levelData) return;
    var worldW = levelData.levelWidth;
    if (worldW <= CANVAS_W) { camera.x = 0; return; }
    var target = player.x + player.w / 2 - CANVAS_W / 2;
    if (target < 0) target = 0;
    else if (target > worldW - CANVAS_W) target = worldW - CANVAS_W;
    camera.x = target;
  }

  function update(dt) {
    if (currentStage === 3) { updateStage3(dt); return; }
    if (!levelData) return;
    if (isStage2Level6()) {
      if (stage6State.phase === 'walking') {
        if (levelData.npc) {
          levelData.npc.x += STAGE6_NPC_WALK_SPEED * dt;
          if (levelData.npc.x >= stage6State.npcTargetX) {
            levelData.npc.x = stage6State.npcTargetX;
            stage6State.phase = 'fading';
            stage6State.fadeTimer = 0;
          }
        }
        updateCamera();
        return;
      }
      if (stage6State.phase === 'fading') {
        stage6State.fadeTimer += dt;
        if (stage6State.fadeTimer >= 1.5) {
          stage6State.phase = 'done';
          completeStage2();
        }
        return;
      }
    }
    if (dialogueState.active) return;

    updateMovingPlatforms(dt);
    updateTimedPlatforms(dt);
    refreshSpikeStates();

    if (player.ridingPlatform && player.ridingPlatform.type === 'moving') {
      player.x += player.ridingPlatform.deltaX;
      player.y += player.ridingPlatform.deltaY;
    }
    var inputX = 0;
    if (keys.left) inputX -= 1;
    if (keys.right) inputX += 1;
    var curSpeed = getPlayerMoveSpeed();
    player.vx = inputX * curSpeed;
    if (keys.jump && player.onGround) {
      player.vy = JUMP_SPEED;
      player.onGround = false;
      player.ridingPlatform = null;
    }
    player.vy += GRAVITY * dt;
    player.x += player.vx * dt;
    var worldW = levelData.levelWidth;
    if (player.x < 0) { player.x = 0; player.vx = 0; }
    if (player.x + player.w > worldW) { player.x = worldW - player.w; player.vx = 0; }

    for (var i = 0; i < levelData.colliders.length; i++) {
      var p = levelData.colliders[i];
      if (p.type === 'timed' && !p.visible) continue;
      if (aabb(player, p)) {
        if (player.vx > 0) player.x = p.x - player.w;
        else if (player.vx < 0) player.x = p.x + p.w;
        player.vx = 0;
      }
    }
    player.y += player.vy * dt;
    player.onGround = false;
    player.ridingPlatform = null;
    for (var j = 0; j < levelData.colliders.length; j++) {
      var plat = levelData.colliders[j];
      if (plat.type === 'timed' && !plat.visible) continue;
      if (aabb(player, plat)) {
        if (player.vy > 0) {
          player.y = plat.y - player.h;
          player.vy = 0;
          player.onGround = true;
          player.ridingPlatform = plat;
        } else if (player.vy < 0) {
          player.y = plat.y + plat.h;
          player.vy = 0;
        }
      }
    }
    if (player.y > WORLD_HEIGHT + 400) { resetPlayerToStart(); return; }
    if (checkSpikeCollision()) { resetCurrentLevel(); return; }

    if (isStage2Level6() && stage6State.phase === 'idle' && levelData.npc) {
      var npcCenterX = levelData.npc.x + levelData.npc.w / 2;
      var playerCenterX = player.x + player.w / 2;
      if (Math.abs(npcCenterX - playerCenterX) < STAGE6_TRIGGER_DIST) {
        var midX = (npcCenterX + playerCenterX) / 2;
        var focusY = player.y + player.h / 2 - 40;
        stage6State.phase = 'dialogue';
        startDialogue(levelData.dialogue.slice(), onStage6DialogueComplete, midX, focusY, true);
        return;
      }
    }
    if (levelData.exitRect && levelData.exitRect.w > 0) {
      if (aabb(player, levelData.exitRect)) {
        if (currentStage === 2) {
          if (currentLevelNum !== 6) { advanceLevel(); return; }
        } else {
          if (hasKey) { advanceLevel(); return; }
          else if (messageTimer <= 0) showMessage('需要先找到钥匙', 1.5);
        }
      }
    }
    if (messageTimer > 0) {
      messageTimer -= dt;
      if (messageTimer <= 0) currentMessage = '';
    }
    updateCamera();
  }

  function updateStage3Camera() {
    var s = stage3State;
    if (s.cameraLocked) { stage3Camera.x = s.lockedCameraX; return; }
    var focusX;
    if (s.state === 'walkingToDoor' || s.state === 'fadingWhite' || s.state === 'done') focusX = s.player2.x + s.player2.w / 2;
    else focusX = s.player0.x + s.player0.w / 2;
    var target = focusX - CANVAS_W / 3;
    var maxCamera = s.levelWidth - CANVAS_W;
    if (maxCamera < 0) maxCamera = 0;
    if (target < 0) target = 0;
    if (target > maxCamera) target = maxCamera;
    stage3Camera.x = target;
  }

  function lockStage3Camera() {
    var s = stage3State;
    var minX = Math.min(s.player0.x, s.player1.x, s.player2.x, s.door.x);
    var maxX = Math.max(
      s.player0.x + s.player0.w, s.player1.x + s.player1.w,
      s.player2.x + s.player2.w, s.door.x + s.door.w
    );
    var centerX = (minX + maxX) / 2;
    var target = centerX - CANVAS_W / 2;
    var maxCamera = s.levelWidth - CANVAS_W;
    if (maxCamera < 0) maxCamera = 0;
    if (target < 0) target = 0;
    if (target > maxCamera) target = maxCamera;
    s.lockedCameraX = target;
    s.cameraLocked = true;
    stage3Camera.x = target;
  }

  function updateStage3Player2Follow(dt) {
    var s = stage3State;
    if (s.state !== 'walking') return;
    if (s.player2Locked) return;
    var targetX = s.player0.x - STAGE3_PLAYER2_FOLLOW_DIST;
    var diff = targetX - s.player2.x;
    if (Math.abs(diff) > 0.5) {
      var speed = Math.min(STAGE3_PLAYER2_SPEED_MAX, Math.abs(diff) * 3);
      s.player2.x += Math.sign(diff) * speed * dt;
    }
  }

  function tryTriggerStage3Chest() {
    var s = stage3State;
    if (s.state !== 'walking') return;
    var pcx = s.player0.x + s.player0.w / 2;
    for (var i = 0; i < s.triggerChests.length; i++) {
      var c = s.triggerChests[i];
      if (c.triggered) continue;
      var ccx = c.x + c.w / 2;
      if (pcx >= ccx - STAGE3_CHEST_INTERACT) {
        c.triggered = true;
        s.state = 'dialogue';
        keys.forward = false;
        showMessage('开启成功', 1.5);
        var lines = STAGE3_CHEST_DIALOGUES[i] || [];
        startDialogue(lines.slice(), function () {
          if (stage3State.state === 'dialogue') stage3State.state = 'walking';
        }, 0, 0, true);
        return;
      }
    }
  }

  function updateStage3(dt) {
    var s = stage3State;
    if (s.state === 'dialogue') {
      if (!dialogueState.active) s.state = 'walking';
      return;
    }
    if (s.state === 'hugging') {
      var targetX = s.player1.x - 20;
      if (s.player0.x < targetX) {
        s.player0.x += STAGE3_HUG_SPEED * dt;
        if (s.player0.x > targetX) s.player0.x = targetX;
      }
      s.hugTimer += dt;
      if (s.hugTimer >= STAGE3_HUG_DURATION) {
        s.state = 'postHugDialogue';
        startDialogue(STAGE3_POST_HUG_DIALOGUE.slice(), function () {
          if (stage3State.state === 'postHugDialogue') {
            stage3State.state = 'doorAppearing';
            stage3State.doorTimer = 0;
            stage3State.doorAlpha = 0;
          }
        }, 0, 0, true);
      }
      return;
    }
    if (s.state === 'postHugDialogue') {
      if (!dialogueState.active) {
        s.state = 'doorAppearing';
        s.doorTimer = 0;
        s.doorAlpha = 0;
      }
      return;
    }
    if (s.state === 'doorAppearing') {
      s.doorTimer += dt;
      s.doorAlpha = Math.min(1, s.doorTimer / STAGE3_DOOR_APPEAR_DURATION);
      if (s.doorTimer >= STAGE3_DOOR_APPEAR_DURATION) {
        s.doorAlpha = 1;
        s.state = 'walkingToDoor';
        keys.forward = false;
      }
      return;
    }
    if (s.state === 'walkingToDoor') {
      if (keys.forward) s.player2.x += STAGE3_PLAYER2_TO_DOOR_SPEED * dt;
      if (s.player2.x >= s.door.x) {
        s.player2.x = s.door.x;
        s.player2.visible = false;
        s.state = 'fadingWhite';
        s.fadeTimer = 0;
        s.fadeAlpha = 0;
      }
      return;
    }
    if (s.state === 'fadingWhite') {
      s.fadeTimer += dt;
      s.fadeAlpha = Math.min(1, s.fadeTimer / STAGE3_FADE_WHITE_DURATION);
      if (s.fadeTimer >= STAGE3_FADE_WHITE_DURATION) {
        s.state = 'done';
        completeStage3();
      }
      return;
    }
    if (s.state === 'done') return;
    if (s.state === 'walking') {
      if (keys.forward) s.player0.x += STAGE3_PLAYER0_SPEED * dt;
      tryTriggerStage3Chest();
      if (s.state !== 'walking') return;
      if (!s.finalDialogueTriggered) {
        var distToP1 = s.player1.x - s.player0.x;
        if (distToP1 <= 180) {
          s.finalDialogueTriggered = true;
          s.player2Locked = true;
          s.state = 'dialogue';
          keys.forward = false;
          lockStage3Camera();
          startDialogue(s.finalDialogueLines.slice(), function () {
            stage3State.state = 'hugging';
            stage3State.hugTimer = 0;
          }, 0, 0, true);
          return;
        }
      }
      updateStage3Player2Follow(dt);
      updateStage3Camera();
      return;
    }
  }

  function getSpikeColor() {
    if (currentStage === 2) {
      if (currentLevelNum === 6) return '#ff0000';
      return STAGE2_COLORS.spike;
    }
    return '#e74c3c';
  }
  function shouldRenderPlayerAsChar2() {
    if (currentStage === 1) return true;
    if (currentStage === 2 && currentLevelNum === 6) return true;
    return false;
  }

  function drawPickupAnimations(ctx, camX) {
    for (var i = pickupAnimations.length - 1; i >= 0; i--) {
      var anim = pickupAnimations[i];
      var elapsed = gameTime - anim.startTime;
      if (elapsed > anim.duration) {
        pickupAnimations.splice(i, 1);
        continue;
      }
      var progress = elapsed / anim.duration;
      var offsetY = -progress * 60;
      var alpha = 1 - progress;

      var img = null;
      if (anim.type === 'key') img = TILES.key;
      else if (anim.type === 'note') img = TILES.note;

      var size = (anim.type === 'key') ? 24 : 32;

      if (img) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, anim.x - camX - size / 2, anim.y + offsetY - size, size, size);
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha = alpha;
        var bw = size, bh = size;
        if (anim.type === 'note') {
          ctx.fillStyle = '#f0e8d0';
          ctx.fillRect(anim.x - camX - bw / 2, anim.y + offsetY - bh, bw, bh);
          ctx.strokeStyle = '#8a6a52';
          ctx.lineWidth = 2;
          ctx.strokeRect(anim.x - camX - bw / 2, anim.y + offsetY - bh, bw, bh);
          ctx.beginPath();
          ctx.moveTo(anim.x - camX - bw / 2 + 6, anim.y + offsetY - bh);
          ctx.lineTo(anim.x - camX - bw / 2 + 6, anim.y + offsetY);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#f0c040';
          ctx.fillRect(anim.x - camX - bw / 2, anim.y + offsetY - bh, bw, bh);
        }
        ctx.restore();
      }
    }
  }

  function renderStage3() {
    var s = stage3State;
    var camX = stage3Camera.x;

    if (TILES.stage3Bg) {
      var drawW = CANVAS_W;
      var drawH = CANVAS_H;
      var offset = -((camX * STAGE3_BG_PARALLAX) % drawW);
      var count = Math.ceil(CANVAS_W / drawW) + 1;
      for (var bi = 0; bi < count; bi++) {
        gameCtx.drawImage(TILES.stage3Bg, offset + bi * drawW, 0, drawW, drawH);
      }
    } else {
      gameCtx.fillStyle = '#000000';
      gameCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    for (var gi = 0; gi < s.groundRects.length; gi++) {
      var gr = s.groundRects[gi];
      var gx = gr.x - camX;
      if (gx + gr.w < 0 || gx > CANVAS_W) continue;
      drawGround(gameCtx, gx, gr.y, gr.w, gr.h);
    }

    for (var ci = 0; ci < s.triggerChests.length; ci++) {
      var c = s.triggerChests[ci];
      var cx = c.x - camX;
      if (cx + c.w < 0 || cx > CANVAS_W) continue;
      if (TILES.chest) {
        if (c.triggered) {
          gameCtx.globalAlpha = 0.4;
          gameCtx.drawImage(TILES.chest, cx, c.y, c.w, c.h);
          gameCtx.globalAlpha = 1;
        } else {
          gameCtx.drawImage(TILES.chest, cx, c.y, c.w, c.h);
        }
      } else {
        if (c.triggered) {
          gameCtx.fillStyle = STAGE3_COLORS.chestDim;
          gameCtx.fillRect(cx, c.y, c.w, c.h);
        } else {
          gameCtx.fillStyle = STAGE3_COLORS.chest;
          gameCtx.fillRect(cx, c.y, c.w, c.h);
          gameCtx.fillStyle = '#f0c040';
          gameCtx.fillRect(cx, c.y + 18, c.w, 4);
        }
      }
    }

    if (s.state === 'doorAppearing' || s.state === 'walkingToDoor' || s.state === 'fadingWhite' || s.state === 'done') {
      var doorX = s.door.x - camX;
      if (doorX + s.door.w > 0 && doorX < CANVAS_W) {
        var prevAlpha = gameCtx.globalAlpha;
        gameCtx.globalAlpha = s.doorAlpha;
        drawDoor(gameCtx, doorX, s.door.y, s.door.w, s.door.h, true);
        gameCtx.globalAlpha = prevAlpha;
      }
    }

    var p1x = s.player1.x - camX;
    if (p1x + s.player1.w > 0 && p1x < CANVAS_W) {
      drawChar1Mirrored(gameCtx, p1x, s.player1.y, s.player1.w, s.player1.h, 'idle');
    }

    var p0x = s.player0.x - camX;
    if (p0x + s.player0.w > 0 && p0x < CANVAS_W) {
      var action0 = 'idle';
      if (s.state === 'walking' && keys.forward) {
        action0 = 'walk';
      }
      drawChar0(gameCtx, p0x, s.player0.y, s.player0.w, s.player0.h, action0);
    }

    if (s.player2.visible !== false) {
      var p2x = s.player2.x - camX;
      if (p2x + s.player2.w > 0 && p2x < CANVAS_W) {
        var action2 = 'idle';
        if (s.state === 'walking' || s.state === 'walkingToDoor') {
          if (keys.forward) action2 = 'walk';
        }
        drawChar2(gameCtx, p2x, s.player2.y, s.player2.w, s.player2.h, action2);
      }
    }

    drawPickupAnimations(gameCtx, camX);

    if (s.state === 'walking') {
      var pcx = s.player0.x + s.player0.w / 2;
      for (var hi = 0; hi < s.triggerChests.length; hi++) {
        var hc = s.triggerChests[hi];
        if (hc.triggered) continue;
        var hccx = hc.x + hc.w / 2;
        if (Math.abs(pcx - hccx) < STAGE3_CHEST_INTERACT) {
          var tipX = hccx - camX;
          gameCtx.fillStyle = LEVEL_TEXT_COLOR;
          gameCtx.font = '16px system-ui, "Microsoft YaHei", sans-serif';
          gameCtx.textAlign = 'center';
          gameCtx.textBaseline = 'bottom';
          gameCtx.fillText(CHEST_HINT_TEXT, tipX, hc.y - 6);
          break;
        }
      }
    }

    if (dialogueState.active && dialogueState.lines.length > 0) drawDialogueScene();

    if (s.state === 'fadingWhite') {
      gameCtx.fillStyle = 'rgba(255, 255, 255, ' + s.fadeAlpha + ')';
      gameCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    } else if (s.state === 'done') {
      gameCtx.fillStyle = '#ffffff';
      gameCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      gameCtx.fillStyle = LEVEL_TEXT_COLOR;
      gameCtx.font = '24px system-ui, "Microsoft YaHei", sans-serif';
      gameCtx.textAlign = 'center';
      gameCtx.textBaseline = 'middle';
      gameCtx.fillText('阶段三完成', CANVAS_W / 2, CANVAS_H / 2);
    }
    if (SHOW_DEBUG_INFO) drawDebugInfo();
  }

  function render() {
    if (!gameCtx) return;
    if (currentStage === 3) { renderStage3(); return; }

    if (stage3Completed || (stage2Completed && !stage3Completed)) {
      gameCtx.fillStyle = '#0a0a12';
      gameCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      if (SHOW_DEBUG_INFO) drawDebugInfo();
      return;
    }

    if (currentStage === 1) {
      if (TILES.stage1Bg) {
        gameCtx.drawImage(TILES.stage1Bg, 0, 0, CANVAS_W, CANVAS_H);
      } else {
        gameCtx.fillStyle = '#14171c';
        gameCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      }
    } else if (currentStage === 2) {
      if (TILES.stage2Bg) {
        gameCtx.drawImage(TILES.stage2Bg, 0, 0, CANVAS_W, CANVAS_H);
      } else {
        gameCtx.fillStyle = '#0a0a12';
        gameCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      }
    } else {
      gameCtx.fillStyle = '#14171c';
      gameCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    if (currentStage === 1 && stage1Completed) { if (SHOW_DEBUG_INFO) drawDebugInfo(); return; }
    if (currentPhase !== 1 && currentStage === 1) { if (SHOW_DEBUG_INFO) drawDebugInfo(); return; }
    if (!levelData) { if (SHOW_DEBUG_INFO) drawDebugInfo(); return; }

    gameCtx.save();
    if (dialogueState.active && dialogueState.cameraZoom !== 1) {
      var zoom = dialogueState.cameraZoom;
      var focusScreenX = dialogueState.cameraFocusX - camera.x;
      var focusScreenY = dialogueState.cameraFocusY;
      gameCtx.translate(CANVAS_W / 2, CANVAS_H / 2);
      gameCtx.scale(zoom, zoom);
      gameCtx.translate(-focusScreenX, -focusScreenY);
    }

    for (var i = 0; i < levelData.groundRects.length; i++) {
      var g = levelData.groundRects[i];
      var gx = g.x - camera.x;
      if (gx + g.w < 0 || gx > CANVAS_W) continue;
      drawGround(gameCtx, gx, g.y, g.w, g.h);
    }

    for (var j = 0; j < levelData.platformRects.length; j++) {
      var p = levelData.platformRects[j];
      var px = p.x - camera.x;
      if (px + p.w < 0 || px > CANVAS_W) continue;
      if (p.type === 'timed') {
        if (!p.visible) continue;
        var alpha = 1;
        if (p.blinking) alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(p.visibleRemaining / 30));
        gameCtx.globalAlpha = alpha;
        drawPlatform(gameCtx, px, p.y, p.w, p.h, 'timed');
        gameCtx.globalAlpha = 1;
      } else if (p.type === 'moving') {
        drawPlatform(gameCtx, px, p.y, p.w, p.h, 'moving');
      } else {
        drawPlatform(gameCtx, px, p.y, p.w, p.h, 'static');
      }
    }

    if (levelData.spikes && levelData.spikes.length > 0) {
      for (var si = 0; si < levelData.spikes.length; si++) {
        var s = levelData.spikes[si];
        var sx = s.x - camera.x;
        if (sx + s.w < 0 || sx > CANVAS_W) continue;
        if (s.type === 'timed' && s._visible === false) continue;
        if (showAllTraps) {
          gameCtx.fillStyle = 'rgba(255, 0, 0, 0.3)';
          gameCtx.fillRect(sx - 8, s.y - 8, s.w + 16, s.h + 16);
        }
        var prevAlpha2 = gameCtx.globalAlpha;
        if (s.type === 'timed' && s._blinking) gameCtx.globalAlpha = 0.4;
        if (TILES.spike) {
          gameCtx.drawImage(TILES.spike, sx, s.y, s.w, s.h);
        } else {
          gameCtx.fillStyle = getSpikeColor();
          gameCtx.fillRect(sx, s.y, s.w, s.h);
        }
        gameCtx.globalAlpha = prevAlpha2;
      }
    }

    var chestWorld = getChestWorld();
    if (chestWorld && chestWorld.w > 0) {
      var cx = chestWorld.x - camera.x;
      if (cx + chestWorld.w > 0 && cx < CANVAS_W) {
        if (TILES.chest) {
          if (!chestOpened) {
            gameCtx.drawImage(TILES.chest, cx, chestWorld.y, chestWorld.w, chestWorld.h);
          } else {
            gameCtx.globalAlpha = 0.4;
            gameCtx.drawImage(TILES.chest, cx, chestWorld.y, chestWorld.w, chestWorld.h);
            gameCtx.globalAlpha = 1;
          }
        } else {
          if (!chestOpened) {
            gameCtx.fillStyle = (currentStage === 2) ? STAGE2_COLORS.chest : '#d4a017';
            gameCtx.fillRect(cx, chestWorld.y, chestWorld.w, chestWorld.h);
            gameCtx.fillStyle = '#f0c040';
            gameCtx.fillRect(cx, chestWorld.y + 18, chestWorld.w, 4);
          } else {
            gameCtx.fillStyle = '#6b5010';
            gameCtx.fillRect(cx, chestWorld.y, chestWorld.w, chestWorld.h);
          }
        }
      }
    }

    if (levelData.exitRect && levelData.exitRect.w > 0) {
      var e = levelData.exitRect;
      var ex = e.x - camera.x;
      if (ex + e.w > 0 && ex < CANVAS_W) {
        var doorOpen = (currentStage === 2) ? true : hasKey;
        drawDoor(gameCtx, ex, e.y, e.w, e.h, doorOpen);
      }
    }

    if (isStage2Level6() && levelData.npc && levelData.npc.w > 0) {
      var nx = levelData.npc.x - camera.x;
      if (nx + levelData.npc.w > 0 && nx < CANVAS_W) {
        drawChar1(gameCtx, nx, levelData.npc.y, levelData.npc.w, levelData.npc.h, 'idle');
      }
    }

    var px2 = player.x - camera.x;
    var currentAction = getPlayerAction();
    if (shouldRenderPlayerAsChar2()) {
      drawChar2(gameCtx, px2, player.y, player.w, player.h, currentAction);
    } else if (currentStage === 2 && currentLevelNum !== 6) {
      drawChar1(gameCtx, px2, player.y, player.w, player.h, currentAction);
    } else {
      gameCtx.fillStyle = '#4a9eff';
      gameCtx.fillRect(px2, player.y, player.w, player.h);
    }

    drawPickupAnimations(gameCtx, camera.x);

    if (currentStage === 2 && canReadNote() && chestWorld) {
      var cxn = chestWorld.x - camera.x + chestWorld.w / 2;
      gameCtx.fillStyle = LEVEL_TEXT_COLOR;
      gameCtx.font = '14px system-ui, "Microsoft YaHei", sans-serif';
      gameCtx.textAlign = 'center';
      gameCtx.textBaseline = 'bottom';
      gameCtx.fillText(CHEST_HINT_TEXT, cxn, chestWorld.y - 6);
    } else if (currentStage === 1 && canOpenChest() && chestWorld) {
      var cx2 = chestWorld.x - camera.x + chestWorld.w / 2;
      gameCtx.fillStyle = LEVEL_TEXT_COLOR;
      gameCtx.font = '14px system-ui, "Microsoft YaHei", sans-serif';
      gameCtx.textAlign = 'center';
      gameCtx.textBaseline = 'bottom';
      gameCtx.fillText(CHEST_HINT_TEXT, cx2, chestWorld.y - 6);
    }

    if (currentMessage) {
      gameCtx.fillStyle = LEVEL_TEXT_COLOR;
      gameCtx.font = '20px system-ui, "Microsoft YaHei", sans-serif';
      gameCtx.textAlign = 'center';
      gameCtx.textBaseline = 'middle';
      gameCtx.fillText(currentMessage, CANVAS_W / 2, 80);
    }

    gameCtx.restore();

    if (dialogueState.active && dialogueState.lines.length > 0) drawDialogueScene();

    if (isStage2Level6() && stage6State.phase === 'fading') {
      var fadeAlpha = Math.min(1, stage6State.fadeTimer / 0.5);
      gameCtx.fillStyle = 'rgba(0, 0, 0, ' + fadeAlpha + ')';
      gameCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
    if (SHOW_DEBUG_INFO) drawDebugInfo();
  }

  function drawDialogueScene() {
    if (!dialogueState.active || dialogueState.lines.length === 0) return;
    if (dialogueState.index >= dialogueState.lines.length) return;

    var line = dialogueState.lines[dialogueState.index];
    var speaker = line.speaker || '';
    var isRecording = line.isRecording === true;
    var isNarration = line.isNarration === true;

    var isPlayer1Speaking = (speaker === '角色1号');
    var isPlayer2Speaking = (speaker === '角色2号');
    var isPlayer0Speaking = (speaker === '角色0号');

    var portraitY = CANVAS_H - PORTRAIT_H;
    var p1X = PORTRAIT_MARGIN;
    var p2X = CANVAS_W - PORTRAIT_MARGIN - PORTRAIT_W;

    if (!isNarration) {
      if (isPlayer0Speaking) drawPortrait(p1X, portraitY, '角色0号', '#b39ddb', 1.0);
      else if (isPlayer1Speaking) drawPortrait(p1X, portraitY, '角色1号', '#ff8c42', 1.0);
      else if (isPlayer2Speaking) drawChar2Portrait(p2X, portraitY, getPlayerName(), 1.0);
      else drawPortrait(p1X, portraitY, speaker || '角色1号', '#888888', 1.0);
    }

    var hasOptions = !!(line.options && line.options.length > 0);

    if (hasOptions) {
      dialogueState.optionRects = [];
      var options = line.options;
      var totalH = options.length * OPTION_H + (options.length - 1) * OPTION_GAP;
      var dialogTopY = CANVAS_H - DIALOG_H;
      var startY = dialogTopY - OPTION_BOTTOM_MARGIN - totalH;
      var optX = (CANVAS_W - OPTION_W) / 2;
      gameCtx.font = '16px system-ui, "Microsoft YaHei", sans-serif';
      for (var oj = 0; oj < options.length; oj++) {
        var oy = startY + oj * (OPTION_H + OPTION_GAP);
        var isHovered = (hoveredOption === oj);

        var optGrad;
        if (isHovered) {
          optGrad = gameCtx.createLinearGradient(0, oy + OPTION_H, 0, oy);
          optGrad.addColorStop(0, UI_GRAD_BOTTOM_HOVER);
          optGrad.addColorStop(1, UI_GRAD_TOP_HOVER);
        } else {
          optGrad = gameCtx.createLinearGradient(0, oy + OPTION_H, 0, oy);
          optGrad.addColorStop(0, UI_GRAD_BOTTOM);
          optGrad.addColorStop(1, UI_GRAD_TOP);
        }
        gameCtx.fillStyle = optGrad;
        drawRoundRect(gameCtx, optX, oy, OPTION_W, OPTION_H, 6);
        gameCtx.fill();
        gameCtx.strokeStyle = UI_STROKE_COLOR;
        gameCtx.lineWidth = 2;
        drawRoundRect(gameCtx, optX, oy, OPTION_W, OPTION_H, 6);
        gameCtx.stroke();

        gameCtx.fillStyle = UI_TEXT_COLOR;
        gameCtx.textAlign = 'center';
        gameCtx.textBaseline = 'middle';
        gameCtx.fillText(options[oj], optX + OPTION_W / 2, oy + OPTION_H / 2);
        dialogueState.optionRects.push({ x: optX, y: oy, w: OPTION_W, h: OPTION_H, text: options[oj] });
      }
    } else {
      dialogueState.optionRects = [];
    }

    var dialogW = Math.round(CANVAS_W * DIALOG_RATIO);
    var dialogX = isPlayer2Speaking ? 0 : (CANVAS_W - dialogW);
    var dialogY = CANVAS_H - DIALOG_H;

    var dialogGrad = gameCtx.createLinearGradient(0, dialogY + DIALOG_H, 0, dialogY);
    dialogGrad.addColorStop(0, UI_GRAD_BOTTOM);
    dialogGrad.addColorStop(1, UI_GRAD_TOP);
    gameCtx.fillStyle = dialogGrad;
    drawRoundRect(gameCtx, dialogX, dialogY, dialogW, DIALOG_H, 8);
    gameCtx.fill();
    gameCtx.strokeStyle = UI_STROKE_COLOR;
    gameCtx.lineWidth = 2;
    drawRoundRect(gameCtx, dialogX, dialogY, dialogW, DIALOG_H, 8);
    gameCtx.stroke();

    var labelH = 28;
    var labelText = (speaker === '角色2号') ? getPlayerName() : speaker;
    gameCtx.font = '16px system-ui, "Microsoft YaHei", sans-serif';
    var labelTextW = gameCtx.measureText(labelText).width;
    var labelPadX = 14;
    var labelW = Math.max(80, Math.ceil(labelTextW + labelPadX * 2));
    var labelX = dialogX;
    var labelY = dialogY - labelH;

    var labelGrad = gameCtx.createLinearGradient(0, labelY + labelH, 0, labelY);
    labelGrad.addColorStop(0, UI_GRAD_BOTTOM);
    labelGrad.addColorStop(1, UI_GRAD_TOP);
    gameCtx.fillStyle = labelGrad;
    drawRoundRect(gameCtx, labelX, labelY, labelW, labelH, 6);
    gameCtx.fill();
    gameCtx.strokeStyle = UI_STROKE_COLOR;
    gameCtx.lineWidth = 2;
    drawRoundRect(gameCtx, labelX, labelY, labelW, labelH, 6);
    gameCtx.stroke();

    gameCtx.fillStyle = UI_TEXT_COLOR;
    gameCtx.font = '16px system-ui, "Microsoft YaHei", sans-serif';
    gameCtx.textAlign = 'center';
    gameCtx.textBaseline = 'middle';
    gameCtx.fillText(labelText, labelX + labelW / 2, labelY + labelH / 2);

    var textPadLeft = 24, textPadTop = 20;
    var textX = dialogX + textPadLeft;
    var textY = dialogY + textPadTop;
    var maxW = dialogW - textPadLeft - 24;

    var displayText = line.text || '';
    if (isRecording && displayText.length >= 2 && displayText.charAt(0) === '*' && displayText.charAt(displayText.length - 1) === '*') {
      displayText = displayText.slice(1, -1);
    }

    if (isNarration) {
      gameCtx.fillStyle = NARRATION_COLOR;
      gameCtx.font = '20px system-ui, "Microsoft YaHei", sans-serif';
      gameCtx.textAlign = 'center';
      gameCtx.textBaseline = 'middle';
      wrapTextCentered(gameCtx, displayText, dialogX + dialogW / 2, dialogY + DIALOG_H / 2, maxW, 30);
    } else if (isRecording) {
      gameCtx.fillStyle = RECORDING_COLOR;
      gameCtx.font = 'italic 20px system-ui, "Microsoft YaHei", sans-serif';
      gameCtx.textAlign = 'left';
      gameCtx.textBaseline = 'top';
      wrapText(gameCtx, displayText, textX, textY, maxW, 30);
    } else {
      gameCtx.fillStyle = UI_TEXT_COLOR;
      gameCtx.font = '20px system-ui, "Microsoft YaHei", sans-serif';
      gameCtx.textAlign = 'left';
      gameCtx.textBaseline = 'top';
      wrapText(gameCtx, displayText, textX, textY, maxW, 30);
    }

    if ((line.triggerLastWords || line.triggerInput) && !dialogueState.lastWordsModalOpened) {
      dialogueState.lastWordsModalOpened = true;
      openLastWordsModal();
    }

    var showHint = !hasOptions && !line.triggerLastWords && !line.triggerInput;
    if (showHint) {
      gameCtx.fillStyle = UI_HINT_COLOR;
      gameCtx.font = '12px system-ui, "Microsoft YaHei", sans-serif';
      gameCtx.textAlign = 'right';
      gameCtx.textBaseline = 'bottom';
      gameCtx.fillText('按 ↓ 继续', dialogX + dialogW - 16, dialogY + DIALOG_H - 10);
    }
  }

  function drawRoundRect(ctx, x, y, w, h, r) {
    if (w <= 0 || h <= 0) return;
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxW, lineHeight) {
    var line = '';
    var ly = y;
    for (var i = 0; i < text.length; i++) {
      var test = line + text[i];
      if (ctx.measureText(test).width > maxW && line.length > 0) {
        ctx.fillText(line, x, ly);
        line = text[i];
        ly += lineHeight;
      } else {
        line = test;
      }
    }
    if (line.length > 0) ctx.fillText(line, x, ly);
  }

  function wrapTextCentered(ctx, text, centerX, centerY, maxW, lineHeight) {
    if (!text) return;
    var lines = [];
    var line = '';
    for (var i = 0; i < text.length; i++) {
      var test = line + text[i];
      if (ctx.measureText(test).width > maxW && line.length > 0) {
        lines.push(line);
        line = text[i];
      } else {
        line = test;
      }
    }
    if (line.length > 0) lines.push(line);
    var totalH = lines.length * lineHeight;
    var startY = centerY - totalH / 2 + lineHeight / 2;
    for (var j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], centerX, startY + j * lineHeight);
    }
  }

  function drawDebugInfo() {
    if (!gameCtx) return;
    gameCtx.fillStyle = LEVEL_TEXT_COLOR;
    gameCtx.font = '12px Consolas, Menlo, monospace';
    gameCtx.textAlign = 'left';
    gameCtx.textBaseline = 'top';
    var lines = [];
    lines.push('FPS: ' + fps);
    lines.push('gameTime: ' + Math.round(gameTime) + ' ms');
    lines.push('当前阶段: ' + currentStage);
    if (currentStage === 3) {
      lines.push('阶段三状态: ' + stage3State.state);
      lines.push('角色0号 X=' + Math.round(stage3State.player0.x));
      lines.push('角色2号 X=' + Math.round(stage3State.player2.x) + (stage3State.player2.visible !== false ? '（可见）' : '（已消失）'));
      lines.push('角色1号 X=' + Math.round(stage3State.player1.x));
      lines.push('前进键: ' + (keys.forward ? '按下' : '未按'));
    } else if (levelData) {
      lines.push('当前关卡编号: ' + currentLevelNum + '/6');
      lines.push('角色世界坐标: X=' + Math.round(player.x) + ' Y=' + Math.round(player.y));
      lines.push('镜头坐标 cameraX=' + Math.round(camera.x));
      if (currentStage === 2 && currentLevelNum === 6) {
        lines.push('对话是否进行中: ' + (dialogueState.active ? '是' : '否'));
        lines.push('第6关演出阶段: ' + stage6State.phase);
      }
    }
    var y = 10;
    for (var n = 0; n < lines.length; n++) { gameCtx.fillText(lines[n], 10, y); y += 16; }
  }

  function updateFps(dt) {
    frameCount++;
    fpsElapsed += dt;
    if (fpsElapsed >= 1) {
      fps = Math.round(frameCount / fpsElapsed);
      frameCount = 0; fpsElapsed = 0;
    }
  }

  function gameLoop(now) {
    var dt = (now - lastTime) / 1000;
    lastTime = now;
    if (dt > 0.1) dt = 0.1;
    if (dt < 0) dt = 0;
    var stage1Running = (currentStage === 1 && currentPhase === 1 && !stage1Completed);
    var stage2Running = (currentStage === 2 && !stage2Completed);
    var stage3Running = (currentStage === 3 && !stage3Completed);
    if (stage1Running || stage2Running || stage3Running) {
      gameTime += dt * 1000;
      update(dt);
    }
    updateFps(dt);
    render();
    window.requestAnimationFrame(gameLoop);
  }

  function bindKeyboardEvents() {
    window.addEventListener('keydown', function (e) {
      if (isTypingTarget(e.target)) return;
      var k = e.key;
      if (isLastWordsModalOpen()) { e.preventDefault(); return; }
      if (dialogueState.active) {
        if (k === 'ArrowDown') { if (!e.repeat) advanceDialogue(); }
        e.preventDefault();
        return;
      }
      if (isNoteModalOpen()) {
        if (k === 'ArrowDown' || k === 'Escape') { if (!e.repeat) closeNoteModal(); }
        e.preventDefault();
        return;
      }
      if (currentStage === 3) {
        if (isForwardKey(k, e)) keys.forward = true;
        else if (k === 'ArrowDown') { if (!e.repeat) tryTriggerStage3Chest(); }
        e.preventDefault();
        return;
      }
      if (k === 'ArrowLeft') { keys.left = true; e.preventDefault(); }
      else if (k === 'ArrowRight') { keys.right = true; e.preventDefault(); }
      else if (k === 'ArrowUp' || k === ' ' || k === 'Spacebar' || e.code === 'Space') {
        keys.jump = true; e.preventDefault();
      } else if (k === 'ArrowDown') {
        if (!e.repeat) handleDownKey();
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', function (e) {
      if (isTypingTarget(e.target)) return;
      var k = e.key;
      if (isForwardKey(k, e)) keys.forward = false;
      if (currentStage === 3) { e.preventDefault(); return; }
      if (k === 'ArrowLeft') { keys.left = false; e.preventDefault(); }
      else if (k === 'ArrowRight') { keys.right = false; e.preventDefault(); }
      else if (k === 'ArrowUp' || k === ' ' || k === 'Spacebar' || e.code === 'Space') {
        keys.jump = false; e.preventDefault();
      } else if (k === 'ArrowDown') { e.preventDefault(); }
    });
    window.addEventListener('blur', function () {
      keys.left = false; keys.right = false; keys.jump = false; keys.forward = false;
    });
    if (gameCanvas) {
      gameCanvas.addEventListener('click', function (e) {
        if (!dialogueState.active) return;
        if (!dialogueState.optionRects || dialogueState.optionRects.length === 0) return;
        var rect = gameCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var scaleX = CANVAS_W / rect.width;
        var scaleY = CANVAS_H / rect.height;
        var mx = (e.clientX - rect.left) * scaleX;
        var my = (e.clientY - rect.top) * scaleY;
        for (var i = 0; i < dialogueState.optionRects.length; i++) {
          var r = dialogueState.optionRects[i];
          if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
            handleDialogueOption(r.text);
            return;
          }
        }
      });
      gameCanvas.addEventListener('mousemove', function (e) {
        if (!dialogueState.active || !dialogueState.optionRects || dialogueState.optionRects.length === 0) {
          hoveredOption = -1;
          return;
        }
        var rect = gameCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var scaleX = CANVAS_W / rect.width;
        var scaleY = CANVAS_H / rect.height;
        var mx = (e.clientX - rect.left) * scaleX;
        var my = (e.clientY - rect.top) * scaleY;
        hoveredOption = -1;
        for (var i = 0; i < dialogueState.optionRects.length; i++) {
          var r = dialogueState.optionRects[i];
          if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
            hoveredOption = i;
            break;
          }
        }
      });
      gameCanvas.addEventListener('mouseleave', function () { hoveredOption = -1; });
    }
  }

  function bindEventListeners() {
    if (startGameBtn) {
      startGameBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playGameBgm();
        try { showCharacterSelect(); } catch (err) { console.error('显示角色选择界面失败：', err); }
      });
    } else {
      console.error('未找到元素 #startGameBtn，无法绑定开始游戏事件');
    }
    if (char0Btn) char0Btn.addEventListener('click', function () { handleCharClick(0); });
    if (char1Btn) char1Btn.addEventListener('click', function () { handleCharClick(1); });
    if (char2Btn) char2Btn.addEventListener('click', function () { handleCharClick(2); });
    if (enterGameBtn) enterGameBtn.addEventListener('click', handleEnterGame);

    if (keyConfirmBtn) keyConfirmBtn.addEventListener('click', handleKeyConfirm);
    if (keyCloseBtn) keyCloseBtn.addEventListener('click', closeKeyModal);
    if (keyBConfirmBtn) keyBConfirmBtn.addEventListener('click', handleKeyBConfirm);
    if (keyBCloseBtn) keyBCloseBtn.addEventListener('click', closeKeyBModal);

    setupFillLine(keyAFillLine, handleKeyConfirm, closeKeyModal);
    setupFillLine(keyBFillLine, handleKeyBConfirm, closeKeyBModal);

    if (noteCloseBtn) noteCloseBtn.addEventListener('click', closeNoteModal);
    if (noteReviewModalClose) noteReviewModalClose.addEventListener('click', closeNoteReviewModal);
    if (noteReviewModal) {
      var nrOverlay = noteReviewModal.querySelector('.key-modal-overlay');
      if (nrOverlay) nrOverlay.addEventListener('click', closeNoteReviewModal);
    }
    if (confirmLastWordsBtn) confirmLastWordsBtn.addEventListener('click', handleLastWordsConfirm);

    if (moreInfoToggle && moreInfoBody) {
      moreInfoToggle.addEventListener('click', function () {
        var isExpanded = moreInfoToggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          moreInfoToggle.setAttribute('aria-expanded', 'false');
          moreInfoBody.hidden = true;
        } else {
          moreInfoToggle.setAttribute('aria-expanded', 'true');
          moreInfoBody.hidden = false;
        }
      });
    }

    function handlePostComment() {
      if (!commentInput || !playerComments) return;
      var text = commentInput.value.trim();
      if (text === '') return;
      var item = document.createElement('div');
      item.className = 'comment-item';
      var userEl = document.createElement('span');
      userEl.className = 'comment-user'; userEl.textContent = '我';
      var textEl = document.createElement('span');
      textEl.className = 'comment-text'; textEl.textContent = text;
      item.appendChild(userEl); item.appendChild(textEl);
      playerComments.appendChild(item);
      commentInput.value = '';
      commentInput.focus();
    }
    if (postCommentBtn) postCommentBtn.addEventListener('click', handlePostComment);
    if (commentInput) {
      commentInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handlePostComment();
      });
    }

    if (testKeyABtn) testKeyABtn.addEventListener('click', function () { openKeyModal(true); });
    if (testKeyBBtn) testKeyBBtn.addEventListener('click', function () { openKeyBModal(true); });
    if (testPhase1DoneBtn) testPhase1DoneBtn.addEventListener('click', function () {
      window.GameState.update({ stage1Completed: true });
      window.location.reload();
    });
    if (testResetStage1Btn) testResetStage1Btn.addEventListener('click', function () {
      window.GameState.update({ stage1Completed: false, currentLevel: 1 });
      window.location.reload();
    });
    if (testResetKeyABtn) testResetKeyABtn.addEventListener('click', function () {
      window.GameState.update({ keysObtained: { a: false, b: false } });
      refreshStateCache(); refreshCharacterLocks(); updateCoverButtonText();
    });
    if (testResetPlayerBtn) testResetPlayerBtn.addEventListener('click', function () { resetPlayerToStart(); });
    if (testResetCurrentLevelBtn) testResetCurrentLevelBtn.addEventListener('click', function () {
      if (currentStage === 3) loadStage3();
      else if (currentStage === 2) loadStage2Level(currentLevelNum);
      else loadLevel(currentLevelNum);
    });
    if (testClearStageBtn) testClearStageBtn.addEventListener('click', function () {
      if (currentStage === 3) { completeStage3(); return; }
      advanceLevel();
    });
    if (testLastLevelBtn) testLastLevelBtn.addEventListener('click', function () {
      if (currentStage === 3) return;
      if (currentStage === 2) loadStage2Level(6);
      else { window.GameState.update({ currentLevel: 6, stage1Completed: false }); window.location.reload(); }
    });
    if (testResetStage2Btn) testResetStage2Btn.addEventListener('click', function () {
      window.GameState.update({ stage2Completed: false });
      window.location.reload();
    });
    if (testStage3Btn) testStage3Btn.addEventListener('click', function () {
      window.GameState.update({
        stage1Completed: true, stage2Completed: true,
        keysObtained: { a: true, b: true }, stage3Completed: false
      });
      loadStage3();
      refreshStateCache(); refreshCharacterLocks(); updateCoverButtonText();
    });
    if (testResetStage3Btn) testResetStage3Btn.addEventListener('click', function () {
      window.GameState.update({ stage3Completed: false });
      window.location.reload();
    });
    if (testShowCoverBtn) testShowCoverBtn.addEventListener('click', function () { showCover(); });
    if (testAudioBtn) testAudioBtn.addEventListener('click', function () {
      var names = ['message', 'click', 'level-complete', 'chest'];
      var i = 0;
      function next() {
        if (i >= names.length) return;
        playSound(names[i]); i++;
        setTimeout(next, 500);
      }
      next();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        pauseGameBgm();
      } else {
        if (inLevel) playGameBgm();
      }
    });
  }

  function ensureTestButtons() {
    var area = document.querySelector('.sidebar-test-area');
    if (!area) return;
    if (!document.getElementById('testFreezeMovingBtn')) {
      var btn = document.createElement('button');
      btn.id = 'testFreezeMovingBtn';
      btn.className = 'test-btn';
      btn.type = 'button';
      btn.textContent = '【测试】冻结移动平台';
      area.appendChild(btn);
      btn.addEventListener('click', function () {
        movingFrozen = !movingFrozen;
        btn.textContent = movingFrozen ? '【测试】恢复移动平台' : '【测试】冻结移动平台';
      });
    }
    if (!document.getElementById('testShowTrapsBtn')) {
      var btn2 = document.createElement('button');
      btn2.id = 'testShowTrapsBtn';
      btn2.className = 'test-btn';
      btn2.type = 'button';
      btn2.textContent = '【测试】显示所有陷阱';
      area.appendChild(btn2);
      btn2.addEventListener('click', function () {
        showAllTraps = !showAllTraps;
        btn2.textContent = showAllTraps ? '【测试】隐藏所有陷阱' : '【测试】显示所有陷阱';
      });
    }
    if (!document.getElementById('testResetNotesBtn')) {
      var btn3 = document.createElement('button');
      btn3.id = 'testResetNotesBtn';
      btn3.className = 'test-btn';
      btn3.type = 'button';
      btn3.textContent = '【测试】清空已读日记';
      area.appendChild(btn3);
      btn3.addEventListener('click', function () {
        try { localStorage.removeItem(NOTE_READ_KEY); } catch (e) {}
        renderNoteReview();
      });
    }
  }

  function configureLastWordsModal() {
    if (!lastWordsModal) return;
    var titleEl = lastWordsModal.querySelector('.last-words-title');
    if (titleEl) titleEl.textContent = '能告诉我你的名字吗？';
    var textEl = lastWordsModal.querySelector('.last-words-text');
    if (textEl) textEl.textContent = '';
    if (lastWordsInput) lastWordsInput.placeholder = '请输入你的名字';
    if (confirmLastWordsBtn) confirmLastWordsBtn.textContent = '确认输入';
  }

  function init() {
    initDomRefs();
    ensureNoteContentIsDiv();
    replaceGameTitle();
    configureLastWordsModal();

    initGameBgm();

    if (window.AudioManager && typeof window.AudioManager.init === 'function') {
      window.AudioManager.init();
    }

    refreshStateCache();
    renderDeveloperCard();
    ensureTestButtons();

    _char0LastShown = stage2Completed || keyBGot || stage3Completed;

    if (stage2Completed || stage3Completed) renderNoteReview();

    setActiveView('cover');
    updateCoverButtonText();

    if (coverView) {
      if (stage3Completed) {
        coverView.classList.add('after-clear');
      } else {
        coverView.classList.remove('after-clear');
      }
    }

    bindEventListeners();
    bindKeyboardEvents();

    if (gameCanvas && gameCtx) {
      lastTime = performance.now();
      window.requestAnimationFrame(gameLoop);
    }

    Promise.all([
      preloadAllSprites(),
      preloadTiles()
    ]).then(function () {
      /* 素材加载完成 */
    }).catch(function (err) {
      console.warn('[game] 预加载部分失败：', err);
    });
  }

  function start() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  start();

})();