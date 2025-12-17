
document.getElementById("year").textContent = new Date().getFullYear();

// Fallback de imágenes por si la carpeta quedó con distinto nombre (assets/ vs Assets/)
(function fixImages(){
  const candidates = ["assets", "Assets", "ASSETS"];
  const imgs = Array.from(document.images);
  imgs.forEach(img => {
    img.addEventListener("error", () => {
      const src = img.getAttribute("src") || "";
      if (!src) return;
      // only try relative local images
      if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return;

      for (const dir of candidates) {
        const fixed = src.replace(/^(assets|Assets|ASSETS)\//, dir + "/");
        if (fixed !== src) {
          img.src = fixed + (fixed.includes("?") ? "" : ("?v=" + Date.now()));
          return;
        }
      }
      // try without folder prefix
      const noDir = src.replace(/^(assets|Assets|ASSETS)\//, "");
      if (noDir !== src) img.src = noDir + "?v=" + Date.now();
    }, { once: true });
  });
})();

const form = document.getElementById("leadForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nombre = (data.get("nombre") || "").toString().trim();
  const telefono = (data.get("telefono") || "").toString().trim();
  const correo = (data.get("correo") || "").toString().trim();
  const grado = (data.get("grado") || "").toString().trim();

  const msg =
`Hola, Colegio Mi Pequeñita Luz 👋
Quisiera información de Admisión 2026.

Nombre: ${nombre}
Teléfono: ${telefono}
Correo: ${correo}
Grado a postular: ${grado}

Gracias.`;

  const url = `https://wa.me/51993558729?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  form.reset();
});

// Extra fallback: intentar con ruta absoluta del sitio (útil si subiste en subcarpeta)
(function tryRepoBase(){
  const imgs = Array.from(document.images);
  const basePath = location.pathname.replace(/\/[^\/]*$/, "/"); // carpeta actual
  imgs.forEach(img => {
    img.addEventListener("error", () => {
      const src = img.getAttribute("src") || "";
      if (!src || /^https?:\/\//i.test(src) || src.startsWith("data:")) return;
      // If already absolute, skip
      if (src.startsWith("/")) return;
      img.src = basePath + src.replace(/^\.\//,"") + "?v=" + Date.now();
    }, { once: true });
  });
})();
