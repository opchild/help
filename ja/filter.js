/**
 * Mozello Catalog Filter Actions
 */
function mozCatalogFilter()
{
    this.catalogMaxChecksPerOptionFilter = 20;

    this.initSort();
    this.initFilter();

    this.doUpdateFilteredProductsCount();
}

/*** Sort ***/

mozCatalogFilter.prototype.initSort = function()
{
    var base = this;

    $('#cat-nav .cat-sort')
        .off()
        .on('change', function() {
            base.doSortOrFilter('sort');
        });
}

/*** Filter ***/

mozCatalogFilter.prototype.initFilter = function()
{
    var base = this;
    var filterPanel = $('#cat-filter');
    var icon_filter = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 102 102" width="102" height="102"><path d="M24.22 1.707c-6.24 0-11.337 5.099-11.337 11.34v1.012H3.738c-1.67 0-3.105 1.358-3.105 3.091 0 1.718 1.38 3.092 3.027 3.092h9.223v1.051c0 6.241 5.097 11.338 11.338 11.338h8.246c6.24 0 11.338-5.097 11.338-11.338v-1.031h54.87a3.107 3.107 0 0 0 3.093-3.092 3.109 3.109 0 0 0-3.092-3.094H43.805v-1.03c0-6.24-5.097-11.339-11.338-11.339H24.22zm0 6.186h8.247a5.15 5.15 0 0 1 5.154 5.154v8.246a5.148 5.148 0 0 1-5.154 5.152H24.22a5.148 5.148 0 0 1-5.155-5.152V13.047a5.15 5.15 0 0 1 5.155-5.154zM69.694 34.69c-6.24 0-11.338 5.097-11.338 11.338v1.032H3.727a3.109 3.109 0 0 0-3.094 3.091 3.11 3.11 0 0 0 3.094 3.094h54.628v1.03c0 6.24 5.097 11.34 11.338 11.34h8.246c6.241 0 11.34-5.1 11.34-11.34v-1.1h9.354c1.659 0 2.998-1.406 2.998-3.092 0-1.718-1.392-3.094-3.05-3.094h-9.302v-.96c0-6.242-5.099-11.339-11.34-11.339h-8.246zm0 6.186h8.246a5.148 5.148 0 0 1 5.155 5.152v8.246a5.15 5.15 0 0 1-5.155 5.155h-8.246a5.148 5.148 0 0 1-5.152-5.155V46.03a5.146 5.146 0 0 1 5.152-5.152zM36.71 67.676c-6.241 0-11.338 5.097-11.338 11.338v1.03H3.761c-1.685 0-3.128 1.364-3.128 3.093 0 .896.418 1.665.974 2.2.557.537 1.27.892 2.077.892H25.37v1.03c0 6.242 5.097 11.339 11.338 11.339h8.246c6.241 0 11.34-5.097 11.34-11.338v-1.014h42.228c1.716 0 3.123-1.4 3.123-3.092 0-1.77-1.486-3.091-3.15-3.091H56.295v-1.05c0-6.24-5.099-11.337-11.34-11.337H36.71zm0 6.183h8.246a5.15 5.15 0 0 1 5.154 5.155V87.26a5.15 5.15 0 0 1-5.154 5.154H36.71a5.148 5.148 0 0 1-5.152-5.154v-8.246a5.148 5.148 0 0 1 5.152-5.155z" color="#000" font-weight="400" font-family="sans-serif" overflow="visible"/></svg>';

    // Add opening and close logic.

    menuAddOpenerLogic('#cat-filter', $('.cat-filter-toggle'));
    $('#cat-filter-close').on('click', function () {
        filterPanel.hide().removeClass('visible');
    });

    // Load icons inline.

    $('.cat-filter-toggle svg').replaceWith(icon_filter);
    $('#cat-filter button svg').replaceWith(icon_close);

    // Set colors
    if (typeof legacySetSlidingPanelColors === 'function') {
        var foregroundColor = getElementColor($('.cat-filter-toggle div'), 'color');
        legacySetSlidingPanelColors(foregroundColor);
    }

    // Build filters.

    this.buildFilters();

    // Adds filter reset logics.

    $('#cat-filter-reset')
        .off()
        .on('click', function() {
            base.resetCurrentFilterValues();
        });

    this.toggleFilterResetVisibility();
}

