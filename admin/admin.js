let currentReportFilter = 'all';

// === CONFIGURACIÓN DE REPORTES ARVIC ===
const ARVIC_REPORTS = {
    'pago-consultor-general': {
        name: 'Pago Consultor Soporte (General)',
        icon: '💰',
        description: 'Información general de todos los soportes con cálculo de pagos para consultores',
        audience: '👑 Administradores y Gerentes',
        filters: ['time', 'support'],
        structure: ['ID Empresa', 'Consultor', 'Soporte', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL'],
        editableFields: ['TIEMPO', 'TARIFA de Modulo'],
        excelTitle: 'RESUMEN DE PAGO A CONSULTOR'
    },
    'pago-consultor-especifico': {
        name: 'Pago Consultor Soporte (Consultor)',
        icon: '👤',
        description: 'Datos de soportes de un consultor específico con filtros flexibles',
        audience: '👤 Consultores y Supervisores',
        filters: ['consultant', 'support', 'time'],
        structure: ['ID Empresa', 'Consultor', 'Soporte', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL'],
        editableFields: ['TIEMPO', 'TARIFA de Modulo'],
        excelTitle: 'PAGO A CONSULTOR'
    },
    'cliente-soporte': {
        name: 'Cliente Soporte (Cliente)',
        icon: '📞',
        description: 'Soportes brindados a un cliente específico para transparencia de servicios',
        audience: '🏢 Clientes y Atención al Cliente',
        filters: ['client', 'support', 'time'],
        structure: ['Soporte', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL'],
        editableFields: ['TIEMPO', 'TARIFA de Modulo'],
        excelTitle: 'Cliente: [Nombre]'
    },
    'remanente': {
        name: 'Reporte Remanente',
        icon: '📊',
        description: 'Información acumulada de reportes aprobados dividida por semanas del mes',
        audience: '👑 Administradores - Seguimiento',
        filters: ['client', 'supportType', 'month'],
        structure: ['Total de Horas', 'SEMANA 1', 'SEMANA 2', 'SEMANA 3', 'SEMANA 4'],
        editableFields: ['TIEMPO', 'TARIFA'],
        excelTitle: 'REPORTE REMANENTE',
        specialFormat: 'weekly'
    },
    'proyecto-general': {
        name: 'Proyecto (General)',
        icon: '📋',
        description: 'Información general de todos los proyectos con recursos asignados',
        audience: '👑 Administradores y Gerentes',
        filters: ['time', 'project'],
        structure: ['ID Empresa', 'Consultor', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL'],
        editableFields: ['TIEMPO', 'TARIFA de Modulo'],
        excelTitle: 'Proyecto: [Nombre]'
    },
    'proyecto-cliente': {
        name: 'Proyecto (Cliente)',
        icon: '🏢',
        description: 'Proyectos de un cliente específico con vista simplificada para presentación externa',
        audience: '🏢 Clientes',
        filters: ['client', 'project', 'time'],
        structure: ['Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL'],
        editableFields: ['TIEMPO', 'TARIFA de Modulo'],
        excelTitle: 'Proyecto: [Nombre]'
    },
    'proyecto-consultor': {
        name: 'Proyecto (Consultor)',
        icon: '👤',
        description: 'Proyectos asignados a un consultor específico para seguimiento personal',
        audience: '👤 Consultores',
        filters: ['consultant', 'project', 'time'],
        structure: ['ID Empresa', 'Consultor', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL'],
        editableFields: ['TIEMPO', 'TARIFA de Modulo'],
        excelTitle: 'Proyecto: [Nombre]'
    }
};

// Variables globales para el nuevo sistema de reportes
let currentReportType = null;
let currentReportData = null;
let currentReportConfig = null;
let editablePreviewData = {};

function diagnosticCompleteAdmin() {
    console.log('🔍 === DIAGNÓSTICO COMPLETO ===');
    
    // Verificar que estamos en la página correcta
    console.log('📄 URL actual:', window.location.href);
    console.log('📄 Título:', document.title);
    
    // Verificar todas las secciones
    const allSections = document.querySelectorAll('[id$="-section"]');
    console.log('📝 Secciones encontradas:');
    allSections.forEach(section => {
        console.log(`  - ${section.id} (display: ${getComputedStyle(section).display})`);
    });
    
    // Verificar la sección específica
    const createSection = document.getElementById('crear-asignacion-section');
    if (createSection) {
        console.log('✅ crear-asignacion-section encontrada');
        console.log('  - Display:', getComputedStyle(createSection).display);
        console.log('  - Clases:', createSection.className);
        
        // Buscar todos los selects dentro de esta sección
        const selectsInSection = createSection.querySelectorAll('select');
        console.log(`  - Selects encontrados: ${selectsInSection.length}`);
        selectsInSection.forEach((select, index) => {
            console.log(`    ${index + 1}. ID: "${select.id}" Name: "${select.name}"`);
        });
    } else {
        console.error('❌ crear-asignacion-section NO encontrada');
    }
    
    // Verificar cada elemento específico
    const targetElements = ['assignUser', 'assignCompany', 'assignSupport', 'assignModule'];
    targetElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id}: Encontrado (${element.tagName})`);
            console.log(`    - Parent: ${element.parentElement?.className || 'unknown'}`);
            console.log(`    - Visible: ${getComputedStyle(element).display !== 'none'}`);
        } else {
            console.error(`❌ ${id}: NO ENCONTRADO`);
        }
    });
    
    // Buscar elementos similares por nombre
    const allSelects = document.querySelectorAll('select');
    console.log('🔍 Todos los selects en la página:');
    allSelects.forEach((select, index) => {
        console.log(`  ${index + 1}. ID: "${select.id}" Name: "${select.name}" Class: "${select.className}"`);
    });
}

function debugDropdowns() {
    console.log('🔍 Diagnosticando elementos del DOM...');
    
    const elements = [
        'assignUser',
        'assignCompany', 
        'assignSupport',
        'assignModule'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Element ${id}:`, element ? '✅ Exists' : '❌ NOT FOUND');
        if (element) {
            console.log(`  - Type: ${element.tagName}`);
            console.log(`  - Parent: ${element.parentElement?.id || 'unknown'}`);
        }
    });
    
    // Verificar si la sección está visible
    const section = document.getElementById('crear-asignacion-section');
    console.log('Crear asignación section:', section ? '✅ Exists' : '❌ NOT FOUND');
    if (section) {
        console.log('  - Display:', getComputedStyle(section).display);
        console.log('  - Has active class:', section.classList.contains('active'));
    }
}

/// === GESTIÓN DE ASIGNACIONES ===
function createAssignment() {
    const userId = document.getElementById('assignUser').value;
    const companyId = document.getElementById('assignCompany').value;
    const supportId = document.getElementById('assignSupport').value; // Cambiar de taskId
    const moduleId = document.getElementById('assignModule').value;
    
    if (!userId || !companyId || !supportId || !moduleId) {
        window.NotificationUtils.error('Todos los campos son requeridos para crear una asignación');
        return;
    }

    const assignmentData = {
        userId: userId,
        companyId: companyId,
        supportId: supportId, // Cambiar de taskId
        moduleId: moduleId
    };

    const result = window.PortalDB.createAssignment(assignmentData);
    
    if (result.success) {
        const user = currentData.users[userId];
        const company = currentData.companies[companyId];
        const support = currentData.supports[supportId]; // Cambiar de task
        const module = currentData.modules[moduleId];
        
        window.NotificationUtils.success(
            `✅ Nueva asignación creada: ${user.name} → ${company.name} (${support.name} - ${module.name})`
        );
        
        // Limpiar formulario
        document.getElementById('assignUser').value = '';
        document.getElementById('assignCompany').value = '';
        document.getElementById('assignSupport').value = ''; // Cambiar de assignTask
        document.getElementById('assignModule').value = '';
        
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al crear asignación: ' + result.message);
    }
}

function deleteProjectAssignment(assignmentId) {
    if (!confirm('¿Está seguro de eliminar esta asignación de proyecto?')) {
        return;
    }
    
    const result = window.PortalDB.deleteProjectAssignment(assignmentId);
    
    if (result.success) {
        window.NotificationUtils.success('Asignación de proyecto eliminada');
        loadAllData();
    } else {
        window.NotificationUtils.error('Error: ' + result.message);
    }
}

function deleteAssignment(assignmentId) {
    if (!confirm('¿Está seguro de eliminar esta asignación?')) {
        return;
    }

    const result = window.PortalDB.deleteAssignment(assignmentId);
    
    if (result.success) {
        window.NotificationUtils.success('Asignación eliminada correctamente');
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al eliminar asignación: ' + result.message);
    }
}

// === CARGA Y ACTUALIZACIÓN DE DATOS ===
function loadAllData() {
    console.log('🔄 Cargando todos los datos...');
    
    try {
        currentData.users = window.PortalDB.getUsers() || {};
        currentData.companies = window.PortalDB.getCompanies() || {};
        currentData.projects = window.PortalDB.getProjects() || {};
        currentData.assignments = window.PortalDB.getAssignments() || {};
        currentData.supports = window.PortalDB.getSupports() || {};
        currentData.modules = window.PortalDB.getModules() || {};
        currentData.reports = window.PortalDB.getReports() || {};
        currentData.projectAssignments = window.PortalDB.getProjectAssignments() || {}; // NUEVA LÍNEA
        
        updateUI();
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
    }
}

function updateUI() {
    console.log('🎨 === ACTUALIZANDO UI ===');
    
    try {
        updateSidebarCounts();
        updateCurrentSectionData();
        
        // NO llamar updateDropdowns aquí automáticamente
        // Se llamará específicamente cuando sea necesario
        
        console.log('✅ UI actualizada correctamente');
    } catch (error) {
        console.error('❌ Error actualizando UI:', error);
    }
}

function updateCurrentSectionData() {
    if (!currentSection) {
        console.log('⚠️ currentSection no definida');
        return;
    }
    
    console.log(`📊 Actualizando datos para sección actual: ${currentSection}`);
    loadSectionData(currentSection);
}

function updateStats() {
    /*
    const stats = window.PortalDB.getStats();

    document.getElementById('usersCount').textContent = stats.totalUsers;
    document.getElementById('companiesCount').textContent = stats.totalCompanies;
    document.getElementById('projectsCount').textContent = stats.totalProjects;
    document.getElementById('assignmentsCount').textContent = stats.totalAssignments;
    */
}

function updateSidebarCounts() {
    const consultorUsers = Object.values(currentData.users).filter(user => 
        user.role === 'consultor' && user.isActive !== false
    );
    const companies = Object.values(currentData.companies);
    const projects = Object.values(currentData.projects);
    const assignments = Object.values(currentData.assignments).filter(a => a.isActive);
    const projectAssignments = Object.values(currentData.projectAssignments || {});
    document.getElementById('sidebarProjectAssignmentsCount').textContent = projectAssignments.length;

    const supports = Object.values(currentData.supports); // Cambiar de tasks
    const modules = Object.values(currentData.modules);
    const reports = Object.values(currentData.reports);

    // Calcular contadores específicos
    const pendingReports = reports.filter(r => r.status === 'Pendiente');
    const approvedReports = reports.filter(r => r.status === 'Aprobado');
    const generatedReports = Object.values(window.PortalDB.getGeneratedReports());
    
    const sidebarElements = {
        'sidebarUsersCount': consultorUsers.length,
        'sidebarCompaniesCount': companies.length,
        'sidebarProjectsCount': projects.length,
        'sidebarSupportsCount': supports.length, // Cambiar de sidebarTasksCount
        'sidebarModulesCount': modules.length,
        'sidebarAssignmentsCount': assignments.length,
        'sidebarReportsCount': pendingReports.length,
        'sidebarApprovedReportsCount': approvedReports.length,
        'sidebarGeneratedReportsCount': generatedReports.length
    };

    Object.entries(sidebarElements).forEach(([elementId, count]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = count;
        }
    });
}

function updateSupportsList() {
    const container = document.getElementById('supportsList');
    const supports = Object.values(currentData.supports);
    
    if (supports.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📞</div>
                <div class="empty-state-title">No hay soportes</div>
                <div class="empty-state-desc">Cree el primer soporte</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    supports.forEach(support => {
        const supportDiv = document.createElement('div');
        supportDiv.className = 'item hover-lift';
        
        // Colores por prioridad
        const priorityColors = {
            'Baja': '#95a5a6',
            'Media': '#f39c12',
            'Alta': '#e74c3c',
            'Crítica': '#8e44ad'
        };
        
        // Colores por tipo
        const typeColors = {
            'Técnico': '#3498db',
            'Funcional': '#2ecc71',
            'Configuración': '#f39c12',
            'Mantenimiento': '#9b59b6',
            'Otros': '#95a5a6'
        };
        
        supportDiv.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <span class="item-id">${support.id}</span>
                    <strong>${support.name}</strong>
                    <span class="custom-badge" style="background: ${typeColors[support.type]}20; color: ${typeColors[support.type]}; border: 1px solid ${typeColors[support.type]};">
                        ${support.type}
                    </span>
                    <span class="custom-badge" style="background: ${priorityColors[support.priority]}20; color: ${priorityColors[support.priority]}; border: 1px solid ${priorityColors[support.priority]}; font-size: 11px;">
                        ${support.priority}
                    </span>
                </div>
                <small style="color: #666;">
                    📅 Creado: ${window.DateUtils.formatDate(support.createdAt)}
                    ${support.description ? `<br>📝 ${window.TextUtils.truncate(support.description, 60)}` : ''}
                </small>
            </div>
            <button class="delete-btn" onclick="deleteSupport('${support.id}')" title="Eliminar soporte">
                🗑️
            </button>
        `;
        container.appendChild(supportDiv);
    });
}

function updateApprovedReportsList() {
    const approvedReportsTableBody = document.getElementById('approvedReportsTableBody');
    const timeFilter = document.getElementById('timeFilter');
    const customDateRange = document.getElementById('customDateRange');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const filterInfo = document.getElementById('filterInfo');
    
    if (!approvedReportsTableBody) return;
    
    // Mostrar/ocultar rango personalizado
    if (timeFilter && customDateRange) {
        if (timeFilter.value === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
        }
    }
    
    const reports = Object.values(currentData.reports);
    const approvedReports = reports.filter(r => r.status === 'Aprobado');
    
    // Filtrar reportes por fecha
    let filteredReports = [];
    const now = new Date();
    let filterText = '';
    
    if (timeFilter) {
        switch(timeFilter.value) {
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo
                startOfWeek.setHours(0, 0, 0, 0);
                
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
                endOfWeek.setHours(23, 59, 59, 999);
                
                filteredReports = approvedReports.filter(report => {
                    const reportDate = new Date(report.createdAt);
                    return reportDate >= startOfWeek && reportDate <= endOfWeek;
                });
                
                filterText = `Esta semana (${window.DateUtils.formatDate(startOfWeek)} - ${window.DateUtils.formatDate(endOfWeek)})`;
                break;
                
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endOfMonth.setHours(23, 59, 59, 999);
                
                filteredReports = approvedReports.filter(report => {
                    const reportDate = new Date(report.createdAt);
                    return reportDate >= startOfMonth && reportDate <= endOfMonth;
                });
                
                const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                filterText = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
                break;
                
            case 'custom':
                if (startDate && endDate && startDate.value && endDate.value) {
                    const customStart = new Date(startDate.value);
                    customStart.setHours(0, 0, 0, 0);
                    
                    const customEnd = new Date(endDate.value);
                    customEnd.setHours(23, 59, 59, 999);
                    
                    filteredReports = approvedReports.filter(report => {
                        const reportDate = new Date(report.createdAt);
                        return reportDate >= customStart && reportDate <= customEnd;
                    });
                    
                    filterText = `${window.DateUtils.formatDate(customStart)} - ${window.DateUtils.formatDate(customEnd)}`;
                } else {
                    filteredReports = approvedReports;
                    filterText = 'Rango personalizado (seleccione fechas)';
                }
                break;
                
            default: // 'all'
                filteredReports = approvedReports;
                filterText = 'Todas las fechas';
                break;
        }
    } else {
        filteredReports = approvedReports;
        filterText = 'Esta semana';
    }
    
    // Actualizar texto informativo
    if (filterInfo) {
        filterInfo.textContent = `Mostrando: ${filterText}`;
    }
    
    if (filteredReports.length === 0) {
        approvedReportsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table-message">
                    <div class="empty-state">
                        <div class="empty-state-icon">✅</div>
                        <div class="empty-state-title">No hay reportes aprobados</div>
                        <div class="empty-state-desc">No se encontraron reportes aprobados en el período seleccionado</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // *** CAMBIO PRINCIPAL: Agrupar por ASIGNACIÓN, no por usuario ***
    const assignmentSummary = {};
    
    filteredReports.forEach(report => {
        const user = currentData.users[report.userId];
        
        // Determinar la asignación específica del reporte
        let assignment = null;
        if (report.assignmentId) {
            // Nuevo sistema: reporte vinculado a asignación específica
            assignment = currentData.assignments[report.assignmentId];
        } else {
            // Sistema legado: buscar primera asignación activa del usuario
            assignment = Object.values(currentData.assignments).find(a => 
                a.userId === report.userId && a.isActive
            );
        }
        
        if (user && assignment) {
            // Usar assignmentId como clave única para agrupar
            const key = assignment.id;
            
            if (!assignmentSummary[key]) {
                const company = currentData.companies[assignment.companyId];
                const project = currentData.projects[assignment.projectId];
                const task = currentData.tasks[assignment.taskId];
                const module = currentData.modules[assignment.moduleId];
                
                assignmentSummary[key] = {
                    assignmentId: assignment.id,
                    consultantId: user.id,
                    consultantName: user.name,
                    companyId: assignment.companyId,
                    companyName: company ? company.name : 'No asignado',
                    projectName: project ? project.name : 'No asignado',
                    taskName: task ? task.name : 'No asignada',
                    moduleName: module ? module.name : 'No asignado',
                    totalHours: 0
                };
            }
            
            // Acumular horas por asignación específica
            assignmentSummary[key].totalHours += parseFloat(report.hours || 0);
        }
    });
    
    // Generar tabla agrupada por asignación
    approvedReportsTableBody.innerHTML = '';
    Object.values(assignmentSummary).forEach(summary => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="consultant-id">${summary.consultantId}</span></td>
            <td><span class="consultant-name">${summary.consultantName}</span></td>
            <td><span class="consultant-id">${summary.companyId}</span></td>
            <td><span class="company-name">${summary.companyName}</span></td>
            <td><span class="project-name">${summary.projectName}</span></td>
            <td>${summary.taskName}</td>
            <td>${summary.moduleName}</td>
            <td><span class="hours-reported">${summary.totalHours.toFixed(1)} hrs</span></td>
        `;
        approvedReportsTableBody.appendChild(row);
    });
}

// === SOLUCIÓN SIMPLE: HEADERS Y COLUMNAS DINÁMICAS ===

/**
 * 1. NUEVA FUNCIÓN: Actualiza headers dinámicamente según filtro
 */
function updateTableHeaders() {
    const thead = document.querySelector('#reportsTable thead tr');
    if (!thead) return;
    
    if (currentReportFilter === 'proyecto') {
        // Headers para PROYECTO (9 columnas - sin "Tipo Soporte")
        thead.innerHTML = `
            <th>ID Consultor</th>
            <th>Nombre Consultor</th>
            <th>Cliente (Empresa)</th>
            <th>Proyecto</th>
            <th>Módulo</th>
            <th>Horas Reportadas</th>
            <th>Fecha Reporte</th>
            <th>Estado</th>
            <th>Acciones</th>
        `;
    } else {
        // Headers para SOPORTE y TODOS (10 columnas - con "Tipo Soporte")
        const soporteLabel = currentReportFilter === 'all' ? 'Asignación' : 'Soporte';
        const tipoLabel = currentReportFilter === 'all' ? 'Tipo' : 'Tipo Soporte';
        
        thead.innerHTML = `
            <th>ID Consultor</th>
            <th>Nombre Consultor</th>
            <th>Cliente (Empresa)</th>
            <th>${soporteLabel}</th>
            <th>${tipoLabel}</th>
            <th>Módulo</th>
            <th>Horas Reportadas</th>
            <th>Fecha Reporte</th>
            <th>Estado</th>
            <th>Acciones</th>
        `;
    }
}

function updateCompaniesList() {
    const container = document.getElementById('companiesList');
    const companies = Object.values(currentData.companies);
    
    if (companies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏢</div>
                <div class="empty-state-title">No hay empresas</div>
                <div class="empty-state-desc">Registre la primera empresa cliente</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    companies.forEach(company => {
        const companyDiv = document.createElement('div');
        companyDiv.className = 'item hover-lift';
        companyDiv.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <span class="item-id">${company.id}</span>
                    <strong>${company.name}</strong>
                </div>
                <small style="color: #666;">
                    📅 Registrada: ${window.DateUtils.formatDate(company.createdAt)}
                    ${company.description ? `<br>📝 ${window.TextUtils.truncate(company.description, 60)}` : ''}
                </small>
            </div>
            <button class="delete-btn" onclick="deleteCompany('${company.id}')" title="Eliminar empresa">
                🗑️
            </button>
        `;
        container.appendChild(companyDiv);
    });
}

function updateProjectsList() {
    const container = document.getElementById('projectsList');
    const projects = Object.values(currentData.projects);
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-title">No hay proyectos</div>
                <div class="empty-state-desc">Cree el primer proyecto</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'item hover-lift';
        
        projectDiv.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <span class="item-id">${project.id}</span>
                    <strong>${project.name}</strong>
                    <!-- ✅ Sin badge de status -->
                </div>
                <small style="color: #666;">
                    📅 Creado: ${window.DateUtils.formatDate(project.createdAt)}
                    ${project.description ? `<br>📝 ${window.TextUtils.truncate(project.description, 60)}` : ''}
                </small>
            </div>
            <button class="delete-btn" onclick="deleteProject('${project.id}')" title="Eliminar proyecto">
                🗑️
            </button>
        `;
        container.appendChild(projectDiv);
    });
}

function updateTasksList() {
    const container = document.getElementById('tasksList');
    const tasks = Object.values(currentData.tasks);
    
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <div class="empty-state-title">No hay tareas</div>
                <div class="empty-state-desc">Cree la primera tarea</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'item hover-lift';
        
        // Determinar colores según estado y prioridad
        const statusColors = {
            'Pendiente': '#f39c12',
            'En Progreso': '#3498db',
            'Completada': '#27ae60'
        };
        
        const priorityColors = {
            'Baja': '#95a5a6',
            'Media': '#f39c12',
            'Alta': '#e74c3c'
        };
        
        taskDiv.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <span class="item-id">${task.id}</span>
                    <strong>${task.name}</strong>
                    <span class="custom-badge" style="background: ${statusColors[task.status]}20; color: ${statusColors[task.status]}; border: 1px solid ${statusColors[task.status]};">
                        ${task.status}
                    </span>
                    ${task.priority ? `
                        <span class="custom-badge" style="background: ${priorityColors[task.priority]}20; color: ${priorityColors[task.priority]}; border: 1px solid ${priorityColors[task.priority]}; font-size: 11px;">
                            ${task.priority}
                        </span>
                    ` : ''}
                </div>
                <small style="color: #666;">
                    📅 Creada: ${window.DateUtils.formatDate(task.createdAt)}
                    ${task.description ? `<br>📝 ${window.TextUtils.truncate(task.description, 60)}` : ''}
                </small>
            </div>
            <button class="delete-btn" onclick="deleteTask('${task.id}')" title="Eliminar tarea">
                🗑️
            </button>
        `;
        container.appendChild(taskDiv);
    });
}

function updateModulesList() {
    const container = document.getElementById('modulesList');
    const modules = Object.values(currentData.modules);
    
    if (modules.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🧩</div>
                <div class="empty-state-title">No hay módulos</div>
                <div class="empty-state-desc">Cree el primer módulo</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    modules.forEach(module => {
        const moduleDiv = document.createElement('div');
        moduleDiv.className = 'item hover-lift';
        
        // Determinar colores por categoría y estado
        const categoryColors = {
            'Frontend': '#e74c3c',
            'Backend': '#3498db',
            'Base de Datos': '#9b59b6',
            'API': '#f39c12',
            'Integración': '#1abc9c',
            'Otros': '#95a5a6'
        };
        
        const statusColors = {
            'Planificación': '#f39c12',
            'En Desarrollo': '#3498db',
            'Completado': '#27ae60'
        };
        
        moduleDiv.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <span class="item-id">${module.id}</span>
                    <strong>${module.name}</strong>
                    <span class="custom-badge" style="background: ${categoryColors[module.category]}20; color: ${categoryColors[module.category]}; border: 1px solid ${categoryColors[module.category]};">
                        ${module.category}
                    </span>
                    ${module.status ? `
                        <span class="custom-badge" style="background: ${statusColors[module.status]}20; color: ${statusColors[module.status]}; border: 1px solid ${statusColors[module.status]}; font-size: 11px;">
                            ${module.status}
                        </span>
                    ` : ''}
                </div>
                <small style="color: #666;">
                    📅 Creado: ${window.DateUtils.formatDate(module.createdAt)}
                    ${module.description ? `<br>📝 ${window.TextUtils.truncate(module.description, 60)}` : ''}
                </small>
            </div>
            <button class="delete-btn" onclick="deleteModule('${module.id}')" title="Eliminar módulo">
                🗑️
            </button>
        `;
        container.appendChild(moduleDiv);
    });
}

