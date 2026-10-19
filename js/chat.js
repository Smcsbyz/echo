/* js/chat.js */
/* ============================================================
   文件路径：js/chat.js
   说明：微信式私聊页逻辑（基于节点的对话系统）
         本次修正：
           1. 新增 checkAndUnlockTrueEnding 公共函数，统一处理
              「坏结局 + 好结局 + 拒绝结局」全部触发后解锁彩蛋联系人
           2. handleIfButton、closeImageModal、init 统一调用该函数
           3. 修复刷新页面后可能出现的死档问题
           4. 保留二次好友申请机制
   依赖：js/state.js（提供 window.GameState、window.AudioManager）
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     常量
     ============================================================ */
  var AUDIO_FLAG_KEY = 'audioEnabled';
  var EMAIL_READ_KEY = 'emailRead';

  var CORRECT_NAME = '许阳';

  var ROBOT_NAME = '如果那片云';
  var SPEAKER_ME = '我';

  var ENDING_OPTION_BAD = '告诉弟弟\u201c真相\u201d';
  var ENDING_OPTION_GOOD = '告诉弟弟真相';

  var MAIN_CHAT_NAME = '如果那片云';

  var EMAIL_CONTACT_ID = 'email';
  var EMAIL_CONTACT_NAME = 'WW邮箱提醒';

  var AVATAR_BASE = 'assets/avatars/';
  var AVATAR_EMAIL = AVATAR_BASE + 'avatar43.png';
  var AVATAR_ROBOT = AVATAR_BASE + 'avatar45.png';
  var AVATAR_ME = AVATAR_BASE + 'avatar46.png';

  var APPEAR_INTERVAL = 2000;
  var TYPING_DURATION = 2500;

  var ENDING_LINE_INTERVAL = 2200;
  var ENDING_ANIM_DURATION = 2400;
  var ENDING_BTN_DELAY = 3000;

  var GOOD_ENDING_FADE_MS = 1200;

  var MYSTERY_CONTACT_ID = 'mystery';
  var MYSTERY_CONTACT_NAME = '？？？';
  var MYSTERY_AVATAR = 'assets/avatars/avatar41.png';
  var MYSTERY_PREVIEW = '恭喜你，达成了好结局';

  var MYSTERY_TYPING_DURATION = 1500;
  var MYSTERY_LINE_INTERVAL = 2500;

  var OPTION_CLICK_LOCK_MS = 1000;

  var REASON_REPLY_DELAY_MS = 2500;
  var TRANSITION_START_DELAY_MS = 2500;
  var FINAL_OVERLAY_DELAY_MS = 2500;

  /* ============================================================
     真结局文本
     ============================================================ */
  var TRUE_ENDING_PRE_DIALOGUE = [
    '恭喜你，达成了好结局',
    '郑怡君得以安息，许云也彻底走出了过往的阴霾',
    '这场裹挟恩怨的\u201c杀人游戏\u201d，从头到尾都只是精心布置的恶作剧',
    '所有风波尘埃落定，看似一切都只是虚惊一场',
    '可你的心底，依旧残留着无数未解的疑点',
    '新闻报道中，接连深夜昏迷的年轻人，究竟缘由何在？',
    '坏结局里，许云身上发生了什么？',
    '手机上的\u201c八人离奇怪死\u201d事件，幕后真凶究竟是谁？',
    '你的答案会是什么呢？整场事件的始作俑者，到底是谁？'
  ];

  var TRUE_ENDING_REASON_OPTIONS = [
    {
      text: '郑怡君或许说了谎。',
      replies: [
        '她在纸条中否认一切，但一个已死之人说的话，能信吗？又有几分可信？郑怡君身负绝症、时日无多，为爱人复仇的执念深入骨髓，毫无后顾之忧。',
        '你搜集到的所有线索、所有证据，都尽数指向她一人。而她最后的否认，或许从来都不是坦白，只是这场复仇计划里，最后一环的伪装。'
      ]
    },
    {
      text: '许阳或许说了谎。',
      replies: [
        '别忘了，许阳生前曾公开坦言，渴望一场\u201c赛博飞升\u201d。',
        '她正值芳华，却遭遇横祸骤然离世。极致的不甘跨越生死，借由网络附着重生，依托代码留存意识，以自己的方式，向所有生前亏欠、伤害过她的人展开报复，这未必不是真相。'
      ]
    },
    {
      text: '许云或许说了谎。',
      replies: [
        '发现姐姐骨灰失窃、账号异常更新的第一时间，他没有报警。',
        '他口口声声牵挂姐姐、心存愧疚，可发现诡异的游戏更新后，他从未自行探寻真相，反而大费周章的找到你，引导你，借你之手揭开一切。',
        '坏结局中他的凭空消失，究竟是满心愧疚的逃避，还是行凶之后的隐匿逃逸？答案无人知晓。'
      ]
    },
    {
      text: '赛博幽灵真的存在。',
      replies: [
        '你是否听过\u201c言灵\u201d之说？日积月累的执念与妄念，反复诉说的期许与恨意，或许真的能挣脱虚拟桎梏，化作实体，反向干涉现实世界。',
        '没人能百分百笃定，所谓的\u201c赛博幽灵\u201d纯属无稽之谈。或许，正是众人极致偏执的执念，催生了这个潜藏于网络、无形无影、夺人性命的虚拟幽灵。'
      ]
    }
  ];

  var TRUE_ENDING_FINAL_OPTIONS = [
    { text: '郑怡君', value: 'zheng' },
    { text: '许阳', value: 'xu' },
    { text: '许云', value: 'yun' },
    { text: '赛博幽灵', value: 'ghost' }
  ];

  var TRUE_ENDING_AFTER_REASONS = [
    '真相到底是什么？这场连环怪事，真的存在蓄意作恶的凶手吗？',
    '所有离奇的巧合，究竟是天意无常，还是有人精心布局、刻意引导？',
    '你的答案会是——'
  ];

  var TRUE_ENDING_LINES = [
    '玻璃碎片、碎裂的窗户',
    '以及一个拿着球棒的陌生男孩',
    '看见它们的第一眼，不用多说，你已经看到了那份剧本',
    '\u201c调皮的孩子做了错事，将球打进了旁人的卧房\u201d',
    '你不认识这个孩子，也没见过这扇窗户',
    '但没关系，你已经在心里做出判决',
    '属于你的\u201c真相\u201d',
    '【彩蛋】'
  ];

  var BAD_ENDING_LINES = [
    '后来',
    '许云还是报了警',
    '负责这件事的老警察说',
    '郑怡君的遗体被发现在城中村的小出租屋里',
    '说不清是病死还是自杀',
    '房间狭小逼仄，杂物堆积，四处污浊凌乱',
    '唯独骨灰盒摆放的那一片区域，一尘不染',
    '……',
    '郑怡君那份偏执又疯狂的计划，似乎还是完成了',
    '\u201c她真的在一点点杀死我们\u201d',
    '这是许云给我留下的最后一条信息',
    '当时的选择，真的是对的吗？',
    '如果，我……'
  ];

  var GOOD_ENDING_LINES = [
    '后来',
    '许云找到了那里',
    '城中村的小出租屋',
    '房间狭小逼仄，杂物堆积，四处污浊凌乱',
    '郑怡君就躲在这里，已经没了气息',
    '而她面朝的方向，骨灰盒摆放的那一片区域，一尘不染',
    '……',
    '郑怡君的计划，真的就此落幕了吗？',
    '\u201c我把她，和姐姐合葬在一起了。\u201d',
    '许云说，父母得知这件事后勃然大怒，但他没有理会',
    '\u201c我一直很后悔。那年春节，如果我没有保持沉默，事情会不会就不会走到这一步。\u201d',
    '我沉默了很久',
    '然后，说了她曾经告诉过我的那句话',
    '\u201c该向前走了\u201d'
  ];

  var QUESTION_ENDING_LINES = [
    '后来',
    '你度过了一个没有打游戏的周末',
    '你难得给自己放了个假，舒舒服服睡了一整天',
    '去他大爷的工作，你要休息',
    '那个粉丝没有再找过你',
    '……',
    '过了很久，某个夜晚，你打开手机，发现了一条新闻：',
    '\u201c八人离奇怪死，真相到底为何？\u201d',
    '\u201c标题党！\u201d',
    '你划走了',
    '又是普普通通的一天啊',
    '【好结局？】'
  ];

  /* ============================================================
     基础对话数据（基于节点）
     ============================================================ */
  var BASE_DIALOGUE_NODES = [
    { type: 'npc', text: 'UP主，我是你的粉丝啊！' },
    { type: 'npc', text: '我有一个很有意思的游戏，说不定可以当做你的视频素材' },
    { type: 'options', options: ['什么素材？', '说来听听'] },
    { type: 'npc', text: '是我在群聊里发现的' },
    { type: 'npc', text: '就是这个', link: { url: 'game.html', text: '游戏链接' } },
    { type: 'npc', text: '还有，这是最早发现这款游戏的论坛', link: { url: 'forum.html', text: '论坛链接' } },
    { type: 'npc', text: '这款游戏上一次更新还是两年前，作者整整两年没有任何消息，前几天却突然放出了最终版本' },
    { type: 'npc', text: '游戏改动特别大，玩法类型、操作方式全都变了' },
    { type: 'options', options: ['是很难吗？'] },
    { type: 'npc', text: '难度就是\u201c非常简单\u201d的程度，但评论区好多人都说根本打不通关' },
    { type: 'npc', text: '嘿嘿，也包括我' },
    { type: 'npc', text: '我觉得这里面肯定有点故事，拿来做视频效果肯定不错' },
    { type: 'options', options: ['可能是BUG', '有点意思'] },
    { type: 'npc', text: '试试也不亏呀，UP！' },
    { type: 'npc', text: '期待你的视频！' },
    { type: 'options', options: ['（反正现在也没什么，那就试试看吧）'] }
  ];

  var BASE_QUESTION_NODES = [
    { type: 'npc', text: 'UP，你找到什么了吗？' },
    { type: 'options', options: ['我查到了'] },
    { type: 'input', placeholder: '作者就是', answer: '许阳' },
    { type: 'player', text: '为了隐私，我不会泄露她的名字' },
    { type: 'options', options: ['但是，这款游戏的制作人早已逝去'] },
    { type: 'npc', text: '……' },
    { type: 'npc', text: '原来是这样啊' },
    { type: 'options', options: ['所以，我不打算继续查下去了'] },
    { type: 'npc', text: '？为什么' },
    { type: 'options', options: ['作者离去两年，游戏却突然更新'] },
    { type: 'options', options: ['这件事本身就很反常，而且…… 还牵扯隐私问题'] },
    { type: 'options', options: ['我只是想找视频素材，万一惹上麻烦，得不偿失'] },
    { type: 'npc', text: '可是……' },
    { type: 'options', options: ['谢谢你提供的线索，就到此为止吧'] },
    { type: 'npc', text: '那如果，我恳求、我乞求你继续呢？' },
    { type: 'options', options: ['？'] },
    { type: 'options', options: ['为了一个游戏，不至于吧'] },
    { type: 'npc', text: '对不起，我骗了你' },
    { type: 'options', options: ['你不是我的粉丝？'] },
    { type: 'npc', text: '不是，我是你的粉丝，真的' },
    { type: 'npc', text: '但是，这款游戏，其实根本不是什么\u201c从群聊里发现\u201d的' },
    { type: 'npc', text: '你查到的作者，叫许阳吧。我是她的弟弟，我叫许云' },
    { type: 'npc', text: '我姐姐她，两年前因为一场车祸离开了我们' },
    { type: 'npc', text: '那段时间家里所有人都很难熬。可就在两天前，墓园那边打来电话' },
    { type: 'options', options: ['出什么事了？'] },
    { type: 'npc', text: '他们说，我姐姐的骨灰盒不见了' },
    { type: 'npc', text: '紧接着我就发现，她的账号突然有了操作记录' },
    { type: 'npc', text: '这款我姐姐生前没能做完的游戏，也莫名上架了最终版本' },
    { type: 'npc', text: '所有这些事，刚好都发生在她的忌日当天' },
    { type: 'npc', text: '我实在没办法不去多想' },
    { type: 'options', options: ['这件事应该去找警察', '这件事应该去找道士'] },
    { type: 'npc', text: '我还不想追究，因为我大概知道是谁做的' },
    { type: 'options', options: ['你知道是谁？'] },
    { type: 'npc', text: '我对她有愧' },
    { type: 'npc', text: '求你了，我希望你继续下去，通关游戏' },
    { type: 'npc', text: '事成之后，我会给你一笔丰厚的报酬，求你了' },
    { type: 'options', options: ['好吧', '我考虑一下'] },
    { type: 'options', options: ['你怀疑的人叫什么名字？'] },
    { type: 'npc', text: '郑怡君。' },
    { type: 'npc', text: '我姐姐的，恋人' }
  ];

  /* ============================================================
     头像工具
     ============================================================ */
  function applyAvatarLoading(el) {
    if (!el) return;
    el.classList.add('avatar-loading');
    while (el.firstChild) el.removeChild(el.firstChild);
    el.textContent = '';
    el.style.background = '';
    el.style.backgroundImage = '';
    el.style.color = '';
  }

  function clearAvatarLoading(el) {
    if (!el) return;
    el.classList.remove('avatar-loading');
  }

  function setAvatarColorOnly(el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    el.textContent = '';
    el.classList.add('avatar-loading');
    el.style.background = '';
    el.style.backgroundImage = '';
    el.style.color = '';
  }

  function getRandomContactAvatar(name) {
    name = String(name || '?');
    var pool = [];
    for (var i = 1; i <= 40; i++) pool.push(i);
    for (var j = 47; j <= 50; j++) pool.push(j);
    var hash = 0;
    for (var k = 0; k < name.length; k++) {
      hash = (hash * 31 + name.charCodeAt(k)) % 100000;
    }
    var idx = Math.abs(hash) % pool.length;
    return AVATAR_BASE + 'avatar' + pool[idx] + '.png';
  }

  function getContactAvatarPath(name) {
    for (var i = 0; i < CONTACTS.length; i++) {
      if (CONTACTS[i].name === name && CONTACTS[i].avatar) {
        return CONTACTS[i].avatar;
      }
    }
    return getRandomContactAvatar(name);
  }

  function createMessageAvatar(isMe, speaker) {
    var avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    applyAvatarLoading(avatar);

    var src = null;
    if (isMe) {
      src = AVATAR_ME;
    } else if (speaker === ROBOT_NAME) {
      src = AVATAR_ROBOT;
    } else if (speaker) {
      src = getContactAvatarPath(speaker);
    }

    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
      img.onload = function () {
        clearAvatarLoading(avatar);
      };
      img.onerror = function () {
        img.style.display = 'none';
        setAvatarColorOnly(avatar);
      };
      avatar.appendChild(img);
    } else {
      setAvatarColorOnly(avatar);
    }

    return avatar;
  }

  function initSidebarAvatar() {
    var el = document.querySelector('.sidebar-avatar');
    if (!el) return;

    applyAvatarLoading(el);
    el.style.overflow = 'hidden';
    el.style.padding = '0';

    var img = document.createElement('img');
    img.src = AVATAR_ME;
    img.alt = '';
    img.className = 'sidebar-avatar-img';
    img.onload = function () {
      clearAvatarLoading(el);
    };
    img.onerror = function () {
      img.style.display = 'none';
      setAvatarColorOnly(el);
    };
    el.appendChild(img);
  }

  /* ============================================================
     联系人列表
     ============================================================ */
  var CONTACTS = [
    {
      id: 'yyyy',
      name: ROBOT_NAME,
      avatarColor: '#b39ddb',
      avatar: AVATAR_ROBOT,
      preview: '你查到了什么吗？',
      unread: 0,
      requiresFriendRequest: true,
      isMainChat: true
    },
    {
      id: 'daigan',
      name: '侦探の游戏小窝',
      avatarColor: '#7a8a9a',
      avatar: null,
      preview: '（豆橛子抽你.jpg）',
      unread: 0,
      requiresFriendRequest: false,
      isMainChat: false
    },
    {
      id: 'zhangsan',
      name: 'AAA甲方老大',
      avatarColor: '#7a9a8a',
      avatar: null,
      preview: '明白，有情况随时说',
      unread: 0,
      requiresFriendRequest: false,
      isMainChat: false
    },
    {
      id: 'lisi',
      name: '未来名导演张伟',
      avatarColor: '#9a8a7a',
      avatar: null,
      preview: '没错，这就是蒙太奇的魔力',
      unread: 0,
      requiresFriendRequest: false,
      isMainChat: false
    },
    {
      id: EMAIL_CONTACT_ID,
      name: EMAIL_CONTACT_NAME,
      avatarColor: '#888888',
      avatar: AVATAR_EMAIL,
      preview: '邮箱绑定成功',
      unread: 0,
      requiresFriendRequest: false,
      isMainChat: false,
      isEmailContact: true
    }
  ];

  /* ============================================================
     静态历史消息
     ============================================================ */
  var STATIC_MESSAGES = {
    '侦探の游戏小窝': [
      { speaker: '我', text: '好无聊，求推荐解谜游戏' },
      { speaker: '花生不是华生', text: '解谜大王来了' },
      { speaker: '吧加莎', text: '上次给你推的那部这么快就通关了？' },
      { speaker: '忽而模式命很硬', text: '这么无聊赶紧去更新视频' },
      { speaker: '忽而模式命很硬', text: '（豆橛子抽你.jpg）' },
      { speaker: '我', text: '我也想啊，这不是没素材吗' },
      { speaker: '我', text: 'ε=(´ο｀*)))' }
    ],
    'AAA甲方老大': [
      { speaker: '甲方', text: '视频上线收到了，内容没问题' },
      { speaker: '我', text: '好嘞，链接发你。后续数据我之后同步' },
      { speaker: '甲方', text: '收到' },
      { speaker: '甲方', text: '记得保留视频满 30 天，周期结束结算尾款' },
      { speaker: '我', text: '明白，有情况随时说' }
    ],
    '未来名导演张伟': [
      { speaker: '未来名导演张伟', text: '当当~今日电影知识小科普' },
      { speaker: '未来名导演张伟', text: '你听说过蒙太奇吗？' },
      { speaker: '我', text: '就是把不同的画面拼在一起？' },
      { speaker: '未来名导演张伟', text: '那只是一方面' },
      { speaker: '未来名导演张伟', text: '蒙太奇最有意思的地方，就是观众会依靠自己的联想，把几个原本不相干的画面，串成完整故事' },
      { speaker: '我', text: '也就是说，其实都是人的脑补？' },
      { speaker: '未来名导演张伟', text: '没错，这就是蒙太奇的魔力' }
    ],
    'WW邮箱提醒': [
      { speaker: '系统', text: '邮箱绑定成功' }
    ]
  };

  /* ============================================================
     DOM 引用
     ============================================================ */
  var messageList = document.getElementById('messageList');
  var optionList = document.getElementById('optionList');
  var inputArea = document.getElementById('inputArea');
  var chatInput = document.getElementById('chatInput');
  var sendBtn = document.getElementById('sendBtn');
  var inputError = document.getElementById('inputError');
  var audioBtn = document.getElementById('audioBtn');
  var contactList = document.getElementById('contactList');
  var endingOverlay = document.getElementById('endingOverlay');
  var endingText = document.getElementById('endingText');

  var viewFriendRequest = document.getElementById('viewFriendRequest');
  var viewMainChat = document.getElementById('viewMainChat');
  var viewOtherContact = document.getElementById('viewOtherContact');
  var viewEmpty = document.getElementById('viewEmpty');
  var viewEmail = document.getElementById('viewEmail');

  var friendRequestBtn = document.getElementById('friendRequestBtn');
  var friendRequestDot = document.getElementById('friendRequestDot');
  var acceptFriendBtn = document.getElementById('acceptFriendBtn');
  var rejectFriendBtn = document.getElementById('rejectFriendBtn');

  var otherChatTitle = document.getElementById('otherChatTitle');
  var otherMessageList = document.getElementById('otherMessageList');

  var mainChatTitle = document.getElementById('mainChatTitle');

  var emailSubject = document.getElementById('emailSubject');
  var emailBodyEl = document.querySelector('.email-body');
  var viewLargeImageBtn = document.getElementById('viewLargeImageBtn');

  var imageModal = document.getElementById('imageModal');
  var imageModalOverlay = document.getElementById('imageModalOverlay');
  var imageModalClose = document.getElementById('imageModalClose');

  var musicToggleBtn = document.getElementById('musicToggleBtn');

  /* ============================================================
     注入真结局样式
     ============================================================ */
  (function injectTrueEndingStyles() {
    if (document.getElementById('chat-true-ending-styles')) return;
    var style = document.createElement('style');
    style.id = 'chat-true-ending-styles';
    style.textContent =
      '.ending-line-true { color: #a855f7; font-size: 24px; font-weight: 700; margin-top: 30px; }' +
      '.ending-line-purple { color: #a855f7; }' +
      '.mystery-options-wrap { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-top: 12px; margin-bottom: 6px; padding: 0 4px; box-sizing: border-box; }' +
      '.mystery-options-wrap .option-btn { width: auto; min-width: 200px; max-width: 100%; }' +
      '.email-photo { display: block; max-width: 100%; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15); }' +
      '.friend-request-empty { padding: 32px 20px; text-align: center; color: #888; font-size: 14px; }';
    document.head.appendChild(style);
  })();

  /* ============================================================
     音效
     ============================================================ */
  function playSound(name) {
    if (window.AudioManager && typeof window.AudioManager.play === 'function') {
      try { window.AudioManager.play(name); } catch (e) {}
    }
  }

  function playMessageSoundIfHidden() {
    if (document.hidden) {
      playSound('message');
    }
  }

  function logStateUpdate() {
    var state = window.GameState.get();
    console.log('状态更新:', {
      endingChoice: state.endingChoice,
      badEndingSeen: state.badEndingSeen,
      friendRequestAccepted: state.friendRequestAccepted
    });
  }

  /* ============================================================
     结局主题切换
     ============================================================ */
  function applyEndingTheme(theme) {
    var overlay = document.getElementById('endingOverlay');
    if (!overlay) return;
    overlay.classList.remove('theme-bad', 'theme-good', 'theme-rejected', 'theme-true');
    if (theme) {
      overlay.classList.add('theme-' + theme);
    }
  }

  /* ============================================================
     结局音乐
     ============================================================ */
  var bgMusic = null;
  var bgMusicFadeTimer = null;

  function stopEndingMusic() {
    if (bgMusicFadeTimer) {
      clearInterval(bgMusicFadeTimer);
      bgMusicFadeTimer = null;
    }
    if (bgMusic) {
      try {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      } catch (e) {}
      bgMusic = null;
    }
    if (musicToggleBtn) {
      musicToggleBtn.hidden = true;
      musicToggleBtn.textContent = '🔇';
    }
  }

  function startEndingMusic() {
    if (bgMusic) {
      updateMusicBtnIcon();
      return;
    }

    if (window.AudioManager && typeof window.AudioManager.isEnabled === 'function') {
      if (!window.AudioManager.isEnabled()) {
        if (musicToggleBtn) musicToggleBtn.hidden = false;
        updateMusicBtnIcon();
        return;
      }
    }

    try {
      var audio = new Audio('assets/audio/ending.mp3');
      audio.volume = 0;
      audio.loop = true;
      audio.addEventListener('error', function () {});

      var p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () {});
      }

      bgMusic = audio;

      bgMusicFadeTimer = setInterval(function () {
        if (!bgMusic) {
          if (bgMusicFadeTimer) {
            clearInterval(bgMusicFadeTimer);
            bgMusicFadeTimer = null;
          }
          return;
        }
        var v = bgMusic.volume + 0.017;
        if (v >= 0.5) v = 0.5;
        try { bgMusic.volume = v; } catch (e) {}
        if (v >= 0.5) {
          clearInterval(bgMusicFadeTimer);
          bgMusicFadeTimer = null;
        }
      }, 100);
    } catch (e) {
      bgMusic = null;
    }

    if (musicToggleBtn) musicToggleBtn.hidden = false;
    updateMusicBtnIcon();
  }

  function toggleEndingMusic() {
    if (bgMusic) {
      if (bgMusic.paused) {
        try { bgMusic.play(); } catch (e) {}
      } else {
        try { bgMusic.pause(); } catch (e) {}
      }
      updateMusicBtnIcon();
    } else {
      startEndingMusic();
    }
  }

  function updateMusicBtnIcon() {
    if (!musicToggleBtn) return;
    if (bgMusic && !bgMusic.paused) {
      musicToggleBtn.textContent = '🔊';
    } else {
      musicToggleBtn.textContent = '🔇';
    }
  }

  /* ============================================================
     本地流程状态
     ============================================================ */
  var _renderToken = 0;
  var _endingTextToken = 0;
  var _endingTimers = [];
  var _optionClickLock = false;

  var mysteryChatToken = 0;
  var trueEndingContactShownThisSession = false;

  function clearEndingTimers() {
    for (var i = 0; i < _endingTimers.length; i++) {
      clearTimeout(_endingTimers[i]);
    }
    _endingTimers = [];
  }

  var SS_KEY_STAGE2_OPTIONS_SHOWN = 'stage2OptionsShown';
  var SS_KEY_STAGE3_OPTIONS_SHOWN = 'stage3OptionsShown';

  function writeStage2OptionsShown() {
    try { sessionStorage.setItem(SS_KEY_STAGE2_OPTIONS_SHOWN, 'true'); } catch (e) {}
  }
  function writeStage3OptionsShown() {
    try { sessionStorage.setItem(SS_KEY_STAGE3_OPTIONS_SHOWN, 'true'); } catch (e) {}
  }

  function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function normalizeChineseName(text) {
    if (!text) return '';
    var map = { '許': '许', '陽': '阳' };
    var result = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      result += Object.prototype.hasOwnProperty.call(map, ch) ? map[ch] : ch;
    }
    return result;
  }

  function scrollToBottom() {
    if (!messageList) return;
    if (messageList.offsetParent === null) return;
    window.requestAnimationFrame(function () {
      messageList.scrollTop = messageList.scrollHeight;
    });
  }

  function scrollOtherToBottom() {
    if (!otherMessageList) return;
    if (otherMessageList.offsetParent === null) return;
    window.requestAnimationFrame(function () {
      otherMessageList.scrollTop = otherMessageList.scrollHeight;
    });
  }

  function findContactByName(name) {
    for (var i = 0; i < CONTACTS.length; i++) {
      if (CONTACTS[i].name === name) return CONTACTS[i];
    }
    return null;
  }

  function isEmailRead() {
    try {
      return localStorage.getItem(EMAIL_READ_KEY) === 'true';
    } catch (e) { return false; }
  }

  function markEmailRead() {
    try { localStorage.setItem(EMAIL_READ_KEY, 'true'); } catch (e) {}
  }

  function getStateNum(key, defaultValue) {
    var state = window.GameState.get();
    var v = state[key];
    if (typeof v === 'number' && isFinite(v) && v >= 0) return v;
    return defaultValue || 0;
  }

  function getStateObj(key) {
    var state = window.GameState.get();
    var v = state[key];
    if (v && typeof v === 'object' && !Array.isArray(v)) return v;
    return {};
  }

  function syncFromState() {
    chatProgress = getStateNum('chatProgress', 0);
    questionProgress = getStateNum('questionProgress', 0);
    chatSelectedOptions = getStateObj('chatSelectedOptions');
    questionSelectedOptions = getStateObj('questionSelectedOptions');
    rebuildQuestionDialogue();
  }

  function shouldShowMysteryContact() {
    return window.GameState.get().trueEndingContactUnlocked === true;
  }

  function shouldShowMysteryDot() {
    var state = window.GameState.get();
    if (state.trueEndingContactUnlocked !== true) return false;
    return state.trueEndingTriggered !== true;
  }

  function showTrueEndingContact() {
    renderContactList();
    if (!trueEndingContactShownThisSession) {
      trueEndingContactShownThisSession = true;
      playSound('message');
    }
  }

  /* ============================================================
     彩蛋解锁统一检查
     ============================================================ */
  function checkAndUnlockTrueEnding() {
    var state = window.GameState.get();
    if (state.badEndingSeen === true &&
        state.goodEndingSeen === true &&
        state.rejectedEndingSeen === true &&
        state.trueEndingTriggered !== true &&
        state.trueEndingContactUnlocked !== true) {
      window.GameState.update({ trueEndingContactUnlocked: true });
      showTrueEndingContact();
    }
  }

  /* ============================================================
     好友申请状态判定
     ============================================================ */
  function isInitialFriendRequestActive() {
    var state = window.GameState.get();
    return state.friendRequestAccepted !== true &&
           state.rejectedFriendRequest !== true;
  }

  function isSecondaryFriendRequestActive() {
    var state = window.GameState.get();
    return state.friendRequestAccepted === true &&
           state.goodEndingSeen === true &&
           state.rejectedEndingSeen !== true;
  }

  /* ============================================================
     好友申请视图渲染
     ============================================================ */
  function renderFriendRequestList() {
    var list = document.querySelector('.friend-request-list');
    if (!list) return;

    if (isSecondaryFriendRequestActive()) {
      list.innerHTML =
        '<div class="friend-request-item">' +
          '<div class="contact-avatar" style="background:#b39ddb;">云</div>' +
          '<div class="friend-request-body">' +
            '<div class="friend-request-name">如果那片云</div>' +
            '<div class="friend-request-text">UPUP，我这里有个很好的视频素材，要不要看看</div>' +
          '</div>' +
          '<div class="friend-request-actions">' +
            '<button class="friend-btn accept disabled" type="button" disabled>已添加</button>' +
            '<button class="friend-btn reject secondary-reject" type="button">拒绝</button>' +
          '</div>' +
        '</div>' +
        '<div class="friend-request-hint">你们已经是好友了。</div>';

      var rejectBtn = list.querySelector('.secondary-reject');
      if (rejectBtn) {
        rejectBtn.addEventListener('click', handleSecondaryRejectFriend);
      }
    } else if (isInitialFriendRequestActive()) {
      list.innerHTML =
        '<div class="friend-request-item">' +
          '<div class="contact-avatar" style="background:#b39ddb;">云</div>' +
          '<div class="friend-request-body">' +
            '<div class="friend-request-name">如果那片云</div>' +
            '<div class="friend-request-text">UPUP，我这里有个很好的视频素材，要不要看看</div>' +
          '</div>' +
          '<div class="friend-request-actions">' +
            '<button class="friend-btn accept initial-accept" type="button">同意</button>' +
            '<button class="friend-btn reject initial-reject" type="button">拒绝</button>' +
          '</div>' +
        '</div>';

      var acceptBtn = list.querySelector('.initial-accept');
      var rejectBtn2 = list.querySelector('.initial-reject');
      if (acceptBtn) acceptBtn.addEventListener('click', handleAcceptFriend);
      if (rejectBtn2) rejectBtn2.addEventListener('click', handleRejectFriend);
    } else {
      list.innerHTML = '<div class="friend-request-empty">暂无新的好友申请</div>';
    }
  }

  /* ============================================================
     二次拒绝处理
     ============================================================ */
  function handleSecondaryRejectFriend() {
    window.GameState.update({ rejectedEndingSeen: true });
    logStateUpdate();

    var friendRequestList = document.querySelector('.friend-request-list');
    if (friendRequestList) {
      friendRequestList.innerHTML = '<div class="friend-request-empty">暂无新的好友申请</div>';
    }

    updateFriendRequestDot();
    renderContactList();
    showEndingOverlay('question', false);
  }

  var chatProgress = 0;
  var questionProgress = 0;
  var chatSelectedOptions = {};
  var questionSelectedOptions = {};
  var questionDialogue = [];

  function rebuildQuestionDialogue() {
    var state = window.GameState.get();
    questionDialogue = BASE_QUESTION_NODES.slice();
    if (state.accidentDeathHandled === true && state.stage2Completed === true) {
      questionDialogue.push({ type: 'npc', text: '有什么进展吗' });
      questionDialogue.push({ type: 'ending-options' });
    }
  }

  function showView(name) {
    if (viewFriendRequest) viewFriendRequest.hidden = (name !== 'friendRequest');
    if (viewMainChat) viewMainChat.hidden = (name !== 'main');
    if (viewOtherContact) viewOtherContact.hidden = (name !== 'other');
    if (viewEmpty) viewEmpty.hidden = (name !== 'empty');
    if (viewEmail) viewEmail.hidden = (name !== 'email');
  }

  function updateFriendRequestDot() {
    if (!friendRequestDot) return;
    if (isInitialFriendRequestActive() || isSecondaryFriendRequestActive()) {
      friendRequestDot.hidden = false;
    } else {
      friendRequestDot.hidden = true;
    }
  }

  function buildMysteryContactItem(currentChat) {
    var isActive = (currentChat === MYSTERY_CONTACT_NAME);

    var item = document.createElement('div');
    item.className = 'contact-item' + (isActive ? ' active' : '');
    item.setAttribute('data-contact-id', MYSTERY_CONTACT_ID);

    var avatar = document.createElement('div');
    avatar.className = 'contact-avatar';
    applyAvatarLoading(avatar);

    var img = document.createElement('img');
    img.src = MYSTERY_AVATAR;
    img.alt = '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    img.onload = function () {
      clearAvatarLoading(avatar);
    };
    img.onerror = function () {
      img.style.display = 'none';
      setAvatarColorOnly(avatar);
    };
    avatar.appendChild(img);

    var body = document.createElement('div');
    body.className = 'contact-body';

    var nameEl = document.createElement('div');
    nameEl.className = 'contact-name';
    nameEl.textContent = MYSTERY_CONTACT_NAME;

    var previewEl = document.createElement('div');
    previewEl.className = 'contact-preview';
    previewEl.textContent = MYSTERY_PREVIEW;

    body.appendChild(nameEl);
    body.appendChild(previewEl);

    item.appendChild(avatar);
    item.appendChild(body);

    if (shouldShowMysteryDot()) {
      var dot = document.createElement('div');
      dot.className = 'contact-dot';
      item.appendChild(dot);
    }

    item.addEventListener('click', function () {
      handleContactClick(MYSTERY_CONTACT_ID, MYSTERY_CONTACT_NAME);
    });

    return item;
  }

  function renderContactList() {
    if (!contactList) return;
    contactList.innerHTML = '';

    var state = window.GameState.get();
    var accepted = state.friendRequestAccepted === true;
    var currentChat = state.currentChat || MAIN_CHAT_NAME;

    if (shouldShowMysteryContact()) {
      contactList.appendChild(buildMysteryContactItem(currentChat));
    }

    for (var i = 0; i < CONTACTS.length; i++) {
      (function (c) {
        if (c.requiresFriendRequest && !accepted) return;

        var isActive = false;
        if (c.isEmailContact) {
          isActive = (currentChat === EMAIL_CONTACT_ID);
        } else if (c.id === 'yyyy') {
          isActive = (currentChat === MAIN_CHAT_NAME);
        } else {
          isActive = (c.name === currentChat);
        }

        var item = document.createElement('div');
        item.className = 'contact-item' + (isActive ? ' active' : '');
        item.setAttribute('data-contact-id', c.id);

        var avatar = document.createElement('div');
        avatar.className = 'contact-avatar';
        applyAvatarLoading(avatar);

        var avatarSrc = c.avatar || getContactAvatarPath(c.name);
        if (avatarSrc) {
          avatar.style.overflow = 'hidden';
          avatar.style.padding = '0';
          var img = document.createElement('img');
          img.src = avatarSrc;
          img.alt = '';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          img.style.display = 'block';
          img.onload = function () {
            clearAvatarLoading(avatar);
          };
          img.onerror = function () {
            img.style.display = 'none';
            setAvatarColorOnly(avatar);
          };
          avatar.appendChild(img);
        } else {
          setAvatarColorOnly(avatar);
        }

        var body = document.createElement('div');
        body.className = 'contact-body';

        var nameEl = document.createElement('div');
        nameEl.className = 'contact-name';
        nameEl.textContent = c.name;

        var previewEl = document.createElement('div');
        previewEl.className = 'contact-preview';

        var previewText = c.preview;
        if (c.isEmailContact) {
          if (state.goodEndingSeen) {
            previewText = '您有一封新邮件';
          } else {
            previewText = '邮箱绑定成功';
          }
        }
        previewEl.textContent = previewText;

        body.appendChild(nameEl);
        body.appendChild(previewEl);

        item.appendChild(avatar);
        item.appendChild(body);

        if (c.unread > 0) {
          var badge = document.createElement('div');
          badge.className = 'contact-badge';
          badge.textContent = c.unread;
          item.appendChild(badge);
        }

        if (c.isEmailContact && state.goodEndingSeen && !isEmailRead()) {
          var dot = document.createElement('div');
          dot.className = 'contact-dot';
          item.appendChild(dot);
        }

        item.addEventListener('click', function () {
          handleContactClick(c.id, c.name);
        });

        contactList.appendChild(item);
      })(CONTACTS[i]);
    }

    updateFriendRequestDot();
  }

  function handleContactClick(contactId, contactName) {
    var state = window.GameState.get();

    if (contactId === MYSTERY_CONTACT_ID) {
      if (!shouldShowMysteryContact()) return;

      var wasInMysteryChat = (state.currentChat === MYSTERY_CONTACT_NAME) &&
                             viewOtherContact && !viewOtherContact.hidden;

      window.GameState.update({ currentChat: MYSTERY_CONTACT_NAME });
      showView('other');
      renderContactList();

      if (!wasInMysteryChat) {
        startMysteryChat();
      }
      return;
    }

    if (contactId === EMAIL_CONTACT_ID) {
      if (!state.goodEndingSeen) return;

      window.GameState.update({ currentChat: EMAIL_CONTACT_ID });
      markEmailRead();
      renderContactList();
      renderEmailView();
      showView('email');
      return;
    }

    if (contactId === 'yyyy') {
      if (state.friendRequestAccepted !== true) return;
      window.GameState.update({ currentChat: MAIN_CHAT_NAME });
      showView('main');
      renderContactList();
      if (mainChatTitle) mainChatTitle.textContent = MAIN_CHAT_NAME;
      syncFromState();
      renderMessages({ animate: false });
      return;
    }

    window.GameState.update({ currentChat: contactName });
    showView('other');
    renderContactList();
    renderOtherContact(contactName);
  }

  function renderOtherContact(name) {
    if (!otherChatTitle || !otherMessageList) return;

    otherChatTitle.textContent = name;
    otherMessageList.innerHTML = '';

    var msgs = STATIC_MESSAGES[name] || [];
    for (var i = 0; i < msgs.length; i++) {
      var m = msgs[i];
      var isMe = (m.speaker === '我');

      var row = document.createElement('div');
      row.className = 'msg-row ' + (isMe ? 'me' : 'them');

      var avatar = createMessageAvatar(isMe, m.speaker);

      var wrap = document.createElement('div');
      wrap.className = 'msg-wrap';

      var bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = m.text;

      wrap.appendChild(bubble);

      if (isMe) {
        row.appendChild(wrap);
        row.appendChild(avatar);
      } else {
        row.appendChild(avatar);
        row.appendChild(wrap);
      }

      otherMessageList.appendChild(row);
    }

    window.requestAnimationFrame(function () {
      otherMessageList.scrollTop = otherMessageList.scrollHeight;
    });
  }

  function renderEmailView() {
    var state = window.GameState.get();

    var playerWords = state.playerLastWords || '';
    playerWords = String(playerWords).trim();

    var subject = playerWords ? playerWords : '（无标题）';

    if (emailSubject) {
      emailSubject.textContent = subject;
    }

    if (emailBodyEl) {
      var emailBody = playerWords
        ? playerWords + '，谢谢，然后是再见ヾ(￣▽￣)'
        : '谢谢，然后是再见ヾ(￣▽￣)';
      emailBodyEl.textContent = emailBody;
    }

    var emailImageWrap = document.querySelector('.email-image-wrap');
    if (emailImageWrap) {
      var saveBtn = document.getElementById('saveImageBtn');
      if (saveBtn && saveBtn.parentNode) {
        saveBtn.parentNode.removeChild(saveBtn);
      }

      emailImageWrap.innerHTML = '';

      var img = document.createElement('img');
      img.className = 'email-photo';
      img.src = 'assets/images/ab-photo.png';
      img.alt = 'AB合照';
      img.onerror = function () {
        img.style.display = 'none';
        var ph = document.createElement('div');
        ph.className = 'email-photo-placeholder';
        ph.textContent = '';
        emailImageWrap.insertBefore(ph, img);
      };
      emailImageWrap.appendChild(img);

      var viewBtn = document.getElementById('viewLargeImageBtn');
      if (viewBtn) {
        if (viewBtn.parentNode) {
          viewBtn.parentNode.removeChild(viewBtn);
        }
      } else {
        viewBtn = document.createElement('button');
        viewBtn.id = 'viewLargeImageBtn';
        viewBtn.type = 'button';
      }
      viewBtn.className = 'email-view-btn';
      viewBtn.textContent = '查看大图';
      viewBtn.onclick = openImageModal;
      emailImageWrap.appendChild(viewBtn);
    }

    var modalPlaceholder = document.querySelector('.image-modal-placeholder');
    if (modalPlaceholder) {
      modalPlaceholder.innerHTML = '';
      var modalImg = document.createElement('img');
      modalImg.src = 'assets/images/ab-photo.png';
      modalImg.alt = 'AB合照（放大）';
      modalImg.style.display = 'block';
      modalImg.style.maxWidth = '90vw';
      modalImg.style.maxHeight = '85vh';
      modalImg.style.borderRadius = '8px';
      modalImg.onerror = function () {
        modalImg.style.display = 'none';
      };
      modalPlaceholder.appendChild(modalImg);
    }
  }

  function openImageModal() {
    if (!imageModal) return;
    imageModal.hidden = false;
  }

  function closeImageModal() {
    if (!imageModal) return;
    imageModal.hidden = true;
    checkAndUnlockTrueEnding();
  }

  function handleFriendRequestBtnClick() {
    renderFriendRequestList();
    showView('friendRequest');
  }

  function handleAcceptFriend() {
    var prevState = window.GameState.get();
    var wasAccepted = prevState.friendRequestAccepted === true;

    var update = {
      friendRequestAccepted: true,
      currentChat: MAIN_CHAT_NAME,
      rejectedFriendRequest: false
    };

    if (!wasAccepted) {
      update.chatProgress = 0;
      update.chatSelectedOptions = {};
      update.questionProgress = 0;
      update.questionSelectedOptions = {};
    }

    window.GameState.update(update);
    logStateUpdate();

    renderFriendRequestList();

    showView('main');
    if (mainChatTitle) mainChatTitle.textContent = MAIN_CHAT_NAME;

    renderContactList();

    syncFromState();
    renderMessages({ animate: true });
  }

  function handleRejectFriend() {
    window.GameState.update({
      rejectedFriendRequest: true,
      rejectedEndingSeen: true
    });
    logStateUpdate();

    renderFriendRequestList();

    updateFriendRequestDot();
    showEndingOverlay('question', false);
  }

  function updateCurrentContactPreview(text) {
    if (!text) return;
    if (!contactList) return;
    var items = contactList.querySelectorAll('.contact-item');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var nameEl = item.querySelector('.contact-name');
      if (nameEl && nameEl.textContent === MAIN_CHAT_NAME) {
        var previewEl = item.querySelector('.contact-preview');
        if (previewEl) previewEl.textContent = text;
        break;
      }
    }
  }

  function appendMessage(msg, animate) {
    var speaker = msg.speaker;
    var text = msg.text;
    var type = msg.type;

    if (speaker === null || speaker === undefined) {
      var sys = document.createElement('div');
      if (type === 'ending-bad') {
        sys.className = 'system-line ending-bad';
      } else if (type === 'ending-good') {
        sys.className = 'system-line ending-good';
      } else {
        sys.className = 'system-line';
      }
      sys.textContent = text;
      if (animate) sys.classList.add('message-appear');
      messageList.appendChild(sys);
      return;
    }

    var isMe = (speaker === SPEAKER_ME);

    var row = document.createElement('div');
    row.className = 'msg-row ' + (isMe ? 'me' : 'them');
    if (animate) row.classList.add('message-appear');

    var avatar = createMessageAvatar(isMe, speaker);

    var wrap = document.createElement('div');
    wrap.className = 'msg-wrap';

    var nameEl = document.createElement('div');
    nameEl.className = 'msg-name';
    nameEl.textContent = speaker;

    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    if (msg.link && msg.link.url) {
      bubble.appendChild(document.createElement('br'));
      var linkEl = document.createElement('a');
      linkEl.className = 'message-link';
      linkEl.href = msg.link.url;
      linkEl.textContent = msg.link.text || msg.link.url;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      bubble.appendChild(linkEl);
    }

    wrap.appendChild(nameEl);
    wrap.appendChild(bubble);

    if (isMe) {
      row.appendChild(wrap);
      row.appendChild(avatar);
    } else {
      row.appendChild(avatar);
      row.appendChild(wrap);
    }

    messageList.appendChild(row);

    if (speaker === ROBOT_NAME) {
      updateCurrentContactPreview(text);
    }

    if (animate) playMessageSoundIfHidden();
  }

  function showTypingIndicator() {
    removeTypingIndicator();

    var row = document.createElement('div');
    row.className = 'msg-row them typing-indicator';

    var avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    setAvatarColorOnly(avatar);

    var wrap = document.createElement('div');
    wrap.className = 'msg-wrap';

    var bubble = document.createElement('div');
    bubble.className = 'bubble';

    var d1 = document.createElement('span'); d1.className = 'dot';
    var d2 = document.createElement('span'); d2.className = 'dot';
    var d3 = document.createElement('span'); d3.className = 'dot';

    bubble.appendChild(d1);
    bubble.appendChild(d2);
    bubble.appendChild(d3);

    wrap.appendChild(bubble);
    row.appendChild(avatar);
    row.appendChild(wrap);

    messageList.appendChild(row);
  }

  function removeTypingIndicator() {
    var els = messageList.querySelectorAll('.typing-indicator');
    for (var i = 0; i < els.length; i++) {
      if (els[i].parentNode) els[i].parentNode.removeChild(els[i]);
    }
  }

  function showOptions(options, handler) {
    optionList.innerHTML = '';
    for (var i = 0; i < options.length; i++) {
      (function (opt) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', function () {
          playSound('click');
          handler(opt);
        });
        optionList.appendChild(btn);
      })(options[i]);
    }
  }

  function renderEndingOptions() {
    var state = window.GameState.get();
    if (state.endingChoice !== null) return;
    if (!state.stage2Completed) return;

    var options = [];
    options.push({ text: ENDING_OPTION_BAD, type: 'bad' });

    if (state.badEndingSeen && state.stage3Completed) {
      options.push({ text: ENDING_OPTION_GOOD, type: 'good' });
    }

    console.log('当前可用选项:', options);
    showEndingOptions(options);
  }

  function showEndingOptions(options) {
    optionList.innerHTML = '';
    for (var i = 0; i < options.length; i++) {
      (function (opt) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = opt.text;

        var locked = false;
        btn.addEventListener('click', function () {
          if (locked) return;
          locked = true;
          playSound('click');
          btn.disabled = true;
          handleEndingOptionClick(opt);
        });

        optionList.appendChild(btn);
      })(options[i]);
    }
  }

  function handleEndingOptionClick(opt) {
    optionList.innerHTML = '';

    if (opt.type === 'bad') {
      console.log('触发坏结局');
      window.GameState.update({
        endingChoice: 'bad',
        badEndingSeen: true
      });
      logStateUpdate();
      renderContactList();
      showEndingOverlay('bad', false);
      return;
    }

    if (opt.type === 'good') {
      console.log('触发好结局');
      window.GameState.update({
        endingChoice: 'good',
        goodEndingSeen: true,
        emailReceived: true,
        goodEndingOverlayPlayed: false
      });
      logStateUpdate();
      renderContactList();
      showEndingOverlay('good', false);
      return;
    }
  }

  function showInputBox(node) {
    inputArea.hidden = false;
    inputArea.classList.add('is-visible');
    chatInput.placeholder = node.placeholder || '输入内容';
    chatInput.value = '';
    inputError.textContent = '';
    window.requestAnimationFrame(function () {
      try { chatInput.focus(); } catch (e) {}
    });
  }

  function hideInputBox() {
    inputArea.hidden = true;
    inputArea.classList.remove('is-visible');
  }

  function getEndingLines(choice) {
    if (choice === 'bad') return BAD_ENDING_LINES;
    if (choice === 'good') return GOOD_ENDING_LINES;
    if (choice === 'question') return QUESTION_ENDING_LINES;
    if (choice === 'true') return TRUE_ENDING_LINES;
    return [];
  }

  function getEndingLastLineClass(choice) {
    if (choice === 'bad') return 'ending-line-bad';
    if (choice === 'good') return 'ending-line-good';
    if (choice === 'question') return 'ending-line-question';
    if (choice === 'true') return 'ending-line-true';
    return '';
  }

  function resetEndingOverlayStyle() {
    if (!endingOverlay) return;
    endingOverlay.style.transition = '';
    endingOverlay.style.opacity = '';
    endingOverlay.style.display = '';
  }

  function showEndingOverlay(choice, skipAnimation) {
    if (!endingOverlay || !endingText) return;

    if (choice === 'good') {
      var st = window.GameState.get();
      if (st.goodEndingOverlayPlayed === true) {
        console.log('[chat] 好结局覆盖层已播放过，跳过');
        return;
      }
    }

    clearEndingTimers();
    resetEndingOverlayStyle();

    var themeMap = {
      'bad': 'bad',
      'good': 'good',
      'question': 'rejected',
      'true': 'true'
    };
    applyEndingTheme(themeMap[choice] || null);

    if (choice === 'good') {
      startEndingMusic();
    } else {
      stopEndingMusic();
    }

    _endingTextToken++;
    endingText.innerHTML = '';

    if (skipAnimation) {
      endingOverlay.style.transition = 'none';
      endingOverlay.classList.add('show');
      void endingOverlay.offsetHeight;
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          endingOverlay.style.transition = '';
        });
      });
      _endingTimers.push(setTimeout(function () {
        startEndingText(choice);
      }, 200));
    } else {
      endingOverlay.style.transition = 'transform 1.5s ease-out';
      endingOverlay.classList.remove('show');
      void endingOverlay.offsetHeight;
      endingOverlay.classList.add('show');
      _endingTimers.push(setTimeout(function () {
        startEndingText(choice);
      }, ENDING_ANIM_DURATION));
    }
  }

  function hideEndingOverlay() {
    if (!endingOverlay || !endingText) return;

    _endingTextToken++;
    clearEndingTimers();
    stopEndingMusic();
    resetEndingOverlayStyle();

    endingOverlay.style.transition = 'none';
    endingOverlay.classList.remove('show');
    void endingOverlay.offsetHeight;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        endingOverlay.style.transition = '';
      });
    });

    endingText.innerHTML = '';
  }

  function startEndingText(choice) {
    if (!endingText) return;

    var myToken = ++_endingTextToken;
    var lines = getEndingLines(choice);
    var lastIdx = lines.length - 1;
    var isTrueEnding = (choice === 'true');

    endingText.innerHTML = '';

    var i = 0;

    function showNext() {
      if (myToken !== _endingTextToken) return;
      if (i >= lines.length) return;

      var lineEl = document.createElement('div');
      lineEl.className = 'ending-line';

      if (isTrueEnding) lineEl.classList.add('ending-line-purple');

      if (i === lastIdx) {
        var lastClass = getEndingLastLineClass(choice);
        if (lastClass) {
          lineEl.classList.add(lastClass);
          lineEl.classList.add('ending-line-fast');
        }
      }

      lineEl.textContent = lines[i];
      endingText.appendChild(lineEl);
      i++;

      if (i < lines.length) {
        _endingTimers.push(setTimeout(showNext, ENDING_LINE_INTERVAL));
      } else {
        _endingTimers.push(setTimeout(function () {
          if (myToken !== _endingTextToken) return;
          showEndingButton(choice);
        }, ENDING_BTN_DELAY));
      }
    }

    showNext();
  }

  function showEndingButton(choice) {
    if (!endingText) return;

    var old = endingText.querySelector('.ending-action');
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var wrap = document.createElement('div');
    wrap.className = 'ending-action';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ending-action-btn';

    if (choice === 'bad') {
      btn.textContent = '如果';
      btn.addEventListener('click', function () { handleIfButton('bad'); });
    } else if (choice === 'question') {
      btn.textContent = '如果';
      btn.addEventListener('click', function () { handleIfButton('question'); });
    } else if (choice === 'good') {
      btn.textContent = '继续向前';
      btn.addEventListener('click', function () { handleViewMessage(); });
    } else if (choice === 'true') {
      btn.textContent = '结束';
      btn.addEventListener('click', function () { handleTrueEndingEnd(); });
    }

    wrap.appendChild(btn);
    endingText.appendChild(wrap);

    window.requestAnimationFrame(function () { wrap.classList.add('show'); });
  }

  function handleViewMessage() {
    if (!endingOverlay || !endingText) return;

    window.GameState.update({ goodEndingOverlayPlayed: true });

    _endingTextToken++;
    clearEndingTimers();

    endingOverlay.style.transition = 'opacity ' + (GOOD_ENDING_FADE_MS / 1000) + 's ease-out';
    endingOverlay.style.opacity = '0';

    _endingTimers.push(setTimeout(function () {
      endingOverlay.classList.remove('show');
      endingOverlay.style.display = 'none';
      endingOverlay.style.transition = '';
      endingOverlay.style.opacity = '';
      endingText.innerHTML = '';

      var state = window.GameState.get();
      if (state.currentChat !== MAIN_CHAT_NAME) {
        window.GameState.update({ currentChat: MAIN_CHAT_NAME });
      }

      renderContactList();
      showView('main');
      if (mainChatTitle) mainChatTitle.textContent = MAIN_CHAT_NAME;
      syncFromState();
      renderMessages({ animate: false });
    }, GOOD_ENDING_FADE_MS));
  }

  function handleIfButton(context) {
    hideEndingOverlay();

    if (context === 'question') {
      window.GameState.update({ rejectedFriendRequest: false });

      /* 调用公共解锁检查（修复：先检查，再切视图） */
      checkAndUnlockTrueEnding();

      showView('friendRequest');
      renderFriendRequestList();
      renderContactList();
      return;
    }

    window.GameState.update({ endingChoice: null });
    logStateUpdate();

    var state2 = window.GameState.get();
    if (state2.friendRequestAccepted === true) {
      showView('main');
      if (mainChatTitle) mainChatTitle.textContent = MAIN_CHAT_NAME;
    } else {
      showView('friendRequest');
      renderFriendRequestList();
    }

    renderContactList();
    syncFromState();
    renderMessages({ animate: false });
  }

  function handleTrueEndingEnd() {
    if (!endingOverlay || !endingText) return;

    window.GameState.update({ trueEndingTriggered: true });

    _endingTextToken++;
    clearEndingTimers();

    endingOverlay.style.transition = 'opacity ' + (GOOD_ENDING_FADE_MS / 1000) + 's ease-out';
    endingOverlay.style.opacity = '0';

    _endingTimers.push(setTimeout(function () {
      endingOverlay.classList.remove('show');
      endingOverlay.style.display = 'none';
      endingOverlay.style.transition = '';
      endingOverlay.style.opacity = '';
      endingText.innerHTML = '';

      window.GameState.update({ currentChat: MYSTERY_CONTACT_NAME });
      renderContactList();
      showView('other');
      if (otherChatTitle) otherChatTitle.textContent = MYSTERY_CONTACT_NAME;
      startMysteryChat();
    }, GOOD_ENDING_FADE_MS));
  }

  function appendHistoricalNode(arr, index, selectedOptions) {
    var node = arr[index];
    if (!node) return;

    if (node.type === 'npc') {
      appendMessage({ speaker: ROBOT_NAME, text: node.text, link: node.link }, false);
    } else if (node.type === 'player') {
      var prev = index > 0 ? arr[index - 1] : null;
      if (prev && prev.type === 'options') return;
      appendMessage({ speaker: SPEAKER_ME, text: node.text }, false);
    } else if (node.type === 'options') {
      var text = selectedOptions[index];
      if (text) appendMessage({ speaker: SPEAKER_ME, text: text }, false);
    }
  }

  function shouldSkipPlayer(arr, index) {
    if (index <= 0) return false;
    var prev = arr[index - 1];
    return prev && prev.type === 'options';
  }

  function saveProgress() {
    window.GameState.update({
      chatProgress: chatProgress,
      chatSelectedOptions: chatSelectedOptions,
      questionProgress: questionProgress,
      questionSelectedOptions: questionSelectedOptions
    });
  }

  function checkQuestionCompletion() {
    var state = window.GameState.get();
    if (state.accidentDeathFound &&
        !state.accidentDeathHandled &&
        questionProgress >= BASE_QUESTION_NODES.length) {
      window.GameState.update({ accidentDeathHandled: true });
      rebuildQuestionDialogue();
    }
  }

  function handleOptionChoice(phase, index, text) {
    if (_optionClickLock) return;
    _optionClickLock = true;

    optionList.innerHTML = '';

    if (phase === 'base') {
      chatSelectedOptions[index] = text;
      chatProgress = index + 1;
    } else {
      questionSelectedOptions[index] = text;
      questionProgress = index + 1;
    }

    saveProgress();
    checkQuestionCompletion();
    renderMessages({ animate: true });

    setTimeout(function () { _optionClickLock = false; }, OPTION_CLICK_LOCK_MS);
  }

  function handleInputSubmit() {
    var raw = chatInput.value;

    if (/\s/.test(raw)) {
      inputError.textContent = '不，不是这个名字';
      chatInput.value = '';
      chatInput.focus();
      return;
    }

    var value = raw.trim();
    var normalized = normalizeChineseName(value);

    if (normalized !== CORRECT_NAME) {
      inputError.textContent = '不，不是这个名字';
      chatInput.value = '';
      chatInput.focus();
      return;
    }

    inputError.textContent = '';
    questionProgress = questionProgress + 1;
    saveProgress();
    chatInput.value = '';
    hideInputBox();
    renderMessages({ animate: true });
  }

  async function continueDialogue(token, instant) {
    while (true) {
      if (token !== _renderToken) return;

      var node, index, phase;

      if (chatProgress < BASE_DIALOGUE_NODES.length) {
        node = BASE_DIALOGUE_NODES[chatProgress];
        index = chatProgress;
        phase = 'base';
      } else {
        var state = window.GameState.get();
        if (!state.accidentDeathFound) return;
        if (questionProgress < questionDialogue.length) {
          node = questionDialogue[questionProgress];
          index = questionProgress;
          phase = 'question';
        } else {
          return;
        }
      }

      if (node.type === 'options') {
        var idx = index;
        showOptions(node.options, function (text) {
          handleOptionChoice(phase, idx, text);
        });
        return;
      }

      if (node.type === 'ending-options') {
        renderEndingOptions();
        return;
      }

      if (node.type === 'input') {
        showInputBox(node);
        return;
      }

      if (node.type === 'npc') {
        if (instant) {
          appendMessage({ speaker: ROBOT_NAME, text: node.text, link: node.link }, false);
          scrollToBottom();
        } else {
          showTypingIndicator();
          scrollToBottom();
          await delay(TYPING_DURATION);
          if (token !== _renderToken) { removeTypingIndicator(); return; }
          removeTypingIndicator();
          appendMessage({ speaker: ROBOT_NAME, text: node.text, link: node.link }, true);
          scrollToBottom();
          await delay(APPEAR_INTERVAL);
          if (token !== _renderToken) return;
        }
      } else if (node.type === 'player') {
        var arr = phase === 'base' ? BASE_DIALOGUE_NODES : questionDialogue;
        if (shouldSkipPlayer(arr, index)) {
          /* 跳过 */
        } else {
          if (instant) {
            appendMessage({ speaker: SPEAKER_ME, text: node.text }, false);
            scrollToBottom();
          } else {
            appendMessage({ speaker: SPEAKER_ME, text: node.text }, true);
            scrollToBottom();
            await delay(APPEAR_INTERVAL);
            if (token !== _renderToken) return;
          }
        }
      }

      if (phase === 'base') {
        chatProgress = index + 1;
      } else {
        questionProgress = index + 1;
      }
      saveProgress();

      if (phase === 'question') {
        var st = window.GameState.get();
        if (!st.accidentDeathHandled &&
            questionProgress >= BASE_QUESTION_NODES.length) {
          window.GameState.update({ accidentDeathHandled: true });
          rebuildQuestionDialogue();
        }
      }
    }
  }

  function renderMessages(options) {
    options = options || {};
    var animateNew = !!options.animate;

    _renderToken++;
    var token = _renderToken;

    removeTypingIndicator();
    messageList.innerHTML = '';
    optionList.innerHTML = '';
    hideInputBox();
    inputError.textContent = '';

    if (mainChatTitle) mainChatTitle.textContent = MAIN_CHAT_NAME;

    var i;
    for (i = 0; i < chatProgress && i < BASE_DIALOGUE_NODES.length; i++) {
      appendHistoricalNode(BASE_DIALOGUE_NODES, i, chatSelectedOptions);
    }

    for (i = 0; i < questionProgress && i < questionDialogue.length; i++) {
      appendHistoricalNode(questionDialogue, i, questionSelectedOptions);
    }

    scrollToBottom();

    continueDialogue(token, !animateNew);
  }

  function initAudioButton() {
    if (!audioBtn) return;

    var flag = null;
    try { flag = localStorage.getItem(AUDIO_FLAG_KEY); } catch (e) { flag = null; }

    if (flag) { audioBtn.hidden = true; return; }

    audioBtn.hidden = false;
    audioBtn.addEventListener('click', function () {
      try { localStorage.setItem(AUDIO_FLAG_KEY, 'true'); } catch (e) {}
      if (window.AudioManager && typeof window.AudioManager.setEnabled === 'function') {
        window.AudioManager.setEnabled(true);
      }
      audioBtn.hidden = true;
    });
  }

  function initTestButtons() {
    var status = document.getElementById('testDeathStatus');

    var btnDeath = document.getElementById('testDeathNewsBtn');
    if (btnDeath) {
      btnDeath.addEventListener('click', function () {
        window.GameState.broadcast({
          accidentDeathFound: true,
          accidentDeathHandled: false
        });
        if (status) status.textContent = '已写入 accidentDeathFound';
      });
    }

    var btnStage2 = document.getElementById('testStage2Btn');
    if (btnStage2) {
      btnStage2.addEventListener('click', function () {
        window.GameState.update({ stage2Completed: true });
        window.GameState.broadcast({ stage2Completed: true });
        if (status) status.textContent = '已模拟阶段二完成';
      });
    }

    var btnStage3 = document.getElementById('testStage3Btn');
    if (btnStage3) {
      btnStage3.addEventListener('click', function () {
        window.GameState.update({ stage3Completed: true });
        window.GameState.broadcast({ stage3Completed: true });
        if (status) status.textContent = '已模拟阶段三完成';
      });
    }

    var btnReset = document.getElementById('testResetChatBtn');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        try { sessionStorage.removeItem('stage2DialogueShown'); } catch (e) {}
        try { sessionStorage.removeItem(SS_KEY_STAGE2_OPTIONS_SHOWN); } catch (e) {}
        try { sessionStorage.removeItem(SS_KEY_STAGE3_OPTIONS_SHOWN); } catch (e) {}
        window.GameState.update({
          chatProgress: 0,
          chatSelectedOptions: {},
          questionProgress: 0,
          questionSelectedOptions: {},
          accidentDeathFound: false,
          accidentDeathHandled: false,
          stage2Completed: false,
          stage3Completed: false,
          stage2DialogueShown: false,
          endingChoice: null,
          badEndingSeen: false,
          goodEndingSeen: false,
          rejectedEndingSeen: false,
          goodEndingOverlayPlayed: false,
          trueEndingTriggered: false,
          trueEndingReasonSelected: [],
          trueEndingFinalChoice: null,
          trueEndingContactUnlocked: false,
          mysteryChoice: null
        });
        if (status) status.textContent = '已重置聊天状态';
        syncFromState();
        if (viewMainChat && !viewMainChat.hidden) {
          renderMessages({ animate: false });
        }
      });
    }

    var btnMockBgMsg = document.getElementById('testMockBgMsgBtn');
    if (btnMockBgMsg) {
      btnMockBgMsg.addEventListener('click', function () {
        if (!messageList) return;
        var row = document.createElement('div');
        row.className = 'msg-row them message-appear';
        row.innerHTML = '<div class="msg-avatar"></div>' +
          '<div class="msg-wrap"><div class="bubble">（测试）这是一条模拟新消息。</div></div>';
        var testAvatar = row.querySelector('.msg-avatar');
        if (testAvatar) setAvatarColorOnly(testAvatar);
        messageList.appendChild(row);
        scrollToBottom();
      });
    }

    var btnForceAudio = document.getElementById('testForceAudioBtn');
    if (btnForceAudio) {
      btnForceAudio.addEventListener('click', function () { playSound('message'); });
    }

    var btnAudio = document.getElementById('testAudioBtn');
    if (btnAudio) {
      btnAudio.addEventListener('click', function () {
        var names = ['message', 'click', 'level-complete', 'chest'];
        var i = 0;
        function next() {
          if (i >= names.length) return;
          playSound(names[i]); i++;
          setTimeout(next, 500);
        }
        next();
      });
    }

    var btnTrueEnding = document.getElementById('testTrueEndingBtn');
    if (btnTrueEnding) {
      btnTrueEnding.addEventListener('click', function () {
        window.GameState.update({
          badEndingSeen: true,
          goodEndingSeen: true,
          rejectedEndingSeen: true,
          trueEndingContactUnlocked: true,
          trueEndingTriggered: false,
          trueEndingReasonSelected: []
        });
        showTrueEndingContact();
        if (status) status.textContent = '已解锁真结局联系人';
      });
    }
  }

  function updateFriendRequestUI() {
    /* 静态 HTML 中的申请项已由 renderFriendRequestList 统一接管，
       此函数仅用于初始化时占位，不再直接修改 DOM。 */
  }

  function initInitialView() {
    var state = window.GameState.get();

    var accepted = state.friendRequestAccepted === true;

    syncFromState();

    if (state.goodEndingSeen && state.currentChat === EMAIL_CONTACT_ID) {
      renderEmailView();
      showView('email');
      return;
    }

    if (state.currentChat === MYSTERY_CONTACT_NAME && shouldShowMysteryContact()) {
      showView('other');
      if (otherChatTitle) otherChatTitle.textContent = MYSTERY_CONTACT_NAME;
      startMysteryChat();
      return;
    }

    if (!accepted) {
      if (state.rejectedFriendRequest === true) {
        window.GameState.update({ rejectedFriendRequest: false });
      }
      showView('friendRequest');
      renderFriendRequestList();
      return;
    }

    var currentChat = state.currentChat || MAIN_CHAT_NAME;

    if (currentChat === MAIN_CHAT_NAME) {
      showView('main');
      if (mainChatTitle) mainChatTitle.textContent = MAIN_CHAT_NAME;
      renderMessages({ animate: false });
      return;
    }

    var contact = findContactByName(currentChat);
    if (contact && contact.id !== 'yyyy' && !contact.isEmailContact) {
      showView('other');
      renderOtherContact(contact.name);
      return;
    }

    showView('main');
    if (mainChatTitle) mainChatTitle.textContent = MAIN_CHAT_NAME;
    renderMessages({ animate: false });
  }

  function startMysteryChat() {
    if (!otherMessageList || !otherChatTitle) return;

    var token = ++mysteryChatToken;
    otherMessageList.innerHTML = '';
    otherChatTitle.textContent = MYSTERY_CONTACT_NAME;

    var state = window.GameState.get();

    if (state.trueEndingTriggered === true) {
      renderMysteryChatCompleted();
      return;
    }

    var hasReasonProgress = state.trueEndingReasonSelected &&
                            state.trueEndingReasonSelected.length > 0;

    if (hasReasonProgress) {
      for (var i = 0; i < TRUE_ENDING_REASON_OPTIONS.length; i++) {
        var opt = TRUE_ENDING_REASON_OPTIONS[i];
        if (state.trueEndingReasonSelected.indexOf(opt.text) !== -1) {
          appendMysteryMessage(SPEAKER_ME, opt.text, false);
          if (opt.replies && opt.replies.length) {
            for (var r = 0; r < opt.replies.length; r++) {
              appendMysteryMessage(MYSTERY_CONTACT_NAME, opt.replies[r], false);
            }
          }
        }
      }
      showTrueEndingReasoningOptions(token);
      return;
    }

    playTrueEndingPreDialogue(token);
  }

  function playTrueEndingPreDialogue(token) {
    var idx = 0;

    function showNext() {
      if (token !== mysteryChatToken) return;
      if (idx >= TRUE_ENDING_PRE_DIALOGUE.length) {
        showTrueEndingReasoningOptions(token);
        return;
      }

      showMysteryTyping();

      setTimeout(function () {
        if (token !== mysteryChatToken) return;
        removeMysteryTyping();
        appendMysteryMessage(MYSTERY_CONTACT_NAME, TRUE_ENDING_PRE_DIALOGUE[idx], true);
        idx++;
        setTimeout(showNext, MYSTERY_LINE_INTERVAL - MYSTERY_TYPING_DURATION);
      }, MYSTERY_TYPING_DURATION);
    }

    showNext();
  }

  function showTrueEndingReasoningOptions(token) {
    if (token !== mysteryChatToken) return;
    if (!otherMessageList) return;

    var state = window.GameState.get();
    var selected = state.trueEndingReasonSelected || [];

    var remaining = [];
    for (var i = 0; i < TRUE_ENDING_REASON_OPTIONS.length; i++) {
      var opt = TRUE_ENDING_REASON_OPTIONS[i];
      if (selected.indexOf(opt.text) === -1) {
        remaining.push(opt);
      }
    }

    if (remaining.length === 0) {
      showTrueEndingAfterReasons(token);
      return;
    }

    var wrap = document.createElement('div');
    wrap.className = 'mystery-options-wrap';
    wrap.setAttribute('data-role', 'reason-options');

    for (var j = 0; j < remaining.length; j++) {
      (function (o) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = o.text;
        btn.addEventListener('click', function () {
          if (token !== mysteryChatToken) return;
          playSound('click');
          handleTrueEndingReasonChoice(o, token);
        });
        wrap.appendChild(btn);
      })(remaining[j]);
    }

    otherMessageList.appendChild(wrap);
    scrollOtherToBottom();
  }

  function handleTrueEndingReasonChoice(opt, token) {
    if (token !== mysteryChatToken) return;

    removeMysteryOptionWrap('reason-options');
    appendMysteryMessage(SPEAKER_ME, opt.text, true);

    var state = window.GameState.get();
    var selected = (state.trueEndingReasonSelected || []).slice();
    if (selected.indexOf(opt.text) === -1) selected.push(opt.text);
    window.GameState.update({ trueEndingReasonSelected: selected });

    var replies = opt.replies || [];
    var rIdx = 0;

    function showNextReply() {
      if (token !== mysteryChatToken) return;

      if (rIdx >= replies.length) {
        setTimeout(function () {
          if (token !== mysteryChatToken) return;
          showTrueEndingReasoningOptions(token);
        }, REASON_REPLY_DELAY_MS);
        return;
      }

      showMysteryTyping();

      setTimeout(function () {
        if (token !== mysteryChatToken) return;
        removeMysteryTyping();
        appendMysteryMessage(MYSTERY_CONTACT_NAME, replies[rIdx], true);
        rIdx++;
        setTimeout(showNextReply, REASON_REPLY_DELAY_MS);
      }, MYSTERY_TYPING_DURATION);
    }

    setTimeout(showNextReply, REASON_REPLY_DELAY_MS);
  }

  function showTrueEndingAfterReasons(token) {
    if (token !== mysteryChatToken) return;

    var idx = 0;

    function showNext() {
      if (token !== mysteryChatToken) return;
      if (idx >= TRUE_ENDING_AFTER_REASONS.length) {
        showTrueEndingFinalOptions(token);
        return;
      }

      showMysteryTyping();

      setTimeout(function () {
        if (token !== mysteryChatToken) return;
        removeMysteryTyping();
        appendMysteryMessage(MYSTERY_CONTACT_NAME, TRUE_ENDING_AFTER_REASONS[idx], true);
        idx++;
        setTimeout(showNext, MYSTERY_LINE_INTERVAL - MYSTERY_TYPING_DURATION);
      }, MYSTERY_TYPING_DURATION);
    }

    setTimeout(showNext, TRANSITION_START_DELAY_MS);
  }

  function showTrueEndingFinalOptions(token) {
    if (token !== mysteryChatToken) return;
    if (!otherMessageList) return;

    var wrap = document.createElement('div');
    wrap.className = 'mystery-options-wrap';
    wrap.setAttribute('data-role', 'final-options');

    for (var i = 0; i < TRUE_ENDING_FINAL_OPTIONS.length; i++) {
      (function (o) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = o.text;
        btn.addEventListener('click', function () {
          if (token !== mysteryChatToken) return;
          playSound('click');
          handleTrueEndingFinalChoice(o, token);
        });
        wrap.appendChild(btn);
      })(TRUE_ENDING_FINAL_OPTIONS[i]);
    }

    otherMessageList.appendChild(wrap);
    scrollOtherToBottom();
  }

  function handleTrueEndingFinalChoice(opt, token) {
    if (token !== mysteryChatToken) return;

    removeMysteryOptionWrap('final-options');
    appendMysteryMessage(SPEAKER_ME, opt.text, true);
    window.GameState.update({ trueEndingFinalChoice: opt.value });

    setTimeout(function () {
      if (token !== mysteryChatToken) return;
      triggerTrueEndingOverlay();
    }, FINAL_OVERLAY_DELAY_MS);
  }

  function removeMysteryOptionWrap(role) {
    if (!otherMessageList) return;
    var wraps = otherMessageList.querySelectorAll('.mystery-options-wrap');
    for (var i = 0; i < wraps.length; i++) {
      var w = wraps[i];
      var wRole = w.getAttribute('data-role');
      if (!role || wRole === role) {
        if (w.parentNode) w.parentNode.removeChild(w);
      }
    }
  }

  function triggerTrueEndingOverlay() {
    showEndingOverlay('true', false);
  }

  function renderMysteryChatCompleted() {
    if (!otherMessageList) return;
    otherMessageList.innerHTML = '';

    for (var i = 0; i < TRUE_ENDING_PRE_DIALOGUE.length; i++) {
      appendMysteryMessage(MYSTERY_CONTACT_NAME, TRUE_ENDING_PRE_DIALOGUE[i], false);
    }

    var state = window.GameState.get();
    var selected = state.trueEndingReasonSelected || [];

    for (var j = 0; j < TRUE_ENDING_REASON_OPTIONS.length; j++) {
      var opt = TRUE_ENDING_REASON_OPTIONS[j];
      if (selected.indexOf(opt.text) !== -1) {
        appendMysteryMessage(SPEAKER_ME, opt.text, false);
        if (opt.replies && opt.replies.length) {
          for (var r = 0; r < opt.replies.length; r++) {
            appendMysteryMessage(MYSTERY_CONTACT_NAME, opt.replies[r], false);
          }
        }
      }
    }

    for (var k = 0; k < TRUE_ENDING_AFTER_REASONS.length; k++) {
      appendMysteryMessage(MYSTERY_CONTACT_NAME, TRUE_ENDING_AFTER_REASONS[k], false);
    }

    if (state.trueEndingFinalChoice) {
      var finalText = '';
      for (var m = 0; m < TRUE_ENDING_FINAL_OPTIONS.length; m++) {
        if (TRUE_ENDING_FINAL_OPTIONS[m].value === state.trueEndingFinalChoice) {
          finalText = TRUE_ENDING_FINAL_OPTIONS[m].text;
          break;
        }
      }
      if (finalText) appendMysteryMessage(SPEAKER_ME, finalText, false);
    }

    scrollOtherToBottom();
  }

  function appendMysteryMessage(speaker, text, animate) {
    if (!otherMessageList) return;
    var isMe = (speaker === SPEAKER_ME);

    var row = document.createElement('div');
    row.className = 'msg-row ' + (isMe ? 'me' : 'them');
    if (animate) row.classList.add('message-appear');

    var avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    applyAvatarLoading(avatar);

    var src = isMe ? AVATAR_ME : MYSTERY_AVATAR;

    var img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    img.onload = function () {
      clearAvatarLoading(avatar);
    };
    img.onerror = function () {
      img.style.display = 'none';
      setAvatarColorOnly(avatar);
    };
    avatar.appendChild(img);

    var wrap = document.createElement('div');
    wrap.className = 'msg-wrap';

    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    wrap.appendChild(bubble);

    if (isMe) {
      row.appendChild(wrap);
      row.appendChild(avatar);
    } else {
      row.appendChild(avatar);
      row.appendChild(wrap);
    }

    otherMessageList.appendChild(row);
    scrollOtherToBottom();
  }

  function showMysteryTyping() {
    if (!otherMessageList) return;
    removeMysteryTyping();

    var row = document.createElement('div');
    row.className = 'msg-row them typing-indicator';

    var avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    applyAvatarLoading(avatar);

    var img = document.createElement('img');
    img.src = MYSTERY_AVATAR;
    img.alt = '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    img.onload = function () {
      clearAvatarLoading(avatar);
    };
    img.onerror = function () {
      img.style.display = 'none';
      setAvatarColorOnly(avatar);
    };
    avatar.appendChild(img);

    var wrap = document.createElement('div');
    wrap.className = 'msg-wrap';

    var bubble = document.createElement('div');
    bubble.className = 'bubble';

    var d1 = document.createElement('span'); d1.className = 'dot';
    var d2 = document.createElement('span'); d2.className = 'dot';
    var d3 = document.createElement('span'); d3.className = 'dot';

    bubble.appendChild(d1);
    bubble.appendChild(d2);
    bubble.appendChild(d3);

    wrap.appendChild(bubble);
    row.appendChild(avatar);
    row.appendChild(wrap);

    otherMessageList.appendChild(row);
    scrollOtherToBottom();
  }

  function removeMysteryTyping() {
    if (!otherMessageList) return;
    var els = otherMessageList.querySelectorAll('.typing-indicator');
    for (var i = 0; i < els.length; i++) {
      if (els[i].parentNode) els[i].parentNode.removeChild(els[i]);
    }
  }

  /* ============================================================
     启动
     ============================================================ */
  function init() {
    /* 修复：刷新页面后先行检查一次，避免死档 */
    checkAndUnlockTrueEnding();

    if (window.AudioManager && typeof window.AudioManager.init === 'function') {
      window.AudioManager.init();
    }

    initSidebarAvatar();
    renderContactList();
    initTestButtons();
    initAudioButton();

    sendBtn.addEventListener('click', handleInputSubmit);
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleInputSubmit();
    });

    if (friendRequestBtn) {
      friendRequestBtn.addEventListener('click', handleFriendRequestBtnClick);
    }
    if (acceptFriendBtn) {
      acceptFriendBtn.addEventListener('click', handleAcceptFriend);
    }
    if (rejectFriendBtn) {
      rejectFriendBtn.addEventListener('click', handleRejectFriend);
    }

    if (viewLargeImageBtn) {
      viewLargeImageBtn.addEventListener('click', openImageModal);
    }
    if (imageModalClose) imageModalClose.addEventListener('click', closeImageModal);
    if (imageModalOverlay) imageModalOverlay.addEventListener('click', closeImageModal);

    if (musicToggleBtn) musicToggleBtn.addEventListener('click', toggleEndingMusic);

    window.onGameStateFieldChange('accidentDeathFound', function (newVal, oldVal) {
      if (newVal === true && oldVal !== true) {
        playSound('message');

        var state = window.GameState.get();
        if (chatProgress >= BASE_DIALOGUE_NODES.length &&
            !state.accidentDeathHandled &&
            questionProgress === 0) {
          rebuildQuestionDialogue();
          if (viewMainChat && !viewMainChat.hidden) {
            renderMessages({ animate: true });
          } else {
            updateCurrentContactPreview('UP，你找到什么了吗？');
          }
        }
      }
    });

    window.onGameStateFieldChange('accidentDeathHandled', function (newVal, oldVal) {
      if (newVal === true && oldVal !== true) {
        var state = window.GameState.get();
        if (state.stage2Completed && !state.endingChoice) {
          rebuildQuestionDialogue();
          if (viewMainChat && !viewMainChat.hidden) {
            renderMessages({ animate: true });
          }
        }
      }
      if (newVal === false && oldVal !== false) {
        questionProgress = 0;
        questionSelectedOptions = {};
        window.GameState.update({
          questionProgress: 0,
          questionSelectedOptions: {}
        });
        rebuildQuestionDialogue();
        if (viewMainChat && !viewMainChat.hidden) {
          syncFromState();
          renderMessages({ animate: false });
        }
      }
    });

    window.onGameStateFieldChange('stage2Completed', function (newVal, oldVal) {
      if (newVal === true && oldVal !== true) {
        var state = window.GameState.get();
        writeStage2OptionsShown();

        if (state.accidentDeathFound &&
            state.accidentDeathHandled &&
            !state.endingChoice) {
          rebuildQuestionDialogue();
          if (viewMainChat && !viewMainChat.hidden) {
            renderMessages({ animate: true });
          }
        }
      }
    });

    window.onGameStateFieldChange('stage3Completed', function (newVal, oldVal) {
      if (newVal === true && oldVal !== true) {
        var state = window.GameState.get();
        if (state.stage2Completed !== true) return;

        writeStage3OptionsShown();

        if (state.accidentDeathFound &&
            state.accidentDeathHandled &&
            !state.endingChoice) {
          rebuildQuestionDialogue();
          if (viewMainChat && !viewMainChat.hidden) {
            renderMessages({ animate: true });
          }
        }
      }
    });

    window.onGameStateFieldChange('stage2DialogueShown', function (newVal, oldVal) {
      if (newVal === true && oldVal !== true) {
        var state = window.GameState.get();
        if (state.stage3Completed) rebuildQuestionDialogue();
      }
    });

    var endingFlagFields = [
      'badEndingSeen',
      'goodEndingSeen',
      'rejectedEndingSeen',
      'trueEndingTriggered',
      'trueEndingContactUnlocked'
    ];
    for (var fi = 0; fi < endingFlagFields.length; fi++) {
      (function (field) {
        window.onGameStateFieldChange(field, function () {
          renderContactList();
          updateFriendRequestDot();
        });
      })(endingFlagFields[fi]);
    }

    initInitialView();

    var stateAfter = window.GameState.get();

    if (shouldShowMysteryContact() && !stateAfter.trueEndingTriggered) {
      renderContactList();
    }

    if (stateAfter.friendRequestAccepted === true) {
      if (stateAfter.endingChoice === 'bad') {
        showEndingOverlay('bad', true);
      } else if (stateAfter.endingChoice === 'good') {
        if (stateAfter.goodEndingOverlayPlayed !== true) {
          showEndingOverlay('good', true);
        } else {
          if (endingOverlay) {
            endingOverlay.classList.remove('show');
            endingOverlay.style.display = 'none';
            endingOverlay.style.transition = '';
            endingOverlay.style.opacity = '';
          }
          if (endingText) endingText.innerHTML = '';
        }
      }
    }
  }

  init();

})();