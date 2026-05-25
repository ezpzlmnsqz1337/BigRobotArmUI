import { Commands } from '@/constants/Commands'
import joints from '@/assets/joints'

export interface CartesianWaypoint {
  radiusMm: number
  heightMm: number
  baseDegrees?: number
  toolPitchDegrees?: number
  wristRotateDegrees?: number
}

export interface LinearPathPlan {
  start: CartesianWaypoint
  end: CartesianWaypoint
  segments: number
}

export interface PlannedJointTargets {
  B: number
  S: number
  E: number
  WR: number
  W: number
}

const SHOULDER_TO_ELBOW_MM = 221.13
const ELBOW_TO_WRIST_ROTATE_MM = 117.952
const WRIST_ROTATE_TO_WRIST_MM = 105.892
const WRIST_TO_GRIPPER_CENTER_MM = 123.035
const ELBOW_TO_WRIST_MM = ELBOW_TO_WRIST_ROTATE_MM + WRIST_ROTATE_TO_WRIST_MM
const DEFAULT_TOOL_PITCH_DEGREES = 90

const jointByCode = new Map(joints.map(joint => [joint.code, joint]))

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180
}

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI
}

function clampCosine(value: number) {
  return Math.max(-1, Math.min(1, value))
}

function toJointSteps(code: keyof PlannedJointTargets, degrees: number) {
  const joint = jointByCode.get(code)
  if (!joint) {
    throw new Error(`Unknown joint code: ${code}`)
  }

  const signedDegrees = joint.inverted ? -degrees : degrees
  const steps = Math.round(signedDegrees * joint.stepsPerDegree)
  const normalizedSteps = steps === 0 ? 0 : steps

  if (
    normalizedSteps < joint.position.min ||
    normalizedSteps > joint.position.max
  ) {
    throw new Error(
      `Joint ${code} out of range for ${degrees.toFixed(
        2
      )} degrees: ${normalizedSteps}`
    )
  }

  return normalizedSteps
}

function createJointTargets(
  baseDegrees: number,
  shoulderDegrees: number,
  elbowDegrees: number,
  wristRotateDegrees: number,
  wristDegrees: number
): PlannedJointTargets {
  return {
    B: toJointSteps('B', baseDegrees),
    S: toJointSteps('S', shoulderDegrees),
    E: toJointSteps('E', elbowDegrees),
    WR: toJointSteps('WR', wristRotateDegrees),
    W: toJointSteps('W', wristDegrees)
  }
}

function scoreJointTargets(targets: PlannedJointTargets) {
  return (
    Math.abs(targets.S) +
    Math.abs(targets.E) +
    Math.abs(targets.WR) +
    Math.abs(targets.W)
  )
}

export function planCartesianWaypoint(
  waypoint: CartesianWaypoint
): PlannedJointTargets {
  const toolPitchDegrees =
    waypoint.toolPitchDegrees ?? DEFAULT_TOOL_PITCH_DEGREES
  const baseDegrees = waypoint.baseDegrees ?? 0
  const wristRotateDegrees = waypoint.wristRotateDegrees ?? 0
  const toolPitchRadians = degreesToRadians(toolPitchDegrees)
  const wristRadiusMm =
    waypoint.radiusMm - WRIST_TO_GRIPPER_CENTER_MM * Math.sin(toolPitchRadians)
  const wristHeightMm =
    waypoint.heightMm - WRIST_TO_GRIPPER_CENTER_MM * Math.cos(toolPitchRadians)
  const wristDistanceSquared =
    wristRadiusMm * wristRadiusMm + wristHeightMm * wristHeightMm
  const cosineElbow = clampCosine(
    (wristDistanceSquared -
      SHOULDER_TO_ELBOW_MM * SHOULDER_TO_ELBOW_MM -
      ELBOW_TO_WRIST_MM * ELBOW_TO_WRIST_MM) /
      (2 * SHOULDER_TO_ELBOW_MM * ELBOW_TO_WRIST_MM)
  )
  const elbowAngleMagnitude = Math.acos(cosineElbow)
  const elbowCandidates = [-elbowAngleMagnitude, elbowAngleMagnitude]
  const candidates: PlannedJointTargets[] = []

  elbowCandidates.forEach(elbowRadians => {
    const shoulderRadians =
      Math.atan2(wristRadiusMm, wristHeightMm) -
      Math.atan2(
        ELBOW_TO_WRIST_MM * Math.sin(elbowRadians),
        SHOULDER_TO_ELBOW_MM + ELBOW_TO_WRIST_MM * Math.cos(elbowRadians)
      )
    const wristRadians = toolPitchRadians - shoulderRadians - elbowRadians

    try {
      candidates.push(
        createJointTargets(
          baseDegrees,
          radiansToDegrees(shoulderRadians),
          radiansToDegrees(elbowRadians),
          wristRotateDegrees,
          radiansToDegrees(wristRadians)
        )
      )
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error
      }
    }
  })

  if (!candidates.length) {
    throw new Error(
      `No valid IK solution for radius ${waypoint.radiusMm} mm and height ${waypoint.heightMm} mm`
    )
  }

  return candidates.sort(
    (left, right) => scoreJointTargets(left) - scoreJointTargets(right)
  )[0]
}

export function createPositionCommand(targets: PlannedJointTargets) {
  return `${Commands.GO_TO} B${targets.B} S${targets.S} E${targets.E} WR${targets.WR} W${targets.W}`
}

export function createLinearPathSequence(plan: LinearPathPlan) {
  const commands: string[] = []

  for (let index = 0; index <= plan.segments; index += 1) {
    const progress = index / plan.segments
    const waypoint: CartesianWaypoint = {
      radiusMm:
        plan.start.radiusMm +
        (plan.end.radiusMm - plan.start.radiusMm) * progress,
      heightMm:
        plan.start.heightMm +
        (plan.end.heightMm - plan.start.heightMm) * progress,
      baseDegrees:
        (plan.start.baseDegrees ?? 0) +
        ((plan.end.baseDegrees ?? 0) - (plan.start.baseDegrees ?? 0)) *
          progress,
      toolPitchDegrees:
        (plan.start.toolPitchDegrees ?? DEFAULT_TOOL_PITCH_DEGREES) +
        ((plan.end.toolPitchDegrees ?? DEFAULT_TOOL_PITCH_DEGREES) -
          (plan.start.toolPitchDegrees ?? DEFAULT_TOOL_PITCH_DEGREES)) *
          progress,
      wristRotateDegrees:
        (plan.start.wristRotateDegrees ?? 0) +
        ((plan.end.wristRotateDegrees ?? 0) -
          (plan.start.wristRotateDegrees ?? 0)) *
          progress
    }

    commands.push(createPositionCommand(planCartesianWaypoint(waypoint)))
  }

  return commands
}
