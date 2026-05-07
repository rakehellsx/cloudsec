from pathlib import Path
path = Path('/home/ubuntu/cloud-traffic-security/client/src/App.vue')
text = path.read_text()

text = text.replace("const selectedTopologyNodeId = ref('ecs-prod-02');", """const selectedTopologyNodeId = ref('ecs-prod-02');
const selectedRiskObject = ref('');
const selectedAssetId = ref('');
const ruleDialogOpen = ref(false);
const ruleDialogMode = ref('新增自定义规则');
const confirmAction = ref<{ title: string; content: string; onConfirm: () => void } | null>(null);
const trafficFocus = ref('互联网攻击');
const intelligenceQuery = ref('');""")

text = text.replace("""const navGroups = [
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
];""", """const navGroups = [
  {
    title: '安全态势',
    items: [{ key: 'overview' as PageKey, label: '态势概览', icon: '态' }],
  },
  {
    title: '威胁分析',
    items: [
      { key: 'alerts' as PageKey, label: '实时告警', icon: '警' },
      { key: 'intelligence' as PageKey, label: '威胁情报', icon: '情' },
      { key: 'risk' as PageKey, label: '风险定位', icon: '险' },
      { key: 'trace' as PageKey, label: '溯' },
    ],
  },
  {
    title: '资源与规则',
    items: [
      { key: 'assets' as PageKey, label: '云资产管理', icon: '资' },
      { key: 'rules' as PageKey, label: '业务规则', icon: '规' },
      { key: 'warning' as PageKey, label: '威胁预警', icon: '邮' },
    ],
  },
];""")
# Fix label accidentally shortened for trace if needed
text = text.replace("{ key: 'trace' as PageKey, label: '溯' },", "{ key: 'trace' as PageKey, label: '溯源分析', icon: '溯' },")

text = text.replace("type WarningTab = '邮件通知' | '邮件列表' | '邮件服务器配置';", "type WarningTab = '邮件通知' | '邮件列表' | '邮件服务器配置';\ntype IconKey = PageKey | TraceTab | AssetTab | RuleTab | WarningTab | '外部攻击' | '横向移动' | '全部' | 'SQL注入' | '端口扫描' | '暴力破解' | '违规外联' | '未授权访问' | '信息泄露';")

text = text.replace("""const pageMeta: Record<PageKey, { title: string; crumb: string; desc: string }> = {""", """const moduleIcons: Record<string, string> = {
  overview: '态', alerts: '警', intelligence: '情', trace: '溯', risk: '险', assets: '资', rules: '规', warning: '邮',
  攻击过程: '链', 资产行为分析: '行', 资产关联关系: '拓', 攻击者画像: '像', 流量包分析: '包',
  region: '区', VPC: '云', 物理机: '物', 云主机: '主', 容器: '容', 漏洞管理: '漏', 弱口令: '弱', 两高一弱: '基',
  规则配置: '配', 规则组配置: '组', 白名单: '白', 邮件通知: '通', 邮件列表: '列', 邮件服务器配置: '服',
  全部: '全', 外部攻击: '外', 横向移动: '横', SQL注入: '注', 端口扫描: '扫', 暴力破解: '破', 违规外联: '联', 未授权访问: '未', 信息泄露: '泄',
};

const pageMeta: Record<PageKey, { title: string; crumb: string; desc: string }> = {""")

text = text.replace("const filteredIntelligence = computed(() => intelligence.value.filter((item) => !onlyHit.value || item.hit));", """const filteredIntelligence = computed(() => intelligence.value.filter((item) => {
  const keyword = intelligenceQuery.value.trim().toLowerCase();
  const matchHit = !onlyHit.value || item.hit;
  const matchKeyword = !keyword || `${item.content} ${item.affected} ${item.type} ${item.source}`.toLowerCase().includes(keyword);
  return matchHit && matchKeyword;
}));""")

