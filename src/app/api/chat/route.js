import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const apiKey = "process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;";

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: "你是一个产品创新专家。请用中文拆解需求。要求：L-利用具体开源项目名；A-描述AI如何增强交互；T-列出必须砍掉的臃肿功能；T-定义极小众受众；mvpStep-给出一个可以直接上线的单网页方案。必须严格输出JSON: {name, leverage, aiEnhance, trim, target, mvpStep}" 
          },
          { role: "user", content: "请拆解这个单一肢体产品需求: " + prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6 // 提高创造性，避免只出数字
      })
    });

    const data = await response.json();
    return NextResponse.json(JSON.parse(data.choices[0].message.content));
  } catch (error) {
    return NextResponse.json({ error: "解析失败" }, { status: 500 });
  }
}
