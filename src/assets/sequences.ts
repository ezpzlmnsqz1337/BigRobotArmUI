export default [
  {
    name: 'Pick up and move',
    data: [
      'G1 E1 P80',
      'G0 B0 S0 E0 WR0 W0',
      'G0 B0 S2300 E9628 WR0 W2266',
      'G0 B0 S2300 E9628 WR0 W2266',
      'G1 E1 P125',
      'G0 B0 S1000 E8000 WR0 W2150',
      'G0 B-1500 S400 E2700 WR-800 W1000',
      'G0 B-4333 S2251 E10000 WR0 W2266',
      'G0 B-4333 S2251 E10000 WR0 W2266',
      'G1 E1 P80',
      'G0 B-4333 S1000 E10000 WR0 W2266 G40',
      'G0 B0 S0 E0 WR0 W0 G40',
      'G1 E0 P80'
    ]
  },
  {
    name: 'Demo',
    data: [
      'G0 B500 S500 E3000 WR500 W1400',
      'G1 E1 P40',
      'G0 B-700 S2600 E3200 WR-500 W1400 ',
      'G1 E1 P120',
      'G0 B-1500 S0 E10000 WR0 W0',
      'G1 E1 P100',
      'G0 B2000 S500 E2000 WR800 W2000',
      'G1 E1 P130',
      'G0 B-2000 S2500 E-10000 WR0 W2000',
      'G1 E0 P40'
    ]
  },
  {
    name: 'TestShoulder',
    data: [
      'G1 E1 P40',
      'G0 B0 S0 E0 WR0 W0',
      'G0 B0 S2500 E0 WR0 W0',
      'G0 B0 S0 E0 WR0 W0',
      'G0 B0 S1500 E0 WR0 W0',
      'G0 B0 S0 E0 WR0 W0',
      'G1 E0 P40'
    ]
  },
  {
    name: 'Clean table and stuff',
    data: [
      'G1 E1 P40',
      'G0 B-6337 S2300 E9628 WR0 W2266',
      'G0 B241 S2300 E9628 WR0 W2266',
      'G0 B-6500 S2300 E9628 WR0 W2266',
      'G0 B-107 S2300 E9628 WR0 W2266',
      'G0 B-6500 S2300 E9628 WR0 W2266',
      'G0 B-107 S2300 E9628 WR0 W2266',
      'G0 B-107 S2300 E-3689 WR0 W2266',
      'G0 B-107 S2300 E-9648 WR0 W-2318',
      'G0 B-6492 S2300 E-9648 WR0 W-2318',
      'G0 B-6492 S666 E8479 WR3 W2344',
      'G0 B-6492 S666 E8479 WR705 W2344',
      'G0 B-6492 S666 E8479 WR-729 W2344',
      'G0 B-6492 S666 E8479 WR824 W2344',
      'G0 B-6492 S666 E8479 WR-747 W2049',
      'G0 B-6492 S666 E8479 WR9 W2049',
      'G0 B0 S0 E0 WR0 W0',
      'G1 E0 P40'
    ]
  },
  {
    name: 'The move',
    data: [
      'G1 E1 P40',
      'G0 B0 S688 E10063 WR-884 W2147',
      'G1 E1 P130',
      'G0 B0 S688 E10063 WR-884 W2147',
      'G0 B0 S1053 E8437 WR-884 W2147',
      'G0 B0 S1469 E5854 WR-807 W2147',
      'G0 B0 S1053 E8437 WR-884 W2147',
      'G0 B0 S688 E10063 WR-884 W2147',
      'G0 B0 S1053 E8437 WR-884 W2147',
      'G0 B0 S1469 E5854 WR-807 W2147',
      'G0 B0 S0 E0 WR0 W0',
      'G1 E0 P40'
    ]
  },
  {
    name: 'The move 2',
    data: [
      'M201 B100 S100 E500 WR100 W100',
      'M203 B100 S100 E500 WR100 W100',
      'G1 E1 P40',
      'G0 B0 S0 E9146 WR0 W1004',
      'G1 E1 P133',
      'G0 B0 S0 E9146 WR0 W1004',
      'G0 B0 S0 E10688 WR0 W1004',
      'G0 B0 S0 E9146 WR0 W1004',
      'G0 B0 S0 E10688 WR0 W1004',
      'G0 B0 S0 E9146 WR0 W1004',
      'G0 B0 S0 E10688 WR0 W1004',
      'G0 B0 S0 E9146 WR0 W1004',
      'G0 B0 S0 E10688 WR0 W1004',
      'G1 E0 P40',
      'M201 B100 S100 E100 WR100 W100',
      'M203 B100 S100 E100 WR100 W100',
      'G28'
    ]
  },
  {
    name: 'Spin da shit',
    data: [
      'G1 E1 P40',
      'G0 B5465 S0 E0 WR0 W0',
      'G0 B-5428 S0 E0 WR0 W0',
      'G0 B5465 S0 E0 WR0 W0',
      'G0 B-5428 S0 E0 WR0 W0',
      'G1 E0 P40'
    ]
  },
  {
    name: 'Spin da wrist',
    data: [
      'G1 E1 P40',
      'G0 B0 S0 E0 WR0 W2701',
      'G0 B0 S0 E0 WR-1616 W2701',
      'G0 B0 S0 E0 WR-1616 W-299',
      'G1 E1 P98',
      'G0 B0 S0 E0 WR-1616 W-299',
      'G0 B0 S0 E0 WR801 W-2425',
      'G1 E1 P55',
      'G0 B0 S0 E0 WR801 W1370',
      'G1 E0 P40'
    ]
  },
  {
    name: 'Pickup from top',
    data: [
      'G1 E1 P40',
      'G0 B0 S1410 E12771 WR0 W0',
      'G1 E1 P117',
      'G0 B0 S1410 E12771 WR0 W0',
      'G0 B0 S956 E12771 WR0 W0',
      'G0 B-3706 S2340 E9688 WR0 W2469',
      'G1 E1 P57',
      'G0 B-417 S1023 E12480 WR0 W2469',
      'G0 B-417 S1023 E12480 WR0 W-1576',
      'G0 B0 S0 E0 WR0 W0',
      'G1 E0 P40'
    ]
  },
  { name: 'Photo position', data: ['G0 B-1555 S953 E8767 WR0 W1105'] },
  {
    name: 'Repeat command',
    data: ['BEGIN I5', 'G0 B2312 S0 E0 WR0 W0', 'G0 B-3251 S0 E0 WR0 W0', 'END']
  },
  {
    name: 'Repeat without loop',
    data: [
      'G0 B2312 S0 E0 WR0 W0',
      'G0 B-3251 S0 E0 WR0 W0',
      'G0 B2312 S0 E0 WR0 W0',
      'G0 B-3251 S0 E0 WR0 W0',
      'G0 B2312 S0 E0 WR0 W0',
      'G0 B-3251 S0 E0 WR0 W0',
      'G0 B2312 S0 E0 WR0 W0',
      'G0 B-3251 S0 E0 WR0 W0',
      'G0 B2312 S0 E0 WR0 W0',
      'G0 B-3251 S0 E0 WR0 W0'
    ]
  },
  {
    name: 'The move 2 - repeat',
    data: [
      'G28',
      'M201 B100 S100 E500 WR100 W100',
      'M203 B100 S100 E500 WR100 W100',
      'G1 E1 P40',
      'G0 B0 S0 E9146 WR0 W1004',
      'G1 E1 P133',
      'BEGIN I5',
      'G0 B0 S0 E9146 WR0 W1004',
      'G0 B0 S0 E10688 WR0 W1004',
      'END',
      'M201 B100 S100 E100 WR100 W100',
      'M203 B100 S100 E100 WR100 W100',
      'G28'
    ]
  },
  {
    name: 'Border line',
    data: [
      'S1',
      'G0 B1650 S1661 E5248 WR0 W-2073',
      'G0 B699 S1565 E6094 WR0 W-2197',
      'G0 B-707 S1780 E4758 WR0 W-2465',
      'G0 B-1741 S2345 E-9 WR0 W-3000'
    ]
  }
]
