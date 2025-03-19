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
                        success: false,
                        message: `Το μήνυμα με ID: ${messageId} υπάρχει ήδη και δεν επιτρέπεται να ανανεωθεί.`
                    })
                };
            }
        }
        
        // Αν πρόκειται για την επεξεργασία απόφασης (accept/decline) για κάποιο μήνυμα
        else if (messageId && decision !== undefined) {
            const messageIndex = messages.findIndex(msg => msg.id === messageId);
            if (messageIndex > -1) {
                if (decision === 'decline') {
                    // Αν η απόφαση είναι "απόρριψη", διαγράφουμε το μήνυμα
                    messages.splice(messageIndex, 1);
                    console.log(`Το μήνυμα με ID: ${messageId} διαγράφηκε λόγω απόρριψης.`);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            success: true,
                            message: `Το μήνυμα με ID: ${messageId} διαγράφηκε λόγω απόρριψης.`
                        })
                    };
                } else if (decision === 'accept') {
                    // Αν η απόφαση είναι "αποδοχή", μεταφέρουμε το μήνυμα στη λίστα acceptedMessages
                    const acceptedMessage = messages.splice(messageIndex, 1)[0];  // Αφαιρούμε το μήνυμα από την λίστα messages
                    acceptedMessages.push(acceptedMessage);  // Το προσθέτουμε στη λίστα acceptedMessages
                    
                    console.log(`Το μήνυμα με ID: ${messageId} αποδεχτήκαμε και μεταφέρθηκε στη λίστα των αποδεκτών.`);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            success: true,
                            message: `Το μήνυμα με ID: ${messageId} αποδεχτήκαμε και μεταφέρθηκε στη λίστα αποδεκτών.`
                        })
                    };
                }
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Το μήνυμα δεν βρέθηκε." })
                };
            }
        }
    } else if (event.httpMethod === 'GET') {
        // Επιστρέφουμε τα αποδεκτά μηνύματα όταν ζητηθούν μέσω GET
        return {
            statusCode: 200,
            body: JSON.stringify({ messages })  // Επιστρέφουμε και τα μηνύματα και τα αποδεκτά μηνύματα
        };
    } else {
        return {
            statusCode: 405, // Method Not Allowed
            body: JSON.stringify({ message: "Μόνο POST ή GET αιτήματα υποστηρίζονται" })
        };
    }
};
