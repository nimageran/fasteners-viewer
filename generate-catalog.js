// generate-catalog.js — single-call tree scan
const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'nimageran';
const REPO_NAME  = 'fasteners-viewer';
const BRANCH     = 'main';
const TOKEN      = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || '';

async function fetchJSON(url) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Fasteners-Catalog-Generator'
  };
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`GitHub API error: ${resp.status} ${resp.statusText} – ${body.slice(0,200)}`);
  }
  return resp.json();
}

// Get commit SHA for the branch, then fetch its tree recursively
async function getRepoTree() {
  const refURL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${BRANCH}`;
  const ref = await fetchJSON(refURL);
  const sha = ref.object && ref.object.sha ? ref.object.sha : ref.sha;

  const treeURL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${sha}?recursive=1`;
  const tree = await fetchJSON(treeURL);

  if (!tree.tree) throw new Error('No tree returned from GitHub.');
  return tree.tree; // array of { path, type, sha, size, url }
}

function buildCatalogFromTree(tree) {
  // Expect structure: Category/Type/Standard/STL/*.stl
  const catalog = {};

  for (const node of tree) {
    if (node.type !== 'blob') continue; // only files
    const p = node.path.replace(/\\/g, '/');
    const parts = p.split('/');

    // e.g. ['Washers','PlainWasher','ISO7089','STL','Washer_M6_ISO7089.stl']
    if (parts.length < 5) continue;
    const [category, type, standard, maybeSTL] = parts;
    const stlFolder = parts[3];
    const fileName = parts.slice(4).join('/');

    if (stlFolder.toLowerCase() !== 'stl') continue;
    if (!fileName.toLowerCase().endsWith('.stl')) continue;

    catalog[category] ??= {};
    catalog[category][type] ??= {};
    catalog[category][type][standard] ??= { files: [], path: `${category}/${type}/${standard}/STL` };

    catalog[category][type][standard].files.push({
      name: fileName,
      path: p,
      // raw.githubusercontent direct link (no extra API calls)
      downloadUrl: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${encodeURI(p)}`
    });
  }

  return catalog;
}

function printSummary(catalog, outPath) {
  console.log('\n✅ Catalog generated successfully!');
  console.log(`📄 Saved to: ${outPath}`);
  console.log('\n📊 Summary:');

  let totalCategories = 0;
  let totalTypes = 0;
  let totalFiles = 0;

  for (const [category, types] of Object.entries(catalog)) {
    totalCategories++;
    console.log(`\n${category}:`);
    for (const [type, standards] of Object.entries(types)) {
      totalTypes++;
      for (const [standard, data] of Object.entries(standards)) {
        const count = data.files.length;
        totalFiles += count;
        console.log(`  - ${type} (${standard}): ${count} files`);
      }
    }
  }

  console.log(`\n📈 Total: ${totalCategories} categories, ${totalTypes} types, ${totalFiles} files`);
}

(async function main() {
  try {
    console.log('🔍 Scanning repository (tree)…');
    const tree = await getRepoTree();
    const catalog = buildCatalogFromTree(tree);

    const outPath = path.join(__dirname, 'catalog.json');
    fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));
    printSummary(catalog, outPath);
  } catch (err) {
    console.error('❌ Error scanning repository:', err.message);
    process.exit(1);
  }
})();
