
export type UiStateBase = {
    currentView : "Post" | "Chat",
    isPostOpen : boolean,
}

export type UiStateMethods = {
    setCurrentView : (view : UiStateBase['currentView']) => void
    togglePostOpen : () => void
    resetUi : () => void
} 

