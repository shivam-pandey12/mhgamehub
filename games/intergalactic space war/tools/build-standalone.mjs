import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const entryFile = path.resolve(projectRoot, "src/main.js");
const threeSourceFile = path.resolve(projectRoot, "node_modules/three/build/three.cjs");
const outputDir = path.resolve(projectRoot, "standalone");

const moduleRecords = new Map();
const orderedModules = [];

function toProjectKey(absolutePath) {
  return path.relative(projectRoot, absolutePath).split(path.sep).join("/");
}

function resolveImport(importerPath, specifier) {
  return path.resolve(path.dirname(importerPath), specifier);
}

function parseNamedImports(specifier) {
  return specifier
    .replace(/^\{\s*|\s*\}$/g, "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const aliasMatch = part.match(/^([A-Za-z0-9_$]+)\s+as\s+([A-Za-z0-9_$]+)$/);

      if (aliasMatch) {
        return `${aliasMatch[1]}: ${aliasMatch[2]}`;
      }

      return part;
    });
}

function transformImports(code, absolutePath) {
  const importPattern = /^import\s+(.+?)\s+from\s+["'](.+?)["'];?\s*$/gm;
  const dependencies = [];
  const injections = [];
  let transformedCode = code.replace(importPattern, (fullMatch, bindings, source) => {
    const trimmedBindings = bindings.trim();

    if (source === "three") {
      if (trimmedBindings.startsWith("* as ")) {
        injections.push(`const ${trimmedBindings.slice(5).trim()} = globalThis.THREE;`);
      } else {
        throw new Error(`Unsupported Three.js import in ${toProjectKey(absolutePath)}: ${fullMatch}`);
      }

      return "";
    }

    const dependencyPath = resolveImport(absolutePath, source);
    const dependencyKey = toProjectKey(dependencyPath);
    dependencies.push(dependencyPath);

    if (trimmedBindings.startsWith("{")) {
      const namedImports = parseNamedImports(trimmedBindings).join(", ");
      injections.push(`const { ${namedImports} } = __bundle["${dependencyKey}"];`);
      return "";
    }

    if (trimmedBindings.startsWith("* as ")) {
      injections.push(`const ${trimmedBindings.slice(5).trim()} = __bundle["${dependencyKey}"];`);
      return "";
    }

    throw new Error(`Unsupported import shape in ${toProjectKey(absolutePath)}: ${fullMatch}`);
  });

  transformedCode = transformedCode.replace(/^\s*$/gm, "");

  return {
    code: transformedCode.trim(),
    dependencies,
    injections,
  };
}

function transformExports(code) {
  const exportNames = [];
  let transformedCode = code;

  transformedCode = transformedCode.replace(/^export\s+class\s+([A-Za-z0-9_$]+)/gm, (match, exportName) => {
    exportNames.push(exportName);
    return `class ${exportName}`;
  });

  transformedCode = transformedCode.replace(/^export\s+function\s+([A-Za-z0-9_$]+)/gm, (match, exportName) => {
    exportNames.push(exportName);
    return `function ${exportName}`;
  });

  transformedCode = transformedCode.replace(/^export\s+const\s+([A-Za-z0-9_$]+)/gm, (match, exportName) => {
    exportNames.push(exportName);
    return `const ${exportName}`;
  });

  return {
    code: transformedCode,
    exportNames,
  };
}

async function collectModule(absolutePath) {
  if (moduleRecords.has(absolutePath)) {
    return;
  }

  const source = await readFile(absolutePath, "utf8");
  const { code: withoutImports, dependencies, injections } = transformImports(source, absolutePath);

  for (const dependencyPath of dependencies) {
    await collectModule(dependencyPath);
  }

  const { code: transformedCode, exportNames } = transformExports(withoutImports);
  const record = {
    absolutePath,
    projectKey: toProjectKey(absolutePath),
    injections,
    transformedCode,
    exportNames,
  };

  moduleRecords.set(absolutePath, record);
  orderedModules.push(record);
}

function createModuleWrapper(record) {
  const exportObject = record.exportNames.length
    ? `{ ${record.exportNames.join(", ")} }`
    : "{}";
  const injectionBlock = record.injections.length ? `${record.injections.join("\n")}\n` : "";

  return `(() => {\n${injectionBlock}${record.transformedCode}\n__bundle["${record.projectKey}"] = ${exportObject};\n})();`;
}

async function buildStandaloneThree() {
  const threeSource = await readFile(threeSourceFile, "utf8");
  const wrappedThree = `(() => {\nconst module = { exports: {} };\nconst exports = module.exports;\n${threeSource}\nglobalThis.THREE = module.exports;\n})();\n`;
  await writeFile(path.join(outputDir, "three.global.js"), wrappedThree, "utf8");
}

async function buildStandaloneGame() {
  await collectModule(entryFile);
  const bundleOutput = `(() => {\nconst __bundle = Object.create(null);\n${orderedModules.map(createModuleWrapper).join("\n\n")}\n})();\n`;
  await writeFile(path.join(outputDir, "game.standalone.js"), bundleOutput, "utf8");
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await buildStandaloneThree();
  await buildStandaloneGame();
  console.log("Standalone bundle generated in ./standalone");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
