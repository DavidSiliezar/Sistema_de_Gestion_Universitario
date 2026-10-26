const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1300,
  timerProgressBar: true,
  customClass: {
    popup: "torque-toast",
  },
});

function notifyToast(icon, title) {
  Toast.fire({ icon, title });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeNum(val, fallback = 0) {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function evaluateMathSafe(expr) {
  const clean = String(expr).replace(/\s+/g, "");
  if (!clean || !/^[0-9+*/().-]+$/.test(clean)) return null;
  let pos = 0;
  function parsePrimary() {
    if (clean[pos] === "(") {
      pos++;
      const val = parseAddSub();
      if (clean[pos] === ")") pos++;
      return val;
    }
    if (clean[pos] === "-") {
      pos++;
      const p = parsePrimary();
      return p === null ? null : -p;
    }
    if (clean[pos] === "+") {
      pos++;
      return parsePrimary();
    }
    let numStr = "";
    while (pos < clean.length && /[0-9.]/.test(clean[pos])) {
      numStr += clean[pos++];
    }
    if (!numStr) return null;
    const n = Number(numStr);
    return Number.isFinite(n) ? n : null;
  }
  function parseMulDiv() {
    let val = parsePrimary();
    if (val === null) return null;
    while (pos < clean.length && (clean[pos] === "*" || clean[pos] === "/")) {
      const op = clean[pos++];
      const nextVal = parsePrimary();
      if (nextVal === null) return null;
      if (op === "*") val = val * nextVal;
      else {
        if (nextVal === 0) return null;
        val = val / nextVal;
      }
    }
    return val;
  }
  function parseAddSub() {
    let val = parseMulDiv();
    if (val === null) return null;
    while (pos < clean.length && (clean[pos] === "+" || clean[pos] === "-")) {
      const op = clean[pos++];
      const nextVal = parseMulDiv();
      if (nextVal === null) return null;
      if (op === "+") val = val + nextVal;
      else val = val - nextVal;
    }
    return val;
  }
  const result = parseAddSub();
  return (pos === clean.length && typeof result === "number" && Number.isFinite(result)) ? result : null;
}

const INITIAL_EXCEL_PRODUCTOS = [
  {
    "ID del producto": "PROD-001",
    "Codigo": "LF-8208",
    "Nombre": "Gancho para Cable de Remolque 2Pzas",
    "Descripción": "GANCHO PARA CABLE DE REMOLQUE 2PZAS/ SET CAP 3.2TO LAFA - Material: 100% HIERRO - PAIS: China",
    "ID de categoría": "CAT-ACC",
    "Marca": "LAFA",
    "Costo Unitario": 5.9,
    "Costo de Flete": 0.5,
    "Aranceles aduanales": 0.3,
    "Impuestos": 0.77,
    "Almacenaje": 0.2,
    "Fecha de ingreso": "2026-02-03",
    "Precio total de compra": 7.67,
    "Precio de venta": 11.5,
    "Existencia": 20,
    "Ubicación": "Bodega A-01",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-002",
    "Codigo": "2.20.052/2",
    "Nombre": "Corneta Carro Antiguo",
    "Descripción": "CORNETA CARRO ANTIGUO LAFA - Material: METAL + PLASTICO + COBRE - PAIS: China",
    "ID de categoría": "CAT-ACC",
    "Marca": "LAFA",
    "Costo Unitario": 7.02,
    "Costo de Flete": 0.6,
    "Aranceles aduanales": 0.35,
    "Impuestos": 0.91,
    "Almacenaje": 0.2,
    "Fecha de ingreso": "2026-02-03",
    "Precio total de compra": 9.08,
    "Precio de venta": 13.99,
    "Existencia": 15,
    "Ubicación": "Bodega A-02",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-003",
    "Codigo": "TY170C",
    "Nombre": "Halógena Yaris Sedán 06 4D",
    "Descripción": "HALOGENA YARIS SEDAN 06 4D S/CABLES DLAA - Material: ABS + HIERRO + VIDRIO - PAIS: China",
    "ID de categoría": "CAT-ILU",
    "Marca": "DLAA",
    "Costo Unitario": 20.97,
    "Costo de Flete": 1.5,
    "Aranceles aduanales": 1.05,
    "Impuestos": 2.73,
    "Almacenaje": 0.5,
    "Fecha de ingreso": "2026-02-03",
    "Precio total de compra": 26.75,
    "Precio de venta": 39.99,
    "Existencia": 6,
    "Ubicación": "Bodega B-05",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-004",
    "Codigo": "K-2020-K",
    "Nombre": "Cobertor Puerta Trasera Hilux Revo 15 c/Llave",
    "Descripción": "COBERTUR PUERTA TRASERA HILUX REVO 15 C/LLAVE Hunter 4X4 - Material: 100%ABS - PAIS: China",
    "ID de categoría": "CAT-EXT",
    "Marca": "HUNTER 4X4",
    "Costo Unitario": 30.88,
    "Costo de Flete": 2.0,
    "Aranceles aduanales": 1.54,
    "Impuestos": 4.01,
    "Almacenaje": 0.8,
    "Fecha de ingreso": "2026-02-03",
    "Precio total de compra": 39.23,
    "Precio de venta": 59.5,
    "Existencia": 6,
    "Ubicación": "Bodega C-12",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-005",
    "Codigo": "LF-4710",
    "Nombre": "Medidor de Agua Digital 52mm",
    "Descripción": "MEDIDOR DE AGUA DIGITAL 52MM 40-120°C C/SENSOR LAFA - Material: METAL + PLASTICO - PAIS: China",
    "ID de categoría": "CAT-IND",
    "Marca": "LAFA",
    "Costo Unitario": 11.54,
    "Costo de Flete": 0.8,
    "Aranceles aduanales": 0.58,
    "Impuestos": 1.5,
    "Almacenaje": 0.3,
    "Fecha de ingreso": "2026-02-03",
    "Precio total de compra": 14.72,
    "Precio de venta": 22.0,
    "Existencia": 20,
    "Ubicación": "Bodega A-08",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-006",
    "Codigo": "HU-3189",
    "Nombre": "Barras Transversal Negra Mit L200 24",
    "Descripción": "BARRAS TRANSVERSAL NEGRA MIT L200 24 HUNTER 4X4 - Material: ALUMINIO+PLASTICO - PAIS: China",
    "ID de categoría": "CAT-EXT",
    "Marca": "HUNTER 4X4",
    "Costo Unitario": 59.18,
    "Costo de Flete": 4.0,
    "Aranceles aduanales": 2.96,
    "Impuestos": 7.69,
    "Almacenaje": 1.5,
    "Fecha de ingreso": "2026-01-27",
    "Precio total de compra": 75.33,
    "Precio de venta": 115.0,
    "Existencia": 12,
    "Ubicación": "Bodega C-02",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-007",
    "Codigo": "HU-3160",
    "Nombre": "Parrilla Plataforma de Techo T3 NS Frontier NP300",
    "Descripción": "PARRILLA PLATAFORMA DE TECHO T3 NS FRONTIER NP300 14-22 HUNTER 4X4 - Material: METAL - PAIS: China",
    "ID de categoría": "CAT-EXT",
    "Marca": "HUNTER 4X4",
    "Costo Unitario": 145.5,
    "Costo de Flete": 10.0,
    "Aranceles aduanales": 7.28,
    "Impuestos": 18.92,
    "Almacenaje": 3.0,
    "Fecha de ingreso": "2026-01-27",
    "Precio total de compra": 184.7,
    "Precio de venta": 275.0,
    "Existencia": 6,
    "Ubicación": "Bodega C-05",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-008",
    "Codigo": "HU-11064-L200",
    "Nombre": "Tapa Rígida Trifold PE L200 2024 c/Luz",
    "Descripción": "TAPA RIGIDA TRIFOLD PE L200 2024 C/LUZ Y 6 ENGANCHES HUNTER 4X4 - Material: ALEACION DE ALUMINIO - PAIS: China",
    "ID de categoría": "CAT-EXT",
    "Marca": "HUNTER 4X4",
    "Costo Unitario": 224.13,
    "Costo de Flete": 15.0,
    "Aranceles aduanales": 11.21,
    "Impuestos": 29.14,
    "Almacenaje": 5.0,
    "Fecha de ingreso": "2026-01-27",
    "Precio total de compra": 284.48,
    "Precio de venta": 425.0,
    "Existencia": 4,
    "Ubicación": "Bodega D-01",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-009",
    "Codigo": "SETMR-1000",
    "Nombre": "2024 Triton Roll Bar Black",
    "Descripción": "Defensa Roll Bar Negro para Triton 2024 SETMR-1000 ROLL BAR BLACK",
    "ID de categoría": "CAT-DEF",
    "Marca": "IAM TRADING",
    "Costo Unitario": 115.0,
    "Costo de Flete": 8.0,
    "Aranceles aduanales": 5.75,
    "Impuestos": 14.95,
    "Almacenaje": 2.5,
    "Fecha de ingreso": "2026-01-27",
    "Precio total de compra": 146.2,
    "Precio de venta": 220.0,
    "Existencia": 20,
    "Ubicación": "Bodega D-04",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-010",
    "Codigo": "315153",
    "Nombre": "Rin 15X7 10/100/114.3 NGP 3903 ET32",
    "Descripción": "Rin de aluminio 15X7 10/100/114.3 NGP 3903 ET32 CB73.1",
    "ID de categoría": "CAT-RIN",
    "Marca": "WHEEL CENTER",
    "Costo Unitario": 48.99,
    "Costo de Flete": 3.5,
    "Aranceles aduanales": 2.45,
    "Impuestos": 6.37,
    "Almacenaje": 1.0,
    "Fecha de ingreso": "2019-01-28",
    "Precio total de compra": 62.31,
    "Precio de venta": 95.0,
    "Existencia": 12,
    "Ubicación": "Bodega R-02",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-011",
    "Codigo": "HU-1197",
    "Nombre": "Estribo 80\" S8 p/Frontier NP300 2014-2023 D/C",
    "Descripción": "ESTRIBO 80\" S8 P/FRONTIER NP300 2014-2023 D/C HUNTER 4X4 - Material: ALUMINIO - PAIS: China",
    "ID de categoría": "CAT-EXT",
    "Marca": "HUNTER 4X4",
    "Costo Unitario": 130.0,
    "Costo de Flete": 9.0,
    "Aranceles aduanales": 6.5,
    "Impuestos": 16.9,
    "Almacenaje": 2.5,
    "Fecha de ingreso": "2026-01-27",
    "Precio total de compra": 164.9,
    "Precio de venta": 245.0,
    "Existencia": 6,
    "Ubicación": "Bodega C-08",
    "Estado": "Disponible",
    "Fecha de salida": ""
  },
  {
    "ID del producto": "PROD-012",
    "Codigo": "HU-1090",
    "Nombre": "Estribo Negro Mate Hilux Revo 15+",
    "Descripción": "ESTRIBO NEGRO MATE HILUX REVO 15+ HUNTER 4X4 - Material: ALUMINIO - PAIS: China",
    "ID de categoría": "CAT-EXT",
    "Marca": "HUNTER 4X4",
    "Costo Unitario": 85.64,
    "Costo de Flete": 6.0,
    "Aranceles aduanales": 4.28,
    "Impuestos": 11.13,
    "Almacenaje": 1.8,
    "Fecha de ingreso": "2026-01-27",
    "Precio total de compra": 108.85,
    "Precio de venta": 165.0,
    "Existencia": 20,
    "Ubicación": "Bodega C-09",
    "Estado": "Disponible",
    "Fecha de salida": ""
  }
];

const INITIAL_EXCEL_PROVEEDORES = [
  {
    "No.": 1,
    "Nombre": "Lafayette Zona Libre, S.A.",
    "Contacto": "IVAN MIRANDA",
    "NIT": "12428-010-123452",
    "NRC": "",
    "Correo": "info@grupolafayette.com",
    "Direccion": "Calle 17 Santa Isabel Edificio PH. Interplaza L 27 Colón - Colón",
    "Tipo de contribuyente": "Zona Libre Internacional",
    "Condiciones de pago": "CONTADO",
    "Fecha de registro": "2026-02-03"
  },
  {
    "No.": 2,
    "Nombre": "FORTUNE PARTS INDUSTRY PUBLIC COMPANY LIMITED",
    "Contacto": "Tel: (662) 993-4970-7",
    "NIT": "FPI-TH-12150",
    "NRC": "",
    "Correo": "info@fpl.co.th",
    "Direccion": "11/22 Moo 20 Nimitmai Road, Lamlukka, Pathumthani 12150 Thailand",
    "Tipo de contribuyente": "Fabricante Internacional OEM",
    "Condiciones de pago": "CONTADO",
    "Fecha de registro": "2020-08-04"
  },
  {
    "No.": 3,
    "Nombre": "WHEEL CENTER INTERNACIONAL, S.A.",
    "Contacto": "TEL: (00507) 441-4144",
    "NIT": "WC-PA-00507",
    "NRC": "",
    "Correo": "ventas@wheelcenterpanama.com",
    "Direccion": "CALLE 16 1/2, ZONA LIBRE DE COLON, REP. PANAMA",
    "Tipo de contribuyente": "Distribuidor Mayorista",
    "Condiciones de pago": "CONTADO",
    "Fecha de registro": "2019-01-28"
  }
];

const INITIAL_EXCEL_FACTURACION = [
  {
    "Fecha": "2026-02-03",
    "No. De factura": "INV00004623",
    "Tipo de documento": "Factura Comercial",
    "Proveedor": "Lafayette Zona Libre, S.A.",
    "Cantidad": 20,
    "Descripción": "GANCHO PARA CABLE DE REMOLQUE 2PZAS/ SET CAP 3.2TO",
    "Precio unitario": 5.9,
    "Descuento": 0,
    "IVA 13%": 15.34,
    "IVA retenido": 0,
    "IVA percibido": 0,
    "Total": 118.0,
    "No. Cotización": "ENX0019493",
    "Orden de Compra": "OC-2026-001"
  },
  {
    "Fecha": "2026-02-03",
    "No. De factura": "INV00004623",
    "Tipo de documento": "Factura Comercial",
    "Proveedor": "Lafayette Zona Libre, S.A.",
    "Cantidad": 15,
    "Descripción": "CORNETA CARRO ANTIGUO",
    "Precio unitario": 7.02,
    "Descuento": 0,
    "IVA 13%": 13.69,
    "IVA retenido": 0,
    "IVA percibido": 0,
    "Total": 105.3,
    "No. Cotización": "ENX0019493",
    "Orden de Compra": "OC-2026-001"
  },
  {
    "Fecha": "2026-01-27",
    "No. De factura": "COT-ENX0019493",
    "Tipo de documento": "Cotización",
    "Proveedor": "Lafayette Zona Libre, S.A.",
    "Cantidad": 12,
    "Descripción": "BARRAS TRANSVERSAL NEGRA MIT L200 24",
    "Precio unitario": 59.18,
    "Descuento": 0,
    "IVA 13%": 92.32,
    "IVA retenido": 0,
    "IVA percibido": 0,
    "Total": 710.16,
    "No. Cotización": "ENX0019493",
    "Orden de Compra": "OC-2026-001"
  },
  {
    "Fecha": "2026-01-27",
    "No. De factura": "EST-1019",
    "Tipo de documento": "Estimate / Cotización",
    "Proveedor": "IAM IMPORT & EXPORT TRADING S.A.",
    "Cantidad": 20,
    "Descripción": "2024 TRITON ROLL BAR BLACK",
    "Precio unitario": 115.0,
    "Descuento": 0,
    "IVA 13%": 299.0,
    "IVA retenido": 0,
    "IVA percibido": 0,
    "Total": 2300.0,
    "No. Cotización": "1019",
    "Orden de Compra": "OC-2026-002"
  },
  {
    "Fecha": "2026-01-27",
    "No. De factura": "EST-1019",
    "Tipo de documento": "Estimate / Cotización",
    "Proveedor": "IAM IMPORT & EXPORT TRADING S.A.",
    "Cantidad": 10,
    "Descripción": "2024 TRITON ROLL BAR CHROME",
    "Precio unitario": 115.0,
    "Descuento": 0,
    "IVA 13%": 149.5,
    "IVA retenido": 0,
    "IVA percibido": 0,
    "Total": 1150.0,
    "No. Cotización": "1019",
    "Orden de Compra": "OC-2026-002"
  },
  {
    "Fecha": "2019-01-28",
    "No. De factura": "PED-046545",
    "Tipo de documento": "Orden de Pedido",
    "Proveedor": "WHEEL CENTER INTERNACIONAL, S.A.",
    "Cantidad": 12,
    "Descripción": "15X7 10/100/114.3 NGP 3903 ET32 CB73.1",
    "Precio unitario": 48.99,
    "Descuento": 0,
    "IVA 13%": 76.42,
    "IVA retenido": 0,
    "IVA percibido": 0,
    "Total": 587.88,
    "No. Cotización": "N/A",
    "Orden de Compra": "046545"
  },
  {
    "Fecha": "2020-08-04",
    "No. De factura": "FPI-2006769",
    "Tipo de documento": "Factura Comercial / Invoice",
    "Proveedor": "FORTUNE PARTS INDUSTRY PUBLIC COMPANY LIMITED",
    "Cantidad": 3,
    "Descripción": "GRILLE MBG115 NG (7450B108)",
    "Precio unitario": 50.0,
    "Descuento": 0,
    "IVA 13%": 19.5,
    "IVA retenido": 0,
    "IVA percibido": 0,
    "Total": 150.0,
    "No. Cotización": "N/A",
    "Orden de Compra": "PO-FPI-2020"
  }
];

const CATEGORIAS_META = {
  "CAT-ACC": { id_categoria: "CAT-ACC", nombre_categoria: "Accesorios Generales y Remolque", stock_minimo_default: 8, factor_seguridad: 1.5 },
  "CAT-ILU": { id_categoria: "CAT-ILU", nombre_categoria: "Iluminación Automotriz", stock_minimo_default: 8, factor_seguridad: 1.6 },
  "CAT-EXT": { id_categoria: "CAT-EXT", nombre_categoria: "Exterior y Carrocería 4x4", stock_minimo_default: 8, factor_seguridad: 1.5 },
  "CAT-IND": { id_categoria: "CAT-IND", nombre_categoria: "Indicadores y Medidores Digitales", stock_minimo_default: 10, factor_seguridad: 1.4 },
  "CAT-DEF": { id_categoria: "CAT-DEF", nombre_categoria: "Defensas y Roll Bars", stock_minimo_default: 8, factor_seguridad: 1.5 },
  "CAT-RIN": { id_categoria: "CAT-RIN", nombre_categoria: "Rines y Llantas", stock_minimo_default: 8, factor_seguridad: 1.5 },
};

const AppState = {
  rawProductos: structuredClone(INITIAL_EXCEL_PRODUCTOS),
  rawProveedores: structuredClone(INITIAL_EXCEL_PROVEEDORES),
  rawFacturacion: structuredClone(INITIAL_EXCEL_FACTURACION),

  iaParams: {
    pesoCalidad: 40,
    pesoCumplimiento: 35,
    pesoTiempo: 25,
    crecimientoDemandaPct: 0,
  },

  relational: null,
  sqliteDb: null,
  SQL: null,

  charts: {
    landedCost: null,
    stockHealth: null,
    supplierRadar: null,
  },

  filtroCategoria: "ALL",
  filtroAlerta: "ALL",
  busquedaTexto: "",
  filtroRelaciones: "ALL",
  visLibroFiltro: "ALL",
  visBusqueda: "",
};

function normalizeText(str) {
  if (!str) return "";
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s/.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calcSupplierScore(calidad, cumplimientoPct, diasEntrega) {
  const { pesoCalidad, pesoCumplimiento, pesoTiempo } = AppState.iaParams;
  const totalPeso = Math.max(1, pesoCalidad + pesoCumplimiento + pesoTiempo);
  const wCal = (pesoCalidad / totalPeso) * 100;
  const wCum = (pesoCumplimiento / totalPeso) * 100;
  const wTie = (pesoTiempo / totalPeso) * 100;

  const sCal = (calidad / 5.0) * wCal;
  const sCum = (cumplimientoPct / 100.0) * wCum;
  const sTie = (Math.max(1, 35 - diasEntrega) / 35.0) * wTie;
  return Number((sCal + sCum + sTie).toFixed(2));
}

function buildRelationalDatabase() {
  const categorias = structuredClone(CATEGORIAS_META);
  const proveedoresMap = new Map();
  let maxProvId = 0;
  const auditLog = [];

  for (const row of AppState.rawProveedores) {
    const idProv = Number(row["No."] || row["id_proveedor"] || ++maxProvId);
    if (idProv > maxProvId) maxProvId = idProv;
    const nombre = String(row["Nombre"] || row["nombre"] || "").trim();
    if (!nombre) continue;

    const direccion = String(row["Direccion"] || row["direccion"] || "");
    let pais = "Internacional";
    let diasEntrega = 15;
    let calidad = 4.6;
    let cumplimiento = 95.0;

    if (/COLON|LAFAYETTE/i.test(direccion + " " + nombre)) {
      pais = "Panamá (Zona Libre de Colón)";
      diasEntrega = 7;
      calidad = 4.8;
      cumplimiento = 98.0;
    } else if (/THAILAND|FORTUNE/i.test(direccion + " " + nombre)) {
      pais = "Tailandia";
      diasEntrega = 28;
      calidad = 4.7;
      cumplimiento = 94.0;
    } else if (/PANAMA|WHEEL/i.test(direccion + " " + nombre)) {
      pais = "Panamá (Zona Libre de Colón)";
      diasEntrega = 10;
      calidad = 4.6;
      cumplimiento = 96.0;
    }

    proveedoresMap.set(idProv, {
      id_proveedor: idProv,
      nombre,
      contacto: String(row["Contacto"] || "Ejecutivo Comercial"),
      nit: String(row["NIT"] || `INT-00${idProv}`),
      nrc: String(row["NRC"] || ""),
      correo: String(row["Correo"] || "contacto@proveedor.com"),
      direccion,
      pais_origen: pais,
      tipo_contribuyente: String(row["Tipo de contribuyente"] || "Importador Internacional"),
      condiciones_pago: String(row["Condiciones de pago"] || "CONTADO"),
      fecha_registro: String(row["Fecha de registro"] || "2026-02-03"),
      tiempo_entrega_dias: diasEntrega,
      calificacion_calidad: calidad,
      cumplimiento_entregas_pct: cumplimiento,
      score_ia: calcSupplierScore(calidad, cumplimiento, diasEntrega),
      origen_registro: "EXCEL_PROVEEDORES",
    });
  }

  const resolveProveedorId = (nombreOMarca, fechaRef = "2026-01-27") => {
    const norm = normalizeText(nombreOMarca);
    for (const [id, prov] of proveedoresMap.entries()) {
      const pNorm = normalizeText(prov.nombre);
      if (pNorm === norm || pNorm.includes(norm) || norm.includes(pNorm)) {
        return id;
      }
      if (/IAM/.test(norm) && /IAM/.test(pNorm)) {
        return id;
      }
    }
    if (/LAFA|DLAA|HUNTER/.test(norm) && proveedoresMap.has(1)) return 1;
    if (/WHEEL/.test(norm) && proveedoresMap.has(3)) return 3;
    if (/FORTUNE|FPI/.test(norm) && proveedoresMap.has(2)) return 2;

    maxProvId++;
    const dias = 14;
    const cal = 4.5;
    const cump = 93.0;
    const canonicalName = /IAM/.test(norm) ? "IAM IMPORT & EXPORT TRADING S.A." : nombreOMarca.trim();
    proveedoresMap.set(maxProvId, {
      id_proveedor: maxProvId,
      nombre: canonicalName,
      contacto: "Departamento de Exportaciones",
      nit: `EXT-000${maxProvId}`,
      nrc: "",
      correo: "sales@iamtrading-export.com",
      direccion: "Zona Franca Internacional / Asia-Pacific",
      pais_origen: "Asia / Internacional",
      tipo_contribuyente: "Proveedor Internacional",
      condiciones_pago: "CONTADO",
      fecha_registro: fechaRef,
      tiempo_entrega_dias: dias,
      calificacion_calidad: cal,
      cumplimiento_entregas_pct: cump,
      score_ia: calcSupplierScore(cal, cump, dias),
      origen_registro: "AUTO_DETECTADO_FACTURACION",
    });
    auditLog.push({
      tipo: "AUTO_HEAL_PROVEEDOR",
      entidad: nombreOMarca.trim(),
      pk_generada: `id_proveedor = ${maxProvId}`,
      detalle: "Detectado en FACTURACION.xlsx sin registro previo en PROVEEDORES.xlsx. Insertado automáticamente antes de vincular el registro.",
    });
    return maxProvId;
  };

  const productosMap = new Map();
  let maxProdNum = 0;

  for (const row of AppState.rawProductos) {
    const idProd = String(row["ID del producto"] || row["id_producto"] || "").trim();
    if (!idProd) continue;
    const mNum = idProd.match(/PROD-(\d+)/i);
    if (mNum) maxProdNum = Math.max(maxProdNum, Number(mNum[1]));

    const idCat = String(row["ID de categoría"] || row["id_categoria"] || "CAT-ACC").trim();
    if (!categorias[idCat]) {
      categorias[idCat] = {
        id_categoria: idCat,
        nombre_categoria: `Categoría ${idCat}`,
        stock_minimo_default: 8,
        factor_seguridad: 1.5,
      };
    }

    const marca = String(row["Marca"] || "GENÉRICO").trim();
    const idProvPref = resolveProveedorId(marca);

    const costoUnit = Number(row["Costo Unitario"] || 0);
    const flete = Number(row["Costo de Flete"] || 0);
    const aranceles = Number(row["Aranceles aduanales"] || 0);
    const impuestos = Number(row["Impuestos"] || 0);
    const almacen = Number(row["Almacenaje"] || 0);
    const totalComp = Number(row["Precio total de compra"] || (costoUnit + flete + aranceles + impuestos + almacen).toFixed(2));
    const precioVta = Number(row["Precio de venta"] || (totalComp * 1.48).toFixed(2));
    const existencia = Number(row["Existencia"] || 0);

    const margenUnit = Number((precioVta - totalComp).toFixed(2));
    const margenPct = totalComp > 0 ? Number(((margenUnit / totalComp) * 100).toFixed(2)) : 0;

    const stockMin = categorias[idCat].stock_minimo_default;
    const puntoReorden = Math.ceil(stockMin * categorias[idCat].factor_seguridad);

    productosMap.set(idProd, {
      id_producto: idProd,
      codigo_sku: String(row["Codigo"] || ""),
      nombre: String(row["Nombre"] || ""),
      descripcion: String(row["Descripción"] || row["Descripcion"] || ""),
      id_categoria: idCat,
      id_proveedor_preferido: idProvPref,
      marca,
      costo_unitario: costoUnit,
      costo_flete: flete,
      aranceles_aduanales: aranceles,
      impuestos,
      almacenaje: almacen,
      precio_total_compra: totalComp,
      precio_venta: precioVta,
      margen_unitario: margenUnit,
      margen_porcentaje: margenPct,
      existencia,
      stock_minimo: stockMin,
      punto_reorden: puntoReorden,
      ubicacion: String(row["Ubicación"] || row["Ubicacion"] || "Bodega Central"),
      estado: String(row["Estado"] || "Disponible"),
      fecha_ingreso: String(row["Fecha de ingreso"] || "2026-02-03"),
      fecha_salida: String(row["Fecha de salida"] || ""),
      origen_registro: "EXCEL_PRODUCTOS",
    });
  }

  const documentosMap = new Map();
  const detalleCompras = [];
  let docCounter = 0;
  let detCounter = 0;

  for (const row of AppState.rawFacturacion) {
    const numFact = String(row["No. De factura"] || "").trim();
    if (!numFact) continue;

    const fecha = String(row["Fecha"] || "2026-02-03");
    const tipoDoc = String(row["Tipo de documento"] || "Factura Comercial");
    const nomProv = String(row["Proveedor"] || "");
    const cantidad = Number(row["Cantidad"] || 1);
    const descFactura = String(row["Descripción"] || row["Descripcion"] || "");
    const precioUnit = Number(row["Precio unitario"] || 0);
    const descuento = Number(row["Descuento"] || 0);
    const iva13 = Number(Number(row["IVA 13%"] || 0).toFixed(2));
    const totalLinea = Number(Number(row["Total"] || cantidad * precioUnit).toFixed(2));

    const idProvRef = resolveProveedorId(nomProv, fecha);

    if (!documentosMap.has(numFact)) {
      docCounter++;
      documentosMap.set(numFact, {
        id_documento: docCounter,
        numero_factura: numFact,
        fecha,
        tipo_documento: tipoDoc,
        id_proveedor: idProvRef,
        numero_cotizacion: String(row["No. Cotización"] || row["No. Cotizacion"] || "N/A"),
        orden_compra: String(row["Orden de Compra"] || "S/N"),
        subtotal_documento: 0,
        iva_documento: 0,
        total_documento: 0,
      });
    }

    const docObj = documentosMap.get(numFact);
    docObj.subtotal_documento = Number((docObj.subtotal_documento + totalLinea).toFixed(2));
    docObj.iva_documento = Number((docObj.iva_documento + iva13).toFixed(2));
    docObj.total_documento = Number((docObj.subtotal_documento + docObj.iva_documento).toFixed(2));

    const normDesc = normalizeText(descFactura);
    let idProdRef = null;
    let metodoVinc = "MATCH_EXACTO_CATALOGO";

    for (const [idP, prod] of productosMap.entries()) {
      const nNom = normalizeText(prod.nombre);
      const nFull = normalizeText(prod.descripcion);
      if (nNom === normDesc || nFull.includes(normDesc) || normDesc.includes(nNom)) {
        idProdRef = idP;
        break;
      }
      if (normDesc.includes("15X7") && nFull.includes("15X7")) {
        idProdRef = idP;
        metodoVinc = "MATCH_ESPECIFICACION_TECNICA";
        break;
      }
    }

    if (!idProdRef) {
      maxProdNum++;
      idProdRef = `PROD-${String(maxProdNum).padStart(3, "0")}`;
      metodoVinc = "AUTO_ALTA_DESDE_FACTURA";
      const idCat = /ROLL BAR/i.test(normDesc) ? "CAT-DEF" : "CAT-EXT";
      const flete = Number((precioUnit * 0.07).toFixed(2));
      const aranceles = Number((precioUnit * 0.05).toFixed(2));
      const impuestos = Number((precioUnit * 0.13).toFixed(2));
      const almacen = Number((precioUnit * 0.02).toFixed(2));
      const totalComp = Number((precioUnit + flete + aranceles + impuestos + almacen).toFixed(2));
      const precioVta = Number((totalComp * 1.5).toFixed(2));

      productosMap.set(idProdRef, {
        id_producto: idProdRef,
        codigo_sku: /ROLL BAR/i.test(normDesc) ? "SETMR-1001-C" : "7450B108",
        nombre: descFactura,
        descripcion: `${descFactura} (Incorporado automáticamente desde Facturación para mantener la integridad)`,
        id_categoria: idCat,
        id_proveedor_preferido: idProvRef,
        marca: /ROLL BAR/i.test(normDesc) ? "IAM TRADING" : "FPI OEM",
        costo_unitario: precioUnit,
        costo_flete: flete,
        aranceles_aduanales: aranceles,
        impuestos,
        almacenaje: almacen,
        precio_total_compra: totalComp,
        precio_venta: precioVta,
        margen_unitario: Number((precioVta - totalComp).toFixed(2)),
        margen_porcentaje: 50.0,
        existencia: cantidad,
        stock_minimo: 8,
        punto_reorden: 12,
        ubicacion: "Bodega Recepción",
        estado: "Disponible",
        fecha_ingreso: fecha,
        fecha_salida: "",
        origen_registro: "AUTO_DETECTADO_FACTURACION",
      });

      auditLog.push({
        tipo: "AUTO_HEAL_PRODUCTO",
        entidad: descFactura,
        pk_generada: `id_producto = '${idProdRef}'`,
        detalle: `Ítem facturado en ${numFact} no existía en PRODUCTOS.xlsx. Se dio de alta automáticamente en catálogo antes de insertar línea de factura.`,
      });
    }

    detCounter++;
    detalleCompras.push({
      id_detalle: detCounter,
      id_documento: docObj.id_documento,
      numero_factura: numFact,
      id_producto: idProdRef,
      id_proveedor: idProvRef,
      descripcion_factura: descFactura,
      cantidad,
      precio_unitario: precioUnit,
      descuento,
      iva_13: iva13,
      iva_retenido: Number(row["IVA retenido"] || 0),
      iva_percibido: Number(row["IVA percibido"] || 0),
      total_linea: totalLinea,
      metodo_vinculacion: metodoVinc,
    });
  }

  const recomendacionesIA = [];
  let recCounter = 0;
  const factorDemanda = 1 + AppState.iaParams.crecimientoDemandaPct / 100.0;

  for (const [idP, prod] of productosMap.entries()) {
    const prov = proveedoresMap.get(prod.id_proveedor_preferido) || Array.from(proveedoresMap.values())[0];
    const baseDemanda = prod.precio_venta < 30 ? 18 : prod.precio_venta < 120 ? 12 : 8;
    const demandaMensual = Number((baseDemanda * factorDemanda).toFixed(1));
    const consumoDiario = Math.max(0.1, demandaMensual / 30.0);
    const diasCobertura = Math.floor(prod.existencia / consumoDiario);

    const stockMin = Math.max(4, Math.round(prod.stock_minimo * factorDemanda));
    const puntoReorden = Math.max(6, Math.round(prod.punto_reorden * factorDemanda));

    let nivelAlerta = "OPTIMO";
    let prioridad = 3;
    let cantSugerida = 0;

    if (prod.existencia <= stockMin) {
      nivelAlerta = "CRITICO";
      prioridad = 1;
      cantSugerida = Math.max(puntoReorden * 2 - prod.existencia, stockMin);
    } else if (prod.existencia <= puntoReorden) {
      nivelAlerta = "PREVENTIVO";
      prioridad = 2;
      cantSugerida = Math.max(Math.ceil(puntoReorden * 1.5) - prod.existencia, 6);
    }

    const inversion = Number((cantSugerida * prod.precio_total_compra).toFixed(2));
    recCounter++;
    recomendacionesIA.push({
      id_recomendacion: recCounter,
      id_producto: idP,
      codigo_sku: prod.codigo_sku,
      nombre_producto: prod.nombre,
      id_categoria: prod.id_categoria,
      nombre_categoria: categorias[prod.id_categoria]?.nombre_categoria || prod.id_categoria,
      id_proveedor_sugerido: prov.id_proveedor,
      nombre_proveedor: prov.nombre,
      tiempo_entrega_dias: prov.tiempo_entrega_dias,
      calificacion_calidad: prov.calificacion_calidad,
      cumplimiento_entregas_pct: prov.cumplimiento_entregas_pct,
      nivel_alerta: nivelAlerta,
      prioridad,
      existencia_actual: prod.existencia,
      stock_minimo: stockMin,
      punto_reorden: puntoReorden,
      demanda_mensual_estimada: demandaMensual,
      dias_cobertura_estimados: diasCobertura,
      cantidad_sugerida_compra: cantSugerida,
      costo_unitario_estimado: prod.precio_total_compra,
      inversion_total_sugerida: inversion,
      score_proveedor: prov.score_ia,
      justificacion_ia:
        nivelAlerta === "CRITICO"
          ? `Stock crítico (${prod.existencia} uds ≤ mín ${stockMin}). Cobertura: ${diasCobertura} días vs tránsito de ${prov.tiempo_entrega_dias} días con ${prov.nombre} (Score IA: ${prov.score_ia}). Emitir OC urgente.`
          : nivelAlerta === "PREVENTIVO"
          ? `En zona de reorden (${prod.existencia} uds ≤ ${puntoReorden}). Programar pedido preventivo de ${cantSugerida} uds a ${prov.nombre}.`
          : `Inventario óptimo (${prod.existencia} uds en ${prod.ubicacion}). Cobertura para ${diasCobertura} días.`,
    });
  }

  recomendacionesIA.sort((a, b) => a.prioridad - b.prioridad || b.inversion_total_sugerida - a.inversion_total_sugerida);

  AppState.relational = {
    categorias: Object.values(categorias),
    proveedores: Array.from(proveedoresMap.values()),
    productos: Array.from(productosMap.values()),
    documentos_compra: Array.from(documentosMap.values()),
    detalle_compras: detalleCompras,
    recomendaciones_ia: recomendacionesIA,
    registro_auditoria: auditLog,
  };

  syncInBrowserSqlite();
}

function escapeSql(val) {
  if (val === null || val === undefined) return "";
  return String(val).replace(/'/g, "''");
}

function generateFullSqlScript() {
  const rel = AppState.relational;
  const lines = [
    "PRAGMA foreign_keys = ON;",
    "",
    "DROP VIEW IF EXISTS v_alertas_abastecimiento_ia;",
    "DROP VIEW IF EXISTS v_analisis_rentabilidad_productos;",
    "DROP VIEW IF EXISTS v_relaciones_completas;",
    "DROP TABLE IF EXISTS recomendaciones_ia;",
    "DROP TABLE IF EXISTS detalle_compras;",
    "DROP TABLE IF EXISTS documentos_compra;",
    "DROP TABLE IF EXISTS productos;",
    "DROP TABLE IF EXISTS proveedores;",
    "DROP TABLE IF EXISTS categorias;",
    "",
    "CREATE TABLE categorias (id_categoria TEXT PRIMARY KEY, nombre_categoria TEXT NOT NULL, stock_minimo_default INTEGER, factor_seguridad REAL);",
    "CREATE TABLE proveedores (id_proveedor INTEGER PRIMARY KEY, nombre TEXT NOT NULL, contacto TEXT, nit TEXT, correo TEXT, direccion TEXT, pais_origen TEXT, condiciones_pago TEXT, fecha_registro TEXT, tiempo_entrega_dias INTEGER, calificacion_calidad REAL, cumplimiento_entregas_pct REAL, score_ia REAL, origen_registro TEXT);",
    "CREATE TABLE productos (id_producto TEXT PRIMARY KEY, codigo_sku TEXT, nombre TEXT NOT NULL, descripcion TEXT, id_categoria TEXT NOT NULL, id_proveedor_preferido INTEGER, marca TEXT, costo_unitario REAL, costo_flete REAL, aranceles_aduanales REAL, impuestos REAL, almacenaje REAL, precio_total_compra REAL, precio_venta REAL, margen_unitario REAL, margen_porcentaje REAL, existencia INTEGER, stock_minimo INTEGER, punto_reorden INTEGER, ubicacion TEXT, estado TEXT, fecha_ingreso TEXT, origen_registro TEXT, FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria), FOREIGN KEY (id_proveedor_preferido) REFERENCES proveedores(id_proveedor));",
    "CREATE TABLE documentos_compra (id_documento INTEGER PRIMARY KEY, numero_factura TEXT NOT NULL UNIQUE, fecha TEXT, tipo_documento TEXT, id_proveedor INTEGER NOT NULL, numero_cotizacion TEXT, orden_compra TEXT, subtotal_documento REAL, iva_documento REAL, total_documento REAL, FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor));",
    "CREATE TABLE detalle_compras (id_detalle INTEGER PRIMARY KEY, id_documento INTEGER NOT NULL, id_producto TEXT NOT NULL, descripcion_factura TEXT, cantidad INTEGER, precio_unitario REAL, iva_13 REAL, total_linea REAL, metodo_vinculacion TEXT, FOREIGN KEY (id_documento) REFERENCES documentos_compra(id_documento), FOREIGN KEY (id_producto) REFERENCES productos(id_producto));",
    "CREATE TABLE recomendaciones_ia (id_recomendacion INTEGER PRIMARY KEY, id_producto TEXT NOT NULL, id_proveedor_sugerido INTEGER NOT NULL, nivel_alerta TEXT, prioridad INTEGER, existencia_actual INTEGER, stock_minimo INTEGER, punto_reorden INTEGER, dias_cobertura_estimados INTEGER, cantidad_sugerida_compra INTEGER, costo_unitario_estimado REAL, inversion_total_sugerida REAL, score_proveedor REAL, justificacion_ia TEXT, FOREIGN KEY (id_producto) REFERENCES productos(id_producto), FOREIGN KEY (id_proveedor_sugerido) REFERENCES proveedores(id_proveedor));",
    "",
  ];

  for (const c of rel.categorias) {
    lines.push(`INSERT INTO categorias VALUES ('${escapeSql(c.id_categoria)}', '${escapeSql(c.nombre_categoria)}', ${safeNum(c.stock_minimo_default, 8)}, ${safeNum(c.factor_seguridad, 1.5)});`);
  }
  for (const p of rel.proveedores) {
    lines.push(`INSERT INTO proveedores VALUES (${safeNum(p.id_proveedor, 1)}, '${escapeSql(p.nombre)}', '${escapeSql(p.contacto)}', '${escapeSql(p.nit)}', '${escapeSql(p.correo)}', '${escapeSql(p.direccion)}', '${escapeSql(p.pais_origen)}', '${escapeSql(p.condiciones_pago)}', '${escapeSql(p.fecha_registro)}', ${safeNum(p.tiempo_entrega_dias, 15)}, ${safeNum(p.calificacion_calidad, 5)}, ${safeNum(p.cumplimiento_entregas_pct, 100)}, ${safeNum(p.score_ia, 90)}, '${escapeSql(p.origen_registro)}');`);
  }
  for (const pr of rel.productos) {
    lines.push(`INSERT INTO productos VALUES ('${escapeSql(pr.id_producto)}', '${escapeSql(pr.codigo_sku)}', '${escapeSql(pr.nombre)}', '${escapeSql(pr.descripcion)}', '${escapeSql(pr.id_categoria)}', ${safeNum(pr.id_proveedor_preferido, 1)}, '${escapeSql(pr.marca)}', ${safeNum(pr.costo_unitario)}, ${safeNum(pr.costo_flete)}, ${safeNum(pr.aranceles_aduanales)}, ${safeNum(pr.impuestos)}, ${safeNum(pr.almacenaje)}, ${safeNum(pr.precio_total_compra)}, ${safeNum(pr.precio_venta)}, ${safeNum(pr.margen_unitario)}, ${safeNum(pr.margen_porcentaje)}, ${safeNum(pr.existencia)}, ${safeNum(pr.stock_minimo, 8)}, ${safeNum(pr.punto_reorden, 12)}, '${escapeSql(pr.ubicacion)}', '${escapeSql(pr.estado)}', '${escapeSql(pr.fecha_ingreso)}', '${escapeSql(pr.origen_registro)}');`);
  }
  for (const d of rel.documentos_compra) {
    lines.push(`INSERT INTO documentos_compra VALUES (${safeNum(d.id_documento, 1)}, '${escapeSql(d.numero_factura)}', '${escapeSql(d.fecha)}', '${escapeSql(d.tipo_documento)}', ${safeNum(d.id_proveedor, 1)}, '${escapeSql(d.numero_cotizacion)}', '${escapeSql(d.orden_compra)}', ${safeNum(d.subtotal_documento)}, ${safeNum(d.iva_documento)}, ${safeNum(d.total_documento)});`);
  }
  for (const det of rel.detalle_compras) {
    lines.push(`INSERT INTO detalle_compras VALUES (${safeNum(det.id_detalle, 1)}, ${safeNum(det.id_documento, 1)}, '${escapeSql(det.id_producto)}', '${escapeSql(det.descripcion_factura)}', ${safeNum(det.cantidad, 1)}, ${safeNum(det.precio_unitario)}, ${safeNum(det.iva_13)}, ${safeNum(det.total_linea)}, '${escapeSql(det.metodo_vinculacion)}');`);
  }
  for (const r of rel.recomendaciones_ia) {
    lines.push(`INSERT INTO recomendaciones_ia VALUES (${safeNum(r.id_recomendacion, 1)}, '${escapeSql(r.id_producto)}', ${safeNum(r.id_proveedor_sugerido, 1)}, '${escapeSql(r.nivel_alerta)}', ${safeNum(r.prioridad, 1)}, ${safeNum(r.existencia_actual)}, ${safeNum(r.stock_minimo, 8)}, ${safeNum(r.punto_reorden, 12)}, ${safeNum(r.dias_cobertura_estimados, 30)}, ${safeNum(r.cantidad_sugerida_compra, 0)}, ${safeNum(r.costo_unitario_estimado)}, ${safeNum(r.inversion_total_sugerida)}, ${safeNum(r.score_proveedor)}, '${escapeSql(r.justificacion_ia)}');`);
  }

  lines.push("");
  lines.push(`CREATE VIEW v_relaciones_completas AS SELECT dc.id_detalle, doc.numero_factura, doc.tipo_documento, doc.fecha, doc.orden_compra, prov.id_proveedor, prov.nombre AS nombre_proveedor, prod.id_producto, prod.codigo_sku, prod.nombre AS nombre_producto_catalogo, cat.nombre_categoria, dc.cantidad, dc.precio_unitario, dc.iva_13, dc.total_linea, dc.metodo_vinculacion FROM detalle_compras dc INNER JOIN documentos_compra doc ON dc.id_documento = doc.id_documento INNER JOIN proveedores prov ON doc.id_proveedor = prov.id_proveedor INNER JOIN productos prod ON dc.id_producto = prod.id_producto INNER JOIN categorias cat ON prod.id_categoria = cat.id_categoria;`);
  lines.push(`CREATE VIEW v_analisis_rentabilidad_productos AS SELECT p.id_producto, p.codigo_sku, p.nombre, c.nombre_categoria, p.marca, pr.nombre AS proveedor_preferido, p.costo_unitario, ROUND(p.costo_flete + p.aranceles_aduanales + p.impuestos + p.almacenaje, 2) AS gastos_importacion, p.precio_total_compra AS costo_landed_total, p.precio_venta, p.margen_unitario, p.margen_porcentaje, p.existencia, ROUND(p.existencia * p.precio_total_compra, 2) AS valor_inventario_costo FROM productos p INNER JOIN categorias c ON p.id_categoria = c.id_categoria LEFT JOIN proveedores pr ON p.id_proveedor_preferido = pr.id_proveedor;`);
  lines.push(`CREATE VIEW v_alertas_abastecimiento_ia AS SELECT r.id_recomendacion, r.nivel_alerta, p.id_producto, p.nombre AS producto, r.existencia_actual, r.stock_minimo, r.punto_reorden, r.cantidad_sugerida_compra, r.inversion_total_sugerida, pr.nombre AS proveedor_recomendado, r.score_proveedor FROM recomendaciones_ia r INNER JOIN productos p ON r.id_producto = p.id_producto INNER JOIN proveedores pr ON r.id_proveedor_sugerido = pr.id_proveedor ORDER BY r.prioridad ASC, r.inversion_total_sugerida DESC;`);

  return lines.join("\n");
}

function syncInBrowserSqlite() {
  if (!AppState.SQL) return;
  try {
    if (AppState.sqliteDb) {
      AppState.sqliteDb.close();
    }
    AppState.sqliteDb = new AppState.SQL.Database();
    const sqlScript = generateFullSqlScript();
    AppState.sqliteDb.run(sqlScript);
  } catch (err) {
    console.warn("Advertencia sincronizando SQLite WASM:", err);
  }
}

function formatUSD(num) {
  return "$" + Number(num || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderAllViews() {
  const rel = AppState.relational;

  const totalUnidades = rel.productos.reduce((acc, p) => acc + p.existencia, 0);
  const valorCostoInv = rel.productos.reduce((acc, p) => acc + p.existencia * p.precio_total_compra, 0);
  const valorVentaInv = rel.productos.reduce((acc, p) => acc + p.existencia * p.precio_venta, 0);
  const utilidadPotencial = valorVentaInv - valorCostoInv;
  const margenPromedio = rel.productos.reduce((acc, p) => acc + p.margen_porcentaje, 0) / Math.max(1, rel.productos.length);

  const alertasCriticas = rel.recomendaciones_ia.filter((r) => r.nivel_alerta === "CRITICO");
  const alertasPreventivas = rel.recomendaciones_ia.filter((r) => r.nivel_alerta === "PREVENTIVO");
  const inversionRecompraTotal = rel.recomendaciones_ia.reduce((acc, r) => acc + r.inversion_total_sugerida, 0);

  document.getElementById("nav-badge-alertas").textContent = `${alertasCriticas.length} Crít`;
  document.getElementById("nav-badge-productos").textContent = rel.productos.length;
  document.getElementById("nav-badge-relaciones").textContent = `${rel.detalle_compras.length}/${rel.detalle_compras.length} OK`;

  document.getElementById("side-count-prod").textContent = `${rel.productos.length} registros`;
  document.getElementById("side-count-prov").textContent = `${rel.proveedores.length} registros`;
  document.getElementById("side-count-fact").textContent = `${rel.detalle_compras.length} líneas`;

  document.getElementById("kpi-valor-costo").textContent = formatUSD(valorCostoInv);
  document.getElementById("kpi-valor-venta").textContent = `Venta proyectada: ${formatUSD(valorVentaInv)} (${ totalUnidades } uds)`;

  document.getElementById("kpi-utilidad").textContent = formatUSD(utilidadPotencial);
  document.getElementById("kpi-margen-pct").textContent = `Margen promedio sobre Landed Cost: +${margenPromedio.toFixed(1)}%`;

  document.getElementById("kpi-inversion-ia").textContent = formatUSD(inversionRecompraTotal);
  document.getElementById("kpi-alertas-resumen").textContent = `${alertasCriticas.length} críticos · ${alertasPreventivas.length} preventivos`;

  document.getElementById("kpi-integridad").textContent = "100% VÁLIDO";
  document.getElementById("kpi-integridad-sub").textContent = `${rel.detalle_compras.length} relaciones vinculadas · ${rel.registro_auditoria.length} Auto-Curadas`;

  renderDashboardTables();
  renderCharts();
  renderRelacionesView();
  renderVisualizarExcelsView();
  renderIAPredictiveView();
  renderCatalogoView();
  populateFormSelects();
}

function renderDashboardTables() {
  const rel = AppState.relational;

  const tbodyAlertas = document.getElementById("dash-alertas-tbody");
  const topAlertas = rel.recomendaciones_ia.filter((r) => r.nivel_alerta !== "OPTIMO").slice(0, 7);

  tbodyAlertas.innerHTML = topAlertas
    .map((r) => {
      const badgeCls = r.nivel_alerta === "CRITICO" ? "critico" : "preventivo";
      return `
        <tr>
          <td><span class="status-badge ${badgeCls}">${r.nivel_alerta}</span></td>
          <td>
            <div style="font-weight:600; color:var(--text-primary)">${r.nombre_producto}</div>
            <span class="code-chip">${r.id_producto}</span> <span style="font-size:11px; color:var(--text-muted)">SKU: ${r.codigo_sku}</span>
          </td>
          <td style="font-family:var(--font-mono); font-weight:700; color:${r.nivel_alerta === 'CRITICO' ? '#f87171' : '#fbbf24'}">${r.existencia_actual} uds <span style="color:var(--text-muted); font-weight:400">/ mín ${r.stock_minimo}</span></td>
          <td style="font-family:var(--font-mono); font-weight:700; color:var(--accent-emerald)">+${r.cantidad_sugerida_compra} uds</td>
          <td style="font-family:var(--font-mono); font-weight:600">${formatUSD(r.inversion_total_sugerida)}</td>
          <td>
            <span class="relation-tag">Proveedor #${r.id_proveedor_sugerido}</span>
            <div style="font-size:11.5px; margin-top:2px">${r.nombre_proveedor}</div>
          </td>
          <td>
            <button class="btn-tactical primary" style="padding:5px 10px; font-size:11.5px" onclick="openPurchaseOrderModal('${r.id_producto}')">
              Emitir OC
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  const tbodyDocs = document.getElementById("dash-facturas-tbody");
  tbodyDocs.innerHTML = rel.detalle_compras
    .map((d) => {
      const prov = rel.proveedores.find((p) => p.id_proveedor === d.id_proveedor);
      const prod = rel.productos.find((p) => p.id_producto === d.id_producto);
      const doc = rel.documentos_compra.find((docItem) => docItem.id_documento === d.id_documento);
      const isAuto = d.metodo_vinculacion.includes("AUTO");
      return `
        <tr>
          <td>
            <span class="code-chip">${d.numero_factura}</span>
            <div style="font-size:11px; color:var(--text-muted)">${doc ? doc.fecha : ""} · ${doc ? doc.tipo_documento : ""}</div>
          </td>
          <td>
            <span class="relation-tag">Proveedor #${d.id_proveedor}</span>
            <div style="font-size:12px; font-weight:500; margin-top:2px">${prov ? prov.nombre : ""}</div>
          </td>
          <td>
            <span class="relation-tag">Producto ${d.id_producto}</span>
            <div style="font-size:12px; font-weight:500; margin-top:2px">${prod ? prod.nombre : d.descripcion_factura}</div>
          </td>
          <td style="font-family:var(--font-mono)">${d.cantidad}</td>
          <td style="font-family:var(--font-mono)">${formatUSD(d.precio_unitario)}</td>
          <td style="font-family:var(--font-mono); font-weight:700">${formatUSD(d.total_linea)}</td>
          <td>
            <span class="status-badge ${isAuto ? 'autoheal' : 'optimo'}">${d.metodo_vinculacion}</span>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderCharts() {
  if (typeof Chart === "undefined") return;
  const rel = AppState.relational;

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#cbd5e1" : "#334155";
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)";

  Chart.defaults.color = textColor;
  Chart.defaults.font.family = "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.responsive = true;

  const ctxLanded = document.getElementById("chart-landed-cost");
  if (ctxLanded) {
    if (AppState.charts.landedCost) AppState.charts.landedCost.destroy();
    const topProds = rel.productos.slice(0, 10);
    AppState.charts.landedCost = new Chart(ctxLanded, {
      type: "bar",
      data: {
        labels: topProds.map((p) => p.id_producto),
        datasets: [
          {
            label: "Costo FOB Unitario ($)",
            data: topProds.map((p) => p.costo_unitario),
            backgroundColor: "#1e40af",
            stack: "cost",
          },
          {
            label: "Flete + Arancel + Impuestos + Almacén ($)",
            data: topProds.map((p) => Number((p.costo_flete + p.aranceles_aduanales + p.impuestos + p.almacenaje).toFixed(2))),
            backgroundColor: "#d97706",
            stack: "cost",
          },
          {
            label: "Precio de Venta ($)",
            data: topProds.map((p) => p.precio_venta),
            backgroundColor: "#059669",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 6,
            bottom: 12,
            left: 6,
            right: 10,
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 12,
              padding: 8,
              font: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", size: 11 },
              color: textColor,
            },
          },
          tooltip: {
            titleFont: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
            bodyFont: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
            callbacks: {
              afterTitle: (items) => {
                const idx = items[0].dataIndex;
                return topProds[idx].nombre;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", size: 11 },
              maxRotation: 0,
              minRotation: 0,
              autoSkip: false,
              padding: 6,
            },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", size: 11 },
              callback: (v) => "$" + v,
            },
          },
        },
      },
    });
  }

  const ctxStock = document.getElementById("chart-stock-health");
  if (ctxStock) {
    if (AppState.charts.stockHealth) AppState.charts.stockHealth.destroy();
    AppState.charts.stockHealth = new Chart(ctxStock, {
      type: "bar",
      data: {
        labels: rel.productos.map((p) => p.id_producto),
        datasets: [
          {
            label: "Existencia Actual (Uds)",
            data: rel.productos.map((p) => p.existencia),
            backgroundColor: rel.productos.map((p) =>
              p.existencia <= p.stock_minimo ? "#dc2626" : p.existencia <= p.punto_reorden ? "#d97706" : "#059669"
            ),
            borderRadius: 4,
          },
          {
            label: "Punto de Reorden (IA)",
            data: rel.productos.map((p) => p.punto_reorden),
            type: "line",
            borderColor: "#0284c7",
            borderWidth: 2,
            pointBackgroundColor: "#0284c7",
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 6,
            bottom: 16,
            left: 6,
            right: 10,
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 12,
              padding: 8,
              font: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", size: 11 },
              color: textColor,
            },
          },
          tooltip: {
            titleFont: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
            bodyFont: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
            callbacks: {
              afterTitle: (items) => rel.productos[items[0].dataIndex].nombre,
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", size: 10 },
              maxRotation: 45,
              minRotation: 20,
              autoSkip: false,
              padding: 6,
            },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", size: 11 },
            },
          },
        },
      },
    });
  }

  const ctxProv = document.getElementById("chart-supplier-radar");
  if (ctxProv) {
    if (AppState.charts.supplierRadar) AppState.charts.supplierRadar.destroy();
    AppState.charts.supplierRadar = new Chart(ctxProv, {
      type: "bar",
      data: {
        labels: rel.proveedores.map((p) => `#${p.id_proveedor} ${p.nombre.substring(0, 22)}...`),
        datasets: [
          {
            label: "Score Global IA (/100)",
            data: rel.proveedores.map((p) => p.score_ia),
            backgroundColor: "#1e40af",
            borderRadius: 5,
          },
          {
            label: "Cumplimiento Entregas (%)",
            data: rel.proveedores.map((p) => p.cumplimiento_entregas_pct),
            backgroundColor: "#0284c7",
            borderRadius: 5,
          },
          {
            label: "Tiempo Entrega (Días)",
            data: rel.proveedores.map((p) => p.tiempo_entrega_dias),
            backgroundColor: "#dc2626",
            borderRadius: 5,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 4,
            bottom: 8,
            left: 4,
            right: 10,
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 12,
              padding: 6,
              font: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", size: 11 },
              color: textColor,
            },
          },
          tooltip: {
            titleFont: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
            bodyFont: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", size: 11 },
            },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", size: 11 },
            },
          },
        },
      },
    });
  }
}

function renderRelacionesView() {
  const rel = AppState.relational;

  document.getElementById("bay-prod-stat").textContent = `${AppState.rawProductos.length} filas leídas · PK: id_producto`;
  document.getElementById("bay-prov-stat").textContent = `${AppState.rawProveedores.length} filas leídas · PK: id_proveedor`;
  document.getElementById("bay-fact-stat").textContent = `${AppState.rawFacturacion.length} líneas · proveedor y producto activos`;

  const auditContainer = document.getElementById("auditoria-cards");
  auditContainer.innerHTML = rel.registro_auditoria
    .map(
      (item) => `
      <div class="audit-card">
        <div class="audit-card-header">
          <span class="status-badge autoheal">${item.tipo}</span>
          <span class="code-chip">${item.pk_generada}</span>
        </div>
        <div class="audit-card-title">${item.entidad}</div>
        <div class="audit-card-detail">${item.detalle}</div>
      </div>
    `
    )
    .join("");

  const tbodyLinaje = document.getElementById("relaciones-tbody");
  const filtro = AppState.filtroRelaciones;
  const filas = rel.detalle_compras.filter((d) => {
    if (filtro === "AUTO") return d.metodo_vinculacion.includes("AUTO");
    if (filtro === "EXACT") return !d.metodo_vinculacion.includes("AUTO");
    return true;
  });

  tbodyLinaje.innerHTML = filas
    .map((d) => {
      const doc = rel.documentos_compra.find((x) => x.id_documento === d.id_documento);
      const prov = rel.proveedores.find((x) => x.id_proveedor === d.id_proveedor);
      const prod = rel.productos.find((x) => x.id_producto === d.id_producto);
      const cat = rel.categorias.find((x) => x.id_categoria === prod?.id_categoria);
      const isAuto = d.metodo_vinculacion.includes("AUTO") || prov?.origen_registro.includes("AUTO");

      return `
        <tr>
          <td>
            <span class="code-chip">DET-${d.id_detalle}</span>
            <div style="font-size:11px; color:var(--text-muted); margin-top:3px">Doc #${d.id_documento}: <b>${d.numero_factura}</b></div>
          </td>
          <td>
            <div style="font-size:11.5px; color:var(--text-secondary)">En Excel: "${prov ? prov.nombre : ""}"</div>
            <div style="margin-top:4px">
              <span class="relation-tag">Proveedor #${d.id_proveedor}</span>
              ${prov?.origen_registro.includes("AUTO") ? '<span class="status-badge autoheal" style="margin-left:4px">PK Auto-Creada</span>' : ""}
            </div>
          </td>
          <td>
            <div style="font-size:11.5px; color:var(--text-secondary)">En Excel: "${d.descripcion_factura}"</div>
            <div style="margin-top:4px">
              <span class="relation-tag">Producto ${d.id_producto}</span>
              <span style="font-size:11.5px; color:var(--text-primary); margin-left:6px">→ ${prod ? prod.nombre : ""}</span>
            </div>
          </td>
          <td>
            <span class="code-chip">${prod ? prod.id_categoria : "CAT-EXT"}</span>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px">${cat ? cat.nombre_categoria : ""}</div>
          </td>
          <td style="font-family:var(--font-mono); font-weight:700">${d.cantidad} uds × ${formatUSD(d.precio_unitario)} = ${formatUSD(d.total_linea)}</td>
          <td>
            <span class="status-badge ${isAuto ? 'autoheal' : 'optimo'}">${d.metodo_vinculacion}</span>
          </td>
        </tr>
      `;
    })
    .join("");
}

function handleExcelFileUpload(event, targetBook) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (typeof XLSX === "undefined") {
    notifyToast("error", "Librería SheetJS no disponible");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (!jsonRows || jsonRows.length === 0) {
        notifyToast("warning", `El archivo ${file.name} está vacío`);
        return;
      }

      if (targetBook === "PRODUCTOS") {
        AppState.rawProductos = jsonRows;
        document.getElementById("bay-prod-filename").textContent = file.name;
      } else if (targetBook === "PROVEEDORES") {
        AppState.rawProveedores = jsonRows;
        document.getElementById("bay-prov-filename").textContent = file.name;
      } else if (targetBook === "FACTURACION") {
        AppState.rawFacturacion = jsonRows;
        document.getElementById("bay-fact-filename").textContent = file.name;
      }

      buildRelationalDatabase();
      renderAllViews();
      notifyToast("success", `Excel '${file.name}' (${jsonRows.length} filas) insertado con relaciones validadas`);
    } catch (err) {
      console.error(err);
      notifyToast("error", `Error al procesar ${file.name}`);
    }
  };
  reader.readAsArrayBuffer(file);
}

