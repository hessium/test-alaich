import {useEffect, useState} from "react";
import {useDocumentTitle} from "../shared/hooks/use-document-title.js";
import {apiRequest} from "../shared/api/api.js";
import Modal from "../shared/ui/modal/modal.jsx";
import {Button} from "../shared/ui/button/button.jsx";

export default function Profile() {
    useDocumentTitle('Profile');

    const [userInfo, setUserInfo] = useState(null);
    const [combinedData, setCombinedData] = useState(JSON.parse(localStorage.getItem('combined-data')));
    const [controller, setController] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [completeFetchAuthor, setCompleteFetchAuthor] = useState(false);
    const [completeFetchQuote, setCompleteFetchQuote] = useState(false);


    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    const fetchCombinedData = async (signal) => {
        setCompleteFetchAuthor(false);
        setCompleteFetchQuote(false);

        try {
            const authorData = await apiRequest('GET',
                `/author?token=${token}`,
                null,
                {},
                signal);
            setCompleteFetchAuthor(true);

            const quoteData = await apiRequest('GET',
                `/quote?token=${token}&authorId=${authorData.data.authorId}`,
                null,
                {},
                signal);
            setCompleteFetchQuote(true);

            const merged = {...authorData.data, ...quoteData.data}
            setCombinedData(merged);
            localStorage.setItem('combined-data', JSON.stringify(merged))
            setIsModalOpen(false);
        } catch (err) {
            setIsModalOpen(false);
            if (err.name !== 'AbortError') {
                console.log(err)
            }
        }
    };

    const handleCancel = () => {
        if (controller) {
            controller.abort();
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    const startFetchingData = () => {
        if (!token) {
            setError('Authorization token is missing');
            return;
        }

        const abortController = new AbortController();
        setController(abortController);
        setIsModalOpen(true);
        fetchCombinedData(abortController.signal);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await apiRequest('GET', `/profile?token=${token}`);

                if (!response.success) {
                    throw new Error(response.data || 'Failed to load profile');
                }

                setUserInfo(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser()
    }, [token]);

    if (!token) return <div>Please login to view this page</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='profile'>
            <div className="profile__wrapper">
                <div className="profile__avatar">
                    <img width='1131' height='941' src="/avatar.jpg" alt="avatar"/>
                </div>

                <div>
                    <h1 className='profile__name'>
                        Welcome, {userInfo?.fullname || 'User'}
                    </h1>
                    <Button
                        onClick={startFetchingData}
                        disabled={loading}
                    >
                       Update
                    </Button>
                </div>
            </div>

            {combinedData && (
                <div className='profile__row'>
                   <h3 className='profile__author'>{combinedData.name}:</h3>  <span>{ combinedData.quote}</span>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                maxWidth="800px"
                maxHeight="90vh"
                hideCloseBtn
                animationDuration={200}
                onClose={() => setIsModalOpen(false)}
            >
                <h2>Requesting the quote</h2>

                <div>
                    Step 1: Requesting author...
                    {completeFetchAuthor ? ' Completed' : ''}
                </div>

                <div>
                    Step 2: Requesting quote...
                    {completeFetchQuote ? ' Completed' : ''}
                </div>

                <Button
                    classList={'fit-content'}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </Modal>
        </div>
    );
}