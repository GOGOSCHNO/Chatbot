// Fonction du carrousel
const carousel = document.querySelector('.carousel');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
let currentIndex = 0;

function updateCarousel() {
    const width = carousel.offsetWidth;
    carousel.style.transform = `translateX(${-width * currentIndex}px)`;
}

prevButton.addEventListener('click', () => {
    const items = document.querySelectorAll('.photo-item').length;
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : items - 1;
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    const items = document.querySelectorAll('.photo-item').length;
    currentIndex = (currentIndex < items - 1) ? currentIndex + 1 : 0;
    updateCarousel();
});

window.addEventListener('resize', updateCarousel);

// Fonction pour basculer l'affichage du menu déroulant
function toggleDropdown() {
    var dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
}

// Défilement fluide pour les liens dans le menu déroulant
document.querySelectorAll('.dropdown-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.classList.contains('orderNowButton')) {
            // Laisser le lien s'ouvrir normalement pour les boutons "Order Now"
            return;
        }
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        toggleDropdown(); // Fermer le menu après avoir cliqué
    });
});

// Fonction pour le défilement fluide vers une cible
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Ajout d'écouteurs d'événements pour les boutons de navigation
document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        smoothScroll(this.getAttribute('href'));
    });
});

// Fonction pour détecter les appareils mobiles
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

document.querySelector('.nav-button[href="#chatbot"]').addEventListener('click', function() {
    document.getElementById('chat-popup').classList.add('expanded');
});

document.addEventListener('DOMContentLoaded', function() {
    var chatPopup = document.getElementById('chat-popup');
    var chatIcon = document.getElementById('chat-icon');
    var chatIframe = document.getElementById('chat-iframe');

    // Fonction pour afficher ou masquer le pop-up du chatbot
    document.getElementById('chat-icon').addEventListener('click', function() {
        if (chatPopup.classList.contains('show')) {
            chatPopup.classList.remove('show');
            setTimeout(function() {
                chatPopup.style.display = 'none';
            }, 300); // Délai pour laisser le temps à l'animation de se terminer
            chatIcon.style.display = 'block';
        } else {
            chatPopup.style.display = 'block';
            setTimeout(function() {
                chatPopup.classList.add('show');
            }, 10); // Délai pour laisser le temps à l'élément de passer en display:block
            chatIcon.style.display = 'none';
        }
    });

    // Événement pour fermer le pop-up du chatbot lorsque l'utilisateur clique en dehors
    window.addEventListener('click', function(event) {
        var dropdownMenu = document.getElementById('dropdown-menu');
        if (event.target !== chatPopup && !chatPopup.contains(event.target) && event.target !== chatIcon && !chatIcon.contains(event.target) && event.target !== dropdownMenu && !dropdownMenu.contains(event.target)) {
            chatPopup.classList.remove('show');
            setTimeout(function() {
                chatPopup.style.display = 'none';
            }, 300); // Délai pour laisser le temps à l'animation de se terminer
            chatIcon.style.display = 'block';
            dropdownMenu.style.display = 'none';
        }
    });

    // Fonction pour agrandir ou réduire le pop-up du chatbot
    document.getElementById('expand-button').addEventListener('click', function() {
        if (chatPopup.style.width === '650px') {
            chatPopup.style.width = '400px';
            chatPopup.style.height = '600px';
        } else {
            chatPopup.style.width = '650px';
            chatPopup.style.height = '87%';
        }
    });

    // Fonction pour afficher ou masquer le menu déroulant
    document.getElementById('menu-button').addEventListener('click', function(event) {
        var dropdownMenu = document.getElementById('dropdown-menu');
        if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
            dropdownMenu.style.display = 'block';
        } else {
            dropdownMenu.style.display = 'none';
        }
        event.stopPropagation();
    });

    // Fonction pour minimiser le pop-up du chatbot
    document.getElementById('minimize-button').addEventListener('click', function() {
        chatPopup.classList.remove('show');
        setTimeout(function() {
            chatPopup.style.display = 'none';
        }, 300); // Délai pour laisser le temps à l'animation de se terminer
        chatIcon.style.display = 'block';
    });

    // Ajuster la hauteur du chatbot
    function adjustChatbotHeight() {
        if (isMobileDevice()) {
            const viewportHeight = window.innerHeight;
            chatPopup.style.height = `${viewportHeight}px`;
        }
    }

    // Appeler cette fonction lors du redimensionnement de la fenêtre
    window.addEventListener('resize', adjustChatbotHeight);

    // Appeler cette fonction une fois lors du chargement de la page pour s'assurer que le chatbot est dimensionné correctement
    window.addEventListener('load', adjustChatbotHeight);

    // Assurez-vous que displayWelcomeMessage est accessible globalement
    window.displayWelcomeMessage = displayWelcomeMessage;
});

// Fonction pour enregistrer les clics sur les boutons de promotion
function trackPromoClick(event) {
    const targetId = event.target.id;
    gtag('event', 'promo_click', {
        'event_category': 'Promotion',
        'event_label': targetId,
        'value': 1
    });
}

// Ajout d'écouteurs d'événements pour les boutons de promotion
document.getElementById('orderNowButton').addEventListener('click', trackPromoClick);
document.getElementById('promoImage1').addEventListener('click', trackPromoClick);
document.getElementById('promoImage2').addEventListener('click', trackPromoClick);
document.getElementById('promoImage3').addEventListener('click', trackPromoClick);
