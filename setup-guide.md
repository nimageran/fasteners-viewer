# Fasteners 3D Viewer - Setup Guide

## 📋 What You'll Have

A beautiful web-based 3D viewer that:
- ✅ Automatically displays all your STL files from GitHub
- ✅ Shows them organized by Category > Type > Standard
- ✅ Lets you click any file to view it in 3D
- ✅ Updates when you run one simple command

---

## 🚀 One-Time Setup (5 minutes)

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download and install the LTS version
3. Verify installation by opening terminal/command prompt and typing:
   ```bash
   node --version
   ```

### Step 2: Create Project Files

Create a new folder on your computer (anywhere you like), for example:
```
C:\Projects\fasteners-viewer-local
```

Inside this folder, create these 3 files:

#### File 1: `package.json`
```json
{
  "name": "fasteners-catalog-generator",
  "version": "1.0.0",
  "scripts": {
    "generate": "node generate-catalog.js"
  }
}
```

#### File 2: `generate-catalog.js`
Copy the entire code from the "generate-catalog.js" artifact I created above.

#### File 3: `index.html`
Copy the entire code from the "Fasteners 3D Viewer (Complete)" artifact I created above.

### Step 3: Generate Your First Catalog

Open terminal/command prompt in your project folder and run:
```bash
node generate-catalog.js
```

This will:
- ✅ Scan your GitHub repository
- ✅ Find all folders and STL files
- ✅ Create `catalog.json` automatically

You should see output like:
```
🔍 Scanning repository...
📁 Found category: Bolts
  📂 Found type: Flat_Head
    📄 Found standard: ISO10642
      ✅ Found 8 STL files
  📂 Found type: Socket_Head
    📄 Found standard: ISO4762
      ✅ Found 6 STL files

✅ Catalog generated successfully!
📊 Total: 1 categories, 2 types, 14 files
```

### Step 4: Add Files to GitHub

1. Copy `catalog.json` and `index.html` to your GitHub repository
2. Commit and push:
   ```bash
   git add catalog.json index.html
   git commit -m "Add fasteners viewer"
   git push
   ```

### Step 5: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** > **Pages**
3. Under "Source", select `main` branch
4. Click **Save**
5. Wait 1-2 minutes

Your website will be live at:
```
https://nimageran.github.io/fasteners-viewer/
```

---

## 🔄 Future Updates (30 seconds each time)

Whenever you add new STL files to your GitHub repo:

1. Open terminal in your local project folder
2. Run:
   ```bash
   node generate-catalog.js
   ```
3. Copy the new `catalog.json` to your GitHub repo
4. Commit and push:
   ```bash
   git add catalog.json
   git commit -m "Update catalog"
   git push
   ```

Done! Your website automatically shows the new files.

---

## 📁 Expected Repository Structure

Your GitHub repo should look like this:

```
fasteners-viewer/
├── index.html          (your website)
├── catalog.json        (auto-generated list of files)
├── Bolts/
│   ├── Flat_Head/
│   │   └── ISO10642/
│   │       └── STL/
│   │           ├── FlatHead_M10x10_ISO10642.stl
│   │           ├── FlatHead_M10x12_ISO10642.stl
│   │           └── ...
│   └── Socket_Head/
│       └── ISO4762/
│           └── STL/
│               ├── SocketHead_M8x16_ISO4762.stl
│               └── ...
└── Washers/            (add in future)
    └── Flat_Washer/
        └── ISO7089/
            └── STL/
                └── ...
```

---

## ✨ Adding New Categories

To add Washers, Nuts, etc. in the future:

1. Create folder structure in GitHub:
   ```
   Washers/
     Flat_Washer/
       ISO7089/
         STL/
           washer_m10.stl
           washer_m12.stl
   ```

2. Run the generator:
   ```bash
   node generate-catalog.js
   ```

3. Push updated `catalog.json` to GitHub

That's it! The website automatically shows the new category.

---

## 🛠️ Troubleshooting

**Problem: "GitHub API error: 403"**
- You've hit the rate limit (60 requests/hour)
- Wait 1 hour and try again
- Or use a GitHub Personal Access Token (see advanced setup)

**Problem: "Catalog not found"**
- Make sure `catalog.json` is in the same folder as `index.html`
- Check that you pushed it to GitHub
- Wait 1-2 minutes for GitHub Pages to update

**Problem: STL files not loading**
- Check that files are actually in the STL folder
- Make sure file names end with `.stl`
- Check browser console (F12) for errors

**Problem: Website not showing on GitHub Pages**
- Wait 2-5 minutes after enabling Pages
- Make sure `index.html` is in the root of your repo
- Check Settings > Pages for the URL

---

## 🎯 Quick Reference

**Generate catalog:**
```bash
node generate-catalog.js
```

**Your website URL:**
```
https://nimageran.github.io/fasteners-viewer/
```

**Update workflow:**
1. Add STL files to GitHub
2. Run `node generate-catalog.js`
3. Push `catalog.json` to GitHub
4. Done!

---

## 💡 Tips

- The website loads actual STL files from GitHub, so it works with any valid STL file
- You can reorganize folders anytime - just regenerate the catalog
- The 3D viewer supports both ASCII and binary STL formats
- Models auto-rotate, drag to manually rotate, scroll to zoom
- The catalog.json file is small (usually < 50KB) even with hundreds of files

---

Need help? Check the browser console (F12) for detailed error messages!