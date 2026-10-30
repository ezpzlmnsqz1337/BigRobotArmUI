# BigRobotArmUI

User interface for controlling BigRobotArm from this instructables:

https://www.instructables.com/Build-a-Giant-3D-Printed-Robot-Arm/

So far this is work in progress.

## Features
- Send websocket messages to control the arm
- 3D visualization of the arm position
- Manual joint control for position, speed, acceleration, and gripper
- Record the current arm state into reusable command sequences
- Edit, store, and remove sequences (persisted in `localStorage`)
- Play sequences as server-side jobs and follow active/queued job progress
- Preview sequences in the 3D view without moving the real arm
- Cartesian straight-line planning helper that turns waypoints into `G0` commands
- Terminal for sending raw serial commands and inspecting websocket traffic
- PWA build with service worker support

## Topology of this project
- `src/views/Main.vue` — main screen, 3D model, and top-level websocket message handling
- `src/components/` — sidebar UI: manual control, sequences, recorder, terminal, connection
- `src/helpers/Arm.ts` — three.js scene, render loop, and GLTF model loading
- `src/helpers/cartesianPlanner.ts` — inverse kinematics for Cartesian waypoints and linear paths
- `src/store/` — observable stores for connection, jobs, arm state, sequences, and websocket communication
- `src/assets/sequences.ts` — default demo sequences, including generated linear-path demos
- `src/mixins/ArmMixin.vue` — shared component access to the arm stores and command sender
- `tests/unit/` — Jest unit tests for the stores and helpers

I used different board and drivers that in the instructables.
- board: MKSGenL v2.1
- drivers: TMC2208

## Prerequisites
This UI is designed to work with a python backend websocket server.
https://github.com/ezpzlmnsqz1337/BigRobotArmServer - host this UI and connect to the MKS Gen L over USB (on raspberrypi)
https://github.com/ezpzlmnsqz1337/BigRobotArmFirmware - firmware for the MKS Gen L



## Installation
- clone this repository
- install `nvm` for your shell environment
- run `nvm install`
- run `nvm use`
- run `npm install`
- run `npm run serve` for development
- run `npm run build` for deployment
- run `npm run test:unit` for the unit tests
- run `npm run lint` for linting (use `npm run lint -- --fix` to auto-fix)

## Continuous integration

The workflow in `.github/workflows/github-ci.yml` runs on every push and pull request:

- `npm run lint`
- `npm run test:unit`
- `npm run build`

## Node.js version

This project is pinned to Node `16.20.2` in [.nvmrc](.nvmrc).

Recommended setup in Git Bash:

```bash
nvm install
nvm use
npm install
```

The Node 16 pin matches the current Vue 2 / three.js toolchain. Upgrading Node
is intentionally left as a separate decision.
