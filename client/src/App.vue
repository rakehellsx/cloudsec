<!--
设计约束：Neo-Enterprise Minimalism，新企业级极简控制台美学。白底、可信、可审计、可联动；以深靛蓝、亮青、橙红表达安全态势层级。任何组件选择都应强化“指标—趋势—证据—处置”的安全运营闭环。本文件严格贴合用户截图的信息架构：态势概览、威胁分析、实时告警、威胁情报、溯源分析、风险定位、云资产管理、业务规则与威胁预警。
-->
<script setup lang="ts">
import { computed, ref } from 'vue';

type PageKey = 'overview' | 'alerts' | 'intelligence' | 'trace' | 'risk' | 'assets' | 'rules' | 'warning';
type Severity = '高危' | '中危' | '低危';
type AlertStatus = '成功' | '可疑' | '未成功' | '已处理' | '已阻断' | '溯源中';
type TraceTab = '攻击过程' | '资产行为分析' | '资产关联关系' | '攻击者画像' | '流量包分析';
type AssetTab = 'region' | 'VPC' | '物理机' | '云主机' | '容器' | '漏洞管理' | '弱口令' | '两高一弱';
type RuleTab = '规则配置' | '规则组配置' | '白名单';
type WarningTab = '邮件通知' | '邮件列表' | '邮件服务器配置';
type TopologyNodeType = 'VPC' | 'NAT网关' | '负载均衡' | '云WAF' | '云主机' | '物理机' | 'Region' | '攻击源';
type TopologyNode = {
  id: string;
  name: string;
  type: TopologyNodeType;
  ip: string;
  area: string;
  risk: Severity;
  status: string;
  owner: string;
  traffic: { sessions: number; inbound: string; outbound: string; peak: string; abnormal: string; protocols: string[] };
  alerts: { id: string; name: string; level: Severity; status: AlertStatus; time: string }[];
  sessions: { time: string; peer: string; protocol: string; action: string; bytes: string }[];
  relations: string[];
  suggestion: string;
};

const activePage = ref<PageKey>('overview');
const activeTraceTab = ref<TraceTab>('攻击过程');
const activeAssetTab = ref<AssetTab>('VPC');
const activeRuleTab = ref<RuleTab>('规则配置');
const activeWarningTab = ref<WarningTab>('邮件服务器配置');
const selectedRange = ref('今日');
const selectedScenario = ref('外部攻击');
const selectedType = ref('全部类型');
const selectedLevel = ref('全部等级');
const selectedStatus = ref('全部状态');
const alertKeyword = ref('');
const selectedAlertId = ref('AG-1001');
const selectedRows = ref<string[]>(['AG-1002']);
const alertDrawerOpen = ref(false);
const moreMenuId = ref('');
const toastText = ref('');
const intelligenceDialog = ref(false);
const intelligencePrefill = ref('');
const onlyHit = ref(false);
const riskDimension = ref('云主机');
const assetKeyword = ref('');
const ruleKeyword = ref('');
const smtpTesting = ref(false);
const mailEnabled = ref(true);
const selectedTopologyNodeId = ref('ecs-prod-02');

const navGroups = [
  {
    title: '安全态势',
    items: [{ key: 'overview' as PageKey, label: '态势概览', icon: '▧' }],
  },
  {
    title: '威胁分析',
    items: [
      { key: 'alerts' as PageKey, label: '实时告警', icon: '!' },
      { key: 'intelligence' as PageKey, label: '威胁情报', icon: '◎' },
      { key: 'risk' as PageKey, label: '风险定位', icon: '⌖' },
      { key: 'trace' as PageKey, label: '溯源分析', icon: '↯' },
    ],
  },
  {
    title: '资源与规则',
    items: [
      { key: 'assets' as PageKey, label: '云资产管理', icon: '◫' },
      { key: 'rules' as PageKey, label: '业务规则', icon: '☷' },
      { key: 'warning' as PageKey, label: '威胁预警', icon: '✉' },
    ],
  },
];

const pageMeta: Record<PageKey, { title: string; crumb: string; desc: string }> = {
  overview: { title: '态势概览', crumb: '我的位置 / 态势概览', desc: '云内流量安全态势监测与攻击趋势研判' },
  alerts: { title: '实时告警', crumb: '我的位置 / 威胁分析 / 实时告警', desc: '按威胁场景、攻击类型、等级和状态筛选告警并完成处置' },
  intelligence: { title: '威胁情报', crumb: '我的位置 / 威胁分析 / 威胁情报', desc: '维护 IOC 情报、命中资产与可信度等级' },
  trace: { title: '溯源分析', crumb: '我的位置 / 威胁分析 / 溯源分析', desc: '围绕单个告警还原攻击过程、资产行为、关联关系与流量证据' },
  risk: { title: '风险定位', crumb: '我的位置 / 威胁分析 / 风险定位', desc: '按 VPC、业务系统、云主机、容器和物理机定位风险' },
  assets: { title: '云资产管理', crumb: '我的位置 / 云资产管理 / 资产管理', desc: '统一管理 region、VPC、物理机、云主机、容器与弱口令漏洞' },
  rules: { title: '业务规则', crumb: '我的位置 / 业务规则 / 规则管理', desc: '配置检测规则、规则组和白名单对象' },
  warning: { title: '威胁预警', crumb: '我的位置 / 威胁预警 / 邮件服务器配置', desc: '配置邮件通知、告警接收列表与 SMTP 连通性' },
};

const kpis = [
  { label: '受攻击 region 数', value: '35', total: '40', icon: '◉', tone: 'green' },
  { label: '受攻击物理机数', value: '9,800', total: '12,000', icon: '▤', tone: 'blue' },
  { label: '受攻击云主机数', value: '53,455', total: '120,000', icon: '☁', tone: 'cyan' },
  { label: '受攻击容器数', value: '23,455', total: '60,000', icon: '⬡', tone: 'orange' },
];

const attackTrend = [32, 45, 42, 61, 72, 54, 40, 49, 59, 66, 72, 83, 58, 42];
const intranetTrend = [18, 30, 46, 51, 44, 31, 25, 28, 35, 41, 49, 53, 44, 34];
const lateralTrend = [12, 18, 22, 29, 41, 35, 24, 19, 26, 34, 39, 45, 32, 21];
const baselineTrend = [58, 62, 59, 65, 63, 61, 67, 72, 70, 69, 75, 82, 73, 71];

const scenarios = [
  { name: '全部', count: 5000 },
  { name: '外部攻击', count: 1129 },
  { name: '横向移动', count: 3217 },
];
const typeTags = ['违规外联', '暴力破解', 'SQL注入', '信息泄露', '端口扫描', '未授权访问'];

const alerts = ref([
  { id: 'AG-1001', sourceIp: '192.168.123.112:50166', sourceGeo: '江苏-南京', targetIp: '192.168.123.113:58000', targetAsset: '数据模型工具应用生产-ECS02', business: '数字化作业部', attackType: '系统命令执行', rule: '1806', level: '高危' as Severity, status: '成功' as AlertStatus, detail: '/rest/v1/messages?select=agents.agent_id(name)&thread_id=eq.19833769', time: '2025-11-31 16:01:01', scene: '外部攻击', confidence: 98 },
  { id: 'AG-1002', sourceIp: '172.16.120.16:5555', sourceGeo: '华为测试环境-cce-ief-9665d', targetIp: '192.159.99.95:44090', targetAsset: '荷兰外部云节点', business: '智能运维平台', attackType: '注入攻击', rule: '157/155', level: '中危' as Severity, status: '可疑' as AlertStatus, detail: '/api/agent/start union select username,password', time: '2025-11-31 16:01:01', scene: '外部攻击', confidence: 88 },
  { id: 'AG-1003', sourceIp: '10.2.55.80:53269', sourceGeo: '安全监察部-安全风险管控监督平台', targetIp: '172.16.130.251:58000', targetAsset: 'szhsjpt-production-RDS01-0', business: '安全风险管控', attackType: '端口扫描', rule: '157/156', level: '低危' as Severity, status: '未成功' as AlertStatus, detail: '/rest/v1/messages?select=agents.agent_id(name)&thread_id=eq.0f9f7f99', time: '2025-11-31 16:01:01', scene: '横向移动', confidence: 74 },
  { id: 'AG-1004', sourceIp: '25.34.55.80:53269', sourceGeo: '国网山西电力', targetIp: '172.16.130.251:58000', targetAsset: 'szhsjpt-production-RDS01-0', business: '统一视频', attackType: '注入攻击', rule: '157/155', level: '高危' as Severity, status: '未成功' as AlertStatus, detail: '/messages?name=admin or 1=1 --', time: '2025-11-31 16:01:01', scene: '横向移动', confidence: 91 },
  { id: 'AG-1005', sourceIp: '223.11.8.195:443', sourceGeo: '荷兰', targetIp: '172.20.46.31:443', targetAsset: 'nginx-web', business: '门户应用', attackType: '未授权访问', rule: '205/204', level: '中危' as Severity, status: '溯源中' as AlertStatus, detail: '/api/v1/namespaces/default/secrets', time: '2025-11-31 15:59:40', scene: '外部攻击', confidence: 85 },
]);

const intelligence = ref([
  { id: 'IOC-01', content: '192.168.210.5', affected: '101.91.22.249\n172.16.130.251\n61.151.229.81', hits: 6, level: '高危' as Severity, trust: '中可信', type: 'IP', source: '内置威胁情报库', effect: '有效', created: '2025-10-08 18:31:11', latest: '2025-10-08 18:31:11', hit: true },
  { id: 'IOC-02', content: 'www.baidu.com', affected: '-', hits: 1, level: '中危' as Severity, trust: '低可信', type: '域名', source: '自定义威胁情报', effect: '失效', created: '2025-10-08 18:31:11', latest: '2025-10-08 18:31:11', hit: false },
  { id: 'IOC-03', content: 'f9b2d0a7e8f1c3', affected: '10.2.55.80', hits: 3, level: '低危' as Severity, trust: '高可信', type: '文件HASH', source: '溯源沉淀', effect: '有效', created: '2025-10-08 18:31:11', latest: '2025-10-08 19:20:31', hit: true },
]);

const assetStats = [
  { label: 'region 数量', value: '40', tone: 'green', icon: '◎' },
  { label: 'VPC', value: '100', tone: 'purple', icon: '☁' },
  { label: '物理机', value: '30000', tone: 'gold', icon: '▤' },
  { label: '云主机', value: '150000', tone: 'gold', icon: '▣' },
  { label: '容器数', value: '20', tone: 'red', icon: '⬡' },
];

const assetRows = [
  { id: 'vpc-12345678', name: 'prod-main-vpc', region: '北京亦庄数据中心', cidr: '10.0.0.0', hosts: 128, containers: 128, updated: '2025-08-29 09:00:00', risk: 92, type: 'VPC', owner: '数字化作业部' },
  { id: 'vpc-12345679', name: 'dev-test-vpc', region: '北京亦庄数据中心', cidr: '10.0.0.0', hosts: 32, containers: 32, updated: '2025-08-29 08:30:00', risk: 58, type: 'VPC', owner: '测试环境' },
  { id: 'ecs-0002', name: '数据模型工具应用生产-ECS02', region: '北京数据中心', cidr: '172.16.130.251', hosts: 1, containers: 0, updated: '2025-08-29 10:15:00', risk: 96, type: '云主机', owner: '数据模型工具' },
  { id: 'container-prod-01', name: 'szhsjpt-production-RDS01-0', region: '天津数据中心', cidr: '172.16.130.0', hosts: 0, containers: 16, updated: '2025-08-29 08:45:00', risk: 86, type: '容器', owner: '业务流程管理' },
  { id: 'pm-d563', name: 'd563xeh3u-23ry23-2rg2h-sdidwwds', region: '北京数据中心', cidr: '物理机池-A', hosts: 42, containers: 19, updated: '2025-08-29 10:00:00', risk: 78, type: '物理机', owner: '基础设施组' },
];

const rules = ref([
  { id: 'R-001', type: '本地规则', group: '-', enabled: true, belong: 'TLS_TEST', level: '低危' as Severity, attackStatus: '未成功', backdoor: '否', memo: '', hits: 12 },
  { id: 'R-002', type: '自定义规则', group: 'SQL_INJECT', enabled: true, belong: 'WEB_API', level: '高危' as Severity, attackStatus: '成功', backdoor: '是', memo: '生产接口启用严格匹配', hits: 86 },
  { id: 'R-003', type: '规则组', group: '横向移动', enabled: false, belong: 'EAST_WEST', level: '中危' as Severity, attackStatus: '可疑', backdoor: '否', memo: '待联调', hits: 33 },
]);

const whitelist = ref([
  { id: 'W-01', object: '10.2.55.80', type: '源IP', scope: '安全监察部', reason: '内部扫描器', expire: '2026-01-01', enabled: true },
  { id: 'W-02', object: '/api/agent/start', type: 'URL', scope: '智能运维平台', reason: '运维接口灰度', expire: '2025-12-31', enabled: false },
]);

const riskRows = [
  { dim: '云主机', object: '数据模型工具应用生产-ECS02', vpc: '大数据业务域', high: 12, mid: 34, low: 8, last: '系统命令执行', trend: 92 },
  { dim: '业务系统', object: '物资管理系统-Portal应用生产', vpc: '生产核心域', high: 9, mid: 26, low: 11, last: 'SQL注入', trend: 84 },
  { dim: '容器', object: 'szhsjpt-production-RDS01-0', vpc: '云下DMZ', high: 7, mid: 18, low: 14, last: '端口扫描', trend: 76 },
  { dim: '物理机', object: 'd563xeh3u-23ry23', vpc: '北京数据中心', high: 5, mid: 14, low: 9, last: '暴力破解', trend: 68 },
  { dim: 'VPC', object: 'prod-main-vpc', vpc: '北京亦庄数据中心', high: 16, mid: 41, low: 24, last: '违规外联', trend: 88 },
];

const businessRanking = [
  { name: '新一代电力交易系统', value: 850, high: 72 },
  { name: '物资管理系统', value: 730, high: 61 },
  { name: '营销综管平台', value: 650, high: 55 },
  { name: '外部门户系统', value: 570, high: 48 },
  { name: '掌上应用-物资', value: 500, high: 42 },
];

const sourceRanking = [
  { name: '国网总部', value: 700 },
  { name: '吉林电力', value: 600 },
  { name: '辽宁电力', value: 500 },
  { name: '湖北电力', value: 400 },
  { name: '山西电力', value: 300 },
];

const traceEvents = [
  { time: '2025-12-22 10:18:54', title: '事件概况', content: '告警检测到 2 个攻击者，使用 MacOS X、Windows OS 操作系统，对我方 1 台资产服务器发起攻击。' },
  { time: '2025-12-22 10:18:54', title: '攻击首次访问', content: '攻击者首次访问了 172.16.130.251 的 /rest/v1/messages 页面，携带异常查询参数。' },
  { time: '2025-12-22 10:20:40', title: '注入攻击', content: '攻击者使用注入攻击技术，对我方资产服务器发起 32 次攻击，判定为未对我方造成影响。' },
  { time: '2025-12-22 10:20:40', title: '隐私脚本上传', content: '攻击者尝试上传隐私脚本并植入后门文件，命中检测规则 1806。' },
  { time: '2025-12-22 13:25:24', title: '攻击结束与处置建议', content: '攻击者共发起 36 次攻击，建议将 10.2.55.80 加入防火墙、WAF、IPS 联动处置队列，并修复注入点。' },
];

const packetRows = [
  { no: 1, protocol: 'HTTP', src: '192.168.123.112', dst: '192.168.123.113', uri: '/rest/v1/messages', verdict: '命令执行参数', size: '4.2KB' },
  { no: 2, protocol: 'TCP', src: '10.2.55.80', dst: '172.16.130.251', uri: 'SYN 22/80/443', verdict: '端口扫描', size: '1.1KB' },
  { no: 3, protocol: 'HTTP', src: '223.11.8.195', dst: '172.20.46.31', uri: '/api/v1/secrets', verdict: '未授权访问', size: '2.8KB' },
];

