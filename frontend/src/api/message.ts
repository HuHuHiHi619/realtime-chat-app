import { success, z } from "zod";
import { getErrorMessage } from "../helper/getError";
import { createConversationSchema } from "../schema/conversationSchema";
import { createMessageSchema } from "../schema/messageSchema";

export const clientCreateConversation = async (
  conversationData: z.infer<typeof createConversationSchema>
) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/createconversation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(conversationData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: `Request failed with status ${response.status}`,
      };
    }

    const rawData = await response.json();
    const validateData = createConversationSchema.safeParse(rawData);
    if (!validateData.success) {
      return {
        success: false,
        message: "Invalid response format",
      };
    }

    return {
      success: true,
      data: validateData.data,
    };
  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const clientCreateMessage = async(messageData : z.infer<typeof createMessageSchema>) => {
    try{
        const response = await fetch('http://localhost:5000/api/create-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
            credentials: 'include',
        })
        if(!response.ok){
            return {
                success: false,
                message: `Request failed with status ${response.status}`
            }
        }
        const rawData = await response.json()
        const validateData = createMessageSchema.safeParse(rawData)
        if(!validateData.success){
            return {
                success: false,
                message: 'Invalid response format'
            }
        }
        return {
            success: true,
            data: validateData.data
        }
    } catch (error : unknown){
        console.log(error)
        return {
            success: false,
            message: getErrorMessage(error)
        }
    }
}
