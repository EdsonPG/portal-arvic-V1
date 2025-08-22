/**
 * === PANEL DE CONSULTOR SIMPLIFICADO ===
 * Solo maneja asignaciones y reportes de horas
 */

// Variables globales
let currentUser = null;
let userAssignments = [];
let currentAssignmentId = null;
let isInitialized = false;

// === MANEJO DE ERRORES ===
function showError(message) {
    console.error('Error:', message);
    const errorContainer = document.getElementById('errorContainer');
    const errorText = document.getElementById('errorText');
    
    if (errorContainer && errorText) {
        errorText.textContent = message;
        errorContainer.style.display = 'block';
        
        setTimeout(() => {
            hideError();
        }, 5000);
    } else {
        alert('Error: ' + message);
    }
}

function hideError() {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    const mainContent = document.getElementById('mainContent');
    
    if (spinner) {
        spinner.style.display = 'none';
    }
    if (mainContent) {
        mainContent.style.display = 'block';
    }
}

// === VERIFICACIÓN DE DEPENDENCIAS ===
function checkDependencies() {
    const requiredObjects = ['PortalDB', 'AuthSys', 'NotificationUtils', 'DateUtils', 'ModalUtils'];
    const missing = [];
    
    for (const obj of requiredObjects) {
        if (!window[obj]) {
            missing.push(obj);
        }
    }
    
    if (missing.length > 0) {
        showError(`Faltan dependencias: ${missing.join(', ')}. Por favor verifica que todos los archivos JS estén cargados.`);
        return false;
    }
    
    return true;
}

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando panel de consultor simplificado...');
    
    try {
        let retries = 0;
        const maxRetries = 10;
        
        const checkAndInit = () => {
            if (checkDependencies()) {
                initializeConsultor();
            } else {
                retries++;
                if (retries < maxRetries) {
                    console.log(`Reintentando carga de dependencias (${retries}/${maxRetries})...`);
                    setTimeout(checkAndInit, 500);
                } else {
                    showError('Error crítico: No se pudieron cargar las dependencias necesarias. Recarga la página.');
                }
            }
        };
        
        checkAndInit();
        
    } catch (error) {
        console.error('Error durante la inicialización:', error);
        showError('Error durante la inicialización: ' + error.message);
    }
});

function initializeConsultor() {
    try {
        console.log('✅ Dependencias cargadas, verificando autenticación...');
        
        // Verificar autenticación
        if (!window.AuthSys || !window.AuthSys.isAuthenticated()) {
            console.error('❌ Usuario no autenticado');
            showError('Sesión no válida. Redirigiendo al login...');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            return;
        }
        
        currentUser = window.AuthSys.getCurrentUser();
        
        if (!currentUser) {
            console.error('❌ No se pudo obtener información del usuario');
            showError('Error al obtener información del usuario');
            return;
        }
        
        if (currentUser.role !== 'consultor') {
            console.error('❌ Usuario no es consultor:', currentUser.role);
            showError('Acceso denegado: No tienes permisos de consultor');
            setTimeout(() => {
                window.AuthSys.logout();
            }, 2000);
            return;
        }
        
        console.log('✅ Usuario autenticado como consultor:', currentUser.name);
        
        // Inicializar panel
        setupConsultorPanel();
        setupEventListeners();
        loadUserAssignments();
        
        hideLoadingSpinner();
        isInitialized = true;
        
        console.log('🎉 Panel de consultor inicializado correctamente');
        
    } catch (error) {
        console.error('Error en initializeConsultor:', error);
        showError('Error de inicialización: ' + error.message);
    }
}

function setupConsultorPanel() {
    try {
        // Actualizar información del usuario
        const userNameElement = document.getElementById('consultorUserName');
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userIdDisplay = document.getElementById('userIdDisplay');
        
        if (userNameElement) {
            userNameElement.textContent = currentUser.name;
        }
        if (userNameDisplay) {
            userNameDisplay.textContent = currentUser.name;
        }
        if (userIdDisplay) {
            userIdDisplay.textContent = currentUser.id;
        }
        
        // Configurar fecha actual en el modal
        const reportDateElement = document.getElementById('reportDate');
        if (reportDateElement) {
            const today = new Date().toISOString().split('T')[0];
            reportDateElement.value = today;
        }
        
        if (window.NotificationUtils) {
            window.NotificationUtils.success(`¡Bienvenido ${currentUser.name}!`, 3000);
        }
        
    } catch (error) {
        console.error('Error en setupConsultorPanel:', error);
        showError('Error al configurar panel: ' + error.message);
    }
}

