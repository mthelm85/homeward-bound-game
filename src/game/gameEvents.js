// src/game/gameEvents.js
import Phaser from 'phaser'

class GameEventService {
  constructor() {
    this.emitter = new Phaser.Events.EventEmitter()
  }

  emit(event, data) {
    this.emitter.emit(event, data)
  }

  on(event, fn) {
    this.emitter.on(event, fn)
  }

  off(event, fn) {
    this.emitter.off(event, fn)
  }

  removeAllListeners() {
    this.emitter.removeAllListeners()
  }
}

export default new GameEventService()