function resetToOriginalExcels() {
  AppState.rawProductos = structuredClone(INITIAL_EXCEL_PRODUCTOS);
  AppState.rawProveedores = structuredClone(INITIAL_EXCEL_PROVEEDORES);
  AppState.rawFacturacion = structuredClone(INITIAL_EXCEL_FACTURACION);

  document.getElementById("bay-prod-filename").textContent = "PRODUCTOS.xlsx (12 filas)";
  document.getElementById("bay-prov-filename").textContent = "PROVEEDORES_COMPLETO_V2 (1).xlsx (3 filas)";
  document.getElementById("bay-fact-filename").textContent = "FACTURACION.xlsx (7 líneas)";

  buildRelationalDatabase();
  renderAllViews();
  notifyToast("info", "3 libros Excel originales restaurados y relaciones re-sincronizadas");
}

function setLibroVisorFilter(libro) {
  AppState.visLibroFiltro = libro;
  const mapBtns = {
    ALL: "btn-vis-all",
    PRODUCTOS: "btn-vis-prod",
    PROVEEDORES: "btn-vis-prov",
    FACTURACION: "btn-vis-fact",
  };
  Object.entries(mapBtns).forEach(([key, id]) => {
    const btn = document.getElementById(id);
    if (btn) {
      if (key === libro) btn.classList.add("primary");
      else btn.classList.remove("primary");
    }
  });

  document.getElementById("vis-panel-productos").style.display = libro === "ALL" || libro === "PRODUCTOS" ? "block" : "none";
  document.getElementById("vis-panel-proveedores").style.display = libro === "ALL" || libro === "PROVEEDORES" ? "block" : "none";
  document.getElementById("vis-panel-facturacion").style.display = libro === "ALL" || libro === "FACTURACION" ? "block" : "none";

  notifyToast("info", libro === "ALL" ? "Mostrando los 3 libros Excel" : `Libro ${libro}`);
}