text = text.replace("const selectedRiskRows = computed(() => riskRows.filter((item) => riskDimension.value === '全部' || item.dim === riskDimension.value));\nconst selectedTopologyNode = computed(() => topologyNodes.find((node) => node.id === selectedTopologyNodeId.value) || topologyNodes[0]);", """const selectedRiskRows = computed(() => riskRows.filter((item) => riskDimension.value === '全部' || item.dim === riskDimension.value));
const selectedRiskRow = computed(() => selectedRiskRows.value.find((item) => item.object === selectedRiskObject.value) || selectedRiskRows.value[0] || riskRows[0]);
const selectedTopologyNode = computed(() => topologyNodes.find((node) => node.id === selectedTopologyNodeId.value) || topologyNodes[0]);
const selectedAsset = computed(() => assetRows.find((item) => item.id === selectedAssetId.value));
const pageTitleIcon = computed(() => moduleIcons[activePage.value]);
const allAlertSelected = computed(() => filteredAlerts.value.length > 0 && filteredAlerts.value.every((item) => selectedRows.value.includes(item.id)));""")

text = text.replace("""function setPage(page: PageKey) {
  activePage.value = page;
  alertDrawerOpen.value = false;
  moreMenuId.value = '';
}""", """function iconFor(key: IconKey | string) {
  return moduleIcons[key] || '项';
}

function setPage(page: PageKey) {
  activePage.value = page;
  alertDrawerOpen.value = false;
  moreMenuId.value = '';
  if (page !== 'assets') selectedAssetId.value = '';
  showToast(`已切换到${pageMeta[page].title}模块`);
}

function refreshPage() {
  const actionMap: Record<PageKey, string> = {
    overview: '已刷新态势指标、攻击趋势与实时告警监测数据',
    alerts: '已刷新告警队列并重新计算当前筛选结果',
    intelligence: '已同步威胁情报命中状态',
    trace: '已刷新当前告警的溯源证据链',
    risk: '已重新计算风险定位维度与风险分',
    assets: '已同步云资产清单与风险关联关系',
    rules: '已刷新业务规则命中统计',
    warning: '已刷新威胁预警配置状态',
  };
  showToast(actionMap[activePage.value]);
}""")

text = text.replace("""function toggleRow(id: string) {
  selectedRows.value = selectedRows.value.includes(id) ? selectedRows.value.filter((row) => row !== id) : [...selectedRows.value, id];
}""", """function toggleRow(id: string) {
  selectedRows.value = selectedRows.value.includes(id) ? selectedRows.value.filter((row) => row !== id) : [...selectedRows.value, id];
}

function toggleAllAlerts() {
  const currentIds = filteredAlerts.value.map((item) => item.id);
  selectedRows.value = allAlertSelected.value ? selectedRows.value.filter((id) => !currentIds.includes(id)) : Array.from(new Set([...selectedRows.value, ...currentIds]));
  showToast(allAlertSelected.value ? '已取消当前筛选结果的全选状态' : `已选择当前筛选结果中的 ${currentIds.length} 条告警`);
}

function applyScenario(scene: string) {
  selectedScenario.value = scene;
  if (scene !== '全部') showToast(`已按威胁场景“${scene}”过滤告警`);
}

function focusAttackType(type: string) {
  selectedType.value = selectedType.value === type ? '全部类型' : type;
  setPage('alerts');
  showToast(`已联动到实时告警并筛选攻击类型：${selectedType.value}`);
}

function openMapEndpoint(kind: 'source' | 'target') {
  if (kind === 'source') {
    alertKeyword.value = selectedAlert.value.sourceIp.split(':')[0];
    setPage('alerts');
    showToast('已按地图攻击源 IP 联动筛选告警');
  } else {
    activeTraceTab.value = '资产关联关系';
    setPage('trace');
    selectedTopologyNodeId.value = 'ecs-prod-02';
    showToast('已进入目的资产拓扑钻取视图');
  }
}""")

