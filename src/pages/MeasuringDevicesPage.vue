<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="q-gutter-md row">
        <q-select
          filled
          v-model="model"
          use-input
          fill-input
          input-debounce="0"
          multiple
          :options="options"
          @filter="filterFn"
          @update:model-value="change_1"
          hint="Select position"
          style="width: 250px; padding-bottom: 32px"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <div class="q-pa-md">
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="1RA15S02"
          caption="John Doe"
        >
          <!-- <q-card>
          <q-card-section>
            Type: SVB
          </q-card-section>
          <q-card-section>
            Type num: 1
          </q-card-section>
        </q-card> -->
          <q-item-section>
            <q-item-label caption lines="2">Type:</q-item-label>
            <q-item-label>SVB</q-item-label>
            <q-item-label caption lines="2">Type num:</q-item-label>
            <q-item-label>1</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>Edit</q-item-label>
            <q-btn flat>
              <q-icon name="edit" />
            </q-btn>
          </q-item-section>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="signal_wifi_off"
          label="Wifi settings"
        >
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem,
              eius reprehenderit eos corrupti commodi magni quaerat ex numquam,
              dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="drafts"
          label="Drafts"
          header-class="text-purple"
        >
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem,
              eius reprehenderit eos corrupti commodi magni quaerat ex numquam,
              dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item icon="assessment" label="Disabled" disable>
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem,
              eius reprehenderit eos corrupti commodi magni quaerat ex numquam,
              dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <div class="q-gutter-xs flex">
        <q-card flat bordered class="my-card bg-grey-1 content-stretch">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div>1RA15S02</div>
              </div>

              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable>
                        <q-item-section>Remove Card</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Send Feedback</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Share</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>

            <div>
              <div class="text-subtitle5 text-grey-14">Type:</div>
              <div class="text-subtitle7">SB</div>
              <div class="text-subtitle5 text-grey-14">Type num:</div>
              <div class="text-subtitle2">1</div>
            </div>
          </q-card-section>

          <!-- <q-card-section>
            <div class="text-subtitle5 text-grey-14">Type:</div>
            <div class="text-subtitle2">SB</div>
            <div class="text-subtitle5 text-grey-14">Type num:</div>
            <div class="text-subtitle2">1</div>
          </q-card-section> -->

          <q-separator />

          <q-card-actions>
            <q-btn flat>Action 1</q-btn>
            <q-btn flat>Action 2</q-btn>
          </q-card-actions>
        </q-card>

        <q-card flat bordered class="my-card bg-grey-1 content-stretch">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div>1RA25S02</div>
              </div>

              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable>
                        <q-item-section>Remove Card</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Send Feedback</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Share</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <!-- {{ lorem }} -->
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat>Action 1</q-btn>
            <q-btn flat>Action 2</q-btn>
          </q-card-actions>
        </q-card>

        <q-card flat bordered class="my-card bg-grey-1">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div>1RA35S02</div>
              </div>

              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable>
                        <q-item-section>Remove Card</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Send Feedback</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Share</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <!-- {{ lorem }} -->
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat>Action 1</q-btn>
            <q-btn flat>Action 2</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import * as fake_db from "../fake_db.js";

export default {
  // name: 'PageName',

  setup() {
    // let optionsData = [
    //   { name: "google", label: "Google" },
    //   { name: "facebook", label: "Facebook" },
    //   { name: "twitter", label: "Twitter" },
    //   { name: "apple", label: "Apple" },
    //   { name: "oracle", label: "Oracle" },
    // ];

    let optionsData = fake_db.positions.map((o) => ({
      label: o.pos,
      value: o.pos,
    }));
    
    // let optionsData = fake_db.positions;
    let options = ref(optionsData);
    let model = ref(null);

    function filterFn(val, update, abort) {
      update(() => {
        // console.log(options.value);
        // console.log(this.stringOptions);
        // console.log(val);

        const needle = val.toLowerCase();
        options.value = optionsData.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );

        // const needle = val.toLowerCase();
        // this.options = this.stringOptions.filter(
        //   (v) => v.toLowerCase().indexOf(needle) > -1
        // );

        // console.log(this.options);
      });
    }

    function change_1(val) {
      //  update(() => {
      //    console.log("dsdsd");
      //  });
      // console.log("dsdsd");
      // console.log(`Name: ${val.name}, Label: ${val.label}`);

      console.clear();
      val.forEach(el => console.log(el.value));
      // console.log(`Value: ${val.value}`);
    }

    return {
      model,
      options,

      filterFn,
      change_1,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 150px
</style>
