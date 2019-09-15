<template>
    <section class="vote-wrapper mx-auto">
        <div class="col-md-12 submit-link-wrapper">
            <router-link to="/add" tag="a" class="btn btn-outline-danger btn-lg btn-block btn-submit">
                <i class="fa fa-plus fa-1x"></i>SUBMIT A LINK
            </router-link>
        </div>
        <div class="text-center">
            <small>
                <strong>{{links.length}}</strong> links saved!
            </small>
        </div>
        <hr/>

        <div class="col-md-12 link-list w-100">
            <div class="form-group w-50 mx-auto">
                <select
                        v-model="listOrder"
                        @change="changeOrder()"
                        :disabled="links.length<2"
                        class="form-control"
                >
                    <option value>Order by (creation date)</option>
                    <option value="desc">most voted z > a</option>
                    <option value="asc">less voted a > z</option>
                </select>
            </div>

            <div class="text-center" v-if="links.length <= 0">There are no link records please submit an URL</div>

            <ul class="list-group" v-else>
                <li class="list-group-item list-group-item-action"
                        v-for="(link, index) in paginate"
                        :key="index">



                    <div class="link-item">
                        <div class="btn btn-outline-points vote-point-wrapper">
            <span class="text-center number-points">
              <strong>{{link.votes_count}}</strong>
            </span>
                            <span class="text-center points-text inner">POINTS</span>
                        </div>

                        <div class="link-group ml-2">
                            <p class="link-title">{{link.name}}</p>
                            <p class="link-title">
                                <small>
                                    <i>({{link.web_url}})</i>
                                </small>
                            </p>

                            <div class="link-remove">
                                <button
                                        type="button"
                                        class="btn"
                                        @click="removeStart(link,index)"
                                        :disabled="disableRemove"
                                        title="Remove item"
                                >
                                    <i aria-hidden="true" class="fa fa-minus-circle"></i>
                                </button>
                            </div>

                            <div class="vote-btn-group">
                                <a href="#" @click="upVote(link,index)" v-if="!link.current_user_voted">
                <span class="color-success">
                  <i class="fa fa-arrow-up"></i> Up Vote
                </span>
                                </a>
                                <a href="#" @click="downVote(link,index)" v-if="link.current_user_voted">
                <span class="color-danger">
                  <i class="fa fa-arrow-down"></i> Down Vote
                </span>
                                </a>
                            </div>
                        </div>
                    </div>


                </li>
            </ul>
        </div>
        <hr/>
        <div class="justify-content-center mt-3" v-if="links.length > 0">
            <ul class="pagination justify-content-center">
                <li class="page-item"></li>
                <li
                        v-for="(pageNumber,index) in totalPages"
                        :key="index"
                        v-if="Math.abs(pageNumber - currentPage) < 3 || pageNumber == totalPages || pageNumber == 1"
                        class="page-item"
                >
                    <a
                            v-bind:key="pageNumber"
                            href="#"
                            @click="setPage(pageNumber)"
                            class="page-link"
                            :class="{active: currentPage === pageNumber,  first:(pageNumber == 1 && Math.abs(pageNumber - currentPage) > 3)}"
                    >{{ pageNumber }}</a>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import * as service from "../service";

    export default {
        name: "home",
        components: {},
        data() {
            return {
                links: null,
                linksPaged: null,
                listOrder: "",
                disableRemove: false,
                currentPage: 1,
                itemsPerPage: 5,
                resultCount: 0,
                numPagesCalculated: 1
            };
        },
        methods: {

            sortByDate(items, reversed) {
                reversed = reversed ? -1 : 1;

                return items.sort(function (a, b) {
                    return reversed * (new Date(b.created_at) - new Date(a.created_at));
                });
            },

            sortByVote(items, reversed) {
                reversed = reversed ? -1 : 1;

                return items.sort(function (a, b) {
                    return (
                        reversed * (b.votes_count - a.votes_count) ||
                        reversed * (new Date(b.last_voted_at) - new Date(a.last_voted_at))
                    );
                });
            },

            // votes up
            upVote(item, index) {
                var indexInOrigArr =
                    index + (this.currentPage - 1) * this.itemsPerPage;

                var _item = service.upVoteItem(item);
                this.links[indexInOrigArr] = _item;

                if ("" !== this.listOrder) {
                    var isReversed = "asc" === this.listOrder ? true : false;
                    this.links = this.sortByVote(this.links, isReversed);
                }
                this.links = [...this.links];
            },

            // votes down
            downVote(item, index) {
                var indexInOrigArr =
                    index + (this.currentPage - 1) * this.itemsPerPage;

                var _item = service.downVoteItem(item);
                this.links[indexInOrigArr] = _item;
                if ("" !== this.listOrder) {
                    var isReversed = "asc" === this.listOrder ? true : false;
                    this.links = this.sortByVote(this.links, isReversed);
                }
                this.links = [...this.links];
            },

            // read  items from storage
            getAppData() {
                return service.getAppData();
            },

            // remove link start
            removeStart(item, index) {
                var indexInOrigArr =
                    index + (this.currentPage - 1) * this.itemsPerPage;
                this.removeLink(item, indexInOrigArr);
            },

            removeLink(item, index) {

                // remove link from storage before confirmation
                this.$swal
                    .fire({
                        title: "Are you sure?",
                        text: "Do you want to remove " + item.name,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!"
                    })
                    .then(result => {
                        if (result.value) {
                            this.$swal.fire({
                                toast: true,
                                position: 'top',
                                title: "Link Removed",
                                showConfirmButton: false,
                                timer: 2000,
                                type: "success"
                            });
                            var itemRemoved = service.removeItem(item);

                            // disable removals for 1s
                            this.disableRemove = true;

                            // set timeout to wait localstorage update 1 sec
                            setTimeout(() => {

                                // enable remove
                                this.disableRemove = false;

                                if (itemRemoved) {
                                    this.links.splice(index, 1);
                                }
                            }, 1000);
                        }
                    });
            },

            //  orderby
            changeOrder() {
                if ("" === this.listOrder) {
                    this.sortByDate(this.links, false);
                } else if ("desc" === this.listOrder) {
                    this.sortByVote(this.links, false);
                } else if ("asc" === this.listOrder) {
                    this.sortByVote(this.links, true);
                }
            },

            setPage: function (pageNumber) {
                this.currentPage = pageNumber;
            }
        },

        computed: {

            //Basic pagination  calc

            totalPages: function () {
                return Math.ceil(this.resultCount / this.itemsPerPage);
            },
            paginate: function () {
                if (!this.links || this.links.length != this.links.length) {
                    return;
                }
                this.resultCount = this.links.length;
                if (this.currentPage >= this.totalPages) {
                    this.currentPage = this.totalPages;
                }
                var index = this.currentPage * this.itemsPerPage - this.itemsPerPage;
                return this.links.slice(index, index + this.itemsPerPage);
            }
        },

        created() {

            // loading page  and Filling data from localstrage

            var _appData = this.getAppData();

            this.links = this.sortByDate(_appData.items, false);

            if (0 === this.links.length) {
            }
        }
    };
</script>
