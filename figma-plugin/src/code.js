const API_BASE = "https://ai-designnews.vercel.app/api";

// Initialize the plugin
figma.showUI(__html__, { width: 480, height: 640 });

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "fetch-items") {
    try {
      const { contentType, focusArea, page, limit, query } = msg;
      
      let url = `${API_BASE}/items?page=${page || 1}&limit=${limit || 20}`;
      
      if (contentType && contentType !== "all") {
        url += `&type=${contentType}`;
      }
      
      if (focusArea && focusArea !== "all") {
        url += `&focusArea=${focusArea}`;
      }
      
      if (query) {
        url = `${API_BASE}/search?q=${encodeURIComponent(query)}&page=${page || 1}&limit=${limit || 20}`;
        if (focusArea && focusArea !== "all") {
          url += `&focusArea=${focusArea}`;
        }
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      figma.ui.postMessage({
        type: "items-loaded",
        data: data,
      });
    } catch (error) {
      figma.ui.postMessage({
        type: "error",
        message: error.message,
      });
    }
  } else if (msg.type === "fetch-filters") {
    try {
      const response = await fetch(`${API_BASE}/filters`);
      const data = await response.json();
      
      figma.ui.postMessage({
        type: "filters-loaded",
        data: data,
      });
    } catch (error) {
      figma.ui.postMessage({
        type: "error",
        message: error.message,
      });
    }
  } else if (msg.type === "insert-item") {
    try {
      const { item } = msg;
      
      // Create a frame to hold the content
      const frame = figma.createFrame();
      frame.name = `📰 ${item.title}`;
      frame.layoutMode = "VERTICAL";
      frame.primaryAxisAlignItems = "MIN";
      frame.counterAxisAlignItems = "MIN";
      frame.itemSpacing = 10;
      frame.paddingLeft = 12;
      frame.paddingRight = 12;
      frame.paddingTop = 12;
      frame.paddingBottom = 12;
      frame.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.98 } }];
      frame.cornerRadius = 8;
      frame.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
      frame.strokeWeight = 1;
      frame.resize(320, 180);
      
      // Title
      const titleText = figma.createText();
      titleText.characters = item.title.substring(0, 60) + (item.title.length > 60 ? "..." : "");
      titleText.fontSize = 12;
      titleText.fontName = { family: "Helvetica Neue", style: "Bold" };
      titleText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
      titleText.textTruncation = "ENDING";
      frame.appendChild(titleText);
      
      // Source
      const sourceText = figma.createText();
      sourceText.characters = `From: ${item.source?.name || "Unknown"}`;
      sourceText.fontSize = 10;
      sourceText.fontName = { family: "Helvetica Neue", style: "Regular" };
      sourceText.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
      frame.appendChild(sourceText);
      
      // Summary (if available)
      if (item.summary) {
        const summaryText = figma.createText();
        summaryText.characters = item.summary.substring(0, 100) + (item.summary.length > 100 ? "..." : "");
        summaryText.fontSize = 9;
        summaryText.fontName = { family: "Helvetica Neue", style: "Regular" };
        summaryText.fills = [{ type: "SOLID", color: { r: 0.3, g: 0.3, b: 0.3 } }];
        summaryText.textTruncation = "ENDING";
        frame.appendChild(summaryText);
      }
      
      // Type badge
      const typeText = figma.createText();
      typeText.characters = item.type?.toUpperCase() || "ARTICLE";
      typeText.fontSize = 8;
      typeText.fontName = { family: "Helvetica Neue", style: "Bold" };
      typeText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
      
      const typeBg = figma.createRectangle();
      typeBg.fills = [{ 
        type: "SOLID", 
        color: item.type === "video" 
          ? { r: 0.9, g: 0.1, b: 0.1 } 
          : item.type === "paper"
          ? { r: 0.0, g: 0.5, b: 1.0 }
          : { r: 0.2, g: 0.6, b: 0.2 }
      }];
      typeBg.cornerRadius = 4;
      typeBg.resize(60, 16);
      
      const typeGroup = figma.group([typeBg, typeText], frame);
      typeGroup.layoutMode = "HORIZONTAL";
      typeGroup.primaryAxisAlignItems = "CENTER";
      typeGroup.counterAxisAlignItems = "CENTER";
      
      figma.ui.postMessage({
        type: "item-inserted",
        message: `Added "${item.title}"`,
      });
    } catch (error) {
      figma.ui.postMessage({
        type: "error",
        message: error.message,
      });
    }
  }
};

// Notify UI that plugin is ready
figma.ui.postMessage({
  type: "plugin-ready",
});
