let messages = [];  // Ένας πίνακας για να κρατάμε τα μηνύματα

// Αυτή η συνάρτηση χειρίζεται τα αιτήματα POST και GET
exports.handler = async function (event, context) {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const message = body.message;
        const decision = body.decision;  // Απόφαση για αποδοχή ή απόρριψη
        const messageId = body.messageId;  // Το ID του μηνύματος που αποστέλλεται για απόφαση

        console.log("Μήνυμα από τον χρήστη:", message, "Απόφαση:", decision, "ID:", messageId);

        // Εάν το μήνυμα έχει ID, το αποθηκεύουμε στη λίστα messages
        if (!messageId) {
            // Εάν το ID δεν υπάρχει, δημιουργούμε ένα μοναδικό ID για το μήνυμα
            const newMessage = {
                id: Date.now(),  // Δημιουργία μοναδικού ID με βάση το χρόνο
                message: message
            };
            messages.push(newMessage);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: `Το μήνυμα '${message}' προστέθηκε με ID: ${newMessage.id}`
                })
            };
        } else {
            // Αν το ID υπάρχει, επεξεργαζόμαστε την απόφαση
            const messageIndex = messages.findIndex(msg => msg.id === messageId);
            if (messageIndex > -1) {
                messages.splice(messageIndex, 1);  // Διαγραφή του μηνύματος από τον πίνακα
                console.log(`Το μήνυμα με ID: ${messageId} διαγράφηκε.`);
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        success: true,
                        message: `Η απόφαση για το μήνυμα με ID: ${messageId} καταχωρήθηκε επιτυχώς και το μήνυμα διαγράφηκε.`
                    })
                };
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Το μήνυμα δεν βρέθηκε." })
                };
            }
        }
    } else if (event.httpMethod === 'GET') {
        // Επιστρέφουμε τα μηνύματα όταν ζητηθούν μέσω GET
        return {
            statusCode: 200,
            body: JSON.stringify({ messages })  // Επιστρέφουμε τα μηνύματα
        };
    } else {
        return {
            statusCode: 405, // Method Not Allowed
            body: JSON.stringify({ message: "Μόνο POST ή GET αιτήματα υποστηρίζονται" })
        };
    }
};