mozCatalogFilter.prototype.toggleFilterResetVisibility = function()
{
    var filterValues = this.getCurrentFilterValues();
    $('#cat-filter-reset').toggle(Array.isArray(filterValues) && filterValues.length > 0);
}

mozCatalogFilter.prototype.buildFilters = function()
{
    var base = this;
    var container = $('#cat-filter-base');

    if (container.length != 1 || typeof mozCatFilters == undefined) {
        return;
    }

    container.find('form.moze-form').html('');

    $.each(mozCatFilters.common, function(key, filter) {
        var html = '';
        if (filter.control == 'slider') {
            html = base._buildFilterSliderCtrl(filter);
        }
        if (filter.control == 'checkboxes') {
            html = base._buildFilterCheckboxesCtrl(filter, 'common');
        }
        if (html) {
            html.addClass('common');
            container.find('form.moze-form').append(html);
        }
    });

    $.each(mozCatFilters.options, function(key, filter) {
        var html = '';
        if (filter.control == 'checkboxes') {
            html = base._buildFilterCheckboxesCtrl(filter, 'options');
        }
        if (html) {
            html.addClass('options');
            container.find('form.moze-form').append(html);
            var firstInputInGroup = html.find('input[type="checkbox"]').first();
            if (firstInputInGroup.length) {
                base.doRestrictCheckboxesChecked(firstInputInGroup);
            }
        }
    });

    base.countTotalFiltersSet();
}

mozCatalogFilter.prototype._buildFilterSliderCtrl = function(filter)
{
    var base = this;

    var filterGroup = $('<div>', { class: 'cat-filter-group' })
        .attr('data-type', filter.control)
        .attr('data-name', filter.name);

    var caption = $('<h3>').html(filter.caption);
    filterGroup.append(caption);

    var slider = $('<div>', { class: 'moze-filter-slider', style: 'margin: 65px 14px 40px 14px' });
    filterGroup.append(slider);

    noUiSlider.create(slider[0], {
        start: [
            filter.value_min,
            filter.value_max
        ],
        connect: true,
        step: 1,
        tooltips: true,
        range: {
            min: filter.control_min,
            max: filter.control_max
        },
        margin: (filter.control_max - filter.control_min <= 100) ? 1 : 10
    });

    slider[0].noUiSlider.on('end', function() {
        base.doSortOrFilter('filter');
        // base.doUpdateFilteredProductsCount();
    });

    return filterGroup;
}

mozCatalogFilter.prototype._buildFilterCheckboxesCtrl = function(filter, filterType)
{
    var base = this;

    var filterGroup = $('<div>', { class: 'cat-filter-group' })
        .attr('data-type', filter.control)
        .attr('data-name', filter.name);

    var caption = $('<h3>').html(filter.caption);
    filterGroup.append(caption);

    $.each(filter.options, function(key, option) {
        var label = $('<label>', { class: 'moze-checkbox' });
        var inputName = option.key ? option.key : option.caption;
        var input = $('<input>', { type: 'checkbox', name: inputName, value: 1, checked: option.value == 1 });
        input.on('click', function () {
            base.doSortOrFilter('filter');
        });
        if (filterType == 'options') {
            input.on('click', function() {
                base.doRestrictCheckboxesChecked($(input));
            });
        }
        // input.on('click', function() {
        //     base.doUpdateFilteredProductsCount();
        // });
        label.append(input);
        label.append(document.createTextNode(option.caption));
        filterGroup.append(label);
        filterGroup.append($('<br>'));
    });

    return filterGroup;
}

mozCatalogFilter.prototype.countTotalFiltersSet = function()
{
    var total = 0;
    var filterGroups = $('#cat-filter-base .cat-filter-group');

    total += filterGroups.find('input[type="checkbox"]:checked').length;

    filterGroups.find('.moze-filter-slider').each(function() {
        var slider = $(this)[0].noUiSlider;
        if (slider.get(true)[0] > slider.options.range.min || slider.get(true)[1] < slider.options.range.max) {
            total++;
        }
    });

    return total;
}

