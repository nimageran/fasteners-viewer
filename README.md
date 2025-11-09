Fasteners 3D Viewer 🔩
A web-based 3D viewer for fastener models (bolts, washers, nuts, etc.) with automatic catalog generation from your GitHub repository.

Show Image
Show Image

🎯 Features
3D Visualization: View STL models of fasteners directly in your browser
Auto-cataloging: Automatically scans your repository and generates a catalog
Organized Navigation: Browse by category, type, and standard
Interactive Viewer: Drag to rotate, scroll to zoom, auto-rotation
Easy Updates: Add new STL files and regenerate catalog with one command
No Installation Required: Works entirely in the browser
🌐 Live Demo
Visit the live viewer at: https://nimageran.github.io/fasteners-viewer/

📁 Repository Structure
fasteners-viewer/
├── index.html              # Main website file
├── catalog.json            # Auto-generated catalog of all STL files
├── README.md               # This file
│
├── Bolts/                  # Bolt category
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
│
└── [Future categories like Washers, Nuts, etc.]
🚀 Quick Start
Prerequisites
Node.js (version 14 or higher) - Download here
A GitHub account
Your STL files organized in the repository
Initial Setup
Clone or download this repository
bash
   git clone https://github.com/nimageran/fasteners-viewer.git
   cd fasteners-viewer
Create a local tools folder (separate from this repo)
bash
   mkdir ~/fasteners-tools
   cd ~/fasteners-tools
Create the catalog generator files Create package.json:
json
   {
     "name": "fasteners-catalog-generator",
     "version": "1.0.0",
     "scripts": {
       "generate": "node generate-catalog.js"
     }
   }
Create generate-catalog.js - Get the code from releases

Generate the catalog
bash
   node generate-catalog.js
Copy generated files to repository
bash
   cp catalog.json /path/to/fasteners-viewer/
Commit and push
bash
   cd /path/to/fasteners-viewer/
   git add catalog.json index.html
   git commit -m "Add 3D viewer and catalog"
   git push
Enable GitHub Pages
Go to repository Settings → Pages
Select main branch as source
Click Save
Wait 1-2 minutes for deployment
Access your viewer
Visit: https://[your-username].github.io/fasteners-viewer/
🔄 Updating the Catalog
Whenever you add new STL files to your repository:

Navigate to your tools folder
bash
   cd ~/fasteners-tools
Regenerate the catalog
bash
   node generate-catalog.js
Copy and push the updated catalog
bash
   cp catalog.json /path/to/fasteners-viewer/
   cd /path/to/fasteners-viewer/
   git add catalog.json
   git commit -m "Update catalog with new models"
   git push
That's it! The website automatically reflects the changes.

📦 Adding New Categories
To add new fastener categories (e.g., Washers, Nuts):

Create the folder structure in your repository
   Washers/
     Flat_Washer/
       ISO7089/
         STL/
           washer_m10.stl
           washer_m12.stl
Regenerate the catalog
bash
   node generate-catalog.js
Push the updated catalog
bash
   git add catalog.json Washers/
   git commit -m "Add washers category"
   git push
The new category will automatically appear in the viewer!

🎨 File Naming Convention
For best results, name your STL files descriptively:

[Type]_[Size]_[Standard].stl

Examples:
- FlatHead_M10x10_ISO10642.stl
- SocketHead_M8x16_ISO4762.stl
- FlatWasher_M10_ISO7089.stl
🛠️ Technical Details
Technologies Used
Three.js (r128) - 3D rendering
Vanilla JavaScript - No frameworks needed
GitHub Pages - Free hosting
GitHub API - Automatic catalog generation
Supported STL Formats
Binary STL
ASCII STL
Browser Compatibility
Chrome/Edge (recommended)
Firefox
Safari
Opera
📝 Folder Structure Rules
The catalog generator expects this structure:

[Category]/
  [Type]/
    [Standard]/
      STL/
        *.stl files
Example:

Bolts/              ← Category
  Flat_Head/        ← Type
    ISO10642/       ← Standard
      STL/          ← STL folder (required)
        file1.stl
        file2.stl
🐛 Troubleshooting
Catalog generation fails
Issue: GitHub API rate limit (60 requests/hour)
Solution: Wait 1 hour or use a personal access token
STL files not loading
Issue: Files not found or incorrect path
Solution: Verify folder structure matches the expected pattern
Check: Files are named with .stl extension (lowercase)
Website not updating
Issue: GitHub Pages cache
Solution: Wait 2-5 minutes, clear browser cache, or do a hard refresh (Ctrl+F5)
3D model appears too small/large
Solution: The viewer auto-scales models. If it looks wrong, check your STL file units
📊 Current Status
✅ Categories: 1 (Bolts)
✅ Types: 2 (Flat Head, Socket Head)
✅ Standards: 2 (ISO10642, ISO4762)
✅ Models: [Auto-generated from catalog.json]
🤝 Contributing
This is a personal tool, but suggestions are welcome!

Fork the repository
Create a feature branch
Make your changes
Submit a pull request
📄 License
MIT License - Feel free to use this for your own projects!

👤 Author
nimageran

GitHub: @nimageran
Repository: fasteners-viewer
🙏 Acknowledgments
Three.js community for the amazing 3D library
GitHub for free hosting via Pages
📮 Contact
For questions or issues, please open an issue on GitHub.

Made with ❤️ for fastener enthusiasts

