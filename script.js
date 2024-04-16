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
            console.log("Data received from server:", data); // Pour le débogage

            // Vérifie si la réponse est une chaîne de caractères
            if (typeof data.reply === 'string') {
                displayMessage(data.reply, 'bot'); // Affiche la réponse du bot
            } else {
                // Si la réponse n'est pas une chaîne, stringify l'objet pour débogage
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
        // Assurez-vous de traiter correctement les lignes contenant des titres
        if (/^\*\*.+\*\*$/.test(trimmedLine)) {
            trimmedLine = trimmedLine.replace(/^\*\*(.+)\*\*$/, '<strong>$1</strong>');
        }

        if (trimmedLine.startsWith('-')) {
            if (!inList) {
                formattedMessage += '<ul>';
                inList = true;
            }
            formattedMessage += `<li>${trimmedLine.substring(1).trim()}</li>`;
        } else {
            if (inList) {
                formattedMessage += '</ul>';
                inList = false;
            }
            formattedMessage += `<p>${trimmedLine}</p>`;
        }
    });

    if (inList) {
        formattedMessage += '</ul>';
    }

    return formattedMessage;
}
