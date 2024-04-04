document.getElementById('sendButton').addEventListener('click', function() {
    var userInput = document.getElementById('userInput').value;
    if (userInput) {
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
            displayMessage(userInput, 'user'); // Affiche le message de l'utilisateur

            // Vérifie si la réponse inclut du contenu textuel
            if (data.reply) {
                displayMessage(data.reply, 'bot'); // Affiche la réponse du bot
            }

            // Vérifie si une URL d'image est présente et l'affiche
            if (data.imageUrl) {
                displayImage(data.imageUrl);
            }

            document.getElementById('userInput').value = ''; // Efface l'input après envoi
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage("Une erreur est survenue.", 'bot');
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

function displayImage(imageUrl) {
    var messagesContainer = document.getElementById('messages');
    var img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'image-response'; // Assurez-vous d'ajouter du CSS pour cette classe si nécessaire
    messagesContainer.appendChild(img);
    scrollToBottom(messagesContainer);
}

function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}