PRAGMA foreign_keys = ON;

DROP VIEW IF EXISTS v_alertas_abastecimiento_ia;
DROP VIEW IF EXISTS v_analisis_rentabilidad_productos;
DROP VIEW IF EXISTS v_relaciones_completas;

DROP TABLE IF EXISTS recomendaciones_ia;
DROP TABLE IF EXISTS detalle_compras;
DROP TABLE IF EXISTS documentos_compra;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS categorias;

CREATE TABLE categorias (
    id_categoria TEXT PRIMARY KEY,
    nombre_categoria TEXT NOT NULL,
    descripcion TEXT,
    stock_minimo_default INTEGER NOT NULL DEFAULT 8,
    factor_seguridad REAL NOT NULL DEFAULT 1.5
);

CREATE TABLE proveedores (
    id_proveedor INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    contacto TEXT,
    nit TEXT,
    nrc TEXT,
    correo TEXT,
    direccion TEXT,
    pais_origen TEXT DEFAULT 'Internacional',
    tipo_contribuyente TEXT,
    condiciones_pago TEXT DEFAULT 'CONTADO',
    fecha_registro TEXT,
    tiempo_entrega_dias INTEGER NOT NULL DEFAULT 15,
    calificacion_calidad REAL NOT NULL DEFAULT 4.5 CHECK (calificacion_calidad BETWEEN 1.0 AND 5.0),
    cumplimiento_entregas_pct REAL NOT NULL DEFAULT 95.0 CHECK (cumplimiento_entregas_pct BETWEEN 0.0 AND 100.0),
    score_ia REAL DEFAULT 0.0,
    origen_registro TEXT NOT NULL DEFAULT 'EXCEL_PROVEEDORES'
);

