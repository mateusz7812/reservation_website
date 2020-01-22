import webdriver, {Builder} from "selenium-webdriver";
import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";
import CookieService from "../services/CookieService";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

it('test',async (done)=>{

    jest.setTimeout(30000);
    const By = webdriver.By;
    const browser = new Builder().forBrowser("firefox").build();

    let tokenObject = await AccountService.getTokenForAccount(new AccountModel({"login":"admin", "password": "admin"}));
    expect(tokenObject !== undefined).toBeTruthy();
    // @ts-ignore
    CookieService.addCookie("token", tokenObject.token);

    let accountToDelete = await AccountService.getFiltered(new AccountModel({"login": "user"}));
    if(accountToDelete?.length === 1){
        // @ts-ignore
        AccountService.deleteById(accountToDelete[0].id);
    }

    // open /login
    browser.get("http://localhost:3000")
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/login"))

    // click register button
        .then(()=> browser.findElement(By.css("#registerButton")))
        .then((button)=>button.click())

    // check if /register
        .then(()=>sleep(1000))
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/register"))

    // fill register form and click register button
        .then(()=> browser.findElement(By.css("#loginInput")))
        .then((element)=>element.sendKeys("user"))
        .then(()=> browser.findElement(By.css("#passwordInput")))
        .then((element)=>element.sendKeys("password"))
        .then(()=> browser.findElement(By.css("#addButton")))
        .then((element)=>element.click())

    // check if /login
        .then(()=> sleep(1000))
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/login"))

    // fill login form and click login button
        .then(()=> browser.findElement(By.css("#loginInput")))
        .then((element)=>element.sendKeys("user"))
        .then(()=> browser.findElement(By.css("#passwordInput")))
        .then((element)=>element.sendKeys("password"))
        .then(()=> browser.findElement(By.css("#loginButton")))
        .then((element)=>element.click())

    // check if cookie token exist
        .then(()=>browser.manage().getCookie("token"))
        .then((cookie)=>expect(cookie !== undefined).toBeTruthy())

    // check if /
        .then(()=> sleep(1000))
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/"))

    // check if events list exist
        .then(()=> sleep(3000))
        .then(()=> browser.findElement(By.css("#eventsList")))
        .then((eventsList)=> eventsList.findElements(By.css(".eventView")))

    // click event view
        .then((eventViews)=>eventViews.pop()?.click())

    // check if /event/:id
        .then(()=> sleep(1000))
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/event/"))

    // check if reservables table exist
        .then(()=> browser.findElement(By.css("#reservationManager")))

    // check if selected list exist
        .then(()=> browser.findElement(By.css("#selectedReservablesList")))

    // click one seat in reservables table
        .then(()=> browser.findElements(By.css(".seatView")))
        .then((seatViews)=> seatViews[0])
        .then((seatView)=> seatView.click())

    // check if seat is in selected list
        .then(()=> browser.findElement(By.css("#selectedReservablesList")))
        .then((selectedList)=> selectedList.findElements(By.css(".seatLabel")))
        .then((seatViews)=> expect(seatViews).toHaveLength(1))

    // click reserve button
        .then(()=> browser.findElement(By.css("#reserveButton")))
        .then((reserveButton)=> reserveButton.click())

    // check if /reserve_successful
        .then(()=> sleep(100))
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/adding/reservation"))

    // check if reservationView exist
        .then(()=> browser.findElement(By.css(".seatLabel")))

        .then(()=>done())
        .finally(()=>browser.close())

});
/*
it('admin test',async (done)=> {
    jest.setTimeout(30000);
    const By = webdriver.By;
    const Keys = webdriver.Key;
    const browser = new Builder().forBrowser("firefox").build();

    // open /login
    browser.get("http://localhost:3000")
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/login"))

    // login
        .then(()=> browser.findElement(By.css("#loginInput")))
        .then((element)=>element.sendKeys("user"))
        .then(()=> browser.findElement(By.css("#passwordInput")))
        .then((element)=>element.sendKeys("password"))
        .then(()=> browser.findElement(By.css("#loginButton")))
        .then((element)=>element.click())

    // check if /admin
        .then(()=> sleep(1000))
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/admin"))

    // check if all menu sections exists
        .then(()=> browser.findElement(By.css("#eventsButton")))
        .then(()=> browser.findElement(By.css("#reservablesButton")))
        .then(()=> browser.findElement(By.css("#accountsButton")))
        .then(()=> browser.findElement(By.css("#reservationsButton")))

    // go to /admin/event
        .then(()=> browser.findElement(By.css("#eventsButton")))
        .then((element)=>element.click())

    // check if /admin/event
        .then(()=> sleep(1000))
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/admin/event"))

    // click add button
        .then(()=> browser.findElement(By.css("#addButton")))
        .then((element)=>element.click())

    // check if /admin/event/add
        .then(()=> sleep(1000))
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/admin/event/add"))

    // add one
        .then(()=> browser.findElement(By.css("#nameInput")))
        .then((element)=>element.sendKeys("event1"))
        .then(()=> browser.findElement(By.css("#startDateInput")))
        .then((element)=>{element.sendKeys("01012020"); return element;})
        .then((element)=>{element.sendKeys(Keys.TAB); return element;})
        .then((element)=>element.sendKeys("0245PM"))

    // check if added

    // go to /admin/reservable

    // click add button

    // add one

    // check if added

    // go to /admin/account

    // click add button

    // add two

    // check if added

    // go to /admin/reservations
        .then(()=> browser.findElement(By.css("#reservationsButton")))
        .then((element)=>element.click())

    // click add button
        .then(()=> browser.findElement(By.css("#addButton")))
        .then((element)=>element.click())

    // check if /admin/event/add
        .then(()=> sleep(1000))
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/admin/reservations/add"))

    // add one

    // check if added

    // edit added reservations

    // check if edited

    // delete added reservations

    // check if deleted

    // go to /admin/account

    // delete added reservables

    // check if deleted

    // go to /admin/reservable

    // delete added reservable

    // check if deleted

    // go to /admin/event

    // delete added event

    // check if deleted

});
*/