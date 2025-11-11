// generate-catalog-local.js
// Scans LOCAL repository folder (no GitHub API needed!)
const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'nimageran';
const REPO_NAME = 'fasteners-viewer';

// Path to your local cloned repository
// CHANGE THIS to where your repo is located!
const REPO_PATH = 'C:/Users/nimag/OneDrive/Documents/GitHub/fasteners-viewer';
console.log('🔍 Scanning local repository...');
console.log(`📁 Repository path: ${REPO_PATH}\n`);

// Check if repo exists
if (!fs.existsSync(REPO_PATH)) {
  console.error(`❌ Repository not found at: ${REPO_PATH}`);
  console.log('\n💡 To fix this:');
  console.log('1. Clone your repo: git clone https://github.com/nimageran/fasteners-viewer.git C:\\fasteners-viewer');
  console.log('2. OR update REPO_PATH in this script to point to your repo location');
  process.exit(1);
}

function scanDirectory(dir, relativePath = '') {
  const items = fs.readdirSync(dir);
  const result = [];
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      result.push({
        name: item,
        type: 'dir',
        path: relativePath ? `${relativePath}/${item}` : item
      });
    } else if (item.toLowerCase().endsWith('.stl')) {
      result.push({
        name: item,
        type: 'file',
        path: relativePath ? `${relativePath}/${item}` : item,
        downloadUrl: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${relativePath ? relativePath + '/' : ''}${item}`
      });
    }
  }
  
  return result;
}

function buildCatalog() {
  const catalog = {};
  let totalFiles = 0;
  
  try {
    // Get top-level directories (Bolts, Nuts, etc.)
    const topLevel = scanDirectory(REPO_PATH);
    
    for (const category of topLevel) {
      if (category.type === 'dir' && !category.name.startsWith('.') && 
          category.name !== 'node_modules' && category.name !== '.git') {
        
        console.log(`📁 Found category: ${category.name}`);
        catalog[category.name] = {};
        
        const categoryPath = path.join(REPO_PATH, category.name);
        const types = scanDirectory(categoryPath, category.name);
        
        for (const type of types) {
          if (type.type === 'dir') {
            console.log(`  📂 Found type: ${type.name}`);
            
            const typePath = path.join(REPO_PATH, category.name, type.name);
            const standards = scanDirectory(typePath, `${category.name}/${type.name}`);
            
            for (const standard of standards) {
              if (standard.type === 'dir') {
                console.log(`    📄 Found standard: ${standard.name}`);
                
                const standardPath = path.join(REPO_PATH, category.name, type.name, standard.name);
                const folders = scanDirectory(standardPath, `${category.name}/${type.name}/${standard.name}`);
                
                const stlFolder = folders.find(f => f.type === 'dir' && (f.name === 'STL' || f.name === 'stl'));
                
                if (stlFolder) {
                  const stlPath = path.join(REPO_PATH, category.name, type.name, standard.name, stlFolder.name);
                  const stlFiles = scanDirectory(stlPath, `${category.name}/${type.name}/${standard.name}/${stlFolder.name}`)
                    .filter(f => f.type === 'file');
                  
                  console.log(`      ✅ Found ${stlFiles.length} STL files`);
                  totalFiles += stlFiles.length;
                  
                  if (!catalog[category.name][type.name]) {
                    catalog[category.name][type.name] = {};
                  }
                  
                  catalog[category.name][type.name][standard.name] = {
                    files: stlFiles.map(f => ({
                      name: f.name,
                      path: f.path,
                      downloadUrl: f.downloadUrl
                    })),
                    path: `${category.name}/${type.name}/${standard.name}/${stlFolder.name}`
                  };
                }
              }
            }
          }
        }
      }
    }
    
    // Save catalog
    const catalogPath = path.join(__dirname, 'catalog.json');
    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
    
    console.log('\n✅ Catalog generated successfully!');
    console.log(`📄 Saved to: ${catalogPath}`);
    console.log('\n📊 Summary:');
    
    let totalCategories = 0;
    let totalTypes = 0;
    
    for (const [category, types] of Object.entries(catalog)) {
      totalCategories++;
      console.log(`\n${category}:`);
      for (const [type, standards] of Object.entries(types)) {
        totalTypes++;
        for (const [standard, data] of Object.entries(standards)) {
          console.log(`  - ${type} (${standard}): ${data.files.length} files`);
        }
      }
    }
    
    console.log(`\n📈 Total: ${totalCategories} categories, ${totalTypes} types, ${totalFiles} files`);
    console.log('\n💡 Copy catalog.json to your GitHub repository');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

buildCatalog();