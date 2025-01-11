<template>
  <v-container>
    <v-responsive class="align-centerfill-height mx-auto" max-width="830">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-end mb-n12">
            <game-info />
          </div>
          <v-row class="pt-8">
            <v-col cols="6">
              <div class="text-caption">Velocity</div>
              <v-slider v-model="velocity" :max="15" :min="1" :step="0.2" prepend-icon="mdi-speedometer"
                @update:model-value="onVelocityChange" class="mb-0"></v-slider>
            </v-col>
            <v-col cols="6">
              <div class="text-caption">Angle</div>
              <v-slider v-model="angle" :max="90" :min="-90" :step="1" prepend-icon="mdi-angle-acute"
                @update:model-value="onAngleChange"></v-slider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-btn color="success" @click="launchRocket" :disabled="isSimulating" prepend-icon="mdi-rocket-launch">
              Go!
            </v-btn>
            </v-col>  
            <v-col cols="6">
              <v-btn color="error" @click="startOver" :disabled="isSimulating" prepend-icon="mdi-restart">
              Start Over
            </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script>
import gameEvents from '../game/gameEvents'

export default {
  name: 'GameControls',
  data() {
    return {
      velocity: 5,
      angle: 0,
      isSimulating: false
    }
  },
  mounted() {
    gameEvents.on('game-state', ({ isSimulating }) => {
      this.isSimulating = isSimulating
    })
  },
  methods: {
    onVelocityChange(newValue) {
      gameEvents.emit('update-velocity', newValue)
    },
    onAngleChange(newValue) {
      let angle;
      if (newValue >= 0) {
        angle = newValue
      } else {
        angle = 360 + newValue
      }
      gameEvents.emit('update-angle', (this.angle + 360) % 360)
    },
    launchRocket() {
      gameEvents.emit('launch-rocket')
    },
    startOver() {
      gameEvents.emit('start-over')
    }
  },
  beforeDestroy() {
    gameEvents.removeAllListeners()
  }
}
</script>