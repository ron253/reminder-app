self.addEventListener('push', function(event) {

  const data = event.data.json();

  
 


  const header = {
    'Content-Type': 'application/json',
    'Authorization': data["token"]
  }
  const baseUrl = "https://desktop-reminder.herokuapp.com/reminders";

  let url = new URL(baseUrl);
  params = {"SubscriptionId" : data.subscriptionId};
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  fetch(url, {
    method: "GET", 
    headers:header
  }).then(res=>res.json()).then(res=> {
 
    event.waitUntil(self.registration.showNotification("Reminder", {
      body:res.content
    }));
  })

 
  

});