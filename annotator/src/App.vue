<template>
  <div id='app'>
    <button @click='downloadJson'>Export as JSON</button>
    <a ref='downloadLink' style='display: none;' download='data.json'></a>
    <div class='AnnotatedImage' v-for='image in images'>
      <div class='AnnotatedImage__Wrapper'>
        <img class='AnnotatedImage__Image' :src="`./static/${image.image_path}`" @click='imageClicked($event, image.image_path)'/>
        <Rects :rects='image.rects'/>
      </div>
      <div class='AnnotatedImage__Rects'>
        <b>Name: {{image.image_path}}</b>
        <p v-for='rect in image.rects'>
          {{rect}} <button @click='deleteRect(image.image_path, rect)'>Delete</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { times, map, append, findIndex, whereEq, lensPath, over, last, adjust, merge, without, evolve, min, max } from 'ramda'
import Rects from './components/Rects'

const padNum = num => ('00' + num).slice(-3)
const imageNames = map(num => `resized${num}.png`, times(padNum, 541))

export default {
  components: {
    Rects
  },
  data () {
    return {
      images: JSON.parse(localStorage.getItem('images')) || map(name => ({
        image_path: name,
        rects: []
      }), imageNames)
    }
  },
  watch: {
    images (val) {
      localStorage.setItem('images', JSON.stringify(val))
    }
  },
  methods: {
    // TODO AS: Scarry one... Fix those conditionals
    imageClicked (event, imagePath) {
      const x = event.offsetX
      // TODO AS: For some reason, it's off by 2 pixels!
      const y = event.offsetY >= 2 ? event.offsetY - 2 : event.offsetY
      // const x = event.pageX - event.target.offsetLeft
      // const y = event.pageY - event.target.offsetTop

      console.log(x, y)

      const index = findIndex(whereEq({ image_path: imagePath }), this.images)

      this.$set(this, 'images', over(
        lensPath([index, 'rects']),
        (rects) => {
          if (last(rects)) {
            if (last(rects).x2) {
              return append({ x1: x, y1: y }, rects)
            } else {
              return adjust(merge({ x2: x, y2: y }), -1, rects)
            }
          } else {
            return append({ x1: x, y1: y }, rects)
          }
        },
        this.images
      ))
    },
    deleteRect (imagePath, rect) {
      const index = findIndex(whereEq({ image_path: imagePath }), this.images)
      this.$set(this, 'images', over(
        lensPath([index, 'rects']),
        without([rect]),
        this.images
      ))
    },
    downloadJson () {
      const jsonData = map(evolve({
        rects: map(({ x1, x2, y1, y2 }) => ({
          x1: min(x1, x2),
          x2: max(x1, x2),
          y1: min(y1, y2),
          y2: max(y1, y2)
        }))
      }), this.images)

      this.$refs.downloadLink.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonData, null, 2))
      this.$refs.downloadLink.click()
    }
  }
}
</script>

<style>
* {
  margin: 0px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2C3E50;
  background-color: #838C91;
}

.AnnotatedImage__Wrapper {
  display: flex;
  background-color: #E2E4E6;
  padding: 5px;
  border-radius: 5px;
  margin: 5px;
  position: relative;
}

.AnnotatedImage__Rects {
  text-align: center;
  font-size: 0.7em;
  background-color: #FFFFFF;
  padding: 5px;
  border-radius: 5px;
  margin: 5px;
}

.AnnotatedImage {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
</style>