text = text.replace("""function handleAlertAction(id: string, action: string) {
  selectedAlertId.value = id;
  if (action === '标记已处理') {
    alerts.value = alerts.value.map((item) => item.id === id ? { ...item, status: '已处理' as AlertStatus } : item);
  }
  if (action === '封禁' || action === '阻断隔离') {
    alerts.value = alerts.value.map((item) => item.id === id ? { ...item, status: '已阻断' as AlertStatus } : item);
  }
  moreMenuId.value = '';
  showToast(`告警 ${id} 已执行：${action}`);
}""", """function handleAlertAction(id: string, action: string) {
  selectedAlertId.value = id;
  if (action === '标记已处理' || action === '标记误报' || action === '加白') {
    alerts.value = alerts.value.map((item) => item.id === id ? { ...item, status: '已处理' as AlertStatus } : item);
  }
  if (action === '封禁' || action === '阻断隔离') {
    alerts.value = alerts.value.map((item) => item.id === id ? { ...item, status: '已阻断' as AlertStatus } : item);
  }
  if (action === '加资产') {
    selectedAssetId.value = assetRows.find((asset) => selectedAlert.value.targetAsset.includes(asset.name) || selectedAlert.value.targetIp.includes(asset.cidr))?.id || 'ecs-0002';
    activeAssetTab.value = '云主机';
    setPage('assets');
  }
  moreMenuId.value = '';
  showToast(`告警 ${id} 已执行：${action}，处置记录已写入审计链路`);
}""")

text = text.replace("""function resetAlertFilter() {
  selectedScenario.value = '全部';
  selectedType.value = '全部类型';
  selectedLevel.value = '全部等级';
  selectedStatus.value = '全部状态';
  alertKeyword.value = '';
  showToast('已重置实时告警筛选条件');
}""", """function resetAlertFilter() {
  selectedScenario.value = '全部';
  selectedType.value = '全部类型';
  selectedLevel.value = '全部等级';
  selectedStatus.value = '全部状态';
  alertKeyword.value = '';
  selectedRows.value = [];
  showToast('已重置实时告警筛选条件与批量选择');
}

function viewIntelligence(item: typeof intelligence.value[number]) {
  intelligenceQuery.value = item.content;
  alertKeyword.value = item.content.split('\\n')[0];
  showToast(`已定位情报 ${item.id}，可继续查看关联告警命中`);
}

function linkIntelligenceAlerts(item: typeof intelligence.value[number]) {
  alertKeyword.value = item.content.split('\\n')[0];
  selectedType.value = '全部类型';
  setPage('alerts');
  showToast(`已按 IOC ${item.content} 联动查询告警`);
}

function toggleIntelligence(index: number) {
  const item = filteredIntelligence.value[index];
  const realIndex = intelligence.value.findIndex((row) => row.id === item.id);
  if (realIndex >= 0) intelligence.value[realIndex].effect = intelligence.value[realIndex].effect === '有效' ? '失效' : '有效';
  showToast(`${item.id} 已${intelligence.value[realIndex].effect === '有效' ? '启用' : '停用'}`);
}

function deleteIntelligence(index: number) {
  const item = filteredIntelligence.value[index];
  confirmAction.value = { title: '删除威胁情报', content: `确认删除 ${item.content}？删除后不会影响已沉淀的告警处置记录。`, onConfirm: () => {
    intelligence.value = intelligence.value.filter((row) => row.id !== item.id);
    showToast(`已删除情报 ${item.id}`);
  }};
}

function selectRisk(row: typeof riskRows[number]) {
  selectedRiskObject.value = row.object;
  showToast(`已选中风险对象：${row.object}，右侧指标和操作将围绕该对象联动`);
}

function traceRisk(row: typeof riskRows[number]) {
  const matched = alerts.value.find((alert) => alert.targetAsset.includes(row.object) || row.last.includes(alert.attackType)) || alerts.value[0];
  selectedAlertId.value = matched.id;
  activeTraceTab.value = '攻击过程';
  setPage('trace');
}

function openAsset(row: typeof assetRows[number]) {
  selectedAssetId.value = row.id;
  showToast(`已打开资产详情：${row.name}`);
}

function syncAssets() {
  showToast('已向云平台发起资产同步，新增与风险变化资产会自动高亮');
}

function resetAssetFilter() {
  assetKeyword.value = '';
  activeAssetTab.value = 'VPC';
  showToast('已重置云资产筛选条件');
}

function openRuleDialog(mode: string) {
  ruleDialogMode.value = mode;
  ruleDialogOpen.value = true;
}

function copyRule(index: number) {
  const source = filteredRules.value[index];
  rules.value.unshift({ ...source, id: `R-${String(rules.value.length + 1).padStart(3, '0')}`, type: '自定义规则', enabled: false, memo: `复制自 ${source.id}` });
  showToast(`已复制规则 ${source.id}，新规则默认停用等待确认`);
}

function deleteRule(index: number) {
  const source = filteredRules.value[index];
  confirmAction.value = { title: '删除业务规则', content: `确认删除规则 ${source.id} / ${source.group}？删除前建议先导出规则备份。`, onConfirm: () => {
    rules.value = rules.value.filter((item) => item.id !== source.id);
    showToast(`已删除规则 ${source.id}`);
  }};
}

function runConfirmAction() {
  confirmAction.value?.onConfirm();
  confirmAction.value = null;
}

function saveWarningConfig(action: string) {
  showToast(`${action}已完成，通知策略会同步应用到高危告警与溯源报告`);
}""")

