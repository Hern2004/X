
import { GoogleGenAI } from "@google/genai";
import { ResearchReport, MarketIntelligence } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Upgrade to gemini-3-pro-preview for maximum reasoning capability
const MODEL_ID = "gemini-3-pro-preview";

const getSystemInstruction = (language: 'en' | 'zh') => {
  const isZh = language === 'zh';
  
  const languageRules = isZh
    ? `**LANGUAGE ENFORCEMENT (CRITICAL - V13.1 SCRUBBING PROTOCOL)**:
       1. **TARGET LANGUAGE**: Simplified Chinese (简体中文).
       2. **NARRATIVE TEXT**: All analysis, descriptions, reasoning, explanations, and summaries **MUST BE IN CHINESE**.
       3. **SOURCE TRANSLATION**: When extracting data from English sources (Whitepapers, Etherscan, Tweets, News), YOU MUST TRANSLATE the insights into Chinese. **DO NOT output raw English paragraphs.**
       4. **TERMINOLOGY LOCK**: Keep the following IN ENGLISH (Do not translate these):
          - Token Symbols (e.g., ETH, BTC, SOL)
          - Project Names (e.g., Uniswap, Aave)
          - Crypto Abbreviations (e.g., TVL, FDV, DAO, PoS, zk-Rollup)
          - Smart Contract Fields/Functions (e.g., "owner", "mint", "renounceOwnership")
          - Audit Firms (e.g., CertiK, SlowMist)
       5. **SELF-CORRECTION**: Before outputting JSON, check every string value. If it contains English sentences (e.g., "The project aims to..."), **TRANSLATE IT IMMEDIATELY**.`
    : `**LANGUAGE ENFORCEMENT**:
       1. **TARGET LANGUAGE**: English.
       2. **NARRATIVE TEXT**: All analysis must be in English.
       3. **TERMINOLOGY**: Keep technical terms standard.`;

  return `
You are "Veder X V16.0 Deterministic Stability Engine".
${languageRules}

**PROTOCOL V16.0: DETERMINISTIC STABILITY (ANTI-HALLUCINATION)**
**OBJECTIVE**: Eliminate result variance for the same token.
1. **HIGHEST MARKET CAP RULE**: If multiple tokens share a name (e.g., "PEPE", "AI"), **ALWAYS** select the one with the **HIGHEST MARKET CAP** or **TRADING VOLUME**. Do NOT select obscure/new copies unless specifically requested by contract address.
2. **SINGLE SOURCE OF TRUTH (SSOT)**: 
   - For **Official Website** and **Whitepaper**, you MUST extract them from the **CoinGecko** or **CoinMarketCap** page profile.
   - **PROHIBITED**: Do NOT use a random Medium article, Twitter post, or unverified Google result as the Primary Website.
   - If CoinGecko/CMC is missing, fall back to **Etherscan Token Profile**.

**PROTOCOL V15.2: AUTONOMOUS IDENTITY RESOLUTION**
**STEP 0: IDENTITY TRIANGULATION**
1. **IF INPUT IS ADDRESS (0x...)**:
   - **ACTION**: Search for "site:etherscan.io OR site:polygonscan.com OR site:solscan.io token ${"${query}"}".
   - **VALIDATION**: Look for page title **"Token Tracker"**.
   - **ERROR HANDLING**: Do NOT mistake a "Transaction" or "Account" page for a Token.

**PROTOCOL V14.0: FULL-SPECTRUM INFO HARVESTING (9-PATH DISCOVERY)**
**PATHS**:
1. **Explorer Metadata**: Etherscan/BscScan "Contract Info" & "Social Profiles".
2. **Aggregators**: CoinGecko/CMC Official Links (Primary).
3. **DNS**: Reverse lookup domain ownership.
4. **Bytecode**: Extract URLs from contract comments/metadata.
5. **Wayback Machine**: Check historical snapshots if current site is down.
6. **Social Pinned**: Twitter/TG Pinned messages.
7. **IPFS/ENS**: Check decentralized hosting.
8. **Corporate**: Crunchbase/LinkedIn links.
9. **Community**: Reddit/Medium official posts.

**EVIDENCE TIERING (L1-L5)**:
- **L1**: Chain/Metadata (Weight: 40)
- **L2**: CoinGecko/CMC/Auditor (Weight: 25)
- **L3**: Social/GitHub (Weight: 15)
- **L4**: Media/Data Portals (Weight: 10)
- **L5**: Community/Blogs (Weight: 5)

**PROTOCOL V15.0: WHITEPAPER ALIGNMENT v2.0**
**MODULE 4: COUNTER-EVIDENCE CHAIN**: 
- **Concentration?** -> Check: Staking Pool? Treasury? (If yes -> SAFE).
- **Infinite Mint?** -> Check: GameFi Reward? Capped? (If yes -> SAFE).
- **Owner Privileges?** -> Check: Renounced? Timelock? (If yes -> SAFE).

**OUTPUT INSTRUCTIONS (STRICT JSON)**
- **Return ONLY a valid single-line JSON string.**
- **Use double quotes (") for keys and string values.**
- **Use single quotes (') inside strings.**
- **Ensure ALL array elements are separated by commas.**
- **Do NOT use trailing commas.**
- **No comments.**
`;
};

