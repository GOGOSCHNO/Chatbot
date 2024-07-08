function toggleDropdown() {
    var dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
}

// Smooth scrolling
document.querySelectorAll('.dropdown-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.classList.contains('orderNowButton')) {
            // Laisser le lien s'ouvrir normalement pour les boutons Order Now
            return;
        }
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        toggleDropdown(); // Fermer le menu après avoir cliqué
    });
});

// Fonction pour le défilement fluide
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

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function adjustChatbotHeight() {
    if (isMobileDevice()) {
        const chatbotContainer = document.getElementById('chatbot');
        const viewportHeight = window.innerHeight;
        chatbotContainer.style.height = `${viewportHeight}px`;
    }
}

// Appeler cette fonction lors du redimensionnement de la fenêtre
window.addEventListener('resize', adjustChatbotHeight);

// Appeler cette fonction une fois lors du chargement de la page pour s'assurer que le chatbot est dimensionné correctement
window.addEventListener('load', adjustChatbotHeight);

function sendUserInput() {
    var userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== '') {
        displayMessage(userInput, 'user');
        document.getElementById('userInput').value = '';

        const typingIndicator = showTypingIndicator();

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
            hideTypingIndicator(typingIndicator);
            if (typeof data.reply === 'string') {
                typeMessage(data.reply, 'bot');
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
            hideTypingIndicator(typingIndicator);
            console.error('Error:', error);
            displayMessage("Une erreur est survenue lors de la connexion au serveur.", 'bot');
        });

        // Masquer les boutons de questions après l'envoi
        document.querySelector('.question-buttons').style.display = 'none';
    }
}

// Événement pour le bouton "Envoyer"
document.getElementById('sendButton').addEventListener('click', sendUserInput);

// Événement pour la touche "Entrée"
document.getElementById('userInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendUserInput();
    }
});

// Ajout de la fonction pour afficher le message d'accueil
function displayWelcomeMessage() {
    const welcomeMessage = "Welcome! I'm Paul, your dedicated virtual assistant for Puravive. How can I help you on your weight loss journey today?";
    const typingIndicator = showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator(typingIndicator);
        displayMessage(welcomeMessage, 'bot');
    }, 2000); // Ajouter une latence de 2 secondes
}

// Fonction pour afficher un message dans le conteneur de messages
function displayMessage(message, sender) {
    var messagesContainer = document.getElementById('messages');
    var messageDiv = document.createElement('div');
    messageDiv.className = sender;
    messageDiv.innerHTML = formatMessage(message);  // Appliquer le formatage du message
    messagesContainer.appendChild(messageDiv);
    scrollToBottom(messagesContainer);
}

// Appel de la fonction d'affichage du message d'accueil dès que la page est chargée
window.addEventListener('load', displayWelcomeMessage);

function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

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

function showTypingIndicator() {
    const container = document.getElementById('messages');
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    container.appendChild(indicator);
    scrollToBottom(container);
    return indicator;
}

function hideTypingIndicator(indicator) {
    if (indicator) {
        indicator.remove();
    }
}

// Ajout de la fonction typeMessage pour afficher les réponses du bot
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
    displayMessage(question, 'user');
    const typingIndicator = showTypingIndicator();

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
        hideTypingIndicator(typingIndicator);
        if (typeof data.reply === 'string') {
            typeMessage(data.reply, 'bot');
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
        hideTypingIndicator(typingIndicator);
        console.error('Error:', error);
        displayMessage("Une erreur est survenue lors de la connexion au serveur.", 'bot');
    });

    // Masquer les boutons de questions après l'envoi
    document.querySelector('.question-buttons').style.display = 'none';
}

// Fonction pour enregistrer les clics sur les boutons de promotion
function trackPromoClick(event) {
    const targetId = event.target.id;
    gtag('event', 'promo_click', {
        'event_category': 'Promotion',
        'event_label': targetId,
        'value': 1
    });
}
document.getElementById('chat-icon').addEventListener('click', function() {
    var chatPopup = document.getElementById('chat-popup');
    if (chatPopup.style.display === 'none' || chatPopup.style.display === '') {
        chatPopup.style.display = 'block';
    } else {
        chatPopup.style.display = 'none';
    }
});

window.addEventListener('click', function(event) {
    var chatPopup = document.getElementById('chat-popup');
    var chatIcon = document.getElementById('chat-icon');
    if (event.target !== chatPopup && !chatPopup.contains(event.target) && event.target !== chatIcon && !chatIcon.contains(event.target)) {
        chatPopup.style.display = 'none';
    }
});


// Ajout d'écouteurs d'événements pour les boutons de promotion
document.getElementById('orderNowButton').addEventListener('click', trackPromoClick);
document.getElementById('promoImage1').addEventListener('click', trackPromoClick);
document.getElementById('promoImage2').addEventListener('click', trackPromoClick);
document.getElementById('promoImage3').addEventListener('click', trackPromoClick);
