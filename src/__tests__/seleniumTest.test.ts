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

    let token = await AccountService.getTokenForAccount(new AccountModel({"login":"admin", "password": "admin"}));
    expect(token !== undefined).toBeTruthy();
    CookieService.addCookie("token", token as string);

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
        .then(()=> browser.findElement(By.css("#registerButton")))
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
        .then((eventsList)=> eventsList.findElement(By.css(".eventView")))

    // click event view
        .then((eventView)=>eventView.click())

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
        .then((selectedList)=> selectedList.findElements(By.css(".seatView")))
        .then((seatViews)=> expect(seatViews).toHaveLength(1))

    // click reserve button
        .then(()=> browser.findElement(By.css("#reserveButton")))
        .then((reserveButton)=> reserveButton.click())

    // check if /reserve_successful
        .then(()=> sleep(1000))
        .then(()=> browser.getCurrentUrl())
        .then((currentUrl)=> expect(currentUrl).toContain("/reserve_successful"))

    // check if reservationView exist
        .then(()=> browser.findElement(By.css(".seatView")))

        .then(()=>done())
        .finally(()=>browser.close())


});