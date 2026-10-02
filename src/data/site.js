// 站点内容数据：新品、分类说明、技术资料、企业信息
// 从原 index.html 迁移，集中一处便于维护

// 2026.09 全部新品（19 张，已水印）
export const NEW_ARRIVALS = [
  { code: 'NEW-2026-01', name: '蓝色导轮', part: '—', img: 'assets/products/new2026_01.jpg' },
  { code: 'NEW-2026-02', name: '垫片', part: '900.2149', img: 'assets/products/new2026_02.jpg' },
  { code: 'NEW-2026-03', name: '剪刀支架', part: '—', img: 'assets/products/new2026_03.jpg' },
  { code: 'NEW-2026-04', name: '剪刀支架', part: '—', img: 'assets/products/new2026_04.jpg' },
  { code: 'NEW-2026-05', name: '齿轮', part: '31-1444', img: 'assets/products/new2026_05.jpg' },
  { code: 'NEW-2026-06', name: '气接头', part: '31.1307', img: 'assets/products/new2026_06.jpg' },
  { code: 'NEW-2026-07', name: '剪刀支架', part: '—', img: 'assets/products/new2026_07.jpg' },
  { code: 'NEW-2026-08', name: '气管', part: '31.1208.001', img: 'assets/products/new2026_08.jpg' },
  { code: 'NEW-2026-09', name: '剪刀支架', part: '—', img: 'assets/products/new2026_09.jpg' },
  { code: 'NEW-2026-10', name: '蓝色壳体', part: '31-1448', img: 'assets/products/new2026_10.jpg' },
  { code: 'NEW-2026-11', name: '蓝色壳体', part: '31-1448', img: 'assets/products/new2026_11.jpg' },
  { code: 'NEW-2026-12', name: '散热片', part: '31.1253', img: 'assets/products/new2026_12.jpg' },
  { code: 'NEW-2026-13', name: '绕纱传感器', part: '31.1469', img: 'assets/products/new2026_13.jpg' },
  { code: 'NEW-2026-14', name: '前盖', part: '31.1281', img: 'assets/products/new2026_14.jpg' },
  { code: 'NEW-2026-15', name: '磁环密封垫', part: '31.1552', img: 'assets/products/new2026_15.jpg' },
  { code: 'NEW-2026-16', name: '磁环密封垫', part: '31.1551', img: 'assets/products/new2026_16.jpg' },
  { code: 'NEW-2026-17', name: '卷取体密封垫', part: '31.1487', img: 'assets/products/new2026_17.jpg' },
  { code: 'NEW-2026-18', name: '磁环指', part: '31.1040', img: 'assets/products/new2026_18.jpg' },
  { code: 'NEW-2026-19', name: '黄色绕纱盘', part: '31-1417', img: 'assets/products/new2026_19.jpg' },
];

// 分类展示顺序（原 rebuildCats 的 order）
export const CAT_ORDER = [
  '全部', '传动齿轮', '绞边装置', '传感器与紧固', '离合器', '导板棕框', '卷布辊',
  '剪切组件', '气动气管', '储纬器', '引纬喷气', '其他配件',
];

export const CAT_DESC = {
  '传动齿轮': '形星齿轮、罩壳、轴承与同步带等传动单元，覆盖 PLUS / OMNI 等主力机型。',
  '绞边装置': '绞边架、绞边筒子与总成，适配 PICANOL、丰田、津田驹、舒美特。',
  '传感器与紧固': '传感器、传感架、弹簧片与通用紧固件，现场维保常用件。',
  '离合器': '八角夹座、十字块、油泵离合器与缓冲件，国产化替代重点品类。',
  '导板棕框': '多槽导板、棕框连接片与提综相关导件，稳定开口与引纬路径。',
  '卷布辊': '压块、压脚、手柄与轴套，卷取张力关键配件。',
  '剪切组件': '剪刀支架、机剪、夹片与轴承，纬纱剪切系统配件。',
  '气动气管': '快速接头、气管连接器、薄膜片与调压阀，喷气引纬气路件。',
  '储纬器': '绕纱盘、张力器、夹丝器等储纬系统配件。',
  '引纬喷气': '主喷、导纱、定径等引纬相关配件。',
  '其他配件': '未归类配件，欢迎按名称或件号询盘。',
};

