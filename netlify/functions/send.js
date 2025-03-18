let messages = []; // Ένας πίνακας για να κρατάμε τα μηνύματα

exports.handler = async function (event, context) {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const message = body.message;
        const decision = body.decision;  // Απόφαση για αποδοχή ή απόρριψη

        console.log("Μήνυμα από τον χρήστη:", message, "Απόφαση:", decision);

        // Διαγραφή του μηνύματος από τον πίνακα ανεξαρτήτως της απόφασης
        const messageIndex = messages.indexOf(message);
        if (messageIndex > -1) {
            messages.splice(messageIndex, 1);  // Διαγραφή του μηνύματος από τον πίνακα
            console.log(`Το μήνυμα '${message}' διαγράφηκε.`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: `Η απόφαση για το μήνυμα '${message}' καταχωρήθηκε επιτυχώς ως '${decision}' και το μήνυμα διαγράφηκε.`
            })
        };
    } else if (event.httpMethod === 'GET') {
        // Επιστρέφουμε τα μηνύματα όταν ζητηθούν μέσω GET
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
