export function normalizeText(str) {
  if (!str) return "";
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s/.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const CATEGORIAS_BASE = {
  "CAT-ACC": { id_categoria: "CAT-ACC", nombre_categoria: "Accesorios Generales y Remolque", stock_minimo_default: 8, factor_seguridad: 1.5 },
  "CAT-ILU": { id_categoria: "CAT-ILU", nombre_categoria: "Iluminación Automotriz", stock_minimo_default: 8, factor_seguridad: 1.6 },
  "CAT-EXT": { id_categoria: "CAT-EXT", nombre_categoria: "Exterior y Carrocería 4x4", stock_minimo_default: 8, factor_seguridad: 1.5 },
  "CAT-IND": { id_categoria: "CAT-IND", nombre_categoria: "Indicadores y Medidores Digitales", stock_minimo_default: 10, factor_seguridad: 1.4 },
  "CAT-DEF": { id_categoria: "CAT-DEF", nombre_categoria: "Defensas y Roll Bars", stock_minimo_default: 8, factor_seguridad: 1.5 },
  "CAT-RIN": { id_categoria: "CAT-RIN", nombre_categoria: "Rines y Llantas", stock_minimo_default: 8, factor_seguridad: 1.5 },
};

export function calcularScoreProveedorIA(calidad, cumplimientoPct, diasEntrega) {
  const scoreCalidad = (calidad / 5.0) * 40.0;
  const scoreCumplimiento = (cumplimientoPct / 100.0) * 35.0;
  const scoreTiempo = (Math.max(1, 35 - diasEntrega) / 35.0) * 25.0;
  return Number((scoreCalidad + scoreCumplimiento + scoreTiempo).toFixed(2));
}

export function procesarTresExcelsRelacional(filasProductos, filasProveedores, filasFacturacion) {
  const categorias = { ...CATEGORIAS_BASE };
  const proveedoresMap = new Map();
  let maxProvId = 0;
  const logsVinculacion = [];

  for (const row of filasProveedores) {
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
      contacto: String(row["Contacto"] || ""),
      nit: String(row["NIT"] || ""),
      nrc: String(row["NRC"] || ""),
      correo: String(row["Correo"] || ""),
      direccion,
      pais_origen: pais,
      tipo_contribuyente: String(row["Tipo de contribuyente"] || "Importador Internacional"),
      condiciones_pago: String(row["Condiciones de pago"] || "CONTADO"),
      fecha_registro: String(row["Fecha de registro"] || "2026-02-03"),
      tiempo_entrega_dias: diasEntrega,
      calificacion_calidad: calidad,
      cumplimiento_entregas_pct: cumplimiento,
      score_ia: calcularScoreProveedorIA(calidad, cumplimiento, diasEntrega),
      origen_registro: "EXCEL_PROVEEDORES",
    });
  }

  const resolverProveedorId = (nombreOMarca, fechaRef = "2026-01-27") => {
    const norm = normalizeText(nombreOMarca);
    for (const [id, prov] of proveedoresMap.entries()) {
      const pNorm = normalizeText(prov.nombre);
      if (pNorm === norm || pNorm.includes(norm) || norm.includes(pNorm)) {
        return id;
      }
    }
    if (/LAFA|DLAA|HUNTER/.test(norm)) return 1;
    if (/WHEEL/.test(norm)) return 3;
    if (/FORTUNE|FPI/.test(norm)) return 2;

    maxProvId++;
    const dias = 14;
    const cal = 4.5;
    const cump = 93.0;
    proveedoresMap.set(maxProvId, {
      id_proveedor: maxProvId,
      nombre: nombreOMarca.trim(),
      contacto: "Departamento de Exportaciones",
      nit: `EXT-000${maxProvId}`,
      nrc: "",
      correo: "export@supplier-auto.com",
      direccion: "Zona Franca Internacional",
      pais_origen: "Asia / Internacional",
      tipo_contribuyente: "Proveedor Internacional",
      condiciones_pago: "CONTADO",
      fecha_registro: fechaRef,
      tiempo_entrega_dias: dias,
      calificacion_calidad: cal,
      cumplimiento_entregas_pct: cump,
      score_ia: calcularScoreProveedorIA(cal, cump, dias),
      origen_registro: "AUTO_DETECTADO_FACTURACION",
    });
    logsVinculacion.push({
      tipo: "AUTO_HEAL_PROVEEDOR",
      mensaje: `Proveedor '${nombreOMarca}' detectado en Facturación -> Creado automáticamente con PK id_proveedor=${maxProvId}`,
    });
    return maxProvId;
  };

  const productosMap = new Map();
  let maxProdNum = 0;

  for (const row of filasProductos) {
    const idProd = String(row["ID del producto"] || row["id_producto"] || "").trim();
    if (!idProd) continue;
    const matchNum = idProd.match(/PROD-(\d+)/i);
    if (matchNum) maxProdNum = Math.max(maxProdNum, Number(matchNum[1]));

    const idCatRaw = String(row["ID de categoría"] || row["id_categoria"] || "CAT-ACC").trim();
    if (!categorias[idCatRaw]) {
      categorias[idCatRaw] = {
        id_categoria: idCatRaw,
        nombre_categoria: `Categoría ${idCatRaw}`,
        stock_minimo_default: 8,
        factor_seguridad: 1.5,
      };
    }

    const marca = String(row["Marca"] || row["marca"] || "GENERICO").trim();
    const idProvPref = resolverProveedorId(marca);

    const costoUnit = Number(row["Costo Unitario"] || 0);
    const flete = Number(row["Costo de Flete"] || 0);
    const aranceles = Number(row["Aranceles aduanales"] || 0);
    const impuestos = Number(row["Impuestos"] || 0);
    const almacen = Number(row["Almacenaje"] || 0);
    const totalComp = Number(row["Precio total de compra"] || (costoUnit + flete + aranceles + impuestos + almacen).toFixed(2));
    const precioVta = Number(row["Precio de venta"] || (totalComp * 1.45).toFixed(2));
    const existencia = Number(row["Existencia"] || 0);

    const margenUnit = Number((precioVta - totalComp).toFixed(2));
    const margenPct = totalComp > 0 ? Number(((margenUnit / totalComp) * 100).toFixed(2)) : 0;

    const stockMin = categorias[idCatRaw].stock_minimo_default;
    const puntoReorden = Math.ceil(stockMin * categorias[idCatRaw].factor_seguridad);

    productosMap.set(idProd, {
      id_producto: idProd,
      codigo_sku: String(row["Codigo"] || row["codigo_sku"] || ""),
      nombre: String(row["Nombre"] || row["nombre"] || ""),
      descripcion: String(row["Descripción"] || row["Descripcion"] || ""),
      id_categoria: idCatRaw,
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
      fecha_ingreso: String(row["Fecha de ingreso"] || ""),
      fecha_salida: String(row["Fecha de salida"] || ""),
      origen_registro: "EXCEL_PRODUCTOS",
    });
  }

  const documentosMap = new Map();
  const detalleCompras = [];
  let docCounter = 0;
  let detCounter = 0;

  for (const row of filasFacturacion) {
    const numFact = String(row["No. De factura"] || row["numero_factura"] || "").trim();
    if (!numFact) continue;

    const fecha = String(row["Fecha"] || "");
    const tipoDoc = String(row["Tipo de documento"] || "Factura Comercial");
    const nomProv = String(row["Proveedor"] || "");
    const cantidad = Number(row["Cantidad"] || 1);
    const descFactura = String(row["Descripción"] || row["Descripcion"] || "");
    const precioUnit = Number(row["Precio unitario"] || 0);
    const descuento = Number(row["Descuento"] || 0);
    const iva13 = Number(Number(row["IVA 13%"] || 0).toFixed(2));
    const totalLinea = Number(Number(row["Total"] || cantidad * precioUnit).toFixed(2));

    const idProvRef = resolverProveedorId(nomProv, fecha);

    if (!documentosMap.has(numFact)) {
      docCounter++;
      documentosMap.set(numFact, {
        id_documento: docCounter,
        numero_factura: numFact,
        fecha,
        tipo_documento: tipoDoc,
        id_proveedor: idProvRef,
        numero_cotizacion: String(row["No. Cotización"] || row["No. Cotizacion"] || ""),
        orden_compra: String(row["Orden de Compra"] || ""),
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
        codigo_sku: `IMP-${maxProdNum}`,
        nombre: descFactura,
        descripcion: `${descFactura} (Incorporado automáticamente desde Facturación)`,
        id_categoria: idCat,
        id_proveedor_preferido: idProvRef,
        marca: /ROLL BAR/i.test(normDesc) ? "IAM TRADING" : "IMPORT",
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

  for (const [idP, prod] of productosMap.entries()) {
    const prov = proveedoresMap.get(prod.id_proveedor_preferido) || Array.from(proveedoresMap.values())[0];
    const demandaMensual = prod.precio_venta < 30 ? 18 : prod.precio_venta < 120 ? 12 : 8;
    const diasCobertura = Math.floor(prod.existencia / (demandaMensual / 30));

    let nivelAlerta = "OPTIMO";
    let prioridad = 3;
    let cantSugerida = 0;

    if (prod.existencia <= prod.stock_minimo) {
      nivelAlerta = "CRITICO";
      prioridad = 1;
      cantSugerida = Math.max(prod.punto_reorden * 2 - prod.existencia, prod.stock_minimo);
    } else if (prod.existencia <= prod.punto_reorden) {
      nivelAlerta = "PREVENTIVO";
      prioridad = 2;
      cantSugerida = Math.max(Math.ceil(prod.punto_reorden * 1.5) - prod.existencia, 6);
    }

    const inversion = Number((cantSugerida * prod.precio_total_compra).toFixed(2));
    recCounter++;
    recomendacionesIA.push({
      id_recomendacion: recCounter,
      id_producto: idP,
      id_proveedor_sugerido: prov.id_proveedor,
      nivel_alerta: nivelAlerta,
      prioridad,
      existencia_actual: prod.existencia,
      stock_minimo: prod.stock_minimo,
      punto_reorden: prod.punto_reorden,
      demanda_mensual_estimada: demandaMensual,
      dias_cobertura_estimados: diasCobertura,
      cantidad_sugerida_compra: cantSugerida,
      costo_unitario_estimado: prod.precio_total_compra,
      inversion_total_sugerida: inversion,
      score_proveedor: prov.score_ia,
      justificacion_ia:
        nivelAlerta === "CRITICO"
          ? `Stock crítico (${prod.existencia} uds <= mínimo de ${prod.stock_minimo}). Lead time de ${prov.nombre}: ${prov.tiempo_entrega_dias} días (Score IA: ${prov.score_ia}). Emitir OC urgente.`
          : nivelAlerta === "PREVENTIVO"
          ? `En punto de reorden (${prod.existencia} uds <= ${prod.punto_reorden}). Programar reabastecimiento preventivo con ${prov.nombre}.`
          : `Inventario óptimo (${prod.existencia} uds). Cobertura estimada para ${diasCobertura} días.`,
    });
  }

  return {
    categorias: Object.values(categorias),
    proveedores: Array.from(proveedoresMap.values()),
    productos: Array.from(productosMap.values()),
    documentos_compra: Array.from(documentosMap.values()),
    detalle_compras: detalleCompras,
    recomendaciones_ia: recomendacionesIA,
    logs_vinculacion: logsVinculacion,
  };
}
