import React, { Component } from "react";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import Profile from "./profile/Profile";
import StackProgress from "./skillProgress/skillProgress";
import Skills from "./skills/Skills";
import Top from "./topbutton/Top";
import Twitter from "./twitter-embed/twitter";

export default class Main extends Component {
  render() {
    return (
      <div>
        <Header />
        <Greeting />
        <Skills />
        <StackProgress />
        {/* <Projects />
        <StartupProject />
        <Achievement />
        <Blogs />
        <Talks /> */}
        <Twitter />
        {/* <Podcast /> */}
        <Profile />
        <Footer />
        <Top />
      </div>
    );
  }
}
