<template>
  <div :id="galleryID" class="pswp-gallery pswp-gallery--with-caption">
    <span
      class="pswp-gallery__item"
      v-for="(image, key) in imagesData"
      :key="key"
    >
      <a
        :href="image.largeURL"
        :data-pswp-width="image.width"
        :data-pswp-height="image.height"
        target="_blank"
        rel="noreferrer"
      >
        <img :src="image.thumbnailURL" :alt="image.alt" />
      </a>
      <div>{{ image.alt }}</div>
      <!-- <div class="pswp__custom-caption"></div> -->
      <!-- <div class="hidden-caption-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <a href="https://example.com" target="_blank" rel="nofollow"
          >Test link &rarr;</a
        >
      </div> -->
    </span>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

export default defineComponent({
  name: "SimpleGallery",
  props: {
    galleryID: String,
    images: Array,
  },
  setup(props) {
    /*const zoom_max = 1;

    props.images.forEach((item, index) => {
      // item.width = 100 * zoom_max;
      // item.height = 100 * zoom_max;

      const img = new Image();
      img.src = item.largeURL;
      img.onload = function () {
        // console.log(this.naturalWidth + " " + this.naturalHeight);

        item.width = this.naturalWidth * zoom_max;
        item.height = this.naturalHeight * zoom_max;

        // item.width = 100 * zoom_max;
        // item.height = 100 * zoom_max;
      };
    });*/

    // console.log(props.images);

    return {
      imagesData: props.images,
    };
  },
  mounted() {
    if (!this.lightbox) {
      this.lightbox = new PhotoSwipeLightbox({
        gallery: "#" + this.$props.galleryID,
        // children: "a",
        children: ".pswp-gallery__item",

        pswpModule: () => import("photoswipe"),
      });

      let lightbox = this.lightbox;

      //
      // this.lightbox.init();
      // console.log(this.lightbox);
      // console.log(phs);
      // console.log(PhotoSwipe);

      // this.lightbox.on("beforeOpen", () => {});

      this.lightbox.on("uiRegister", function () {
        // const { pswp }  = this.lightbox;
        // console.log(pswp);
        lightbox.pswp.ui.registerElement({
          name: "custom-caption",
          order: 9,
          isButton: false,
          appendTo: "root",
          html: "Caption text",
          onInit: (el, pswp) => {
            lightbox.pswp.on("change", () => {
              const currSlideElement = lightbox.pswp.currSlide.data.element;
              let captionHTML = "";
              if (currSlideElement) {
                const hiddenCaption = currSlideElement.querySelector(
                  ".hidden-caption-content"
                );
                if (hiddenCaption) {
                  // get caption from element with class hidden-caption-content
                  captionHTML = hiddenCaption.innerHTML;
                } else {
                  // get caption from alt attribute
                  captionHTML = currSlideElement
                    .querySelector("img")
                    .getAttribute("alt");
                }
              }
              el.innerHTML = captionHTML || "";
            });
          },
        });
      });
      //

      this.lightbox.init();
    }
  },
  unmounted() {
    if (this.lightbox) {
      this.lightbox.destroy();
      this.lightbox = null;
    }
  },
  methods: {},
});
</script>

<style>
.pswp__custom-caption {
  background: rgba(30, 30, 30, 0.85);
  /* font-size: 16px; */
  text-align: center;
  color: #aaa;
  width: calc(100% - 16px);
  max-width: 800px;
  padding: 2px 8px;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  bottom: 0px;
  transform: translateX(-50%);
}
.pswp__custom-caption a {
  color: #fff;
  text-decoration: underline;
}
.hidden-caption-content {
  display: none;
}

.pswp-gallery {
  text-align: center;
}
</style>