function updateProjectAssignmentDropdowns() {
    console.log('🔄 Actualizando dropdowns de asignación de proyectos...');
    
    // Verificar datos básicos
    if (!currentData || !currentData.users || !currentData.companies || !currentData.projects || !currentData.modules) {
        console.error('❌ Datos no disponibles para asignación de proyectos');
        return;
    }
    
    // Configuración IGUAL que la asignación normal, pero con proyectos
    const elementsConfig = [
        {
            id: 'assignProjectConsultor',        // CAMBIO: ahora es consultor individual
            defaultOption: 'Seleccionar consultor',
            data: Object.values(currentData.users).filter(user => 
                user.role === 'consultor' && user.isActive !== false
            ),
            getLabel: (user) => `${user.name} (${user.id})`
        },
        {
            id: 'assignProjectProject',
            defaultOption: 'Seleccionar proyecto',
            data: Object.values(currentData.projects),
            getLabel: (project) => `${project.name}`
        },
        {
            id: 'assignProjectCompany',
            defaultOption: 'Seleccionar empresa cliente',
            data: Object.values(currentData.companies),
            getLabel: (company) => `${company.name} (${company.id})`
        },
        {
            id: 'assignProjectModule',
            defaultOption: 'Seleccionar módulo',
            data: Object.values(currentData.modules),
            getLabel: (module) => `${module.name} (${module.id})`
        }
    ];
    
    // Actualizar cada dropdown (IGUAL que updateDropdowns())
    elementsConfig.forEach(config => {
        try {
            const element = document.getElementById(config.id);
            if (!element) {
                console.error(`❌ ${config.id} no encontrado`);
                return;
            }
            
            // Limpiar y agregar opción por defecto
            element.innerHTML = `<option value="">${config.defaultOption}</option>`;
            
            // Agregar opciones de datos
            if (config.data && config.data.length > 0) {
                config.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = config.getLabel(item);
                    element.appendChild(option);
                });
                console.log(`✅ ${config.id} actualizado con ${config.data.length} opciones`);
            }
        } catch (error) {
            console.error(`❌ Error actualizando ${config.id}:`, error);
        }
    });
}

function updateConsultorsList() {
    const container = document.getElementById('consultorsListContainer');
    if (!container) return;
    
    const consultors = Object.values(currentData.users).filter(user => 
        user.role === 'consultor' && user.isActive !== false
    );
    
    if (consultors.length === 0) {
        container.innerHTML = '<p>No hay consultores disponibles</p>';
        return;
    }
    
    container.innerHTML = '';
    consultors.forEach(consultor => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'consultor-checkbox-item';
        checkboxDiv.innerHTML = `
            <label class="consultor-checkbox-label">
                <input type="checkbox" 
                       name="selectedConsultors" 
                       value="${consultor.id}" 
                       class="consultor-checkbox">
                <span class="checkbox-text">${consultor.name} (${consultor.id})</span>
            </label>
        `;
        container.appendChild(checkboxDiv);
    });
}

function updateProjectAssignmentsList() {
    const container = document.getElementById('projectAssignmentsList');
    if (!container) return;
    
    const assignments = Object.values(currentData.projectAssignments || {});
    
    if (assignments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎯</div>
                <div class="empty-state-title">No hay proyectos asignados</div>
                <div class="empty-state-desc">Los proyectos asignados aparecerán aquí</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    assignments.forEach(assignment => {
        const project = currentData.projects[assignment.projectId];
        const company = currentData.companies[assignment.companyId];
        const module = currentData.modules[assignment.moduleId];
        const consultor = currentData.users[assignment.consultorId];
        
        const assignmentDiv = document.createElement('div');
        assignmentDiv.className = 'project-assignment-card';
        assignmentDiv.innerHTML = `
            <div class="assignment-header">
                <h3>🎯 ${project?.name || 'Proyecto no encontrado'}</h3>
                <span class="assignment-id">${assignment.id.slice(-6)}</span>
            </div>
            
            <div class="assignment-details">
                <p><strong>🏢 Cliente:</strong> ${company?.name || 'No asignado'}</p>
                <p><strong>🧩 Módulo:</strong> ${module?.name || 'No asignado'}</p>
                <p><strong>👤 Consultor:</strong> ${consultor?.name || 'No asignado'} (${assignment.consultorId})</p>
            </div>
            
            <div class="assignment-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteProjectAssignment('${assignment.id}')">
                    🗑️ Eliminar Asignación
                </button>
            </div>
        `;
        container.appendChild(assignmentDiv);
    });
}

function updateAssignmentsList() {
    const container = document.getElementById('assignmentsList');
    const recentContainer = document.getElementById('recentAssignments');
    const assignments = Object.values(currentData.assignments);
    
    // Actualizar lista completa de asignaciones
    if (container) {
        if (assignments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔗</div>
                    <div class="empty-state-title">No hay asignaciones</div>
                    <div class="empty-state-desc">Las asignaciones creadas aparecerán en esta lista</div>
                </div>
            `;
        } else {
            container.innerHTML = '';
            assignments.forEach(assignment => {
                const user = currentData.users[assignment.userId];
                const company = currentData.companies[assignment.companyId];
                const support = currentData.supports[assignment.supportId]; // Cambiar de taskId
                const module = currentData.modules[assignment.moduleId];
                
                if (user && company && support && module) {
                    const assignmentDiv = document.createElement('div');
                    assignmentDiv.className = 'item hover-lift';
                    assignmentDiv.innerHTML = `
                        <div>
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                                <span class="item-id">${assignment.id.slice(-6)}</span>
                                <strong>${user.name}</strong>
                                <span class="custom-badge badge-info">Asignado</span>
                            </div>
                            <small style="color: #666;">
                                🏢 ${company.name} | 📞 ${support.name}<br>
                                🔧 ${support.type} | 🧩 ${module.name}<br>
                                📅 ${window.DateUtils.formatDate(assignment.createdAt)}
                            </small>
                        </div>
                        <button class="delete-btn" onclick="deleteAssignment('${assignment.id}')" title="Eliminar asignación">
                            🗑️
                        </button>
                    `;
                    container.appendChild(assignmentDiv);
                }
            });
        }
    }
    
    // Actualizar asignaciones recientes (últimas 5)
    if (recentContainer) {
        const recentAssignments = assignments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
            
        if (recentAssignments.length === 0) {
            recentContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎯</div>
                    <div class="empty-state-title">Sin asignaciones</div>
                    <div class="empty-state-desc">Las asignaciones recientes aparecerán aquí</div>
                </div>
            `;
        } else {
            recentContainer.innerHTML = '';
            recentAssignments.forEach(assignment => {
                const user = currentData.users[assignment.userId];
                const company = currentData.companies[assignment.companyId];
                const support = currentData.supports[assignment.supportId]; // Cambiar de projectId
                
                if (user && company && support) {
                    const assignmentDiv = document.createElement('div');
                    assignmentDiv.className = 'item hover-lift';
                    assignmentDiv.innerHTML = `
                        <div>
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                                <strong>${user.name}</strong>
                                <span class="custom-badge badge-success">
                                    ${window.DateUtils.formatRelativeTime(assignment.createdAt)}
                                </span>
                            </div>
                            <small style="color: #666;">
                                🏢 ${company.name} | 📞 ${support.name}
                            </small>
                        </div>
                    `;
                    recentContainer.appendChild(assignmentDiv);
                }
            });
        }
    }
}

function updateReportsList() {
    const reportsTableBody = document.getElementById('reportsTableBody');
    
    if (!reportsTableBody) return;
    
    const allReports = Object.values(currentData.reports);
    const pendingReports = allReports.filter(r => r.status === 'Pendiente');
    
    if (pendingReports.length === 0) {
        reportsTableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-table-message">
                    <div class="empty-state">
                        <div class="empty-state-icon">📄</div>
                        <div class="empty-state-title">No hay reportes pendientes</div>
                        <div class="empty-state-desc">Los reportes pendientes aparecerán aquí para su revisión</div>
                    </div>
                </td>
            </tr>
        `;
    } else {
        reportsTableBody.innerHTML = '';
        pendingReports.forEach(report => {
            const user = currentData.users[report.userId];
            
            let assignment = null;
            let company = null;
            let support = null; // Cambiar de task
            let module = null;
            
            if (report.assignmentId) {
                assignment = currentData.assignments[report.assignmentId];
                if (assignment) {
                    company = currentData.companies[assignment.companyId];
                    support = currentData.supports[assignment.supportId]; // Cambiar de taskId
                    module = currentData.modules[assignment.moduleId];
                }
            } else {
                assignment = Object.values(currentData.assignments).find(a => a.userId === report.userId && a.isActive);
                if (assignment) {
                    company = currentData.companies[assignment.companyId];
                    support = currentData.supports[assignment.supportId]; // Cambiar de taskId
                    module = currentData.modules[assignment.moduleId];
                }
            }
            
            if (user) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="consultant-id">${user.id}</span></td>
                    <td><span class="consultant-name">${user.name}</span></td>
                    <td><span class="company-name">${company ? company.name : 'Sin asignación'}</span></td>
                    <td><span class="project-name">${support ? support.name : 'Sin soporte'}</span></td>
                    <td>${support ? support.type || 'N/A' : 'Sin tipo'}</td>
                    <td>${module ? module.name : 'Sin módulo'}</td>
                    <td><span class="hours-reported">${report.hours || '0'} hrs</span></td>
                    <td><span class="report-date">${window.DateUtils.formatDate(report.createdAt)}</span></td>
                    <td>
                        <span class="status-badge status-${report.status.toLowerCase()}">
                            ${report.status}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn btn-approve" onclick="approveReport('${report.id}')" title="Aprobar reporte">
                                ✅ Aprobar
                            </button>
                            <button class="action-btn btn-reject" onclick="rejectReport('${report.id}')" title="Rechazar reporte">
                                ❌ Rechazar
                            </button>
                            <button class="action-btn btn-view" onclick="viewReport('${report.id}')" title="Ver detalles">
                                👁️ Ver
                            </button>
                        </div>
                    </td>
                `;
                reportsTableBody.appendChild(row);
            }
        });
    }
}

