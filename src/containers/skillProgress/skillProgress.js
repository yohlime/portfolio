import React from 'react';
import './Progress.css';
import { techStack } from '../../portfolio';
import { Fade } from 'react-reveal';
import { ReactComponent as SkillImg } from '../../assets/images/skill.svg';

const StackProgress = () => {
  if (techStack.viewSkillBars) {
    return (
      <Fade bottom duration={1000} distance="20px">
        <div className="skills-container">
          <div className="skills-bar">
            <h1 className="skills-heading">Proficiency</h1>
            {techStack.experience.map((exp, idx) => {
              const progressStyle = {
                width: exp.progressPercentage
              };
              return (
                <div className="skill" key={idx}>
                  <p>{exp.Stack}</p>
                  <div className="meter">
                    <span style={progressStyle}></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="skills-image">
            <SkillImg alt="Skills" />
          </div>
        </div>
      </Fade>
    );
  }
  return null;
};

export default StackProgress;
