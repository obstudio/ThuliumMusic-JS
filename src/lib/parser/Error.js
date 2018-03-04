export class TmError extends Error {
  constructor(errID, msg, ...args) {
    super(msg)
    this.name = errID
    this.args = args
  }

  toJSON() {
    return {
      ErrID: this.name,
      Args: this.args
      // Message: this.message
    }
  }
}

export class BarLengthError extends TmError {
  constructor(id, index, length) {
    super('BarLength', '', id, index, length)
  }
}

export class DupChordError extends TmError {
  constructor(id, index, pitches) {
    super('DupChord', '', id, index, pitches)
  }
}

export class TraceError extends TmError {
  constructor(id, index, trace) {
    super('Trace', '', id, index, trace)
  }
}

export class VolumeError extends TmError {
  constructor(id, index, volume) {
    super('Trace', '', id, index, volume)
  }
}

export class UndefinedTokenError extends TmError {
  constructor(id, index, token) {
    super('Undef', '', id, index, token)
  }
}

export class DiffDurError extends TmError {
  constructor(id, index) {
    super('Sect::DiffDur', '', id, index)
  }
}
