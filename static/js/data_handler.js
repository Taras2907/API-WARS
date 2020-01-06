export let dataHandler= {
    _data:{},
    _api_get: function (url, callback) {
        fetch(url,{
            method:'GET',
            credentials:"same-origin"
        })
        .then(response => response.json())
        .then(json_response => callback(json_response));
    },
    _api_post:function (url, theData, callback) {
        fetch(url,{
            method:'POST',
            credentials:"same-origin",
            body: JSON.stringify(theData),
            contentType: 'application/json;charset=UTF-8',
        })
        .then(response => response.json())
        .then(json_response => callback(json_response));
    },
    getPageWithPlanets:function (url,callback) {
        this._api_get(url, (response)=>{
            localStorage.clear();
            localStorage.setItem('previous', response['previous']);
            localStorage.setItem('next', response['next']);
            callback(response['results'], response['previous'], response['next'])
        })
    },
    writeVoteToDatabase:function (planetId, planetName) {
        this._api_get(`/vote/${planetId}/${planetName}`, (response)=>{
            this._data = response
            })
    },
    getVotingStatistic:function (callback) {
        this._api_get('/get-planet-votes', (response)=>{
            callback(response)
        })
    }

};