
export type UiStateBase = {
    currentView : "Post" | "Chat",
    isPostOpen : boolean,
    isPostInputOpen : boolean
}

export type UiStateMethods = {
    setCurrentView : (view : UiStateBase['currentView']) => void
    togglePostOpen : () => void
    togglePostInputOpen : () => void
    resetUi : () => void
} 

