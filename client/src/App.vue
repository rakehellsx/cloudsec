<!--
设计约束：Neo-Enterprise Minimalism，新企业级极简控制台美学。白底、可信、可审计、可联动；以深靛蓝、亮青、橙红表达安全态势层级。任何组件选择都应强化“指标—趋势—证据—处置”的安全运营闭环。
-->
<script setup lang="ts">
import { computed, ref } from 'vue';

type Severity = '高危' | '中危' | '低危';
type Status = '成功' | '未成功' | '处置中' | '已阻断';
type PageKey = 'overview' | 'traffic' | 'threat' | 'alerts' | 'assets' | 'policy' | 'audit' | 'settings';

const heroImage = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663634182444/HtDBEiGaicfXVGrjSqf8in/cloud-traffic-hero-GSaoTrZgexZzNdw4p7MmPg.webp';
const topologyImage = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663634182444/HtDBEiGaicfXVGrjSqf8in/cloud-asset-topology-JhdrGTaY46JRHVYzfpAom7.webp';
const threatFlowImage = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663634182444/HtDBEiGaicfXVGrjSqf8in/cloud-threat-flow-mwQWRn6eB5eHa2HPym8qrv.webp';

const activePage = ref<PageKey>('overview');
const selectedRange = ref('今日');
const selectedBiz = ref('全部业务');
const selectedThreat = ref('全部类型');
const searchKeyword = ref('');
const drawerOpen = ref(false);
const selectedAlertId = ref('A-2301');
const toastText = ref('');
const selectedAsset = ref('ECS-02');
const autoRefresh = ref(true);
const baselineMode = ref('智能基线');
const selectedRows = ref<string[]>([]);

const navItems: { key: PageKey; label: string; desc: string; mark: string }[] = [
  { key: 'overview', label: '态势概览', desc: '全局云内流量安全态势', mark: 'OV' },
  { key: 'traffic', label: '流量分析', desc: '东西向与南北向流量研判', mark: 'TF' },
  { key: 'threat', label: '威胁检测', desc: '攻击类型、情报与溯源', mark: 'TH' },
  { key: 'alerts', label: '实时告警', desc: '筛选、批量与处置闭环', mark: 'AL' },
  { key: 'assets', label: '云资产管理', desc: 'VPC、主机、容器与暴露面', mark: 'AS' },
  { key: 'policy', label: '安全策略', desc: '白名单、业务规则与响应', mark: 'PL' },
  { key: 'audit', label: '日志审计', desc: '操作留痕与证据链', mark: 'LG' },
  { key: 'settings', label: '系统设置', desc: '接入配置与运营参数', mark: 'ST' },
];

const kpis = [
  { label: '受攻击 Region', value: '35', delta: '+4', tone: 'cyan', hint: '华北、华东、华南风险抬升' },
  { label: '受攻击物理机', value: '9,800', delta: '+7.2%', tone: 'blue', hint: '端口扫描与弱口令集中' },
  { label: '受攻击云主机', value: '53,455', delta: '+12.8%', tone: 'orange', hint: 'ECS 资产暴露面扩大' },
  { label: '受攻击容器', value: '23,455', delta: '-2.1%', tone: 'green', hint: '运行时拦截生效' },
];

const attackTrend = [42, 55, 63, 48, 38, 51, 69, 73, 59, 52, 66, 81, 74, 58];
const egressTrend = [18, 22, 31, 27, 24, 35, 39, 42, 37, 45, 49, 43, 51, 56];
const baselineTrend = [32, 35, 36, 34, 36, 38, 41, 42, 43, 44, 45, 47, 48, 50];

const businessRisk = [
  { name: '数字化作业部-数据模型工具应用生产', high: 520, mid: 240, low: 90 },
  { name: '物资管理系统-Portal 应用生产', high: 410, mid: 260, low: 60 },
  { name: '省公司门户应用生产 ECS14', high: 280, mid: 300, low: 110 },
  { name: '智能一体化运维支撑平台', high: 180, mid: 220, low: 140 },
  { name: '安全风险管控监督平台', high: 120, mid: 190, low: 160 },
];

