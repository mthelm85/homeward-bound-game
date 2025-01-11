<template>
  <v-container>
    <v-responsive class="align-centerfill-height mx-auto" max-width="800">
      <v-row class="text-center">
        <v-col>
          <div class="text-h6">Level {{ currentLevel }}</div>
        </v-col>
      </v-row>
    </v-responsive>

    <v-overlay
      v-model="showOverlay"
      class="align-center justify-center"
      persistent
    >
      <v-card
        :color="statusType"
        width="300"
      >
        <v-card-text class="text-center">
          <div class="text-h5 py-4 text-white">
            {{ gameStatus }}
          </div>
          <v-btn
            variant="tonal"
            @click="closeOverlay"
          >
            {{ statusType === 'success' ? 'Next Level' : 'Try Again' }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-overlay>

  </v-container>
</template>

<script>
import gameEvents from '../game/gameEvents'

export default {
  name: 'GameDisplay',
  data() {
    return {
      currentLevel: 1,
      gameStatus: 'Ready',
      statusType: 'success',
      showOverlay: false
    }
  },
  mounted() {
    gameEvents.on('game-state', ({ currentLevel }) => {
      this.currentLevel = currentLevel
    })

    gameEvents.on('launch-complete', ({ success }) => {
      this.gameStatus = success ? 'Success!' : 'Failed! Try again'
      this.statusType = success ? 'success' : 'error'
      this.showOverlay = true
    })
  },
  methods: {
    closeOverlay() {
      this.showOverlay = false
      if (this.statusType === 'success') {
        // Only emit reset after success confirmation
        gameEvents.emit('reset-level');
    } else {
        // For failure, just reset the rocket position
        gameEvents.emit('retry-level');
    }
    }
  },
  beforeDestroy() {
    gameEvents.removeAllListeners()
  }
}
</script>