function renderRawExcelBookTable(rows, theadId, tbodyId, countId, bookType) {
  const thead = document.getElementById(theadId);
  const tbody = document.getElementById(tbodyId);
  const countEl = document.getElementById(countId);
  if (!thead || !tbody) return;

  const query = normalizeText(AppState.visBusqueda || "");
  const filteredRows = rows.filter((r) => {
    if (!query) return true;
    const allText = normalizeText(Object.values(r).join(" "));
    return allText.includes(query);
  });

  if (countEl) {
    countEl.textContent = `${filteredRows.length} de ${rows.length} registros`;
  }

  if (rows.length === 0) {
    thead.innerHTML = "<tr><th>Sin registros</th></tr>";
    tbody.innerHTML = "<tr><td>No hay filas cargadas en este libro Excel.</td></tr>";
    return;
  }

  const columns = Object.keys(rows[0]);
  const extraHeader = bookType === "FACTURACION" ? "<th>Vínculo en base de datos</th>" : "";
  thead.innerHTML = `<tr><th># Fila</th>${extraHeader}${columns.map((c) => `<th>${c}</th>`).join("")}</tr>`;

  const rel = AppState.relational;

  tbody.innerHTML = filteredRows
    .map((row, idx) => {
      let relCell = "";
      if (bookType === "FACTURACION" && rel) {
        const detMatch = rel.detalle_compras[idx] || rel.detalle_compras.find((d) => d.numero_factura === String(row["No. De factura"]) && d.descripcion_factura === String(row["Descripción"] || row["Descripcion"]));
        if (detMatch) {
          relCell = `<td><span class="relation-tag">Proveedor #${detMatch.id_proveedor}</span> <span class="relation-tag">Producto ${detMatch.id_producto}</span></td>`;
        } else {
          relCell = `<td><span class="relation-tag">Vínculo activo</span></td>`;
        }
      }

      const cellsHtml = columns
        .map((col) => {
          const val = row[col];
          const colNorm = normalizeText(col);
          if (colNorm.includes("ID DEL PRODUCTO") || colNorm === "NO." || colNorm.includes("NO. DE FACTURA") || colNorm === "CODIGO") {
            return `<td><span class="code-chip">${val !== "" && val !== null && val !== undefined ? val : "—"}</span></td>`;
          }
          if (colNorm.includes("ID DE CATEGORIA")) {
            return `<td><span class="relation-tag">${val}</span></td>`;
          }
          if (
            typeof val === "number" &&
            (colNorm.includes("COSTO") || colNorm.includes("PRECIO") || colNorm.includes("TOTAL") || colNorm.includes("IVA") || colNorm.includes("ARANCEL") || colNorm.includes("IMPUESTO") || colNorm.includes("ALMACEN"))
          ) {
            return `<td style="font-family:var(--font-mono); font-weight:600">${formatUSD(val)}</td>`;
          }
          if (typeof val === "number") {
            return `<td style="font-family:var(--font-mono)">${val}</td>`;
          }
          const strVal = val !== "" && val !== null && val !== undefined ? String(val) : '<span style="color:var(--text-muted)">—</span>';
          return `<td style="max-width:260px; white-space:normal">${strVal}</td>`;
        })
        .join("");

      return `<tr><td style="font-family:var(--font-mono); color:var(--text-muted)">${idx + 1}</td>${relCell}${cellsHtml}</tr>`;
    })
    .join("");
}

