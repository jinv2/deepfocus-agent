"use client";
import React, { useState } from 'react';
import { Sparkles, Loader2, Rocket, Layers, Zap, Scissors, Target } from 'lucide-react';

// 【关键修改】在顶部定义，构建时 Next.js 会自动替换这里
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

export default function DeepFocus() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (!query) return;
    // 如果构建时没注入成功，这里能给出明确提示
    if (!GROQ_API_KEY) {
      alert("错误：API Key 未配置。请检查 GitHub Secrets。");
      return;
    }
    
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}` // 使用顶部定义的常量
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: "你是一个产品创新专家。请用中文拆解需求。要求：L-利用具体开源项目名；A-描述AI如何增强交互；T-列出必须砍掉的臃肿功能；T-定义极小众受众；mvpStep-给出一个可以直接上线的单网页方案。必须严格输出JSON: {name, leverage, aiEnhance, trim, target, mvpStep}" 
            },
            { role: "user", content: "请拆解这个需求: " + query }
          ],
          response_format: { type: "json_object" },
          temperature: 0.6
        })
      });

      const data = await res.json();
      
      if (data.error) {
        alert("AI 错误: " + (data.error.message || "未知错误"));
      } else {
        setResult(JSON.parse(data.choices[0].message.content));
      }
    } catch (e) {
      alert("网络请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto text-center pt-10">
        <h1 className="text-4xl font-bold mb-2 tracking-tighter text-blue-600">DEEP FOCUS</h1>
        <p className="text-zinc-500 mb-10 text-sm tracking-[0.3em]">做深不做广 · 做小不做大</p>

        <div className="max-w-xl mx-auto mb-12">
          <input
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-lg outline-none focus:border-blue-500 transition-all text-white mb-4"
            placeholder="输入巨头产品 (如: Photoshop)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSolve()}
          />
          <button
            onClick={handleSolve}
            disabled={loading}
            className="w-full bg-blue-600 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-500 disabled:bg-zinc-800 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "正在重组灵魂..." : "启动核心拆解"}
          </button>
        </div>

        {result && (
          <div className="max-w-2xl mx-auto text-left bg-zinc-900/80 p-8 rounded-[2rem] border border-blue-900/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" /> {result.name || "创新方案"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
              <Item label="L-Leverage" icon={<Layers size={14}/>} content={result.leverage} />
              <Item label="A-AI Enhance" icon={<Zap size={14}/>} content={result.aiEnhance} />
              <Item label="T-Trim" icon={<Scissors size={14}/>} content={result.trim} />
              <Item label="T-Target" icon={<Target size={14}/>} content={result.target} />
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <div className="text-blue-500 font-bold text-xs uppercase mb-2 tracking-widest flex items-center gap-2">
                <Rocket size={14} /> MVP 启动逻辑
              </div>
              <p className="text-lg text-zinc-200 italic font-light">“{result.mvpStep}”</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Item({ label, icon, content }) {
  return (
    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
      <div className="text-zinc-500 font-bold text-[10px] uppercase mb-2 flex items-center gap-2">
        {icon} {label}
      </div>
      <div className="text-zinc-300 text-sm leading-relaxed">{content || "正在分析..."}</div>
    </div>
  );
}