mozCatalogFilter.prototype.getCurrentFilterValues = function()
{
    var result = [];

    var filterGroups = $('#cat-filter-base .cat-filter-group');
    filterGroups.each(function(key, value) {

        var name = $(this).attr('data-name');
        var type = $(this).attr('data-type');
        var source = $(this).hasClass('common') ? 'common' : 'options';

        switch (type) {
            case 'slider':
                var slider = $(this).find('.moze-filter-slider');
                if (slider.length) {
                    var sliderValues = slider[0].noUiSlider.get(true);
                    var sliderOptions = slider[0].noUiSlider.options;
                    var values = [
                        sliderValues[0] > sliderOptions.range.min ? sliderValues[0] : null,
                        sliderValues[1] < sliderOptions.range.max ? sliderValues[1] : null
                    ];
                }
                else {
                    var values = [null, null];
                }
                if (values[0]) {
                    result.push({
                        key: name + '_min',
                        value: Math.round(values[0] * 100) / 100,
                        source: source
                    });
                }
                if (values[1]) {
                    result.push({
                        key: name + '_max',
                        value: Math.round(values[1] * 100) / 100,
                        source: source
                    });
                }
                break;

            case 'checkboxes':
                var checkboxes = $(this).find('input[type="checkbox"][name]');
                var values = [];
                $.each(checkboxes, function() {
                    if ($(this).is(':checked')) {
                        values.push($(this).attr('name'));
                    }
                });
                if (values.length > 0) {
                    result.push({
                        key: name,
                        value: values,
                        source: source
                    });
                }
                break;
        }
    });

    return result;
}

mozCatalogFilter.prototype.resetCurrentFilterValues = function()
{
    var base = this;
    var reset = false;

    var filterGroups = $('#cat-filter-base .cat-filter-group');
    filterGroups.each(function(key, value) {

        var name = $(this).attr('data-name');
        var type = $(this).attr('data-type');

        switch (type) {
            case 'slider':
                var slider = $(this).find('.moze-filter-slider');
                if (slider.length) {
                    var sliderValues = slider[0].noUiSlider.get(true);
                    var sliderOptions = slider[0].noUiSlider.options;
                    var values = [
                        sliderValues[0] > sliderOptions.range.min ? sliderValues[0] : null,
                        sliderValues[1] < sliderOptions.range.max ? sliderValues[1] : null
                    ];
                    if (values[0] || values[1]) {
                        slider[0].noUiSlider.set([sliderOptions.range.min, sliderOptions.range.max]);
                        reset = true;
                    }
                }
                break;

            case 'checkboxes':
                var checkboxes = $(this).find('input[type="checkbox"][name]');
                if (checkboxes.length) {
                    $.each(checkboxes, function () {
                        if ($(this).is(':checked')) {
                            $(this).prop('checked', false);
                            reset = true;
                        }
                    });
                }
                break;
        }
    });

    if (reset) {
        base.doSortOrFilter('filter');
    }

    this.toggleFilterResetVisibility();
}

/*** Events ***/

mozCatalogFilter.prototype.doUpdateFilteredProductsCount = function()
{
    var countTotalFiltersSet = this.countTotalFiltersSet();

    if (countTotalFiltersSet > 0) {
        var countCatItems = $('.mz_component.mz_catalog .cat-grid .cat-thumb').length;
        $('#cat-nav .cat-filter-toggle .counter').show();
        $('#cat-nav .cat-filter-toggle .counter span').html(countCatItems);
    }
    else {
        $('#cat-nav .cat-filter-toggle .counter').hide();
        $('#cat-nav .cat-filter-toggle .counter span').html('');
    }
}

mozCatalogFilter.prototype.doRestrictCheckboxesChecked = function(sender)
{
    var optionFilterGroup = $(sender).parents('.cat-filter-group.options');

    if (!optionFilterGroup.length) {
        return;
    }

    var inputsChecked = optionFilterGroup.find('input[type="checkbox"]:checked'),
        inputsUnchecked = optionFilterGroup.find('input[type="checkbox"]:not(:checked)');

    if ((inputsChecked.length >= this.catalogMaxChecksPerOptionFilter)) {
        inputsUnchecked.attr('disabled', true).attr('checked', false);
    }
    else {
        inputsUnchecked.attr('disabled', false);
    }
}