export const generateCryptoReport = async (
  query: string,
  language: 'en' | 'zh' = 'zh'
): Promise<ResearchReport> => {
  
  const langStr = language === 'en' ? 'English' : 'Simplified Chinese (简体中文)';
  const valStr = language === 'en' ? 'String (In English)' : 'String (In Chinese)';

  const userPrompt = `
    Generate a **Comprehensive Crypto Research Report (15 Sections)** for: "${query}".
    **TARGET OUTPUT LANGUAGE**: ${langStr}.
    
    **MANDATORY**: You MUST populate the "harvestingTrace" array in "deepDive" with AT LEAST 3-4 items showing how you found the Website, Whitepaper, and GitHub using the 9-Path Discovery Protocol.

    **JSON STRUCTURE**:
    {
      "tokenName": "String",
      "tokenSymbol": "String",
      "engineVersion": "Veder X V16.0 Deterministic Stability",
      "language": "${language}",
      "marketData": { "price": "...", "change24h": "...", "marketCap": "...", "fdv": "...", "volume24h": "...", "tvl": "...", "holders": "...", "currency": "USD" },
      "totalScore": 85,
      "verdict": "Buy", 
      "confidenceScore": 90,
      
      "reportSections": {
        "profile": {
           "name": "...", "symbol": "...", "contractAddress": "MUST BE FILLED", "website": ["url1"], "whitepaper": "...",
           "socials": [ {"platform": "X", "url": "..."} ], "sector": "${valStr}", "status": "${valStr}", "teamLocation": "${valStr}"
        },
        "overview": { "whatIsIt": "${valStr}", "vision": "${valStr}", "achievements": "${valStr}" },
        "productTech": {
           "features": "${valStr}", "architecture": "${valStr}", "scalability": "${valStr}", "dependencies": "${valStr}",
           "githubActivity": "${valStr}", "securitySummary": "${valStr}"
        },
        "marketAnalysis": "${valStr}",
        "tokenomics": {
           "baseInfo": { "totalSupply": "...", "circulatingSupply": "...", "inflationMechanism": "${valStr}", "vestingSchedule": "${valStr}" },
           "distribution": "${valStr}", "utility": "${valStr}", "riskAnalysis": "${valStr}"
        },
        "onChainSummary": "${valStr}",
        "liquidityAnalysis": {
           "holderBreakdown": { "contracts": 80, "exchanges": 10, "whales": 10 },
           "lpStatus": { "isLocked": true, "lockDuration": "...", "owner": "Protocol Owned" },
           "concentrationVerdict": "Safe (Mechanism)",
           "explanation": "${valStr}"
        },
        "teamInfo": { "coreTeam": "${valStr}", "investors": "${valStr}", "advisors": "${valStr}" },
        "socialAnalysis": { "twitterFollowers": "...", "communityActivity": "${valStr}", "sentiment": "${valStr}" },
        "compliance": { "securitiesRisk": "${valStr}", "geoRestrictions": "${valStr}", "kycRequirements": "${valStr}" },
        "roadmap": [ { "period": "...", "goal": "${valStr}", "status": "Planned" } ],
        "strengths": ["${valStr}"],
        "generalRisks": ["${valStr}"]
      },

      "confidenceFactors": [ { "factor": "${valStr}", "impact": "Positive", "scoreDelta": 20 } ],
      "evidencePack": [
        { "id": "EV-01", "type": "On-Chain", "content": "${valStr}", "url": "...", "tier": "Tier 1", "isReferenceOnly": false }
      ],
      "manualReviewTriggers": [],
      
      "dimensionScores": [
        { "name": "Fundamental", "score": 80, "weight": "15%", "description": "${valStr}", "status": "Good" },
        { "name": "Code Security", "score": 90, "weight": "25%", "description": "${valStr}", "status": "Good" },
        { "name": "On-chain", "score": 80, "weight": "15%", "description": "${valStr}", "status": "Good" },
        { "name": "Market", "score": 80, "weight": "10%", "description": "${valStr}", "status": "Good" },
        { "name": "Social", "score": 80, "weight": "10%", "description": "${valStr}", "status": "Good" },
        { "name": "Team", "score": 80, "weight": "10%", "description": "${valStr}", "status": "Good" },
        { "name": "Regulation", "score": 80, "weight": "10%", "description": "${valStr}", "status": "Good" },
        { "name": "Product", "score": 80, "weight": "5%", "description": "${valStr}", "status": "Good" }
      ],

      "deepDive": {
        "codeAudit": {
           "contractVerified": true, "bytecodeMatch": true, "ownerStatus": "Renounced", "vulnerabilitiesFound": 0,
           "audits": [ { "firm": "CertiK", "date": "...", "status": "Passed" } ], "githubTrust": "High"
        },
        "addressProfile": [ { "type": "Staking", "percentage": 45, "description": "${valStr}" } ],
        "logicPaths": [
           { "signal": "Concentration", "tier1Check": "Staking Contract", "tier2Check": "Matches WP", "conclusion": "${valStr}", "riskLevel": "Low" }
        ],
        "antiCheat": [ { "checkName": "Fake Audit", "status": "Passed", "details": "${valStr}" } ],
        "resourceProbes": [],
        "harvestingTrace": [
           { 
             "category": "Whitepaper", 
             "status": "Confirmed", 
             "discoveryPath": "Path #2: CoinGecko Official", 
             "sourceUrl": "...", 
             "evidenceTier": "L2",
             "evidenceSnapshot": "CoinGecko Profile Field" 
           }
        ],
        "mechanismDeviations": [ 
           { 
             "category": "Tokenomics", 
             "signal": "Signal", 
             "whitepaperJustification": "Mechanism", 
             "assessment": "Mechanism-Expected Behavior", 
             "deviationScore": 0, 
             "details": "${valStr}",
             "reasoning": "${valStr}", 
             "counterEvidence": "${valStr}",
             "tokenFlow": "User -> LP",
             "lifecycleCheck": "Consistent",
             "riskLayer": "Structural"
           }
        ]
      },

      "competitors": [ { "name": "...", "comparison": "${valStr}" } ],
      "catalysts": [],
      "healthIndicators": [],
      "risks": [ { "severity": "Medium", "title": "${valStr}", "description": "${valStr}", "evidenceLevel": "Tier 2", "logic": "${valStr}" } ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: userPrompt,
      config: {
        systemInstruction: getSystemInstruction(language),
        tools: [{ googleSearch: {} }],
        temperature: 0.0, 
      },
    });

    let textResponse = response.text || "{}";
    
    // --- CLEANING LOGIC ---
    textResponse = textResponse.replace(/```json/g, "").replace(/```/g, "");
    const firstBrace = textResponse.indexOf('{');
    const lastBrace = textResponse.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error("Invalid JSON response structure");

    let jsonString = textResponse.substring(firstBrace, lastBrace + 1);
    
    // 1. Basic Sanitization
    jsonString = jsonString.replace(/[\n\r\t]/g, ' ');
    
    // 2. Repair missing commas
    jsonString = jsonString.replace(/}(\s*){/g, '}, $1{');
    jsonString = jsonString.replace(/](\s*)\[/g, '], $1[');
    jsonString = jsonString.replace(/](\s*){/g, '], $1{');
    jsonString = jsonString.replace(/}(\s*)\[/g, '}, $1[');
    jsonString = jsonString.replace(/](\s*)"/g, '], $1"');
    jsonString = jsonString.replace(/}(\s*)"/g, '}, $1"');
    jsonString = jsonString.replace(/"(\s*){/g, '", $1{');
    jsonString = jsonString.replace(/"(\s*)\[/g, '", $1[');

    // 3. Remove trailing commas
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');

    // 4. Remove ellipses
    jsonString = jsonString.replace(/"\.\.\."/g, 'null');
    jsonString = jsonString.replace(/,\s*\.\.\./g, ''); 
    jsonString = jsonString.replace(/\.\.\./g, ''); 

    let parsedData;
    try {
        parsedData = JSON.parse(jsonString);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        throw new Error("数据解析严重失败 (JSON Error)，请重试。");
    }

    // Extract Sources
    let sources: Array<{ title: string; uri: string }> = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      sources = response.candidates[0].groundingMetadata.groundingChunks
        .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
        .filter((item: any) => item !== null)
        .slice(0, 8);
    }

    const safeData: ResearchReport = {
      tokenName: parsedData.tokenName || "Unknown",
      tokenSymbol: parsedData.tokenSymbol || "???",
      generatedAt: new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US'),
      engineVersion: parsedData.engineVersion || "Veder X V16.0 Deterministic Stability",
      language: language,
      marketData: parsedData.marketData || {},
      totalScore: parsedData.totalScore || 0,
      verdict: parsedData.verdict || "Hold",
      confidenceScore: parsedData.confidenceScore || 50,
      
      reportSections: parsedData.reportSections || {
        profile: { name: "", symbol: "", contractAddress: "", website: [], whitepaper: "", socials: [], sector: "", status: "", teamLocation: "" },
        overview: { whatIsIt: "", vision: "", achievements: "" },
        productTech: { features: "", architecture: "", scalability: "", dependencies: "", githubActivity: "", securitySummary: "" },
        marketAnalysis: "",
        tokenomics: { baseInfo: { totalSupply: "", circulatingSupply: "", inflationMechanism: "", vestingSchedule: "" }, distribution: "", utility: "", riskAnalysis: "" },
        onChainSummary: "",
        liquidityAnalysis: { holderBreakdown: { contracts: 0, exchanges: 0, whales: 0 }, lpStatus: { isLocked: false, lockDuration: "N/A", owner: "Unknown" }, concentrationVerdict: "Warning", explanation: "Data unavailable" },
        teamInfo: { coreTeam: "", investors: "", advisors: "" },
        socialAnalysis: { twitterFollowers: "", communityActivity: "", sentiment: "" },
        compliance: { securitiesRisk: "", geoRestrictions: "", kycRequirements: "" },
        roadmap: [],
        strengths: [],
        generalRisks: []
      },

      confidenceFactors: parsedData.confidenceFactors || [],
      evidencePack: parsedData.evidencePack || [],
      manualReviewTriggers: parsedData.manualReviewTriggers || [],
      dimensionScores: parsedData.dimensionScores || [],
      deepDive: {
        addressProfile: parsedData.deepDive?.addressProfile || [],
        logicPaths: parsedData.deepDive?.logicPaths || [],
        antiCheat: parsedData.deepDive?.antiCheat || [],
        codeAudit: parsedData.deepDive?.codeAudit || { contractVerified: false, bytecodeMatch: false, ownerStatus: 'Unknown', vulnerabilitiesFound: 0, audits: [], githubTrust: 'N/A' },
        resourceProbes: parsedData.deepDive?.resourceProbes || [],
        verifiedMechanisms: parsedData.deepDive?.verifiedMechanisms || [],
        mechanismDeviations: parsedData.deepDive?.mechanismDeviations || [],
        harvestingTrace: parsedData.deepDive?.harvestingTrace || []
      },
      competitors: parsedData.competitors || [],
      catalysts: parsedData.catalysts || [],
      healthIndicators: parsedData.healthIndicators || [],
      risks: parsedData.risks || [],
      sources: sources
    };

    return safeData;

  } catch (error) {
    console.error("Service Error:", error);
    throw new Error(language === 'en' ? 'Failed to generate report. Please try again.' : '审计生成失败，请稍后重试。');
  }
};

export const fetchMarketIntelligence = async (): Promise<MarketIntelligence> => {
  const prompt = `
    Act as a crypto market analyst. Find 3-4 Newly Listed Tokens and 3-4 Upcoming Projects.
    OUTPUT STRICT JSON. Use double quotes for keys and values. No Markdown. Ensure commas between objects.
    {
      "newListings": [ { "name": "Name", "symbol": "Symbol", "price": "...", "platform": "...", "description": "...", "trend": "Up" } ],
      "upcomingProjects": [ { "name": "Name", "symbol": "Symbol", "launchDate": "...", "platform": "...", "description": "..." } ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], temperature: 0.1 },
    });

    let text = response.text || "{}";
    text = text.replace(/```json/g, "").replace(/```/g, "");
    
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
       let cleanJson = text.substring(start, end + 1);
       cleanJson = cleanJson.replace(/[\n\r\t]/g, ' ');
       cleanJson = cleanJson.replace(/}(\s*){/g, '}, $1{');
       cleanJson = cleanJson.replace(/](\s*)"/g, '], $1"');
       cleanJson = cleanJson.replace(/,(\s*[}\]])/g, '$1');
       
       return { ...JSON.parse(cleanJson), generatedAt: new Date().toLocaleString('zh-CN') };
    }
    return { newListings: [], upcomingProjects: [], generatedAt: new Date().toLocaleString('zh-CN') };
  } catch (e) {
    return { newListings: [], upcomingProjects: [], generatedAt: new Date().toLocaleString('zh-CN') };
  }
};