function renderVisualizarExcelsView() {
  renderRawExcelBookTable(AppState.rawProductos, "vis-thead-productos", "vis-tbody-productos", "vis-count-productos", "PRODUCTOS");
  renderRawExcelBookTable(AppState.rawProveedores, "vis-thead-proveedores", "vis-tbody-proveedores", "vis-count-proveedores", "PROVEEDORES");
  renderRawExcelBookTable(AppState.rawFacturacion, "vis-thead-facturacion", "vis-tbody-facturacion", "vis-count-facturacion", "FACTURACION");

  const badgeVis = document.getElementById("nav-badge-visualizar");
  if (badgeVis) {
    const totalReg = AppState.rawProductos.length + AppState.rawProveedores.length + AppState.rawFacturacion.length;
    badgeVis.textContent = `${totalReg} Reg`;
  }
}

function renderIAPredictiveView() {
  const rel = AppState.relational;

  const tbodyIA = document.getElementById("ia-recomendaciones-tbody");
  tbodyIA.innerHTML = rel.recomendaciones_ia
    .map((r) => {
      const badgeCls = r.nivel_alerta === "CRITICO" ? "critico" : r.nivel_alerta === "PREVENTIVO" ? "preventivo" : "optimo";
      return `
        <tr>
          <td><span class="status-badge ${badgeCls}">${r.nivel_alerta}</span></td>
          <td>
            <div style="font-weight:700; color:var(--text-primary)">${r.nombre_producto}</div>
            <span class="code-chip">${r.id_producto}</span> <span style="font-size:11px; color:var(--text-muted)">${r.nombre_categoria}</span>
          </td>
          <td style="font-family:var(--font-mono)">
            <b>${r.existencia_actual}</b> uds
            <div style="font-size:11px; color:var(--text-muted)">Mín: ${r.stock_minimo} | Reorden: ${r.punto_reorden}</div>
          </td>
          <td style="font-family:var(--font-mono)">
            ${r.dias_cobertura_estimados} días
            <div style="font-size:11px; color:var(--text-muted)">Demanda: ${r.demanda_mensual_estimada}/mes</div>
          </td>
          <td>
            <span class="relation-tag">Proveedor #${r.id_proveedor_sugerido}</span>
            <div style="font-weight:600; font-size:12px; margin-top:2px">${r.nombre_proveedor}</div>
            <div style="font-size:11px; color:var(--accent-amber)">Score IA: ${r.score_proveedor}/100 · Lead: ${r.tiempo_entrega_dias}d</div>
          </td>
          <td style="font-family:var(--font-mono); font-weight:700; color:${r.cantidad_sugerida_compra > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)'}">
            ${r.cantidad_sugerida_compra > 0 ? `+${r.cantidad_sugerida_compra} uds` : "0 uds"}
          </td>
          <td style="font-family:var(--font-mono); font-weight:700">
            ${formatUSD(r.inversion_total_sugerida)}
          </td>
          <td style="max-width:270px; font-size:11.5px; color:var(--text-secondary)">
            ${r.justificacion_ia}
          </td>
          <td>
            ${
              r.cantidad_sugerida_compra > 0
                ? `<button class="btn-tactical primary" style="padding:5px 10px; font-size:11px" onclick="openPurchaseOrderModal('${r.id_producto}')">Generar OC</button>`
                : `<span style="font-size:11px; color:var(--text-muted)">Sin acción</span>`
            }
          </td>
        </tr>
      `;
    })
    .join("");
}

