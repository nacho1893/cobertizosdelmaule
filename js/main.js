/* Cobertizos del Maule — menú, secciones, carrusel de proyectos y formulario a WhatsApp */
(function(){
  var WSP = "56959052642";
  function wa(t){ return "https://wa.me/" + WSP + "?text=" + encodeURIComponent(t); }
  var header = document.getElementById("header");
  var menu = document.getElementById("menu"), btn = document.getElementById("menuBtn");

  function medir(){ document.documentElement.style.setProperty("--alto-header", (header.offsetHeight + 8) + "px"); }
  window.addEventListener("resize", medir);

  // Menú móvil
  btn.addEventListener("click", function(){
    var ab = menu.classList.toggle("abierto"); btn.setAttribute("aria-expanded", ab);
  });
  menu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ menu.classList.remove("abierto"); btn.setAttribute("aria-expanded","false"); }); });

  // Filtro y carrusel de proyectos
  var car = document.getElementById("carrusel"), prev = document.getElementById("prev"), next = document.getElementById("next");
  function flechas(){
    var max = car.scrollWidth - car.clientWidth - 4;
    prev.disabled = car.scrollLeft <= 4; next.disabled = car.scrollLeft >= max;
  }
  function filtrar(f){
    document.querySelectorAll("[data-f]").forEach(function(b){ b.setAttribute("aria-pressed", b.getAttribute("data-f") === f ? "true" : "false"); });
    car.querySelectorAll(".tarjeta").forEach(function(t){ t.hidden = !(f === "todos" || t.getAttribute("data-c") === f); });
    car.scrollLeft = 0; flechas();
  }
  document.querySelectorAll("[data-f]").forEach(function(b){ b.addEventListener("click", function(){ filtrar(b.getAttribute("data-f")); }); });
  function paso(){ var t = car.querySelector(".tarjeta:not([hidden])"); return t ? t.offsetWidth + 18 : 300; }
  prev.addEventListener("click", function(){ car.scrollBy({left: -paso(), behavior: "smooth"}); });
  next.addEventListener("click", function(){ car.scrollBy({left: paso(), behavior: "smooth"}); });
  car.addEventListener("scroll", flechas);
  window.addEventListener("resize", flechas);

  // Recuadros de la portada: abren proyectos filtrados por tipo
  var filtroPendiente = null;
  document.querySelectorAll("[data-ir]").forEach(function(a){ a.addEventListener("click", function(){ filtroPendiente = a.getAttribute("data-ir"); if (location.hash === "#proyectos") mostrar(); }); });

  // Vistas: cada opción del menú muestra su propia sección
  var vistas = ["inicio","servicios","proyectos","proceso","materiales","contacto"];
  function mostrar(){
    var v = (location.hash || "#inicio").slice(1);
    if (vistas.indexOf(v) < 0) v = "inicio";
    document.querySelectorAll("[data-vista]").forEach(function(el){ el.hidden = el.getAttribute("data-vista") !== v; });
    menu.querySelectorAll("a").forEach(function(a){
      if (a.getAttribute("href") === "#" + v) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");
    });
    header.classList.toggle("solido", v !== "inicio");
    medir();
    if (v === "proyectos") { filtrar(filtroPendiente || "todos"); filtroPendiente = null; }
    window.scrollTo(0,0);
  }
  window.addEventListener("hashchange", mostrar);
  mostrar();

  // Formulario a WhatsApp
  var enviar = document.getElementById("fEnviar"), err = document.getElementById("fError");
  function v(id){ return document.getElementById(id).value.trim(); }
  function armar(){
    var t = "Hola Cobertizos del Maule, soy " + (v("fNombre") || "—") + " de " + (v("fComuna") || "—") + ".\n" +
      "Necesito: " + v("fTipo") + "\n" +
      (v("fFono") ? "Teléfono: " + v("fFono") + "\n" : "") +
      (v("fMensaje") ? "Detalle: " + v("fMensaje") : "");
    enviar.href = wa(t);
  }
  document.querySelectorAll("#formCotiza input,#formCotiza select,#formCotiza textarea").forEach(function(el){ el.addEventListener("input", armar); });
  armar();
  enviar.addEventListener("click", function(e){
    if (!v("fNombre") || !v("fComuna")) { e.preventDefault(); err.hidden = false; document.getElementById(v("fNombre") ? "fComuna" : "fNombre").focus(); }
    else { err.hidden = true; }
  });
  document.getElementById("formCotiza").addEventListener("submit", function(e){ e.preventDefault(); });
})();
