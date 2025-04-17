import { validateCaseStage } from "./caseStageValidator.js";

describe("validateCaseStage", () => {
  const validCaseStages = [
    {
      caseStage: "FPL01",
      description: "Level 1",
    },
    {
      caseStage: "FPL10",
      description: "Div pet fee",
    },
  ];

  it("should not return errors when case stage is valid", () => {
    expect(validateCaseStage(validCaseStages, "FPL01")).toEqual({
      list: [],
      messages: {},
    });
  });

  it.each([null, ""])(
    "should return errors when caseStage = %s",
    (caseStage) => {
      expect(validateCaseStage(validCaseStages, caseStage)).toEqual({
        list: [
          {
            href: "#caseStage",
            text: "'Case Stage / Level' not entered",
          },
        ],
        messages: {
          caseStage: {
            text: "'Case Stage / Level' not entered",
          },
        },
      });
    },
  );

  it("should not return errors when case stage is not valid", () => {
    expect(validateCaseStage(validCaseStages, "BLAH")).toEqual({
      list: [
        {
          href: "#caseStage",
          text: "'Case Stage / Level' is not valid",
        },
      ],
      messages: {
        caseStage: {
          text: "'Case Stage / Level' is not valid",
        },
      },
    });
  });
});