const topologyNodes: TopologyNode[] = [
  { id: 'vpc-bigdata', name: '大数据业务域 VPC', type: 'VPC', ip: '10.12.0.0/16', area: '云平台 / 北京数据中心', risk: '中危', status: '南北向流量偏高', owner: '数字化作业部', traffic: { sessions: 38216, inbound: '892 GB', outbound: '415 GB', peak: '3.8 Gbps', abnormal: '12.8%', protocols: ['HTTP', 'HTTPS', 'MySQL'] }, alerts: [{ id: 'AG-1001', name: '系统命令执行', level: '高危', status: '溯源中', time: '2025-11-31 16:01:01' }, { id: 'AG-1004', name: '违规外联', level: '中危', status: '可疑', time: '2025-11-31 15:42:19' }], sessions: [{ time: '16:01:01', peer: '192.168.123.112 → 192.168.123.113', protocol: 'HTTP', action: '放行后告警', bytes: '4.2KB' }, { time: '15:58:44', peer: '10.2.55.80 → 172.16.130.251', protocol: 'TCP', action: '扫描识别', bytes: '1.1KB' }], relations: ['NAT-GW-prod-01', 'LB-datamodel-01', 'CloudWAF-prod', '数据模型工具应用生产-ECS02'], suggestion: '建议核查该 VPC 的入方向安全组与东西向访问基线，确认异常会话是否来自已授权扫描器。' },
  { id: 'nat-prod-01', name: 'NAT-GW-prod-01', type: 'NAT网关', ip: '39.110.116.43', area: '大数据业务域', risk: '中危', status: '外联会话突增', owner: '基础网络组', traffic: { sessions: 14892, inbound: '260 GB', outbound: '512 GB', peak: '1.6 Gbps', abnormal: '8.1%', protocols: ['HTTPS', 'DNS', 'NTP'] }, alerts: [{ id: 'AG-1005', name: '违规外联', level: '中危', status: '可疑', time: '2025-11-31 15:59:40' }], sessions: [{ time: '15:59:40', peer: '172.20.46.31 → 223.11.8.195', protocol: 'HTTPS', action: '外联命中', bytes: '2.8KB' }, { time: '15:50:22', peer: '172.16.130.251 → 8.8.8.8', protocol: 'DNS', action: '解析放行', bytes: '0.7KB' }], relations: ['大数据业务域 VPC', 'CloudWAF-prod', 'Internet 攻击源'], suggestion: '建议开启 NAT 网关外联白名单校验，对未知境外目的地址执行临时封禁并回溯近 24 小时会话。' },
  { id: 'lb-datamodel-01', name: 'LB-datamodel-01', type: '负载均衡', ip: '172.16.130.10', area: '大数据业务域', risk: '低危', status: '连接数稳定', owner: '应用平台组', traffic: { sessions: 9850, inbound: '144 GB', outbound: '91 GB', peak: '760 Mbps', abnormal: '3.5%', protocols: ['HTTP', 'HTTPS'] }, alerts: [{ id: 'AG-1002', name: '注入攻击探测', level: '中危', status: '可疑', time: '2025-11-31 16:01:01' }], sessions: [{ time: '16:00:18', peer: '192.168.123.112 → 172.16.130.10', protocol: 'HTTPS', action: '转发至 WAF', bytes: '3.4KB' }, { time: '15:55:02', peer: '10.2.55.80 → 172.16.130.10', protocol: 'HTTP', action: '异常参数', bytes: '1.6KB' }], relations: ['CloudWAF-prod', '数据模型工具应用生产-ECS02'], suggestion: '建议检查监听器后端权重与异常 URI 分布，必要时将异常路径加入 WAF 精准拦截规则。' },
  { id: 'waf-prod', name: 'CloudWAF-prod', type: '云WAF', ip: '172.16.130.20', area: '大数据业务域', risk: '高危', status: '高危规则连续命中', owner: '安全运营中心', traffic: { sessions: 12340, inbound: '188 GB', outbound: '76 GB', peak: '980 Mbps', abnormal: '18.6%', protocols: ['HTTP', 'HTTPS'] }, alerts: [{ id: 'AG-1001', name: '系统命令执行', level: '高危', status: '溯源中', time: '2025-11-31 16:01:01' }, { id: 'AG-1002', name: 'SQL 注入', level: '中危', status: '可疑', time: '2025-11-31 16:01:01' }], sessions: [{ time: '16:01:01', peer: '192.168.123.112 → 172.16.130.20', protocol: 'HTTP', action: '命令执行命中', bytes: '4.2KB' }, { time: '15:57:31', peer: '223.11.8.195 → 172.16.130.20', protocol: 'HTTPS', action: '未授权访问', bytes: '2.8KB' }], relations: ['LB-datamodel-01', '数据模型工具应用生产-ECS02', 'Internet 攻击源'], suggestion: '建议立即提升命令执行与未授权访问规则为阻断模式，并将攻击源沉淀为 IOC 情报。' },
  { id: 'ecs-prod-02', name: '数据模型工具应用生产-ECS02', type: '云主机', ip: '192.168.123.113', area: '大数据业务域 / 生产子网', risk: '高危', status: '被攻击资产', owner: '数据模型工具', traffic: { sessions: 5621, inbound: '68 GB', outbound: '24 GB', peak: '420 Mbps', abnormal: '22.4%', protocols: ['HTTP', 'MySQL', 'SSH'] }, alerts: [{ id: 'AG-1001', name: '系统命令执行', level: '高危', status: '溯源中', time: '2025-11-31 16:01:01' }, { id: 'AG-1003', name: '端口扫描', level: '低危', status: '未成功', time: '2025-11-31 16:01:01' }], sessions: [{ time: '16:01:01', peer: '192.168.123.112:50166 → 192.168.123.113:58000', protocol: 'HTTP', action: '命令执行参数', bytes: '4.2KB' }, { time: '16:00:28', peer: '10.2.55.80:53269 → 192.168.123.113:22', protocol: 'SSH', action: '弱口令探测', bytes: '0.9KB' }], relations: ['CloudWAF-prod', 'LB-datamodel-01', '物理机池-A'], suggestion: '建议对该云主机执行快照留存、进程排查和安全组临时收敛，并在修复注入点后恢复访问。' },
  { id: 'vpc-ops', name: '运维支撑 VPC', type: 'VPC', ip: '10.22.0.0/16', area: '云平台 / 天津数据中心', risk: '低危', status: '基线正常', owner: '智能运维平台', traffic: { sessions: 6800, inbound: '74 GB', outbound: '63 GB', peak: '510 Mbps', abnormal: '2.7%', protocols: ['HTTPS', 'SSH'] }, alerts: [{ id: 'AG-1003', name: '端口扫描', level: '低危', status: '未成功', time: '2025-11-31 16:01:01' }], sessions: [{ time: '15:49:12', peer: '10.2.55.80 → 172.16.130.251', protocol: 'TCP', action: '扫描识别', bytes: '1.1KB' }], relations: ['北京数据中心', '物理机池-A'], suggestion: '建议保持现有访问基线，持续观察低危扫描是否转化为横向移动。' },
  { id: 'physical-a', name: 'd563xeh3u-23ry23', type: '物理机', ip: '物理机池-A', area: '云下 DMZ', risk: '中危', status: '横向访问偏高', owner: '基础设施组', traffic: { sessions: 4012, inbound: '48 GB', outbound: '39 GB', peak: '330 Mbps', abnormal: '9.4%', protocols: ['SSH', 'RDP', 'SMB'] }, alerts: [{ id: 'AG-1003', name: '端口扫描', level: '低危', status: '未成功', time: '2025-11-31 16:01:01' }], sessions: [{ time: '15:51:09', peer: '10.2.55.80 → d563xeh3u-23ry23', protocol: 'SMB', action: '横向探测', bytes: '1.9KB' }, { time: '15:46:44', peer: 'd563xeh3u-23ry23 → 192.168.123.113', protocol: 'SSH', action: '运维访问', bytes: '3.1KB' }], relations: ['大数据业务域 VPC', '运维支撑 VPC'], suggestion: '建议确认物理机运维账号登录来源，必要时开启双因子校验与横向访问限速。' },
  { id: 'region-bj', name: '北京数据中心', type: 'Region', ip: 'Region-BJ', area: '华北区', risk: '中危', status: '多资产风险聚合', owner: '云资源管理组', traffic: { sessions: 71520, inbound: '1.4 TB', outbound: '890 GB', peak: '6.1 Gbps', abnormal: '10.2%', protocols: ['HTTP', 'HTTPS', 'TCP', 'UDP'] }, alerts: [{ id: 'AG-1001', name: '系统命令执行', level: '高危', status: '溯源中', time: '2025-11-31 16:01:01' }, { id: 'AG-1004', name: '注入攻击', level: '高危', status: '未成功', time: '2025-11-31 16:01:01' }], sessions: [{ time: '16:02:10', peer: 'Region-BJ 汇聚链路', protocol: 'TCP', action: '异常聚合', bytes: '32GB' }, { time: '15:48:08', peer: '跨 VPC 访问', protocol: 'HTTPS', action: '基线偏移', bytes: '18GB' }], relations: ['大数据业务域 VPC', '运维支撑 VPC', '物理机池-A'], suggestion: '建议从 Region 维度下钻高风险 VPC，优先处理高危告警密度最高的生产子网。' },
  { id: 'attacker-cn', name: 'Internet 攻击源', type: '攻击源', ip: '192.168.123.112:50166', area: '江苏-南京', risk: '高危', status: '攻击活跃', owner: '外部未知', traffic: { sessions: 36, inbound: '0 GB', outbound: '4.8 MB', peak: '12 Mbps', abnormal: '100%', protocols: ['HTTP', 'TCP'] }, alerts: [{ id: 'AG-1001', name: '系统命令执行', level: '高危', status: '溯源中', time: '2025-11-31 16:01:01' }, { id: 'AG-1002', name: 'SQL 注入', level: '中危', status: '可疑', time: '2025-11-31 16:01:01' }], sessions: [{ time: '16:01:01', peer: '192.168.123.112 → 192.168.123.113', protocol: 'HTTP', action: '攻击请求', bytes: '4.2KB' }, { time: '15:56:21', peer: '192.168.123.112 → CloudWAF-prod', protocol: 'HTTP', action: '探测请求', bytes: '1.4KB' }], relations: ['CloudWAF-prod', '数据模型工具应用生产-ECS02'], suggestion: '建议将该源 IP 加入临时封禁策略、同步威胁情报，并触发近 7 天同源攻击检索。' },
];

