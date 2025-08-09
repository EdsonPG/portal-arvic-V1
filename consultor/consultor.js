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
        
        // Obtener TODAS las asignaciones activas del usuario
        userAssignments = window.PortalDB.getUserAssignments(currentUser.id);
        
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
            const company = window.PortalDB.getCompany(assignment.companyId);
            const support = window.PortalDB.getSupport(assignment.supportId); // Cambiar de getTask
            const module = window.PortalDB.getModule(assignment.moduleId);
            
            // Obtener reportes de esta asignación
            const assignmentReports = window.PortalDB.getReportsByAssignment(assignment.id);
            const totalHours = assignmentReports.reduce((sum, r) => sum + (parseFloat(r.hours) || 0), 0);
            
            const assignmentDiv = document.createElement('div');
            assignmentDiv.className = 'assignment-card';
            assignmentDiv.innerHTML = `
                <div class="assignment-header">
                    <h3 style="margin: 0; color: #2c3e50;">🏢 ${company?.name || 'Empresa no encontrada'}</h3>
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
            
            container.appendChild(assignmentDiv);
        });
        
    } catch (error) {
        console.error('Error en updateAssignmentsList:', error);
        showError('Error al actualizar lista de asignaciones: ' + error.message);
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
        const support = window.PortalDB.getSupport(assignment.supportId); // Cambiar de getTask
        const module = window.PortalDB.getModule(assignment.moduleId);
        
        // Mostrar información de la asignación seleccionada
        const assignmentInfoElement = document.getElementById('selectedAssignmentInfo');
        if (assignmentInfoElement) {
            assignmentInfoElement.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">📋 Información de la Asignación</h4>
                <p><strong>🏢 Empresa:</strong> ${company?.name || 'No encontrada'}</p>
                <p><strong>📞 Soporte:</strong> ${support?.name || 'No encontrado'}</p>
                <p style="margin-bottom: 0;"><strong>🧩 Módulo:</strong> ${module?.name || 'No encontrado'}</p>
            `;
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
        const support = window.PortalDB.getSupport(assignment.supportId); // Cambiar de getTask
        const module = window.PortalDB.getModule(assignment.moduleId);
        
        const reports = window.PortalDB.getReportsByAssignment(assignmentId);
        
        // Mostrar información de la asignación
        const assignmentInfoElement = document.getElementById('assignmentReportsInfo');
        if (assignmentInfoElement) {
            assignmentInfoElement.innerHTML = `
                <div class="assignment-info-display">
                    <h4>📋 Información de la Asignación</h4>
                    <p><strong>🏢 Empresa:</strong> ${company?.name || 'No encontrada'}</p>
                    <p><strong>📞 Soporte:</strong> ${support?.name || 'No encontrado'}</p>
                    <p><strong>🧩 Módulo:</strong> ${module?.name || 'No encontrado'}</p>
                </div>
            `;
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
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                            <div style="flex: 1;">
                                <h5 style="margin: 0 0 5px 0; color: #2c3e50;">${report.title}</h5>
                                <p style="margin: 5px 0; color: #666; font-size: 14px;">${report.description}</p>
                                <div style="display: flex; gap: 15px; font-size: 12px; color: #888;">
                                    <span>⏰ ${report.hours} hrs</span>
                                    <span>📅 ${window.DateUtils.formatDate(report.reportDate)}</span>
                                    <span>🕒 Enviado: ${window.DateUtils.formatRelativeTime(report.createdAt)}</span>
                                </div>
                            </div>
                            <div>
                                <span class="report-status status-${report.status.toLowerCase()}">
                                    ${report.status}
                                </span>
                            </div>
                        </div>
                        ${report.status === 'Rechazado' && report.feedback ? `
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

// === FUNCIONES EXPORTADAS GLOBALMENTE ===
window.openCreateReportModal = openCreateReportModal;
window.viewAssignmentReports = viewAssignmentReports;
window.closeModal = closeModal;
window.logout = logout;
window.hideError = hideError;

console.log('✅ Funciones del consultor exportadas globalmente');