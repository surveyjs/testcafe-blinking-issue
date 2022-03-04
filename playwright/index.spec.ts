import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('https://surveyjs.io/create-survey');
});

test.describe('Drag Drop', () => {
    test('Drag Drop ImagePicker (choices)', async ({ page }) => {
        const json = {
            pages: [
                {
                    name: "page1",
                    elements: [
                        {
                            "type": "imagepicker",
                            "name": "question1",
                            "choices": [
                                {
                                    "value": "lion",
                                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
                                },
                                {
                                    "value": "giraffe",
                                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
                                },
                                {
                                    "value": "panda",
                                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                                },
                                {
                                    "value": "camel",
                                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const result = await page.evaluate((json) => {
            window["creator"].text = JSON.stringify(json);
            return true;
        }, json);

        const expectedValue = "giraffe";
        let value;

        const Question1 = page.locator("[data-name=\"question1\"]");
        const LionItem = page.locator("[data-sv-drop-target-item-value=\"lion\"]");
        const GiraffeItem = page.locator("[data-sv-drop-target-item-value=\"giraffe\"]");
        const PandaItem = page.locator("[data-sv-drop-target-item-value=\"panda\"]");
        const CamelItem = page.locator("[data-sv-drop-target-item-value=\"camel\"]");

        const DragZoneGiraffeItem = GiraffeItem.locator(".svc-image-item-value-controls__drag-area-indicator");
        debugger
        await Question1.click();
        await DragZoneGiraffeItem.dragTo(LionItem);

        value = await page.evaluate((questionName) => {
            const question = window["creator"].survey.getQuestionByName(questionName);
            const choices = question.visibleChoices;
            return choices[0].value;
        }, "question1");

        await expect(value).toEqual(expectedValue);

        //const todoItems = page.locator('.todo-list li');

        // // Create 1st todo.
        // await page.locator('.new-todo').fill(TODO_ITEMS[0]);
        // await page.locator('.new-todo').press('Enter');

        // // Make sure the list only has one todo item.
        // await expect(page.locator('.view label')).toHaveText([
        //     TODO_ITEMS[0]
        // ]);

        // // Create 2nd todo.
        // await page.locator('.new-todo').fill(TODO_ITEMS[1]);
        // await page.locator('.new-todo').press('Enter');

        // // Make sure the list now has two todo items.
        // await expect(page.locator('.view label')).toHaveText([
        //     TODO_ITEMS[0],
        //     TODO_ITEMS[1]
        // ]);

        // await checkNumberOfTodosInLocalStorage(page, 2);
    });
});

// function setJSON(json) {
//     window["creator"].text = JSON.stringify(json);
// };

// const getItemValueByIndex = ClientFunction((questionName, index) => {
//     const question = window["creator"].survey.getQuestionByName(questionName);
//     const choices = question.visibleChoices;
//     return choices[index].value;
// });

async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
    return await page.waitForFunction(e => {
        return JSON.parse(localStorage['react-todos']).length === e;
    }, expected);
}