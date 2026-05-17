import Modal from "../modalWindow/modal";
import image from '../../../images/Photo8.jpg'
import { MdOutlinePlayLesson } from "react-icons/md";
import { BiLogoZoom } from "react-icons/bi";

const LessonsTab = ({lessons, open, setOpen, selectedLesson, setSelectedLesson}) => {
    return(
        <div className="lessons">
            <div className="container-link-lesson">
                <a href="" className="active-link-lesson">Join Zoom Conference<BiLogoZoom className="active-link-zoom-icon"/></a>
            </div>
            {Array.isArray(lessons) && lessons.length > 0 ? (
                <div>
                    {lessons.map((lesson) => (
                        <div className="lesson-card" key={lesson.id}>
                            <div className='flex-container'>
                                <p>{lesson.topic}</p>
                                <p className='lesson-date'>{new Date(lesson.date).toLocaleDateString()}</p>
                                <button className='btn-view' 
                                    onClick={() => {
                                        setOpen(true); 
                                        setSelectedLesson(lesson);
                                    }}>
                                    View Lesson <MdOutlinePlayLesson className='mini-pad'/>
                                </button>
                            </div>
                        </div>
                    ))}
                    <Modal isOpen={open} onClose={() => setOpen(false)}>
                        {selectedLesson && (
                            <>
                                <p className='modal-topic'>{selectedLesson.topic}</p>
                                <p className='modal-info'>{selectedLesson.description}</p>
                                {Array.isArray(selectedLesson.homework) &&
                                    selectedLesson.homework.length > 0 ? (
                                        <>
                                            <p className="modal-homework">Homework:</p>
                                            {selectedLesson.homework.map((hw) => (
                                                <div className='modal-homework-container' key={hw.id}>
                                                    <p className='modal-homework-info'>{hw.content}</p>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <p className="modal-no-homework">No homework yet</p>
                                    )}
                                <p className='modal-date'>{new Date(selectedLesson.date).toLocaleDateString()}</p>
                            </>
                        )}
                    </Modal>
                </div>
            ):(
                <div className='not-found-container'>
                    <div className='not-found-content'>
                        <img className='not-found-image' src={image} alt="" />
                    </div>
                    <div className='not-found-content'>
                        <h3 className='not-found'>{"No lessons yet :("}</h3>
                    </div>
                    <p className='description-p'>New lessons coming soon!</p>
                </div>
            )}
        </div>
    );
}
export default LessonsTab;