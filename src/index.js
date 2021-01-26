import css from "./css/style.css";

import { alert, notice, info, success, error, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
defaultModules.set(PNotifyMobile, {});
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import template from './templates/template.hbs'
import templateList from './templates/templateList.hbs'
import debounce from 'lodash.debounce'
import fetchCountries from './fetchCountries.js'


const input = document.querySelector('#input-find-country');
const countryInfo = document.querySelector('#country-info');

input.addEventListener('input', debounce(() => {
    const inputCountryName = input.value;
    countryInfo.innerHTML = '';
    
    if (inputCountryName.length > 0) {
        fetchCountries(inputCountryName)
        .then((data) => {
            
            if (data.length === 1 || data.status === 200 ) {
                const markup = template(data);
                countryInfo.insertAdjacentHTML('beforeend', markup);
                success({ text: "Success! Here's your country!", delay: 1500 })
                return;
            }

            if (data.length > 1 && data.length < 10) {
                const markupList = templateList(data);
                countryInfo.insertAdjacentHTML('beforeend', markupList);
            }

            if (data.length > 10) {
                return notice({ text: "Enter a more precise request", delay: 1000 })
            };

            if (data.status === 404) {
                return error({ text: "Can't find country you're trying to search!", delay: 1500 })
            };
                  
        })
        .catch(error => console.error(error))

    } 

}, 500));