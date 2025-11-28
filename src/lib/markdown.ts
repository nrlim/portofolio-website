import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked dengan syntax highlighting
marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false,
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).highlighted;
      } catch (err) {
        console.error('Highlight error:', err);
      }
    }
    try {
      return hljs.highlightAuto(code).highlighted;
    } catch (err) {
      console.error('Highlight auto error:', err);
      return code;
    }
  },
});

export function parseMarkdown(markdown: string): string {
  try {
    return marked(markdown) as string;
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return markdown;
  }
}
