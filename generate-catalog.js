// generate-catalog.js
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const REPO_OWNER = 'nimageran';
const REPO_NAME = 'fasteners-viewer';

// ✅ AUTO-DETECT PATH: Scans the folder where this file sits
const REPO_PATH = __dirname; 

console.log(`🔍 Scanning repository at: ${REPO_PATH}\n`);

// Helper: Get all files in a directory (non-recursive)
function getDirectFiles(dir, relativePath) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    
    try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            if (item.startsWith('.') || item === 'node_modules') continue;
            
            const fullPath = path.join(dir, item);
            let stats;
            try { stats = fs.statSync(fullPath); } catch (e) { continue; }
            
            if (stats.isFile() && item.toLowerCase().endsWith('.stl')) {
                const fileRelativePath = relativePath ? `${relativePath}/${item}` : item;
                const urlPath = fileRelativePath.replace(/\\/g, '/');
                
                results.push({
                    name: item,
                    path: fileRelativePath,
                    downloadUrl: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${urlPath}`
                });
            }
        }
    } catch (e) { console.error(e); }
    return results;
}

// Helper: Get ALL files in a directory AND its subdirectories (Recursive Flattening)
// This ensures that if you have ISO4762/M6/bolt.stl, it still shows up under ISO4762
function getAllFilesRecursively(dir, relativePath) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    
    try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            if (item.startsWith('.') || item === 'node_modules') continue;
            
            const fullPath = path.join(dir, item);
            const itemRelPath = relativePath ? `${relativePath}/${item}` : item;
            
            let stats;
            try { stats = fs.statSync(fullPath); } catch (e) { continue; }
            
            if (stats.isDirectory()) {
                results = results.concat(getAllFilesRecursively(fullPath, itemRelPath));
            } else if (stats.isFile() && item.toLowerCase().endsWith('.stl')) {
                const urlPath = itemRelPath.replace(/\\/g, '/');
                results.push({
                    name: item,
                    path: itemRelPath,
                    downloadUrl: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${urlPath}`
                });
            }
        }
    } catch (e) { console.error(e); }
    return results;
}

// Helper: Get subdirectories only
function getSubDirectories(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            if (item.startsWith('.') || item === 'node_modules' || item === '.git' || item === '.github') continue;
            const fullPath = path.join(dir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                results.push({ name: item, path: fullPath });
            }
        }
    } catch (e) {}
    return results;
}

function buildCatalog() {
  const catalog = {};
  let totalFiles = 0;
  
  console.log('📂 Starting scan...');

  try {
    // 1. Scan Categories (Level 1)
    const categories = getSubDirectories(REPO_PATH);
    
    for (const cat of categories) {
        catalog[cat.name] = {};
        
        // 2. Scan Types (Level 2)
        const types = getSubDirectories(cat.path);
        
        for (const type of types) {
            catalog[cat.name][type.name] = {};
            
            // A. Check for files directly inside the Type folder
            // If found, we create a "_default" group (index.html handles this)
            const directFiles = getDirectFiles(type.path, `${cat.name}/${type.name}`);
            if (directFiles.length > 0) {
                catalog[cat.name][type.name]['_default'] = {
                    files: directFiles,
                    path: `${cat.name}/${type.name}`
                };
                totalFiles += directFiles.length;
            }

            // B. Check for Standard folders (Level 3)
            // We use recursive scan here so sub-sub-folders (like M6, M8) are collected into the Standard
            const standards = getSubDirectories(type.path);
            for (const std of standards) {
                const stdFiles = getAllFilesRecursively(std.path, `${cat.name}/${type.name}/${std.name}`);
                
                if (stdFiles.length > 0) {
                    catalog[cat.name][type.name][std.name] = {
                        files: stdFiles,
                        path: `${cat.name}/${type.name}/${std.name}`
                    };
                    totalFiles += stdFiles.length;
                }
            }
            
            // Clean up empty types
            if (Object.keys(catalog[cat.name][type.name]).length === 0) {
                delete catalog[cat.name][type.name];
            }
        }
        
        // Clean up empty categories
        if (Object.keys(catalog[cat.name]).length === 0) {
            delete catalog[cat.name];
        }
    }
    
    // Save catalog
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