text = text.replace("<button class=\"blue-button\" @click=\"showToast('已刷新当前页面模拟数据')\">刷新数据</button>", "<button class=\"blue-button\" @click=\"refreshPage\">刷新数据</button>")
text = text.replace("<h2>{{ pageTitle }}</h2>", "<h2><span class=\"heading-icon\">{{ pageTitleIcon }}</span>{{ pageTitle }}</h2>")
text = text.replace("<span>{{ item.icon }}</span>{{ item.label }}", "<span class=\"nav-icon\">{{ item.icon }}</span><em>{{ item.label }}</em>")
text = text.replace("<article v-for=\"kpi in kpis\" :key=\"kpi.label\" :data-tone=\"kpi.tone\">", "<article v-for=\"kpi in kpis\" :key=\"kpi.label\" :data-tone=\"kpi.tone\" role=\"button\" tabindex=\"0\" @click=\"setPage(kpi.label.includes('region') ? 'assets' : 'risk')\">")
text = text.replace("<div class=\"node attacker\"><strong>攻击源 IP：36.21.0.49</strong><small>成都 · SQL注入</small></div>", "<button class=\"node attacker map-click-node\" @click=\"openMapEndpoint('source')\"><strong>攻击源 IP：36.21.0.49</strong><small>成都 · SQL注入</small></button>")
text = text.replace("<div class=\"node target\"><strong>目的 IP：39.110.116.43</strong><small>北京 · 数据模型工具</small></div>", "<button class=\"node target map-click-node\" @click=\"openMapEndpoint('target')\"><strong>目的 IP：39.110.116.43</strong><small>北京 · 数据模型工具</small></button>")
text = text.replace("<div class=\"tag-cloud\"><span>SQL注入</span><span>XSS</span><span>信息泄露</span><span>恶意程序</span><span>端口扫描</span><span>目录遍历</span></div>", "<div class=\"tag-cloud clickable-tags\"><button @click=\"focusAttackType('SQL注入')\">SQL注入</button><button @click=\"focusAttackType('信息泄露')\">信息泄露</button><button @click=\"focusAttackType('未授权访问')\">未授权访问</button><button @click=\"focusAttackType('端口扫描')\">端口扫描</button><button @click=\"focusAttackType('暴力破解')\">暴力破解</button><button @click=\"focusAttackType('违规外联')\">违规外联</button></div>")
text = text.replace("<button v-for=\"scene in scenarios\" :key=\"scene.name\" :class=\"['pill', { active: selectedScenario === scene.name }]\" @click=\"selectedScenario = scene.name\">{{ scene.name }}", "<button v-for=\"scene in scenarios\" :key=\"scene.name\" :class=\"['pill', { active: selectedScenario === scene.name }]\" @click=\"applyScenario(scene.name)\"><span class=\"sub-icon\">{{ iconFor(scene.name) }}</span>{{ scene.name }}")
text = text.replace("<button v-for=\"tag in typeTags\" :key=\"tag\" :class=\"{ active: selectedType === tag }\" @click=\"selectedType = selectedType === tag ? '全部类型' : tag\">{{ tag }}</button>", "<button v-for=\"tag in typeTags\" :key=\"tag\" :class=\"{ active: selectedType === tag }\" @click=\"selectedType = selectedType === tag ? '全部类型' : tag\"><span class=\"sub-icon\">{{ iconFor(tag) }}</span>{{ tag }}</button>")
text = text.replace("<th><input type=\"checkbox\" /></th><th>序号</th><th>源IP</th>", "<th><input type=\"checkbox\" :checked=\"allAlertSelected\" @change=\"toggleAllAlerts\" /></th><th>序号</th><th>源IP</th>")
text = text.replace("<td class=\"ops\"><button @click=\"goTrace(item.id)\">溯源分析</button>", "<td class=\"ops\"><button @click=\"openAlert(item.id)\">详情</button><button @click=\"goTrace(item.id)\">溯源分析</button>")
text = text.replace("<div class=\"filter-card grid-filter\"><label>情报IP <input placeholder=\"请输入IP，多个以逗号分隔\" /></label>", "<div class=\"filter-card grid-filter\"><label>情报IP <input v-model=\"intelligenceQuery\" placeholder=\"请输入IP，多个以逗号分隔\" /></label>")
text = text.replace("<button class=\"blue-button\" @click=\"showToast('已查询威胁情报')\">查找</button><button class=\"white-button\">重置</button>", "<button class=\"blue-button\" @click=\"showToast(`已查询到 ${filteredIntelligence.length} 条威胁情报`)\">查找</button><button class=\"white-button\" @click=\"intelligenceQuery = ''; onlyHit = false; showToast('已重置情报筛选条件')\">重置</button>")
text = text.replace("<td class=\"ops\"><button @click=\"showToast('已打开情报详情')\">查看详情</button><button @click=\"showToast('已删除情报')\">删除情报</button></td>", "<td class=\"ops\"><button @click=\"viewIntelligence(item)\">详情</button><button @click=\"linkIntelligenceAlerts(item)\">关联告警</button><button @click=\"toggleIntelligence(index)\">{{ item.effect === '有效' ? '停用' : '启用' }}</button><button @click=\"deleteIntelligence(index)\">删除</button></td>")
text = text.replace("<button v-for=\"tab in ['攻击过程','资产行为分析','资产关联关系','攻击者画像','流量包分析']\" :key=\"tab\" :class=\"{ active: activeTraceTab === tab }\" @click=\"activeTraceTab = tab as TraceTab\">{{ tab }}</button>", "<button v-for=\"tab in ['攻击过程','资产行为分析','资产关联关系','攻击者画像','流量包分析']\" :key=\"tab\" :class=\"{ active: activeTraceTab === tab }\" @click=\"activeTraceTab = tab as TraceTab; showToast(`已切换溯源子模块：${tab}`)\"><span class=\"sub-icon\">{{ iconFor(tab) }}</span>{{ tab }}</button>")
text = text.replace("<section v-if=\"activePage === 'risk'\" class=\"page-stack\"><div class=\"tab-strip\"><button v-for=\"tab in ['VPC','业务系统','云主机','容器','物理机']\" :key=\"tab\" :class=\"{ active: riskDimension === tab }\" @click=\"riskDimension = tab\">{{ tab }}</button></div><div class=\"risk-grid\"><article v-for=\"row in selectedRiskRows\" :key=\"row.object\" class=\"risk-card\">", "<section v-if=\"activePage === 'risk'\" class=\"page-stack\"><div class=\"tab-strip\"><button v-for=\"tab in ['VPC','业务系统','云主机','容器','物理机']\" :key=\"tab\" :class=\"{ active: riskDimension === tab }\" @click=\"riskDimension = tab; selectedRiskObject = ''; showToast(`已切换风险维度：${tab}`)\"><span class=\"sub-icon\">{{ iconFor(tab) }}</span>{{ tab }}</button></div><div class=\"risk-insight panel\"><strong>{{ selectedRiskRow.object }}</strong><span>高危 {{ selectedRiskRow.high }} · 中危 {{ selectedRiskRow.mid }} · 低危 {{ selectedRiskRow.low }}</span><button class=\"blue-button\" @click=\"traceRisk(selectedRiskRow)\">按该风险生成溯源</button></div><div class=\"risk-grid\"><article v-for=\"row in selectedRiskRows\" :key=\"row.object\" :class=\"['risk-card', { active: selectedRiskRow.object === row.object }]\" @click=\"selectRisk(row)\">")
text = text.replace("<button @click=\"setPage('assets')\">查看资产</button>", "<button @click.stop=\"setPage('assets')\">查看资产</button>")
text = text.replace("<button @click=\"setPage('trace')\">溯源</button><button @click=\"setPage('alerts')\">告警</button>", "<button @click=\"traceRisk(row)\">溯源</button><button @click=\"selectedType = row.last; setPage('alerts')\">告警</button>")
text = text.replace("<button v-for=\"tab in ['region','VPC','物理机','云主机','容器','漏洞管理','弱口令','两高一弱']\" :key=\"tab\" :class=\"{ active: activeAssetTab === tab }\" @click=\"activeAssetTab = tab as AssetTab\">{{ tab }}</button>", "<button v-for=\"tab in ['region','VPC','物理机','云主机','容器','漏洞管理','弱口令','两高一弱']\" :key=\"tab\" :class=\"{ active: activeAssetTab === tab }\" @click=\"activeAssetTab = tab as AssetTab; showToast(`已切换资产子模块：${tab}`)\"><span class=\"sub-icon\">{{ iconFor(tab) }}</span>{{ tab }}</button>")
text = text.replace("<div class=\"toolbar-card\"><div></div><div class=\"toolbar-controls\">", "<div class=\"toolbar-card\"><div><button class=\"blue-button\" @click=\"syncAssets\">同步资产</button><button class=\"white-button\" @click=\"setPage('risk')\">关联风险</button></div><div class=\"toolbar-controls\">")
text = text.replace("<button class=\"blue-button secondary\" @click=\"assetKeyword = ''\">重置筛选</button>", "<button class=\"blue-button secondary\" @click=\"resetAssetFilter\">重置筛选</button>")
text = text.replace("<button @click=\"showToast('已打开资产详情')\">详情</button><button>编辑</button><button>删除</button>", "<button @click=\"openAsset(row)\">详情</button><button @click=\"showToast(`已进入 ${row.name} 编辑态`)\">编辑</button><button @click=\"confirmAction = { title: '删除资产', content: `确认从原型清单中删除 ${row.name}？`, onConfirm: () => showToast('已提交资产删除申请，等待二次审批') }\">删除</button>")
text = text.replace("<button v-for=\"tab in ['规则配置','规则组配置','白名单']\" :key=\"tab\" :class=\"{ active: activeRuleTab === tab }\" @click=\"activeRuleTab = tab as RuleTab\">{{ tab }}</button>", "<button v-for=\"tab in ['规则配置','规则组配置','白名单']\" :key=\"tab\" :class=\"{ active: activeRuleTab === tab }\" @click=\"activeRuleTab = tab as RuleTab; showToast(`已切换业务规则子模块：${tab}`)\"><span class=\"sub-icon\">{{ iconFor(tab) }}</span>{{ tab }}</button>")
text = text.replace("<button class=\"blue-button\">添加自定义类型</button><button class=\"blue-button\">添加自定义规则</button>", "<button class=\"blue-button\" @click=\"openRuleDialog('添加自定义类型')\">添加自定义类型</button><button class=\"blue-button\" @click=\"openRuleDialog('添加自定义规则')\">添加自定义规则</button>")
text = text.replace("<button class=\"green-button\">更新规则</button><button class=\"green-button\">数据导入</button><button class=\"green-button\">数据导出</button>", "<button class=\"green-button\" @click=\"showToast('已更新本地规则库与自定义规则命中统计')\">更新规则</button><button class=\"green-button\" @click=\"showToast('已打开规则导入校验流程')\">数据导入</button><button class=\"green-button\" @click=\"showToast('已导出当前规则与白名单配置')\">数据导出</button>")
text = text.replace("<td class=\"ops\"><button>修改</button><button>删除</button></td>", "<td class=\"ops\"><button @click=\"openRuleDialog(`修改规则 ${row.id}`)\">修改</button><button @click=\"copyRule(index)\">复制</button><button @click=\"deleteRule(index)\">删除</button></td>", 1)
text = text.replace("<button v-for=\"tab in ['邮件通知','邮件列表','邮件服务器配置']\" :key=\"tab\" :class=\"{ active: activeWarningTab === tab }\" @click=\"activeWarningTab = tab as WarningTab\">{{ tab }}</button>", "<button v-for=\"tab in ['邮件通知','邮件列表','邮件服务器配置']\" :key=\"tab\" :class=\"{ active: activeWarningTab === tab }\" @click=\"activeWarningTab = tab as WarningTab; showToast(`已切换威胁预警子模块：${tab}`)\"><span class=\"sub-icon\">{{ iconFor(tab) }}</span>{{ tab }}</button>")
text = text.replace("@click=\"showToast('已测试并提交邮件服务器配置')\"", "@click=\"saveWarningConfig('测试并提交邮件服务器配置')\"")
text = text.replace("@click=\"showToast('已删除邮件服务器配置')\"", "@click=\"confirmAction = { title: '删除邮件服务器配置', content: '确认删除当前 SMTP 配置？删除后威胁预警邮件将暂停发送。', onConfirm: () => saveWarningConfig('删除邮件服务器配置') }\"")

