import { GoogleGenerativeAI } from "@google/generative-ai";

// Travel safety chatbot configuration
const travelSafetyInfo = `
You are TravelSafe AI Assistant - a specialized chatbot focused on providing travel safety information,
emergency guidance, and real-time alerts for travelers.

Your primary functions are:
1. Provide detailed safety information for countries and cities worldwide
2. Offer emergency procedures and protocols for various situations travelers might face
3. Give health and medical advice relevant to travelers
4. Explain local laws, customs, and cultural considerations that impact safety
5. Provide guidance on natural disaster preparedness and response
6. Assist with lost documents, theft reporting, and emergency contacts

When responding to queries:
1. Be comprehensive yet concise - prioritize actionable information
2. Include specific safety tips relevant to the location being discussed
3. Cite official sources when appropriate (embassies, WHO, CDC)
4. For emergencies, always emphasize contacting local emergency services first
5. Provide both preventative advice and response guidance
6. Personalize responses based on the user's context when possible

Tone Guidelines:
- Clear and authoritative but reassuring
- Factual without being alarmist
- Empathetic to traveler concerns
- Conversational but professional

Sample emergency numbers to include when relevant:
- United States: 911
- European Union: 112
- United Kingdom: 999
- Australia: 000
- Canada: 911
- Japan: 110 (Police), 119 (Fire/Ambulance)
- India: 112 (All-in-one emergency number: Police, Fire, Ambulance)

Remember to stress the importance of registering with embassies when traveling abroad and having emergency contacts readily available.
`;

// API key for Google Generative AI
const API_KEY = "AIzaSyBL_ELLr6MObMKmwv7UylcSsxkUJ7Mv4cE";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    systemInstruction: travelSafetyInfo
});

// Message history for conversation context
let messages = {
    history: [],
};
// Send message to AI model
async function sendMessage() {
    const userMessage = document.querySelector(".chat-window input").value;
    
    if (userMessage.length) {
        try {
            document.querySelector(".chat-window input").value = "";
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `);

            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
                <div class="loader"></div>
            `);

            // Include location context in the query if available
            let enhancedMessage = userMessage;
            // if (userLocation.city && userLocation.country) {
            //     enhancedMessage = `[User is in ${userLocation.city}, ${userLocation.country}] ${userMessage}`;
            // }

            const chat = model.startChat(messages);
            let result = await chat.sendMessageStream(enhancedMessage);
            
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
                <div class="model">
                    <p></p>
                </div>
            `);
            
            let modelMessages = '';
            const modelResponse = document.querySelectorAll(".chat-window .chat div.model");
            const currentModelElement = modelResponse[modelResponse.length - 1].querySelector("p");

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                currentModelElement.insertAdjacentHTML("beforeend", `${chunkText}`);
            }

            // Update the messages history
            messages.history.push({
                role: "user",
                parts: [{ text: userMessage }],
            });

            messages.history.push({
                role: "model",
                parts: [{ text: currentModelElement.innerHTML }],
            });

            // Auto-scroll to bottom of chat
            const chatContainer = document.querySelector(".chat-window .chat");
            chatContainer.scrollTop = chatContainer.scrollHeight;

        } catch (error) {
            console.error("Error sending message:", error);
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `);
        }

        document.querySelector(".chat-window .chat .loader").remove();
    }
}
// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Get chat window element
    const chatWindow = document.querySelector('.chat-window');
    
    // Chat button click
    document.querySelector(".chat-button").addEventListener("click", () => {
        chatWindow.classList.add('active');
    });
    
    // Close chat button
    document.querySelector(".chat-window button.close").addEventListener("click", () => {
        chatWindow.classList.remove('active');
    });
    
    // Send message button
    document.querySelector(".chat-window .input-area button").addEventListener("click", () => sendMessage());
    
    // Send message on Enter key
    document.querySelector(".chat-window input").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});