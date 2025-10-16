export class CommandExecuter {
    static execute(command, paramsCommand, validCommands) {
    }

    static #changeDirectory(command, paramsCommand) {
        destination = destination.replace('/', '');

        if (destination === '..') {
            let newPwd = [];
            let pwdArray = this.Pwd.split('/')
            pwdArray.forEach(e => { if (e !== '') { newPwd.push(e) } });
            newPwd.pop();
            let pwd = newPwd.join('/');
            destination = '';
        }

        // Recup
        let sCtn = sortedContent();
        let rightDir = (destination !== '')
            ? sCtn.find(e => e instanceof FolderExplorer && e.name == destination)
            : sCtn.find(e => e instanceof FolderExplorer);

        if (rightDir != null) {
            pwd += rightDir.name + '/';
        } else {
            commandReturn.classList.add('error');
            returnText = `${destination}: directory not found`;
        }
    }
}