import React from 'react';
import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';
import Greeting from './greeting/Greeting';
import Profile from './profile/Profile';
import StackProgress from './skillProgress/skillProgress';
import Projects from './projects/Projects';
import Skills from './skills/Skills';
import Top from './topbutton/Top';

const Main = () => (
  <>
    <Header />
    <Greeting />
    <Skills />
    <StackProgress />
    <Projects />
    {/* <StartupProject />
    <Achievement />
    <Blogs />
    <Talks />
    <Twitter />
    <Podcast /> */}
    <Profile />
    <Footer />
    <Top />
  </>
);

export default Main;
