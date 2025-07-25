async function loadGallery() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        const galleryContainer = document.getElementById('gallery-container');
        galleryContainer.innerHTML = '';
        
        data.articles.forEach(article => {
            if (article.sections && article.sections.some(section => section.image)) {
                const gallerySection = document.createElement('div');
                gallerySection.className = `gallery-section ${article.id}`;
                
                let galleryItems = '';
                
                article.sections.forEach(section => {
                    if (section.image) {
                        const images = Array.isArray(section.image) ? section.image : [section.image];
                        
                        images.forEach(img => {
                            galleryItems += `
                                <div class="gallery-item" data-category="${article.id}">
                                    <div class="gallery-image-container">
                                        <img src="assets/${img}" alt="${section.title}" class="gallery-image">
                                    </div>
                                    <div class="gallery-caption">
                                        <h3>${section.title}</h3>
                                        <p>${article.title}</p>
                                    </div>
                                </div>
                            `;
                        });
                    }
                });
                
                gallerySection.innerHTML = `
                    <h3 class="gallery-title">${article.title}</h3>
                    <div class="gallery-grid">
                        ${galleryItems}
                    </div>
                `;
                
                galleryContainer.appendChild(gallerySection);
            }
        });
        
        initGalleryEvents();
        
    } catch (error) {
        console.error('Error cargando la galería:', error);
        document.getElementById('gallery-container').innerHTML = '<p>Error cargando la galería de imágenes.</p>';
    }
}

function initGalleryEvents() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('.gallery-image');
            const title = this.querySelector('h3').textContent;
            const articleTitle = this.querySelector('p').textContent;
            
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalCaption.innerHTML = `<strong>${title}</strong> - ${articleTitle}`;
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
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            const sections = document.querySelectorAll('.gallery-section');
            
            sections.forEach(section => {
                if (filter === 'all' || section.classList.contains(filter)) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
    
    const btnVolverArriba = document.getElementById('btn-volver-arriba');
    
    if (btnVolverArriba) {
        function toggleBtnVolverArriba() {
            if (window.scrollY > 300) {
                btnVolverArriba.style.display = 'block';
            } else {
                btnVolverArriba.style.display = 'none';
            }
        }
        
        window.addEventListener('scroll', toggleBtnVolverArriba);
        
        btnVolverArriba.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        toggleBtnVolverArriba();
    }
});