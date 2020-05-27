<template>
    <div class='GFullCalendar'>
        <div class="GFullCalendar-outer">
            <div class="GFullCalendar-row">
                <div class="GFullCalendar-cell timeDisp"></div>
                <div class="GFullCalendar-cell timeDisp" v-for="date of dateList"
                     :key="`${date.getMonth()}-${date.getDay()}`">{{date|dateText}}
                </div>
            </div>
            <div class="GFullCalendar-row" v-for="(time,rowIndex) of timeList" :key="time"
                 @mousemove.stop="setSelectDest(rowIndex)">
                <div class="GFullCalendar-cell timeDisp">{{time}}</div>
                <div class="GFullCalendar-cell dateSelect" v-for="(date,colIndex) of dateList"
                     :key="`${date.getMonth()}-${date.getDay()}`" :class="cellClass(rowIndex,colIndex)"
                     @mousedown.stop="startSelect(rowIndex,colIndex)">
                </div>
            </div>
            <div class="dateSelectedContainer" ref="dateSelectedContainer">
                <div class="selectProgress" :style="styleSelectionProgress" v-if="selectActive"></div>
                <el-popover
                        trigger="hover"
                        v-for="(item,index) of selectionDisplay"
                        :key="item.key"
                        class="selectedArea"
                        :class="styleSelectedClass(item,index)"
                        :style="styleSelectedArea(item,index)"
                        :open-delay="0"
                        transition="none"
                >
                    <div @click.stop="pickSelection(item)" class="selectedAreaTrigger" slot="reference"></div>
                    <slot name="popup" :data="item"></slot>
                </el-popover>
            </div>
        </div>

    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/17 22:10
     */
    import uuid from "uuid/v4";

    export default {
        name: "GFullCalendar",
        props: {
            startDate: null,  //起始日期
            minDate: null,  //可选最早日期
            maxDate: null,  //可选最晚日期
            maxMinutes: {   //限制选择时间的长度
                type: Number,
                default: 0
            },
            maxCount: {   //限制选择时间段的个数
                type: Number,
                default: 0
            },
            value: null,
            disabled: Boolean

        },
        data() {
            return {
                startHour: 8,
                endHour: 20,
                stepMinute: 30,
                days: 7,
                // 显示选择状态的容器的尺寸
                containerWidth: 100,
                containerHeight: 100,
                //选择操作进行中的状态
                selectionProgress: {
                    row0: null,
                    col0: null,
                    row1: null,
                    col1: null,
                },
                selection: [],  //被选中区域列表
                selectionActive: null,  //选中的被选中区域
                deleteList: [], //被删除的

            }
        },
        computed: {
            //生成日期列表
            dateList() {
                //let date = new Date(this.startDate)
                let date = new Date(), result = [];
                for (let i = 0; i < this.days; i++) {
                    result.push(new Date(date));
                    date.setDate(date.getDate() + 1);
                }
                return result;
            },
            dateTable() {
                let result = {};
                this.dateList.forEach((date, col) => {
                    result[date.format('yyyy-MM-dd')] = col;
                })
            },
            // 生成时间列表
            timeList() {
                let hour = this.startHour, minute = 0, result = [];
                while (hour < this.endHour) {
                    result.push(this.padZero(hour) + ":" + this.padZero(minute));
                    minute += this.stepMinute;
                    if (minute >= 60) {
                        minute = 0;
                        hour++;
                    }
                }
                return result;
            },
            timeTable() {
                let result = {};
                this.timeList.forEach((time, row) => {
                    result[time] = row;
                });
                return result;
            },
            timeTableEnd() {
                let result = {};
                this.timeList.forEach((time, row) => {
                    result[time] = row - 1;
                });
                result[`${this.padZero(this.endHour)}:00`] = this.timeList.length - 1;
                return result;
            },
            //表中各行各列对应的时间
            dateTimeTable() {
                let result = [];
                for (let time of this.timeList) {
                    let row = [];
                    for (let date of this.dateList) {
                        row.push(this.cellDateTime(date, time));
                    }
                    result.push(row);
                }
                return result;
            },
            //是否选择时间操作进行中
            selectActive() {
                return null !== this.selectionProgress.row0;
            },
            //选择操作进行中，选择指示器的样式
            styleSelectionProgress() {
                let cellWidth = this.containerWidth / this.days,
                    cellHeight = this.containerHeight / this.timeList.length;
                let {row0, row1, col0, col1} = this.selectionProgress;
                let startRow = Math.min(row0, row1);
                let startCol = Math.min(col0, col1);
                let result = {
                    left: cellWidth * startCol + 'px',
                    top: cellHeight * startRow + 'px',
                    width: cellWidth + 'px',
                    height: cellWidth * (Math.abs(row0 - row1)) + 'px',
                };
                return result;
            },
            //当前条件可以显示的区域
            selectionDisplay() {
                let result = [];
                this.selection.forEach((item, index) => {
                    let position = this.getPosition(item.startTime, item.endTime);
                    //不在视图区里的省略
                    if (null === position) {
                        return;
                    }
                    let {col, row0, row1} = position;
                    result.push({
                        ...item,
                        key: item.key,
                        disabled: item.disabled,
                        index,
                        col, row0, row1
                    })
                });
                return result;
            },
            //可编辑的时间段数目，超过最大允许时间段数目时禁止编辑
            selectionCount() {
                let result = 0;
                for (let item of this.selection) {
                    if (item.disabled) {
                        continue;
                    }
                    result++;
                }
                return result;
            }
        },
        created() {
            window.addEventListener("mousemove", this.cancelSelect);
            window.addEventListener("mouseup", this.stopSelect);
            let cancelSlection = () => {
                this.selectionActive = null;
            };
            window.addEventListener('click', cancelSelectionActive)

            // 按delete或者backspace键 删除选取
            let deleteSelection = (e) => {
                if (null === this.selectionActive || this.disabled) {
                    return;
                }
                let item = this.selection[this.selectionActive];
                if (!item || item.disabled) {
                    return;
                }
                switch (e.keyCode) {
                    case 8:
                    case 46:
                        this.$emit("delete", {
                            ...item
                        });
                        this.selection.splice(this.selectionActive, 1);
                        this.selectionActive = null;
                        this.submitSelection();
                        break;
                }
            }
            window.addEventListener('keyup', deleteSelection);
            this.$once('hook:beforeDestory', () => {
                window.removeEventListener("mousemove", this.cancelSelect);
                window.removeEventListener("mouseup", this.stopSelect);
                window.removeEventListener("click", cancelSelectionActive);
                window.removeEventListener("mousemove", deleteSelection);
            })

        },
        mounted() {
            let updateGeometry = () => {
                let dom = this.$refs.dateSelectionedContainer;
                this.contaiinerWidth = dom.offsetWidth;
                this.contaiinerHeight = dom.offsetHeight;
            }
            updateGeometry();

            window.addEventListener('resize', updateGeometry);
            this.$once('hook:beforeDestory', () => {
                window.removeEventListener('resize', updateGeometry);
            })
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    this.selection = value.map(item => ({
                        ...item,
                        key: item.key || uuid(),
                        disabled: item.disabled,
                        startTime: item.startTime,
                        endTime: item.endTime
                    }))
                }
            },
            selection() {
                //如果选项发生了变化，清空当前的选项
                this.selectionActive = null;
            }
        },
        methods: {
            padZero(num, len = 2) {
                return (("0".repeat(len)) + String(num)).slice(-len);
            },
            cellDateTime(date, time) {
                let [hour, minute] = time.split(":");
                return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
            },
            getDateTime(row, col) {
                try {
                    return this.dateTimeTable[row][col];
                } catch (e) {
                    console.error(e);
                }
                return null;
            },
            cellClass(row, col) {
                return {
                    'is-disabled': this.dateTimeDisabled(this.getDateTime(row, col)),
                    'is-locked': this.disabled
                }
            },
            pickSelection(item) {
                if (item.selected) {
                    return;
                }
                if (null === this.selectionActive) {
                    this.selectionActive = item.idx;
                } else {
                    this.selectionActive = null;
                }
            },
            dateTimeDisabled(dateTime) {
                let week = dateTime.getDay();
                if (6 == week || 0 == week) {
                    return true;
                }

                // 禁用午休时间
                let minute = dateTime.getHours() * 60 + dateTime.getMinutes();
                if (minute > 12 * 60 && minute < 13 * 60 + 30) {
                    return true;
                }

                //指定了最早可选时间
                if (this.minDate && dateTime < this.minDate) {
                    return true;
                }

                //指定了最晚可选日期
                if (this.maxDate && dateTime > this.maxDate) {
                    return true;
                }

                //白名单
                if (!Array.isArray(this.whiteList)) {
                    return false;
                }

                let date0 = new Date(dateTime).format("yyyy-MM-dd");
                for (let item of this.whiteList) {
                    let startDate = new Date(item.startTime.replace('-', '/')),
                        endDate = new Date(item.endTime.replace('-', '/'));
                    let date = startDate.format('yyyy-MM-dd');
                    if (date0 != date) {
                        continue;
                    }
                    //当前日期在白名单内
                    if (dateTime >= startDate && dateTime < endDate) {
                        return false;
                    }
                }
                return true;
            },
            //根据给定日期返回格子的位置
            getPosition(time, time2) {
                let row = null, col = null;
                let date = new Date(time.replace('-', '/')), date2 = new Date(time2.replace('-', '/'));
                //根据日期决定列号
                let dateStr = date.format("yyyy-MM-dd"), dateStr2 = date2.format("yyyy-MM-dd");
                if (dateStr != dateStr2 || !this.dateTable.hasOwnProperty(dateStr)) {
                    return null;
                }
                col = this.dateTable[dateStr];

                // 根据时间确定行号
                let minute = date.getHours() * 60 + date.getMinutes();
                let minute2 = date2.getHours() * 60 + date2.getMinutes();
                let startMinute = this.startHour * 60, endMinutes = this.endHour * 60;
                if (minute < startMinute || minute > endMinutes || minute2 <= startMinute || minute2 > endMinutes) {
                    return null;
                }

                let timeKey = this.padZero(date.getHours()) + ":"
                this.padZero(Math.floor(date.getMinutes() / this.stepMinute) * this.stepMinute);
                let timeKey2 = this.padZero(date2.getHours()) + ":"
                this.padZero(Math.floor(date2.getMinutes() / this.stepMinute) * this.stepMinute);
                let row0 = this.timeTable[timeKey], row1 = this.timeTableEnd(timeKey2);

                return {
                    col, row0, row1
                }

            },
            //当前格子是否已经被选中
            cellSelected(row, col) {
                for (let item of this.selection) {
                    if (col != item.col) {
                        continue;
                    }
                    return row >= item.row0 && row <= item.row1;
                }
                return false;
            },
            //已选区域的样式
            styleSelectedArea() {
                let cellWidth = this.containerWidth / this.days,
                    cellHeight = this.containerHeight / this.timeList.length;
                let {row0, row1, col} = item;
                let result = {
                    left: cellWidth * col + 'px',
                    top: cellHeight * row0 + 'px',
                    width: cellWidth + 'px',
                    height: cellHeight * (Math.abs(row1 - row0) + 1) + 'px'
                };
                return result;
            },
            styleSelectedClass(item, index) {
                let result = [];
                if (item.index === this.selectionActive) {
                    result.push("selected");
                }
                if (item.disabled) {
                    result.push("is-disabled");
                }
                if ('02' == item.timeType) {
                    result.push("managerSelection");
                }
                return result;
            },
            //已选择区域转换时间
            submitSelection() {
                this.$emit('input', this.selection.map(item => {
                    return {
                        ...item,
                        startTime: item.startTime,
                        endTime: item.endTime
                    }
                }))
            },

            //开始选择操作
            startSelect(row, col) {
                if (this.disabled) {
                    return;
                }

                //目标是不可选的格子，本次操作取消
                if (this.dateTimeDisabled(this.getDateTime(row, col))) {
                    this.cancelSelect();
                    return;
                }

                Object.assign(this.selectionProgress, {
                    row0: row,
                    col0: col,
                    row1: row,
                    col1: col
                })
            },
            //设置最终的选中目标。如果目标是不可选的格子，本次操作取消
            setSelectDest(row) {
                if (!this.selectActive) {
                    return;
                }
                //目标是不可选的格子，本次操作取消'
                if (this.dateTimeDisabled(this.getDateTime(row, this.selectionProgress.col1))) {
                    this.cancelSelect();
                    return;
                }
                //已选择的格子，本次操作取消
                if (this.cellSelected(row, this.selectionProgress.col1)) {
                    this.cancelSelect();
                    return;
                }
                //时间超长，取最长时间
                if (this.maxMinutes) {
                    let row0 = this.selectionProgress.row0;
                    let rowsMax = Math.floor(this.maxMinutes / this.stepMinute) - 1;
                    if (Math.abs(row - row0) >= rowsMax) {
                        Object.assign(this.selectionProgress, {
                            row1: row > row0 ? row0 + rowsMax : row0 - rowsMax
                        });
                        return;
                    }
                }
                Object.assign(this.selectionProgress, {row1: row})
            },

            //本次选择无效
            cancelSelect() {
                Object.assign(this.selectionProgress, {
                    row0: null,
                    col0: null,
                    row1: null,
                    col1: null
                })
            },
            //处理选择区域
            stopSelect() {
                if (!this.selectActive) {
                    return;
                }
                if (this.maxCount && this.selectionCount >= this.maxCount) {
                    this.$messgae.error(`只能选择${this.maxCount}个时间段`);
                    Object.assign(this.selectionProgress, {
                        row0: null,
                        col0: null,
                        row1: null,
                        col1: null
                    });
                    return;
                }

                //生成格子信息
                let {row0, row1, col0} = this.selectionProgress();
                if (row0 > row1) {
                    let temp = row0;
                    row0 = row1;
                    row1 = temp;
                }
                let startTime = this.getDateTime(row0, row1), endTime = this.$moment(this.getDateTime(row1, col0))
                    .add(this.stepMinute, 'm').toDate();
                this.selection.push({
                    key: uuid(),
                    disabled: false,
                    startTime: startTime.format('yyyy-MM-dd hh:mm:ss'),
                    endTime: endTime.format('yyyy-MM-dd hh:mm:ss'),
                })
                //更新新的值到外部
                this.submitSelection();
                Object.assign(this.selectionProgress, {
                    row0: null,
                    col0: null,
                    row1: null,
                    col1: null,
                })
            }

        },
        filters: {
            dateText(value) {
                let weekText = ({
                    "0": "周日",
                    "1": "周一",
                    "2": "周二",
                    "3": "周三",
                    "4": "周四",
                    "5": "周五",
                    "6": "周六",
                })[value.getDay()];
                return weekText + " " + value.format('MM-dd');
            }
        }
    }