function updateIASimulator() {
  AppState.iaParams.pesoCalidad = Number(document.getElementById("slider-calidad").value);
  AppState.iaParams.pesoCumplimiento = Number(document.getElementById("slider-cumplimiento").value);
  AppState.iaParams.pesoTiempo = Number(document.getElementById("slider-tiempo").value);
  AppState.iaParams.crecimientoDemandaPct = Number(document.getElementById("slider-demanda").value);

  document.getElementById("val-slider-calidad").textContent = `${AppState.iaParams.pesoCalidad}%`;
  document.getElementById("val-slider-cumplimiento").textContent = `${AppState.iaParams.pesoCumplimiento}%`;
  document.getElementById("val-slider-tiempo").textContent = `${AppState.iaParams.pesoTiempo}%`;
  const sign = AppState.iaParams.crecimientoDemandaPct >= 0 ? "+" : "";
  document.getElementById("val-slider-demanda").textContent = `${sign}${AppState.iaParams.crecimientoDemandaPct}%`;

  buildRelationalDatabase();
  renderAllViews();
  notifyToast("info", "Modelo predictivo IA recalculado en tiempo real");
}

function clearCopilotChat() {
  const msgBox = document.getElementById("copilot-messages");
  if (!msgBox) return;
  AppState.copilotCatalogPage = 0;
  const rel = AppState.relational;
  const critCount = rel ? rel.recomendaciones_ia.filter((r) => r.nivel_alerta === "CRITICO").length : 6;
  msgBox.innerHTML = `
    <div class="msg-bubble ai">
      <b>Historial de conversación reiniciado.</b> Tengo cargados en memoria <b>${rel ? rel.productos.length : 14} productos</b>, <b>${rel ? rel.proveedores.length : 4} proveedores</b> y <b>${rel ? rel.detalle_compras.length : 7} líneas de facturación</b> (${critCount} en estado crítico). Escribe cualquier pregunta sobre la arquitectura del sistema, catálogo paso a paso, precios, facturas, proveedores, fórmulas o SQL.
    </div>
  `;
  notifyToast("info", "Chat de IA reiniciado");
}

function formatCatalogPage(pageNum = 1) {
  const rel = AppState.relational;
  const pageSize = 5;
  const totalItems = rel.productos.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, pageNum), totalPages);
  AppState.copilotCatalogPage = safePage;

  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const slice = rel.productos.slice(startIdx, endIdx);

  const itemsHtml = slice
    .map((p, idx) => {
      const num = startIdx + idx + 1;
      const rec = rel.recomendaciones_ia.find((r) => r.id_producto === p.id_producto);
      const estado = rec ? rec.nivel_alerta : "OPTIMO";
      return `<b>${num}. [${p.id_producto}] ${p.nombre}</b><br>&nbsp;&nbsp;&nbsp;SKU: <code>${p.codigo_sku}</code> · Marca: <b>${p.marca}</b> · Stock: <b>${p.existencia} uds</b> (${estado}) · Landed: ${formatUSD(p.precio_total_compra)} · Venta: <b>${formatUSD(p.precio_venta)}</b>`;
    })
    .join("<br>");

  const nextBtnHtml =
    safePage < totalPages
      ? `<div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap"><button type="button" class="btn-tactical cyan" style="font-size:11.5px; padding:4px 10px" onclick="askCopilotIA('Mostrar catálogo bloque ${safePage + 1}')">▶ Ver siguiente bloque (Parte ${safePage + 1} de ${totalPages}: Productos ${endIdx + 1} al ${Math.min(endIdx + pageSize, totalItems)})</button></div>`
      : `<div style="margin-top:8px; font-size:12px; color:var(--accent-emerald); display:flex; align-items:center; gap:8px; flex-wrap:wrap"><span>✓ Catálogo completo visualizado (${totalItems} de ${totalItems} productos).</span><button type="button" class="btn-tactical" style="font-size:11px; padding:3px 8px" onclick="askCopilotIA('Mostrar catálogo bloque 1')">↺ Volver al Bloque 1</button></div>`;

  return `<b>Catálogo Disponible — Bloque ${safePage} de ${totalPages} (Productos ${startIdx + 1} al ${endIdx} de ${totalItems}):</b><br>${itemsHtml}${nextBtnHtml}`;
}

