$ErrorActionPreference = "Stop"

$csharpQuery = @"
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

public class SqliteVerifier {
    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.StdCall)]
    public static extern int sqlite3_open(byte[] filename, out IntPtr db);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.StdCall)]
    public static extern int sqlite3_close(IntPtr db);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.StdCall)]
    public static extern int sqlite3_prepare_v2(IntPtr db, byte[] sql, int nByte, out IntPtr stmt, IntPtr pzTail);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.StdCall)]
    public static extern int sqlite3_step(IntPtr stmt);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.StdCall)]
    public static extern int sqlite3_column_count(IntPtr stmt);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.StdCall)]
    public static extern IntPtr sqlite3_column_name(IntPtr stmt, int iCol);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.StdCall)]
    public static extern IntPtr sqlite3_column_text(IntPtr stmt, int iCol);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.StdCall)]
    public static extern int sqlite3_finalize(IntPtr stmt);

    public static List<string> Query(string dbPath, string sql) {
        var results = new List<string>();
        IntPtr db;
        byte[] pathBytes = Encoding.UTF8.GetBytes(dbPath + "\0");
        if (sqlite3_open(pathBytes, out db) != 0) throw new Exception("No se pudo abrir DB");
        try {
            IntPtr stmt;
            byte[] sqlBytes = Encoding.UTF8.GetBytes(sql + "\0");
            if (sqlite3_prepare_v2(db, sqlBytes, sqlBytes.Length, out stmt, IntPtr.Zero) != 0)
                throw new Exception("Error preparando consulta: " + sql);
            try {
                int cols = sqlite3_column_count(stmt);
                var headers = new List<string>();
                for (int i = 0; i < cols; i++) {
                    headers.Add(Marshal.PtrToStringAnsi(sqlite3_column_name(stmt, i)));
                }
                results.Add(string.Join(" | ", headers));

                while (sqlite3_step(stmt) == 100) { // SQLITE_ROW = 100
                    var row = new List<string>();
                    for (int i = 0; i < cols; i++) {
                        IntPtr ptr = sqlite3_column_text(stmt, i);
                        row.Add(ptr == IntPtr.Zero ? "NULL" : Marshal.PtrToStringAnsi(ptr));
                    }
                    results.Add(string.Join(" | ", row));
                }
            } finally {
                sqlite3_finalize(stmt);
            }
        } finally {
            sqlite3_close(db);
        }
        return results;
    }
}
"@

Add-Type -TypeDefinition $csharpQuery
$dbPath = "c:\Users\Xiomara Siliezar\Desktop\idea_Proyecto\database\inventario_compras.db"

Write-Host "=== 1. AUDITORIA DE LLAVES FORANEAS (PRAGMA foreign_key_check) ===" -ForegroundColor Cyan
$fkCheck = [SqliteVerifier]::Query($dbPath, "PRAGMA foreign_key_check;")
if ($fkCheck.Count -eq 1) {
    Write-Host "RESULTADO: 0 Violaciones de Foreign Keys. Integridad Referencial 100% Perfecta." -ForegroundColor Green
}

Write-Host "`n=== 2. CONSULTA SQL A LA VISTA RELACIONAL (v_relaciones_completas_fk) ===" -ForegroundColor Cyan
$vistaRel = [SqliteVerifier]::Query($dbPath, "SELECT numero_factura, nombre_proveedor, id_producto, nombre_producto_catalogo, nombre_categoria, cantidad, total_linea, metodo_vinculacion_fk FROM v_relaciones_completas_fk;")
$vistaRel | ForEach-Object { Write-Host $_ }

Write-Host "`n=== 3. CONSULTA SQL AL TABLERO DE IA (v_alertas_abastecimiento_ia) ===" -ForegroundColor Cyan
$vistaIa = [SqliteVerifier]::Query($dbPath, "SELECT nivel_alerta, id_producto, producto, existencia_actual, stock_minimo, cantidad_sugerida_compra, inversion_total_sugerida, proveedor_recomendado, score_proveedor FROM v_alertas_abastecimiento_ia WHERE nivel_alerta != 'OPTIMO';")
$vistaIa | ForEach-Object { Write-Host $_ }
