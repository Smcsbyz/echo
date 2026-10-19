/* ============================================================
   文件路径：js/maker.js
   说明：开发者日志页逻辑（推文流 + 点赞 / 收藏 / 评论）
         推文按时间正序渲染：最早一条在最上方
         本次修正：
           1. 主资料卡圆形头像替换为 avatar44.png
           2. 关注列表弹窗中关关子君头像替换为 avatar42.png
           3. 其余逻辑保持不变
   依赖：js/state.js（window.GameState）
         data/makerData.js（window.MakerData）
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 常量 ---------- */
  var LIKED_KEY = 'makerLikedTweets';
  var COLLECTED_KEY = 'makerCollectedTweets';

  var DISPLAY_AUTHOR = '种下一颗大太阳';
  var AVATAR_TEXT = '阳';
  var AVATAR_SRC = 'assets/avatars/avatar44.png';

  var FOLLOWING_AVATAR_TEXT = '君';
  var FOLLOWING_AVATAR_SRC = 'assets/avatars/avatar42.png';

  var MAX_REPLY_DEPTH = 2;

  /* ---------- DOM 引用 ---------- */
  var tweetFeed = document.getElementById('tweetFeed');
  var emptyTip = document.getElementById('emptyTip');

  /* 关注列表弹窗相关 */
  var followingModal = document.getElementById('followingModal');
  var followingModalOverlay = document.getElementById('followingModalOverlay');
  var followingModalClose = document.getElementById('followingModalClose');
  var followingCountLink = document.getElementById('followingCountLink');

  /* ============================================================
     富文本解析
     - **文字** → <strong>文字</strong>
     - *文字*  → <span class="fake-link">文字</span>
     ============================================================ */
  function parseRichText(text) {
    if (!text) return '';
    var result = escapeHtml(text);
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/\*(.+?)\*/g, '<span class="fake-link">$1</span>');
    return result;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ============================================================
     localStorage 读写工具（点赞 / 收藏状态）
     ============================================================ */
  function getLikedList() {
    try {
      var raw = localStorage.getItem(LIKED_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveLikedList(arr) {
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify(arr));
    } catch (e) {
      console.warn('[maker] 保存点赞状态失败：', e);
    }
  }

  function getCollectedList() {
    try {
      var raw = localStorage.getItem(COLLECTED_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveCollectedList(arr) {
    try {
      localStorage.setItem(COLLECTED_KEY, JSON.stringify(arr));
    } catch (e) {
      console.warn('[maker] 保存收藏状态失败：', e);
    }
  }

  /* ============================================================
     通用头像填充：将元素内文本替换为 <img>，失败时回退为文字
     ============================================================ */
  function setAvatarImage(el, src, alt, fallbackText) {
    if (!el) return;
    var fallback = fallbackText || el.textContent || '';
    el.innerHTML = '';
    el.style.overflow = 'hidden';
    el.style.padding = '0';

    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.className = 'avatar-img';
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.onerror = function () {
      el.innerHTML = '';
      el.textContent = fallback;
      console.warn('[maker] 头像加载失败：', src);
    };
    el.appendChild(img);
  }

  /* ---------- 主资料卡圆形头像 ---------- */
  function setAccountAvatar() {
    var el = document.querySelector('.wb-avatar');
    if (!el) return;
    setAvatarImage(el, AVATAR_SRC, DISPLAY_AUTHOR, AVATAR_TEXT);
  }

  /* ---------- 关注列表弹窗中的关关子君头像 ---------- */
  function setFollowingAvatar() {
    var el = document.querySelector('.following-avatar');
    if (!el) return;
    setAvatarImage(el, FOLLOWING_AVATAR_SRC, '关关子君', FOLLOWING_AVATAR_TEXT);
  }

  /* ============================================================
     创建推文作者头像元素（使用 avatar44）
     ============================================================ */
  function createAuthorAvatar() {
    var avatar = document.createElement('div');
    avatar.className = 'wb-tweet-avatar';
    avatar.style.overflow = 'hidden';
    avatar.style.padding = '0';

    var img = document.createElement('img');
    img.src = AVATAR_SRC;
    img.alt = DISPLAY_AUTHOR;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    img.onerror = function () {
      while (avatar.firstChild) avatar.removeChild(avatar.firstChild);
      avatar.textContent = AVATAR_TEXT;
      console.warn('[maker] 头像加载失败：', AVATAR_SRC);
    };
    avatar.appendChild(img);
    return avatar;
  }

  /* ============================================================
     创建点赞者区域 DOM（仅展示，纯文本）
     ============================================================ */
  function createLikerArea(likers) {
    var area = document.createElement('div');
    area.className = 'tweet-liker';

    for (var i = 0; i < likers.length; i++) {
      var name = likers[i];

      if (i > 0) {
        area.appendChild(document.createTextNode('、'));
      }

      var span = document.createElement('span');
      span.className = 'liker-name';
      span.textContent = name;
      area.appendChild(span);
    }

    var tail = document.createElement('span');
    tail.className = 'liker-text';
    tail.textContent = ' 赞了这条';
    area.appendChild(tail);

    return area;
  }

  /* ============================================================
     创建一条评论 DOM（支持嵌套）
     ============================================================ */
  function createCommentEl(comment, depth) {
    depth = (typeof depth === 'number') ? depth : 0;

    var item = document.createElement('div');
    item.className = 'comment-item' + (depth > 0 ? ' comment-item-nested' : '');

    if (depth > 0) {
      item.style.marginLeft = (depth * 20) + 'px';
    }

    var nameEl = document.createElement('span');
    nameEl.className = 'comment-owner';
    nameEl.textContent = (comment.author || '匿名') + '：';
    item.appendChild(nameEl);

    if (comment.replyTo) {
      var replyToEl = document.createElement('span');
      replyToEl.className = 'comment-reply-to';
      replyToEl.textContent = '回复 ' + comment.replyTo + '：';
      item.appendChild(replyToEl);
    }

    var textEl = document.createElement('span');
    textEl.className = 'comment-text';
    textEl.innerHTML = parseRichText(comment.content || '');
    item.appendChild(textEl);

    if (comment.replies && comment.replies.length > 0 && depth + 1 < MAX_REPLY_DEPTH) {
      var repliesWrap = document.createElement('div');
      repliesWrap.className = 'comment-replies';
      for (var i = 0; i < comment.replies.length; i++) {
        repliesWrap.appendChild(createCommentEl(comment.replies[i], depth + 1));
      }
      item.appendChild(repliesWrap);
    }

    return item;
  }

  /* ============================================================
     创建一条推文卡片
     ============================================================ */
  function createTweetEl(tweet) {
    var likedList = getLikedList();
    var collectedList = getCollectedList();
    var isLiked = likedList.indexOf(tweet.id) !== -1;
    var isCollected = collectedList.indexOf(tweet.id) !== -1;

    var card = document.createElement('article');
    card.className = 'wb-tweet';

    var avatar = createAuthorAvatar();

    var body = document.createElement('div');
    body.className = 'wb-tweet-body';

    var head = document.createElement('div');
    head.className = 'wb-tweet-head';

    var nameEl = document.createElement('span');
    nameEl.className = 'wb-tweet-name';
    nameEl.textContent = DISPLAY_AUTHOR;

    var dateEl = document.createElement('span');
    dateEl.className = 'wb-tweet-date';
    dateEl.textContent = tweet.date;

    var fromEl = document.createElement('span');
    fromEl.className = 'wb-tweet-from';
    fromEl.textContent = '来自 围博网页版';

    head.appendChild(nameEl);
    head.appendChild(dateEl);
    head.appendChild(fromEl);

    var textEl = document.createElement('div');
    textEl.className = 'wb-tweet-text';
    textEl.innerHTML = parseRichText(tweet.content || '');

    var actions = document.createElement('div');
    actions.className = 'wb-tweet-actions';

    var likeBtn = document.createElement('button');
    likeBtn.type = 'button';
    likeBtn.className = 'wb-tweet-action like-btn' + (isLiked ? ' active' : '');
    likeBtn.innerHTML = '<span class="wb-tweet-action-icon">👍</span>' + tweet.likes;
    likeBtn.addEventListener('click', function () {
      toggleLike(tweet, likeBtn);
    });

    var commentBtn = document.createElement('button');
    commentBtn.type = 'button';
    commentBtn.className = 'wb-tweet-action comment-btn';
    commentBtn.innerHTML = '<span class="wb-tweet-action-icon">💬</span>评论';

    var collectBtn = document.createElement('button');
    collectBtn.type = 'button';
    collectBtn.className = 'wb-tweet-action collect-btn' + (isCollected ? ' active' : '');
    collectBtn.innerHTML = '<span class="wb-tweet-action-icon">⭐</span>' + tweet.collects;
    collectBtn.addEventListener('click', function () {
      toggleCollect(tweet, collectBtn);
    });

    actions.appendChild(likeBtn);
    actions.appendChild(commentBtn);
    actions.appendChild(collectBtn);

    var likerArea = createLikerArea(tweet.likers || []);

    var commentList = document.createElement('div');
    commentList.className = 'comment-list';

    var npcComments = tweet.npcComments || [];
    for (var i = 0; i < npcComments.length; i++) {
      commentList.appendChild(createCommentEl(npcComments[i], 0));
    }

    if (npcComments.length === 0) {
      var emptyHint = document.createElement('div');
      emptyHint.className = 'comment-empty';
      emptyHint.textContent = '暂无评论';
      commentList.appendChild(emptyHint);
    }

    var commentInputArea = document.createElement('div');
    commentInputArea.className = 'comment-input-area';
    commentInputArea.hidden = true;

    var commentForm = document.createElement('div');
    commentForm.className = 'comment-form';

    var commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.className = 'comment-input';
    commentInput.placeholder = '写下你的评论……';

    var postBtn = document.createElement('button');
    postBtn.type = 'button';
    postBtn.className = 'comment-post-btn';
    postBtn.textContent = '发布';

    postBtn.addEventListener('click', function () {
      var text = commentInput.value.trim();
      if (text === '') {
        return;
      }

      var emptyNode = commentList.querySelector('.comment-empty');
      if (emptyNode) {
        commentList.removeChild(emptyNode);
      }

      commentList.appendChild(createCommentEl({ author: '我', content: text }, 0));
      commentInput.value = '';
    });

    commentInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        postBtn.click();
      }
    });

    commentForm.appendChild(commentInput);
    commentForm.appendChild(postBtn);
    commentInputArea.appendChild(commentForm);

    commentBtn.addEventListener('click', function () {
      commentInputArea.hidden = !commentInputArea.hidden;
      if (!commentInputArea.hidden) {
        commentInput.focus();
      }
    });

    body.appendChild(head);
    body.appendChild(textEl);
    body.appendChild(actions);
    body.appendChild(likerArea);
    body.appendChild(commentList);
    body.appendChild(commentInputArea);

    card.appendChild(avatar);
    card.appendChild(body);
    return card;
  }

  /* ============================================================
     点赞 / 收藏切换
     ============================================================ */
  function toggleLike(tweet, btn) {
    var likedList = getLikedList();
    var idx = likedList.indexOf(tweet.id);
    var isLiked = idx !== -1;

    if (isLiked) {
      likedList.splice(idx, 1);
      tweet.likes = Math.max(0, tweet.likes - 1);
      btn.classList.remove('active');
    } else {
      likedList.push(tweet.id);
      tweet.likes = tweet.likes + 1;
      btn.classList.add('active');
    }

    btn.innerHTML = '<span class="wb-tweet-action-icon">👍</span>' + tweet.likes;
    saveLikedList(likedList);
  }

  function toggleCollect(tweet, btn) {
    var collectedList = getCollectedList();
    var idx = collectedList.indexOf(tweet.id);
    var isCollected = idx !== -1;

    if (isCollected) {
      collectedList.splice(idx, 1);
      tweet.collects = Math.max(0, tweet.collects - 1);
      btn.classList.remove('active');
    } else {
      collectedList.push(tweet.id);
      tweet.collects = tweet.collects + 1;
      btn.classList.add('active');
    }

    btn.innerHTML = '<span class="wb-tweet-action-icon">⭐</span>' + tweet.collects;
    saveCollectedList(collectedList);
  }

  /* ============================================================
     关注列表弹窗
     ============================================================ */
  function openFollowingModal() {
    if (!followingModal) return;
    followingModal.hidden = false;
  }

  function closeFollowingModal() {
    if (!followingModal) return;
    followingModal.hidden = true;
  }

  /* ============================================================
     占位交互：左侧分组、标签页、关注按钮、推荐关注、底部链接、顶部图标
     ============================================================ */
  function bindPlaceholders() {
    var placeholders = document.querySelectorAll('[data-placeholder="1"]');
    for (var i = 0; i < placeholders.length; i++) {
      placeholders[i].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        alert('功能暂未开放');
      });
    }

    var navIcons = document.querySelectorAll('.wb-nav-icon, .wb-nav-avatar');
    for (var j = 0; j < navIcons.length; j++) {
      navIcons[j].addEventListener('click', function () {
        alert('功能暂未开放');
      });
    }
  }

  /* ============================================================
     关注数链接 / 弹窗事件
     ============================================================ */
  function bindFollowingModal() {
    if (followingCountLink) {
      followingCountLink.addEventListener('click', function (e) {
        e.preventDefault();
        openFollowingModal();
      });
    }

    if (followingModalClose) {
      followingModalClose.addEventListener('click', closeFollowingModal);
    }

    if (followingModalOverlay) {
      followingModalOverlay.addEventListener('click', closeFollowingModal);
    }

    var viewBtns = document.querySelectorAll('.following-view-btn');
    for (var k = 0; k < viewBtns.length; k++) {
      viewBtns[k].addEventListener('click', function () {
        closeFollowingModal();
      });
    }
  }

  /* ============================================================
     渲染推文流（按时间正序：最早一条在最上方）
     ============================================================ */
  function renderTweets() {
    tweetFeed.innerHTML = '';

    var tweets = (window.MakerData && window.MakerData.devlogTweets) || [];

    if (tweets.length === 0) {
      emptyTip.hidden = false;
      return;
    }

    emptyTip.hidden = true;

    for (var i = 0; i < tweets.length; i++) {
      tweetFeed.appendChild(createTweetEl(tweets[i]));
    }
  }

  /* ============================================================
     初始化
     ============================================================ */
  function init() {
    var state = window.GameState.get();
    if (!state.makerUnlocked) {
      window.GameState.update({ makerUnlocked: true });
      console.log('makerUnlocked 已写入');
    }

    /* 替换主资料卡圆形头像与关注列表弹窗头像 */
    setAccountAvatar();
    setFollowingAvatar();

    renderTweets();
    bindPlaceholders();
    bindFollowingModal();
  }

  init();

})();