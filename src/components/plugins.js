/**
 * Created by yanyue on 2019-09-25 20:48
 */
import GDialog from './dialog/GDialog';
import GSplitLevel from './split/SplitLevel';
import GSplitVertical from './split/SplitVertical';
import GTable from './table/Table'
import GPagination from './pagination/Pagination'
import GAutoComplete from './form/GAutoComplete'
import GInput from './form/GInput'
import GDate from './form/GDate'
import GSelect from './form/GSelect'

export default {
    install(Vue, options) {
        Vue.component('g-dialog', GDialog);
        Vue.component('g-split-l', GSplitLevel);
        Vue.component('g-split-v', GSplitVertical);
        Vue.component('g-table', GTable);
        Vue.component('g-pagination', GPagination);
        Vue.component('g-auto-complete', GAutoComplete);
        Vue.component('g-input', GInput);
        Vue.component('g-date', GDate);
        Vue.component('g-select', GSelect);
    }
};
