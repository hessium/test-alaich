import {useDocumentTitle} from "../shared/hooks/use-document-title.js";

export const NotFound = () => {
    useDocumentTitle('Not found')
    return (
        <div className="error-page">
            <h1>404</h1>
            <p>Not found</p>
        </div>
    );
};