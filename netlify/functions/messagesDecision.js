let acceptedMessages = []; // Θα χρησιμοποιήσουμε αυτή τη λίστα για να κρατάμε τις αποδεκτές αποφάσεις

exports.handler = async function (event, context) {
    // Ελέγχουμε αν το αίτημα είναι τύπου POST
    if (event.httpMethod === 'POST') {
        try {
            // Αναλύουμε το σώμα του αιτήματος
            const body = JSON.parse(event.body);
            const { message, decision } = body;

            // Αν η απόφαση είναι Αποδοχή, αποθηκεύουμε το μήνυμα στη λίστα
            if (decision === 'accept') {
                acceptedMessages.push({ message: message, decision: 'Αποδοχή' });
            }

            // Αν η απόφαση είναι Απόρριψη, αφαιρούμε το μήνυμα από τη λίστα
            if (decision === 'reject') {
                acceptedMessages = acceptedMessages.filter(msg => msg.message !== message);
            }

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
    } else if (event.httpMethod === 'GET') {
        // Αν το αίτημα είναι GET, επιστρέφουμε τις αποδεκτές αποφάσεις
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                decisions: acceptedMessages // Επιστρέφουμε μόνο τις αποδεκτές αποφάσεις
            })
        };
    } else {
        // Αν το αίτημα δεν είναι POST ή GET, επιστρέφουμε 405 (Method Not Allowed)
        return {
            statusCode: 405,
            body: JSON.stringify({
                success: false,
                message: 'Method Not Allowed'
            })
        };
    }
};
