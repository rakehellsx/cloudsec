import fs from 'node:fs';
import path from 'node:path';

const root = '/home/ubuntu/cloud-traffic-security';
const appPath = path.join(root, 'client/src/App.vue');
const cssPath = path.join(root, 'client/src/index.css');

let app = fs.readFileSync(appPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

const dataAnchor = `const behaviorCategories = [\n  { title: '容器安全层', icon: 'container', risk: '高危' as Severity, hits: 142, focus: '容器内运行时异常', desc: '检测容器内 shell 会话创建、安装新软件包、从非预期路径启动进程等偏离镜像基线的行为。', vectors: ['容器内 shell 会话创建', '容器内安装新软件包', '从 /tmp、/dev/shm 等非预期位置启动进程'] },\n  { title: '主机安全层', icon: 'host', risk: '高危' as Severity, hits: 96, focus: '宿主机关键目录与权限变更', desc: '监控 /etc、/usr/bin、/usr/sbin 等敏感目录读写，识别文件所有权、访问权限变更和特权容器启动。', vectors: ['敏感目录读写', '文件所有权或权限变更', 'privileged 容器启动'] },\n  { title: '网络威胁层', icon: 'network', risk: '中危' as Severity, hits: 121, focus: '异常监听与未授权外联', desc: '发现意外端口监听、异常出站连接和未经批准的外部通信，辅助判断数据泄露与横向移动风险。', vectors: ['意外端口监听', '异常出站网络连接', '未经批准的外部通信'] },\n  { title: '敏感数据保护', icon: 'password', risk: '高危' as Severity, hits: 67, focus: '凭证与身份文件访问', desc: '持续监控 /etc/shadow、/etc/passwd、SSH 密钥、API 凭证等高价值敏感文件访问。', vectors: ['/etc/shadow 与 /etc/passwd 访问', 'SSH 私钥读取', 'API Token 与云凭证访问'] },\n];`;

const extraData = `${dataAnchor}\n\nconst behaviorTrendSeries = [\n  { label: '容器安全', color: '#1d4ed8', points: [18, 24, 21, 35, 42, 38, 31, 46, 55, 49, 62, 58, 71, 64] },\n  { label: '主机安全', color: '#f97316', points: [12, 15, 19, 22, 28, 34, 29, 31, 36, 41, 39, 44, 47, 42] },\n  { label: '网络威胁', color: '#059669', points: [21, 18, 26, 33, 31, 27, 35, 44, 48, 46, 52, 61, 57, 68] },\n  { label: '敏感数据', color: '#dc2626', points: [6, 8, 11, 9, 15, 13, 18, 16, 21, 20, 24, 29, 26, 31] },\n];\n\nconst behaviorRiskBands = [\n  { label: '高危', value: 37, percent: 38, tone: 'danger' },\n  { label: '中危', value: 84, percent: 46, tone: 'warning' },\n  { label: '低危', value: 62, percent: 16, tone: 'info' },\n];\n\nconst behaviorNamespaceRanks = [\n  { name: 'pay-prod', owner: '支付业务组', count: 18, percent: 92 },\n  { name: 'data-prod', owner: '数据平台组', count: 14, percent: 74 },\n  { name: 'ops', owner: '运维工具组', count: 9, percent: 53 },\n  { name: 'security', owner: '平台安全组', count: 7, percent: 41 },\n];\n\nconst behaviorRuleHitsTop = [\n  { rule: 'Terminal shell in container', hits: 86, layer: '容器安全' },\n  { rule: 'Unexpected listening port', hits: 64, layer: '网络威胁' },\n  { rule: 'Read sensitive credential file', hits: 52, layer: '敏感数据保护' },\n];`;

if (!app.includes('const behaviorTrendSeries = [')) {
  app = app.replace(dataAnchor, extraData);
}

const functionAnchor = `function sparkline(points: number[], width = 300, height = 120) {\n  const max = Math.max(...points);\n  const min = Math.min(...points);\n  const step = width / (points.length - 1);\n  return points.map((point, index) => {\n    const y = height - ((point - min) / Math.max(max - min, 1)) * (height - 18) - 9;\n    return \`${'${index * step},${y}'}\`;\n  }).join(' ');\n}`;
const functionReplacement = `${functionAnchor}\n\nfunction percent(value: number, total: number) {\n  return Math.round((value / Math.max(total, 1)) * 100) + '%';\n}`;
if (!app.includes('function percent(value: number, total: number)')) {
  app = app.replace(functionAnchor, functionReplacement);
}

const oldBlock = `<section v-if="activePage === 'behavior'" class="page-stack threat-behavior-page formal-behavior-page">\n        <div class="soc-header-card">\n          <div class="soc-header-main"><span class="soc-kicker"><AppIcon name="behavior" size="16" /> Falco Runtime Detection</span><h2>威胁行为检测</h2><p>基于容器运行时、宿主机系统调用、网络连接与敏感文件访问证据，识别云原生环境中的异常进程、横向移动、违规外联和凭证访问风险。</p></div>\n          <div class="soc-header-actions"><button class="white-button" @click="showToast('已刷新威胁行为检测事件与规则命中统计')"><AppIcon name="refresh" size="15" /> 刷新事件</button><button class="blue-button" @click="showToast('已下发 Falco 规则同步任务')"><AppIcon name="rules" size="15" /> 同步规则</button><button class="white-button" @click="showToast('已导出威胁行为检测证据包')"><AppIcon name="download" size="15" /> 导出证据</button></div>\n        </div>\n\n        <div class="behavior-kpi-grid formal-kpis">\n          <article v-for="stat in behaviorStats" :key="stat.label" :data-tone="stat.tone"><span><AppIcon :name="stat.icon" :label="stat.label" /></span><div><p>{{ stat.label }}</p><strong>{{ stat.value }}</strong><em>{{ stat.delta }}</em></div></article>\n        </div>\n\n        <div class="behavior-workbench">`;

const newBlock = `<section v-if="activePage === 'behavior'" class="page-stack threat-behavior-page formal-behavior-page">\n        <div class="behavior-command-center">\n          <div class="soc-header-card behavior-compact-header">\n            <div class="soc-header-main"><span class="soc-kicker"><AppIcon name="behavior" size="16" /> Falco Runtime Detection</span><h2>威胁行为检测</h2><p>基于容器运行时、宿主机系统调用、网络连接与敏感文件访问证据，构建“指标—趋势—证据—处置”的运行时安全运营闭环。</p></div>\n            <div class="soc-header-actions"><button class="white-button" @click="showToast('已刷新威胁行为检测事件与规则命中统计')"><AppIcon name="refresh" size="15" /> 刷新事件</button><button class="blue-button" @click="showToast('已下发 Falco 规则同步任务')"><AppIcon name="rules" size="15" /> 同步规则</button><button class="white-button" @click="showToast('已导出威胁行为检测证据包')"><AppIcon name="export" size="15" /> 导出证据</button></div>\n          </div>\n\n          <div class="behavior-kpi-strip">\n            <article v-for="stat in behaviorStats" :key="stat.label" :data-tone="stat.tone">\n              <div class="kpi-top"><span><AppIcon :name="stat.icon" :label="stat.label" /></span><small>近24小时</small></div>\n              <p>{{ stat.label }}</p><strong>{{ stat.value }}</strong><em>{{ stat.delta }}</em>\n            </article>\n          </div>\n        </div>\n\n        <div class="behavior-analytics-grid">\n          <section class="panel behavior-trend-panel">\n            <div class="panel-title-row compact"><div><h3>威胁行为趋势</h3><p>近 24 小时四类运行时事件命中走势</p></div><span class="tag info">实时聚合</span></div>\n            <div class="behavior-trend-wrap">\n              <svg class="behavior-trend-chart" viewBox="0 0 520 168" preserveAspectRatio="none" role="img" aria-label="威胁行为趋势图">\n                <line v-for="y in [28, 70, 112, 154]" :key="y" x1="0" :y1="y" x2="520" :y2="y" class="chart-grid-line" />\n                <polyline v-for="series in behaviorTrendSeries" :key="series.label" :points="sparkline(series.points, 520, 168)" class="behavior-trend-line" :style="{ '--line-color': series.color }" />\n              </svg>\n              <div class="trend-axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>现在</span></div>\n            </div>\n            <div class="trend-legend"><span v-for="series in behaviorTrendSeries" :key="series.label"><i :style="{ background: series.color }"></i>{{ series.label }}</span></div>\n          </section>\n\n          <section class="panel layer-distribution-panel">\n            <div class="panel-title-row compact"><div><h3>检测层面分布</h3><p>按 Falco 规则域统计命中量</p></div><strong>426</strong></div>\n            <article v-for="category in behaviorCategories" :key="category.title" class="layer-meter-row">\n              <div><span :class="behaviorLayerClass(category.title.replace('层', ''))"><AppIcon :name="category.icon" size="15" /> {{ category.title }}</span><b>{{ category.hits }}</b></div>\n              <div class="meter-track"><i :style="{ width: percent(category.hits, 426) }"></i></div>\n            </article>\n          </section>\n\n          <section class="panel risk-radar-panel">\n            <div class="panel-title-row compact"><div><h3>风险等级分布</h3><p>高危事件优先进入隔离与工单流程</p></div></div>\n            <div class="risk-donut"><strong>37</strong><span>高危事件</span></div>\n            <div class="risk-band-list"><article v-for="band in behaviorRiskBands" :key="band.label" :data-tone="band.tone"><div><b>{{ band.label }}</b><em>{{ band.value }} 起</em></div><span><i :style="{ width: band.percent + '%' }"></i></span></article></div>\n          </section>\n\n          <section class="panel workload-rank-panel">\n            <div class="panel-title-row compact"><div><h3>受影响命名空间</h3><p>按工作负载风险密度排序</p></div><span class="tag warning">Top 4</span></div>\n            <article v-for="item in behaviorNamespaceRanks" :key="item.name" class="workload-rank-row">\n              <div><b>{{ item.name }}</b><span>{{ item.owner }}</span><em>{{ item.count }} 起</em></div>\n              <span class="rank-track"><i :style="{ width: item.percent + '%' }"></i></span>\n            </article>\n            <div class="rule-hit-mini"><span v-for="rule in behaviorRuleHitsTop" :key="rule.rule"><b>{{ rule.hits }}</b>{{ rule.rule }}</span></div>\n          </section>\n        </div>\n\n        <div class="behavior-workbench">`;

if (!app.includes('behavior-analytics-grid')) {
  if (!app.includes(oldBlock)) throw new Error('未找到威胁行为检测上半部旧模板块');
  app = app.replace(oldBlock, newBlock);
}

const cssAppend = `

/* 威胁行为检测上半部图形化统计看板：坚持 Neo-Enterprise Minimalism，以紧凑白底卡片、深靛蓝主线、青绿/橙红风险色表达正式安全运营统计层级。 */
.behavior-command-center {
  display: grid;
  grid-template-columns: minmax(0, 1.46fr) minmax(460px, .94fr);
  gap: 16px;
  align-items: stretch;
}

.behavior-compact-header {
  min-height: 148px;
  padding: 20px 22px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 86% 18%, rgba(29, 78, 216, .10), transparent 24%),
    linear-gradient(135deg, #ffffff 0%, #f7fbff 58%, #eef6ff 100%);
}

.behavior-kpi-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.behavior-kpi-strip article {
  position: relative;
  overflow: hidden;
  min-height: 104px;
  padding: 14px 15px 12px;
  border: 1px solid #dbe7f4;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 26px rgba(15, 23, 42, .06);
}

.behavior-kpi-strip article::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: #1d4ed8;
}

.behavior-kpi-strip article[data-tone="red"]::before { background: #dc2626; }
.behavior-kpi-strip article[data-tone="orange"]::before { background: #f97316; }
.behavior-kpi-strip article[data-tone="green"]::before { background: #059669; }

.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.kpi-top span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #1d4ed8;
  border-radius: 12px;
  background: #eff6ff;
}

.kpi-top small,
.behavior-kpi-strip p,
.panel-title-row.compact p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

.behavior-kpi-strip p {
  margin-top: 10px;
}

.behavior-kpi-strip strong {
  display: inline-block;
  margin-top: 2px;
  color: #0f172a;
  font-size: 27px;
  line-height: 1;
}

.behavior-kpi-strip em {
  display: inline-block;
  margin-left: 8px;
  color: #1d4ed8;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}

.behavior-analytics-grid {
  display: grid;
  grid-template-columns: minmax(420px, 1.35fr) minmax(280px, .85fr) minmax(250px, .72fr) minmax(290px, .9fr);
  gap: 16px;
  align-items: stretch;
}

.behavior-analytics-grid .panel {
  min-width: 0;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #dfe8f4;
  background: #fff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, .05);
}

.panel-title-row.compact {
  align-items: flex-start;
  margin-bottom: 12px;
}

.panel-title-row.compact h3 {
  margin-bottom: 4px;
  font-size: 15px;
}

.panel-title-row.compact strong {
  color: #0f172a;
  font-size: 22px;
}

.behavior-trend-panel {
  min-height: 292px;
}

.behavior-trend-wrap {
  height: 198px;
  padding: 8px 2px 0;
}

.behavior-trend-chart {
  width: 100%;
  height: 168px;
  overflow: visible;
}

.chart-grid-line {
  stroke: #e5edf7;
  stroke-width: 1;
}

.behavior-trend-line {
  fill: none;
  stroke: var(--line-color);
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 4px 6px rgba(29, 78, 216, .10));
}

.trend-axis,
.trend-legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #7a8798;
  font-size: 11px;
}

.trend-legend {
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 10px;
}

.trend-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-size: 12px;
}

.trend-legend i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.layer-meter-row {
  display: grid;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #edf2f8;
}

.layer-meter-row:last-child {
  border-bottom: 0;
}

.layer-meter-row > div:first-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.layer-meter-row b {
  color: #0f172a;
}

.meter-track,
.rank-track,
.risk-band-list span {
  position: relative;
  overflow: hidden;
  height: 8px;
  border-radius: 999px;
  background: #edf2f7;
}

.meter-track i,
.rank-track i,
.risk-band-list i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1d4ed8, #22d3ee);
}

.risk-radar-panel {
  display: grid;
  align-content: start;
}

.risk-donut {
  width: 132px;
  height: 132px;
  margin: 2px auto 14px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background:
    radial-gradient(circle, #fff 0 52%, transparent 53%),
    conic-gradient(#dc2626 0 38%, #f97316 38% 84%, #1d4ed8 84% 100%);
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, .05), 0 10px 24px rgba(220, 38, 38, .10);
}

.risk-donut strong,
.risk-donut span {
  grid-area: 1 / 1;
  text-align: center;
}

.risk-donut strong {
  margin-top: -14px;
  color: #0f172a;
  font-size: 26px;
}

.risk-donut span {
  margin-top: 30px;
  color: #64748b;
  font-size: 12px;
}

.risk-band-list {
  display: grid;
  gap: 9px;
}

.risk-band-list article {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}

.risk-band-list div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.risk-band-list b {
  color: #172033;
  font-size: 12px;
}

.risk-band-list em {
  color: #64748b;
  font-size: 11px;
  font-style: normal;
}

.risk-band-list article[data-tone="danger"] i { background: #dc2626; }
.risk-band-list article[data-tone="warning"] i { background: #f97316; }
.risk-band-list article[data-tone="info"] i { background: #1d4ed8; }

.workload-rank-row {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.workload-rank-row > div {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: baseline;
}

.workload-rank-row b {
  color: #172033;
}

.workload-rank-row span,
.workload-rank-row em {
  color: #64748b;
  font-size: 12px;
  font-style: normal;
}

.rule-hit-mini {
  display: grid;
  gap: 7px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed #d8e2ef;
}

.rule-hit-mini span {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 8px;
  align-items: center;
  color: #475569;
  font-size: 12px;
}

.rule-hit-mini b {
  color: #1d4ed8;
}

@media (max-width: 1480px) {
  .behavior-command-center,
  .behavior-analytics-grid {
    grid-template-columns: 1fr 1fr;
  }
  .behavior-trend-panel {
    grid-column: span 2;
  }
}

@media (max-width: 980px) {
  .behavior-command-center,
  .behavior-analytics-grid,
  .behavior-kpi-strip {
    grid-template-columns: 1fr;
  }
  .behavior-trend-panel {
    grid-column: auto;
  }
}
`;

if (!css.includes('威胁行为检测上半部图形化统计看板')) {
  css += cssAppend;
}

fs.writeFileSync(appPath, app);
fs.writeFileSync(cssPath, css);
console.log('behavior dashboard refactor patch applied');
