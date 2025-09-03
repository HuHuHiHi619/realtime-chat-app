export class ApiClientError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, data: any, message: string) {
    super(message || `Request failed with status :${status}`);
    this.status = status;
    this.data = data;
    this.name = "ApiClientError";
  }
}

function validateResponse<T>(schema: (data: any) => T, data: any): T {
  try {
  
    return schema(data);
  } catch (error) {
    console.error("❌ Zod validation error:", error);
    console.error("❌ Response that failed:", data);
    throw new Error("Response validation failed");
  }
}

export const apiClient = async <T>(input: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  schema: (data: any) => T;
  signal: AbortSignal;
}): Promise<T> => {
  try {
  
    const response = await fetch(input.url, {
      method: input.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: input.body ? JSON.stringify(input.body) : undefined,
      credentials: "include",
      signal: input.signal,
    });
    const data = await response.json();
  
    
    if (!response.ok) {
      throw new ApiClientError(response.status, data, "เอเร่อ");
    }

    return validateResponse(input.schema, data);
  } catch (error) {
    // ✅ Throw Abort
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("Request aborted");
      throw error;
    }

    // ✅ Re-throw ApiClientError ตามเดิม
    if (error instanceof ApiClientError) {
      throw error;
    }

    // ✅ Network errors หรือ errors อื่นๆ
    console.error("Network or unknown error:", error);
    throw new Error("Network error or server unavailable");
  }
};
