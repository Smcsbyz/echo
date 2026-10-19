/* ============================================================
   文件路径：js/forum.js
   说明：给力GAME交流站逻辑
         本次修正：
           1. applyThreadFilter 中统一剔除 post5，
              防止 post5（车祸新闻）出现在子版块列表中；
              post5 仍然可以通过搜索命中
           2. 其余逻辑保持不变
   依赖：js/state.js（window.GameState）
         data/searchData.js（window.SearchData）
   ============================================================ */
(function () {
  'use strict';

  var PAGE_SIZE = 10;
  var DISPLAY_PAGES = 7;
  var SINGLE_PAGE_BOARDS = ['站务公告', '新手指南'];

  var NON_CLICKABLE_BOARDS = ['同人创作'];

  var DEFAULT_REPLY_COUNT = 1;
  var DEFAULT_VIEW_COUNT = 100;

  var MY_POST_IDS = ['post3', 'post2', 'post1'];

  var AVATAR_BASE_PATH = 'assets/avatars/';
  var AVATAR_COUNT = 50;
  var RESERVED_AVATAR_INDEXES = { 41: true, 42: true, 43: true, 44: true, 45: true, 46: true };

  var ANCHORED_AVATARS = {
    '种下一颗大太阳': AVATAR_BASE_PATH + 'avatar44.png',
    '关关子君': AVATAR_BASE_PATH + 'avatar42.png',
    '锟斤拷锟斤拷锟斤拷': AVATAR_BASE_PATH + 'avatar41.png',
    '许云': AVATAR_BASE_PATH + 'avatar41.png',
    '匿名': AVATAR_BASE_PATH + 'avatar41.png'
  };

  var avatarUsageCount = {};

  var RED_THEME_SEARCH_KEYWORDS = ['郑怡君', '2024年9月15日'];
  var RED_THEME_POST_IDS = ['post6', 'post7'];

  var HOME_HIDDEN_POST_IDS = [
    'post1', 'post2', 'post3', 'post4', 'post5', 'post6', 'post7',
    'post8', 'post9', 'post10', 'post11', 'post12'
  ];

  var HOME_HIDDEN_TITLE_KEYWORDS = [
    '我的小屋', '郑怡君', '用户96234', '许阳'
  ];

  var FORUM_ACCOUNT = 'xy0806@ww.com';
  var SECURITY_ANSWERS = ['鸢尾花', '鸢尾'];

  var BOARD_FILTERS = ['全部', '公告', '教程', '资源', '讨论', '原创', '分享'];

  var SESSION_KEY_VIEWED_ZHENG = 'viewedZhengPosts';
  var SESSION_KEY_LAST_SEARCH_KEYWORD = 'lastSearchKeyword';
  var SESSION_KEY_LAST_SEARCH_RESULTS = 'lastSearchResults';

  var REPLY_INDENT_PX = 40;
  var MAX_REPLY_DEPTH = 2;

  var LINK_PLACEHOLDER = '\u0001__NEWS_LINK__\u0001';

  var GARBLED_UNIT = '锟斤拷';

  var currentView = 'home';
  var currentBoardId = null;
  var currentPostId = null;
  var currentPostBoardId = null;
  var currentPostFromView = null;
  var currentPage = 1;
  var currentThreadsFiltered = [];
  var lastSearchKeyword = '';

  var currentTheme = 'blue';

  var currentCommentsData = null;
  var currentFallbackThread = null;
  var currentPostAvatarMap = null;

  var post56Decoded = false;
  var post56Active = false;
  var garbledCache = new WeakMap();

  function getDynamicDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function resolvePostDate(post) {
    if (!post) return '';
    if (post.date === 'DYNAMIC_DATE') {
      return getDynamicDate();
    }
    return post.date || '';
  }

  function isDynamicDatePost(post) {
    return !!(post && post.date === 'DYNAMIC_DATE');
  }

  var viewHome = document.getElementById('viewHome');
  var viewBoard = document.getElementById('viewBoard');
  var viewPost = document.getElementById('viewPost');
  var viewSearch = document.getElementById('viewSearch');
  var viewNoResult = document.getElementById('viewNoResult');
  var viewMyPosts = document.getElementById('myPostsView');

  var searchInput = document.getElementById('searchInput');
  var searchBtn = document.getElementById('searchBtn');
  var navMyLink = document.getElementById('navMyLink');
  var navMyPostsLink = document.getElementById('navMyPostsLink');
  var forumWelcome = document.getElementById('forumWelcome');
  var backHomeBtn = document.getElementById('backHomeBtn');
  var resetStateBtn = document.getElementById('resetStateBtn');

  var hotPostsList = document.getElementById('hotPostsList');
  var boardsContainer = document.getElementById('boardsContainer');

  var boardBreadcrumb = document.getElementById('boardBreadcrumb');
  var boardTitle = document.getElementById('boardTitle');
  var boardFilterTabs = document.getElementById('boardFilterTabs');
  var threadList = document.getElementById('threadList');
  var boardPager = document.getElementById('boardPager');
  var newThreadBtnBoard = document.getElementById('newThreadBoard');

  var postBreadcrumb = document.getElementById('postBreadcrumb');
  var postMainTitle = document.getElementById('postMainTitle');
  var postMainDate = document.getElementById('postMainDate');
  var postMainContent = document.getElementById('postMainContent');
  var postAuthorAvatar = document.getElementById('postAuthorAvatar');
  var postAuthorName = document.getElementById('postAuthorName');
  var postAuthorLevelText = document.getElementById('postAuthorLevelText');
  var postAuthorPosts = document.getElementById('postAuthorPosts');
  var postAuthorPoints = document.getElementById('postAuthorPoints');
  var postAuthorUid = document.getElementById('postAuthorUid');
  var sendMsgBtn = document.getElementById('sendMsgBtn');
  var replyList = document.getElementById('replyList');
  var newThreadBtnPost = document.getElementById('newThreadBtnPost');
  var replyBtnPost = document.getElementById('replyBtnPost');

  var myPostsBreadcrumb = document.getElementById('myPostsBreadcrumb');
  var myPostsList = document.getElementById('myPostsList');

  var searchResultsList = document.getElementById('searchResultsList');
  var searchBreadcrumb = document.getElementById('searchBreadcrumb');
  var noResultBreadcrumb = document.getElementById('noResultBreadcrumb');
  var backToSearchBtn = document.getElementById('backToSearchBtn');

  var loginModal = document.getElementById('loginModal');
  var loginCloseBtn = document.getElementById('loginCloseBtn');
  var usernameInput = document.getElementById('usernameInput');
  var passwordInput = document.getElementById('passwordInput');
  var passwordField = document.getElementById('passwordField');
  var loginBtn = document.getElementById('loginBtn');
  var loginMessage = document.getElementById('loginMessage');
  var forgotPasswordLink = document.getElementById('forgotPasswordLink');
  var securityQuestionArea = document.getElementById('securityQuestionArea');
  var securityAnswerInput = document.getElementById('securityAnswerInput');
  var submitSecurityBtn = document.getElementById('submitSecurityBtn');
  var backToLoginLink = document.getElementById('backToLoginLink');

  var testAccidentBtn = document.getElementById('testAccidentBtn');
  var testStatus = document.getElementById('testStatus');

  var adLeft = document.getElementById('adLeft');
  var adRight = document.getElementById('adRight');

  function removeSignatureArea() {
    var sign = document.querySelector('.post-main-sign');
    if (sign && sign.parentNode) {
      sign.parentNode.removeChild(sign);
    }
  }

  function generateGarbledText(length) {
    var result = '';
    for (var i = 0; i < length; i++) {
      result += GARBLED_UNIT;
    }
    return result;
  }

  function garbleAllText() {
    if (!document.body) return;

    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentElement;
      if (!parent) continue;
      var tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') continue;
      if (parent.classList && parent.classList.contains('dynamic-date')) continue;
      var raw = node.nodeValue;
      if (!raw || !raw.trim()) continue;
      if (!garbledCache.has(node)) {
        garbledCache.set(node, raw);
      }
      var trimmed = raw.trim();
      var count = Math.max(1, Math.ceil(trimmed.length / 3));
      var garbled = GARBLED_UNIT.repeat(count);
      node.nodeValue = raw.replace(trimmed, garbled);
    }

    var placeholderEls = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    for (var j = 0; j < placeholderEls.length; j++) {
      var el = placeholderEls[j];
      if (!garbledCache.has(el)) {
        garbledCache.set(el, el.placeholder || '');
      }
      var origLen = (el.placeholder || '').length;
      var count2 = Math.max(1, Math.ceil(origLen / 3));
      el.placeholder = GARBLED_UNIT.repeat(count2);
    }
  }

  function decodeAllText() {
    if (!document.body) return;

    var oldCache = garbledCache;
    garbledCache = new WeakMap();

    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var node;
    while ((node = walker.nextNode())) {
      if (oldCache.has(node)) {
        node.nodeValue = oldCache.get(node);
      }
    }

    var placeholderEls = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    for (var j = 0; j < placeholderEls.length; j++) {
      var el = placeholderEls[j];
      if (oldCache.has(el)) {
        el.placeholder = oldCache.get(el);
      }
    }
  }

  function isHomeHiddenPost(post) {
    if (!post) return true;
    if (HOME_HIDDEN_POST_IDS.indexOf(post.id) !== -1) return true;
    var title = post.title || '';
    for (var i = 0; i < HOME_HIDDEN_TITLE_KEYWORDS.length; i++) {
      if (title.indexOf(HOME_HIDDEN_TITLE_KEYWORDS[i]) !== -1) return true;
    }
    return false;
  }

  function isHomeHiddenTitle(title) {
    if (!title) return false;
    for (var i = 0; i < HOME_HIDDEN_TITLE_KEYWORDS.length; i++) {
      if (title.indexOf(HOME_HIDDEN_TITLE_KEYWORDS[i]) !== -1) return true;
    }
    return false;
  }

  function getPostById(postId) {
    if (!postId) return null;
    if (!window.SearchData || !window.SearchData.posts) return null;
    return window.SearchData.posts[postId] || null;
  }

  function isNonClickablePost(postData) {
    if (!postData) return false;
    return NON_CLICKABLE_BOARDS.indexOf(postData.board) !== -1;
  }

  function getPostReplyCount(postData) {
    if (!postData) return DEFAULT_REPLY_COUNT;
    var v = Number(postData.replyCount);
    if (!isFinite(v) || v <= 0) return DEFAULT_REPLY_COUNT;
    return Math.floor(v);
  }

  function getPostViewCount(postData) {
    if (!postData) return DEFAULT_VIEW_COUNT;
    var v = Number(postData.viewCount);
    if (!isFinite(v) || v <= 0) return DEFAULT_VIEW_COUNT;
    return Math.floor(v);
  }

  function parseRichText(text) {
    if (!text) return '';
    var result = escapeHtml(text);
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/\*网页链接\*/g, LINK_PLACEHOLDER);
    result = result.replace(/\*(.+?)\*/g, '<span class="fake-link">$1</span>');
    var linkHtml = '<a href="news.html" target="_blank" rel="noopener noreferrer" class="post-link">网页链接</a>';
    while (result.indexOf(LINK_PLACEHOLDER) !== -1) {
      result = result.replace(LINK_PLACEHOLDER, linkHtml);
    }
    return result;
  }

  function hashNameToHue(name) {
    if (!name) return 200;
    var h = 0;
    for (var i = 0; i < name.length; i++) {
      h = (h * 31 + name.charCodeAt(i)) % 360;
    }
    return h;
  }

  function extractAvatarIndex(path) {
    if (!path) return 0;
    var match = String(path).match(/avatar(\d+)\.png/);
    if (match) return parseInt(match[1], 10);
    return 0;
  }

  function getAvatar(username) {
    var name = username || '';
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) % 100000;
    }
    var pool = [];
    for (var j = 1; j <= AVATAR_COUNT; j++) {
      if (RESERVED_AVATAR_INDEXES[j]) continue;
      pool.push(j);
    }
    var index = pool[Math.abs(hash) % pool.length];
    return AVATAR_BASE_PATH + 'avatar' + index + '.png';
  }

  function pickAvatarIndex(usedInPost) {
    usedInPost = usedInPost || {};
    var pool = [];
    for (var i = 1; i <= AVATAR_COUNT; i++) {
      if (RESERVED_AVATAR_INDEXES[i]) continue;
      if (usedInPost[i]) continue;
      pool.push(i);
    }
    if (pool.length === 0) {
      for (var j = 1; j <= AVATAR_COUNT; j++) {
        if (RESERVED_AVATAR_INDEXES[j]) continue;
        pool.push(j);
      }
    }
    pool.sort(function (a, b) {
      return (avatarUsageCount[a] || 0) - (avatarUsageCount[b] || 0);
    });
    var topN = Math.min(5, pool.length);
    var pick = pool[Math.floor(Math.random() * topN)];
    avatarUsageCount[pick] = (avatarUsageCount[pick] || 0) + 1;
    usedInPost[pick] = true;
    return pick;
  }

  function collectPostParticipants(postData) {
    if (!postData) return [];
    var users = [];
    var seen = {};

    function add(name) {
      if (!name) return;
      if (seen[name]) return;
      seen[name] = true;
      users.push(name);
    }

    add(postData.author);

    function walk(list) {
      if (!list || !list.length) return;
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (!c) continue;
        add(c.author);
        if (c.replies && c.replies.length > 0) {
          walk(c.replies);
        }
      }
    }
    walk(postData.comments);

    return users;
  }

  function getPostAvatars(post, participants) {
    var usedInPost = {};
    var avatarMap = {};

    for (var i = 0; i < participants.length; i++) {
      var u = participants[i];
      if (ANCHORED_AVATARS[u]) {
        var idx = extractAvatarIndex(ANCHORED_AVATARS[u]);
        if (idx) usedInPost[idx] = true;
        continue;
      }
      avatarMap[u] = pickAvatarIndex(usedInPost);
    }
    return avatarMap;
  }

  function buildPostAvatarMap(postData) {
    var users = collectPostParticipants(postData);
    if (!users.length) return {};
    return getPostAvatars(postData, users);
  }

  function getPostAvatarPath(username) {
    if (!username) username = '';
    if (ANCHORED_AVATARS[username]) {
      return ANCHORED_AVATARS[username];
    }
    if (currentPostAvatarMap &&
        Object.prototype.hasOwnProperty.call(currentPostAvatarMap, username) &&
        currentPostAvatarMap[username]) {
      return AVATAR_BASE_PATH + 'avatar' + currentPostAvatarMap[username] + '.png';
    }
    return getAvatar(username);
  }

  function createAvatarFallback(name, className) {
    var hue = hashNameToHue(name);
    var el = document.createElement('div');
    el.className = className || 'comment-avatar';
    el.style.background = 'hsl(' + hue + ', 60%, 70%)';
    el.textContent = name ? name.charAt(0) : '?';
    return el;
  }

  function createAvatarImg(name, className) {
    var img = document.createElement('img');
    img.className = className;
    img.src = getPostAvatarPath(name);
    img.alt = name || '';
    img.loading = 'lazy';
    img.onerror = function () {
      var fallback = createAvatarFallback(name, className);
      if (img.parentNode) {
        img.parentNode.replaceChild(fallback, img);
      }
    };
    return img;
  }

  function getViewedZhengPosts() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY_VIEWED_ZHENG);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function addViewedZhengPost(postId) {
    if (!postId) return;
    var arr = getViewedZhengPosts();
    if (arr.indexOf(postId) === -1) {
      arr.push(postId);
      try {
        sessionStorage.setItem(SESSION_KEY_VIEWED_ZHENG, JSON.stringify(arr));
      } catch (e) {}
    }
  }

  function saveSearchState(keyword, postIds) {
    try {
      sessionStorage.setItem(SESSION_KEY_LAST_SEARCH_KEYWORD, keyword || '');
      sessionStorage.setItem(
        SESSION_KEY_LAST_SEARCH_RESULTS,
        JSON.stringify(Array.isArray(postIds) ? postIds : [])
      );
    } catch (e) {}
  }

  function restoreSearchState() {
    try {
      var kw = sessionStorage.getItem(SESSION_KEY_LAST_SEARCH_KEYWORD) || '';
      var idsRaw = sessionStorage.getItem(SESSION_KEY_LAST_SEARCH_RESULTS) || '[]';
      var ids = JSON.parse(idsRaw);
      return { keyword: kw, ids: Array.isArray(ids) ? ids : [] };
    } catch (e) {
      return { keyword: '', ids: [] };
    }
  }

  function setTheme(isRed) {
    var newTheme = isRed ? 'red' : 'blue';
    currentTheme = newTheme;
    if (isRed) document.body.classList.add('theme-red');
    else document.body.classList.remove('theme-red');
  }

  function isRedTheme() {
    return currentTheme === 'red';
  }

  function hideAllViews() {
    viewHome.hidden = true;
    viewBoard.hidden = true;
    viewPost.hidden = true;
    viewSearch.hidden = true;
    viewNoResult.hidden = true;
    if (viewMyPosts) viewMyPosts.hidden = true;
  }

  function showView(name) {
    if (post56Active && name !== 'post') {
      if (!post56Decoded) {
        decodeAllText();
      }
      document.body.classList.remove('theme-red');
      document.body.classList.remove('post56-active');
      currentTheme = 'blue';
      post56Active = false;
    }

    hideAllViews();
    currentView = name;

    if (name === 'home') viewHome.hidden = false;
    else if (name === 'board') viewBoard.hidden = false;
    else if (name === 'post') viewPost.hidden = false;
    else if (name === 'search') viewSearch.hidden = false;
    else if (name === 'noResult') viewNoResult.hidden = false;
    else if (name === 'myPosts' && viewMyPosts) viewMyPosts.hidden = false;

    window.scrollTo(0, 0);
  }

  function handleHashNavigation() {
    var hash = '';
    try {
      hash = (window.location.hash || '').replace('#', '');
    } catch (e) {
      hash = '';
    }
    if (!hash) {
      if (currentView !== 'home') renderHome();
      return;
    }
    var info = findBoard(hash);
    if (info) {
      if (currentBoardId !== hash || currentView !== 'board') {
        enterBoard(hash, true);
      }
    }
  }

  function handleBackHome() {
    if (searchInput) searchInput.value = '';
    lastSearchKeyword = '';
    currentPostId = null;
    currentBoardId = null;
    if (loginModal && !loginModal.hidden) {
      loginModal.hidden = true;
      loginMessage.textContent = '';
    }
    renderHome();
  }

  function handleResetState() {
    var ok = window.confirm('确定重置所有状态？这将清除所有游戏进度。');
    if (!ok) return;
    if (window.GameState && typeof window.GameState.resetAll === 'function') {
      window.GameState.resetAll();
    } else {
      try {
        localStorage.removeItem('gameState');
      } catch (e) {}
      try { sessionStorage.clear(); } catch (e) {}
    }
    window.location.href = 'forum.html';
  }

  function initPlaceholders() {
    var placeholderLinks = document.querySelectorAll('[data-placeholder="1"]');
    for (var i = 0; i < placeholderLinks.length; i++) {
      placeholderLinks[i].addEventListener('click', function (e) {
        e.preventDefault();
        /* 静默处理：不弹出提示 */
      });
    }

    if (newThreadBtnBoard) {
      newThreadBtnBoard.addEventListener('click', function () { /* 静默 */ });
    }
    if (newThreadBtnPost) {
      newThreadBtnPost.addEventListener('click', function () { /* 静默 */ });
    }
    if (replyBtnPost) {
      replyBtnPost.addEventListener('click', function () { /* 静默 */ });
    }
    if (sendMsgBtn) {
      sendMsgBtn.addEventListener('click', function () { /* 静默 */ });
    }

    if (adLeft) {
      adLeft.addEventListener('click', function () { alert('广告位招租中，请联系站长'); });
    }
    if (adRight) {
      adRight.addEventListener('click', function () { alert('广告位招租中，请联系站长'); });
    }

    if (backHomeBtn) backHomeBtn.addEventListener('click', handleBackHome);
    if (resetStateBtn) resetStateBtn.addEventListener('click', handleResetState);
  }

  function createBreadcrumbItem(text, handler) {
    if (handler) {
      var a = document.createElement('a');
      a.href = '#';
      a.textContent = text;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
      return a;
    } else {
      var span = document.createElement('span');
      span.className = 'breadcrumb-current';
      span.textContent = text;
      return span;
    }
  }

  function appendBreadcrumbSeparator(container) {
    container.appendChild(document.createTextNode(' > '));
  }

  function buildBoardBreadcrumb(info) {
    if (!boardBreadcrumb) return;
    boardBreadcrumb.innerHTML = '';
    boardBreadcrumb.appendChild(createBreadcrumbItem('论坛', function () { renderHome(); }));
    appendBreadcrumbSeparator(boardBreadcrumb);
    boardBreadcrumb.appendChild(createBreadcrumbItem(info.group.name, function () { renderHome(); }));
    appendBreadcrumbSeparator(boardBreadcrumb);
    boardBreadcrumb.appendChild(createBreadcrumbItem(info.forum.name, null));
  }

  function buildPostBreadcrumbFromBoard(info, title) {
    if (!postBreadcrumb) return;
    postBreadcrumb.innerHTML = '';
    postBreadcrumb.appendChild(createBreadcrumbItem('论坛', function () { renderHome(); }));
    appendBreadcrumbSeparator(postBreadcrumb);
    postBreadcrumb.appendChild(createBreadcrumbItem(info.group.name, function () { renderHome(); }));
    appendBreadcrumbSeparator(postBreadcrumb);
    postBreadcrumb.appendChild(createBreadcrumbItem(info.forum.name, function () { enterBoard(info.forum.id); }));
    appendBreadcrumbSeparator(postBreadcrumb);
    postBreadcrumb.appendChild(createBreadcrumbItem(title, null));
  }

  function buildPostBreadcrumbFromSearch(title) {
    if (!postBreadcrumb) return;
    postBreadcrumb.innerHTML = '';
    postBreadcrumb.appendChild(createBreadcrumbItem('论坛', function () { renderHome(); }));
    appendBreadcrumbSeparator(postBreadcrumb);
    postBreadcrumb.appendChild(createBreadcrumbItem('搜索结果', function () { renderSearchResultsFromSaved(); }));
    appendBreadcrumbSeparator(postBreadcrumb);
    postBreadcrumb.appendChild(createBreadcrumbItem(title, null));
  }

  function buildPostBreadcrumbFromMyPosts(title) {
    if (!postBreadcrumb) return;
    postBreadcrumb.innerHTML = '';
    postBreadcrumb.appendChild(createBreadcrumbItem('论坛', function () { renderHome(); }));
    appendBreadcrumbSeparator(postBreadcrumb);
    postBreadcrumb.appendChild(createBreadcrumbItem('我的发帖', function () { handleMyPostsClick(); }));
    appendBreadcrumbSeparator(postBreadcrumb);
    postBreadcrumb.appendChild(createBreadcrumbItem(title, null));
  }

  function createHotPostItem(post, postId) {
    var li = document.createElement('li');

    var title = document.createElement('a');
    title.className = 'hot-title';
    title.href = '#';
    title.textContent = post.title;
    title.addEventListener('click', function (e) {
      e.preventDefault();
      enterPost(postId, null);
    });

    var date = document.createElement('span');
    date.className = 'hot-date';
    if (isDynamicDatePost(post)) {
      date.classList.add('dynamic-date');
    }
    date.textContent = resolvePostDate(post);

    li.appendChild(title);
    li.appendChild(date);
    return li;
  }

  function renderHotPosts() {
    if (!hotPostsList) return;
    hotPostsList.innerHTML = '';

    var hotIds = (window.SearchData && window.SearchData.hotPosts) || [];
    var postsMap = (window.SearchData && window.SearchData.posts) || {};

    for (var i = 0; i < hotIds.length; i++) {
      (function (id) {
        var post = postsMap[id];
        if (!post) return;
        if (isHomeHiddenPost(post)) return;
        hotPostsList.appendChild(createHotPostItem(post, post.id));
      })(hotIds[i]);
    }

    var state = window.GameState ? window.GameState.get() : null;
    if (state && state.goodEndingSeen === true) {
      var post56 = postsMap['post56'];
      if (post56) {
        hotPostsList.appendChild(createHotPostItem(post56, 'post56'));
      }
    }
  }

  function renderBoards() {
    if (!boardsContainer) return;
    boardsContainer.innerHTML = '';
    var boards = (window.SearchData && window.SearchData.boards) || [];
    for (var g = 0; g < boards.length; g++) {
      var group = boards[g];
      var groupEl = document.createElement('div');
      groupEl.className = 'board-group';
      var header = document.createElement('div');
      header.className = 'board-group-header';
      header.textContent = group.name;
      groupEl.appendChild(header);

      var forums = group.forums || [];
      for (var f = 0; f < forums.length; f++) {
        (function (forum) {
          var item = document.createElement('div');
          item.className = 'board-item';

          var icon = document.createElement('div');
          icon.className = 'board-icon';
          icon.style.background = forum.color || '#8a6a52';
          icon.textContent = forum.iconText || forum.name.charAt(0);

          var info = document.createElement('div');
          info.className = 'board-info';

          var nameEl = document.createElement('div');
          nameEl.className = 'board-name';

          var nameLink = document.createElement('a');
          nameLink.href = '#' + forum.id;
          nameLink.textContent = forum.name + (forum.today ? '（' + forum.today + '）' : '');
          nameLink.setAttribute('data-board-id', forum.id);
          nameEl.appendChild(nameLink);

          var metaEl = document.createElement('div');
          metaEl.className = 'board-meta';
          metaEl.textContent = '版主：' + (forum.moderator || '暂无');

          info.appendChild(nameEl);
          info.appendChild(metaEl);

          var statsEl = document.createElement('div');
          statsEl.className = 'board-stats';
          statsEl.textContent = '主题: ' + (forum.threads || 0) + ' / 帖数: ' + (forum.posts || 0);

          var lastEl = document.createElement('div');
          lastEl.className = 'board-last';

          var lastTitleText = forum.lastTitle || '暂无';
          if (isHomeHiddenTitle(lastTitleText)) {
            lastTitleText = '暂无帖子';
          }

          var lastTitle = document.createElement('a');
          lastTitle.className = 'board-last-title';
          lastTitle.href = '#';
          lastTitle.textContent = lastTitleText;
          lastTitle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            /* 静默处理：不弹出提示 */
          });

          var lastDate = document.createElement('div');
          lastDate.className = 'board-last-date';
          lastDate.textContent = (forum.lastAuthor || '') + (forum.lastDate ? ' · ' + forum.lastDate : '');

          lastEl.appendChild(lastTitle);
          lastEl.appendChild(lastDate);

          item.appendChild(icon);
          item.appendChild(info);
          item.appendChild(statsEl);
          item.appendChild(lastEl);

          item.addEventListener('click', function (e) {
            if (e.target && e.target.closest &&
                e.target.closest('.board-last-title')) {
              return;
            }
            e.preventDefault();
            enterBoard(forum.id);
          });

          groupEl.appendChild(item);
        })(forums[f]);
      }
      boardsContainer.appendChild(groupEl);
    }
  }

  function renderHome() {
    setTheme(false);
    renderHotPosts();
    renderBoards();
    showView('home');
    try {
      if (window.location.hash) {
        history.replaceState(
          null, '',
          window.location.pathname + window.location.search
        );
      }
    } catch (e) {}
  }

  function renderMyPosts() {
    if (!myPostsList) return;
    myPostsList.innerHTML = '';

    for (var i = 0; i < MY_POST_IDS.length; i++) {
      (function (postId) {
        var post = getPostById(postId);
        if (!post) return;

        var replyCount = getPostReplyCount(post);
        var viewCount = getPostViewCount(post);

        var row = document.createElement('div');
        row.className = 'thread-item';
        row.setAttribute('data-id', postId);

        var icon = document.createElement('div');
        icon.className = 'col-icon';
        icon.textContent = '📄';

        var titleEl = document.createElement('div');
        titleEl.className = 'col-title';
        titleEl.appendChild(document.createTextNode(post.title || ''));

        var authorEl = document.createElement('div');
        authorEl.className = 'col-author';
        authorEl.textContent = post.author || '匿名';

        var countEl = document.createElement('div');
        countEl.className = 'col-count';
        countEl.textContent = replyCount + ' / ' + viewCount;

        var lastEl = document.createElement('div');
        lastEl.className = 'col-last';
        lastEl.textContent = ' · ' + (post.date || '');

        row.appendChild(icon);
        row.appendChild(titleEl);
        row.appendChild(authorEl);
        row.appendChild(countEl);
        row.appendChild(lastEl);

        row.addEventListener('click', function () {
          enterPost(postId, null, 'myPosts');
        });

        myPostsList.appendChild(row);
      })(MY_POST_IDS[i]);
    }
  }

  function handleMyPostsClick() {
    if (!isLoggedIn()) {
      alert('请先登录');
      return;
    }
    setTheme(false);
    renderMyPosts();
    showView('myPosts');
  }

  function findBoard(boardId) {
    var boards = (window.SearchData && window.SearchData.boards) || [];
    for (var g = 0; g < boards.length; g++) {
      var forums = boards[g].forums || [];
      for (var f = 0; f < forums.length; f++) {
        if (forums[f].id === boardId) {
          return { group: boards[g], forum: forums[f] };
        }
      }
    }
    return null;
  }

  function renderBoardFilters() {
    if (!boardFilterTabs) return;
    boardFilterTabs.innerHTML = '';
    for (var i = 0; i < BOARD_FILTERS.length; i++) {
      (function (label, idx) {
        var tab = document.createElement('span');
        tab.className = 'board-filter-tab' + (idx === 0 ? ' active' : '');
        tab.textContent = label;
        boardFilterTabs.appendChild(tab);
      })(BOARD_FILTERS[i], i);
    }
  }

  function applyThreadFilter(boardId, filter) {
    var data = (window.SearchData && window.SearchData.threadsByBoard) || {};
    var threads = data[boardId] || [];

    currentThreadsFiltered = [];
    for (var i = 0; i < threads.length; i++) {
      /* 修正：post5 为主线关键线索，只能通过搜索命中，
         不允许出现在任何子版块默认列表中 */
      if (threads[i].id === 'post5') continue;
      if (!filter || filter === '全部' || threads[i].tag === filter) {
        currentThreadsFiltered.push(threads[i]);
      }
    }

    currentThreadsFiltered.sort(function (a, b) {
      var da = a.lastDate || '';
      var db = b.lastDate || '';
      if (da < db) return 1;
      if (da > db) return -1;
      return 0;
    });

    renderCurrentThreadPage();
  }

  function renderCurrentThreadPage() {
    if (!threadList) return;
    threadList.innerHTML = '';

    var total = currentThreadsFiltered.length;

    if (total === 0) {
      var empty2 = document.createElement('div');
      empty2.className = 'search-empty';
      empty2.textContent = '本版暂无帖子';
      threadList.appendChild(empty2);
      renderPager();
      return;
    }

    var end = Math.min(PAGE_SIZE, total);
    var pageThreads = currentThreadsFiltered.slice(0, end);

    for (var j = 0; j < pageThreads.length; j++) {
      (function (t) {
        var postFromPosts = getPostById(t.id);
        var displayTitle = postFromPosts ? postFromPosts.title : t.title;
        var displayAuthor = postFromPosts ? (postFromPosts.author || '匿名') : (t.author || '匿名');

        var replyCount = getPostReplyCount(postFromPosts);
        var viewCount = getPostViewCount(postFromPosts);

        var row = document.createElement('div');
        row.className = 'thread-item';
        row.setAttribute('data-id', t.id);

        var icon = document.createElement('div');
        icon.className = 'col-icon';
        icon.textContent = '📄';

        var titleEl = document.createElement('div');
        titleEl.className = 'col-title';
        if (t.tag) {
          var tagEl = document.createElement('span');
          tagEl.className = 'thread-tag';
          tagEl.textContent = '[' + t.tag + ']';
          titleEl.appendChild(tagEl);
        }
        titleEl.appendChild(document.createTextNode(displayTitle));

        var authorEl = document.createElement('div');
        authorEl.className = 'col-author';
        authorEl.textContent = displayAuthor;

        var countEl = document.createElement('div');
        countEl.className = 'col-count';
        countEl.textContent = replyCount + ' / ' + viewCount;

        var lastEl = document.createElement('div');
        lastEl.className = 'col-last';
        lastEl.textContent = (t.lastAuthor || '') + ' · ' + (t.lastDate || '');

        row.appendChild(icon);
        row.appendChild(titleEl);
        row.appendChild(authorEl);
        row.appendChild(countEl);
        row.appendChild(lastEl);

        if (!isNonClickablePost(postFromPosts)) {
          row.addEventListener('click', function () {
            enterPost(t.id, currentBoardId);
          });
        }

        threadList.appendChild(row);
      })(pageThreads[j]);
    }

    renderPager();
  }

  function renderPager() {
    if (!boardPager) return;
    boardPager.innerHTML = '';

    var totalPages = DISPLAY_PAGES;
    var info = currentBoardId ? findBoard(currentBoardId) : null;
    var boardName = info ? info.forum.name : '';
    if (SINGLE_PAGE_BOARDS.indexOf(boardName) !== -1) {
      totalPages = 1;
    }

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'pager-btn';
    prevBtn.textContent = '上一页';
    boardPager.appendChild(prevBtn);

    for (var i = 1; i <= totalPages; i++) {
      (function (p) {
        var btn = document.createElement('button');
        btn.type = 'button';
        var cls = 'pager-btn';
        if (p === 1) {
          cls += ' current';
        }
        btn.className = cls;
        btn.textContent = p;
        boardPager.appendChild(btn);
      })(i);
    }

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'pager-btn';
    nextBtn.textContent = '下一页';
    boardPager.appendChild(nextBtn);
  }

  function enterBoard(boardId, skipHash) {
    var info = findBoard(boardId);
    if (!info) return;

    currentBoardId = boardId;
    currentPage = 1;
    setTheme(false);

    if (boardTitle) boardTitle.textContent = info.forum.name;
    buildBoardBreadcrumb(info);
    renderBoardFilters();
    applyThreadFilter(boardId, '全部');
    showView('board');

    if (!skipHash) {
      try {
        var newHash = '#' + boardId;
        if (window.location.hash !== newHash) {
          history.pushState(null, '', newHash);
        }
      } catch (e) {}
    }
  }

  function enterPost(postId, boardId, fromView) {
    console.log('点击帖子 id:', postId);

    if (post56Active && postId !== 'post56') {
      if (!post56Decoded) {
        decodeAllText();
      }
      document.body.classList.remove('theme-red');
      document.body.classList.remove('post56-active');
      currentTheme = 'blue';
      post56Active = false;
    }

    currentPostBoardId = (typeof boardId === 'undefined') ? null : boardId;
    currentPostFromView = fromView;

    removeSignatureArea();

    var postData = getPostById(postId);
    console.log('渲染帖子:', postData);

    if (!postData) {
      currentPostId = postId;
      currentPostAvatarMap = null;

      if (postBreadcrumb) {
        postBreadcrumb.innerHTML = '';
        postBreadcrumb.appendChild(createBreadcrumbItem('论坛', function () { renderHome(); }));
        appendBreadcrumbSeparator(postBreadcrumb);
        postBreadcrumb.appendChild(createBreadcrumbItem('帖子不存在', null));
      }
      if (postMainTitle) postMainTitle.textContent = '帖子不存在';
      if (postMainDate) postMainDate.textContent = '';
      if (postMainContent) postMainContent.innerHTML = '<p>抱歉，该帖子不存在或已被删除。</p>';
      if (postAuthorName) postAuthorName.textContent = '——';
      if (postAuthorAvatar) {
        postAuthorAvatar.innerHTML = '';
        postAuthorAvatar.textContent = '?';
        postAuthorAvatar.style.background = '#999';
      }
      if (postAuthorLevelText) postAuthorLevelText.textContent = '——';
      if (postAuthorPosts) postAuthorPosts.textContent = '0';
      if (postAuthorPoints) postAuthorPoints.textContent = '0';
      if (postAuthorUid) postAuthorUid.textContent = '——';
      if (replyList) replyList.innerHTML = '';

      setTheme(false);
      showView('post');
      return;
    }

    currentPostAvatarMap = buildPostAvatarMap(postData);

    var title = postData.title || '';
    var author = postData.author || '匿名';
    var date = resolvePostDate(postData);
    var isDynamicDate = isDynamicDatePost(postData);
    var content = postData.content || '';
    var images = postData.images || null;
    var comments = postData.comments || null;

    var isPost56 = (postId === 'post56');
    var isPost56Garbled = isPost56 && !post56Decoded;

    if (isPost56) {
      setTheme(true);
    } else {
      var isRedPost = RED_THEME_POST_IDS.indexOf(postId) !== -1;
      setTheme(isRedPost);
    }

    if (fromView === 'myPosts') {
      buildPostBreadcrumbFromMyPosts(title);
    } else {
      var info = boardId ? findBoard(boardId) : null;
      if (info) buildPostBreadcrumbFromBoard(info, title);
      else buildPostBreadcrumbFromSearch(title);
    }

    if (postMainTitle) postMainTitle.textContent = title;

    if (postMainDate) {
      postMainDate.textContent = '发表于 ' + date;
      if (isDynamicDate) {
        postMainDate.classList.add('dynamic-date');
      } else {
        postMainDate.classList.remove('dynamic-date');
      }
    }

    var contentHtml = '';

    if (images && Array.isArray(images) && images.length > 0) {
      for (var ii = 0; ii < images.length; ii++) {
        var imgSrc = images[ii];
        var imgAlt = '图片' + (ii + 1);
        contentHtml += '<img class="post-image" src="' +
          escapeHtml(imgSrc) + '" alt="' +
          escapeHtml(imgAlt) + '">';
      }
    }

    if (content && content.length > 0) {
      contentHtml += parseRichText(content);
    }

    if (postMainContent) postMainContent.innerHTML = contentHtml;

    if (postMainContent) {
      var imgEls = postMainContent.querySelectorAll('img.post-image');
      for (var k = 0; k < imgEls.length; k++) {
        (function (img) {
          img.addEventListener('error', function () {
            var placeholder = document.createElement('div');
            placeholder.className = 'post-image-placeholder';
            placeholder.textContent = '图片加载失败';
            if (img.parentNode) {
              img.parentNode.replaceChild(placeholder, img);
            }
          });
        })(imgEls[k]);
      }
    }

    if (postAuthorName) postAuthorName.textContent = author;

    if (postAuthorAvatar) {
      while (postAuthorAvatar.firstChild) {
        postAuthorAvatar.removeChild(postAuthorAvatar.firstChild);
      }
      postAuthorAvatar.style.background = 'transparent';
      postAuthorAvatar.style.overflow = 'hidden';

      var authorAvatarImg = document.createElement('img');
      authorAvatarImg.className = 'post-author-avatar-img';

      var avatarSrc = postData.authorAvatar
        ? postData.authorAvatar
        : getPostAvatarPath(author);
      authorAvatarImg.src = avatarSrc;
      authorAvatarImg.alt = author;
      authorAvatarImg.onerror = function () {
        while (postAuthorAvatar.firstChild) {
          postAuthorAvatar.removeChild(postAuthorAvatar.firstChild);
        }
        postAuthorAvatar.textContent = (author || '?').charAt(0);
        var hue = hashNameToHue(author);
        postAuthorAvatar.style.background = 'hsl(' + hue + ', 60%, 70%)';
      };
      postAuthorAvatar.appendChild(authorAvatarImg);
    }

    var uid = postData.authorUID ? postData.authorUID : 10000 + hashString(author);
    if (postAuthorUid) postAuthorUid.textContent = uid;
    if (postAuthorPosts) postAuthorPosts.textContent = '128';
    if (postAuthorPoints) postAuthorPoints.textContent = '512';
    if (postAuthorLevelText) postAuthorLevelText.textContent = 'Lv.3';

    currentPostId = postId;
    currentCommentsData = comments;
    currentFallbackThread = postData;

    renderReplies();
    showView('post');

    if (postId === 'post6' || postId === 'post7') {
      addViewedZhengPost(postId);
    }

    if (isPost56) {
      post56Active = true;
      currentTheme = 'red';
      document.body.classList.add('theme-red');
      document.body.classList.add('post56-active');
      if (isPost56Garbled) {
        garbleAllText();
      }
    }
  }

  function flattenComments(list, level, parentAuthor, out) {
    if (!list || list.length === 0) return;
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      var author = c.author || '匿名';
      var displayDepth = Math.min(level - 1, MAX_REPLY_DEPTH - 1);
      if (displayDepth < 0) displayDepth = 0;

      var entry = {
        author: author,
        content: c.content || '',
        date: c.date,
        location: c.location,
        replyTo: c.replyTo || (level > 1 ? parentAuthor : undefined),
        depth: displayDepth,
        _likes: c._likes || 0,
        _ref: c
      };
      out.push(entry);

      if (c.replies && c.replies.length > 0) {
        flattenComments(c.replies, level + 1, author, out);
      }
    }
  }

  function buildCommentBlock(data) {
    var depth = Math.min(data.depth || 0, MAX_REPLY_DEPTH - 1);
    var indentPx = depth * REPLY_INDENT_PX;

    var block = document.createElement('div');
    block.className = 'comment-block' + (depth > 0 ? ' comment-block-nested' : '');
    block.setAttribute('data-depth', String(depth));

    if (indentPx > 0) {
      block.style.marginLeft = indentPx + 'px';
      block.style.borderLeft = '2px solid #e8e8e8';
      block.style.paddingLeft = '12px';
    }

    var card = document.createElement('div');
    card.className = 'comment-card' + (depth > 0 ? ' comment-card-nested' : '');

    var authorName = data.author || '匿名';
    var avatarClassName = 'comment-avatar' + (depth > 0 ? ' comment-avatar-sm' : '');
    var avatar = createAvatarImg(authorName, avatarClassName);

    var body = document.createElement('div');
    body.className = 'comment-body';

    var head = document.createElement('div');
    head.className = 'comment-head';

    var authorEl = document.createElement('span');
    authorEl.className = 'comment-author';
    authorEl.textContent = authorName;
    head.appendChild(authorEl);

    if (data.replyTo) {
      var sep = document.createElement('span');
      sep.className = 'comment-reply-to';
      sep.textContent = ' 回复 ';
      head.appendChild(sep);

      var rt = document.createElement('span');
      rt.className = 'comment-author';
      rt.textContent = data.replyTo;
      head.appendChild(rt);
    }

    var contentEl = document.createElement('div');
    contentEl.className = 'comment-content';
    contentEl.innerHTML = parseRichText(data.content || '');

    var footer = document.createElement('div');
    footer.className = 'comment-footer';

    if (data.date) {
      var dateEl = document.createElement('span');
      dateEl.className = 'comment-date';
      dateEl.textContent = data.date;
      footer.appendChild(dateEl);
    }

    if (data.location) {
      var locEl = document.createElement('span');
      locEl.className = 'comment-location';
      locEl.textContent = data.location;
      footer.appendChild(locEl);
    }

    var likeBtn = document.createElement('button');
    likeBtn.type = 'button';
    likeBtn.className = 'comment-action comment-like-btn';
    var likes = data._likes || 0;
    likeBtn.textContent = '👍 ' + likes;
    if (likes > 0) likeBtn.classList.add('liked');

    likeBtn.addEventListener('click', function () {
      var ref = data._ref;
      if (ref) {
        if (likeBtn.classList.contains('liked')) {
          ref._likes = Math.max(0, (ref._likes || 0) - 1);
          likeBtn.classList.remove('liked');
        } else {
          ref._likes = (ref._likes || 0) + 1;
          likeBtn.classList.add('liked');
        }
        likeBtn.textContent = '👍 ' + (ref._likes || 0);
      }
    });
    footer.appendChild(likeBtn);

    var replyBtn = document.createElement('button');
    replyBtn.type = 'button';
    replyBtn.className = 'comment-action comment-reply-btn';
    replyBtn.textContent = '回复';
    footer.appendChild(replyBtn);

    body.appendChild(head);
    body.appendChild(contentEl);
    body.appendChild(footer);

    card.appendChild(avatar);
    card.appendChild(body);
    block.appendChild(card);

    var replyBox = document.createElement('div');
    replyBox.className = 'comment-reply-box';
    replyBox.hidden = true;

    var replyInput = document.createElement('input');
    replyInput.type = 'text';
    replyInput.className = 'comment-reply-input';
    replyInput.placeholder = '回复 ' + authorName + '……';

    var replySubmit = document.createElement('button');
    replySubmit.type = 'button';
    replySubmit.className = 'comment-reply-submit';
    replySubmit.textContent = '发送';

    replyBox.appendChild(replyInput);
    replyBox.appendChild(replySubmit);
    block.appendChild(replyBox);

    replyBtn.addEventListener('click', function () {
      replyBox.hidden = !replyBox.hidden;
      if (!replyBox.hidden) {
        try { replyInput.focus(); } catch (e) {}
      }
    });

    function submitReply() {
      var text = replyInput.value.trim();
      if (text === '') return;

      var childDepth = Math.min(depth + 1, MAX_REPLY_DEPTH - 1);

      var ref = data._ref;
      var storedChild = null;
      if (ref) {
        if (!ref.replies) ref.replies = [];
        storedChild = {
          author: '我',
          content: text,
          date: '',
          replyTo: authorName,
          _likes: 0
        };
        ref.replies.push(storedChild);
      }

      if (currentPostAvatarMap &&
          !Object.prototype.hasOwnProperty.call(currentPostAvatarMap, '我')) {
        var used = {};
        for (var kk in currentPostAvatarMap) {
          if (Object.prototype.hasOwnProperty.call(currentPostAvatarMap, kk)) {
            used[currentPostAvatarMap[kk]] = true;
          }
        }
        currentPostAvatarMap['我'] = pickAvatarIndex(used);
      }

      var childData = {
        author: '我',
        content: text,
        date: '',
        replyTo: authorName,
        depth: childDepth,
        _likes: 0,
        _ref: storedChild
      };

      var childBlock = buildCommentBlock(childData);
      if (block.parentNode) {
        block.parentNode.insertBefore(childBlock, block.nextSibling);
      }

      replyInput.value = '';
      replyBox.hidden = true;
    }

    replySubmit.addEventListener('click', submitReply);
    replyInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submitReply();
    });

    return block;
  }

  function renderReplies() {
    if (!replyList) return;
    replyList.innerHTML = '';

    var comments = currentCommentsData;

    if (!comments || comments.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.textContent = '暂无评论';
      replyList.appendChild(empty);
      return;
    }

    var flat = [];
    flattenComments(comments, 1, null, flat);

    for (var j = 0; j < flat.length; j++) {
      replyList.appendChild(buildCommentBlock(flat[j]));
    }
  }

  function isLoggedIn() {
    var state = window.GameState.get();
    return state.forumLoggedIn === true;
  }

  function resetLoginPanel() {
    loginMessage.textContent = '';
    usernameInput.value = '';
    passwordInput.value = '';
    securityAnswerInput.value = '';
    if (passwordField) passwordField.hidden = false;
    if (loginBtn) loginBtn.hidden = false;
    if (securityQuestionArea) securityQuestionArea.hidden = true;
  }

  function openLoginModal() {
    if (!loginModal) return;
    loginModal.hidden = false;
    resetLoginPanel();
    window.requestAnimationFrame(function () {
      try { usernameInput.focus(); } catch (e) {}
    });
  }

  function closeLoginModal() {
    if (!loginModal) return;
    loginModal.hidden = true;
    loginMessage.textContent = '';
  }

  function showSecurityQuestionArea() {
    loginMessage.textContent = '';
    if (passwordField) passwordField.hidden = true;
    if (loginBtn) loginBtn.hidden = true;
    if (securityQuestionArea) securityQuestionArea.hidden = false;
    window.requestAnimationFrame(function () {
      try { securityAnswerInput.focus(); } catch (e) {}
    });
  }

  function showMainLoginArea() {
    loginMessage.textContent = '';
    if (passwordField) passwordField.hidden = false;
    if (loginBtn) loginBtn.hidden = false;
    if (securityQuestionArea) securityQuestionArea.hidden = true;
    window.requestAnimationFrame(function () {
      try { usernameInput.focus(); } catch (e) {}
    });
  }

  function handlePasswordLogin() {
    loginMessage.textContent = '密码错误，请尝试找回密码。';
  }

  function handleSecuritySubmit() {
    var account = usernameInput.value.trim();
    var answer = securityAnswerInput.value;

    if (account === '') { loginMessage.textContent = '请先填写账号'; return; }
    if (account !== FORUM_ACCOUNT) { loginMessage.textContent = '账号不存在'; return; }
    if (/\s/.test(answer)) { loginMessage.textContent = '答案不正确，请再试一次。'; return; }

    var value = answer.trim();
    var matched = false;
    for (var i = 0; i < SECURITY_ANSWERS.length; i++) {
      if (value === SECURITY_ANSWERS[i]) { matched = true; break; }
    }
    if (!matched) { loginMessage.textContent = '答案不正确，请再试一次。'; return; }

    loginMessage.textContent = '';
    window.GameState.update({ forumLoggedIn: true });
    closeLoginModal();
    updateWelcome();
    renderHome();
  }

  function updateWelcome() {
    var logged = isLoggedIn();
    if (forumWelcome) {
      forumWelcome.textContent = logged ? '欢迎光临，player。' : '欢迎光临。';
    }
    if (navMyLink) {
      navMyLink.textContent = logged ? '我的（已登录）' : '我的';
    }
  }

  function renderSearchResults(posts) {
    if (!searchResultsList) return;
    searchResultsList.innerHTML = '';

    for (var i = 0; i < posts.length; i++) {
      (function (post) {
        var item = document.createElement('div');
        item.className = 'search-result-item';

        var titleEl = document.createElement('div');
        titleEl.className = 'search-result-title';
        titleEl.textContent = post.title;

        var dateEl = document.createElement('div');
        dateEl.className = 'search-result-date';
        dateEl.textContent = resolvePostDate(post);

        item.appendChild(titleEl);
        item.appendChild(dateEl);

        item.addEventListener('click', function () {
          enterPost(post.id, null);
        });
        searchResultsList.appendChild(item);
      })(posts[i]);
    }
  }

  function performSearch(keyword) {
    var index = (window.SearchData && window.SearchData.searchIndex) || {};
    var ids = Object.prototype.hasOwnProperty.call(index, keyword) ? index[keyword] : null;
    if (!ids || ids.length === 0) return null;

    var posts = [];
    for (var i = 0; i < ids.length; i++) {
      var post = getPostById(ids[i]);
      if (post) posts.push(post);
    }

    posts.sort(function (a, b) {
      var da = resolvePostDate(a);
      var db = resolvePostDate(b);
      if (da < db) return 1;
      if (da > db) return -1;
      return 0;
    });

    return posts;
  }

  function handleSearch() {
    if (!isLoggedIn()) { alert('请先登录'); return; }

    var keyword = searchInput.value.replace(/^\s+|\s+$/g, '');
    lastSearchKeyword = keyword;

    if (keyword === '' || /\s/.test(keyword)) {
      setTheme(false);
      showView('noResult');
      return;
    }

    var posts = performSearch(keyword);
    if (!posts || posts.length === 0) {
      setTheme(false);
      showView('noResult');
      return;
    }

    var postIds = posts.map(function (p) { return p.id; });
    saveSearchState(keyword, postIds);

    var isRedSearch = RED_THEME_SEARCH_KEYWORDS.indexOf(keyword) !== -1;
    setTheme(isRedSearch);

    if (searchBreadcrumb) searchBreadcrumb.textContent = '论坛 > 搜索：' + keyword;
    renderSearchResults(posts);
    showView('search');

    for (var k = 0; k < posts.length; k++) {
      if (posts[k].id === 'post5') {
        window.GameState.broadcast({
          accidentDeathFound: true,
          accidentDeathHandled: false
        });
        if (testStatus) testStatus.textContent = '已写入，当前 accidentDeathFound = true';
        break;
      }
    }
  }

  function renderSearchResultsFromSaved() {
    var saved = restoreSearchState();
    if (!saved.keyword) { renderHome(); return; }
    if (searchInput) searchInput.value = saved.keyword;
    lastSearchKeyword = saved.keyword;

    var posts = performSearch(saved.keyword);
    if (!posts || posts.length === 0) {
      setTheme(false);
      showView('noResult');
      return;
    }

    var isRedSearch = RED_THEME_SEARCH_KEYWORDS.indexOf(saved.keyword) !== -1;
    setTheme(isRedSearch);
    if (searchBreadcrumb) searchBreadcrumb.textContent = '论坛 > 搜索：' + saved.keyword;
    renderSearchResults(posts);
    showView('search');
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

  function hashString(s) {
    if (!s) return 0;
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) % 90000;
    }
    return h;
  }

  function rerenderCurrentView() {
    if (currentView === 'post' && currentPostId) {
      enterPost(currentPostId, currentPostBoardId, currentPostFromView);
    } else if (currentView === 'search') {
      renderSearchResultsFromSaved();
    } else if (currentView === 'board' && currentBoardId) {
      applyThreadFilter(currentBoardId, '全部');
    } else if (currentView === 'myPosts') {
      renderMyPosts();
    }
  }

  window.__decodePage = function () {
    post56Decoded = true;
    decodeAllText();
    document.body.classList.add('theme-red');
    currentTheme = 'red';
    rerenderCurrentView();
    console.log('页面已解码');
  };

  function bindEvents() {
    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) {
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleSearch();
      });
    }
    if (navMyLink) {
      navMyLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (isLoggedIn()) { /* 已登录：静默 */ return; }
        openLoginModal();
      });
    }
    if (navMyPostsLink) {
      navMyPostsLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (!isLoggedIn()) {
          alert('请先登录');
          return;
        }
        handleMyPostsClick();
      });
    }
    if (loginCloseBtn) loginCloseBtn.addEventListener('click', closeLoginModal);
    if (loginModal) {
      var overlay = loginModal.querySelector('.login-modal-overlay');
      if (overlay) overlay.addEventListener('click', closeLoginModal);
    }
    if (loginBtn) loginBtn.addEventListener('click', handlePasswordLogin);
    if (passwordInput) {
      passwordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handlePasswordLogin();
      });
    }
    if (usernameInput) {
      usernameInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handlePasswordLogin();
      });
    }
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', function (e) {
        e.preventDefault();
        showSecurityQuestionArea();
      });
    }
    if (submitSecurityBtn) submitSecurityBtn.addEventListener('click', handleSecuritySubmit);
    if (securityAnswerInput) {
      securityAnswerInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleSecuritySubmit();
      });
    }
    if (backToLoginLink) {
      backToLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        showMainLoginArea();
      });
    }
    if (backToSearchBtn) {
      backToSearchBtn.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
          try { searchInput.focus(); } catch (e) {}
        }
      });
    }
    if (testAccidentBtn) {
      testAccidentBtn.addEventListener('click', function () {
        window.GameState.broadcast({
          accidentDeathFound: true,
          accidentDeathHandled: false
        });
        if (testStatus) testStatus.textContent = '已写入，当前 accidentDeathFound = true';
      });
    }
    window.addEventListener('popstate', handleHashNavigation);
  }

  function init() {
    removeSignatureArea();

    initPlaceholders();
    bindEvents();

    var initialHash = '';
    try {
      initialHash = (window.location.hash || '').replace('#', '');
    } catch (e) {
      initialHash = '';
    }
    if (initialHash && findBoard(initialHash)) enterBoard(initialHash, true);
    else renderHome();

    updateWelcome();

    var state = window.GameState.get();
    if (testStatus && state.accidentDeathFound) {
      testStatus.textContent = '已写入，当前 accidentDeathFound = true';
    }

    console.log('提示：页面出现异常时，可尝试 __decodePage()');
  }

  init();

})();