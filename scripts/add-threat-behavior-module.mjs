import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const appPath = join(root, 'client/src/App.vue');
const cssPath = join(root, 'client/src/index.css');
let app = readFileSync(appPath, 'utf8');
let css = readFileSync(cssPath, 'utf8');

const replacements = [
  ["type PageKey = 'overview' | 'alerts' | 'intelligence' | 'trace' | 'risk' | 'assets' | 'rules' | 'warning';", "type PageKey = 'overview' | 'alerts' | 'behavior' | 'intelligence' | 'trace' | 'risk' | 'assets' | 'rules' | 'warning';"],
  ["      { key: 'alerts' as PageKey, label: '实时告警', icon: 'alerts' },\n      { key: 'intelligence' as PageKey, label: '威胁情报', icon: 'intelligence' },", "      { key: 'alerts' as PageKey, label: '实时告警', icon: 'alerts' },\n      { key: 'behavior' as PageKey, label: '威胁行为检测', icon: 'behavior' },\n      { key: 'intelligence' as PageKey, label: '威胁情报', icon: 'intelligence' },"],
  ["overview: 'overview', alerts: 'alerts', intelligence: 'intelligence', trace: 'trace', risk: 'risk', assets: 'assets', rules: 'rules', warning: 'warning',", "overview: 'overview', alerts: 'alerts', behavior: 'behavior', intelligence: 'intelligence', trace: 'trace', risk: 'risk', assets: 'assets', rules: 'rules', warning: 'warning',"],
  ["  alerts: { title: '实时告警', crumb: '我的位置 / 威胁分析 / 实时告警', desc: '按威胁场景、攻击类型、等级和状态筛选告警并完成处置' },\n  intelligence: { title: '威胁情报', crumb: '我的位置 / 威胁分析 / 威胁情报', desc: '维护 IOC 情报、命中资产与可信度等级' },", "  alerts: { title: '实时告警', crumb: '我的位置 / 威胁分析 / 实时告警', desc: '按威胁场景、攻击类型、等级和状态筛选告警并完成处置' },\n  behavior: { title: '威胁行为检测', crumb: '我的位置 / 威胁分析 / 威胁行为检测', desc: '基于 Falco 风格运行时规则识别容器、主机、网络与敏感数据访问异常' },\n  intelligence: { title: '威胁情报', crumb: '我的位置 / 威胁分析 / 威胁情报', desc: '维护 IOC 情报、命中资产与可信度等级' },"],
  ["const typeTags = ['违规外联', '暴力破解', 'SQL注入', '信息泄露', '端口扫描', '未授权访问'];\n", `const typeTags = ['违规外联', '暴力破解', 'SQL注入', '信息泄露', '端口扫描', '未授权访问'];

const behaviorStats = [
  { label: '运行时规则命中', value: '426', delta: '+18.6%', icon: 'behavior', tone: 'blue' },
  { label: '高危行为事件', value: '37', delta: '+9', icon: 'alerts', tone: 'red' },
  { label: '受影响工作负载', value: '58', delta: '12 个命名空间', icon: 'container', tone: 'orange' },
  { label: '敏感文件访问', value: '19', delta: '7 次阻断', icon: 'password', tone: 'green' },
];

const behaviorCategories = [
  { title: '容器安全层', icon: 'container', risk: '高危' as Severity, hits: 142, focus: '容器内运行时异常', desc: '检测容器内 shell 会话创建、安装新软件包、从非预期路径启动进程等偏离镜像基线的行为。', vectors: ['容器内 shell 会话创建', '容器内安装新软件包', '从 /tmp、/dev/shm 等非预期位置启动进程'] },
  { title: '主机安全层', icon: 'host', risk: '高危' as Severity, hits: 96, focus: '宿主机关键目录与权限变更', desc: '监控 /etc、/usr/bin、/usr/sbin 等敏感目录读写，识别文件所有权、访问权限变更和特权容器启动。', vectors: ['敏感目录读写', '文件所有权或权限变更', 'privileged 容器启动'] },
  { title: '网络威胁层', icon: 'network', risk: '中危' as Severity, hits: 121, focus: '异常监听与未授权外联', desc: '发现意外端口监听、异常出站连接和未经批准的外部通信，辅助判断数据泄露与横向移动风险。', vectors: ['意外端口监听', '异常出站网络连接', '未经批准的外部通信'] },
  { title: '敏感数据保护', icon: 'password', risk: '高危' as Severity, hits: 67, focus: '凭证与身份文件访问', desc: '持续监控 /etc/shadow、/etc/passwd、SSH 密钥、API 凭证等高价值敏感文件访问。', vectors: ['/etc/shadow 与 /etc/passwd 访问', 'SSH 私钥读取', 'API Token 与云凭证访问'] },
];

const behaviorEvents = [
  { id: 'FB-9001', time: '2026-05-08 10:24:18', layer: '容器安全', vector: '容器内 shell 会话创建', asset: 'namespace/pay-prod · pod/pay-api-6d79', rule: 'Falco: Terminal shell in container', level: '高危' as Severity, evidence: 'proc.name=bash user=root container.image=pay-api:v2.7 command=bash -i', action: '已隔离 Pod 并保留容器快照' },
  { id: 'FB-9002', time: '2026-05-08 10:21:06', layer: '容器安全', vector: '容器内安装新软件包', asset: 'namespace/data-prod · pod/etl-worker-0', rule: 'Falco: Package management launched in container', level: '中危' as Severity, evidence: 'proc.name=apt-get evt.type=execve user=app path=/usr/bin/apt-get', action: '已触发镜像漂移复核' },
  { id: 'FB-9003', time: '2026-05-08 10:17:45', layer: '主机安全', vector: '敏感目录写入', asset: 'node-cn-bj-ecs-03', rule: 'Falco: Write below binary dir', level: '高危' as Severity, evidence: 'fd.name=/usr/bin/.cache/kswapd proc.name=sh user=root', action: '已收敛节点污点并发起 EDR 扫描' },
  { id: 'FB-9004', time: '2026-05-08 10:13:52', layer: '网络威胁', vector: '意外端口监听', asset: 'namespace/ops · pod/debug-toolbox', rule: 'Falco: Unexpected listening port', level: '中危' as Severity, evidence: 'fd.sport=4444 proc.name=nc container.id=8f42d1', action: '已阻断安全组入站并通知负责人' },
  { id: 'FB-9005', time: '2026-05-08 10:09:39', layer: '敏感数据', vector: 'SSH 私钥读取', asset: 'node-cn-tj-host-11', rule: 'Falco: Read sensitive file trusted after startup', level: '高危' as Severity, evidence: 'fd.name=/root/.ssh/id_rsa proc.name=python3 user=root', action: '已冻结访问令牌并生成凭证轮换工单' },
];

const behaviorRules = [
  { rule: 'Terminal shell in container', layer: '容器安全', severity: '高危' as Severity, condition: 'container.id exists and proc.name in (bash, sh, zsh)', scope: '生产命名空间', status: '阻断+告警' },
  { rule: 'Write below etc or binary dir', layer: '主机安全', severity: '高危' as Severity, condition: 'fd.directory in (/etc, /usr/bin, /usr/sbin) and evt.type in (open_write, chmod, chown)', scope: '全部宿主机', status: '告警+快照' },
  { rule: 'Unexpected outbound connection', layer: '网络威胁', severity: '中危' as Severity, condition: 'not fd.sip in approved_cidrs and fd.type=ipv4', scope: '出口网关与 Pod', status: '告警+联动防火墙' },
  { rule: 'Read sensitive credential file', layer: '敏感数据', severity: '高危' as Severity, condition: 'fd.name in (/etc/shadow, /etc/passwd, ~/.ssh/*, /var/run/secrets/*)', scope: '节点与容器', status: '阻断+凭证轮换' },
];
`],
  ["    intelligence: '已同步威胁情报命中状态',", "    behavior: '已刷新 Falco 运行时事件、攻击向量与敏感文件访问证据',\n    intelligence: '已同步威胁情报命中状态',"],
  ["      <section v-if=\"activePage === 'intelligence'\" class=\"page-stack\">", `<section v-if="activePage === 'behavior'" class="page-stack threat-behavior-page">
        <div class="behavior-hero panel">
          <div>
            <p class="eyebrow">Falco Runtime Threat Detection</p>
            <h3>威胁行为检测工作台</h3>
            <p>在流量监测之外，补充对云原生运行时行为的持续检测，形成“容器—主机—网络—敏感数据”的多层攻击向量识别能力。</p>
          </div>
          <div class="behavior-summary">
            <span>检测引擎</span><strong>Falco 风格规则</strong><small>Syscall / K8s Audit / Network Context</small>
          </div>
        </div>

        <div class="behavior-stat-grid">
          <article v-for="stat in behaviorStats" :key="stat.label" :data-tone="stat.tone">
            <span><AppIcon :name="stat.icon" :label="stat.label" /></span>
            <div><p>{{ stat.label }}</p><strong>{{ stat.value }}</strong><em>{{ stat.delta }}</em></div>
          </article>
        </div>

        <div class="behavior-category-grid">
          <article v-for="category in behaviorCategories" :key="category.title" class="behavior-category panel">
            <div class="category-head">
              <span><AppIcon :name="category.icon" :label="category.title" /></span>
              <div><h3>{{ category.title }}</h3><p>{{ category.focus }}</p></div>
              <b :class="levelClass(category.risk)">{{ category.risk }}</b>
            </div>
            <p class="category-desc">{{ category.desc }}</p>
            <div class="vector-list"><button v-for="vector in category.vectors" :key="vector" @click="showToast('已按攻击向量筛选：' + vector)">{{ vector }}</button></div>
            <div class="category-foot"><span>近 24h 命中</span><strong>{{ category.hits }}</strong></div>
          </article>
        </div>

        <div class="behavior-main-grid">
          <section class="table-card behavior-event-card">
            <div class="table-toolbar"><div><button class="blue-button" @click="showToast('已下发威胁行为检测规则同步任务')">同步规则</button><button class="white-button" @click="showToast('已导出威胁行为事件证据包')">导出证据</button></div><span class="hint-inline">按运行时证据、资产对象和处置动作串联审计闭环</span></div>
            <table class="data-table behavior-table"><thead><tr><th>事件ID</th><th>时间</th><th>检测层面</th><th>攻击向量</th><th>资产对象</th><th>规则</th><th>等级</th><th>关键证据</th><th>处置状态</th></tr></thead><tbody><tr v-for="event in behaviorEvents" :key="event.id"><td><strong>{{ event.id }}</strong></td><td>{{ event.time }}</td><td>{{ event.layer }}</td><td>{{ event.vector }}</td><td>{{ event.asset }}</td><td>{{ event.rule }}</td><td><span :class="levelClass(event.level)">{{ event.level }}</span></td><td class="param code-evidence">{{ event.evidence }}</td><td>{{ event.action }}</td></tr></tbody></table>
          </section>

          <aside class="panel behavior-rule-panel">
            <div class="panel-title"><h3>检测规则覆盖</h3><button @click="setPage('rules')">进入规则管理</button></div>
            <div v-for="rule in behaviorRules" :key="rule.rule" class="behavior-rule-row">
              <div><b>{{ rule.rule }}</b><span>{{ rule.layer }} · {{ rule.scope }}</span></div>
              <p>{{ rule.condition }}</p>
              <footer><span :class="levelClass(rule.severity)">{{ rule.severity }}</span><em>{{ rule.status }}</em></footer>
            </div>
          </aside>
        </div>
      </section>

      <section v-if="activePage === 'intelligence'" class="page-stack">`]
];

