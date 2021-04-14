import React from 'react';
import './Skills.css';
import SoftwareSkill from '../../components/softwareSkills/SoftwareSkill';
import { skillsSection } from '../../portfolio';
import { Fade } from 'react-reveal';
import { ReactComponent as DevActivityImg } from '../../assets/images/developerActivity.svg';

const Skills = () => (
  <div className="main" id="skills">
    <div className="skills-main-div">
      <Fade left duration={1000}>
        <div className="skills-image-div">
          <DevActivityImg alt="emil working" />
        </div>
      </Fade>
      <Fade right duration={1000}>
        <div className="skills-text-div">
          <h1 className="skills-heading">{skillsSection.title} </h1>
          <p className="subTitle skills-text-subtitle">{skillsSection.subTitle}</p>
          <SoftwareSkill />
          <div>
            {skillsSection.skills.map((skills, idx) => (
              <p className="subTitle skills-text" key={idx}>
                {skills}
              </p>
            ))}
          </div>
        </div>
      </Fade>
    </div>
  </div>
);

export default Skills;
