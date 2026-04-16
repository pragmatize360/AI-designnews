# Figma Plugin Installation Guide

## Quick Start (2 minutes)

### Step 1: Locate the Plugin Files

The Figma plugin files are in:
```
AI-designnews/figma-plugin/
├── manifest.json
└── src/
    ├── code.js
    └── ui.html
```

### Step 2: Open Figma

1. Open [Figma](https://figma.com) and sign in
2. Create a new design file or open an existing one

### Step 3: Import the Plugin

**Method A: Via Figma Dashboard**

1. Go to **Figma Home** → **Plugins** (left sidebar)
2. Click **"In development"** tab
3. Click **"Create new plugin"** → **"Import plugin from manifest"**
4. Navigate to `AI-designnews/figma-plugin/manifest.json`
5. Click **Open**

**Method B: Via Menu (Figma Editor)**

1. In the Figma editor, go to **Plugins** → **Development** → **Import plugin from manifest**
2. Select `manifest.json` from the `figma-plugin` directory
3. The plugin is now installed!

### Step 4: Run the Plugin

1. In Figma, go to **Plugins** → **Development** → **AI Design News Sync**
2. A panel opens on the right side
3. You're ready to search and insert content!

---

## Detailed Installation

### Prerequisites

- Figma account (free or paid)
- Access to https://ai-designnews.vercel.app
- Modern browser (Chrome, Firefox, Safari, or Edge)

### Installation Steps

#### 1. Clone the Repository (if not already done)

```bash
git clone https://github.com/pragmatize360/AI-designnews.git
cd AI-designnews
```

#### 2. Navigate to Plugin Directory

```bash
cd figma-plugin
```

#### 3. Get the Absolute Path

For Windows:
```powershell
(Resolve-Path manifest.json).Path
```

For macOS/Linux:
```bash
pwd/manifest.json
```

#### 4. Import into Figma

1. Open Figma (https://figma.com)
2. Create or open a design file
3. **Plugins** → **Development** → **Import plugin from manifest**
4. Paste the absolute path to `manifest.json`
5. Click **Import**

---

## Using the Plugin

### First Launch

When you first open the plugin:

1. ✅ You'll see a welcome message: "🤖 AI Design News"
2. ✅ Search box appears
3. ✅ Filter dropdowns are ready

### Basic Workflow

```
1. Search or browse content
   ↓
2. Filter by type (video, article, paper, release)
   ↓
3. Select focus area (AI/ML, Design/UX, etc.)
   ↓
4. Click "Insert" on desired content
   ↓
5. Content card appears in your Figma design
```

### Example Searches

- `"AI design tools"`
- `"React performance"`
- `"UX patterns"`
- `"machine learning"`

---

## Troubleshooting

### Plugin doesn't appear in Development menu

**Solution:**
- Close and reopen Figma
- Verify manifest.json path is correct
- Check that manifest.json is valid JSON (use https://jsonlint.com)

### "Cannot reach API" error

**Solutions:**
1. Check internet connection
2. Verify https://ai-designnews.vercel.app is accessible
3. Refresh the plugin (close and reopen)
4. Check browser console for error details

### Items won't insert

**Solutions:**
1. Make sure you have a frame or page selected in Figma
2. Try creating a new blank frame first
3. Check Figma permissions
4. Reload the page and try again

### Plugin loads but no items showing

**Solutions:**
1. Try adjusting filters
2. Open browser console (F12) for error messages
3. Try a different search query
4. Verify the API is responding: Open https://ai-designnews.vercel.app/api/filters

---

## Development & Customization

### Edit the Plugin

All plugin code is in `src/`:

- **ui.html**: User interface (HTML/CSS)
- **code.js**: Plugin logic and API calls
- **manifest.json**: Plugin metadata

### Changes Take Effect

After editing files:

1. In Figma, go to **Plugins** → **Development** → **AI Design News Sync**
2. Close the panel
3. Reopen the plugin

The changes will take effect!

### Customization Examples

**Change button colors**: Edit `code.js` line ~40
**Change text**: Edit `ui.html` HTML
**Add new filters**: Edit `ui.html` select options

---

## Advanced: Running Locally

### Setup Local Dev Environment

```bash
# Navigate to plugin directory
cd AI-designnews/figma-plugin

# Install any dev tools (optional)
npm install

# Open manifest.json in a text editor to verify
cat manifest.json
```

### Hot Reload Development

1. Keep Figma open with plugin panel
2. Edit files in your code editor
3. Refresh plugin in Figma each time you save
4. See changes immediately

### Debugging

Open browser DevTools while plugin is running:
- **Chrome**: F12 → Console tab
- **Firefox**: F12 → Console tab
- **Safari**: Develop → Show JavaScript Console

---

## Verifying Installation

### Test 1: Basic Search
1. Open the plugin
2. Type "AI" in search box
3. Click "Search"
4. You should see results

### Test 2: Filter by Type
1. Select "Videos" from Type filter
2. Click "Apply"
3. Should show only video content

### Test 3: Insert Content
1. Find any item with "Insert" button
2. Click "Insert"
3. A content card should appear in your design

### Test 4: Navigate Pages
1. If more than 15 results, scroll to bottom
2. Click "Next" button
3. New page of results should load

---

## Uninstalling

To remove the plugin:

1. In Figma, go to **Plugins** → **Development** → **AI Design News Sync**
2. Right-click on the plugin name
3. Select **Remove Plugin**

Or manage from Figma Home:
1. Go to Figma Home
2. Click **Plugins**
3. Find the plugin and click ⋯ (more options)
4. Select **Remove**

---

## Support & Resources

| Resource | Link |
|----------|------|
| **API Status** | https://ai-designnews.vercel.app |
| **GitHub Issues** | https://github.com/pragmatize360/AI-designnews/issues |
| **Figma Plugin Docs** | https://figma.com/plugin-docs |
| **Plugin Community** | https://figma.com/community/plugins |

## Next Steps

✅ **Installation Complete!**

- [ ] Try the basic search
- [ ] Insert your first content card
- [ ] Explore different focus areas
- [ ] Share feedback or report issues
- [ ] Star the repository ⭐

Enjoy! 🚀
