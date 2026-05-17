import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { build } from "vite";

const ROOT_DIR = process.cwd();
const SOURCE_HTML = resolve(ROOT_DIR, "index.html");
const TEMP_DIR = resolve(ROOT_DIR, ".static-build-temp");
const OUTPUT_DIR = resolve(ROOT_DIR, "dist");
const OUTPUT_HTML = resolve(OUTPUT_DIR, "index.html");

async function main() {
  await rm(TEMP_DIR, { force: true, recursive: true });

  await build({
    configFile: false,
    publicDir: false,
    root: ROOT_DIR,
    build: {
      copyPublicDir: false,
      cssCodeSplit: false,
      emptyOutDir: true,
      lib: {
        entry: resolve(ROOT_DIR, "main.js"),
        fileName: () => "game-bundle.js",
        formats: ["iife"],
        name: "BattlefieldCodexGame",
      },
      outDir: TEMP_DIR,
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name][extname]",
        },
      },
    },
  });

  const builtFiles = await collectFiles(TEMP_DIR);
  const jsFile = builtFiles.find((file) => file.endsWith(".js"));
  const cssFile = builtFiles.find((file) => file.endsWith(".css"));

  if (!jsFile) {
    throw new Error("Static bundle build failed: no JavaScript bundle was generated.");
  }

  const [sourceHtml, jsBundle, cssBundle] = await Promise.all([
    readFile(SOURCE_HTML, "utf8"),
    readFile(jsFile, "utf8"),
    cssFile ? readFile(cssFile, "utf8") : Promise.resolve(""),
  ]);

  const htmlWithoutEntry = sourceHtml.replace(
    /\s*<script type="module" src="\/main\.js"><\/script>\s*$/m,
    "\n",
  );

  const finalHtml = htmlWithoutEntry
    .replace(
      "</head>",
      () => `${cssBundle ? `    <style>\n${escapeInlineStyle(cssBundle)}\n    </style>\n` : ""}  </head>`,
    )
    .replace(
      "</body>",
      () => `    <script>\n${escapeInlineScript(jsBundle)}\n    </script>\n  </body>`,
    );

  await rm(OUTPUT_DIR, { force: true, recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_HTML, finalHtml, "utf8");
  await rm(TEMP_DIR, { force: true, recursive: true });

  console.log(`Offline static build written to ${relative(ROOT_DIR, OUTPUT_HTML)}`);
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function escapeInlineScript(source) {
  return source.replace(/<\/script/gi, "<\\/script");
}

function escapeInlineStyle(source) {
  return source.replace(/<\/style/gi, "<\\/style");
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : String(error));
  await rm(TEMP_DIR, { force: true, recursive: true });
  process.exitCode = 1;
});
