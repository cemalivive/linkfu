<template>
  <section class="add-link-wrapper mx-auto row">
    <div class="col-md-12">
      <router-link to="/" tag="a">
        <i class="fa fa-arrow-left"></i> Return to List
      </router-link>

      <h3>Add New Link</h3>
      <form @submit.prevent="addLink()">
        <div class="form-group">
          <label for="link-name">Link Name:</label>
          <input
            type="text"
            class="form-control"
            id="link-name"
            aria-describedby="emailHelp"
            placeholder="e.g. Alphabet"
            v-model="formData.linkname"
            required
          />
        </div>
        <div class="form-group">
          <label for="link-url">Link URL:</label>
          <input
            type="url"
            class="form-control"
            id="link-url"
            placeholder="e.g. http://abc.xyz"
            v-model="formData.linkurl"
            required
          />
        </div>

        <button type="submit" class="btn btn-add btn-lg" :disabled="disableAdd">Add</button>
      </form>
    </div>
  </section>
</template>

<script>
import { addItem } from "../service";
export default {
  data() {
    return {
        disableAdd :false,
      formData: {},
      link: null
    };
  },

  methods: {
    addLink() {
      var item = {
        name: this.formData.linkname,
        redirect_url: this.formData.linkurl
      };

      // disable  removals for 1s
      this.disableAdd = true;

      // add single item to storage (service.js)
      var itemRecorded = addItem(item);

        // set timeout to wait localstorage update 1 sec
      setTimeout(() => {

          // disable removals for 1s
        this.disableAdd = false;

        if (itemRecorded) {
          this.link = itemRecorded;

        //Show message 
          this.$swal.fire({
            toast: true,
            type: "success",
              position: 'top',

              title: this.formData.linkname + " Added",
            showConfirmButton: false,
            type: "success",
            timer: 1500
          });

          // clear form
          this.formData = { linkname: "", linkurl: "" };
        }
      }, 1000);
    },

  }
};
</script>