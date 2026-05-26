import type {
  HomeContent,
  JoinContent,
  NewsItem,
  Project,
  Publication,
  TeamGroupMeta,
  TeamMember,
} from '@/types'

export const teamGroups: TeamGroupMeta[] = [
  { key: 'phd', label: { zh: '博士生', en: 'PhD Students' } },
  { key: 'engineer', label: { zh: '工程师', en: 'Engineers' } },
  { key: 'postdoc', label: { zh: '博士后', en: 'Postdoctoral Researchers' } },
  { key: 'assistant', label: { zh: '科研助理', en: 'Research Assistants' } },
  { key: 'advisor', label: { zh: '技术顾问', en: 'Technical Advisors' } },
  { key: 'industry', label: { zh: '产业转化', en: 'Industry Translation' } },
]

export const home: HomeContent = {
  hero: {
    title: {
      zh: '智能交互与具身智能实验室',
      en: 'Intelligent Interaction & Embodied AI Lab',
    },
    tagline: {
      zh: '让机器理解世界，并与人类自然协作',
      en: 'Teaching machines to understand the world and collaborate naturally with humans',
    },
    vision: {
      zh: '我们致力于融合计算机视觉、自然语言处理与机器人学，构建可感知、可推理、可行动的通用智能体，推动人机协同在科研、医疗与工业场景中的落地应用。',
      en: 'We integrate computer vision, natural language processing, and robotics to build agents that perceive, reason, and act—advancing human-machine collaboration in science, healthcare, and industry.',
    },
  },
  intro: {
    title: {
      zh: '实验室简介',
      en: 'About the Lab',
    },
    body: {
      zh: '本实验室成立于 2018 年，隶属于计算机科学与技术学院。团队现有教师 1 名、博士后 2 名、博士生 8 名及硕士生 12 名。研究方向涵盖多模态大模型、具身智能、人机交互与可信 AI。近三年在 NeurIPS、ICML、CVPR、ICRA 等顶级会议发表论文 30 余篇，主持国家自然科学基金重点项目 2 项。',
      en: 'Founded in 2018 within the School of Computer Science, our group includes 1 faculty, 2 postdocs, 8 PhD students, and 12 master’s students. We work on multimodal foundation models, embodied AI, human-computer interaction, and trustworthy AI—with 30+ papers at NeurIPS, ICML, CVPR, and ICRA, and two NSFC key projects in the past three years.',
    },
  },
}