</script>

<style lang='scss' scoped>
    .GFullCalendar {
        display: block;
        position: relative;
        font-size: 14px;
        color: #333;
        line-height: 20px;
        text-align: center;
        user-select: none;

        .GFullCalendar-outer {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }

        .GFullCalendar-row {
            display: table-row;
        }

        .GFullCalendar-cell {
            display: table-cell;
            border: 1px solid #dcdfe6;
            white-space: nowrap;
            padding: 0 10px;
            box-sizing: border-box;
        }

        .timeDisp {
            width: 60px;
        }

        .dateSelect {
            cursor: pointer;
        }

        .dateSelect.is-locked {
            background-color: #f5f7fa;
            cursor: not-allowed;
        }

        .dateSelect.is-disabled {
            background-color: #f5f7fa;
            cursor: not-allowed;
        }

        .dateSelectedContainer {
            position: absolute;
            z-index: 30;
            left: 61px;
            top: 21px;
            right: 0;
            bottom: 0;
            pointer-events: none;
        }

        .selectionProgress {
            position: absolute;
            background-color: rgba(255, 121, 0, 0.2);
            pointer-events: none;
            border-radius: 2px;
            box-sizing: border-box;
        }

        .selectedArea {
            display: block;
            outline: none;
            position: absolute;
            border: 1px solid #ff7900;
            background-color: rgba(255, 121, 0, 0.6);
            pointer-events: none;
            border-radius: 2px;
            box-sizing: border-box;
            cursor: pointer;
        }

        .selectedArea.selected {
            background-color: rgba(255, 121, 0, 0.9);
        }

        .selectedArea.is-disabled {
            background-color: rgba(191, 123, 64, 0.6);
        }

        .selectedArea.managerSelection {
            z-index: 100;
        }

        .selectedAreaTrigger {
            outline: none;
            width: 100%;
            height: 100%;
        }

        .pickerPopup {
            position: fixed;
            width: 120px;
            border: 1px solid #ccc;
            background-color: #fff;
            font-size: 14px;
            line-height: 16px;
            padding: 4px 10px;
            border-radius: 4px;
            z-index: 1000;
            pointer-events: none;
        }
    }
</style>
