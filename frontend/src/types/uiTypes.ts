
export type UiStateBase = {
    currentView : "Post" | "Chat",
    isPostOpen : boolean,
    isPostInputOpen : boolean,
    isPostMenuOpen : boolean
}

export type UiStateMethods = {
    setCurrentView : (view : UiStateBase['currentView']) => void
    togglePostOpen : () => void
    togglePostInputOpen : () => void
    togglePostMenuOpen : () => void
    resetUi : () => void
} 

