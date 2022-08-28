import Vue from 'vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
  faLock,
  faLockOpen,
  faPlay,
  faPen,
  faTrashCan,
  faVideo,
  faFloppyDisk,
  faBan,
  faPlus,
  faPlug,
  faCircleNotch,
  faHouse,
  faCrosshairs,
  faTerminal,
  faGamepad,
  faSliders,
  faSquarePlus,
  faSquareMinus,
  faBars
} from '@fortawesome/free-solid-svg-icons'
import { faAmazon } from '@fortawesome/free-brands-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'

/* add icons to the library */
library.add(
  faLock,
  faLockOpen,
  faAmazon,
  faClock,
  faPlay,
  faPen,
  faTrashCan,
  faVideo,
  faFloppyDisk,
  faBan,
  faPlus,
  faPlug,
  faCircleNotch,
  faHouse,
  faCrosshairs,
  faTerminal,
  faGamepad,
  faSliders,
  faSquarePlus,
  faSquareMinus,
  faBars
)

/* add font awesome icon component */
Vue.component('fa-icon', FontAwesomeIcon)
