// Fonction pour envoyer le message de l'utilisateur
function sendUserInput() {
    var userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== '') {
        displayMessage(userInput, 'user'); // Afficher le message de l'utilisateur
        document.getElementById('userInput').value = ''; // Vider le champ de saisie

        const typingIndicator = showTypingIndicator(); // Afficher l'indicateur de saisie

        // Envoyer le message à l'API du chatbot
        fetch('https://ancient-island-80614-679de07529b5.herokuapp.com/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ message: userInput }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            hideTypingIndicator(typingIndicator); // Cacher l'indicateur de saisie
            if (typeof data.reply === 'string') {
                typeMessage(data.reply, 'bot'); // Afficher la réponse du bot
                // Envoyer un événement personnalisé à Google Analytics
                gtag('event', 'message_sent', {
                    'event_category': 'Chatbot',
                    'event_label': 'User Message Sent'
                });
            } else {
                displayMessage("Je suis désolé, je n'ai pas pu comprendre la réponse.", 'bot');
            }
        })
        .catch(error => {
            hideTypingIndicator(typingIndicator); // Cacher l'indicateur de saisie
            console.error('Error:', error);
            displayMessage("Une erreur est survenue lors de la connexion au serveur.", 'bot');
        });

        // Masquer les boutons de questions après l'envoi
        document.querySelector('.question-buttons').style.display = 'none';
    }
}

// Fonction pour afficher le message d'accueil
function displayWelcomeMessage() {
    const welcomeMessage = "Welcome! I'm Paul, your dedicated virtual assistant for Puravive. How can I help you on your weight loss journey today?";
    const typingIndicator = showTypingIndicator(); // Afficher l'indicateur de saisie
    
    setTimeout(() => {
        hideTypingIndicator(typingIndicator); // Cacher l'indicateur de saisie
        displayMessage(welcomeMessage, 'bot'); // Afficher le message d'accueil
    }, 2000); // Ajouter une latence de 2 secondes
}

// Fonction pour afficher un message dans le conteneur de messages
function displayMessage(message, sender) {
    var messagesContainer = document.getElementById('messages');
    var messageDiv = document.createElement('div');
    messageDiv.className = sender;
    messageDiv.innerHTML = formatMessage(message);  // Appliquer le formatage du message
    messagesContainer.appendChild(messageDiv);
    scrollToBottom(messagesContainer); // Faire défiler vers le bas
}

// Fonction pour faire défiler vers le bas du conteneur de messages
function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

// Fonction pour formater un message en HTML
function formatMessage(text) {
    const lines = text.split('\n');
    let formattedMessage = '';
    let inList = false;

    lines.forEach(line => {
        let trimmedLine = line.trim();

        // Convertir les motifs Markdown pour le gras (**texte**) en HTML <strong>
        trimmedLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Convertir les titres Markdown ### en HTML <h3>
        if (trimmedLine.startsWith('###')) {
            formattedMessage += `<h3>${trimmedLine.substring(3).trim()}</h3>`;
            return;
        }

        if (trimmedLine.startsWith('-')) {
            if (!inList) {
                formattedMessage += '<ul>'; // Commencer une nouvelle liste
                inList = true;
            }
            formattedMessage += `<li>${trimmedLine.substring(1).trim()}</li>`; // Ajouter l'élément de liste
        } else {
            if (inList) {
                formattedMessage += '</ul>'; // Fermer la liste si on n'est plus dans un élément de liste
                inList = false;
            }
            formattedMessage += `<p>${trimmedLine}</p>`; // Ajouter comme paragraphe
        }
    });

    if (inList) {
        formattedMessage += '</ul>'; // S'assurer que la liste est fermée à la fin
    }

    return formattedMessage;
}

// Fonction pour afficher l'indicateur de saisie
function showTypingIndicator() {
    const container = document.getElementById('messages');
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    container.appendChild(indicator);
    scrollToBottom(container);
    return indicator;
}

// Fonction pour cacher l'indicateur de saisie
function hideTypingIndicator(indicator) {
    if (indicator) {
        indicator.remove();
    }
}

// Fonction pour afficher les réponses du bot
function typeMessage(message, sender) {
    const messagesContainer = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender;
    messageDiv.innerHTML = formatMessage(message);  // Appliquer le formatage du message
    messagesContainer.appendChild(messageDiv);
    scrollToBottom(messagesContainer);
}

// Fonction pour envoyer une question prédéfinie et masquer les boutons de questions
function sendQuestion(question) {
    displayMessage(question, 'user'); // Afficher la question de l'utilisateur
    const typingIndicator = showTypingIndicator(); // Afficher l'indicateur de saisie

    // Envoyer la question à l'API du chatbot
    fetch('https://ancient-island-80614-679de07529b5.herokuapp.com/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: question }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        hideTypingIndicator(typingIndicator); // Cacher l'indicateur de saisie
        if (typeof data.reply === 'string') {
            typeMessage(data.reply, 'bot'); // Afficher la réponse du bot
            // Envoyer un événement personnalisé à Google Analytics
            gtag('event', 'message_sent', {
                'event_category': 'Chatbot',
                'event_label': 'User Question Sent'
            });
        } else {
            displayMessage("Je suis désolé, je n'ai pas pu comprendre la réponse.", 'bot');
        }
    })
    .catch(error => {
        hideTypingIndicator(typingIndicator); // Cacher l'indicateur de saisie
        console.error('Error:', error);
        displayMessage("Une erreur est survenue lors de la connexion au serveur.", 'bot');
    });

    // Masquer les boutons de questions après l'envoi
    document.querySelector('.question-buttons').style.display = 'none';
}
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

// Fonction pour ajuster la hauteur du chatbot sur les appareils mobiles
function adjustChatbotHeight() {
    if (isMobileDevice()) {
        const chatbotContainer = document.getElementById('chatbot');
        const viewportHeight = window.innerHeight;
        chatbotContainer.style.height = `${viewportHeight}px`;
    }
}

// Fonction pour afficher ou masquer le pop-up du chatbot
document.getElementById('chat-icon').addEventListener('click', function() {
    var chatPopup = document.getElementById('chat-popup');
    var chatIcon = document.getElementById('chat-icon');
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
    var chatPopup = document.getElementById('chat-popup');
    var chatIcon = document.getElementById('chat-icon');
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
    var chatPopup = document.getElementById('chat-popup');
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
    var chatPopup = document.getElementById('chat-popup');
    chatPopup.classList.remove('show');
    setTimeout(function() {
        chatPopup.style.display = 'none';
    }, 300); // Délai pour laisser le temps à l'animation de se terminer
    var chatIcon = document.getElementById('chat-icon');
    chatIcon.style.display = 'block';
});
// Appeler cette fonction lors du redimensionnement de la fenêtre
window.addEventListener('resize', adjustChatbotHeight);

// Appeler cette fonction une fois lors du chargement de la page pour s'assurer que le chatbot est dimensionné correctement
window.addEventListener('load', adjustChatbotHeight);

// Appel de la fonction d'affichage du message d'accueil dès que la page est chargée
window.addEventListener('load', displayWelcomeMessage);

// Événement pour le bouton "Envoyer"
document.getElementById('sendButton').addEventListener('click', sendUserInput);

// Événement pour la touche "Entrée"
document.getElementById('userInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendUserInput();
    }
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
