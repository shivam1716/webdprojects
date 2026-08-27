import ResumeContext from "./ResumeContext";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const ResumeState = (props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => {
      setLoading(true);
    },
    onAfterPrint: () => {
      setLoading(false);
    },
  });

  const userData = JSON.parse(localStorage.getItem("userData"))

  // const initialData = {
  //   personalData: {
  //     profileImage:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNI3kQLeYMnpy05PhEiuzS1rtRmNVL7VKvwcE4ACmQSQT1rRmUO5mHLyjH-mGHq0ueUQY&usqp=CAU",
  //     name: "Your Name",
  //     summary:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  //     profile: "Work Profile",
  //     address: "Address Line",
  //     phone: "Phone Number",
  //     email: "Email Address",
  //     skill: "Your, Skills, are, shown, here",
  //   },
  //   projectData: {
  //     projectTitles: { pTitle1: "Project Title 1" },
  //     projectDesc: { pDescription1: "Project Description 1" },
  //   },
  //   educationData: {
  //     educationTitles: { eTitle1: "Education Title 1" },
  //     educationDesc: { eDescription1: "Education Description 1" },
  //   },
  //   workData: {
  //     workTitles: { wTitle1: "Work Title 1" },
  //     workDesc: { wDescription1: "Work Description 1" },
  //   },
  //   awardData: {
  //     awards:
  //       "Certificate of Appreciation - 2019, Certificate of Appreciation - 2018",
  //   },
  // };

  const initialData = {
    personalData: {
      profileImage: userData?.personalData?.profileImage || "https://www.w3schools.com/howto/img_avatar.png",
      name: userData?.personalData?.name || 'Shivam Singh',
      summary: userData?.personalData?.summary || 'Results-driven full-stack developer focused on accessible, high-performance web experiences.',
      profile: userData?.personalData?.profile || 'Full Stack Developer',
      address: userData?.personalData?.address || 'New Delhi, India',
      phone: userData?.personalData?.phone || '+91 98765 43210',
      email: userData?.personalData?.email || 'shivam.singh@example.com',
      skill: userData?.personalData?.skill || 'React, JavaScript, Node.js, HTML, CSS, Git',
    },
    projectData: {
      projectTitles: { pTitle1: userData?.projectData?.projectTitles?.pTitle1 || "Resume Builder" },
      projectDesc: { pDescription1: userData?.projectData?.projectDesc?.pDescription1 || "Built a responsive resume editor, Added live preview and PDF export" },
    },
    educationData: {
      educationTitles: { eTitle1: userData?.educationData?.educationTitles?.eTitle1 || "Bachelor of Technology in Computer Science" },
      educationDesc: { eDescription1: userData?.educationData?.educationDesc?.eDescription1 || "2022 – 2026, CGPA: 8.5" },
    },
    workData: {
      workTitles: { wTitle1: userData?.workData?.workTitles?.wTitle1 || "Frontend Developer Intern" },
      workDesc: { wDescription1: userData?.workData?.workDesc?.wDescription1 || "Developed responsive interfaces, Collaborated with cross-functional teams" },
    },
    awardData: {
      awards:
        userData?.awardData?.awards || "Best Project Award - 2025, Certificate of Appreciation - 2024",
    },
  };

  const [themeData, setThemeData] = useState(initialData);
  const [checkProj, setCheckProj] = useState(false);
  const [checkWork, setCheckWork] = useState(false);
  const [checkAward, setCheckAward] = useState(false);
  const [loading, setLoading] = useState(false);
  //Change bellow two state for create any new Theme
  const [showComponent, setShowComponent] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("Theme1");
  const [selectBtn, setSelectBtn] = useState(true);
  const [requestedSection, setRequestedSection] = useState(null);

  return (
    <ResumeContext.Provider
      value={{
        initialData,
        selectBtn,
        setSelectBtn,
        requestedSection,
        setRequestedSection,
        checkAward,
        setCheckAward,
        componentRef,
        handlePrint,
        currentTheme,
        setCurrentTheme,
        showComponent,
        setShowComponent,
        loading,
        setLoading,
        themeData,
        setThemeData,
        checkProj,
        checkWork,
        setCheckProj,
        setCheckWork,
      }}
    >
      {props.children}
    </ResumeContext.Provider>
  );
};

export default ResumeState;