const pageTitle = computed(() => pageMeta[activePage.value].title);
const pageCrumb = computed(() => pageMeta[activePage.value].crumb);
const pageDesc = computed(() => pageMeta[activePage.value].desc);
const selectedAlert = computed(() => alerts.value.find((item) => item.id === selectedAlertId.value) || alerts.value[0]);
const filteredAlerts = computed(() => alerts.value.filter((item) => {
  const matchScenario = selectedScenario.value === '全部' || item.scene === selectedScenario.value;
  const matchType = selectedType.value === '全部类型' || item.attackType === selectedType.value;
  const matchLevel = selectedLevel.value === '全部等级' || item.level === selectedLevel.value;
  const matchStatus = selectedStatus.value === '全部状态' || item.status === selectedStatus.value;
  const keyword = alertKeyword.value.trim().toLowerCase();
  const matchKeyword = !keyword || `${item.sourceIp} ${item.targetIp} ${item.targetAsset} ${item.detail} ${item.attackType}`.toLowerCase().includes(keyword);
  return matchScenario && matchType && matchLevel && matchStatus && matchKeyword;
}));
const filteredIntelligence = computed(() => intelligence.value.filter((item) => !onlyHit.value || item.hit));
const filteredAssets = computed(() => assetRows.filter((item) => {
  const tabMatch = activeAssetTab.value === 'VPC' ? item.type === 'VPC' : activeAssetTab.value === item.type || ['漏洞管理', '弱口令', '两高一弱', 'region'].includes(activeAssetTab.value);
  const keyword = assetKeyword.value.trim().toLowerCase();
  return tabMatch && (!keyword || `${item.id} ${item.name} ${item.region} ${item.owner}`.toLowerCase().includes(keyword));
}));
const filteredRules = computed(() => rules.value.filter((item) => {
  const keyword = ruleKeyword.value.trim().toLowerCase();
  return !keyword || `${item.id} ${item.group} ${item.level} ${item.attackStatus} ${item.memo}`.toLowerCase().includes(keyword);
}));
const selectedRiskRows = computed(() => riskRows.filter((item) => riskDimension.value === '全部' || item.dim === riskDimension.value));
const selectedTopologyNode = computed(() => topologyNodes.find((node) => node.id === selectedTopologyNodeId.value) || topologyNodes[0]);

function showToast(text: string) {
  toastText.value = text;
  window.setTimeout(() => {
    if (toastText.value === text) toastText.value = '';
  }, 2400);
}

function setPage(page: PageKey) {
  activePage.value = page;
  alertDrawerOpen.value = false;
  moreMenuId.value = '';
}

function sparkline(points: number[], width = 300, height = 120) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const step = width / (points.length - 1);
  return points.map((point, index) => {
    const y = height - ((point - min) / Math.max(max - min, 1)) * (height - 18) - 9;
    return `${index * step},${y}`;
  }).join(' ');
}

function levelClass(level: Severity) {
  return level === '高危' ? 'tag danger' : level === '中危' ? 'tag warning' : 'tag info';
}

function statusClass(status: AlertStatus) {
  if (status === '成功') return 'tag danger solid';
  if (status === '可疑' || status === '溯源中') return 'tag warning solid';
  if (status === '已处理' || status === '已阻断') return 'tag success solid';
  return 'tag info solid';
}

function toggleRow(id: string) {
  selectedRows.value = selectedRows.value.includes(id) ? selectedRows.value.filter((row) => row !== id) : [...selectedRows.value, id];
}

function openAlert(id: string) {
  selectedAlertId.value = id;
  alertDrawerOpen.value = true;
  moreMenuId.value = '';
}

function drillTopologyNode(id: string) {
  selectedTopologyNodeId.value = id;
  const node = selectedTopologyNode.value;
  showToast(`已钻取 ${node.name}：${node.alerts.length} 条告警，${node.traffic.sessions.toLocaleString()} 条会话`);
}

function topologyNodeClass(id: string) {
  const node = topologyNodes.find((item) => item.id === id);
  return ['topology-node', { active: selectedTopologyNodeId.value === id, high: node?.risk === '高危', medium: node?.risk === '中危' }];
}

function goTrace(id: string) {
  selectedAlertId.value = id;
  activeTraceTab.value = '攻击过程';
  setPage('trace');
  alerts.value = alerts.value.map((item) => item.id === id ? { ...item, status: '溯源中' as AlertStatus } : item);
  showToast(`已基于告警 ${id} 生成溯源事件报告`);
}

function openAddIntelligence(value = '') {
  intelligencePrefill.value = value.split(':')[0] || '';
  intelligenceDialog.value = true;
  moreMenuId.value = '';
}

function addIntelligence() {
  const content = intelligencePrefill.value || selectedAlert.value.sourceIp.split(':')[0];
  intelligence.value.unshift({ id: `IOC-${intelligence.value.length + 1}`.padStart(6, '0'), content, affected: selectedAlert.value.targetIp, hits: 1, level: selectedAlert.value.level, trust: '中可信', type: 'IP', source: '告警处置沉淀', effect: '有效', created: '2026-05-07 16:30:00', latest: '2026-05-07 16:30:00', hit: true });
  intelligenceDialog.value = false;
  showToast(`已新增威胁情报 ${content}`);
}

function handleAlertAction(id: string, action: string) {
  selectedAlertId.value = id;
  if (action === '标记已处理') {
    alerts.value = alerts.value.map((item) => item.id === id ? { ...item, status: '已处理' as AlertStatus } : item);
  }
  if (action === '封禁' || action === '阻断隔离') {
    alerts.value = alerts.value.map((item) => item.id === id ? { ...item, status: '已阻断' as AlertStatus } : item);
  }
  moreMenuId.value = '';
  showToast(`告警 ${id} 已执行：${action}`);
}

