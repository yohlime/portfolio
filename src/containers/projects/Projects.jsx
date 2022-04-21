import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Project.css';
import GithubRepoCard from '../../components/githubRepoCard/GithubRepoCard';
import Button from '../../components/button/Button';
import { openSource, socialMediaLinks } from '../../portfolio';
import { Fade } from 'react-reveal';

const Projects = () => {
  const [repo, setrepo] = useState([]);

  useEffect(() => {
    getRepoData();
  }, []);

  const getRepoData = async () => {
    const data = await Promise.all(
      openSource.repos.map(
        async (r) =>
          await axios
            .get(`https://api.github.com/repos/${openSource.githubUserName}/${r}`)
            .then(({ data }) => data)
      )
    );
    setrepo(data);
  };

  return (
    <Fade bottom duration={1000} distance="20px">
      <div className="main" id="opensource">
        <h1 className="project-title">Open Source Projects</h1>
        <div className="repo-cards-div-main">
          {repo.map((v) => {
            return <GithubRepoCard repo={v} key={v.id} />;
          })}
        </div>
        <Button
          text={'More Projects'}
          className="project-button"
          href={socialMediaLinks.github}
          newTab={true}
        />
      </div>
    </Fade>
  );
};

export default Projects;
