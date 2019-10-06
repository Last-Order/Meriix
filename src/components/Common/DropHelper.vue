<template>
    <div class="drop-helper" ref="container">
        <div class="helper-overlay" :style="{ opacity: helperOverlayVisible ? 1 : 0 }">
            <div class="top-overlay">
                <template v-for="item in options.slice(0, Math.ceil(options.length / 2))">
                    <div class="overlay-item" :key="item.name" :data-name="item.name">
                        <span>{{ item.text }}</span>
                    </div>
                </template>
            </div>
            <div class="bottom-overlay">
                <template v-for="item in options.slice(Math.ceil(options.length / 2))">
                    <div class="overlay-item" :key="item.name" :data-name="item.name">
                        <span>{{ item.text }}</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<style>
    .drop-helper {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 100vw;
        pointer-events: none;
    }
    .helper-overlay {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2)
    }
    .top-overlay, .bottom-overlay {
        height: 50%;
        width: 100%;
        display: flex;
        border: 2px solid white;
    }
    .overlay-item {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid white;
    }
    .overlay-item span {
        font-size: xx-large;
    }
</style>
<script>
export default {
    props: ['options'],
    data() {
        return {
            helperOverlayVisible: false,
            gridWidth: '100%',
            gridHeight: '100%',
            /**
             * 用于记录 dragenter/dragleave 经过的元素，当 collection 为空时判断为移出窗口
             * https://stackoverflow.com/questions/10253663/how-to-detect-the-dragleave-event-in-firefox-when-dragging-outside-the-window
             */
            collection: []
        }
    },
    mounted() {
        document.body.addEventListener('dragover', this.dragoverHandler, true);
        document.body.addEventListener('dragenter', this.dragenterHandler, true);
        document.body.addEventListener('dragleave', this.dragleaveHandler, true);
        document.body.addEventListener('drop', this.dropHandler, true);
    },
    beforeDestroy() {
        document.body.removeEventListener('dragover', this.dragoverHandler);
        document.body.removeEventListener('dragenter', this.dragenterHandler);
        document.body.removeEventListener('dragleave', this.dragleaveHandler);
        document.body.removeEventListener('drop', this.dropHandler);
    },
    methods: {
        dragoverHandler(e) {
            e.preventDefault();
            e.stopPropagation();
            this.helperOverlayVisible = true;
        },
        dragenterHandler(e) {
            e.preventDefault();
            e.stopPropagation();
            this.collection.push(e.target);
            this.helperOverlayVisible = true;
        },
        dragleaveHandler(e) {
            e.preventDefault();
            e.stopPropagation();
            this.collection = this.collection.filter(el => el !== e.target);
            if (this.collection.length === 0) {
                this.helperOverlayVisible = false;
            }
        },
        dropHandler(e) {
            Array.prototype.filter.call(this.$refs.container.querySelectorAll('.overlay-item'), el => {
                const rect = el.getBoundingClientRect();
                return e.x > rect.left && e.x < rect.right && e.y > rect.top && e.y < rect.bottom;
            }).forEach(el => {
                this.$emit('dropped', {
                    name: el.dataset.name,
                    files: e.dataTransfer.files,
                    event: e
                });
            });
            this.helperOverlayVisible = false;
        }
    }
}
</script>