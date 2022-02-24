<template>
  <div class="component-tablebox">
    <div class="table-top-wrapper">
      <div v-if="totalCount" class="row-total-count">
        <span>Total Count:</span>
        {{ totalCount }}
      </div>
    </div>
    <div class="table-container">
      <div class="table-row table-row-header">
        <div
          v-for="(column, index) in columns"
          :key="column.id"
          class="table-column"
          :class="{
            ...column.class,
            'table-column-first': index === 0,
            'table-column-last-odd': columns.length === index + 1 && (columns.length - 1) % 2 === 1
          }"
          :style="columnStyle(column)"
        >
          {{ column.headerText }}
        </div>
      </div>
      <div class="table-row" v-for="row in rows" :key="row.id">
        <div
          v-for="(column, index) in columns"
          :key="column.id"
          class="table-column"
          :class="{
            ...column.class,
            'table-column-first': index === 0,
            'table-column-last-odd': columns.length === index + 1 && (columns.length - 1) % 2 === 1
          }"
          :style="columnStyle(column)"
        >
          <slot v-if="column.slotKey" :name="column.slotKey" v-bind:row="row"></slot>
          <div v-if="column.htmlKey" v-html="row[column.htmlKey]"></div>
          <span v-if="column.textKey" class="span-text">{{ row[column.textKey] }}</span>
          <div v-if="column.type === 'functions'" class="text-center">
            <b-button-group size="sm">
              <b-button v-if="column.functions.edit" size="sm" variant="secondary" @click="clickEdit(row)">
                <font-awesome-icon :icon="['fas', 'edit']" class="mr-1" />Edit
              </b-button>
              <b-button v-if="column.functions.delete" size="sm" variant="warning" @click="clickDelete(row)">
                <font-awesome-icon :icon="['fas', 'trash-alt']" class="mr-1" />Delete
              </b-button>
            </b-button-group>
          </div>
        </div>
      </div>
      <div v-if="!loading && rows.length === 0" class="table-row table-row-empty">
        <div class="table-column table-column-full text-center">{{ emptyText }}</div>
      </div>
      <div v-if="loading" class="table-row table-row-empty">
        <div class="table-column table-column-full text-center">
          <span class="spinner spinner-white"></span>
        </div>
      </div>
    </div>
    <b-row class="table-bottom-wrapper mt-2 mx-0">
      <b-col :cols="6" class="px-0">
        <b-button size="sm" variant="success" @click="clickAdd">
          <font-awesome-icon :icon="['fas', 'plus']" class="mr-1" />{{ addText }}
        </b-button>
      </b-col>
      <b-col :cols="6" class="px-0 text-right">
        <b-pagination-nav
          v-if="rows.length"
          :link-gen="linkGen"
          :number-of-pages="totalNumberOfPage"
          use-router
          align="right"
        ></b-pagination-nav>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: {
    columns: Array,
    rows: Array,
    pagination: Object,
    baseUrl: String,
    emptyText: String,
    showAdd: Boolean,
    addText: String,
    loading: Boolean
  },
  name: 'TableBox',
  computed: {
    totalNumberOfPage() {
      if (this.pagination.total_rows && this.pagination.page_size) {
        return Math.ceil(this.pagination.total_rows / this.pagination.page_size);
      }
      return 1;
    },
    totalCount() {
      return this.pagination.total_rows;
    }
  },
  methods: {
    linkGen(pageNum) {
      return { path: this.baseUrl, query: { page: pageNum } };
    },
    columnStyle(column) {
      return { width: column.width };
    },
    clickAdd() {
      this.$emit('add', {});
    },
    clickEdit(row) {
      this.$emit('edit', { row });
    },
    clickDelete(row) {
      this.$emit('delete', { row });
    }
  }
};
</script>

<style scoped>
.component-tablebox {
  font-size: 0.9rem;
}

.table-top-wrapper {
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: left;
}

.table-container {
  display: block;
  width: 100%;
}

.row-total-count {
  margin-bottom: 0.5rem;
}

.row-total-count span {
  font-weight: bold;
}

.table-row {
  display: flex;
  flex-flow: row wrap;
  margin-right: 0;
  margin-left: 0;
  border-left: solid 1px #d9d9d9;
  transition: 0.5s;
}

.table-row:first-of-type {
  border-top: solid 1px #d9d9d9;
  border-bottom: solid 2px #d9d9d9;
  border-left: solid 1px #d9d9d9;
}

.table-column {
  padding: 0.5em;
  border-right: solid 1px #d9d9d9;
  border-bottom: solid 1px #d9d9d9;
}

.table-columns {
  display: flex;
  flex-flow: column wrap;
  width: 75%;
  padding: 0;
}

.table-columns .table-column {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  padding: 0;
  border: 0;
  border-bottom: solid 1px #d9d9d9;
}

.table-columns .table-column:hover {
  background: #f5f5f5;
  transition: 500ms;
}

.table-row:first-of-type .table-column {
  font-weight: bold;
  color: #000;
  background: #fff;
  border-color: #d9d9d9;
}

.table-row:nth-child(odd) .table-column {
  background: #f4f2f1;
}

.table-row:hover {
  background: #f5f5f5;
  transition: 500ms;
}

.table-column-full {
  width: 100%;
}

.table-column-rowspan {
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: center;
}

.flex-cell {
  padding: 0.5em;
  text-align: center;
  border-right: solid 1px #d9d9d9;
}

@media all and (max-width: 767px) {
  .table-row {
    border-right: solid 1px #d9d9d9;
    border-bottom: solid 2px #d9d9d9;
  }

  .table-row .table-column {
    width: 50% !important;
    text-align: left !important;
    background: #fff;
    border: 0;
  }

  .table-row .table-column.table-column-first {
    width: 100% !important;
    border-bottom: solid 1px #d9d9d9;
  }

  .table-row .table-column.table-column-last-odd {
    width: 100% !important;
  }
}

@media all and (max-width: 430px) {
  .table-column {
    width: 100%;
  }

  .column .table-column {
    border-bottom: solid 1px;
  }

  .table-column.table-column-first {
    width: 100%;
    border-bottom: solid 1px #d9d9d9;
  }

  .table-row .table-column {
    width: 100% !important;
    text-align: left !important;
    border-bottom: 0;
  }

  .table-row .table-column:last-of-type {
    border-bottom: solid 1px #d9d9d9;
  }

  .table-columns {
    width: 100%;
  }

  .table-columns.table-column {
    border-bottom: solid 1px #d9d9d9;
  }

  .flex-cell {
    width: 100%;
  }
}
</style>
