import { useAuthStore } from "../store";

export const withAbortController = async <T>(
  task: (signal: AbortSignal) => Promise<T>
): Promise<T> => {
 

  useAuthStore.setState({ activeControllers: new Set() });


  const controller = new AbortController();


  useAuthStore.getState().addController(controller);
  
  try {
    
    const result = await task(controller.signal);
   
    return result;
  } catch (error) {
    console.error("Error in withAbortController:", error);
    throw error;
  } finally {
    useAuthStore.getState().removeController(controller);
    console.log(
      "Removed controller, count:",
      useAuthStore.getState().activeControllers.size
    );
  }
};
