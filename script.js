document.getElementById('sendButton').addEventListener('click', function() {
    var userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== '') {
        displayMessage(userInput, 'user'); // Affiche le message de l'utilisateur dans le chat
        document.getElementById('userInput').value = ''; // Efface le champ de texte après l'envoi

        // Envoie userInput à votre serveur backend
        fetch('https://blooming-shore-69795-97715c61a60a.herokuapp.com/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
    console.log("Data received from server:", data);
    if (typeof data.reply === 'string') {
        typeMessage(data.reply, 'bot'); // Utiliser typeMessage pour simuler la frappe
    } else {
        console.log("Reply from server is not a string:", JSON.stringify(data.reply, null, 2));
        displayMessage("Je suis désolé, je n'ai pas pu comprendre la réponse.", 'bot');
    }
})
.catch(error => {
    console.error('Error:', error);
    displayMessage("Une erreur est survenue lors de la connexion au serveur.", 'bot');
});
    }
});

function displayMessage(message, sender) {
    var messagesContainer = document.getElementById('messages');
    var messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = sender; // 'user' ou 'bot'
    messagesContainer.appendChild(messageDiv);
    scrollToBottom(messagesContainer);
}

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
function typeMessage(message, sender) {
    let index = 0;
    const container = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender; // 'user' ou 'bot'
    container.appendChild(messageDiv);

    function typeChar() {
        if (index < message.length) {
            messageDiv.textContent += message.charAt(index);
            index++;
            setTimeout(typeChar, 30); // Règle ici la vitesse de "frappe"
        }
        scrollToBottom(container);
    }

    typeChar();
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
