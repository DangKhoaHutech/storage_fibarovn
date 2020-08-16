(function($, Swiper, Modernizr) {

    'use strict';

    /**
     * Event root and handlers
     */
    var eventRoot = $('[data-eventroot]');

    if(eventRoot.length === 0) return;

    /**
     * GTM data layer
     */
    window.dataLayer = window.dataLayer || [];

    /**
     * App state
     */
    var appState = {
        isLoading: false,
        filters: {
            voivodeship: 'all',
            city: 'all',
            date: 'all'
        },
        vshipsFilterReady: false,
        vshipSelected: false,
        citySelected: false,
        dateSelected: false
    };

    /**
     * Data
     */
    var dataStore = {
        currentData: null,
        vshipOptions: [],
        cityOptions: [],
        dateOptions: []
    };

    /**
     * Strings
     */
    var strings = {
        signup: 'Sign up',
        cantfind: 'Couldn\'t find training in your city?',
        contactus: 'Contact us',
        choosespec: 'Pick an industry',
        voivodeships: {
            AB: 'Alberta (AB)',
            AL: 'Alabama (AL)',
            AK: 'Alaska (AK)',
            AZ: 'Arizona (AZ)',
            AR: 'Arkansas (AR)',
            BC: 'British Columbia (BC)',
            CA: 'California (CA)',
            CO: 'Colorado (CO)',
            CT: 'Connecticut (CT)',
            DE: 'Delaware (DE)',
            DC: 'District Of Columbia (DC)',
            FL: 'Florida (FL)',
            GA: 'Georgia (GA)',
            HI: 'Hawaii (HI)',
            ID: 'Idaho (ID)',
            IL: 'Illinois (IL)',
            IN: 'Indiana (IN)',
            IA: 'Iowa (IA)',
            KS: 'Kansas (KS)',
            KY: 'Kentucky (KY)',
            LA: 'Louisiana (LA)',
            ME: 'Maine (ME)',
            MD: 'Maryland (MD)',
            MA: 'Massachusetts (MA)',
            MB: 'Manitoba (MB)',
            MI: 'Michigan (MI)',
            MN: 'Minnesota (MN)',
            MS: 'Mississippi (MS)',
            MO: 'Missouri (MO)',
            MT: 'Montana (MT)',
            NE: 'Nebraska (NE)',
            NV: 'Nevada (NV)',
            NB: 'New Brunswick (NB)',
            NH: 'New Hampshire (NH)',
            NJ: 'New Jersey (NJ)',
            NM: 'New Mexico (NM)',
            NS: 'Nova Scotia (NS)',
            NY: 'New York (NY)',
            NC: 'North Carolina (NC)',
            ND: 'North Dakota (ND)',
            NL: 'Newfoundland and Labrador (NL)',
            OH: 'Ohio (OH)',
            OK: 'Oklahoma (OK)',
            ON: 'Ontario (ON)',
            OR: 'Oregon (OR)',
            PA: 'Pennsylvania (PA)',
            PE: 'Prince Edward Island (PE)',
            QC: 'Quebec (QC)',
            RI: 'Rhode Island (RI)',
            SC: 'South Carolina (SC)',
            SD: 'South Dakota (SD)',
            SK: 'Saskatchewan (SK)',
            TN: 'Tennessee (TN)',
            TX: 'Texas (TX)',
            UT: 'Utah (UT)',
            VT: 'Vermont (VT)',
            VA: 'Virginia (VA)',
            WA: 'Washington (WA)',
            WV: 'West Virginia (WV)',
            WI: 'Wisconsin (WI)',
            WY: 'Wyoming (WY)',
            ZZAB: 'Alberta (AB, Canada)',
            ZZBC: 'British Columbia (BC, Canada)',
            ZZMB: 'Manitoba (MB, Canada)',
            ZZNB: 'New Brunswick (NB, Canada)',
            ZZNL: 'Newfoundland and Labrador (NL, Canada)',
            ZZNS: 'Nova Scotia (NS, Canada)',
            ZZNT: 'Northwest Territories (NT, Canada)',
            ZZNU: 'Nunavut (NU, Canada)',
            ZZON: 'Ontario (ON, Canada)',
            ZZPE: 'Prince Edward Island (PE, Canada)',
            ZZQC: 'Québec (QC, Canada)',
            ZZSK: 'Saskatchewan (SK, Canada)',
            ZZYT: 'Yukon (YT, Canada)'
        }
    };

    /**
     * Event root - communication node
     */
    eventRoot
        .on('filters:voivodeship', function(event, voivodeship) {
            appState.filters.voivodeship = voivodeship;
            appState.filters.city = 'all';
            appState.filters.date = 'all';
            appState.citySelected = false;
            appState.dateSelected = false;
        })
        .on('filters:city', function(event, city) {
            appState.filters.city = city;
            appState.filters.date = 'all';
            appState.citySelected = city !== 'all';
        })
        .on('filters:date', function(event, date) {
            appState.filters.date = date;
            appState.dateSelected = date !== 'all';
        })
        .on('filters:voivodeship filters:city filters:date', function() {
            eventRoot.trigger('state:update');
            getEvents();
        })
        .on('state:update', function() {
            updateEventFilters();
        })
        .on('data:change', function() {
            handleEventData();
        });

    /**
     * REST API
     */
    var restBase = 'https://www.fibaro.com/us/wp-json/wp/v2';
    var allEvents = $.getJSON(restBase + '/training-events-us?per_page=100');

    function getEvents() {
        appState.isLoading = true;

        lockFilters();
        hideEventList();
        showLoader();

        var filters = '?per+page=100&';

        if(appState.filters.voivodeship !== 'all')
            filters += 'voivodeship=' + appState.filters.voivodeship + '&';

        if(appState.filters.city !== 'all')
            filters += 'city=' + appState.filters.city + '&';

        if(appState.filters.date !== 'all')
            filters += 'date=' + appState.filters.date + '&';

        return $.getJSON(restBase + '/training-events-us' + filters, function(result) {
            dataStore.currentData = result;
            appState.isLoading = false;

            eventRoot.trigger('data:change');
        });
    }

    function getPartner(partnerID) {
        return $.getJSON(restBase + '/training-partners-us/' + partnerID);
    }

    /**
     * Landing Page selector
     */
    function setupLandingPageSelector() {
        var landingPageSelect = $('#lp-s-voivodeship');
        var landingPageButton = $('#lp-b-checkdates');

        landingPageSelect.chosen({disable_search: true});
        landingPageSelect.append(dataStore.vshipOptions);

        // Enable select and button
        landingPageSelect.prop('disabled', false).trigger('chosen:updated');
        landingPageButton.prop('disabled', false);

        // Select event listener
        landingPageSelect.on('change', function() {
            eventRoot.trigger('filters:voivodeship', [landingPageSelect.val()]);
        });

        // Button event listener
        landingPageButton.on('click', function(event) {
            event.preventDefault();

            // Reset just in case someone opens overlay for a second time
            appState.filters.city = 'all';
            appState.filters.date = 'all';
            eventsFilterCities.val(appState.filters.city);
            eventsFilterDates.val(appState.filters.date);

            showEventsOverlay();

            // GTM
            window.dataLayer.push({
                event: 'formView',
                eventCategory: 'Installers Form',
                eventAction: 'View',
                eventLabel: 'Form Opened'
            });
        });

        // React to filter state change
        eventRoot.on('state:update', function() {
            landingPageSelect.val(appState.filters.voivodeship);
        });
    }

    /**
     * Build list of unique VOIVODESHIPS and generate select options
     */
    function getUniqueVshipOptions(data) {
        var voivodeships = strings.voivodeships,
            vships = [],
            options = '',
            unique;

        // Get unique options
        $.each(data, function(key, value) {
            vships.push(value.acf.voivodeship);
        });

        unique = vships.filter(function(element, index, array) {
            return array.indexOf(element) >= index;
        }).sort();

        // Construct HTML
        $.each(unique, function(key, value) {
            options += '<option value="' + value + '">' + voivodeships[value] + '</option>';
        });

        return options;
    }

    /**
     * Build list of unique CITIES and generate select options
     */
    function getUniqueCityOptions(data) {
        var cities = [],
            options = '',
            unique;

        $.each(data, function(key, value) {
            cities.push(value.acf.city);
        });

        unique = cities.filter(function(element, index, array) {
            return array.indexOf(element) >= index;
        }).sort();

        $.each(unique, function(key, value) {
            options += '<option value="' + value + '">' + value + '</option>';
        });

        return options;
    }

    /**
     * Build list of unique DATES (month-year pairs) and generate select options
     */
    function getUniqueDateOptions(data) {
        var dates = [],
            options = '',
            unique;

        $.each(data, function(key, value) {
            var dateComponents = value.acf.date.split('-');

            dates.push(
                dateComponents[0] + '-' + dateComponents[1]
            );
        });

        unique = dates.filter(function(element, index, array) {
            return array.indexOf(element) >= index;
        }).sort();

        $.each(unique, function(key, date) {
            var dateComponents = date.split('-');

            options
                += '<option value="'
                + DateFormatter.getDatesRange(date)
                + '">'
                + DateFormatter.getMonthName(dateComponents[1]) + ' ' + dateComponents[0]
                + '</option>';
        });

        return options;
    }

    /**
     * Wrapper for unique options builders
     */
    function getUniqueOptions(data) {
        if(!appState.vshipsFilterReady) dataStore.vshipOptions = getUniqueVshipOptions(data);
        if(!appState.citySelected) dataStore.cityOptions = getUniqueCityOptions(data);
        if(!appState.dateSelected) dataStore.dateOptions = getUniqueDateOptions(data);
    }

    /**
     * Events overlay
     */
    function showEventsOverlay() {
        eventRoot.fadeIn(250);

        if(appState.isLoading) return;

        $('body').css({overflow: 'hidden'});

        getEvents().done(function() {
            hideLoader();
            handleEventData();
        });
    }

    function hideEventsOverlay() {
        eventRoot.fadeOut(250, function() {
            hideEventList();
            showLoader();
            stepSwiper.slideTo(0);
        });

        $('body').css({overflow: 'auto'});
    }

    /**
     * Event filters
     */
    var eventsFiltersWrapper = eventRoot.find('.content.filters');
    var eventsFilterVships = $('#el-s-voivodeship');
    var eventsFilterCities = $('#el-s-city');
    var eventsFilterDates = $('#el-s-date');

    function setupEventFilters() {
        // Voivodeships
        eventsFilterVships.append(dataStore.vshipOptions);
        eventsFilterVships.val(appState.filters.voivodeship).trigger('chosen:updated');
        appState.vshipsFilterReady = true;

        // Cities
        eventsFilterCities.append(dataStore.cityOptions);
        eventsFilterCities.val(appState.filters.city).trigger('chosen:updated');

        // Dates
        eventsFilterDates.append(dataStore.dateOptions);
        eventsFilterDates.val(appState.filters.date).trigger('chosen:updated');
    }

    function updateEventFilters() {
        resetEventFilters();
        setupEventFilters();
    }

    function resetEventFilters() {
        eventsFilterVships.find('option:not([data-default])').remove();
        eventsFilterCities.find('option:not([data-default])').remove();
        eventsFilterDates.find('option:not([data-default])').remove();
    }

    function attachFilterListeners() {
        eventsFilterVships.on('change', function() {
            eventRoot.trigger('filters:voivodeship', [eventsFilterVships.val()]);
        });

        eventsFilterCities.on('change', function() {
            eventRoot.trigger('filters:city', [eventsFilterCities.val()]);
        });

        eventsFilterDates.on('change', function() {
            eventRoot.trigger('filters:date', [eventsFilterDates.val()]);
        });
    }

    function lockFilters() {
        eventsFilterVships.prop('disabled', true).trigger('chosen:updated');
        eventsFilterCities.prop('disabled', true).trigger('chosen:updated');
        eventsFilterDates.prop('disabled', true).trigger('chosen:updated');
    }

    function unlockFilters() {
        eventsFilterVships.prop('disabled', false).trigger('chosen:updated');
        eventsFilterCities.prop('disabled', false).trigger('chosen:updated');
        eventsFilterDates.prop('disabled', false).trigger('chosen:updated');
    }

    // Filter toggle
    $('#filter-toggle').on('click', function(event) {
        event.preventDefault();
        eventRoot.toggleClass('filters-active');
    });

    /**
     * Event list and data
     */
    var eventSteps = $('#event-steps');
    var eventList = $('#event-list');

    var lastEvent = '<div class="event-item last-item">';
    lastEvent += '<div class="cant-find">' + strings.cantfind + '</div>';
    lastEvent += '<div class="contact-us"><a href="https://www.fibaro.com/us/contact/">' + strings.contactus + '</a></div>';
    lastEvent += '</div>';

    $('#close-events, #lp-b-confirmation').on('click', hideEventsOverlay);

    function handleEventData() {
        eventList.empty();

        $.each(dataStore.currentData, function(index, item) {
            eventList.append(createEventItem(index, item));
        });

        eventList.append($(lastEvent));

        getUniqueOptions(dataStore.currentData);
        updateEventFilters();
        unlockFilters();
        hideLoader();
        showEventList();
    }

    function createEventItem(index, itemData) {
        var dateComponents = itemData.acf.date.split('-');

        // Item
        var item = $('<div>').addClass('event-item').attr('data-event', index);

        // Date
        var date = $('<div>').addClass('date clearfix').appendTo(item);

        $('<div>').addClass('day').text(dateComponents[2]).appendTo(date);

        $('<div>').addClass('weekday')
            .text(DateFormatter.getDayName(itemData.acf.date))
            .appendTo(date);

        $('<div>').addClass('monthyear')
            .text(DateFormatter.getMonthName(dateComponents[1], true) + ', ' + dateComponents[0])
            .appendTo(date);

        // Location
        var location = $('<div>').addClass('location').appendTo(item);

        $('<div>').addClass('city').text(itemData.acf.city).appendTo(location);
        $('<div>').addClass('address').text(itemData.acf.address).appendTo(location);

        // Button
        $('<a>').attr('href', 'javascript:').text(strings.signup).appendTo(item).on('click', gotoForm);

        return item;
    }

    function showEventList() {
        eventSteps.fadeIn(250);
        stepSwiper.update();
    }

    function hideEventList() {
        eventSteps.fadeOut(250);
    }

    function gotoForm(event) {
        event.preventDefault();

        var data = dataStore.currentData[$(this).parent().data('event')];

        createEventDetails(data);

        eventRoot.animate({scrollTop: 0}, 150, function() {
            if(Modernizr.mq('screen and (min-width: 1200px)'))
                eventRoot.find('.form-bot').animate({marginTop: '-=40'}, 250);

            stepSwiper.slideTo(1);
        });
    }

    /**
     * Filters - Chosen
     */
    eventsFilterVships.chosen({
        disable_search: true,
        width: '100%'
    });
    eventsFilterCities.chosen({
        disable_search: true,
        width: '100%'
    });
    eventsFilterDates.chosen({
        disable_search: true,
        width: '100%'
    });

    /**
     * Form
     */
    var eventForm = $('#event-form');
    var cf7Form = $('.wpcf7');

    function createEventDetails(data) {
        var dateComponents = data.acf.date.split('-');
        var details = $('.event-details');

        var agenda = '<ul>';

        $.each(data.acf.agenda, function(index, item) {
            agenda += '<li>' + item.topic + '</li>';
        });

        agenda += '</ul>';

        var dayName = DateFormatter.getDayName(data.acf.date);

        details.find('.day').text(dateComponents[2]);
        details.find('.weekday').text(dayName);
        details.find('.monthyear').text(DateFormatter.getMonthName(dateComponents[1], true) + ', ' + dateComponents[0]);
        details.find('.city').text(data.acf.city);
        details.find('.address').text(data.acf.address);
        details.find('.amount').text('$' + data.acf.price);

        if(data.acf.duration !== "") {
            details.find('.start').text(data.acf.duration)
        }

        var daySuffix;
        var dayNumber = parseInt(dateComponents[2], 10);

        switch(dayNumber) {
            case 1:
                daySuffix = 'st';
                break;
            case 2:
                daySuffix = 'nd';
                break;
            case 3:
                daySuffix = 'rd';
                break;
            default:
                daySuffix = 'th';
                break;
        }

        var prplace = data.acf.city + ', ' + data.acf.address;
        //var prdate = DateFormatter.getMonthName(dateComponents[1], true) + ' ' + dayNumber + daySuffix + ', ' +
        //    dateComponents[0] + ' (' + dayName + ')';
		var prdate = DateFormatter.getMonthName(dateComponents[1], true) + ' ' + dayNumber + daySuffix + ', ' +
        dateComponents[0];

        getPartner(data.acf.event_partner).done(function(result) {
            eventForm.find('input[name="prname"]').val(result.acf.name);
            eventForm.find('input[name="premail"]').val(result.acf.email);
            eventForm.find('input[name="prtel"]').val(result.acf.phone);
            eventForm.find('input[name="prplace"]').val(prplace);
            eventForm.find('input[name="prdate"]').val(prdate);
        });
    }

    // Chosen - Form select
    var formSelect = eventForm.find('select').chosen({
        disable_search: true,
        width: '100%'
    });

    formSelect.on('change', function(event) {
        event.currentTarget.value === 'inna'
            ? specInputOther.show()
            : specInputOther.hide();

        stepSwiper.update();
    });

    var specInputOther = $('input[name="specialization-other"]').parents('p');
    specInputOther.hide();

    cf7Form
        .on('wpcf7mailsent', function(event) {
            $.each(event.detail.inputs, function(index, input) {
                if(input.name === 'email') $('#event-confirmation').find('.conf p span').text(input.value);
            });

            eventRoot.animate({scrollTop: 0}, 150, function() {
                stepSwiper.slideTo(2);
            });

            // We need to reset recaptcha just in case someone wants to send another form
            grecaptcha.reset();

            // GTM
            window.dataLayer.push({
                event: 'formSent',
                eventCategory: 'Installers Form',
                eventAction: 'Send',
                eventLabel: 'Form Sent'
            });

            // FB
            fbq('init', '123380761680038');
            fbq('track', 'PageView');
            fbq('track', 'Lead');
        })
        .on('wpcf7invalid wpcf7submit wpcf7mailfailed', function() {
            stepSwiper.update();
        });

    /**
     * Form swiper
     */
    var stepSwiper = new Swiper('#event-steps', {
        simulateTouch: false,
        allowTouchMove: false,
        speed: 250,
        autoHeight: true,
        roundLengths: true,
        effect: 'fade',
        pagination: {
            el: '.swiper-pagination',
            type: 'progressbar',
            hideOnClick: false
        }
    });
    var stepMarkers = $('#steps-wrapper').find('.step');

    stepSwiper.on('slideChange', function() {
        if(this.activeIndex === 0) {
            if(Modernizr.mq('screen and (min-width: 1200px)'))
                eventRoot.find('.form-bot').animate({marginTop: '+=40'}, 250);

            eventsFiltersWrapper.fadeIn(250);
            stepMarkers.removeClass('active done');
            stepMarkers.eq(0).addClass('active');

            $('#filter-toggle').css({display: 'flex'});
            $('#close-events').css({display: 'flex'});
            $('#back-to-list').css({display: 'none'});
        }

        if(this.activeIndex === 1) {
            stepMarkers.removeClass('active done');
            stepMarkers.eq(0).addClass('done');
            stepMarkers.eq(1).addClass('active');

            eventRoot.removeClass('filters-active');
            $('#filter-toggle').css({display: 'none'});
            $('#close-events').css({display: 'none'});
            $('#back-to-list').css({display: 'flex'});
        }

        if(this.activeIndex === 2) {
            stepMarkers.removeClass('active done');
            stepMarkers.eq(0).addClass('done');
            stepMarkers.eq(1).addClass('done');
            stepMarkers.eq(2).addClass('active');

            $('#back-to-list').css({display: 'none'});
        }

        if(this.activeIndex !== 0) {
            eventsFiltersWrapper.fadeOut(250);
        }
    });

    $('#back-to-list').on('click', function(event) {
        event.preventDefault();

        eventRoot.animate({scrollTop: 0}, 150, function() {
            stepSwiper.slideTo(0);
        });
    });

    /**
     * Loader
     */
    var loader = eventRoot.find('.loader');

    function showLoader() {
        loader.fadeIn(250);
    }

    function hideLoader() {
        loader.fadeOut(250);
    }

    /**
     * Date formatting
     */
    var DateFormatter = {
        months: [
            ['January', 'January'],
            ['February', 'February'],
            ['March', 'March'],
            ['April', 'April'],
            ['May', 'May'],
            ['June', 'June'],
            ['July', 'July'],
            ['August', 'August'],
            ['September', 'September'],
            ['October', 'October'],
            ['November', 'November'],
            ['December', 'December']
        ],

        days: [

            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
			'Sunday'
        ],

        getDatesRange: function(date) {
            var dateComponents = date.split('-');
            var endOfMonth = '31';

            switch(parseInt(dateComponents[1], 10)) {
                case 2:
                    endOfMonth = '29';
                    break;

                case 4:
                case 6:
                case 9:
                case 11:
                    endOfMonth = '30';
                    break;
            }

            return [
                dateComponents[0] + '-' + dateComponents[1] + '-' + '01',
                dateComponents[0] + '-' + dateComponents[1] + '-' + endOfMonth
            ];
        },

        getMonthName: function(month, variation) {
            return variation
                ? DateFormatter.months[(parseInt(month) - 1)][1]
                : DateFormatter.months[(parseInt(month) - 1)][0];
        },

        getDayName: function(date) {
            return DateFormatter.days[new Date(date).getDay()];
        }
    };

    /**
     * Hack :( - change blank option in form select
     */
    var formSelectToHack = $('#installers-training').find('select[name="specialization"]');

    formSelectToHack.find('option').eq(0).text(strings.choosespec);
    formSelectToHack.trigger('chosen:updated');

    /**
     * Start the app when initial data is fetched
     */
    allEvents.done(function(data) {
        getUniqueOptions(data);
        setupLandingPageSelector();
        setupEventFilters();
        attachFilterListeners();
    });

})(jQuery, Swiper, Modernizr);
