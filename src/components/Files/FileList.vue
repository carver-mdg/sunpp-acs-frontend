<template>
  <div class="row no-wrap">
    <q-list bordered separator class="scroll full-width">
      <q-item-label
        header
        class="bg-amber text-black text-subtitle2 text-weight-bold"
        v-if="headerBar"
      >
        <div class="fit row wrap justify-end items-center content-center">
          <div class="col">
            {{ $t("List_of_attachments_files") }}
            <div class="text-caption">
              {{ $t("total_files") }}: {{ files.length }}
            </div>
          </div>

          <div class="col-1">
            <q-btn
              flat
              dense
              square
              icon="auto_awesome_motion"
              color="indigo-5"
              @click="onClickBtnAddTag"
            >
              <q-tooltip>Add Tag</q-tooltip>
            </q-btn>
          </div>

          <div class="col-1">
            <q-btn
              flat
              dense
              square
              disable
              icon="app_registration"
              color="indigo-5"
              @click="onClickBtnEditTags"
            >
              <q-tooltip>Edit Tags</q-tooltip>
            </q-btn>
          </div>

          <div class="col-1">
            <q-btn
              flat
              dense
              square
              :disable="files.length == 0"
              :icon="iconBtnFilter"
              color="indigo-5"
              @click="onClickBtnShowFilter"
            >
              <q-tooltip>Поиск</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-item-label>

      <q-item-label
        header
        v-if="files.length > 0 && headerBar && isShowSearchBar"
      >
        <q-input
          outlined
          dense
          clearable
          label="Search"
          v-model="mSearchFiles"
          class="q-px-sm"
        />

        <!-- ////// -->
        <br />
        <q-select
          dense
          outlined
          clearable
          v-model="mFilterByTags"
          use-input
          use-chips
          multiple
          input-debounce="0"
          :options="tagsOptions"
          @filter="onFilterTags"
          @update:model-value="onUpdateFilteredByTags"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          label="filter by tags"
          class="q-px-sm"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-chip
                  dense
                  square
                  :style="{
                    backgroundColor: scope.opt.bgColor,
                    color: scope.opt.fgColor,
                  }"
                >
                  {{ scope.opt.name }}
                </q-chip>
              </q-item-section>
              <q-item-section></q-item-section>
              <q-item-section side>
                <q-icon v-if="scope.itemProps.active" name="check" />
              </q-item-section>
              <q-separator />
            </q-item>
          </template>

          <template v-slot:selected>
            <q-chip
              v-for="itemId in mFilterByTags"
              :key="itemId"
              dense
              square
              :style="{
                backgroundColor: getObjectTagById(itemId)?.bgColor,
                color: getObjectTagById(itemId)?.fgColor,
              }"
            >
              {{ getObjectTagById(itemId)?.name }}
            </q-chip>
          </template>
        </q-select>
        <!-- ///////// -->

        <q-checkbox v-model="mCheckBoxWithoutTags" :label="$t('without_tags')" />
        <q-checkbox disable v-model="mCheckBoxDuplicates" :label="$t('duplicates')" />

        <br />
        <div>{{ $t("files_found") }}: {{ filesListFiltered.length }}</div>
      </q-item-label>
      <q-separator />

      <q-item-label v-if="files.length == 0 && !isLoadingFiles">
        <q-item-section class="q-pa-md row q-gutter-sm flex-center">
          <q-item-label caption> {{ $t("no_attachments_yet") }} </q-item-label>
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
          <q-item-label caption> {{ $t("no_files_found") }} </q-item-label>
          <q-img
            class="q-pa-lg"
            src="icons/no-found-file.svg"
            fit="contain"
            style="max-width: 100px"
          />
        </q-item-section>
      </q-item-label>

      <q-item-label v-if="isLoadingFiles" style="height: 150px">
        <q-inner-loading
          :showing="isLoadingFiles"
          :label="$t('loadingData')"
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-item-label>

      <q-item clickable v-for="file in filesListFiltered" :key="file.id">
        <div class="flex">
          <div class="row flex-center">
            <div class="col-3">
              <q-img
                style="width: 50px"
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
              <div class="text-caption text-blue-grey-3">
                size: {{ utils.bytesToSize(file.size) }}
              </div>
            </div>
            <div class="col custom-scrollbar">
              <div class="text-subtitle2">{{ file.name }}</div>

              <q-separator />
              <div class="text-caption text-italic">{{ file.desc }}</div>
              <q-separator />

              <div class="text-caption text-blue-grey-3">
                date append: {{ file.dateTimeRawAdded }}
              </div>
            </div>
            <div class="col-2">
              <div class="fit row wrap justify-end items-end content-end">
                <q-btn
                  v-if="btnEditdVisibled"
                  flat
                  dense
                  icon="edit"
                  color="primary"
                  @click="onClickBtnFileDescEdit(file)"
                >
                  <q-tooltip>Редактировать описание, теги</q-tooltip>
                </q-btn>

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
                  icon="delete"
                  color="negative"
                  @click="onClickBtnFileDelete(file)"
                >
                  <q-tooltip>Удалить файл</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>

          <div class="row">
            <q-chip
              dense
              square
              clickable
              v-for="tag in file.tags"
              :key="tag.id"
              :style="{ backgroundColor: tag.bgColor, color: tag.fgColor }"
              @click="onClickChipTagFile(tag)"
            >
              <q-avatar v-if="tag.imageUrl?.length > 0">
                <q-img :src="tag.imageUrl" />
              </q-avatar>
              {{ tag.name }}
            </q-chip>
          </div>
        </div>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, defineAsyncComponent, ref, computed } from "vue";
