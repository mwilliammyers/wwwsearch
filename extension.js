const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  function genericAppendQuery(url, editor, config) {
    const query = editor.document.getText(editor.selection);
    if (config.get("wwwsearch.prependLanguageId")) {
      return vscode.Uri.parse(`${url}${editor.document.languageId} ${query}`);
    }
    return vscode.Uri.parse(`${url}${query}`);
  }

  function stackoverflowAppendQuery(url, editor, config) {
    const query = editor.document.getText(editor.selection);
    if (config.get("wwwsearch.prependLanguageId")) {
      return vscode.Uri.parse(`${url}[${editor.document.languageId}] ${query}`);
    }
    return vscode.Uri.parse(`${url}${query}`);
  }

  const commands = [
    {
      cmd: "custom",
      getUrl: (e, c) => genericAppendQuery(c.get("wwwsearch.customUrl"), e, c),
    },
    {
      cmd: "duckduckgo",
      getUrl: (e, c) => genericAppendQuery("https://duckduckgo.com/?q=", e, c),
    },
    {
      cmd: "google",
      getUrl: (e, c) =>
        genericAppendQuery("https://google.com/search?q=", e, c),
    },
    {
      cmd: "searchcode",
      getUrl: (e, c) => genericAppendQuery("https://searchcode.com/?q=", e, c),
    },
    {
      cmd: "stackoverflow",
      getUrl: (e, c) =>
        stackoverflowAppendQuery("https://stackoverflow.com/search?q=", e, c),
    },
  ];

  for (const { cmd, getUrl } of commands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(`extension.wwwsearch.${cmd}`, function() {
        const editor = vscode.window.activeTextEditor;
        const config = vscode.workspace.getConfiguration();
        vscode.commands.executeCommand("vscode.open", getUrl(editor, config));
      }),
    );
  }
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