export const publications: Publication[] = [
  {
    id: 'pub-2026-1',
    year: 2026,
    title: {
      zh: 'Ego-Align: 面向具身智能的自我中心多模态对齐',
      en: 'Ego-Align: Egocentric Multimodal Alignment for Embodied Agents',
    },
    authors: {
      zh: '张明, 李思远, 王浩, 陈教授',
      en: 'Ming Zhang, Siyuan Li, Hao Wang, Prof. Chen',
    },
    venue: { zh: 'NeurIPS 2026', en: 'NeurIPS 2026' },
    link: 'https://arxiv.org/abs/2601.00001',
  },
  {
    id: 'pub-2026-2',
    year: 2026,
    title: {
      zh: 'RoboMem: 长时程机器人任务的记忆增强规划',
      en: 'RoboMem: Memory-Augmented Planning for Long-Horizon Robotics',
    },
    authors: {
      zh: '刘洋, 赵婷, 陈教授',
      en: 'Yang Liu, Ting Zhao, Prof. Chen',
    },
    venue: { zh: 'ICRA 2026', en: 'ICRA 2026' },
    link: 'https://arxiv.org/abs/2601.00002',
  },
  {
    id: 'pub-2025-1',
    year: 2025,
    title: {
      zh: 'TrustVLM: 视觉语言模型的不确定性校准与可信推理',
      en: 'TrustVLM: Uncertainty Calibration and Trustworthy Reasoning in VLMs',
    },
    authors: {
      zh: '王浩, 孙悦, 陈教授',
      en: 'Hao Wang, Yue Sun, Prof. Chen',
    },
    venue: { zh: 'ICML 2025', en: 'ICML 2025' },
    link: 'https://arxiv.org/abs/2506.10001',
  },
  {
    id: 'pub-2025-2',
    year: 2025,
    title: {
      zh: 'HRI-Bench: 人机协作场景的大规模评测基准',
      en: 'HRI-Bench: A Large-Scale Benchmark for Human-Robot Collaboration',
    },
    authors: {
      zh: '李思远, 周凯, 张明, 陈教授',
      en: 'Siyuan Li, Kai Zhou, Ming Zhang, Prof. Chen',
    },
    venue: { zh: 'CVPR 2025', en: 'CVPR 2025' },
    link: 'https://arxiv.org/abs/2503.20002',
  },
  {
    id: 'pub-2025-3',
    year: 2025,
    title: {
      zh: 'DexGrasp: 基于扩散策略的灵巧手抓取泛化',
      en: 'DexGrasp: Diffusion Policies for Generalized Dexterous Grasping',
    },
    authors: {
      zh: '赵婷, 刘洋, 陈教授',
      en: 'Ting Zhao, Yang Liu, Prof. Chen',
    },
    venue: { zh: 'RSS 2025', en: 'RSS 2025' },
    link: 'https://arxiv.org/abs/2505.30003',
  },
  {
    id: 'pub-2025-4',
    year: 2025,
    title: {
      zh: 'MedAssist: 多模态大模型驱动的临床决策支持系统',
      en: 'MedAssist: Multimodal LLMs for Clinical Decision Support',
    },
    authors: {
      zh: '孙悦, 王浩, 陈教授',
      en: 'Yue Sun, Hao Wang, Prof. Chen',
    },
    venue: { zh: 'Nature Machine Intelligence', en: 'Nature Machine Intelligence' },
    link: 'https://doi.org/10.1038/example-medassist',
  },
  {
    id: 'pub-2024-1',
    year: 2024,
    title: {
      zh: 'SceneGraph-LLM: 场景图引导的开放世界视觉问答',
      en: 'SceneGraph-LLM: Scene Graph Guided Open-Vocabulary VQA',
    },
    authors: {
      zh: '张明, 李思远, 陈教授',
      en: 'Ming Zhang, Siyuan Li, Prof. Chen',
    },
    venue: { zh: 'NeurIPS 2024', en: 'NeurIPS 2024' },
    link: 'https://arxiv.org/abs/2412.10001',
  },
  {
    id: 'pub-2024-2',
    year: 2024,
    title: {
      zh: 'Sim2Real-Nav: 仿真到真实的室内机器人导航迁移',
      en: 'Sim2Real-Nav: Sim-to-Real Transfer for Indoor Robot Navigation',
    },
    authors: {
      zh: '周凯, 赵婷, 陈教授',
      en: 'Kai Zhou, Ting Zhao, Prof. Chen',
    },
    venue: { zh: 'ICRA 2024', en: 'ICRA 2024' },
    link: 'https://arxiv.org/abs/2404.20002',
  },
  {
    id: 'pub-2023-1',
    year: 2023,
    title: {
      zh: 'CoDialog: 面向协作任务的多智能体对话框架',
      en: 'CoDialog: A Multi-Agent Dialogue Framework for Collaborative Tasks',
    },
    authors: {
      zh: '刘洋, 孙悦, 陈教授',
      en: 'Yang Liu, Yue Sun, Prof. Chen',
    },
    venue: { zh: 'ACL 2023', en: 'ACL 2023' },
    link: 'https://arxiv.org/abs/2306.30001',
  },
]

