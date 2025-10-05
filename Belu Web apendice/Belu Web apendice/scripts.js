// ========== FUNCIONES PARA RENDERIZADO DE CONTENIDO ==========

// Función mejorada para renderizar tablas
function renderTable(tableData, className = '') {
    console.log('Renderizando tabla:', tableData);
    
    if (!tableData || !tableData.headers || !tableData.rows) {
        console.error('Datos de tabla inválidos:', tableData);
        return document.createElement('div');
    }
    
    const tableElement = document.createElement('table');
    tableElement.className = `article-table ${className}`.trim();
    
    // Crear caption si hay título
    if (tableData.title && tableData.title !== "undefined") {
        const caption = document.createElement('caption');
        caption.textContent = tableData.title;
        tableElement.appendChild(caption);
    }
    
    // Crear encabezados
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    tableData.headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    tableElement.appendChild(thead);
    
    // Crear filas de datos
    const tbody = document.createElement('tbody');
    
    tableData.rows.forEach(row => {
        const tr = document.createElement('tr');
        
        row.forEach(cell => {
            const td = document.createElement('td');
            
            // Manejar diferentes tipos de contenido en celdas
            if (typeof cell === 'string') {
                // Procesar texto con saltos de línea
                const lines = cell.split('\n').filter(line => line.trim());
                
                if (lines.length > 1) {
                    lines.forEach((line, index) => {
                        if (index > 0) {
                            td.appendChild(document.createElement('br'));
                        }
                        
                        if (line.trim().startsWith('-')) {
                            // Es un elemento de lista
                            if (!td.querySelector('ul')) {
                                const ul = document.createElement('ul');
                                td.appendChild(ul);
                            }
                            const li = document.createElement('li');
                            li.textContent = line.replace('-', '').trim();
                            td.querySelector('ul').appendChild(li);
                        } else {
                            // Texto normal
                            td.appendChild(document.createTextNode(line.trim()));
                        }
                    });
                } else {
                    // Texto simple
                    if (cell.trim().startsWith('-')) {
                        const ul = document.createElement('ul');
                        const li = document.createElement('li');
                        li.textContent = cell.replace('-', '').trim();
                        ul.appendChild(li);
                        td.appendChild(ul);
                    } else {
                        td.textContent = cell;
                    }
                }
            } else {
                td.textContent = String(cell);
            }
            
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
    
    tableElement.appendChild(tbody);
    return tableElement;
}

// Función para crear contenedores de tabla
function createTableContainer(tableElement) {
    const container = document.createElement('div');
    container.className = 'table-container';
    container.appendChild(tableElement);
    return container;
}

// Función principal mejorada para renderizar artículos
function renderArticle(article) {
    const container = document.getElementById('article-content');
    if (!container) {
        console.error('No se encontró el contenedor article-content');
        return;
    }
    
    console.log('Renderizando artículo:', article);
    
    container.innerHTML = '';
    
    // Verificar que el artículo tenga secciones
    if (!article.sections || !Array.isArray(article.sections)) {
        console.error('El artículo no tiene secciones válidas:', article);
        return;
    }
    
    article.sections.forEach(section => {
        console.log('Procesando sección:', section);
        
        const sectionElement = document.createElement('section');
        sectionElement.id = section.id;
        
        // Solo agregar título si no es "undefined"
        if (section.title && section.title !== "undefined") {
            sectionElement.innerHTML = `<h2>${section.title}</h2>`;
        }
        
        // Renderizar contenido
        if (section.content) {
            if (Array.isArray(section.content)) {
                section.content.forEach(paragraph => {
                    if (paragraph && paragraph.trim() && paragraph !== "undefined") {
                        const p = document.createElement('p');
                        p.textContent = paragraph;
                        sectionElement.appendChild(p);
                    }
                });
            } else if (typeof section.content === 'string' && section.content !== "undefined") {
                const p = document.createElement('p');
                p.textContent = section.content;
                sectionElement.appendChild(p);
            }
        }
        
        // Renderizar items
        if (section.items && Array.isArray(section.items)) {
            const ul = document.createElement('ul');
            section.items.forEach(item => {
                if (item && item !== "undefined") {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                }
            });
            if (ul.children.length > 0) {
                sectionElement.appendChild(ul);
            }
        }
        
        // Renderizar tabla individual
        if (section.table) {
            console.log('Encontré tabla individual:', section.table);
            try {
                const tableElement = renderTable(section.table);
                if (tableElement.children.length > 0) {
                    const tableContainer = createTableContainer(tableElement);
                    sectionElement.appendChild(tableContainer);
                }
            } catch (error) {
                console.error('Error renderizando tabla:', error, section.table);
            }
        }
        
        // Renderizar múltiples tablas
        if (section.tables && Array.isArray(section.tables)) {
            console.log('Encontré múltiples tablas:', section.tables);
            section.tables.forEach((tableData, index) => {
                try {
                    const tableElement = renderTable(tableData, 'table-compact');
                    if (tableElement.children.length > 0) {
                        const tableContainer = createTableContainer(tableElement);
                        sectionElement.appendChild(tableContainer);
                    }
                } catch (error) {
                    console.error(`Error renderizando tabla ${index}:`, error, tableData);
                }
            });
        }
        
        // Renderizar contenido después de items/table
        if (section.content_after_items && Array.isArray(section.content_after_items)) {
            section.content_after_items.forEach(paragraph => {
                if (paragraph && paragraph.trim() && paragraph !== "undefined") {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    sectionElement.appendChild(p);
                }
            });
        }
        
        if (section.content_after_table && Array.isArray(section.content_after_table)) {
            section.content_after_table.forEach(paragraph => {
                if (paragraph && paragraph.trim() && paragraph !== "undefined") {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    sectionElement.appendChild(p);
                }
            });
        }
        
        // Renderizar imágenes
        if (section.image) {
            if (Array.isArray(section.image)) {
                section.image.forEach(img => {
                    if (img && img !== "undefined") {
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'image-container';
                        
                        const imgElement = document.createElement('img');
                        imgElement.src = `assets/${img}`;
                        imgElement.alt = section.title || 'Imagen';
                        imgElement.className = 'article-image';
                        
                        imgContainer.appendChild(imgElement);
                        sectionElement.appendChild(imgContainer);
                    }
                });
            } else if (section.image !== "undefined") {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-container';
                
                const imgElement = document.createElement('img');
                imgElement.src = `assets/${section.image}`;
                imgElement.alt = section.title || 'Imagen';
                imgElement.className = 'article-image';
                
                imgContainer.appendChild(imgElement);
                sectionElement.appendChild(imgContainer);
            }
        }
        
        // Renderizar referencias
        if (section.references && Array.isArray(section.references)) {
            const referencesDiv = document.createElement('div');
            referencesDiv.className = 'references';
            
            const referencesTitle = document.createElement('h4');
            referencesTitle.textContent = 'Referencias';
            referencesDiv.appendChild(referencesTitle);
            
            const referencesList = document.createElement('ul');
            section.references.forEach(ref => {
                if (ref && ref.text && ref.text !== "undefined") {
                    const li = document.createElement('li');
                    if (ref.url) {
                        const link = document.createElement('a');
                        link.href = ref.url;
                        link.textContent = ref.text;
                        link.target = '_blank';
                        li.appendChild(link);
                    } else {
                        li.textContent = ref.text;
                    }
                    referencesList.appendChild(li);
                }
            });
            
            if (referencesList.children.length > 0) {
                referencesDiv.appendChild(referencesList);
                sectionElement.appendChild(referencesDiv);
            }
        }
        
        // Solo agregar la sección si tiene contenido
        if (sectionElement.children.length > (section.title && section.title !== "undefined" ? 1 : 0)) {
            container.appendChild(sectionElement);
        }
    });
}

// Función mejorada para cargar artículo
function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        console.error('No se encontró ID de artículo en la URL');
        // Mostrar mensaje al usuario
        const container = document.getElementById('article-content');
        if (container) {
            container.innerHTML = '<p>Error: No se especificó un artículo.</p>';
        }
        return;
    }
    
    console.log('Cargando artículo con ID:', articleId);
    
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('JSON cargado correctamente:', data);
            const article = data.articles.find(a => a.id === articleId);
            if (article) {
                document.title = `${article.title} - Viscerum Variata`;
                renderArticle(article);
            } else {
                console.error('No se encontró el artículo con ID:', articleId);
                const container = document.getElementById('article-content');
                if (container) {
                    container.innerHTML = `<p>Error: No se encontró el artículo "${articleId}".</p>`;
                }
            }
        })
        .catch(error => {
            console.error('Error cargando el artículo:', error);
            const container = document.getElementById('article-content');
            if (container) {
                container.innerHTML = '<p>Error al cargar el contenido. Por favor, recarga la página.</p>';
            }
        });
}

