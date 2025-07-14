/**
 * === SISTEMA DE BASE DE DATOS PARA PORTAL ARVIC ACTUALIZADO ===
 * Maneja todos los datos del portal usando localStorage incluyendo tareas y módulos
 */

class PortalDatabase {
    constructor() {
        this.prefix = 'arvic_';
        this.initializeDefaultData();
    }

    // === INICIALIZACIÓN ===
    initializeDefaultData() {
        // Verificar si ya existen datos
        if (!this.getData('initialized')) {
            this.setupDefaultUsers();
            this.setupDefaultCompanies();
            this.setupDefaultProjects();
            this.setupDefaultTasks();
            this.setupDefaultModules();
            this.setData('initialized', true);
            this.setData('user_counter', 3);
            this.setData('company_counter', 4);
            this.setData('project_counter', 4);
            this.setData('task_counter', 4);
            this.setData('module_counter', 4);
        }
    }

    setupDefaultUsers() {
        const defaultUsers = {
            'admin': {
                id: 'admin',
                name: 'Administrador Principal',
                email: 'admin@arvic.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString(),
                isActive: true
            },
            '0001': {
                id: '0001',
                name: 'Juan Pérez García',
                email: 'juan.perez@arvic.com',
                password: 'consultor123',
                role: 'consultor',
                createdAt: new Date().toISOString(),
                isActive: true,
                assignedCompany: '0001',
                assignedProject: '0001',
                reportType: 'Mensual'
            },
            '0002': {
                id: '0002',
                name: 'María Elena Rodríguez',
                email: 'maria.rodriguez@arvic.com',
                password: 'consultor456',
                role: 'consultor',
                createdAt: new Date().toISOString(),
                isActive: true,
                assignedCompany: '0002',
                assignedProject: '0002',
                reportType: 'Semanal'
            }
        };
        this.setData('users', defaultUsers);
    }

    setupDefaultCompanies() {
        const defaultCompanies = {
            '0001': {
                id: '0001',
                name: 'Tecnología Avanzada SA de CV',
                description: 'Empresa especializada en soluciones tecnológicas',
                createdAt: new Date().toISOString(),
                isActive: true
            },
            '0002': {
                id: '0002',
                name: 'Consultoría Digital SRL',
                description: 'Servicios de consultoría y transformación digital',
                createdAt: new Date().toISOString(),
                isActive: true
            },
            '0003': {
                id: '0003',
                name: 'Innovación Tech Corp',
                description: 'Desarrollo de software y aplicaciones móviles',
                createdAt: new Date().toISOString(),
                isActive: true
            }
        };
        this.setData('companies', defaultCompanies);
    }

    setupDefaultProjects() {
        const defaultProjects = {
            '0001': {
                id: '0001',
                name: 'Sistema de Gestión Empresarial',
                description: 'ERP completo para gestión de recursos empresariales',
                status: 'En Progreso',
                createdAt: new Date().toISOString(),
                isActive: true
            },
            '0002': {
                id: '0002',
                name: 'Portal Web Corporativo',
                description: 'Desarrollo de sitio web institucional con CMS',
                status: 'En Progreso',
                createdAt: new Date().toISOString(),
                isActive: true
            },
            '0003': {
                id: '0003',
                name: 'App Móvil de Ventas',
                description: 'Aplicación móvil para gestión de ventas y clientes',
                status: 'Planificación',
                createdAt: new Date().toISOString(),
                isActive: true
            }
        };
        this.setData('projects', defaultProjects);
    }

    setupDefaultTasks() {
        const defaultTasks = {
            '0001': {
                id: '0001',
                name: 'Configurar base de datos inicial',
                description: 'Crear esquema de base de datos y tablas principales',
                createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 días atrás
                isActive: true
            },
            '0002': {
                id: '0002',
                name: 'Implementar autenticación de usuarios',
                description: 'Sistema de login y manejo de sesiones',
                createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 días atrás
                isActive: true
            },
            '0003': {
                id: '0003',
                name: 'Diseñar interfaz de usuario',
                description: 'Crear mockups y prototipos de la interfaz',
                createdAt: new Date().toISOString(),
                isActive: true
            }
        };
        this.setData('tasks', defaultTasks);
    }

