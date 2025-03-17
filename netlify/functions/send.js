let messages = []; // Ένας πίνακας για να κρατάμε τα μηνύματα

exports.handler = async function (event, context) {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const message = body.message;

        console.log("Μήνυμα από τον χρήστη:", message);

        // Αποθήκευση του μηνύματος στον πίνακα
        messages.push(message);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Το μήνυμα εστάλη επιτυχώς!" })
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