function batchProcess() {
  const ids = selectedRows.value.length ? selectedRows.value : filteredAlerts.value.slice(0, 2).map((item) => item.id);
  alerts.value = alerts.value.map((item) => ids.includes(item.id) ? { ...item, status: '已处理' as AlertStatus } : item);
  selectedRows.value = ids;
  showToast(`已批量处理 ${ids.length} 条告警，并写入审计日志`);
}

function resetAlertFilter() {
  selectedScenario.value = '全部';
  selectedType.value = '全部类型';
  selectedLevel.value = '全部等级';
  selectedStatus.value = '全部状态';
  alertKeyword.value = '';
  showToast('已重置实时告警筛选条件');
}

function toggleRule(index: number) {
  rules.value[index].enabled = !rules.value[index].enabled;
  showToast(`${rules.value[index].id} 已${rules.value[index].enabled ? '启用' : '停用'}`);
}

function testSmtp() {
  smtpTesting.value = true;
  window.setTimeout(() => {
    smtpTesting.value = false;
    showToast('SMTP 服务器连通性测试通过，已生成测试邮件记录');
  }, 900);
}
</script>

<template>
  <div class="platform-shell">
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="hamburger"><span></span><span></span><span></span></div>
        <div class="brand-text">云内网络安全监测平台</div>
      </div>
      <nav class="side-nav" aria-label="主导航">
        <section v-for="group in navGroups" :key="group.title" class="nav-group">
          <p>{{ group.title }}</p>
          <button v-for="item in group.items" :key="item.key" :class="['side-item', { active: activePage === item.key }]" @click="setPage(item.key)">
            <span>{{ item.icon }}</span>{{ item.label }}
          </button>
        </section>
      </nav>
    </aside>

    <main class="main-area">
      <header class="topbar">
        <div>
          <h1>云内网络安全监测平台</h1>
          <p>{{ pageCrumb }}</p>
        </div>
        <div class="top-actions">
          <select v-model="selectedRange"><option>今日</option><option>近7天</option><option>近30天</option></select>
          <button class="notice">公告<span></span></button>
          <button class="user">admin</button>
        </div>
      </header>

      <section class="page-heading">
        <div>
          <h2>{{ pageTitle }}</h2>
          <p>{{ pageDesc }}</p>
        </div>
        <button class="blue-button" @click="showToast('已刷新当前页面模拟数据')">刷新数据</button>
      </section>

      <section v-if="activePage === 'overview'" class="page-stack">
        <div class="overview-layout">
          <div class="panel trend-panel">
            <div class="panel-title"><h3>攻击趋势监测</h3><div class="legend"><span class="cyan"></span>互联网攻击 <span class="amber"></span>内网横向攻击 <span class="green"></span>云内横向攻击</div></div>
            <svg class="area-chart" viewBox="0 0 300 120">
              <polyline :points="sparkline(attackTrend)" class="line cyan-line" />
              <polyline :points="sparkline(intranetTrend)" class="line amber-line" />
              <polyline :points="sparkline(lateralTrend)" class="line green-line" />
            </svg>
            <div class="axis-row"><span>8点</span><span>10点</span><span>12点</span><span>14点</span><span>16点</span></div>
          </div>

          <div class="map-panel panel">
            <div class="kpi-strip">
              <article v-for="kpi in kpis" :key="kpi.label" :data-tone="kpi.tone">
                <span>{{ kpi.icon }}</span><p>{{ kpi.label }}</p><strong>{{ kpi.value }}</strong><small>总量 {{ kpi.total }}</small><i></i>
              </article>
            </div>
            <div class="china-map-light">
              <div class="map-title">云内流量安全态势监测</div>
              <div class="node attacker"><strong>攻击源 IP：36.21.0.49</strong><small>成都 · SQL注入</small></div>
              <div class="node target"><strong>目的 IP：39.110.116.43</strong><small>北京 · 数据模型工具</small></div>
              <div class="route route-a"></div><div class="route route-b"></div><div class="hotspot h1"></div><div class="hotspot h2"></div>
            </div>
          </div>

          <div class="panel ranking-panel">
            <div class="panel-title"><h3>受攻击业务系统</h3><div class="legend"><span class="cyan"></span>低危 <span class="amber"></span>中危 <span class="red"></span>高危</div></div>
            <div class="rank-list">
              <div v-for="item in businessRanking" :key="item.name" class="rank-row"><span>{{ item.name }}</span><div><i :style="{ width: `${item.value / 9}%` }"></i></div><b>{{ item.value }}</b></div>
            </div>
          </div>

          <div class="panel donut-panel">
            <div class="panel-title"><h3>攻击类型分布</h3><div><button class="mini active">互联网</button><button class="mini">云内横向</button></div></div>
            <div class="donut-wrap"><div class="donut"><span>云主机</span></div><div class="donut alt"><span>容器</span></div></div>
            <div class="tag-cloud"><span>SQL注入</span><span>XSS</span><span>信息泄露</span><span>恶意程序</span><span>端口扫描</span><span>目录遍历</span></div>
          </div>

          <div class="panel source-panel">
            <div class="panel-title"><h3>攻击源分析</h3></div>
            <div class="source-list"><div v-for="(item, index) in sourceRanking" :key="item.name"><b>{{ index + 1 }}</b><span>{{ item.name }}</span><i :style="{ width: `${item.value / 8}%` }"></i><em>{{ item.value }}</em></div></div>
            <div class="segmented"><button>互联网攻击源排行</button><button>跨省攻击源排行</button><button>云内横向攻击源排行</button></div>
          </div>

          <div class="panel alert-monitor">
            <div class="panel-title"><h3>实时告警监测</h3><button @click="setPage('alerts')">查看全部</button></div>
            <table class="compact-table"><thead><tr><th>攻击时间</th><th>攻击源IP</th><th>目的IP</th><th>资产名称</th><th>攻击类型</th><th>威胁等级</th><th>状态</th></tr></thead><tbody><tr v-for="item in alerts.slice(0,4)" :key="item.id" @click="openAlert(item.id)"><td>{{ item.time.slice(5) }}</td><td>{{ item.sourceIp }}</td><td>{{ item.targetIp }}</td><td>{{ item.targetAsset }}</td><td>{{ item.attackType }}</td><td><span :class="levelClass(item.level)">{{ item.level }}</span></td><td><span :class="statusClass(item.status)">{{ item.status }}</span></td></tr></tbody></table>
          </div>

          <div class="panel baseline-panel">
            <div class="panel-title"><h3>流量基线监测</h3><div class="legend"><span class="amber"></span>今日 <span class="cyan"></span>昨日 <span class="green"></span>十日</div></div>
            <svg class="area-chart" viewBox="0 0 300 120"><polyline :points="sparkline(baselineTrend)" class="line cyan-line"/><polyline :points="sparkline(lateralTrend)" class="line green-line"/><polyline :points="sparkline(intranetTrend)" class="line amber-line"/></svg>
          </div>
        </div>
      </section>

      <section v-if="activePage === 'alerts'" class="page-stack">
        <div class="filter-card scene-card">
          <label>威胁场景：</label><button v-for="scene in scenarios" :key="scene.name" :class="['pill', { active: selectedScenario === scene.name }]" @click="selectedScenario = scene.name">{{ scene.name }} <b>{{ scene.count }}</b></button><button class="pill plus">+</button>
          <div class="type-tags"><button v-for="tag in typeTags" :key="tag" :class="{ active: selectedType === tag }" @click="selectedType = selectedType === tag ? '全部类型' : tag">{{ tag }}</button></div>
        </div>
        <div class="toolbar-card">
          <div><button class="blue-button" @click="batchProcess">批量处理</button><button class="white-button" @click="showToast('已导出当前筛选条件下的告警数据')">导出数据</button></div>
          <div class="toolbar-controls"><select v-model="selectedType"><option>全部类型</option><option v-for="tag in typeTags" :key="tag">{{ tag }}</option></select><select v-model="selectedLevel"><option>全部等级</option><option>高危</option><option>中危</option><option>低危</option></select><select v-model="selectedStatus"><option>全部状态</option><option>成功</option><option>可疑</option><option>未成功</option><option>已处理</option><option>已阻断</option></select><input v-model="alertKeyword" placeholder='源IP = "192.168.11.32"' /><button class="blue-button" @click="showToast('已执行精准查询')">精准查询</button><button class="blue-button secondary" @click="resetAlertFilter">重置筛选</button></div>
        </div>
        <div class="table-card">
          <table class="data-table"><thead><tr><th><input type="checkbox" /></th><th>序号</th><th>源IP</th><th>目的IP</th><th>攻击类型</th><th>攻击状态</th><th>详细参数</th><th>告警时间</th><th>操作</th></tr></thead><tbody><tr v-for="(item, index) in filteredAlerts" :key="item.id"><td><input type="checkbox" :checked="selectedRows.includes(item.id)" @change="toggleRow(item.id)" /></td><td>{{ index + 1 }}</td><td><strong>{{ item.sourceIp }}</strong><small>{{ item.sourceGeo }}</small></td><td><strong>{{ item.targetIp }}</strong><small>{{ item.targetAsset }}</small></td><td><span :class="levelClass(item.level)">{{ item.attackType }} [{{ item.rule }}]</span></td><td><span :class="statusClass(item.status)">{{ item.level }} / {{ item.status }}</span></td><td class="param">{{ item.detail }}</td><td>{{ item.time }}</td><td class="ops"><button @click="goTrace(item.id)">溯源分析</button><button @click="handleAlertAction(item.id, '标记误报')">标记误报</button><button @click="moreMenuId = moreMenuId === item.id ? '' : item.id">更多</button><div v-if="moreMenuId === item.id" class="more-menu"><button @click="handleAlertAction(item.id, '标记误报')">标记误报</button><button @click="handleAlertAction(item.id, '加白')">加白</button><button @click="handleAlertAction(item.id, '加资产')">加资产</button><button @click="openAddIntelligence(item.sourceIp)">加情报</button><button @click="handleAlertAction(item.id, '标记已处理')">标记已处理</button><button @click="handleAlertAction(item.id, '封禁')">封禁</button><button @click="handleAlertAction(item.id, '阻断隔离')">阻断隔离</button></div></td></tr></tbody></table>
          <div class="pagination"><span>共5000条</span><div><button>上一页</button><b>1</b><b class="active">2</b><b>3</b><span>...</span><b>10</b><button>下一页</button><span>到第</span><input value="1" /><span>页</span></div></div>
        </div>
      </section>

      <section v-if="activePage === 'intelligence'" class="page-stack">
        <div class="filter-card grid-filter"><label>情报IP <input placeholder="请输入IP，多个以逗号分隔" /></label><label>情报状态 <select><option>请选择情报状态</option><option>有效</option><option>失效</option></select></label><label>情报等级 <select><option>请选择情报等级</option><option>高危</option><option>中危</option></select></label><label>情报标签 <input placeholder="请输入情报标签" /></label><button class="blue-button" @click="showToast('已查询威胁情报')">查找</button><button class="white-button">重置</button><button class="link-button">展开⌄</button></div>
        <div class="table-card"><div class="table-toolbar"><div><button class="blue-button" @click="openAddIntelligence('')">新增情报</button><button class="white-button">情报查询</button></div><label class="switch-line">只看命中：<input type="checkbox" v-model="onlyHit" /></label></div><table class="data-table"><thead><tr><th><input type="checkbox" /></th><th>序号</th><th>情报内容</th><th>受影响IP</th><th>命中总次数</th><th>情报等级</th><th>可信度等级</th><th>情报类型</th><th>情报来源</th><th>时效状态</th><th>录入时间</th><th>最近命中时间</th><th>操作</th></tr></thead><tbody><tr v-for="(item, index) in filteredIntelligence" :key="item.id"><td><input type="checkbox" /></td><td>{{ index + 1 }}</td><td>{{ item.content }}</td><td class="multiline">{{ item.affected }}</td><td>{{ item.hits }}</td><td><span :class="levelClass(item.level)">{{ item.level }}</span></td><td><span class="tag warning">{{ item.trust }}</span></td><td>{{ item.type }}</td><td>{{ item.source }}</td><td>{{ item.effect }}</td><td>{{ item.created }}</td><td>{{ item.latest }}</td><td class="ops"><button @click="showToast('已打开情报详情')">查看详情</button><button @click="showToast('已删除情报')">删除情报</button></td></tr></tbody></table></div>
      </section>

      <section v-if="activePage === 'trace'" class="page-stack">
        <div class="tab-strip"><button v-for="tab in ['攻击过程','资产行为分析','资产关联关系','攻击者画像','流量包分析']" :key="tab" :class="{ active: activeTraceTab === tab }" @click="activeTraceTab = tab as TraceTab">{{ tab }}</button></div>
        <div v-if="activeTraceTab === '攻击过程'" class="trace-report panel"><h3>{{ selectedAlert.sourceIp.split(':')[0] }} 攻击事件报告</h3><div class="timeline"><article v-for="event in traceEvents" :key="event.title"><time>{{ event.time }}</time><div><h4>{{ event.title }}</h4><p>{{ event.content }}</p></div></article></div></div>
        <div v-else-if="activeTraceTab === '资产行为分析'" class="graph-card"><div class="zone cloud">云平台<div class="server-node">{{ selectedAlert.targetIp.split(':')[0] }}<small>{{ selectedAlert.targetAsset }}</small></div></div><div class="zone dmz">云下DMZ</div><div class="zone office">云下办公区</div><div class="zone internet">Internet <span>🇨🇦</span><span>🇨🇳</span><span>🇸🇪</span><span>🇯🇵</span><span>🇺🇸</span></div><svg class="graph-lines"><line x1="36%" y1="35%" x2="82%" y2="23%"/><line x1="36%" y1="35%" x2="82%" y2="42%"/><line x1="36%" y1="35%" x2="82%" y2="61%"/><line x1="36%" y1="35%" x2="22%" y2="75%"/></svg><div class="edge-label l1">目录遍历</div><div class="edge-label l2">SQL注入</div><div class="edge-label l3">端口扫描</div></div>
        <div v-else-if="activeTraceTab === '资产关联关系'" class="relation-wrap topology-drill-wrap">
          <aside class="asset-info topology-summary">
            <h3>信息</h3>
            <p>资产IP：{{ selectedAlert.targetIp.split(':')[0] }}</p>
            <p>资产名称：{{ selectedAlert.targetAsset }}</p>
            <p>业务应用：数据模型工具</p>
            <p>VPC名称：大数据业务域</p>
            <p>VPCID：sy234-eh343-ch34q3r43</p>
            <p>region名称：北京数据中心</p>
            <div class="drill-hint">点击拓扑节点，可在右侧查看该节点的流量会话、告警命中与关联资产。</div>
          </aside>
          <div class="topology-canvas drill-canvas" aria-label="资产关联关系拓扑图">
            <svg class="topology-links" viewBox="0 0 760 430" preserveAspectRatio="none">
              <path d="M112 180 C230 130, 300 130, 384 175" />
              <path d="M112 230 C238 260, 308 264, 384 221" />
              <path d="M384 175 C470 130, 565 126, 652 166" />
              <path d="M384 221 C480 252, 560 256, 660 230" />
              <path d="M382 252 C450 310, 535 316, 632 328" />
              <path class="danger-path" d="M700 82 C610 82, 525 118, 448 170" />
            </svg>
            <button :class="topologyNodeClass('vpc-bigdata')" class="vpc-main" @click="drillTopologyNode('vpc-bigdata')"><b>VPC</b><span>大数据业务域</span><em>12.8% 异常</em></button>
            <button :class="topologyNodeClass('nat-prod-01')" class="nat-node" @click="drillTopologyNode('nat-prod-01')"><b>NAT网关</b><span>39.110.116.43</span></button>
            <button :class="topologyNodeClass('lb-datamodel-01')" class="lb-node" @click="drillTopologyNode('lb-datamodel-01')"><b>负载均衡</b><span>LB-datamodel-01</span></button>
            <button :class="topologyNodeClass('waf-prod')" class="waf-node" @click="drillTopologyNode('waf-prod')"><b>云WAF</b><span>高危命中 2</span></button>
            <button :class="topologyNodeClass('ecs-prod-02')" class="ecs-node" @click="drillTopologyNode('ecs-prod-02')"><b>云主机</b><span>{{ selectedAlert.targetAsset }}</span><em>{{ selectedAlert.targetIp.split(':')[0] }}</em></button>
            <button :class="topologyNodeClass('vpc-ops')" class="vpc-ops" @click="drillTopologyNode('vpc-ops')"><b>VPC</b><span>运维支撑域</span></button>
            <button :class="topologyNodeClass('physical-a')" class="physical-node" @click="drillTopologyNode('physical-a')"><b>物理机</b><span>d563xeh3u-23ry23</span></button>
            <button :class="topologyNodeClass('region-bj')" class="region-node" @click="drillTopologyNode('region-bj')"><b>region</b><span>北京数据中心</span></button>
            <button :class="topologyNodeClass('attacker-cn')" class="attacker-node" @click="drillTopologyNode('attacker-cn')"><b>🇨🇳 攻击源</b><span>{{ selectedAlert.sourceIp }}</span></button>
          </div>
          <aside class="node-detail-panel">
            <div class="node-detail-head">
              <div>
                <p>{{ selectedTopologyNode.type }}</p>
                <h3>{{ selectedTopologyNode.name }}</h3>
                <span>{{ selectedTopologyNode.ip }} · {{ selectedTopologyNode.area }}</span>
              </div>
              <span :class="levelClass(selectedTopologyNode.risk)">{{ selectedTopologyNode.risk }}</span>
            </div>
            <div class="node-status-line"><b>{{ selectedTopologyNode.status }}</b><span>负责人：{{ selectedTopologyNode.owner }}</span></div>
            <div class="traffic-metrics">
              <article><span>会话数</span><strong>{{ selectedTopologyNode.traffic.sessions.toLocaleString() }}</strong></article>
              <article><span>入流量</span><strong>{{ selectedTopologyNode.traffic.inbound }}</strong></article>
              <article><span>出流量</span><strong>{{ selectedTopologyNode.traffic.outbound }}</strong></article>
              <article><span>峰值带宽</span><strong>{{ selectedTopologyNode.traffic.peak }}</strong></article>
            </div>
            <div class="protocol-tags"><span>异常占比 {{ selectedTopologyNode.traffic.abnormal }}</span><em v-for="protocol in selectedTopologyNode.traffic.protocols" :key="protocol">{{ protocol }}</em></div>
            <section class="drill-section">
              <h4>最近流量会话</h4>
              <div v-for="session in selectedTopologyNode.sessions" :key="`${session.time}-${session.peer}`" class="session-row"><time>{{ session.time }}</time><div><b>{{ session.protocol }}</b><span>{{ session.peer }}</span></div><em>{{ session.action }} / {{ session.bytes }}</em></div>
            </section>
            <section class="drill-section">
              <h4>告警命中</h4>
              <div v-for="alert in selectedTopologyNode.alerts" :key="alert.id" class="node-alert-row"><button @click="openAlert(alert.id)">{{ alert.id }}</button><span>{{ alert.name }}</span><i :class="levelClass(alert.level)">{{ alert.level }}</i><em>{{ alert.status }}</em></div>
            </section>
            <section class="drill-section">
              <h4>关联资产</h4>
              <div class="relation-tags"><span v-for="relation in selectedTopologyNode.relations" :key="relation">{{ relation }}</span></div>
            </section>
            <div class="suggestion-box">{{ selectedTopologyNode.suggestion }}</div>
            <div class="detail-actions"><button class="blue-button" @click="setPage('alerts')">查看告警</button><button class="white-button" @click="goTrace(selectedTopologyNode.alerts[0]?.id || selectedAlert.id)">生成溯源</button><button class="red-button" @click="showToast(`${selectedTopologyNode.name} 已加入临时阻断策略`)" >临时阻断</button></div>
          </aside>
        </div>
        <div v-else-if="activeTraceTab === '攻击者画像'" class="attacker-profile panel"><div class="avatar-risk">高</div><div><h3>攻击者画像</h3><p>来源地：{{ selectedAlert.sourceGeo }}；历史命中 36 次；常用技术：SQL 注入、系统命令执行、端口扫描；可能工具：自动化扫描器、脚本化 WebShell 投递。</p><div class="tag-cloud"><span>MacOS X</span><span>Windows OS</span><span>未使用跳板主机</span><span>高可信 IOC</span></div></div></div>
        <div v-else class="table-card"><table class="data-table"><thead><tr><th>序号</th><th>协议</th><th>源IP</th><th>目的IP</th><th>URI/特征</th><th>判定</th><th>包大小</th></tr></thead><tbody><tr v-for="row in packetRows" :key="row.no"><td>{{ row.no }}</td><td>{{ row.protocol }}</td><td>{{ row.src }}</td><td>{{ row.dst }}</td><td>{{ row.uri }}</td><td><span class="tag danger">{{ row.verdict }}</span></td><td>{{ row.size }}</td></tr></tbody></table></div>
      </section>

      <section v-if="activePage === 'risk'" class="page-stack"><div class="tab-strip"><button v-for="tab in ['VPC','业务系统','云主机','容器','物理机']" :key="tab" :class="{ active: riskDimension === tab }" @click="riskDimension = tab">{{ tab }}</button></div><div class="risk-grid"><article v-for="row in selectedRiskRows" :key="row.object" class="risk-card"><div><h3>{{ row.object }}</h3><p>{{ row.vpc }} · 最近风险：{{ row.last }}</p></div><strong>{{ row.trend }}</strong><div class="risk-bars"><span :style="{ width: `${row.high}%` }" class="high"></span><span :style="{ width: `${row.mid}%` }" class="mid"></span><span :style="{ width: `${row.low}%` }" class="low"></span></div><button @click="setPage('assets')">查看资产</button></article></div><div class="table-card"><table class="data-table"><thead><tr><th>对象</th><th>维度</th><th>所属域</th><th>高危</th><th>中危</th><th>低危</th><th>最后命中</th><th>操作</th></tr></thead><tbody><tr v-for="row in selectedRiskRows" :key="row.object"><td>{{ row.object }}</td><td>{{ row.dim }}</td><td>{{ row.vpc }}</td><td><span class="tag danger">{{ row.high }}</span></td><td><span class="tag warning">{{ row.mid }}</span></td><td><span class="tag info">{{ row.low }}</span></td><td>{{ row.last }}</td><td class="ops"><button @click="setPage('trace')">溯源</button><button @click="setPage('alerts')">告警</button></td></tr></tbody></table></div></section>

      <section v-if="activePage === 'assets'" class="page-stack"><div class="asset-stat-grid"><article v-for="stat in assetStats" :key="stat.label" :data-tone="stat.tone"><span>{{ stat.icon }}</span><p>{{ stat.label }}</p><strong>{{ stat.value }}</strong></article></div><div class="tab-strip"><button v-for="tab in ['region','VPC','物理机','云主机','容器','漏洞管理','弱口令','两高一弱']" :key="tab" :class="{ active: activeAssetTab === tab }" @click="activeAssetTab = tab as AssetTab">{{ tab }}</button></div><div class="toolbar-card"><div></div><div class="toolbar-controls"><select><option>region</option><option>资产名称</option></select><input v-model="assetKeyword" placeholder="请输入查询条件"/><button class="blue-button">精准查询</button><button class="blue-button secondary" @click="assetKeyword = ''">重置筛选</button></div></div><div class="table-card"><table class="data-table"><thead><tr><th><input type="checkbox" /></th><th>序号</th><th>VPC ID / 资产ID</th><th>VPC名称 / 资产名称</th><th>所属region</th><th>网段</th><th>云主机数量</th><th>关联容器数量</th><th>风险分</th><th>更新时间</th><th>操作</th></tr></thead><tbody><tr v-for="(row, index) in filteredAssets" :key="row.id"><td><input type="checkbox" /></td><td>{{ index + 1 }}</td><td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.region }}</td><td>{{ row.cidr }}</td><td>{{ row.hosts }}</td><td>{{ row.containers }}</td><td><span :class="row.risk > 85 ? 'tag danger' : 'tag warning'">{{ row.risk }}</span></td><td>{{ row.updated }}</td><td class="ops"><button @click="showToast('已打开资产详情')">详情</button><button>编辑</button><button>删除</button></td></tr></tbody></table><div class="pagination"><span>共5000条</span><div><button>上一页</button><b>1</b><b class="active">2</b><b>3</b><span>...</span><b>10</b><button>下一页</button></div></div></div></section>

      <section v-if="activePage === 'rules'" class="page-stack"><div class="tab-strip"><button v-for="tab in ['规则配置','规则组配置','白名单']" :key="tab" :class="{ active: activeRuleTab === tab }" @click="activeRuleTab = tab as RuleTab">{{ tab }}</button></div><div class="toolbar-card"><div><button class="blue-button">添加自定义类型</button><button class="blue-button">添加自定义规则</button><button class="green-button">更新规则</button><button class="green-button">数据导入</button><button class="green-button">数据导出</button></div><div class="toolbar-controls"><input v-model="ruleKeyword" placeholder="支持输入序号、规则组、威胁等级、攻击状态、备注"/><button class="blue-button">查找</button></div></div><div v-if="activeRuleTab !== '白名单'" class="table-card"><table class="data-table"><thead><tr><th><input type="checkbox" /></th><th>序号</th><th>规则类型</th><th>规则组</th><th>是否启用</th><th>所属类型</th><th>威胁等级</th><th>攻击状态</th><th>是否存在后门</th><th>备注</th><th>操作</th></tr></thead><tbody><tr v-for="(row, index) in filteredRules" :key="row.id"><td><input type="checkbox" /></td><td>{{ index + 1 }}</td><td><span class="tag info">{{ row.type }}</span></td><td>{{ row.group }}</td><td><button :class="['switch', { on: row.enabled }]" @click="toggleRule(index)">{{ row.enabled ? '是' : '否' }}</button></td><td>{{ row.belong }}</td><td><span :class="levelClass(row.level)">{{ row.level }}</span></td><td><span class="tag success">{{ row.attackStatus }}</span></td><td><span class="tag warning">{{ row.backdoor }}</span></td><td>{{ row.memo }}</td><td class="ops"><button>修改</button><button>删除</button></td></tr></tbody></table></div><div v-else class="table-card"><table class="data-table"><thead><tr><th>序号</th><th>白名单对象</th><th>类型</th><th>作用范围</th><th>原因</th><th>过期时间</th><th>启用</th><th>操作</th></tr></thead><tbody><tr v-for="(row, index) in whitelist" :key="row.id"><td>{{ index + 1 }}</td><td>{{ row.object }}</td><td>{{ row.type }}</td><td>{{ row.scope }}</td><td>{{ row.reason }}</td><td>{{ row.expire }}</td><td><span :class="row.enabled ? 'tag success' : 'tag info'">{{ row.enabled ? '是' : '否' }}</span></td><td class="ops"><button>修改</button><button>删除</button></td></tr></tbody></table></div></section>

      <section v-if="activePage === 'warning'" class="page-stack"><div class="tab-strip"><button v-for="tab in ['邮件通知','邮件列表','邮件服务器配置']" :key="tab" :class="{ active: activeWarningTab === tab }" @click="activeWarningTab = tab as WarningTab">{{ tab }}</button></div><div v-if="activeWarningTab === '邮件服务器配置'" class="mail-card panel"><div class="form-row required"><label>发送服务器/SMTP服务器：</label><input placeholder="输入发送服务器"/><label class="check"><input type="checkbox"/> SSL端口</label><input placeholder="输入端口"/><button class="blue-button" @click="testSmtp">{{ smtpTesting ? '测试中...' : '测试连通性' }}</button></div><div class="hint-bar">电子邮件的发送服务器，可以填写内部搭建的邮件服务器地址或外网发送地址</div><div class="form-row required"><label>发送Email账号：</label><input placeholder="输入发送Email地址"/></div><div class="hint-bar">能够登录该电子邮件的服务器 Email 账号</div><div class="form-row required"><label>发送Email密码：</label><input placeholder="输入发送Email密码" type="password"/><button class="eye">◉</button></div><div class="hint-bar">能够登录该电子邮件的服务器 Email 密码</div><div class="form-row required"><label>发送邮件：</label><input placeholder="输入发送人邮件"/></div><div class="hint-bar">作为发送该威胁邮件的发送人邮件</div><div class="form-row required"><label>发送人名称：</label><input placeholder="输入发送人名称"/></div><div class="hint-bar">该威胁邮件的显示的发送人名称</div><div class="form-row required"><label>接收邮件：</label><input placeholder="接收人邮件，输入多个换行"/></div><div class="hint-bar">接收该威胁邮件的接收邮件，多个接收邮件用；分隔</div><div class="form-row"><label>邮件主题：</label><input placeholder="输入邮件主题"/></div><div class="mail-actions"><button class="green-button" @click="showToast('已测试并提交邮件服务器配置')">测试并提交配置</button><button class="red-button" @click="showToast('已删除邮件服务器配置')">删除配置</button></div></div><div v-else-if="activeWarningTab === '邮件通知'" class="panel notice-config"><h3>邮件通知策略</h3><label class="switch-line">高危告警实时发送 <input type="checkbox" v-model="mailEnabled" /></label><label class="switch-line">中低危告警按小时汇总 <input type="checkbox" checked /></label><label class="switch-line">溯源报告生成后发送附件 <input type="checkbox" checked /></label></div><div v-else class="table-card"><table class="data-table"><thead><tr><th>序号</th><th>接收人</th><th>部门</th><th>接收等级</th><th>状态</th><th>操作</th></tr></thead><tbody><tr><td>1</td><td>secops@example.com</td><td>安全运营中心</td><td>高危/中危</td><td><span class="tag success">启用</span></td><td class="ops"><button>编辑</button><button>删除</button></td></tr><tr><td>2</td><td>auditor@example.com</td><td>审计组</td><td>高危</td><td><span class="tag info">停用</span></td><td class="ops"><button>编辑</button><button>删除</button></td></tr></tbody></table></div></section>
    </main>

    <aside v-if="alertDrawerOpen" class="drawer"><button class="drawer-close" @click="alertDrawerOpen = false">×</button><h3>告警详情：{{ selectedAlert.id }}</h3><p>{{ selectedAlert.attackType }} 命中 {{ selectedAlert.targetAsset }}</p><dl><dt>源 IP</dt><dd>{{ selectedAlert.sourceIp }} · {{ selectedAlert.sourceGeo }}</dd><dt>目的 IP</dt><dd>{{ selectedAlert.targetIp }}</dd><dt>详细参数</dt><dd>{{ selectedAlert.detail }}</dd><dt>置信度</dt><dd>{{ selectedAlert.confidence }}%</dd></dl><div class="drawer-actions"><button class="blue-button" @click="goTrace(selectedAlert.id)">进入溯源分析</button><button class="white-button" @click="openAddIntelligence(selectedAlert.sourceIp)">加情报</button><button class="red-button" @click="handleAlertAction(selectedAlert.id, '阻断隔离')">阻断隔离</button></div></aside>

    <div v-if="intelligenceDialog" class="modal-mask"><div class="modal"><button class="drawer-close" @click="intelligenceDialog = false">×</button><h3>新增威胁情报</h3><label><span>情报内容</span><input v-model="intelligencePrefill" placeholder="请输入内容"/></label><label><span>情报标签</span><input placeholder="请输入内容"/></label><div class="check-grid"><span>检测项</span><label><input type="checkbox" checked/> IP</label><label><input type="checkbox"/> 域名</label><label><input type="checkbox"/> URL</label><label><input type="checkbox"/> 文件HASH</label><label><input type="checkbox"/> 邮箱</label><label><input type="checkbox"/> 邮件正文</label></div><label><span>威胁等级</span><select><option>中危</option><option>高危</option><option>低危</option></select></label><label><span>可信度等级</span><select><option>中可信</option><option>高可信</option><option>低可信</option></select></label><div class="modal-actions"><button class="white-button" @click="intelligenceDialog = false">取消</button><button class="blue-button" @click="addIntelligence">确定</button></div></div></div>

    <div v-if="toastText" class="toast">{{ toastText }}</div>
  </div>
</template>