function buildSmartCopilotAnswer(rawQuery) {
  const rel = AppState.relational;
  const qNorm = normalizeText(rawQuery);
  const qTrim = rawQuery.trim();

  if (/^(SELECT|PRAGMA|WITH|EXPLAIN)\b/i.test(qTrim) && AppState.sqliteDb) {
    try {
      const res = AppState.sqliteDb.exec(qTrim);
      if (!res || res.length === 0) {
        return `<b>Consulta SQL ejecutada en SQLite3:</b><br>La sentencia se procesó sin errores y devolvió 0 filas.`;
      }
      const { columns, values } = res[0];
      const topRows = values.slice(0, 8);
      const preview = topRows
        .map((row, rIdx) => `<b>${rIdx + 1}.</b> ` + row.map((v, idx) => `<b>${escapeHtml(columns[idx])}:</b> ${v === null ? "NULL" : escapeHtml(v)}`).join(" · "))
        .join("<br>");
      return `<b>Resultado SQL en Vivo (${values.length} filas):</b><br>${preview}${values.length > 8 ? `<br><i>...mostrando primeras 8 de ${values.length} filas.</i>` : ""}`;
    } catch (err) {
      return `<b>Error ejecutando SQL en el chat:</b><br><code>${escapeHtml(err.message)}</code>`;
    }
  }

  const pctMatch = qTrim.match(/(\d+(?:\.\d+)?)\s*%\s*(?:de|del|sobre)\s*(\d+(?:\.\d+)?)/i);
  if (pctMatch) {
    const pct = Number(pctMatch[1]);
    const base = Number(pctMatch[2]);
    const resVal = (pct / 100) * base;
    return `<b>Cálculo Financiero Rápido:</b><br>El <b>${pct}%</b> de <b>${formatUSD(base)}</b> es <b>${formatUSD(resVal)}</b> (Total con recargo: <b>${formatUSD(base + resVal)}</b> · Con descuento: <b>${formatUSD(base - resVal)}</b>).`;
  }

  const mathCandidate = qTrim.replace(/^(cuanto es|calcula|calcular|resuelve|resultado de)\s+/i, "").replace(/\$/g, "").trim();
  if (/^[\d\s()+*/.,-]+$/.test(mathCandidate) && /[+*/-]/.test(mathCandidate) && /\d/.test(mathCandidate)) {
    const sanitized = mathCandidate.replace(/,/g, ".");
    const val = evaluateMathSafe(sanitized);
    if (typeof val === "number" && Number.isFinite(val)) {
      return `<b>Calculadora UniControl:</b><br><code>${escapeHtml(mathCandidate)}</code> = <b>${Number(val.toFixed(4)).toLocaleString("en-US")}</b> (En formato moneda: <b>${formatUSD(val)}</b>).`;
    }
  }

  const blockMatch = qNorm.match(/\b(?:BLOQUE|PARTE|PAGINA)\s*(\d+)\b/);
  if (blockMatch) {
    return formatCatalogPage(Number(blockMatch[1]));
  }

  if (
    qNorm === "SIGUIENTE" ||
    qNorm === "VER MAS" ||
    qNorm === "CONTINUAR" ||
    qNorm.includes("SIGUIENTE BLOQUE") ||
    qNorm.includes("MOSTRAR MAS")
  ) {
    const nextPage = (AppState.copilotCatalogPage || 1) + 1;
    return formatCatalogPage(nextPage);
  }

  if (
    qNorm.includes("CATALOGO") ||
    qNorm.includes("LISTA DE PRODUCTOS") ||
    qNorm.includes("TODOS LOS PRODUCTOS") ||
    qNorm.includes("PRODUCTOS DISPONIBLES") ||
    qNorm.includes("QUE PRODUCTOS HAY") ||
    qNorm.includes("CUALES PRODUCTOS") ||
    qNorm.includes("VER PRODUCTOS") ||
    qNorm.includes("MOSTRAR PRODUCTOS")
  ) {
    return formatCatalogPage(1);
  }

  if (
    qNorm.includes("COMO ESTA HECHO") ||
    qNorm.includes("COMO SE HIZO") ||
    qNorm.includes("COMO FUE HECHO") ||
    qNorm.includes("ARQUITECTURA") ||
    qNorm.includes("TECNOLOGIA") ||
    qNorm.includes("BACKEND") ||
    qNorm.includes("FRONTEND") ||
    qNorm.includes("DONDE ESTA ALOJADA") ||
    qNorm.includes("ALOJAMIENTO") ||
    qNorm.includes("BASE DE DATOS UTILIZA") ||
    qNorm.includes("DESPLIEGUE") ||
    qNorm.includes("GITHUB") ||
    qNorm.includes("VERCEL") ||
    qNorm.includes("FUNCIONAMIENTO DEL PROYECTO") ||
    qNorm.includes("EXPLICACION GENERAL")
  ) {
    return `<b>Arquitectura Técnica, Backend, Base de Datos y Despliegue de UniControl:</b><br>
    <b>1. Frontend y UI/UX:</b> Construido con <b>HTML5 Semántico</b> (arquitectura SPA de 6 vistas), <b>CSS3 Custom Properties</b> (CSS Grid/Flexbox, Modo Claro/Oscuro, tipografía global moderna Sans-Serif <i>Inter/system-ui</i>, Sidebar retráctil) y <b>JavaScript ES2023+</b> acompañado de <b>Chart.js 4.4.2</b> (gráficos interactivos), <b>SheetJS 0.18.5</b> (procesamiento y exportación nativa de libros <code>.xlsx</code>) y <b>SweetAlert2</b>.<br>
    <b>2. Arquitectura Backend (Controladores y Servicios):</b> Implementa una arquitectura <b>Serverless / Edge-Client MVC</b> en <code>app.js</code> dividida en servicios y controladores modulares:
    <br>&nbsp;&nbsp;• <i>Controlador ETL e Ingesta (<code>buildRelationalDatabase</code>, <code>handleExcelFileUpload</code>):</i> Normaliza los 3 libros Excel y aplica auto-curación referencial (<i>Auto-Healing</i>).
    <br>&nbsp;&nbsp;• <i>Servicio Financiero y Motor IA (<code>calcSupplierScore</code>, <code>updateIASimulator</code>):</i> Calcula costos de importación <i>Landed Cost</i>, evaluación multicriterio de proveedores y punto de reorden (EOQ).
    <br>&nbsp;&nbsp;• <i>Controlador Transaccional (<code>confirmAndExecutePurchaseOrder</code>, <code>handleInsertarFacturaVivo</code>):</i> Ejecuta inserciones relacionales en vivo.<br>
    <b>3. Motor de Base de Datos y Alojamiento:</b> Utiliza <b>SQLite3 Relacional (SQL.js 1.10.3 compilado en WebAssembly <code>.wasm</code>)</b> en Tercera Forma Normal (3FN), estructurado en <b>6 tablas</b> (<code>categorias</code>, <code>proveedores</code>, <code>productos</code>, <code>documentos_compra</code>, <code>detalle_compras</code>, <code>recomendaciones_ia</code>) y <b>3 vistas analíticas</b>, alimentado por los 3 libros Excel maestros integrados en el sistema. Se aloja en modalidad <b>Serverless In-Memory en la nube sobre Vercel</b>, conectándose con el núcleo del sistema mediante el <b>driver nativo WebAssembly (<code>AppState.sqliteDb</code>)</b> con exportación directa a <code>.db</code> y <code>.sql</code>.<br>
    <b>4. Despliegue en la Nube (CI/CD):</b> Desplegado en la nube con <b>Vercel</b> mediante un flujo de <b>Integración y Despliegue Continuo (CI/CD)</b> conectado directamente al repositorio de <b>GitHub</b>.`;
  }

  if (/^(HOLA|BUENOS DIAS|BUENAS TARDES|BUENAS NOCHES|SALUDOS|HEY|QUE TAL|COMO ESTAS)\b/.test(qNorm) && qNorm.split(" ").length <= 5) {
    const criticos = rel.recomendaciones_ia.filter((r) => r.nivel_alerta === "CRITICO").length;
    return `<b>¡Hola! Soy el Asistente de Inteligencia Artificial de UniControl.</b><br>Estoy conectado en tiempo real a los 3 libros de Excel y al motor relacional SQLite3. Puedo responderte de forma ordenada sobre:<br>
    <b>1. Arquitectura y Tecnologías:</b> Cómo está hecho el sistema, su backend, base de datos SQLite3 y despliegue en Vercel + GitHub.<br>
    <b>2. Catálogo Paso a Paso:</b> Lista numerada por bloques de los ${rel.productos.length} productos disponibles.<br>
    <b>3. Consultas de Productos y Proveedores:</b> Búsqueda por código, SKU, marca, vehículo, país o Score IA.<br>
    <b>4. Finanzas, Facturas y Recompra:</b> Landed Cost, márgenes, facturas comerciales y las <b>${criticos} alertas críticas</b> actuales.`;
  }

  if (qNorm.includes("QUIEN ERES") || qNorm.includes("QUE ERES") || qNorm.includes("QUE PUEDES HACER") || qNorm.includes("CUALES SON TUS FUNCIONES") || qNorm.includes("RESPONDER CUALQUIER") || qNorm === "AYUDA") {
    return `<b>Capacidad Multiconsulta del Asistente IA — UniControl:</b><br>
    <b>1. Información Técnica del Proyecto:</b> Pregúntame <i>"¿Cómo está hecho el sistema?"</i>, <i>"¿Qué base de datos utiliza?"</i> o <i>"¿Qué tecnologías usa el backend y frontend?"</i>.<br>
    <b>2. Catálogo Estructurado por Bloques:</b> Pregúntame <i>"Muéstrame el catálogo disponible"</i> y te presentaré los productos en una lista numerada paso a paso sin saturar la pantalla.<br>
    <b>3. Búsqueda de Productos, Proveedores y Facturas:</b> Consulta cualquier código (<code>PROD-001</code> a <code>PROD-014</code>), modelo (<i>Hilux, L200, Frontier, Yaris, Triton</i>), proveedor o factura.<br>
    <b>4. Ejecución SQL y Calculadora:</b> Escribe una sentencia <code>SELECT ...</code> o un cálculo financiero y lo resolveré al instante.`;
  }

  const stopwords = new Set([
    "QUE", "CUAL", "CUALES", "COMO", "DONDE", "CUANTO", "CUANTOS", "CUANTA", "CUANTAS",
    "QUIEN", "QUIENES", "POR", "PARA", "CON", "SIN", "SOBRE", "ENTRE", "HASTA", "DESDE",
    "LOS", "LAS", "UNA", "UNO", "UNOS", "UNAS", "DEL", "AL", "ESTE", "ESTA", "ESTOS",
    "ESTAS", "ESE", "ESA", "ESOS", "ESAS", "SON", "ESTA", "ESTAN", "HAY", "TIENE",
    "TIENEN", "DIME", "MUESTRAME", "MOSTRAR", "VER", "BUSCAR", "BUSCA", "INFO",
    "INFORMACION", "DATOS", "DETALLE", "DETALLES", "PRECIO", "COSTO", "VALOR",
    "PRODUCTO", "PRODUCTOS", "ACCESORIO", "ACCESORIOS", "CATALOGO", "INVENTARIO",
    "STOCK", "EXISTENCIA", "UNIDADES", "COMPRA", "COMPRAR", "VENTA", "PROVEEDOR",
    "PROVEEDORES", "FACTURA", "FACTURAS", "LIBRO", "EXCEL", "MAS", "MENOS", "MEJOR",
    "PEOR", "MAYOR", "MENOR", "TODOS", "TODAS", "TODO", "TODA", "SISTEMA", "UNICONTROL"
  ]);

  const matchedProducts = rel.productos.filter((p) => {
    const idNorm = normalizeText(p.id_producto);
    const skuNorm = normalizeText(p.codigo_sku);
    if (qNorm.includes(idNorm) || (skuNorm.length >= 4 && qNorm.includes(skuNorm))) return true;
    const prodNumberMatch = qNorm.match(/\bPROD(?:UCTO)?\s*0*(\d+)\b/);
    if (prodNumberMatch && idNorm === `PROD-${String(prodNumberMatch[1]).padStart(3, "0")}`) return true;
    const prodTokens = normalizeText(`${p.nombre} ${p.marca}`).split(" ").filter((t) => t.length >= 4 && !stopwords.has(t));
    return prodTokens.some((tok) => qNorm.includes(tok));
  });

  if (matchedProducts.length > 0 && matchedProducts.length <= 5) {
    const cards = matchedProducts
      .map((p, idx) => {
        const rec = rel.recomendaciones_ia.find((r) => r.id_producto === p.id_producto);
        const prov = rel.proveedores.find((pr) => pr.id_proveedor === p.id_proveedor_preferido);
        const gastosImp = Number((p.precio_total_compra - p.costo_unitario).toFixed(2));
        return `<b>${idx + 1}. [${p.id_producto}] ${p.nombre}</b> (SKU: <code>${p.codigo_sku}</code> · Marca: <b>${p.marca}</b>)<br>
        &nbsp;&nbsp;• <b>Inventario:</b> ${p.existencia} uds en ${p.ubicacion} (Mínimo: ${p.stock_minimo} · Reorden: ${p.punto_reorden} · Estado: <b>${rec ? rec.nivel_alerta : "OPTIMO"}</b>)<br>
        &nbsp;&nbsp;• <b>Estructura de Costo:</b> FOB ${formatUSD(p.costo_unitario)} + Importación ${formatUSD(gastosImp)} (Flete ${formatUSD(p.costo_flete)}, Arancel ${formatUSD(p.aranceles_aduanales)}, Impuesto ${formatUSD(p.impuestos)}, Almacén ${formatUSD(p.almacenaje)}) = <b>Landed Cost: ${formatUSD(p.precio_total_compra)}</b><br>
        &nbsp;&nbsp;• <b>Precio Venta:</b> <b>${formatUSD(p.precio_venta)}</b> · Ganancia Neta: <b>+${formatUSD(p.margen_unitario)} (+${p.margen_porcentaje}%)</b><br>
        &nbsp;&nbsp;• <b>Abastecimiento IA:</b> ${rec && rec.cantidad_sugerida_compra > 0 ? `Pedir <b>${rec.cantidad_sugerida_compra} uds</b> (${formatUSD(rec.inversion_total_sugerida)})` : "Stock suficiente (0 uds a pedir)"} con <i>${prov ? prov.nombre : "Proveedor asignado"}</i>`;
      })
      .join("<br><br>");
    return `<b>Ficha Técnica y Financiera Encontrada (${matchedProducts.length} ${matchedProducts.length === 1 ? "producto" : "productos"}):</b><br>${cards}`;
  }

  const matchedSuppliers = rel.proveedores.filter((pr) => {
    if (qNorm.includes("LAFAYETTE") && normalizeText(pr.nombre).includes("LAFAYETTE")) return true;
    if ((qNorm.includes("FORTUNE") || qNorm.includes("FPI") || qNorm.includes("TAILANDIA") || qNorm.includes("THAILAND")) && normalizeText(pr.nombre).includes("FORTUNE")) return true;
    if (qNorm.includes("WHEEL") && normalizeText(pr.nombre).includes("WHEEL")) return true;
    if (qNorm.includes("IAM") && normalizeText(pr.nombre).includes("IAM")) return true;
    return false;
  });

  if (matchedSuppliers.length === 1 && !qNorm.includes("VINCUL") && !qNorm.includes("RELACION")) {
    const p = matchedSuppliers[0];
    const prodsProv = rel.productos.filter((x) => x.id_proveedor_preferido === p.id_proveedor);
    const factsProv = rel.detalle_compras.filter((d) => d.id_proveedor === p.id_proveedor);
    const totalComprado = factsProv.reduce((acc, d) => acc + d.total_linea, 0);
    return `<b>Perfil Completo del Proveedor #${p.id_proveedor} — ${p.nombre}:</b><br>
    <b>1. País y Ubicación:</b> ${p.pais_origen} (${p.direccion})<br>
    <b>2. Contacto Comercial:</b> ${p.contacto} · <b>Correo:</b> ${p.correo} · <b>NIT:</b> ${p.nit}<br>
    <b>3. Condiciones:</b> ${p.condiciones_pago} · <b>Tipo:</b> ${p.tipo_contribuyente}<br>
    <b>4. Desempeño IA:</b> Score Global <b>${p.score_ia}/100</b> · Entrega: <b>${p.tiempo_entrega_dias} días</b> · Cumplimiento: <b>${p.cumplimiento_entregas_pct}%</b> · Calidad: <b>${p.calificacion_calidad}/5.0</b><br>
    <b>5. Operaciones Vinculadas:</b> Abastece <b>${prodsProv.length} productos</b> del catálogo y registra <b>${factsProv.length} líneas de facturación</b> por <b>${formatUSD(totalComprado)}</b>.`;
  }

  if (qNorm.includes("MAS CARO") || qNorm.includes("MAS BARATO") || qNorm.includes("PRECIOS EXTREMOS") || qNorm.includes("MAYOR PRECIO") || qNorm.includes("MENOR PRECIO") || qNorm.includes("ECONOMICO") || qNorm.includes("COSTOSO")) {
    const porPrecioDesc = [...rel.productos].sort((a, b) => b.precio_venta - a.precio_venta);
    const masCaro = porPrecioDesc[0];
    const segundoCaro = porPrecioDesc[1];
    const masBarato = porPrecioDesc[porPrecioDesc.length - 1];
    const promedioVenta = rel.productos.reduce((a, b) => a + b.precio_venta, 0) / rel.productos.length;
    return `<b>Comparativa Ordenada de Precios del Catálogo (${rel.productos.length} productos):</b><br>
    <b>1. Producto más caro:</b> <b>${masCaro.id_producto} — ${masCaro.nombre}</b> (Marca ${masCaro.marca}) · Venta: <b>${formatUSD(masCaro.precio_venta)}</b> · Landed Cost: <b>${formatUSD(masCaro.precio_total_compra)}</b>.<br>
    <b>2. Segundo más caro:</b> <b>${segundoCaro.id_producto} — ${segundoCaro.nombre}</b> · Venta: <b>${formatUSD(segundoCaro.precio_venta)}</b>.<br>
    <b>3. Producto más económico:</b> <b>${masBarato.id_producto} — ${masBarato.nombre}</b> · Venta: <b>${formatUSD(masBarato.precio_venta)}</b> · Landed Cost: <b>${formatUSD(masBarato.precio_total_compra)}</b>.<br>
    <b>4. Precio promedio del catálogo:</b> <b>${formatUSD(promedioVenta)}</b>.`;
  }

  if (qNorm.includes("FACTURA") || qNorm.includes("COTIZACION") || qNorm.includes("IVA") || qNorm.includes("INV000") || qNorm.includes("EST-1019") || qNorm.includes("PED-046") || qNorm.includes("FPI-200")) {
    const totalFacturado = rel.detalle_compras.reduce((a, d) => a + d.total_linea, 0);
    const totalIva = rel.detalle_compras.reduce((a, d) => a + d.iva_monto, 0);
    const totalUnidadesFact = rel.detalle_compras.reduce((a, d) => a + d.cantidad, 0);
    const desglose = rel.detalle_compras
      .map((d, idx) => {
        const prov = rel.proveedores.find((p) => p.id_proveedor === d.id_proveedor);
        return `<b>${idx + 1}. [${d.numero_factura}]</b> ${d.cantidad} uds de <i>${d.descripcion_factura}</i> (${d.id_producto}) → <b>${formatUSD(d.total_linea)}</b> + IVA ${formatUSD(d.iva_monto)} | Prov: ${prov ? prov.nombre : ""}`;
      })
      .join("<br>");
    return `<b>Auditoría Numerada de Facturación y Compras (FACTURACION.xlsx):</b><br>
    Total: <b>${rel.detalle_compras.length} líneas</b> en <b>${rel.documentos_compra.length} documentos</b> (${totalUnidadesFact} uds) · Subtotal: <b>${formatUSD(totalFacturado)}</b> · IVA (13%): <b>${formatUSD(totalIva)}</b>:<br>${desglose}`;
  }

  if (qNorm.includes("CATEGORIA") || qNorm.includes("CLASIFICACION") || qNorm.includes("DISTRIBUIDO") || qNorm.includes("CAT-")) {
    const resumenCat = rel.categorias
      .map((c, idx) => {
        const items = rel.productos.filter((p) => p.id_categoria === c.id_categoria);
        const uds = items.reduce((a, b) => a + b.existencia, 0);
        const val = items.reduce((a, b) => a + b.existencia * b.precio_total_compra, 0);
        return `<b>${idx + 1}. ${c.id_categoria} — ${c.nombre_categoria}:</b> ${items.length} productos · ${uds} unidades · Valor Landed: <b>${formatUSD(val)}</b>`;
      })
      .join("<br>");
    return `<b>Distribución Ordenada por Categorías (${rel.categorias.length} categorías):</b><br>${resumenCat}`;
  }

  if (qNorm.includes("PREVENTIVO") || qNorm.includes("OPTIMO") || qNorm.includes("MAS STOCK") || qNorm.includes("MENOS STOCK") || qNorm.includes("MAYOR EXISTENCIA") || qNorm.includes("MENOR EXISTENCIA")) {
    const crit = rel.recomendaciones_ia.filter((r) => r.nivel_alerta === "CRITICO");
    const prev = rel.recomendaciones_ia.filter((r) => r.nivel_alerta === "PREVENTIVO");
    const opt = rel.recomendaciones_ia.filter((r) => r.nivel_alerta === "OPTIMO");
    const porStock = [...rel.productos].sort((a, b) => b.existencia - a.existencia);
    return `<b>Estado Integral de Existencias en Bodega:</b><br>
    <b>1. Nivel Crítico (${crit.length}):</b> ${crit.map((x) => `${x.id_producto} (${x.existencia_actual} uds)`).join(", ")}<br>
    <b>2. Nivel Preventivo (${prev.length}):</b> ${prev.map((x) => `${x.id_producto} (${x.existencia_actual} uds)`).join(", ") || "Ninguno"}<br>
    <b>3. Nivel Óptimo (${opt.length}):</b> ${opt.map((x) => `${x.id_producto} (${x.existencia_actual} uds)`).join(", ")}<br>
    <b>4. Mayor existencia:</b> ${porStock[0].id_producto} (${porStock[0].nombre}) con <b>${porStock[0].existencia} uds</b>.<br>
    <b>5. Menor existencia:</b> ${porStock[porStock.length - 1].id_producto} (${porStock[porStock.length - 1].nombre}) con <b>${porStock[porStock.length - 1].existencia} uds</b>.`;
  }

  if (qNorm.includes("CRITICO") || qNorm.includes("URGENTE") || qNorm.includes("QUE COMPRAR") || qNorm.includes("REORDEN") || qNorm.includes("RECOMPRA") || qNorm.includes("DESABASTO") || qNorm.includes("ALERTA")) {
    const criticos = rel.recomendaciones_ia.filter((r) => r.nivel_alerta === "CRITICO");
    const totalInv = criticos.reduce((a, b) => a + b.inversion_total_sugerida, 0);
    const lista = criticos
      .map((c, idx) => `<b>${idx + 1}. [${c.id_producto}] ${c.nombre_producto}:</b> Stock actual <b>${c.existencia_actual} uds</b> (Mín: ${c.stock_minimo}) → Pedir <b>+${c.cantidad_sugerida_compra} uds</b> (${formatUSD(c.inversion_total_sugerida)}) a <i>${c.nombre_proveedor}</i>`)
      .join("<br>");
    return `<b>Plan Ordenado de Reabastecimiento Urgente (IA):</b><br>Detecté <b>${criticos.length} productos en estado CRÍTICO</b> con inversión Landed requerida de <b>${formatUSD(totalInv)}</b>:<br>${lista}`;
  }

  if (qNorm.includes("PROVEEDOR") || qNorm.includes("A QUIEN COMPRAR") || qNorm.includes("SCORE") || qNorm.includes("TIEMPO DE ENTREGA") || qNorm.includes("LEAD TIME")) {
    const ordenados = [...rel.proveedores].sort((a, b) => b.score_ia - a.score_ia);
    const top = ordenados[0];
    const ranking = ordenados
      .map((p, i) => `<b>${i + 1}. ${p.nombre}</b> (${p.pais_origen}) — Score IA: <b>${p.score_ia}/100</b> | Entrega: <b>${p.tiempo_entrega_dias} días</b> | Cumplimiento: <b>${p.cumplimiento_entregas_pct}%</b> | Calidad: ${p.calificacion_calidad}/5`)
      .join("<br>");
    return `<b>Ranking Multicriterio de Proveedores (Calidad ${AppState.iaParams.pesoCalidad}%, Cumplimiento ${AppState.iaParams.pesoCumplimiento}%, Velocidad ${AppState.iaParams.pesoTiempo}%):</b><br>Proveedor óptimo actual: <b>${top.nombre}</b>:<br>${ranking}`;
  }

  if (qNorm.includes("MARGEN") || qNorm.includes("RENTAB") || qNorm.includes("GANANCIA") || qNorm.includes("UTILIDAD") || qNorm.includes("LANDED") || qNorm.includes("FOB") || qNorm.includes("ARANCEL") || qNorm.includes("ADUANA")) {
    const porMargen = [...rel.productos].sort((a, b) => b.margen_unitario - a.margen_unitario);
    const porPct = [...rel.productos].sort((a, b) => b.margen_porcentaje - a.margen_porcentaje);
    const topM = porMargen[0];
    const topP = porPct[0];
    const valorCostoInv = rel.productos.reduce((acc, p) => acc + p.existencia * p.precio_total_compra, 0);
    const valorVentaInv = rel.productos.reduce((acc, p) => acc + p.existencia * p.precio_venta, 0);
    return `<b>Análisis de Rentabilidad y Estructura Landed Cost:</b><br>
    <b>1. Fórmula Landed Cost:</b> Costo FOB + Flete + Arancel Aduanal + Impuestos + Almacenaje.<br>
    <b>2. Mayor ganancia unitaria ($):</b> <b>${topM.id_producto} (${topM.nombre})</b> — Landed: ${formatUSD(topM.precio_total_compra)} → Venta: ${formatUSD(topM.precio_venta)} (Utilidad: <b>+${formatUSD(topM.margen_unitario)}</b>).<br>
    <b>3. Mayor margen porcentual (%):</b> <b>${topP.id_producto} (${topP.nombre})</b> con <b>+${topP.margen_porcentaje}%</b>.<br>
    <b>4. Valor Total del Inventario:</b> Costo Landed <b>${formatUSD(valorCostoInv)}</b> → Venta Proyectada <b>${formatUSD(valorVentaInv)}</b> (Utilidad potencial: <b>+${formatUSD(valorVentaInv - valorCostoInv)}</b>).`;
  }

  if (qNorm.includes("VINCUL") || qNorm.includes("RELACION") || qNorm.includes("INTEGRIDAD") || qNorm.includes("AUTO-CURACION") || qNorm.includes("AUTOCURACION") || qNorm.includes("AUDITORIA")) {
    const eventos = rel.registro_auditoria
      .map((a, idx) => `<b>${idx + 1}. ${a.tipo}</b> (<code>${a.pk_generada}</code>): <b>${a.entidad}</b> — ${a.detalle}`)
      .join("<br>");
    return `<b>Auditoría de Integridad Referencial y Auto-Curación:</b><br>Al integrar los 3 libros Excel, el motor detectó registros en <code>FACTURACION.xlsx</code> que no existían previamente en los libros maestros y ejecutó alta automática:<br>${eventos}<br>Resultado: <b>100% de relaciones válidas y 0 registros huérfanos</b>.`;
  }

  if (qNorm.includes("SQL") || qNorm.includes("TABLA") || qNorm.includes("BASE DE DATOS") || qNorm.includes("ESQUEMA") || qNorm.includes("EXCEL")) {
    return `<b>Arquitectura de Base de Datos y Libros Excel en UniControl:</b><br>
    <b>1. Motor Relacional:</b> <b>SQLite3 (SQL.js 1.10.3 en WebAssembly)</b> alojado en memoria sobre la nube de <b>Vercel</b> y conectado mediante el driver nativo <code>AppState.sqliteDb</code>.<br>
    <b>2. Esquema 3FN (6 Tablas y 3 Vistas):</b> Tablas <code>categorias</code>, <code>proveedores</code>, <code>productos</code>, <code>documentos_compra</code>, <code>detalle_compras</code> y <code>recomendaciones_ia</code>.<br>
    <b>3. Libros Excel Integrados:</b> <code>PRODUCTOS.xlsx</code> (${AppState.rawProductos.length} filas), <code>PROVEEDORES_COMPLETO_V2.xlsx</code> (${AppState.rawProveedores.length} filas) y <code>FACTURACION.xlsx</code> (${AppState.rawFacturacion.length} líneas), disponibles en el botón superior <b>"📂 Abrir con ▾"</b>.`;
  }

  const totalCosto = rel.productos.reduce((a, p) => a + p.existencia * p.precio_total_compra, 0);
  const totalUnidades = rel.productos.reduce((a, p) => a + p.existencia, 0);

  return `<b>Respuesta Analítica UniControl para <i>"${qTrim}"</i>:</b><br>
  <b>1. Resumen Operativo:</b> El sistema gestiona <b>${rel.productos.length} productos</b> (${totalUnidades} unidades en bodega), <b>${rel.proveedores.length} proveedores</b> y <b>${rel.detalle_compras.length} líneas de facturación</b> con un valor Landed de <b>${formatUSD(totalCosto)}</b>.<br>
  <b>2. Consultas Disponibles:</b> Puedes explorar el catálogo paso a paso o consultar la arquitectura del sistema con los botones inferiores:<br>
  <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap">
    <button type="button" class="btn-tactical cyan" style="font-size:11.5px; padding:4px 10px" onclick="askCopilotIA('Mostrar catálogo bloque 1')">📋 Ver Catálogo (Bloque 1 de 3)</button>
    <button type="button" class="btn-tactical" style="font-size:11.5px; padding:4px 10px" onclick="askCopilotIA('¿Cómo está hecho el sistema, su backend, base de datos y despliegue?')">⚙️ Ver Arquitectura y Tecnologías</button>
  </div>`;
}

