let acceptedMessages = [];  // Κρατάμε μόνο τα μηνύματα, χωρίς την απόφαση

exports.handler = async function (event, context) {
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);
            const { message, decision } = body;

            // Αποδεχόμαστε μόνο τα μηνύματα, ανεξαρτήτως απόφασης
            if (decision === 'accept') {
                // Αποθηκεύουμε μόνο το μήνυμα χωρίς να κρατάμε το decision
                acceptedMessages.push(message);
            }

            if (decision === 'reject') {
                // Αφαιρούμε το μήνυμα αν έχει γίνει απόρριψη
                acceptedMessages = acceptedMessages.filter(msg => msg !== message);
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: `Η απόφαση για το μήνυμα καταχωρήθηκε επιτυχώς`
                })
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    success: false,
                    message: 'Σφάλμα κατά την καταχώρηση της απόφασης.'
                })
            };
        }
    } else if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                acceptedMessages: acceptedMessages  // Επιστρέφουμε μόνο τα αποδεκτά μηνύματα
            })
        };
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({
                success: false,
                message: 'Method Not Allowed'
            })
        };
    }
};
