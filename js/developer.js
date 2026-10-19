/* ============================================================
   文件路径：js/developer.js
   说明：开发商主页脚本
         本次修正：
           1. 将 .dev-avatar 中展示的文字头像替换为锚定图片
              （种下一颗大太阳 → avatar44）
           2. 将“最近动态”区域的小封面 .activity-cover
              替换为 assets/backgrounds/cover.png（背景图填充）
              同时清除原有的“封”占位文字
           3. 其余逻辑保持不变
   依赖：js/state.js（提供 window.GameState）
         本模块只读取状态，不写入任何状态。
   ============================================================ */
(function () {
  'use strict';

  var DEV_AVATAR_SRC = 'assets/avatars/avatar44.png';
  var DEV_AVATAR_ALT = '种下一颗大太阳';

  var ACTIVITY_COVER_SRC = 'assets/backgrounds/cover.png';

  /* ---------- 替换开发者头像 ---------- */
  function setDevAvatar() {
    var devAvatar = document.querySelector('.dev-avatar');
    if (!devAvatar) return;

    /* 保留原有文字作为 fallback */
    var fallbackText = devAvatar.textContent || '阳';

    devAvatar.innerHTML = '';
    devAvatar.style.overflow = 'hidden';
    devAvatar.style.padding = '0';

    var img = document.createElement('img');
    img.src = DEV_AVATAR_SRC;
    img.alt = DEV_AVATAR_ALT;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.style.display = 'block';
    img.onerror = function () {
      devAvatar.innerHTML = '';
      devAvatar.textContent = fallbackText;
      console.warn('[developer] 头像加载失败，回退为文字：', DEV_AVATAR_SRC);
    };
    devAvatar.appendChild(img);
  }

  /* ---------- 替换“最近动态”区域的小封面 ---------- */
  function setActivityCovers() {
    var covers = document.querySelectorAll('.activity-cover');
    if (!covers || covers.length === 0) return;

    for (var i = 0; i < covers.length; i++) {
      var el = covers[i];

      /* 清除“封”字占位 */
      while (el.firstChild) el.removeChild(el.firstChild);

      /* 设置为背景图 */
      el.style.backgroundImage = 'url(' + ACTIVITY_COVER_SRC + ')';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.style.backgroundRepeat = 'no-repeat';
    }
  }

  function init() {
    /* 读取状态：确保 state.js 完成初始化，供后续扩展使用 */
    var state = window.GameState.get();

    /* 替换开发者头像为锚定图片 */
    setDevAvatar();

    /* 替换“最近动态”区域的小封面 */
    setActivityCovers();

    if (typeof console !== 'undefined' && console.log) {
      /* 仅在开发者工具中可见，不影响用户体验 */
      // console.log('[developer] 状态读取完成', state);
    }
  }

  init();

})();