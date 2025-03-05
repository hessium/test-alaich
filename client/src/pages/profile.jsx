import {useCallback, useEffect, useMemo, useState} from "react";
import {useDocumentTitle} from "../shared/hooks/use-document-title.js";
import {apiRequest} from "../shared/api/api.js";
import Modal from "../shared/ui/modal/modal.jsx";
import {Button} from "../shared/ui/button/button.jsx";
import {Loader} from "../shared/ui/loader/loader.jsx";

export default function Profile() {
    useDocumentTitle('Profile');

    useDocumentTitle('Profile');

    const [state, setState] = useState({
        userInfo: null,
        combinedData: JSON.parse(localStorage.getItem('combined-data')),
        error: null,
        isLoading: false,
        isModalOpen: false,
        fetchStatus: { author: false, quote: false },
        token: JSON.parse(localStorage.getItem('authToken')).token || null
    });

    const [controller, setController] = useState(null);

    const fetchCombinedData = useCallback(async (signal) => {
        try {
            setState(prev => {
                return ({...prev, fetchStatus: {author: false, quote: false}});
            });

            const authorData = await apiRequest('GET',
                `/author?token=${state.token}`,
                null,
                {},
                signal);
            setState(prev => ({
                ...prev,
                fetchStatus: { author: true, quote: false },
            }));

            const quoteData = await apiRequest('GET',
                `/quote?token=${state.token}&authorId=${authorData.data.authorId}`,
                null,
                {},
                signal);
            setState(prev => ({
                ...prev,
                fetchStatus: { author: true, quote: true },
            }));

            const merged = {...authorData.data, ...quoteData.data}

            setState(prev => ({
                ...prev,
                combinedData: merged,
                isModalOpen: false
            }));
            localStorage.setItem('combined-data', JSON.stringify(merged))
        } catch (err) {
            setState(prev => ({
                ...prev,
                isModalOpen: false
            }));
            if (err.name !== 'AbortError') {
                console.log(err)
            }
        }
    }, [state.token]);


    const handleCancel = useCallback(() => {
        controller?.abort();
        setState(prev =>
            ({...prev, isModalOpen: false }));
    }, [controller]);

    const startFetchingData = useCallback(() => {
        if (!state.token) {
            setState(prev =>
                ({...prev, error: 'Authorization token missing' }));
            return;
        }
        const abortController = new AbortController();
        setController(abortController);
        setState(prev =>
            ({...prev, isModalOpen: true }));
        fetchCombinedData(abortController.signal);
    }, [state.token, fetchCombinedData]);

    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            try {
                setState(prev => ({...prev, isLoading: true }));
                const response = await apiRequest('GET', `/profile?token=${state.token}`);
                if (isMounted) {
                    setState(prev => ({...prev, userInfo: response.data, isLoading: false }));
                }
            } catch (err) {
                if (isMounted) setState(prev => ({...prev, error: err.message, isLoading: false }));
            }
        };

        fetchUser();
        return () => { isMounted = false };
    }, [state.token]);


    const modalContent = useMemo(() => (
        <Modal
            isOpen={state.isModalOpen}
            maxWidth="800px"
            maxHeight="90vh"
            hideCloseBtn
            animationDuration={200}
            onClose={() =>
                setState(prev =>
                    ({...prev, isModalOpen: false }))}
        >
            <h2>Requesting the quote</h2>

            <div>
                Step 1: Requesting author...
                {state.fetchStatus.author ? ' Completed' : ''}
            </div>

            <div>
                Step 2: Requesting quote...
                {state.fetchStatus.quote ? ' Completed' : ''}
            </div>

            <Button
                classList={'fit-content'}
                onClick={handleCancel}
            >
                Cancel
            </Button>
        </Modal>

    ), [handleCancel, state.fetchStatus.author, state.fetchStatus.quote, state.isModalOpen]);

    if (state.isLoading) return <Loader />;
    if (state.error) return <div>Error: {state.error}</div>;

    return (
        <div className='profile'>
            <div className="profile__wrapper">
                <div className="profile__avatar">
                    <img width='1131' height='941' src="/avatar.jpg" alt="avatar"/>
                </div>

                <div>
                    <h1 className='profile__name'>
                        Welcome, {state.userInfo?.fullname || 'User'}
                    </h1>
                    <Button
                        onClick={startFetchingData}
                        disabled={state.isLoading}
                    >
                        Update
                    </Button>
                </div>
            </div>

            {state.combinedData && (
                <div className='profile__row'>
                    <h3 className='profile__author'>{state.combinedData.name}:</h3>  <span>{ state.combinedData.quote}</span>
                </div>
            )}

            {modalContent}
        </div>
    );
}