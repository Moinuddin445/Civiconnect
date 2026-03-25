const fs = require('fs');
const path = require('path');

const directories = ['src/pages', 'src/components', 'src/cards', 'src'];

const replacements = [
  { match: /page-bg/g, replace: 'bg-gray-100 min-h-screen' },
  { match: /glass-card/g, replace: 'bg-white border border-gray-300 rounded shadow p-6' },
  { match: /glass/g, replace: 'bg-white border border-gray-200 rounded' },
  { match: /btn-primary/g, replace: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700' },
  { match: /btn-secondary/g, replace: 'bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400' },
  { match: /input-glass/g, replace: 'border border-gray-400 p-2 rounded w-full' },
  { match: /text-white/g, replace: 'text-black' },
  { match: /text-slate-400/g, replace: 'text-gray-600' },
  { match: /text-slate-300/g, replace: 'text-gray-700' },
  { match: /text-slate-500/g, replace: 'text-gray-500' },
  { match: /bg-slate-800/g, replace: 'bg-gray-200' },
  { match: /text-orange-400/g, replace: 'text-blue-600' },
  { match: /text-teal-400/g, replace: 'text-green-600' },
  { match: /text-amber-400/g, replace: 'text-yellow-600' },
  { match: /from-orange-500/g, replace: 'from-blue-500' },
  { match: /to-amber-500/g, replace: 'to-blue-600' },
  { match: /from-[#0f0f1a]\/70/g, replace: 'from-gray-900/70' },
  { match: /from-[#0f0f1a]/g, replace: 'from-gray-900' },
  { match: /to-[#0f0f1a]/g, replace: 'to-gray-900' },
  { match: /bg-gradient-to-r/g, replace: 'bg-blue-600' },
  { match: /bg-gradient-to-br/g, replace: 'bg-blue-500' },
  { match: /animate-fade-in-up/g, replace: '' },
  { match: /animate-scale-in/g, replace: '' },
  { match: /animate-fade-in/g, replace: '' },
  { match: /gradient-text/g, replace: 'text-blue-600 font-bold' },
  { match: /shadow-orange-500\/[0-9]+/g, replace: 'shadow' },
  { match: /hover:shadow-orange-500\/[0-9]+/g, replace: 'hover:shadow-md' },
  { match: /bg-white\/5/g, replace: 'bg-gray-100' },
  { match: /bg-white\/10/g, replace: 'bg-gray-200' },
  { match: /border-white\/5/g, replace: 'border-gray-200' },
  { match: /border-white\/10/g, replace: 'border-gray-300' },
  { match: /text-red-400/g, replace: 'text-red-600' },
  { match: /bg-red-500\/10/g, replace: 'bg-red-100' },
  { match: /border-red-500\/20/g, replace: 'border-red-300' }
];

function processDirectory(dir) {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) return;
  
  const files = fs.readdirSync(fullPath);
  for (const file of files) {
    const filePath = path.join(fullPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDirectory(path.join(dir, file));
    } else if (filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      replacements.forEach(r => {
        content = content.replace(r.match, r.replace);
      });
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Processed ${filePath}`);
    }
  }
}

directories.forEach(processDirectory);
