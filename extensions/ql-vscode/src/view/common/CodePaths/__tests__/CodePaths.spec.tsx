import * as React from "react";
import { render as reactRender, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodePaths, CodePathsProps } from "../CodePaths";

import { createMockCodeFlows } from "../../../../../test/factories/variant-analysis/shared/CodeFlow";
import { createMockAnalysisMessage } from "../../../../../test/factories/variant-analysis/shared/AnalysisMessage";

describe(CodePaths.name, () => {
  const render = (props?: CodePathsProps) =>
    reactRender(
      <CodePaths
        codeFlows={createMockCodeFlows()}
        ruleDescription="Rule description"
        message={createMockAnalysisMessage()}
        severity="Recommendation"
        {...props}
      />,
    );

  it("renders 'show paths' link", () => {
    render();

    expect(screen.getByText("Show paths")).toBeInTheDocument();
  });

  it("posts extension message when 'show paths' link clicked", async () => {
    render();

    await userEvent.click(screen.getByText("Show paths"));

    expect((window as any).vsCodeApi.postMessage).toHaveBeenCalledWith({
      t: "showDataFlowPaths",
      dataFlowPaths: {
        codeFlows: createMockCodeFlows(),
        ruleDescription: "Rule description",
        message: createMockAnalysisMessage(),
        severity: "Recommendation",
      },
    });
  });
});
