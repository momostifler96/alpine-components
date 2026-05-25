import Alpine from 'alpinejs';

import apSelect    from './components/Select.js';
import apDropdown  from './components/Dropdown.js';
import apInputText from './components/InputText.js';
import apInputTags from './components/InputTags.js';
import apSwitch    from './components/Switch.js';
import apSlider    from './components/Slider.js';

Alpine.data('apSelect',    apSelect);
Alpine.data('apDropdown',  apDropdown);
Alpine.data('apInputText', apInputText);
Alpine.data('apInputTags', apInputTags);
Alpine.data('apSwitch',    apSwitch);
Alpine.data('apSlider',    apSlider);

window.Alpine = Alpine;
Alpine.start();
