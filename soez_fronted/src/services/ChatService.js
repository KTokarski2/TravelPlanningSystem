import { request } from "./Authconfig";

export const getChatHistory = async (chatId) => {
    try {
        const response = await request("GET", `/chat/${chatId}/history`, {}, {});
        return response.data;
    } catch (error) {
        console.error("Error while getting chat history", error);
    }
}