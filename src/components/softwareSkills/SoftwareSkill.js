import React from 'react';
import './SoftwareSkill.css';
import { skillsSection } from '../../portfolio';

const SoftwareSkill = () => (
  <div>
    <div className="software-skills-main-div">
      <ul className="dev-icons">
        {skillsSection.softwareSkills.map((skills, idx) => {
          return (
            <li className="software-skill-inline" name={skills.skillName} key={idx}>
              <i className={skills.fontAwesomeClassname}></i>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
);

export default SoftwareSkill;
