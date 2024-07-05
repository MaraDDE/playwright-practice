import {test, expect} from '@playwright/test'
import { emit } from 'process'

test.beforeEach(async({page}) =>{
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('locator syntax rules', async({page}) =>{
        // by Tag name
        await page.locator('input').click

        //by ID
        page.locator('#inputEmail1')

        //by Class value
        page.locator('.shape-rectangle')
        
        //by attribute
        page.locator('[placeholder="Email"]')

        //by Class value (full)
        page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition]')

        //combine different select  ors
        page.locator('input[placeholder="Email"][nbinput]')

        //by XPath
        page.locator('//*[@id="inputEmail1"]')
        
        //by partial text match
        page.locator(':text("Using")')

        //by exact text match
        page.locator(':text-is("Using the grid")')
})

test('User facing locators', async ({page}) => {
    await page.getByRole('textbox', {name:  "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTitle('IoT Dashboard').click()

}) 

test('locating child elements', async({page}) =>{
    await page.locator('nb-card nb-radio :text-is("Option 1")').click() //cleaner approach
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click() 

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click() //finding elements by index, try to avoid this approach as much as possible
})

test('locating parent elements', async({page}) =>{
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name:"Email"}).click()

    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name:"Email"}).click()

    await page.locator('nb-card').filter({hasText:"Basic form"}).getByRole('textbox', {name:"Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name:"Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter ({hasText: "Sign in"}).getByRole('textbox', {name:"Email"}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name:"Email"}).click()
})

test('reusing the locators', async({page}) =>{
    const basicForm = page.locator('nb-card').filter({hasText:"Basic form"})
    const emailField = basicForm.getByRole('textbox',{name:"Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')

    // await page.locator('nb-card').filter({hasText:"Basic form"}).getByRole('textbox', {name:"Email"}).fill('test@test.com')
    // await page.locator('nb-card').filter({hasText:"Basic form"}).getByRole('textbox', {name:"Password"}).fill('Welcome123')
    // await page.locator('nb-card').filter({hasText:"Basic form"}).getByRole('button').click()

})

test('extracting values', async({page}) =>{
    //single tesst value
    const basicForm = page.locator('nb-card').filter({hasText:"Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonLabels).toContain("Option 1")

    //input value 
    const emailField = basicForm.getByRole('textbox', {name:"Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    //
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

//assertions

test('assertions', async({page})=>{
    const basicFormButton = page.locator('nb-card').filter({hasText:"Basic form"}).locator('button')
    
    //general assertions, will not wait for conditions
    const value = 5
    expect(value).toEqual(5)

    const  text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //locator assertion, can interacct with web elements and will wait up to 5 seconds
    await expect(basicFormButton).toHaveText("Submit")

    //soft assertion, test will not fail
    // await expect.soft(basicFormButton).toHaveText('submit5')
    await basicFormButton.click()
    }
) 


