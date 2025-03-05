import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
    useEffect(() => {

        if(!title) return;

        document.title = title;
        return () => {
            document.title = 'Home';
        };
    }, [title]);
};