function updateApprovedReportsList() {
    const approvedReportsTableBody = document.getElementById('approvedReportsTableBody');
    const timeFilter = document.getElementById('timeFilter');
    const customDateRange = document.getElementById('customDateRange');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const filterInfo = document.getElementById('filterInfo');
    
    if (!approvedReportsTableBody) return;
    
    // Mostrar/ocultar rango personalizado
    if (timeFilter && customDateRange) {
        if (timeFilter.value === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
        }
    }
    
    const reports = Object.values(currentData.reports);
    const approvedReports = reports.filter(r => r.status === 'Aprobado');
    
    // Filtrar reportes por fecha (lógica existente...)
    let filteredReports = [];
    const now = new Date();
    let filterText = '';
    
    if (timeFilter) {
        switch(timeFilter.value) {
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                
                filteredReports = approvedReports.filter(report => {
                    const reportDate = new Date(report.createdAt);
                    return reportDate >= startOfWeek && reportDate <= endOfWeek;
                });
                
                filterText = `Esta semana (${window.DateUtils.formatDate(startOfWeek)} - ${window.DateUtils.formatDate(endOfWeek)})`;
                break;
                
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endOfMonth.setHours(23, 59, 59, 999);
                
                filteredReports = approvedReports.filter(report => {
                    const reportDate = new Date(report.createdAt);
                    return reportDate >= startOfMonth && reportDate <= endOfMonth;
                });
                
                const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                filterText = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
                break;
                
            case 'custom':
                if (startDate && endDate && startDate.value && endDate.value) {
                    const customStart = new Date(startDate.value);
                    customStart.setHours(0, 0, 0, 0);
                    
                    const customEnd = new Date(endDate.value);
                    customEnd.setHours(23, 59, 59, 999);
                    
                    filteredReports = approvedReports.filter(report => {
                        const reportDate = new Date(report.createdAt);
                        return reportDate >= customStart && reportDate <= customEnd;
                    });
                    
                    filterText = `${window.DateUtils.formatDate(customStart)} - ${window.DateUtils.formatDate(customEnd)}`;
                } else {
                    filteredReports = approvedReports;
                    filterText = 'Rango personalizado (seleccione fechas)';
                }
                break;
                
            default: // 'all'
                filteredReports = approvedReports;
                filterText = 'Todas las fechas';
                break;
        }
    } else {
        filteredReports = approvedReports;
        filterText = 'Esta semana';
    }
    
    // Actualizar texto informativo
    if (filterInfo) {
        filterInfo.textContent = `Mostrando: ${filterText}`;
    }
    
    if (filteredReports.length === 0) {
        approvedReportsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table-message">
                    <div class="empty-state">
                        <div class="empty-state-icon">✅</div>
                        <div class="empty-state-title">No hay reportes aprobados</div>
                        <div class="empty-state-desc">No se encontraron reportes aprobados en el período seleccionado</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Agrupar por ASIGNACIÓN
    const assignmentSummary = {};
    
    filteredReports.forEach(report => {
        const user = currentData.users[report.userId];
        
        let assignment = null;
        if (report.assignmentId) {
            assignment = currentData.assignments[report.assignmentId];
        } else {
            assignment = Object.values(currentData.assignments).find(a => 
                a.userId === report.userId && a.isActive
            );
        }
        
        if (user && assignment) {
            const key = assignment.id;
            
            if (!assignmentSummary[key]) {
                const company = currentData.companies[assignment.companyId];
                const support = currentData.supports[assignment.supportId]; // Cambiar de taskId
                const module = currentData.modules[assignment.moduleId];
                
                assignmentSummary[key] = {
                    assignmentId: assignment.id,
                    consultantId: user.id,
                    consultantName: user.name,
                    companyId: assignment.companyId,
                    companyName: company ? company.name : 'No asignado',
                    supportName: support ? support.name : 'No asignado', // Cambiar de projectName
                    supportType: support ? support.type : 'N/A', // Nuevo campo
                    moduleName: module ? module.name : 'No asignado',
                    totalHours: 0
                };
            }
            
            assignmentSummary[key].totalHours += parseFloat(report.hours || 0);
        }
    });
    
    // Generar tabla agrupada por asignación
    approvedReportsTableBody.innerHTML = '';
    Object.values(assignmentSummary).forEach(summary => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="consultant-id">${summary.consultantId}</span></td>
            <td><span class="consultant-name">${summary.consultantName}</span></td>
            <td><span class="consultant-id">${summary.companyId}</span></td>
            <td><span class="company-name">${summary.companyName}</span></td>
            <td><span class="project-name">${summary.supportName}</span></td>
            <td>${summary.supportType}</td>
            <td>${summary.moduleName}</td>
            <td><span class="hours-reported">${summary.totalHours.toFixed(1)} hrs</span></td>
        `;
        approvedReportsTableBody.appendChild(row);
    });
}


function approveReport(reportId) {
    const result = window.PortalDB.updateReport(reportId, { status: 'Aprobado' });
    if (result.success) {
        window.NotificationUtils.success('Reporte aprobado');
        loadAllData();
        updateSidebarCounts();
    }
}

function rejectReport(reportId) {
    const feedback = prompt('Comentarios de rechazo (opcional):');
    const result = window.PortalDB.updateReport(reportId, { 
        status: 'Rechazado',
        feedback: feedback || 'Sin comentarios'
    });
    if (result.success) {
        window.NotificationUtils.success('Reporte rechazado');
        loadAllData();
        updateSidebarCounts();
    }
}

function updateDropdowns() {
    console.log('🔄 === INICIANDO updateDropdowns ULTRA-DEFENSIVO ===');
    
    // Verificar que currentData esté disponible
    if (!currentData) {
        console.error('❌ currentData no está disponible');
        return;
    }
    
    // Inicializar datos si no existen
    currentData.users = currentData.users || {};
    currentData.companies = currentData.companies || {};
    currentData.supports = currentData.supports || {};
    currentData.modules = currentData.modules || {};
    currentData.assignments = currentData.assignments || {};
    
    // Lista de elementos que vamos a actualizar
    const elementsToUpdate = [
        {
            id: 'assignUser',
            defaultOption: 'Seleccionar usuario',
            getData: () => Object.values(currentData.users).filter(user => 
                user.role === 'consultor' && user.isActive !== false
            ),
            getLabel: (user) => {
                const userAssignments = Object.values(currentData.assignments).filter(a => 
                    a.userId === user.id && a.isActive
                );
                return `${user.name} (${user.id})${userAssignments.length > 0 ? ` - ${userAssignments.length} asignación(es)` : ''}`;
            }
        },
        {
            id: 'assignCompany',
            defaultOption: 'Seleccionar empresa',
            getData: () => Object.values(currentData.companies),
            getLabel: (company) => `${company.name} (${company.id})`
        },
        {
            id: 'assignSupport',
            defaultOption: 'Seleccionar Soporte',
            getData: () => Object.values(currentData.supports),
            getLabel: (support) => `${support.name} (${support.id})`
        },
        {
            id: 'assignModule',
            defaultOption: 'Seleccionar Módulo',
            getData: () => Object.values(currentData.modules),
            getLabel: (module) => `${module.name} (${module.id})`
        }
    ];
    
    // VERIFICACIÓN PREVIA: Verificar que TODOS los elementos existen
    console.log('🔍 === VERIFICACIÓN PREVIA DE ELEMENTOS ===');
    const missingElements = [];
    elementsToUpdate.forEach(config => {
        const element = document.getElementById(config.id);
        if (element) {
            console.log(`✅ ${config.id}: Encontrado (${element.tagName})`);
            console.log(`    - Parent: ${element.parentElement?.tagName || 'unknown'}`);
            console.log(`    - Display: ${getComputedStyle(element).display}`);
            console.log(`    - Visible: ${element.offsetParent !== null}`);
        } else {
            console.error(`❌ ${config.id}: NO ENCONTRADO`);
            missingElements.push(config.id);
        }
    });
    
    if (missingElements.length > 0) {
        console.error(`❌ Elementos faltantes: ${missingElements.join(', ')}`);
        console.error('🚨 Abortando updateDropdowns debido a elementos faltantes');
        return;
    }
    
    console.log('✅ Todos los elementos encontrados, procediendo con actualización...');
    
    // ACTUALIZACIÓN CON VERIFICACIONES MÚLTIPLES
    elementsToUpdate.forEach((config, index) => {
        console.log(`🔄 === ACTUALIZANDO ${config.id} (${index + 1}/${elementsToUpdate.length}) ===`);
        
        try {
            // VERIFICACIÓN 1: Verificar que el elemento aún existe
            let element = document.getElementById(config.id);
            if (!element) {
                console.error(`❌ CRÍTICO: ${config.id} ya no existe al momento de actualizar`);
                return;
            }
            console.log(`✅ Verificación 1: ${config.id} existe`);
            
            // VERIFICACIÓN 2: Verificar que el elemento es válido
            if (!(element instanceof HTMLSelectElement)) {
                console.error(`❌ CRÍTICO: ${config.id} no es un elemento select válido, es: ${element.constructor.name}`);
                return;
            }
            console.log(`✅ Verificación 2: ${config.id} es un select válido`);
            
            // VERIFICACIÓN 3: Verificar que innerHTML es accesible
            try {
                const testInnerHTML = element.innerHTML;
                console.log(`✅ Verificación 3: ${config.id} innerHTML es accesible (length: ${testInnerHTML.length})`);
            } catch (error) {
                console.error(`❌ CRÍTICO: ${config.id} innerHTML no es accesible:`, error);
                return;
            }
            
            // ACTUALIZACIÓN SEGURA
            console.log(`🔄 Limpiando contenido de ${config.id}...`);
            
            // VERIFICACIÓN 4: Re-verificar elemento antes de modificar innerHTML
            element = document.getElementById(config.id);
            if (!element) {
                console.error(`❌ CRÍTICO: ${config.id} desapareció justo antes de innerHTML`);
                return;
            }
            
            // *** AQUÍ ES DONDE PROBABLEMENTE ESTÁ FALLANDO ***
            console.log(`🔄 Estableciendo innerHTML para ${config.id}...`);
            console.log(`    Element:`, element);
            console.log(`    Element type:`, typeof element);
            console.log(`    Element constructor:`, element.constructor.name);
            console.log(`    Element parentNode:`, element.parentNode);
            console.log(`    Default option:`, config.defaultOption);
            
            // INTENTO DE ACTUALIZACIÓN CON CAPTURA DE ERROR ESPECÍFICA
            try {
                element.innerHTML = `<option value="">${config.defaultOption}</option>`;
                console.log(`✅ innerHTML establecido exitosamente para ${config.id}`);
            } catch (innerHTMLError) {
                console.error(`❌ ERROR ESPECÍFICO AL ESTABLECER innerHTML para ${config.id}:`, innerHTMLError);
                console.error(`    Element en el momento del error:`, element);
                console.error(`    Element.innerHTML en el momento del error:`, element.innerHTML);
                console.error(`    Element.parentNode en el momento del error:`, element.parentNode);
                throw innerHTMLError; // Re-lanzar para captura externa
            }
            
            // Obtener datos y crear opciones
            const data = config.getData();
            console.log(`📊 Datos obtenidos para ${config.id}: ${data.length} elementos`);
            
            if (data && data.length > 0) {
                data.forEach((item, itemIndex) => {
                    try {
                        // RE-VERIFICAR elemento antes de cada appendChild
                        element = document.getElementById(config.id);
                        if (!element) {
                            console.error(`❌ CRÍTICO: ${config.id} desapareció durante appendChild ${itemIndex}`);
                            return;
                        }
                        
                        const option = document.createElement('option');
                        option.value = item.id;
                        option.textContent = config.getLabel(item);
                        element.appendChild(option);
                    } catch (appendError) {
                        console.error(`❌ Error añadiendo opción ${itemIndex} a ${config.id}:`, appendError);
                    }
                });
                console.log(`✅ ${config.id} actualizado con ${data.length} opciones`);
            } else {
                console.log(`⚠️ ${config.id} actualizado pero sin datos`);
            }
            
        } catch (error) {
            console.error(`❌ ERROR GENERAL actualizando ${config.id}:`, error);
            console.error(`    Error stack:`, error.stack);
            
            // INFORMACIÓN ADICIONAL DE DEBUG
            const elementAtError = document.getElementById(config.id);
            console.error(`    Element en momento de error:`, elementAtError);
            console.error(`    Document readyState:`, document.readyState);
            console.error(`    Current section:`, currentSection);
            
            // NO lanzar el error, continuar con el siguiente elemento
        }
    });
    
    console.log('✅ === updateDropdowns COMPLETADO ===');
}

// FUNCIÓN ADICIONAL PARA VERIFICAR EL ESTADO DEL DOM
function verifyDOMState() {
    console.log('🔍 === VERIFICACIÓN DE ESTADO DEL DOM ===');
    console.log('Document readyState:', document.readyState);
    console.log('Document URL:', document.URL);
    console.log('Current section:', currentSection);
    
    // Verificar si hay elementos duplicados
    const elements = ['assignUser', 'assignCompany', 'assignSupport', 'assignModule'];
    elements.forEach(id => {
        const allElements = document.querySelectorAll(`#${id}`);
        console.log(`${id}: ${allElements.length} elemento(s) encontrado(s)`);
        if (allElements.length > 1) {
            console.error(`❌ DUPLICADO: Hay ${allElements.length} elementos con ID ${id}`);
            allElements.forEach((el, index) => {
                console.log(`  ${index + 1}. Parent:`, el.parentElement);
            });
        }
    });
    
    // Verificar la sección activa
    const activeSection = document.querySelector('.content-section.active');
    console.log('Sección activa:', activeSection ? activeSection.id : 'ninguna');
    
    // Verificar si hay conflictos de CSS que puedan estar ocultando elementos
    const createSection = document.getElementById('crear-asignacion-section');
    if (createSection) {
        console.log('crear-asignacion-section:');
        console.log('  - Display:', getComputedStyle(createSection).display);
        console.log('  - Visibility:', getComputedStyle(createSection).visibility);
        console.log('  - Opacity:', getComputedStyle(createSection).opacity);
        console.log('  - Position:', getComputedStyle(createSection).position);
    }
}

// FUNCIÓN PARA LLAMAR DESDE LA CONSOLA
window.verifyDOMState = verifyDOMState;
window.ultraDefensiveUpdate = updateDropdowns;

// === GESTIÓN DE MODALES ===
function openUserModal() {
    document.getElementById('userName').focus();
    window.ModalUtils.open('userModal');
}

function openCompanyModal() {
    document.getElementById('companyName').focus();
    window.ModalUtils.open('companyModal');
}

function openProjectModal() {
    document.getElementById('projectName').focus();
    window.ModalUtils.open('projectModal');
}

function openTaskModal() {
    document.getElementById('taskName').focus();
    window.ModalUtils.open('taskModal');
}

function openModuleModal() {
    document.getElementById('moduleName').focus();
    window.ModalUtils.open('moduleModal');
}

function closeModal(modalId) {
    window.ModalUtils.close(modalId);
}

function closeAllModals() {
    window.ModalUtils.closeAll();
}

// === FUNCIONES DE UTILIDAD ===
function logout() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        window.AuthSys.logout();
    }
}

function exportData() {
    try {
        const data = window.PortalDB.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `arvic-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        window.NotificationUtils.success('Datos exportados correctamente');
    } catch (error) {
        window.NotificationUtils.error('Error al exportar datos: ' + error.message);
    }
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const result = window.PortalDB.importData(e.target.result);
                if (result.success) {
                    window.NotificationUtils.success('Datos importados correctamente');
                    loadAllData();
                } else {
                    window.NotificationUtils.error('Error al importar: ' + result.message);
                }
            } catch (error) {
                window.NotificationUtils.error('Archivo inválido');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function generateAdminReport() {
    const stats = window.PortalDB.getStats();
    const activities = window.AuthSys.getRecentActivities(20);
    
    const reportData = {
        generatedAt: new Date().toISOString(),
        generatedBy: window.AuthSys.getCurrentUser().name,
        statistics: stats,
        recentActivities: activities,
        totalUsers: Object.keys(currentData.users).length,
        totalCompanies: Object.keys(currentData.companies).length,
        totalProjects: Object.keys(currentData.projects).length,
        totalTasks: Object.keys(currentData.tasks).length,
        totalModules: Object.keys(currentData.modules).length,
        totalAssignments: Object.keys(currentData.assignments).length,
        totalReports: Object.keys(currentData.reports).length
    };
    
    // Crear reporte HTML
    const reportHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">
                📊 Reporte Administrativo - Portal ARVIC
            </h1>
            <p style="text-align: center; color: #666; margin-bottom: 40px;">
                Generado el ${window.DateUtils.formatDateTime(reportData.generatedAt)}<br>
                Por: ${reportData.generatedBy}
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 40px;">
                <div style="background: #3498db; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2 style="margin: 0; font-size: 2em;">${reportData.totalUsers}</h2>
                    <p style="margin: 5px 0 0;">Usuarios</p>
                </div>
                <div style="background: #2ecc71; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2 style="margin: 0; font-size: 2em;">${reportData.totalCompanies}</h2>
                    <p style="margin: 5px 0 0;">Empresas</p>
                </div>
                <div style="background: #f39c12; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2 style="margin: 0; font-size: 2em;">${reportData.totalProjects}</h2>
                    <p style="margin: 5px 0 0;">Proyectos</p>
                </div>
                <div style="background: #e74c3c; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2 style="margin: 0; font-size: 2em;">${reportData.totalTasks}</h2>
                    <p style="margin: 5px 0 0;">Tareas</p>
                </div>
                <div style="background: #9b59b6; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2 style="margin: 0; font-size: 2em;">${reportData.totalModules}</h2>
                    <p style="margin: 5px 0 0;">Módulos</p>
                </div>
                <div style="background: #1abc9c; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2 style="margin: 0; font-size: 2em;">${reportData.totalAssignments}</h2>
                    <p style="margin: 5px 0 0;">Asignaciones</p>
                </div>
            </div>
            
            <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                🔄 Actividad Reciente
            </h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                ${activities.length > 0 ? 
                    activities.map(activity => `
                        <div style="margin-bottom: 10px; padding: 10px; background: white; border-left: 4px solid #3498db; border-radius: 4px;">
                            <strong>${activity.description}</strong><br>
                            <small style="color: #666;">
                                Usuario: ${activity.userId} | 
                                ${window.DateUtils.formatDateTime(activity.timestamp)}
                            </small>
                        </div>
                    `).join('') : 
                    '<p style="color: #666; text-align: center;">No hay actividad reciente</p>'
                }
            </div>
        </div>
    `;
    
    // Abrir en nueva ventana para imprimir
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reporte Administrativo - Portal ARVIC</title>
            <style>
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${reportHTML}
            <div class="no-print" style="text-align: center; margin-top: 30px;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🖨️ Imprimir Reporte
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                    ❌ Cerrar
                </button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

/**
 * Detecta la categoría de un reporte (soporte o proyecto)
 * @param {Object} report - Objeto del reporte
 * @returns {string} - 'soporte', 'proyecto', o 'unknown'
 */
function getReportCategory(report) {
    if (!report.assignmentId) {
        return 'unknown';
    }
    
    // Verificar si es asignación de soporte (assignments)
    const supportAssignment = currentData.assignments[report.assignmentId];
    if (supportAssignment && supportAssignment.supportId) {
        return 'soporte';
    }
    
    // Verificar si es asignación de proyecto (project_assignments)
    const projectAssignments = currentData.projectAssignments || {};
    const projectAssignment = projectAssignments[report.assignmentId];
    if (projectAssignment && projectAssignment.projectId) {
        return 'proyecto';
    }
    
    return 'unknown';
}

/**
 * Filtra reportes por categoría y actualiza la interfaz
 * @param {string} category - 'all', 'soporte', 'proyecto'
 */
function filterReportsByCategory(category) {
    console.log(`🔍 Filtrando reportes por categoría: ${category}`);
    
    currentReportFilter = category;
    
    // Actualizar botones activos
    updateCategoryFilterButtons(category);

    // Actualizar encabezados de la tabla
    updateTableHeaders();
    
    // Actualizar tabla con filtro aplicado
    updateReportsListWithFilter();
    
    // Animación de filtrado
    const table = document.querySelector('.reports-table');
    if (table) {
        table.classList.add('filtering');
        setTimeout(() => {
            table.classList.remove('filtering');
        }, 300);
    }
}

/**
 * Actualiza el estado visual de los botones de filtro
 * @param {string} activeCategory - Categoría activa
 */
function updateCategoryFilterButtons(activeCategory) {
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === activeCategory) {
            btn.classList.add('active');
        }
    });
}

/**
 * Actualiza la lista de reportes aplicando el filtro actual
 */
function updateReportsListWithFilter() {
    const reportsTableBody = document.getElementById('reportsTableBody');
    if (!reportsTableBody) return;
    
    const allReports = Object.values(currentData.reports);
    const pendingReports = allReports.filter(r => r.status === 'Pendiente');
    
    // Aplicar filtro por categoría
    let filteredReports = pendingReports;
    if (currentReportFilter !== 'all') {
        filteredReports = pendingReports.filter(report => {
            const category = getReportCategory(report);
            return category === currentReportFilter;
        });
    }
    
    // Actualizar contadores
    updateReportCategoryCounts(pendingReports);
    
    // Renderizar reportes filtrados
    if (filteredReports.length === 0) {
        const emptyMessage = getEmptyStateMessage(currentReportFilter);
        
        // Colspan dinámico según número de columnas
        const colspan = currentReportFilter === 'proyecto' ? '9' : '10';
        
        reportsTableBody.innerHTML = `
            <tr>
                <td colspan="${colspan}" class="empty-table-message">
                    <div class="empty-state">
                        <div class="empty-state-icon">${emptyMessage.icon}</div>
                        <div class="empty-state-title">${emptyMessage.title}</div>
                        <div class="empty-state-desc">${emptyMessage.desc}</div>
                    </div>
                </td>
            </tr>
        `;
    } else {
        reportsTableBody.innerHTML = '';
        filteredReports.forEach(report => {
            const reportRow = createReportTableRow(report);
            reportsTableBody.appendChild(reportRow);
        });
    }
}

/**
 * Actualiza los contadores en los botones de filtro
 * @param {Array} allPendingReports - Todos los reportes pendientes
 */
function updateReportCategoryCounts(allPendingReports) {
    const counts = {
        all: allPendingReports.length,
        soporte: 0,
        proyecto: 0
    };
    
    allPendingReports.forEach(report => {
        const category = getReportCategory(report);
        if (counts[category] !== undefined) {
            counts[category]++;
        }
    });
    
    // Actualizar elementos del DOM
    const allCountElement = document.getElementById('filterCountAll');
    const soporteCountElement = document.getElementById('filterCountSoporte');
    const proyectoCountElement = document.getElementById('filterCountProyecto');
    
    if (allCountElement) allCountElement.textContent = counts.all;
    if (soporteCountElement) soporteCountElement.textContent = counts.soporte;
    if (proyectoCountElement) proyectoCountElement.textContent = counts.proyecto;
}

/**
 * Genera el mensaje de estado vacío según la categoría
 * @param {string} category - Categoría actual
 * @returns {Object} - Objeto con icon, title y desc
 */
function getEmptyStateMessage(category) {
    switch (category) {
        case 'soporte':
            return {
                icon: '📞',
                title: 'No hay reportes de soporte pendientes',
                desc: 'Los reportes de soporte aparecerán aquí para su revisión'
            };
        case 'proyecto':
            return {
                icon: '📋',
                title: 'No hay reportes de proyecto pendientes',
                desc: 'Los reportes de proyecto aparecerán aquí para su revisión'
            };
        default:
            return {
                icon: '📄',
                title: 'No hay reportes pendientes',
                desc: 'Los reportes enviados por consultores aparecerán aquí'
            };
    }
}

/**
 * Crea una fila de la tabla para un reporte
 * @param {Object} report - Objeto del reporte
 * @returns {HTMLElement} - Elemento tr de la tabla
 */

function createReportTableRow(report) {
    const user = currentData.users[report.userId];
    
    let assignment = null;
    let company = null;
    let support = null;
    let project = null;
    let module = null;
    
    // Determinar tipo de asignación y obtener datos
    if (report.assignmentId) {
        // Verificar asignación de soporte
        assignment = currentData.assignments[report.assignmentId];
        if (assignment) {
            company = currentData.companies[assignment.companyId];
            support = currentData.supports[assignment.supportId];
            module = currentData.modules[assignment.moduleId];
        } else {
            // Verificar asignación de proyecto
            const projectAssignments = currentData.projectAssignments || {};
            assignment = projectAssignments[report.assignmentId];
            if (assignment) {
                company = currentData.companies[assignment.companyId];
                project = currentData.projects[assignment.projectId];
                module = currentData.modules[assignment.moduleId];
            }
        }
    }
    
    const row = document.createElement('tr');
    
    // Generar HTML según el filtro actual
    if (currentReportFilter === 'proyecto') {
        // HTML para PROYECTO (9 columnas - sin columna tipo)
        row.innerHTML = `
            <td><span class="consultant-id">${user?.id || 'N/A'}</span></td>
            <td><span class="consultant-name">${user?.name || 'Usuario no encontrado'}</span></td>
            <td><span class="company-name">${company ? company.name : 'Sin asignación'}</span></td>
            <td><span class="project-name">${project ? project.name : 'Sin proyecto'}</span></td>
            <td>${module ? module.name : 'Sin módulo'}</td>
            <td><span class="hours-badge">${report.hours || 0} hrs</span></td>
            <td>${window.DateUtils ? window.DateUtils.formatDate(report.createdAt) : new Date(report.createdAt).toLocaleDateString()}</td>
            <td><span class="status-badge status-pending">Pendiente</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-view" onclick="viewReport('${report.id}')" title="Ver detalles">
                        👁️ Ver
                    </button>
                    <button class="action-btn btn-approve" onclick="approveReport('${report.id}')" title="Aprobar reporte">
                        ✅ Aprobar
                    </button>
                    <button class="action-btn btn-reject" onclick="rejectReport('${report.id}')" title="Rechazar reporte">
                        ❌ Rechazar
                    </button>
                </div>
            </td>
        `;
    } else {
        // HTML para SOPORTE y TODOS (10 columnas - con columna tipo)
        const asignacionContent = support ? support.name : (project ? project.name : 'Sin asignación');
        const tipoContent = support ? support.type || 'N/A' : (project ? 'Proyecto' : 'Sin tipo');
        
        row.innerHTML = `
            <td><span class="consultant-id">${user?.id || 'N/A'}</span></td>
            <td><span class="consultant-name">${user?.name || 'Usuario no encontrado'}</span></td>
            <td><span class="company-name">${company ? company.name : 'Sin asignación'}</span></td>
            <td><span class="project-name">${asignacionContent}</span></td>
            <td>${tipoContent}</td>
            <td>${module ? module.name : 'Sin módulo'}</td>
            <td><span class="hours-badge">${report.hours || 0} hrs</span></td>
            <td>${window.DateUtils ? window.DateUtils.formatDate(report.createdAt) : new Date(report.createdAt).toLocaleDateString()}</td>
            <td><span class="status-badge status-pending">Pendiente</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-view" onclick="viewReport('${report.id}')" title="Ver detalles">
                        👁️ Ver
                    </button>
                    <button class="action-btn btn-approve" onclick="approveReport('${report.id}')" title="Aprobar reporte">
                        ✅ Aprobar
                    </button>
                    <button class="action-btn btn-reject" onclick="rejectReport('${report.id}')" title="Rechazar reporte">
                        ❌ Rechazar
                    </button>
                </div>
            </td>
        `;
    }
    
    return row;
}

/**
 * Modifica la función existente updateReportsList para usar el nuevo sistema
 */
