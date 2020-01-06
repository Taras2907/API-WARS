import {dataHandler} from "/static/js/data_handler.js";
import { animation } from "/static/js/animation.js";
export let dom = {

    createElementAndAppendToParent:function(elementType, parent){
        parent.append(document.createElement(elementType))
    },
    createRow:function (cellsInRow, table_obj,elementType) {
        for (let cell = 0; cell <cellsInRow;cell++){
           dom.createElementAndAppendToParent(elementType, table_obj);
        }
    },
    createHeaders:function(table_headers, table_obj){
        dom.createElementAndAppendToParent("tr",table_obj);
        let headerRow = table_obj.lastChild;
        dom.createRow(table_headers.length, headerRow, "th")
    },
    createRows:function(parentTable, rowsInTable, cellsInRow){
        for (let rows = 0; rows < rowsInTable; rows++) {
            dom.createElementAndAppendToParent("tr", parentTable);
            let currentRow = parentTable.lastChild;
            dom.createRow(cellsInRow, currentRow, "td")
        }
    },
    fillHeaders:function(headers, mainTable){
        $.each(headers, function (idx, header) {
            mainTable.firstChild.childNodes[idx].textContent = header
        })
    },
    rowsInTable: function(isMainTable, tableHeaders){
      return (isMainTable) ? tableHeaders.length -1 : tableHeaders.length
    },
    fillRow:function (planetData, planet, tableHeaders, rowElement, isMainTable) {
        for (let row = 0; row < dom.rowsInTable(isMainTable, tableHeaders); row++) { // actually we have 7 columns column vote doesn't contain any data
            let planetProperty = tableHeaders[row]; // this variable is a key to get value from the dictionary
            let cell = rowElement.childNodes[row];
            cell.innerHTML = dom.editResidentsCell(planetData[planet][planetProperty], planetProperty, planet)
        }
    },
    editResidentsCell:function(dataToEdit, header, index){
        if (header === 'residents'){
            if (dataToEdit.length === 0){
                dataToEdit = "No known residents";
            }else{
                dataToEdit = `<button class="btn-success"
                                data-toggle="modal"
                                data-target="#showResidents" 
                                data-residentButton="${index}">
                                ${dataToEdit.length + ' resident(s)'}
                                </button>`;
            }
        }
        return dataToEdit
    },
    fillRows:function(listOfPlanets, mainTable, tableHeaders, isMainTable){
        for (let planet = 0;planet<listOfPlanets.length; planet++){
            let rowElement = mainTable.childNodes[planet + 1]; // headers take index 0 so we are counting from index always be + 1
            dom.fillRow(listOfPlanets, planet, tableHeaders, rowElement, isMainTable)
        }
    },
    fillTable:function (headers, mainTable, listOfPlanets, isMainTable) {
        dom.fillHeaders(headers, mainTable);
        dom.fillRows(listOfPlanets, mainTable, headers, isMainTable);
    },
    createTable:function (listOfPlanets, mainTable, tableHeaders, isMainTable) {
        dom.createHeaders(tableHeaders, mainTable);
        dom.createRows(mainTable, listOfPlanets.length,tableHeaders.length );
        dom.fillTable(tableHeaders, mainTable, listOfPlanets, isMainTable);
    },
    addVoteButtons:function (planets) {
        $("tr:not(:first-child)").each(function (idx) {
            this.lastElementChild.innerHTML = `<button class="btn-primary">vote</button>`;
            this.lastElementChild.addEventListener('click', function () {
                 dom.displayVoteMessage();
                 let planetName = planets[idx]['name'];
                 let planetUrl = planets[idx]['url'];
                 let planetId = planetUrl[planetUrl.length -2];
                 dataHandler.writeVoteToDatabase(planetId, planetName)
            })
        });
    },
    displayVoteMessage:function () {
        $("#voteConfirmMessage").attr("class", "toast fade show");
        setTimeout(function () {
            $("#voteConfirmMessage").attr("class", "toast fade hide");
        }, 1500)
    },
    addListenerToResidentButton:function (listOfPlanets){
        $.each($("[data-residentButton]"), function (idx) {
            this.addEventListener('click', function () {
                dom.cleanTable(document.getElementById('modal-table'));
                let planetNumber = this.dataset['residentbutton'];
                dom.downloadResidentsOfThePlanet(listOfPlanets[planetNumber]);
            })
        })
    },
    createModalTable:function (rowsInTable, residents, planetName) {
        const modalTable = document.getElementById('modal-table');
        const modalHeaders = [
            'name', 'height', 'mass', 'hair_color', 'skin_color',
            'eye_color', 'birth_year', 'gender'
        ];
        $(".modal-title").html('Residents of ' + planetName);
        dom.createTable(residents, modalTable, modalHeaders, false)
    },
    downloadResidentsOfThePlanet:function (planet) {
        let listOfPromises = [];
        let planetResidents = planet['residents'];
        for (let resident = 0; resident <planetResidents.length;resident++){
            listOfPromises.push(fetch(planetResidents[resident]).then(response => response.json()));
        }Promise.all(listOfPromises).then(function (residents) {
            dom.createModalTable(planetResidents.length, residents, planet['name']);
        })
    },
    downloadVotingStatistic:function () {
        dataHandler.getVotingStatistic(function (planetAndVotes) {
            dom.createStatisticTable(planetAndVotes);
        })
    },
    addListenerToVotingStatisticButton:function () {
        document.getElementById("voting").addEventListener("click", function () {
            dom.downloadVotingStatistic()
        })
    },
    createMainTable(listOfPlanets){
        const mainTable = document.getElementById("main-table");
        const tableHeaders = [
            'name', 'diameter', 'climate', 'terrain',
            'surface_water', 'population', 'residents', 'vote'
        ];
        dom.createTable(listOfPlanets, mainTable, tableHeaders);
    },
    createStatisticTable:function (planetAndVotes) {
        let modalTable = document.getElementById("modal-table");
        let modalHeaders = ['planet_name', 'votes'];
        dom.cleanTable(document.getElementById('modal-table'));
        $(".modal-title").html('Voting statistic');
        dom.createTable(planetAndVotes, modalTable, modalHeaders, false)
    },
    addListenerToNextPreviousButton:function (nextOrPrevious) {
        let nextButton = document.getElementById(nextOrPrevious);
        nextButton.addEventListener('click', function () {
            dom.changePage(nextOrPrevious);
            animation.tableFadingLeft(nextOrPrevious);
        })
    },
    changePage:function (nextOrPrevious) {
        let url = localStorage.getItem(nextOrPrevious);
        dom.cleanTable(document.getElementById('main-table'));
        dom.loadPage(url);
    },
    loadPage:function (url) {
        dataHandler.getPageWithPlanets(url, function (listOfPlanets, previousPageExists, nextPageExists) {
            console.log(listOfPlanets);
            dom.createMainTable(listOfPlanets);
            dom.addVoteButtons(listOfPlanets);
            dom.addListenerToResidentButton(listOfPlanets);
            dom.addListenerToVotingStatisticButton();
            dom.checkNextPreviousPage(previousPageExists, nextPageExists);
        })
    },
    cleanTable:function (mainTable) {
        while (mainTable.firstChild) {
            mainTable.removeChild(mainTable.firstChild);
        }
    },
    checkNextPreviousPage:function (previousPageExists, nextPageExists) {
        $("#previous").attr('disabled',(previousPageExists === null));
        $("#next").attr('disabled',(nextPageExists === null))
    },
};

