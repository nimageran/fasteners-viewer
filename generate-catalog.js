// generate-catalog-adaptive.js
// Handles both simple (Category/Type) and complex (Category/Type/Standard/STL) structures
const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'nimageran';
const REPO_NAME = 'fasteners-viewer';
const REPO_PATH = 'C:/Users/nimag/OneDrive/Documents/GitHub/fasteners-viewer';

console.log('🔍 Scanning repository with adaptive structure detection...\n');

if (!fs.existsSync(REPO_PATH)) {
  console.error(`❌ Repository not found at: ${REPO_PATH}`);
  process.exit(1);
}

// Find STL files in a directory (not recursive)
function findSTLFilesInDir(dir, relativePath) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isFile() && item.toLowerCase().endsWith('.stl')) {
        files.push({
          name: item,
          path: relativePath ? `${relativePath}/${item}` : item,
          downloadUrl: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${relativePath ? relativePath + '/' : ''}${item}`
        });
      }
    }
  } catch (error) {
    console.error(`Error reading ${dir}:`, error.message);
  }
  
  return files;
}

// Recursively search for STL files in subdirectories
function searchForSTLs(dir, relativePath, maxDepth = 3, currentDepth = 0) {
  const result = {
    files: [],
    subdirs: []
  };
  
  if (currentDepth >= maxDepth) return result;
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      // Skip hidden and system folders
      if (item.startsWith('.') || item === 'node_modules') continue;
      
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        result.subdirs.push({
          name: item,
          path: relativePath ? `${relativePath}/${item}` : item,
          fullPath: fullPath
        });
      } else if (item.toLowerCase().endsWith('.stl')) {
        result.files.push({
          name: item,
          path: relativePath ? `${relativePath}/${item}` : item,
          downloadUrl: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${relativePath ? relativePath + '/' : ''}${item}`
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
  
  try {
    // Level 1: Get categories (Rings, Bolts, Nuts, etc.)
    console.log('📂 Scanning categories...\n');
    const level1 = searchForSTLs(REPO_PATH, '', 1, 0);
    
    for (const category of level1.subdirs) {
      console.log(`\n📁 Category: ${category.name}`);
      catalog[category.name] = {};
      
      // Level 2: Get types (EClip, DIN, ISO, etc.)
      const level2 = searchForSTLs(category.fullPath, category.name, 1, 0);
      
      // Check if STL files are directly in category folder
      if (level2.files.length > 0) {
        console.log(`  ✅ Found ${level2.files.length} STL files in category root`);
        catalog[category.name]['_root'] = {
          files: level2.files,
          path: category.name
        };
        totalFiles += level2.files.length;
      }
      
      for (const type of level2.subdirs) {
        console.log(`  📂 Type: ${type.name}`);
        
        // Level 3: Check for STL files or more subdirs
        const level3 = searchForSTLs(type.fullPath, type.path, 2, 0);
        
        // CASE 1: STL files directly in type folder (Rings/EClip/*.stl)
        if (level3.files.length > 0) {
          console.log(`    ✅ Found ${level3.files.length} STL files directly in type folder`);
          
          if (!catalog[category.name][type.name]) {
            catalog[category.name][type.name] = {};
          }
          
          catalog[category.name][type.name]['_default'] = {
            files: level3.files,
            path: type.path
          };
          totalFiles += level3.files.length;
        }
        
        // CASE 2: Has subdirectories (standards or STL folders)
        if (level3.subdirs.length > 0) {
          for (const standard of level3.subdirs) {
            // Check if this is an STL folder or a standard folder
            const level4 = searchForSTLs(standard.fullPath, standard.path, 1, 0);
            
            if (level4.files.length > 0) {
              console.log(`    ✅ Found ${level4.files.length} STL files in ${standard.name}`);
              
              if (!catalog[category.name][type.name]) {
                catalog[category.name][type.name] = {};
              }
              
              catalog[category.name][type.name][standard.name] = {
                files: level4.files,
                path: standard.path
              };
              totalFiles += level4.files.length;
            }
            
            // Check one more level deep (for Standard/STL/ structure)
            if (level4.subdirs.length > 0) {
              for (const subfolder of level4.subdirs) {
                const level5 = searchForSTLs(subfolder.fullPath, subfolder.path, 1, 0);
                
                if (level5.files.length > 0) {
                  console.log(`    ✅ Found ${level5.files.length} STL files in ${standard.name}/${subfolder.name}`);
                  
                  if (!catalog[category.name][type.name]) {
                    catalog[category.name][type.name] = {};
                  }
                  
                  catalog[category.name][type.name][standard.name] = {
                    files: level5.files,
                    path: subfolder.path
                  };
                  totalFiles += level5.files.length;
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
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Catalog generated successfully!');
    console.log('='.repeat(60));
    console.log(`📄 Saved to: ${catalogPath}`);
    console.log(`📈 Total STL files: ${totalFiles}`);
    
    console.log('\n📊 Summary:');
    let totalCategories = 0;
    let totalTypes = 0;
    let totalStandards = 0;
    
    for (const [category, types] of Object.entries(catalog)) {
      totalCategories++;
      console.log(`\n${category}:`);
      
      for (const [type, standards] of Object.entries(types)) {
        totalTypes++;
        
        for (const [standard, data] of Object.entries(standards)) {
          totalStandards++;
          const standardDisplay = standard === '_default' ? '(direct files)' : 
                                 standard === '_root' ? '(root files)' : standard;
          console.log(`  - ${type} ${standardDisplay}: ${data.files.length} files`);
        }
      }
    }
    
    console.log(`\n📈 Total: ${totalCategories} categories, ${totalTypes} types, ${totalStandards} groups, ${totalFiles} files`);
    console.log('\n💡 Copy catalog.json to your GitHub repository');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

buildCatalog();