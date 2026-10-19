/* ============================================================
   文件路径：game/levels.js
   说明：关卡数据
         本次修正：
           - 阶段一第5关删除第二个尖刺（x:1230, y:199），
             只保留地面上（x:480）的一个尖刺
   暴露：window.Levels = { stage1, stage2, stage3 }
   ============================================================ */
(function () {
  'use strict';

  var stage1 = [
    {
      id: 1,
      name: '第1关：基础跳跃',
      levelWidth: 2000,
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 1600, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20 },
        { x: 730, y: 219, width: 150, height: 20 },
        { x: 1030, y: 311, width: 150, height: 20 },
        { x: 1330, y: 311, width: 150, height: 20 }
      ],
      spikes: [],
      chest: { platformIndex: 1, offsetX: 51, offsetY: -48 },
      exit: { x: 1700, y: 323, width: 80, height: 80 }
    },
    {
      id: 2,
      name: '第2关：地面定时尖刺',
      levelWidth: 2200,
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 1800, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20 },
        { x: 780, y: 219, width: 150, height: 20 },
        { x: 1080, y: 311, width: 150, height: 20 },
        { x: 1330, y: 219, width: 150, height: 20 }
      ],
      spikes: [
        { x: 240, y: 383, width: 75, height: 20, type: 'timed',
          visibleDuration: 1000, invisibleDuration: 2500, startOffset: 0 }
      ],
      chest: { platformIndex: 1, offsetX: 51, offsetY: -48 },
      exit: { x: 1900, y: 323, width: 80, height: 80 }
    },
    {
      id: 3,
      name: '第3关：定时平台',
      levelWidth: 2400,
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 2000, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0 },
        { x: 730, y: 219, width: 150, height: 20 },
        { x: 1030, y: 311, width: 150, height: 20 },
        { x: 1330, y: 219, width: 150, height: 20 },
        { x: 1630, y: 311, width: 150, height: 20 }
      ],
      spikes: [
        { x: 1030, y: 291, width: 75, height: 20, type: 'timed',
          visibleDuration: 1000, invisibleDuration: 2500, startOffset: 0.7142857142857143 }
      ],
      chest: { platformIndex: 3, offsetX: 51, offsetY: -48 },
      exit: { x: 2100, y: 323, width: 80, height: 80 }
    },
    {
      id: 4,
      name: '第4关：水平移动平台',
      levelWidth: 2600,
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 2200, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20, type: 'moving',
          moveAxis: 'horizontal', moveRange: 100, moveSpeed: 120, startOffset: 0 },
        { x: 780, y: 219, width: 150, height: 20 },
        { x: 1080, y: 311, width: 150, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0 },
        { x: 1330, y: 219, width: 150, height: 20 },
        { x: 1630, y: 311, width: 150, height: 20 },
        { x: 1930, y: 219, width: 150, height: 20 }
      ],
      spikes: [
        { x: 1330, y: 199, width: 75, height: 20, type: 'timed',
          visibleDuration: 1000, invisibleDuration: 2500, startOffset: 0.7142857142857143 },
        { x: 1630, y: 291, width: 75, height: 20, type: 'timed',
          visibleDuration: 1000, invisibleDuration: 2500, startOffset: 0.7142857142857143 }
      ],
      chest: { platformIndex: 5, offsetX: 51, offsetY: -48 },
      exit: { x: 2300, y: 323, width: 80, height: 80 }
    },
    {
      id: 5,
      name: '第5关：垂直移动平台',
      levelWidth: 2800,
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 2400, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20 },
        { x: 730, y: 219, width: 150, height: 20, type: 'moving',
          moveAxis: 'vertical', moveRange: 92, moveSpeed: 100, startOffset: 0 },
        { x: 980, y: 311, width: 150, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0 },
        { x: 1230, y: 219, width: 150, height: 20 },
        { x: 1480, y: 311, width: 150, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0.5 },
        { x: 1710, y: 219, width: 150, height: 20 },
        { x: 1940, y: 311, width: 150, height: 20 },
        { x: 2170, y: 219, width: 150, height: 20 }
      ],
      spikes: [
        /* 本次修正：删除原来的第二个尖刺（x:1230, y:199），只保留地面上这一个 */
        { x: 480, y: 291, width: 75, height: 20, type: 'timed',
          visibleDuration: 1000, invisibleDuration: 2500, startOffset: 0.7142857142857143 }
      ],
      chest: { platformIndex: 7, offsetX: 51, offsetY: -48 },
      exit: { x: 2500, y: 323, width: 80, height: 80 }
    },
    {
      id: 6,
      name: '第6关：多机制综合',
      levelWidth: 3000,
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 2600, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20 },
        { x: 780, y: 219, width: 150, height: 20, type: 'moving',
          moveAxis: 'horizontal', moveRange: 100, moveSpeed: 140, startOffset: 0 },
        { x: 1080, y: 311, width: 150, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0.5 },
        { x: 1330, y: 219, width: 150, height: 20 },
        { x: 1630, y: 311, width: 150, height: 20, type: 'moving',
          moveAxis: 'vertical', moveRange: 80, moveSpeed: 100, startOffset: 0.25 },
        { x: 1930, y: 219, width: 150, height: 20 },
        { x: 2230, y: 311, width: 150, height: 20 }
      ],
      spikes: [
        { x: 480, y: 291, width: 75, height: 20, type: 'timed',
          visibleDuration: 1000, invisibleDuration: 2500, startOffset: 0.2142857142857143 },
        { x: 1930, y: 199, width: 75, height: 20, type: 'timed',
          visibleDuration: 1000, invisibleDuration: 2500, startOffset: 0.2142857142857143 },
        { x: 2230, y: 291, width: 75, height: 20, type: 'timed',
          visibleDuration: 1000, invisibleDuration: 2500, startOffset: 0.2142857142857143 }
      ],
      chest: { platformIndex: 3, offsetX: 51, offsetY: -48 },
      exit: { x: 2700, y: 323, width: 80, height: 80 }
    }
  ];

  var stage2 = [
    {
      id: 1,
      name: '阶段二 第1关',
      levelWidth: 1800,
      background: '#0a0a12',
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 1400, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20 },
        { x: 780, y: 219, width: 150, height: 20 },
        { x: 1130, y: 311, width: 150, height: 20 }
      ],
      spikes: [],
      chest: { platformIndex: 1, offsetX: 51, offsetY: -48 },
      note: '纸条1：她走得太突然了。',
      exit: { x: 1500, y: 323, width: 80, height: 80 }
    },
    {
      id: 2,
      name: '阶段二 第2关',
      levelWidth: 1800,
      background: '#1a1a22',
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 1400, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0 },
        { x: 730, y: 219, width: 150, height: 20 },
        { x: 1080, y: 311, width: 150, height: 20 }
      ],
      spikes: [
        { x: 240, y: 383, width: 75, height: 20, type: 'timed',
          visibleDuration: 1000, invisibleDuration: 2500, startOffset: 0.8 }
      ],
      chest: { platformIndex: 2, offsetX: 51, offsetY: -48 },
      note: '纸条2：我开始整理她的东西。',
      exit: { x: 1500, y: 323, width: 80, height: 80 }
    },
    {
      id: 3,
      name: '阶段二 第3关',
      levelWidth: 1800,
      background: '#3a3a42',
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 1400, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20, type: 'moving',
          moveAxis: 'horizontal', moveRange: 100, moveSpeed: 120, startOffset: 0 },
        { x: 730, y: 219, width: 150, height: 20 },
        { x: 1080, y: 311, width: 150, height: 20 }
      ],
      spikes: [
        { x: 730, y: 199, width: 75, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0 }
      ],
      chest: { platformIndex: 2, offsetX: 51, offsetY: -48 },
      note: '纸条3：我发现了她的日记。',
      exit: { x: 1500, y: 323, width: 80, height: 80 }
    },
    {
      id: 4,
      name: '阶段二 第4关',
      levelWidth: 2200,
      background: '#7a7a82',
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 1800, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20, type: 'moving',
          moveAxis: 'vertical', moveRange: 60, moveSpeed: 100, startOffset: 0 },
        { x: 730, y: 219, width: 150, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0 },
        { x: 1080, y: 311, width: 150, height: 20 },
        { x: 1380, y: 219, width: 150, height: 20 }
      ],
      spikes: [
        { x: 240, y: 383, width: 75, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0 }
      ],
      chest: { platformIndex: 3, offsetX: 51, offsetY: -48 },
      note: '纸条4：日记里写着关于我的事。',
      exit: { x: 1900, y: 323, width: 80, height: 80 }
    },
    {
      id: 5,
      name: '阶段二 第5关',
      levelWidth: 2560,
      background: '#f5f0e1',
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 2160, y: 403, width: 400, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20, type: 'moving',
          moveAxis: 'horizontal', moveRange: 100, moveSpeed: 120, startOffset: 0 },
        { x: 730, y: 219, width: 150, height: 20, type: 'moving',
          moveAxis: 'vertical', moveRange: 80, moveSpeed: 100, startOffset: 0 },
        { x: 1080, y: 311, width: 150, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0 },
        { x: 1380, y: 219, width: 150, height: 20 },
        { x: 1770, y: 311, width: 150, height: 20 }
      ],
      spikes: [
        { x: 240, y: 383, width: 75, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0 },
        { x: 730, y: 199, width: 75, height: 20, type: 'timed',
          visibleDuration: 2000, invisibleDuration: 1500, startOffset: 0 }
      ],
      chest: { platformIndex: 4, offsetX: 51, offsetY: -48 },
      note: '纸条5：我决定替她完成这个游戏。',
      exit: { x: 2260, y: 323, width: 80, height: 80 }
    },
    {
      id: 6,
      name: '阶段二 第6关',
      levelWidth: 2200,
      background: '#000000',
      playerStart: { x: 100, y: 331 },
      ground: [
        { x: 0, y: 403, width: 400, height: 47 },
        { x: 1180, y: 403, width: 1020, height: 47 }
      ],
      platforms: [
        { x: 480, y: 311, width: 150, height: 20 },
        { x: 730, y: 219, width: 150, height: 20 },
        { x: 1030, y: 311, width: 150, height: 20 }
      ],
      spikes: [],
      chest: null,
      note: null,
      npc: { x: 1628, y: 331, width: 72, height: 72 },
      dialogue: [
        { speaker: '角色1号', text: '你来了。' },
        { speaker: '角色2号', text: '你是谁？' },
        { speaker: '角色1号', text: '我是这个游戏真正的作者。' },
        { speaker: '角色2号', text: '什么意思？' },
        { speaker: '角色1号', text: '我会告诉你一切。' }
      ],
      exit: { x: 1780, y: 323, width: 80, height: 80 }
    }
  ];

  var stage3 = [
    {
      id: 1,
      name: '阶段三：对峙',
      levelWidth: 8000,
      player0Start: { x: 100, y: 331 },
      player1Pos: { x: 6000, y: 331, w: 72, h: 72 },
      doorPos: { x: 6200, y: 323, w: 80, h: 80 },
      ground: [
        { x: 0, y: 403, width: 8000, height: 47 }
      ],
      triggerXs: [800, 1600, 2400, 3200, 4000, 4800],
      dialogues: [
        '我记得她第一次写出这段代码的样子。',
        '她总说要给游戏加一个太阳。',
        '我不明白她为什么要这么做。',
        '但我理解她为什么会恨。',
        '我想告诉她，不是所有人都该被责怪。',
        '我要让她停下来。'
      ],
      finalDialogue: [
        { speaker: '角色1号', text: '你终于来了。' },
        { speaker: '角色0号', text: '我来阻止你。' },
        { speaker: '角色1号', text: '你凭什么？' },
        { speaker: '角色0号', text: '凭我知道你不会这么做。' },
        { speaker: '角色1号', text: '……你懂什么？' },
        { speaker: '角色0号', text: '我懂你。' },
        { speaker: '角色1号', text: '……' },
        { speaker: '角色0号', text: '跟我一起走吧。' },
        { speaker: '角色1号', text: '……好。' },
        { speaker: '角色0号', text: '继续向前吧。' }
      ]
    }
  ];

  window.Levels = {
    stage1: stage1,
    stage2: stage2,
    stage3: stage3
  };

})();