// Las demás funciones permanecen igual...
function renderIndexArticles(articles) {
    const container = document.getElementById('articles-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.innerHTML = `
            <a href="article.html?id=${article.id}" class="article-link">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
            </a>
        `;
        container.appendChild(articleElement);
    });
}

function loadRecentArticles(articles) {
    const container = document.getElementById('recent-articles');
    if (!container) return;
    
    container.innerHTML = '';
    
    const recent = articles.slice(0, 5);
    recent.forEach(article => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="article.html?id=${article.id}" class="index-link">${article.title}</a>`;
        container.appendChild(li);
    });
}

// ========== INICIALIZACIÓN ==========

// Cargar artículos en index.html
if (document.getElementById('articles-container')) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderIndexArticles(data.articles);
            if (document.getElementById('recent-articles')) {
                loadRecentArticles(data.articles);
            }
        })
        .catch(error => console.error('Error cargando artículos:', error));
}

// Cargar artículo específico en article.html
if (document.getElementById('article-content')) {
    loadArticle();
}

// El resto del código (botón volver arriba, modal, etc.) permanece igual...
const btnVolverArriba = document.getElementById('btn-volver-arriba');

function toggleBtnVolverArriba() {
    if (window.scrollY > 300) {
        btnVolverArriba.style.display = 'block';
    } else {
        btnVolverArriba.style.display = 'none';
    }
}

