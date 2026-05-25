/**
 * Point d'entrée Alpine Components pour Laravel (Vite).
 *
 * Copiez le contenu de `src/components/`, `src/utils/` et `src/data/`
 * depuis le dépôt alpine-components vers :
 *   resources/js/vendor/alpine-components/
 *
 * Puis ajustez les chemins d'import ci-dessous.
 */
import Alpine from 'alpinejs';

// Depuis ce dépôt (examples/laravel/resources/js → racine)
import apSelect    from '../../../../src/components/Select.js';
import apDropdown  from '../../../../src/components/Dropdown.js';
import apInputText from '../../../../src/components/InputText.js';
import apInputTags from '../../../../src/components/InputTags.js';
import apSwitch    from '../../../../src/components/Switch.js';
import apSlider    from '../../../../src/components/Slider.js';
import apForm      from '../../../../src/components/Form.js';
import apInputMask from '../../../../src/components/InputMask.js';
import { registerToastStore } from '../../../../src/components/Toast.js';

// Dans un projet Laravel déployé, préférez :
// import apSelect from './vendor/alpine-components/Select.js';

registerToastStore(Alpine);

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
