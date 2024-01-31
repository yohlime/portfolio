<template>
  <ul class="flex flex-wrap text-3xl md:text-5xl gap-2 justify-center items-center">
    <li v-if="skillsSection.softwareSkills.includes('html')" class="software-skill-inline">
      <div class="i-fa6-brands-html5"></div>
      <span>HTML</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('css')" class="software-skill-inline">
      <div class="i-fa6-brands-css3-alt"></div>
      <span>CSS</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('js')" class="software-skill-inline">
      <div class="i-fa6-brands-js"></div>
      <span>javascript</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('nodejs')" class="software-skill-inline">
      <div class="i-fa6-brands-node"></div>
      <span>NodeJS</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('react')" class="software-skill-inline">
      <div class="i-fa6-brands-react"></div>
      <span>React</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('vuejs')" class="software-skill-inline">
      <div class="i-fa6-brands-vuejs"></div>
      <span>VueJS</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('angular')" class="software-skill-inline">
      <div class="i-fa6-brands-angular"></div>
      <span>Angular</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('python')" class="software-skill-inline">
      <div class="i-fa6-brands-python"></div>
      <span>Python</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('php')" class="software-skill-inline">
      <div class="i-fa6-brands-php"></div>
      <span>PHP</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('laravel')" class="software-skill-inline">
      <div class="i-fa6-brands-laravel"></div>
      <span>Laravel</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('golang')" class="software-skill-inline">
      <div class="i-fa6-brands-golang"></div>
      <span>Go</span>
    </li>
    <li v-if="skillsSection.softwareSkills.includes('rust')" class="software-skill-inline">
      <div class="i-fa6-brands-rust"></div>
      <span>Rust</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { skillsSection } from '@/data/portfolio'
</script>

<style>
  .software-skill-inline {
    color: #868e96;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }

  .software-skill-inline:hover {
    color: #645beb;
  }

  .software-skill-inline > span {
    font-size: 0.75rem;
    line-height: 1rem;
  }
</style>
