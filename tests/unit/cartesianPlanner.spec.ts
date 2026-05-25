import {
  createLinearPathSequence,
  createPositionCommand,
  planCartesianWaypoint
} from '@/helpers/cartesianPlanner'

describe('cartesianPlanner', () => {
  it('should plan a reachable waypoint into joint targets', () => {
    const targets = planCartesianWaypoint({
      radiusMm: 260,
      heightMm: 205,
      toolPitchDegrees: 90
    })

    expect(targets).toStrictEqual({
      B: 0,
      S: 643,
      E: -12523,
      WR: 0,
      W: 14
    })
  })

  it('should create a straight-line sweep as G0 commands', () => {
    const commands = createLinearPathSequence({
      start: { radiusMm: 220, heightMm: 205, toolPitchDegrees: 90 },
      end: { radiusMm: 300, heightMm: 205, toolPitchDegrees: 90 },
      segments: 4
    })

    expect(commands).toHaveLength(5)
    expect(commands[0]).toBe('G0 B0 S962 E-13192 WR0 W197')
    expect(commands[2]).toBe('G0 B0 S643 E-12523 WR0 W14')
    expect(commands[4]).toBe('G0 B0 S338 E-11669 WR0 W-95')
  })

  it('should format a position command from joint targets', () => {
    expect(
      createPositionCommand({ B: 10, S: 20, E: 30, WR: 40, W: 50 })
    ).toBe('G0 B10 S20 E30 WR40 W50')
  })
})