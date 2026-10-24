# TORQUE-SQL // Sistema Inteligente de Abastecimiento Automotriz & Motor Relacional FK

Plataforma de ingeniería de compras, inventario valorizado (*Landed Cost*) e inteligencia artificial predictiva diseñada para optimizar el proceso de abastecimiento de accesorios automotrices a partir de **3 libros de Excel independientes**.

---

## Arquitectura del Proyecto

```text
idea_Proyecto/
├── index.html                        # Interfaz principal (en raíz para despliegue directo en GitHub / Vercel)
├── vercel.json                       # Configuración de despliegue instantáneo en Vercel
├── assets/
│   ├── css/styles.css                # Sistema de diseño táctico Carbon & Amber Telemetry
│   └── js/app.js                     # Motor relacional SQLite WASM + SheetJS + Simulador IA + SweetAlert2
├── backend/
│   └── motor_relacional_web.js       # Módulo portátil de resolución automática de Foreign Keys e IA
├── database/
│   ├── schema.sql                    # Esquema relacional DDL (6 tablas + 3 vistas analíticas + FKs estrictas)
│   ├── seed_data.sql                 # Datos relacionales generados automáticamente desde los 3 libros Excel
│   ├── inventario_compras.db         # Base de datos binaria SQLite3 verificada (0 violaciones de FK)
│   └── dataset_relacional.json       # Estado sincronizado de las tablas y relaciones
├── scripts/
│   ├── motor_ingesta_y_ia.ps1        # Pipeline local de lectura Excel -> SQL + Auto-Curación de FKs
│   └── verificar_bd_sql.ps1          # Auditoría SQLite (PRAGMA foreign_key_check)
├── PRODUCTOS.xlsx                    # Libro 1: Catálogo e inventario con costos de importación
├── PROVEEDORES_COMPLETO_V2 (1).xlsx  # Libro 2: Directorio de proveedores internacionales
└── FACTURACION.xlsx                  # Libro 3: Facturas comerciales, cotizaciones y órdenes de pedido
```

---

## Características Principales

1. **Resolución Automática y Auto-Curación de Llaves Foráneas (`FK Auto-Heal`):**
   - Vincula automáticamente los nombres y descripciones de `FACTURACION.xlsx` con las llaves primarias de `proveedores` (`id_proveedor`) y `productos` (`id_producto`).
   - Detecta registros presentes en facturación pero ausentes en las tablas maestras (ej. proveedor `IAM IMPORT & EXPORT TRADING S.A.` e ítems `PROD-013` y `PROD-014`) y los da de alta automáticamente antes de insertar las líneas hijas, garantizando `PRAGMA foreign_key_check = 0 errores`.
2. **Motor de Inteligencia Artificial para Compras:**
   - **¿Qué comprar?** Detección automática de stock crítico y preventivo según velocidad de rotación.
   - **¿Cuándo y cuánto comprar?** Cálculo dinámico del Punto de Reorden (*Reorder Point*) y cantidad sugerida de pedido.
   - **¿A quién comprar?** Algoritmo de Scoring Multicriterio ajustable en vivo (Calidad, Cumplimiento de Entregas y Tiempo de Tránsito).
   - **Copiloto IA integrado:** Responde consultas operativas en lenguaje natural sobre inventario, márgenes y proveedores.
3. **Laboratorio SQL en Vivo (`SQLite3 WebAssembly`):**
   - Permite ejecutar consultas SQL reales (`SELECT`, `INNER JOIN`, `GROUP BY`, `PRAGMA`) directamente desde el navegador en cualquier PC o desde Vercel, además de exportar la base binaria `.db`, el script `.sql` o el reporte `.xlsx`.
