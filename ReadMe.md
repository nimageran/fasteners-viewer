# Summary:
Put the two files, **generate-catalog.js** and **package-json.json**, inside the folder **C:\fasteners-tools**, then open the command prompt and type "node generate-catalog.js" then you'll see a new generated file, **catalog.json**, in the same folder. Then, import that file into the repository. 
# Fasteners 3D Viewer 🔩

A simple website to view your 3D fastener models (bolts, washers, nuts, etc.) in your web browser.

**Your Website**: https://nimageran.github.io/fasteners-viewer/

---

## 🎯 What This Does

Click on any fastener in your collection → See it in 3D → Rotate it, zoom it, inspect it.

No special software needed. Just a web browser.

---

## ✅ Initial Setup (Do This Once)

### Part 1: Install Node.js (5 minutes)

1. Go to https://nodejs.org/
2. Click the big green "Download" button (LTS version)
3. Run the downloaded installer
4. Keep clicking "Next" until done
5. **Restart your computer** (important!)

### Part 2: Create Your Tool Folder (2 minutes)

1. Open File Explorer
2. Go to `C:\`
3. Create a new folder called `fasteners-tools`
4. You now have: `C:\fasteners-tools`

### Part 3: Create the Files in VS Code (3 minutes)

1. **Open VS Code**
2. Click **File → Open Folder**
3. Select `C:\fasteners-tools`
4. Click **Select Folder**

Now create two files:

**File 1: generate-catalog.js**
1. Right-click in the file list (left side) → **New File**
2. Name it: `generate-catalog.js`
3. Copy the entire code from the artifact called "generate-catalog.js - GitHub Repo Scanner" (scroll up in our conversation)
4. Paste it into the file
5. Press **Ctrl+S** to save

**File 2: package.json**
1. Right-click → **New File**
2. Name it: `package.json`
3. Copy this code:
```json
{
  "name": "fasteners-catalog-generator",
  "version": "1.0.0",
  "scripts": {
    "generate": "node generate-catalog.js"
  }
}
```
4. Paste it
5. Press **Ctrl+S** to save

### Part 4: Generate Your First Catalog (2 minutes)

1. Press **Windows Key + R**
2. Type `cmd` and press Enter
3. Type these commands:
```
cd C:\fasteners-tools
node generate-catalog.js
```

You should see:
```
🔍 Scanning repository...
📁 Found category: Bolts
  📂 Found type: Flat_Head
    📄 Found standard: ISO10642
      ✅ Found 8 STL files
✅ Catalog generated successfully!
```

4. **A new file `catalog.json` was created!** Check your folder - you'll see it.

### Part 5: Upload Files to GitHub (3 minutes)

1. **Open your web browser**
2. Go to: https://github.com/nimageran/fasteners-viewer
3. Click **"Add file"** button (top right)
4. Click **"Upload files"**
5. **Drag these 2 files** from `C:\fasteners-tools` into the browser:
   - `catalog.json`
   - Also drag the `index.html` (from the artifact "Fasteners 3D Viewer (Complete)")
6. Scroll down, type "Initial setup" in the box
7. Click **"Commit changes"**

### Part 6: Turn On Your Website (2 minutes)

1. In your GitHub repository, click **"Settings"** (top menu)
2. Click **"Pages"** (left sidebar, scroll down)
3. Under "Branch", click the dropdown and select **"main"**
4. Click **"Save"**
5. **Wait 2-3 minutes** for GitHub to process

### Part 7: Visit Your Website! 🎉

Open your browser and go to:
```
https://nimageran.github.io/fasteners-viewer/
```

You should see:
- A sidebar on the left with "Bolts" category
- Click on any file name
- See it in 3D on the right!

**🎊 Congratulations! Your viewer is working!**

---

## 🔄 How to Add New STL Files (Takes 1 Minute)

Whenever you upload new STL files to your GitHub repository:

### Step 1: Add STL Files to GitHub
1. Go to https://github.com/nimageran/fasteners-viewer
2. Navigate to the right folder (like `Bolts/Socket_Head/ISO4762/STL/`)
3. Click **"Add file" → "Upload files"**
4. Drag your new STL files
5. Click "Commit changes"

### Step 2: Update the Catalog
1. Press **Windows Key + R**
2. Type `cmd` and press Enter
3. Type:
```
cd C:\fasteners-tools
node generate-catalog.js
```
4. Wait for "✅ Catalog generated successfully!"

### Step 3: Upload New Catalog
1. Go to https://github.com/nimageran/fasteners-viewer
2. Click on `catalog.json` file
3. Click the **pencil icon** (Edit this file)
4. Delete everything in there
5. Open `C:\fasteners-tools\catalog.json` in Notepad
6. Copy everything
7. Paste into GitHub
8. Scroll down, click **"Commit changes"**

### Step 4: Check Your Website
1. Wait 1 minute
2. Go to your website: https://nimageran.github.io/fasteners-viewer/
3. Press **Ctrl + F5** (hard refresh)
4. Your new files appear!

---

## 📦 How to Add New Categories (Like Washers or Nuts)

Want to add washers, nuts, spacers, or other fastener types?

### Step 1: Create Folder Structure in GitHub
1. Go to https://github.com/nimageran/fasteners-viewer
2. Click **"Add file" → "Create new file"**
3. In the file name box, type: `Washers/Flat_Washer/ISO7089/STL/placeholder.txt`
4. In the file content, type: `temp`
5. Click **"Commit new file"**
6. Now upload your STL files to that `STL` folder
7. Delete the `placeholder.txt` file (you don't need it anymore)

### Step 2: Update Catalog (Same as Before)
```
cd C:\fasteners-tools
node generate-catalog.js
```

### Step 3: Upload New Catalog to GitHub
(Same as Step 3 in the section above)

### Step 4: Done!
Your website now shows the new "Washers" category automatically!

---

## 📁 Folder Structure

### On Your Computer (C:\fasteners-tools):
```
C:\fasteners-tools\
├── generate-catalog.js    (the scanner script)
├── package.json           (settings)
└── catalog.json           (gets created automatically)
```

### On GitHub:
```
fasteners-viewer/
├── index.html             (your website)
├── catalog.json           (list of all files)
├── README.md              (this file)
│
├── Bolts/                 (category)
│   ├── Flat_Head/         (type)
│   │   └── ISO10642/      (standard)
│   │       └── STL/       (folder name must be "STL")
│   │           ├── FlatHead_M10x10_ISO10642.stl
│   │           ├── FlatHead_M10x12_ISO10642.stl
│   │           └── ...
│   └── Socket_Head/
│       └── ISO4762/
│           └── STL/
│               └── ...
│
└── Washers/               (future category)
    └── Flat_Washer/
        └── ISO7089/
            └── STL/
                └── ...
