import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ success: false, error: 'Missing text or targetLang' }, { status: 400 });
    }

    // Use Google Translate unofficial API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const data = await res.json();

    // Extract translated text from Google's response
    let translated = '';
    if (data && data[0]) {
      for (const item of data[0]) {
        if (item[0]) translated += item[0];
      }
    }

    if (translated && translated !== text) {
      return NextResponse.json({ success: true, translated });
    }

    return NextResponse.json({ success: false, error: 'Translation failed' });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ success: false, error: 'Translation failed' }, { status: 500 });
  }
}