const alerts = ref([
  { id: 'A-2301', source: '36.21.0.49:50166', sourceGeo: '江苏-南京', target: '39.110.116.43:58000', asset: 'ECS02 数据模型工具', type: '系统命令执行', severity: '高危' as Severity, status: '成功' as Status, time: '2026-05-07 11:15:15', payload: '/rest/v1/messages?select=agents.agent_id(name)&thread_id=eq.19833769', tactic: '远程代码执行', confidence: 96 },
  { id: 'A-2302', source: '223.11.8.195:443', sourceGeo: '荷兰', target: '172.16.130.251:58000', asset: 'RDS01-0', type: '注入攻击', severity: '高危' as Severity, status: '处置中' as Status, time: '2026-05-07 11:15:13', payload: '/api/agent/start union select password', tactic: 'SQL 注入', confidence: 91 },
  { id: 'A-2303', source: '10.2.55.80:53269', sourceGeo: '安全监察部', target: '172.16.130.251:58000', asset: 'RDS01-0', type: '端口扫描', severity: '低危' as Severity, status: '未成功' as Status, time: '2026-05-07 11:15:12', payload: 'tcp syn sweep 22/80/443/6379', tactic: '发现探测', confidence: 73 },
  { id: 'A-2304', source: '25.34.55.80:53269', sourceGeo: '国网山西电力', target: '172.20.46.31:443', asset: 'nginx-web', type: '弱口令爆破', severity: '中危' as Severity, status: '已阻断' as Status, time: '2026-05-07 11:15:10', payload: 'ssh login fail count > 120', tactic: '凭据访问', confidence: 88 },
  { id: 'A-2305', source: '58.31.21.92:40122', sourceGeo: '辽宁-沈阳', target: '10.48.9.21:6443', asset: 'K8S-Prod-01', type: '未授权访问', severity: '中危' as Severity, status: '处置中' as Status, time: '2026-05-07 11:14:58', payload: '/api/v1/namespaces/default/secrets', tactic: '云原生权限滥用', confidence: 84 },
]);

const assets = [
  { id: 'ECS-02', name: '数据模型工具应用生产', kind: '云主机', vpc: 'vpc-prod-east', risk: 92, exposure: '公网 443/8080', owner: '数字化作业部', posture: '两高一弱' },
  { id: 'RDS01-0', name: '生产核心数据库', kind: '数据库', vpc: 'vpc-prod-east', risk: 86, exposure: '内网 3306', owner: '业务平台组', posture: '敏感资产' },
  { id: 'K8S-Prod-01', name: '生产容器集群', kind: '容器', vpc: 'vpc-prod-core', risk: 78, exposure: 'API Server', owner: '云原生团队', posture: '策略待加固' },
  { id: 'NGW-01', name: '南北向网关', kind: '网关', vpc: 'vpc-edge', risk: 64, exposure: '公网 80/443', owner: '网络安全部', posture: '正常监测' },
];

const policies = ref([
  { name: '高危命令执行自动隔离', scope: '云主机 / 容器', mode: '阻断并工单', enabled: true, hits: 128 },
  { name: '数据库注入攻击溯源', scope: 'RDS / Web API', mode: '标记误报后复核', enabled: true, hits: 86 },
  { name: '白名单业务接口放行', scope: 'Portal / 运维平台', mode: '仅告警', enabled: false, hits: 42 },
  { name: '东西向异常峰值基线', scope: 'VPC / 子网', mode: '自动调高等级', enabled: true, hits: 211 },
]);

const auditLogs = [
  { time: '2026-05-07 11:23:02', actor: 'admin', action: '将 A-2301 标记为高危确认', object: '实时告警', result: '成功' },
  { time: '2026-05-07 11:20:31', actor: 'sec_ops', action: '导出外部攻击流量证据包', object: '溯源分析', result: '成功' },
  { time: '2026-05-07 11:18:44', actor: 'system', action: '命中高危命令执行自动隔离策略', object: 'ECS-02', result: '已阻断' },
  { time: '2026-05-07 11:16:17', actor: 'auditor', action: '查看云资产两高一弱列表', object: '云资产管理', result: '成功' },
];

const selectedAlert = computed(() => alerts.value.find((item) => item.id === selectedAlertId.value) || alerts.value[0]);
const filteredAlerts = computed(() => alerts.value.filter((item) => {
  const byThreat = selectedThreat.value === '全部类型' || item.type === selectedThreat.value;
  const keyword = searchKeyword.value.trim().toLowerCase();
  const byKeyword = !keyword || `${item.source} ${item.target} ${item.asset} ${item.type} ${item.payload}`.toLowerCase().includes(keyword);
  return byThreat && byKeyword;
}));
const selectedAssetDetail = computed(() => assets.find((asset) => asset.id === selectedAsset.value) || assets[0]);
const highRiskCount = computed(() => filteredAlerts.value.filter((item) => item.severity === '高危').length);
const pageTitle = computed(() => navItems.find((item) => item.key === activePage.value)?.label || '态势概览');
const pageDesc = computed(() => navItems.find((item) => item.key === activePage.value)?.desc || '');