mozCatalogFilter.prototype.doSortOrFilter = function(origin)
{
    var base = this;

    var url = new URL(window.location),
        newSortValue = $('#cat-nav .cat-sort select option:selected').val(),
        newOptionFilterValues = this.getCurrentFilterValues();

    // Replace the sort parameter, leave everything else.

    if (origin == 'sort') {
        url.searchParams.set('sort', newSortValue);
    }

    // Keep the sort parameter, replace everything else.

    if (origin == 'filter') {

        var optionNamePrefix = 'o';
        var optionValuePrefix = 'v';

        var paramNamesToDelete = [];
        var paramRegexNamesToDelete = [
            /(availability)|(price_min)|(price_max)|(brand)/,
            /o[0-9]+/,
            /v[0-9]+(\[\])?/
        ];

        for (var pair of url.searchParams.entries()) {
            for (var regex of paramRegexNamesToDelete) {
                if (pair[0].match(regex)) {
                    paramNamesToDelete.push(pair[0]);
                    continue;
                }
            }
        }

        for (var name of paramNamesToDelete) {
            url.searchParams.delete(name);
        }

        for (var pair of newOptionFilterValues) {
            if (pair.source == 'options') {
                continue;
            }
            if (Array.isArray(pair.value)) {
                for (var value of pair.value) {
                    url.searchParams.append(pair.key + '[]', value);
                }
            }
            else {
                url.searchParams.set(pair.key, pair.value);
            }
        }

        var index = 1;
        for (var pair of newOptionFilterValues) {
            if (pair.source == 'common') {
                continue;
            }
            url.searchParams.set(optionNamePrefix + index, pair.key);
            if (Array.isArray(pair.value)) {
                for (var value of pair.value) {
                    url.searchParams.append(optionValuePrefix + index + '[]', value);
                }
            }
            else {
                url.searchParams.set(optionValuePrefix + index, pair.value);
            }
            index++;
        }
    }

    // Refreshes the list view.

    new mozLive3({
        source: {
            name: 'maincatalog',
            superglobal: 1
        },
        action: 'catalog-list-view-refresh',
        parameters: {
            host: url.host,
            pathname: url.pathname,
            search: url.search
        },
        response: {
            callback: [
                function (response) {

                    if (response.success) {

                        var parser = new DOMParser(),
                            newDocument = parser.parseFromString(response.html, 'text/html'),
                            newCatalog = $(newDocument).find('.mz_component.mz_catalog'),
                            newCatalogGrid = newCatalog.find('.cat-grid');

                        $('.mz_component.mz_catalog .cat-grid').replaceWith(newCatalogGrid);

                        base.doUpdateFilteredProductsCount();
                        base.fixCatImages();

                        reinitMozCatalogCartActions();
                        base.toggleFilterResetVisibility();

                        window.history.replaceState({ path: url.toString() }, '', url.toString());
                    }
                    else {
                        window.location = url;
                    }
                }
            ]
        }
    });
}

/*** Helpers ***/

mozCatalogFilter.prototype.fixThumbnailImageLayout = function()
{
    if (typeof fixThumbnailImageLayout !== 'function') {
        return;
    }

    $('.mz_catalog .cat-thumb-pic img:not([data-slot-type="no-product"])')
        .one('load', function() {
            fixThumbnailImageLayout(this);
        })
        .each(function() {
            if (this.complete && typeof $(this).attr('src') != 'undefined') {
                $(this).trigger('load');
            }
        });
}

mozCatalogFilter.prototype.fixCatImages = function()
{
    // Re-initializes the $.fn.unveil() plugin which lazy loads catalog item images.

    if (typeof $.fn.unveil == 'function') {
        $(".cat-thumb-pic img").unveil(300);
    }

    this.fixThumbnailImageLayout();
}

/*** Initialization ***/

function reinitMozCatalogFilterActions()
{
    new mozCatalogFilter();
}

$(document).ready(function() {
    reinitMozCatalogFilterActions();
});

/*** End ***/