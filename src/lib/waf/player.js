import { Loader } from './loader'
export default class Player {
  /** 构造方法，初始化Loader */
  constructor() {
    this.envelopes = []
    this.loader = new Loader(this)
    this.onCacheFinish = null
    this.onCacheProgress = null
    this.afterTime = 0.05
    this.nearZero = 0.000001
  }

  /**
     * 辅助方法，用于构造Chord/Strum/Snap
     */
  queueChord(ctx, target, preset, when, pitches, duration, volume, slides) {
    for (var i = 0; i < pitches.length; i++) {
      this.queueWaveTable(ctx, target, preset, when, pitches[i], duration, volume - Math.random() * 0.01, slides)
    }
  }

  queueStrumUp(ctx, target, preset, when, pitches, duration, volume, slides) {
    pitches.sort((a, b) => b - a)
    this.queueStrum(ctx, target, preset, when, pitches, duration, volume, slides)
  }

  queueStrumDown(ctx, target, preset, when, pitches, duration, volume, slides) {
    pitches.sort((a, b) => a - b)
    this.queueStrum(ctx, target, preset, when, pitches, duration, volume, slides)
  }

  queueStrum(ctx, target, preset, when, pitches, duration, volume, slides) {
    if (volume) {
      volume = 1.0 * volume
    } else {
      volume = 1.0
    }
    if (when < ctx.currentTime) {
      when = ctx.currentTime
    }
    for (var i = 0; i < pitches.length; i++) {
      this.queueWaveTable(ctx, target, preset, when + i * 0.01, pitches[i], duration, volume - Math.random() * 0.01, slides)
      volume = 0.9 * volume
    }
  }

  queueSnap(ctx, target, preset, when, pitches, duration, volume, slides) {
    volume = 1.5 * (volume | 1.0)
    duration = 0.05
    this.queueChord(ctx, target, preset, when, pitches, duration, volume, slides)
  }

  /**
     * 播放的基本方法
     * @param {AudioContext} ctx
     * @param {AudioDestinationNode} target
     * @param {AudioFont} preset sf2转化得到的json音源对象
     * @param {number} when 开始时间
     * @param {number} pitch 音高
     * @param {number} duration 持续时间
     * @param {number} volume 音量
     * @param {any[]} slides
     * @returns {GainNode }
     */
  queueWaveTable(ctx, target, preset, when, pitch, duration, volume, slides) {
    if (volume) {
      volume = 1.0 * volume
    } else {
      volume = 1.0
    }
    var zone = this.findZone(ctx, preset, pitch)
    if (!(zone.buffer)) {
      console.log('empty buffer ', zone)
      return
    }
    var baseDetune = zone.originalPitch - 100.0 * zone.coarseTune - zone.fineTune
    var playbackRate = 1.0 * Math.pow(2, (100.0 * pitch - baseDetune) / 1200.0)
    // var sampleRatio = zone.sampleRate / audioContext.sampleRate
    var startWhen = when
    if (startWhen < ctx.currentTime) {
      startWhen = ctx.currentTime
    }
    var waveDuration = duration + this.afterTime
    var loop = true
    if (zone.loopStart < 1 || zone.loopStart >= zone.loopEnd) {
      loop = false
    }
    if (!loop) {
      if (waveDuration > zone.buffer.duration / playbackRate) {
        waveDuration = zone.buffer.duration / playbackRate
      }
    }
    var envelope = this.findEnvelope(ctx, target, startWhen, waveDuration)
    this.setupEnvelope(ctx, envelope, zone, volume, startWhen, waveDuration, duration)
    envelope.audioBufferSourceNode = ctx.createBufferSource()
    envelope.audioBufferSourceNode.playbackRate.setValueAtTime(playbackRate, 0)
    if (slides && slides.length > 0) {
      envelope.audioBufferSourceNode.playbackRate.setValueAtTime(playbackRate, when)
      for (var i = 0; i < slides.length; i++) {
        var newPlaybackRate = 1.0 * Math.pow(2, (100.0 * slides[i].pitch - baseDetune) / 1200.0)
        var newWhen = when + slides[i].when
        envelope.audioBufferSourceNode.playbackRate.linearRampToValueAtTime(newPlaybackRate, newWhen)
      }
    }
    envelope.audioBufferSourceNode.buffer = zone.buffer
    if (loop) {
      envelope.audioBufferSourceNode.loop = true
      envelope.audioBufferSourceNode.loopStart = zone.loopStart / zone.sampleRate + zone.delay
      envelope.audioBufferSourceNode.loopEnd = zone.loopEnd / zone.sampleRate + zone.delay
    } else {
      envelope.audioBufferSourceNode.loop = false
    }
    envelope.audioBufferSourceNode.connect(envelope)
    envelope.audioBufferSourceNode.start(startWhen, zone.delay)
    envelope.audioBufferSourceNode.stop(startWhen + waveDuration)
    envelope.when = startWhen
    envelope.duration = waveDuration
    envelope.pitch = pitch
    envelope.preset = preset
    return envelope
  }