function updateReportsList() {
    console.log('📊 Actualizando lista de reportes con sistema de filtros...');
    
    // Cargar datos actuales
    currentData.reports = window.PortalDB.getReports();
    
    // Aplicar filtro actual
    updateReportsListWithFilter();
}

// Inicializar filtros cuando se carga la sección
function initializeReportsFilters() {
    console.log('🎯 Inicializando filtros de reportes...');
    
    // Resetear filtro a 'all'
    currentReportFilter = 'all';
    
    // Actualizar botones
    updateCategoryFilterButtons('all');
    
    // Cargar reportes
    updateReportsList();
}

/**

 * === LÓGICA DEL PANEL DE ADMINISTRADOR REORGANIZADO ===
 * Maneja todas las funciones administrativas del portal con sidebar
 */

// Variables globales
let currentData = {
    users: {},
    companies: {},
    projects: {},
    assignments: {},
    tasks: {},
    modules: {},
    reports: {}
};

let currentSection = 'usuarios';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 === INICIANDO PANEL DE ADMINISTRADOR ===');
    
    // Verificar autenticación de administrador
    if (!window.AuthSys || !window.AuthSys.requireAdmin()) {
        console.error('❌ Fallo de autenticación');
        return;
    }

    try {
        // Inicializar en orden específico
        initializeAdminPanel();
        setupEventListeners();
        setupSidebarNavigation();
        
        // Cargar datos con delay para asegurar que el DOM esté listo
        setTimeout(() => {
            console.log('📊 Cargando datos iniciales...');
            loadAllData();
        }, 300);
        
        console.log('✅ Inicialización completada');
        
    } catch (error) {
        console.error('❌ Error durante inicialización:', error);
    }
});

console.log('✅ === ADMIN.JS CARGADO CON FUNCIONES MEJORADAS ===');

// === INICIALIZACIÓN ===
function initializeAdminPanel() {
    const currentUser = window.AuthSys.getCurrentUser();
    if (currentUser) {
        // Usar nombre fijo para el administrador
        document.getElementById('adminUserName').textContent = 'Hector Perez';
    }

    // Mostrar mensaje de bienvenida
    window.NotificationUtils.success('Bienvenido al panel de administración', 3000);
}

window.forceUpdateDropdowns = function() {
    console.log('🆘 Forzando actualización de dropdowns...');
    updateDropdowns();
};

window.debugAdmin = function() {
    console.log('🔍 Debug completo del admin...');
    debugDropdowns();
    console.log('📊 Current data:', currentData);
    console.log('📝 Current section:', currentSection);
};

function setupEventListeners() {
    // Formularios
    document.getElementById('userForm').addEventListener('submit', handleCreateUser);
    document.getElementById('companyForm').addEventListener('submit', handleCreateCompany);
    document.getElementById('projectForm').addEventListener('submit', handleCreateProject);
    document.getElementById('supportForm').addEventListener('submit', handleCreateSupport); 
    document.getElementById('moduleForm').addEventListener('submit', handleCreateModule);

    // Cerrar modales con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Auto-actualización cada 30 segundos
    setInterval(loadAllData, 30000);
}

function setupSidebarNavigation() {
    // Agregar listeners a todos los elementos del sidebar
    document.querySelectorAll('.sidebar-menu-item').forEach(item => {
        const section = item.getAttribute('data-section');
        if (section) {
            item.addEventListener('click', () => {
                showSection(section);
            });
        }
    });

        document.addEventListener('click', function(e) {
        if (e.target.closest('[data-section="generar-reporte"]')) {
            setTimeout(ensureReportSelectorInitialized, 100);
        }
    });
}

// === NAVEGACIÓN DE SECCIONES ===
function showSection(sectionName) {
    console.log(`🔄 === CAMBIANDO A SECCIÓN: ${sectionName} ===`);
    
    currentSection = sectionName;
    
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar sección seleccionada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log(`✅ Sección ${sectionName} activada`);
    } else {
        console.error(`❌ Sección ${sectionName}-section no encontrada`);
        return;
    }

    // Actualizar navegación activa en el sidebar
    updateActiveSidebarItem(sectionName);

    // Cargar datos específicos de la sección
    loadSectionData(sectionName);
    
    // CASO ESPECIAL: Crear asignación - ESPERAR ANIMACIÓN
    if (sectionName === 'crear-asignacion') {
        console.log('📝 Preparando sección crear-asignacion - ESPERANDO ANIMACIÓN...');
        
        // Esperar a que la animación CSS termine completamente
        waitForAnimationComplete(targetSection, () => {
            console.log('🎬 Animación terminada, actualizando dropdowns...');
            
            // Verificación final antes de actualizar
            const finalCheck = ['assignUser', 'assignCompany', 'assignSupport', 'assignModule'];
            const stillMissing = finalCheck.filter(id => !document.getElementById(id));
            
            if (stillMissing.length > 0) {
                console.error(`❌ Elementos aún faltantes después de animación: ${stillMissing.join(', ')}`);
            } else {
                console.log('✅ Todos los elementos verificados después de animación, actualizando...');
                updateDropdowns();
            }
        });
    }
}

function updateActiveSidebarItem(activeSection) {
    document.querySelectorAll('.sidebar-menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === activeSection) {
            item.classList.add('active');
        }
    });
}

function loadSectionData(sectionName) {
    console.log(`📊 Cargando datos para sección: ${sectionName}`);
    
    try {
        switch(sectionName) {
            case 'usuarios':
                updateUsersList();
                break;
            case 'empresas':
                updateCompaniesList();
                break;
            case 'proyectos':
                updateProjectsList();
                break;
            case 'soportes':
                updateSupportsList();
                break;
            case 'modulos':
                updateModulesList();
                break;
            case 'lista-asignaciones':

            case 'asignaciones-recientes':
                updateAssignmentsList();
                break;
            case 'reportes-pendientes':
                initializeReportsFilters();
                break;
            case 'asignar-proyectos':
                updateProjectAssignmentDropdowns();
                break;
            case 'lista-proyectos-asignados':
                updateProjectAssignmentsList();
                break;
            case 'reportes-aprobados':
                updateApprovedReportsList();
                break;
            case 'crear-asignacion':
                // No hacer nada aquí, se maneja en showSection
                console.log('📝 Sección crear-asignacion - dropdowns se actualizarán por separado');
                break;
            case 'generar-reporte':
                // Reiniciar configuración de reportes
                selectedReportType = null;
                currentReportData = [];
                tariffConfiguration = {};
                break;
            case 'historial-reportes':
                updateGeneratedReportsList();
                break;
            default:
                console.log(`⚠️ Sección ${sectionName} no tiene carga de datos específica`);
        }
    } catch (error) {
        console.error(`❌ Error cargando datos para ${sectionName}:`, error);
    }
}

// === GESTIÓN DE USUARIOS ===
function handleCreateUser(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    
    if (!name) {
        window.NotificationUtils.error('El nombre es requerido');
        return;
    }

    const userData = {
        name: name,
        email: email,
        role: 'consultor'
    };

    const result = window.PortalDB.createUser(userData);
    
    if (result.success) {
        // ✅ La contraseña ya viene generada automáticamente
        window.NotificationUtils.success(
            `Usuario creado exitosamente!\nID: ${result.user.id}\nContraseña: ${result.user.password}`,
            8000
        );
        
        showUserCredentials(result.user);
        
        closeModal('userModal');
        document.getElementById('userForm').reset();
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al crear usuario: ' + result.message);
    }
}

function showUserCredentials(user) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">✅ Usuario Creado Exitosamente</h2>
                <button class="close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="p-3">
                <div class="message message-success">
                    <strong>Credenciales del nuevo usuario:</strong>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
                    <p><strong>Nombre:</strong> ${user.name}</p>
                    <p><strong>ID de Usuario:</strong> <code style="background: #e9ecef; padding: 4px 8px; border-radius: 4px;">${user.id}</code></p>
                    <p><strong>Contraseña Única:</strong> <code style="background: #e9ecef; padding: 4px 8px; border-radius: 4px;">${user.password}</code></p>
                    ${user.email ? `<p><strong>Email:</strong> ${user.email}</p>` : ''}
                </div>
                <div class="message message-info">
                    <strong>Importante:</strong> Esta contraseña es única y se generó automáticamente.
                </div>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Entendido</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function deleteUser(userId) {
    if (!confirm('¿Está seguro de eliminar este usuario? Esta acción eliminará también todas sus asignaciones.')) {
        return;
    }

    const result = window.PortalDB.deleteUser(userId);
    
    if (result.success) {
        window.NotificationUtils.success('Usuario eliminado correctamente');
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al eliminar usuario: ' + result.message);
    }
}

// === GESTIÓN DE EMPRESAS ===
function handleCreateCompany(e) {
    e.preventDefault();
    
    const name = document.getElementById('companyName').value.trim();
    const description = document.getElementById('companyDescription').value.trim();
    
    if (!name) {
        window.NotificationUtils.error('El nombre de la empresa es requerido');
        return;
    }

    const companyData = { name: name, description: description };
    const result = window.PortalDB.createCompany(companyData);
    
    if (result.success) {
        window.NotificationUtils.success(`Empresa "${name}" registrada con ID: ${result.company.id}`);
        closeModal('companyModal');
        document.getElementById('companyForm').reset();
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al registrar empresa: ' + result.message);
    }
}

function deleteCompany(companyId) {
    if (!confirm('¿Está seguro de eliminar esta empresa? Se eliminarán también todas las asignaciones relacionadas.')) {
        return;
    }

    const result = window.PortalDB.deleteCompany(companyId);
    
    if (result.success) {
        window.NotificationUtils.success('Empresa eliminada correctamente');
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al eliminar empresa: ' + result.message);
    }
}

// === GESTIÓN DE PROYECTOS ===
function handleCreateProject(e) {
    e.preventDefault();
    
    const name = document.getElementById('projectName').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    
    if (!name) {
        window.NotificationUtils.error('El nombre del proyecto es requerido');
        return;
    }

    const projectData = { name: name, description: description};
    const result = window.PortalDB.createProject(projectData);
    
    if (result.success) {
        window.NotificationUtils.success(`Proyecto "${name}" creado con ID: ${result.project.id}`);
        closeModal('projectModal');
        document.getElementById('projectForm').reset();
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al crear proyecto: ' + result.message);
    }
}

function deleteProject(projectId) {
    if (!confirm('¿Está seguro de eliminar este proyecto? Se eliminarán también todas las asignaciones relacionadas.')) {
        return;
    }

    const result = window.PortalDB.deleteProject(projectId);
    
    if (result.success) {
        window.NotificationUtils.success('Proyecto eliminado correctamente');
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al eliminar proyecto: ' + result.message);
    }
}

// === GESTIÓN DE SOPORTES ===
function handleCreateSupport(e) {
    e.preventDefault();
    
    const name = document.getElementById('supportName').value.trim();
    const description = document.getElementById('supportDescription').value.trim();
    const priority = document.getElementById('supportPriority').value;
    const type = document.getElementById('supportType').value;
    
    if (!name) {
        window.NotificationUtils.error('El nombre del soporte es requerido');
        return;
    }

    const supportData = {
        name: name,
        description: description,
        priority: priority,
        type: type
    };

    const result = window.PortalDB.createSupport(supportData);
    
    if (result.success) {
        window.NotificationUtils.success(`Soporte "${name}" creado exitosamente`);
        closeModal('supportModal');
        document.getElementById('supportForm').reset();
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al crear soporte: ' + result.message);
    }
}

function deleteSupport(supportId) {
    if (!confirm('¿Está seguro de eliminar este soporte?')) {
        return;
    }

    const result = window.PortalDB.deleteSupport(supportId);
    
    if (result.success) {
        window.NotificationUtils.success('Soporte eliminado correctamente');
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al eliminar soporte: ' + result.message);
    }
}

function openSupportModal() {
    document.getElementById('supportName').focus();
    window.ModalUtils.open('supportModal');
}

// === GESTIÓN DE MÓDULOS ===
function handleCreateModule(e) {
    e.preventDefault();
    
    const name = document.getElementById('moduleName').value.trim();
    const description = document.getElementById('moduleDescription').value.trim();
    
    if (!name) {
        window.NotificationUtils.error('El nombre del módulo es requerido');
        return;
    }

    const moduleData = {
        name: name,
        description: description
    };

    const result = window.PortalDB.createModule(moduleData);
    
    if (result.success) {
        window.NotificationUtils.success(`Módulo "${name}" creado exitosamente`);
        closeModal('moduleModal');
        document.getElementById('moduleForm').reset();
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al crear módulo: ' + result.message);
    }
}

function deleteModule(moduleId) {
    if (!confirm('¿Está seguro de eliminar este módulo?')) {
        return;
    }

    const result = window.PortalDB.deleteModule(moduleId);
    
    if (result.success) {
        window.NotificationUtils.success('Módulo eliminado correctamente');
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al eliminar módulo: ' + result.message);
    }
}

