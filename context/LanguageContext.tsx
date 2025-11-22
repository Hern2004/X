
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Header
    'app.name': 'Veder X',
    'app.slogan': '下一代加密投研引擎',
    'header.print': '导出 PDF 报告',
    
    // Search
    'search.badge': 'V16.0 Deterministic Stability',
    'search.title': 'Veder X',
    'search.subtitle': '下一代加密投研引擎',
    'search.description1': 'Veder X 是一个为加密投资者打造的自动化链上研究平台。我们将多源数据实时整合：白皮书、智能合约扫描、链上行为、代币经济、社交情绪、风险预警、代码仓库验证、审计机构报告……所有关键情报在这里一站聚合。',
    'search.description2': '借助深度搜索算法与多维度交叉验证模型，Veder X 能从噪音中筛选出真正可信的信号，为你生成结构严谨、证据充足的加密投研报告。不依赖单一数据源，不放大舆论偏见，每一条结论都基于可验证的链上事实与官方文档。',
    'search.placeholder': '输入代币名称 (推荐输入合约地址以确保100%准确)',
    'search.button': '审计',
    'search.radar': '市场情报雷达',
    'search.tier1': 'Tier 1 链上源头',
    'search.tier2': 'Tier 2 权威审计',
    'search.tier3': 'Tier 3 媒体过滤',
    'search.hot': '热门:',

    // Pipeline
    'step.identity': '身份解析',
    'step.harvesting': '全网抓取',
    'step.reasoning': '深度推理',
    'step.generating': '生成报告',
    'log.identity.start': '正在执行 V15.2 身份锚定协议...',
    'log.harvesting.start': '启动 V14.0 全景信息抓取 (9大路径)...',
    'log.reasoning.start': '加载 V13.0 反证逻辑引擎...',
    'log.generating.start': '正在编译 15 章节投研报告...',

    // Radar
    'radar.title': '新币情报雷达',
    'radar.subtitle': '实时追踪全网最新上市代币与未发布潜力项目',
    'radar.loading': '正在扫描 CoinGecko, CoinList, Twitter...',
    'radar.error': '获取情报失败，请稍后重试。',
    'radar.retry': '重试',
    'radar.new_listings': '刚上市 / 热门交易',
    'radar.upcoming': '即将发行 / 潜力项目',
    'radar.generate_report': '生成投研报告',
    'radar.pre_research': '预研分析',
    'radar.expected_time': '预计时间',
    'radar.disclaimer': '数据来源: AI 实时聚合 (Gemini Grounding) • 仅供参考',

    // Report Shell
    'report.generated_at': '报告生成时间',
    'report.price': '价格 (USD)',
    'report.change_24h': '24h 涨跌',
    'report.core_score': 'Tier 1/2 核心评分',
    'report.ai_score': 'AI Score',
    'report.dim_score': '维度评分 (1-100)',
    'report.footer': 'Veder X V16.0 Deterministic Stability • Powered by Gemini • NFA (非投资建议) • DYOR',
    
    // Sections
    'sec.profile': '1. 项目基础信息 (Profile)',
    'sec.overview': '2. 项目概述 (Overview)',
    'sec.product': '3. 产品与技术架构',
    'sec.market': '4. 市场分析 (Market Analysis)',
    'sec.tokenomics': '5. 经济模型 (Tokenomics)',
    'sec.onchain': '6. 链上行为分析',
    'sec.team': '7. 团队与投资人',
    'sec.social': '8. 社交与社区',
    'sec.blackswan': '9. 黑天鹅风险监控 (Tier 1/2 Verified)',
    'sec.legal': '10. 法律合规',
    'sec.roadmap': '11. 发展路线图',
    'sec.strengths': '12. 项目优点',
    'sec.risks': '13. 一般性风险',
    'sec.appendix': '15. 附录：审计证据包 (Evidence Pack)',

    // Labels
    'label.contract': '合约地址',
    'label.website': '官网',
    'label.sector': '所属赛道',
    'label.status': '项目状态',
    'label.location': '团队地点',
    'label.whitepaper': '白皮书',
    
    'label.intro': '项目简介',
    'label.vision': '愿景',
    'label.achievements': '主要成就',
    
    'label.features': '核心功能',
    'label.arch': '技术架构',
    'label.github': 'Github 活跃度',
    
    'label.total_supply': '总量 (Total Supply)',
    'label.circulating': '流通量 (Circulating)',
    'label.emission': '通胀/释放 (Emission)',
    'label.vesting': '解锁计划 (Vesting)',
    'label.distribution': '代币分配 (Distribution)',
    'label.utility': '代币效用 (Utility)',

    'label.core_team': '核心团队',
    'label.investors': '投资机构',
    'label.advisors': '顾问',

    'label.followers': '粉丝规模',
    'label.activity': '活跃度',
    'label.sentiment': '情绪',

    'label.security_risk': '证券风险',
    'label.geo_restriction': '地区限制',

    'term.audit_terminal': '代码审计终端 (Tier 1)',
    'term.liquidity_terminal': 'V12.5 流动性取证 (Liquidity Forensics)',
    'term.matrix_terminal': 'V15.0 全维机制矩阵',
    'term.address_profile': '持仓画像 (Address Profile)',
    'term.harvesting_trace': '信息抓取追踪 (V14.0)',
  },
  en: {
    'app.name': 'Veder X',
    'app.slogan': 'Next-Gen Crypto Research Engine',
    'header.print': 'Export PDF',

    'search.badge': 'V16.0 Deterministic Stability',
    'search.title': 'Veder X',
    'search.subtitle': 'Next-Gen Crypto Research Engine',
    'search.description1': 'Veder X is an automated on-chain research platform for crypto investors. We aggregate multi-source data in real-time: whitepapers, contract scans, on-chain behavior, tokenomics, social sentiment, risk warnings, code validation, audit reports... all critical intelligence in one place.',
    'search.description2': 'Powered by deep search algorithms and multi-dimensional cross-validation models, Veder X filters trusted signals from noise, generating rigorous, evidence-backed investment reports. No reliance on single sources, no amplification of bias—every conclusion is based on verifiable on-chain facts and official docs.',
    'search.placeholder': 'Enter Token Name (Contract Address recommended for 100% accuracy)',
    'search.button': 'Audit',
    'search.radar': 'Market Intelligence Radar',
    'search.tier1': 'Tier 1 On-Chain Source',
    'search.tier2': 'Tier 2 Auth Audit',
    'search.tier3': 'Tier 3 Media Filter',
    'search.hot': 'Hot:',

    // Pipeline
    'step.identity': 'Identity Resolution',
    'step.harvesting': 'Info Harvesting',
    'step.reasoning': 'Deep Reasoning',
    'step.generating': 'Report Generation',
    'log.identity.start': 'Executing V15.2 Identity Protocol...',
    'log.harvesting.start': 'Starting V14.0 9-Path Discovery...',
    'log.reasoning.start': 'Loading V13.0 Counter-Evidence Engine...',
    'log.generating.start': 'Compiling 15-Section Report...',

    'radar.title': 'New Token Radar',
    'radar.subtitle': 'Real-time tracking of newly listed tokens and upcoming projects',
    'radar.loading': 'Scanning CoinGecko, CoinList, Twitter...',
    'radar.error': 'Failed to fetch intelligence, please try again.',
    'radar.retry': 'Retry',
    'radar.new_listings': 'Newly Listed / Trending',
    'radar.upcoming': 'Upcoming / Potential',
    'radar.generate_report': 'Generate Report',
    'radar.pre_research': 'Pre-Analysis',
    'radar.expected_time': 'Expected Time',
    'radar.disclaimer': 'Source: AI Real-time Aggregation (Gemini Grounding) • For Reference Only',

    'report.generated_at': 'Generated At',
    'report.price': 'Price (USD)',
    'report.change_24h': '24h Change',
    'report.core_score': 'Tier 1/2 Core Score',
    'report.ai_score': 'AI Score',
    'report.dim_score': 'Dimension Scores (1-100)',
    'report.footer': 'Veder X V16.0 Deterministic Stability • Powered by Gemini • NFA (Not Financial Advice) • DYOR',

    'sec.profile': '1. Project Profile',
    'sec.overview': '2. Project Overview',
    'sec.product': '3. Product & Tech Architecture',
    'sec.market': '4. Market Analysis',
    'sec.tokenomics': '5. Tokenomics',
    'sec.onchain': '6. On-Chain Analysis',
    'sec.team': '7. Team & Investors',
    'sec.social': '8. Social & Community',
    'sec.blackswan': '9. Black Swan Risk Monitor (Tier 1/2 Verified)',
    'sec.legal': '10. Legal & Compliance',
    'sec.roadmap': '11. Roadmap',
    'sec.strengths': '12. Strengths',
    'sec.risks': '13. General Risks',
    'sec.appendix': '15. Appendix: Evidence Pack',

    'label.contract': 'Contract',
    'label.website': 'Website',
    'label.sector': 'Sector',
    'label.status': 'Status',
    'label.location': 'Location',
    'label.whitepaper': 'Whitepaper',

    'label.intro': 'Introduction',
    'label.vision': 'Vision',
    'label.achievements': 'Achievements',

    'label.features': 'Core Features',
    'label.arch': 'Architecture',
    'label.github': 'GitHub Activity',

    'label.total_supply': 'Total Supply',
    'label.circulating': 'Circulating',
    'label.emission': 'Emission',
    'label.vesting': 'Vesting',
    'label.distribution': 'Distribution',
    'label.utility': 'Utility',

    'label.core_team': 'Core Team',
    'label.investors': 'Investors',
    'label.advisors': 'Advisors',

    'label.followers': 'Followers',
    'label.activity': 'Activity',
    'label.sentiment': 'Sentiment',

    'label.security_risk': 'Securities Risk',
    'label.geo_restriction': 'Geo Restrictions',

    'term.audit_terminal': 'Code Audit Terminal (Tier 1)',
    'term.liquidity_terminal': 'V12.5 Liquidity Forensics',
    'term.matrix_terminal': 'V15.0 Mechanism Matrix',
    'term.address_profile': 'Address Profile',
    'term.harvesting_trace': 'Harvesting Trace (V14.0)',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
