import React, { useContext, useEffect } from 'react'
import { Button, Badge, Text, Progress } from '@chakra-ui/react';
import { DownloadIcon, RepeatIcon, CheckCircleIcon } from '@chakra-ui/icons';
import UserDataCollect from '../Components/UserDataCollect/UserDataCollect';
import './BuilderArea.css'
import Footer from '../Components/Footer/Footer';
import ResumeContext from '../Context/ResumeContext';
import PropagateLoader from "react-spinners/PropagateLoader";
import WorkspaceSidebar from '../Components/WorkspaceSidebar/WorkspaceSidebar';

const BuilderArea = (props) => {
    const { showComponent, setShowComponent, loading, handlePrint, themeData, requestedSection, setRequestedSection } = useContext(ResumeContext)

    const details = themeData.personalData || {};
    const completedItems = [details.name !== 'Shivam Singh', details.profile !== 'Full Stack Developer', details.email !== 'shivam.singh@example.com', details.phone !== '+91 98765 43210', details.skill !== 'React, JavaScript, Node.js, HTML, CSS, Git'].filter(Boolean).length;
    const completion = Math.round((completedItems / 5) * 100);

    useEffect(() => {
        if (!requestedSection) return;
        const timeout = setTimeout(() => {
            document.getElementById(requestedSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setRequestedSection(null);
        }, 100);
        return () => clearTimeout(timeout);
    }, [requestedSection, setRequestedSection]);

    const handleSelectNewTemplate = () => {
        setShowComponent(!showComponent)
    }

    return (
        <div className="builder-workspace">
            {loading && <PropagateLoader id='spinner' color="#319795" size={30} />}
            <WorkspaceSidebar active="Personal info" />
            <main className="builder-content">
            <section className="builder-header">
                <div>
                    <Badge colorScheme="teal">Live editor</Badge>
                    <h1>Shape your next opportunity</h1>
                    <Text>Your changes are saved automatically and appear in the preview instantly.</Text>
                </div>
                <div className="save-status"><span /> Draft saved locally</div>
            </section>
            <section className="builder-insights" aria-label="Resume quality tools">
                <div className="completion-card">
                    <div><span className="eyebrow">Resume readiness</span><strong>{completion}% complete</strong></div>
                    <Progress value={completion} colorScheme="teal" size="sm" borderRadius="full" />
                    <Text>Complete your core profile details to strengthen your first impression.</Text>
                </div>
                <div className="quality-card"><CheckCircleIcon color="teal.400" /><div><strong>Professional formatting</strong><Text>Use concise accomplishments, role-specific keywords, and a focused summary.</Text></div></div>
            </section>
            <div id='main-box' className="d-flex justify-content-between flex-wrap mx-auto">
                <UserDataCollect />
                <div id='preview' aria-label="Live resume preview">
                    <div className="preview-label">Live preview</div>
                    {props.theme}
                </div>
            </div>
            <div className="builder-actions d-flex flex-wrap justify-content-center">
                <Button className='mx-2 my-2' colorScheme={'teal'} leftIcon={<DownloadIcon />} onClick={handlePrint}>Print / save PDF</Button>
                <Button className='mx-2 my-2' colorScheme={'teal'} leftIcon={<RepeatIcon />} variant={'outline'} onClick={handleSelectNewTemplate}>Change template</Button>
            </div>
            <Footer />
            </main>
        </div>
    )
}

export default BuilderArea
