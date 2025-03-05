import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({
                   isOpen,
                   onClose,
                   children,
                   hideCloseBtn,
                   onHandleClose,
                   closeOnOutsideClick = true,
                   maxWidth = '800px',
                   maxHeight = '80vh',
                   animationDuration = 300}) => {

    const [isVisible, setIsVisible] = useState(false);
    const modalRootRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        // Создаем корневой элемент для портала
        const portalRoot = document.createElement('div');
        portalRoot.id = 'modal-root';
        document.body.appendChild(portalRoot);
        modalRootRef.current = portalRoot;

        return () => {
            document.body.removeChild(portalRoot);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            // Запускаем анимацию закрытия
            const content = contentRef.current;
            if (content) {
                content.style.transform = 'scale(0.95)';
                content.style.opacity = '0';
            }

            setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = '';
            }, animationDuration);
        }
    }, [isOpen, animationDuration]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && closeOnOutsideClick) {
            onClose();
            if (!onHandleClose) return;
            onHandleClose()
        }
    };

    if (!isVisible || !modalRootRef.current) return null;

    return createPortal(
        <div
            className="modal-backdrop"
            onClick={handleBackdropClick}
            style={{
                transition: `opacity ${animationDuration}ms ease-out`,
                opacity: isOpen ? 1 : 0,
            }}
        >
            <div
                ref={contentRef}
                className="modal-content"
                style={{
                    maxWidth,
                    maxHeight,
                    transition: `
            transform ${animationDuration}ms ease-out,
            opacity ${animationDuration}ms ease-out
          `,
                    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
                    opacity: isOpen ? 1 : 0,
                }}
            >
                {!hideCloseBtn &&
                    (<button className="modal-close" onClick={onClose}>
                        &times;
                    </button>)}
                {children}
            </div>
        </div>,
        modalRootRef.current
    );
};


export default Modal;