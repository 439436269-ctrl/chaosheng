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

- **全局切换**：导航栏右侧「网页目录 / PDF 画册」胶囊切换器（Nav.jsx 的 .nav-vs），任意位置可进入画册；产品目录标题旁的切换器与之联动（状态在 catalog.jsx 上下文）。
- **跨页画册**：宽屏（≥900px）下 01 封面单页、02–37 两两合并展示跨页产品图、38 之后单页；窄屏自动回落逐页。规则在 src/data/site.js 的 uildSpreadViews()。
- **整页形态**：ody.pdf-page 下查看器铺满视口（导航之下），导航固定置顶保持可切换；Esc 或「返回网页目录」退出；选择记入 localStorage.cs_view 与 URL #pdf。
- **后续新品页**：向 src/data/site.js 的 EXTRA_CATALOG_PAGES 数组追加 { title, src } 即自动进入画册尾页。
- 中英切换：右上角按钮，记入 `localStorage.cs_lang`。
