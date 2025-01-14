<h4 class="margin-btm-8">Release Notes</h4>
<hr class="margin-btm-32" />

# Change Log

## [1.3.0] - 2023-08-23

### Features

- `f-table-schema` : `header-cell-template` prop added for a common header-cell template.

## [1.2.4] - 2023-08-21

### Bug Fixes

- `f-table-schema` : When a cell contains a large amount of text content and is used without a template, the table will display a scrollbar.

## [1.2.3] - 2023-08-18

### Bug Fixes

- `f-tcell` : text and content not rendering while exporting using `jspdf`.

## [1.2.2] - 2023-07-20

### Improvements

- `f-tcell` : In actions callback, passing additional parameter as element for further implementation (like opening popover).

## [1.2.1] - 2023-07-20

### Improvements

- `f-table-schema` : `@row-click` event emitted with row object

### Bug Fixes

- `f-table-schema` : `show-search-bar` not working in vue

## [1.2.0] - 2023-07-18

### Features

- `f-table-schema` : expandIconPosition position made configurable.
- `f-trow` now supports `expand-icon-position` attribute.
- `f-tcell` actions now supports tooltip

### Improvements

- `part="cell"` added `f-table-schema` to support external styles.

### Bug fixes

- `f-table-schema` : external template alignment fixed.

## [1.1.1] - 2023-07-13

### Bug Fixes

- `f-table-schema` : details slot width issue fixed.

## [1.1.0] - 2023-07-11

### Features

- `f-table-schema` : Search on a specific column

### Improvements

- Action in the cell requires id (in case of displaying popover)
- Disable row selection for a specific rows
- Hide sort on a specific columns

### Bug Fixes

- Sort doesn’t work if we have the search term
- Highlight row not changing the background of the sticky column

## [1.0.2] - 2023-06-13

### Bug Fixes

- `f-table-schema` : duplicate vue3 types export bug fixed.

## [1.0.1] - 2023-06-13

### Improvements

- `f-table-schema` : `data` property options doc added.
- More stories added to understand properties and events of `f-table-schema`.

### Bug Fixes

- `f-table-schema` : alignment fixed when used inside `f-div`.
- `f-table-schema` : background color fixed when variant="stripped" with sticy column combination.

## [1.0.0] - 2023-06-08

### Improvements

- `f-table-schema` : api updated
- `f-table-schema` : `@row-input` event added whenever row is checked/unchecked.
- `f-table-schema` : `@toggle-row-details` event added whenever row details open or closed.
- `f-table-schema` : `@header-selected` event added whenever row column header is selected.
- `f-table-schema` : `showSearchBar` property added to disable or enable searchbar.
- `f-table-schema` : `searchTerm` property added to accept searchTerm externally.

## [0.1.0-beta2] - 2023-06-08

### Note : Published for testing

### Features

- `f-table-schema` : Sticky row and column feture added.
- `f-table-schema` : Search, sort, infinite scroll features added.

## [0.0.1] - 2023-05-02

### Improvements

- First release