function setupEventListeners() {
    try {
        // Formulario de reportes
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', handleCreateReport);
        }
        
        // Auto-refresh cada 30 segundos
        setInterval(() => {
            if (isInitialized) {
                loadUserAssignments();
            }
        }, 30000);
        
    } catch (error) {
        console.error('Error en setupEventListeners:', error);
        showError('Error al configurar eventos: ' + error.message);
    }
}

// === GESTIÓN DE ASIGNACIONES ===
function loadUserAssignments() {
    try {
        if (!currentUser || !window.PortalDB) {
            return;
        }
        
        console.log('🔄 Cargando asignaciones para usuario:', currentUser.id);
        
        // 🟦 OBTENER ASIGNACIONES DE SOPORTE
        const supportAssignments = window.PortalDB.getUserAssignments(currentUser.id);
        
        // 🟩 OBTENER ASIGNACIONES DE PROYECTO
        const allProjectAssignments = window.PortalDB.getProjectAssignments ? 
            Object.values(window.PortalDB.getProjectAssignments()) : [];
        const projectAssignments = allProjectAssignments.filter(assignment => 
            assignment.consultorId === currentUser.id && assignment.isActive
        );
        
        // Combinar ambos tipos en el array global
        userAssignments = [
            ...supportAssignments.map(a => ({...a, assignmentType: 'support'})),
            ...projectAssignments.map(a => ({...a, assignmentType: 'project'}))
        ];
        
        console.log(`📊 Encontradas: ${supportAssignments.length} asignaciones de soporte, ${projectAssignments.length} asignaciones de proyecto`);
        
        updateAssignmentsList();
        updateAssignmentsCount();
        
    } catch (error) {
        console.error('Error en loadUserAssignments:', error);
        showError('Error al cargar asignaciones: ' + error.message);
    }
}

