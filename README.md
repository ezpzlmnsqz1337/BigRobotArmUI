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
This UI is designed to work with a python backend websocket server. Link: TBD


## Instalation
- clone this repository
- npm run serve for development
- npm run build for deployment