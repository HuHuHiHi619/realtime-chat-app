
export type UiStateBase = {
    currentView : "Post" | "Chat",
    activePostId : number | null
    isPostOpen : boolean,
    isPostInputOpen : boolean,
}

export type UiStateMethods = {
    setCurrentView : (view : UiStateBase['currentView']) => void
    openPost: (postId: number) => void
    closePost: () => void
    togglePostInputOpen : () => void
    resetUi : () => void
} 

