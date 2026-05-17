import {Link} from 'react-router-dom'
import './index.css'
import introImage from '../../../images/mainPage/index-background.jpg'
import secondImage from '../../../images/mainPage/second-section.jpg'
import { useState } from 'react';
import Header from '../headerComponent/header'

const Index = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <div className="index-container">
            <Header></Header>
            <main>
                <section className='index-section-intro' id='section-one'>
                    <div className='index-container-intro'>
                        <div className='index-intro-content-text'>
                            <h1 className='index-intro-h'>Dream in English</h1>
                            <p className='index-intro-p'>Achieve more with us</p>       
                        </div>
                        <div className='index-intro-content-image'>
                            <img className='index-intro-img' src={introImage}/>
                        </div>
                    </div>
                </section>

                <section className='index-section-intro-two' id='section-two'>
                    <div className='index-container-intro'>
                        <div>
                            <img className='index-intro-img-section-two' src={secondImage} alt="" />
                        </div>
                        <div className='index-section'>
                            <h1 className='index-intro-h'>We build the learning process around you and your goals</h1>
                            <p className='index-intro-p-lower'>At Aspire English School, we help learners of all ages achieve confidence 
                                and fluency in English.
                                <br />
                                Our certified teachers use interactive lessons, real-world materials, and personalized guidance 
                                to make learning engaging and effective. 
                                <br />
                                Whether you’re preparing for exams, advancing 
                                your career, or improving your communication skills, we’ll support you every step of the way.
                            </p>
                        </div>
                    </div>
                </section>

                <section className='index-section-without-flex' id='section-three'>
                    <div className='background-for-h'>
                        <h1 className='index-intro-h'>Why the BlueStar Method Works — and Why Self-Learning Doesn’t</h1>
                    </div>
                    <div className='index-container-intro'>
                        <div className='index-section-container-block'>
                            <h3 className='index-intro-h-lower'>Self-Learning</h3>
                            <div className='card-red'>
                                <p className='card-text'>No accountability</p>
                            </div>
                            <div className='card-red'>
                                <p className='card-text'>Lack of structure</p>
                            </div>
                            <div className='card-red'>
                                <p className='card-text'>Zero speaking practice</p>
                            </div>
                            <div className='card-red'>
                                <p className='card-text'>Slow or invisible progress</p>
                            </div>
                        </div>  
                        <div className='index-section-container-block'>
                            <h3 className='index-intro-h-lower'>BlueStar Study</h3>
                            <div className='card-green'>
                                <p className='card-text'>Clear, guided learning path</p>
                            </div>
                            <div className='card-green'>
                                <p className='card-text'>Live communication & real practice</p>
                            </div>
                            <div className='card-green'>
                                <p className='card-text'>Personalized support</p>
                            </div>
                            <div className='card-green'>
                                <p className='card-text'>Measurable results</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='index-section-without-flex-fiolet-bgc' id='section-four'>
                    <div className='background-for-h'>
                        <h1 className='index-intro-h'>How the Learning Process Works</h1>                    
                    </div>
                    <div className='grid-wrapper'>
                        <div className='box'>
                            <h3 className='h-text'>Level assessment</h3>
                            <p className='p-text'>You take a short test, and we instantly determine your English level — from Beginner to Advanced.</p>
                        </div>
                        <div className='box'>
                            <h3 className='h-text'>Choosing your ideal group</h3>
                            <p className='p-text'>Select a schedule and a group that matches your level and goals.</p>
                        </div>
                        <div className='box'>
                            <h3 className='h-text'>Personal student dashboard</h3>
                            <p className='p-text'>You’ll have access to your own dashboard with materials, lesson recordings, homework, and communication with your teacher.</p>
                        </div>
                        <div className='box'>
                            <h3 className='h-text'>Live Zoom lessons + regular homework</h3>
                            <p className='p-text'>All lessons are conducted live in Zoom. You practice speaking, ask questions, interact with classmates, and reinforce the material with structured homework.</p>
                        </div>
                    </div>
                </section>

                <section className='index-section-without-flex' id='section-five'>
                    <div className='index-container-intro'>
                        <div className=''>
                            <img className='index-img-block' id='photo-eng-one' src="src/images/mainPage/bgc-section-five(2).jpg" alt="" />
                            <img className='index-img-block' id='photo-eng-two' src="src/images/mainPage/bgc-section-five(3).jpg" alt="" />
                            <img className='index-img-block' id='photo-eng-three' src="src/images/mainPage/bgc-section-five(1).jpg" alt="" />
                        </div>
                        <div>
                            <h3 className='index-intro-h'>What You Get</h3>
                            <div className='box'>
                                <h3 className='h-text'>Speak English more confidently</h3>
                                <p className='p-text'>No more fear, long pauses, or hesitation.</p>
                            </div>
                            <div className='box'>
                                <h3 className='h-text'>Build a strong grammar foundation</h3>
                                <p className='p-text'>Clear understanding of the rules and the ability to use them naturally.</p>
                            </div>
                            <div className='box'>
                                <h3 className='h-text'>Grow your vocabulary</h3>
                                <p className='p-text'>Learn practical words and phrases for real-life contexts.</p>
                            </div>
                       </div>
                    </div>
                </section>
            </main>

            <footer>
                <section className='index-section-bgc-black' id='section-five'>
                    <div className='index-container-intro'>
                        <div className='footer-columns'>
                            <div className='index-container-footer' id='column-about'>
                                <h1 className='footer-h-higher'>Blue.Star Company</h1>
                            </div>
                            <div className='index-container-footer' id='column-about'>
                                <p className='footer-h'>About</p>
                                <a className='link-text'>Our story</a>
                                <a className='link-text'>Location</a>
                                <a className='link-text'>Careers</a>
                                <a className='link-text'>Contact</a>
                            </div>
                            <div className='index-container-footer' id='column-customer-service'>
                                <p className='footer-h'>Customer Service</p>
                                <a className='link-text'>Prices and Payments</a>
                                <a className='link-text'>Return policy</a>
                                <a className='link-text'>Privacy Policy</a>
                            </div>
                            <div className='index-container-footer' id='Social Media'>
                                <p className='footer-h'>Social Media</p>
                                <a className='link-text'>Instagram</a>
                                <a className='link-text'>Facebook</a>
                                <a className='link-text'>LinkedIn</a>
                            </div>
                        </div>
                    </div>
                    <div className='dash-line'></div>
                    <p className='footer-copy-text'>@Copyright. All rights deserved </p>
                </section>
            </footer>
        </div>
    );
}  
export default Index;