# EIT-NLP 实验室主页

宁波东方理工大学自然语言处理课题组（EIT-NLP）实验室官方网站前端项目。页面展示实验室简介、论文、团队成员、新闻动态、科研项目与招聘信息，支持中英文切换。

## 访问地址

| 环境 | 地址 | 说明 |
|------|------|------|
| 本地开发 | http://localhost:3001 | 运行 `npm run dev` 后访问 |
| 测试环境 | http://10.37.0.21:7000/ | 内网服务器部署，用于联调与验收 |
| 正式环境 | https://idt.eitech.edu.cn/nlp/#/ | 对外正式访问地址 |

## 技术栈

- **框架**：Vue 3 + TypeScript + Vite
- **路由**：Vue Router（History 模式）
- **状态**：Pinia
- **样式**：Tailwind CSS v4
- **数据**：Directus REST API（`https://idt.eitech.edu.cn/nlp-api`）

## 项目结构

```
src/
├── api/directus.ts      # Directus 接口封装与资源 URL 处理
├── views/               # 页面：首页、论文、团队、新闻、项目、加入我们
├── components/          # 公共组件（页脚、语言切换等）
├── composables/         # 组合式函数（语言、实验室数据等）
├── utils/               # 翻译字段解析、论文格式化等工具
└── constants/nav.ts     # 导航配置（静态文案）
```

## 配置化说明

本站采用 **Directus CMS** 作为内容后台，页面中的业务字段均通过接口动态拉取，无需改代码即可在后台更新内容。

### 工作原理

1. 前端在页面加载时调用 Directus `/items/{collection}` 接口获取数据。
2. 多语言字段通过 Directus 翻译机制存储，前端按当前语言（`zh` / `en`）读取对应文案。
3. 图片、附件等资源通过 Directus `/assets/{id}` 公开链接展示。

### 主要数据集合

| 集合 | 用途 | 对应页面 |
|------|------|----------|
| `intruduce` | 实验室名称、简介、愿景、统计数据 | 首页 |
| `paper` | 论文列表（标题、作者、链接、封面等） | 首页、论文页 |
| `teamLeaderInfo` | 团队负责人信息 | 团队页 |
| `teamMember` | 团队成员 | 团队页 |
| `news` | 新闻动态 | 首页、新闻页 |
| `project` | 科研项目 | 项目页 |
| `joinus` | 招聘说明、愿景文案 | 加入我们 |
| `jobOpening` | 在招岗位 | 加入我们 |
| `contactUs` | 页脚联系方式、版权、二维码等 | 全站页脚 |

导航菜单等少量固定 UI 文案位于 `src/constants/nav.ts`，其余展示内容均来自 Directus。

## 本地开发

### 环境要求

- Node.js 18+
- npm

### 安装与启动

```bash
npm install
npm run dev
```

本地开发默认访问 http://localhost:3001。API 请求走 Vite 代理 `/nlp-api` → `https://idt.eitech.edu.cn`，避免浏览器跨域问题。

### 环境变量

可在项目根目录创建 `.env.local` 或 `.env.production`：

```env
# API 基础地址（生产/测试部署建议设为 /nlp-api，由 Nginx 反代）
VITE_API_BASE_URL=/nlp-api

# Directus 静态 Token（按需配置，勿提交到公开仓库）
VITE_API_TOKEN=your_token_here
```

| 变量 | 说明 |
|------|------|
| `VITE_API_BASE_URL` | Directus API 地址。开发环境默认 `/nlp-api`；测试/生产建议 `/nlp-api` 同源反代 |
| `VITE_API_TOKEN` | Directus 只读 Token，用于需鉴权的接口 |

## 构建与部署

```bash
npm run build
```

产物输出至 `dist/`，由 Nginx 等静态服务器托管。测试环境示例：

- 静态文件目录：`/var/www/lab-website/dist`
- API 反代：`/nlp-api/` → `https://idt.eitech.edu.cn/nlp-api/`

正式环境部署在 `https://idt.eitech.edu.cn/nlp/` 路径下，需确保 Nginx 配置 `try_files` 以支持 Vue Router History 模式。

## 页面路由

| 路径 | 页面 |
|------|------|
| `/` | 首页 |
| `/publications` | 发表论文 |
| `/team` | 团队介绍 |
| `/news` | 新闻列表 |
| `/news/:id` | 新闻详情 |
| `/projects` | 科研项目 |
| `/join` | 加入我们 |
