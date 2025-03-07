import { CodeQLCliServer } from "../codeql-cli/cli";
import { extLogger } from "../common";
import { App, AppMode } from "../common/app";
import { isCanary, showQueriesPanel } from "../config";
import { DisposableObject } from "../pure/disposable-object";
import { QueriesPanel } from "./queries-panel";
import { QueryDiscovery } from "./query-discovery";

export class QueriesModule extends DisposableObject {
  private constructor(readonly app: App) {
    super();
  }

  private initialize(app: App, cliServer: CodeQLCliServer): void {
    if (app.mode === AppMode.Production || !isCanary() || !showQueriesPanel()) {
      // Currently, we only want to expose the new panel when we are in development and canary mode
      // and the developer has enabled the "Show queries panel" flag.
      return;
    }
    void extLogger.log("Initializing queries panel.");

    const queryDiscovery = new QueryDiscovery(app, cliServer);
    this.push(queryDiscovery);
    queryDiscovery.refresh();

    const queriesPanel = new QueriesPanel(queryDiscovery);
    this.push(queriesPanel);
  }

  public static initialize(
    app: App,
    cliServer: CodeQLCliServer,
  ): QueriesModule {
    const queriesModule = new QueriesModule(app);
    app.subscriptions.push(queriesModule);

    queriesModule.initialize(app, cliServer);
    return queriesModule;
  }
}
