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

if (document.getElementById('image-modal')) {
    initImageModal();
}