  /**
     * setup attack-hold-decay-sustain-release envelop
     */
  setupEnvelope(ctx, envelope, zone, volume, when, sampleDuration, noteDuration) {
    envelope.gain.setValueAtTime(this.noZeroVolume(0), ctx.currentTime)
    var lastTime = 0
    var lastVolume = 0
    var duration = noteDuration
    var ahdsr = zone.ahdsr
    if (sampleDuration < duration + this.afterTime) {
      duration = sampleDuration - this.afterTime
    }
    if (ahdsr) {
      if (!(ahdsr.length > 0)) {
        ahdsr = [{
          duration: 0,
          volume: 1
        }, {
          duration: 0.5,
          volume: 1
        }, {
          duration: 1.5,
          volume: 0.5
        }, {
          duration: 3,
          volume: 0
        }]
      }
    } else {
      ahdsr = [{
        duration: 0,
        volume: 1
      }, {
        duration: duration,
        volume: 1
      }]
    }
    envelope.gain.cancelScheduledValues(when)
    envelope.gain.setValueAtTime(this.noZeroVolume(ahdsr[0].volume * volume), when)
    for (var i = 0; i < ahdsr.length; i++) {
      if (ahdsr[i].duration > 0) {
        if (ahdsr[i].duration + lastTime > duration) {
          var r = 1 - (ahdsr[i].duration + lastTime - duration) / ahdsr[i].duration
          var n = lastVolume - r * (lastVolume - ahdsr[i].volume)
          envelope.gain.linearRampToValueAtTime(this.noZeroVolume(volume * n), when + duration)
          break
        }
        lastTime = lastTime + ahdsr[i].duration
        lastVolume = ahdsr[i].volume
        envelope.gain.linearRampToValueAtTime(this.noZeroVolume(volume * lastVolume), when + lastTime)
      }
    }
    envelope.gain.linearRampToValueAtTime(this.noZeroVolume(0), when + duration + this.afterTime)
  }

  findEnvelope(ctx, target/*, when , duration */) {
    var envelope
    for (const e of this.envelopes) {
      if (e.target === target && ctx.currentTime > e.when + e.duration + 0.1) {
        try {
          e.audioBufferSourceNode.disconnect()
          e.audioBufferSourceNode.stop(0)
          e.audioBufferSourceNode = null
        } catch (x) {
          // audioBufferSourceNode is dead already
        }
        envelope = e
        break
      }
    }
    if (envelope === undefined) {
      envelope = ctx.createGain()
      envelope.target = target
      envelope.connect(target)
      envelope.cancel = () => {
        if (envelope.when + envelope.duration > ctx.currentTime) {
          envelope.gain.cancelScheduledValues(0)
          envelope.gain.setTargetAtTime(0.00001, ctx.currentTime, 0.1)
          envelope.when = ctx.currentTime + 0.00001
          envelope.duration = 0
        }
      }
      this.envelopes.push(envelope)
    }
    return envelope
  }

  adjustZone(ctx, zone) {
    if (!zone.buffer) {
      zone.delay = 0
      zone.loopStart = this.numValue(zone.loopStart, 0)
      zone.loopEnd = this.numValue(zone.loopEnd, 0)
      zone.coarseTune = this.numValue(zone.coarseTune, 0)
      zone.fineTune = this.numValue(zone.fineTune, 0)
      zone.originalPitch = this.numValue(zone.originalPitch, 6000)
      zone.sampleRate = this.numValue(zone.sampleRate, 44100)
      zone.sustain = this.numValue(zone.originalPitch, 0)
      if (zone.sample) {
        const decoded = atob(zone.sample)
        zone.buffer = ctx.createBuffer(1, decoded.length / 2, zone.sampleRate)
        var float32Array = zone.buffer.getChannelData(0)
        var b1, b2, n
        for (var i = 0; i < decoded.length / 2; i++) {
          b1 = decoded.charCodeAt(i * 2)
          b2 = decoded.charCodeAt(i * 2 + 1)
          if (b1 < 0) {
            b1 = 256 + b1
          }
          if (b2 < 0) {
            b2 = 256 + b2
          }
          n = b2 * 256 + b1
          if (n >= 65536 / 2) {
            n = n - 65536
          }
          float32Array[i] = n / 65536.0
        }
      } else if (zone.file) {
        var datalen = zone.file.length
        var arraybuffer = new ArrayBuffer(datalen)
        var view = new Uint8Array(arraybuffer)
        const decoded = atob(zone.file)
        var b
        for (i = 0; i < decoded.length; i++) {
          b = decoded.charCodeAt(i)
          view[i] = b
        }
        return new Promise((resolve, reject) => {
          ctx.decodeAudioData(arraybuffer, resolve, reject)
        }).then((buffer) => {
          zone.buffer = buffer
        })
      }
    }
  }

  cancelQueue(ctx) {
    for (const e of this.envelopes) {
      e.gain.cancelScheduledValues(0)
      e.gain.setValueAtTime(this.nearZero, ctx.currentTime)
      e.when = -1
      try {
        e.audioBufferSourceNode.disconnect()
      } catch (ex) {
        console.log(ex)
      }
    }
  }

  adjustPreset(ctx, preset) {
    return Promise.all(preset.zones.map((zone) => this.adjustZone(ctx, zone)))
  }

  /**
     * zones must have been initialized
     */
  findZone(ctx, preset, pitch) {
    return preset.zones.find((zone) => zone.keyRangeLow <= pitch && zone.keyRangeHigh + 1 >= pitch)
  }

  noZeroVolume(n) {
    if (n > this.nearZero) {
      return n
    } else {
      return this.nearZero
    }
  }

  numValue(aValue, defValue) {
    if (typeof aValue === 'number') {
      return aValue
    } else {
      return defValue
    }
  }
}
