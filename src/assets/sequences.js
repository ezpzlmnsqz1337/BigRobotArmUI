export default [
  {
    name: 'Pick up and move',
    data: [
      'G0 B0 S0 E0 WR0 W0 G40',
      'G0 B0 S2300 E8000 WR0 W2266 G40',
      'G0 B0 S2300 E8000 WR0 W2150 G125',
      'G0 B0 S1000 E8000 WR0 W2150 G125',
      'G0 B-1500 S400 E2700 WR-800 W1000 G125',
      'G0 B-4333 S2200 E8000 WR0 W2266 G125',
      'G0 B-4333 S2200 E8000 WR0 W2266 G40',
      'G0 B0 S0 E0 WR0 W0 G40'
    ]
  },
  {
    name: 'Demo',
    data: [
      'G0 B500 S500 E3000 WR500 W1400 G40',
      'G0 B-700 S2600 E3200 WR-500 W1400 G120',
      'G0 B-1500 S0 E15000 WR0 W0 G100',
      'G0 B2000 S500 E2000 WR800 W2000 G130',
      'G0 B-2000 S2500 E-10250 WR0 W2000 G40'
    ]
  },
  {
    name: 'TestShoulder',
    data: [
      'G0 B0 S0 E0 WR0 W0 G40',
      'G0 B0 S2500 E0 WR0 W0 G40',
      'G0 B0 S0 E0 WR0 W0 G40',
      'G0 B0 S1500 E0 WR0 W0 G40',
      'G0 B0 S0 E0 WR0 W0 G40'
    ]
  }
]