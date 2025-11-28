import { marked } from 'marked';
import hljs from 'highlight.js';

// Create a custom extension for code highlighting
const highlightExtension = {
  useNewRenderer: true,
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      let highlighted = text;
      
      if (lang && hljs.getLanguage(lang)) {
        try {
          highlighted = hljs.highlight(text, { language: lang }).value;
        } catch (err) {
          console.error('Highlight error:', err);
          highlighted = text;
        }
      } else {
        try {
          highlighted = hljs.highlightAuto(text).value;
        } catch (err) {
          console.error('Highlight auto error:', err);
          highlighted = text;
        }
      }
      
      return `<pre><code class="hljs${lang ? ` language-${lang}` : ''}">${highlighted}</code></pre>`;
    }
  }
};

marked.use(highlightExtension);

marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false,
});

export function parseMarkdown(markdown: string): string {
  try {
    return marked.parse(markdown) as string;
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return markdown;
  }
}
