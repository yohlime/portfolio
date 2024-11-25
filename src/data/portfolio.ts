export const greeting = {
  username: 'Emilio Gozo',
  title: "yo! I'm emil",
  subTitle: 'I spend time studying the weather and other cool stuff',
  resumeLink: 'https://linkedin.com/in/emiliogozo',
}

type SocialMedia = 'github' | 'linkedin' | 'gitlab' | 'twitter' | 'xTwitter' | 'facebook' | 'instagram' | 'mastodon'
export const socialMediaLinks: Partial<Record<SocialMedia, string>> = {
  github: 'https://github.com/yohlime',
  linkedin: 'http://linkedin.com/in/emiliogozo',
  xTwitter: 'http://twitter.com/emiliogozo',
  mastodon: 'https://hachyderm.io/@yohlime',
}

export const skillsSection = {
  title: 'What I do',
  subTitle: '',
  skills: [
    '🌧️ Numerical Modelling using programs such as Weather Research and Forecasting (WRF) and Regional Climate Model (RegCM)',
    '📈 Data analysis especially on weather and climate information',
    '🌐 Web development using javascript and php',
  ],

  /* Make Sure You include correct Font Awesome Classname to view your icon
https://fontawesome.com/icons?d=gallery */

  softwareSkills: ['html', 'css', 'js', 'react', 'nodejs', 'python', 'php', 'laravel', 'golang', 'rust'],
}

export const openSource = {
  githubUserName: 'yohlime',
  showGithubProfile: 'true', // Set true or false to show Contact profile using Github, defaults to
}

export const contactInfo = {
  title: 'Contact Me',
  subtitle: 'Discuss a project or just want to say hi? My Inbox is open for all.',
  email_address: 'freelance.han44@aleeas.com',
}
