let messages = [];  // Ένας πίνακας για να κρατάμε τα μηνύματα

// Αυτή η συνάρτηση χειρίζεται τα αιτήματα POST και GET
exports.handler = async function (event, context) {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const message = body.message;
        const decision = body.decision;  // Απόφαση για αποδοχή ή απόρριψη
        const messageId = body.messageId;  // Το ID του μηνύματος που αποστέλλεται για απόφαση

        console.log("Μήνυμα από τον χρήστη:", message, "Απόφαση:", decision, "ID:", messageId);

        // Αν πρόκειται για την προσθήκη μηνύματος
        if (!messageId && message) {
            // Δημιουργία μοναδικού ID για το νέο μήνυμα
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
        }
        // Αν πρόκειται για την επεξεργασία απόφασης (accept/decline)
        else if (messageId && decision !== undefined) {
            // Βρίσκουμε το μήνυμα με το συγκεκριμένο ID
            const messageIndex = messages.findIndex(msg => msg.id === messageId);
            if (messageIndex > -1) {
                if (decision === 'decline') {
                    // Αν η απόφαση είναι "απόρριψη", διαγράφουμε το μήνυμα
                    messages.splice(messageIndex, 1);
                    console.log(`Το μήνυμα με ID: ${messageId} διαγράφηκε λόγω απόρριψης.`);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            success: true,
                            message: `Το μήνυμα με ID: ${messageId} διαγράφηκε λόγω απόρριψης.`
                        })
                    };
                } else if (decision === 'accept') {
                    // Αν η απόφαση είναι "αποδοχή", δεν κάνουμε τίποτα, το μήνυμα παραμένει
                    console.log(`Το μήνυμα με ID: ${messageId} αποδεχτήκαμε.`);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            success: true,
                            message: `Το μήνυμα με ID: ${messageId} αποδεχτήκαμε.`
                        })
                    };
                }
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
