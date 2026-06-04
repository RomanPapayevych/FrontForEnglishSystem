import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";

const CreateLesson = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { group, email, id } = location.state || {};
    const token = localStorage.getItem('token');

    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [lessonDateTime, setLessonDateTime] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateLesson = async (e) => {
        e.preventDefault();
        if (!group?.id) {
            setMessage("Group not found. Go back and open the group again.");
            return;
        }

        setIsSubmitting(true);
        setMessage('');
        const dateWithTime = `${lessonDateTime}T00:00:00.000Z`;

        try {
            await axios.post(
                `https://localhost:7186/api/Teacher/${group.id}/Lesson`,
                { topic, description, date: dateWithTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/groupDetails', { state: { group, email, id, lessonCreated: true } });
        } catch (error) {
            console.error('Error creating lesson:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Failed to create lesson. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        navigate('/groupDetails', { state: { group, email, id } });
    };

    return (
        <div className="edit-lesson-page">
            <header className="edit-lesson-page__topbar">
                <button
                    type="button"
                    onClick={goBack}
                    className="group-details-page__back"
                    aria-label="Back to group details"
                >
                    <IoIosArrowBack size={22} />
                    <span>Back to group</span>
                </button>
            </header>

            <main className="edit-lesson-page__main">
                <div className="edit-lesson-page__card">
                    <header className="edit-lesson-page__header">
                        <h1 className="edit-lesson-page__title">Create lesson</h1>
                        {group?.name && (
                            <p className="edit-lesson-page__subtitle">Group: {group.name}</p>
                        )}
                    </header>

                    {message && (
                        <p className="edit-lesson-page__message" role="status">{message}</p>
                    )}

                    <form className="edit-lesson-page__form" onSubmit={handleCreateLesson}>
                        <div className="edit-lesson-page__field">
                            <label className="edit-lesson-page__label" htmlFor="create-lesson-topic">
                                Topic
                            </label>
                            <input
                                id="create-lesson-topic"
                                className="edit-lesson-page__input"
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Lesson 4 — Present Perfect"
                                required
                            />
                        </div>

                        <div className="edit-lesson-page__field">
                            <label className="edit-lesson-page__label" htmlFor="create-lesson-description">
                                Description
                            </label>
                            <textarea
                                id="create-lesson-description"
                                className="edit-lesson-page__textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What will you cover in this lesson?"
                                rows={5}
                                required
                            />
                        </div>

                        <div className="edit-lesson-page__field">
                            <label className="edit-lesson-page__label" htmlFor="create-lesson-date">
                                Date
                            </label>
                            <input
                                id="create-lesson-date"
                                className="edit-lesson-page__input"
                                type="date"
                                value={lessonDateTime}
                                onChange={(e) => setLessonDateTime(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="group-details-page__btn group-details-page__btn--primary edit-lesson-page__submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create lesson"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateLesson;
