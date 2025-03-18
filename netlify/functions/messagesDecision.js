// netlify/functions/messagesDecision.js

exports.handler = async function (event, context) {
    // Ελέγχουμε αν το αίτημα είναι τύπου POST
    if (event.httpMethod === 'POST') {
        try {
            // Αναλύουμε το σώμα του αιτήματος
            const body = JSON.parse(event.body);
            const { message, decision } = body;

            // Απλά τυπώνουμε την απόφαση στη κονσόλα (όχι αποθήκευση)
            console.log(`Μήνυμα: ${message}, Απόφαση: ${decision}`);

            // Επιστρέφουμε μια επιτυχία
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: `Η απόφαση για το μήνυμα '${message}' καταχωρήθηκε επιτυχώς ως '${decision}'`
                })
            };
        } catch (error) {
            // Αν υπάρχει σφάλμα, επιστρέφουμε μήνυμα σφάλματος
            return {
                statusCode: 500,
                body: JSON.stringify({
                    success: false,
                    message: 'Σφάλμα κατά την καταχώρηση της απόφασης.'
                })
            };
        }
    } else {
        // Αν το αίτημα δεν είναι POST, επιστρέφουμε 405 (Method Not Allowed)
        return {
            statusCode: 405,
            body: JSON.stringify({
                success: false,
                message: 'Method Not Allowed'
            })
        };
    }
};
