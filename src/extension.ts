import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "grep.searchSelected",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active text editor");
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      // Check for empty or whitespace-only selection
      if (!text || !text.trim()) {
        vscode.window.showWarningMessage("Please select some code to search");
        return;
      }

      // Check if selection is too large (maybe > 500 characters?)
      if (text.length > 500) {
        const proceed = await vscode.window.showWarningMessage(
          "Selected text is quite long. Search anyway?",
          "Yes",
          "No"
        );
        if (proceed !== "Yes") {
          return;
        }
      }

      try {
        const encodedText = encodeURIComponent(text);
        const url = `https://grep.app/search?q=${encodedText}`;

        await vscode.env.openExternal(vscode.Uri.parse(url));
        // Show a subtle message that doesn't require interaction
        vscode.window.setStatusBarMessage("Opening grep.app search...", 3000);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to open grep.app: ${error}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