function showToast(text: string) {
  toastText.value = text;
  window.setTimeout(() => {
    if (toastText.value === text) toastText.value = '';
  }, 2200);
}

function openAlert(id: string) {
  selectedAlertId.value = id;
  drawerOpen.value = true;
}

function setPage(page: PageKey) {
  activePage.value = page;
  drawerOpen.value = false;
}

function togglePolicy(index: number) {
  policies.value[index].enabled = !policies.value[index].enabled;
  showToast(`${policies.value[index].name} 已${policies.value[index].enabled ? '启用' : '停用'}`);
}

function markHandled() {
  const target = alerts.value.find((item) => item.id === selectedAlertId.value);
  if (target) target.status = '已阻断';
  showToast(`告警 ${selectedAlertId.value} 已完成阻断并写入审计日志`);
}

function batchProcess() {
  const ids = selectedRows.value.length ? selectedRows.value : filteredAlerts.value.slice(0, 2).map((item) => item.id);
  alerts.value = alerts.value.map((item) => ids.includes(item.id) ? { ...item, status: '处置中' as Status } : item);
  selectedRows.value = ids;
  showToast(`已创建 ${ids.length} 条批量处置任务`);
}

function toggleRow(id: string) {
  selectedRows.value = selectedRows.value.includes(id) ? selectedRows.value.filter((row) => row !== id) : [...selectedRows.value, id];
}

function sparkline(points: number[], width = 280, height = 94) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const step = width / (points.length - 1);
  return points.map((point, index) => {
    const y = height - ((point - min) / Math.max(max - min, 1)) * (height - 16) - 8;
    return `${index * step},${y}`;
  }).join(' ');
}

function severityClass(severity: Severity) {
  return severity === '高危' ? 'risk-high' : severity === '中危' ? 'risk-mid' : 'risk-low';
}