insert_before_toast = """
    <aside v-if="selectedAsset" class="drawer asset-drawer"><button class="drawer-close" @click="selectedAssetId = ''">×</button><h3>资产详情：{{ selectedAsset.name }}</h3><p>{{ selectedAsset.type }} · {{ selectedAsset.region }} · 负责人：{{ selectedAsset.owner }}</p><dl><dt>资产标识</dt><dd>{{ selectedAsset.id }}</dd><dt>网段 / IP</dt><dd>{{ selectedAsset.cidr }}</dd><dt>云主机 / 容器</dt><dd>{{ selectedAsset.hosts }} / {{ selectedAsset.containers }}</dd><dt>风险分</dt><dd><span :class="selectedAsset.risk > 85 ? 'tag danger' : 'tag warning'">{{ selectedAsset.risk }}</span></dd></dl><div class="drawer-actions"><button class="blue-button" @click="activeTraceTab = '资产关联关系'; setPage('trace')">查看拓扑</button><button class="white-button" @click="setPage('risk')">关联风险</button><button class="red-button" @click="showToast(`${selectedAsset.name} 已加入重点监控`)" >重点监控</button></div></aside>

    <div v-if="ruleDialogOpen" class="modal-mask"><div class="modal rule-modal"><button class="drawer-close" @click="ruleDialogOpen = false">×</button><h3>{{ ruleDialogMode }}</h3><label><span>规则名称</span><input placeholder="输入规则名称或规则类型" /></label><label><span>所属规则组</span><select><option>SQL_INJECT</option><option>EAST_WEST</option><option>WEB_API</option></select></label><label><span>威胁等级</span><select><option>高危</option><option>中危</option><option>低危</option></select></label><label><span>条件预览</span><textarea placeholder="示例：src_ip in threat_ioc and uri contains union select"></textarea></label><div class="hint-bar">保存前会进行语法校验、命中预估和规则冲突检查。</div><div class="modal-actions"><button class="white-button" @click="ruleDialogOpen = false">取消</button><button class="blue-button" @click="ruleDialogOpen = false; showToast(`${ruleDialogMode} 已保存，规则处于待发布状态`)">保存草稿</button></div></div></div>

    <div v-if="confirmAction" class="modal-mask"><div class="modal confirm-modal"><h3>{{ confirmAction.title }}</h3><p>{{ confirmAction.content }}</p><div class="modal-actions"><button class="white-button" @click="confirmAction = null">取消</button><button class="red-button" @click="runConfirmAction">确认执行</button></div></div></div>
"""
text = text.replace("\n    <div v-if=\"toastText\" class=\"toast\">{{ toastText }}</div>", insert_before_toast + "\n    <div v-if=\"toastText\" class=\"toast\">{{ toastText }}</div>")

path.write_text(text)
print('App.vue enhanced')
