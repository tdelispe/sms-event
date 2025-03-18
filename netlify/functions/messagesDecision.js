let acceptedMessages = []; // Κρατάμε μόνο τα μηνύματα

exports.handler = async function (event, context) {
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);
            const { message, decision } = body;

            if (decision === 'accept') {
                acceptedMessages.push(message); // Αποθηκεύουμε μόνο το μήνυμα
            }

            if (decision === 'reject') {
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
                decisions: acceptedMessages // Επιστρέφουμε μόνο τα μηνύματα
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
