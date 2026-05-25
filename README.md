# BigRobotArmUI

User interface for controlling BigRobotArm from this instructables: 

https://www.instructables.com/Build-a-Giant-3D-Printed-Robot-Arm/

So far this is work in progress.

## Features
- Send websocket messages to control the arm
- 3D visualization of the arm position

## Topology of this project
TBD

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

## Node.js version

This project is pinned to Node `16.20.2` in [.nvmrc](c:/Projects/BigRobotArm/BigRobotArmUI/.nvmrc).

Recommended setup in Git Bash:

```bash
nvm install
nvm use
npm install
```