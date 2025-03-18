let messages = [];  // Λίστα για να κρατάμε τα μηνύματα

exports.handler = async function (event, context) {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const message = body.message;
        const decision = body.decision;  // Απόφαση για αποδοχή ή απόρριψη
        const messageId = body.messageId; // Το ID του μηνύματος

        console.log("Μήνυμα από τον χρήστη:", message, "Απόφαση:", decision, "ID:", messageId);

        // Αν υπάρχει απόφαση, διαγράφουμε το μήνυμα με βάση το ID
        if (decision && messageId) {
            // Εύρεση του μηνύματος με το συγκεκριμένο ID
            const messageIndex = messages.findIndex(m => m.id === messageId);
            if (messageIndex > -1) {
                messages.splice(messageIndex, 1);  // Διαγραφή του μηνύματος
                console.log(`Το μήνυμα με ID '${messageId}' διαγράφηκε.`);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: `Η απόφαση για το μήνυμα '${message}' καταχωρήθηκε ως '${decision}' και το μήνυμα διαγράφηκε.`
            })
        };
    } else if (event.httpMethod === 'GET') {
        // Επιστρέφουμε τα μηνύματα με ID όταν ζητηθούν μέσω GET
        return {
            statusCode: 200,
            body: JSON.stringify({ messages }) // Επιστρέφουμε τα μηνύματα
        };
    } else {
        return {
            statusCode: 405, // Method Not Allowed
            body: JSON.stringify({ message: "Μόνο POST ή GET αιτήματα υποστηρίζονται" })
        };
    }
};
