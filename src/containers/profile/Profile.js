import React, { useState, useEffect } from 'react';
import GithubProfileCard from '../../components/githubProfileCard/GithubProfileCard';
import axios from 'axios';
import { openSource } from '../../portfolio';
import Contact from '../contact/Contact';

const Profile = () => {
  const [prof, setrepo] = useState([]);

  const setProfileFunction = (array) => setrepo(array);

  const getProfileData = () => {
    const client = axios
      .get('https://api.github.com/users/' + openSource.githubUserName)
      .then(function (response) {
        setProfileFunction(response.data);
      });
  };

  useEffect(() => {
    getProfileData();
  }, []);

  if (openSource.showGithubProfile === 'true') {
    return <GithubProfileCard prof={prof} key={prof.id} />;
  } else {
    return <Contact />;
  }
};

export default Profile;
