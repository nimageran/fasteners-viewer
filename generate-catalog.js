// generate-catalog.js
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const REPO_OWNER = 'nimageran';
const REPO_NAME = 'fasteners-viewer';

// ✅ AUTO-DETECT PATH: Scans the folder where this file sits
const REPO_PATH = __dirname; 

console.log(`🔍 Scanning repository at: ${REPO_PATH}\n`);

// Recursively search for STL files
function searchForSTLs(dir, relativePath, maxDepth = 5, currentDepth = 0) {
  const result = {
    files: [],
    subdirs: []
  };
  
  if (currentDepth >= maxDepth || !fs.existsSync(dir)) return result;
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      // Skip hidden folders (.git, .github), node_modules, and script files
      if (item.startsWith('.') || item === 'node_modules' || item === 'generate-catalog.js' || item === 'package.json' || item === 'index.html' || item === 'catalog.json') continue;
      
      const fullPath = path.join(dir, item);
      let stats;
      try { stats = fs.statSync(fullPath); } catch (e) { continue; }
      
      if (stats.isDirectory()) {
        result.subdirs.push({
          name: item,
          path: relativePath ? `${relativePath}/${item}` : item,
          fullPath: fullPath
        });
      } else if (stats.isFile() && item.toLowerCase().endsWith('.stl')) {
        const fileRelativePath = relativePath ? `${relativePath}/${item}` : item;
        // Convert Windows backslashes (\) to Web slashes (/) for the URL
        const urlPath = fileRelativePath.replace(/\\/g, '/');
        
        result.files.push({
          name: item,
          path: fileRelativePath,
          downloadUrl: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${urlPath}`
        });
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dir}:`, error.message);
  }
  
  return result;
}

function buildCatalog() {
  const catalog = {};
  let totalFiles = 0;
  
  console.log('📂 Starting scan...');

  try {
    const rootScan = searchForSTLs(REPO_PATH, '', 5, 0);

    function processLevel(nodes, parentObj) {
        if (nodes.files.length > 0) {
            parentObj['_files'] = nodes.files; 
            totalFiles += nodes.files.length;
        }
        for (const subdir of nodes.subdirs) {
             const childNodes = searchForSTLs(subdir.fullPath, subdir.path, 5, 0);
             if (childNodes.files.length > 0 || childNodes.subdirs.length > 0) {
                 parentObj[subdir.name] = {};
                 processLevel(childNodes, parentObj[subdir.name]);
             }
        }
    }

    for (const mainCategory of rootScan.subdirs) {
        catalog[mainCategory.name] = {};
        const categoryNodes = searchForSTLs(mainCategory.fullPath, mainCategory.path, 5, 0);
        processLevel(categoryNodes, catalog[mainCategory.name]);
    }
    
    const catalogPath = path.join(__dirname, 'catalog.json');
    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Catalog generated successfully!');
    console.log(`📄 Saved to: ${catalogPath}`);
    console.log(`📈 Total STL files found: ${totalFiles}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

buildCatalog();