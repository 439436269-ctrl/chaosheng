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

- 产品目录双形态：「网页目录 / PDF 画册」切换，PDF 态整页铺满视口（`body.pdf-page`），Esc 或「返回网页目录」退出；选择记入 `localStorage.cs_view` 与 URL `#pdf`。
- 中英切换：右上角按钮，记入 `localStorage.cs_lang`。
