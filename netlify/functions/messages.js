let messages = []; // Ο πίνακας των μηνυμάτων

exports.handler = async function (event, context) {
    if (event.httpMethod === 'GET') {
        console.log('Αποστολή μηνυμάτων:', messages); // Προσθήκη log για να ελέγξουμε τι στέλνουμε
        return {
            statusCode: 200,
            body: JSON.stringify({ messages }) // Επιστρέφουμε τα μηνύματα
        };
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Μόνο GET αιτήματα υποστηρίζονται" })
        };
    }
};
