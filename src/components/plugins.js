/**
 * Created by yanyue on 2019-09-25 20:48
 * 注册全局的组件
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
import GCheckBox from './form/GCheckBox'
import GArea from './form/GArea'
import GTree from './form/GTree'
import GFileUploadTable from './form/GFileUploadTable'
import GFileUpload from './form/GFileUpload'
import GScreenFull from "./screenfull/Screenfull"

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
        Vue.component('g-check-box', GCheckBox);
        Vue.component('g-area', GArea);
        Vue.component('g-tree', GTree);
        Vue.component('g-file-upload-table', GFileUploadTable);
        Vue.component('g-file-upload', GFileUpload);
        Vue.component('g-screen-full', GScreenFull);
    }
};
