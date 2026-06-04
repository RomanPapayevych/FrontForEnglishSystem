import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";

const EditLesson = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { lesson, group, token } = location.state || {};

    const [topic, setTopic] = useState(lesson?.topic || "");
    const [description, setDescription] = useState(lesson?.description || "");
    const [lessonDateTime, setLessonDateTime] = useState(
        lesson?.date ? new Date(lesson.date).toISOString().slice(0, 10) : ""
    );
    const [message, setMessage] = useState("");

    const handleUpdateLesson = async (e) => {
        e.preventDefault();
        try {
            const updatedLesson = {
                topic,
                description,
                date: lessonDateTime,
            };
            await axios.put(
                `https://localhost:7186/api/Teacher/${lesson.id}/UpdateLesson`,
                updatedLesson,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Lesson updated successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Failed to update lesson:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Failed to update lesson");
        }
    };

    const goBack = () => {
        navigate(-1);
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
                        <h1 className="edit-lesson-page__title">Edit lesson</h1>
                        {group?.name && (
                            <p className="edit-lesson-page__subtitle">Group: {group.name}</p>
                        )}
                    </header>

                    {message && (
                        <p className="edit-lesson-page__message" role="status">{message}</p>
                    )}

                    <form className="edit-lesson-page__form" onSubmit={handleUpdateLesson}>
                        <div className="edit-lesson-page__field">
                            <label className="edit-lesson-page__label" htmlFor="lesson-topic">
                                Topic
                            </label>
                            <input
                                id="lesson-topic"
                                className="edit-lesson-page__input"
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Lesson topic"
                                required
                            />
                        </div>

                        <div className="edit-lesson-page__field">
                            <label className="edit-lesson-page__label" htmlFor="lesson-description">
                                Description
                            </label>
                            <textarea
                                id="lesson-description"
                                className="edit-lesson-page__textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What will you cover in this lesson?"
                                rows={5}
                                required
                            />
                        </div>

                        <div className="edit-lesson-page__field">
                            <label className="edit-lesson-page__label" htmlFor="lesson-date">
                                Date
                            </label>
                            <input
                                id="lesson-date"
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
                        >
                            Save changes
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditLesson;