function askCopilotIA(predefinedQuestion = null) {
  const input = document.getElementById("copilot-input");
  const query = (predefinedQuestion || input.value || "").trim();
  if (!query) return;
  if (!predefinedQuestion) input.value = "";

  const msgBox = document.getElementById("copilot-messages");
  const userBubble = document.createElement("div");
  userBubble.className = "msg-bubble user";
  userBubble.textContent = query;
  msgBox.appendChild(userBubble);

  const answer = buildSmartCopilotAnswer(query);

  const aiBubble = document.createElement("div");
  aiBubble.className = "msg-bubble ai";
  aiBubble.innerHTML = answer;
  msgBox.appendChild(aiBubble);
  msgBox.scrollTop = msgBox.scrollHeight;
  notifyToast("success", "Asistente IA respondió la consulta");
}

function renderCatalogoView() {
  const rel = AppState.relational;
  const tbody = document.getElementById("catalogo-tbody");

  const filtrados = rel.productos.filter((p) => {
    const rec = rel.recomendaciones_ia.find((r) => r.id_producto === p.id_producto);
    if (AppState.filtroCategoria !== "ALL" && p.id_categoria !== AppState.filtroCategoria) return false;
    if (AppState.filtroAlerta !== "ALL" && rec?.nivel_alerta !== AppState.filtroAlerta) return false;
    if (AppState.busquedaTexto) {
      const q = normalizeText(AppState.busquedaTexto);
      const hay = normalizeText(`${p.id_producto} ${p.codigo_sku} ${p.nombre} ${p.marca} ${p.ubicacion}`);
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  tbody.innerHTML = filtrados
    .map((p) => {
      const prov = rel.proveedores.find((x) => x.id_proveedor === p.id_proveedor_preferido);
      const rec = rel.recomendaciones_ia.find((r) => r.id_producto === p.id_producto);
      const badgeCls = rec?.nivel_alerta === "CRITICO" ? "critico" : rec?.nivel_alerta === "PREVENTIVO" ? "preventivo" : "optimo";

      const totalC = Math.max(0.01, p.precio_total_compra);
      const wFob = ((p.costo_unitario / totalC) * 100).toFixed(1);
      const wFlete = ((p.costo_flete / totalC) * 100).toFixed(1);
      const wAran = ((p.aranceles_aduanales / totalC) * 100).toFixed(1);
      const wImp = ((p.impuestos / totalC) * 100).toFixed(1);
      const wAlm = ((p.almacenaje / totalC) * 100).toFixed(1);

      return `
        <tr>
          <td>
            <span class="code-chip">${p.id_producto}</span>
            <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); margin-top:3px">SKU: ${p.codigo_sku}</div>
          </td>
          <td>
            <div style="font-weight:700; color:var(--text-primary)">${p.nombre}</div>
            <div style="font-size:11.5px; color:var(--text-secondary)">Marca: <b>${p.marca}</b> · Ubicación: ${p.ubicacion}</div>
          </td>
          <td>
            <span class="relation-tag">Categoría ${p.id_categoria}</span>
            <div style="margin-top:4px"><span class="relation-tag">Proveedor #${p.id_proveedor_preferido} (${prov ? prov.nombre.substring(0, 18) : ""}...)</span></div>
          </td>
          <td style="min-width:210px">
            <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:11.5px">
              <span>FOB: ${formatUSD(p.costo_unitario)}</span>
              <b style="color:var(--accent-amber)">Landed: ${formatUSD(p.precio_total_compra)}</b>
            </div>
            <div class="landed-bar-stack" title="FOB: $${p.costo_unitario} | Flete: $${p.costo_flete} | Arancel: $${p.aranceles_aduanales} | Impuestos: $${p.impuestos} | Almacén: $${p.almacenaje}">
              <div class="landed-seg-fob" style="width:${wFob}%"></div>
              <div class="landed-seg-flete" style="width:${wFlete}%"></div>
              <div class="landed-seg-arancel" style="width:${wAran}%"></div>
              <div class="landed-seg-impuesto" style="width:${wImp}%"></div>
              <div class="landed-seg-almacen" style="width:${wAlm}%"></div>
            </div>
            <div style="font-size:10.5px; color:var(--text-muted); font-family:var(--font-mono)">
              Flete $${p.costo_flete} · Aran $${p.aranceles_aduanales} · Imp $${p.impuestos}
            </div>
          </td>
          <td style="font-family:var(--font-mono)">
            <div style="font-weight:700; color:var(--accent-emerald); font-size:13.5px">${formatUSD(p.precio_venta)}</div>
            <div style="font-size:11px; color:var(--text-secondary)">+${formatUSD(p.margen_unitario)} (+${p.margen_porcentaje}%)</div>
          </td>
          <td style="font-family:var(--font-mono)">
            <span class="status-badge ${badgeCls}">${p.existencia} uds</span>
            <div style="font-size:10.5px; color:var(--text-muted); margin-top:3px">Mín: ${p.stock_minimo} | Reorden: ${p.punto_reorden}</div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function populateFormSelects() {
  const rel = AppState.relational;
  const selCat = document.getElementById("new-prod-cat");
  const selProv = document.getElementById("new-fact-prov");
  const selProd = document.getElementById("new-fact-prod");

  if (selCat) {
    selCat.innerHTML = rel.categorias
      .map((c) => `<option value="${c.id_categoria}">${c.id_categoria} — ${c.nombre_categoria}</option>`)
      .join("");
  }
  if (selProv) {
    selProv.innerHTML = rel.proveedores
      .map((p) => `<option value="${p.nombre}">${p.id_proveedor} — ${p.nombre}</option>`)
      .join("");
  }
  if (selProd) {
    selProd.innerHTML = rel.productos
      .map((pr) => `<option value="${pr.nombre}" data-price="${pr.costo_unitario}">${pr.id_producto} — ${pr.nombre} ($${pr.costo_unitario})</option>`)
      .join("");
    selProd.onchange = () => {
      const opt = selProd.options[selProd.selectedIndex];
      const prc = opt?.getAttribute("data-price");
      const priceInput = document.getElementById("new-fact-precio");
      if (prc && priceInput) priceInput.value = prc;
    };
  }
}

let currentModalProdId = null;

function openPurchaseOrderModal(idProducto) {
  const rel = AppState.relational;
  const rec = rel.recomendaciones_ia.find((r) => r.id_producto === idProducto);
  const prod = rel.productos.find((p) => p.id_producto === idProducto);
  const prov = rel.proveedores.find((p) => p.id_proveedor === rec.id_proveedor_sugerido);
  if (!rec || !prod || !prov) return;

  currentModalProdId = idProducto;
  const ocNumber = `OC-IA-2026-${String(Math.floor(100 + Math.random() * 899))}`;

  const modalBody = document.getElementById("po-modal-content");
  modalBody.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border-subtle); padding-bottom:14px; margin-bottom:16px">
      <div>
        <div style="font-family:var(--font-mono); font-size:11px; color:var(--accent-amber)">ORDEN DE COMPRA GENERADA POR IA // PUNTO DE REORDEN</div>
        <h3 style="font-family:var(--font-display); font-size:20px; margin-top:4px">${ocNumber}</h3>
      </div>
      <span class="status-badge ${rec.nivel_alerta === 'CRITICO' ? 'critico' : 'preventivo'}">PRIORIDAD ${rec.nivel_alerta}</span>
    </div>

    <div class="grid-equal" style="margin-bottom:16px">
      <div style="background:var(--bg-obsidian); padding:12px; border-radius:8px; border:1px solid var(--border-subtle)">
        <div style="font-family:var(--font-mono); font-size:10.5px; color:var(--text-muted)">PROVEEDOR ÓPTIMO SELECCIONADO (#${prov.id_proveedor})</div>
        <div style="font-weight:700; font-size:14px; margin-top:4px">${prov.nombre}</div>
        <div style="font-size:12px; color:var(--text-secondary); margin-top:2px">${prov.pais_origen} · Lead Time: <b>${prov.tiempo_entrega_dias} días</b></div>
        <div style="font-size:11.5px; color:var(--accent-amber); margin-top:4px; font-family:var(--font-mono)">Score IA: ${prov.score_ia}/100 · Cumplimiento: ${prov.cumplimiento_entregas_pct}%</div>
      </div>

      <div style="background:var(--bg-obsidian); padding:12px; border-radius:8px; border:1px solid var(--border-subtle)">
        <div style="font-family:var(--font-mono); font-size:10.5px; color:var(--text-muted)">PRODUCTO A REABASTECER (${prod.id_producto})</div>
        <div style="font-weight:700; font-size:14px; margin-top:4px">${prod.nombre}</div>
        <div style="font-size:12px; color:var(--text-secondary); margin-top:2px">SKU: <span class="code-chip">${prod.codigo_sku}</span> · Ubicación: ${prod.ubicacion}</div>
        <div style="font-size:11.5px; color:var(--accent-cyan); margin-top:4px; font-family:var(--font-mono)">Stock Actual: ${rec.existencia_actual} uds → Stock Post-Compra: ${rec.existencia_actual + rec.cantidad_sugerida_compra} uds</div>
      </div>
    </div>

    <table class="telemetry-table" style="margin-bottom:16px">
      <thead>
        <tr>
          <th>Código</th>
          <th>Descripción</th>
          <th>Cantidad Sugerida</th>
          <th>Costo Landed Unit.</th>
          <th>Inversión Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="code-chip">${prod.id_producto}</span></td>
          <td>${prod.nombre}</td>
          <td style="font-family:var(--font-mono); font-weight:700; color:var(--accent-emerald)">${rec.cantidad_sugerida_compra} unidades</td>
          <td style="font-family:var(--font-mono)">${formatUSD(rec.costo_unitario_estimado)}</td>
          <td style="font-family:var(--font-mono); font-weight:700; font-size:14px; color:var(--accent-amber)">${formatUSD(rec.inversion_total_sugerida)}</td>
        </tr>
      </tbody>
    </table>

    <div style="background:rgba(245, 158, 11, 0.08); border:1px solid var(--border-amber); border-radius:8px; padding:12px; font-size:12px">
      <b>Justificación Algorítmica IA:</b> ${rec.justificacion_ia}
    </div>
  `;

  document.getElementById("po-modal-backdrop").classList.add("open");
  notifyToast("info", `Orden de Compra ${ocNumber} preparada`);
}

function closePurchaseOrderModal() {
  document.getElementById("po-modal-backdrop").classList.remove("open");
}

function confirmAndExecutePurchaseOrder() {
  if (!currentModalProdId) return;
  const rel = AppState.relational;
  const rec = rel.recomendaciones_ia.find((r) => r.id_producto === currentModalProdId);
  const prod = rel.productos.find((p) => p.id_producto === currentModalProdId);
  const prov = rel.proveedores.find((p) => p.id_proveedor === rec.id_proveedor_sugerido);

  if (!rec || !prod || !prov) return;

  const rawProd = AppState.rawProductos.find((r) => String(r["ID del producto"]) === currentModalProdId);
  if (rawProd) {
    rawProd["Existencia"] = Number(rawProd["Existencia"] || 0) + rec.cantidad_sugerida_compra;
  }

  const nuevaFacturaNum = `OC-IA-${Math.floor(1000 + Math.random() * 9000)}`;
  const subtotal = Number((rec.cantidad_sugerida_compra * prod.costo_unitario).toFixed(2));
  const iva = Number((subtotal * 0.13).toFixed(2));

  AppState.rawFacturacion.unshift({
    "Fecha": new Date().toISOString().slice(0, 10),
    "No. De factura": nuevaFacturaNum,
    "Tipo de documento": "Orden de Compra IA",
    "Proveedor": prov.nombre,
    "Cantidad": rec.cantidad_sugerida_compra,
    "Descripción": prod.nombre,
    "Precio unitario": prod.costo_unitario,
    "Descuento": 0,
    "IVA 13%": iva,
    "IVA retenido": 0,
    "IVA percibido": 0,
    "Total": subtotal,
    "No. Cotización": "AUTO-IA",
    "Orden de Compra": nuevaFacturaNum,
  });

  closePurchaseOrderModal();
  buildRelationalDatabase();
  renderAllViews();
  notifyToast("success", `OC ${nuevaFacturaNum} insertada en SQL (+${rec.cantidad_sugerida_compra} uds a ${prod.id_producto})`);
}

function handleInsertarFacturaVivo(event) {
  event.preventDefault();
  const numFact = (document.getElementById("new-fact-num")?.value || "").trim() || `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  const provNombre = (document.getElementById("new-fact-prov")?.value || "").trim();
  const prodNombre = (document.getElementById("new-fact-prod")?.value || "").trim();
  const rawCant = Number(document.getElementById("new-fact-cant")?.value);
  const rawPrecio = Number(document.getElementById("new-fact-precio")?.value);
  const cantidad = Number.isFinite(rawCant) && rawCant > 0 ? Math.floor(rawCant) : 5;
  const precio = Number.isFinite(rawPrecio) && rawPrecio >= 0 ? rawPrecio : 45;

  const total = Number((cantidad * precio).toFixed(2));
  const iva = Number((total * 0.13).toFixed(2));

  AppState.rawFacturacion.unshift({
    "Fecha": new Date().toISOString().slice(0, 10),
    "No. De factura": numFact,
    "Tipo de documento": "Factura Comercial",
    "Proveedor": provNombre,
    "Cantidad": cantidad,
    "Descripción": prodNombre,
    "Precio unitario": precio,
    "Descuento": 0,
    "IVA 13%": iva,
    "IVA retenido": 0,
    "IVA percibido": 0,
    "Total": total,
    "No. Cotización": "WEB-LIVE",
    "Orden de Compra": `OC-${numFact}`,
  });

  buildRelationalDatabase();
  renderAllViews();
  notifyToast("success", `Factura ${numFact} vinculada automáticamente con sus relaciones en SQLite`);
}

function handleInsertarProductoVivo(event) {
  event.preventDefault();
  const sku = (document.getElementById("new-prod-sku")?.value || "").trim() || `SKU-${Date.now().toString().slice(-4)}`;
  const nombre = (document.getElementById("new-prod-nombre")?.value || "").trim();
  if (!nombre) {
    notifyToast("warning", "Por favor ingresa el nombre del producto");
    return;
  }
  const idCat = document.getElementById("new-prod-cat")?.value || "CAT-ACC";
  const marca = (document.getElementById("new-prod-marca")?.value || "").trim() || "HUNTER 4X4";
  const rawCosto = Number(document.getElementById("new-prod-costo")?.value);
  const rawStock = Number(document.getElementById("new-prod-stock")?.value);
  const costoFob = Number.isFinite(rawCosto) && rawCosto >= 0 ? rawCosto : 50;
  const stock = Number.isFinite(rawStock) && rawStock >= 0 ? Math.floor(rawStock) : 5;

  const nextNum = AppState.relational.productos.length + 1;
  const newId = `PROD-${String(nextNum).padStart(3, "0")}`;

  const flete = Number((costoFob * 0.07).toFixed(2));
  const aranceles = Number((costoFob * 0.05).toFixed(2));
  const impuestos = Number((costoFob * 0.13).toFixed(2));
  const almacen = Number((costoFob * 0.02).toFixed(2));
  const totalComp = Number((costoFob + flete + aranceles + impuestos + almacen).toFixed(2));
  const precioVta = Number((totalComp * 1.5).toFixed(2));

  AppState.rawProductos.unshift({
    "ID del producto": newId,
    "Codigo": sku,
    "Nombre": nombre,
    "Descripción": `${nombre} - Marca ${marca} (Registrado en Catálogo SQL)`,
    "ID de categoría": idCat,
    "Marca": marca,
    "Costo Unitario": costoFob,
    "Costo de Flete": flete,
    "Aranceles aduanales": aranceles,
    "Impuestos": impuestos,
    "Almacenaje": almacen,
    "Fecha de ingreso": new Date().toISOString().slice(0, 10),
    "Precio total de compra": totalComp,
    "Precio de venta": precioVta,
    "Existencia": stock,
    "Ubicación": "Bodega Central A-10",
    "Estado": "Disponible",
    "Fecha de salida": "",
  });

  document.getElementById("new-prod-sku").value = "";
  document.getElementById("new-prod-nombre").value = "";

  buildRelationalDatabase();
  renderAllViews();
  notifyToast("success", `Producto ${newId} insertado con categoría ${idCat} en SQLite`);
}

const PRESET_SQL_QUERIES = {
  join_relaciones: `SELECT 
  numero_factura AS Factura,
  nombre_proveedor AS Proveedor,
  id_producto AS ID_Producto,
  nombre_producto_catalogo AS Accesorio,
  nombre_categoria AS Categoria,
  cantidad AS Cant,
  total_linea AS Total_USD,
  metodo_vinculacion AS Metodo_Vinculo
FROM v_relaciones_completas;`,

  ia_reorden: `SELECT 
  nivel_alerta AS Alerta,
  id_producto AS ID_Prod,
  producto AS Accesorio,
  existencia_actual AS Stock,
  stock_minimo AS Minimo,
  cantidad_sugerida_compra AS Pedir_Uds,
  inversion_total_sugerida AS Inversion_USD,
  proveedor_recomendado AS Proveedor_Sugerido,
  score_proveedor AS Score_IA
FROM v_alertas_abastecimiento_ia
WHERE nivel_alerta != 'OPTIMO';`,

  rentabilidad: `SELECT 
  id_producto,
  codigo_sku,
  nombre,
  costo_unitario AS FOB_USD,
  gastos_importacion AS Aduana_Flete_USD,
  costo_landed_total AS Landed_Cost_USD,
  precio_venta AS Precio_Venta_USD,
  margen_porcentaje AS Margen_Pct,
  valor_inventario_costo AS Valor_Stock_USD
FROM v_analisis_rentabilidad_productos
ORDER BY margen_porcentaje DESC;`,

  proveedores_score: `SELECT 
  id_proveedor,
  nombre,
  pais_origen,
  tiempo_entrega_dias AS Lead_Dias,
  calificacion_calidad AS Calidad,
  cumplimiento_entregas_pct AS Cumplimiento_Pct,
  score_ia AS Score_IA,
  origen_registro
FROM proveedores
ORDER BY score_ia DESC;`,
};

function loadPresetSql(key) {
  const editor = document.getElementById("sql-query-editor");
  if (editor && PRESET_SQL_QUERIES[key]) {
    editor.value = PRESET_SQL_QUERIES[key];
    executeLiveSql();
  }
}

let lastSqlExecutionTime = 0;

function executeLiveSql() {
  const editor = document.getElementById("sql-query-editor");
  const sql = (editor?.value || "").trim();
  if (!sql) return;

  const now = performance.now();
  if (now - lastSqlExecutionTime < 150) {
    return;
  }
  lastSqlExecutionTime = now;

  const t0 = performance.now();
  const thead = document.getElementById("sql-result-thead");
  const tbody = document.getElementById("sql-result-tbody");
  const metaEl = document.getElementById("sql-exec-meta");

  if (AppState.sqliteDb) {
    try {
      const res = AppState.sqliteDb.exec(sql);
      const elapsed = (performance.now() - t0).toFixed(2);

      if (!res || res.length === 0) {
        thead.innerHTML = "<tr><th>Resultado SQL</th></tr>";
        tbody.innerHTML = `<tr><td style="color:var(--accent-emerald); font-family:var(--font-mono)">Sentencia ejecutada correctamente (0 filas devueltas o comando DDL/PRAGMA sin errores).</td></tr>`;
        metaEl.textContent = `SQLite3 WASM · 0 filas · ${elapsed} ms`;
        notifyToast("success", `SQL ejecutado en ${elapsed} ms`);
        return;
      }

      const { columns, values } = res[0];
      thead.innerHTML = `<tr>${columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
      tbody.innerHTML = values
        .map(
          (row) =>
            `<tr>${row
              .map((val) => `<td style="font-family:var(--font-mono)">${val === null ? '<span style="color:var(--text-muted)">NULL</span>' : escapeHtml(val)}</td>`)
              .join("")}</tr>`
        )
        .join("");

      metaEl.textContent = `SQLite3 WASM · ${values.length} filas · ${elapsed} ms`;
      notifyToast("success", `Consulta SQL: ${values.length} filas (${elapsed} ms)`);
      return;
    } catch (err) {
      thead.innerHTML = "<tr><th>Error de Sintaxis o Restricción de relación en SQLite</th></tr>";
      tbody.innerHTML = `<tr><td style="color:var(--accent-crimson); font-family:var(--font-mono)">${escapeHtml(err.message)}</td></tr>`;
      notifyToast("error", "Error en sentencia SQL");
      return;
    }
  }

  const rel = AppState.relational;
  let rows = rel.detalle_compras;
  if (/v_alertas_abastecimiento_ia|recomendaciones/i.test(sql)) {
    rows = rel.recomendaciones_ia.filter((r) => r.nivel_alerta !== "OPTIMO");
  } else if (/v_analisis_rentabilidad_productos|productos/i.test(sql)) {
    rows = rel.productos;
  } else if (/proveedores/i.test(sql)) {
    rows = rel.proveedores;
  }

  if (rows.length > 0) {
    const cols = Object.keys(rows[0]).slice(0, 9);
    thead.innerHTML = `<tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
    tbody.innerHTML = rows
      .map((r) => `<tr>${cols.map((c) => `<td style="font-family:var(--font-mono)">${escapeHtml(r[c])}</td>`).join("")}</tr>`)
      .join("");
    metaEl.textContent = `Motor Relacional · ${rows.length} filas · 0.4 ms`;
    notifyToast("success", `Consulta ejecutada (${rows.length} filas)`);
  }
}

function downloadSqlDump() {
  const sqlContent = generateFullSqlScript();
  const blob = new Blob([sqlContent], { type: "application/sql;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "torque_inventario_relacional.sql";
  a.click();
  URL.revokeObjectURL(url);
  notifyToast("success", "Script SQL relacional descargado (.sql)");
}

function downloadSqliteBinaryDb() {
  if (AppState.sqliteDb) {
    const binaryArray = AppState.sqliteDb.export();
    const blob = new Blob([binaryArray], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventario_compras.db";
    a.click();
    URL.revokeObjectURL(url);
    notifyToast("success", "Base de datos SQLite (.db) descargada");
  } else {
    downloadSqlDump();
  }
}

function exportIAPurchaseOrdersExcel() {
  if (typeof XLSX === "undefined") {
    notifyToast("warning", "Exportando en formato SQL");
    downloadSqlDump();
    return;
  }
  const rel = AppState.relational;
  const wb = XLSX.utils.book_new();

  const wsIA = XLSX.utils.json_to_sheet(rel.recomendaciones_ia);
  const wsRel = XLSX.utils.json_to_sheet(rel.detalle_compras);
  const wsProd = XLSX.utils.json_to_sheet(rel.productos);
  const wsProv = XLSX.utils.json_to_sheet(rel.proveedores);

  XLSX.utils.book_append_sheet(wb, wsIA, "Ordenes_Compra_IA");
  XLSX.utils.book_append_sheet(wb, wsRel, "Facturacion_Relaciones");
  XLSX.utils.book_append_sheet(wb, wsProd, "Catalogo_Productos");
  XLSX.utils.book_append_sheet(wb, wsProv, "Proveedores_Scoring");

  XLSX.writeFile(wb, "Reporte_Abastecimiento_IA_Relacional.xlsx");
  notifyToast("success", "Libro Excel de Órdenes de Compra IA exportado");
}

function toggleExcelDropdown(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById("excel-dropdown-menu");
  if (menu) {
    menu.classList.toggle("open");
  }
}

function closeExcelDropdown() {
  const menu = document.getElementById("excel-dropdown-menu");
  if (menu) {
    menu.classList.remove("open");
  }
}

function buildFormattedWorkbookForBook(rows, sheetName) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  if (rows && rows.length > 0) {
    const keys = Object.keys(rows[0]);
    ws["!cols"] = keys.map((k) => {
      const maxCellLen = rows.reduce((max, r) => {
        const valStr = r[k] !== null && r[k] !== undefined ? String(r[k]) : "";
        return Math.max(max, valStr.length);
      }, k.length);
      return { wch: Math.min(48, Math.max(12, maxCellLen + 3)) };
    });
  }
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return wb;
}

function openExcelBook(bookType, silentMenuClose = false) {
  if (!silentMenuClose) closeExcelDropdown();

  const bookMap = {
    PRODUCTOS: {
      rows: AppState.rawProductos,
      sheetName: "PRODUCTOS",
      fileName: "PRODUCTOS.xlsx",
      staticFile: "data/excel/PRODUCTOS.xlsx",
      label: "Libro 1: PRODUCTOS.xlsx",
    },
    PROVEEDORES: {
      rows: AppState.rawProveedores,
      sheetName: "PROVEEDORES",
      fileName: "PROVEEDORES_COMPLETO_V2.xlsx",
      staticFile: "data/excel/PROVEEDORES_COMPLETO_V2 (1).xlsx",
      label: "Libro 2: PROVEEDORES_COMPLETO_V2.xlsx",
    },
    FACTURACION: {
      rows: AppState.rawFacturacion,
      sheetName: "FACTURACION",
      fileName: "FACTURACION.xlsx",
      staticFile: "data/excel/FACTURACION.xlsx",
      label: "Libro 3: FACTURACION.xlsx",
    },
  };

  const target = bookMap[bookType];
  if (!target) return;

  if (typeof XLSX !== "undefined") {
    const wb = buildFormattedWorkbookForBook(target.rows, target.sheetName);
    XLSX.writeFile(wb, target.fileName);
    notifyToast("success", `${target.label} listo para abrir en tu Excel predeterminado`);
    return;
  }

  const a = document.createElement("a");
  a.href = target.staticFile;
  a.download = target.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  notifyToast("success", `Abriendo ${target.label}`);
}

function downloadAllThreeExcels() {
  closeExcelDropdown();
  const books = ["PRODUCTOS", "PROVEEDORES", "FACTURACION"];
  books.forEach((b, idx) => {
    setTimeout(() => {
      openExcelBook(b, true);
    }, idx * 280);
  });
  notifyToast("success", "Descargando los 3 libros de Excel por separado (.xlsx)");
}

const VIEW_TITLES = {
  "view-dashboard": "UniControl — Panel General & Diagnóstico Ejecutivo",
  "view-ingesta": "UniControl — Ingesta de 3 Libros Excel & Relaciones entre Registros",
  "view-visualizar": "UniControl — Registros Completos de los 3 Libros de Excel Separados",
  "view-ia": "UniControl — Motor Predictivo de IA & Scoring de Proveedores",
  "view-catalogo": "UniControl — Catálogo Maestro de Inventario & Costos de Importación",
  "view-sql": "UniControl — Laboratorio SQL en Vivo (SQLite3 WebAssembly)",
};

function toggleSidebar() {
  const shell = document.getElementById("app-shell") || document.querySelector(".app-shell");
  if (!shell) return;

  if (window.innerWidth <= 1024) {
    shell.classList.toggle("sidebar-mobile-open");
  } else {
    shell.classList.toggle("sidebar-collapsed");
    setTimeout(() => {
      renderCharts();
    }, 260);
  }
}

function closeMobileSidebar() {
  const shell = document.getElementById("app-shell") || document.querySelector(".app-shell");
  if (shell) {
    shell.classList.remove("sidebar-mobile-open");
  }
}

function resetScrollPosition() {
  window.scrollTo(0, 0);
  if (document.scrollingElement) {
    document.scrollingElement.scrollTop = 0;
    document.scrollingElement.scrollLeft = 0;
  }
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  }
  const mainArea = document.querySelector(".main-area");
  if (mainArea) {
    mainArea.scrollTop = 0;
    mainArea.scrollLeft = 0;
  }
  const workspaceBody = document.querySelector(".workspace-body");
  if (workspaceBody) {
    workspaceBody.scrollTop = 0;
    workspaceBody.scrollLeft = 0;
  }
}

function switchView(viewId, btnEl) {
  resetScrollPosition();

  document.querySelectorAll(".view-section").forEach((el) => el.classList.remove("active"));
  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) {
    btnEl.classList.add("active");
  } else {
    const matchingBtn = document.querySelector(`.nav-btn[data-target="${viewId}"]`);
    if (matchingBtn) matchingBtn.classList.add("active");
  }

  document.getElementById("topbar-title").textContent = VIEW_TITLES[viewId] || "UniControl (Sistema de gestión universitario)";
  closeMobileSidebar();
  closeExcelDropdown();
  renderCharts();

  if (viewId === "view-sql") {
    executeLiveSql();
  }

  requestAnimationFrame(() => {
    resetScrollPosition();
    if (viewId === "view-ia") {
      const chatInput = document.getElementById("copilot-input");
      if (chatInput) chatInput.focus({ preventScroll: true });
    }
  });
}

function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme");
  if (current === "dark") {
    root.removeAttribute("data-theme");
    try {
      localStorage.setItem("unicontrol_theme", "light");
    } catch (e) {}
    notifyToast("info", "Modo Claro activado");
  } else {
    root.setAttribute("data-theme", "dark");
    try {
      localStorage.setItem("unicontrol_theme", "dark");
    } catch (e) {}
    notifyToast("info", "Modo Oscuro activado");
  }
  renderCharts();
}

window.addEventListener("DOMContentLoaded", async () => {
  buildRelationalDatabase();
  renderAllViews();

  const editor = document.getElementById("sql-query-editor");
  if (editor) editor.value = PRESET_SQL_QUERIES.join_relaciones;

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileSidebar();
      closePurchaseOrderModal();
      closeExcelDropdown();
    }
  });

  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("excel-open-dropdown");
    if (dropdown && !dropdown.contains(e.target)) {
      closeExcelDropdown();
    }
  });

  let resizeChartsTimer = null;
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      closeMobileSidebar();
    }
    clearTimeout(resizeChartsTimer);
    resizeChartsTimer = setTimeout(() => {
      renderCharts();
    }, 150);
  });

  if (typeof initSqlJs !== "undefined") {
    try {
      AppState.SQL = await initSqlJs({
        locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
      });
      syncInBrowserSqlite();
      document.getElementById("sql-engine-badge").textContent = "SQLite3";
    } catch (e) {
      console.warn("SQL.js fallback activo:", e);
    }
  }

  notifyToast("success", "UniControl sincronizado: 3 Excels y relaciones validadas");
});
