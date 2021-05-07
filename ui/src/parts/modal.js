import React, {useState, useImperativeHandle, forwardRef, useCallback, useEffect} from 'react'
import {createPortal} from 'react-dom'

const modalElement = document.getElementById("modal-root")


// This is from stackover flow i don't think it does anything 
function useCombinedRefs(...refs) { 
    const targetRef = React.useRef()
    useEffect(() => { 
        refs.forEach(ref => { 
            if (!ref) return 
            if (typeof ref == "function") {
                ref(targetRef.current)
            } else {
                ref.current = targetRef.current 
            }
        })
    }, [refs])
    return targetRef 
}


export const Modal = forwardRef(({children, defaultShow = false, fade = false}, ref) => {
    
    const [isOpen, setIsOpen] = useState(defaultShow)
    const innerRef  =  React.useRef(null)
    const combinedRef = useCombinedRefs(ref, innerRef)

    const close = useCallback(() => setIsOpen(false), [])
    const open = useCallback(() => setIsOpen(true), [])


    useImperativeHandle(combinedRef, () => ({
        open: () => setIsOpen(true),
        close,
        isOpen
    }), [close,  isOpen])

    const handleKeys =  useCallback(event => {
        if (event.keyCode === 27) close() 
    }, [close])
    
    useEffect(() => {
        if (isOpen) document.addEventListener('keydown', handleKeys, false)
        return () => {
            document.removeEventListener('keydown', handleKeys, false)
        }
    }, [handleKeys, isOpen])

    return createPortal(
        isOpen ?  (
        <div className={`modal ${fade ? 'modal-fade': ''}`}>
            <div className="modal-overlay" onClick={close} /> 
            <span role="button" className="modal-close" aria-label="close" onClick={close}>x</span>
            <div className="modal-body">{children}</div>
        </div>
        ): null, 
        modalElement
    )
})

export default Modal;
