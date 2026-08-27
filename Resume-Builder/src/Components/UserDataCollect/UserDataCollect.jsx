import React, { useContext, useEffect, useState } from "react";
import "./userCollectData.css";
import { IoMdCloudUpload } from "react-icons/io";
import {
  FormControl,
  Input,
  Heading,
  Textarea,
  Button,
  Switch,
} from "@chakra-ui/react";
import ResumeContext from "../../Context/ResumeContext";
const UserDataCollect = () => {
  const {
    themeData,
    checkAward,
    setCheckAward,
    setThemeData,
    checkProj,
    checkWork,
    setCheckProj,
    setCheckWork,
  } = useContext(ResumeContext);

  const userData = JSON.parse(localStorage.getItem("userData"));

  const [projectCount, setProjectCount] = useState(0);
  const [educationCount, setEducationCount] = useState(0);
  const [workCount, setWorkCount] = useState(0);
  const [projArrTemplate, setProjArrTemplate] = useState([]);
  const [educationArrTemplate, setEducationArrTemplate] = useState([]);
  const [workArrTemplate, setWorkArrTemplate] = useState([]);
  // const [projectData, setProjectData] = useState({ 'projectTitles': { pTitle1: "Project Title " }, 'projectDesc': { pDescription1: "Project Description are Shown here , with Bullet Points" } })
  // const [educationData, setEducationData] = useState({ 'educationTitles': { eTitle1: "Education Title" }, 'educationDesc': { eDescription1: "Education Description are Shown here , with Bullet Points" } })
  // const [workData, setWorkData] = useState({ 'workTitles': { wTitle1: "Work Title" }, 'workDesc': { wDescription1: "Work Description are Shown here , with Bullet Points" } })
  // const [personalData, setPersonalData] = useState({ profileImage: 'https://www.w3schools.com/howto/img_avatar.png', name: "Your Name", summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli', profile: "Work Profile", address: "Address Line", phone: "Phone Number", email: "Email Address", skill: 'Your, Skills, are, shown, here', })
  // const [awardData, setAwardData] = useState({ awards: 'Your Awards are shown here' })

  //refactored old data
  const [projectData, setProjectData] = useState({
    projectTitles: {
      pTitle1:
        userData?.projectData?.projectTitles?.pTitle1 || "Resume Builder",
    },
    projectDesc: {
      pDescription1:
        userData?.projectData?.projectDesc?.pDescription1 ||
        "Built a responsive resume editor, Added live preview and PDF export",
    },
  });

  const [educationData, setEducationData] = useState({
    educationTitles: {
      eTitle1:
        userData?.educationData?.educationTitles?.eTitle1 ||
        "Bachelor of Technology in Computer Science",
    },
    educationDesc: {
      eDescription1:
        userData?.educationData?.educationDesc?.eDescription1 ||
        "2022 – 2026, CGPA: 8.5",
    },
  });

  const [workData, setWorkData] = useState({
    workTitles: {
      wTitle1: userData?.workData?.workTitles?.wTitle1 || "Frontend Developer Intern",
    },
    workDesc: {
      wDescription1:
        userData?.workData?.workDesc?.wDescription1 || "Developed responsive interfaces, Collaborated with cross-functional teams",
    },
  });

  const [personalData, setPersonalData] = useState({
    profileImage:
      userData?.personalData?.profileImage ||
      "https://www.w3schools.com/howto/img_avatar.png",
    name: userData?.personalData?.name || "Shivam Singh",
    summary:
      userData?.personalData?.summary ||
      "Results-driven full-stack developer focused on accessible, high-performance web experiences.",
    profile: userData?.personalData?.profile || "Full Stack Developer",
    address: userData?.personalData?.address || "New Delhi, India",
    phone: userData?.personalData?.phone || "+91 98765 43210",
    email: userData?.personalData?.email || "shivam.singh@example.com",
    skill: userData?.personalData?.skill || "React, JavaScript, Node.js, HTML, CSS, Git",
  });
  const [awardData, setAwardData] = useState({
    awards:
      userData?.awardData?.awards ||
      "Best Project Award - 2025, Certificate of Appreciation - 2024",
  });

  // To Add Personal Data to the State
  const handleChangePersonal = (e) => {
    const { name, value } = e.target;
    setPersonalData({ ...personalData, [name]: value });
    if (e.target.name === "profileImage") {
      setPersonalData({
        ...personalData,
        profileImage: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  // To Add Project Data to the State
  const handleChangeProject = (e) => {
    const { name, value, id } = e.target;
    setProjectData((current) => ({
      ...current,
      [name.includes("pName") ? "projectTitles" : "projectDesc"]: {
        ...current[name.includes("pName") ? "projectTitles" : "projectDesc"],
        [id]: value,
      },
    }));
  };

  const handleProjectClick = (e) => {
    e.preventDefault();
    let i = projectCount;
    ++i;
    const template = (
      <>
        <FormControl isRequired className="my-2">
          <Input
            disabled={checkProj}
            id={`pTitle${i}`}
            name="pName"
            onChange={handleChangeProject}
            type={"text"}
            placeholder="Enter Project Title"
          />
        </FormControl>
        <FormControl isRequired className="my-2">
          <Textarea
            disabled={checkProj}
            id={`pDescription${i}`}
            name="pDescription"
            onChange={handleChangeProject}
            placeholder="Use comma to separate Description"
          />
        </FormControl>
      </>
    );
    setProjArrTemplate((current) => [...current, template]);
    setProjectCount(i);
  };

  // To Add Education Data to the State
  const handleChangeEducation = (e) => {
    const { name, value, id } = e.target;
    setEducationData((current) => ({
      ...current,
      [name.includes("eName") ? "educationTitles" : "educationDesc"]: {
        ...current[name.includes("eName") ? "educationTitles" : "educationDesc"],
        [id]: value,
      },
    }));
  };
  const handleEducationClick = (e) => {
    e.preventDefault();
    let i = educationCount;
    ++i;
    const template = (
      <>
        <FormControl isRequired className="my-2">
          <Input
            id={`eTitle${i}`}
            name="eName"
            onChange={handleChangeEducation}
            type={"text"}
            placeholder="Enter Title"
          />
        </FormControl>
        <FormControl isRequired className="my-2">
          <Textarea
            id={`eDescription${i}`}
            name="eDescription"
            onChange={handleChangeEducation}
            placeholder="Use comma to separate Description"
          />
        </FormControl>
      </>
    );
    setEducationArrTemplate((current) => [...current, template]);
    setEducationCount(i);
  };

  // To Add Work Data to the State
  const handleChangeWork = (e) => {
    const { name, value, id } = e.target;
    setWorkData((current) => ({
      ...current,
      [name.includes("wName") ? "workTitles" : "workDesc"]: {
        ...current[name.includes("wName") ? "workTitles" : "workDesc"],
        [id]: value,
      },
    }));
  };
  const handleWorkClick = (e) => {
    e.preventDefault();
    let i = workCount;
    ++i;
    const template = (
      <>
        <FormControl isRequired className="my-2">
          <Input
            id={`wTitle${i}`}
            name="wName"
            onChange={handleChangeWork}
            type={"text"}
            placeholder="Enter Job Title"
          />
        </FormControl>
        <FormControl isRequired className="my-2">
          <Textarea
            id={`wDescription${i}`}
            name="wDescription"
            onChange={handleChangeWork}
            placeholder="Use comma to separate Description"
          />
        </FormControl>
      </>
    );
    setWorkArrTemplate((current) => [...current, template]);
    setWorkCount(i);
  };

  // To Add Award & Achievement Data to the State
  const handleChangeAwards = (e) => {
    const { name, value } = e.target;
    setAwardData({ ...awardData, [name]: value });
  };

  useEffect(() => {
    setThemeData((current) => ({
      ...current,
      personalData,
      projectData,
      educationData,
      workData,
      awardData,
    }));
  }, [
    personalData,
    projectData,
    educationData,
    workData,
    awardData,
    setThemeData,
  ]);

  //handles logic of localStorage
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(themeData));
  }, [themeData]);

  return (
    <>
      <div id="form-collect">
        {/* Personal Details Area  */}
        <div id="personal-info" className="form-section mb-2">
          <Heading as="h4" size="md" className="mb-2">
            Personal Details
          </Heading>
          <hr />
          <p className="section-helper">Start with the contact details and headline recruiters see first.</p>

          <FormControl isRequired className="my-2">
            <div className="file">
              <label htmlFor="input-file">
                <i className="material-icons">
                  <IoMdCloudUpload size={30} />
                </i>
                Select a file
              </label>
              <input
                accept="image/*"
                name="profileImage"
                onChange={handleChangePersonal}
                id="input-file"
                type="file"
              />
              <img
                className="blah"
                src={personalData.profileImage}
                alt="your profile preview"
              />
            </div>
          </FormControl>
          <FormControl isRequired className="my-2">
            <Input
              name="name"
              value={personalData.name}
              onChange={handleChangePersonal}
              type={"text"}
              placeholder="Your Name"
            />
          </FormControl>
          <FormControl isRequired className="my-2">
            <Input
              name="summary"
              value={personalData.summary}
              onChange={handleChangePersonal}
              type={"text"}
              placeholder="Your Summary"
            />
          </FormControl>
          <FormControl isRequired className="my-2">
            <Input
              name="profile"
              value={personalData.profile}
              onChange={handleChangePersonal}
              type={"text"}
              placeholder="Work Profile"
            />
          </FormControl>
          <FormControl isRequired className="my-2">
            <Input
              name="address"
              value={personalData.address}
              onChange={handleChangePersonal}
              type={"text"}
              placeholder="Address"
            />
          </FormControl>
          <FormControl isRequired className="my-2">
            <Input
              name="phone"
              value={personalData.phone}
              onChange={handleChangePersonal}
              type={"tel"}
              placeholder="Phone number"
            />
          </FormControl>
          <FormControl isRequired className="my-2">
            <Input
              name="email"
              value={personalData.email}
              onChange={handleChangePersonal}
              type={"email"}
              placeholder="Email id"
            />
          </FormControl>
        </div>

        {/* Skills Area  */}
        <div id="skills" className="form-section mb-2">
          <Heading as="h4" size="md" className="my-2">
            Technical Skills
          </Heading>
          <hr />
          <p className="section-helper">Keep this focused on tools and strengths relevant to your target role.</p>

          <FormControl isRequired className="my-2">
            <Input
              name="skill"
              value={personalData.skill}
              onChange={handleChangePersonal}
              type={"text"}
              placeholder="Separate skills by comma"
            />
          </FormControl>
        </div>

        {/* Education Area  */}
        <div id="education" className="form-section mb-2">
          <Heading as="h4" size="md" className="my-2">
            Education
          </Heading>
          <hr />
          <p className="section-helper">Add your degree, institution, graduation period, and notable academic results.</p>
          <Button
            onClick={handleEducationClick}
            className="my-3 w-100"
            colorScheme="teal"
            variant="solid"
          >
            Add Education
          </Button>
          <FormControl className="my-2"><Input id="eTitle1" name="eName" value={educationData.educationTitles.eTitle1} onChange={handleChangeEducation} placeholder="Degree or qualification" /></FormControl>
          <FormControl className="my-2"><Textarea id="eDescription1" name="eDescription" value={educationData.educationDesc.eDescription1} onChange={handleChangeEducation} placeholder="Institution, dates, results" /></FormControl>
          {educationCount > 0
            ? educationArrTemplate.map((element, index) => (
                <div key={index}>{element}</div>
              ))
            : null}
        </div>

        {/* Projects Area  */}
        <div id="projects" className="form-section mb-2">
          <div className="d-flex align-items-center justify-content-between">
            <Heading as="h4" size="md" className="my-2">
              Projects
            </Heading>
            <Switch
              defaultChecked={true}
              onChange={() => setCheckProj(!checkProj)}
              colorScheme="teal"
            />
          </div>
          <hr />
          <p className="section-helper">Show projects that demonstrate the skills and results most relevant to your target role.</p>
          <Button
            disabled={checkProj}
            onClick={handleProjectClick}
            className="my-3 w-100"
            colorScheme="teal"
            variant="solid"
          >
            Add Projects
          </Button>
          <FormControl className="my-2"><Input disabled={checkProj} id="pTitle1" name="pName" value={projectData.projectTitles.pTitle1} onChange={handleChangeProject} placeholder="Project title" /></FormControl>
          <FormControl className="my-2"><Textarea disabled={checkProj} id="pDescription1" name="pDescription" value={projectData.projectDesc.pDescription1} onChange={handleChangeProject} placeholder="Use commas to separate highlights" /></FormControl>
          {projectCount > 0
            ? projArrTemplate.map((element, index) => (
                <div key={index}>{element}</div>
              ))
            : null}
        </div>

        {/* Work Experience Area  */}
        <div id="experience" className="form-section mb-2">
          <div className="d-flex align-items-center justify-content-between">
            <Heading as="h4" size="md" className="my-2">
              Work Experience
            </Heading>
            <Switch
              defaultChecked={true}
              onChange={() => setCheckWork(!checkWork)}
              colorScheme="teal"
            />
          </div>
          <hr />
          <p className="section-helper">Use strong action verbs and quantify results whenever possible.</p>
          <Button
            disabled={checkWork}
            onClick={handleWorkClick}
            className="my-3 w-100"
            colorScheme="teal"
            variant="solid"
          >
            Add Experience
          </Button>
          <FormControl className="my-2"><Input disabled={checkWork} id="wTitle1" name="wName" value={workData.workTitles.wTitle1} onChange={handleChangeWork} placeholder="Job title and company" /></FormControl>
          <FormControl className="my-2"><Textarea disabled={checkWork} id="wDescription1" name="wDescription" value={workData.workDesc.wDescription1} onChange={handleChangeWork} placeholder="Use commas to separate highlights" /></FormControl>
          {workCount > 0
            ? workArrTemplate.map((element, index) => (
                <div key={index}>{element}</div>
              ))
            : null}
        </div>

        {/* Awards & Achievement  */}
        <div id="form-personal" className="mb-2">
          <div className="d-flex align-items-center justify-content-between">
            <Heading as="h4" size="md" className="my-2">
              Awards & Achievement
            </Heading>
            <Switch
              defaultChecked={true}
              onChange={() => setCheckAward(!checkAward)}
              colorScheme="teal"
            />
          </div>
          <hr />
          <p className="section-helper">Add recognitions, certifications, or achievements that strengthen your profile.</p>
          <FormControl isRequired className="my-2">
            <Textarea
              name="awards"
              disabled={checkAward}
              value={awardData.awards}
              onChange={handleChangeAwards}
              placeholder="Use comma to separate Achievement"
            />
          </FormControl>
        </div>
      </div>
    </>
  );
};

export default UserDataCollect;