for (const [from, to] of replacements) {
  if (!app.includes(from)) {
    throw new Error(`Missing expected App.vue snippet: ${from.slice(0, 120)}`);
  }
  app = app.replace(from, to);
}

const behaviorCss = `

/* 威胁行为检测模块：延续 Neo-Enterprise Minimalism，强调容器、主机、网络、敏感数据四层运行时证据闭环。 */
.threat-behavior-page {
  gap: 16px;
}

.behavior-hero {
  min-height: 146px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  overflow: hidden;
  position: relative;
  border-color: #cfe2f6;
  background:
    radial-gradient(circle at 86% 18%, rgba(32, 185, 233, 0.18), transparent 24%),
    linear-gradient(135deg, #ffffff 0%, #f5faff 52%, #eef7ff 100%);
}

.behavior-hero::after {
  content: "";
  position: absolute;
  right: -64px;
  bottom: -92px;
  width: 280px;
  height: 280px;
  border: 1px solid rgba(31, 122, 224, 0.12);
  border-radius: 50%;
  box-shadow: inset 0 0 0 24px rgba(32, 185, 233, 0.05), inset 0 0 0 58px rgba(31, 122, 224, 0.05);
}

.eyebrow {
  margin: 0 0 8px;
  color: #1f7ae0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.behavior-hero h3 {
  margin: 0;
  color: #123a63;
  font-size: 24px;
}

.behavior-hero p {
  max-width: 680px;
  margin: 9px 0 0;
  color: #5f7489;
  line-height: 1.7;
}

.behavior-summary {
  position: relative;
  z-index: 1;
  min-width: 230px;
  padding: 16px;
  border: 1px solid rgba(31, 122, 224, 0.18);
  background: rgba(255,255,255,0.82);
  box-shadow: 0 14px 30px rgba(31, 122, 224, 0.10);
}

.behavior-summary span,
.behavior-summary small,
.category-foot span,
.hint-inline {
  color: #6f8499;
  font-size: 12px;
}

.behavior-summary strong {
  display: block;
  margin: 5px 0;
  color: #123a63;
  font-size: 18px;
}

.behavior-stat-grid,
.behavior-category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.behavior-stat-grid article {
  display: flex;
  gap: 12px;
  align-items: center;
  min-height: 92px;
  padding: 15px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 8px 22px rgba(36, 74, 119, 0.06);
  position: relative;
  overflow: hidden;
}

.behavior-stat-grid article::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 3px;
  background: var(--blue);
}

.behavior-stat-grid article[data-tone="red"]::after { background: var(--red); }
.behavior-stat-grid article[data-tone="orange"]::after { background: var(--amber); }
.behavior-stat-grid article[data-tone="green"]::after { background: var(--green); }

.behavior-stat-grid article > span,
.category-head > span {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--blue);
  background: linear-gradient(135deg, #eef7ff, #e3fbff);
  box-shadow: inset 0 0 0 1px rgba(31, 122, 224, 0.14);
}

.behavior-stat-grid p {
  margin: 0 0 4px;
  color: #64798e;
  font-size: 12px;
}

.behavior-stat-grid strong {
  display: block;
  color: #163a62;
  font-size: 24px;
}

.behavior-stat-grid em {
  color: #1f7ae0;
  font-style: normal;
  font-size: 12px;
}

.behavior-category {
  display: flex;
  flex-direction: column;
  min-height: 245px;
}

.category-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
}

.category-head h3 {
  margin: 0;
  color: #183a63;
  font-size: 15px;
}

.category-head p,
.category-desc {
  margin: 4px 0 0;
  color: #687e94;
  font-size: 12px;
  line-height: 1.65;
}

.category-desc {
  margin-top: 12px;
}

.vector-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0;
}

.vector-list button {
  border: 1px solid #d6e5f4;
  background: #f7fbff;
  color: #315d87;
  padding: 6px 9px;
  border-radius: 2px;
  font-size: 12px;
}

.vector-list button:hover {
  color: #fff;
  border-color: #1f7ae0;
  background: #1f7ae0;
}

.category-foot {
  margin-top: auto;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-top: 1px solid #edf3f8;
  padding-top: 10px;
}

.category-foot strong {
  color: #163a62;
  font-size: 22px;
}

.behavior-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(330px, .75fr);
  gap: 14px;
}

.behavior-event-card {
  overflow: hidden;
}

.behavior-table .code-evidence {
  font-family: "SFMono-Regular", Consolas, monospace;
  color: #173a62;
  max-width: 280px;
}

.behavior-rule-panel {
  display: grid;
  gap: 11px;
  align-content: start;
}

.behavior-rule-row {
  padding: 12px;
  border: 1px solid #e2ecf6;
  background: #f9fcff;
}

.behavior-rule-row b,
.behavior-rule-row span,
.behavior-rule-row em {
  display: block;
}

.behavior-rule-row b {
  color: #173a62;
  font-size: 13px;
}

.behavior-rule-row span {
  margin-top: 4px;
  color: #6f8499;
  font-size: 12px;
}

.behavior-rule-row p {
  margin: 10px 0;
  color: #526a83;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
}

.behavior-rule-row footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.behavior-rule-row em {
  color: #1f7ae0;
  font-size: 12px;
  font-style: normal;
}

@media (max-width: 1320px) {
  .behavior-stat-grid,
  .behavior-category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .behavior-main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .behavior-hero {
    align-items: stretch;
    flex-direction: column;
  }

  .behavior-stat-grid,
  .behavior-category-grid {
    grid-template-columns: 1fr;
  }
}
`;

if (!css.includes('威胁行为检测模块：延续 Neo-Enterprise Minimalism')) {
  css += behaviorCss;
}

writeFileSync(appPath, app);
writeFileSync(cssPath, css);
console.log('威胁行为检测模块已写入 App.vue 和 index.css');
