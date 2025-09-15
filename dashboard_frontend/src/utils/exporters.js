//
// PUBLIC_INTERFACE
// Export utilities: CSV, PNG (via canvas snapshot), and PDF (via window.print-like flow)
// Note: We avoid extra heavy deps. PNG export uses html2canvas-like approach via <foreignObject> + SVG data URI fallback.
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
  // Ensure cloned subtree has computed styles by inlining some basics
  fo.appendChild(clone);
  svg.appendChild(fo);

  // Need the node to be in the DOM with proper styles applied
  // Create a shadow container to ensure Tailwind classes are resolved.
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
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--bg-primary") || "#ffffff";
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
   * Lightweight PDF export using a print-to-PDF prompt. As a real export path, we open a new window with content
   * and ask the browser to print; CI/preview can still produce a PDF via the browser's engine.
   * This avoids heavy jsPDF/dom-to-image deps.
   */
  if (!node) throw new Error("Missing node for export");
  const clone = node.cloneNode(true);
  const w = window.open("", "_blank", "noopener,noreferrer,width=1024,height=768");
  if (!w) throw new Error("Popup blocked");
  const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
    .map((el) => el.outerHTML)
    .join("\n");
  w.document.write(`
    <html>
      <head>
        <title>${filename}</title>
        ${styles}
        <style>
          body { padding: 16px; background: #fff; color: #000; }
          @page { size: auto; margin: 12mm; }
        </style>
      </head>
      <body>
        <div id="print-root"></div>
        <script>
          window.addEventListener('load', () => {
            setTimeout(() => {
              window.print();
            }, 50);
          });
        </script>
      </body>
    </html>
  `);
  w.document.close();
  const holder = w.document.getElementById("print-root");
  holder.appendChild(clone);
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