function updateAssignmentsList() {
    try {
        const container = document.getElementById('assignmentsList');
        if (!container) return;
        
        if (userAssignments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎯</div>
                    <div class="empty-state-title">No hay asignaciones</div>
                    <div class="empty-state-desc">Las asignaciones del administrador aparecerán aquí</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        userAssignments.forEach(assignment => {
            const assignmentDiv = document.createElement('div');
            assignmentDiv.className = `assignment-card ${assignment.assignmentType}-assignment`;
            
            // Diferenciar entre soporte y proyecto
            if (assignment.assignmentType === 'support') {
                // 🟦 ASIGNACIÓN DE SOPORTE
                const company = window.PortalDB.getCompany(assignment.companyId);
                const support = window.PortalDB.getSupport(assignment.supportId);
                const module = window.PortalDB.getModule(assignment.moduleId);
                
                // Obtener reportes de esta asignación
                const assignmentReports = window.PortalDB.getReportsByAssignment(assignment.id);
                const totalHours = assignmentReports.reduce((sum, r) => sum + (parseFloat(r.hours) || 0), 0);
                
                assignmentDiv.innerHTML = `
                    <div class="assignment-header">
                        <h3 style="margin: 0; color: #2c3e50;">
                            🏢 ${company?.name || 'Empresa no encontrada'}
                            <span class="assignment-type-badge support-badge">📞 SOPORTE</span>
                        </h3>
                        <span class="assignment-id">${assignment.id.slice(-6)}</span>
                    </div>
                    
                    <div class="assignment-details">
                        <p><strong>📞 Soporte:</strong> ${support?.name || 'Soporte no encontrado'}</p>
                        <p><strong>🧩 Módulo:</strong> ${module?.name || 'Módulo no encontrado'}</p>
                        <p><strong>📊 Reportes:</strong> ${assignmentReports.length} reportes | <strong>⏰ Total:</strong> ${totalHours.toFixed(1)} hrs</p>
                        <p><small>📅 Asignado: ${window.DateUtils.formatDate(assignment.createdAt)}</small></p>
                    </div>
                    
                    <div class="assignment-actions">
                        <button class="btn btn-primary" onclick="openCreateReportModal('${assignment.id}')">
                            📝 Crear Reporte
                        </button>
                        <button class="btn btn-secondary" onclick="viewAssignmentReports('${assignment.id}')">
                            📊 Ver Reportes (${assignmentReports.length})
                        </button>
                    </div>
                `;
            } else {
                // 🟩 ASIGNACIÓN DE PROYECTO
                const company = window.PortalDB.getCompany(assignment.companyId);
                const project = window.PortalDB.getProject(assignment.projectId);
                const module = window.PortalDB.getModule(assignment.moduleId);
                
                assignmentDiv.innerHTML = `
                    <div class="assignment-header">
                        <h3 style="margin: 0; color: #2c3e50;">
                            🏢 ${company?.name || 'Empresa no encontrada'}
                            <span class="assignment-type-badge project-badge">🎯 PROYECTO</span>
                        </h3>
                        <span class="assignment-id">${assignment.id.slice(-8)}</span>
                    </div>
                    
                    <div class="assignment-details">
                        <p><strong>🎯 Proyecto:</strong> ${project?.name || 'Proyecto no encontrado'}</p>
                        <p><strong>🧩 Módulo:</strong> ${module?.name || 'Módulo no encontrado'}</p>
                        <p><strong>📋 Descripción:</strong> ${project?.description || 'Sin descripción'}</p>
                        <p><strong>📊 Estado:</strong> <span class="status-badge">${project?.status || 'No definido'}</span></p>
                        <p><small>📅 Asignado: ${window.DateUtils.formatDate(assignment.createdAt)}</small></p>
                    </div>
                    
                    <div class="assignment-actions">
                        <button class="btn btn-success" onclick="openProjectReportModal('${assignment.id}')">
                            📝 Reporte de Proyecto
                        </button>
                        <button class="btn btn-info" onclick="viewProjectDetails('${assignment.id}')">
                            ℹ️ Detalles del Proyecto
                        </button>
                    </div>
                `;
            }
            
            container.appendChild(assignmentDiv);
        });
        
    } catch (error) {
        console.error('Error en updateAssignmentsList:', error);
        container.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <div class="error-title">Error al cargar asignaciones</div>
                <div class="error-desc">Por favor, recarga la página</div>
            </div>
        `;
    }
}

function updateAssignmentsCount() {
    try {
        const countElement = document.getElementById('assignmentsCount');
        if (countElement) {
            countElement.textContent = userAssignments.length;
        }
    } catch (error) {
        console.error('Error en updateAssignmentsCount:', error);
    }
}

// === GESTIÓN DE REPORTES ===
function openCreateReportModal(assignmentId) {
    try {
        currentAssignmentId = assignmentId;
        const assignment = userAssignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
            showError('Asignación no encontrada');
            return;
        }
        
        const company = window.PortalDB.getCompany(assignment.companyId);
        const module = window.PortalDB.getModule(assignment.moduleId);
        
        // Mostrar información de la asignación seleccionada
        const assignmentInfoElement = document.getElementById('selectedAssignmentInfo');
        if (assignmentInfoElement) {
            let assignmentDetails = '';
            
            // 🔄 DETECTAR TIPO DE ASIGNACIÓN Y MOSTRAR INFORMACIÓN CORRECTA
            if (assignment.assignmentType === 'project') {
                // 🟩 ASIGNACIÓN DE PROYECTO
                const project = window.PortalDB.getProject(assignment.projectId);
                assignmentDetails = `
                    <h4 style="margin: 0 0 10px 0; color: #2c3e50;">📋 Información de la Asignación</h4>
                    <p><strong>🏢 Empresa:</strong> ${company?.name || 'No encontrada'}</p>
                    <p><strong>🎯 Proyecto:</strong> ${project?.name || 'No encontrado'}</p>
                    <p style="margin-bottom: 0;"><strong>🧩 Módulo:</strong> ${module?.name || 'No encontrado'}</p>
                `;
            } else {
                // 🟦 ASIGNACIÓN DE SOPORTE
                const support = window.PortalDB.getSupport(assignment.supportId);
                assignmentDetails = `
                    <h4 style="margin: 0 0 10px 0; color: #2c3e50;">📋 Información de la Asignación</h4>
                    <p><strong>🏢 Empresa:</strong> ${company?.name || 'No encontrada'}</p>
                    <p><strong>📞 Soporte:</strong> ${support?.name || 'No encontrado'}</p>
                    <p style="margin-bottom: 0;"><strong>🧩 Módulo:</strong> ${module?.name || 'No encontrado'}</p>
                `;
            }
            
            assignmentInfoElement.innerHTML = assignmentDetails;
        }
        
        // Limpiar formulario
        document.getElementById('reportForm').reset();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reportDate').value = today;
        
        // Abrir modal con función mejorada
        openModal('createReportModal');
        
    } catch (error) {
        console.error('Error en openCreateReportModal:', error);
        showError('Error al abrir modal de reporte: ' + error.message);
    }
}

function handleCreateReport(e) {
    try {
        e.preventDefault();
        
        if (!currentAssignmentId) {
            showError('No se ha seleccionado una asignación');
            return;
        }
        
        const title = document.getElementById('reportTitle').value.trim();
        const description = document.getElementById('reportDescription').value.trim();
        const hours = parseFloat(document.getElementById('reportHours').value);
        const reportDate = document.getElementById('reportDate').value;
        
        if (!title || !description || !hours || !reportDate) {
            showError('Todos los campos son obligatorios');
            return;
        }
        
        if (hours <= 0 || hours > 24) {
            showError('Las horas deben estar entre 0.5 y 24');
            return;
        }
        
        const reportData = {
            userId: currentUser.id,
            assignmentId: currentAssignmentId,
            title: title,
            description: description,
            hours: hours,
            reportDate: reportDate
        };
        
        const result = window.PortalDB.createReport(reportData);
        
        if (result.success) {
            window.NotificationUtils.success('¡Reporte creado exitosamente!');
            
            // Cerrar modal y actualizar datos
            closeModal('createReportModal');
            loadUserAssignments();
            
        } else {
            showError('Error al crear reporte: ' + result.message);
        }
        
    } catch (error) {
        console.error('Error en handleCreateReport:', error);
        showError('Error al crear reporte: ' + error.message);
    }
}

function viewAssignmentReports(assignmentId) {
    try {
        const assignment = userAssignments.find(a => a.id === assignmentId);
        if (!assignment) {
            showError('Asignación no encontrada');
            return;
        }
        
        const company = window.PortalDB.getCompany(assignment.companyId);
        const module = window.PortalDB.getModule(assignment.moduleId);
        
        const reports = window.PortalDB.getReportsByAssignment(assignmentId);
        
        // Mostrar información de la asignación
        const assignmentInfoElement = document.getElementById('assignmentReportsInfo');
        if (assignmentInfoElement) {
            let assignmentDetails = '';
            
            // 🔄 DETECTAR TIPO DE ASIGNACIÓN Y MOSTRAR INFORMACIÓN CORRECTA
            if (assignment.assignmentType === 'project') {
                // 🟩 ASIGNACIÓN DE PROYECTO
                const project = window.PortalDB.getProject(assignment.projectId);
                assignmentDetails = `
                    <div class="assignment-info-display">
                        <h4>📋 Información de la Asignación</h4>
                        <p><strong>🏢 Empresa:</strong> ${company?.name || 'No encontrada'}</p>
                        <p><strong>🎯 Proyecto:</strong> ${project?.name || 'No encontrado'}</p>
                        <p><strong>🧩 Módulo:</strong> ${module?.name || 'No encontrado'}</p>
                        <p><strong>📊 Estado:</strong> <span class="status-badge">${project?.status || 'No definido'}</span></p>
                        <p><strong>📝 Descripción:</strong> ${project?.description || 'Sin descripción'}</p>
                    </div>
                `;
            } else {
                // 🟦 ASIGNACIÓN DE SOPORTE
                const support = window.PortalDB.getSupport(assignment.supportId);
                assignmentDetails = `
                    <div class="assignment-info-display">
                        <h4>📋 Información de la Asignación</h4>
                        <p><strong>🏢 Empresa:</strong> ${company?.name || 'No encontrada'}</p>
                        <p><strong>📞 Soporte:</strong> ${support?.name || 'No encontrado'}</p>
                        <p><strong>🧩 Módulo:</strong> ${module?.name || 'No encontrado'}</p>
                        <p><strong>🔧 Tipo:</strong> ${support?.type || 'No especificado'}</p>
                        <p><strong>⚡ Prioridad:</strong> ${support?.priority || 'No definida'}</p>
                    </div>
                `;
            }
            
            assignmentInfoElement.innerHTML = assignmentDetails;
        }
        
        // Mostrar lista de reportes
        const reportsListElement = document.getElementById('reportsList');
        if (reportsListElement) {
            if (reports.length === 0) {
                reportsListElement.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📄</div>
                        <div class="empty-state-title">No hay reportes</div>
                        <div class="empty-state-desc">No has creado reportes para esta asignación</div>
                    </div>
                `;
            } else {
                reportsListElement.innerHTML = '<h4>📊 Reportes Enviados</h4>';
                
                // Ordenar reportes por fecha (más recientes primero)
                const sortedReports = reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                sortedReports.forEach(report => {
                    const reportDiv = document.createElement('div');
                    reportDiv.className = 'report-item';
                    reportDiv.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h5 style="margin: 0; color: #2c3e50;">${report.title}</h5>
                            <span class="report-status status-${report.status.toLowerCase()}">${report.status}</span>
                        </div>
                        <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
                            <strong>⏰ Horas:</strong> ${report.hours}h | 
                            <strong>📅 Fecha:</strong> ${window.DateUtils.formatDate(report.reportDate)} |
                            <strong>📤 Enviado:</strong> ${window.DateUtils.formatDateTime(report.createdAt)}
                        </p>
                        <p style="margin: 10px 0 0 0; color: #555; font-size: 0.9em; line-height: 1.4;">
                            ${report.description}
                        </p>
                        ${report.feedback ? `
                            <div style="background: #fff5f5; padding: 10px; border-radius: 6px; border-left: 3px solid #e74c3c; margin-top: 10px;">
                                <strong style="color: #e74c3c;">Comentarios de revisión:</strong>
                                <p style="margin: 5px 0 0 0; color: #666;">${report.feedback}</p>
                            </div>
                        ` : ''}
                    `;
                    reportsListElement.appendChild(reportDiv);
                });
            }
        }
        
        if (window.ModalUtils) {
            window.ModalUtils.open('viewReportsModal');
        }
        
    } catch (error) {
        console.error('Error en viewAssignmentReports:', error);
        showError('Error al ver reportes: ' + error.message);
    }
}

// === UTILIDADES MEJORADAS PARA MODALES ===
function closeModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Animación de salida
            modal.style.animation = 'fadeOut 0.3s ease';
            
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.animation = '';
                
                // Restaurar scroll del body
                document.body.style.overflow = 'auto';
                
                // Limpiar formularios
                const forms = modal.querySelectorAll('form');
                forms.forEach(form => form.reset());
            }, 300);
        }
        
        // Limpiar variables de estado
        if (modalId === 'createReportModal') {
            currentAssignmentId = null;
        }
        
    } catch (error) {
        console.error('Error en closeModal:', error);
    }
}

// Función mejorada para abrir modales
function openModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            
            // Prevenir scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
            
            // Focus en el primer input del modal
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    } catch (error) {
        console.error('Error en openModal:', error);
    }
}

function logout() {
    try {
        if (confirm('¿Está seguro de cerrar sesión?')) {
            if (window.AuthSys) {
                window.AuthSys.logout();
            } else {
                window.location.href = '../index.html';
            }
        }
    } catch (error) {
        console.error('Error en logout:', error);
        window.location.href = '../index.html';
    }
}

// === FUNCIONES AUXILIARES PARA PROYECTOS ===
function openProjectReportModal(projectAssignmentId) {
    console.log('Abriendo modal de reporte para proyecto:', projectAssignmentId);
    // ✅ CORRECTO: Usar la función que realmente existe
    openCreateReportModal(projectAssignmentId);
}

function viewProjectDetails(projectAssignmentId) {
    const assignment = userAssignments.find(a => a.id === projectAssignmentId);
    if (!assignment) {
        window.NotificationUtils.error('No se encontró la asignación del proyecto');
        return;
    }
    
    const project = window.PortalDB.getProject(assignment.projectId);
    const company = window.PortalDB.getCompany(assignment.companyId);
    const module = window.PortalDB.getModule(assignment.moduleId);
    
    const details = `
🎯 DETALLES DEL PROYECTO
════════════════════════════
📋 Proyecto: ${project?.name || 'No encontrado'}
🏢 Cliente: ${company?.name || 'No encontrado'}  
🧩 Módulo: ${module?.name || 'No encontrado'}
📊 Estado: ${project?.status || 'No definido'}
📝 Descripción: ${project?.description || 'Sin descripción'}
📅 Fecha de asignación: ${window.DateUtils.formatDate(assignment.createdAt)}
🆔 ID de asignación: ${assignment.id}
    `;
    
    // Crear un modal personalizado o usar notificación
    if (window.ModalUtils && window.ModalUtils.showInfo) {
        window.ModalUtils.showInfo('Detalles del Proyecto', details);
    } else {
        alert(details);
    }
}

// === ACTUALIZAR CONTADOR EN SIDEBAR ===
function updateAssignmentsCount() {
    const badge = document.getElementById('assignmentsCount');
    if (badge) {
        badge.textContent = userAssignments.length;
    }
}

// === FUNCIONES EXPORTADAS GLOBALMENTE ===
window.openCreateReportModal = openCreateReportModal;
window.viewAssignmentReports = viewAssignmentReports;
window.closeModal = closeModal;
window.logout = logout;
window.hideError = hideError;

window.openProjectReportModal = openProjectReportModal;
window.viewProjectDetails = viewProjectDetails;

console.log('✅ Funciones del consultor exportadas globalmente');