import { success, z } from "zod";
import {
  loginInputSchema,
  registerInputSchema,
  authResponseSchema,
} from "../schema/authSchema";
import { getErrorMessage } from "../helper/getError";

export const clientRegister = async (
  registerData: z.infer<typeof registerInputSchema>
) => {
  try {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
      credentials: "include",
    });
    if (!response.ok) {
      return {
        success: false,
        error: `Request failed with status ${response.status}`,
      };
    }

    const rawData = await response.json();
    const validateData = authResponseSchema.safeParse(rawData);
    if (!validateData.success) {
      return {
        success: false,
        error: "Invalid response format",
      };
    }

    console.log("Server response:", validateData.data);
    return {
      success: true,
      data: validateData.data,
    };
  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

export const clientLogin = async (
  loginData: z.infer<typeof loginInputSchema>
) => {
  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include",
    });
    if (!response.ok) {
      return {
        success: false,
        error: `Request failed with status ${response.status}`,
      };
    }
    const rawData = await response.json();
    const validateData = authResponseSchema.safeParse(rawData);
    if (!validateData.success) {
      return {
        success: false,
        error: "Invalid response format",
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
      error: getErrorMessage(error),
    };
  }
};