export const DOCS = [
  {
    id: 'cat2020',
    type: '产品画册',
    title: '余姚市超盛纺织配件厂 产品画册（2020.03）',
    meta: 'PICANOL 喷气织机配件全册 · 约 25 MB',
    href: 'assets/docs/catalog-2020.pdf',
    preview: true,
  },
  {
    id: 'cw2024',
    type: '储纬器说明书',
    title: '储纬器 2231 X2 / 1131 X2 / Blue_22 / Chrono X3',
    meta: '2024.9.15 · 含 CAN PFT 等机型',
    href: 'assets/docs/pdf/chuweiqi-2231-2024.pdf',
    preview: true,
  },
  {
    id: 'cw2020',
    type: '储纬器说明书',
    title: '储纬器 2231 X2 / 1131 X2 / Blue_22',
    meta: '2020-04-03 版本',
    href: 'assets/docs/pdf/chuweiqi-2231-2020.pdf',
    preview: true,
  },
  {
    id: 'chrono',
    type: '电气/参数',
    title: 'Chrono X3 170V（18.12）',
    meta: '约 4.1 MB',
    href: 'assets/docs/pdf/chrono-x3-170v.pdf',
    preview: true,
  },
  {
    id: 'exp',
    type: '技术图纸',
    title: 'EXP-2231-CAN-plus-PFT',
    meta: '31-8916-0201-02 · 约 350 KB',
    href: 'assets/docs/pdf/exp-2231can-plus-pft.pdf',
    preview: true,
  },
  {
    id: 'spl',
    type: '技术图纸',
    title: 'SPL-2231-CAN-plus-PFT',
    meta: '31-8926-0201-05 · 约 66 KB',
    href: 'assets/docs/pdf/spl-2231-can-plus-pft.pdf',
    preview: true,
  },
];

// PDF 画册：基础 41 页，后续新品页按顺序追加即可（图片放 assets/docs/catalog/）
// 例：{ title: '新品推荐 2026.10', src: 'assets/docs/catalog/new_2026_10.jpg' }
export const CATALOG_BASE_PAGES = 41;
export const EXTRA_CATALOG_PAGES = [];
export const CATALOG_PAGES = CATALOG_BASE_PAGES + EXTRA_CATALOG_PAGES.length;

export function catalogPageSrc(n) {
  if (n <= CATALOG_BASE_PAGES) {
    return 'assets/docs/catalog/page_' + (n < 10 ? '0' + n : n) + '.jpg';
  }
  const extra = EXTRA_CATALOG_PAGES[n - CATALOG_BASE_PAGES - 1];
  return extra ? extra.src : '';
}

// 跨页规则（2026-10 确认）：01 封面单页，02–37 两两合并，38 之后单页
export function buildSpreadViews() {
  const spreadEnd = Math.min(37, CATALOG_PAGES);
  const views = [[1]];
  for (let p = 2; p + 1 <= spreadEnd; p += 2) views.push([p, p + 1]);
  for (let p = spreadEnd + 1; p <= CATALOG_PAGES; p++) views.push([p]);
  return views;
}

// 窄屏回落：逐页展示
export function buildSingleViews() {
  return Array.from({ length: CATALOG_PAGES }, (_, i) => [i + 1]);
}

export const CONTACT = {
  tel: '0574-62561851',
  mobile: '13605846068',
  fax: '0574-62585126',
  qq: '793803503',
  email: 'lhj@cnool.net',
  addrZh: '浙江省余姚市梨洲街道黄箭山新吕家16A',
  addrEn: 'No.16 Xinlvjia Huangjianshan Lizhou St., Yuyao, Zhejiang, China',
};