export const news: NewsItem[] = [
  {
    id: 'news-1',
    date: '2026-03-15',
    title: {
      zh: '实验室开放日圆满举办，百余名师生参观体验',
      en: 'Lab Open Day Draws 100+ Visitors for Hands-On Demos',
    },
    summary: {
      zh: '3 月 15 日，本实验室举办年度开放日活动，展示具身智能与人机协作最新成果。',
      en: 'On March 15, we hosted our annual open day showcasing embodied AI and human-robot collaboration.',
    },
    content: {
      zh: `3 月 15 日上午，智能交互与具身智能实验室在信息楼一楼大厅举办 2026 年度开放日活动。活动吸引了来自本校及其他高校的 120 余名师生参与。

活动现场设置了四大展区：多模态大模型演示区、灵巧操作机器人体验区、人机协作 VR 沙盘，以及学生科研成果海报墙。参观者可以亲自操控机械臂完成抓取任务，体验基于视觉语言模型的场景问答系统。

实验室负责人陈教授在开幕致辞中表示："我们希望开放日不仅是一次成果展示，更是激发青年学子投身 AI 与机器人研究的契机。"

下午的分组讲解中，博士生们分别介绍了在 NeurIPS、ICRA 等会议上的最新工作。许多本科生表示，通过此次活动对科研训练有了更直观的认识。

活动尾声，实验室宣布将于今年 summer 启动本科生科研实习计划，欢迎对具身智能感兴趣的同学关注官网动态。`,
      en: `On the morning of March 15, the Intelligent Interaction & Embodied AI Lab held its 2026 Open Day in the atrium of the Information Building, welcoming over 120 students and faculty from our university and partner institutions.

Four exhibition zones were featured: multimodal foundation model demos, dexterous manipulation robot trials, a human-robot collaboration VR sandbox, and a poster gallery of student research.

Principal Investigator Prof. Chen noted in the opening remarks: "We hope Open Day is not only a showcase, but an invitation for young talents to explore AI and robotics research."

In the afternoon breakout sessions, PhD students presented recent NeurIPS and ICRA work. Many undergraduates said the event gave them a concrete picture of graduate research training.

The lab announced a summer undergraduate research internship program; interested students are encouraged to follow updates on our website.`,
    },
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=450&fit=crop',
  },
  {
    id: 'news-2',
    date: '2026-02-20',
    title: {
      zh: '两篇论文被 NeurIPS 2026 接收',
      en: 'Two Papers Accepted to NeurIPS 2026',
    },
    summary: {
      zh: 'Ego-Align 与 RoboMem 工作双双中稿，创实验室历史新高。',
      en: 'Ego-Align and RoboMem are both accepted—a record year for the lab.',
    },
    content: {
      zh: `近日，本实验室 Ego-Align 与 RoboMem 两篇论文被 NeurIPS 2026 正式接收，创下组内单次投稿周期的最好成绩。

Ego-Align 工作提出面向具身智能体的自我中心多模态对齐框架，在真实家庭场景中显著提升了指令跟随成功率。RoboMem 则聚焦长时程机器人任务，通过记忆增强规划在 50+ 步任务中保持稳定表现。

实验室将于论文公开后发布代码与模型权重，欢迎同行关注与引用。`,
      en: `Our papers Ego-Align and RoboMem have been accepted to NeurIPS 2026—a record result for the group in a single submission cycle.

Ego-Align introduces an egocentric multimodal alignment framework for embodied agents, improving instruction-following in real home environments. RoboMem targets long-horizon robotics with memory-augmented planning stable over 50+ step tasks.

We will release code and model weights upon publication. Citations and follow-up collaborations are welcome.`,
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
  },
  {
    id: 'news-3',
    date: '2026-01-08',
    title: {
      zh: '与某三甲医院签署医工交叉合作备忘录',
      en: 'MOU Signed with Leading Hospital for Med-AI Collaboration',
    },
    summary: {
      zh: '双方将围绕 MedAssist 系统开展临床验证与数据共建。',
      en: 'Partners will co-validate MedAssist and build clinical datasets together.',
    },
    content: {
      zh: `本实验室与某三甲医院正式签署医工交叉合作备忘录，将围绕 MedAssist 临床决策支持系统开展联合研究。

合作内容包括：临床场景需求梳理、脱敏数据共建、前瞻性验证试验以及医生在环（human-in-the-loop）评估流程设计。双方期望在未来三年内完成多中心试点，并探索成果转化路径。

该合作是实验室「AI for Science & Health」方向的重要布局，欢迎对相关课题感兴趣的研究生与博士后加入。`,
      en: `We signed an MOU with a leading tertiary hospital to advance MedAssist, our clinical decision-support system.

The partnership covers clinical needs analysis, de-identified dataset co-development, prospective validation trials, and human-in-the-loop evaluation workflows. Both sides aim for multi-site pilots within three years and a path toward translation.

This collaboration anchors our "AI for Science & Health" thrust—we welcome graduate students and postdocs interested in related topics.`,
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
  },
  {
    id: 'news-4',
    date: '2025-11-22',
    title: {
      zh: '博士生张明荣获国家奖学金',
      en: 'PhD Student Ming Zhang Wins National Scholarship',
    },
    summary: {
      zh: '表彰其在具身智能方向的突出科研贡献。',
      en: 'Recognized for outstanding research in embodied intelligence.',
    },
    content: {
      zh: `祝贺本实验室博士研究生张明荣获 2025 年度国家奖学金。

张明同学自 2022 年入学以来，在具身多模态对齐方向发表 NeurIPS、ICRA 论文各 1 篇，并主导开源数据集 EgoBench 的构建与维护，累计 GitHub Star 超过 800。

导师陈志远教授表示："张明同学工作扎实、乐于协作，是实验室青年学子的优秀代表。"`,
      en: `Congratulations to PhD student Ming Zhang on receiving the 2025 National Scholarship.

Since joining in 2022, Ming has published at NeurIPS and ICRA on embodied multimodal alignment and leads the EgoBench open-source dataset (800+ GitHub stars).

PI Prof. Chen noted: "Ming is rigorous, collaborative, and an excellent role model for junior members."`,
    },
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=450&fit=crop',
  },
  {
    id: 'news-5',
    date: '2025-09-10',
    title: {
      zh: '实验室获 NSF 重点项目资助',
      en: 'Lab Awarded NSFC Key Project Grant',
    },
    summary: {
      zh: '项目聚焦可信多模态大模型在高风险场景中的应用。',
      en: 'The project targets trustworthy multimodal models in high-stakes settings.',
    },
    content: {
      zh: `本实验室申报的「可信多模态大模型在高风险场景中的理论方法与应用」获国家自然科学基金重点项目资助，执行期四年。

项目将围绕不确定性量化、可解释推理与人在环安全机制展开，结合 MedAssist 与 TrustVLM 等既有平台进行验证。实验室计划据此扩建 GPU 集群并招收 2–3 名博士生。

感谢合作单位与评审专家的支持，我们将持续产出高水平成果并培养青年人才。`,
      en: `Our project on trustworthy multimodal foundation models in high-stakes settings has been funded as an NSFC Key Project (four-year term).

The work focuses on uncertainty quantification, interpretable reasoning, and human-in-the-loop safety, validated on platforms including MedAssist and TrustVLM. We will expand our GPU cluster and recruit 2–3 PhD students.

We thank partners and reviewers and remain committed to top-tier research and training young talent.`,
    },
    image: 'https://images.unsplash.com/photo-1507413245164-6161d3ddad31?w=800&h=450&fit=crop',
  },
]

export const team: TeamMember[] = [
  {
    id: 'pi-chen',
    isPI: true,
    name: { zh: '陈志远', en: 'Zhiyuan Chen' },
    role: { zh: '教授、实验室负责人', en: 'Professor, Lab Director' },
    research: {
      zh: '多模态大模型、具身智能、人机协作',
      en: 'Multimodal foundation models, embodied AI, human-robot collaboration',
    },
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    bio: {
      zh: '陈志远教授，博士生导师。清华大学计算机博士，MIT 博士后。长期从事视觉语言模型与机器人学习研究，发表论文 80 余篇，Google Scholar 引用 12,000+。担任 NeurIPS、ICML Area Chair，IEEE T-RO  Associate Editor。',
      en: 'Prof. Zhiyuan Chen received his Ph.D. from Tsinghua and was a postdoc at MIT. He works on vision-language models and robot learning (80+ papers, 12,000+ citations). He serves as Area Chair for NeurIPS/ICML and Associate Editor for IEEE T-RO.',
    },
    experience: {
      zh: '2010–2014 清华大学 学士 | 2014–2019 清华大学 博士 | 2019–2021 MIT 博士后 | 2021–至今 本校教授',
      en: '2010–2014 B.S., Tsinghua | 2014–2019 Ph.D., Tsinghua | 2019–2021 Postdoc, MIT | 2021–present Professor',
    },
  },
  {
    id: 'member-1',
    group: 'phd',
    name: { zh: '张明', en: 'Ming Zhang' },
    role: { zh: '博士研究生（四年级）', en: 'PhD Student (Year 4)' },
    research: {
      zh: '自我中心视觉、具身多模态对齐',
      en: 'Egocentric vision, embodied multimodal alignment',
    },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    id: 'member-2',
    group: 'phd',
    name: { zh: '李思远', en: 'Siyuan Li' },
    role: { zh: '博士研究生（三年级）', en: 'PhD Student (Year 3)' },
    research: {
      zh: '人机协作、视觉语言推理',
      en: 'Human-robot collaboration, vision-language reasoning',
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  },
  {
    id: 'member-4',
    group: 'phd',
    name: { zh: '赵婷', en: 'Ting Zhao' },
    role: { zh: '博士研究生（二年级）', en: 'PhD Student (Year 2)' },
    research: {
      zh: '灵巧操作、扩散策略',
      en: 'Dexterous manipulation, diffusion policies',
    },
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
  {
    id: 'member-eng-1',
    group: 'engineer',
    name: { zh: '周建国', en: 'Jianguo Zhou' },
    role: { zh: '高级系统工程师', en: 'Senior Systems Engineer' },
    research: {
      zh: 'ROS2 架构、仿真集群与实验平台运维',
      en: 'ROS2 architecture, simulation clusters, and lab infrastructure',
    },
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  },
  {
    id: 'member-eng-2',
    group: 'engineer',
    name: { zh: '陈晓雯', en: 'Xiaowen Chen' },
    role: { zh: '机器学习工程师', en: 'ML Engineer' },
    research: {
      zh: '大模型训练流水线、推理加速与 MLOps',
      en: 'LLM training pipelines, inference optimization, and MLOps',
    },
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
  },
  {
    id: 'member-3',
    group: 'postdoc',
    name: { zh: '王浩', en: 'Hao Wang' },
    role: { zh: '博士后研究员', en: 'Postdoctoral Researcher' },
    research: {
      zh: '可信 AI、视觉语言模型校准',
      en: 'Trustworthy AI, VLM calibration',
    },
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
  },
  {
    id: 'member-postdoc-2',
    group: 'postdoc',
    name: { zh: '林若溪', en: 'Ruoxi Lin' },
    role: { zh: '博士后研究员', en: 'Postdoctoral Researcher' },
    research: {
      zh: '多模态对齐、具身智能体评测',
      en: 'Multimodal alignment and embodied agent evaluation',
    },
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
  },
  {
    id: 'member-5',
    group: 'assistant',
    name: { zh: '刘洋', en: 'Yang Liu' },
    role: { zh: '科研助理', en: 'Research Assistant' },
    research: {
      zh: '机器人规划、仿真到真实迁移',
      en: 'Robot planning, sim-to-real transfer',
    },
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
  {
    id: 'member-assistant-2',
    group: 'assistant',
    name: { zh: '孙佳怡', en: 'Jiayi Sun' },
    role: { zh: '科研助理（本科）', en: 'Undergraduate Research Assistant' },
    research: {
      zh: '数据标注、实验复现与基准测试',
      en: 'Data annotation, experiment reproduction, and benchmarking',
    },
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: 'member-advisor-1',
    group: 'advisor',
    name: { zh: '黄伟', en: 'Wei Huang' },
    role: { zh: '技术顾问', en: 'Technical Advisor' },
    research: {
      zh: '大模型安全、对齐与产业落地策略',
      en: 'LLM safety, alignment, and industry deployment strategy',
    },
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&sat=-100',
  },
  {
    id: 'member-industry-1',
    group: 'industry',
    name: { zh: '马超', en: 'Chao Ma' },
    role: { zh: '产业转化负责人', en: 'Industry Translation Lead' },
    research: {
      zh: '技术转移、产学研合作与初创孵化',
      en: 'Tech transfer, industry-academia partnerships, and startup incubation',
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&sat=-50',
  },
]

export const projects: Project[] = [
  {
    id: 'proj-featured',
    isFeatured: true,
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: {
      zh: 'EgoBot：通用具身智能体平台',
      en: 'EgoBot: A General-Purpose Embodied Agent Platform',
    },
    description: {
      zh: 'EgoBot 整合自我中心视觉、语言规划与双臂操作，可在家庭与实验室环境中完成物品整理、工具使用等长时程任务。演示视频展示机器人在未知场景中自主探索并完成多步骤指令。',
      en: 'EgoBot combines egocentric vision, language planning, and dual-arm manipulation for long-horizon tasks such as tidying and tool use. The demo shows autonomous exploration and multi-step instruction following in novel environments.',
    },
  },
  {
    id: 'proj-2',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop',
    title: {
      zh: 'HRI-Sim：人机协作仿真环境',
      en: 'HRI-Sim: Human-Robot Collaboration Simulator',
    },
    description: {
      zh: '基于 Unity 与 Isaac Sim 构建的高保真仿真平台，支持多人类角色与机器人协作任务的数据生成与策略训练，已服务于 HRI-Bench 基准构建。',
      en: 'A high-fidelity simulator built on Unity and Isaac Sim for generating data and training policies on collaborative tasks—powering the HRI-Bench benchmark.',
    },
  },
  {
    id: 'proj-3',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=500&fit=crop',
    title: {
      zh: 'MedAssist 临床原型',
      en: 'MedAssist Clinical Prototype',
    },
    description: {
      zh: '与医院合作开发的决策支持原型，可基于电子病历与医学影像生成结构化诊疗建议，并通过不确定性估计提示人工复核环节。',
      en: 'A hospital co-developed decision-support prototype that produces structured recommendations from EHRs and imaging, with uncertainty estimates flagging cases for human review.',
    },
  },
  {
    id: 'proj-4',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
    title: {
      zh: 'TrustVLM 可解释性工具包',
      en: 'TrustVLM Interpretability Toolkit',
    },
    description: {
      zh: '面向视觉语言模型的开源工具包，提供注意力可视化、校准曲线与反事实解释模块，帮助研究者诊断模型在 OOD 场景下的失败模式。',
      en: 'An open-source toolkit for VLMs with attention visualization, calibration plots, and counterfactual explanations to diagnose failures under distribution shift.',
    },
  },
]

export const join: JoinContent = {
  vision: {
    zh: '我们寻找对 AI 与机器人充满热情、乐于交叉探索的研究者。实验室提供开放的学术氛围、充足的计算资源与国际合作机会，支持成员在顶级会议发表成果并走向学术界或产业界的核心岗位。',
    en: 'We welcome researchers passionate about AI and robotics and eager to work across disciplines. The lab offers an open culture, ample compute, international collaborations, and support to publish at top venues and pursue careers in academia or industry.',
  },
  contactEmail: 'join@iilab.example.edu',
  positions: [
    {
      id: 'pos-postdoc',
      title: { zh: '博士后研究员', en: 'Postdoctoral Researcher' },
      type: { zh: '全职 · 2 年（可续聘）', en: 'Full-time · 2 years (renewable)' },
      research: {
        zh: '具身智能、多模态大模型或人机协作方向',
        en: 'Embodied AI, multimodal foundation models, or human-robot collaboration',
      },
      requirements: [
        {
          zh: '计算机、自动化或相关专业博士学位，35 周岁以下',
          en: 'Ph.D. in CS, robotics, or related fields; under 35 years of age',
        },
        {
          zh: '以第一作者在 NeurIPS / ICML / CVPR / ICRA 等会议或期刊发表论文至少 2 篇',
          en: 'At least two first-author papers in NeurIPS, ICML, CVPR, ICRA, or equivalent venues',
        },
        {
          zh: '具备 PyTorch 与机器人中间件（ROS2）实践经验',
          en: 'Strong hands-on experience with PyTorch and robot middleware (ROS2)',
        },
      ],
    },
    {
      id: 'pos-phd',
      title: { zh: '博士研究生', en: 'PhD Students' },
      type: { zh: '全日制 · 2026 秋季入学', en: 'Full-time · Fall 2026 intake' },
      research: {
        zh: '多模态学习、机器人学习、可信 AI 等实验室主研方向',
        en: 'Multimodal learning, robot learning, trustworthy AI, and related themes',
      },
      requirements: [
        {
          zh: '国内外知名高校硕士或优秀本科毕业生',
          en: 'Master’s or outstanding bachelor’s degree from a recognized university',
        },
        {
          zh: '扎实的机器学习与编程基础，有顶会论文或开源项目者优先',
          en: 'Solid ML and programming skills; top-venue papers or notable open-source work preferred',
        },
        {
          zh: '对科研有长期投入意愿，具备良好的英文读写能力',
          en: 'Long-term commitment to research and strong English reading/writing skills',
        },
      ],
    },
    {
      id: 'pos-intern',
      title: { zh: '科研实习生', en: 'Research Interns' },
      type: { zh: '暑期 / 学期内 · 远程或线下', en: 'Summer or semester · On-site or remote' },
      research: {
        zh: '协助开展实验、数据处理与论文复现，可参与投稿',
        en: 'Assist with experiments, data pipelines, and paper reproduction; co-authorship possible',
      },
      requirements: [
        {
          zh: '本科大三及以上或研究生在读，每周可投入不少于 20 小时',
          en: 'Junior undergraduate or graduate student with 20+ hours per week available',
        },
        {
          zh: '熟悉 Python 与深度学习框架，有科研或竞赛经历者优先',
          en: 'Proficiency in Python and deep learning frameworks; research or competition experience preferred',
        },
        {
          zh: '实习期不少于 3 个月，表现优秀者可推荐攻读本组研究生',
          en: 'Minimum 3-month internship; outstanding performers may receive PhD recommendations',
        },
      ],
    },
  ],
  applicationGuide: {
    title: { zh: '投递指南', en: 'Application Guide' },
    intro: {
      zh: '欢迎有志于 AI 与机器人研究的学者加入。请按以下步骤准备材料，并在邮件标题注明申请岗位。',
      en: 'We welcome applicants passionate about AI and robotics. Follow the steps below and indicate the position in your email subject line.',
    },
    steps: [
      {
        title: { zh: '确认岗位与方向', en: 'Choose a position & focus' },
        description: {
          zh: '仔细阅读招聘岗位说明，确认您的背景与实验室主研方向（多模态、具身智能、人机协作等）契合。',
          en: 'Review open positions and ensure your background aligns with our themes: multimodal AI, embodied intelligence, and HRI.',
        },
      },
      {
        title: { zh: '准备申请材料', en: 'Prepare your materials' },
        description: {
          zh: '包括个人简历、研究陈述（1–2 页）、代表性论文或项目链接、成绩单（学生）及 2 封推荐信（博士后/博士申请）。',
          en: 'Include your CV, a 1–2 page research statement, representative papers or projects, transcripts (students), and two reference letters (postdoc/PhD).',
        },
      },
      {
        title: { zh: '发送申请邮件', en: 'Submit via email' },
        description: {
          zh: '将材料合并为 PDF（建议 < 15MB）发送至实验室邮箱，标题格式：[申请岗位] 姓名 - 学校/单位。',
          en: 'Send PDFs (< 15MB recommended) to our lab email with subject: [Position] Your Name - Institution.',
        },
      },
      {
        title: { zh: '等待回复与面试', en: 'Review & interview' },
        description: {
          zh: '我们将在 2 周内回复初筛结果；通过者将安排线上/线下面试与课题组交流。',
          en: 'Initial decisions within two weeks; shortlisted candidates are invited to online or on-site interviews.',
        },
      },
    ],
    tips: [
      {
        zh: '研究陈述请突出您与实验室方向的结合点，避免泛泛而谈。',
        en: 'Highlight how your interests connect to our research—avoid generic statements.',
      },
      {
        zh: '博士后申请请注明预计入职时间与代表作说明。',
        en: 'Postdoc applicants should state expected start date and clarify authorship on key papers.',
      },
      {
        zh: '实习生申请可附 GitHub 或 Kaggle 链接，展示编程与实验能力。',
        en: 'Intern applicants may include GitHub or Kaggle links demonstrating coding and experiments.',
      },
    ],
  },
}
