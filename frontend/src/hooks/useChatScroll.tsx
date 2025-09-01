import React, { useCallback, useEffect, useRef } from 'react'
import { useChatStore } from '../store'

function useChatScroll(chatContainerRef : React.RefObject<HTMLDivElement | null>) {
    const { pagination , activeConversation , fetchMessages } = useChatStore()
    const isFetch = useRef(false)

    const handleScroll = useCallback(() => {
        const container = chatContainerRef.current
       
        if(!container || isFetch.current || !pagination.hasMore || !activeConversation) return 
        
        if(container.scrollTop === 0) {
            isFetch.current = true

            const scrollHeightBefore = container.scrollHeight
            const nextPage = pagination.page + 1
    
            fetchMessages(
                activeConversation.conversation_id,
                nextPage
            ).then(() => {
                requestAnimationFrame(() => {
                    const scrollHeightAfter = container.scrollHeight
                    container.scrollTop = scrollHeightAfter - scrollHeightBefore
                })
            }).finally(() => {
                isFetch.current = false
            })
        }
    },[pagination , activeConversation, activeConversation?.conversation_id , fetchMessages])

    useEffect(() => {
        const container = chatContainerRef.current
        if(!container) return

        container.addEventListener('scroll', handleScroll)

        return () => container.removeEventListener('scroll', handleScroll)
    },[handleScroll])
}

export default useChatScroll