import FileFormDescEdit from "src/components/Files/FileFormDescEdit";
import FileDialogEditTag from "components/Files/FileDialogEditTag";
import FileTagModel from "src/models/files/FileTagModel";
import * as utils from "src/utils";
import { api } from "boot/axios";

export default defineComponent({
  name: "FileList",
  components: {},

  props: {
    files: {
      type: Array,
      required: true,
    },
    urlTags: {
      //@WARNING prop not used
      type: String,
      reuired: true,
    },
    headerBar: {
      type: Boolean,
      default: true,
    },
    btnEditdVisibled: {
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

    let listTags = ref([]);
    let tagsOptions = ref([]);
    tagsOptions.value.push({ id: "without tags", name: "without tags" });

    let mSearchFiles = ref(null);
    let isShowSearchBar = ref(false);
    let isLoadingFiles = ref(true);
    let mFilterByTags = ref([]);

    let iconBtnFilter = ref('filter_alt');
    let mCheckBoxWithoutTags = ref(false);
    let mCheckBoxDuplicates = ref(false);

    /**
     * Load tags of files
     */
    (async () => {
      // .get(`${props.urlTags}`)
      api
        .get(`api/v1/file/tags/`)
        .then((response) => {
          for (let idx in response.data) {
            listTags.value.push(new FileTagModel(response.data[idx]));
          }

          isLoadingFiles.value = false;
          tagsOptions.value = [...listTags.value];
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load data from server: ${err}`,
            icon: "report_problem",
            progress: true,
            closeBtn: true,
          });

          console.error(err.response?.data?.message_error || err);
        });
    })();

    /**
     *
     * @param {*} id
     */
    const getObjectTagById = (id) => {
      for (let item of tagsOptions.value) if (item.id == id) return item;
      return null;
    };

    /**
     *
     */
    const filesListFiltered = computed(() => {
      let searchText = mSearchFiles.value?.toLowerCase();

      if (!mFilterByTags.value?.length && (searchText == null || searchText == "") && !mCheckBoxWithoutTags.value)
        return props.files;

      if(mCheckBoxWithoutTags.value && (searchText == null || searchText == "") && !mFilterByTags.value?.length)
        return props.files.filter(file => !file.tags.length)

      let filesToView = [];

      // filter files by tags
      if (mFilterByTags.value?.length) {
        for (let idxFile = 0; idxFile < props.files.length; idxFile++) {
          let isTagCompared = true;
          

          for (let idxFilteredTag = 0; idxFilteredTag < mFilterByTags.value.length; idxFilteredTag++) {
            isTagCompared = false;

            for (let idxFileTag = 0; idxFileTag < props.files[idxFile].tags.length; idxFileTag++) {
                if (props.files[idxFile].tags[idxFileTag].id == mFilterByTags.value[idxFilteredTag]) {
                  isTagCompared = true;
                  break;
                }
              }
              if(!isTagCompared) break;
            }

            if(isTagCompared) {
                filesToView.push(props.files[idxFile]);
                continue;
          }
        }
      }

      // add filter files by search str (name file, desc, date)
      if(searchText != null) {
        let arrData = props.files;
        if(mFilterByTags.value?.length)
          arrData = filesToView;

        filesToView = arrData.filter(
          (file) =>
            file?.name?.toLowerCase()?.includes(searchText) ||
            file?.desc?.toLowerCase()?.includes(searchText) ||
            file?.dateTimeRawAdded?.toLowerCase()?.includes(searchText)
        );
        
      }

      // add files without tags
      if(mCheckBoxWithoutTags.value)
        filesToView = filesToView.filter(
          file => !file.tags.length)
          

      return filesToView;
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
          listTags: listTags.value,
        },
      }).onOk((obj) => {
        fileItem.desc = obj.desc;

        // insert array of objects tags to fileItem
        fileItem.tags = [];
        for (let idx = 0; idx < obj.tags.length; idx++) {
          for (let item of listTags.value)
            if (item.id == obj.tags[idx]) fileItem.tags.push(item);
        }

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

    /**
     *
     */
    const onClickBtnAddTag = () => {
      $q.dialog({
        component: FileDialogEditTag,
        componentProps: {
          persistent: true,
          listTags: listTags.value,
        },
      }).onOk((newTag) => {
        api
          .post(`api/v1/file/tags/`, newTag)
          .then((response) => {
            listTags.value.push(new FileTagModel(response.data));
          })
          .catch((err) => {
            $q.notify({
              color: "negative",
              position: "top",
              message: "Failed to save data to server",
              caption: `${err.response?.data?.message_error || err}`,
              icon: "report_problem",
              progress: true,
              closeBtn: true,
            });

            console.error(err.response?.data?.message_error || err);
          });
      });
    };

    /**
     *  //@FIXME NOT released
     */
    const onClickBtnEditTags = () => {
      $q.dialog({
        component: FileDialogEditTag,
        componentProps: {
          persistent: true,
          listTags: listTags.value,
          // editableTag:
        },
      }).onOk((editedTag) => {});
    };

    /**
     *
     * @param {*} val
     * @param {*} done
     */
    const onFilterTags = (val, update, abort) => {
      update(() => {
        if (val.length == 0) {
          tagsOptions.value = [...listTags.value];
          return;
        }

        tagsOptions.value = listTags.value.filter(
          (tag) => tag.name.toLowerCase().indexOf(val?.toLowerCase()) > -1
        );
      });
    };


/**
 * 
 */
    const onClickBtnShowFilter = () => {
      if(isShowSearchBar.value) {
        iconBtnFilter.value = "filter_alt";
        isShowSearchBar.value = false;
        mSearchFiles.value = null;
        mFilterByTags.value = null;
        mCheckBoxWithoutTags.value = false;
        // mCheckBoxDuplicates.value = false;
      }
      else {
        iconBtnFilter.value = "filter_alt_off";
        isShowSearchBar.value = true;
      }
    }

    /**
     *
     * @param {*} value
     */
    const onUpdateFilteredByTags = (value) => {
      console.log(value);
    };

    /**
     *
     * @param {*} tagItem
     */
    const onClickChipTagFile = (tagItem) => {
      isShowSearchBar.value = true;
      iconBtnFilter.value = "filter_alt_off";
      if(mFilterByTags.value == null) mFilterByTags.value = [];

      // if the tagItem already exists in mFilterByTags => remove it from mFilterByTags
      if (
        mFilterByTags.value.filter(
          (tagFilteredId) => tagFilteredId == tagItem.id
        ).length > 0
      ) {
        mFilterByTags.value = mFilterByTags.value.filter(
          (tagFilteredId) => tagFilteredId != tagItem.id
        );
      } else {
        mFilterByTags.value.push(tagItem.id);
      }
    };

    return {
      filesListFiltered,
      mSearchFiles,
      mFilterByTags,
      listTags,
      tagsOptions,
      isShowSearchBar,
      isLoadingFiles,
      iconBtnFilter,
      mCheckBoxWithoutTags,
      mCheckBoxDuplicates,

      utils,
      getObjectTagById,
      getFileExtensionIcon,
      onClickBtnFileDescEdit,
      onClickBtnFileDelete,
      onClickBtnDownloadFile,
      onClickBtnAddTag,
      onClickBtnEditTags,
      onFilterTags,
      onClickBtnShowFilter,
      onUpdateFilteredByTags,
      onClickChipTagFile,
    };
  },
});
</script>