```

**Important**: The folder must be named exactly `STL` (all capitals) or `stl` (all lowercase).

---

## ❓ Common Problems & Solutions

### Problem 1: "node is not recognized"
**What happened**: Node.js isn't installed or you didn't restart your computer.

**Fix**:
1. Install Node.js from https://nodejs.org/
2. Restart your computer
3. Try again

### Problem 2: "Cannot find module generate-catalog.js"
**What happened**: The file isn't in the right folder or has wrong extension.

**Fix**:
1. Open File Explorer → `C:\fasteners-tools`
2. Click **View** → Check "File name extensions"
3. Make sure you see `generate-catalog.js` (not `generate-catalog.js.txt`)
4. If it says `.txt`, rename it and remove the `.txt` part

### Problem 3: Website shows old files
**What happened**: Browser cached the old version.

**Fix**:
- Press **Ctrl + F5** (hard refresh)
- Or wait 2-5 minutes for GitHub to update
- Or try in a private/incognito browser window

### Problem 4: Website says "404 Not Found"
**What happened**: GitHub Pages isn't set up correctly.

**Fix**:
1. Go to repository Settings → Pages
2. Make sure "main" branch is selected
3. Make sure `index.html` is in the root of your repository (not in a subfolder)
4. Wait 2-5 minutes

### Problem 5: 3D model won't load
**What happened**: File path is wrong or file is corrupted.

**Fix**:
1. Make sure folder structure is: `Category/Type/Standard/STL/file.stl`
2. Make sure the folder is named `STL` exactly
3. Make sure files end with `.stl` (lowercase)
4. Check file isn't corrupted by opening it in another 3D viewer

### Problem 6: Catalog generation says "GitHub API error"
**What happened**: You hit the rate limit (60 requests per hour).

**Fix**:
- Wait 1 hour and try again
- The scanner makes many requests, so this can happen with large repositories

---

## 🎯 Quick Command Reference

**Generate catalog:**
```
cd C:\fasteners-tools
node generate-catalog.js
```

**Your website URL:**
```
https://nimageran.github.io/fasteners-viewer/
```

---

## 💡 Good to Know

- **The catalog.json file is small** (usually under 100 KB even with hundreds of files)
- **STL files stay on GitHub** - they don't download to your computer
- **The website loads STL files directly** from GitHub when someone clicks them
- **You only run the generator when YOU add files** - not automatically
- **The old catalog gets replaced** - you don't need to delete anything
- **You never edit index.html** - it reads from catalog.json automatically
- **File names can be anything** - but descriptive names help (like `FlatHead_M10x20.stl`)

---

## 📊 What You Have

Right now you have:
- ✅ A working 3D viewer website
- ✅ All your bolts organized and clickable
- ✅ Easy way to add more files anytime
- ✅ Free hosting (GitHub Pages costs $0)
- ✅ No maintenance needed (unless you add files)

---

## 🔧 Using the Website

Once your website is live:

1. **Click on "Bolts"** in the sidebar to expand
2. **Click on a file name** (like "FlatHead_M10x10_ISO10642.stl")
3. **The 3D model loads** on the right side
4. **Drag with your mouse** to rotate the model
5. **Scroll** to zoom in/out
6. **Model auto-rotates** when you stop dragging

---

## 📝 Tips for Success

1. **Save this README** - you might forget these steps in 6 months!
2. **Keep file names descriptive** - helps you find things later
3. **Follow the folder structure exactly** - Category/Type/Standard/STL/
4. **The STL folder must be named "STL"** - the script looks for this exact name
5. **Test with one file first** - before uploading 100 files
6. **Bookmark your website** - for easy access
7. **Keep a backup** of your STL files somewhere safe

---

## 🆘 Still Having Problems?

1. **Check Command Prompt output** - it shows helpful error messages
2. **Open your website and press F12** - look at the Console tab for errors
3. **Check your folder names** - they must match: Category/Type/Standard/STL/
4. **Verify catalog.json is in GitHub** - it must be in the root folder
5. **Wait longer** - GitHub Pages can take 5 minutes to update after changes
6. **Clear your browser cache** - press Ctrl+F5 for hard refresh

---

**Made by nimageran 🔩 | Personal tool for viewing fastener 3D models**
