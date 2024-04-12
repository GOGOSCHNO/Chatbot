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
            console.log("Data received from server:", data); // Pour le débogage

            displayMessage(userInput, 'user'); // Affiche le message de l'utilisateur

            // Vérifie si la réponse est une chaîne de caractères
            if (typeof data.reply === 'string') {
                displayMessage(data.reply, 'bot'); // Si 'reply' est une chaîne, l'affiche directement
            } else {
                // Si 'reply' n'est pas une chaîne, essaie de voir si c'est un objet et le stringify
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
