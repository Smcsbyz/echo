/* ============================================================
   文件路径：js/news.js
   说明：新闻页面逻辑（今日快讯）
         - 默认显示文章二（A死亡报道）
         - 侧边栏“昏迷事件”链接切换到文章一
         - 文章一“返回上一篇”回到文章二
         - 评论按提供顺序渲染
         - 评论输入框的“发表评论”按钮弹出提示
         - 不写入任何 GameState
         - 已删除“相关新闻”区域；正文末尾仅保留“责任编辑：XXX”
   依赖：无
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     文章数据
     ============================================================ */
  var ARTICLE1 = {
    id: 'article1',
    title: '多地出现年轻人深夜用电脑后突发昏迷病例 医生提示熬夜风险',
    source: '《云州青年报》',
    date: '2024年12月30日',
    editor: '刘亿',
    content: [
      '本报讯，近期，国内多地医疗机构陆续接诊多起特殊病例：多名年轻人在深夜使用电脑过程中，突发意识丧失、陷入昏迷，事件引发公众对于青年群体熬夜健康问题的关注。',
      '记者从接诊医院了解到，这类患者大多为青少年及青年群体，事发时均长时间在夜间使用电脑。出现不适前，当事人持续伏案操作电脑，随后突然倒地、意识不清。事发后，现场人员第一时间拨打急救电话，所有昏迷人员均被紧急送往医院接受检查与救治。截至目前，送医患者生命体征趋于平稳，暂无生命危险，相关检查仍在持续开展。',
      '接诊医生介绍，结合患者病史与初步检查结果判断，此类突发昏迷情况，大概率和长期熬夜、作息严重不规律存在关联。长时间夜间伏案，持续精神高度集中，再加上睡眠不足、身体持续透支，会造成心血管、神经系统负担急剧加重，在多种因素叠加下，有可能诱发意识障碍、晕厥昏迷。医生同时表示，目前仅为初步判断，每位患者的具体发病诱因，还需要完善各项检查后进一步确认。',
      '相关健康专家提醒，当前不少年轻人存在熬夜、昼夜颠倒的习惯，长时间熬夜使用电子设备，会持续消耗身体机能，不仅容易造成头晕乏力、记忆力下降，严重时可诱发晕厥等急症。建议广大青年合理规划作息，尽量避免通宵或者长时间熬夜使用电脑，连续使用电脑一段时间后应当起身休息，保证充足睡眠。一旦出现胸闷、头晕、心慌等不适症状，需要立刻停下工作、及时就医，切勿硬扛。',
      '医疗部门也提示，年轻人不要忽视长期睡眠不足带来的健康隐患，重视身体发出的预警信号，建立规律健康的生活方式。'
    ],
    comments: [
      { author: '家和万事兴', content: '玩游戏玩的' },
      { author: '我的青春第六号', content: '我也经常熬夜，有点害怕' },
      { author: '急先锋889', content: '作息不规律真的会出问题' }
    ]
  };

  var ARTICLE2 = {
    id: 'article2',
    title: '云州市区发生重大交通事故 女子不幸身亡 肇事司机疑似醉驾逃逸',
    source: '《云州晚报》',
    date: '2024年9月16日',
    editor: '胡英达',
    content: [
      '本报讯，2024年9月15日晚间，云州市主城区发生一起恶性道路交通事故，一名女性路人遭车辆撞击后当场身亡，肇事驾驶员事发后驾车逃离现场。目前，当地公安机关已介入该案，事故具体原因及后续处置工作正在进一步调查中。',
      '记者从警方核实获悉，本次事故发生于9月15日晚，事发地点位于云州市区游乐大厦周边十字路口。事发时段为夜间通行时段，路面交通流量处于正常水平。事故发生瞬间，肇事车辆与行经路口的行人许某发生剧烈碰撞，冲击力极大，造成许某身体严重受伤。',
      '事故发生后，周边途经市民第一时间发现险情并报警求助。辖区公安、急救等部门接警后迅速赶赴现场开展处置工作。经现场医护人员紧急勘验和救治确认，路人许女士因全身多处严重创伤、伤势过重，已无生命体征，不幸当场死亡。',
      '据记者多方了解核实，遇难者许女士时年28岁，系一名独立游戏制作人，长期深耕独立游戏创作领域，专注于原创游戏内容研发与制作，拥有个人创作项目与合作团队。生活方面，许女士并未与家人共同居住，长期与项目合作人共同租住于云州市近郊一处公寓，日常专注于创作工作，与原生家庭长期处于无联系状态。目前，相关部门已着手对接核实遇难者亲属信息，推进后续善后事宜。',
      '据现场目击者证词及警方初步勘查线索显示，本次事故肇事驾驶员为赵某某。事发当晚，赵某某驾车行经事发路口时，突发险情撞击行人，事故发生后，赵某某并未停车施救、报警，而是当即驾驶车辆逃离事故现场，性质恶劣。结合现场勘查细节、车辆行驶轨迹及相关线索，警方初步判定赵某某存在疑似醉酒驾驶的重大嫌疑，醉驾、超速、操作不当或为本次事故发生的重要诱因。',
      '截至目前，云州市公安局交警支队已成立专项调查小组，全面开展现场痕迹取证、监控调取、人员走访、肇事司机追查等各项工作，全力追捕逃逸驾驶员赵某某，固定相关事故证据。同时，警方已对事发路段交通状况、夜间通行隐患进行复盘梳理。',
      '针对此次肇事逃逸致人死亡案件，警方表示，交通肇事逃逸属于严重交通违法行为，醉酒驾驶更是明令禁止的危险驾驶行为，两项行为叠加严重危害公共交通安全，公安机关必将依法从严查处，严厉追责，绝不姑息。后续将及时向社会通报案件调查、嫌疑人抓捕及事故处置的最新进展。',
      '此次事故再次敲响交通安全警钟。警方提醒，夜间行车驾驶员需严格遵守交通法规，杜绝酒驾、醉驾、超速、分心驾驶等违法行为，遇路口提前减速、礼让行人；广大市民出行需注意观察路况，遵守通行规则，共同维护道路交通安全秩序。'
    ],
    comments: [
      { author: '花开的时候', content: '太可惜了，这么年轻' },
      { author: '平安喜乐', content: '肇事者应该严惩' },
      { author: '我像老鼠爱大米', content: '唉' }
    ]
  };

  /* ============================================================
     DOM 引用
     ============================================================ */
  var article1 = document.getElementById('article1');
  var article2 = document.getElementById('article2');

  var commentList1 = document.getElementById('commentList1');
  var commentList2 = document.getElementById('commentList2');

  var hotLinkComa = document.getElementById('hotLinkComa');
  var backToArticle2 = document.getElementById('backToArticle2');

  /* ============================================================
     工具
     ============================================================ */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parseRichText(text) {
    if (!text) return '';
    var result = escapeHtml(text);
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/\*(.+?)\*/g, '<span class="news-em">$1</span>');
    return result;
  }

  /**
   * 将文章数据应用到对应的 DOM 元素。
   * - 更新标题、元信息、正文、页脚“责任编辑”
   * - 保留页脚中已有的“返回上一篇”链接（ID 不被破坏）
   */
  function applyArticleData(articleEl, data) {
    if (!articleEl) return;

    var titleEl = articleEl.querySelector('.news-title');
    if (titleEl) {
      titleEl.textContent = data.title;
    }

    var metaEl = articleEl.querySelector('.news-meta');
    if (metaEl) {
      metaEl.innerHTML =
        '<span>发稿人：' + escapeHtml(data.source) + '</span>' +
        '<span>发布时间：' + escapeHtml(data.date) + '</span>';
    }

    var contentEl = articleEl.querySelector('.news-content');
    if (contentEl) {
      var html = '';
      for (var i = 0; i < data.content.length; i++) {
        html += '<p>' + parseRichText(data.content[i]) + '</p>';
      }
      contentEl.innerHTML = html;
    }

    /* 更新页脚“责任编辑”（第一个 span），不重建元素，保留返回链接 */
    var footerEl = articleEl.querySelector('.news-footer');
    if (footerEl) {
      var spans = footerEl.querySelectorAll('span');
      if (spans.length > 0) {
        spans[0].textContent = '责任编辑：' + data.editor;
      }
    }
  }

  function renderComments(listEl, comments) {
    if (!listEl) return;

    var html = '';
    for (var i = 0; i < comments.length; i++) {
      var c = comments[i];
      html +=
        '<li class="comment-item">' +
          '<div class="comment-head">' +
            '<span class="comment-user">' + escapeHtml(c.author) + '</span>' +
          '</div>' +
          '<div class="comment-content">' + escapeHtml(c.content) + '</div>' +
        '</li>';
    }
    listEl.innerHTML = html;
  }

  /* ============================================================
     文章切换
     ============================================================ */
  var currentArticleId = 'article2';

  function showArticle(articleId) {
    if (articleId === 'article1') {
      if (article2) article2.hidden = true;
      if (article1) article1.hidden = false;
      currentArticleId = 'article1';
    } else {
      if (article1) article1.hidden = true;
      if (article2) article2.hidden = false;
      currentArticleId = 'article2';
    }
    window.scrollTo(0, 0);
  }

  function getArticleFromHash() {
    var hash = '';
    try {
      hash = (window.location.hash || '').replace('#', '');
    } catch (e) {
      hash = '';
    }
    if (hash === 'article1') return 'article1';
    return 'article2';
  }

  function applyHash() {
    showArticle(getArticleFromHash());
  }

  function navigateTo(articleId) {
    var newHash = '#' + articleId;
    if (window.location.hash === newHash) {
      applyHash();
    } else {
      window.location.hash = newHash;
    }
  }

  /* ============================================================
     事件绑定
     ============================================================ */
  function bindEvents() {
    if (hotLinkComa) {
      hotLinkComa.addEventListener('click', function (e) {
        e.preventDefault();
        navigateTo('article1');
      });
    }

    if (backToArticle2) {
      backToArticle2.addEventListener('click', function (e) {
        e.preventDefault();
        navigateTo('article2');
      });
    }

    window.addEventListener('hashchange', function () {
      applyHash();
    });

    var placeholderLinks = document.querySelectorAll('[data-placeholder="1"]');
    for (var i = 0; i < placeholderLinks.length; i++) {
      placeholderLinks[i].addEventListener('click', function (e) {
        e.preventDefault();
        alert('功能暂未开放');
      });
    }

    var commentBtns = document.querySelectorAll('[data-comment-btn]');
    for (var j = 0; j < commentBtns.length; j++) {
      commentBtns[j].addEventListener('click', function () {
        alert('评论功能暂未开放');
      });
    }
  }

  /* ============================================================
     初始化
     ============================================================ */
  function init() {
    applyArticleData(article1, ARTICLE1);
    applyArticleData(article2, ARTICLE2);

    renderComments(commentList1, ARTICLE1.comments);
    renderComments(commentList2, ARTICLE2.comments);

    bindEvents();

    applyHash();
  }

  init();

})();