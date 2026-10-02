# chaosheng

超盛纺配 PICANOL 喷气织机配件产品图鉴

**线上地址：** https://439436269-ctrl.github.io/chaosheng/

## 技术栈

Vite + React 19，无路由的单页站点；静态资源（产品图、画册 PDF 等约 117 MB）放在 `public/assets/`，构建时原样拷贝。

## 本地开发

```bash
npm install
npm run dev      # 开发服务器
npm run build    # 产出 dist/
npm run preview  # 预览构建结果
```

## 目录结构

```
index.html            Vite 入口
src/
  main.jsx            挂载 + 全局样式
  App.jsx             页面组装（含 AI 生成标注）
  i18n.jsx            中英文上下文（useI18n）
  catalog.jsx         产品数据上下文（useCatalog）
  data/
    products.js       601 条产品 + 28 张实拍（由原 assets/products-data.js 转换）
    site.js           新品、分类说明、技术资料、联系方式、画册页数
    i18n.js           中英文案字典
  components/         按页面 section 拆分（Nav/Hero/Products/PdfViewer/...）
  styles/             CSS 按 section 拆分（base/nav/hero/.../pdf/responsive）
public/assets/        静态资源（图片、PDF）
.github/workflows/    GitHub Actions 自动构建并部署到 Pages
```

## 部署

推送 `main` 分支即由 GitHub Actions 自动 `npm ci && npm run build` 并发布到 GitHub Pages（Pages 源需设置为 GitHub Actions）。

## 关键交互

- **全局切换**：仅导航栏右侧「网页目录 / PDF 画册」胶囊切换器（Nav.jsx 的 .nav-vs），任意位置可进入画册；状态在 catalog.jsx 上下文。
- **跨页画册**：01 封面单页、02–37 两两合并（含 36–37）、38 之后单页，全端统一视图。≥900px 两页并排；<900px（手机竖/横屏）同一视图上下堆叠纵向滚动。规则在 src/data/site.js 的 uildSpreadViews()。画册页以 scale=4（2380×3368）自 PDF 重渲染保证 HiDPI 清晰度。
- **加载策略（三档）**：stage 用 srcset 双档 WebP（952px/1488px，按 DPR 自动选，约 50/118KB）秒开；相邻视图待当前加载完再低优先预载、翻页自动取消过期请求；点放大才加载 2380px WebP 原图（约 250KB），慢网显示「高清原图加载中…」徽标；**PDF 模式挂起新品图与二维码**避免与画册抢带宽；入口预载封面中间档。扫描件原生分辨率约 1317px，放大原图经感知锐化（Unsharp Mask）处理，约 2 倍内最清晰。
- **默认 PDF**：打开站点默认进入整页画册；#grid 深链进入网页目录，导航栏胶囊可随时切换。ody.pdf-page 下查看器铺满视口（导航之下），导航固定置顶保持可切换；Esc 或「返回网页目录」退出。
- **后续新品页**：向 src/data/site.js 的 EXTRA_CATALOG_PAGES 数组追加 { title, src } 即自动进入画册尾页。
- 中英切换：右上角按钮，记入 `localStorage.cs_lang`。
