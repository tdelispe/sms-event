// netlify/functions/messages.js

let messages = []; // Ο πίνακας των μηνυμάτων

exports.handler = async function (event, context) {
    if (event.httpMethod === 'GET') {
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
