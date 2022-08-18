<template>
  <div class="row no-wrap">
    <q-list bordered separator class="scroll full-width">
      <q-item-label
        header
        class="bg-amber text-black text-subtitle2 text-weight-bold"
        v-if="headerBar"
      >
        <div class="row">
          <div class="col-11">Список прикрепленных файлов</div>

          <div class="col">
            <q-btn
              flat
              dense
              square
              :disable="files.length == 0"
              icon="filter_alt"
              color="indigo-5"
              @click="isShowSearchBar = !isShowSearchBar"
            >
              <q-tooltip>Поиск</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-item-label>

      <q-item-label header v-if="files.length > 0 && headerBar">
        <q-input
          v-if="isShowSearchBar"
          outlined
          dense
          clearable
          label="Search"
          v-model="mSearchFiles"
          class="q-px-sm"
        />
        <br v-if="isShowSearchBar" />
        <div>Файлов всего: {{ files.length }}</div>
        <div v-if="isShowSearchBar">
          Файлов найдено: {{ filesListFiltered.length }}
        </div>
      </q-item-label>
      <q-separator />

      <q-item-label v-if="files.length == 0">
        <q-item-section class="q-pa-md row q-gutter-sm flex-center">
          <q-item-label caption> Пока нет прикрепленных файлов </q-item-label>
          <q-img
            class="q-pa-lg"
            src="icons/file_extension/icon_empty_file.svg"
            fit="contain"
            style="max-width: 100px"
          />
        </q-item-section>
      </q-item-label>

      <q-item-label v-if="filesListFiltered.length == 0 && files.length != 0">
        <q-item-section class="q-pa-md row q-gutter-sm flex-center">
          <q-item-label caption> Не найдено файлов </q-item-label>
          <q-img
            class="q-pa-lg"
            src="icons/no-found-file.svg"
            fit="contain"
            style="max-width: 100px"
          />
        </q-item-section>
      </q-item-label>

      <q-item clickable v-for="file in filesListFiltered" :key="file.id">
        <q-item-section side>
          <q-img
            class="q-pa-lg"
            :src="getFileExtensionIcon(file.name)"
            fit="contain"
          >
            <template v-slot:error>
              <div
                class="absolute-full flex flex-center bg-negative text-white"
              >
                Cannot load image
              </div>
            </template>
          </q-img>
        </q-item-section>
        <q-item-section class="overflow-hidden">
          <q-item-label>
            {{ file.name }}
          </q-item-label>
          <q-item-label caption>
            {{ file.desc }}
          </q-item-label>
          <q-item-label caption>
            <q-separator />
            date append: {{ file.dateTimeRawAdded }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div>
            <q-btn
              v-if="btnDownloadVisibled"
              flat
              dense
              icon="download"
              color="indigo-7"
              @click="onClickBtnDownloadFile(file)"
            >
              <q-tooltip>Скачать файл</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              icon="edit"
              color="primary"
              @click="onClickBtnFileDescEdit(file)"
            >
              <q-tooltip>Редактировать описание</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              icon="delete"
              color="negative"
              @click="onClickBtnFileDelete(file)"
            >
              <q-tooltip>Удалить файл</q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, defineAsyncComponent, ref, computed } from "vue";
import FileFormDescEdit from "src/components/Files/FileFormDescEdit";

export default defineComponent({
  name: "FileList",
  components: {},

  props: {
    files: {
      type: Array,
      required: true,
    },
    headerBar: {
      type: Boolean,
      default: true,
    },
    btnDownloadVisibled: {
      type: Boolean,
      default: true,
    },
  },

  emits: ["onDelete", "onUpdate"],

  setup(props, { emit }) {
    const $q = useQuasar();

    let mSearchFiles = ref(null);
    let isShowSearchBar = ref(false);

    /**
     *
     */
    const filesListFiltered = computed(() => {
      let searchText = mSearchFiles.value?.toLowerCase();
      if (searchText == null || searchText == "") return props.files;
      else
        return props.files.filter(
          (file) =>
            file?.name?.toLowerCase()?.includes(searchText) ||
            file?.desc?.toLowerCase()?.includes(searchText) ||
            file?.date?.toLowerCase()?.includes(searchText)
        );
    });

    /**
     *
     * @param {*} fileName
     */
    const getFileExtensionIcon = (fileName) => {
      switch (fileName.split(".").pop()?.toLowerCase()) {
        case "doc":
        case "docx":
          return "icons/file_extension/icon_docx.svg";

        case "ppt":
        case "pptx":
          return "icons/file_extension/icon_pptx.svg";

        case "xls":
        case "xlsx":
          return "icons/file_extension/icon_xlsx.svg";

        case "rtf":
          return "icons/file_extension/icon_rtf.svg";

        case "txt":
          return "icons/file_extension/icon_txt.svg";

        case "dwg":
          return "icons/file_extension/icon_dwg.svg";

        case "exe":
          return "icons/file_extension/icon_exe.svg";

        case "jpg":
          return "icons/file_extension/icon_jpg.svg";

        case "png":
          return "icons/file_extension/icon_png.svg";

        case "svg":
          return "icons/file_extension/icon_svg.svg";

        case "pdf":
          return "icons/file_extension/icon_pdf.svg";

        case "zip":
          return "icons/file_extension/icon_zip.svg";

        case "rar":
          return "icons/file_extension/icon_rar.svg";

        default:
          return "icons/file_extension/icon_unknow.svg";
      }
      return "icons/file_extension/icon_unknow.svg";
    };

    /**
     *
     */
    const onClickBtnFileDescEdit = (fileItem) => {
      $q.dialog({
        component: FileFormDescEdit,
        componentProps: {
          persistent: true,
          fileObj: fileItem,
        },
      }).onOk((obj) => {
        fileItem.desc = obj.desc;
        emit("onUpdate", fileItem);
      });
    };

    /**
     *
     * @param {*} fileItem
     */
    const onClickBtnDownloadFile = (fileItem) => {
      // @BUG not downloaded plain files (images, txt), only opened
      const link = document.createElement("a");
      link.href = fileItem.url;
      link.download = fileItem.name;
      link.target = "_blank";
      link.click();
    };

    /**
     *
     */
    const onClickBtnFileDelete = (fileItem) => {
      $q.dialog({
        title: "Delete file",
        message: `Are you sure you want to permanently 
                    delete this file (
                        ${fileItem.name} 
                        ) ?`,
        cancel: true,
        persistent: true,
      }).onOk(() => {
        emit("onDelete", fileItem);
      });
    };

    return {
      filesListFiltered,
      mSearchFiles,
      isShowSearchBar,

      getFileExtensionIcon,
      onClickBtnFileDescEdit,
      onClickBtnFileDelete,
      onClickBtnDownloadFile,
    };
  },
});
</script>
