// generate-catalog.js
// This script scans your GitHub repository and creates a catalog.json file

const fs = require('fs');
const path = require('path');

// Configuration
const REPO_OWNER = 'nimageran';
const REPO_NAME = 'fasteners-viewer';
const BRANCH = 'main';

async function fetchGitHubAPI(url) {
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Fasteners-Catalog-Generator'
    }
  });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function getDirectoryContents(path) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;
  return fetchGitHubAPI(url);
}

async function scanRepository() {
  console.log('🔍 Scanning repository...');
  const catalog = {};
  
  try {
    // Get top-level directories (Bolts, Washers, etc.)
    const topLevel = await getDirectoryContents('');
    
    for (const item of topLevel) {
      if (item.type === 'dir' && !item.name.startsWith('.')) {
        console.log(`📁 Found category: ${item.name}`);
        catalog[item.name] = {};
        
        // Get subcategories (Flat_Head, Socket_Head, etc.)
        const subCategories = await getDirectoryContents(item.name);
        
        for (const subItem of subCategories) {
          if (subItem.type === 'dir') {
            console.log(`  📂 Found type: ${subItem.name}`);
            
            // Get standard folders (ISO10642, ISO4762, etc.)
            const standards = await getDirectoryContents(`${item.name}/${subItem.name}`);
            
            for (const stdItem of standards) {
              if (stdItem.type === 'dir') {
                console.log(`    📄 Found standard: ${stdItem.name}`);
                
                // Get STL folder
                const stlFolders = await getDirectoryContents(`${item.name}/${subItem.name}/${stdItem.name}`);
                const stlFolder = stlFolders.find(f => f.name === 'STL' || f.name === 'stl');
                
                if (stlFolder) {
                  // Get all STL files
                  const stlFiles = await getDirectoryContents(`${item.name}/${subItem.name}/${stdItem.name}/${stlFolder.name}`);
                  const stlList = stlFiles
                    .filter(f => f.name.toLowerCase().endsWith('.stl'))
                    .map(f => ({
                      name: f.name,
                      path: f.path,
                      downloadUrl: f.download_url
                    }));
                  
                  console.log(`      ✅ Found ${stlList.length} STL files`);
                  
                  if (!catalog[item.name][subItem.name]) {
                    catalog[item.name][subItem.name] = {};
                  }
                  
                  catalog[item.name][subItem.name][stdItem.name] = {
                    files: stlList,
                    path: `${item.name}/${subItem.name}/${stdItem.name}/${stlFolder.name}`
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
    let totalFiles = 0;
    
    for (const [category, types] of Object.entries(catalog)) {
      totalCategories++;
      console.log(`\n${category}:`);
      for (const [type, standards] of Object.entries(types)) {
        totalTypes++;
        for (const [standard, data] of Object.entries(standards)) {
          console.log(`  - ${type} (${standard}): ${data.files.length} files`);
          totalFiles += data.files.length;
        }
      }
    }
    
    console.log(`\n📈 Total: ${totalCategories} categories, ${totalTypes} types, ${totalFiles} files`);
    
  } catch (error) {
    console.error('❌ Error scanning repository:', error.message);
    process.exit(1);
  }
}

// Run the scanner
scanRepository();