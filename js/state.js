/* ============================================================
   文件路径：js/state.js
   说明：全局状态管理（localStorage 持久化 + 跨标签同步）
         本次修正：
           1. 新增状态字段 goodEndingOverlayPlayed，用于记录玩家
              是否已点击过好结局覆盖层上的「继续向前」按钮
           2. 其余逻辑保持不变
   暴露：window.GameState、window.onGameStateChange、
         window.onGameStateFieldChange、window.AudioManager
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'gameState';
  var GLITCH_PLAYED_KEY = 'glitchPlayed';

  var DEFAULT_STATE = {
    playerName: "",
    currentPhase: 1,
    currentLevel: 1,
    stage1Completed: false,
    stage2Completed: false,
    stage3Completed: false,
    coverShown: false,
    selectedCharacter: null,
    playerLastWords: "",
    stage3Unlocked: false,
    accidentDeathFound: false,
    accidentDeathHandled: false,
    keysObtained: { a: false, b: false },
    forumLoggedIn: false,
    makerUnlocked: false,
    chatProgress: 0,
    chatSelectedOptions: {},
    questionProgress: 0,
    questionSelectedOptions: {},
    endingChoice: null,
    friendRequestAccepted: false,
    rejectedFriendRequest: false,
    currentChat: "如果那片云",
    emailReceived: false,
    stage2DialogueShown: false,
    badEndingSeen: false,
    goodEndingSeen: false,
    rejectedEndingSeen: false,
    /* 本次新增：是否已播放过好结局覆盖层并点击「继续向前」 */
    goodEndingOverlayPlayed: false,
    trueEndingTriggered: false,
    trueEndingReasonSelected: [],
    trueEndingFinalChoice: null,
    trueEndingContactUnlocked: false,
    mysteryChoice: null,
    bThirdPostSeen: false
  };

  function cloneDefault() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function readRaw() {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (e) { console.warn('[state] 读取 localStorage 失败：', e); return null; }
  }

  function writeRaw(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.warn('[state] 写入 localStorage 失败：', e);
      return false;
    }
  }

  function mergeInto(target, source) {
    if (!source || typeof source !== 'object') return target;
    for (var key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      var value = source[key];
      var isPlainObject = value !== null && typeof value === 'object' && !Array.isArray(value);
      if (isPlainObject && target[key] !== null && typeof target[key] === 'object' && !Array.isArray(target[key])) {
        mergeInto(target[key], value);
      } else {
        target[key] = value;
      }
    }
    return target;
  }

  function migrateCurrentChat(state) {
    if (!state || typeof state !== 'object') return;
    if (state.currentChat === 'yyyy云') {
      state.currentChat = '如果那片云';
    }
  }

  /**
   * 清理遗留字段（如旧的 playerAppearance）
   */
  function cleanupLegacyFields(state) {
    if (!state || typeof state !== 'object') return;
    if (Object.prototype.hasOwnProperty.call(state, 'playerAppearance')) {
      delete state.playerAppearance;
    }
  }

  if (readRaw() === null) writeRaw(cloneDefault());

  var listeners = [];

  function notify(state) {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](state); }
      catch (e) { console.error('[state] 状态监听回调执行出错：', e); }
    }
  }

  var fieldListeners = {};
  var lastState = null;
  var broadcastChannel = null;

  function get() {
    var raw = readRaw();
    if (raw === null) {
      var fresh = cloneDefault();
      writeRaw(fresh);
      return fresh;
    }
    var parsed;
    try { parsed = JSON.parse(raw); }
    catch (e) {
      console.warn('[state] 存档解析失败，已重置为默认状态。', e);
      var resetState = cloneDefault();
      writeRaw(resetState);
      return resetState;
    }
    var merged = cloneDefault();
    mergeInto(merged, parsed);
    cleanupLegacyFields(merged);
    migrateCurrentChat(merged);
    return merged;
  }

  function save(state) {
    var next = state && typeof state === 'object' ? state : cloneDefault();
    cleanupLegacyFields(next);
    migrateCurrentChat(next);
    writeRaw(next);
    notify(next);
    return next;
  }

  function handleStateChange(newState) {
    if (!newState) return;
    if (!lastState) {
      lastState = JSON.parse(JSON.stringify(newState));
      return;
    }
    var changedFields = [];
    var oldValues = {};
    for (var key in newState) {
      if (!Object.prototype.hasOwnProperty.call(newState, key)) continue;
      var newVal = newState[key];
      var oldVal = lastState[key];
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        changedFields.push(key);
        oldValues[key] = oldVal;
      }
    }
    lastState = JSON.parse(JSON.stringify(newState));
    for (var i = 0; i < changedFields.length; i++) {
      var field = changedFields[i];
      var callbacks = fieldListeners[field];
      if (callbacks && callbacks.length) {
        for (var j = 0; j < callbacks.length; j++) {
          try { callbacks[j](newState[field], oldValues[field]); }
          catch (e) { console.error('[state] 字段监听回调出错：', e); }
        }
      }
    }
  }

  (function initLastState() {
    var initial = get();
    lastState = JSON.parse(JSON.stringify(initial));
  })();

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel('gameStateChannel');
      broadcastChannel.onmessage = function (event) {
        if (event.data && event.data.type === 'stateChanged') {
          var newState = get();
          handleStateChange(newState);
        }
      };
    }
  } catch (e) {
    console.warn('[state] BroadcastChannel 初始化失败：', e);
  }

  function update(partial) {
    var current = get();
    mergeInto(current, partial);
    cleanupLegacyFields(current);
    migrateCurrentChat(current);
    var saved = save(current);
    handleStateChange(saved);
    return saved;
  }

  function broadcast(partial) {
    var saved = update(partial);
    if (broadcastChannel) {
      try { broadcastChannel.postMessage({ type: 'stateChanged' }); }
      catch (e) { console.warn('[state] BroadcastChannel 发送失败：', e); }
    }
    return saved;
  }

  function resetAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(GLITCH_PLAYED_KEY);
    } catch (e) { console.warn('[state] 清除 localStorage 失败：', e); }
    try { sessionStorage.clear(); }
    catch (e) { console.warn('[state] 清空 sessionStorage 失败：', e); }
    try { writeRaw(cloneDefault()); } catch (e) {}
  }

  function onGameStateFieldChange(fieldName, callback) {
    if (typeof callback !== 'function') return function () {};
    if (!fieldListeners[fieldName]) fieldListeners[fieldName] = [];
    fieldListeners[fieldName].push(callback);
    return function () {
      var arr = fieldListeners[fieldName];
      if (arr) {
        var idx = arr.indexOf(callback);
        if (idx !== -1) arr.splice(idx, 1);
      }
    };
  }

  var AudioManager = (function () {
    var AUDIO_ENABLED_KEY = 'audioEnabled';
    var AUDIO_BASE = 'assets/audio/';
    var SOUND_NAMES = ['message', 'click', 'level-complete', 'chest', 'ending'];
    var MIN_INTERVAL = 100;
    var DEFAULT_VOLUME = 0.5;

    var cache = {};
    var lastPlayed = {};
    var initialized = false;

    function readEnabled() {
      try {
        var v = localStorage.getItem(AUDIO_ENABLED_KEY);
        if (v === null) return true;
        return v !== 'false';
      } catch (e) { return true; }
    }

    function writeEnabled(v) {
      try { localStorage.setItem(AUDIO_ENABLED_KEY, v ? 'true' : 'false'); }
      catch (e) { console.warn('[AudioManager] 写入 audioEnabled 失败：', e); }
    }

    function init() {
      if (initialized) return;
      initialized = true;
      for (var i = 0; i < SOUND_NAMES.length; i++) {
        (function (name) {
          try {
            var audio = new Audio();
            audio.src = AUDIO_BASE + name + '.mp3';
            audio.preload = 'auto';
            audio.volume = DEFAULT_VOLUME;
            audio.addEventListener('error', function () {});
            cache[name] = audio;
          } catch (e) {}
        })(SOUND_NAMES[i]);
      }
    }

    function play(name) {
      if (!readEnabled()) return;
      if (!initialized) init();
      if (!cache[name]) return;
      var now = Date.now();
      var last = lastPlayed[name] || 0;
      if (now - last < MIN_INTERVAL) return;
      lastPlayed[name] = now;
      try {
        var src = cache[name];
        var inst = src.cloneNode ? src.cloneNode() : new Audio(src.src);
        inst.volume = DEFAULT_VOLUME;
        var p = inst.play();
        if (p && typeof p.catch === 'function') p.catch(function () {});
      } catch (e) {}
    }

    function setEnabled(v) { writeEnabled(!!v); }
    function isEnabled() { return readEnabled(); }

    return { init: init, play: play, setEnabled: setEnabled, isEnabled: isEnabled };
  })();

  window.GameState = { get: get, save: save, update: update, broadcast: broadcast, resetAll: resetAll };
  window.AudioManager = AudioManager;
  window.onGameStateChange = function (callback) {
    if (typeof callback !== 'function') return function () {};
    listeners.push(callback);
    return function () {
      var index = listeners.indexOf(callback);
      if (index !== -1) listeners.splice(index, 1);
    };
  };

  window.onGameStateFieldChange = onGameStateFieldChange;

  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY || event.key === null) {
      var newState = get();
      notify(newState);
      handleStateChange(newState);
    }
  });

  try { AudioManager.init(); } catch (e) {}

})();