if (btnVolverArriba) {
    window.addEventListener('scroll', toggleBtnVolverArriba);
    
    btnVolverArriba.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    toggleBtnVolverArriba();
}

// Navegación suave para enlaces internos
document.querySelectorAll('.index-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Modal para imágenes
function initImageModal() {
    const modal = document.getElementById('image-modal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');
    
    const allImages = Array.from(document.querySelectorAll('.article-image'));
    let currentIndex = 0;
    
    function showImage(index) {
        if (index >= 0 && index < allImages.length) {
            const img = allImages[index];
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            currentIndex = index;
            
            if (modalCaption) {
                modalCaption.textContent = img.alt;
            }
        }
    }
    
    modalImg.addEventListener('click', function(e) {
        e.stopPropagation();
        showImage((currentIndex + 1) % allImages.length);
    });
    
    document.querySelectorAll('.article-image').forEach((img, index) => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            showImage(index);
        });
    });
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                showImage((currentIndex - 1 + allImages.length) % allImages.length);
            } else if (e.key === 'ArrowRight') {
                showImage((currentIndex + 1) % allImages.length);
            } else if (e.key === 'Escape') {
                modal.style.display = 'none';
            }
        }
    });
}

// ========== INICIALIZACIÓN DE LA PÁGINA ==========

// Cargar artículos en index.html
if (document.getElementById('articles-container')) {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el JSON: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            renderIndexArticles(data.articles);
            if (document.getElementById('recent-articles')) {
                loadRecentArticles(data.articles);
            }
        })
        .catch(error => console.error('Error cargando artículos:', error));
}

// Cargar artículo específico en article.html
if (document.getElementById('article-content')) {
    loadArticle();
}

// Inicializar modal de imágenes
if (document.getElementById('image-modal')) {
    initImageModal();
}

// Inicializar funcionalidades cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Viscerum Variata - Atlas Anatómico cargado correctamente');
});