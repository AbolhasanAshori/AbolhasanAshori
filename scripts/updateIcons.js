const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "assets");
const excludedDirs = ["obsidian"];
const size = "32px";

function processSvgFile(filePath) {
  try {
    // Skip if the file is in an excluded directory
    if (
      excludedDirs.some((dir) => filePath.includes(path.sep + dir + path.sep))
    ) {
      console.log(`Skipping excluded file: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, "utf8");

    // Check if width and height already exist
    if (content.includes("width=") && content.includes("height=")) {
      console.log(`Skipping already processed file: ${filePath}`);
      return;
    }

    // Add width and height to the SVG tag
    const updatedContent = content.replace(
      /<svg([^>]*)>/,
      `<svg$1 width="${size}" height="${size}">`
    );

    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(directory, file.name);

    if (file.isDirectory()) {
      // Skip excluded directories
      if (!excludedDirs.includes(file.name)) {
        processDirectory(fullPath);
      }
    } else if (file.name.toLowerCase().endsWith(".svg")) {
      processSvgFile(fullPath);
    }
  }
}

// Start processing from the assets directory
processDirectory(assetsDir);
console.log("SVG processing completed!");
