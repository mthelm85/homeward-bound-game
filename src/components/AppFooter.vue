<template>
  <v-footer height="40" app>
    <v-row justify="center">
      <v-col class="text-center">
        &copy; {{ (new Date()).getFullYear() }} —
        <a 
          class="author-link text-decoration-none" 
          href="https://www.matthelm.pro" 
          rel="noopener noreferrer"
          target="_blank"
        >
          Matt Helm
        </a>
      </v-col>
    </v-row>
  </v-footer>
 </template>
 
 <style scoped>
 .author-link {
  color: #4CAF50;
  transition: color 0.2s ease-in-out;
 }
 
 .author-link:hover {
  color: #bfc34a;
  opacity: 0.8;
 }
 </style>