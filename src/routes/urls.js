// To make it change urls easier during this early stage of the project
const urls = {
    claimStart: "claim-start"
}

export function getUrl(key){
    return urls[key] ? "/" + urls[key] : ""
}
