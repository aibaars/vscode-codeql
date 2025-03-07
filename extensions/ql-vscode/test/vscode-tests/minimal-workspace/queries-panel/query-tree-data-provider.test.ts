import { EventEmitter } from "vscode";
import {
  FileTreeDirectory,
  FileTreeLeaf,
} from "../../../../src/common/file-tree-nodes";
import {
  QueryDiscoverer,
  QueryTreeDataProvider,
} from "../../../../src/queries-panel/query-tree-data-provider";

describe("QueryTreeDataProvider", () => {
  describe("getChildren", () => {
    it("returns no children when queries is undefined", async () => {
      const dataProvider = new QueryTreeDataProvider({
        queries: undefined,
        onDidChangeQueries: jest.fn(),
      });

      expect(dataProvider.getChildren()).toEqual([]);
    });

    it("returns no children when there are no queries", async () => {
      const dataProvider = new QueryTreeDataProvider({
        queries: [],
        onDidChangeQueries: jest.fn(),
      });

      expect(dataProvider.getChildren()).toEqual([]);
    });

    it("converts FileTreeNode to QueryTreeViewItem", async () => {
      const dataProvider = new QueryTreeDataProvider({
        queries: [
          new FileTreeDirectory("dir1", "dir1", [
            new FileTreeDirectory("dir1/dir2", "dir2", [
              new FileTreeLeaf("dir1/dir2/file1", "file1"),
              new FileTreeLeaf("dir1/dir2/file1", "file2"),
            ]),
          ]),
          new FileTreeDirectory("dir3", "dir3", [
            new FileTreeLeaf("dir3/file3", "file3"),
          ]),
        ],
        onDidChangeQueries: jest.fn(),
      });

      expect(dataProvider.getChildren().length).toEqual(2);

      expect(dataProvider.getChildren()[0].label).toEqual("dir1");
      expect(dataProvider.getChildren()[0].children.length).toEqual(1);
      expect(dataProvider.getChildren()[0].children[0].label).toEqual("dir2");
      expect(dataProvider.getChildren()[0].children[0].children.length).toEqual(
        2,
      );
      expect(
        dataProvider.getChildren()[0].children[0].children[0].label,
      ).toEqual("file1");
      expect(
        dataProvider.getChildren()[0].children[0].children[1].label,
      ).toEqual("file2");

      expect(dataProvider.getChildren()[1].label).toEqual("dir3");
      expect(dataProvider.getChildren()[1].children.length).toEqual(1);
      expect(dataProvider.getChildren()[1].children[0].label).toEqual("file3");
    });
  });

  describe("onDidChangeQueries", () => {
    it("should update tree when the queries change", async () => {
      const onDidChangeQueriesEmitter = new EventEmitter<void>();
      const queryDiscoverer: QueryDiscoverer = {
        queries: [
          new FileTreeDirectory("dir1", "dir1", [
            new FileTreeLeaf("dir1/file1", "file1"),
          ]),
        ],
        onDidChangeQueries: onDidChangeQueriesEmitter.event,
      };

      const dataProvider = new QueryTreeDataProvider(queryDiscoverer);
      expect(dataProvider.getChildren().length).toEqual(1);

      queryDiscoverer.queries?.push(
        new FileTreeDirectory("dir2", "dir2", [
          new FileTreeLeaf("dir2/file2", "file2"),
        ]),
      );
      onDidChangeQueriesEmitter.fire();

      expect(dataProvider.getChildren().length).toEqual(2);
    });
  });
});
