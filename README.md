# compare
Comparison Theme Component for [Hugo](https://gohugo.io/)

This theme component is designed to easily create a comparison web page, similar to product or serice plan pages 
across the web. It is **not** a full hugo theme, but is designed to be used as a secondary theme to generate 
comparison pages either via a section or type.

Check out the [Language Cross Reference](https://acahir.github.io/languageCrossReference/) for a live example build using this theme.

### Features
Includes collapsable sections, anchor link menu, sticky header, adjustable number of comparisons (columns), and 
interactive controls. 

**Modern Design** - Build using CSS Grid, CSS variables, minimal vanilla Javascript, and responsive.

**Customizable** - Building off of the provided grid framework, the comparison headersection headers, individual 
compare items, and style can all be overridden. 

**Data Driven** - Compare uses [Data Templates](https://gohugo.io/templates/data-templates/) to build the actual 
comparison, requiring the user to simply configure the front matter.

### Use

Coming Soon


#### Options

Front Matter Settings
- `maxComparisons` - the maximum number of columns to allow for comparing items
- `comparisonType` - the type of items to compare. Used to find the appropriate data files in data/
- `comparisonSections` - A list of sections to include in the comparison. Any additional sections in the data 
files will not be included, and any missing sections will be left empty.


### Status

As noted above, this theme is working for a live site, but that means that means some of the files are designed 
specifically for that (styles, partials, etc). The good news is they are much more specialized and complicated 
(code samples, color theme changes, syntax highlighting, etc) than most cases, so it should be straight forward 
to strip them down into a generic base setup.

Todos
- [ ] Define a "type" for use as a section in a page's front matter
  - [ ] Create an archetype template
- [ ] Example Site
  - [ ] Create a generic comparison-item partial
  - [ ] Create a basic product or plan comparison data set
  - [ ] Create a basic stylesheet for a table-like comparison design
- [ ] Test in a new blank site and an exisiting themed site
- [ ] Complete documentation for use and configuration
- [ ] Figure out best practices for how theme components should be configured for "dropping in"


### Technical Details

This section is mainly included for documenting the structure and design decisions for future reference. It 
(hopefully) isn't needed to use the theme for most cases, but is available to provide an overview for anyone 
modifying or simply trying to learn how it works.

#### HTML, CSS, and Javascript
The HTML is designed using semantic elements as much as possible, and the CSS is built off of [barebones](https://github.com/acahir/Barebones), a lightwieght boilerplate. There is a minimal about of vanilla 
Javascript used for the interactive functionality (show/hide, section link menu, etc) but no external 
Javascript libraries are used.

The comparison is designed around CSS Grid, so if you are not familiar with it, an [overview](https://css-tricks.com/snippets/css/complete-guide-grid) is an good place to start. But think of it similar to a table, 
but much better to work with than the old CSS tables. The grid is flexible, both rows and columns will be 
added as needed for content.

**The Grid:** In Compare, the number of columns is controlled by `maxComparisons` in the config settings, 
both to allow a good viewing experienceand to "lock" one compare item's data to a single column. This also 
allows all of an item's information to be easily hidden or moved to a new column. The default 
styling also has a user-facing control to change the number of columns on the fly.

Each section contains it's own grid, but all share the same css styling. This makes it easier to troubleshoot 
and read, but still allows rows to be sized consistantly across all columns. (An early prototype had one row 
per section, so individual items didn't align horizontally unless each item was a fixed height.

Rows are added as needed, sized to the largest content in that row.

**Variables:** CSS Variables are used to control colors, which columns data goes in, and visibility. These 
variables are the "source of truth", but are updated via Javascript when the page is in use.

No SASS/SCSS is used.

#### Data
The data for the comparisons use Hugo Data Tempaltes, which support data from JSON, YAML, TOML and are assumed 
to be in the `data/{{comparisonType}}/` directory as configured in front matter.

The required structure of the files is basic,  There are three expected root level key-value items: 
- **info**
  - **shortName**: required. required. a safe (no spaces) name used in CSS class names
  - **displayName**: required. a human readable name for displaying if needed
- **options**: optional. Area where options such as item specific color is defined.
- **sections**: required. Where the theme looks for the configured sections to load data from

Currently, only the "sections" section is a hard requirement, as that is where data is actually pulled from. 
The other sections can be used for additional info if desired for display labels, css class names, etc. 

but more elaborate structures can be used with a custom `comparison-item.html` partial.

The example data files use YAML because of its support for raw data strings. Any other Hugo supported format 
(toml, json) should also work. I don't know toml well enough to know if it supports raw strings, but I know 
json doesn't.

**Note** in YAML, the only way to control the order of items seems to be to use the "list" structure with 
dashes/hyphens. Ranging over a list of key/value pairs output items in a different order than in the data file.

#### Files

There aren't many, see the responsitory.