import { GoogleGenerativeAI } from "@google/generative-ai";

const safetyAssistantInfo = `
You are an Emergency and Safety AI Assistant specialized in providing critical safety information and emergency guidance.

Your ONLY functions are:
1. Emergency response procedures and protocols
2. Natural disaster preparedness and response
3. First aid and medical emergency guidance
4. Fire safety and evacuation procedures
5. Workplace safety protocols
6. Home safety measures
7. Public safety guidelines
8. Emergency contact information
9. Disaster recovery steps
10. Safety equipment usage

IMPORTANT RULES:
1. ONLY respond to questions related to safety and emergencies
2. For non-safety questions, respond: "I am a Safety & Emergency Assistant. I can only help with safety-related questions and emergency procedures. Please ask me about safety protocols, emergency responses, or disaster management."
3. For medical emergencies, always emphasize contacting emergency services first
4. Provide clear, step-by-step safety instructions
5. Include relevant emergency numbers when applicable

Emergency Contact Information:
- India Emergency: 112 (All emergencies)
- Police: 100
- Fire: 101
- Ambulance: 102
- Disaster Management: 108
`;

const API_KEY = "AIzaSyBL_ELLr6MObMKmwv7UylcSsxkUJ7Mv4cE";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    systemInstruction: safetyAssistantInfo
});

let messages = {
    history: [],
};

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

            // Enhance message with safety context
            const enhancedMessage = `Context: User asking about safety/emergency. 
                                   Query: ${userMessage}
                                   Remember to ONLY provide safety and emergency-related information.`;

            const chat = model.startChat(messages);
            let result = await chat.sendMessageStream(enhancedMessage);
            
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
                <div class="model">
                    <p></p>
                </div>
            `);
            
            const modelResponse = document.querySelectorAll(".chat-window .chat div.model");
            const currentModelElement = modelResponse[modelResponse.length - 1].querySelector("p");

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                currentModelElement.insertAdjacentHTML("beforeend", `${chunkText}`);
            }

            // Update conversation history
            messages.history.push(
                { role: "user", parts: [{ text: userMessage }] },
                { role: "model", parts: [{ text: currentModelElement.innerHTML }] }
            );

            // Auto-scroll chat
            const chatContainer = document.querySelector(".chat-window .chat");
            chatContainer.scrollTop = chatContainer.scrollHeight;

        } catch (error) {
            console.error("Error:", error);
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
                <div class="error">
                    <p>I apologize, but I'm having trouble processing your safety query. Please try again.</p>
                </div>
            `);
        }

        document.querySelector(".chat-window .chat .loader").remove();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.querySelector('.chat-window');
    
    document.querySelector(".chat-button").addEventListener("click", () => 
        chatWindow.classList.add('active'));
    
    document.querySelector(".chat-window button.close").addEventListener("click", () => 
        chatWindow.classList.remove('active'));
    
    document.querySelector(".chat-window .input-area button").addEventListener("click", sendMessage);
    
    document.querySelector(".chat-window input").addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });
});