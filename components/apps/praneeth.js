import React, { Component } from 'react';
import ReactGA from 'react-ga4';

export class AboutPraneeth extends Component {

    constructor() {
        super();
        this.screens = {};
        this.state = {
            screen: () => { },
            active_screen: "about", // by default 'about' screen is active
            navbar: false,
        }
    }

    componentDidMount() {
        this.screens = {
            "about": <About />,
            "education": <Education />,
            "skills": <Skills />,
            "learning": <Learning />,
            "certifications": <Certifications />,
            "projects": <Projects />,
            "publications": <Publications />,
            "resume": <Resume />,
        }

        let lastVisitedScreen = localStorage.getItem("about-section");
        if (!lastVisitedScreen || !this.screens[lastVisitedScreen]) {
            lastVisitedScreen = "about";
        }

        // Try to focus the last visited screen
        const element = document.getElementById(lastVisitedScreen);
        if (element) {
            this.changeScreen(element);
        } else {
            this.setState({
                screen: this.screens[lastVisitedScreen],
                active_screen: lastVisitedScreen
            });
        }
    }

    changeScreen = (e) => {
        const screen = e.id || e.target.id;

        // store this state
        localStorage.setItem("about-section", screen);

        // google analytics
        ReactGA.send({ hitType: "pageview", page: `/${screen}`, title: "About Section" });

        this.setState({
            screen: this.screens[screen],
            active_screen: screen
        });
    }

    showNavBar = () => {
        this.setState({ navbar: !this.state.navbar });
    }

    renderNavLinks = (isDark) => {
        const links = [
            { id: "about", label: "About Me", icon: "about.svg" },
            { id: "education", label: "Education", icon: "education.svg" },
            { id: "skills", label: "Skills", icon: "skills.svg" },
            { id: "learning", label: "Learning Journey", icon: "education.svg" },
            { id: "certifications", label: "Certifications", icon: "experience.svg" },
            { id: "projects", label: "Projects", icon: "projects.svg" },
            { id: "publications", label: "Publications", icon: "emblem-system-symbolic.svg" },
            { id: "resume", label: "Resume", icon: "download.svg" }
        ];

        return (
            <>
                {links.map((link) => {
                    const isActive = this.state.active_screen === link.id;
                    return (
                        <div 
                            key={link.id}
                            id={link.id} 
                            tabIndex="0" 
                            onFocus={this.changeScreen} 
                            className={`w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-2 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-3.5 transition-colors ${
                                isActive 
                                    ? "bg-ub-orange text-white" 
                                    : (isDark ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-black/5")
                            }`}
                        >
                            <img className="w-3.5 md:w-4 flex-shrink-0" alt={link.label} src={`./themes/Yaru/status/${link.icon}`} />
                            <span className="ml-2 md:ml-3 text-xs md:text-sm font-medium">{link.label}</span>
                        </div>
                    );
                })}
            </>
        );
    }

    render() {
        const isDark = this.props.dark_mode !== false; // true by default

        return (
            <div className={`w-full h-full flex ${isDark ? 'bg-ub-cool-grey text-white' : 'bg-[#fafafa] text-gray-800'} select-none relative`}>
                <div className={`md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r ${isDark ? 'border-black' : 'border-gray-300'}`}>
                    <div className="py-2">
                        {this.renderNavLinks(isDark)}
                    </div>
                </div>
                <div onClick={this.showNavBar} className={`md:hidden flex flex-col items-center justify-center absolute ${isDark ? 'bg-ub-cool-grey' : 'bg-gray-200'} rounded w-6 h-6 top-1.5 left-1.5 z-40`}>
                    <div className={`w-3.5 border-t ${isDark ? 'border-white' : 'border-black'}`}></div>
                    <div className={`w-3.5 border-t ${isDark ? 'border-white' : 'border-black'}`} style={{ marginTop: "2pt", marginBottom: "2pt" }}></div>
                    <div className={`w-3.5 border-t ${isDark ? 'border-white' : 'border-black'}`}></div>
                    <div className={(this.state.navbar ? " visible animateShow z-30 " : " invisible ") + ` md:hidden text-xs absolute ${isDark ? 'bg-ub-cool-grey' : 'bg-gray-100'} py-0.5 px-1 rounded shadow ${isDark ? 'border-black border-opacity-20' : 'border-gray-300'} border top-full mt-1.5 left-0`}>
                        {this.renderNavLinks(isDark)}
                    </div>
                </div>
                <div className={`flex flex-col w-full md:w-4/5 justify-start items-center flex-grow ${isDark ? 'bg-ub-grey' : 'bg-white'} overflow-y-auto windowMainScreen`}>
                    {React.isValidElement(this.state.screen) ? React.cloneElement(this.state.screen, { isDark }) : this.state.screen}
                </div>
            </div>
        );
    }
}

