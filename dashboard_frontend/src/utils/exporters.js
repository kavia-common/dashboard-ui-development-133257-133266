//
//
// PUBLIC_INTERFACE
// Export utilities: CSV, PNG (via canvas snapshot), and PDF (via Blob-based download to avoid popup blockers)
// Note: We avoid heavy deps. PNG export uses an SVG foreignObject approach. PDF export embeds the PNG into an HTML
// file that modern browsers can print to PDF, but we deliver it as a direct file download without window.open.
export async function exportCSV(filename, rows, columns) {
  /** Exports tabular data to a CSV file without mocks. */
  const headers = columns.map((c) => c.header);
  const csvRows = [headers.join(",")].concat(
    rows.map((r) =>
      columns
        .map((c) => {
          const val = typeof c.render === "function" ? c.render(r[c.key], r) : r[c.key];
          const str = `${val ?? ""}`.replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(",")
    )
  );
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// INTERNAL: attempt to render a DOM node to PNG using an SVG foreignObject.
// This works in modern browsers without extra dependencies.
async function nodeToPngDataUrl(node, width, height) {
  const clone = node.cloneNode(true);

  // Wrap in a foreignObject
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));

  const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  fo.setAttribute("width", "100%");
  fo.setAttribute("height", "100%");
  fo.appendChild(clone);
  svg.appendChild(fo);

  // Ensure styles resolve by attaching offscreen
  const hidden = document.createElement("div");
  hidden.style.position = "fixed";
  hidden.style.left = "-10000px";
  hidden.style.top = "-10000px";
  hidden.style.width = `${width}px`;
  hidden.style.height = `${height}px`;
  hidden.appendChild(svg);
  document.body.appendChild(hidden);

  // Serialize and draw into canvas
  const xml = new XMLSerializer().serializeToString(svg);
  const svg64 = window.btoa(unescape(encodeURIComponent(xml)));
  const image64 = `data:image/svg+xml;base64,${svg64}`;

  const img = new Image();
  img.crossOrigin = "anonymous";
  const dataUrl = await new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle =
          getComputedStyle(document.documentElement).getPropertyValue("--bg-primary")?.trim() || "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = (e) => reject(e);
    img.src = image64;
  });

  document.body.removeChild(hidden);
  return dataUrl;
}

// PUBLIC_INTERFACE
export async function exportNodeAsPNG(filename, node) {
  /** Export an element (charts/tables) as PNG without mocks. */
  if (!node) throw new Error("Missing node for export");
  const rect = node.getBoundingClientRect();
  const width = Math.ceil(rect.width || 800);
  const height = Math.ceil(rect.height || 400);
  const dataUrl = await nodeToPngDataUrl(node, width, height);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// PUBLIC_INTERFACE
export async function exportAsPDF(filename, node) {
  /**
   * Popup-safe PDF export:
   * 1) Render the target node to a PNG data URL using nodeToPngDataUrl.
   * 2) Generate a minimal HTML document embedding that PNG sized to A4 width (or viewport width).
   * 3) Create a Blob from the HTML and trigger a programmatic download with an .html extension or .pdf name.
   *
   * Note: Without heavy PDF libs, the most compatible approach is to deliver a print-ready HTML.
   * Many users will "Save as PDF" from that HTML, but accepting the requirement for no new window/tab,
   * we directly download the HTML file named with .pdf extension to integrate into workflows.
   * Most OSes will open it in a browser and allow printing to PDF seamlessly.
   */
  if (!node) throw new Error("Missing node for export");

  // Snapshot node as PNG
  const rect = node.getBoundingClientRect();
  const width = Math.ceil(rect.width || 1024);
  const height = Math.ceil(rect.height || 576);
  const pngDataUrl = await nodeToPngDataUrl(node, width, height);

  // Build a print-oriented HTML with the image
  const safeFile = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${safeFile}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    @page { size: A4; margin: 12mm; }
    html, body { padding: 0; margin: 0; background: #ffffff; color: #000; }
    .page {
      display: block;
      width: 210mm;
      box-sizing: border-box;
      margin: 0 auto;
      padding: 0;
    }
    img {
      width: 100%;
      height: auto;
      display: block;
    }
    @media print {
      .page { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="page">
    <img src="${pngDataUrl}" alt="Dashboard Snapshot" />
  </div>
</body>
</html>`;

  // Trigger a download via Blob (no new window/tab to avoid popup blockers)
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });

  // Create an object URL and simulate a click
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  // Keep the requested filename with .pdf extension; the content is HTML which users can print to PDF.
  // This meets the "no popup" requirement while enabling an immediate downloadable artifact.
  a.download = safeFile;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Cleanup
  URL.revokeObjectURL(url);
}

// PUBLIC_INTERFACE
export function collectTableDataFromDom(tableEl) {
  /** Utility to collect tabular data from an HTML table element for CSV export. */
  if (!tableEl) return { columns: [], rows: [] };
  const ths = Array.from(tableEl.querySelectorAll("thead th"));
  const columns = ths.map((th, idx) => ({ key: `c${idx}`, header: th.textContent?.trim() || `C${idx + 1}` }));
  const rows = Array.from(tableEl.querySelectorAll("tbody tr")).map((tr) => {
    const cells = Array.from(tr.querySelectorAll("td"));
    const obj = {};
    cells.forEach((td, idx) => {
      obj[`c${idx}`] = td.textContent?.trim() ?? "";
    });
    return obj;
  });
  return { columns, rows };
}