CREATE TABLE productos (
    id_producto TEXT PRIMARY KEY,
    codigo_sku TEXT NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    id_categoria TEXT NOT NULL,
    id_proveedor_preferido INTEGER,
    marca TEXT,
    costo_unitario REAL NOT NULL DEFAULT 0.0,
    costo_flete REAL NOT NULL DEFAULT 0.0,
    aranceles_aduanales REAL NOT NULL DEFAULT 0.0,
    impuestos REAL NOT NULL DEFAULT 0.0,
    almacenaje REAL NOT NULL DEFAULT 0.0,
    precio_total_compra REAL NOT NULL DEFAULT 0.0,
    precio_venta REAL NOT NULL DEFAULT 0.0,
    margen_unitario REAL NOT NULL DEFAULT 0.0,
    margen_porcentaje REAL NOT NULL DEFAULT 0.0,
    existencia INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 8,
    punto_reorden INTEGER NOT NULL DEFAULT 12,
    ubicacion TEXT DEFAULT 'Bodega Central',
    estado TEXT DEFAULT 'Disponible',
    fecha_ingreso TEXT,
    fecha_salida TEXT,
    origen_registro TEXT NOT NULL DEFAULT 'EXCEL_PRODUCTOS',
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_proveedor_preferido) REFERENCES proveedores(id_proveedor)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE documentos_compra (
    id_documento INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_factura TEXT NOT NULL UNIQUE,
    fecha TEXT NOT NULL,
    tipo_documento TEXT NOT NULL,
    id_proveedor INTEGER NOT NULL,
    numero_cotizacion TEXT,
    orden_compra TEXT,
    subtotal_documento REAL NOT NULL DEFAULT 0.0,
    iva_documento REAL NOT NULL DEFAULT 0.0,
    total_documento REAL NOT NULL DEFAULT 0.0,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE detalle_compras (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_documento INTEGER NOT NULL,
    id_producto TEXT NOT NULL,
    descripcion_factura TEXT NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario REAL NOT NULL DEFAULT 0.0,
    descuento REAL NOT NULL DEFAULT 0.0,
    iva_13 REAL NOT NULL DEFAULT 0.0,
    iva_retenido REAL NOT NULL DEFAULT 0.0,
    iva_percibido REAL NOT NULL DEFAULT 0.0,
    total_linea REAL NOT NULL DEFAULT 0.0,
    metodo_vinculacion TEXT NOT NULL DEFAULT 'MATCH_EXACTO',
    FOREIGN KEY (id_documento) REFERENCES documentos_compra(id_documento)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE recomendaciones_ia (
    id_recomendacion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto TEXT NOT NULL,
    id_proveedor_sugerido INTEGER NOT NULL,
    nivel_alerta TEXT NOT NULL,
    prioridad INTEGER NOT NULL,
    existencia_actual INTEGER NOT NULL,
    stock_minimo INTEGER NOT NULL,
    punto_reorden INTEGER NOT NULL,
    demanda_mensual_estimada REAL NOT NULL,
    dias_cobertura_estimados INTEGER NOT NULL,
    cantidad_sugerida_compra INTEGER NOT NULL,
    costo_unitario_estimado REAL NOT NULL,
    inversion_total_sugerida REAL NOT NULL,
    score_proveedor REAL NOT NULL,
    justificacion_ia TEXT NOT NULL,
    fecha_calculo TEXT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_proveedor_sugerido) REFERENCES proveedores(id_proveedor)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_productos_proveedor ON productos(id_proveedor_preferido);
CREATE INDEX idx_documentos_proveedor ON documentos_compra(id_proveedor);
CREATE INDEX idx_detalle_documento ON detalle_compras(id_documento);
CREATE INDEX idx_detalle_producto ON detalle_compras(id_producto);
CREATE INDEX idx_recomendaciones_alerta ON recomendaciones_ia(nivel_alerta, prioridad);

CREATE VIEW v_relaciones_completas AS
SELECT 
    dc.id_detalle,
    doc.numero_factura,
    doc.tipo_documento,
    doc.fecha AS fecha_documento,
    doc.orden_compra,
    doc.numero_cotizacion,
    prov.id_proveedor,
    prov.nombre AS nombre_proveedor,
    prov.pais_origen AS pais_proveedor,
    prod.id_producto,
    prod.codigo_sku,
    prod.nombre AS nombre_producto_catalogo,
    dc.descripcion_factura AS descripcion_en_excel_factura,
    cat.id_categoria,
    cat.nombre_categoria,
    dc.cantidad,
    dc.precio_unitario,
    dc.iva_13,
    dc.total_linea,
    dc.metodo_vinculacion
FROM detalle_compras dc
INNER JOIN documentos_compra doc ON dc.id_documento = doc.id_documento
INNER JOIN proveedores prov ON doc.id_proveedor = prov.id_proveedor
INNER JOIN productos prod ON dc.id_producto = prod.id_producto
INNER JOIN categorias cat ON prod.id_categoria = cat.id_categoria;

CREATE VIEW v_analisis_rentabilidad_productos AS
SELECT 
    p.id_producto,
    p.codigo_sku,
    p.nombre,
    c.nombre_categoria,
    p.marca,
    pr.nombre AS proveedor_preferido,
    p.costo_unitario,
    (p.costo_flete + p.aranceles_aduanales + p.impuestos + p.almacenaje) AS gastos_importacion,
    p.precio_total_compra AS costo_landed_total,
    p.precio_venta,
    p.margen_unitario,
    p.margen_porcentaje,
    p.existencia,
    p.stock_minimo,
    p.punto_reorden,
    ROUND(p.existencia * p.precio_total_compra, 2) AS valor_inventario_costo,
    ROUND(p.existencia * p.precio_venta, 2) AS valor_inventario_venta,
    p.ubicacion
FROM productos p
INNER JOIN categorias c ON p.id_categoria = c.id_categoria
LEFT JOIN proveedores pr ON p.id_proveedor_preferido = pr.id_proveedor;

CREATE VIEW v_alertas_abastecimiento_ia AS
SELECT 
    r.id_recomendacion,
    r.nivel_alerta,
    r.prioridad,
    p.id_producto,
    p.codigo_sku,
    p.nombre AS producto,
    c.nombre_categoria AS categoria,
    r.existencia_actual,
    r.stock_minimo,
    r.punto_reorden,
    r.dias_cobertura_estimados,
    r.cantidad_sugerida_compra,
    r.costo_unitario_estimado,
    r.inversion_total_sugerida,
    pr.id_proveedor,
    pr.nombre AS proveedor_recomendado,
    pr.tiempo_entrega_dias,
    pr.calificacion_calidad,
    pr.cumplimiento_entregas_pct,
    r.score_proveedor,
    r.justificacion_ia
FROM recomendaciones_ia r
INNER JOIN productos p ON r.id_producto = p.id_producto
INNER JOIN categorias c ON p.id_categoria = c.id_categoria
INNER JOIN proveedores pr ON r.id_proveedor_sugerido = pr.id_proveedor
ORDER BY r.prioridad ASC, r.inversion_total_sugerida DESC;