function statusClass(status: Status) {
  return status === '成功' ? 'status-danger' : status === '处置中' ? 'status-work' : status === '已阻断' ? 'status-safe' : 'status-muted';
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">CS</div>
        <div>
          <h1>云流量安全分析</h1>
          <p>Cloud Traffic Security</p>
        </div>
      </div>
      <nav class="nav-list" aria-label="主导航">
        <button v-for="item in navItems" :key="item.key" :class="['nav-item', { active: activePage === item.key }]" @click="setPage(item.key)">
          <span class="nav-mark">{{ item.mark }}</span>
          <span><strong>{{ item.label }}</strong><small>{{ item.desc }}</small></span>
        </button>
      </nav>
      <div class="sidebar-card">
        <span class="eyebrow">运行状态</span>
        <strong>{{ autoRefresh ? '实时刷新中' : '手动研判' }}</strong>
        <p>当前基线模式：{{ baselineMode }}</p>
        <button class="ghost-button" @click="autoRefresh = !autoRefresh">{{ autoRefresh ? '暂停刷新' : '恢复刷新' }}</button>
      </div>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <span class="breadcrumb">我的位置 / {{ pageTitle }}</span>
          <h2>{{ pageTitle }}</h2>
          <p>{{ pageDesc }}</p>
        </div>
        <div class="top-actions">
          <select v-model="selectedRange">
            <option>今日</option><option>近 7 天</option><option>近 30 天</option>
          </select>
          <select v-model="selectedBiz">
            <option>全部业务</option><option>数字化作业部</option><option>物资管理系统</option><option>智能运维平台</option>
          </select>
          <button class="primary-button" @click="showToast('已触发全局风险重算，预计 12 秒后完成')">重新研判</button>
        </div>
      </header>

      <section v-if="activePage === 'overview'" class="page-stack">
        <div class="hero-panel">
          <div class="hero-copy">
            <span class="eyebrow">Security Posture</span>
            <h3>从云内流量到威胁证据的统一分析工作台</h3>
            <p>系统将南北向入口、东西向横移、资产暴露面和告警处置状态统一到同一条安全运营链路中，支持从态势发现直接下钻到溯源证据。</p>
            <div class="hero-actions">
              <button class="primary-button" @click="setPage('alerts')">查看实时告警</button>
              <button class="secondary-button" @click="setPage('threat')">进入溯源分析</button>
            </div>
          </div>
          <img :src="heroImage" alt="云流量安全拓扑概览" />
        </div>

        <div class="kpi-grid">
          <article v-for="kpi in kpis" :key="kpi.label" class="kpi-card">
            <span class="kpi-dot" :data-tone="kpi.tone"></span>
            <p>{{ kpi.label }}</p>
            <strong>{{ kpi.value }}</strong>
            <small>{{ kpi.delta }} · {{ kpi.hint }}</small>
          </article>
        </div>

        <div class="dashboard-grid">
          <section class="panel span-7">
            <div class="panel-title"><div><span class="eyebrow">Trend</span><h3>攻击趋势监测</h3></div><button @click="baselineMode = baselineMode === '智能基线' ? '固定阈值' : '智能基线'">{{ baselineMode }}</button></div>
            <svg class="line-chart" viewBox="0 0 300 112" role="img" aria-label="攻击趋势折线图">
              <defs><linearGradient id="fillAttack" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#0ea5e9" stop-opacity="0.25"/><stop offset="1" stop-color="#0ea5e9" stop-opacity="0"/></linearGradient></defs>
              <polyline :points="sparkline(baselineTrend, 300, 100)" class="line muted-line" />
              <polyline :points="sparkline(attackTrend, 300, 100)" class="line attack-line" />
              <polyline :points="sparkline(egressTrend, 300, 100)" class="line egress-line" />
            </svg>
            <div class="legend"><span><i class="cyan"></i>互联网攻击</span><span><i class="blue"></i>云内横向攻击</span><span><i class="gray"></i>智能基线</span></div>
          </section>

          <section class="panel span-5">
            <div class="panel-title"><div><span class="eyebrow">Business Risk</span><h3>受攻击业务系统</h3></div><button @click="setPage('traffic')">下钻</button></div>
            <div class="risk-bars">
              <div v-for="biz in businessRisk" :key="biz.name" class="risk-row">
                <span>{{ biz.name }}</span>
                <div class="stack-bar"><i :style="{ width: `${biz.low / 10}%` }" class="low"></i><i :style="{ width: `${biz.mid / 10}%` }" class="mid"></i><i :style="{ width: `${biz.high / 10}%` }" class="high"></i></div>
                <strong>{{ biz.high + biz.mid + biz.low }}</strong>
              </div>
            </div>
          </section>

          <section class="panel span-4">
            <div class="panel-title"><div><span class="eyebrow">Distribution</span><h3>攻击类型分布</h3></div></div>
            <div class="donut-wrap"><div class="donut"></div><ul><li>SQL注入 31%</li><li>XSS 22%</li><li>命令执行 18%</li><li>端口扫描 29%</li></ul></div>
          </section>

          <section class="panel span-8">
            <div class="panel-title"><div><span class="eyebrow">Realtime</span><h3>实时告警监测</h3></div><button @click="setPage('alerts')">打开告警台</button></div>
            <table class="data-table compact"><thead><tr><th>时间</th><th>源 IP</th><th>资产</th><th>攻击类型</th><th>等级</th><th>状态</th></tr></thead><tbody><tr v-for="alert in alerts.slice(0, 4)" :key="alert.id" @click="openAlert(alert.id)"><td>{{ alert.time.slice(11) }}</td><td>{{ alert.source }}</td><td>{{ alert.asset }}</td><td>{{ alert.type }}</td><td><span :class="['pill', severityClass(alert.severity)]">{{ alert.severity }}</span></td><td><span :class="['pill', statusClass(alert.status)]">{{ alert.status }}</span></td></tr></tbody></table>
          </section>
        </div>
      </section>

      <section v-if="activePage === 'traffic'" class="page-stack">
        <div class="split-layout">
          <section class="panel wide-visual">
            <div class="panel-title"><div><span class="eyebrow">Traffic Canvas</span><h3>云内流量关系画布</h3></div><button @click="showToast('已将当前流量视图加入研判快照')">生成快照</button></div>
            <img :src="topologyImage" alt="云资产流量拓扑" />
          </section>
          <section class="panel evidence-panel">
            <span class="eyebrow">Linked Context</span>
            <h3>联动研判摘要</h3>
            <p>当前筛选条件为 {{ selectedRange }} / {{ selectedBiz }}。系统识别到 ECS-02 与 RDS01-0 之间存在异常高频请求，且与外部攻击源 36.21.0.49 的时间窗口重合。</p>
            <div class="metric-list"><div><span>异常峰值</span><strong>+284%</strong></div><div><span>疑似横移</span><strong>7 条</strong></div><div><span>关联资产</span><strong>4 个</strong></div></div>
            <button class="primary-button block" @click="setPage('threat')">查看攻击过程</button>
          </section>
        </div>
        <section class="panel">
          <div class="panel-title"><div><span class="eyebrow">Baseline</span><h3>流量基线偏离</h3></div></div>
          <div class="baseline-grid"><div v-for="item in ['南北向入口流量', '东西向服务调用', '数据库访问', '容器 API 请求']" :key="item" class="baseline-card"><span>{{ item }}</span><div class="mini-wave"><i></i><i></i><i></i><i></i><i></i></div><strong>{{ Math.floor(60 + item.length * 3) }}%</strong></div></div>
        </section>
      </section>

      <section v-if="activePage === 'threat'" class="page-stack">
        <div class="split-layout reverse">
          <section class="panel evidence-panel">
            <span class="eyebrow">Threat Intelligence</span>
            <h3>攻击者画像</h3>
            <p>源地址 36.21.0.49 在近 24 小时内命中命令执行、目录扫描与敏感接口访问三类行为，疑似自动化漏洞利用工具链。</p>
            <ol class="timeline"><li>入口命中 /rest/v1/messages 异常参数</li><li>尝试枚举 agent 与 thread 对象</li><li>对 ECS-02 发起命令执行载荷</li><li>横向访问 RDS01-0 被策略拦截</li></ol>
            <button class="primary-button block" @click="openAlert('A-2301')">打开证据抽屉</button>
          </section>
          <section class="panel wide-visual">
            <div class="panel-title"><div><span class="eyebrow">Attack Path</span><h3>溯源分析与攻击过程</h3></div><button @click="showToast('流量包分析任务已加入队列')">流量包分析</button></div>
            <img :src="threatFlowImage" alt="云流量攻击过程" />
          </section>
        </div>
      </section>

      <section v-if="activePage === 'alerts'" class="page-stack">
        <section class="filter-panel">
          <div class="tabs"><button :class="{ active: selectedThreat === '全部类型' }" @click="selectedThreat = '全部类型'">全部 {{ alerts.length }}</button><button v-for="type in ['系统命令执行', '注入攻击', '端口扫描', '弱口令爆破', '未授权访问']" :key="type" :class="{ active: selectedThreat === type }" @click="selectedThreat = type">{{ type }}</button></div>
          <div class="filters"><input v-model="searchKeyword" placeholder="检索源IP、资产、攻击载荷" /><button class="primary-button" @click="batchProcess">批量处置</button><button class="secondary-button" @click="showToast('已导出当前筛选结果')">导出数据</button></div>
        </section>
        <section class="panel">
          <div class="panel-title"><div><span class="eyebrow">Alert Queue</span><h3>实时告警列表 · 高危 {{ highRiskCount }}</h3></div><span class="soft-badge">已选择 {{ selectedRows.length }} 条</span></div>
          <table class="data-table"><thead><tr><th></th><th>序号</th><th>源 IP</th><th>目的 IP</th><th>攻击类型</th><th>攻击状态</th><th>详细参数</th><th>告警时间</th><th>操作</th></tr></thead><tbody><tr v-for="(alert, index) in filteredAlerts" :key="alert.id"><td><input type="checkbox" :checked="selectedRows.includes(alert.id)" @change="toggleRow(alert.id)" /></td><td>{{ index + 1 }}</td><td><strong>{{ alert.source }}</strong><small>{{ alert.sourceGeo }}</small></td><td><strong>{{ alert.target }}</strong><small>{{ alert.asset }}</small></td><td><span :class="['pill', severityClass(alert.severity)]">{{ alert.type }}</span></td><td><span :class="['pill', statusClass(alert.status)]">{{ alert.status }}</span></td><td class="payload">{{ alert.payload }}</td><td>{{ alert.time }}</td><td><button @click="openAlert(alert.id)">溯源分析</button><button @click="showToast(`${alert.id} 已标记误报`) ">标记误报</button></td></tr></tbody></table>
        </section>
      </section>

      <section v-if="activePage === 'assets'" class="page-stack">
        <section class="panel">
          <div class="panel-title"><div><span class="eyebrow">Cloud Assets</span><h3>云资产风险定位</h3></div><button @click="showToast('资产同步任务已启动')">同步资产</button></div>
          <div class="asset-grid"><article v-for="asset in assets" :key="asset.id" :class="['asset-card', { active: selectedAsset === asset.id }]" @click="selectedAsset = asset.id"><span>{{ asset.kind }}</span><h3>{{ asset.name }}</h3><p>{{ asset.id }} · {{ asset.vpc }}</p><div class="risk-meter"><i :style="{ width: `${asset.risk}%` }"></i></div><strong>风险 {{ asset.risk }}</strong></article></div>
        </section>
        <section class="panel detail-card"><span class="eyebrow">Asset Detail</span><h3>{{ selectedAssetDetail.name }}</h3><p>{{ selectedAssetDetail.owner }} 负责，暴露面为 {{ selectedAssetDetail.exposure }}，当前姿态：{{ selectedAssetDetail.posture }}。</p><div class="chip-row"><span>关联告警 {{ alerts.filter(a => a.asset.includes(selectedAssetDetail.id) || selectedAssetDetail.name.includes(a.asset)).length + 2 }}</span><span>开放端口 6</span><span>漏洞 12</span><span>弱口令 3</span></div></section>
      </section>

      <section v-if="activePage === 'policy'" class="page-stack">
        <section class="panel">
          <div class="panel-title"><div><span class="eyebrow">Policy Orchestration</span><h3>业务规则与白名单</h3></div><button @click="showToast('新建规则向导为原型占位，可继续扩展表单')">新建规则</button></div>
          <div class="policy-list"><article v-for="(policy, index) in policies" :key="policy.name" class="policy-item"><div><h3>{{ policy.name }}</h3><p>{{ policy.scope }} · {{ policy.mode }}</p></div><strong>{{ policy.hits }} 次命中</strong><button :class="['switch', { on: policy.enabled }]" @click="togglePolicy(index)"><span></span></button></article></div>
        </section>
      </section>

      <section v-if="activePage === 'audit'" class="page-stack">
        <section class="panel">
          <div class="panel-title"><div><span class="eyebrow">Audit Trail</span><h3>日志审计与证据留痕</h3></div><button @click="showToast('已生成审计报告草稿')">生成报告</button></div>
          <table class="data-table"><thead><tr><th>时间</th><th>操作者</th><th>动作</th><th>对象</th><th>结果</th></tr></thead><tbody><tr v-for="log in auditLogs" :key="log.time"><td>{{ log.time }}</td><td>{{ log.actor }}</td><td>{{ log.action }}</td><td>{{ log.object }}</td><td><span class="pill status-safe">{{ log.result }}</span></td></tr></tbody></table>
        </section>
      </section>

      <section v-if="activePage === 'settings'" class="page-stack">
        <section class="panel settings-grid">
          <div><span class="eyebrow">Configuration</span><h3>系统接入配置</h3><p>原型内置云流量镜像、告警联动、策略响应与审计留痕参数，可作为后续真实系统的交互蓝本。</p></div>
          <label>流量接入方式<select><option>云镜像流量</option><option>Agent 采集</option><option>VPC Flow Log</option></select></label>
          <label>默认响应策略<select><option>告警 + 溯源</option><option>自动阻断</option><option>仅记录</option></select></label>
          <label>基线学习窗口<select v-model="baselineMode"><option>智能基线</option><option>固定阈值</option><option>手动阈值</option></select></label>
        </section>
      </section>
    </main>

    <aside :class="['drawer', { open: drawerOpen }]" aria-label="告警详情抽屉">
      <button class="close" @click="drawerOpen = false">×</button>
      <span class="eyebrow">Alert Evidence</span>
      <h3>{{ selectedAlert.id }} · {{ selectedAlert.type }}</h3>
      <p>{{ selectedAlert.source }} → {{ selectedAlert.target }}</p>
      <div class="drawer-kpis"><div><span>置信度</span><strong>{{ selectedAlert.confidence }}%</strong></div><div><span>等级</span><strong>{{ selectedAlert.severity }}</strong></div><div><span>状态</span><strong>{{ selectedAlert.status }}</strong></div></div>
      <section><h4>攻击载荷</h4><code>{{ selectedAlert.payload }}</code></section>
      <section><h4>推荐处置</h4><ol><li>隔离受影响资产 {{ selectedAlert.asset }}</li><li>提取同窗口流量包与 Web 访问日志</li><li>联动策略阻断源地址并生成审计记录</li></ol></section>
      <button class="primary-button block" @click="markHandled">一键阻断并留痕</button>
      <button class="secondary-button block" @click="showToast('已创建人工复核工单')">转人工复核</button>
    </aside>

    <div v-if="toastText" class="toast">{{ toastText }}</div>
  </div>
</template>