    setupDefaultModules() {
        const defaultModules = {
            '0001': {
                id: '0001',
                name: 'Módulo de Autenticación',
                description: 'Manejo de login, logout y sesiones de usuario',
                category: 'Backend',
                createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 días atrás
                isActive: true
            },
            '0002': {
                id: '0002',
                name: 'Panel de Administración',
                description: 'Interfaz para gestión de usuarios y configuración',
                category: 'Frontend',
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 días atrás
                isActive: true
            },
            '0003': {
                id: '0003',
                name: 'API de Reportes',
                description: 'Endpoints para creación y gestión de reportes',
                category: 'API',
                createdAt: new Date().toISOString(),
                isActive: true
            }
        };
        this.setData('modules', defaultModules);
    }

    // === MÉTODOS GENERALES ===
    setData(key, data) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    getData(key) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    deleteData(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Error deleting data:', error);
            return false;
        }
    }

    clearAllData() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }

    // === GESTIÓN DE USUARIOS ===
    getUsers() {
        return this.getData('users') || {};
    }

    getUser(userId) {
        const users = this.getUsers();
        return users[userId] || null;
    }

    createUser(userData) {
        const users = this.getUsers();
        const counter = this.getData('user_counter') || 1;
        const userId = counter.toString().padStart(4, '0');
        
        const newUser = {
            id: userId,
            name: userData.name,
            email: userData.email || '',
            password: userData.password || `user${userId}`,
            role: userData.role || 'consultor',
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        users[userId] = newUser;
        this.setData('users', users);
        this.setData('user_counter', counter + 1);
        
        return { success: true, user: newUser };
    }

    updateUser(userId, updateData) {
        const users = this.getUsers();
        if (!users[userId]) {
            return { success: false, message: 'Usuario no encontrado' };
        }
        
        users[userId] = { ...users[userId], ...updateData };
        this.setData('users', users);
        
        return { success: true, user: users[userId] };
    }

    deleteUser(userId) {
        const users = this.getUsers();
        if (!users[userId]) {
            return { success: false, message: 'Usuario no encontrado' };
        }
        
        delete users[userId];
        this.setData('users', users);
        
        // Eliminar asignaciones relacionadas
        this.deleteAssignmentsByUser(userId);
        
        return { success: true, message: 'Usuario eliminado correctamente' };
    }

    validateUser(userId, password) {
        const user = this.getUser(userId);
        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }
        
        if (user.password !== password) {
            return { success: false, message: 'Contraseña incorrecta' };
        }
        
        if (!user.isActive) {
            return { success: false, message: 'Usuario inactivo' };
        }
        
        return { success: true, user: user };
    }

    // === GESTIÓN DE EMPRESAS ===
    getCompanies() {
        return this.getData('companies') || {};
    }

    getCompany(companyId) {
        const companies = this.getCompanies();
        return companies[companyId] || null;
    }

    createCompany(companyData) {
        const companies = this.getCompanies();
        const counter = this.getData('company_counter') || 1;
        const companyId = counter.toString().padStart(4, '0');
        
        const newCompany = {
            id: companyId,
            name: companyData.name,
            description: companyData.description || '',
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        companies[companyId] = newCompany;
        this.setData('companies', companies);
        this.setData('company_counter', counter + 1);
        
        return { success: true, company: newCompany };
    }

    updateCompany(companyId, updateData) {
        const companies = this.getCompanies();
        if (!companies[companyId]) {
            return { success: false, message: 'Empresa no encontrada' };
        }
        
        companies[companyId] = { ...companies[companyId], ...updateData };
        this.setData('companies', companies);
        
        return { success: true, company: companies[companyId] };
    }

    deleteCompany(companyId) {
        const companies = this.getCompanies();
        if (!companies[companyId]) {
            return { success: false, message: 'Empresa no encontrada' };
        }
        
        delete companies[companyId];
        this.setData('companies', companies);
        
        // Eliminar asignaciones relacionadas
        this.deleteAssignmentsByCompany(companyId);
        
        return { success: true, message: 'Empresa eliminada correctamente' };
    }

    // === GESTIÓN DE PROYECTOS ===
    getProjects() {
        return this.getData('projects') || {};
    }

    getProject(projectId) {
        const projects = this.getProjects();
        return projects[projectId] || null;
    }

    createProject(projectData) {
        const projects = this.getProjects();
        const counter = this.getData('project_counter') || 1;
        const projectId = counter.toString().padStart(4, '0');
        
        const newProject = {
            id: projectId,
            name: projectData.name,
            description: projectData.description || '',
            status: projectData.status || 'Planificación',
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        projects[projectId] = newProject;
        this.setData('projects', projects);
        this.setData('project_counter', counter + 1);
        
        return { success: true, project: newProject };
    }

    updateProject(projectId, updateData) {
        const projects = this.getProjects();
        if (!projects[projectId]) {
            return { success: false, message: 'Proyecto no encontrado' };
        }
        
        projects[projectId] = { ...projects[projectId], ...updateData };
        this.setData('projects', projects);
        
        return { success: true, project: projects[projectId] };
    }

    deleteProject(projectId) {
        const projects = this.getProjects();
        if (!projects[projectId]) {
            return { success: false, message: 'Proyecto no encontrado' };
        }
        
        delete projects[projectId];
        this.setData('projects', projects);
        
        // Eliminar asignaciones relacionadas
        this.deleteAssignmentsByProject(projectId);
        
        return { success: true, message: 'Proyecto eliminado correctamente' };
    }

    // === GESTIÓN DE TAREAS ===
    getTasks() {
        return this.getData('tasks') || {};
    }

    getTask(taskId) {
        const tasks = this.getTasks();
        return tasks[taskId] || null;
    }

    createTask(taskData) {
        const tasks = this.getTasks();
        const counter = this.getData('task_counter') || 1;
        const taskId = counter.toString().padStart(4, '0');
        
        const newTask = {
            id: taskId,
            name: taskData.name,
            description: taskData.description || '',
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        tasks[taskId] = newTask;
        this.setData('tasks', tasks);
        this.setData('task_counter', counter + 1);
        
        return { success: true, task: newTask };
    }

    updateTask(taskId, updateData) {
        const tasks = this.getTasks();
        if (!tasks[taskId]) {
            return { success: false, message: 'Tarea no encontrada' };
        }
        
        tasks[taskId] = { ...tasks[taskId], ...updateData };
        this.setData('tasks', tasks);
        
        return { success: true, task: tasks[taskId] };
    }

    deleteTask(taskId) {
        const tasks = this.getTasks();
        if (!tasks[taskId]) {
            return { success: false, message: 'Tarea no encontrada' };
        }
        
        delete tasks[taskId];
        this.setData('tasks', tasks);
        
        return { success: true, message: 'Tarea eliminada correctamente' };
    }

    // === GESTIÓN DE MÓDULOS ===
    getModules() {
        return this.getData('modules') || {};
    }

    getModule(moduleId) {
        const modules = this.getModules();
        return modules[moduleId] || null;
    }

    createModule(moduleData) {
        const modules = this.getModules();
        const counter = this.getData('module_counter') || 1;
        const moduleId = counter.toString().padStart(4, '0');
        
        const newModule = {
            id: moduleId,
            name: moduleData.name,
            description: moduleData.description || '',
            category: moduleData.category || 'Otros',
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        modules[moduleId] = newModule;
        this.setData('modules', modules);
        this.setData('module_counter', counter + 1);
        
        return { success: true, module: newModule };
    }

    updateModule(moduleId, updateData) {
        const modules = this.getModules();
        if (!modules[moduleId]) {
            return { success: false, message: 'Módulo no encontrado' };
        }
        
        modules[moduleId] = { ...modules[moduleId], ...updateData };
        this.setData('modules', modules);
        
        return { success: true, module: modules[moduleId] };
    }

    deleteModule(moduleId) {
        const modules = this.getModules();
        if (!modules[moduleId]) {
            return { success: false, message: 'Módulo no encontrado' };
        }
        
        delete modules[moduleId];
        this.setData('modules', modules);
        
        return { success: true, message: 'Módulo eliminado correctamente' };
    }

    // === GESTIÓN DE ASIGNACIONES ===
    getAssignments() {
        return this.getData('assignments') || {};
    }

    getAssignment(assignmentId) {
        const assignments = this.getAssignments();
        return assignments[assignmentId] || null;
    }

    createAssignment(assignmentData) {
        const assignments = this.getAssignments();
        const assignmentId = Date.now().toString();
        
        // Verificar que existan el usuario, empresa y proyecto
        const user = this.getUser(assignmentData.userId);
        const company = this.getCompany(assignmentData.companyId);
        const project = this.getProject(assignmentData.projectId);
        
        if (!user || !company || !project) {
            return { success: false, message: 'Usuario, empresa o proyecto no válido' };
        }
        
        const newAssignment = {
            id: assignmentId,
            userId: assignmentData.userId,
            companyId: assignmentData.companyId,
            projectId: assignmentData.projectId,
            reportType: assignmentData.reportType,
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        assignments[assignmentId] = newAssignment;
        this.setData('assignments', assignments);
        
        // Actualizar usuario con la asignación
        this.updateUser(assignmentData.userId, {
            assignedCompany: assignmentData.companyId,
            assignedProject: assignmentData.projectId,
            reportType: assignmentData.reportType
        });
        
        return { success: true, assignment: newAssignment };
    }

    deleteAssignment(assignmentId) {
        const assignments = this.getAssignments();
        const assignment = assignments[assignmentId];
        
        if (!assignment) {
            return { success: false, message: 'Asignación no encontrada' };
        }
        
        // Remover asignación del usuario
        const user = this.getUser(assignment.userId);
        if (user) {
            this.updateUser(assignment.userId, {
                assignedCompany: null,
                assignedProject: null,
                reportType: null
            });
        }
        
        delete assignments[assignmentId];
        this.setData('assignments', assignments);
        
        return { success: true, message: 'Asignación eliminada correctamente' };
    }

    deleteAssignmentsByUser(userId) {
        const assignments = this.getAssignments();
        Object.keys(assignments).forEach(assignmentId => {
            if (assignments[assignmentId].userId === userId) {
                delete assignments[assignmentId];
            }
        });
        this.setData('assignments', assignments);
    }

    deleteAssignmentsByCompany(companyId) {
        const assignments = this.getAssignments();
        Object.keys(assignments).forEach(assignmentId => {
            if (assignments[assignmentId].companyId === companyId) {
                delete assignments[assignmentId];
            }
        });
        this.setData('assignments', assignments);
    }

    deleteAssignmentsByProject(projectId) {
        const assignments = this.getAssignments();
        Object.keys(assignments).forEach(assignmentId => {
            if (assignments[assignmentId].projectId === projectId) {
                delete assignments[assignmentId];
            }
        });
        this.setData('assignments', assignments);
    }

    // === GESTIÓN DE REPORTES ===
    getReports() {
        return this.getData('reports') || {};
    }

    getReportsByUser(userId) {
        const reports = this.getReports();
        return Object.values(reports).filter(report => report.userId === userId);
    }

    createReport(reportData) {
        const reports = this.getReports();
        const reportId = Date.now().toString();
        
        const newReport = {
            id: reportId,
            userId: reportData.userId,
            title: reportData.title,
            content: reportData.content,
            reportDate: reportData.reportDate,
            progress: reportData.progress,
            priority: reportData.priority,
            reportType: reportData.reportType,
            companyId: reportData.companyId,
            projectId: reportData.projectId,
            status: 'Pendiente',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        reports[reportId] = newReport;
        this.setData('reports', reports);
        
        return { success: true, report: newReport };
    }

    updateReport(reportId, updateData) {
        const reports = this.getReports();
        if (!reports[reportId]) {
            return { success: false, message: 'Reporte no encontrado' };
        }
        
        reports[reportId] = { 
            ...reports[reportId], 
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        this.setData('reports', reports);
        
        return { success: true, report: reports[reportId] };
    }

    deleteReport(reportId) {
        const reports = this.getReports();
        if (!reports[reportId]) {
            return { success: false, message: 'Reporte no encontrado' };
        }
        
        delete reports[reportId];
        this.setData('reports', reports);
        
        return { success: true, message: 'Reporte eliminado correctamente' };
    }

    // === ESTADÍSTICAS ===
    getStats() {
        const users = this.getUsers();
        const companies = this.getCompanies();
        const projects = this.getProjects();
        const assignments = this.getAssignments();
        const reports = this.getReports();
        const tasks = this.getTasks();
        const modules = this.getModules();
    }
    // === ESTADÍSTICAS ===
    getStats() {
        const users = this.getUsers();
        const companies = this.getCompanies();
        const projects = this.getProjects();
        const assignments = this.getAssignments();
        const reports = this.getReports();
        const tasks = this.getTasks();
        const modules = this.getModules();
        
        return {
            totalUsers: Object.keys(users).length - 1, // -1 para excluir admin
            totalCompanies: Object.keys(companies).length,
            totalProjects: Object.keys(projects).length,
            totalAssignments: Object.keys(assignments).length,
            totalReports: Object.keys(reports).length,
            totalTasks: Object.keys(tasks).length,
            totalModules: Object.keys(modules).length,
            activeUsers: Object.values(users).filter(u => u.isActive && u.role === 'consultor').length,
            pendingReports: Object.values(reports).filter(r => r.status === 'Pendiente').length,
            completedTasks: Object.values(tasks).filter(t => t.status === 'Completada').length,
            pendingTasks: Object.values(tasks).filter(t => t.status === 'Pendiente').length,
            inProgressTasks: Object.values(tasks).filter(t => t.status === 'En Progreso').length,
            completedModules: Object.values(modules).filter(m => m.status === 'Completado').length,
            inDevelopmentModules: Object.values(modules).filter(m => m.status === 'En Desarrollo').length,
            plannedModules: Object.values(modules).filter(m => m.status === 'Planificación').length
        };
    }

    // === BÚSQUEDA Y FILTROS ===
    searchTasks(criteria) {
        const tasks = Object.values(this.getTasks());
        
        return tasks.filter(task => {
            let matches = true;
            
            if (criteria.name) {
                matches = matches && task.name.toLowerCase().includes(criteria.name.toLowerCase());
            }
            
            if (criteria.status) {
                matches = matches && task.status === criteria.status;
            }
            
            if (criteria.priority) {
                matches = matches && task.priority === criteria.priority;
            }
            
            return matches;
        });
    }

    searchModules(criteria) {
        const modules = Object.values(this.getModules());
        
        return modules.filter(module => {
            let matches = true;
            
            if (criteria.name) {
                matches = matches && module.name.toLowerCase().includes(criteria.name.toLowerCase());
            }
            
            if (criteria.category) {
                matches = matches && module.category === criteria.category;
            }
            
            if (criteria.status) {
                matches = matches && module.status === criteria.status;
            }
            
            return matches;
        });
    }

    // === REPORTES AVANZADOS ===
    getModulesByCategory() {
        const modules = Object.values(this.getModules());
        const grouped = {};
        
        modules.forEach(module => {
            if (!grouped[module.category]) {
                grouped[module.category] = [];
            }
            grouped[module.category].push(module);
        });
        
        return grouped;
    }

    // === UTILIDADES ===
    generateId(type = 'general') {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `${type}_${timestamp}_${random}`;
    }

    exportData() {
        const data = {
            users: this.getUsers(),
            companies: this.getCompanies(),
            projects: this.getProjects(),
            assignments: this.getAssignments(),
            reports: this.getReports(),
            tasks: this.getTasks(),
            modules: this.getModules(),
            exportDate: new Date().toISOString(),
            version: '2.0'
        };
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.users) this.setData('users', data.users);
            if (data.companies) this.setData('companies', data.companies);
            if (data.projects) this.setData('projects', data.projects);
            if (data.assignments) this.setData('assignments', data.assignments);
            if (data.reports) this.setData('reports', data.reports);
            if (data.tasks) this.setData('tasks', data.tasks);
            if (data.modules) this.setData('modules', data.modules);
            
            return { success: true, message: 'Datos importados correctamente' };
        } catch (error) {
            return { success: false, message: 'Error al importar datos: ' + error.message };
        }
    }

    // === VALIDACIONES ADICIONALES ===
    validateTaskData(taskData) {
        const errors = [];
        
        if (!taskData.name || taskData.name.trim().length === 0) {
            errors.push('El nombre de la tarea es requerido');
        }
        
        if (taskData.name && taskData.name.length > 100) {
            errors.push('El nombre de la tarea no puede exceder 100 caracteres');
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    validateModuleData(moduleData) {
        const errors = [];
        
        if (!moduleData.name || moduleData.name.trim().length === 0) {
            errors.push('El nombre del módulo es requerido');
        }
        
        if (moduleData.name && moduleData.name.length > 100) {
            errors.push('El nombre del módulo no puede exceder 100 caracteres');
        }
        
        const validCategories = ['Frontend', 'Backend', 'Base de Datos', 'API', 'Integración', 'Otros'];
        if (moduleData.category && !validCategories.includes(moduleData.category)) {
            errors.push('Categoría no válida');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // === MANTENIMIENTO DE DATOS ===
    cleanupOldData(daysOld = 365) {
        const cutoffDate = new Date(Date.now() - (daysOld * 24 * 60 * 60 * 1000));
        
        // Limpiar reportes antiguos con estado "Rechazado"
        const reports = this.getReports();
        let cleanedReports = 0;
        
        Object.keys(reports).forEach(reportId => {
            const report = reports[reportId];
            const reportDate = new Date(report.createdAt);
            
            if (report.status === 'Rechazado' && reportDate < cutoffDate) {
                delete reports[reportId];
                cleanedReports++;
            }
        });
        
        if (cleanedReports > 0) {
            this.setData('reports', reports);
        }
        
        // Limpiar tareas completadas muy antiguas
        const tasks = this.getTasks();
        let cleanedTasks = 0;
        
        Object.keys(tasks).forEach(taskId => {
            const task = tasks[taskId];
            const taskDate = new Date(task.createdAt);
            
            if (task.status === 'Completada' && taskDate < cutoffDate) {
                delete tasks[taskId];
                cleanedTasks++;
            }
        });
        
        if (cleanedTasks > 0) {
            this.setData('tasks', tasks);
        }
        
        return {
            success: true,
            message: `Limpieza completada: ${cleanedReports} reportes y ${cleanedTasks} tareas eliminadas`
        };
    }

    // === BACKUP Y RESTAURACIÓN ===
    createBackup() {
        const backupData = {
            timestamp: new Date().toISOString(),
            data: {
                users: this.getUsers(),
                companies: this.getCompanies(),
                projects: this.getProjects(),
                assignments: this.getAssignments(),
                reports: this.getReports(),
                tasks: this.getTasks(),
                modules: this.getModules()
            },
            stats: this.getStats(),
            version: '2.0'
        };
        
        // Guardar backup en localStorage
        const backupKey = `backup_${Date.now()}`;
        this.setData(backupKey, backupData);
        
        return {
            success: true,
            backupKey: backupKey,
            message: 'Backup creado correctamente'
        };
    }

    listBackups() {
        const allKeys = Object.keys(localStorage);
        const backupKeys = allKeys.filter(key => key.startsWith(this.prefix + 'backup_'));
        
        const backups = backupKeys.map(key => {
            const backup = this.getData(key.replace(this.prefix, ''));
            return {
                key: key,
                timestamp: backup.timestamp,
                stats: backup.stats
            };
        });
        
        return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    restoreBackup(backupKey) {
        try {
            const backup = this.getData(backupKey.replace(this.prefix, ''));
            
            if (!backup || !backup.data) {
                return { success: false, message: 'Backup no válido' };
            }
            
            // Restaurar todos los datos
            Object.keys(backup.data).forEach(dataType => {
                this.setData(dataType, backup.data[dataType]);
            });
            
            return { success: true, message: 'Backup restaurado correctamente' };
        } catch (error) {
            return { success: false, message: 'Error al restaurar backup: ' + error.message };
        }
    }

    deleteBackup(backupKey) {
        return this.deleteData(backupKey.replace(this.prefix, ''));
    }

    // === MÉTRICAS Y ANALYTICS ===
    getProductivityMetrics() {
        const tasks = Object.values(this.getTasks());
        const modules = Object.values(this.getModules());
        
        // Calcular métricas de tareas
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Completada').length;
        const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;
        
        // Calcular métricas de módulos
        const totalModules = modules.length;
        const completedModules = modules.filter(m => m.status === 'Completado').length;
        const moduleCompletionRate = totalModules > 0 ? (completedModules / totalModules * 100).toFixed(1) : 0;
        
        // Módulos por categoría
        const modulesByCategory = {
            frontend: modules.filter(m => m.category === 'Frontend').length,
            backend: modules.filter(m => m.category === 'Backend').length,
            database: modules.filter(m => m.category === 'Base de Datos').length,
            api: modules.filter(m => m.category === 'API').length,
            integration: modules.filter(m => m.category === 'Integración').length,
            others: modules.filter(m => m.category === 'Otros').length
        };
        
        return {
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                completionRate: taskCompletionRate,
                byPriority: tasksByPriority
            },
            modules: {
                total: totalModules,
                completed: completedModules,
                completionRate: moduleCompletionRate,
                byCategory: modulesByCategory
            },
            generatedAt: new Date().toISOString()
        };
    }
}

// Crear instancia global de la base de datos
window.PortalDB = new PortalDatabase();