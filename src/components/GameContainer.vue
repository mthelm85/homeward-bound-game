<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="830">
            <v-row class="text-center mb-n12">
                <v-col>
                    <span class="alien text-h2">Homeward Bound</span>
                </v-col>
            </v-row>
            <v-row class="text-center">
                <v-col>
                    <game-controls />
                </v-col>
            </v-row>
            <v-row class="text-center mt-n8 mb-n10">
                <v-col>
                    <div id="game-container"></div>
                </v-col>
            </v-row>
            <v-row>
                <game-display />
            </v-row>
        </v-responsive>
 
        <!-- Welcome Dialog -->
        <v-dialog v-model="showWelcome" persistent max-width="500">
            <v-card>
                <v-card-title class="text-h5">
                    Welcome to <i class="alien pr-2">Homeward Bound</i>
                </v-card-title>
                <v-card-text>
                    <p class="mb-4">Guide your spacecraft back home using gravitational fields.</p>
                    <p class="font-weight-bold mb-2">How to Play:</p>
                    <ul class="mb-4 ml-6">
                        <li>Adjust the launch velocity</li>
                        <li>Set your launch angle</li>
                        <li>Watch the yellow trajectory line to predict your path</li>
                        <li>Use planets' gravity to help guide your way</li>
                        <li>Click "Go!" to launch</li>
                    </ul>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        @click="hideWelcome"
                    >
                        Let's Play!
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
 </template>
 
 <script>
 import Phaser from 'phaser'
 import MainScene from '../game/scenes/MainScene'
 import GameControls from './GameControls.vue'
 import GameDisplay from './GameDisplay.vue'
 
 export default {
    name: 'GameContainer',
    components: {
        GameControls,
        GameDisplay
    },
    data() {
        return {
            game: null,
            showWelcome: true // Controls welcome dialog visibility
        }
    },
    mounted() {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false,
                    fps: 60
                }
            },
            fps: {
                target: 60,
                forceSetTimeOut: true
            },
            scene: MainScene
        }
 
        this.game = new Phaser.Game(config)
    },
    methods: {
        hideWelcome() {
            this.showWelcome = false
            // Optionally save to localStorage so it doesn't show again
            localStorage.setItem('homewardBoundWelcomeSeen', 'true')
        }
    },
    beforeDestroy() {
        if (this.game) {
            this.game.destroy(true)
        }
    }
 }
 </script>
<style>
.alien {
    font-family: 'Alien', sans-serif;
    background: linear-gradient(
    90deg,
    #4CAF50 0%,
    #bfc34a 50%,
    #4CAF50 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  /* Optional: add animation */
  animation: gradient-shift 3s linear infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
</style>