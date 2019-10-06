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
        z-index: 777;
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 100vw;
        pointer-events: none;
    }
    .helper-overlay {
        z-index: 7777;
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
            gridHeight: '100%'
        }
    },
    mounted() {
        window.addEventListener('dragover', this.dragoverHandler);
        window.addEventListener('dragenter', this.dragenterHandler);
        window.addEventListener('dragleave', this.dragleaveHandler);
        window.addEventListener('drop', this.dropHandler);
    },
    beforeDestroy() {
        window.removeEventListener('dragover', this.dragoverHandler);
        window.removeEventListener('dragenter', this.dragenterHandler);
        window.removeEventListener('dragleave', this.dragleaveHandler);
        window.removeEventListener('drop', this.dropHandler);
    },
    methods: {
        dragoverHandler(e) {
            e.preventDefault();
        },
        dragenterHandler() {
            this.helperOverlayVisible = true;
        },
        dragleaveHandler() {
            this.helperOverlayVisible = false;
        },
        dropHandler(e) {
            Array.prototype.filter.call(this.$refs.container.querySelectorAll('.overlay-item'), el => {
                const rect = el.getBoundingClientRect();
                return e.x > rect.left && e.x < rect.right && e.y > rect.top && e.y < rect.bottom;
            }).forEach(el => {
                this.$emit('dropped', {
                    name: el.dataset.name,
                    event: e
                });
            });
            this.helperOverlayVisible = false;
        }
    }
}
</script>