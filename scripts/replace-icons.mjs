import fs from 'node:fs';

const file = '/home/ubuntu/cloud-traffic-security/client/src/App.vue';
let source = fs.readFileSync(file, 'utf8');

const replacements = [
  [`import { computed, ref } from 'vue';`, `import { computed, ref } from 'vue';\nimport AppIcon from './components/AppIcon.vue';`],
  [`{ key: 'overview' as PageKey, label: '态势概览', icon: '态' }`, `{ key: 'overview' as PageKey, label: '态势概览', icon: 'overview' }`],
  [`{ key: 'alerts' as PageKey, label: '实时告警', icon: '警' }`, `{ key: 'alerts' as PageKey, label: '实时告警', icon: 'alerts' }`],
  [`{ key: 'intelligence' as PageKey, label: '威胁情报', icon: '情' }`, `{ key: 'intelligence' as PageKey, label: '威胁情报', icon: 'intelligence' }`],
  [`{ key: 'risk' as PageKey, label: '风险定位', icon: '险' }`, `{ key: 'risk' as PageKey, label: '风险定位', icon: 'risk' }`],
  [`{ key: 'trace' as PageKey, label: '溯源分析', icon: '溯' }`, `{ key: 'trace' as PageKey, label: '溯源分析', icon: 'trace' }`],
  [`{ key: 'assets' as PageKey, label: '云资产管理', icon: '资' }`, `{ key: 'assets' as PageKey, label: '云资产管理', icon: 'assets' }`],
  [`{ key: 'rules' as PageKey, label: '业务规则', icon: '规' }`, `{ key: 'rules' as PageKey, label: '业务规则', icon: 'rules' }`],
  [`{ key: 'warning' as PageKey, label: '威胁预警', icon: '邮' }`, `{ key: 'warning' as PageKey, label: '威胁预警', icon: 'warning' }`],
  [`const moduleIcons: Record<string, string> = {\n  overview: '态', alerts: '警', intelligence: '情', trace: '溯', risk: '险', assets: '资', rules: '规', warning: '邮',\n  攻击过程: '链', 资产行为分析: '行', 资产关联关系: '拓', 攻击者画像: '像', 流量包分析: '包',\n  region: '区', VPC: '云', 物理机: '物', 云主机: '主', 容器: '容', 漏洞管理: '漏', 弱口令: '弱', 两高一弱: '基',\n  规则配置: '配', 规则组配置: '组', 白名单: '白', 邮件通知: '通', 邮件列表: '列', 邮件服务器配置: '服',\n  全部: '全', 外部攻击: '外', 横向移动: '横', SQL注入: '注', 端口扫描: '扫', 暴力破解: '破', 违规外联: '联', 未授权访问: '未', 信息泄露: '泄',\n};`, `const moduleIcons: Record<string, string> = {\n  overview: 'overview', alerts: 'alerts', intelligence: 'intelligence', trace: 'trace', risk: 'risk', assets: 'assets', rules: 'rules', warning: 'warning',\n  攻击过程: 'process', 资产行为分析: 'behavior', 资产关联关系: 'topology', 攻击者画像: 'profile', 流量包分析: 'packet',\n  region: 'region', VPC: 'vpc', 物理机: 'physical', 云主机: 'host', 容器: 'container', 漏洞管理: 'vulnerability', 弱口令: 'password', 两高一弱: 'baseline',\n  规则配置: 'config', 规则组配置: 'group', 白名单: 'whitelist', 邮件通知: 'mail', 邮件列表: 'recipients', 邮件服务器配置: 'smtp',\n  全部: 'all', 外部攻击: 'external', 横向移动: 'lateral', SQL注入: 'sql', 端口扫描: 'scan', 暴力破解: 'brute', 违规外联: 'outbound', 未授权访问: 'unauthorized', 信息泄露: 'leak',\n};`],
  [`{ label: '受攻击 region 数', value: '35', total: '40', icon: '◉', tone: 'green' }`, `{ label: '受攻击 region 数', value: '35', total: '40', icon: 'region', tone: 'green' }`],
  [`{ label: '受攻击物理机数', value: '9,800', total: '12,000', icon: '▤', tone: 'blue' }`, `{ label: '受攻击物理机数', value: '9,800', total: '12,000', icon: 'physical', tone: 'blue' }`],
  [`{ label: '受攻击云主机数', value: '53,455', total: '120,000', icon: '☁', tone: 'cyan' }`, `{ label: '受攻击云主机数', value: '53,455', total: '120,000', icon: 'host', tone: 'cyan' }`],
  [`{ label: '受攻击容器数', value: '23,455', total: '60,000', icon: '⬡', tone: 'orange' }`, `{ label: '受攻击容器数', value: '23,455', total: '60,000', icon: 'container', tone: 'orange' }`],
  [`{ label: 'region 数量', value: '40', tone: 'green', icon: '◎' }`, `{ label: 'region 数量', value: '40', tone: 'green', icon: 'region' }`],
  [`{ label: 'VPC', value: '100', tone: 'purple', icon: '☁' }`, `{ label: 'VPC', value: '100', tone: 'purple', icon: 'vpc' }`],
  [`{ label: '物理机', value: '30000', tone: 'gold', icon: '▤' }`, `{ label: '物理机', value: '30000', tone: 'gold', icon: 'physical' }`],
  [`{ label: '云主机', value: '150000', tone: 'gold', icon: '▣' }`, `{ label: '云主机', value: '150000', tone: 'gold', icon: 'host' }`],
  [`{ label: '容器数', value: '20', tone: 'red', icon: '⬡' }`, `{ label: '容器数', value: '20', tone: 'red', icon: 'container' }`],
  [`return moduleIcons[key] || '项';`, `return moduleIcons[key] || 'default';`],
  [`<span class="nav-icon">{{ item.icon }}</span><em>{{ item.label }}</em>`, `<span class="nav-icon"><AppIcon :name="item.icon" :label="item.label" /></span><em>{{ item.label }}</em>`],
  [`<h2><span class="heading-icon">{{ pageTitleIcon }}</span>{{ pageTitle }}</h2>`, `<h2><span class="heading-icon"><AppIcon :name="pageTitleIcon" :label="pageTitle" /></span>{{ pageTitle }}</h2>`],
  [`<button class="blue-button" @click="refreshPage">刷新数据</button>`, `<button class="blue-button icon-button" @click="refreshPage"><AppIcon name="refresh" size="16" />刷新数据</button>`],
  [`<span>{{ kpi.icon }}</span><p>{{ kpi.label }}</p>`, `<span><AppIcon :name="kpi.icon" :label="kpi.label" /></span><p>{{ kpi.label }}</p>`],
  [`<span class="sub-icon">{{ iconFor(scene.name) }}</span>{{ scene.name }}`, `<span class="sub-icon"><AppIcon :name="iconFor(scene.name)" :label="scene.name" /></span>{{ scene.name }}`],
  [`<span class="sub-icon">{{ iconFor(tag) }}</span>{{ tag }}`, `<span class="sub-icon"><AppIcon :name="iconFor(tag)" :label="tag" /></span>{{ tag }}`],
  [`<span class="sub-icon">{{ iconFor(tab) }}</span>{{ tab }}`, `<span class="sub-icon"><AppIcon :name="iconFor(tab)" :label="tab" /></span>{{ tab }}`],
  [`<button class="eye">◉</button>`, `<button class="eye" aria-label="查看密码"><AppIcon name="eye" size="16" /></button>`],
];

for (const [find, replace] of replacements) {
  if (!source.includes(find)) {
    console.warn(`未找到片段，跳过：${find.slice(0, 80).replace(/\n/g, ' ')}`);
    continue;
  }
  source = source.replace(find, replace);
}

source = source.replace(/<span class="sub-icon">\{\{ iconFor\(([^)]+)\) \}\}<\/span>\{\{ ([^}]+) \}\}/g, '<span class="sub-icon"><AppIcon :name="iconFor($1)" :label="$2" /></span>{{ $2 }}');
source = source.replace(/<span>\{\{ stat\.icon \}\}<\/span>/g, '<span><AppIcon :name="stat.icon" :label="stat.label" /></span>');
source = source.replace(/<span>\{\{ item\.icon \}\}<\/span>/g, '<span><AppIcon :name="item.icon" /></span>');

fs.writeFileSync(file, source);
