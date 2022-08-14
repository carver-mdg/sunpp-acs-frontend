<template>
  <div
    :id="galleryID"
    class="pswp-gallery pswp-gallery--with-caption"
    style="background: #eee"
  >
    <!-- <div v-if="btnDelete">No photos founded</div> -->
    <q-scroll-area style="height: 170px; padding: 10px">
      <div class="row no-wrap">
        <span v-for="(image, key) in imagesRef" :key="key" class="flex">
          <span
            class="pswp-gallery__item row items-center no-wrap"
            style="height: 100px"
          >
            <a
              :href="image[imagesBindNames['imageUrl']]"
              :data-pswp-width="image[imagesBindNames['imageWidth']]"
              :data-pswp-height="image[imagesBindNames['imageHeight']]"
              target="_blank"
              rel="noreferrer"
            >
              <q-img
                :src="image[imagesBindNames['imageThumbnailUrl']]"
                style="width: 100px; margin: 5px"
                class="q-pa-md"
                fit="contain"
              >
                <template v-slot:error>
                  <div
                    class="absolute-full flex flex-center bg-negative text-white"
                  >
                    Cannot load image
                  </div>
                  <!-- <object
                    data="images/noImageAvailable.svg"
                    type="image/svg+xml"
                  ></object> -->
                </template>
              </q-img>
            </a>
            <div v-if="captionGallery" class="pswp__custom-caption">
              {{ captionGallery }}
            </div>
            <!-- <div class="hidden-caption-content">Some content of image</div> -->
          </span>
          <div class="row items-center no-wrap" style="margin-top: 10px">
            <q-btn
              v-if="btnDelete"
              flat
              icon="delete"
              color="negative"
              @click="onClickBtnDelete(image)"
            />
          </div>
        </span>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs, toRef } from "vue";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

export default defineComponent({
  name: "SimpleGallery",
  props: {
    galleryID: String,
    captionGallery: String,
    images: Array,
    imagesBindingNames: Object,
    btnDelete: { type: Boolean, default: false },
    onClickBtnDelete: Function,
  },

  setup(props) {
    const imagesRef = toRef(props, "images");

    let imagesBindNames = ref({
      imageUrl: props.imagesBindingNames["imageUrl"],
      imageThumbnailUrl: props.imagesBindingNames["imageThumbnailUrl"],
      imageWidth: props.imagesBindingNames["imageWidth"],
      imageHeight: props.imagesBindingNames["imageHeight"],
    });

    return {
      imagesRef,
      imagesBindNames,
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
