import { Selector, ClientFunction } from "testcafe";
const title = "Drag Drop";

const url = "https://surveyjs.io/create-survey";

const setJSON = ClientFunction((json) => {
  window["creator"].text = JSON.stringify(json);
});

const getItemValueByIndex = ClientFunction((questionName, index) => {
  const question = window["creator"].survey.getQuestionByName(questionName);
  const choices = question.visibleChoices;
  return choices[index].value;
});

const arr = [];
arr.length = 100;
arr.fill(null);

arr.forEach(
  () => {
    fixture`${title}`.page`${url}`.beforeEach(async (t) => {
      await t.maximizeWindow();
    });

    test("Drag Drop ImagePicker (choices)", async (t) => {
      await t.resizeWindow(2560, 1440);

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
      await setJSON(json);

      const expectedValue = "giraffe";
      let value;

      const Question1 = Selector("[data-name=\"question1\"]");
      const LionItem = Selector("[data-sv-drop-target-item-value=\"lion\"]");
      const GiraffeItem = Selector("[data-sv-drop-target-item-value=\"giraffe\"]");
      const PandaItem = Selector("[data-sv-drop-target-item-value=\"panda\"]");
      const CamelItem = Selector("[data-sv-drop-target-item-value=\"camel\"]");

      const DragZoneGiraffeItem = GiraffeItem.find(".svc-image-item-value-controls__drag-area-indicator").filterVisible();

      await t
        .click(Question1, { speed: 0.5 })
        .hover(PandaItem).hover(LionItem).hover(CamelItem).hover(GiraffeItem).hover(DragZoneGiraffeItem)
        .dragToElement(DragZoneGiraffeItem, LionItem, { speed: 0.5 });
      value = await getItemValueByIndex("question1", 0);
      await t.expect(value).eql(expectedValue);

      await t
        .click(Question1, { speed: 0.5 })
        .hover(PandaItem).hover(LionItem).hover(CamelItem).hover(GiraffeItem).hover(DragZoneGiraffeItem)
        .dragToElement(DragZoneGiraffeItem, PandaItem, { speed: 0.5 });
      value = await getItemValueByIndex("question1", 2);
      await t.expect(value).eql(expectedValue);
    });
  }
);
