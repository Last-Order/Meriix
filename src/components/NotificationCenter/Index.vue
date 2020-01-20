<template>
    <div class="notification-center-container">
        <v-row justify="center">
            <v-col lg="11" class="message-preview">中文</v-col>
            <v-col lg="1" class="expand-button">
                <v-spacer />
                <v-icon color="white">mdi-chevron-up</v-icon>
            </v-col>
        </v-row>
    </div>
</template>
<style lang="scss" scoped>
    .notification-center-container {
        bottom: 0;
        height: 1.8rem;
        background-color: rgb(66, 66, 66);
        .message-preview {
            line-height: 1.8rem;
            margin: 0;
            padding: 0;
            font-size: .8rem;
            color: white;
            padding-left: 1.2rem;
        }
        .expand-button {
            display: flex;
            line-height: 1.8rem;
            padding: 0;
            padding-right: 1rem;
        }
    }
</style>
<script>
export default {
    data() {
        return {}
    }
}
</script>