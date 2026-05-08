import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const appPath = join(root, 'client/src/App.vue');
const cssPath = join(root, 'client/src/index.css');
let app = readFileSync(appPath, 'utf8');
let css = readFileSync(cssPath, 'utf8');

const replacements = [
  ["const selectedStatus = ref('全部状态');\nconst alertDrawerOpen = ref(false);", "const selectedStatus = ref('全部状态');\nconst activeBehaviorLayer = ref('全部');\nconst alertDrawerOpen = ref(false);"],
  ["{ id: 'FB-9005', time: '2026-05-08 10:09:39', layer: '敏感数据',", "{ id: 'FB-9005', time: '2026-05-08 10:09:39', layer: '敏感数据保护',"],
  ["const filteredIntelligence = computed(() => intelligence.value.filter((item) => {", "const filteredBehaviorEvents = computed(() => behaviorEvents.filter((item) => activeBehaviorLayer.value === '全部' || item.layer === activeBehaviorLayer.value));\n\nconst filteredIntelligence = computed(() => intelligence.value.filter((item) => {"],
  ["@click=\"showToast('已按攻击向量筛选：' + vector)\"", "@click=\"showToast('已按攻击向量联动筛选：' + vector)\""],
  ["<div class=\"table-toolbar\"><div><button class=\"blue-button\" @click=\"showToast('已下发威胁行为检测规则同步任务')\">同步规则</button><button class=\"white-button\" @click=\"showToast('已导出威胁行为事件证据包')\">导出证据</button></div><span class=\"hint-inline\">按运行时证据、资产对象和处置动作串联审计闭环</span></div>", "<div class=\"table-toolbar behavior-toolbar\"><div><button class=\"blue-button\" @click=\"showToast('已下发威胁行为检测规则同步任务')\">同步规则</button><button class=\"white-button\" @click=\"showToast('已导出威胁行为事件证据包')\">导出证据</button></div><div class=\"behavior-layer-tabs\"><button v-for=\"layer in ['全部', '容器安全', '主机安全', '网络威胁', '敏感数据保护']\" :key=\"layer\" class=\"mini\" :class=\"{ active: activeBehaviorLayer === layer }\" @click=\"activeBehaviorLayer = layer\">{{ layer }}</button></div><span class=\"hint-inline\">按运行时证据、资产对象和处置动作串联审计闭环</span></div>"],
  ["<tr v-for=\"event in behaviorEvents\" :key=\"event.id\">", "<tr v-for=\"event in filteredBehaviorEvents\" :key=\"event.id\">"]
];

for (const [from, to] of replacements) {
  if (!app.includes(from)) {
    console.log(`跳过或已应用片段：${from.slice(0, 100)}`);
    continue;
  }
  app = app.replace(from, to);
}

const extraCss = `

/* 威胁行为检测交互增强：层面筛选保持轻量按钮形态，避免破坏现有高密表格操作区。 */
.behavior-toolbar {
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.behavior-layer-tabs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.behavior-layer-tabs .mini.active {
  background: #1f7ae0;
  color: #fff;
  border-color: #1f7ae0;
  box-shadow: 0 8px 16px rgba(31,122,224,0.13);
}
`;

if (!css.includes('威胁行为检测交互增强')) {
  css += extraCss;
}

writeFileSync(appPath, app);
writeFileSync(cssPath, css);
console.log('威胁行为检测层面筛选和交互状态已增强');
