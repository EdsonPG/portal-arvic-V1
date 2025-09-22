/**
 * === SISTEMA DE EXPORTACIÓN PDF INTELIGENTE PARA PORTAL ARVIC ===
 * Función genérica que convierte reportes Excel a PDF profesionales
 * Autor: Sistema Portal ARVIC
 * Características: Adaptable, Profesional, Reutilizable
 */

class ARVICPDFExporter {
    constructor() {
        this.brandColors = {
            primary: '#1976D2',
            secondary: '#2196F3', 
            light: '#4FC3F7',
            dark: '#0D47A1',
            text: '#464545',
            white: '#FFFFFF',
            gray: '#F5F5F5'
        };
        
        this.logoBase64 = null; // Se cargará dinámicamente
        this.initializePDFLib();
    }

    /**
     * Inicializar librería PDF
     */
    async initializePDFLib() {
        // Verificar si jsPDF está disponible, si no, cargarla dinámicamente
        if (typeof window.jsPDF === 'undefined') {
            await this.loadPDFLibrary();
        }
    }

    /**
     * Cargar librería jsPDF dinámicamente
     */
    async loadPDFLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                const autoTable = document.createElement('script');
                autoTable.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
                autoTable.onload = resolve;
                autoTable.onerror = reject;
                document.head.appendChild(autoTable);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Cargar logo de la empresa
     */
    async loadCompanyLogo() {
        if (this.logoBase64) return this.logoBase64;
        
        try {
            // Convertir SVG a base64 para usar en PDF
            const logoSvg = await fetch('../images/Logo Grupo IT Arvic 22.svg');
            const logoText = await logoSvg.text();
            
            // Crear canvas temporal para convertir SVG a imagen
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            return new Promise((resolve) => {
                img.onload = () => {
                    canvas.width = 200;
                    canvas.height = 75;
                    ctx.drawImage(img, 0, 0, 200, 75);
                    this.logoBase64 = canvas.toDataURL('image/png');
                    resolve(this.logoBase64);
                };
                
                const blob = new Blob([logoText], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                img.src = url;
            });
        } catch (error) {
            console.warn('No se pudo cargar el logo:', error);
            return null;
        }
    }

    /**
     * ✨ FUNCIÓN PRINCIPAL: Exportar Excel a PDF
     * @param {Object} config - Configuración del reporte
     * @param {Array} data - Datos del reporte
     * @param {Array} structure - Estructura de columnas
     * @param {string} reportType - Tipo de reporte
     * @param {Object} metadata - Metadata adicional
     */
    async exportToPDF({
        data = [],
        structure = [],
        reportType = 'general',
        metadata = {},
        filename = null
    }) {
        try {
            await this.initializePDFLib();
            const logo = await this.loadCompanyLogo();
            
            // Crear documento PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: structure.length > 6 ? 'landscape' : 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Configurar documento
            this.setupDocumentProperties(doc, reportType, metadata);
            
            // Agregar header con logo
            await this.addHeader(doc, logo, reportType, metadata);
            
            // Agregar información contextual
            this.addContextInfo(doc, metadata, 45);
            
            // Agregar tabla principal
            this.addDataTable(doc, data, structure, 70);
            
            // Agregar footer
            this.addFooter(doc, metadata);
            
            // Generar nombre de archivo
            const pdfFilename = filename || this.generatePDFFilename(reportType, metadata);
            
            // Guardar archivo
            doc.save(pdfFilename);
            
            // Guardar en historial
            this.savePDFToHistory(pdfFilename, reportType, data.length);
            
            window.NotificationUtils?.success(`PDF generado: ${pdfFilename}`);
            
            return {
                success: true,
                filename: pdfFilename,
                pages: doc.getNumberOfPages()
            };
            
        } catch (error) {
            console.error('❌ Error exportando PDF:', error);
            window.NotificationUtils?.error('Error al generar PDF: ' + error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Configurar propiedades del documento
     */
    setupDocumentProperties(doc, reportType, metadata) {
        doc.setProperties({
            title: `Reporte ${this.getReportTitle(reportType)} - GRUPO IT ARVIC`,
            subject: `Reporte generado el ${new Date().toLocaleDateString('es-MX')}`,
            author: 'GRUPO IT ARVIC - Portal de Gestión',
            keywords: `arvic, reporte, ${reportType}`,
            creator: 'Portal ARVIC PDF System'
        });
    }

    /**
     * Agregar header con logo
     */
    async addHeader(doc, logo, reportType, metadata) {
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Logo (si está disponible) - AJUSTADO
        if (logo) {
            doc.addImage(logo, 'PNG', 15, 10, 45, 18);
        }
        
        // Título principal - MOVIDO MÁS ABAJO
        doc.setFontSize(18);
        doc.setTextColor(this.brandColors.primary);
        doc.setFont(undefined, 'bold');
        
        const title = this.getReportTitle(reportType);
        const titleWidth = doc.getTextWidth(title);
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 25);
        
        // Subtítulo - MOVIDO MÁS ABAJO
        doc.setFontSize(12);
        doc.setTextColor(this.brandColors.text);
        doc.setFont(undefined, 'normal');
        
        const subtitle = this.getReportSubtitle(reportType, metadata);
        const subtitleWidth = doc.getTextWidth(subtitle);
        const subtitleX = (pageWidth - subtitleWidth) / 2;
        doc.text(subtitle, subtitleX, 33);
        
        // Línea divisoria - MOVIDA MÁS ABAJO
        doc.setDrawColor(this.brandColors.primary);
        doc.setLineWidth(0.5);
        doc.line(15, 40, pageWidth - 15, 40);
    }

    /**
     * Agregar información contextual
     */
    addContextInfo(doc, metadata, startY) {
        doc.setFontSize(10);
        doc.setTextColor(this.brandColors.text);
        
        let currentY = startY;
        const leftX = 15;
        const rightX = doc.internal.pageSize.getWidth() - 15;
        
        // Información izquierda
        if (metadata.cliente) {
            doc.text(`Cliente: ${metadata.cliente}`, leftX, currentY);
        }
        
        if (metadata.consultor) {
            doc.text(`Consultor: ${metadata.consultor}`, leftX, currentY + 5);
        }
        
        // Información derecha
        const fecha = new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const fechaText = `Generado: ${fecha}`;
        const fechaWidth = doc.getTextWidth(fechaText);
        doc.text(fechaText, rightX - fechaWidth, currentY);
        
        if (metadata.periodo) {
            const periodoText = `Período: ${metadata.periodo}`;
            const periodoWidth = doc.getTextWidth(periodoText);
            doc.text(periodoText, rightX - periodoWidth, currentY + 5);
        }
    }

    /**
     * Agregar tabla de datos principal
     * ✅ GENERA UNA TABLA COMPLETA como Excel (no solo texto)
     */
    addDataTable(doc, data, structure, startY) {
        if (!data || data.length === 0) {
            doc.setFontSize(12);
            doc.setTextColor(this.brandColors.text);
            doc.text('No hay datos para mostrar', 15, startY + 20);
            return;
        }

        console.log('📊 === GENERANDO TABLA COMPLETA EN PDF ===');
        console.log('🔹 Columnas:', structure.length);
        console.log('🔹 Filas de datos:', data.length);

        // Preparar datos para tabla (igual que Excel)
        const tableData = this.prepareTableData(data, structure);
        const tableHeaders = this.prepareTableHeaders(structure);

        console.log('📋 Headers de la tabla:', tableHeaders);
        console.log('📋 Ejemplo fila de datos:', tableData[0]);

        // ✅ CONFIGURACIÓN DE TABLA PROFESIONAL (usando autoTable)
        doc.autoTable({
            startY: startY,
            head: [tableHeaders],                    // ← Headers con nombres amigables
            body: tableData,                        // ← Datos editados formateados
            // 🎨 ESTILOS CORPORATIVOS ARVIC
            styles: {
                fontSize: 9,
                cellPadding: 4,                     // Espaciado interno
                textColor: this.hexToRgb(this.brandColors.text),
                lineColor: [200, 200, 200],        // Líneas suaves
                lineWidth: 0.1
            },
            // 🎨 HEADERS CON COLORES CORPORATIVOS  
            headStyles: {
                fillColor: this.hexToRgb(this.brandColors.primary), // ← Azul ARVIC
                textColor: [255, 255, 255],         // Texto blanco
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'center',
                cellPadding: 5
            },
            // 🎨 FILAS ALTERNADAS para mejor lectura
            alternateRowStyles: {
                fillColor: this.hexToRgb(this.brandColors.gray) // Gris suave alternado
            },
            // 🎨 ESTILOS ESPECÍFICOS por columna
            columnStyles: this.getColumnStyles(structure),
            // 📄 CONFIGURACIÓN DE PÁGINA
            margin: { left: 15, right: 15 },
            tableWidth: 'auto',
            // 🔄 CALLBACK para cada página
            didDrawPage: (data) => {
                this.addPageFooter(doc, data.pageNumber);
            },
            // 🎯 CONFIGURACIÓN AVANZADA
            showHead: 'everyPage',                  // Headers en cada página
            theme: 'grid',                          // Tema con bordes
            tableLineColor: [180, 180, 180],        // Color de líneas
            tableLineWidth: 0.1
        });

        console.log('✅ Tabla PDF generada exitosamente');
        console.log('📊 Posición final Y:', doc.lastAutoTable.finalY);

        // Agregar totales si existen
        this.addTotalsRow(doc, data, structure);
    }

    /**
     * Preparar datos para tabla
     */
    prepareTableData(data, structure) {
        return data.map(row => {
            return structure.map(column => {
                const value = this.getRowValue(row, column);
                return this.formatCellValue(value, column);
            });
        });
    }

    /**
     * Preparar headers de tabla
     */
    prepareTableHeaders(structure) {
        return structure.map(header => {
            // Mapear nombres técnicos a nombres amigables
            const friendlyNames = {
                'idEmpresa': 'ID Empresa',
                'consultor': 'Consultor',
                'soporte': 'Soporte',
                'modulo': 'Módulo',
                'editedTime': 'Tiempo',
                'editedTariff': 'Tarifa',
                'editedTotal': 'Total',
                'TIEMPO': 'Tiempo',
                'TARIFA de Modulo': 'Tarifa',
                'TOTAL': 'Total'
            };
            
            return friendlyNames[header] || header;
        });
    }

    /**
     * Obtener valor de fila según estructura
     * ✅ CRÍTICO: Usa valores EDITADOS por el usuario (no originales)
     */
    getRowValue(row, column) {
        const valueMap = {
            'ID Empresa': row.idEmpresa || row.companyId,
            'Consultor': row.consultor || row.consultorName,
            'Soporte': row.soporte || row.supportName,
            'Modulo': row.modulo || row.moduleName,
            // ✅ VALORES EDITADOS (modificados por usuario en vista previa)
            'TIEMPO': row.editedTime || row.tiempo || row.totalHoras || 0,
            'TARIFA de Modulo': row.editedTariff || row.tarifa || 0,
            'TOTAL': row.editedTotal || row.total || 0
        };
        
        // Log para debug: mostrar qué valores estamos usando
        if (column === 'TIEMPO') {
            console.log(`🕐 Tiempo para ${row.modulo || row.moduleName}: editedTime=${row.editedTime}, original=${row.tiempo || row.totalHoras}`);
        }
        if (column === 'TARIFA de Modulo') {
            console.log(`💰 Tarifa para ${row.modulo || row.moduleName}: editedTariff=${row.editedTariff}, original=${row.tarifa}`);
        }
        if (column === 'TOTAL') {
            console.log(`📊 Total para ${row.modulo || row.moduleName}: editedTotal=${row.editedTotal}, original=${row.total}`);
        }
        
        return valueMap[column] || row[column] || 'N/A';
    }

    /**
     * Formatear valor de celda
     */
    formatCellValue(value, column) {
        if (column === 'TOTAL' || column === 'TARIFA de Modulo') {
            const numValue = parseFloat(value) || 0;
            return `$${numValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
        }
        
        if (column === 'TIEMPO') {
            const numValue = parseFloat(value) || 0;
            return `${numValue} hrs`;
        }
        
        return value?.toString() || 'N/A';
    }

    /**
     * Configurar estilos de columnas
     */
    getColumnStyles(structure) {
        const styles = {};
        
        structure.forEach((column, index) => {
            if (column === 'TOTAL' || column === 'TARIFA de Modulo') {
                styles[index] = { halign: 'right', fontStyle: 'bold' };
            } else if (column === 'TIEMPO') {
                styles[index] = { halign: 'center' };
            } else if (column === 'ID Empresa') {
                styles[index] = { halign: 'center' };
            }
        });
        
        return styles;
    }

    /**
     * Agregar fila de totales
     * ✅ Calcula totales usando valores EDITADOS por el usuario
     */
    addTotalsRow(doc, data, structure) {
        const finalY = doc.lastAutoTable.finalY + 10;
        
        // ✅ Calcular totales usando DATOS EDITADOS
        let totalHours = 0;
        let totalAmount = 0;
        
        data.forEach(row => {
            // ✅ Usar editedTime (modificado por usuario) no tiempo original
            totalHours += parseFloat(row.editedTime || row.tiempo || row.totalHoras || 0);
            // ✅ Usar editedTotal (recalculado después de ediciones) no total original  
            totalAmount += parseFloat(row.editedTotal || row.total || 0);
        });
        
        console.log('📊 Totales calculados desde datos editados:');
        console.log('   • Total Horas Editadas:', totalHours.toFixed(2));
        console.log('   • Total Monto Editado:', totalAmount.toFixed(2));
        
        if (totalHours > 0 || totalAmount > 0) {
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(this.brandColors.primary);
            
            const pageWidth = doc.internal.pageSize.getWidth();
            const rightX = pageWidth - 15;
            
            if (totalHours > 0) {
                const hoursText = `Total Horas: ${totalHours.toFixed(1)} hrs`;
                const hoursWidth = doc.getTextWidth(hoursText);
                doc.text(hoursText, rightX - hoursWidth, finalY);
            }
            
            if (totalAmount > 0) {
                const amountText = `Total Monto: $${totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
                const amountWidth = doc.getTextWidth(amountText);
                doc.text(amountText, rightX - amountWidth, finalY + 7);
            }
            
            // ✅ Nota indicando que son valores editados
            doc.setFontSize(8);
            doc.setTextColor(this.brandColors.text);
            doc.setFont(undefined, 'italic');
            const noteText = '* Totales calculados con valores modificados en vista previa';
            const noteWidth = doc.getTextWidth(noteText);
            doc.text(noteText, rightX - noteWidth, finalY + 14);
        }
    }

    /**
     * Agregar footer principal
     */
    addFooter(doc, metadata) {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Línea divisoria
        doc.setDrawColor(this.brandColors.primary);
        doc.setLineWidth(0.3);
        doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);
        
        // Información del footer
        doc.setFontSize(8);
        doc.setTextColor(this.brandColors.text);
        doc.setFont(undefined, 'normal');
        
        const footerText = 'GRUPO IT ARVIC - Sistema de Gestión Empresarial';
        const footerWidth = doc.getTextWidth(footerText);
        const footerX = (pageWidth - footerWidth) / 2;
        
        doc.text(footerText, footerX, pageHeight - 15);
        
        const dateText = `Documento generado automáticamente - ${new Date().toLocaleString('es-MX')}`;
        const dateWidth = doc.getTextWidth(dateText);
        const dateX = (pageWidth - dateWidth) / 2;
        
        doc.text(dateText, dateX, pageHeight - 8);
    }

    /**
     * Agregar footer de página
     */
    addPageFooter(doc, pageNumber) {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        doc.setFontSize(8);
        doc.setTextColor(this.brandColors.text);
        
        const pageText = `Página ${pageNumber}`;
        const pageTextWidth = doc.getTextWidth(pageText);
        doc.text(pageText, pageWidth - 15 - pageTextWidth, pageHeight - 30);
    }

    /**
     * Obtener título del reporte
     */
    getReportTitle(reportType) {
        const titles = {
            'pago-consultor-general': 'REPORTE GENERAL DE PAGOS',
            'pago-consultor-especifico': 'REPORTE DE PAGO CONSULTOR',
            'cliente-soporte': 'REPORTE DE CLIENTE SOPORTE',
            'remanente': 'REPORTE REMANENTE',
            'proyecto-general': 'REPORTE GENERAL DE PROYECTOS',
            'proyecto-cliente': 'REPORTE DE PROYECTOS POR CLIENTE',
            'proyecto-consultor': 'REPORTE DE PROYECTOS POR CONSULTOR'
        };
        
        return titles[reportType] || 'REPORTE EMPRESARIAL';
    }

    /**
     * Obtener subtítulo del reporte
     */
    getReportSubtitle(reportType, metadata) {
        const date = new Date().toLocaleDateString('es-MX', { 
            year: 'numeric', 
            month: 'long' 
        });
        
        if (metadata.periodo) {
            return `${metadata.periodo} - GRUPO IT ARVIC`;
        }
        
        return `${date} - GRUPO IT ARVIC`;
    }

    /**
     * Generar nombre de archivo PDF
     */
    generatePDFFilename(reportType, metadata) {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
        
        const prefixes = {
            'pago-consultor-general': 'PagoGeneral',
            'pago-consultor-especifico': 'PagoConsultor', 
            'cliente-soporte': 'ClienteSoporte',
            'remanente': 'Remanente',
            'proyecto-general': 'ProyectoGeneral',
            'proyecto-cliente': 'ProyectoCliente',
            'proyecto-consultor': 'ProyectoConsultor'
        };
        
        const prefix = prefixes[reportType] || 'Reporte';
        let suffix = '';
        
        if (metadata.consultor) {
            suffix = `_${metadata.consultor.split(' ')[0]}`;
        } else if (metadata.cliente) {
            suffix = `_${metadata.cliente.split(' ')[0]}`;
        }
        
        return `${prefix}${suffix}_PDF_${dateStr}_${timeStr}.pdf`;
    }

    /**
     * Guardar PDF en historial
     */
    savePDFToHistory(filename, reportType, recordCount) {
        try {
            const history = JSON.parse(localStorage.getItem('arvic_pdf_history') || '[]');
            
            const record = {
                filename: filename,
                reportType: reportType,
                recordCount: recordCount,
                generatedAt: new Date().toISOString(),
                generatedBy: 'Sistema PDF'
            };
            
            history.unshift(record);
            
            // Mantener solo los últimos 50 registros
            if (history.length > 50) {
                history.splice(50);
            }
            
            localStorage.setItem('arvic_pdf_history', JSON.stringify(history));
            
        } catch (error) {
            console.warn('No se pudo guardar en historial PDF:', error);
        }
    }

    /**
     * Utilidad: Convertir hex a RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16), 
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
}

// ============================================================================
// INTEGRACIÓN CON SISTEMA EXISTENTE
// ============================================================================

/**
 * Inicializar sistema PDF global
 */
window.ARVICPDFExporter = new ARVICPDFExporter();

/**
 * 🎯 FUNCIÓN DE INTEGRACIÓN: Exportar reporte actual a PDF
 * ✅ IMPORTANTE: Usa editablePreviewData (datos YA EDITADOS por el usuario)
 * ✅ Se ejecuta DESPUÉS de que el usuario editó tiempo y tarifas
 * ✅ Complementa la función Excel existente (generateFinalReport)
 */
async function exportCurrentReportToPDF() {
    console.log('📄 === INICIANDO EXPORTACIÓN PDF ===');
    console.log('📊 Usando datos editados de editablePreviewData:', Object.keys(editablePreviewData).length, 'filas');
    
    // Validar que hay datos editables (después de la edición del usuario)
    if (!currentReportType || !editablePreviewData || Object.keys(editablePreviewData).length === 0) {
        window.NotificationUtils?.error('❌ No hay datos editados para exportar a PDF. Genere primero la vista previa.');
        return;
    }
    
    try {
        // Mostrar qué datos estamos usando
        console.log('🔍 Ejemplo de datos editables:');
        const firstRow = Object.values(editablePreviewData)[0];
        console.log('   • editedTime:', firstRow.editedTime);
        console.log('   • editedTariff:', firstRow.editedTariff); 
        console.log('   • editedTotal:', firstRow.editedTotal);
        console.log('   ✅ Usando valores EDITADOS (no originales)');
        
        // Obtener configuración del reporte actual
        const report = ARVIC_REPORTS[currentReportType];
        
        // Preparar metadata del contexto actual
        const metadata = {
            reportType: currentReportType,
            cliente: document.getElementById('clientFilter')?.selectedOptions[0]?.text?.replace(/\s*\([^)]*\)/, '') || 'N/A',
            consultor: document.getElementById('consultantFilter')?.selectedOptions[0]?.text?.replace(/\s*\([^)]*\)/, '') || 'N/A',
            soporte: document.getElementById('supportTypeFilter')?.selectedOptions[0]?.text || 'N/A',
            periodo: document.getElementById('monthFilter')?.selectedOptions[0]?.text || 
                    document.getElementById('yearFilter')?.selectedOptions[0]?.text || 'N/A',
            generatedAt: new Date().toISOString(),
            totalRecords: Object.keys(editablePreviewData).length,
            // ✅ Agregar información de que son datos editados
            isEditedData: true,
            editingNote: 'Datos modificados por el usuario en vista previa'
        };
        
        // ✅ CRÍTICO: Usar editablePreviewData (datos YA editados)
        const data = Object.values(editablePreviewData);
        console.log('✅ Preparando', data.length, 'filas editadas para PDF');
        
        // Exportar con sistema PDF
        const result = await window.ARVICPDFExporter.exportToPDF({
            data: data,                    // ← Datos EDITADOS
            structure: report.structure,   // ← Estructura del reporte
            reportType: currentReportType, // ← Tipo actual
            metadata: metadata            // ← Contexto completo
        });
        
        if (result.success) {
            console.log('✅ PDF exportado exitosamente:', result.filename);
            console.log('📊 Páginas generadas:', result.pages);
        } else {
            throw new Error(result.error);
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Error en exportación PDF:', error);
        window.NotificationUtils?.error('Error al generar PDF: ' + error.message);
        return { success: false, error: error.message };
    }
}

/**
 * 🎯 FUNCIÓN DIRECTA: Para exportar cualquier reporte
 */
async function exportReportToPDF(reportData, reportType, customMetadata = {}) {
    const report = ARVIC_REPORTS[reportType];
    
    return await window.ARVICPDFExporter.exportToPDF({
        data: reportData,
        structure: report.structure,
        reportType: reportType,
        metadata: customMetadata
    });
}

// ============================================================================
// DEMO Y TESTING
// ============================================================================

/**
 * Función de prueba para verificar funcionamiento
 */
async function testPDFExport() {
    const testData = [
        {
            idEmpresa: 'EMP001',
            consultor: 'Juan Pérez',
            soporte: 'Desarrollo Web',
            modulo: 'Frontend',
            editedTime: 8,
            editedTariff: 500,
            editedTotal: 4000
        },
        {
            idEmpresa: 'EMP002', 
            consultor: 'María García',
            soporte: 'Consultoría',
            modulo: 'Backend',
            editedTime: 6,
            editedTariff: 600,
            editedTotal: 3600
        }
    ];
    
    const metadata = {
        cliente: 'Cliente de Prueba',
        consultor: 'Consultor de Prueba',
        periodo: 'Noviembre 2024'
    };
    
    return await window.ARVICPDFExporter.exportToPDF({
        data: testData,
        structure: ['ID Empresa', 'Consultor', 'Soporte', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL'],
        reportType: 'pago-consultor-general',
        metadata: metadata,
        filename: 'TEST_Reporte_PDF.pdf'
    });
}

console.log('🎯 Sistema PDF ARVIC inicializado correctamente');
console.log('📊 Funciones disponibles:');
console.log('   • exportCurrentReportToPDF() - Exportar reporte actual');
console.log('   • exportReportToPDF(data, type, metadata) - Exportar reporte específico');
console.log('   • testPDFExport() - Función de prueba');