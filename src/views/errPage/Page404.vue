<template>
    <div class="Page404">
        <h1 class="float-left display-3 mr-4">404</h1>
        <h4 class="pt-3">Oops! You're lost.</h4>
        <p class="text-muted">The page you are looking for was not found.</p>
    </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>

<style lang="scss">
.Page404 {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 20%;
    box-sizing: border-box;
    background: green;
    .text-muted {
        color: wheat;
        font-size: 14px;
    }
}
</style>
