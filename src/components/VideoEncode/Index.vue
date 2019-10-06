<template>
    <div class="video-encode-container">
        
    </div>
</template>
<script>
export default {
    data() {
        return {
            dropHelperOptions: []
        };
    },
    mounted() {
        this.$store.commit('setDropHelperOptions', [{
                name: 'video',
                text: '视频'
            }, {
                name: 'subtitle',
                text: '字幕'
        }]);
    }
}
</script>