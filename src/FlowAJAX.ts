declare const manywho: any;

export default class FlowAJAX {
    public static async getValue(flowKey: string, valueName: string): Promise<any> {
        let results: any;
        let stateId: string = manywho.utils.extractStateId(flowKey);
        let tenantId = manywho.utils.extractTenantId(flowKey);
        const request: RequestInit = {};
        const token: string = manywho.state.getAuthenticationToken(flowKey);

        request.method = "GET";  
        request.headers = {
            "Content-Type": "application/json",
            "ManyWhoTenant": tenantId
        };
        if(token) {
            request.headers.Authorization = token;
        }
        request.credentials= "same-origin";

        let url: string = window.location.origin || 'https://flow.manywho.com';
        url += "/api/run/1/state/" + stateId + "/values/name/" + valueName;
        
 
        let response = await fetch(url, request);
         if(response.status === 200) {
            results = await response.json();
        }
        else {
            //error
            const errorText = await response.text();
            console.log("Fetch Failed - " + errorText);
            
        }

        return results;
    }
}