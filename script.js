
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const btnSample = document.getElementById("btn-sample");
const btnClear = document.getElementById("btn-clear");
const btnExport = document.getElementById("btn-export");


marked.setOptions({
  breaks: true,
  gfm: true,
});


const SAMPLE = `# Welcome to Markdown Previewer

Type Markdown on the **left** — see the HTML preview on the **right**.

## Examples

### Headings
# H1  /  ## H2  /  ### H3

### Emphasis
*Italic* _italic_  **Bold** __bold__

### Lists
- Item one
- Item two
  - nested item

### Link
[OpenAI](https://openai.com)

### Code
\`\`\`js
// simple JS
function greet(name){
  return "Hello " + name;
}
\`\`\`

> Blockquote example

Inline code: \`const a = 10;\`

Enjoy! ✨
`;

function renderMarkdown(mdText) {
  try {
    const raw = marked.parse(mdText || "");
    const clean = DOMPurify.sanitize(raw);
    preview.innerHTML = clean;
  } catch (err) {
    preview.innerHTML = "<p style='color:salmon'>Error rendering markdown.</p>";
    console.error(err);
  }
}

// Live render on input (debounce small)
let debounceTimer;
editor.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => renderMarkdown(editor.value), 150);
});

// Buttons
btnSample.addEventListener("click", () => {
  editor.value = SAMPLE;
  renderMarkdown(SAMPLE);
});

btnClear.addEventListener("click", () => {
  editor.value = "";
  renderMarkdown("");
});

btnExport.addEventListener("click", () => {
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Exported Markdown</title></head>
<body>${DOMPurify.sanitize(marked.parse(editor.value || ""))}</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "preview.html";
  a.click();
  URL.revokeObjectURL(url);
});

editor.value = SAMPLE;
renderMarkdown(SAMPLE);
