let messages = [];  // Ένας πίνακας για να κρατάμε τα μηνύματα
let acceptedMessages = []; // Πίνακας με τα εγκεκριμένα μηνύματα

// Αυτή η συνάρτηση χειρίζεται τα αιτήματα POST και GET
exports.handler = async function (event, context) {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const message = body.message;
        const decision = body.decision;  // Απόφαση για αποδοχή ή απόρριψη
        const messageId = body.messageId;  // Το ID του μηνύματος που αποστέλλεται για απόφαση

        console.log("Μήνυμα από τον χρήστη:", message, "Απόφαση:", decision, "ID:", messageId);

        // Αν το μήνυμα έχει μόνο message και όχι messageId
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
        
        // Αν το μήνυμα έχει messageId και message
        else if (messageId && message) {
            // Βρίσκουμε αν το μήνυμα με το συγκεκριμένο messageId υπάρχει ήδη
            const messageIndex = messages.findIndex(msg => msg.id === messageId);
            if (messageIndex === -1) {
                // Αν το μήνυμα δεν υπάρχει ήδη, το προσθέτουμε σαν νέο μήνυμα
                const newMessage = {
                    id: messageId,  // Χρησιμοποιούμε το υπάρχον messageId
                    message: message
                };
                messages.push(newMessage);
                console.log(`Το νέο μήνυμα με ID: ${messageId} προστέθηκε.`);
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        success: true,
                        message: `Το νέο μήνυμα με ID: ${messageId} προστέθηκε.`
                    })
                };
            } else {
                // Αν το μήνυμα υπάρχει ήδη, το αφήνουμε αμετάβλητο
                return {
                    statusCode: 400,  // Bad request γιατί δεν επιτρέπεται η ανανέωση του μηνύματος
                    body: JSON.stringify({
                        success:
