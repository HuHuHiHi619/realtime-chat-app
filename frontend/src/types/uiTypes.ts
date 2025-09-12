export interface ConfirmOption {
    title : string,
    description : string,
    confirmText : string,
    cancelText : string,
    onConfirm : () => void
}


export type UiStateBase = {
    currentView : "Post" | "Chat",
    activePostId : number | null
    isPostOpen : boolean,
    isPostInputOpen : boolean,
    confirm : {
        isOpen : boolean, 
        options : ConfirmOption | null   
    }
}

export type UiStateMethods = {
    setCurrentView : (view : UiStateBase['currentView']) => void
    openPost: (postId: number) => void
    closePost: () => void
    togglePostInputOpen : () => void
    toggleConfirmOpen : (options? : ConfirmOption) => void
    resetUi : () => void
} 