// Nueva función para ver detalles del reporte
function viewReport(reportId) {
    const report = currentData.reports[reportId];
    if (!report) return;
    
    const user = currentData.users[report.userId];
    const assignment = Object.values(currentData.assignments).find(a => a.userId === report.userId);
    
    let assignmentInfo = 'Sin asignación';
    if (assignment) {
        const company = currentData.companies[assignment.companyId];
        const support = currentData.supports[assignment.supportId]; // Cambiar de taskId
        const module = currentData.modules[assignment.moduleId];
        
        assignmentInfo = `
            <strong>Empresa:</strong> ${company ? company.name : 'No asignada'}<br>
            <strong>Soporte:</strong> ${support ? support.name : 'No asignado'}<br>
            <strong>Tipo:</strong> ${support ? support.type : 'No especificado'}<br>
            <strong>Módulo:</strong> ${module ? module.name : 'No asignado'}
        `;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📄 Detalles del Reporte</h2>
                <button class="close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="p-3">
                <div style="margin-bottom: 20px;">
                    <h3>${report.title}</h3>
                    <p><strong>Consultor:</strong> ${user ? user.name : 'Usuario no encontrado'} (${report.userId})</p>
                    <p><strong>Estado:</strong> <span class="status-badge status-${report.status.toLowerCase()}">${report.status}</span></p>
                    <p><strong>Horas Reportadas:</strong> ${report.hours || '0'} horas</p>
                    <p><strong>Fecha de Creación:</strong> ${window.DateUtils.formatDateTime(report.createdAt)}</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4>Información de Asignación:</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        ${assignmentInfo}
                    </div>
                </div>
                
                ${report.description ? `
                    <div style="margin-bottom: 20px;">
                        <h4>Descripción del Trabajo:</h4>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            ${report.description}
                        </div>
                    </div>
                ` : ''}
                
                ${report.feedback ? `
                    <div style="margin-bottom: 20px;">
                        <h4>Comentarios de Revisión:</h4>
                        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                            ${report.feedback}
                        </div>
                    </div>
                ` : ''}
                
                <div style="text-align: center;">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// === AGREGAR ESTAS NUEVAS FUNCIONES AL FINAL DE admin.js ===
// Copiar y pegar estas funciones al final del archivo admin.js

// Nueva función para ver todas las asignaciones de un usuario
function viewUserAssignments(userId) {
    const user = currentData.users[userId];
    const userAssignments = Object.values(currentData.assignments).filter(a => 
        a.userId === userId && a.isActive
    );
    
    if (!user) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">🎯 Asignaciones de ${user.name}</h2>
                <button class="close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="p-3">
                ${userAssignments.length === 0 ? 
                    '<p>No hay asignaciones activas para este usuario</p>' : 
                    `<div class="assignments-list">
                        ${userAssignments.map(assignment => {
                            const company = currentData.companies[assignment.companyId];
                            const project = currentData.projects[assignment.projectId];
                            const task = currentData.tasks[assignment.taskId];
                            const module = currentData.modules[assignment.moduleId];
                            
                            // Calcular reportes y horas para esta asignación
                            const assignmentReports = Object.values(currentData.reports).filter(r => 
                                r.assignmentId === assignment.id || (r.userId === userId && !r.assignmentId)
                            );
                            const totalHours = assignmentReports.reduce((sum, r) => sum + (parseFloat(r.hours) || 0), 0);
                            
                            return `
                                <div class="assignment-detail-card">
                                    <div class="assignment-detail-header">
                                        <h4>🏢 ${company?.name || 'Empresa no encontrada'}</h4>
                                        <span class="assignment-id">ID: ${assignment.id.slice(-6)}</span>
                                    </div>
                                    <div class="assignment-detail-body">
                                        <p><strong>📋 Proyecto:</strong> ${project?.name || 'Proyecto no encontrado'}</p>
                                        <p><strong>✅ Tarea:</strong> ${task?.name || 'Tarea no encontrada'}</p>
                                        <p><strong>🧩 Módulo:</strong> ${module?.name || 'Módulo no encontrado'}</p>
                                        <p><strong>📊 Reportes:</strong> ${assignmentReports.length} reportes</p>
                                        <p><strong>⏰ Horas Total:</strong> <span class="total-hours-highlight">${totalHours.toFixed(1)} hrs</span></p>
                                        <p><small>📅 Asignado: ${window.DateUtils.formatDate(assignment.createdAt)}</small></p>
                                    </div>
                                    <div class="assignment-actions">
                                        <button class="btn btn-sm btn-danger" onclick="deleteAssignment('${assignment.id}'); this.closest('.modal').remove(); loadAllData();">
                                            🗑️ Eliminar Asignación
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>`
                }
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function waitForAnimationComplete(element, callback, maxWait = 2000) {
    const startTime = Date.now();
    const checkAnimation = () => {
        const styles = getComputedStyle(element);
        const opacity = parseFloat(styles.opacity);
        const display = styles.display;
        
        console.log(`🎬 Esperando animación... Opacity: ${opacity}, Display: ${display}`);
        
        // Verificar si la animación ha terminado
        if (opacity === 1 && display === 'block') {
            console.log('✅ Animación completada, ejecutando callback...');
            callback();
        } else if (Date.now() - startTime > maxWait) {
            console.warn('⚠️ Timeout esperando animación, ejecutando callback de todas formas...');
            callback();
        } else {
            // Seguir esperando
            setTimeout(checkAnimation, 50);
        }
    };
    
    checkAnimation();
}

function diagnosticAnimationState() {
    console.log('🎬 === DIAGNÓSTICO DE ESTADO DE ANIMACIÓN ===');
    
    const section = document.getElementById('crear-asignacion-section');
    if (section) {
        const styles = getComputedStyle(section);
        console.log('crear-asignacion-section:');
        console.log('  - Display:', styles.display);
        console.log('  - Visibility:', styles.visibility);
        console.log('  - Opacity:', styles.opacity);
        console.log('  - Transform:', styles.transform);
        console.log('  - Transition:', styles.transition);
        console.log('  - Animation:', styles.animation);
        
        // Verificar si hay animaciones activas
        const computedStyle = window.getComputedStyle(section);
        const animationName = computedStyle.getPropertyValue('animation-name');
        const transitionProperty = computedStyle.getPropertyValue('transition-property');
        
        if (animationName && animationName !== 'none') {
            console.log('🎬 Animación CSS activa:', animationName);
        }
        
        if (transitionProperty && transitionProperty !== 'none') {
            console.log('🎬 Transición CSS activa:', transitionProperty);
        }
    }
    
    // Verificar elementos después del diagnóstico
    const elements = ['assignUser', 'assignCompany', 'assignSupport', 'assignModule'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const elStyles = getComputedStyle(el);
            console.log(`${id}:`);
            console.log(`  - Display: ${elStyles.display}`);
            console.log(`  - Opacity: ${elStyles.opacity}`);
            console.log(`  - Pointer-events: ${elStyles.pointerEvents}`);
        }
    });
}

// Modificar la función updateDropdowns para mostrar usuarios con múltiples asignaciones
function updateDropdowns() {
    console.log('🔄 === INICIANDO updateDropdowns SIMPLIFICADO ===');
    
    // Verificar datos básicos
    if (!currentData || !currentData.users || !currentData.companies || !currentData.supports || !currentData.modules) {
        console.error('❌ Datos no disponibles');
        return;
    }
    
    // Configuración de elementos
    const elementsConfig = [
        {
            id: 'assignUser',
            defaultOption: 'Seleccionar usuario',
            data: Object.values(currentData.users).filter(user => 
                user.role === 'consultor' && user.isActive !== false
            ),
            getLabel: (user) => `${user.name} (${user.id})`
        },
        {
            id: 'assignCompany',
            defaultOption: 'Seleccionar empresa',
            data: Object.values(currentData.companies),
            getLabel: (company) => `${company.name} (${company.id})`
        },
        {
            id: 'assignSupport',
            defaultOption: 'Seleccionar Soporte',
            data: Object.values(currentData.supports),
            getLabel: (support) => `${support.name} (${support.id})`
        },
        {
            id: 'assignModule',
            defaultOption: 'Seleccionar Módulo',
            data: Object.values(currentData.modules),
            getLabel: (module) => `${module.name} (${module.id})`
        }
    ];
    
    // Actualizar cada elemento de forma muy segura
    elementsConfig.forEach(config => {
        try {
            console.log(`🔄 Actualizando ${config.id}...`);
            
            // Obtener elemento con múltiples intentos
            let element = null;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (!element && attempts < maxAttempts) {
                element = document.getElementById(config.id);
                if (!element) {
                    console.warn(`⚠️ Intento ${attempts + 1}: ${config.id} no encontrado, esperando...`);
                    attempts++;
                    // Esperar un poco antes del siguiente intento
                    if (attempts < maxAttempts) {
                        // Usar una espera síncrona corta
                        const start = Date.now();
                        while (Date.now() - start < 100) {
                            // Espera activa de 100ms
                        }
                        continue;
                    }
                }
            }
            
            if (!element) {
                console.error(`❌ ${config.id} no encontrado después de ${maxAttempts} intentos`);
                return;
            }
            
            // Verificar que sea un select válido
            if (element.tagName !== 'SELECT') {
                console.error(`❌ ${config.id} no es un elemento SELECT, es: ${element.tagName}`);
                return;
            }
            
            // Limpiar opciones de forma muy segura
            try {
                // Método alternativo más seguro que innerHTML
                element.length = 0; // Esto limpia todas las opciones
                
                // Agregar opción por defecto
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = config.defaultOption;
                element.appendChild(defaultOption);
                
            } catch (clearError) {
                console.error(`❌ Error limpiando ${config.id}:`, clearError);
                // Fallback: usar innerHTML si falla el método anterior
                try {
                    element.innerHTML = `<option value="">${config.defaultOption}</option>`;
                } catch (innerHTMLError) {
                    console.error(`❌ Error con innerHTML en ${config.id}:`, innerHTMLError);
                    return;
                }
            }
            
            // Agregar opciones de datos
            if (config.data && config.data.length > 0) {
                config.data.forEach(item => {
                    try {
                        const option = document.createElement('option');
                        option.value = item.id;
                        option.textContent = config.getLabel(item);
                        element.appendChild(option);
                    } catch (optionError) {
                        console.warn(`⚠️ Error agregando opción a ${config.id}:`, optionError);
                    }
                });
                console.log(`✅ ${config.id} actualizado con ${config.data.length} opciones`);
            } else {
                console.log(`⚠️ ${config.id} actualizado sin datos`);
            }
            
        } catch (error) {
            console.error(`❌ Error general actualizando ${config.id}:`, error);
        }
    });
    
    console.log('✅ === updateDropdowns COMPLETADO ===');
}

function createProjectAssignment() {
    const consultorId = document.getElementById('assignProjectConsultor').value;  // CAMBIO
    const projectId = document.getElementById('assignProjectProject').value;
    const companyId = document.getElementById('assignProjectCompany').value;
    const moduleId = document.getElementById('assignProjectModule').value;
    
    // Validaciones (IGUAL que createAssignment())
    if (!consultorId || !projectId || !companyId || !moduleId) {
        window.NotificationUtils.error('Todos los campos son requeridos para crear una asignación de proyecto');
        return;
    }
    
    const assignmentData = {
        consultorId: consultorId,
        projectId: projectId,
        companyId: companyId,
        moduleId: moduleId
    };
    
    const result = window.PortalDB.createProjectAssignment(assignmentData);
    
    if (result.success) {
        const consultor = currentData.users[consultorId];
        const project = currentData.projects[projectId];
        const company = currentData.companies[companyId];
        const module = currentData.modules[moduleId];
        
        window.NotificationUtils.success(
            `✅ Proyecto asignado: ${consultor.name} → "${project.name}" para ${company.name} (${module.name})`
        );
        
        // Limpiar formulario (IGUAL que createAssignment())
        document.getElementById('assignProjectConsultor').value = '';
        document.getElementById('assignProjectProject').value = '';
        document.getElementById('assignProjectCompany').value = '';
        document.getElementById('assignProjectModule').value = '';
        
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al asignar proyecto: ' + result.message);
    }
}

// Modificar la función createAssignment para permitir múltiples asignaciones
function createAssignment() {
    const userId = document.getElementById('assignUser').value;
    const companyId = document.getElementById('assignCompany').value;
    const supportId = document.getElementById('assignSupport').value; // ✅ CAMBIO: supportId en lugar de taskId
    const moduleId = document.getElementById('assignModule').value;
    
    if (!userId || !companyId || !supportId || !moduleId) {
        window.NotificationUtils.error('Todos los campos son requeridos para crear una asignación');
        return;
    }

    const assignmentData = {
        userId: userId,
        companyId: companyId,
        supportId: supportId, // ✅ CAMBIO: supportId
        moduleId: moduleId
    };

    const result = window.PortalDB.createAssignment(assignmentData);
    
    if (result.success) {
        const user = currentData.users[userId];
        const company = currentData.companies[companyId];
        const support = currentData.supports[supportId]; // ✅ CAMBIO: support
        const module = currentData.modules[moduleId];
        
        window.NotificationUtils.success(
            `✅ Nueva asignación creada: ${user.name} → ${company.name} (${support.name} - ${module.name})`
        );
        
        // Limpiar formulario
        document.getElementById('assignUser').value = '';
        document.getElementById('assignCompany').value = '';
        document.getElementById('assignSupport').value = ''; // ✅ CAMBIO
        document.getElementById('assignModule').value = '';
        
        loadAllData();
    } else {
        window.NotificationUtils.error('Error al crear asignación: ' + result.message);
    }
}

function updateUsersList() {
    const container = document.getElementById('usersList');
    if (!container) return;
    
    const users = Object.values(currentData.users);
    const consultorUsers = users.filter(user => user.role === 'consultor' && user.isActive !== false);
    
    if (consultorUsers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👤</div>
                <div class="empty-state-title">No hay usuarios</div>
                <div class="empty-state-desc">Cree el primer usuario consultor</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    consultorUsers.forEach(user => {
        // Obtener asignaciones del usuario
        const userAssignments = Object.values(currentData.assignments).filter(a => 
            a.userId === user.id && a.isActive
        );
        
        const userDiv = document.createElement('div');
        userDiv.className = 'item hover-lift';
        userDiv.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <span class="item-id">${user.id}</span>
                    <strong>${user.name}</strong>
                    ${userAssignments.length > 1 ? 
                        `<span class="custom-badge badge-info">Múltiple (${userAssignments.length})</span>` : 
                        userAssignments.length === 1 ? 
                        `<span class="custom-badge badge-success">Asignado</span>` : 
                        `<span class="custom-badge badge-warning">Sin asignar</span>`
                    }
                </div>
                <div class="user-assignment-info">
                    <small style="color: #666;">
                        📅 Registrado: ${window.DateUtils.formatDate(user.createdAt)}
                        ${user.email ? `<br>📧 ${user.email}` : ''}
                        <br>🔑 Contraseña: <strong style="color: #e74c3c;">${user.password}</strong>
                    </small>
                    ${userAssignments.length > 0 ? `
                        <div class="user-assignment-count">
                            📊 ${userAssignments.length} asignación(es) activa(s)
                        </div>
                    ` : ''}
                </div>
                ${userAssignments.length > 1 ? `
                    <button class="btn-sm btn-info" onclick="viewUserAssignments('${user.id}')" style="margin-top: 5px;">
                        👁️ Ver Asignaciones (${userAssignments.length})
                    </button>
                ` : ''}
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <button class="delete-btn" onclick="deleteUser('${user.id}')" title="Eliminar usuario">
                    🗑️
                </button>
            </div>
        `;
        container.appendChild(userDiv);
    });
}

// === FUNCIONES PARA GENERACIÓN DE REPORTES ===

window.diagnosticAnimationState = diagnosticAnimationState;
window.waitForAnimationComplete = waitForAnimationComplete;

window.forceUpdateAfterAnimation = () => {
    const section = document.getElementById('crear-asignacion-section');
    if (section) {
        waitForAnimationComplete(section, updateDropdowns);
    }
};

console.log('✅ === CORRECCIÓN DE ANIMACIÓN CSS CARGADA ===');

// === FUNCIONES PARA HISTORIAL DE REPORTES GENERADOS ===

function getDateRangeText(timeFilterId, startDateId, endDateId) {
    const timeFilter = document.getElementById(timeFilterId);
    if (!timeFilter) return 'No especificado';
    
    const today = new Date();
    
    switch(timeFilter.value) {
        case 'week':
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return `${startOfWeek.toLocaleDateString('es-ES')} - ${endOfWeek.toLocaleDateString('es-ES')}`;
            
        case 'month':
            const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
            
        case 'custom':
            const startDate = document.getElementById(startDateId);
            const endDate = document.getElementById(endDateId);
            if (startDate && endDate && startDate.value && endDate.value) {
                const customStart = new Date(startDate.value);
                const customEnd = new Date(endDate.value);
                return `${customStart.toLocaleDateString('es-ES')} - ${customEnd.toLocaleDateString('es-ES')}`;
            }
            return 'Rango personalizado';
            
        default:
            return 'Todas las fechas';
    }
}

function updateGeneratedReportsList() {
    const tableBody = document.getElementById('generatedReportsTableBody');
    const timeFilter = document.getElementById('historialTimeFilter');
    const typeFilter = document.getElementById('historialTypeFilter');
    const customDateRange = document.getElementById('historialCustomDateRange');
    const startDate = document.getElementById('historialStartDate');
    const endDate = document.getElementById('historialEndDate');
    const filterInfo = document.getElementById('historialFilterInfo');
    
    if (!tableBody) return;
    
    // Mostrar/ocultar rango personalizado
    if (timeFilter && customDateRange) {
        if (timeFilter.value === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
        }
    }
    
    const allReports = Object.values(window.PortalDB.getGeneratedReports());
    let filteredReports = allReports;
    
    // Filtrar por fecha
    if (timeFilter) {
        const now = new Date();
        let filterText = '';
        
        switch(timeFilter.value) {
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                
                filteredReports = filteredReports.filter(report => {
                    const reportDate = new Date(report.createdAt);
                    return reportDate >= startOfWeek && reportDate <= endOfWeek;
                });
                
                filterText = `Esta semana`;
                break;
                
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endOfMonth.setHours(23, 59, 59, 999);
                
                filteredReports = filteredReports.filter(report => {
                    const reportDate = new Date(report.createdAt);
                    return reportDate >= startOfMonth && reportDate <= endOfMonth;
                });
                
                const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                filterText = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
                break;
                
            case 'custom':
                if (startDate && endDate && startDate.value && endDate.value) {
                    const customStart = new Date(startDate.value);
                    customStart.setHours(0, 0, 0, 0);
                    
                    const customEnd = new Date(endDate.value);
                    customEnd.setHours(23, 59, 59, 999);
                    
                    filteredReports = filteredReports.filter(report => {
                        const reportDate = new Date(report.createdAt);
                        return reportDate >= customStart && reportDate <= customEnd;
                    });
                    
                    filterText = `${customStart.toLocaleDateString('es-ES')} - ${customEnd.toLocaleDateString('es-ES')}`;
                } else {
                    filterText = 'Rango personalizado (seleccione fechas)';
                }
                break;
                
            default: // 'all'
                filterText = 'Todos los reportes';
                break;
        }
        
        // Actualizar texto informativo
        if (filterInfo) {
            filterInfo.textContent = `Mostrando: ${filterText}`;
        }
    }
    
    // Filtrar por tipo
    if (typeFilter && typeFilter.value !== 'all') {
        filteredReports = filteredReports.filter(report => report.reportType === typeFilter.value);
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    filteredReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Generar tabla
    if (filteredReports.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-table-message">
                    <div class="empty-state">
                        <div class="empty-state-icon">📊</div>
                        <div class="empty-state-title">No hay reportes generados</div>
                        <div class="empty-state-desc">No se encontraron reportes en el período y filtros seleccionados</div>
                    </div>
                </td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = '';
        filteredReports.forEach(report => {
            const row = document.createElement('tr');
            
            // Determinar clase de descarga
            let downloadClass = 'zero';
            if (report.downloadCount > 5) downloadClass = 'high';
            else if (report.downloadCount > 0) downloadClass = '';
            
            row.innerHTML = `
                <td class="file-name-cell">${report.fileName}</td>
                <td class="report-type-cell">
                    <span class="report-type-${report.reportType}">
                        ${report.reportType === 'actividades' ? '📊 Actividades' : '💰 Pagos'}
                    </span>
                </td>
                <td class="period-cell">${report.dateRange}</td>
                <td class="records-count">${report.recordCount}</td>
                <td class="hours-total">${report.totalHours ? report.totalHours.toFixed(1) : '0'} hrs</td>
                <td class="amount-total">${report.totalAmount ? '$' + report.totalAmount.toFixed(2) : '-'}</td>
                <td>${window.DateUtils.formatDateTime(report.createdAt)}</td>
                <td>
                    <span class="download-count ${downloadClass}">${report.downloadCount}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-delete-report" onclick="deleteGeneratedReportFromHistory('${report.id}')" title="Eliminar del historial">
                            🗑️ Eliminar
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Actualizar estadísticas
    updateGeneratedReportsStats(allReports);
}

function updateGeneratedReportsStats(reports = null) {
    if (!reports) {
        reports = Object.values(window.PortalDB.getGeneratedReports());
    }
    
    const actividadReports = reports.filter(r => r.reportType === 'actividades');
    const pagoReports = reports.filter(r => r.reportType === 'pagos');
    const totalDownloads = reports.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
    
    // Actualizar elementos del DOM
    const totalElement = document.getElementById('totalGeneratedReports');
    const actividadElement = document.getElementById('totalActividadReports');
    const pagoElement = document.getElementById('totalPagoReports');
    const downloadsElement = document.getElementById('totalDownloads');
    
    if (totalElement) totalElement.textContent = reports.length;
    if (actividadElement) actividadElement.textContent = actividadReports.length;
    if (pagoElement) pagoElement.textContent = pagoReports.length;
    if (downloadsElement) downloadsElement.textContent = totalDownloads;
}

function refreshGeneratedReportsList() {
    updateGeneratedReportsList();
    window.NotificationUtils.info('Lista actualizada');
}

function deleteGeneratedReportFromHistory(reportId) {
    if (!confirm('¿Está seguro de eliminar este reporte del historial? Esta acción no eliminará el archivo descargado.')) {
        return;
    }
    
    const result = window.PortalDB.deleteGeneratedReport(reportId);
    if (result.success) {
        window.NotificationUtils.success('Reporte eliminado del historial');
        updateGeneratedReportsList();
        updateSidebarCounts();
    } else {
        window.NotificationUtils.error('Error: ' + result.message);
    }
}

// === NUEVO SISTEMA DE REPORTES ARVIC ===

/**
 * Inicializar el selector de reportes dinámico
 */
function initializeReportSelector() {
    console.log('🚀 Inicializando selector de reportes ARVIC...');
    
    const reportGrid = document.getElementById('reportGrid');
    if (!reportGrid) {
        console.error('❌ No se encontró el elemento reportGrid');
        return;
    }
    
    reportGrid.innerHTML = '';
    
    Object.entries(ARVIC_REPORTS).forEach(([key, report]) => {
        const reportOption = document.createElement('div');
        reportOption.className = 'report-option';
        reportOption.dataset.report = key;
        reportOption.innerHTML = `
            <div class="report-icon">${report.icon}</div>
            <div class="report-name">${report.name}</div>
            <div class="report-description">${report.description}</div>
            <div class="report-audience">${report.audience}</div>
        `;
        
        reportOption.addEventListener('click', () => selectNewReportType(key));
        reportGrid.appendChild(reportOption);
    });
    
    console.log('✅ Selector de reportes inicializado con', Object.keys(ARVIC_REPORTS).length, 'reportes');
}

/**
 * Seleccionar tipo de reporte nuevo
 */
function selectNewReportType(reportType) {
    console.log('📋 Seleccionando reporte:', reportType);
    
    // 1. Ocultar paneles anteriores
    const configPanel = document.getElementById('reportConfigPanel');
    const previewPanel = document.getElementById('reportPreviewPanel');
    
    if (configPanel) configPanel.style.display = 'none';
    if (previewPanel) previewPanel.style.display = 'none';
    
    // 2. Limpiar datos anteriores
    currentReportData = null;
    currentReportConfig = null;
    editablePreviewData = {};
    
    // 3. Actualizar selector visual
    document.querySelectorAll('.report-option').forEach(option => {
        option.classList.remove('active');
    });
    
    const selectedOption = document.querySelector(`[data-report="${reportType}"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
    }
    
    // 4. Generar configuración específica
    generateReportConfiguration(reportType);
    
    // 5. Actualizar variable global
    currentReportType = reportType;
    
    console.log('✅ Reporte seleccionado:', ARVIC_REPORTS[reportType].name);
}

/**
 * Generar configuración específica según el tipo de reporte
 */
function generateReportConfiguration(reportType) {
    const report = ARVIC_REPORTS[reportType];
    const configPanel = document.getElementById('reportConfigPanel');
    
    if (!configPanel || !report) return;
    
    console.log('🔧 Generando configuración para:', report.name);
    
    // Generar filtros según el tipo de reporte
    let filtersHTML = '';
    
    // Filtro de tiempo (común para la mayoría)
    if (report.filters.includes('time')) {
        filtersHTML += `
            <div class="form-group">
                <label for="timeFilter">🕐 Período de Tiempo:</label>
                <select id="timeFilter" onchange="handleTimeFilterChange()">
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mes</option>
                    <option value="custom">Rango Personalizado</option>
                    <option value="all">Todas las Fechas</option>
                </select>
            </div>
        `;
    }
    
    // Filtro por consultor específico
    if (report.filters.includes('consultant')) {
        filtersHTML += `
            <div class="form-group">
                <label for="consultantFilter">👤 Seleccionar Consultor: <span style="color: red;">*</span></label>
                <select id="consultantFilter" required onchange="validateRequiredFilters()">
                    <option value="">Seleccionar consultor...</option>
                </select>
            </div>
        `;
    }
    
    // Filtro por cliente específico
    if (report.filters.includes('client')) {
        filtersHTML += `
            <div class="form-group">
                <label for="clientFilter">🏢 Seleccionar Cliente: <span style="color: red;">*</span></label>
                <select id="clientFilter" required onchange="validateRequiredFilters()">
                    <option value="">Seleccionar cliente...</option>
                </select>
            </div>
        `;
    }
    
    // Filtro por soporte
    if (report.filters.includes('support')) {
        filtersHTML += `
            <div class="form-group">
                <label for="supportFilter">📞 Filtrar por Soporte:</label>
                <select id="supportFilter">
                    <option value="all">Todos los Soportes</option>
                </select>
            </div>
        `;
    }
    
    // Filtro por proyecto
    if (report.filters.includes('project')) {
        filtersHTML += `
            <div class="form-group">
                <label for="projectFilter">📋 Filtrar por Proyecto:</label>
                <select id="projectFilter">
                    <option value="all">Todos los Proyectos</option>
                </select>
            </div>
        `;
    }
    
    // Filtros especiales para Reporte Remanente
    if (reportType === 'remanente') {
        filtersHTML += `
            <div class="form-group">
                <label for="supportTypeFilter">📞 Tipo de Soporte: <span style="color: red;">*</span></label>
                <select id="supportTypeFilter" required onchange="validateRequiredFilters()">
                    <option value="">Seleccionar tipo de soporte...</option>
                </select>
            </div>
            <div class="form-group">
                <label for="monthFilter">📅 Mes de Análisis: <span style="color: red;">*</span></label>
                <select id="monthFilter" required onchange="validateRequiredFilters()">
                    <option value="">Seleccionar mes...</option>
                </select>
            </div>
        `;
    }
    
    // Rango de fechas personalizado (común)
    let customDateRangeHTML = '';
    if (report.filters.includes('time')) {
        customDateRangeHTML = `
            <div class="form-row" id="customDateRange" style="display: none;">
                <div class="form-group">
                    <label for="startDate">📅 Fecha Inicio:</label>
                    <input type="date" id="startDate">
                </div>
                <div class="form-group">
                    <label for="endDate">📅 Fecha Fin:</label>
                    <input type="date" id="endDate">
                </div>
            </div>
        `;
    }
    
    // Generar HTML completo
    configPanel.innerHTML = `
        <div class="config-header">
            <div class="config-title">${report.icon} ${report.name}</div>
            <div class="config-subtitle">${report.description}</div>
        </div>

        <div class="warning-message">
            <strong>📋 Estructura del Reporte:</strong> ${report.structure.join(' | ')}<br>
            <strong>✏️ Campos Editables:</strong> ${report.editableFields.join(', ')} (modificables en vista previa)
        </div>

        <div class="config-form">
            <div class="form-row">
                ${filtersHTML}
            </div>
            ${customDateRangeHTML}
            
            <div class="actions-row">
                <button class="btn btn-secondary" onclick="resetReportFilters()">
                    🔄 Limpiar Filtros
                </button>
                <button class="btn btn-primary" onclick="generateReportPreview()" id="previewBtn" disabled>
                    👁️ Vista Previa
                </button>
                <button class="btn btn-primary" onclick="generateFinalReport()" id="generateBtn" disabled>
                    📊 Generar Excel
                </button>
            </div>
        </div>
    `;
    
    configPanel.style.display = 'block';
    
    // Poblar dropdowns con datos
    populateFilterDropdowns(reportType);
    
    // Validar filtros iniciales
    setTimeout(validateRequiredFilters, 100);
}

/**
 * Poblar dropdowns con datos del sistema
 */
function populateFilterDropdowns(reportType) {
    console.log('📊 Poblando filtros para:', reportType);
    
    // Poblar consultor
    const consultantFilter = document.getElementById('consultantFilter');
    if (consultantFilter && currentData.users) {
        consultantFilter.innerHTML = '<option value="">Seleccionar consultor...</option>';
        Object.values(currentData.users).forEach(user => {
            if (user.role === 'consultor' && user.isActive !== false) {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.name} (${user.id})`;
                consultantFilter.appendChild(option);
            }
        });
    }
    
    // Poblar cliente
    const clientFilter = document.getElementById('clientFilter');
    if (clientFilter && currentData.companies) {
        clientFilter.innerHTML = '<option value="">Seleccionar cliente...</option>';
        Object.values(currentData.companies).forEach(company => {
            const option = document.createElement('option');
            option.value = company.id;
            option.textContent = `${company.name} (${company.id})`;
            clientFilter.appendChild(option);
        });
    }
    
    // Poblar soporte
    const supportFilter = document.getElementById('supportFilter');
    if (supportFilter && currentData.supports) {
        supportFilter.innerHTML = '<option value="all">Todos los Soportes</option>';
        Object.values(currentData.supports).forEach(support => {
            const option = document.createElement('option');
            option.value = support.id;
            option.textContent = `${support.name} (${support.type || 'N/A'})`;
            supportFilter.appendChild(option);
        });
    }
    
    // Poblar proyecto
    const projectFilter = document.getElementById('projectFilter');
    if (projectFilter && currentData.projects) {
        projectFilter.innerHTML = '<option value="all">Todos los Proyectos</option>';
        Object.values(currentData.projects).forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            projectFilter.appendChild(option);
        });
    }
    
    // Poblar tipo de soporte (para remanente)
    const supportTypeFilter = document.getElementById('supportTypeFilter');
    if (supportTypeFilter && currentData.supports) {
        supportTypeFilter.innerHTML = '<option value="">Seleccionar tipo de soporte...</option>';
        const supportTypes = [...new Set(Object.values(currentData.supports).map(s => s.type).filter(Boolean))];
        supportTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            supportTypeFilter.appendChild(option);
        });
    }
    
    // Poblar meses (para remanente)
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter) {
        monthFilter.innerHTML = '<option value="">Seleccionar mes...</option>';
        const currentDate = new Date();
        
        // Últimos 12 meses
        for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
            const option = document.createElement('option');
            option.value = monthKey;
            option.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            monthFilter.appendChild(option);
        }
    }
}

/**
 * Validar filtros requeridos y habilitar/deshabilitar botones
 */
function validateRequiredFilters() {
    const report = ARVIC_REPORTS[currentReportType];
    if (!report) return;
    
    let isValid = true;
    let missingFields = [];
    
    // Validar consultor requerido
    if (report.filters.includes('consultant')) {
        const consultantFilter = document.getElementById('consultantFilter');
        if (!consultantFilter?.value) {
            isValid = false;
            missingFields.push('Consultor');
        }
    }
    
    // Validar cliente requerido
    if (report.filters.includes('client')) {
        const clientFilter = document.getElementById('clientFilter');
        if (!clientFilter?.value) {
            isValid = false;
            missingFields.push('Cliente');
        }
    }
    
    // Validaciones especiales para remanente
    if (currentReportType === 'remanente') {
        const supportTypeFilter = document.getElementById('supportTypeFilter');
        const monthFilter = document.getElementById('monthFilter');
        
        if (!supportTypeFilter?.value) {
            isValid = false;
            missingFields.push('Tipo de Soporte');
        }
        if (!monthFilter?.value) {
            isValid = false;
            missingFields.push('Mes');
        }
    }
    
    // Actualizar estado de botones
    const previewBtn = document.getElementById('previewBtn');
    const generateBtn = document.getElementById('generateBtn');
    
    if (previewBtn) {
        previewBtn.disabled = !isValid;
        previewBtn.title = isValid ? 'Generar vista previa' : `Faltan campos: ${missingFields.join(', ')}`;
    }
    
    if (generateBtn) {
        generateBtn.disabled = true; // Solo se habilita después de vista previa
    }
    
    console.log('🔍 Validación de filtros:', isValid ? '✅ Válido' : `❌ Faltan: ${missingFields.join(', ')}`);
}

/**
 * Manejar cambio en filtro de tiempo
 */
function handleTimeFilterChange() {
    const timeFilter = document.getElementById('timeFilter');
    const customDateRange = document.getElementById('customDateRange');
    
    if (timeFilter && customDateRange) {
        customDateRange.style.display = timeFilter.value === 'custom' ? 'flex' : 'none';
    }
}

/**
 * Resetear todos los filtros del reporte actual
 */
function resetReportFilters() {
    console.log('🔄 Reseteando filtros...');
    
    // Resetear todos los selects y inputs
    const configPanel = document.getElementById('reportConfigPanel');
    if (configPanel) {
        const selects = configPanel.querySelectorAll('select');
        const inputs = configPanel.querySelectorAll('input[type="date"]');
        
        selects.forEach(select => {
            if (select.id === 'timeFilter') {
                select.value = 'week';
            } else if (select.options[0]) {
                select.selectedIndex = 0;
            }
        });
        
        inputs.forEach(input => {
            input.value = '';
        });
    }
    
    // Ocultar rango personalizado
    const customDateRange = document.getElementById('customDateRange');
    if (customDateRange) {
        customDateRange.style.display = 'none';
    }
    
    // Revalidar
    validateRequiredFilters();
    
    window.NotificationUtils.info('Filtros restablecidos');
}

/**
 * Generar vista previa con datos reales y tabla editable
 */
function generateReportPreview() {
    console.log('👁️ Generando vista previa para:', currentReportType);
    
    const report = ARVIC_REPORTS[currentReportType];
    const previewPanel = document.getElementById('reportPreviewPanel');
    
    if (!previewPanel || !report) {
        console.error('❌ Panel de vista previa o configuración no encontrada');
        return;
    }
    
    try {
        // 1. Obtener datos según filtros
        const rawData = getReportDataByType(currentReportType);
        
        if (!rawData || rawData.length === 0) {
            showEmptyPreview(previewPanel, report);
            return;
        }
        
        // 2. Procesar datos según estructura del reporte
        currentReportData = processDataForReport(rawData, currentReportType);
        
        // 3. Inicializar datos editables
        initializeEditableData();
        
        // 4. Generar tabla editable
        generateEditableTable(previewPanel, report);
        
        // 5. Mostrar panel y habilitar generación
        previewPanel.style.display = 'block';
        previewPanel.scrollIntoView({ behavior: 'smooth' });
        
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.disabled = false;
        }
        
        window.NotificationUtils.success(`Vista previa generada: ${currentReportData.length} registros`);
        
    } catch (error) {
        console.error('❌ Error generando vista previa:', error);
        window.NotificationUtils.error('Error al generar vista previa: ' + error.message);
    }
}

/**
 * Obtener datos según el tipo de reporte y filtros aplicados
 */
function getReportDataByType(reportType) {
    console.log('📊 Obteniendo datos para:', reportType);
    
    // Obtener reportes aprobados
    const allReports = Object.values(currentData.reports || {});
    let approvedReports = allReports.filter(r => r.status === 'Aprobado');
    
    // Aplicar filtro de tiempo
    approvedReports = applyTimeFilter(approvedReports);
    
    switch (reportType) {
        case 'pago-consultor-general':
            return getSoporteData(approvedReports, 'all', 'all');
            
        case 'pago-consultor-especifico':
            const consultantId = document.getElementById('consultantFilter')?.value;
            const supportId = document.getElementById('supportFilter')?.value || 'all';
            return getSoporteData(approvedReports, consultantId, supportId);
            
        case 'cliente-soporte':
            const clientId = document.getElementById('clientFilter')?.value;
            const clientSupportId = document.getElementById('supportFilter')?.value || 'all';
            return getClientSoporteData(approvedReports, clientId, clientSupportId);
            
        case 'remanente':
            const remanenteClientId = document.getElementById('clientFilter')?.value;
            const supportType = document.getElementById('supportTypeFilter')?.value;
            const month = document.getElementById('monthFilter')?.value;
            return getRemanenteData(approvedReports, remanenteClientId, supportType, month);
            
        case 'proyecto-general':
            return getProyectoData(approvedReports, 'all', 'all');
            
        case 'proyecto-cliente':
            const proyectoClientId = document.getElementById('clientFilter')?.value;
            const projectId = document.getElementById('projectFilter')?.value || 'all';
            return getClientProyectoData(approvedReports, proyectoClientId, projectId);
            
        case 'proyecto-consultor':
            const proyectoConsultantId = document.getElementById('consultantFilter')?.value;
            const consultantProjectId = document.getElementById('projectFilter')?.value || 'all';
            return getConsultantProyectoData(approvedReports, proyectoConsultantId, consultantProjectId);
            
        default:
            console.error('❌ Tipo de reporte no reconocido:', reportType);
            return [];
    }
}

/**
 * Aplicar filtro de tiempo a los reportes
 */
function applyTimeFilter(reports) {
    const timeFilter = document.getElementById('timeFilter');
    if (!timeFilter) return reports;
    
    const now = new Date();
    const timeValue = timeFilter.value;
    
    switch (timeValue) {
        case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return reports.filter(r => new Date(r.createdAt) >= weekAgo);
            
        case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return reports.filter(r => new Date(r.createdAt) >= monthAgo);
            
        case 'custom':
            const startDate = document.getElementById('startDate')?.value;
            const endDate = document.getElementById('endDate')?.value;
            
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Incluir todo el día final
                
                return reports.filter(r => {
                    const reportDate = new Date(r.createdAt);
                    return reportDate >= start && reportDate <= end;
                });
            }
            return reports;
            
        case 'all':
        default:
            return reports;
    }
}

/**
 * Obtener datos de soporte
 */
function getSoporteData(reports, consultantId, supportId) {
    const soporteData = [];
    
    reports.forEach(report => {
        // Filtrar por consultor si especificado
        if (consultantId !== 'all' && report.userId !== consultantId) return;
        
        const user = currentData.users[report.userId];
        if (!user) return;
        
        // Buscar asignación de soporte
        let assignment = null;
        if (report.assignmentId) {
            assignment = currentData.assignments[report.assignmentId];
        } else {
            assignment = Object.values(currentData.assignments || {}).find(a => 
                a.userId === report.userId && a.isActive && a.supportId
            );
        }
        
        if (!assignment || !assignment.supportId) return;
        
        // Filtrar por soporte si especificado
        if (supportId !== 'all' && assignment.supportId !== supportId) return;
        
        const company = currentData.companies[assignment.companyId];
        const support = currentData.supports[assignment.supportId];
        const module = currentData.modules[assignment.moduleId];
        
        soporteData.push({
            reportId: report.id,
            idEmpresa: assignment.companyId,
            consultor: user.name,
            soporte: support?.name || 'Sin soporte',
            modulo: module?.name || 'Sin módulo',
            tiempo: parseFloat(report.hours || 0),
            tarifaModulo: 500, // Tarifa por defecto
            total: parseFloat(report.hours || 0) * 500,
            originalTime: parseFloat(report.hours || 0)
        });
    });
    
    return soporteData;
}

/**
 * Obtener datos de soporte para cliente específico
 */
function getClientSoporteData(reports, clientId, supportId) {
    const clientData = [];
    
    reports.forEach(report => {
        let assignment = null;
        if (report.assignmentId) {
            assignment = currentData.assignments[report.assignmentId];
        } else {
            assignment = Object.values(currentData.assignments || {}).find(a => 
                a.userId === report.userId && a.isActive && a.supportId
            );
        }
        
        if (!assignment || assignment.companyId !== clientId || !assignment.supportId) return;
        
        // Filtrar por soporte si especificado
        if (supportId !== 'all' && assignment.supportId !== supportId) return;
        
        const support = currentData.supports[assignment.supportId];
        const module = currentData.modules[assignment.moduleId];
        
        clientData.push({
            reportId: report.id,
            soporte: support?.name || 'Sin soporte',
            modulo: module?.name || 'Sin módulo',
            tiempo: parseFloat(report.hours || 0),
            tarifaModulo: 500,
            total: parseFloat(report.hours || 0) * 500,
            originalTime: parseFloat(report.hours || 0)
        });
    });
    
    return clientData;
}

/**
 * Calcular distribución de semanas según días del mes (según documentación oficial)
 */
function calculateMonthWeekDistribution(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    
    console.log(`📅 Calculando distribución para ${year}-${month}: ${daysInMonth} días`);
    
    let weekStructure;
    
    switch (daysInMonth) {
        case 28:
            weekStructure = {
                totalWeeks: 4,
                distribution: [7, 7, 7, 7], // 4 semanas exactas
                description: '4 semanas exactas (7 días cada una)'
            };
            break;
        case 29:
            weekStructure = {
                totalWeeks: 5,
                distribution: [7, 7, 7, 7, 1], // 4 semanas completas + 1 día
                description: '4 semanas completas + 1 día en quinta semana'
            };
            break;
        case 30:
            weekStructure = {
                totalWeeks: 5,
                distribution: [7, 7, 7, 7, 2], // 4 semanas completas + 2 días
                description: '4 semanas completas + 2 días en quinta semana'
            };
            break;
        case 31:
            weekStructure = {
                totalWeeks: 5,
                distribution: [7, 7, 7, 7, 3], // 4 semanas completas + 3 días
                description: '4 semanas completas + 3 días en quinta semana'
            };
            break;
        default:
            // Fallback para casos excepcionales
            weekStructure = {
                totalWeeks: 4,
                distribution: [7, 7, 7, 7],
                description: 'Distribución por defecto (4 semanas)'
            };
    }
    
    console.log(`✅ ${weekStructure.description}`);
    return weekStructure;
}

/**
 * Determinar a qué semana pertenece un día específico del mes
 */
function getDayWeekNumber(day, weekDistribution) {
    let currentDay = 1;
    
    for (let week = 0; week < weekDistribution.length; week++) {
        const weekDays = weekDistribution[week];
        
        if (day >= currentDay && day < currentDay + weekDays) {
            return week + 1; // Retornar 1-based (semana 1, 2, 3, etc.)
        }
        
        currentDay += weekDays;
    }
    
    // Fallback: si algo sale mal, asignar a última semana
    return weekDistribution.length;
}


/**
 * Obtener datos para reporte remanente (estructura especial por semanas) - VERSIÓN CORREGIDA
 */
function getRemanenteData(reports, clientId, supportType, monthKey) {
    console.log('📊 Generando reporte remanente con lógica de semanas corregida');
    
    const [year, month] = monthKey.split('-').map(Number);
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);
    
    // ✅ NUEVO: Calcular distribución correcta de semanas
    const weekStructure = calculateMonthWeekDistribution(year, month);
    console.log(`📅 Estructura del mes: ${weekStructure.totalWeeks} semanas`);
    
    // Filtrar reportes del mes y cliente específicos
    const monthReports = reports.filter(report => {
        const reportDate = new Date(report.createdAt);
        
        // Buscar asignación correspondiente
        let assignment = null;
        if (report.assignmentId) {
            assignment = currentData.assignments[report.assignmentId];
        } else {
            assignment = Object.values(currentData.assignments || {}).find(a => 
                a.userId === report.userId && a.isActive
            );
        }
        
        if (!assignment || assignment.companyId !== clientId) return false;
        
        // Verificar tipo de soporte
        const support = currentData.supports[assignment.supportId];
        if (!support || support.type !== supportType) return false;
        
        return reportDate >= monthStart && reportDate <= monthEnd;
    });
    
    console.log(`📋 ${monthReports.length} reportes encontrados para el período`);
    
    // Agrupar por módulo y distribuir por semanas dinámicamente
    const moduleData = {};
    
    monthReports.forEach(report => {
        let assignment = currentData.assignments[report.assignmentId];
        if (!assignment) {
            assignment = Object.values(currentData.assignments || {}).find(a => 
                a.userId === report.userId && a.isActive
            );
        }
        
        const module = currentData.modules[assignment?.moduleId];
        const moduleName = module?.name || 'Sin módulo';
        
        // ✅ NUEVO: Inicializar estructura dinámica de semanas
        if (!moduleData[moduleName]) {
            moduleData[moduleName] = {
                modulo: moduleName,
                totalHoras: 0,
                monthStructure: weekStructure
            };
            
            // Crear semanas dinámicamente
            for (let i = 1; i <= weekStructure.totalWeeks; i++) {
                moduleData[moduleName][`semana${i}`] = {
                    tiempo: 0,
                    tarifa: 550,
                    total: 0
                };
            }
        }
        
        // ✅ NUEVO: Calcular semana correcta según distribución
        const reportDay = new Date(report.createdAt).getDate();
        const correctWeekNum = getDayWeekNumber(reportDay, weekStructure.distribution);
        const semanaKey = `semana${correctWeekNum}`;
        
        console.log(`📅 Día ${reportDay} → ${semanaKey}`);
        
        const hours = parseFloat(report.hours || 0);
        
        if (moduleData[moduleName][semanaKey]) {
            moduleData[moduleName][semanaKey].tiempo += hours;
            moduleData[moduleName][semanaKey].total = 
                moduleData[moduleName][semanaKey].tiempo * moduleData[moduleName][semanaKey].tarifa;
            moduleData[moduleName].totalHoras += hours;
        }
    });
    
    console.log(`✅ Datos procesados para ${Object.keys(moduleData).length} módulos`);
    return Object.values(moduleData);
}
/**
 * Obtener datos de proyecto
 */
function getProyectoData(reports, consultantId, projectId) {
    const proyectoData = [];
    
    reports.forEach(report => {
        // Filtrar por consultor si especificado
        if (consultantId !== 'all' && report.userId !== consultantId) return;
        
        const user = currentData.users[report.userId];
        if (!user) return;
        
        // Buscar asignación de proyecto
        let projectAssignment = null;
        if (report.assignmentId) {
            projectAssignment = (currentData.projectAssignments || {})[report.assignmentId];
        }
        
        if (!projectAssignment) return;
        
        // Filtrar por proyecto si especificado
        if (projectId !== 'all' && projectAssignment.projectId !== projectId) return;
        
        const company = currentData.companies[projectAssignment.companyId];
        const module = currentData.modules[projectAssignment.moduleId];
        
        proyectoData.push({
            reportId: report.id,
            idEmpresa: projectAssignment.companyId,
            consultor: user.name,
            modulo: module?.name || 'Sin módulo',
            tiempo: parseFloat(report.hours || 0),
            tarifaModulo: 600, // Tarifa diferente para proyectos
            total: parseFloat(report.hours || 0) * 600,
            originalTime: parseFloat(report.hours || 0)
        });
    });
    
    return proyectoData;
}

/**
 * Funciones adicionales para proyecto-cliente y proyecto-consultor
 */
function getClientProyectoData(reports, clientId, projectId) {
    const clientData = [];
    
    reports.forEach(report => {
        let projectAssignment = (currentData.projectAssignments || {})[report.assignmentId];
        
        if (!projectAssignment || projectAssignment.companyId !== clientId) return;
        if (projectId !== 'all' && projectAssignment.projectId !== projectId) return;
        
        const module = currentData.modules[projectAssignment.moduleId];
        
        clientData.push({
            reportId: report.id,
            modulo: module?.name || 'Sin módulo',
            tiempo: parseFloat(report.hours || 0),
            tarifaModulo: 600,
            total: parseFloat(report.hours || 0) * 600,
            originalTime: parseFloat(report.hours || 0)
        });
    });
    
    return clientData;
}

function getConsultantProyectoData(reports, consultantId, projectId) {
    const consultantData = [];
    
    reports.forEach(report => {
        if (report.userId !== consultantId) return;
        
        let projectAssignment = (currentData.projectAssignments || {})[report.assignmentId];
        if (!projectAssignment) return;
        if (projectId !== 'all' && projectAssignment.projectId !== projectId) return;
        
        const company = currentData.companies[projectAssignment.companyId];
        const module = currentData.modules[projectAssignment.moduleId];
        
        consultantData.push({
            reportId: report.id,
            idEmpresa: projectAssignment.companyId,
            consultor: currentData.users[consultantId]?.name || 'Consultor',
            modulo: module?.name || 'Sin módulo',
            tiempo: parseFloat(report.hours || 0),
            tarifaModulo: 600,
            total: parseFloat(report.hours || 0) * 600,
            originalTime: parseFloat(report.hours || 0)
        });
    });
    
    return consultantData;
}

/**
 * Procesar datos según estructura específica del reporte
 */
function processDataForReport(rawData, reportType) {
    console.log('🔧 Procesando', rawData.length, 'registros para', reportType);
    
    // Los datos ya vienen en el formato correcto desde las funciones get*Data
    return rawData;
}

/**
 * Inicializar datos editables
 */
function initializeEditableData() {
    editablePreviewData = {};
    
    currentReportData.forEach((row, index) => {
        editablePreviewData[index] = {
            ...row,
            editedTime: row.tiempo,
            editedTariff: row.tarifaModulo,
            editedTotal: row.total
        };
    });
    
    console.log('✅ Datos editables inicializados:', Object.keys(editablePreviewData).length, 'registros');
}

/**
 * Mostrar vista previa vacía
 */
function showEmptyPreview(previewPanel, report) {
    previewPanel.innerHTML = `
        <div class="preview-header">
            <div class="preview-title">👁️ Vista Previa - ${report.name}</div>
            <div class="preview-info">Sin datos</div>
        </div>
        <div class="empty-preview">
            <div class="empty-preview-icon">📊</div>
            <div><strong>No hay datos disponibles</strong></div>
            <div>Verifique los filtros aplicados o el período seleccionado</div>
        </div>
    `;
    
    previewPanel.style.display = 'block';
    window.NotificationUtils.warning('No se encontraron datos para los filtros aplicados');
}

/**
 * Generar tabla editable
 */
function generateEditableTable(previewPanel, report) {
    const totalHours = currentReportData.reduce((sum, row) => sum + row.tiempo, 0);
    const totalAmount = Object.values(editablePreviewData).reduce((sum, row) => sum + row.editedTotal, 0);
    
    let tableHTML = '';
    
    if (currentReportType === 'remanente') {
        tableHTML = generateRemanenteTable();
    } else {
        tableHTML = generateStandardTable(report);
    }
    
    previewPanel.innerHTML = `
        <div class="preview-header">
            <div class="preview-title">👁️ Vista Previa - ${report.name}</div>
            <div class="preview-info">
                ${currentReportData.length} registros | 
                ${totalHours.toFixed(1)} horas | 
                $${totalAmount.toLocaleString('es-MX', {minimumFractionDigits: 2})}
            </div>
        </div>

        <div class="warning-message">
            <strong>✏️ Vista Previa Editable:</strong> Haga clic en las celdas amarillas para modificar TIEMPO y TARIFA. 
            Los totales se recalculan automáticamente. <br>
            <strong>📋 Estructura:</strong> ${report.structure.join(' | ')}
        </div>

        ${tableHTML}

        <div class="actions-row">
            <button class="btn btn-secondary" onclick="restoreOriginalValues()">
                ↩️ Restaurar Valores Originales
            </button>
            <button class="btn btn-primary" onclick="generateFinalReport()">
                📊 Generar Reporte Excel Final
            </button>
        </div>
    `;
}

/**
 * Generar tabla estándar
 */
function generateStandardTable(report) {
    let tableHTML = '<table class="preview-table"><thead><tr>';
    
    // Generar headers según estructura del reporte
    report.structure.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    
    tableHTML += '</tr></thead><tbody>';
    
    // Generar filas
    Object.entries(editablePreviewData).forEach(([index, row]) => {
        tableHTML += '<tr>';
        
        report.structure.forEach(header => {
            let cellContent = '';
            let isEditable = report.editableFields.includes(header);
            
            switch (header) {
                case 'ID Empresa':
                    cellContent = row.idEmpresa || 'N/A';
                    break;
                case 'Consultor':
                    cellContent = row.consultor || 'N/A';
                    break;
                case 'Soporte':
                    cellContent = row.soporte || 'N/A';
                    break;
                case 'Modulo':
                    cellContent = row.modulo || 'N/A';
                    break;
                case 'TIEMPO':
                    cellContent = `<input type="number" class="editable-input" value="${row.editedTime}" 
                                         step="0.1" min="0" max="24" 
                                         onchange="updateRowCalculation(${index}, 'time', this.value)">`;
                    break;
                case 'TARIFA de Modulo':
                    cellContent = `<input type="number" class="editable-input" value="${row.editedTariff}" 
                                         step="50" min="100" max="2000" 
                                         onchange="updateRowCalculation(${index}, 'tariff', this.value)">`;
                    break;
                case 'TOTAL':
                    cellContent = `<strong>$${row.editedTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</strong>`;
                    break;
                default:
                    cellContent = 'N/A';
            }
            
            const cellClass = isEditable ? 'editable-cell' : '';
            tableHTML += `<td class="${cellClass}">${cellContent}</td>`;
        });
        
        tableHTML += '</tr>';
    });
    
    // Fila de totales
    const totalHours = Object.values(editablePreviewData).reduce((sum, row) => sum + row.editedTime, 0);
    const totalAmount = Object.values(editablePreviewData).reduce((sum, row) => sum + row.editedTotal, 0);
    
    tableHTML += '<tr style="background: #f1f5f9; font-weight: bold;">';
    report.structure.forEach((header, index) => {
        if (index === 0) {
            tableHTML += '<td>TOTALES</td>';
        } else if (header === 'TIEMPO') {
            tableHTML += `<td>${totalHours.toFixed(1)} hrs</td>`;
        } else if (header === 'TOTAL') {
            tableHTML += `<td>$${totalAmount.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>`;
        } else {
            tableHTML += '<td>-</td>';
        }
    });
    tableHTML += '</tr>';
    
    tableHTML += '</tbody></table>';
    return tableHTML;
}

/**
 * Generar tabla para reporte remanente (estructura dinámica por semanas) - VERSIÓN CORREGIDA
 */
function generateRemanenteTable() {
    console.log('📊 Generando tabla remanente con semanas dinámicas');
    
    // Obtener estructura de semanas del primer módulo (todos tienen la misma)
    const firstModule = Object.values(editablePreviewData)[0];
    if (!firstModule || !firstModule.monthStructure) {
        console.error('❌ No se encontró estructura de semanas');
        return '<p>Error: No se pudo determinar la estructura del mes</p>';
    }
    
    const weekStructure = firstModule.monthStructure;
    console.log(`📅 Generando tabla para ${weekStructure.totalWeeks} semanas`);
    
    let tableHTML = `
        <div style="margin-bottom: 1rem; padding: 1rem; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <strong>📅 Distribución del Mes:</strong> ${weekStructure.description}<br>
            <strong>🔢 Total de Semanas:</strong> ${weekStructure.totalWeeks}
        </div>
        <table class="preview-table">
            <thead>
                <tr>
                    <th rowspan="2">Total de Horas</th>
    `;
    
    // Headers dinámicos para cada semana
    for (let i = 1; i <= weekStructure.totalWeeks; i++) {
        const daysInWeek = weekStructure.distribution[i - 1];
        tableHTML += `<th colspan="4">SEMANA ${i} (${daysInWeek} días)</th>`;
    }
    
    tableHTML += `
                </tr>
                <tr>
    `;
    
    // Sub-headers para cada semana
    for (let i = 1; i <= weekStructure.totalWeeks; i++) {
        tableHTML += `
            <th>MODULO</th>
            <th>TIEMPO</th>
            <th>TARIFA</th>
            <th>TOTAL</th>
        `;
    }
    
    tableHTML += `
                </tr>
            </thead>
            <tbody>
    `;
    
    // Filas de datos
    Object.entries(editablePreviewData).forEach(([index, row]) => {
        tableHTML += `<tr>
            <td><strong>${row.totalHoras.toFixed(1)}</strong></td>
        `;
        
        // Generar columnas para cada semana dinámicamente
        for (let semana = 1; semana <= weekStructure.totalWeeks; semana++) {
            const semanaKey = `semana${semana}`;
            const semanaData = row[semanaKey];
            
            if (semanaData) {
                tableHTML += `
                    <td>${row.modulo}</td>
                    <td class="editable-cell">
                        <input type="number" class="editable-input" value="${semanaData.tiempo}" 
                               step="0.1" min="0" max="40" 
                               onchange="updateRemanenteCalculation(${index}, ${semana}, 'time', this.value)">
                    </td>
                    <td class="editable-cell">
                        <input type="number" class="editable-input" value="${semanaData.tarifa}" 
                               step="50" min="100" max="2000" 
                               onchange="updateRemanenteCalculation(${index}, ${semana}, 'tariff', this.value)">
                    </td>
                    <td><strong>$${semanaData.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</strong></td>
                `;
            } else {
                // Si no existe la semana (caso excepcional), mostrar vacío
                tableHTML += `
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                `;
            }
        }
        
        tableHTML += '</tr>';
    });
    
    // Fila de totales
    tableHTML += '<tr style="background: #f1f5f9; font-weight: bold;"><td>TOTALES</td>';
    
    for (let semana = 1; semana <= weekStructure.totalWeeks; semana++) {
        const semanaTotalHours = Object.values(editablePreviewData)
            .reduce((sum, row) => {
                const semanaData = row[`semana${semana}`];
                return sum + (semanaData ? parseFloat(semanaData.tiempo || 0) : 0);
            }, 0);
            
        const semanaTotalAmount = Object.values(editablePreviewData)
            .reduce((sum, row) => {
                const semanaData = row[`semana${semana}`];
                return sum + (semanaData ? parseFloat(semanaData.total || 0) : 0);
            }, 0);
        
        tableHTML += `
            <td>TOTAL</td>
            <td>${semanaTotalHours.toFixed(1)}</td>
            <td>-</td>
            <td>$${semanaTotalAmount.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
        `;
    }
    
    tableHTML += '</tr></tbody></table>';
    return tableHTML;
}

/**
 * Actualizar cálculos cuando se edita una celda (tabla estándar)
 */
function updateRowCalculation(rowIndex, field, value) {
    const numValue = parseFloat(value) || 0;
    
    if (!editablePreviewData[rowIndex]) return;
    
    // Actualizar valor editado
    if (field === 'time') {
        editablePreviewData[rowIndex].editedTime = numValue;
    } else if (field === 'tariff') {
        editablePreviewData[rowIndex].editedTariff = numValue;
    }
    
    // Recalcular total
    editablePreviewData[rowIndex].editedTotal = 
        editablePreviewData[rowIndex].editedTime * editablePreviewData[rowIndex].editedTariff;
    
    // Actualizar display del total en la fila
    updateRowTotalDisplay(rowIndex);
    
    // Actualizar totales generales
    updateGeneralTotals();
    
    console.log('💰 Fila', rowIndex, 'actualizada:', 
               editablePreviewData[rowIndex].editedTime, 'hrs x $', 
               editablePreviewData[rowIndex].editedTariff, '= $', 
               editablePreviewData[rowIndex].editedTotal.toFixed(2));
}

/**
 * Actualizar cálculos para reporte remanente (versión corregida para 4 o 5 semanas)
 */
function updateRemanenteCalculation(rowIndex, semana, field, value) {
    const numValue = parseFloat(value) || 0;
    const semanaKey = `semana${semana}`;
    
    if (!editablePreviewData[rowIndex] || !editablePreviewData[rowIndex][semanaKey]) {
        console.error(`❌ No se encontró datos para fila ${rowIndex}, ${semanaKey}`);
        return;
    }
    
    // Actualizar valor editado
    if (field === 'time') {
        editablePreviewData[rowIndex][semanaKey].tiempo = numValue;
    } else if (field === 'tariff') {
        editablePreviewData[rowIndex][semanaKey].tarifa = numValue;
    }
    
    // Recalcular total de la semana
    editablePreviewData[rowIndex][semanaKey].total = 
        editablePreviewData[rowIndex][semanaKey].tiempo * editablePreviewData[rowIndex][semanaKey].tarifa;
    
    // ✅ NUEVO: Recalcular total considerando todas las semanas dinámicamente
    const weekStructure = editablePreviewData[rowIndex].monthStructure;
    let totalHoras = 0;
    
    for (let i = 1; i <= weekStructure.totalWeeks; i++) {
        const weekData = editablePreviewData[rowIndex][`semana${i}`];
        if (weekData) {
            totalHoras += parseFloat(weekData.tiempo || 0);
        }
    }
    
    editablePreviewData[rowIndex].totalHoras = totalHoras;
    
    // Actualizar displays
    updateRemanenteRowDisplay(rowIndex, semana);
    updateGeneralTotals();
    
    console.log(`📊 Remanente fila ${rowIndex} semana ${semana} actualizada:`, 
               editablePreviewData[rowIndex][semanaKey].tiempo, 'hrs x $', 
               editablePreviewData[rowIndex][semanaKey].tarifa, '= $', 
               editablePreviewData[rowIndex][semanaKey].total.toFixed(2));
}

/**
 * Actualizar display del total en una fila específica
 */
function updateRowTotalDisplay(rowIndex) {
    const table = document.querySelector('.preview-table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    if (!rows[rowIndex]) return;
    
    const cells = rows[rowIndex].querySelectorAll('td');
    const totalCell = cells[cells.length - 1]; // Última columna es TOTAL
    
    if (totalCell) {
        const total = editablePreviewData[rowIndex].editedTotal;
        totalCell.innerHTML = `<strong>$${total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</strong>`;
    }
}

/**
 * Actualizar display para fila de remanente
 */
function updateRemanenteRowDisplay(rowIndex, semana) {
    const table = document.querySelector('.preview-table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    if (!rows[rowIndex]) return;
    
    const cells = rows[rowIndex].querySelectorAll('td');
    
    // Actualizar total de horas (primera celda)
    if (cells[0]) {
        cells[0].innerHTML = `<strong>${editablePreviewData[rowIndex].totalHoras.toFixed(1)}</strong>`;
    }
    
    // Actualizar total de la semana específica
    const semanaStartCol = 1 + ((semana - 1) * 4); // Cada semana tiene 4 columnas
    const totalCol = semanaStartCol + 3; // La 4ta columna de cada semana es el total
    
    if (cells[totalCol]) {
        const total = editablePreviewData[rowIndex][`semana${semana}`].total;
        cells[totalCol].innerHTML = `<strong>$${total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</strong>`;
    }
}

/**
 * Actualizar totales generales en el header
 */
function updateGeneralTotals() {
    const previewInfo = document.querySelector('.preview-info');
    if (!previewInfo) return;
    
    let totalHours, totalAmount;
    
    if (currentReportType === 'remanente') {
        // Para remanente, sumar todas las semanas
        totalHours = Object.values(editablePreviewData).reduce((sum, row) => sum + row.totalHoras, 0);
        totalAmount = Object.values(editablePreviewData).reduce((sum, row) => {
            return sum + row.semana1.total + row.semana2.total + row.semana3.total + row.semana4.total;
        }, 0);
    } else {
        // Para reportes estándar
        totalHours = Object.values(editablePreviewData).reduce((sum, row) => sum + row.editedTime, 0);
        totalAmount = Object.values(editablePreviewData).reduce((sum, row) => sum + row.editedTotal, 0);
    }
    
    previewInfo.innerHTML = `
        ${Object.keys(editablePreviewData).length} registros | 
        ${totalHours.toFixed(1)} horas | 
        $${totalAmount.toLocaleString('es-MX', {minimumFractionDigits: 2})}
    `;
    
    // Actualizar fila de totales en tabla estándar
    if (currentReportType !== 'remanente') {
        const table = document.querySelector('.preview-table');
        const totalRow = table?.querySelector('tbody tr:last-child');
        
        if (totalRow) {
            const cells = totalRow.querySelectorAll('td');
            const report = ARVIC_REPORTS[currentReportType];
            
            report.structure.forEach((header, index) => {
                if (header === 'TIEMPO') {
                    cells[index].innerHTML = `${totalHours.toFixed(1)} hrs`;
                } else if (header === 'TOTAL') {
                    cells[index].innerHTML = `$${totalAmount.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
                }
            });
        }
    }
}

/**
 * Restaurar valores originales
 */
function restoreOriginalValues() {
    if (!confirm('¿Está seguro de restaurar todos los valores originales? Se perderán los cambios realizados.')) {
        return;
    }
    
    console.log('↩️ Restaurando valores originales...');
    
    // Reinicializar datos editables con valores originales
    initializeEditableData();
    
    // Regenerar tabla
    const previewPanel = document.getElementById('reportPreviewPanel');
    const report = ARVIC_REPORTS[currentReportType];
    generateEditableTable(previewPanel, report);
    
    window.NotificationUtils.success('Valores originales restaurados');
}

/**
 * Generar reporte Excel final con formato específico según el tipo
 */
function generateFinalReport() {
    if (!currentReportType || !editablePreviewData || Object.keys(editablePreviewData).length === 0) {
        window.NotificationUtils.error('No hay datos para generar el reporte Excel');
        return;
    }
    
    console.log('📊 Generando Excel para:', currentReportType);
    
    try {
        const report = ARVIC_REPORTS[currentReportType];
        
        switch (currentReportType) {
            case 'pago-consultor-general':
                generatePagoGeneralExcel();
                break;
            case 'pago-consultor-especifico':
                generatePagoConsultorExcel();
                break;
            case 'cliente-soporte':
                generateClienteSoporteExcel();
                break;
            case 'remanente':
                generateRemanenteExcel();
                break;
            case 'proyecto-general':
                generateProyectoGeneralExcel();
                break;
            case 'proyecto-cliente':
                generateProyectoClienteExcel();
                break;
            case 'proyecto-consultor':
                generateProyectoConsultorExcel();
                break;
            default:
                throw new Error(`Tipo de reporte no implementado: ${currentReportType}`);
        }
        
    } catch (error) {
        console.error('❌ Error generando Excel:', error);
        window.NotificationUtils.error('Error al generar Excel: ' + error.message);
    }
}

/**
 * Generar Excel para Pago Consultor Soporte (General)
 */
function generatePagoGeneralExcel() {
    console.log('💰 Generando Excel - Pago Consultor General');
    
    const wb = XLSX.utils.book_new();
    const wsData = [];
    
    // Fila 1: Título fusionado
    wsData.push(['', '', '', 'RESUMEN DE PAGO A CONSULTOR', '', '', '']);
    
    // Fila 2: Espacio
    wsData.push(['', '', '', '', '', '', '']);
    
    // Fila 3: Headers
    wsData.push(['ID Empresa', 'Consultor', 'Soporte', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL']);
    
    // Filas de datos
    let totalHours = 0;
    let totalAmount = 0;
    
    Object.values(editablePreviewData).forEach(row => {
        wsData.push([
            row.idEmpresa || 'N/A',
            row.consultor || 'N/A',
            row.soporte || 'N/A',
            row.modulo || 'N/A',
            parseFloat(row.editedTime || 0),
            parseFloat(row.editedTariff || 0),
            parseFloat(row.editedTotal || 0)
        ]);
        
        totalHours += parseFloat(row.editedTime || 0);
        totalAmount += parseFloat(row.editedTotal || 0);
    });
    
    // Fila de totales
    wsData.push(['', '', '', 'TOTALES', totalHours, '', totalAmount]);
    
    // Crear worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Aplicar estilos
    applyExcelStyling(ws, wsData, 'general');
    
    // Configurar merge para título
    ws['!merges'] = [{ s: { r: 0, c: 3 }, e: { r: 0, c: 6 } }];
    
    // Agregar al workbook
    XLSX.utils.book_append_sheet(wb, ws, "PAGO CONSULTOR GENERAL");
    
    // Generar archivo
    const fileName = generateFileName('PagoConsultorGeneral');
    XLSX.writeFile(wb, fileName);
    
    // Guardar en historial
    saveToReportHistory(fileName, 'pago-consultor-general', totalHours, totalAmount);
    
    window.NotificationUtils.success(`Excel generado: ${fileName}`);
}

/**
 * Generar Excel para Pago Consultor Específico
 */
function generatePagoConsultorExcel() {
    console.log('👤 Generando Excel - Pago Consultor Específico');
    
    const consultantName = document.getElementById('consultantFilter')?.selectedOptions[0]?.text || 'Consultor';
    
    const wb = XLSX.utils.book_new();
    const wsData = [];
    
    // Fila 1: Título
    wsData.push(['', '', '', 'PAGO A CONSULTOR', '', '', '']);
    
    // Fila 2: Información del consultor
    wsData.push(['', `CONSULTOR: ${consultantName}`, '', '', '', '', '']);
    
    // Fila 3: Espacio
    wsData.push(['', '', '', '', '', '', '']);
    
    // Fila 4: Headers
    wsData.push(['ID Empresa', 'Consultor', 'Soporte', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL']);
    
    // Datos y totales
    let totalHours = 0;
    let totalAmount = 0;
    
    Object.values(editablePreviewData).forEach(row => {
        wsData.push([
            row.idEmpresa || 'N/A',
            row.consultor || 'N/A',
            row.soporte || 'N/A',
            row.modulo || 'N/A',
            parseFloat(row.editedTime || 0),
            parseFloat(row.editedTariff || 0),
            parseFloat(row.editedTotal || 0)
        ]);
        
        totalHours += parseFloat(row.editedTime || 0);
        totalAmount += parseFloat(row.editedTotal || 0);
    });
    
    wsData.push(['', '', '', 'TOTALES', totalHours, '', totalAmount]);
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    applyExcelStyling(ws, wsData, 'consultor');
    
    ws['!merges'] = [
        { s: { r: 0, c: 3 }, e: { r: 0, c: 6 } }, // Título
        { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } }  // Nombre consultor
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "PAGO CONSULTOR");
    
    const fileName = generateFileName('PagoConsultor');
    XLSX.writeFile(wb, fileName);
    saveToReportHistory(fileName, 'pago-consultor-especifico', totalHours, totalAmount);
    
    window.NotificationUtils.success(`Excel generado: ${fileName}`);
}

/**
 * Generar Excel para Cliente Soporte (vista simplificada)
 */
function generateClienteSoporteExcel() {
    console.log('📞 Generando Excel - Cliente Soporte');
    
    const clientName = document.getElementById('clientFilter')?.selectedOptions[0]?.text || 'Cliente';
    
    const wb = XLSX.utils.book_new();
    const wsData = [];
    
    // Fila 1: Información del cliente
    wsData.push(['', `Cliente: ${clientName}`, '', '', '']);
    
    // Fila 2: Espacio
    wsData.push(['', '', '', '', '']);
    
    // Fila 3: Headers (estructura simplificada - sin ID Empresa ni Consultor)
    wsData.push(['Soporte', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL']);
    
    // Datos
    let totalHours = 0;
    let totalAmount = 0;
    
    Object.values(editablePreviewData).forEach(row => {
        wsData.push([
            row.soporte || 'N/A',
            row.modulo || 'N/A',
            parseFloat(row.editedTime || 0),
            parseFloat(row.editedTariff || 0),
            parseFloat(row.editedTotal || 0)
        ]);
        
        totalHours += parseFloat(row.editedTime || 0);
        totalAmount += parseFloat(row.editedTotal || 0);
    });
    
    wsData.push(['', 'TOTALES', totalHours, '', totalAmount]);
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    applyExcelStyling(ws, wsData, 'cliente');
    
    ws['!merges'] = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 3 } }]; // Cliente info
    
    XLSX.utils.book_append_sheet(wb, ws, "CLIENTE SOPORTE");
    
    const fileName = generateFileName('ClienteSoporte');
    XLSX.writeFile(wb, fileName);
    saveToReportHistory(fileName, 'cliente-soporte', totalHours, totalAmount);
    
    window.NotificationUtils.success(`Excel generado: ${fileName}`);
}

/**
 * Generar Excel para Reporte Remanente (estructura dinámica por semanas) - VERSIÓN CORREGIDA
 */
function generateRemanenteExcel() {
    console.log('📊 Generando Excel - Reporte Remanente con semanas dinámicas');
    
    const clientName = document.getElementById('clientFilter')?.selectedOptions[0]?.text || 'Cliente';
    const supportType = document.getElementById('supportTypeFilter')?.value || 'N/A';
    const monthName = document.getElementById('monthFilter')?.selectedOptions[0]?.text || 'Mes';
    
    // Obtener estructura de semanas
    const firstModule = Object.values(editablePreviewData)[0];
    const weekStructure = firstModule.monthStructure;
    
    console.log(`📅 Excel para ${weekStructure.totalWeeks} semanas: ${weekStructure.description}`);
    
    const wb = XLSX.utils.book_new();
    const wsData = [];
    
    // Fila 1: Título
    const titleRowLength = 1 + (weekStructure.totalWeeks * 4); // 1 + 4 columnas por semana
    const titleRow = Array(titleRowLength).fill('');
    titleRow[Math.floor(titleRowLength / 2)] = 'REPORTE REMANENTE';
    wsData.push(titleRow);
    
    // Fila 2: Información
    const infoRow = Array(titleRowLength).fill('');
    infoRow[1] = `Cliente: ${clientName}`;
    infoRow[4] = `Tipo: ${supportType}`;
    infoRow[7] = `Mes: ${monthName}`;
    infoRow[10] = `Semanas: ${weekStructure.totalWeeks}`;
    wsData.push(infoRow);
    
    // Fila 3: Espacio
    wsData.push(Array(titleRowLength).fill(''));
    
    // Filas 4-5: Headers dinámicos para semanas
    const headerRow1 = ['Total de Horas'];
    const headerRow2 = [''];
    
    for (let i = 1; i <= weekStructure.totalWeeks; i++) {
        const daysInWeek = weekStructure.distribution[i - 1];
        headerRow1.push(`SEMANA ${i} (${daysInWeek}d)`, '', '', '');
        headerRow2.push('MODULO', 'TIEMPO', 'TARIFA', 'TOTAL');
    }
    
    wsData.push(headerRow1);
    wsData.push(headerRow2);
    
    // Datos por módulo y semana
    let grandTotalHours = 0;
    let grandTotalAmount = 0;
    
    Object.values(editablePreviewData).forEach(row => {
        const dataRow = [row.totalHoras.toFixed(1)];
        
        for (let semana = 1; semana <= weekStructure.totalWeeks; semana++) {
            const semanaData = row[`semana${semana}`];
            
            if (semanaData) {
                dataRow.push(
                    row.modulo,
                    parseFloat(semanaData.tiempo || 0),
                    parseFloat(semanaData.tarifa || 0),
                    parseFloat(semanaData.total || 0)
                );
                grandTotalAmount += parseFloat(semanaData.total || 0);
            } else {
                // Para casos excepcionales donde no existe la semana
                dataRow.push('-', 0, 0, 0);
            }
        }
        
        wsData.push(dataRow);
        grandTotalHours += row.totalHoras;
    });
    
    // Fila de totales dinámicos
    const totalsRow = [grandTotalHours.toFixed(1)];
    
    for (let semana = 1; semana <= weekStructure.totalWeeks; semana++) {
        const semanaTotalHours = Object.values(editablePreviewData)
            .reduce((sum, row) => {
                const semanaData = row[`semana${semana}`];
                return sum + (semanaData ? parseFloat(semanaData.tiempo || 0) : 0);
            }, 0);
            
        const semanaTotalAmount = Object.values(editablePreviewData)
            .reduce((sum, row) => {
                const semanaData = row[`semana${semana}`];
                return sum + (semanaData ? parseFloat(semanaData.total || 0) : 0);
            }, 0);
        
        totalsRow.push('TOTALES', semanaTotalHours, '', semanaTotalAmount);
    }
    
    wsData.push(totalsRow);
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    applyExcelStyling(ws, wsData, 'remanente');
    
    // ✅ NUEVO: Merges dinámicos según número de semanas
    const merges = [
        { s: { r: 0, c: 4 }, e: { r: 0, c: Math.min(8, titleRowLength - 1) } }, // Título
        { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } }, // Cliente
        { s: { r: 1, c: 4 }, e: { r: 1, c: 5 } }, // Tipo
        { s: { r: 1, c: 7 }, e: { r: 1, c: 8 } }  // Mes
    ];
    
    // Merges para headers de semanas
    for (let semana = 1; semana <= weekStructure.totalWeeks; semana++) {
        const startCol = 1 + ((semana - 1) * 4);
        const endCol = startCol + 3;
        merges.push({ s: { r: 3, c: startCol }, e: { r: 3, c: endCol } });
    }
    
    ws['!merges'] = merges;
    
    XLSX.utils.book_append_sheet(wb, ws, "REPORTE REMANENTE");
    
    const fileName = generateFileName('ReporteRemanente');
    XLSX.writeFile(wb, fileName);
    saveToReportHistory(fileName, 'remanente', grandTotalHours, grandTotalAmount);
    
    window.NotificationUtils.success(`Excel Remanente generado: ${fileName} (${weekStructure.totalWeeks} semanas)`);
}

/**
 * Generar Excel para Proyecto General
 */
function generateProyectoGeneralExcel() {
    console.log('📋 Generando Excel - Proyecto General');
    
    const wb = XLSX.utils.book_new();
    const wsData = [];
    
    wsData.push(['', '', 'Proyecto: General', '', '', '']);
    wsData.push(['', '', '', '', '', '']);
    wsData.push(['ID Empresa', 'Consultor', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL']);
    
    let totalHours = 0;
    let totalAmount = 0;
    
    Object.values(editablePreviewData).forEach(row => {
        wsData.push([
            row.idEmpresa || 'N/A',
            row.consultor || 'N/A',
            row.modulo || 'N/A',
            parseFloat(row.editedTime || 0),
            parseFloat(row.editedTariff || 0),
            parseFloat(row.editedTotal || 0)
        ]);
        
        totalHours += parseFloat(row.editedTime || 0);
        totalAmount += parseFloat(row.editedTotal || 0);
    });
    
    wsData.push(['', '', 'TOTALES', totalHours, '', totalAmount]);
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    applyExcelStyling(ws, wsData, 'proyecto');
    
    ws['!merges'] = [{ s: { r: 0, c: 2 }, e: { r: 0, c: 4 } }];
    
    XLSX.utils.book_append_sheet(wb, ws, "PROYECTO GENERAL");
    
    const fileName = generateFileName('ProyectoGeneral');
    XLSX.writeFile(wb, fileName);
    saveToReportHistory(fileName, 'proyecto-general', totalHours, totalAmount);
    
    window.NotificationUtils.success(`Excel generado: ${fileName}`);
}

/**
 * Generar Excel para Proyecto Cliente (vista simplificada)
 */
function generateProyectoClienteExcel() {
    console.log('🏢 Generando Excel - Proyecto Cliente');
    
    const clientName = document.getElementById('clientFilter')?.selectedOptions[0]?.text || 'Cliente';
    
    const wb = XLSX.utils.book_new();
    const wsData = [];
    
    wsData.push(['', `Proyecto: ${clientName}`, '', '']);
    wsData.push(['', '', '', '']);
    wsData.push(['Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL']);
    
    let totalHours = 0;
    let totalAmount = 0;
    
    Object.values(editablePreviewData).forEach(row => {
        wsData.push([
            row.modulo || 'N/A',
            parseFloat(row.editedTime || 0),
            parseFloat(row.editedTariff || 0),
            parseFloat(row.editedTotal || 0)
        ]);
        
        totalHours += parseFloat(row.editedTime || 0);
        totalAmount += parseFloat(row.editedTotal || 0);
    });
    
    wsData.push(['TOTALES', totalHours, '', totalAmount]);
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    applyExcelStyling(ws, wsData, 'proyecto-cliente');
    
    ws['!merges'] = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 2 } }];
    
    XLSX.utils.book_append_sheet(wb, ws, "PROYECTO CLIENTE");
    
    const fileName = generateFileName('ProyectoCliente');
    XLSX.writeFile(wb, fileName);
    saveToReportHistory(fileName, 'proyecto-cliente', totalHours, totalAmount);
    
    window.NotificationUtils.success(`Excel generado: ${fileName}`);
}

/**
 * Generar Excel para Proyecto Consultor
 */
function generateProyectoConsultorExcel() {
    console.log('👤 Generando Excel - Proyecto Consultor');
    
    const consultantName = document.getElementById('consultantFilter')?.selectedOptions[0]?.text || 'Consultor';
    
    const wb = XLSX.utils.book_new();
    const wsData = [];
    
    wsData.push(['', '', `Proyecto: ${consultantName}`, '', '', '']);
    wsData.push(['', '', '', '', '', '']);
    wsData.push(['ID Empresa', 'Consultor', 'Modulo', 'TIEMPO', 'TARIFA de Modulo', 'TOTAL']);
    
    let totalHours = 0;
    let totalAmount = 0;
    
    Object.values(editablePreviewData).forEach(row => {
        wsData.push([
            row.idEmpresa || 'N/A',
            row.consultor || 'N/A',
            row.modulo || 'N/A',
            parseFloat(row.editedTime || 0),
            parseFloat(row.editedTariff || 0),
            parseFloat(row.editedTotal || 0)
        ]);
        
        totalHours += parseFloat(row.editedTime || 0);
        totalAmount += parseFloat(row.editedTotal || 0);
    });
    
    wsData.push(['', '', 'TOTALES', totalHours, '', totalAmount]);
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    applyExcelStyling(ws, wsData, 'proyecto-consultor');
    
    ws['!merges'] = [{ s: { r: 0, c: 2 }, e: { r: 0, c: 4 } }];
    
    XLSX.utils.book_append_sheet(wb, ws, "PROYECTO CONSULTOR");
    
    const fileName = generateFileName('ProyectoConsultor');
    XLSX.writeFile(wb, fileName);
    saveToReportHistory(fileName, 'proyecto-consultor', totalHours, totalAmount);
    
    window.NotificationUtils.success(`Excel generado: ${fileName}`);
}

/**
 * Aplicar estilos básicos a worksheet de Excel
 */
function applyExcelStyling(ws, wsData, reportType) {
    // Configurar anchos de columna
    const colWidths = [];
    
    switch (reportType) {
        case 'remanente':
            // Columnas más anchas para estructura semanal
            colWidths.push(
                { wch: 15 }, // Total Horas
                { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, // Semana 1
                { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, // Semana 2
                { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, // Semana 3
                { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 12 }  // Semana 4
            );
            break;
        case 'cliente':
        case 'proyecto-cliente':
            // Estructura simplificada
            colWidths.push(
                { wch: 25 }, // Soporte/Modulo
                { wch: 15 }, // Modulo/Tiempo
                { wch: 10 }, // Tiempo/Tarifa
                { wch: 15 }, // Tarifa/Total
                { wch: 15 }  // Total
            );
            break;
        default:
            // Estructura estándar
            colWidths.push(
                { wch: 12 }, // ID Empresa
                { wch: 20 }, // Consultor
                { wch: 25 }, // Soporte/Modulo
                { wch: 20 }, // Modulo
                { wch: 10 }, // Tiempo
                { wch: 15 }, // Tarifa
                { wch: 15 }  // Total
            );
    }
    
    ws['!cols'] = colWidths;
    
    // Aplicar estilos básicos a celdas
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
    
    for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = ws[cellAddress];
            
            if (!cell) continue;
            
            // Inicializar estilo si no existe
            if (!cell.s) cell.s = {};
            
            // Estilos para headers (fila 2 o 3 según reporte)
            const headerRow = reportType === 'remanente' ? 4 : (reportType === 'cliente' ? 2 : 2);
            if (row === headerRow) {
                cell.s = {
                    fill: { bgColor: { rgb: "4A90E2" } },
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                    }
                };
            }
            // Estilos para títulos (primera fila)
            else if (row === 0) {
                cell.s = {
                    font: { bold: true, size: 14, color: { rgb: "1E40AF" } },
                    alignment: { horizontal: "center", vertical: "center" }
                };
            }
            // Estilos para fila de totales (última fila)
            else if (row === range.e.r) {
                cell.s = {
                    fill: { bgColor: { rgb: "F1F5F9" } },
                    font: { bold: true },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "medium", color: { rgb: "000000" } },
                        bottom: { style: "medium", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                    }
                };
            }
            // Estilos para datos normales
            else if (row > headerRow) {
                cell.s = {
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "E5E7EB" } },
                        bottom: { style: "thin", color: { rgb: "E5E7EB" } },
                        left: { style: "thin", color: { rgb: "E5E7EB" } },
                        right: { style: "thin", color: { rgb: "E5E7EB" } }
                    }
                };
                
                // Alternar colores de fila
                if ((row - headerRow) % 2 === 0) {
                    cell.s.fill = { bgColor: { rgb: "F9FAFB" } };
                }
            }
            
            // Formato de moneda para columnas de dinero
            if (typeof cell.v === 'number' && (col === range.e.c || cellAddress.includes('TOTAL'))) {
                cell.s.numFmt = '"$"#,##0.00';
            }
        }
    }
}

/**
 * Generar nombre de archivo único
 */
function generateFileName(reportPrefix) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const timeStr = now.toTimeString().slice(0, 5).replace(':', ''); // HHMM
    
    // Obtener información adicional según filtros
    let suffix = '';
    
    if (currentReportType.includes('consultor-especifico') || currentReportType.includes('proyecto-consultor')) {
        const consultantName = document.getElementById('consultantFilter')?.selectedOptions[0]?.text?.split(' ')[0] || 'Consultor';
        suffix = `_${consultantName}`;
    } else if (currentReportType.includes('cliente')) {
        const clientName = document.getElementById('clientFilter')?.selectedOptions[0]?.text?.split(' ')[0] || 'Cliente';
        suffix = `_${clientName}`;
    } else if (currentReportType === 'remanente') {
        const monthValue = document.getElementById('monthFilter')?.value || '';
        suffix = `_${monthValue.replace('-', '')}`;
    }
    
    return `${reportPrefix}${suffix}_HPEREZ_${dateStr}_${timeStr}.xlsx`;
}

/**
 * Guardar reporte en historial
 */
function saveToReportHistory(fileName, reportType, totalHours, totalAmount) {
    try {
        const reportData = {
            fileName: fileName,
            reportType: reportType,
            generatedBy: 'Hector Perez',
            dateRange: getDateRangeText(),
            recordCount: Object.keys(editablePreviewData).length,
            totalHours: totalHours,
            totalAmount: totalAmount
        };
        
        const saveResult = window.PortalDB.saveGeneratedReport(reportData);
        
        if (saveResult.success) {
            console.log('✅ Reporte guardado en historial:', fileName);
            // Actualizar contadores del sidebar
            if (typeof updateSidebarCounts === 'function') {
                updateSidebarCounts();
            }
        } else {
            console.error('❌ Error guardando en historial:', saveResult.message);
        }
        
    } catch (error) {
        console.error('❌ Error guardando reporte en historial:', error);
    }
}

/**
 * Obtener texto descriptivo del rango de fechas actual
 */
function getDateRangeText() {
    const timeFilter = document.getElementById('timeFilter');
    if (!timeFilter) return 'Período no especificado';
    
    switch (timeFilter.value) {
        case 'week':
            return 'Esta Semana';
        case 'month':
            return 'Este Mes';
        case 'custom':
            const startDate = document.getElementById('startDate')?.value;
            const endDate = document.getElementById('endDate')?.value;
            if (startDate && endDate) {
                return `${startDate} al ${endDate}`;
            }
            return 'Rango personalizado';
        case 'all':
            return 'Todas las fechas';
        default:
            return 'Período no especificado';
    }
}



// Inicializar cuando se carga la sección
document.addEventListener('DOMContentLoaded', function() {
    // Esperamos un poco para asegurar que todo esté cargado
    setTimeout(() => {
        initializeReportSelector();
    }, 500);
});

// Asegurar inicialización cuando se cambia a la sección de reportes
function ensureReportSelectorInitialized() {
    const reportGrid = document.getElementById('reportGrid');
    if (reportGrid && reportGrid.children.length === 0) {
        initializeReportSelector();
    }
}

console.log('✅ Funciones de generación de reportes cargadas correctamente');

// === FUNCIONES EXPORTADAS GLOBALMENTE ===
window.showSection = showSection;
window.openUserModal = openUserModal;
window.openCompanyModal = openCompanyModal;
window.openSupportModal = openSupportModal;
window.deleteSupport = deleteSupport;
window.openProjectModal = openProjectModal;
window.openModuleModal = openModuleModal;
window.closeModal = closeModal;
window.deleteUser = deleteUser;
window.deleteCompany = deleteCompany;
window.deleteProject = deleteProject;
window.deleteModule = deleteModule;
window.createAssignment = createAssignment;
window.deleteAssignment = deleteAssignment;
window.createProjectAssignment = createProjectAssignment;
window.deleteProjectAssignment = deleteProjectAssignment;
window.updateProjectAssignmentDropdowns = updateProjectAssignmentDropdowns;
window.approveReport = approveReport;
window.rejectReport = rejectReport;
window.logout = logout;
window.exportData = exportData;
window.importData = importData;
window.generateAdminReport = generateAdminReport;
window.viewReport = viewReport;
window.updateApprovedReportsList = updateApprovedReportsList;
window.updateProjectsList = updateProjectsList;
window.updateModulesList = updateModulesList;
window.updateAssignmentsList = updateAssignmentsList;
window.updateUsersList = updateUsersList;
window.viewUserAssignments = viewUserAssignments;
window.updateGeneratedReportsList = updateGeneratedReportsList;
window.refreshGeneratedReportsList = refreshGeneratedReportsList;
window.deleteGeneratedReportFromHistory = deleteGeneratedReportFromHistory;
window.filterReportsByCategory = filterReportsByCategory;
window.initializeReportsFilters = initializeReportsFilters;
window.getReportCategory = getReportCategory;
window.updateReportsListWithFilter = updateReportsListWithFilter;

console.log('✅ Funciones de asignación de proyectos cargadas');
console.log('✅ Funciones del administrador exportadas globalmente');

// CÓDIGO TEMPORAL DE DIAGNÓSTICO
window.addEventListener('load', function() {
    setTimeout(() => {
        console.log('🔍 DIAGNÓSTICO COMPLETO:');
        
        // Verificar elementos
        const elements = ['assignUser', 'assignCompany', 'assignSupport', 'assignModule'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            console.log(`${id}:`, el ? '✅ Existe' : '❌ NO EXISTE');
        });
        
        // Verificar si la sección existe
        const section = document.getElementById('crear-asignacion-section');
        console.log('crear-asignacion-section:', section ? '✅ Existe' : '❌ NO EXISTE');
        
        // Mostrar todas las secciones disponibles
        const allSections = document.querySelectorAll('[id$="-section"]');
        console.log('📝 Secciones disponibles:');
        allSections.forEach(s => console.log(`  - ${s.id}`));
        
    }, 1000);
});