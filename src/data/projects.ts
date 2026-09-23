import { Project } from '../types/project';

/**
 * Projects Configuration Data
 * 
 * Order: 4 -> 3 -> 1 -> 2
 * 1: CityWalk Agent (Agent)
 * 2: Context Lab (Contest / Context Lab)
 * 3: Movie Taste → Cocktail Skill (Skill)
 * 4: Digital Polaroid (Polaroid)
 * 
 * Titles describe the actual visual module and are kept short for the gear UI.
 */
export const PROJECTS_DATA: Project[] = [
  // 01. CityWalk Agent
  {
    id: 'citywalk',
    nameZh: '城市漫游规划助手',
    nameEn: 'RoutE:',
    category: 'Agentic Mobile Service',
    description: '持续理解用户意图，自主决策并动态调整路线',
    liveUrl: 'https://route.kikochen77.chatgpt.site',
    story: [
      {
        id: 'citywalk-story-route-overview',
        type: 'image',
        src: '/assets/projects/citywalk/story/route-overview.png',
        title: '最终路线规划结果总览',
        groupId: 'pathink-route-overview',
        groupTitle: '最终路线规划结果总览',
        caption: '全局规划',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
      {
        id: 'citywalk-story-route-detail',
        type: 'image',
        src: '/assets/projects/citywalk/story/route-timeline.png',
        title: '最终路线规划结果总览',
        groupId: 'pathink-route-overview',
        groupTitle: '最终路线规划结果总览',
        caption: '逐站细节',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
      {
        id: 'citywalk-story-anchor-discovery',
        type: 'image',
        src: '/assets/projects/citywalk/story/location-suggestions.png',
        title: '锚点驱动周边体验扩展',
        groupTitle: '锚点驱动周边体验扩展',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
      {
        id: 'citywalk-story-search-intent',
        type: 'image',
        src: '/assets/projects/citywalk/story/preference-refinement-1.png',
        title: '自然语言转译地点检索',
        groupId: 'pathink-search-intent',
        groupTitle: '自然语言转译地点检索',
        caption: '明确品类需求→逐级细化',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
      {
        id: 'citywalk-story-search-scenario',
        type: 'image',
        src: '/assets/projects/citywalk/story/preference-refinement-2.png',
        title: '自然语言转译地点检索',
        groupId: 'pathink-search-intent',
        groupTitle: '自然语言转译地点检索',
        caption: '模糊情绪场景→需求推演',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
      {
        id: 'citywalk-story-route-replanning',
        type: 'image',
        src: '/assets/projects/citywalk/story/route-refinement.png',
        title: '多轮上下文路线重规划',
        groupTitle: '多轮上下文路线重规划',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
    ],
    demo: [
      {
        id: 'citywalk-demo-1',
        type: 'video',
        src: '/assets/projects/citywalk/demo/conversation-to-route.webm',
        mp4Src: '/assets/projects/citywalk/demo/conversation-to-route.mp4',
        startTime: 2,
        endTime: 109,
        playbackRate: 2,
        title: '路线生成演示',
        description: '演示手机端单手滑动对话、路书秒级生成与中途折返路线重算',
        duration: '01:12',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
    ],
    more: [
      {
        id: 'citywalk-more-1',
        type: 'image',
        src: '/assets/projects/citywalk/more/discovery-home.png',
        title: '每日灵感地点推荐',
        aspectRatio: '393/852',
        placeholderType: 'bare',
      },
      {
        id: 'citywalk-more-2',
        type: 'image',
        src: '/assets/projects/citywalk/more/footprint-map.png',
        title: '历史足迹可视回溯',
        aspectRatio: '393/852',
        placeholderType: 'bare',
      },
      {
        id: 'citywalk-more-3',
        type: 'image',
        src: '/assets/projects/citywalk/more/route-folder.png',
        title: '历史路线归档管理',
        aspectRatio: '393/852',
        placeholderType: 'bare',
      },
    ],
  },

  // 02. Context Lab (Contest / Context Lab)
  {
    id: 'context-lab',
    nameZh: '语境化英语学习产品',
    nameEn: 'Context Lab',
    category: 'Editorial AI Workspace',
    description: '围绕目标词生成个性化短文，构建语境化词汇学习体验',
    liveUrl: 'https://contextlab.kikochen77.chatgpt.site',
    story: [
      {
        id: 'context-story-1',
        type: 'image',
        src: '/assets/projects/context-lab/story/article.png',
        title: '文章生成结果展示',
        description: '非线性的信息碎片编排与关联拓扑，直观呈现长文内在语义骨架',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
      {
        id: 'context-story-2',
        type: 'image',
        src: '/assets/projects/context-lab/story/create.png',
        title: '输入参数组合设置',
        description: '针对论点分支触发对抗式推演，保留每一次观点蜕变的思维快照',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
      {
        id: 'context-story-3',
        type: 'image',
        src: '/assets/projects/context-lab/story/history.png',
        title: '历史文章归档回顾',
        description: '自动对齐版面栅格与引文标准，实现高质量学术或文化特稿输出',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
    ],
    demo: [
      {
        id: 'context-demo-1',
        type: 'video',
        src: '/assets/projects/context-lab/demo/full-article-generation.webm',
        mp4Src: '/assets/projects/context-lab/demo/full-article-generation.mp4',
        endTime: 20.5,
        skipRanges: [{ start: 12, end: 15 }],
        title: '长文生成流程',
        description: '从大纲构思、信源验证到全文自动对齐与润色的完整工作流演练',
        duration: '01:45',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
    ],
    more: [
      {
        id: 'context-more-1',
        type: 'image',
        src: '/assets/projects/context-lab/more/home.png',
        title: '首页入口',
        description: '严谨度与叙事诗意度二维张量控制器',
        aspectRatio: '393/852',
        placeholderType: 'bare',
      },
      {
        id: 'context-more-2',
        type: 'image',
        src: '/assets/projects/context-lab/more/discovery.png',
        title: '划卡筛词',
        description: '可溯源段落证据链实时高亮比对',
        aspectRatio: '393/852',
        placeholderType: 'bare',
      },
      {
        id: 'context-more-3',
        type: 'image',
        src: '/assets/projects/context-lab/more/pool.png',
        title: '词库管理',
        description: '涵盖日系杂志与极简册页样式规范',
        aspectRatio: '393/852',
        placeholderType: 'bare',
      },
      {
        id: 'context-more-4',
        type: 'image',
        src: '/assets/projects/context-lab/more/create.png',
        title: '生成进度',
        description: '多 Agent 交互延迟与上下文窗口负载分析',
        aspectRatio: '393/852',
        placeholderType: 'bare',
      },
    ],
  },

  // 03. Movie Taste → Cocktail Skill (Skill)
  {
    id: 'cocktail',
    nameZh: '基于电影审美的调酒Skill',
    nameEn: 'DouBar',
    category: 'AI Skill / Sensory Prompting',
    description: '从DouBan观影记录提炼审美，生成专属鸡尾酒配方',
    story: [
      {
        id: 'cocktail-story-1',
        type: 'image',
        src: '/assets/projects/cocktail/story/ticket-01.png',
        title: '烈焰夜色特调',
        description: '从银翼杀手 2049 的雨夜霓虹提取高维苦艾与烟熏泥煤参数',
        aspectRatio: '2/3',
        placeholderType: 'ticket',
      },
      {
        id: 'cocktail-story-2',
        type: 'image',
        src: '/assets/projects/cocktail/story/ticket-02.png',
        title: '午后橙光特调',
        description: '动态算法平衡酸甜比与基酒烈度，生成独属观影者当下的情绪票根',
        aspectRatio: '2/3',
        placeholderType: 'ticket',
      },
      {
        id: 'cocktail-story-3',
        type: 'image',
        src: '/assets/projects/cocktail/story/ticket-03.png',
        title: '霓虹青柠特调',
        description: '极简排版的温敏小票与配料图例，完成从数字感知到实体交付的闭环',
        aspectRatio: '2/3',
        placeholderType: 'ticket',
      },
    ],
  },

  // 04. Digital Polaroid (Polaroid)
  {
    id: 'polaroid',
    nameZh: '电子拍立得',
    nameEn: 'ePolaroid',
    category: 'WebGL Web Experience',
    description: '以电子显影与滤镜相框，重现宝丽来成片仪式感',
    liveUrl: 'https://epolaroid.kikochen77.chatgpt.site',
    story: [
      {
        id: 'polaroid-story-1',
        type: 'image',
        src: '/assets/projects/polaroid/story/import-page.png',
        title: '照片导入显影',
        groupId: 'polaroid-highlights',
        groupTitle: '照片显影与风格编辑',
        caption: '导入照片开启显影',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
      {
        id: 'polaroid-story-2',
        type: 'image',
        src: '/assets/projects/polaroid/story/edit-develop.png',
        title: '相纸滤镜导出',
        groupId: 'polaroid-highlights',
        groupTitle: '照片显影与风格编辑',
        caption: '显影成片风格编辑',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
    ],
    demo: [
      {
        id: 'polaroid-demo-1',
        type: 'video',
        src: '/assets/projects/polaroid/demo/import-develop-filters.webm',
        mp4Src: '/assets/projects/polaroid/demo/import-develop-filters.mp4',
        startTime: 3,
        title: '完整显影交互',
        description: '完整演示相纸出仓、等待 15 秒化学显影、摇晃加速与滤镜切换过程',
        duration: '00:38',
        aspectRatio: '393/852',
        placeholderType: 'mobile',
      },
    ],
  },
];

/**
 * Creation archive. It intentionally uses the same Project shape as the
 * product archive so both collections share the gear, stage navigation,
 * responsive galleries, video controls, and lightbox behavior.
 */
export const CREATIONS_DATA: Project[] = [
  {
    id: 'photography',
    nameZh: '摄影作品',
    nameEn: 'Photography',
    category: 'Photography Archive',
    description: '观察世界、收集色彩、切片瞬间',
    liveUrl: 'https://www.xiaohongshu.com/user/profile/63c03bdb0000000027029797',
    liveLabel: 'OPEN REDNOTE',
    stageLabels: { story: 'IMAGE' },
    story: ['blue1.jpeg', 'blue2.jpeg', 'green1.jpeg', 'green2.jpeg', 'pink1.jpeg', 'pink2.jpeg', 'yellow1.jpeg', 'yellow2.jpeg'].map((file, index) => {
        const [color] = file.split(/\d/);
        return {
          id: `photography-${color}-${index + 1}`,
          type: 'image' as const,
          src: `/assets/creations/photography/${file}`,
          title: '摄影作品',
          groupId: 'photography-grid',
          groupTitle: '摄影作品',
          hideGroupTitle: true,
          aspectRatio: '1/1',
          placeholderType: 'bare' as const,
          mobileColumns: 2,
          desktopColumns: 4,
          mobileOrder: index,
          desktopOrder: index % 2 === 0 ? index / 2 : 4 + Math.floor(index / 2),
        };
      }),
  },
  {
    id: 'aigc',
    nameZh: 'AIGC作品',
    nameEn: 'AIGC',
    category: 'Generative Visual Works',
    description: '多风格内容创作，辅助课设概念表达',
    stageLabels: { story: 'IMAGE', demo: 'VIDEO' },
    stageOrder: ['demo', 'story'],
    initialStage: 'demo',
    story: [
      ...Array.from({ length: 8 }, (_, index) => {
        const number = String(index + 1).padStart(2, '0');
        const file = index === 3 ? `${number}.jpg` : `${number}.png`;
        return {
          id: `aigc-image-${number}`,
          type: 'image' as const,
          src: `/assets/creations/AIGC/image/${file}`,
          title: 'AIGC图像创作',
          groupId: 'aigc-image-grid',
          groupTitle: 'AIGC图像创作',
          hideGroupTitle: true,
          aspectRatio: '1/1',
          placeholderType: 'bare' as const,
          mobileColumns: 2,
          desktopColumns: 4,
          mobileOrder: index,
          desktopOrder: index % 2 === 0 ? index / 2 : 4 + Math.floor(index / 2),
        };
      }),
    ],
    demo: [
      {
        id: 'aigc-video-botanical',
        type: 'video',
        src: '/assets/creations/AIGC/video/植物园规则怪谈-preview.mp4',
        poster: '/assets/creations/AIGC/video/植物园规则怪谈-cover.png',
        title: '《植物园规则怪谈》',
        titleBar: true,
        aspectRatio: '16/9',
      },
    ],
  },
  {
    id: 'graphic-design',
    nameZh: '平面设计',
    nameEn: 'Graphic Design',
    category: 'Graphic Design Works',
    description: '面向活动/讲座的平面设计作品',
    stageLabels: { story: 'IMAGE' },
    story: [
      ...Array.from({ length: 8 }, (_, index) => {
        const number = String(index + 1).padStart(2, '0');
        const file = `${number}.${index === 1 ? 'png' : 'jpg'}`;
        return {
          id: `graphic-image-${number}`,
          type: 'image' as const,
          src: `/assets/creations/graphic/${file}`,
          previewSrc: `/assets/creations/graphic/previews/${number}.webp`,
          title: '平面设计作品',
          groupId: 'graphic-image-grid',
          groupTitle: '平面设计作品',
          hideGroupTitle: true,
          aspectRatio: '1/1',
          placeholderType: 'bare' as const,
          mobileColumns: 2,
          desktopColumns: 4,
          mobileOrder: index,
          desktopOrder: index % 2 === 0 ? index / 2 : 4 + Math.floor(index / 2),
        };
      }),
    ],
  },
  {
    id: 'video',
    nameZh: '影视创作',
    nameEn: 'Video',
    category: 'Independent Film',
    description: '从编导到后期，独立创作剧情短片',
    initialStage: 'demo',
    stageLabels: { demo: 'VIDEO' },
    story: [],
    demo: [
      {
        id: 'video-lake-pavilion',
        type: 'video',
        src: '/assets/creations/video/湖心亭-preview.mp4',
        poster: '/assets/creations/video/湖心亭-cover.jpg',
        title: '《湖心亭》',
        titleBar: true,
        aspectRatio: '47/20',
      },
      {
        id: 'video-late-spring',
        type: 'video',
        src: '/assets/creations/video/晚春-preview.mp4',
        poster: '/assets/creations/video/晚春-cover.jpg',
        title: '《晚春》',
        titleBar: true,
        aspectRatio: '16/9',
      },
    ],
  },
];
