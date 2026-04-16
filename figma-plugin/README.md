# AI Design News Figma Plugin

A Figma plugin that allows designers to fetch and insert curated AI, design, and development content directly into their Figma projects.

## Features

- **🔍 Search**: Search across 100+ content sources
- **🎯 Filters**: Filter by content type (Articles, Videos, Papers, Releases)
- **📚 Focus Areas**: Filter by topic area:
  - AI/ML Research
  - Design/UX
  - Frontend Development
  - Product/Industry
  - YouTube Creators
  - Podcasts/Newsletters
- **✨ Insert Content**: One-click insertion of content cards into your design
- **📄 Multiple Formats**: Support for videos, articles, papers, and product releases
- **🔄 Auto Sync**: Real-time updates from 100+ curated sources

## Installation

### Option 1: Install from Figma Community (Coming Soon)

### Option 2: Install from GitHub

1. Clone the repository:
   ```bash
   git clone https://github.com/pragmatize360/AI-designnews.git
   cd AI-designnews/figma-plugin
   ```

2. In Figma, go to **Plugins** → **Development** → **Import plugin from manifest**

3. Select `manifest.json` from the `figma-plugin` directory

4. The plugin will appear in your Figma plugins menu

## Usage

### Opening the Plugin

1. In Figma, go to **Plugins** → **Development** → **AI Design News Sync**
2. A panel will open on the right side of your screen

### Searching for Content

1. **Search Box**: Type keywords to search across all sources (e.g., "AI", "React", "UX design")
2. **Filter by Type**: 
   - Select "Articles", "Videos", "Papers", or "Releases"
3. **Filter by Focus Area**: 
   - Choose a specific topic area or view all
4. **Apply Filters**: Filters apply automatically

### Inserting Content

1. Find the content you want to insert
2. Click the **Insert** button
3. A content card will appear in your current Figma frame with:
   - Title
   - Source name
   - Content summary
   - Type badge (color-coded)

### Navigation

- Use **Previous** and **Next** buttons to browse through results
- Results are paginated to 15 items per page

## Supported Content Types

| Type | Badge Color | Description |
|------|------------|-------------|
| Video | Red (#ff4444) | YouTube videos and channels |
| Article | Purple (#667eea) | Blog posts and articles |
| Paper | Blue (#4488ff) | Research papers and whitepapers |
| Release | Orange (#ffaa00) | Product updates and releases |

## API Integration

The plugin uses the following API endpoints:

- **Search**: `GET https://ai-designnews.vercel.app/api/search?q=<query>`
- **Items**: `GET https://ai-designnews.vercel.app/api/items?type=<type>&focusArea=<area>`
- **Filters**: `GET https://ai-designnews.vercel.app/api/filters`

### Rate Limiting

- Personal use: No limit
- High volume: Consider implementing API keys (contact support)

## Development

### Build from Source

1. Install dependencies:
   ```bash
   npm install
   ```

2. Modify source files in `src/`:
   - `code.js` - Plugin logic
   - `ui.html` - User interface
   - `manifest.json` - Plugin configuration

3. Import the updated manifest.json into Figma

### Project Structure

```
figma-plugin/
├── manifest.json      # Plugin configuration
└── src/
    ├── code.js       # Plugin backend logic
    └── ui.html       # Plugin UI (HTML/CSS/JS)
```

## Configuration

Edit `manifest.json` to customize:

```json
{
  "name": "AI Design News Sync",        // Plugin name
  "id": "ai-design-news-sync",          // Unique ID
  "ui": "ui.html",                      // UI file
  "main": "code.js",                    // Background script
  "editorType": ["figma", "figjam"]     // Supported editors
}
```

## Troubleshooting

### Plugin not appearing
- Check that Figma is reloaded
- Verify manifest.json path is correct
- Ensure manifest.json is valid JSON

### API connection errors
- Verify internet connection
- Check that https://ai-designnews.vercel.app is accessible
- Try refreshing the plugin

### Items not inserting
- Make sure you have a frame or page selected
- Check browser console (Figma → Help → Toggle dev tools)
- Verify Figma has document access permissions

## Content Sources

The plugin pulls from 100+ curated sources including:

- **AI/ML Research**: OpenAI, DeepMind, Google AI, ArXiv, Papers With Code
- **Design/UX**: Figma Blog, Nielsen Norman, UX Collective, Smashing Magazine
- **Frontend Dev**: Vercel, React, Chrome Developers, GitHub, Dev.to
- **Product/Industry**: TechCrunch, The Verge, Forbes Tech, MIT Tech Review
- **YouTube Creators**: 50+ channels (Fireship, 3Blue1Brown, DesignCourse, etc.)
- **Podcasts/Newsletters**: Practical AI, Changelog, and more

## Support

- **Issue Tracker**: https://github.com/pragmatize360/AI-designnews/issues
- **Documentation**: https://github.com/pragmatize360/AI-designnews#readme
- **API Status**: https://ai-designnews.vercel.app

## License

MIT License - See repository for details

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

See CONTRIBUTING.md for guidelines.

## Roadmap

- [ ] Figma Community listing
- [ ] Bulk insert multiple items
- [ ] Custom content boards
- [ ] Save and share content collections
- [ ] Offline mode with caching
- [ ] Team workspace sharing
- [ ] Custom API endpoint configuration

## Related

- [AI Design News Web App](https://ai-designnews.vercel.app)
- [GitHub Repository](https://github.com/pragmatize360/AI-designnews)
- [Figma Plugin API Docs](https://figma.com/plugin-docs)
