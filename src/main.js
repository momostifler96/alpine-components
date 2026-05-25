import Alpine from 'alpinejs';

import apSelect    from './components/Select.js';
import apDropdown  from './components/Dropdown.js';
import apInputText from './components/InputText.js';
import apInputTags from './components/InputTags.js';
import apSwitch    from './components/Switch.js';
import apSlider    from './components/Slider.js';
import apForm      from './components/Form.js';
import apInputMask from './components/InputMask.js';
import { registerToastStore } from './components/Toast.js';

// Register stores first (before Alpine.start)
registerToastStore(Alpine);

// Register data components
Alpine.data('apSelect',    apSelect);
Alpine.data('apDropdown',  apDropdown);
Alpine.data('apInputText', apInputText);
Alpine.data('apInputTags', apInputTags);
Alpine.data('apSwitch',    apSwitch);
Alpine.data('apSlider',    apSlider);
Alpine.data('apForm',      apForm);
Alpine.data('apInputMask', apInputMask);

window.Alpine = Alpine;
Alpine.start();