export default AboutPraneeth;

export const displayAboutPraneeth = () => {
    return <AboutPraneeth />;
}

function About({ isDark }) {
    return (
        <div className="w-full flex flex-col items-center px-6 py-8 md:px-10 text-center md:text-left md:items-start">
            <div className="flex flex-col md:flex-row items-center md:items-start w-full space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Pic/Bitmoji with matching accent border shadow */}
                <div className="flex-shrink-0">
                    <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden ${isDark ? 'bg-[#242424]' : 'bg-white'} border-2 ${isDark ? 'border-white/10' : 'border-gray-300'} p-1.5 flex items-center justify-center`}>
                        <img className="w-full h-full object-cover rounded-full" src="./images/logos/pfp.jpg" alt="Praneeth Logo" />
                    </div>
                </div>

                {/* Header Information */}
                <div className="flex flex-col items-center md:items-start justify-center pt-2">
                    <h1 className={`text-3xl md:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight`}>
                        P Praneeth Reddy
                    </h1>
                    <div className="mt-2.5 flex flex-wrap gap-2 justify-center md:justify-start items-center">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full text-white bg-ub-orange select-none">
                            Software Developer
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} select-none`}>
                            @ Simnovus
                        </span>
                    </div>
                    <p className={`mt-4 text-sm md:text-base leading-relaxed max-w-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Computer Science Graduate and Software Developer with a strong foundation in full-stack engineering, cloud-native deployments, and machine learning systems. Experienced in automating infrastructure, developing intelligent applications, and building scalable software solutions.
                    </p>
                </div>
            </div>

            {/* Divider line */}
            <div className={`my-8 h-px w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>

            {/* Quick Details List */}
            <div className="w-full text-left">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Contact Info</h3>
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                    <div>
                        <div className="text-xs uppercase opacity-60">Location</div>
                        <div className="text-sm font-semibold mt-0.5">Bangalore, India</div>
                    </div>
                    <div>
                        <div className="text-xs uppercase opacity-60">Email Address</div>
                        <a href="mailto:connectwithpraneeth@gmail.com" className="text-sm font-semibold mt-0.5 hover:text-ub-orange transition-colors">connectwithpraneeth@gmail.com</a>
                    </div>
                    <div>
                        <div className="text-xs uppercase opacity-60">Phone Number</div>
                        <a href="tel:+918639564054" className="text-sm font-semibold mt-0.5 hover:text-ub-orange transition-colors">+91 8639564054</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Education({ isDark }) {
    const education_data = [
        {
            degree: "B.Tech in Computer Science & Engineering",
            institution: "Amrita Vishwa Vidyapeetham, Bengaluru Campus",
            duration: "2021 - 2025",
            score: "CPI: 8.01 / 10",
            details: "Focused on core computing systems, network security, software engineering, and IoT integration. Active member and Office Bearer of the videography club (EPIC Club)."
        },
        {
            degree: "Class 12th (Physics, Chemistry, & Mathematics)",
            institution: "Narayana Junior College",
            duration: "2019 - 2021",
            score: "Percentage: 91.0%",
            details: "Core subjects included Mathematics, Physics, Chemistry, and English under CBSE curriculum. Developed strong analytical and problem-solving skills."
        },
        {
            degree: "Class 10th (ICSE)",
            institution: "New Baldwins High School",
            duration: "2019",
            score: "Percentage: 91.6%",
            details: "Secondary school certificate with distinction under ICSE board."
        }
    ];

    return (
        <div className="w-full flex flex-col items-center px-6 py-8 md:px-10">
            <h2 className={`text-2xl md:text-3xl font-extrabold mb-8 self-start ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Education Timeline
            </h2>
            
            <div className="relative border-l-2 border-ub-orange/30 w-full pl-6 md:pl-8 space-y-8 text-left">
                {education_data.map((edu, idx) => (
                    <div key={idx} className="relative group">
                        {/* Timeline Node Bullet */}
                        <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-ub-orange bg-ub-orange group-hover:scale-125 transition-transform duration-200"></div>
                        
                        {/* Timeline Card */}
                        <div className={`p-5 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {edu.degree}
                                </h3>
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-ub-orange/10 text-ub-orange mt-1 sm:mt-0 max-w-max">
                                    {edu.duration}
                                </span>
                            </div>
                            <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {edu.institution}
                            </h4>
                            <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {edu.details}
                            </p>
                            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                {edu.score}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Skills({ isDark }) {
    const skillGroups = [
        {
            title: "Programming Languages",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
            skills: ["Python", "Go", "Java", "C", "C++", "JavaScript", "Shell Scripting", "SQL"]
        },
        {
            title: "Web & Frameworks",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
            skills: ["React", "Angular", "HTML", "CSS", "Flask", "Streamlit"]
        },
        {
            title: "Cloud & DevOps",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
            skills: ["AWS", "Docker", "Jenkins", "CI/CD Pipelines", "Virtualization", "Linux SysAdmin"]
        },
        {
            title: "Machine Learning & Data",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
            skills: ["Scikit-learn", "TensorFlow/Keras", "NumPy", "Pandas", "NLP", "Computer Vision"]
        },
        {
            title: "Networking & Security",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>,
            skills: ["TCP/IP", "SSL/TLS", "RSA-AES Cryptography", "Network Simulation", "Distributed Systems"]
        },
        {
            title: "IoT & Embedded Systems",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
            skills: ["ESP32", "Arduino", "Wireless Communication", "Raspberry Pi", "Sensor Integration"]
        },
        {
            title: "Development Tools & Soft Skills",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>,
            skills: ["Git", "Jupyter Notebook", "VS Code", "LaTeX", "MySQL", "Firebase", "Figma", "Problem Solving", "Leadership", "Technical Presentation"]
        }
    ];

    return (
        <div className="w-full flex flex-col items-center px-6 py-8 md:px-10">
            <h2 className={`text-2xl md:text-3xl font-extrabold mb-6 self-start ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Skills Showcase
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
                {skillGroups.map((group, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 rounded-lg bg-ub-orange/10 text-ub-orange">
                                {group.icon}
                            </div>
                            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {group.title}
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {group.skills.map((skill, sIdx) => (
                                <span 
                                    key={sIdx} 
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                                        isDark 
                                            ? 'bg-white/5 border-white/10 text-gray-300' 
                                            : 'bg-gray-50 border-gray-200 text-gray-700'
                                    }`}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Learning({ isDark }) {
    return (
        <div className="w-full flex flex-col items-center px-6 py-8 md:px-10 text-left">
            <h2 className={`text-2xl md:text-3xl font-extrabold mb-6 self-start ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Learning Journey
            </h2>
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} space-y-5 w-full`}>
                <div>
                    <h4 className="text-base font-bold text-ub-orange">AWS Academy - Architecting & Security Foundations</h4>
                    <p className={`text-sm mt-1.5 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Learned to design highly available, cost-effective, fault-tolerant, and secure distributed systems on AWS. Acquired deep understanding of Identity and Access Management (IAM), VPC configurations, threat detection tools, and serverless computing.
                    </p>
                </div>
                <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}></div>
                <div>
                    <h4 className="text-base font-bold text-ub-orange">Applied Generative AI & Natural Language Processing</h4>
                    <p className={`text-sm mt-1.5 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Studied neural network architectures, pre-training methodologies, and advanced NLP techniques. Gained hands-on experience building multi-lingual translation engines and fine-tuning transformer models.
                    </p>
                </div>
                <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}></div>
                <div>
                    <h4 className="text-base font-bold text-ub-orange">DevOps, Virtualization & Telecom Orchestration</h4>
                    <p className={`text-sm mt-1.5 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Acquired practical experience setting up automated CI/CD pipelines with Jenkins, building Docker/Podman container workloads, managing hypervisor environments, and writing scalable bash utility scripts.
                    </p>
                </div>
                <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}></div>
                <div>
                    <h4 className="text-base font-bold text-ub-orange">Bug Bounty & Penetration Testing</h4>
                    <p className={`text-sm mt-1.5 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Learned modern reconnaissance frameworks, threat modeling, security scanning tools, and ethical hacking protocols to audit security posture in distributed networks.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Certifications({ isDark }) {
    const certs = [
        { name: "AWS Academy Graduate – Cloud Architecting", issuer: "AWS Academy", date: "Jan 2025" },
        { name: "AWS Academy Graduate – Cloud Security Foundations", issuer: "AWS Academy", date: "Jan 2025" },
        { name: "Artificial Neural Networks with Keras in Python and R", issuer: "Udemy", date: "Jan 2025" },
        { name: "Data Manipulation in Python: NumPy and Pandas", issuer: "Udemy", date: "Jan 2025" },
        { name: "AWS Academy Graduate – Cloud Foundations", issuer: "AWS Academy", date: "Dec 2024" },
        { name: "Recon for Bug Bounty, Penetration Testers and Ethical Hackers", issuer: "Udemy", date: "Aug 2024" },
        { name: "Applied Generative AI and Natural Language Processing", issuer: "Udemy", date: "Jul 2024" },
        { name: "Machine Learning Course with Python", issuer: "Udemy", date: "May 2024" },
        { name: "Web Developer Certificate", issuer: "Acmegrade", date: "Apr 2022" }
    ];

    const activities = [
        { title: "Karate Black Belt (1st Dan)", detail: "Earned Black Belt in Karate specializing in the Shitō-ryū style (awarded Jan 2020)." },
        { title: "Office Bearer - EPIC Club", detail: "Coordinated videography, production, and technical presentations for the videography club at Amrita Vishwa Vidyapeetham (2023 - 2024)." },
        { title: "Live in Labs Program", detail: "Participated in Live in Labs, researching and deploying socio-economic solutions in rural villages (Jan 2024)." },
        { title: "AYUDH Volunteer", detail: "Volunteered in AYUDH social service initiatives at Amrita Hospital, Faridabad." }
    ];

    return (
        <div className="w-full flex flex-col items-center px-6 py-8 md:px-10 text-left">
            <h2 className={`text-2xl md:text-3xl font-extrabold mb-6 self-start ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Certifications & Activities
            </h2>

            {/* Certifications Grid */}
            <div className="w-full mb-8">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Professional Certifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certs.map((cert, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'} flex flex-col justify-between`}>
                            <span className={`text-sm font-semibold leading-snug ${isDark ? 'text-white' : 'text-gray-800'}`}>{cert.name}</span>
                            <div className="flex justify-between items-center mt-3 text-xs opacity-60">
                                <span>{cert.issuer}</span>
                                <span>{cert.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Extra-curricular Activities */}
            <div className="w-full">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Activities & Leadership</h3>
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} space-y-4`}>
                    {activities.map((act, idx) => (
                        <div key={idx}>
                            <h4 className="text-sm font-bold text-ub-orange">{act.title}</h4>
                            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{act.detail}</p>
                            {idx < activities.length - 1 && <div className={`h-px mt-4 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Projects({ isDark }) {
    const project_list = [
        {
            name: "Real-Time System Resource Monitoring Dashboard",
            date: "Jun - Jul 2025",
            link: "https://github.com/PraneethReddy-github/Multi-Language-translator-using-NLP",
            description: "Built a system monitoring dashboard to track CPU, memory, and network utilization across Linux systems. Developed backend monitoring scripts using Python and Shell scripting and visualized metrics real-time.",
            domains: ["python", "bash", "react", "linux"]
        },
        {
            name: "Road Safety & Accident Prevention speed zones",
            date: "Sep - Oct 2024",
            link: "https://github.com/PraneethReddy-github/Multi-Language-translator-using-NLP",
            description: "Designed a speed control and accident prevention system using Arduino Uno, RF transmitters/receivers, ultrasonic sensors, and embedded C to automatically enforce speed limits in restriction zones.",
            domains: ["c++", "iot", "arduino"]
        },
        {
            name: "Secure Multi Client-Server Communication using SSL",
            date: "Mar - Apr 2024",
            link: "https://github.com/PraneethReddy-github/Multi-Language-translator-using-NLP",
            description: "Developed secure client-server communication using SSL/TLS with hybrid RSA-AES encryption, secure key exchange, digital signatures, and encrypted message transmission.",
            domains: ["python", "cryptography", "distributed"]
        },
        {
            name: "Genetic Algorithm for Intelligent Vehicle Routing",
            date: "Jun - Aug 2023",
            link: "https://github.com/PraneethReddy-github/Multi-Language-translator-using-NLP",
            description: "Implemented genetic algorithm optimization solving the Vehicle Routing Problem (VRP) for logistics networks, reducing routing costs and improving efficiency.",
            domains: ["python", "algorithms"]
        }
    ];

    const tag_colors = {
        "python": "bg-blue-500/10 text-blue-500 border-blue-500/20",
        "bash": "bg-gray-500/10 text-gray-400 border-gray-500/20",
        "react": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
        "linux": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        "c++": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        "iot": "bg-purple-500/10 text-purple-500 border-purple-500/20",
        "arduino": "bg-teal-500/10 text-teal-500 border-teal-500/20",
        "cryptography": "bg-red-500/10 text-red-500 border-red-500/20",
        "distributed": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        "algorithms": "bg-pink-500/10 text-pink-500 border-pink-500/20"
    };

    return (
        <div className="w-full flex flex-col items-center px-6 py-8 md:px-10">
            <h2 className={`text-2xl md:text-3xl font-extrabold mb-6 self-start ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Featured Projects
            </h2>

            <div className="grid grid-cols-1 gap-6 w-full text-left">
                {project_list.map((project, idx) => (
                    <a 
                        key={idx} 
                        href={project.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className={`group block p-5 rounded-2xl border transition-all duration-300 ${
                            isDark 
                                ? 'bg-white/5 border-white/10 hover:border-white/20' 
                                : 'bg-white border-gray-200 shadow-sm'
                        }`}
                    >
                        <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-ub-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                                <h3 className={`text-lg font-bold group-hover:text-ub-orange transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {project.name}
                                </h3>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                {project.date}
                            </span>
                        </div>
                        <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {project.domains.map((domain, dIdx) => (
                                <span 
                                    key={dIdx} 
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tag_colors[domain] || 'bg-gray-500/10 text-gray-500'}`}
                                >
                                    {domain}
                                </span>
                            ))}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

function Publications({ isDark }) {
    const patent_list = [
        {
            title: "Pothole Detection and Repair System and Method Thereof",
            type: "Indian Patent",
            year: "2025",
            description: "Developed an automated road maintenance system capable of detecting potholes using image acquisition and processing. Integrated computer vision, geolocation tracking, and automated filler dispensing mechanisms to perform real-time repairs."
        },
        {
            title: "IoT-Enabled Pharmaceutical Inventory Management System for Hospital Pharmacies",
            type: "Indian Patent",
            year: "2024",
            description: "Designed an IoT-based smart inventory system to automate pharmaceutical stock management. Implemented barcode scanning, real-time inventory tracking, automated restocking alerts, and expiry monitoring using ESP32, PHP, MySQL, and web-based dashboards."
        }
    ];

    const publication_list = [
        {
            title: "Multi-Client Server Based Quantum Key Distribution",
            venue: "16th ICCCNT, IIT Indore",
            date: "Jul 2025",
            description: "Designed a quantum-secure communication framework for distributed systems using Quantum Key Distribution (QKD) to enable scalable and secure key exchange between multiple clients and servers."
        },
        {
            title: "Cloud-Based Real-Time Anomaly Detection in Network Traffic",
            venue: "ICOCT, Bengaluru",
            date: "Jun 2025",
            link: "https://ieeexplore.ieee.org/document/11118829",
            description: "Implemented a machine learning-based anomaly detection system for network traffic monitoring using cloud infrastructure. Built real-time analytics pipelines for detecting suspicious activities in distributed network environments."
        },
        {
            title: "CloudShare: Passwordless Cloud-Based File Storage & Sharing Framework",
            venue: "ICOCT, Bengaluru",
            date: "Jun 2025",
            link: "https://ieeexplore.ieee.org/document/11118777/",
            description: "Developed a secure cloud storage framework eliminating traditional password authentication using asymmetric cryptography and challenge-response protocols. Integrated secure file sharing with AES encryption."
        },
        {
            title: "Development of a Robust Emergency Communication System Utilizing LoRa and GPS with Multi-Hop Routing",
            venue: "ICSSAS",
            date: "Oct 2024",
            link: "https://ieeexplore.ieee.org/document/10760890/",
            description: "Proposed a long-range emergency communication system using LoRa modules and GPS-based location tracking. Implemented a multi-hop mesh routing architecture for transmitting distress signals in disaster scenarios."
        },
        {
            title: "License Plate Detection and Recognition Using YOLOv8 and OCR",
            venue: "15th ICCCNT, IIT Mandi",
            date: "Jun 2024",
            link: "https://ieeexplore.ieee.org/document/10725878/",
            description: "Developed a computer vision based automatic license plate recognition system using YOLOv8 object detection and evaluated multiple OCR engines including EasyOCR, PaddleOCR, and Tesseract for character extraction."
        },
        {
            title: "Improvising Energy Efficiency of Heterogeneous Servers using AWS Services and Machine Learning Approaches",
            venue: "IEEE ICCCNT",
            date: "Jun 2024",
            link: "https://ieeexplore.ieee.org/document/10724212/",
            description: "Proposed a machine learning-based approach to optimize energy consumption in cloud infrastructure. Implemented regression models and deployed containerized workloads using AWS EC2 and Docker."
        },
        {
            title: "Crop Damage Prediction using Machine Learning Approaches",
            venue: "RAICS",
            date: "Dec 2023",
            link: "https://ieeexplore.ieee.org/document/10690031/",
            description: "Developed a machine learning model for agricultural crop damage prediction using classification algorithms such as Gradient Boosting and Neural Networks to improve accuracy in crop health analysis."
        }
    ];

    return (
        <div className="w-full flex flex-col items-center px-6 py-8 md:px-10">
            {/* Patents Section */}
            <div className="w-full text-left mb-10">
                <div className="flex items-center space-x-2.5 mb-6">
                    <svg className="w-6 h-6 text-ub-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    <h2 className={`text-xl md:text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Patents & Intellectual Property
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-6 w-full">
                    {patent_list.map((patent, idx) => (
                        <div 
                            key={idx} 
                            className={`p-5 rounded-2xl border ${
                                isDark 
                                    ? 'bg-white/5 border-white/10' 
                                    : 'bg-white border-gray-200'
                            }`}
                        >
                            <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {patent.title}
                                </h3>
                                <div className="flex gap-2">
                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        {patent.type}
                                    </span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                        {patent.year}
                                    </span>
                                </div>
                            </div>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {patent.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider line */}
            <div className={`my-6 h-px w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>

            {/* Publications Section */}
            <div className="w-full text-left">
                <div className="flex items-center space-x-2.5 mb-6">
                    <svg className="w-6 h-6 text-ub-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    <h2 className={`text-xl md:text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Publications & Research Papers
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-6 w-full">
                    {publication_list.map((pub, idx) => (
                        <a 
                            key={idx} 
                            href={pub.link || "#"}
                            target={pub.link ? "_blank" : "_self"}
                            rel={pub.link ? "noreferrer" : ""}
                            className={`group block p-5 rounded-2xl border transition-all duration-300 ${
                                isDark 
                                    ? 'bg-white/5 border-white/10 hover:border-white/20' 
                                    : 'bg-white border-gray-200 shadow-sm'
                            }`}
                        >
                            <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                                <h3 className={`text-base font-bold group-hover:text-ub-orange transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {pub.title}
                                </h3>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                    {pub.date}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs font-semibold text-ub-orange mb-3">
                                <span>{pub.venue}</span>
                            </div>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {pub.description}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Resume({ isDark }) {
    return (
        <div className="w-full h-full flex flex-col">
            {/* Action Top bar */}
            <div className={`flex justify-between items-center px-6 py-4 border-b ${isDark ? 'bg-[#242424] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'} select-none`}>
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-ub-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span className="font-bold text-sm">Resume.pdf</span>
                </div>
                <a 
                    href="./files/Resume.pdf" 
                    download="P_Praneeth_Reddy_Resume.pdf"
                    className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-ub-orange hover:bg-opacity-90 active:scale-95 transition-all shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Download PDF</span>
                </a>
            </div>

            {/* PDF Render Container with #navpanes=0 to hide pages thumbnails sidebar */}
            <div className="flex-grow w-full bg-gray-500">
                <iframe className="w-full h-full border-none" src="./files/Resume.pdf#navpanes=0" title="P Praneeth Reddy Resume" frameBorder="0"></iframe>
            </div>
        </div>
    );
}
