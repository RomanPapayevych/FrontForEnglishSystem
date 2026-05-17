import { GrSchedule } from "react-icons/gr";
import { MdOutlineSchedule } from "react-icons/md";
import { RxPerson } from "react-icons/rx";
import { GrSchedules } from "react-icons/gr";

const MyGroupTab = ({myGroup, LeaveGroup}) => {
    if (!myGroup) return <p>Loading group information...</p>;
    
    return(
    <div className="my-card specific-margin-top-card">
        {myGroup ? (
            <div>
                <div className='flex-jc'>
                    <div>
                        <h2><strong>{myGroup.name}</strong></h2>
                    </div>
                    <div>
                        <p className='shimmer'>{myGroup.englishLevel}</p>
                    </div>
                </div>
                    <div className='card-info'>
                        <div className='card-column flex margin-top'>
                            <div>
                                <GrSchedule className='card-icon'/>
                            </div>
                            <div>
                                <p className='card-column-p'>Duration of studying:</p>
                                <p className='card-column-p font-weight'>{new Date(myGroup.startTime).toLocaleDateString()} - {new Date(myGroup.endTime).toLocaleDateString()}</p>
                            </div>
                        </div>
                            <div className='card-column flex margin-top'>
                                <div>
                                    <MdOutlineSchedule className='card-icon'/>
                                </div>
                                <div>
                                    <p className='card-column-p'>Lesson time:</p>
                                    <p className='card-column-p font-weight'>
                                        {new Date(myGroup.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(myGroup.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}  
                                    </p>
                                </div>
                            </div>
                            <div className='card-column flex margin-top'>
                                <div>
                                    <RxPerson className='card-icon'/>
                                </div>
                                <div>
                                    <p className='card-column-p'>Teacher:</p>
                                    <p className='card-column-p font-weight'>{myGroup.teacher ? `${myGroup.teacher.firstName} ${myGroup.teacher.lastName}` : 'No teacher assigned'}</p>
                                </div>
                        </div>
                        <div className='card-colum flex margin-top'>
                            <div>
                                <GrSchedules className='card-icon'/>
                            </div>
                            <div>
                                <p className='card-column-p'>Schedule:</p>
                                <p className='card-column-p font-weight'>{Array.isArray(myGroup.daysOfWeek.$values) ? myGroup.daysOfWeek.$values.join(', ') : 'No days available'}</p>
                            </div>
                    </div>
                </div>
            </div>
        ):(
            <p>Loading group information...</p>
        )}
        <button onClick={LeaveGroup} className="btn-leave">Leave group</button>
    </div>
    );
}
export default MyGroupTab;