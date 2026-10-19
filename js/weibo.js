/* js/weibo.js */
/* ============================================================
   文件路径：js/weibo.js
   说明：小号页面逻辑（仿围博电脑版布局）
         本次修正：
           1. 头像锚定：关关子君 → avatar42
              - 顶部导航头像、资料头像、推文头像均使用 avatar42
           2. 新增 toHalfWidth：密码校验前做全角转半角
           3. 其余逻辑保持不变（密码锁、掉落特效、图片渲染等）
   依赖：js/state.js（window.GameState）
         data/weiboData.js（window.WeiboData）
   本模块只读取状态，不写入任何状态。
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 密码保护相关常量 ---------- */
  var UNLOCK_KEY = 'weiboUnlocked';
  var CORRECT_PASSWORD = 'EWIQVQ';

  /* ---------- 头像锚定 ---------- */
  var ACCOUNT_AVATAR_SRC = 'assets/avatars/avatar42.png';

  /* ---------- “为什么”掉落特效相关常量 ---------- */
  var WHY_TEXTS = ['为什么', '对不起'];
  var WHY_COLORS = ['#cc0000', '#e74c3c', '#ff3333', '#a80000', '#d62c2c'];
  var WHY_BUCKET_SIZE = 30;
  var WHY_MAX_OBJECTS = 600;
  var WHY_SPAWN_INTERVAL = 25;
  var WHY_STACK_THRESHOLD = 0.55;
  var WHY_MIN_FONT = 14;
  var WHY_MAX_FONT = 28;
  var WHY_MIN_VY = 10;
  var WHY_MAX_VY = 22;
  var WHY_MAX_ROTATION_DEG = 15;
  var WHY_STACK_OVERLAP = 0.8;
  var WHY_MAX_FALLING = 30;
  var WHY_OFFSET_RANGE = 10;

  /* ---------- DOM 引用 ---------- */
  var tweetList = document.getElementById('tweetList');
  var weiboAvatar = document.getElementById('weiboAvatar');
  var weiboNickname = document.getElementById('weiboNickname');
  var weiboBio = document.getElementById('weiboBio');
  var topnavAvatar = document.getElementById('topnavAvatar');
  var recommendList = document.getElementById('recommendList');

  /* 密码弹窗 DOM */
  var lockOverlay = document.getElementById('weiboLockOverlay');
  var lockPanel = document.getElementById('weiboLockPanel');
  var passwordInput = document.getElementById('weiboPasswordInput');
  var passwordBtn = document.getElementById('weiboPasswordBtn');
  var passwordError = document.getElementById('weiboPasswordError');

  /* “为什么”掉落特效画布 */
  var whyCanvas = document.getElementById('whyCanvas');
  var whyCtx = whyCanvas ? whyCanvas.getContext('2d') : null;

  /* ---------- 关注推荐（虚构昵称与简介） ---------- */
  var RECOMMEND_USERS = [
    { name: '夜航的猫', desc: '插画师', initial: '夜', color: '#4a7ca0' },
    { name: '咖啡与画', desc: '游戏爱好者', initial: '咖', color: '#a06a3a' },
    { name: '南山的风', desc: '独立开发者', initial: '南', color: '#3a7a7a' },
    { name: '白鹭不飞', desc: '音乐人', initial: '白', color: '#7a5a9a' }
  ];

  /* ============================================================
     全角转半角工具
     ============================================================ */
  function toHalfWidth(str) {
    if (!str) return '';
    var result = '';
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if (code >= 0xFF01 && code <= 0xFF5E) {
        result += String.fromCharCode(code - 0xFEE0);
      } else if (code === 0x3000) {
        result += ' ';
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  }

  /* ============================================================
     头像工具
     ============================================================ */
  function setAvatarImage(el, src, alt) {
    if (!el) return;
    el.innerHTML = '';
    el.style.overflow = 'hidden';
    el.style.padding = '0';
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    img.style.borderRadius = '50%';
    img.onerror = function () {
      el.innerHTML = '';
      el.textContent = alt ? alt.charAt(0) : '君';
      console.warn('[weibo] 头像加载失败：', src);
    };
    el.appendChild(img);
  }

  /* ============================================================
     密码保护
     ============================================================ */
  function isUnlocked() {
    try {
      return sessionStorage.getItem(UNLOCK_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function setUnlocked() {
    try {
      sessionStorage.setItem(UNLOCK_KEY, 'true');
    } catch (e) {}
  }

  function showLockOverlay() {
    if (!lockOverlay) return;
    lockOverlay.hidden = false;
    document.body.classList.add('weibo-locked');

    if (passwordInput) {
      passwordInput.value = '';
      window.requestAnimationFrame(function () {
        try { passwordInput.focus(); } catch (e) {}
      });
    }
    if (passwordError) {
      passwordError.hidden = true;
    }
  }

  function hideLockOverlay() {
    if (!lockOverlay) return;
    lockOverlay.hidden = true;
    document.body.classList.remove('weibo-locked');
  }

  function normalizePassword(value) {
    if (value === null || value === undefined) return '';
    /* 关键：全角转半角，再去除首尾空格并转大写 */
    return toHalfWidth(String(value)).replace(/^\s+|\s+$/g, '').toUpperCase();
  }

  function handlePasswordSubmit() {
    if (!passwordInput) return;

    var input = normalizePassword(passwordInput.value);

    if (input === CORRECT_PASSWORD) {
      if (passwordError) passwordError.hidden = true;
      setUnlocked();
      hideLockOverlay();
    } else {
      if (passwordError) passwordError.hidden = false;
      passwordInput.value = '';
      try { passwordInput.focus(); } catch (e) {}
    }
  }

  function bindLockEvents() {
    if (passwordBtn) {
      passwordBtn.addEventListener('click', handlePasswordSubmit);
    }
    if (passwordInput) {
      passwordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handlePasswordSubmit();
        }
      });
    }
  }

  /* ============================================================
     统计数字：粉丝 1 / 关注 5 / 转评赞 0
     ============================================================ */
  function resetProfileStats() {
    var statEls = document.querySelectorAll('.wb-profile-stats .wb-stat');
    if (!statEls || statEls.length < 3) return;

    statEls[0].innerHTML = '<strong>1</strong>粉丝';
    statEls[1].innerHTML = '<strong>5</strong>关注';
    statEls[2].innerHTML = '<strong>0</strong>转评赞';
  }

  /* ============================================================
     创建一条推文卡片
     ============================================================ */
  function createTweetEl(tweet) {
    var accountName = (window.WeiboData && window.WeiboData.accountName) || '关关子君';

    var card = document.createElement('article');
    card.className = 'wb-tweet';

    if (tweet.isWhyTweet === true) {
      card.id = 'why-tweet';
    }

    /* ---------- 推文头像：锚定 avatar42 ---------- */
    var avatar = document.createElement('div');
    avatar.className = 'wb-tweet-avatar';
    setAvatarImage(avatar, ACCOUNT_AVATAR_SRC, accountName);

    var body = document.createElement('div');
    body.className = 'wb-tweet-body';

    var head = document.createElement('div');
    head.className = 'wb-tweet-head';

    var nameEl = document.createElement('span');
    nameEl.className = 'wb-tweet-name';
    nameEl.textContent = accountName;

    var timeEl = document.createElement('span');
    timeEl.className = 'wb-tweet-time';
    timeEl.textContent = tweet.date;

    var fromEl = document.createElement('span');
    fromEl.className = 'wb-tweet-from';
    fromEl.textContent = '来自 围博网页版';

    head.appendChild(nameEl);
    head.appendChild(timeEl);
    head.appendChild(fromEl);

    var textEl = document.createElement('div');
    textEl.className = 'wb-tweet-text';
    textEl.textContent = tweet.content;

    body.appendChild(head);
    body.appendChild(textEl);

    /* ---------- 图片：真实 <img> 加载，失败时回退占位 ---------- */
    if (tweet.image && String(tweet.image).trim() !== '') {
      var imageWrap = document.createElement('div');
      imageWrap.className = 'tweet-image-wrap';

      var img = document.createElement('img');
      img.className = 'tweet-image';
      img.src = tweet.image;
      img.alt = '图片';
      img.loading = 'lazy';

      img.onerror = function () {
        console.warn('图片加载失败，路径：' + tweet.image + '，使用占位图');
        var parent = img.parentNode;
        if (parent) {
          var placeholder = document.createElement('div');
          placeholder.className = 'tweet-image-placeholder';
          placeholder.textContent = '图片加载失败';
          parent.replaceChild(placeholder, img);
        }
      };

      imageWrap.appendChild(img);
      body.appendChild(imageWrap);
    }

    var actions = document.createElement('div');
    actions.className = 'wb-tweet-actions';

    var actionForward = document.createElement('span');
    actionForward.className = 'wb-tweet-action';
    actionForward.innerHTML = '<span class="wb-tweet-action-icon">↻</span>转发';

    var actionComment = document.createElement('span');
    actionComment.className = 'wb-tweet-action';
    actionComment.innerHTML = '<span class="wb-tweet-action-icon">💬</span>评论';

    var actionLike = document.createElement('span');
    actionLike.className = 'wb-tweet-action';
    actionLike.innerHTML = '<span class="wb-tweet-action-icon">♡</span>点赞';

    actions.appendChild(actionForward);
    actions.appendChild(actionComment);
    actions.appendChild(actionLike);

    body.appendChild(actions);

    card.appendChild(avatar);
    card.appendChild(body);
    return card;
  }

  /* ============================================================
     渲染关注推荐列表
     ============================================================ */
  function renderRecommend() {
    if (!recommendList) return;
    recommendList.innerHTML = '';

    for (var i = 0; i < RECOMMEND_USERS.length; i++) {
      (function (u) {
        var li = document.createElement('li');
        li.className = 'wb-recommend-item';

        var avatar = document.createElement('div');
        avatar.className = 'wb-recommend-avatar';
        avatar.style.background = u.color;
        avatar.textContent = u.initial;

        var body = document.createElement('div');
        body.className = 'wb-recommend-body';

        var nameEl = document.createElement('div');
        nameEl.className = 'wb-recommend-name';
        nameEl.textContent = u.name;

        var descEl = document.createElement('div');
        descEl.className = 'wb-recommend-desc';
        descEl.textContent = u.desc;

        body.appendChild(nameEl);
        body.appendChild(descEl);

        var followBtn = document.createElement('button');
        followBtn.type = 'button';
        followBtn.className = 'wb-recommend-follow';
        followBtn.textContent = '+关注';
        followBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          alert('功能暂未开放');
        });

        li.appendChild(avatar);
        li.appendChild(body);
        li.appendChild(followBtn);
        recommendList.appendChild(li);
      })(RECOMMEND_USERS[i]);
    }
  }

  /* ============================================================
     渲染：顶部资料 + 推文列表（按时间正序，最早在最上方）
     ============================================================ */
  function render() {
    window.GameState.get();

    var data = window.WeiboData || {};
    var name = data.accountName || '关关子君';
    var bio = data.bio || '记录一些日常。';
    var tweets = data.tweets || [];

    /* ---------- 头像锚定：关关子君 → avatar42 ---------- */
    setAvatarImage(weiboAvatar, ACCOUNT_AVATAR_SRC, name);
    if (weiboNickname) weiboNickname.textContent = name;
    if (weiboBio) weiboBio.textContent = bio;
    setAvatarImage(topnavAvatar, ACCOUNT_AVATAR_SRC, name);

    /* 统计数字：粉丝 1 / 关注 5 / 转评赞 0 */
    resetProfileStats();

    if (!tweetList) return;
    tweetList.innerHTML = '';
    /* 数据源按日期正序（从早到晚）；页面显示也按正序（最早在最上方） */
    for (var i = 0; i < tweets.length; i++) {
      tweetList.appendChild(createTweetEl(tweets[i]));
    }

    renderRecommend();
  }

  /* ============================================================
     占位交互：左侧分组、标签页、关注按钮、底部链接
     ============================================================ */
  function bindPlaceholders() {
    var sidebarItems = document.querySelectorAll('.wb-sidebar-item');
    for (var i = 0; i < sidebarItems.length; i++) {
      sidebarItems[i].addEventListener('click', function () {
        if (this.classList.contains('active')) return;
        alert('功能暂未开放');
      });
    }

    var tabs = document.querySelectorAll('.wb-tab');
    for (var j = 0; j < tabs.length; j++) {
      tabs[j].addEventListener('click', function () {
        if (this.classList.contains('active')) return;
        alert('功能暂未开放');
      });
    }

    var followBtn = document.querySelector('.wb-follow-btn');
    if (followBtn) {
      followBtn.addEventListener('click', function () {
        alert('功能暂未开放');
      });
    }

    var footerLinks = document.querySelectorAll('.wb-footer-link');
    for (var k = 0; k < footerLinks.length; k++) {
      footerLinks[k].addEventListener('click', function (e) {
        e.preventDefault();
        alert('功能暂未开放');
      });
    }

    var navIcons = document.querySelectorAll('.wb-nav-icon, .wb-nav-avatar');
    for (var m = 0; m < navIcons.length; m++) {
      navIcons[m].addEventListener('click', function () {
        alert('功能暂未开放');
      });
    }

    if (tweetList) {
      tweetList.addEventListener('click', function (e) {
        var target = e.target;
        while (target && target !== tweetList) {
          if (target.classList && target.classList.contains('wb-tweet-action')) {
            alert('功能暂未开放');
            return;
          }
          target = target.parentNode;
        }
      });
    }
  }

  /* ============================================================
     掉落特效（“为什么” + “对不起”）
     ============================================================ */

  var whyObjects = [];
  var whyStackHeights = [];
  var whySpawnTimer = null;
  var whyAnimFrame = null;
  var whyEffectActive = false;
  var whySpawningStopped = false;
  var whyObserver = null;
  var whyResizeHandler = null;
  var whyEffectTriggeredThisSession = false;
  var whyAlternateIndex = 0;

  function setupWhyEffect() {
    if (!whyCanvas || !whyCtx) return;

    if (whyEffectTriggeredThisSession) return;

    var target = document.getElementById('why-tweet');
    if (!target) {
      console.warn('[weibo] 未找到 #why-tweet 元素，跳过掉落特效绑定');
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    whyObserver = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (!entry.isIntersecting) continue;

        if (whyEffectTriggeredThisSession) {
          if (whyObserver) {
            whyObserver.disconnect();
            whyObserver = null;
          }
          return;
        }

        whyEffectTriggeredThisSession = true;

        if (whyObserver) {
          whyObserver.disconnect();
          whyObserver = null;
        }

        startWhyEffect();
        return;
      }
    }, { threshold: 0.3 });

    whyObserver.observe(target);
  }

  function startWhyEffect() {
    if (whyEffectActive) return;
    whyEffectActive = true;
    whySpawningStopped = false;
    whyAlternateIndex = 0;

    resizeWhyCanvas();
    whyObjects = [];
    if (whyCanvas) whyCanvas.classList.add('active');

    if (!whyResizeHandler) {
      whyResizeHandler = function () {
        handleWhyResize();
      };
      window.addEventListener('resize', whyResizeHandler);
    }

    spawnWhyObject();
    whySpawnTimer = window.setInterval(spawnWhyObject, WHY_SPAWN_INTERVAL);

    if (whyAnimFrame === null) {
      whyAnimFrame = window.requestAnimationFrame(whyLoop);
    }
  }

  function handleWhyResize() {
    if (!whyEffectActive || !whyCanvas) return;

    whyCanvas.width = window.innerWidth || 1024;
    whyCanvas.height = window.innerHeight || 768;

    var bucketCount = Math.max(1, Math.ceil(whyCanvas.width / WHY_BUCKET_SIZE));
    var newStack = new Array(bucketCount);
    for (var i = 0; i < bucketCount; i++) newStack[i] = 0;

    for (var j = 0; j < whyObjects.length; j++) {
      var o = whyObjects[j];
      if (!o.settled) continue;
      var bucket = Math.floor(o.x / WHY_BUCKET_SIZE);
      if (bucket < 0) bucket = 0;
      if (bucket >= bucketCount) bucket = bucketCount - 1;
      newStack[bucket] += o.fontSize * WHY_STACK_OVERLAP;
    }

    whyStackHeights = newStack;
  }

  function resizeWhyCanvas() {
    if (!whyCanvas) return;
    var w = window.innerWidth || 1024;
    var h = window.innerHeight || 768;
    whyCanvas.width = w;
    whyCanvas.height = h;

    var bucketCount = Math.max(1, Math.ceil(w / WHY_BUCKET_SIZE));
    whyStackHeights = new Array(bucketCount);
    for (var i = 0; i < bucketCount; i++) {
      whyStackHeights[i] = 0;
    }
  }

  function countFallingObjects() {
    var count = 0;
    for (var i = 0; i < whyObjects.length; i++) {
      if (!whyObjects[i].settled) count++;
    }
    return count;
  }

  function getMaxStackHeight() {
    var maxStack = 0;
    for (var i = 0; i < whyStackHeights.length; i++) {
      if (whyStackHeights[i] > maxStack) maxStack = whyStackHeights[i];
    }
    return maxStack;
  }

  function pickNextWhyText() {
    var text = WHY_TEXTS[whyAlternateIndex % WHY_TEXTS.length];
    whyAlternateIndex++;

    if (Math.random() < 0.05) {
      text = WHY_TEXTS[Math.floor(Math.random() * WHY_TEXTS.length)];
    }
    return text;
  }

  function spawnWhyObject() {
    if (!whyEffectActive || !whyCanvas) return;
    if (whySpawningStopped) return;

    if (whyObjects.length >= WHY_MAX_OBJECTS) {
      stopWhySpawning();
      console.log('停止生成，总掉落物数量:', whyObjects.length);
      return;
    }

    var targetHeight = whyCanvas.height * WHY_STACK_THRESHOLD;
    var currentHeight = getMaxStackHeight();
    if (currentHeight >= targetHeight) {
      console.log('堆积高度:', Math.round(currentHeight), '/ 目标:', Math.round(targetHeight));
      stopWhySpawning();
      console.log('停止生成，总掉落物数量:', whyObjects.length);
      return;
    }

    if (countFallingObjects() >= WHY_MAX_FALLING) {
      return;
    }

    var text = pickNextWhyText();
    var fontSize = WHY_MIN_FONT + Math.random() * (WHY_MAX_FONT - WHY_MIN_FONT);
    var textWidth = fontSize * text.length;
    var maxX = Math.max(1, whyCanvas.width - textWidth);
    var x = Math.random() * maxX;
    var color = WHY_COLORS[Math.floor(Math.random() * WHY_COLORS.length)];
    var vy = WHY_MIN_VY + Math.random() * (WHY_MAX_VY - WHY_MIN_VY);
    var rotation = (Math.random() * 2 - 1) * (WHY_MAX_ROTATION_DEG * Math.PI / 180);

    whyObjects.push({
      x: x,
      y: -fontSize - Math.random() * 60,
      vy: vy,
      fontSize: fontSize,
      color: color,
      rotation: rotation,
      settled: false,
      text: text
    });
  }

  function stopWhySpawning() {
    if (whySpawningStopped) return;
    whySpawningStopped = true;
    if (whySpawnTimer !== null) {
      window.clearInterval(whySpawnTimer);
      whySpawnTimer = null;
    }
  }

  function settleWhyObject(o) {
    if (!whyCanvas) return;

    var canvasH = whyCanvas.height;
    var textW = o.fontSize * (o.text ? o.text.length : 3);
    var bucketCount = whyStackHeights.length;
    if (bucketCount <= 0) return;

    var offsets = [0, -WHY_OFFSET_RANGE, WHY_OFFSET_RANGE,
                   -Math.round(WHY_OFFSET_RANGE / 2),
                   Math.round(WHY_OFFSET_RANGE / 2)];

    var bestX = o.x;
    var bestBucket = -1;
    var bestStack = Infinity;

    for (var i = 0; i < offsets.length; i++) {
      var cx = o.x + offsets[i];
      if (cx < 0) continue;
      if (cx + textW > whyCanvas.width) continue;

      var bucket = Math.floor(cx / WHY_BUCKET_SIZE);
      if (bucket < 0) bucket = 0;
      if (bucket >= bucketCount) bucket = bucketCount - 1;

      var stack = whyStackHeights[bucket];
      if (stack < bestStack) {
        bestStack = stack;
        bestBucket = bucket;
        bestX = cx;
      }
    }

    if (bestBucket < 0) {
      bestX = o.x;
      bestBucket = Math.floor(o.x / WHY_BUCKET_SIZE);
      if (bestBucket < 0) bestBucket = 0;
      if (bestBucket >= bucketCount) bestBucket = bucketCount - 1;
      bestStack = whyStackHeights[bestBucket];
    }

    o.x = bestX;

    var stackTopY = canvasH - bestStack;
    o.y = stackTopY - o.fontSize;
    o.settled = true;
    whyStackHeights[bestBucket] = bestStack + o.fontSize * WHY_STACK_OVERLAP;
  }

  function updateWhyObjects() {
    if (!whyCanvas) return;

    var canvasH = whyCanvas.height;

    for (var i = 0; i < whyObjects.length; i++) {
      var o = whyObjects[i];
      if (o.settled) continue;

      o.y += o.vy;

      var bucket = Math.floor(o.x / WHY_BUCKET_SIZE);
      if (bucket < 0) bucket = 0;
      if (bucket >= whyStackHeights.length) bucket = whyStackHeights.length - 1;

      var stackTopY = canvasH - whyStackHeights[bucket];
      var objectBottom = o.y + o.fontSize;

      if (objectBottom >= stackTopY) {
        settleWhyObject(o);
      }
    }
  }

  function drawWhyObjects() {
    if (!whyCtx || !whyCanvas) return;

    whyCtx.clearRect(0, 0, whyCanvas.width, whyCanvas.height);

    for (var i = 0; i < whyObjects.length; i++) {
      var o = whyObjects[i];
      whyCtx.save();
      whyCtx.translate(o.x, o.y);
      whyCtx.rotate(o.rotation);
      whyCtx.font = o.fontSize + 'px "Microsoft YaHei", sans-serif';
      whyCtx.fillStyle = o.color;
      whyCtx.textBaseline = 'top';
      whyCtx.textAlign = 'left';
      whyCtx.fillText(o.text, 0, 0);
      whyCtx.restore();
    }
  }

  function whyLoop() {
    if (!whyEffectActive) {
      whyAnimFrame = null;
      return;
    }

    if (!document.hidden) {
      updateWhyObjects();
      drawWhyObjects();
    }

    whyAnimFrame = window.requestAnimationFrame(whyLoop);
  }

  /* ============================================================
     初始化
     ============================================================ */
  function init() {
    render();
    bindPlaceholders();

    bindLockEvents();

    if (isUnlocked()) {
      hideLockOverlay();
    } else {
      showLockOverlay();
    }

    setupWhyEffect();
  }

  init();

})();